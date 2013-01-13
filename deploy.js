var fs, processScriptsFileFn, concatJsFiles, scriptsFilePath;

fs = require('fs');
scriptsFilePath = 'scripts.json';

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
    
    fn = function (path, i)
    {
        var concFn;
        
        concFn = function (data)
        {
            concatFile += "\n\n" + data;
        };
        
        concFn(fs.readFileSync('./' + path, 'utf-8'));
    };
    
    fileNames.forEach(fn);
    writeFileFn(concatFile);
};

writeFileFn = function (concatFile)
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
    
    fs.writeFile('./releases/current/WebStoryEngine.js', concatFile, errFn);
};

processScriptsFileFn(fs.readFileSync(scriptsFilePath, 'utf-8'));