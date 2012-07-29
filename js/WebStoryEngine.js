/*global Squiddle: true, MO5: true, STEINBECK: true */
/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, 
    strict:true, undef:true, curly:true, browser:true, node:true, 
    indent:4, maxerr:50, globalstrict:true */
var WSE = (function (Squiddle, MO5, STEINBECK)
{
    "use strict";

    var out = {};

    out.fx = MO5;
    out.Keys = STEINBECK.Keys;

    out.ajax = {};

    out.ajax.get = function (url, cb)
    {
        url = url + "?random=" + Math.random();
        //console.log("Requesting remote file: " + url);
        var http = new XMLHttpRequest();
        http.onreadystatechange = function ()
        {
            //console.log("AJAX state change occured.");
            if (http.readyState === 4 && http.status === 200)
            {
                //console.log("File fetched.");
                cb(http);
            }
            if (http.readyState === 4 && http.status !== 200)
            {
                throw new Error("WSE: Cannot load XML file.");
            }
        };
        if (http.overrideMimeType)
        {
            http.overrideMimeType("text/xml");
        }
        http.open("GET", url, true);
        http.send();
    };

    out.Game = function (args)
    {
        args = args || {};
        this.bus = new Squiddle();
        this.url = args.url || "game.xml";
        this.ws = null;
        this.load(this.url);
        this.interpreter = new out.Interpreter(this);
        this.keys = new out.Keys();
        this.listenersSubscribed = false;
        //console.log("this.interpreter: ", this.interpreter);
        
        this.bus.subscribe(
            function (data)
            {
                console.log("Message: " + data);
            }, 
            "wse.interpreter.message"
        );
        
        this.bus.subscribe(
            function (data)
            {
                console.log("Error: " + data.message);
            }, 
            "wse.interpreter.error"
        );
        
        this.bus.subscribe(
            function (data)
            {
                console.log("Warning: " + data.message, data.element);
            }, "wse.interpreter.warning"
        );
    };

    out.Game.prototype.load = function (url)
    {
        //console.log("Loading game file...");
        var fn, self;
        self = this;
        fn = function (obj)
        {
            self.ws = obj.responseXML;
            //console.log("Response XML: " + obj.responseXML);
            self.init();
        };
        out.ajax.get(this.url, fn);
    };

    out.Game.prototype.init = function ()
    {
        //console.log("Initializing game...");
        var ws, stage, stageElements, stageInfo, width, height, id, self, alignFn;
        self = this;
        ws = this.ws;
        stageElements = ws.getElementsByTagName("stage");
        width = "800px";
        height = "480px";
        id = "Stage";
        if (stageElements.length < 1)
        {
            throw new Error("No stage definition found!");
        }
        stageInfo = stageElements[0];
        width = stageInfo.getAttribute("width") || width;
        height = stageInfo.getAttribute("height") || height;
        id = stageInfo.getAttribute("id") || id;
        if (stageInfo.getAttribute("create") === "yes")
        {
            stage = document.createElement("div");
            stage.setAttribute("id", id);
            document.body.appendChild(stage);
        }
        else
        {
            stage = document.getElementById(id);
        }

        alignFn = function ()
        {
            var dim = out.fx.getWindowDimensions();
            stage.style.left = (dim.width / 2) - (parseInt(width, 10) / 2) + 'px';
            stage.style.top = (dim.height / 2) - (parseInt(height, 10) / 2) + 'px';
        };

        stage.style.width = width;
        stage.style.height = height;

        if (stageInfo.getAttribute("center") === "yes")
        {
            out.tools.attachEventListener(window, 'resize', alignFn);
            alignFn();
        }
        this.stage = stage;
        //     stage.onclick = function() { self.interpreter.next(); };
    };

    out.Game.prototype.start = function ()
    {
        var fn, self;
        self = this;

        if (this.ws === null)
        {
            return setTimeout( function () { self.start(); } );
        }

        this.next = function ()
        {
            self.bus.trigger("wse.game.next", this);
            self.interpreter.next(true);
        };
        fn = function ()
        {
            self.interpreter.next();
        };
        this.subscribeListeners = function ()
        {
            out.tools.attachEventListener(this.stage, 'click', fn);
            this.keys.addListener(this.keys.keys.RIGHT_ARROW, this.next);
            this.keys.addListener(this.keys.keys.SPACE, this.next);
            this.listenersSubscribed = true;
        };
        this.unsubscribeListeners = function ()
        {
            out.tools.removeEventListener(this.stage, 'click', fn);
            this.keys.removeListener(this.keys.keys.RIGHT_ARROW, this.next);
            this.keys.removeListener(this.keys.keys.SPACE, this.next);
            this.listenersSubscribed = false;
        };
        this.interpreter.start();
    };



    out.Interpreter = function (game)
    {
        if (!(this instanceof out.Interpreter))
        {
            return new out.Interpreter(game);
        }

        this.game = game;
        this.assets = {};
        this.index = 0;
        this.visitedScenes = [];
        this.log = [];
        this.waitForTimer = false;
        this.assetsLoading = 0;
        this.assetsLoadingMax = 0;
        this.assetsLoaded = 0;
        this.startTime = 0;
        this.runVars = {};
        this.globalVars = {};
        
        this.datasource = new out.datasources.LocalStorage();
    };

    out.Interpreter.prototype.buildLoadingScreen = function ()
    {
        var loadScreen, heading, self, fn;

        self = this;

        loadScreen = document.createElement("div");
        loadScreen.setAttribute("id", "WSELoadingScreen");
        loadScreen.style.zIndex = 10000;
        loadScreen.style.width = "100%";
        loadScreen.style.height = "100%";

        loadScreen.innerHTML = '' + '<div class="container">' + '<div class="heading"><span id="WSELoadingScreenPercentage"></span>Loading assets...</div>' + '<div class="progressBar">' + '<div class="progress" id="WSELoadingScreenProgress" style="width: 100%;">' + '</div>' + '</div>' + '</div>' + '';

        this.game.stage.appendChild(loadScreen);

        fn = function ()
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
                console.log("Element missing.");
            }
        };

        this.bus.subscribe(fn, "wse.assets.loading.increase");

        this.bus.subscribe(fn, "wse.assets.loading.decrease");

        this.loadScreen = loadScreen;
    };

    out.Interpreter.prototype.start = function ()
    {
        this.story = this.game.ws;
        this.stage = this.game.stage;
        this.bus = this.game.bus;
        this.index = 0;
        this.currentElement = 0;
        this.sceneId = null;
        this.commans = [];
        this.wait = false;
        //     this.rush = false;

        var self, fn;

        self = this;

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
                    break;
            }
            console.log(msg);
        };
        
        this.bus.subscribe(fn, "wse.interpreter.error");
        this.bus.subscribe(fn, "wse.interpreter.warning");
        this.bus.subscribe(fn, "wse.interpreter.message");
        this.bus.subscribe(
            function ()
            {
                console.log("Game over.");
            }, 
            "wse.interpreter.end"
        );

        this.bus.subscribe(
            function ()
            {
                self.numberOfFunctionsToWaitFor += 1;
            }, 
            "wse.interpreter.numberOfFunctionsToWaitFor.increase"
        );

        this.bus.subscribe(
            function ()
            {
                self.numberOfFunctionsToWaitFor -= 1;
            }, 
            "wse.interpreter.numberOfFunctionsToWaitFor.decrease"
        );

        this.bus.subscribe(
            function ()
            {
                self.assetsLoading += 1;
                self.assetsLoadingMax += 1;
            }, 
            "wse.assets.loading.increase"
        );

        this.bus.subscribe(
            function ()
            {
                self.assetsLoading -= 1;
                self.assetsLoaded += 1;
            }, 
            "wse.assets.loading.decrease"
        );

        this.bus.subscribe(

        function ()
        {
            document.getElementById("WSELoadingScreenProgress").style.width = "100%";
            out.fx.transform(
                function (v)
                {
                    self.loadScreen.style.opacity = v;
                }, 
                1, 
                0, 
                {
                    duration: 500,
                    onFinish: function ()
                    {
                        self.loadScreen.style.display = "none";
                    }
                }
            );
            console.log("Hiding loading screen...");
        }, "wse.assets.loading.finished");

        this.buildAssets();
        setTimeout(
            function ()
            {
                self.runStory();
            }, 
            1000
        );
    };

    out.Interpreter.prototype.runStory = function ()
    {
        var scenes, len, i, current, self;

        self = this;

        if (this.assetsLoading > 0)
        {
            return setTimeout(function ()
            {
                self.runStory();
            }, 100);
        }
        this.bus.trigger("wse.assets.loading.finished");

        //console.log("Running story...");
        scenes = this.story.getElementsByTagName("scene");
        this.scenes = scenes;
        len = scenes.length;
        for (i = 0; i < len; i += 1)
        {
            current = scenes[i];
            if (current.getAttribute("id") === "start")
            {
                this.changeScene(current);
                return;
            }
        }
        if (len < 1)
        {
            this.bus.trigger("wse.interpreter.error", {
                message: "No scenes found!"
            });
            return;
        }
        this.startTime = new Date().getTime();
        this.changeScene(scenes[0]);
    };

    out.Interpreter.prototype.changeScene = function (scene)
    {
        var children, len, i, nodeName, id;

        if (typeof scene === "undefined" || scene === null)
        {
            this.bus.trigger("wse.interpreter.error", {
                message: "Scene does not exist."
            });
            return;
        }

        id = scene.getAttribute("id");

        this.visitedScenes.push(id);

        if (id === null)
        {
            this.bus.trigger("wse.interpreter.error", {
                message: "Encountered scene without id attribute."
            });
            return;
        }

        this.bus.trigger("wse.interpreter.message", "Entering scene '" + id + "'.");
        this.commands = scene.childNodes;
        len = this.commands.length;
        this.index = 0;
        this.sceneId = id;
        this.currentElement = 0;

        if (len < 1)
        {
            this.bus.trigger("wse.interpreter.warning", {
                element: scene,
                message: "Scene '" + id + "' is empty."
            });
            return;
        }

        this.numberOfFunctionsToWaitFor = 0;

        this.next();
    };

    out.Interpreter.prototype.next = function (triggeredByUser)
    {
        var nodeName, command, check, self, waiter;

        this.game.unsubscribeListeners();

        triggeredByUser = triggeredByUser === true ? true : false;

        self = this;

        if (this.waitForTimer === true || (this.wait === true && this.numberOfFunctionsToWaitFor > 0))
        {
            setTimeout(function ()
            {
                self.next();
            }, 10);
            //         console.log("Waiting...");
            return;
        }

        if (this.wait === true && this.numberOfFunctionsToWaitFor < 1)
        {
            //         console.log("Waiting stopped.");
            this.wait = false;
            this.game.subscribeListeners();
        }

        if (this.index >= this.commands.length)
        {
            this.bus.trigger("wse.interpreter.end", this);
            return;
        }

        command = this.commands[this.index];
        nodeName = command.nodeName;

        // ignore text and comment nodes:
        if (nodeName === "#text" || nodeName === "#comment")
        {
            this.index += 1;
            setTimeout(function ()
            {
                self.next();
            }, 0);
            return;
        }

        this.bus.trigger("wse.interpreter.next", command);
        this.currentElement += 1;
        check = this.runCommand(this.commands[this.index]);

        check = check || {};
        check.doNext = (typeof check.doNext !== "undefined" && check.doNext === false) ? false : true;
        check.wait = check.wait === true ? true : false;
        check.changeScene = check.changeScene || null;

        //     console.log("check.wait: " + check.wait);

        if (check.wait === true)
        {
            this.wait = true;
            //         this.game.unsubscribeListeners();
            //         setTimeout(function() { self.next(); }, 0);
            //         return;
        }

        this.index += 1;

        if (check.changeScene !== null)
        {
            this.changeScene(check.changeScene);
            return;
        }

        if (check.doNext === true)
        {
            setTimeout(function ()
            {
                self.next();
            }, 0);
            return;
        }

        //     this.game.subscribeListeners():
    };

    out.Interpreter.prototype.runCommand = function (command)
    {
        var tagName, ifkey, ifval, ifscope, varContainer;
        tagName = command.tagName;
        
        ifkey = command.getAttribute("ifkey") || null;
        ifval = command.getAttribute("ifvalue") || null;
        ifscope = command.getAttribute("ifscope") || "run";
        
        if (ifkey !== null && ifval !== null)
        {
            varContainer = ifscope === "run" ? this.runVars : this.globalVars;
            
            if (!(ifkey in varContainer))
            {
                this.bus.trigger(
                    "wse.interpreter.warning", 
                    {
                        element: command,
                        message: "Unknown key '" + ifkey + "' (" + ifscope + " scope) used in condition. Ignoring command."
                    }
                );
                return {
                    doNext: true
                };
            }
            
            if (varContainer[ifkey] != ifval)
            {
                this.bus.trigger("wse.interpreter.message", "Conidition not met.");
                return {
                    doNext: true
                };
            }
            
            this.bus.trigger("wse.interpreter.message", "Conidition met.");
        }
        
        switch (tagName)
        {
            case "var":
                return this.runVarCommand(command);
            case "do":
                return this.runDoCommand(command);
            case "line":
                return this.runLineCommand(command);
            case "goto":
                return this.runGotoCommand(command);
            case "choice":
                return this.runChoiceCommand(command);
            case "wait":
                return this.runWaitCommand(command);
            case "restart":
                return this.runRestartCommand(command);
            case "stop":
                this.game.subscribeListeners();
                return {
                    doNext: false,
                    wait: true
                };
            default:
                this.bus.trigger("wse.interpreter.warning", {
                    element: command,
                    message: "Unknown element '" + tagName + "'."
                });
                return {
                    doNext: true
                };
        }
    };
    
    out.Interpreter.prototype.runRestartCommand = function (command)
    {
        this.bus.trigger(
            "wse.interpreter.message",
            "Restarting game...",
            false
        );
        
        this.bus.trigger(
            "wse.interpreter.restart",
            this,
            false
        );
        
        this.runVars = {};
        this.log = [];
        this.visitedScenes = [];
        this.startTime = new Date().getTime();
        
        return {
            doNext: true,
            changeScene: this.scenes[0]
        };
    };
    
    out.Interpreter.prototype.runVarCommand = function (command)
    {
        var key, val, scope, action, container;
        key = command.getAttribute("key") || null;
        val = command.getAttribute("value") || null;
        scope = command.getAttribute("scope") || null;
        action = command.getAttribute("action") || "set";
        
        if (key === null)
        {
            this.bus.trigger(
                "wse.interpreter.warning", 
                {
                    element: command,
                    message: "Command 'var' must have a 'key' attribute."
                }
            );
            return { doNext: true };
        }
        
        if (action === "set" && scope !== null && scope !== "run" && scope !== "global")
        {
            this.bus.trigger(
                "wse.interpreter.warning", 
                {
                    element: command,
                    message: "Unknown scope defined on 'var' command."
                }
            );
            return { doNext: true };
        }
        
        if (action !== "set" 
            && action !== "delete" 
            && action !== "increase" 
            && action !== "decrease"
            && action !== "print")
        {
            this.bus.trigger(
                "wse.interpreter.warning", 
                {
                    element: command,
                    message: "Unknown action '" + action + "' defined on 'var' command."
                }
            );
            return { doNext: true };
        }
        
        if (scope === null)
        {
            if (key in this.runVars)
            {
                scope = "run";
            }
            else if (key in this.globalVars)
            {
                scope = "global";
            }
            else
            {
                scope = "run";
            }
        }
        
        container = scope === "run" ? this.runVars : this.globalVars;
        
        if (action !== "set" && !command.getAttribute("ifstate") && !(key in container))
        {
            this.bus.trigger(
                "wse.interpreter.warning", 
                {
                    element: command,
                    message: "Unknown key used in 'var' command."
                }
            );
            return { doNext: true };
        }
        
        if (command.getAttribute("ifstate") === "unset" && key in container)
        {
            return { doNext: true };
        }
        else if (command.getAttribute("ifstate") === "set" && !(key in container))
        {
            return { doNext: true };
        }
        
        switch (action)
        {
            case "delete":
                delete container[key];
                break;
            case "increase":
                container[key]++;
                break;
            case "decrease":
                container[key]--;
                break;
            case "print":
                this.bus.trigger(
                    "wse.interpreter.message",
                    "Variable '" + key + "' (" + scope + " scope) is: " + container[key]
                );
                break;
            case "set":
            default:
                container[key] = val;
        }
        
        return { doNext: true };
    };

    out.Interpreter.prototype.runWaitCommand = function (command)
    {
        var duration, self;

        self = this;
        duration = command.getAttribute("duration");

        if (duration !== null)
        {
            duration = parseInt(duration, 10);
            this.waitForTimer = true;
            setTimeout(

            function ()
            {
                self.waitForTimer = false;
            }, duration);
            return {
                doNext: true,
                wait: false
            };
        }

        return {
            doNext: true,
            wait: true
        };
    };

    out.Interpreter.prototype.runChoiceCommand = function (command)
    {
        var menuElement, buttons, children, len, i, current, duration, 
            currentButton, scenes, self, j, jlen, currentScene, sceneName,
            makeButtonClickFn;

        buttons = [];
        scenes = [];
        self = this;
        children = command.getElementsByTagName("option");
        len = children.length;
        duration = command.getAttribute("duration") || 500;
        duration = parseInt(duration, 10);

        makeButtonClickFn = function (cur, me, sc)
        {
            sc = sc || null;
            return function ()
            {
                setTimeout(
                    function ()
                    {
                        var cmds, i, len;
                        cmds = cur.getElementsByTagName("var");
                        len = cmds.length;
                        
                        for (i = 0; i < len; i += 1)
                        {
                            self.runVarCommand(cmds[i]);
                        }
                        
                        if (sc !== null)
                        {
                            self.changeScene(sc);
                            return;
                        }
                        
                        self.next();
                    }, 
                    0
                );
                self.stage.removeChild(me);
            };
        };
        
        if (len < 1)
        {
            this.bus.trigger("wse.interpreter.warning", {
                element: command,
                message: "Element 'choice' is empty. Expected at least one 'option' element."
            });
        }

        menuElement = document.createElement("div");
        menuElement.setAttribute("class", "menu");

        for (i = 0; i < len; i += 1)
        {
            current = children[i];
            currentButton = document.createElement("div");
            currentButton.setAttribute("class", "button");
            currentButton.innerHTML = current.getAttribute("label");
            
            sceneName = current.getAttribute("scene") || null;
            for (j = 0, jlen = this.scenes.length; j < jlen; j += 1)
            {
                currentScene = this.scenes[j];
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
        this.stage.appendChild(menuElement);

        out.assets.mixins.show(command, {
            element: menuElement,
            bus: this.bus,
            stage: this.stage
        });

        return {
            doNext: false,
            wait: true
        };
    };

    out.Interpreter.prototype.runGotoCommand = function (command)
    {
        var scene, sceneName, i, len, current;

        sceneName = command.getAttribute("scene");

        if (sceneName === null)
        {
            this.bus.trigger("wse.interpreter.error", {
                message: "Element 'goto' misses attribute 'scene'."
            });
        }

        for (i = 0, len = this.scenes.length; i < len; i += 1)
        {
            current = this.scenes[i];
            if (current.getAttribute("id") === sceneName)
            {
                scene = current;
                break;
            }
        }

        if (typeof scene === "undefined")
        {
            this.bus.trigger("wse.interpreter.error", {
                message: "Unknown scene '" + sceneName + "'."
            });
            return;
        }

        return {
            changeScene: scene
        };
    };

    out.Interpreter.prototype.runLineCommand = function (command)
    {
        var speakerId, speakerName, textboxName, i, len, current, assetElements, text, doNext;

        this.game.subscribeListeners();

        speakerId = command.getAttribute("s");
        doNext = command.getAttribute("stop") === "false" ? true : false;

        if (speakerId === null)
        {
            this.bus.trigger("wse.interpreter.warning", {
                element: command,
                message: "Element 'line' requires attribute 's'."
            });
            return {
                doNext: true
            };
        }

        assetElements = this.story.getElementsByTagName("asset");
        len = assetElements.length;
        for (i = 0; i < len; i += 1)
        {
            current = assetElements[i];
            if (current.getAttribute("type") === "character" && current.getAttribute("name") === speakerId)
            {
                textboxName = current.getAttribute("textbox");
                if (typeof textboxName === "undefined" || textboxName === null)
                {
                    this.bus.trigger("wse.interpreter.warning", {
                        element: command,
                        message: "No textbox defined for character '" + speakerId + "'."
                    });
                    return {
                        doNext: true
                    };
                }
                try
                {
                    speakerName = current.getElementsByTagName("name")[0].childNodes[0].nodeValue;
                }
                catch (e)
                {}
                break;
            }
        }

        if (typeof this.assets[textboxName] === "undefined")
        {
            this.bus.trigger("wse.interpreter.warning", {
                element: command,
                message: "Trying to use an unknown textbox or character."
            });
            return {
                doNext: true
            };
        }

        text = command.childNodes[0].nodeValue;
        this.log.push(
        {
            speaker: speakerId,
            text: text
        });
        this.assets[textboxName].put(text, speakerName);
        return {
            doNext: doNext,
            wait: true
        };
    };

    out.Interpreter.prototype.runDoCommand = function (command, args)
    {
        args = args || {};

        var assetName, action, isAnimation;

        assetName = command.getAttribute("asset");
        action = command.getAttribute("action");
        isAnimation = args.animation || false;

        if (assetName === null)
        {
            this.bus.trigger("wse.interpreter.warning", {
                element: command,
                message: "Element of type 'do' must have an attribute 'asset'. Element ignored."
            });
            return;
        }

        if (action === null)
        {
            this.bus.trigger("wse.interpreter.warning", {
                element: command,
                message: "Element of type 'do' must have an attribute 'action'. Element ignored."
            });
            return;
        }

        if (typeof this.assets[assetName] === "undefined" || this.assets[assetName] === null)
        {
            this.bus.trigger("wse.interpreter.warning", {
                element: command,
                message: "Reference to unknown asset '" + assetName + "'."
            });
            return {
                doNext: true
            };
        }

        if (typeof this.assets[assetName][action] === "undefined")
        {
            this.bus.trigger("wse.interpreter.warning", {
                element: command,
                message: "Action '" + action + "' is not defined for asset '" + assetName + "'."
            });
            return {
                doNext: true
            };
        }

        return this.assets[assetName][action](command, args);
    };

    out.Interpreter.prototype.buildAssets = function ()
    {
        var assets, len, i;

        this.bus.trigger("wse.assets.loading.started");

        assets = this.story.getElementsByTagName("asset");
        len = assets.length;

        for (i = 0; i < len; i += 1)
        {
            this.createAsset(assets[i]);
        }
    };

    out.Interpreter.prototype.createAsset = function (asset)
    {
        var name, type, self;
        name = asset.getAttribute("name");
        type = asset.getAttribute("type");
        self = this;

        if (name === null)
        {
            this.game.bus.trigger("wse.interpreter.error", {
                element: asset,
                message: "Expected attribute 'name'."
            });
            return;
        }

        if (type === null)
        {
            this.game.bus.trigger("wse.interpreter.warning", {
                element: asset,
                message: "Expected attribute 'type' on asset '" + name + "'."
            });
            return;
        }

        if (typeof this.assets[name] !== "undefined")
        {
            this.game.bus.trigger("wse.interpreter.warning", {
                element: asset,
                message: "Trying to override existing asset '" + name + "'."
            });
        }

        switch (type)
        {
            case "textbox":
                this.assets[name] = new out.assets.Textbox(
                    asset, 
                    this.stage, 
                    this.bus, 
                    {
                        replaceVariables: function (text) { return out.tools.replaceVariables(text, self); }
                    }
                );
                break;
            case "character":
                this.assets[name] = new out.assets.Character(asset, this.stage, this.bus);
                break;
            case "imagepack":
                this.assets[name] = new out.assets.Imagepack(asset, this.stage, this.bus);
                break;
            case "audio":
                this.assets[name] = new out.assets.Audio(asset, this.bus);
                break;
            case "animation":
                this.assets[name] = new out.assets.Animation(asset, this.stage, this.bus, this.assets, this);
                break;
            default:
                this.game.bus.trigger(
                    "wse.interpreter.warning", 
                    {
                        element: asset,
                        message: "Unknown asset type '" + type + "'."
                    }
                );
                return;
        }
    };
    
    out.Interpreter.prototype.createSaveGame = function()
    {
        var assets, key, saves, cur;
        
        saves = {};
        assets = this.assets;
        
        for (key in assets)
        {
            if (assets.hasOwnProperty(key))
            {
                try
                {
                    assets[key].save(saves);
                }
                catch (e)
                {
                    console.log("WSE Internal Error: Asset '" + key + "' does not have a 'save' method!");
                }
            }
        }
        
        return saves;
    };
    
    out.Interpreter.prototype.restoreSaveGame = function(saves)
    {
        var assets, key, cur;
        
        assets = this.assets;
        
        for (key in assets)
        {
            if (assets.hasOwnProperty(key))
            {
                try
                {
                    assets[key].restore(saves);
                }
                catch (e)
                {
                    console.log("WSE Internal Error: Asset '" + key + "' does not have a 'load' method!");
                }
            }
        }
    };
    
    out.Interpreter.prototype.save = function(name)
    {
        name = name || "no name";
        
        var savegame, json, key, savegameList, listKey;
        
        savegame = {};
        savegame.saves = this.createSaveGame();
        savegame.startTime = this.startTime;
        savegame.currentTime = new Date().getTime();
        savegame.screenContents = this.stage.innerHTML;
        savegame.runVars = this.runVars;
        savegame.globalVars = this.globalVars;
        savegame.name = name;
        savegame.log = this.log;
        savegame.visitedScenes = this.visitedScenes;
        savegame.gameUrl = this.game.url;
        savegame.index = this.index;
        savegame.wait = this.wait;
        savegame.currentElement = this.currentElement;
        savegame.sceneId = this.sceneId;
        savegame.listenersSubscribed = this.game.listenersSubscribed;
        
        key = "wse_" + savegame.gameUrl + "_savegame_" + name;
        
        json = JSON.stringify(savegame);
        
        listKey = "wse_" + savegame.gameUrl + "_savegames_list";
        
        savegameList = JSON.parse(this.datasource.get(listKey));
        savegameList = savegameList || [];
        savegameList.push(key);
        
        try
        {
            this.datasource.set(key, json);
            this.datasource.set(listKey, JSON.stringify(savegameList));
        }
        catch (e)
        {
            this.bus.trigger("wse.interpreter.warning", { message: "Savegame could not be created!" });
            return false;
        }
        
        this.bus.trigger("wse.interpreter.save", { interpreter: this, savegame: savegame });
        
        return true;
    };
    
    out.Interpreter.prototype.getSavegameList = function ()
    {
        var json, key;
        key = "wse_" + this.game.url + "_savegames_list";
        console.log("key is: ", key);
        json = this.datasource.get(key);
        console.log("JSON is: ", json);
        return JSON.parse();
    };
    
    out.Interpreter.prototype.load = function (name)
    {
        var ds, savegame, scene, sceneId, scenes, i, len, self, savegameId;
        self = this;
        
        savegameId = "wse_" + this.game.url + "_savegame_" + name;
        
        ds = this.datasource;
        savegame = ds.get(savegameId);
        
        if (!savegame)
        {
            this.bus.trigger(
                "wse.interpreter.warning",
                { message: "Could not load savegame '" + savegameId + "'!" }
            );
            return false;
        }
        
        savegame = JSON.parse(savegame);
        
        this.restoreSaveGame(savegame.saves);
        
        this.startTime = savegame.startTime;
        this.stage.innerHTML = savegame.screenContents;
        this.runVars = savegame.runVars;
        this.globalVars = savegame.globalVars;
        this.log = savegame.log;
        this.visitedScenes = savegame.visitedScenes;
        this.index = savegame.index;
        this.wait = savegame.wait;
        this.currentElement = savegame.currentElement;
        
        if (savegame.listenersSubscribed)
        {
            this.game.subscribeListeners();
        };
        
        sceneId = savegame.sceneId;
        this.sceneId = sceneId;
        
        scenes = this.story.getElementsByTagName("scene");
        this.scenes = scenes;
        
        for (i = 0, len = this.scenes.length; i < len; i += 1)
        {
            if (scenes[i].getAttribute("id") === sceneId)
            {
                scene = scenes[i];
                break;
            }
        }
        
        if (!scene)
        {
            this.bus.trigger(
                "wse.interpreter.error",
                { message: "Loading savegame '" + savegameId + "' failed: Scene not found!" }
            );
            return false;
        }
        
        this.commands = scene.childNodes;
        
        //setTimeout( function () { self.next(); }, 0);
        
        return true;
    };
    
    
    out.datasources = {};
    
    out.datasources.LocalStorage = function ()
    {
        this.ls = localStorage;
    };
    
    out.datasources.LocalStorage.prototype.set = function (key, value)
    {
        this.ls.setItem(key, value);
    };
    
    out.datasources.LocalStorage.prototype.get = function (key)
    {
        return this.ls.getItem(key);
    };


    out.assets = {};
    out.assets.mixins = {};

    out.assets.mixins.move = function (command, args)
    {
        var x, y, z, element, xHandle, yHandle, zHandle, xFn, yFn, zFn, self, 
            wait, xUnit, yUnit, duration, easingType, easing, 
            waitX, waitY, waitZ, isAnimation;

        self = this;
        element = document.getElementById(this.cssid);
        x = command.getAttribute("x");
        y = command.getAttribute("y");
        z = command.getAttribute("z");
        duration = command.getAttribute("duration") || 500;
        easingType = command.getAttribute("easing") || "sineEaseOut";
        easing = (typeof out.fx.easing[easingType] !== null) ? out.fx.easing[easingType] : out.fx.easing.sineEaseOut;
        isAnimation = args.animation === true ? true : false;

        if (x !== null)
        {
            xUnit = x.replace(/^(-){0,1}[0-9]*/, "");
            x = parseInt(x, 10);
        }

        if (y !== null)
        {
            yUnit = y.replace(/^(-){0,1}[0-9]*/, "");
            y = parseInt(y, 10);
        }

        wait = command.getAttribute("wait") === "yes" ? true : false;
        waitX = false;
        waitY = false;
        waitZ = false;

        if (x === null && y === null && z === null)
        {
            this.bus.trigger("wse.interpreter.warning", {
                element: command,
                message: "Can't apply action 'move' to asset '" + this.name + "' because no x, y or z position has been supplied."
            });
        }

        if (x !== null)
        {
            if (!isAnimation) 
            {
                this.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.increase");
            }
            
            out.fx.transform(
                function (v)
                {
                    element.style.left = v + xUnit;
                }, 
                element.offsetLeft, 
                x, 
                {
                    onFinish: !isAnimation ? function ()
                    {
                        self.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.decrease");
                    } : null,
                    duration: duration,
                    easing: easing
                }
            );
        }

        if (y !== null)
        {
            if (!isAnimation) 
            {
                this.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.increase");
            }
            
            out.fx.transform(
                function (v)
                {
                    element.style.top = v + yUnit;
                }, 
                element.offsetTop, 
                y, 
                {
                    onFinish: !isAnimation ? function ()
                    {
                        self.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.decrease");
                    } : null,
                    duration: duration,
                    easing: easing
                }
            );
        }

        if (z !== null)
        {
            if (!isAnimation) 
            {
                this.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.increase");
            }
            
            out.fx.transform(
                function (v)
                {
                    element.style.zIndex = v;
                }, 
                element.style.zIndex || 0, 
                parseInt(z, 10), 
                {
                    onFinish: !isAnimation ? function ()
                    {
                        self.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.decrease");
                    } : null,
                    duration: duration,
                    easing: easing
                }
            );
        }
        
        this.bus.trigger("wse.assets.mixins.move", this);

        return {
            doNext: true
        };
    };

    out.assets.mixins.show = function (command, args)
    {
        var self, duration, handle, fn, wait, effect, direction, ox, oy, prop, 
            bus, stage, element, isAnimation, easing, easingType;

        args = args || {};
        self = this;
        wait = command.getAttribute("wait") === "yes" ? true : false;
        duration = command.getAttribute("duration") || 500;
        effect = command.getAttribute("effect") || "fade";
        direction = command.getAttribute("direction") || "right";
        element = args.element || document.getElementById(this.cssid);
        
        console.log("CSS ID: " + this.cssid, element);
        
        bus = args.bus || this.bus;
        stage = args.stage || this.stage;
        easingType = command.getAttribute("easing") || "sineEaseOut";
        easing = (typeof out.fx.easing[easingType] !== null) ? out.fx.easing[easingType] : out.fx.easing.sineEaseOut;
        isAnimation = args.animation === true ? true : false;

        if (effect === "slide")
        {
            ox = element.offsetLeft;
            oy = element.offsetTop;
            switch (direction)
            {
                case "left":
                    element.style.left = ox + stage.offsetWidth + "px";
                    prop = "left";
                    break;
                case "right":
                    element.style.left = ox - stage.offsetWidth + "px";
                    prop = "left";
                    break;
                case "top":
                    element.style.top = oy + stage.offsetHeight + "px";
                    prop = "top";
                    break;
                case "bottom":
                    element.style.top = oy - stage.offsetHeight + "px";
                    prop = "top";
                    break;
                default:
                    element.style.left = ox - stage.offsetWidth + "px";
                    prop = "left";
                    break;
            }
            element.style.opacity = 1;
            
            if (!isAnimation) 
            {
                bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.increase");
            }
            
            out.fx.transform(
                function (v)
                {
                    element.style[prop] = v + "px";
                }, 
                (prop === "left" ? element.offsetLeft : element.offsetTop), (prop === "left" ? ox : oy), 
                {
                    duration: duration,
                    onFinish: !isAnimation ? function ()
                    {
                        bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.decrease");
                    } : null,
                    easing: easing
                }
            );
        }
        else
        {
            if (!isAnimation) 
            {
                bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.increase");
            }
            
            out.fx.transform(
                function (v)
                {
                    element.style.opacity = v;
                }, 
                0, 
                1, 
                {
                    duration: duration,
                    onFinish: !isAnimation ? function ()
                    {
                        bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.decrease");
                    } : null,
                    easing: easing
                }
            );
        }
        
        bus.trigger("wse.assets.mixins.show", this);

        return {
            doNext: true
        };
    };

    out.assets.mixins.hide = function (command, args)
    {
        var self, duration, handle, fn, wait, effect, direction, 
            ox, oy, to, prop, isAnimation, element;

        self = this;
        wait = command.getAttribute("wait") === "yes" ? true : false;
        duration = command.getAttribute("duration") || 500;
        effect = command.getAttribute("effect") || "fade";
        direction = command.getAttribute("direction") || "left";
        isAnimation = args.animation === true ? true : false;
        element = document.getElementById(this.cssid);

        if (effect === "slide")
        {
            ox = element.offsetLeft;
            oy = element.offsetTop;
            element.style.opacity = 1;
            switch (direction)
            {
            case "left":
                to = ox - this.stage.offsetWidth;
                prop = "left";
                break;
            case "right":
                to = ox + this.stage.offsetWidth;
                prop = "left";
                break;
            case "top":
                to = oy - this.stage.offsetHeight;
                prop = "top";
                break;
            case "bottom":
                to = oy + this.stage.offsetHeight;
                prop = "top";
                break;
            default:
                to = ox - this.stage.offsetWidth;
                prop = "left";
                break;
            }
            
            if (!isAnimation) 
            {
                self.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.increase");
            }
            
            out.fx.transform(
                function (v)
                {
                    element.style[prop] = v + "px";
                }, 
                (prop === "left" ? ox : oy), 
                to, 
                {
                    duration: duration,
                    onFinish: function ()
                    {
                        if (!isAnimation) 
                        {
                            self.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.decrease");
                        }
                        
                        element.style.opacity = 0;
                        switch (direction)
                        {
                            case "left":
                            case "right":
                                element.style.left = ox + "px";
                                prop = "left";
                                break;
                            case "top":
                            case "bottom":
                                element.style.top = oy + "px";
                                prop = "top";
                                break;
                            default:
                                element.style.left = ox + "px";
                                prop = "left";
                                break;
                        }
                    }
                });
        }
        else
        {
            if (!isAnimation) 
            {
                self.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.increase");
            }
            
            out.fx.transform(
                function (v)
                {
                    element.style.opacity = v;
                }, 
                1, 
                0, 
                {
                    duration: duration,
                    onFinish: function ()
                    {
                        if (!isAnimation) 
                        {
                            self.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.decrease");
                        }
                        
                        element.style.opacity = 0;
                    }
                }
            );
        }
        
        this.bus.trigger("wse.assets.mixins.hide", this);

        return {
            doNext: true
        };
    };


    out.assets.Character = function (asset, stage, bus)
    {
        this.asset = asset;
        this.stage = stage;
        this.bus = bus;
        this.id = out.tools.getUniqueId();
        bus.trigger("wse.assets.character.constructor", this);
    };

    out.assets.Character.prototype.setTextbox = function (command)
    {
        this.asset.setAttribute("textbox", command.getAttribute("textbox"));
        this.bus.trigger("wse.assets.character.settextbox", this);
    };
    
    out.assets.Character.prototype.save = function (obj)
    {
        obj[this.id] = { 
            assetType: "Character",
            textboxName: this.asset.getAttribute("textbox")
        };
        this.bus.trigger("wse.assets.character.save", { subject: this, saves: obj });
    };
    
    out.assets.Character.prototype.restore = function (obj)
    {
        this.asset.setAttribute("textbox", obj[this.id].textboxName);
        this.bus.trigger("wse.assets.character.restore", { subject: this, saves: obj });
    };


    out.assets.Imagepack = function (asset, stage, bus)
    {
        var element, images, children, i, len, current, name, 
            src, image, self, triggerDecreaseFn;

        this.stage = stage;
        this.bus = bus;
        this.name = asset.getAttribute("name");
        this.id = out.tools.getUniqueId();
        this.cssid = "wse_imagepack_" + this.id;

        self = this;
        images = {};
        element = document.createElement("div");

        element.style.opacity = 0;
        element.draggable = false;

        element.setAttribute("class", "imagepack");
        element.setAttribute("id", this.cssid);

        children = asset.getElementsByTagName("image");
        
        triggerDecreaseFn = function ()
        {
            self.bus.trigger("wse.assets.loading.decrease");
        };

        for (i = 0, len = children.length; i < len; i += 1)
        {
            current = children[i];
            name = current.getAttribute("name");
            src = current.getAttribute("src");

            if (name === null)
            {
                this.bus.trigger("wse.interpreter.warning", {
                    element: asset,
                    message: "Image without name in imagepack '" + this.name + "'."
                });
                continue;
            }

            if (src === null)
            {
                this.bus.trigger("wse.interpreter.warning", {
                    element: asset,
                    message: "Image without src in imagepack '" + this.name + "'."
                });
                continue;
            }

            image = new Image();

            this.bus.trigger("wse.assets.loading.increase");
            out.tools.attachEventListener(image, 'load', triggerDecreaseFn);

            image.src = src;
            image.style.opacity = 0;
            image.style.position = "absolute";
            image.draggable = false;

            images[name] = this.cssid + "_" + name;
            image.setAttribute("id", images[name]);
            element.appendChild(image);
        }

        element.style.position = "absolute";
        element.style.left = asset.getAttribute("x") || 0;
        element.style.top = asset.getAttribute("y") || 0;
        element.style.zIndex = asset.getAttribute("z") || 0;

        this.images = images;
        this.current = null;

        stage.appendChild(element);
        
        bus.trigger("wse.assets.imagepack.constructor", this);
    };

    out.assets.Imagepack.prototype.move = out.assets.mixins.move;
    out.assets.Imagepack.prototype.show = out.assets.mixins.show;
    out.assets.Imagepack.prototype.hide = out.assets.mixins.hide;

    out.assets.Imagepack.prototype.set = function (command, args)
    {
        var image, name, self, old, duration, isAnimation;

        args = args || {};
        self = this;
        name = command.getAttribute("image");
        duration = command.getAttribute("duration") || 400;
        isAnimation = args.animation === true ? true : false;

        if (name === null)
        {
            this.bus.trigger("wse.interpreter.warning", {
                element: command,
                message: "Missing attribute 'image' on 'do' element referencing imagepack '" + this.name + "'."
            });
            return {
                doNext: true
            };
        }

        image = document.getElementById(this.images[name]);

        if (typeof image === "undefined" || image === null)
        {
            this.bus.trigger("wse.interpreter.warning", {
                element: command,
                message: "Unknown image name on 'do' element referencing imagepack '" + this.name + "'."
            });
            return {
                doNext: true
            };
        }

        old = this.current;

        for (var key in this.images)
        {
            if (!(this.images.hasOwnProperty(key)))
            {
                if (key !== name)
                {
                    continue;
                }
                if (key === old)
                {
                    this.bus.trigger(
                        "wse.interpreter.warning", 
                        {
                            element: command,
                            message: "Trying to set the image that is already set on imagepack '" + this.name + "'."
                        }
                    );
                    return {
                        doNext: true
                    };
                }
            }
        }
        
        if (!isAnimation) 
        {
            self.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.increase");
        }
        
        out.fx.transform(
            function (v)
            {
                image.style.opacity = v;
            }, 
            0, 
            1, 
            {
                duration: duration / 2,
                easing: out.fx.easing.linear,
                onFinish: function ()
                {
                    if (!isAnimation) 
                    {
                        self.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.decrease");
                    }
                }
            }
        );

        if (this.current !== null)
        {
            if (!isAnimation) 
            {
                self.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.increase");
            }
            
            setTimeout(
                function ()
                {
                    var oldEl = document.getElementById(self.images[old]);
                    out.fx.transform(
                        function (v)
                        {
                            oldEl.style.opacity = v;
                        }, 
                        1, 
                        0, 
                        {
                            duration: duration,
                            onFinish: function ()
                            {
                                if (!isAnimation) 
                                {
                                    self.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.decrease");
                                }
                            },
                            easing: out.fx.easing.linear
                        }
                    );
                }, 
                duration / 2
            );
        }

        this.current = name;

        return {
            doNext: true
        };
    };
    
    out.assets.Imagepack.prototype.save = function (obj)
    {
        var cur, key, images, name;
        images = this.images;
        cur = this.current || null;
        name = null;
        
        for (key in images)
        {
            if (images.hasOwnProperty(key))
            {
                if (images[key] === cur)
                {
                    name = key;
                }
            }
        }
        
        obj[this.id] = { 
            assetType: "Imagepack",
            current: name,
            cssid: this.cssid,
            images: images
        };
        this.bus.trigger("wse.assets.imagepack.save", { subject: this, saves: obj });
    };
    
    out.assets.Imagepack.prototype.restore = function (obj)
    {
        var name;
        name = obj[this.id].current;
        
        if (name !== null && this.images[name] !== null)
        {
            this.current = this.images[name];
        }
        
        this.bus.trigger("wse.assets.imagepack.restore", { subject: this, saves: obj });
    };



    out.assets.Textbox = function (asset, stage, bus, helper)
    {

        if (!(this instanceof out.assets.Textbox))
        {
            return new out.assets.Textbox(asset, stage, bus, helper);
        }

        var element, nameElement, textElement, cssid, x, y, width, height;

        this.name = asset.getAttribute("name");
        this.stage = stage;
        this.bus = bus;
        this.type = asset.getAttribute("behaviour") || "adv";
        this.showNames = asset.getAttribute("names") === "yes" ? true : false;
        this.nltobr = asset.getAttribute("nltobr") === "true" ? true : false;
        this.id = out.tools.getUniqueId();
        this.cssid = "wse_textbox_" + this.id;

        if (this.type === "nvl")
        {
            this.showNames = false;
        }

        element = document.createElement("div");
        nameElement = document.createElement("div");
        textElement = document.createElement("div");

        element.setAttribute("class", "textbox");
        textElement.setAttribute("class", "text");
        nameElement.setAttribute("class", "name");

        cssid = asset.getAttribute("cssid") || this.cssid;
        element.setAttribute("id", cssid);
        this.cssid = cssid;

        x = asset.getAttribute("x");
        if (x)
        {
            element.style.left = x;
        }

        y = asset.getAttribute("y");
        if (y)
        {
            element.style.top = y;
        }

        width = asset.getAttribute("width");
        if (width)
        {
            element.style.width = width;
        }

        height = asset.getAttribute("height");
        if (height)
        {
            element.style.height = height;
        }

        element.appendChild(nameElement);
        element.appendChild(textElement);
        stage.appendChild(element);

        if (this.showNames === false)
        {
            nameElement.style.display = "none";
        }
        
        nameElement.setAttribute("id", this.cssid + "_name");
        textElement.setAttribute("id", this.cssid + "_text");

        this.nameElement = this.cssid + "_name";
        this.textElement = this.cssid + "_text";
        this.helper = helper;

        element.style.opacity = 0;

        this.bus.trigger("wse.assets.textbox.constructor", this);
    };

    out.assets.Textbox.prototype.show = out.assets.mixins.show;
    out.assets.Textbox.prototype.hide = out.assets.mixins.hide;
    out.assets.Textbox.prototype.move = out.assets.mixins.move;

    out.assets.Textbox.prototype.put = function (text, name)
    {
        name = name || null;

        var textElement, nameElement, namePart;

        textElement = document.getElementById(this.textElement);
        nameElement = document.getElementById(this.nameElement);

        text = this.helper.replaceVariables(text);
        text = out.tools.textToHtml(text, this.nltobr);

        if (this.type === "adv")
        {
            out.fx.transform(

            function (v)
            {
                textElement.style.opacity = v;
            }, 1, 0, {
                duration: 50
            });
            textElement.innerHTML = "";
        }

        namePart = "";
        if (this.showNames === false && !(!name))
        {
            namePart = name + ": ";
        }

        if (name === null)
        {
            name = "";
        }

        if (this.type === "adv")
        {
            setTimeout(

            function ()
            {

                textElement.innerHTML += namePart + text;
                nameElement.innerHTML = name;
                out.fx.transform(

                function (v)
                {
                    textElement.style.opacity = v;
                }, 0, 1, {
                    duration: 50
                });
            }, 50);
        }
        else
        {
            setTimeout(

            function ()
            {

                textElement.innerHTML += "<p>" + namePart + text + "</p>";
                nameElement.innerHTML = name;
            }, 200);
        }
        
        this.bus.trigger("wse.assets.textbox.put", this);

        return {
            doNext: false
        };
    };

    out.assets.Textbox.prototype.clear = function ()
    {
        document.getElementById(this.textElement).innerHTML = "";
        document.getElementById(this.nameElement).innerHTML = "";
        this.bus.trigger("wse.assets.textbox.clear", this);
        return {
            doNext: true
        };
    };
    
    out.assets.Textbox.prototype.save = function (obj)
    {
        obj[this.id] = {
            assetType: "Textbox",
            type: this.type,
            showNames: this.showNames,
            nltobr: this.nltobr,
            cssid: this.cssid,
            nameElement: this.nameElement,
            textElement: this.textElement
        };
    };
    
    out.assets.Textbox.prototype.restore = function (obj)
    {
        var save = obj[this.id];
        this.type = save.type;
        this.showNames = save.showNames;
        this.nltobr = save.nltobr;
        this.cssid = save.cssid;
        this.nameElement = save.nameElement;
        this.textElement = save.textElement;
    };



    out.assets.Audio = function (asset, bus)
    {
        var self, sources, i, len, j, jlen, current, track, trackName, trackFiles, href, type, source, key, loopFn, tracks;

        self = this;
        this.au = new Audio();
        this.bus = bus;
        this.name = asset.getAttribute("name");
        this.tracks = {};
        this.current = null;
        this.currentIndex = null;
        this.autopause = asset.getAttribute("autopause") === "true" ? true : false;
        this.loop = asset.getAttribute("loop") === "true" ? true : false;
        this.fade = asset.getAttribute("fade") === "true" ? true : false;
        this.id = out.tools.getUniqueId();

        tracks = asset.getElementsByTagName("track");
        len = tracks.length;

        if (len < 1)
        {
            this.bus.trigger("wse.interpreter.warning", {
                element: asset,
                message: "No tracks defined for audio element '" + this.name + "'."
            });
            return {
                doNext: true
            };
        }

        for (i = 0; i < len; i += 1)
        {
            current = tracks[i];
            sources = current.getElementsByTagName("source");
            jlen = sources.length;

            if (jlen < 1)
            {
                this.bus.trigger("wse.interpreter.warning", {
                    element: asset,
                    message: "No sources defined for track '" + trackName + "' in audio element '" + this.name + "'."
                });
                continue;
            }

            track = new Audio();
            trackFiles = {};
            trackName = current.getAttribute("title");
            track.preload = true;

            if (trackName === null)
            {
                this.bus.trigger("wse.interpreter.warning", {
                    element: asset,
                    message: "No title defined for track '" + trackName + "' in audio element '" + this.name + "'."
                });
                continue;
            }

            for (j = 0; j < jlen; j += 1)
            {
                source = sources[j];
                href = source.getAttribute("href");
                type = source.getAttribute("type");

                if (href === null)
                {
                    this.bus.trigger("wse.interpreter.warning", {
                        element: asset,
                        message: "No href defined for source in track '" + trackName + "' in audio element '" + this.name + "'."
                    });
                    continue;
                }

                if (type === null)
                {
                    this.bus.trigger("wse.interpreter.warning", {
                        element: asset,
                        message: "No type defined for source in track '" + trackName + "' in audio element '" + this.name + "'."
                    });
                    continue;
                }

                trackFiles[type] = href;
            }

            // Progress bar doesn't work... because audio/video get streamed?
            /*
        this.bus.trigger("wse.assets.loading.increase");
        out.tools.attachEventListener(track, 'load', function() { self.bus.trigger("wse.assets.loading.decrease"); });*/

            if (track.canPlayType("audio/mpeg") && typeof trackFiles.mp3 !== "undefined")
            {
                track.src = trackFiles.mp3;
            }
            else
            {
                if (typeof trackFiles.ogg === "undefined")
                {
                    this.bus.trigger("wse.interpreter.warning", {
                        element: asset,
                        message: "No usable source found for track '" + trackName + "' in audio element '" + this.name + "'."
                    });
                    continue;
                }
                track.src = trackFiles.ogg;
            }
            document.body.appendChild(track);

            this.tracks[trackName] = track;
        }

        this.isPlaying = false;

        // We need to reload the audio element because stupid Chrome is too dumb to loop.
        this.renewCurrent = function ()
        {
            var dupl, src;
            dupl = new Audio();
            src = self.current.src;
            document.body.removeChild(self.current);
            dupl.src = src;
            self.current = dupl;
            self.tracks[self.currentIndex] = dupl;
            document.body.appendChild(dupl);
        };

        this.play = function (command)
        {
            command = command || document.createElement("div");
            var fade = command.getAttribute("fade") === "true" ? true : this.fade;

            if (self.current === null)
            {
                this.bus.trigger("wse.interpreter.warning", {
                    element: asset,
                    message: "No usable source found for track '" + trackName + "' in audio element '" + this.name + "'."
                });
                return;
            }

            self.stop(command);

            self.isPlaying = true;

            if (self.loop === true)
            {
                out.tools.attachEventListener(
                self.current, 'ended', function ()
                {
                    self.renewCurrent();
                    setTimeout(function ()
                    {
                        self.play();
                    }, 0);
                });
            }
            else
            {
                out.tools.attachEventListener(
                self.current, 'ended', function ()
                {
                    self.isPlaying = false;
                });
            }

            if (fade === true)
            {
                self.current.volume = 0;
                self.current.play();
                self.fadeIn();
            }
            else
            {
                self.current.play();
            }
            
            this.bus.trigger("wse.assets.audio.play", this);
        };

        this.stop = function ()
        {
            if (self.current === null)
            {
                this.bus.trigger("wse.interpreter.warning", {
                    element: asset,
                    message: "No track set for audio element '" + this.name + "'."
                });
                return;
            }
            if (self.fade === true)
            {
                self.fadeOut();
                setTimeout(

                function ()
                {
                    self.current.pause();
                    self.currentTime = 0.1;
                    self.renewCurrent();
                    self.isPlaying = false;
                }, 1000);
            }
            else
            {
                self.current.pause();
                self.currentTime = 0.1;
                self.renewCurrent();
                self.isPlaying = false;
            }
            this.bus.trigger("wse.assets.audio.play", this);
        };

        this.fadeIn = function ()
        {
            var timer, fn;
            fn = function ()
            {
                if (self.current.volume > 0.99)
                {
                    self.current.volume = 1;
                    clearInterval(timer);
                    timer = null;
                    return;
                }
                self.current.volume += 0.01;
            };
            timer = setInterval(fn, 5);
            return timer;
        };

        this.fadeOut = function ()
        {
            var timer, fn;
            fn = function ()
            {
                if (self.current.volume < 0.01)
                {
                    self.current.volume = 0;
                    clearInterval(timer);
                    timer = null;
                    return;
                }
                self.current.volume -= 0.01;
            };
            timer = setInterval(fn, 5);
            return;
        };

        if (this.autopause === false)
        {
            return;
        }

        out.tools.attachEventListener(
        self.stage, 'blur', function ()
        {
            if (self.isPlaying === true)
            {
                self.fadeOut();
                setTimeout(function ()
                {
                    self.current.pause();
                }, 1000);
            }
        });

        out.tools.attachEventListener(
        self.stage, 'focus', function ()
        {
            if (self.isPlaying === true)
            {
                self.current.play();
                self.fadeIn();
            }
        });
        
        this.bus.trigger("wse.assets.audio.constructor", this);
    };

    out.assets.Audio.prototype.set = function (command)
    {
        var name, isPlaying, self;

        self = this;
        name = command.getAttribute("track");
        isPlaying = this.isPlaying === true && this.loop === true ? true : false;

        if (typeof this.tracks[name] === "undefined" || this.tracks[name] === null)
        {
            this.bus.trigger("wse.interpreter.warning", {
                element: command,
                message: "Unknown track '" + name + "' in audio element '" + this.name + "'."
            });
            return;
        }

        if (this.isPlaying === true)
        {
            this.stop();
        }

        this.currentIndex = name;
        this.current = this.tracks[name];

        if (isPlaying === true)
        {
            if (this.fade === true)
            {
                setTimeout(function ()
                {
                    self.play();
                }, 1010);
            }
            else
            {
                this.play();
            }
        }
        this.bus.trigger("wse.assets.audio.set", this);
    };
    
    out.assets.Audio.prototype.save = function (obj)
    {
        obj[this.id] = {
            assetType: "Audio",
            isPlaying: this.isPlaying,
            fade: this.fade,
            currentIndex: this.currentIndex
        };
        this.bus.trigger("wse.assets.audio.save", this);
    };
    
    out.assets.Audio.prototype.restore = function (obj)
    {
        var vals = obj[this.id];
        this.isPlaying = vals.isPlaying;
        this.fade = vals.fade;
        this.currentIndex = vals.currentIndex;
        this.bus.trigger("wse.assets.audio.restore", this);
    };



    out.assets.Animation = function (asset, stage, bus, assets, interpreter)
    {
        var groups, i, len, current, curFn, transformations, j, jlen, 
            self, doElements, createTransformFn, loopFn, runDoCommandFn;

        if (!(this instanceof out.assets.Animation))
        {
            return new out.assets.Animation(asset, stage, bus);
        }

        this.stage = stage;
        this.bus = bus;
        this.asset = asset;
        this.name = asset.getAttribute("name");
        this.cbs = [];
        this.assets = assets;
        this.id = out.tools.getUniqueId();
        this.isRunning = false;

        self = this;
        groups = this.asset.getElementsByTagName("group");
        len = groups.length;

        if (len < 1)
        {
            this.bus.trigger("wse.interpreter.warning", {
                element: asset,
                message: "Animation asset '" + this.name + "' is empty."
            });
            return {
                doNext: true
            };
        }
        
        createTransformFn = function (as, f, t, pn, u, opt)
        {
            //                             console.log(f, t, pn, u, opt);
            return out.fx.transform(
                function (v)
                {
                    as.style[pn] = v + u;
                }, f, t, opt
            );
        };
        
        runDoCommandFn = function (li, del, tim)
        {
            var curDur, curDoEl;
            
            curDoEl = del;
            curDur = curDoEl.getAttribute("duration");
            //                     console.log("Running do command.");
            interpreter.runDoCommand(curDoEl, {
                animation: true
            });
            
            if (curDur !== null)
            {
                tim.push(
                    out.fx.createTimer(curDur));
            }
        };
        
        loopFn = function (transf, doEls)
        {
            var dlen = doEls.length;
            jlen = transformations.length;
            
            self.cbs.push(function ()
            {
                var timers = [],
                from, to, unit, curTr, curAs, curAsName, dur, propName, j, easingFn, easingType, opt, di;
                
                for (j = 0; j < jlen; j += 1)
                {
                    curTr = transf[j];
                    
                    if (typeof curTr === "undefined" || curTr === null)
                    {
                        continue;
                    }
                    
                    curAsName = curTr.getAttribute("asset");
                    
                    try
                    {
                        curAs = self.assets[curAsName].element || self.stage;
                    }
                    catch (e)
                    {
                        continue;
                    }
                    
                    easingType = curTr.getAttribute("easing");
                    //                     console.log(curAsName, curAs);
                    from = parseInt(curTr.getAttribute("from"), 10);
                    to = parseInt(curTr.getAttribute("to"), 10);
                    unit = curTr.getAttribute("unit") || "";
                    dur = curTr.getAttribute("duration") || 500;
                    propName = curTr.getAttribute("property");
                    opt = {};
                    opt.duration = dur;
                    
                    if (easingType !== null && typeof out.fx.easing[easingType] !== "undefined" && out.fx.easing[easingType] !== null)
                    {
                        opt.easing = out.fx.easing[easingType];
                    }
                    
                    timers.push(createTransformFn(curAs, from, to, propName, unit, opt));
                }
                
                for (di = 0; di < dlen; di += 1)
                {
                    runDoCommandFn(di, doEls[di], timers);
                }
                //                 console.log(timers);
                return timers;
            });
        };

        for (i = 0; i < len; i += 1)
        {
            current = groups[i];
            transformations = current.getElementsByTagName("transform");
            doElements = current.getElementsByTagName("do");

            loopFn(transformations, doElements);
        }

        this.anim = new out.fx.Animation(this.cbs);
        this.bus.trigger("wse.assets.animation.constructor", this);

    };

    out.assets.Animation.prototype.start = function ()
    {
        this.anim.start();
        this.isRunning = true;
        this.bus.trigger("wse.assets.animation.start", this);
    };

    out.assets.Animation.prototype.stop = function ()
    {
        this.anim.stop();
        this.isRunning = false;
        this.bus.trigger("wse.assets.animation.stop", this);
    };
    
    out.assets.Animation.prototype.save = function (obj)
    {
        obj[this.id] = { 
            assetType: "Animation",
            isRunning: this.isRunning 
        };
        this.bus.trigger("wse.assets.animation.save", { subject: this, saves: obj });
    };
    
    out.assets.Animation.prototype.restore = function (obj)
    {
        this.isRunning = obj[this.id].isRunning;
        
        if (this.isRunning === true)
        {
            this.start();
        }
        
        this.bus.trigger("wse.assets.animation.restore", { subject: this, saves: obj });
    };
    
    

    // FIXME: implement...
    out.assets.Rain = function (asset, stage, bus)
    {
        if (!(this instanceof out.assets.Rain))
        {
            return new out.assets.Rain(asset, stage, bus);
        }

        this.asset = asset;
        this.stage = stage;
        this.bus = bus;
        this.id = out.tools.getUniqueId();
        
        this.canvas = new out.fx.canvas.Canvas(
        {
            width: stage.offsetWidth,
            height: stage.offsetHeight
        });
    };



    out.tools = {};

    out.tools.attachEventListener = function (elem, type, listener)
    {
        if (elem === null || typeof elem === "undefined")
        {
            return;
        }
        if (elem.addEventListener)
        {
            elem.addEventListener(type, listener, false);
        }
        else if (elem.attachEvent)
        {
            elem.attachEvent("on" + type, listener);
        }
    };

    out.tools.removeEventListener = function (elem, type, listener)
    {
        if (typeof elem === "undefined" || elem === null)
        {
            return;
        }
        elem.removeEventListener(type, listener, false);
    };
    
    out.tools.replaceVariables = function (text, interpreter)
    {
        text = text.replace(
            /\{\$([a-zA-Z0-9_]+)\}/g,
            function (match, name, offset, string) 
            {
                if (name in interpreter.runVars)
                {
                    return "" + interpreter.runVars[name];
                }
                else if (name in interpreter.globalVars)
                {
                    return "" + interpreter.globalVars[name];
                }
                return "";
            }
        );
        return text;
    };

    out.tools.textToHtml = function (text, nltobr)
    {
        nltobr = nltobr || false;

        if (!(String.prototype.trim))
        {
            text = text.replace(/^\n/, "");
            text = text.replace(/\n$/, "");
        }
        else
        {
            text = text.trim();
        }

        text = nltobr === true ? text.replace(/\n/g, "<br />") : text;
        text = text.replace(/\{/g, "<");
        text = text.replace(/\}/g, ">");

        return text;
    };
    
    out.tools.uniqueIdCount = 0;
    out.tools.getUniqueId = function ()
    {
        out.tools.uniqueIdCount += 1;
        return out.tools.uniqueIdCount;
    };

    return out;

}(
    typeof Squiddle === "undefined" ? false : Squiddle, 
    typeof MO5 === "undefined" ? false : MO5, 
    typeof STEINBECK === "undefined" ? false : STEINBECK
));