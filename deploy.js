/* global require, console */

var fs, mkdirSync, processScriptsFileFn, concatJsFiles, scriptsFilePath;
var minify = require("minify");

fs = require('fs');
scriptsFilePath = 'scripts.json';

mkdirSync = function (path)
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
};

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
        
        concFn(fs.readFileSync('./' + path, 'utf-8'));
    };
    
    moduleString += "\n\nvar $__WSEScripts = document.getElementsByTagName('script');";
    moduleString += "\nWSEPath = $__WSEScripts[$__WSEScripts.length - 1].src;\n";
    
    for (moduleName in files) {
        moduleString += "\nusing.modules['" + moduleName + "'] = WSEPath;";
    }
    
    fn("libs/MO5/libs/using.js/using.js");
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
    
    mkdirSync('./bin');
    fs.writeFileSync('./bin/WebStoryEngine.js', concatFile);
    makeErrorFn('WebStory Engine file created.')();
    
    minify('./bin/WebStoryEngine.js', function(error, data) {
        if (error) {
            console.log(error);
        }
        else {
            fs.writeFile('./bin/WebStoryEngine.min.js', data, 
                makeErrorFn("Minified WebStory Engine file created."));
        }
    });
}

function removeUnwantedSections (fileContents) {
    
    fileContents = fileContents.replace(/\/\*<ON_DEPLOY_REMOVE>\*\/[\s\S]*\/\*<\/ON_DEPLOY_REMOVE>\*\//g, "");
    
    return fileContents;
}

processScriptsFileFn(fs.readFileSync(scriptsFilePath, 'utf-8'));