/* global using */

using("WSE.tools", "WSE.DisplayObject").
define("WSE.commands.choice", function (tools, DisplayObject) {
    
    "use strict";
    
    function choice (command, interpreter) {
        
        var menuElement, buttons, children, len, i, current, duration;
        var currentButton, scenes, self, sceneName;
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
        
        makeButtonClickFn = function (cur, me, sc, idx) {
            
            sc = sc || null;
            
            return function (ev) {
                
                ev.stopPropagation();
                ev.preventDefault();
                
                setTimeout(
                    function () {
                        
                        var childrenLen = cur.childNodes ? cur.childNodes.length : 0;
                        
                        var oldIndex = interpreter.index;
                        var oldSceneId = interpreter.sceneId;
                        var oldScenePath = interpreter.scenePath.slice();
                        var oldCurrentScene = interpreter.currentScene;
                        
                        if (sc !== null) {  
                            self.changeSceneNoNext(sc);
                        }
                        
                        if (childrenLen > 0) {
                            
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
                
                self.stage.removeChild(me);
                interpreter.waitCounter -= 1;
                interpreter.state = oldState;
            };
        };
        
        if (len < 1) {
            
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
        
        for (i = 0; i < len; i += 1) {
            
            current = children[i];
            
            if (!current.tagName ||
                    current.tagName !== "option" ||
                    !interpreter.checkIfvar(current)) {
                
                continue;
            }
            
            currentButton = document.createElement("input");
            currentButton.setAttribute("class", "button");
            currentButton.setAttribute("type", "button");
            currentButton.setAttribute("tabindex", i + 1);
            currentButton.setAttribute("value", current.getAttribute("label"));
            
            currentButton.value = tools.replaceVariables(
                current.getAttribute("label"),
                interpreter
            );
            
            sceneName = current.getAttribute("scene") || null;
            
            scenes[i] = sceneName ? interpreter.getSceneById(sceneName) : null;
            
            tools.attachEventListener(
                currentButton, 
                'click',
                makeButtonClickFn(current, menuElement, scenes[i], i)
            );
            
            buttons.push(currentButton);
            menuElement.appendChild(currentButton);
        }
        
        menuElement.style.opacity = 0;
        interpreter.stage.appendChild(menuElement);
        
        DisplayObject.prototype.show.call(
            undefined,
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
    
    return choice;
    
});