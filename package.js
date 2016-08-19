/* global require, console */
/* eslint no-console: off */

var fs = require("fs");
var normalizePath = require("path").normalize;
var info = JSON.parse("" + fs.readFileSync("package.json"));
var source = normalizePath("export/");
var destination = normalizePath('packages/');
var destinationFile = normalizePath(destination + "/WebStory-Engine-v" + info.version + ".zip");
var archiver = require('archiver');
var archive = archiver('zip');

mkdirSync(destination);

var output = fs.createWriteStream(destinationFile);

archive.pipe(output);

archive.bulk([{
    src: ['**/*'],
    cwd: source,
    expand: true
}]);

archive.finalize(function(err) {
    
    if (err) {
        throw err;
    }
    
    console.log('Created ZIP file in packages/.');
    
});

function mkdirSync (path) {
    try {
        fs.mkdirSync(path);
    }
    catch (e) {
        if (e.code != 'EEXIST') {
            throw e;
        }
    }
}
