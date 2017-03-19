
var tools = require("../tools/tools");

var logError = tools.logError;
var replaceVars = tools.replaceVariables;

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

module.exports = gotoCommand;
