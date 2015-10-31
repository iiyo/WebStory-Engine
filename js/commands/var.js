/* global using */

using("WSE.tools::replaceVariables", "WSE.tools::warn", "WSE.tools::log").
define("WSE.commands.var", function (replaceVars, warn, log) {
    
    "use strict";
    
    function varCommand (command, interpreter) {
        
        var key, val, lval, action, container, next;
        
        next = {doNext: true};
        
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
            warn(interpreter.bus, "Command 'var' must have a 'name' attribute.", command);
            return next;
        }
        
        container = interpreter.runVars;
        
        if (action !== "set" && !(key in container || command.getAttribute("lvalue"))) {
            warn(interpreter.bus, "Undefined variable.", command);
            return next;
        }
        
        val  = replaceVars(val,  interpreter);
        
        if (action === "set") {
            container[key] = "" + val;
            return next;
        }
        
        lval = command.getAttribute("lvalue") || container[key];
        lval = replaceVars(lval, interpreter);
        
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
                log(interpreter.bus, "Variable '" + key + "' is: " + container[key]);
                break;
            
            default:
                warn(interpreter.bus, "Unknown action '" + action +
                    "' defined on 'var' command.", command);
        }
        
        return next;
    }
    
    return varCommand;
    
});