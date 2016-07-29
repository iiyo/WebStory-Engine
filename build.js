/* global require, console */

var processScriptsFileFn, concatJsFiles, scriptsFilePath;
var browserify = require("browserify");
var fs = require("fs");
var os = require("os");
var normalizePath = require("path").normalize;
var minify = require("minify");
var copy = require("ncp").ncp;

mkdirSync('./build');
mkdirSync('./export');
mkdirSync('./export/engine');

var dependencyFilePath = normalizePath(os.tmpdir() + "/WebStoryEngine_dependencies.js");
var dependencyFile = fs.createWriteStream(dependencyFilePath);
var bundle = browserify("browserifyToUsing.js").bundle();
var info = JSON.parse("" + fs.readFileSync("package.json"));

scriptsFilePath = 'scripts.json';

dependencyFile.write(
    "/*\n" +
    "    WebStory Engine dependencies (v" + info.version + ")\n" +
    "    Build time: " + (new Date().toUTCString()) + 
    "\n*/\n"
);

bundle.pipe(dependencyFile);


function mkdirSync (path)
{
    try
    {
        fs.mkdirSync(path);
    }
    catch (e)
    {
        if (e.code != 'EEXIST') {
            throw e;
        }
    }
}

processScriptsFileFn = function (data)
{
    var json;
    
    try
    {
        json = JSON.parse(data);
    }
    catch (e)
    {
        console.log('Parsing file ' + scriptsFilePath + ' as JSON failed!');
        console.log('Error was:' + e);
        
        return;
    }
    
    concatJsFiles(json.files);
};

concatJsFiles = function (files)
{
    var fn, concatFile, moduleName, moduleString;
    
    moduleString = '';
    concatFile = ''; 
    
    fn = function (path)
    {
        var concFn;
        
        concFn = function (data)
        {
            concatFile += "\n\n" + removeUnwantedSections(data);
        };
        
        concFn(fs.readFileSync(normalizePath(path), 'utf-8'));
    };
    
    moduleString += "\n\nvar $__WSEScripts = document.getElementsByTagName('script');";
    moduleString += "\nWSEPath = $__WSEScripts[$__WSEScripts.length - 1].src;\n";
    
    for (moduleName in files) {
        moduleString += "\nusing.modules['" + moduleName + "'] = WSEPath;";
    }
    
    fn("libs/MO5/libs/using.js/using.js");
    fn(dependencyFilePath);
    fn("libs/MO5/js/MO5.js");
    
    concatFile += moduleString;
    
    for (moduleName in files) {
        fn(files[moduleName]);
    }
    
    
    writeFileFn(concatFile);
};

function writeFileFn (concatFile)
{
    function makeErrorFn (successText) {
        return function (err)
        {
            if (err)
            {
                console.log(err);
                return;
            }
            
            console.log(successText);
        };
    }
    
    fs.writeFileSync('./build/WebStoryEngine.js', concatFile);
    makeErrorFn('WebStory Engine file created.')();
    
    minify('./build/WebStoryEngine.js', function(error, data) {
        if (error) {
            console.log(error);
        }
        else {
            fs.writeFile('./build/WebStoryEngine.min.js', data, makeExport);
        }
    });
    
    function makeExport (err) {
        makeErrorFn("Minified WebStory Engine file created.")(err);
        copy("./build", "./export/engine", function () {
            copy("./story", "./export", function () {
                console.log("Exported WebStory Engine skeleton to export folder.");
            });
        });
    }
}

function removeUnwantedSections (fileContents) {
    
    fileContents = fileContents.replace(
        /\/\*<ON_DEPLOY_REMOVE>\*\/[\s\S]*\/\*<\/ON_DEPLOY_REMOVE>\*\//g,
        ""
    );
    
    fileContents = fileContents.replace(/%%%version%%%/g, info.version);
    
    return fileContents;
}

setTimeout(function () {
    processScriptsFileFn(fs.readFileSync(scriptsFilePath, 'utf-8'));
}, 2000);
