/* global using */

using("WSE.tools::warn").define("WSE.commands.trigger", function (warn) {
    
    "use strict";
    
    function trigger (command, interpreter) {
        
        var triggerName, action, next;
        
        next = {doNext: true};
        
        interpreter.bus.trigger(
            "wse.interpreter.commands.trigger",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );
        
        triggerName = command.getAttribute("name") || null;
        action = command.getAttribute("action") || null;
        
        if (triggerName === null) {
            warn(interpreter.bus, "No name specified on trigger command.", command);
            return next;
        }
        
        if (action === null) {
            warn(interpreter.bus, "No action specified on trigger command " +
                "referencing trigger '" + triggerName + "'.", command);
            return next;
        }
        
        if (
            typeof interpreter.triggers[triggerName] === "undefined" ||
            interpreter.triggers[triggerName] === null
        ) {
            warn(interpreter.bus, "Reference to unknown trigger '" + triggerName + "'.", command);
            return next;
        }
        
        if (typeof interpreter.triggers[triggerName][action] !== "function") {
            warn(interpreter.bus, "Unknown action '" + action +
                "' on trigger command referencing trigger '" + triggerName + "'.", command);
            return next;
        }
        
        interpreter.triggers[triggerName][action](command);
        
        return next;
    }
    
    return trigger;
     
});