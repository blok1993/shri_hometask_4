let express = require('express');
let path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let config = require('./config');

let index = require('./routes/index');
let fileContent = require('./modules/fileContent');
let commitFileTree = require('./modules/commitFileTree');

let app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', config.get('port'));
app.set('host', config.get('host'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/fileContent', fileContent);
app.use('/commitFileTree', commitFileTree);

app.use((req, res, next) => {
    let err = new Error('Not Found');
err.status = 404;
next(err);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
res.locals.error = req.app.get('env') === 'development' ? err : {};

res.status(err.status || 500);
res.render('error');
});

app.listen(app.get('port'), () => console.log('Express app listening on ' + app.get('host') + ':' + app.get('port')));

module.exports = app;
