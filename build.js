/* eslint no-console: off */

var fs = require("fs");
var copy = require("ncp").ncp;
var browserify = require("browserify");
var normalizePath = require("path").normalize;

var indexFile = normalizePath("index.js");
var outputFile = normalizePath("build/WebStoryEngine.js");

mkdirSync('./build');
mkdirSync('./export');
mkdirSync('./export/engine');

var info = JSON.parse("" + fs.readFileSync("package.json"));
var bundle = browserify({debug: true}).
    add(indexFile).
    //transform({global: true}, "uglifyify").
    bundle();

bundle.on("end", done).
    pipe(fs.createWriteStream(outputFile)).
    write(
        "/*\n" +
        "    WebStory Engine (v" + info.version + ")\n" +
        "    Build time: " + (new Date().toUTCString()) + 
        "\n*/\n"
    );

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

function done (error) {
    
    var content;
    
    if (error) {
        console.error(error);
        return;
    }
    
    /*
    content = "" + fs.readFileSync(outputFile);
    content = content.split("%%%version%%%").join(info.version);
    
    fs.writeFileSync(outputFile, content);
    */
    
    console.log("WebStory Engine v" + info.version + " built and written to: " + outputFile);
    
    exportFiles();
}

function exportFiles () {
    copy("./build", "./export/engine", function () {
        copy("./story", "./export", function () {
            console.log("Exported WebStory Engine skeleton to export folder.");
        });
    });
}
