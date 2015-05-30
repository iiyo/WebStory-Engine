/* global MO5 */

MO5().define("WSE.commands.set_vars", function () {
    
    "use strict";
    
    function setVars (command, interpreter) {
        
        var container = interpreter.runVars, keys, values;
        
        keys = (command.getAttribute("names") || "").split(",");
        values = (command.getAttribute("values") || "").split(",");
        
        if (keys.length !== values.length) {
            
            interpreter.bus.trigger("wse.interpreter.error", {
                message: "Number of names does not match number of values in <set_vars> command."
            });
            
            return {
                doNext: true
            };
        }
        
        keys.forEach(function (key, i) {
            container[key.trim()] = "" + values[i].trim();
        });
        
        return {
            doNext: true
        };
    }
    
    return setVars;
    
});