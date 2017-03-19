
var tools = require("../tools/tools");

var warn = tools.warn;
var getSerializedNodes = tools.getSerializedNodes;

function line (command, interpreter) {
    
    var speakerId, speakerName, textboxName, i, len, current;
    var assetElements, text, doNext, bus = interpreter.bus, next;
    
    next = {doNext: true};
    
    bus.trigger(
        "wse.interpreter.commands.line",
        {
            interpreter: interpreter,
            command: command
        }, 
        false
    );
    
    speakerId = command.getAttribute("s");
    doNext = command.getAttribute("stop") === "false" ? true : false;
    
    if (speakerId === null) {
        warn(bus, "Element 'line' requires attribute 's'.", command);
        return next;
    }
    
    assetElements = interpreter.story.getElementsByTagName("character");
    len = assetElements.length;
    
    for (i = 0; i < len; i += 1) {
        
        current = assetElements[i];
        
        if (current.getAttribute("name") === speakerId) {
            
            textboxName = current.getAttribute("textbox");
            
            if (typeof textboxName === "undefined" || textboxName === null) {
                warn(bus, "No textbox defined for character '" + speakerId + "'.", command);
                return next;
            }
            
            try {
                speakerName =
                    getSerializedNodes(current.getElementsByTagName("displayname")[0]).trim();
            }
            catch (e) {}
            
            break;
        }
    }
    
    if (typeof interpreter.assets[textboxName] === "undefined") {
        warn(bus, "Trying to use an unknown textbox or character.", command);
        return next;
    }
    
    text = getSerializedNodes(command);
    
    interpreter.log.push({speaker: speakerId, text: text});
    interpreter.assets[textboxName].put(text, speakerName, speakerId);
    
    return {
        doNext: doNext,
        wait: true
    };
}

module.exports = line;
