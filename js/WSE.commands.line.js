(function (out)
{
    out.commands.line = function (command, interpreter)
    {
        var speakerId, speakerName, textboxName, i, len, current;
        var assetElements, text, doNext;

        interpreter.bus.trigger(
            "wse.interpreter.commands.line",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );

        //         interpreter.game.subscribeListeners();

        speakerId = command.getAttribute("s");
        doNext = command.getAttribute("stop") === "false" ? true : false;

        if (speakerId === null)
        {
            interpreter.bus.trigger(
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
        
        for (i = 0; i < len; i += 1)
        {
            current = assetElements[i];
            
            if (current.getAttribute("name") === speakerId)
            {
                textboxName = current.getAttribute("textbox");
                
                if (typeof textboxName === "undefined" || textboxName === null)
                {
                    interpreter.bus.trigger(
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
                
                try
                {
                    speakerName = current.getElementsByTagName("displayname")[0].childNodes[0].nodeValue;
                }
                catch (e) {}
                
                break;
            }
        }

        if (typeof interpreter.assets[textboxName] === "undefined")
        {
            interpreter.bus.trigger(
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

        text = command.childNodes[0].nodeValue;
        
        interpreter.log.push({speaker: speakerId, text: text});
        interpreter.assets[textboxName].put(text, speakerName);
        
        return {
            doNext: doNext,
            wait: true
        };
    };    
}(WSE));