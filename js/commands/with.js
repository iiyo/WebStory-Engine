/* global using */

using("WSE.tools::getParsedAttribute", "WSE.tools::warn").
define("WSE.commands.with", function (getParsedAttribute, warn) {
    
    "use strict";
    
    function withCommand (command, interpreter) {
        
        var container = interpreter.runVars;
        var children = command.childNodes;
        var variableName = getParsedAttribute(command, "var", interpreter);
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
                    getParsedAttribute(current, "is") === container[variableName]) {
                
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
    
    
    function shouldBeSkipped (element, interpreter) {
        return !element.tagName || !interpreter.checkIfvar(element) ||
            (element.tagName !== "when" && element.tagName !== "else");
    }
    
    function isWhen (element) {
        return tagNameIs(element, "when");
    }
    
    function isElse (element) {
        return tagNameIs(element, "else");
    }
    
    function tagNameIs (element, name) {
        return element.tagName === name;
    }
    
    function hasCondition (element) {
        return element.hasAttribute("is");
    }
    
});
