/* global using */

using("WSE.tools").define("WSE.commands.var", function (tools) {
    
    "use strict";
    
    function varCommand (command, interpreter) {
        
        var key, val, lval, action, container;
        
        interpreter.bus.trigger(
            "wse.interpreter.commands.var",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );
        
        key = command.getAttribute("name") || null;
        val = command.getAttribute("value") || "1";
        action = command.getAttribute("action") || "set";
        
        if (key === null) {
            
            interpreter.bus.trigger("wse.interpreter.warning",
            {
                element: command,
                message: "Command 'var' must have a 'name' attribute."
            });
            
            return {
                doNext: true
            };
        }
        
        container = interpreter.runVars;
        
        if (action !== "set" && !(key in container || command.getAttribute("lvalue"))) {
            
            interpreter.bus.trigger("wse.interpreter.warning", {
                element: command,
                message: "Undefined variable."
            });
            
            return {
                doNext: true
            };
        }
        
        val  = tools.replaceVariables(val,  interpreter);
        
        if (action === "set") {
            
            container[key] = "" + val;
            
            return {
                doNext: true
            };
        }
        
        lval = command.getAttribute("lvalue") || container[key];
        lval = tools.replaceVariables(lval, interpreter);
        
        switch (action) {
            case "delete":
                delete container[key];
                break;
            
            case "increase":
                container[key] = "" + (parseFloat(lval) + parseFloat(val));
                break;
            case "decrease":
                container[key] = "" + (parseFloat(lval) - parseFloat(val));
                break;
            case "multiply":
                container[key] = "" + (parseFloat(lval) * parseFloat(val));
                break;
            case "divide":
                container[key] = "" + (parseFloat(lval) / parseFloat(val));
                break;
            case "modulus":
                container[key] = "" + (parseFloat(lval) % parseFloat(val));
                break;
    
            case "and":
                container[key] = "" + (parseFloat(lval) && parseFloat(val));
                break;
            case "or":
                container[key] = "" + (parseFloat(lval) || parseFloat(val));
                break;
            case "not":
                container[key] = parseFloat(lval) ? "0" : "1";
                break;
            
            case "is_greater":
                container[key] = parseFloat(lval) > parseFloat(val) ? "1" : "0";
                break;
            case "is_less":
                container[key] = parseFloat(lval) < parseFloat(val) ? "1" : "0";
                break;
            case "is_equal":
                container[key] = parseFloat(lval) === parseFloat(val) ? "1" : "0";
                break;
            case "not_greater":
                container[key] = parseFloat(lval) <= parseFloat(val) ? "1" : "0";
                break;
            case "not_less":
                container[key] = parseFloat(lval) >= parseFloat(val) ? "1" : "0";
                break;
            case "not_equal":
                container[key] = parseFloat(lval) !== parseFloat(val) ? "1" : "0";
                break;
            
            case "print":
                interpreter.bus.trigger(
                    "wse.interpreter.message",
                    "Variable '" + key + "' is: " + container[key]
                );
                break;
            default:
                interpreter.bus.trigger("wse.interpreter.warning", {
                    element: command,
                    message: "Unknown action '" + action + "' defined on 'var' command."
                });
        }
        
        return {
            doNext: true
        };
    }
    
    return varCommand;
    
});