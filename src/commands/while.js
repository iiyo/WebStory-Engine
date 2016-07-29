/* global using */

using().define("WSE.commands.while", function () {
    
    "use strict";
    
    function whileCommand (command, interpreter) {
        
        interpreter.index -= 1;
        interpreter.currentElement -= 1;
        interpreter.pushToCallStack();
        interpreter.currentCommands = command.childNodes;
        interpreter.scenePath.push(interpreter.index+1);
        interpreter.index = -1;
        interpreter.currentElement = -1;
        
        return {
            doNext: true
        };
    }
    
    return whileCommand;
    
});
