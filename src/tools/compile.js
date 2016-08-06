//
// A module containing functions for compiling a simple command language to the old
// WSE command elements.
//

/* global using */

using("xmugly").define("WSE.tools.compile", function (xmugly) {
    
//
// Compiles the new WSE command language to XML elements.
//
    function  compile (text) {
        
        text = xmugly.compile(text, [
            {
                identifier: "@",
                attribute: "asset",
                value: "_"
            },
            {
                identifier: ":",
                attribute: "duration",
                value: "_"
            },
            {
                identifier: "+",
                attribute: "_",
                value: "yes"
            },
            {
                identifier: "-",
                attribute: "_",
                value: "no"
            },
            {
                identifier: "#",
                attribute: "id",
                value: "_"
            },
            {
                identifier: "~",
                attribute: "name",
                value: "_"
            }
        ]);
        
        text = compileSpeech(text);
        
        return text;
    }
    
    return {
        compile: compile
    };
    
    
//
// Compiles "(( c: I say something ))" to <line s="c">I say something</line>''.
//
    function compileSpeech (text) {
        return text.replace(
            /([\s]*)\(\([\s]*([a-zA-Z0-9_-]+):[\s]*((.|[\s])*?)([\s]*)\)\)/g,
            '$1<line s="$2">$3</line>$5'
        );
    }
    
});
