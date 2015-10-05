/* global using */

using("WSE.functions").define("WSE.commands.fn", function (functions) {
    
    "use strict";
    
    function fn (command, interpreter) {
        
        var name, varName, ret;
        
        name = command.getAttribute("name") || null;
        varName = command.getAttribute("tovar") || null;
        
        if (typeof functions[name] !== "function") {
            
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "No name supplied on fn element."
                }
            );
            
            return {
                doNext: true
            };
        }
        
        if (typeof functions[name] !== "function") {
            
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Unknown function '" + name + "'."
                }
            );
            
            return {
                doNext: true
            };
        }

        ret = functions[name](interpreter);

        if (varName !== null)
        {
            interpreter.runVars[varName] = "" + ret;
        }

        return {
            doNext: true
        };
    };
    
    return fn;
    
});