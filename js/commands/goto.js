/* global MO5 */

MO5("WSE.tools").define("WSE.commands.goto", function (tools) {
    
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
            bus.trigger(
                "wse.interpreter.error",
                {
                    message: "Element 'goto' misses attribute 'scene'."
                }
            );
        }
        
        sceneName = tools.replaceVariables(sceneName, interpreter);
        
        scene = interpreter.getSceneById(sceneName);
        
        if (scene === null) {
            
            bus.trigger(
                "wse.interpreter.error",
                {
                    message: "Unknown scene '" + sceneName + "'."
                }
            );
            
            return;
        }
        
        return {
            changeScene: scene
        };
    }
    
    return gotoCommand;
    
});