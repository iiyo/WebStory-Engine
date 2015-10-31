/* global using */

using("WSE.functions", "WSE.tools::warn").define("WSE.commands.fn", function (functions, warn) {
    
    "use strict";
    
    function fn (command, interpreter) {
        
        var name, varName, ret;
        
        name = command.getAttribute("name") || null;
        varName = command.getAttribute("tovar") || null;
        
        if (typeof functions[name] !== "function") {
            warn(interpreter.bus, "No name supplied on fn element.", command);
            return {
                doNext: true
            };
        }
        
        if (typeof functions[name] !== "function") {
            warn(interpreter.bus, "Unknown function '" + name + "'.", command);
            return {
                doNext: true
            };
        }
        
        ret = functions[name](interpreter);
        
        if (varName !== null){
            interpreter.runVars[varName] = "" + ret;
        }
        
        return {
            doNext: true
        };
    };
    
    return fn;
    
});