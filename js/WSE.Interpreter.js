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
(function (out)
{
    "use strict";

    /**
     * Constructor to create an instance of the engine's interpreter.
     * Each game has it's own interpreter instance. The interpreter
     * reads the information in the WebStory file and triggers the execution
     * of the appropriate commands.
     * 
     * @event
     * @param game [object] The WSE.Game instance the interpreter belongs to.
     */
    out.Interpreter = function (game)
    {
        var datasource, key;

        if (!(this instanceof out.Interpreter))
        {
            return new out.Interpreter(game);
        }
        
        out.trigger("wse.interpreter.constructor", {game: game, interpreter: this});

        this.game = game;
        this.assets = {};
        
        /** @var Index of the currently examined element inside the active scene. */
        this.index = 0;
        this.visitedScenes = [];
        
        /** @var A text log of everything that has been shown on text boxes. */
        this.log = [];
        this.waitForTimer = false;
        
        /** @var Number of assets that are currently being fetched from the server. */
        this.assetsLoading = 0;
        
        /** @var Total number of assets to load. */
        this.assetsLoadingMax = 0;
        
        /** @var Number of assets already fetched from the server. */
        this.assetsLoaded = 0;
        
        /** @var The timestamp from when the game starts. Used for savegames. */
        this.startTime = 0;
        
        /** @var Holds 'normal' variables. These are only remembered for the current route. */
        this.runVars = {};
        
        /** @var The call stack for sub scenes. */
        this.callStack = [];
        this.keysDisabled = 0; // if this is > 0, key triggers should be disabled
        
        /** @var The current state of the interpreter's state machine. 
         *   'listen' means that clicking on the stage or going to the next line
         *   is possible. 
         */
        this.state = "listen";
        
        /** @var All functions that require the interpreter's state machine
         *   to wait. The game will only continue when this is set to 0.
         *   This can be used to prevent e.g. that the story continues in
         *   the background while a dialog is displayed in the foreground.
         */
        this.waitCounter = 0;
        
        /** @var Should the game be run in debug mode? */
        this.debug = game.debug === true ? true : false;

        // The datasource to use for saving games and global variables.
        // Hardcoded to localStorage for now.
        datasource = new out.datasources.LocalStorage();
        this.datasource = datasource;
        
        // Each game must have it's own unique storage key so that multiple
        // games can be run on the same web page.
        key = "wse_globals_" + location.pathname + "_" + this.game.url + "_";

        /** @var Stores global variables. That is, variables that will
         *   be remembered independently of the current state of the game.
         *   Can be used for unlocking hidden features after the first
         *   playthrough etc.
         */
        this.globalVars = {
            set: function (name, value)
            {
                datasource.set(key + name, value);
            },

            get: function (name)
            {
                return datasource.get(key + name);
            },

            has: function (name)
            {
                if (datasource.get(key + name) === null)
                {
                    return false;
                }
                return true;
            }
        };
        
        if (this.debug === true)
        {
            this.game.bus.debug = true;
        }
    };

    /**
     * Inserts the loading screen that is shown on startup to give
     * the player a feedback that the game still does something
     * and that they have to be patient.
     */
    out.Interpreter.prototype.buildLoadingScreen = function ()
    {
        var loadScreen, self, setMeter;

        self = this;

        loadScreen = document.createElement("div");
        loadScreen.setAttribute("id", "WSELoadingScreen");
        loadScreen.style.zIndex = 10000;
        loadScreen.style.width = "100%";
        loadScreen.style.height = "100%";
        loadScreen.style.visibility = "hidden";

        loadScreen.innerHTML = '' + 
            '<div class="container">' + 
                '<div class="heading">' + 
                    '<span id="WSELoadingScreenPercentage"></span>' + 
                    'Loading...' + 
                '</div>' + 
                '<div class="progressBar">' + 
                    '<div class="progress" id="WSELoadingScreenProgress" style="width: 100%;">' + 
                    '</div>' + 
                '</div>' + 
            '</div>';

        this.game.stage.appendChild(loadScreen);

        setMeter = function ()
        {
            var el, el2, perc;
            
            try
            {
                el = document.getElementById("WSELoadingScreenProgress");
                el2 = document.getElementById("WSELoadingScreenPercentage");
                perc = parseInt((self.assetsLoaded / self.assetsLoadingMax) * 100, 10);
                
                if (self.assetsLoadingMax < 1)
                {
                    perc = 0;
                }
                
                el.style.width = perc + "%";
                el2.innerHTML = "" + self.assetsLoaded + "/" + self.assetsLoadingMax + " (" + perc + "%)";
            }
            catch (e)
            {
                //console.log("Element missing.");
            }

            if (self.assetsLoaded === (self.assetsLoadingMax - 1))
            {
                self.bus.trigger("wse.assets.loading.finished");
            }
            
        };

        (function (){
            var subscrFn;
            
            subscrFn = function ()
            {
                var valFn, finishFn, options;
                
                valFn = function (v)
                {
                    self.loadScreen.style.opacity = v;
                };
                
                finishFn = function ()
                {
                    self.loadScreen.style.display = "none";
                };
                
                options = {
                    duration: 500,
                    onFinish: finishFn
                };
                
                document.getElementById("WSELoadingScreenProgress").style.width = "100%";
                
                out.fx.transform(valFn, 1, 0, options);
                //console.log("Hiding loading screen...");
            }
            
            self.bus.subscribe(subscrFn, "wse.assets.loading.finished");
        }());

        this.bus.subscribe(setMeter, "wse.assets.loading.increase");
        this.bus.subscribe(setMeter, "wse.assets.loading.decrease");
        this.bus.subscribe(setMeter, "wse.assets.loading.started");

        this.bus.subscribe(
            function ()
            {
                self.loadScreen.style.visibility = "visible";
            }, 
            "wse.assets.loading.started"
        );

        this.loadScreen = loadScreen;

    };

    out.Interpreter.prototype.start = function ()
    {
        var self, fn, makeKeyFn, bus;
        
        this.stage = this.game.stage;
        this.bus = this.game.bus;
        this.index = 0;
        this.currentElement = 0;
        this.sceneId = null;
        this.currentCommands = [];
        this.wait = false;
        this.startTime = Math.round(+new Date() / 1000);
        this.stopped = false;

        self = this;
        bus = this.bus;

        this.buildLoadingScreen();

        // Adds location info to warnings and errors.
        fn = function (data)
        {
            var section, element, msg;
            
            data = data || {};
            element = data.element || null;
            section = null;
            
            if (element !== null)
            {
                try
                {
                    section = data.element.tagName === "asset" ? "assets" : null;
                    section = data.element.parent.tagName === "settings" ? "settings" : null;
                }
                catch (e)
                {}
            }
            
            section = section || "scenes";
            
            switch (section)
            {
                case "assets":
                    msg = "         Encountered in section 'assets'.";
                    break;
                case "settings":
                    msg = "         Encountered in section 'settings'.";
                    break;
                default:
                    msg = "         Encountered in scene '" + self.sceneId + "', element " + self.currentElement + ".";
            }
            
            console.log(msg);
        };

        bus.subscribe(fn, "wse.interpreter.error");
        bus.subscribe(fn, "wse.interpreter.warning");
        bus.subscribe(fn, "wse.interpreter.message");
        
        bus.subscribe(
            function ()
            {
                console.log("Game over.");
            }, 
            "wse.interpreter.end"
        );

        bus.subscribe(
            function ()
            {
                self.numberOfFunctionsToWaitFor += 1;
            }, 
            "wse.interpreter.numberOfFunctionsToWaitFor.increase"
        );

        bus.subscribe(
            function ()
            {
                self.numberOfFunctionsToWaitFor -= 1;
            },
            "wse.interpreter.numberOfFunctionsToWaitFor.decrease"
        );

        bus.subscribe(
            function ()
            {
                self.assetsLoading += 1;
                self.assetsLoadingMax += 1;
            }, 
            "wse.assets.loading.increase"
        );

        bus.subscribe(
            function ()
            {
                self.assetsLoading -= 1;
                self.assetsLoaded += 1;
            }, 
            "wse.assets.loading.decrease"
        );

        this.createTriggers();

        makeKeyFn = function (type)
        {
            return function (ev)
            {
                bus.trigger(
                    type,
                    {
                        event: ev,
                        keys: self.game.keys.keys
                    }
                );
            };
        };

        this.game.keys.forAll(makeKeyFn("keyup"), "up");
        this.game.keys.forAll(makeKeyFn("keydown"), "down");
        this.game.keys.forAll(makeKeyFn("keypress"), "press");

        this.game.subscribeListeners();

        setTimeout(function () { self.runStory(); }, 1000);
    };

    out.Interpreter.prototype.runStory = function ()
    {
        var scenes, outScenes, len, i, ix, iy, current, self;

        self = this;

        if (this.assetsLoading > 0)
        {
            (function ()
            {
                var timeoutFn;
                
                timeoutFn = function ()
                {
                    self.runStory();
                };
                
                setTimeout(timeoutFn, 100);
            }());
            
            return;
        }
        
        this.changeScene(this.game.firstSceneId);
    };

    out.Interpreter.prototype.changeScene = function (sceneId)
    {
        var self = this;
        this.game.dataService.getScene(sceneId, {}, function(scene)
        {

            var id, len;

            self.bus.trigger(
                "wse.interpreter.changescene.before",
                {
                    scene: scene,
                    interpreter: this
                },
                false
            );

            if (typeof scene === "undefined" || scene === null)
            {
                self.bus.trigger(
                    "wse.interpreter.error",
                    {
                        message: "Scene does not exist."
                    }
                );
                
                return;
            }

            id = scene.id;
            self.visitedScenes.push(id);

            if (id === null)
            {
                self.bus.trigger(
                    "wse.interpreter.error",
                    {
                        message: "Encountered scene without id attribute."
                    }
                );

                return;
            }

            self.bus.trigger("wse.interpreter.message", "Entering scene '" + id + "'.");
            
            self.currentCommands = scene.commands;

            len = self.currentCommands.length;
            self.index = 0;
            self.sceneId = id;
            self.currentElement = 0;

            if (len < 1)
            {
                self.bus.trigger(
                    "wse.interpreter.warning",
                    {
                        element: scene,
                        message: "Scene '" + id + "' is empty."
                    }
                );
                
                return;
            }

            self.numberOfFunctionsToWaitFor = 0;

            self.bus.trigger(
                "wse.interpreter.changescene.after",
                {
                    scene: scene,
                    interpreter: this
                },
                false
            );

            self.next();

        });
    };

    out.Interpreter.prototype.pushToCallStack = function ()
    {
        var obj = {};
        
        obj.index = this.index;
        obj.sceneId = this.sceneId;
        obj.currentElement = this.currentElement;
        
        this.callStack.push(obj);
    };

    out.Interpreter.prototype.popFromCallStack = function ()
    {
        var top = this.callStack.pop(), self = this;

        this.bus.trigger(
            "wse.interpreter.message",
            "Returning from sub scene '" + this.sceneId + "' to scene '" + top.sceneId + "'...",
            false
        );

        this.index = top.index + 1;
        this.sceneId = top.sceneId;
        this.currentElement = top.currentElement;
        this.getSceneById(top.sceneId, function(scene) {
            self.currentScene = scene;
        });
                
        this.currentCommands = this.currentScene.commands;
    };

    out.Interpreter.prototype.getSceneById = function (sceneName, callback)
    {
        this.game.dataService.getScene(sceneName, {}, callback);
    };

    out.Interpreter.prototype.next = function (triggeredByUser)
    {
        var nodeName, command, check, self, stopObj, bus = this.bus;

        stopObj = {
            stop: false
        };

        triggeredByUser = triggeredByUser === true ? true : false;

        bus.trigger("wse.interpreter.next.before", this, false);

        if (triggeredByUser === true)
        {
            bus.trigger("wse.interpreter.next.user", stopObj, false);
        }

        if (stopObj.stop === true)
        {
            return;
        }

        self = this;

        if (this.state === "pause")
        {
            return;
        }

        if (this.wait === true && this.waitCounter > 0)
        {
            setTimeout(function () { self.next(); }, 0);
            
            return;
        }

        if (this.wait === true && this.numberOfFunctionsToWaitFor < 1)
        {
            this.wait = false;
        }

        this.stopped = false;

        if (this.index >= this.currentCommands.length)
        {
            if (this.callStack.length > 0)
            {
                this.popFromCallStack();
                setTimeout(function () { self.next(); }, 0);
                
                return;
            }
            
            bus.trigger("wse.interpreter.next.after.end", this, false);
            bus.trigger("wse.interpreter.end", this);
            
            return;
        }

        command = this.currentCommands[this.index];
        nodeName = command.type;

        bus.trigger("wse.interpreter.next.command", command);
        this.currentElement += 1;
        check = this.runCommand(this.currentCommands[this.index]);

        check = check || {};
        check.doNext = check.doNext === false ? false : true;
        check.wait = check.wait === true ? true : false;
        check.changeScene = check.changeScene || null;

        if (check.wait === true)
        {
            this.wait = true;
        }

        this.index += 1;

        if (check.changeScene !== null)
        {
            this.changeScene(check.changeScene);
            
            return;
        }

        if (check.doNext === true)
        {
            setTimeout(function () { self.next(); }, 0);
            bus.trigger("wse.interpreter.next.after.donext", this, false);
            return;
        }

        this.stopped = true;

        bus.trigger("wse.interpreter.next.after.nonext", this, false);
    };

    out.Interpreter.prototype.runCommand = function (command)
    {
        var tagName, ifvar, ifval, ifnot, varContainer, assetName;
        var bus = this.bus, parsedCommand;

        this.bus.trigger(
            "wse.interpreter.runcommand.before", 
            {
                interpreter: this,
                command: command
            }, 
            false
        );

        tagName = command.type;
        assetName = command.asset || null;

        ifvar = command.ifvar || null;
        ifval = command.ifvalue;
        ifnot = command.ifnot;

        if (ifvar !== null || typeof ifval !== 'undefined' || typeof ifnot !== 'undefined')
        {
            varContainer = this.runVars;

            if (!(ifvar in varContainer))
            {
                bus.trigger(
                    "wse.interpreter.warning",
                    {
                        element: command,
                        message: "Unknown variable '" + ifvar + "' used in condition. Ignoring command."
                    }
                );
                
                bus.trigger(
                    "wse.interpreter.runcommand.after.condition.error.key",
                    {
                        interpreter: this,
                        command: command
                    }, 
                    false
                );
                
                return {
                    doNext: true
                };
            }

            if (ifnot !== null && ("" + varContainer[ifvar] === "" + ifnot))
            {
                bus.trigger("wse.interpreter.message", "Conidition not met. " + ifvar + "==" + ifnot);
                bus.trigger(
                    "wse.interpreter.runcommand.after.condition.false",
                    {
                        interpreter: this,
                        command: command
                    }, 
                    false
                );
                
                return {
                    doNext: true
                };
            }
            else if (ifval !== null && ("" + varContainer[ifvar]) !== "" + ifval)
            {
                bus.trigger("wse.interpreter.message", "Conidition not met.");
                bus.trigger(
                    "wse.interpreter.runcommand.after.condition.false",
                    {
                        interpreter: this,
                        command: command
                    }, 
                    false
                );
                
                return {
                    doNext: true
                };
            }

            bus.trigger(
                "wse.interpreter.runcommand.condition.met",
                {
                    interpreter: this,
                    command: command
                }, 
                false
            );
            
            bus.trigger("wse.interpreter.message", "Conidition met.");
        }

        if (tagName in this.commands)
        {
            bus.trigger(
                "wse.interpreter.runcommand.after.command",
                {
                    interpreter: this,
                    command: command
                }, 
                false
            );
            
            bus.trigger('game.commands.' + tagName);
            
            return this.commands[tagName](command, this);
        }
        else if (
            assetName !== null 
            && assetName in this.assets 
            && typeof this.assets[assetName][tagName] === "function" 
            && tagName.match(/(show|hide|clear|flicker|flash|play|start|stop|pause|move|set)/)
        )
        {
            bus.trigger('game.assets.' + assetName + '.' + tagName);
            
            return this.assets[assetName][tagName](command, this);
        }
        else
        {
            bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Unknown element '" + tagName + "'."
                }
            );
            
            bus.trigger(
                "wse.interpreter.runcommand.after.error",
                {
                    interpreter: this,
                    command: command
                },
                false
            );
            
            return {
                doNext: true
            };
        }
    };

    out.Interpreter.prototype.commands = {};
    out.commands = out.Interpreter.prototype.commands;

    out.Interpreter.prototype.createTriggers = function ()
    {
        var triggers, i, len, cur, curName, self, curTrigger, bus = this.bus;

        bus.trigger("wse.interpreter.triggers.create", this, false);

        self = this;

        this.triggers = {};

        try
        {
            triggers = this.game.dataService.getTriggers();
        }
        catch (e)
        {
            console.log(e);
            return;
        }

        for (i = 0, len = triggers.length; i < len; i += 1)
        {
            cur = triggers[i];
            curName = cur.name || null;

            if (curName === null)
            {
                bus.trigger(
                    "wse.interpreter.warning",
                    {
                        element: cur,
                        message: "No name specified for trigger."
                    }
                );
                
                continue;
            }

            if (typeof this.triggers[curName] !== "undefined" && this.triggers[curName] !== null)
            {
                bus.trigger(
                    "wse.interpreter.warning",
                    {
                        element: cur,
                        message: "A trigger with the name '" + curName + "' already exists."
                    }
                );
                
                continue;
            }

            curTrigger = new out.Trigger(cur, this);

            if (typeof curTrigger.fn === "function")
            {
                this.triggers[curName] = curTrigger;
            }
        }
    };

    out.Interpreter.prototype.createSaveGame = function ()
    {
        var assets, key, saves;

        saves = {};
        assets = this.assets;

        for (key in assets)
        {
            if (assets.hasOwnProperty(key))
            {
                try
                {
                    saves[key] = assets[key].save();
                }
                catch (e)
                {
                    console.log("WSE Internal Error: Asset '" + key + 
                        "' does not have a 'save' method!");
                }
            }
        }

        return saves;
    };

    out.Interpreter.prototype.restoreSaveGame = function (saves)
    {
        var assets, key;

        assets = this.assets;

        for (key in assets)
        {
            if (assets.hasOwnProperty(key))
            {
                try
                {
                    assets[key].restore(saves[key]);
                }
                catch (e)
                {
                    console.log(e);
                    bus.trigger("wse.interpreter.warning", {
                        message: "Could not restore asset state for asset '" + key + "'!"
                    });
                }
            }
        }
    };

    out.Interpreter.prototype.save = function (name)
    {
        name = name || "no name";

        var savegame, json, key, savegameList, listKey, lastKey, bus = this.bus;

        savegame = {};

        bus.trigger(
            "wse.interpreter.save.before",
            {
                interpreter: this,
                savegame: savegame
            }, 
            false
        );

        savegame.saves = this.createSaveGame();
        savegame.startTime = this.startTime;
        savegame.saveTime = Math.round(+new Date() / 1000);
        savegame.screenContents = this.stage.innerHTML;
        savegame.runVars = this.runVars;
        savegame.name = name;
        savegame.log = this.log;
        savegame.visitedScenes = this.visitedScenes;
        savegame.gameUrl = this.game.url;
        savegame.index = this.index;
        savegame.wait = this.wait;
        savegame.waitForTimer = this.waitForTimer;
        savegame.currentElement = this.currentElement;
        savegame.sceneId = this.sceneId;
        savegame.listenersSubscribed = this.game.listenersSubscribed;
        savegame.callStack = this.callStack;
        savegame.waitCounter = this.waitCounter;
        savegame.pathname = location.pathname;

        key = this.buildSavegameId(name);

        json = JSON.stringify(savegame);

        listKey = "wse_" + savegame.pathname + "_" + savegame.gameUrl + "_savegames_list";

        savegameList = JSON.parse(this.datasource.get(listKey));
        savegameList = savegameList || [];
        lastKey = savegameList.indexOf(key);
        
        if (lastKey >= 0)
        {
            savegameList.splice(lastKey, 1);
        }
        
        savegameList.push(key);

        try
        {
            this.datasource.set(key, json);
            this.datasource.set(listKey, JSON.stringify(savegameList));
        }
        catch (e)
        {
            bus.trigger(
                "wse.interpreter.warning",
                {
                    message: "Savegame could not be created!"
                }
            );
            
            bus.trigger(
                "wse.interpreter.save.after.error",
                {
                    interpreter: this,
                    savegame: savegame
                }, 
                false
            );
            
            return false;
        }

        bus.trigger(
            "wse.interpreter.save.after.success",
            {
                interpreter: this,
                savegame: savegame
            }
        );

        return true;
    };

    out.Interpreter.prototype.getSavegameList = function (reversed)
    {
        var json, key, names, i, len, out;
        
        key = "wse_" + location.pathname + "_" + this.game.url + "_savegames_list";
        json = this.datasource.get(key);
        
        if (json === null)
        {
            return [];
        }
        
        names = JSON.parse(json);
        out = [];
        
        for (i = 0, len = names.length; i < len; i += 1)
        {
            if (reversed === true)
            {
                out.unshift(JSON.parse(this.datasource.get(names[i])));
            }
            else
            {
                out.push(JSON.parse(this.datasource.get(names[i])));
            }
        }

        this.bus.trigger(
            "wse.interpreter.getsavegamelist",
            {
                interpreter: this,
                list: out,
                names: names
            }, 
            false
        );

        return out;
    };

    out.Interpreter.prototype.buildSavegameId = function (name)
    {
        var vars = {};
        
        vars.name = name;
        vars.id = "wse_" + location.pathname + "_" + this.game.url + "_savegame_" + name;

        this.bus.trigger(
            "wse.interpreter.save.before",
            {
                interpreter: this,
                vars: vars
            }, 
            false
        );

        return vars.id;
    };

    // *** LOAD FUNCTION CURRENTLY NEEDS WORK
    out.Interpreter.prototype.load = function (name)
    {
        var ds, savegame, scene, sceneId, scenes, i, len, self, savegameId, bus = this.bus;
        self = this;

        savegameId = this.buildSavegameId(name);

        ds = this.datasource;
        savegame = ds.get(savegameId);

        bus.trigger(
            "wse.interpreter.load.before",
            {
                interpreter: this,
                savegame: savegame
            }, 
            false
        );

        if (!savegame)
        {
            bus.trigger(
                "wse.interpreter.warning",
                {
                    message: "Could not load savegame '" + savegameId + "'!"
                }
            );
            return false;
        }

        savegame = JSON.parse(savegame);
        this.stage.innerHTML = savegame.screenContents;

        this.restoreSaveGame(savegame.saves);

        this.startTime = savegame.startTime;
        this.runVars = savegame.runVars;
        this.log = savegame.log;
        this.visitedScenes = savegame.visitedScenes;
        this.index = savegame.index;
        this.wait = savegame.wait;
        this.waitForTimer = savegame.waitForTimer;
        this.currentElement = savegame.currentElement;
        this.callStack = savegame.callStack;
        this.waitCounter = savegame.waitCounter;
        this.state = "listen";

        sceneId = savegame.sceneId;

        this.changeScene(sceneId);

        /* if (!scene)
        {
            bus.trigger(
                "wse.interpreter.error",
                {
                    message: "Loading savegame '" + savegameId + "' failed: Scene not found!"
                }
            );
            return false;
        }*/

        this.currentCommands = scene.childNodes;

        // Re-insert choice menu to get back the DOM events associated with it:
        // Remove savegame menu on load:
        (function (interpreter)
        {
            var elements, i, len, cur, index, type, com, rem;
            elements = interpreter.stage.getElementsByTagName("*");

            // console.log(elements);

            for (i = 0, len = elements.length; i < len; i += 1)
            {
                cur = elements[i];
                if (typeof cur === "undefined" || cur === null)
                {
                    continue;
                }

                type = cur.getAttribute("data-wse-type") || "";
                rem = cur.getAttribute("data-wse-remove") === "true" ? true : false;

                if (rem === true)
                {
                    interpreter.stage.removeChild(cur);
                }

                if (type !== "choice")
                {
                    continue;
                }

                index = parseInt(cur.getAttribute("data-wse-index"), 10) || null;

                if (index === null)
                {
                    interpreter.bus.trigger(
                        "wse.interpreter.warning",
                        {
                            message: "No data-wse-index found on element."
                        }
                    );
                    
                    continue;
                }

                com = interpreter.currentCommands[index];

                if (com.nodeName === "#text" || com.nodeName === "#comment")
                {
                    continue;
                }

                interpreter.stage.removeChild(cur);
                interpreter.commands.choice(com, interpreter);
                interpreter.waitCounter -= 1;
            }
        }(this));

        bus.trigger(
            "wse.interpreter.load.after",
            {
                interpreter: this,
                savegame: savegame
            }, 
            false
        );

        return true;
    };

    out.Interpreter.prototype.deleteSavegame = function (name)
    {
        var sgs, key, index, json, id;

        key = "wse_" + location.pathname + "_" + this.game.url + "_savegames_list";
        json = this.datasource.get(key);
        
        if (json === null)
        {
            return false;
        }
        
        sgs = JSON.parse(json);
        id = this.buildSavegameId(name);
        index = sgs.indexOf(id);

        if (index >= 0)
        {
            sgs.splice(index, 1);
            this.datasource.set("wse_" + location.pathname + "_" + this.game.url + "_savegames_list", JSON.stringify(sgs));
            this.datasource.remove(id);
            
            return true;
        }

        return false;
    };

    out.Interpreter.prototype.toggleSavegameMenu = function ()
    {
        var menu, deleteButton, loadButton, saveButton, self;
        var savegames, i, len, buttonPanel, resumeButton, id, sgList;
        var cur, curEl, makeClickFn, listenerStatus, curElapsed, oldState;

        self = this;
        id = "WSESaveGameMenu_" + this.game.url;
        listenerStatus = this.game.listenersSubscribed;

        menu = document.getElementById(id) || null;

        if (menu !== null)
        {
            try
            {
                listenerStatus = menu.getAttribute("data-wse-listener-status") === "true" ? true : false;
                this.stage.removeChild(menu);
            }
            catch (e)
            {
                console.log(e);
            }
            
            if (listenerStatus === true)
            {
                this.savegameMenuVisible = false;
            }
            
            this.state = this.oldStateInSavegameMenu;
            this.waitCounter -= 1;
            
            return;
        }

        if (this.stopped !== true)
        {
            setTimeout(function () { self.toggleSavegameMenu(); }, 20);
            
            return;
        }

        oldState = this.state;
        this.oldStateInSavegameMenu = oldState;
        this.state = "pause";
        this.waitCounter += 1;
        this.savegameMenuVisible = true;

        menu = document.createElement("div");
        menu.innerHTML = "";
        menu.setAttribute("id", id);
        menu.setAttribute("class", "WSESavegameMenu");
        menu.setAttribute("data-wse-remove", "true");
        menu.setAttribute("data-wse-listener-status", listenerStatus);
        menu.style.zIndex = 100000;
        menu.style.position = "absolute";

        savegames = this.getSavegameList(true);

        deleteButton = document.createElement("input");
        deleteButton.setAttribute("class", "button delete");
        deleteButton.setAttribute("type", "button");
        deleteButton.value = "Delete";
        deleteButton.addEventListener(
            "click",
            function (ev)
            {
                var active, savegameName, fn;
                
                ev.stopPropagation();
                ev.preventDefault();
            
                active = menu.querySelector(".active") || null;
            
                if (active === null)
                {
                    return;
                }
                
                savegameName = active.getAttribute("data-wse-savegame-name");
            
                fn = function (decision)
                {
                    if (decision === false)
                    {
                        return;
                    }
                    
                    self.deleteSavegame(savegameName);
                    self.toggleSavegameMenu();
                    self.toggleSavegameMenu();
                };
                
                out.tools.ui.confirm(
                    self,
                    {
                        title: "Delete game?",
                        message: "Do you really want to delete savegame '" + savegameName + "'?",
                        callback: fn
                    }
                );
            },
            false
        );

        saveButton = document.createElement("input");
        saveButton.setAttribute("class", "button save");
        saveButton.setAttribute("type", "button");
        saveButton.value = "Save";
        
        saveButton.addEventListener(
            "click",
            function (ev)
            {
                var active, savegameName;
                
                ev.stopPropagation();
                ev.preventDefault();
                
                active = menu.querySelector(".active") || null;
                
                if (active === null)
                {
                    out.tools.ui.prompt(
                        self,
                        {
                            title: "New savegame",
                            message: "Please enter a name for the savegame:",
                            callback: function (data)
                            {
                                if (data === null)
                                {
                                    return;
                                }
                                
                                if (!data)
                                {
                                    out.tools.ui.alert(
                                        self,
                                        {
                                            title: "Error",
                                            message: "The savegame name cannot be empty!"
                                        }
                                    );
                                    
                                    return;
                                }
                                
                                self.toggleSavegameMenu();
                                self.game.listenersSubscribed = listenerStatus;
                                self.save(data);
                                self.toggleSavegameMenu();
                                self.game.listenersSubscribed = false;
                                
                                out.tools.ui.alert(
                                    self,
                                    {
                                        title: "Game saved",
                                        message: "Your game has been saved."
                                    }
                                );
                            }
                        }
                    );
                    
                    return;
                }
            
                savegameName = active.getAttribute("data-wse-savegame-name");
            
                out.tools.ui.confirm(
                    self,
                    {
                        title: "Overwrite savegame?",
                        message: "You are about to overwrite an old savegame. Are you sure?",
                        trueText: "Yes",
                        falseText: "No",
                        callback: function (decision)
                        {
                            if (decision === false)
                            {
                                return;
                            }
                            
                            self.toggleSavegameMenu();
                            self.save(savegameName);
                            self.toggleSavegameMenu();
                            
                            out.tools.ui.alert(
                                self,
                                {
                                    title: "Game saved",
                                    message: "Your game has been saved."
                                }
                            );
                        }
                    }
                );
            },
            false
        );

        loadButton = document.createElement("input");
        loadButton.setAttribute("class", "button load");
        loadButton.setAttribute("type", "button");
        loadButton.setAttribute("tabindex", 1);
        loadButton.value = "Load";
        loadButton.addEventListener(
            "click",
            function (ev)
            {
                var active, savegameName, fn;
                
                ev.stopPropagation();
                ev.preventDefault();
                
                active = menu.querySelector(".active") || null;
                
                if (active === null)
                {
                    return;
                }
                
                savegameName = active.getAttribute("data-wse-savegame-name");
                
                fn = function (decision)
                {
                    if (decision === false)
                    {
                        return;
                    }
                    
                    self.stage.removeChild(document.getElementById(id));
                    self.savegameMenuVisible = false;
                    self.waitCounter -= 1;
                    self.state = oldState;
                    self.load(savegameName);
                };
                
                out.tools.ui.confirm(
                    self,
                    {
                        title: "Load game?",
                        message: "Loading a savegame will discard all unsaved progress. Continue?",
                        callback: fn
                    }
                );
            },
            false
        );

        buttonPanel = document.createElement("div");
        buttonPanel.setAttribute("class", "panel");
        resumeButton = document.createElement("input");
        resumeButton.setAttribute("class", "button resume");
        resumeButton.setAttribute("type", "button");
        resumeButton.value = "Resume";
        
        resumeButton.addEventListener(
            "click",
            function (ev)
            {
                ev.stopPropagation();
                ev.preventDefault();
                self.stage.removeChild(document.getElementById(id));
                self.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.decrease", null, false);
                self.savegameMenuVisible = false;
                self.waitCounter -= 1;
                self.state = oldState;
            },
            false
        );

        sgList = document.createElement("div");
        sgList.setAttribute("class", "list");

        buttonPanel.appendChild(loadButton);
        buttonPanel.appendChild(saveButton);
        buttonPanel.appendChild(deleteButton);
        buttonPanel.appendChild(resumeButton);
        menu.appendChild(buttonPanel);

        makeClickFn = function (curEl)
        {
            return function (event)
            {
                var old;
                
                event.stopPropagation();
                event.preventDefault();
                
                try
                {
                    old = sgList.querySelector(".active") || null;
                    
                    if (old !== null)
                    {
                        old.setAttribute("class", old.getAttribute("class").replace(/active/, ""));
                    }
                }
                catch (e)
                {
                    console.log(e);
                }
                
                curEl.setAttribute("class", curEl.getAttribute("class") + " active");
                loadButton.focus();
            };
        };

        curEl = document.createElement("div");
        curEl.setAttribute("class", "button");

        for (i = 0, len = savegames.length; i < len; i += 1)
        {
            cur = savegames[i];
            curEl = document.createElement("div");
            curElapsed = cur.saveTime - cur.startTime;
            curEl.setAttribute("class", "button");
            curEl.setAttribute("data-wse-savegame-name", cur.name);
            
            curEl.innerHTML = '' + 
                '<p class="name">' + 
                    cur.name + 
                '</p>' + 
                '<p class="description">' + 
                    '<span class="elapsed">' + 
                        parseInt((curElapsed / 60) / 60, 10) + 'h ' + 
                        parseInt((curElapsed / 60) % 60, 10) + 'm ' + 
                        parseInt(curElapsed % 60, 10) + 's' + 
                    '</span>' + 
                    '<span class="date">' + 
                        new Date(cur.saveTime * 1000).toUTCString() + 
                    '</span>' + 
                '</p>';
            
            curEl.addEventListener("click", makeClickFn(curEl, cur), false);
            sgList.appendChild(curEl);
        }

        menu.addEventListener(
            "click",
            function (ev)
            {
                var active;
            
                ev.stopPropagation();
                ev.preventDefault();
                active = menu.querySelector(".active") || null;
            
                if (active === null)
                {
                    return;
                }
            
                active.setAttribute("class", active.getAttribute("class").replace(/active/, ""));
            },
            false
        );

        menu.appendChild(sgList);

        this.stage.appendChild(menu);
    };

}(WSE));
