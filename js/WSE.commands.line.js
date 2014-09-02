/*<ON_DEPLOY_REMOVE>*/
/* global WSE */
/*
    Copyright (c) 2012 - 2014 The WebStory Engine Contributors
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:
    
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.

    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

    * Neither the name WebStory Engine nor the names of its contributors 
      may be used to endorse or promote products derived from this software 
      without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
    ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
    WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS BE LIABLE FOR ANY
    DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/*</ON_DEPLOY_REMOVE>*/
(function (out)
{
    "use strict";
    
    out.commands.line = function (command, interpreter)
    {
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

        if (speakerId === null)
        {
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
        
        for (i = 0; i < len; i += 1)
        {
            current = assetElements[i];
            
            if (current.getAttribute("name") === speakerId)
            {
                textboxName = current.getAttribute("textbox");
                
                if (typeof textboxName === "undefined" || textboxName === null)
                {
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
                
                try
                {
                    speakerName = out.tools.getSerializedNodes(current.getElementsByTagName("displayname")[0]);
                }
                catch (e) {}
                
                break;
            }
        }

        if (typeof interpreter.assets[textboxName] === "undefined")
        {
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

        text = out.tools.getSerializedNodes(command);
        
        interpreter.log.push({speaker: speakerId, text: text});
        interpreter.assets[textboxName].put(text, speakerName);
        
        return {
            doNext: doNext,
            wait: true
        };
    };    
}(WSE));