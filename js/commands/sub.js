/* global using */

using(
    "WSE.tools::replaceVariables",
    "WSE.commands.set_vars",
    "WSE.tools::warn",
    "WSE.tools::logError",
    "WSE.tools::log"
).
define("WSE.commands.sub", function (replaceVars, setVars, warn, logError, log) {
    
    "use strict";
    
    function sub (command, interpreter) {
        
        var sceneId, scene, doNext, next;
        
        interpreter.bus.trigger(
            "wse.interpreter.commands.sub",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );
        
        next = {doNext: true};
        sceneId = command.getAttribute("scene") || null;
        doNext = command.getAttribute("next") === false ? false : true;
        
        if (sceneId === null) {
            warn(interpreter.bus, "Missing 'scene' attribute on 'sub' command!", command);
            return next;
        }
        
        sceneId = replaceVars(sceneId, interpreter);
        scene = interpreter.getSceneById(sceneId);
        
        if (!scene) {
            logError(interpreter.bus, "No such scene '" + sceneId + "'!", command);
            return next;
        }
        
        log(interpreter.bus, "Entering sub scene '" + sceneId + "'...");
        
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