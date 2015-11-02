/* global using */

using("WSE.functions", "WSE.tools::warn").
define("WSE.commands.fn", function (functions, warn) {
    
    "use strict";
    
    function fn (command, interpreter) {
        
        var name, varName, ret, props = command.properties;
        
        name = props.name || null;
        varName = props.tovar || null;
        
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