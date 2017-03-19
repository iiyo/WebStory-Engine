
var warn = require("../tools/tools").warn;

function localize (command, interpreter) {
    
    var key, next;
    
    next = {doNext: true};
    key = command.getAttribute("name") || null;
    
    if (key === null) {
        warn(interpreter.bus, "No variable name defined on localize element.", command);
        return next;
    }
    
    if (!interpreter.globalVars.has(key)) {
        warn(interpreter.bus, "Undefined global variable.", command);
        return next;
    }
    
    interpreter.runVars[key] = interpreter.globalVars.get(key);
    
    return next;
}

module.exports = localize;
