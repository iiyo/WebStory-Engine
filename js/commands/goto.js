/* global using */

using(
    "WSE.tools::replaceVariables",
    "WSE.tools::logError"
).
define("WSE.commands.goto", function (replaceVars, logError) {
    
    "use strict";
    
    function gotoCommand (command, interpreter) {
        
        var scene, sceneName, bus = interpreter.bus;
        
        bus.trigger(
            "wse.interpreter.commands.goto",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );
        
        sceneName = command.getAttribute("scene");
        
        if (sceneName === null) {
            logError(bus, "Element 'goto' misses attribute 'scene'.");
        }
        
        sceneName = replaceVars(sceneName, interpreter);
        
        scene = interpreter.getSceneById(sceneName);
        
        if (scene === null) {
            logError(bus, "Unknown scene '" + sceneName + "'.");
            return;
        }
        
        return {
            changeScene: scene
        };
    }
    
    return gotoCommand;
    
});