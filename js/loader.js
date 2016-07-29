/* global using */

using("easy-ajax", "WSE.tools.compile::compile").
define("WSE.loader", function (ajax, compile) {
    
    function generateGameFile (mainFilePath, then) {
        compileFile(mainFilePath, function (mainFile) {
            generateGameFileFromString(mainFile, then);
        });
    }
    
    function generateGameFileFromString (text, then) {
        
        var gameDocument = parseXml(text);
        var fileDefinitions = getFileDefinitions(gameDocument);
        
        compileFiles(fileDefinitions, function (files) {
            files.forEach(function (file, i) {
                
                var type = fileDefinitions[i].type;
                var parent = gameDocument.getElementsByTagName(type)[0];
                
                if (!parent) {
                    parent = gameDocument.createElement(type);
                    gameDocument.documentElement.appendChild(parent);
                }
                
                parent.innerHTML += "\n" + file + "\n";
            });
            
            then(gameDocument);
        });
    }
    
    function generateFromString (text, then) {
        generateGameFileFromString(compile(text), then);
    }
    
    function compileFiles (fileDefinitions, then) {
        
        var loaded = 0;
        var count = fileDefinitions.length;
        var files = [];
        
        fileDefinitions.forEach(function (definition, i) {
            
            compileFile(definition.url, function (file) {
                
                files[i] = file;
                loaded += 1;
                
                if (loaded >= count) {
                    then(files);
                }
            });
        });
    }
    
    function compileFile (path, then) {
        ajax.get(path, function (error, obj) {
            
            if (error) {
                console.error(error);
                return;
            }
            
            then(compile(obj.responseText));
        });
    }
    
    function parseXml (text) {
        return new DOMParser().parseFromString(text, "application/xml");
    }
    
    function getFileDefinitions (xml) {
        
        var elements = xml.getElementsByTagName("file");
        
        return [].map.call(elements, function (element) {
            return {
                type: element.getAttribute("type"),
                url: element.getAttribute("url")
            };
        });
    }
    
    return {
        generateGameFile: generateGameFile,
        generateFromString: generateFromString
    };
    
});
