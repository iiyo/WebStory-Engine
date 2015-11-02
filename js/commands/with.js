/* global using */

using("WSE.tools::getParsedAttribute", "WSE.tools::warn").
define("WSE.commands.with", function (getParsedAttribute, warn) {
    
    "use strict";
    
    function withCommand (command, interpreter) {
        
        var container = interpreter.runVars;
        var children = command.children;
        var variableName = command.properties["var"];
        var i, numberOfChildren = children.length, current;
        
        for (i = 0; i < numberOfChildren; i += 1) {
            
            current = children[i];
            
            if (shouldBeSkipped(current, interpreter)) {
                continue;
            }
            
            if (isWhen(current) && !hasCondition(current)) {
                warn(interpreter.bus, "Element 'when' without a condition. Ignored.", command);
            }
            
            if (isElse(current) && hasCondition(current)) {
                warn(interpreter.bus, "Element 'else' with a condition. Ignored.", command);
            }
            
            if (isElse(current) ||
                    isWhen(current) && hasCondition(current) &&
                    current.properties.is === container[variableName]) {
                
                interpreter.pushToCallStack();
                interpreter.currentCommands = current.children;
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
    
    
    function shouldBeSkipped (element, interpreter) {
        return !element.type || !interpreter.checkIfvar(element) ||
            (element.type !== "when" && element.type !== "else");
    }
    
    function isWhen (element) {
        return typeIs(element, "when");
    }
    
    function isElse (element) {
        return typeIs(element, "else");
    }
    
    function typeIs (element, name) {
        return element.type === name;
    }
    
    function hasCondition (element) {
        return "is" in element.properties;
    }
    
});
