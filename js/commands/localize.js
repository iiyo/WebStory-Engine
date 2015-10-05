/* global using */

using().define("WSE.commands.localize", function () {
    
    "use strict";
    
    function localize (command, interpreter) {
        
        var key;
        
        key = command.getAttribute("name") || null;
        
        if (key === null) {
            
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "No variable name defined on localize element."
                }
            );
            
            return {
                doNext: true
            };
        }
        
        if (!interpreter.globalVars.has(key)) {
            
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Undefined global variable."
                }
            );
            
            return {
                doNext: true
            };
        }
        
        interpreter.runVars[key] = interpreter.globalVars.get(key);
        
        return {
            doNext: true
        };
    }
    
    return localize;
    
});