/* global MO5 */

MO5("WSE.tools").define("WSE.commands.with", function (tools) {
    
    "use strict";
    
    function withCommand (command, interpreter) {
        
        var container = interpreter.runVars;
        var children = command.childNodes;
        var variableName = tools.getParsedAttribute(command, "var", interpreter);
        var i, numberOfChildren = children.length, current;
        
        for (i = 0; i < numberOfChildren; i += 1) {
            
            current = children[i];
            
            if (!current.tagName || !interpreter.checkIfvar(current) ||
                    (current.tagName !== "when" && current.tagName !== "else")) {
                continue;
            }
            
            if (current.tagName === "when" && ! current.hasAttribute("is")) {
                interpreter.bus.trigger("wse.interpreter.warning", {
                    message: "Element 'when' without a condition. Ignored.", command: command
                });
            }
            
            if (current.tagName === "else" && current.hasAttribute("is")) {
                interpreter.bus.trigger("wse.interpreter.warning", {
                    message: "Element 'else' with a condition. Ignored.", command: command
                });
            }
            
            if (current.tagName === "else" ||
                    current.tagName === "when" && current.hasAttribute("is") &&
                    tools.getParsedAttribute(current, "is") === container[variableName]) {
                
                interpreter.pushToCallStack();
                interpreter.currentCommands = current.childNodes;
                interpreter.scenePath.push(interpreter.index);
                interpreter.scenePath.push(i);
                interpreter.index = -1;
                interpreter.currentElement = -1;
                
                break;
            }
        }
        
        return {
            doNext: true
        };
    }
    
    return withCommand;
    
});
