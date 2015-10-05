/* global using */

using("WSE.tools", "WSE.commands.set_vars").
define("WSE.commands.sub", function (tools, setVars) {
    
    "use strict";
    
    function sub (command, interpreter) {
        
        var sceneId, scene, doNext;
        
        interpreter.bus.trigger(
            "wse.interpreter.commands.sub",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );
        
        sceneId = command.getAttribute("scene") || null;
        doNext = command.getAttribute("next") === false ? false : true;
        
        if (sceneId === null) {
            
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Missing 'scene' attribute on 'sub' command!"
                }
            );
            
            return {
                doNext: true
            };
        }
        
        sceneId = tools.replaceVariables(sceneId, interpreter);
        scene = interpreter.getSceneById(sceneId);
        
        if (!scene) {
            
            interpreter.bus.trigger("wse.interpreter.error", {
                message: "No such scene '" + sceneId + "'!",
                command: command
            });
            
            return {doNext: true};
        }
        
        interpreter.bus.trigger(
            "wse.interpreter.message", 
            "Entering sub scene '" + sceneId + "'...",
            false
        );
        
        interpreter.pushToCallStack();
        
        interpreter.currentCommands = scene.childNodes;
        interpreter.index = -1;
        interpreter.sceneId = sceneId;
        interpreter.scenePath = [];
        interpreter.currentElement = -1;
        
        if (command.getAttribute("names")) {
            setVars(command, interpreter);
        }
        
        return {
            doNext: doNext
        };
    }
    
    return sub;
    
});