/* global MO5 */

MO5().define("WSE.commands.trigger", function () {
    
    "use strict";
    
    function trigger (command, interpreter) {
        
        var triggerName, action;
        
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
            
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "No name specified on trigger command."
                }
            );
            
            return {
                doNext: true
            };
        }
        
        if (action === null) {
            
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "No action specified on trigger command " +
                        "referencing trigger '" + triggerName + "'."
                }
            );
            
            return {
                doNext: true
            };
        }
        
        if (
            typeof interpreter.triggers[triggerName] === "undefined" ||
            interpreter.triggers[triggerName] === null
        ) {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Reference to unknown trigger '" + triggerName + "'."
                }
            );
            
            return {
                doNext: true
            };
        }
        
        if (typeof interpreter.triggers[triggerName][action] !== "function") {
            
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Unknown action '" + action + "' on trigger command referencing trigger '" + triggerName + "'."
                }
            );
            
            return {
                doNext: true
            };
        }
        
        interpreter.triggers[triggerName][action](command);
        
        return {
            doNext: true
        };
    }
    
    return trigger;
     
});