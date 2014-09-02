/*<ON_DEPLOY_REMOVE>*/
/* global setTimeout, document, WSE */
/*
    Copyright (c) 2012, 2013 The WebStory Engine Contributors
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
    
    out.commands.choice = function (command, interpreter)
    {
        var menuElement, buttons, children, len, i, current, duration;
        var currentButton, scenes, self, j, jlen, currentScene, sceneName;
        var makeButtonClickFn, oldState, cssid;

        interpreter.bus.trigger(
            "wse.interpreter.commands.choice",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );

        oldState = interpreter.state;
        interpreter.state = "pause";

        buttons = [];
        scenes = [];
        self = interpreter;
        children = command.childNodes;
        len = children.length;
        duration = command.getAttribute("duration") || 500;
        duration = parseInt(duration, 10);
        cssid = command.getAttribute("cssid") || "WSEChoiceMenu";

        makeButtonClickFn = function (cur, me, sc, idx)
        {
            sc = sc || null;
            
            return function (ev)
            {
                ev.stopPropagation();
                ev.preventDefault();
                
                setTimeout(
                    function ()
                    {
                        var cmds, i, len, childrenLen = cur.children ? cur.children.length : 0;

                        var oldIndex = interpreter.index;
                        var oldSceneId = interpreter.sceneId;
                        var oldScenePath = interpreter.scenePath.slice();
                        var oldCurrentScene = interpreter.currentScene;

                        if (sc !== null)
                        {  
                            self.changeSceneNoNext(sc);
                        }

                        if (childrenLen > 0)
                        {
                            interpreter.pushToCallStack();
                            interpreter.currentCommands = cur.childNodes;
                            interpreter.sceneId = oldSceneId;
                            interpreter.scenePath = oldScenePath;
                            interpreter.scenePath.push(oldIndex-1);
                            interpreter.scenePath.push(idx);
                            interpreter.index = 0;
                            interpreter.currentScene = oldCurrentScene;
                            interpreter.currentElement = 0;
                        }

                        self.next();
                    },
                    0
                );

                // return here if you want to leave the menu shown
                self.stage.removeChild(me);
                interpreter.waitCounter -= 1;
                interpreter.state = oldState;
            };
        };

        if (len < 1)
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Element 'choice' is empty. Expected at " +
                        "least one 'option' element."
                }
            );
        }

        menuElement = document.createElement("div");
        menuElement.setAttribute("class", "menu");
        menuElement.setAttribute("id", cssid);

        // associate HTML element with XML element; used when loading savegames:
        menuElement.setAttribute("data-wse-index", interpreter.index);
        menuElement.setAttribute("data-wse-scene-id", interpreter.sceneId);
        menuElement.setAttribute("data-wse-game", interpreter.game.url);
        menuElement.setAttribute("data-wse-type", "choice");

        for (i = 0; i < len; i += 1)
        {
            current = children[i];
            if ( !current.tagName || current.tagName !== "option" || !interpreter.checkIfvar(current))
            {
                continue;
            }
            
            currentButton = document.createElement("input");
            currentButton.setAttribute("class", "button");
            currentButton.setAttribute("type", "button");
            currentButton.setAttribute("tabindex", i + 1);
            currentButton.setAttribute("value", current.getAttribute("label"));
            currentButton.value = out.tools.replaceVariables(current.getAttribute("label"),  interpreter);
            sceneName = current.getAttribute("scene") || null;
            
            scenes[i] = sceneName ? interpreter.getSceneById(sceneName) : null;

            out.tools.attachEventListener(
                currentButton, 
                'click',
                makeButtonClickFn(current, menuElement, scenes[i], i)
            );
            
            buttons.push(currentButton);
            menuElement.appendChild(currentButton);
        }

        menuElement.style.opacity = 0;
        interpreter.stage.appendChild(menuElement);

        out.assets.mixins.displayable.show(
            command,
            {
                element: menuElement,
                bus: interpreter.bus,
                stage: interpreter.stage,
                interpreter: interpreter
            }
        );

        interpreter.waitCounter += 1;

        return {
            doNext: false,
            wait: true
        };
    };    
}(WSE));