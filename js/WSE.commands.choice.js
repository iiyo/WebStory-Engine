(function (out)
{
    out.Interpreter.prototype.commands.choice = function (command, interpreter)
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
        children = command.getElementsByTagName("option");
        len = children.length;
        duration = command.getAttribute("duration") || 500;
        duration = parseInt(duration, 10);
        cssid = command.getAttribute("cssid") || "WSEChoiceMenu";

        makeButtonClickFn = function (cur, me, sc)
        {
            sc = sc || null;
            
            return function (ev)
            {
                var noHide;

                noHide = cur.getAttribute("hide") === "false" ? true : false;

                ev.stopPropagation();
                ev.preventDefault();
                
                setTimeout(
                    function ()
                    {
                        var cmds, i, len, noNext;
                        noNext = cur.getAttribute("next") === "false" ? true : false;
                        cmds = cur.getElementsByTagName("var");
                        len = cmds.length;

                        for (i = 0; i < len; i += 1)
                        {
                            self.commands["var"](cmds[i], self);
                        }

                        if (sc !== null)
                        {
                            self.changeScene(sc);
                            return;
                        }

                        if (noNext === true)
                        {
                            return;
                        }

                        self.next();
                    },
                    0
                );

                if (noHide === true)
                {
                    return;
                }

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
            currentButton = document.createElement("input");
            currentButton.setAttribute("class", "button");
            currentButton.setAttribute("type", "button");
            currentButton.setAttribute("tabindex", i + 1);
            currentButton.setAttribute("value", current.getAttribute("label"));
            currentButton.value = current.getAttribute("label");
            sceneName = current.getAttribute("scene") || null;
            
            for (j = 0, jlen = interpreter.scenes.length; j < jlen; j += 1)
            {
                currentScene = interpreter.scenes[j];
                if (currentScene.getAttribute("id") === sceneName)
                {
                    scenes[i] = currentScene;
                    break;
                }
            }
            
            scenes[i] = scenes[i] || null;

            out.tools.attachEventListener(
                currentButton, 
                'click',
                makeButtonClickFn(current, menuElement, scenes[i])
            );
            
            buttons.push(currentButton);
            menuElement.appendChild(currentButton);
        }

        menuElement.style.opacity = 0;
        interpreter.stage.appendChild(menuElement);

        out.assets.mixins.show(
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