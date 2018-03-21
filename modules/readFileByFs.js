let fs = require('fs');

const readFileByFs = (req, res) => {
    //Убираем первый слэш /
    let file = req.params[0].charAt(0) === "/" ? req.params[0].slice(1) : req.params[0];

    try {
        let data = fs.readFileSync(file, 'utf8');
        res.render('fileContent', { fileContent: data });
    } catch(e) {
        console.log('Ошибка при прочтении файла.');
    }
};

module.exports = readFileByFs;