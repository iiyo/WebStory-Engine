/* global require, console */

var fs, mkdirSync, processScriptsFileFn, concatJsFiles, scriptsFilePath;

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

concatJsFiles = function (fileNames)
{
    var fn, concatFile, len;
    
    concatFile = ''; 
    len = fileNames.length;
    
    fn = function (path)
    {
        var concFn;
        
        concFn = function (data)
        {
            concatFile += "\n\n" + removeUnwantedSections(data);
        };
        
        concFn(fs.readFileSync('./' + path, 'utf-8'));
    };
    
    fileNames.forEach(fn);
    writeFileFn(concatFile);
};

function writeFileFn (concatFile)
{
    var errFn;
    
    errFn = function (err)
    {
        if (err)
        {
            console.log(err);
            return;
        }
        
        console.log('WebStory Engine file created.');
    };
    
    mkdirSync('./bin');
    fs.writeFile('./bin/WebStoryEngine.js', concatFile, errFn);
}

function removeUnwantedSections (fileContents) {
    
    fileContents = fileContents.replace(/\/\*<ON_DEPLOY_REMOVE>\*\/[\s\S]*\/\*<\/ON_DEPLOY_REMOVE>\*\//g, "");
    
    return fileContents;
}

processScriptsFileFn(fs.readFileSync(scriptsFilePath, 'utf-8'));