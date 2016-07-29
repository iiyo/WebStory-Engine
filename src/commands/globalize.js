/* global using */

using("WSE.tools::warn").define("WSE.commands.globalize", function (warn) {
    
    "use strict";
    
    function globalize (command, interpreter) {
        
        var key, next;
        
        key = command.getAttribute("name") || null;
        next = {doNext: true};
        
        if (key === null) {
            warn(interpreter.bus, "No variable name defined on globalize element.", command);
            return next;
        }
        
        if (typeof interpreter.runVars[key] === "undefined" || interpreter.runVars[key] === null) {
            warn(interpreter.bus, "Undefined local variable.", command);
            return next;
        }
        
        interpreter.globalVars.set(key, interpreter.runVars[key]);
        
        return next;
    }
    
    return globalize;
    
});