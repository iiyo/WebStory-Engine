/* global using */

using("WSE.tools::logError").define("WSE.commands.set_vars", function (logError) {
    
    "use strict";
    
    function setVars (command, interpreter) {
        
        var container = interpreter.runVars, keys, values, next;
        
        next = {doNext: true};
        keys = (command.getAttribute("names") || "").split(",");
        values = (command.getAttribute("values") || "").split(",");
        
        if (keys.length !== values.length) {
            logError(interpreter.bus, "Number of names does not match number of values " +
                "in <set_vars> command.");
            return next;
        }
        
        keys.forEach(function (key, i) {
            container[key.trim()] = "" + values[i].trim();
        });
        
        return next;
    }
    
    return setVars;
    
});