/* global using */

using(
    "WSE.tools::replaceVariables",
    "WSE.commands.set_vars",
    "WSE.tools::warn",
    "WSE.tools::logError",
    "WSE.tools::log",
    "WSE.tools::xmlElementToAst"
).
define("WSE.commands.sub", function (replaceVars, setVars, warn, logError, log, toAst) {
    
    "use strict";
    
    function sub (command, interpreter) {
        
        var sceneId, scene, doNext, next, props = command.properties;
        
        interpreter.bus.trigger(
            "wse.interpreter.commands.sub",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );
        
        next = {doNext: true};
        sceneId = props.scene || null;
        doNext = props.next === false ? false : true;
        
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
        
        interpreter.currentCommands = toAst(scene, interpreter).children;
        interpreter.index = -1;
        interpreter.sceneId = sceneId;
        interpreter.scenePath = [];
        interpreter.currentElement = -1;
        
        if (props.names) {
            setVars(command, interpreter);
        }
        
        return {
            doNext: doNext
        };
    }
    
    return sub;
    
});