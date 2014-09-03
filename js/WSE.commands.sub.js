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
    
    out.commands["sub"] = function (command, interpreter)
    {
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

        //console.log("doNext in .sub() is: ", doNext);

        if (sceneId === null)
        {
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

        sceneId = out.tools.replaceVariables(sceneId, interpreter);
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
            out.commands.set_vars(command, interpreter);
        }

        return {
            doNext: doNext
        };
    };
}(WSE));