//
// A module containing functions for compiling a simple command language to the old
// WSE command elements.
//

/* global using */

using().define("WSE.tools.compile", function () {
    
//
// Compiles the new WSE command language to XML elements.
//
    function  compile (text) {
        
        text = compileSpeech(text);
        
        console.log(text);
        
        return text;
    }
    
//
// Goes through all the scenes in a WebStory DOM and replaces
// each one's content with the output of the compile() function.
//
    function compileXmlScenes (ws) {
        [].forEach.call(ws.getElementsByTagName("scene"), function (scene) {
            scene.innerHTML = compile(scene.innerHTML);
        });
    }
    
    return {
        compile: compile,
        compileXmlScenes: compileXmlScenes
    };
    
    
    function compileSpeech (text) {
        return text.replace(
            /([\s]*)\(\([\s]*([a-zA-Z0-9_-]+):[\s]*((.|[\s])*?)([\s]*)\)\)/g,
            '$1<line s="$2">$3</line>$5'
        );
    }
    
    
});
