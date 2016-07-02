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
        text = compileElements(text);
        
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
    
//
// Compiles '# some_element attr1 val1, attr2 val2' to
// '<some_element attr1="val1", attr2="val2" />';
//
    function compileElements (text) {
        
        var lines = toLines(text).map(function (line) {
            
            var name, attributes, parts, trimmed, head, whitespace, strings, result;
            
            trimmed = line.trim();
            
            if (trimmed[0] !== "#") {
                return line;
            }
            
            strings = [];
            whitespace = line.replace(/^([\s]+).*$/, "$1");
            
            trimmed = trimmed.replace(/"([^"]+)"/g, function (match, p1) {
                
                strings.push(p1);
                
                return "{{" + strings.length + "}}";
            });
            
            parts = trimmed.split(",");
            head = parts[0].split(" ");
            
            head.shift();
            
            name = head[0];
            
            head.shift();
            
            parts[0] = head.join(" ");
            
            attributes = [];
            
            parts.forEach(function (current) {
                
                var split, name, value;
                
                split = current.trim().replace(/[\s]+/g, " ").split(" ");
                
                name = split[0].trim();
                
                if (!name) {
                    return;
                }
                
                if (name[0] === "@") {
                    value = name.replace("@", "");
                    name = "asset";
                }
                else {
                    
                    split.shift();
                    
                    value = split.join(" ");
                }
                
                attributes.push(name + '="' + value + '"');
            });
            
            result = whitespace + '<' + name + ' ' + attributes.join(" ") +  ' />';
            
            strings.forEach(function (value, i) {
                result = result.replace("{{" + (i + 1) + "}}", value);
            });
            
            return result;
            
        });
        
        return toText(lines);
    }
    
//
// Compiles "(( c: I say something ))" to <line s="c">I say something</line>''.
//
    function compileSpeech (text) {
        return text.replace(
            /([\s]*)\(\([\s]*([a-zA-Z0-9_-]+):[\s]*((.|[\s])*?)([\s]*)\)\)/g,
            '$1<line s="$2">$3</line>$5'
        );
    }
    
    function toLines (text) {
        return text.split("\n");
    }
    
    function toText (lines) {
        return lines.join("\n");
    }
    
});
