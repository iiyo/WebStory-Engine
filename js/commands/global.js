/* global using */

using("WSE.tools::warn").define("WSE.commands.global", function (warn) {
    
    "use strict";
    
    function global (command, interpreter) {
        
        var name, value, next, props = command.properties;
        
        name = props.name || null;
        value = props.value || null;
        next = {doNext: true};
        
        if (name === null) {
            warn(interpreter.bus, "No name defined on element 'global'.", command);
            return next
        }
        
        if (value === null) {
            warn(interpreter.bus, "No value defined on element 'global'.", command);
            return next;
        }
        
        interpreter.globalVars.set(name, value);
        
        return next;
    };
    
    return global;
    
});