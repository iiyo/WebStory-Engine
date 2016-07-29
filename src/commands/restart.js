/* global using */

using().define("WSE.commands.restart", function () {
    
    "use strict";
    
    function restart (command, interpreter) {
        
        interpreter.bus.trigger(
            "wse.interpreter.commands.restart",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );
        
        interpreter.bus.trigger("wse.interpreter.message", "Restarting game...", false);
        interpreter.bus.trigger("wse.interpreter.restart", interpreter, false);
        
        interpreter.runVars = {};
        interpreter.log = [];
        interpreter.visitedScenes = [];
        interpreter.startTime = Math.round(+new Date() / 1000);
        interpreter.waitCounter = 0;
        interpreter.state = "listen";
        interpreter.stage.innerHTML = "";
        
        interpreter.assets = {};
        interpreter.buildAssets();
        
        while (interpreter.callStack.length > 0) {
            interpreter.callStack.shift();
        }
        
        return {
            doNext: true,
            changeScene: interpreter.getFirstScene()
        };
    }
    
    return restart;
    
});