
var warn = require("../tools/tools").warn;
var functions = require("../functions");

function fn (command, interpreter) {
    
    var name, varName, ret;
    
    name = command.getAttribute("name") || null;
    varName = command.getAttribute("tovar") || null;
    
    if (typeof name !== "string") {
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
}

module.exports = fn;
