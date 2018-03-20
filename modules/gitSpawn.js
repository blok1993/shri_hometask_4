let express = require('express');
let router = express.Router();
let path = require('path');
let config = require('../config');

const spawn = require('child_process').spawn;

const gitSpawn = command => (
    new Promise((resolve, reject) => {
        const thread = spawn('git', command, { cwd: config.get("repoPath"), stdio: ['inherit', 'pipe', 'pipe'] });
        const stdOut = [];
        const stdErr = [];

        thread.stdout.on('data', (data) => {
            stdOut.push(data.toString('utf8'));
        });

        thread.stderr.on('data', (data) => {
            stdErr.push(data.toString('utf8'));
        });

        thread.on('close', () => {
            if (stdErr.length) {
                reject(stdErr.join(''));
                return;
            }

            resolve(stdOut.join());
        });
    })
);

module.exports = gitSpawn;