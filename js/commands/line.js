/* global using */

using("WSE.tools").define("WSE.commands.line", function (tools) {
    
    "use strict";
    
    function line (command, interpreter) {
        
        var speakerId, speakerName, textboxName, i, len, current;
        var assetElements, text, doNext, bus = interpreter.bus;
        
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
            
            bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Element 'line' requires attribute 's'."
                }
            );
            
            return {
                doNext: true
            };
        }
        
        assetElements = interpreter.story.getElementsByTagName("character");
        len = assetElements.length;
        
        for (i = 0; i < len; i += 1) {
            
            current = assetElements[i];
            
            if (current.getAttribute("name") === speakerId) {
                
                textboxName = current.getAttribute("textbox");
                
                if (typeof textboxName === "undefined" || textboxName === null) {
                    
                    bus.trigger(
                        "wse.interpreter.warning",
                        {
                            element: command,
                            message: "No textbox defined for character '" + speakerId + "'."
                        }
                    );
                    
                    return {
                        doNext: true
                    };
                }
                
                try {
                    
                    speakerName =
                        tools.getSerializedNodes(current.getElementsByTagName("displayname")[0]);
                }
                catch (e) {}
                
                break;
            }
        }
        
        if (typeof interpreter.assets[textboxName] === "undefined") {
            
            bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Trying to use an unknown textbox or character."
                }
            );
            
            return {
                doNext: true
            };
        }
        
        text = tools.getSerializedNodes(command);
        
        interpreter.log.push({speaker: speakerId, text: text});
        interpreter.assets[textboxName].put(text, speakerName, speakerId);
        
        return {
            doNext: doNext,
            wait: true
        };
    }
    
    return line;
     
});