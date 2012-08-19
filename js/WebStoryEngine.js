/*global Squiddle: true, MO5: true, STEINBECK: true */
/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, 
    strict:true, undef:true, curly:true, browser:true, node:true, 
    indent:4, maxerr:50, globalstrict:true, white:false */
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

    out.Game.prototype.load = function ()
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
        try
        {
            stageElements = ws.getElementsByTagName("stage");
        }
        catch (e) 
        {
            console.log(e);
        }
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
        stage.setAttribute("class", "WSEStage");

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
/*
        this.next = function ()
        {
            self.bus.trigger("wse.game.next", this);
            self.interpreter.next(true);
        };*/
        fn = function ()
        {
            if (self.interpreter.state === "pause" || self.interpreter.waitCounter > 0)
            {
                return;
            }
            console.log("Next triggered by user...");
            self.interpreter.next();
        };
        this.subscribeListeners = function ()
        {
            out.tools.attachEventListener(this.stage, 'click', fn);
//             this.keys.addListener(this.keys.keys.RIGHT_ARROW, fn);
//             this.keys.addListener(this.keys.keys.SPACE, fn);
            this.listenersSubscribed = true;
        };
        this.unsubscribeListeners = function ()
        {
            out.tools.removeEventListener(this.stage, 'click', fn);
//             this.keys.removeListener(this.keys.keys.RIGHT_ARROW, fn);
//             this.keys.removeListener(this.keys.keys.SPACE, fn);
            this.listenersSubscribed = false;
        };
        this.interpreter.start();
    };



    out.Interpreter = function (game)
    {
        var datasource, key;
        
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
        this.callStack = [];
        this.keysDisabled = 0; // if this is > 0, key triggers should be disabled
        this.state = "listen";
        this.waitCounter = 0;
        
        datasource = new out.datasources.LocalStorage();
        this.datasource = datasource;
        key = "wse_globals_" + this.game.url + "_";
        
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
    };

    out.Interpreter.prototype.buildLoadingScreen = function ()
    {
        var loadScreen, self, fn;

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
        this.currentCommands = [];
        this.wait = false;
        this.startTime = Math.round(+new Date() / 1000);
        this.stopped = false;
        //     this.rush = false;

        var self, fn, makeKeyFn;

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
        this.createTriggers();
        
        makeKeyFn = function (type)
        {
            return function (ev)
            {
                self.bus.trigger(
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
        this.startTime = Math.round(+new Date() / 1000);
        this.changeScene(scenes[0]);
    };

    out.Interpreter.prototype.changeScene = function (scene)
    {
        var len, id;
        
        this.bus.trigger(
            "wse.interpreter.changescene.before",
            {
                scene: scene,
                interpreter: this
            },
            false
        );

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
        this.currentCommands = scene.childNodes;
        len = this.currentCommands.length;
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
        
        this.bus.trigger(
            "wse.interpreter.changescene.after",
            {
                scene: scene,
                interpreter: this
            },
            false
        );

        this.next();
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
        var top = this.callStack.pop();
        
        this.bus.trigger(
            "wse.interpreter.message",
            "Returning from sub scene '" + this.sceneId + "' to scene '" + top.sceneId + "'...",
            false
        );
        
        this.index = top.index + 1;
        this.sceneId = top.sceneId;
        //this.currentScene = this.scenes[top.sceneId];
        
        this.currentScene = this.getSceneById(top.sceneId);
        
        this.currentElement = top.currentElement;
        this.currentCommands = this.currentScene.childNodes;
        
        console.log("top:", top);
        
        //console.log(this.currentCommands);
    };
    
    out.Interpreter.prototype.getSceneById = function (sceneName)
    {
        var i, len, current, scene;
        scene = null;
        
        for (i = 0, len = this.scenes.length; i < len; i += 1)
        {
            current = this.scenes[i];
            if (current.getAttribute("id") === sceneName)
            {
                scene = current;
                break;
            }
        }
        
        if (scene === null)
        {
            this.bus.trigger(
                "wse.interpreter.warning",
                {
                    message: "Scene '" + sceneName + "' not found!"
                }
            );
        }
        
        return scene;
    };

    out.Interpreter.prototype.next = function ()
    {
        var nodeName, command, check, self;
        
        this.bus.trigger("wse.interpreter.next.before", this, false);

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
        

//         if (this.waitForTimer === true || (this.wait === true && this.numberOfFunctionsToWaitFor > 0))
//         {
//             setTimeout(function ()
//             {
//                 self.next();
//             }, 10);
//             this.bus.trigger("wse.interpreter.next.after.postponed", this, false);
//             return;
//         }

        if (this.wait === true && this.numberOfFunctionsToWaitFor < 1)
        {
            this.wait = false;
        }
        
        this.stopped = false;
//         this.game.unsubscribeListeners();

        if (this.index >= this.currentCommands.length)
        {
            if (this.callStack.length > 0)
            {
                this.popFromCallStack();
                setTimeout( function () { self.next(); }, 0);
                return;
            }
            this.bus.trigger("wse.interpreter.next.after.end", this, false);
            this.bus.trigger("wse.interpreter.end", this);
            return;
        }

        command = this.currentCommands[this.index];
        nodeName = command.nodeName;

        // ignore text and comment nodes:
        if (nodeName === "#text" || nodeName === "#comment")
        {
            this.index += 1;
            setTimeout(function ()
            {
                self.next();
            }, 0);
            this.bus.trigger("wse.interpreter.next.ignore", this, false);
            return;
        }

        this.bus.trigger("wse.interpreter.next.command", command);
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
            setTimeout(function ()
            {
                self.next();
            }, 0);
            this.bus.trigger("wse.interpreter.next.after.donext", this, false);
            return;
        }
        
        this.stopped = true;

        this.bus.trigger("wse.interpreter.next.after.nonext", this, false);
    };

    out.Interpreter.prototype.runCommand = function (command)
    {
        var tagName, ifvar, ifval, ifnot, varContainer, assetName;
        
        this.bus.trigger("wse.interpreter.runcommand.before", {interpreter: this, command: command}, false);
        
        tagName = command.tagName;
        assetName = command.getAttribute("asset") || null;
        
        ifvar = command.getAttribute("ifvar") || null;
        ifval = command.getAttribute("ifvalue");
        ifnot = command.getAttribute("ifnot");
        
        if (ifvar !== null || ifval !== null || ifnot !== null)
        {
            varContainer = this.runVars;
            
            if (!(ifvar in varContainer))
            {
                this.bus.trigger(
                    "wse.interpreter.warning", 
                    {
                        element: command,
                        message: "Unknown variable '" + ifvar + "' (" + ifscope + " scope) used in condition. Ignoring command."
                    }
                );
                this.bus.trigger("wse.interpreter.runcommand.after.condition.error.key", {interpreter: this, command: command}, false);
                return {
                    doNext: true
                };
            }
            
            if (ifnot !== null && ("" + varContainer[ifvar] === "" + ifnot))
            {
                this.bus.trigger("wse.interpreter.message", "Conidition not met. " + ifvar + "==" + ifnot);
                this.bus.trigger("wse.interpreter.runcommand.after.condition.false", {interpreter: this, command: command}, false);
                return {
                    doNext: true
                };
            }
            else if (ifval !== null && ("" + varContainer[ifvar]) !== "" + ifval)
            {
                this.bus.trigger("wse.interpreter.message", "Conidition not met.");
                this.bus.trigger("wse.interpreter.runcommand.after.condition.false", {interpreter: this, command: command}, false);
                return {
                    doNext: true
                };
            }
            
            this.bus.trigger("wse.interpreter.runcommand.condition.met", {interpreter: this, command: command}, false);
            this.bus.trigger("wse.interpreter.message", "Conidition met.");
        }
        
        if (tagName in this.commands)
        {
            this.bus.trigger("wse.interpreter.runcommand.after.command", {interpreter: this, command: command}, false);
            return this.commands[tagName](command, this);
        }
        else if (
            assetName !== null && 
            assetName in this.assets && 
            typeof this.assets[assetName][tagName] === "function" &&
            tagName.match(/(show|hide|clear|flicker|flash|play|start|stop|pause|move|set)/)
        )
        {
            return this.assets[assetName][tagName](command, this);
        }
        else
        {
            this.bus.trigger("wse.interpreter.warning", {
                element: command,
                message: "Unknown element '" + tagName + "'."
            });
            this.bus.trigger("wse.interpreter.runcommand.after.error", {interpreter: this, command: command}, false);
            return { doNext: true };
        }
    };
    
    out.Interpreter.prototype.commands = {};
    
    out.Interpreter.prototype.commands["break"] = function (command, interpreter)
    {
        interpreter.bus.trigger("wse.interpreter.commands.break", {interpreter: interpreter, command: command}, false);
//         interpreter.game.subscribeListeners();
        return {
            doNext: false,
            wait: true
        };
    };
    
    out.Interpreter.prototype.commands.fn = function (command, interpreter)
    {
        var name, varName, ret;
        name = command.getAttribute("name") || null;
        varName = command.getAttribute("tovar") || null;
        
        if (typeof out.functions[name] !== "function")
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "No name supplied on fn element."
                }
            );
            return {doNext: true};
        }
        
        if (typeof out.functions[name] !== "function")
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Unknown function '" + name + "'."
                }
            );
            return {doNext: true};
        }
        
        ret = out.functions[name](interpreter);
        
        if (varName !== null)
        {
            interpreter.runVars[varName] = "" + ret;
        }
        
        return {doNext: true};
    };
    
//     out.Interpreter.prototype.commands.fire = function (command, interpreter)
//     {
//         var eventName;
//         
//         interpreter.bus.trigger("wse.interpreter.commands.fire", {interpreter: interpreter, command: command}, false);
//         
//         eventName = command.getAttribute("event") || null;
//         
//         if (eventName === null)
//         {
//             interpreter.bus.trigger(
//                 "wse.interpreter.warning",
//                 {
//                     element: command,
//                     message: "No event specified on trigger element."
//                 }
//             );
//             return { doNext: true };
//         }
//         
//         interpreter.bus.trigger(
//             "wse.interpreter.message",
//             "Triggering event '" + eventName + "'.",
//             false
//         );
//         
//         interpreter.bus.trigger(eventName, command, false);
//         
//         return { doNext: true };
//     };
    
    out.Interpreter.prototype.commands.trigger = function (command, interpreter)
    {
        var triggerName, action;
        
        interpreter.bus.trigger("wse.interpreter.commands.trigger", {interpreter: interpreter, command: command}, false);
        
        triggerName = command.getAttribute("name") || null;
        action = command.getAttribute("action") || null;
        
        if (triggerName === null)
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "No name specified on trigger command."
                }
            );
            return { doNext: true };
        }
        
        if (action === null)
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "No action specified on trigger command referencing trigger '" + triggerName + "'."
                }
            );
            return { doNext: true };
        }
        
        if (typeof interpreter.triggers[triggerName] === "undefined" || interpreter.triggers[triggerName] === null)
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Reference to unknown trigger '" + triggerName + "'."
                }
            );
            return { doNext: true };
        }
        
        if (typeof interpreter.triggers[triggerName][action] !== "function")
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Unknown action '" + action + "' on trigger command referencing trigger '" + triggerName + "'."
                }
            );
            return { doNext: true };
        }
        
        interpreter.triggers[triggerName][action](command);
        
        return { doNext: true };
    };
    
    out.Interpreter.prototype.commands.sub = function (command, interpreter)
    {
        var sceneId, scene, doNext;
        
        interpreter.bus.trigger("wse.interpreter.commands.sub", {interpreter: interpreter, command: command}, false);
        
        sceneId = command.getAttribute("scene") || null;
        doNext = command.getAttribute("next") === false ? false : true;
        
        console.log("doNext in .sub() is: ", doNext);
        
        if (sceneId === null)
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Missing 'scene' attribute on 'sub' command!"
                }
            );
            return { doNext: true };
        }
        
        interpreter.bus.trigger(
            "wse.interpreter.message",
            "Entering sub scene '" + sceneId + "'...",
            false
        );
        
        interpreter.pushToCallStack();
        scene = interpreter.getSceneById(sceneId);
        
        interpreter.currentCommands = scene.childNodes;
        interpreter.index = -1;
        interpreter.sceneId = sceneId;
        interpreter.currentElement = -1;
        
        return {
            doNext: doNext
        };
    };
    
    out.Interpreter.prototype.commands.restart = function (command, interpreter)
    {
        interpreter.bus.trigger("wse.interpreter.commands.restart", {interpreter: interpreter, command: command}, false);
        
        interpreter.bus.trigger(
            "wse.interpreter.message",
            "Restarting game...",
            false
        );
        
        interpreter.bus.trigger(
            "wse.interpreter.restart",
            interpreter,
            false
        );
        
        interpreter.runVars = {};
        interpreter.log = [];
        interpreter.visitedScenes = [];
        interpreter.startTime = Math.round(+new Date() / 1000);
        interpreter.waitCounter = 0;
        interpreter.state = "listen";
        interpreter.stage.innerHTML = "";
        
        this.assets = {};
        interpreter.buildAssets();
        
        return {
            doNext: true,
            changeScene: interpreter.scenes[0]
        };
    };
    
    out.Interpreter.prototype.commands["var"] = function (command, interpreter)
    {
        var key, val, action, container;
        
        interpreter.bus.trigger("wse.interpreter.commands.var", {interpreter: interpreter, command: command}, false);
        
        key = command.getAttribute("name") || null;
        val = command.getAttribute("value") || null;
        action = command.getAttribute("action") || "set";
        
        if (key === null)
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning", 
                {
                    element: command,
                    message: "Command 'var' must have a 'name' attribute."
                }
            );
            return { doNext: true };
        }
        
        if (action !== "set" && action !== "delete" && action !== "increase" && action !== "decrease"&& action !== "print")
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning", 
                {
                    element: command,
                    message: "Unknown action '" + action + "' defined on 'var' command."
                }
            );
            return { doNext: true };
        }
        
        container = interpreter.runVars;
        
        if (action !== "set" && !(key in container))
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning", 
                {
                    element: command,
                    message: "Undefined variable."
                }
            );
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
                interpreter.bus.trigger(
                    "wse.interpreter.message",
                    "Variable '" + key + "' is: " + container[key]
                );
                break;
            default:
                container[key] = "" + val;
        }
        
        return { doNext: true };
    };
    
    out.Interpreter.prototype.commands.localize = function (command, interpreter)
    {
        var key;
        
        key = command.getAttribute("name") || null;
        
        if (key === null)
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "No variable name defined on localize element."
                }
            );
            return {doNext: true};
        }
        
        if (!interpreter.globalVars.has(key))
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Undefined global variable."
                }
            );
            return {doNext: true};
        }
        
        interpreter.runVars[key] = interpreter.globalVars.get(key);
        
        return {doNext: true};
    };
    
    out.Interpreter.prototype.commands.globalize = function (command, interpreter)
    {
        var key;
        
        key = command.getAttribute("name") || null;
        
        if (key === null)
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "No variable name defined on globalize element."
                }
            );
            return {doNext: true};
        }
        
        if (typeof interpreter.runVars[key] === "undefined" || interpreter.runVars[key] === null)
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Undefined local variable."
                }
            );
            return {doNext: true};
        }
        
        interpreter.globalVars.set(key, interpreter.runVars[key]);
        
        return {doNext: true};
    };
    
    out.Interpreter.prototype.commands.global = function (command, interpreter)
    {
        var name, value;
        
        name = command.getAttribute("name") || null;
        value = command.getAttribute("value") || null;
        
        if (name === null)
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "No name defined on element 'global'."
                }
            );
            return {doNext: true};
        }
        
        if (value === null)
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "No value defined on element 'global'."
                }
            );
            return {doNext: true};
        }
        
        interpreter.globalVars.set(name, value);
        
        return {doNext: true};
    };

    out.Interpreter.prototype.commands.wait = function (command, interpreter)
    {
        var duration, self;
        
        interpreter.bus.trigger("wse.interpreter.commands.wait", {interpreter: interpreter, command: command}, false);

        self = interpreter;
        duration = command.getAttribute("duration");

        if (duration !== null)
        {
            duration = parseInt(duration, 10);
            interpreter.waitForTimer = true;
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

    out.Interpreter.prototype.commands.choice = function (command, interpreter)
    {
        var menuElement, buttons, children, len, i, current, duration, 
            currentButton, scenes, self, j, jlen, currentScene, sceneName,
            makeButtonClickFn, oldState, cssid;
            
        interpreter.bus.trigger("wse.interpreter.commands.choice", {interpreter: interpreter, command: command}, false);

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
            interpreter.bus.trigger("wse.interpreter.warning", {
                element: command,
                message: "Element 'choice' is empty. Expected at least one 'option' element."
            });
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

        out.assets.mixins.show(command, {
            element: menuElement,
            bus: interpreter.bus,
            stage: interpreter.stage,
            interpreter: interpreter
        });
        
        interpreter.waitCounter += 1;

        return {
            doNext: false,
            wait: true
        };
    };

    out.Interpreter.prototype.commands.goto = function (command, interpreter)
    {
        var scene, sceneName, i, len, current;
        
        interpreter.bus.trigger("wse.interpreter.commands.goto", {interpreter: interpreter, command: command}, false);

        sceneName = command.getAttribute("scene");

        if (sceneName === null)
        {
            interpreter.bus.trigger("wse.interpreter.error", {
                message: "Element 'goto' misses attribute 'scene'."
            });
        }

        for (i = 0, len = interpreter.scenes.length; i < len; i += 1)
        {
            current = interpreter.scenes[i];
            if (current.getAttribute("id") === sceneName)
            {
                scene = current;
                break;
            }
        }

        if (typeof scene === "undefined")
        {
            interpreter.bus.trigger("wse.interpreter.error", {
                message: "Unknown scene '" + sceneName + "'."
            });
            return;
        }

        return {
            changeScene: scene
        };
    };

    out.Interpreter.prototype.commands.line = function (command, interpreter)
    {
        var speakerId, speakerName, textboxName, i, len, current, assetElements, text, doNext;
        
        interpreter.bus.trigger("wse.interpreter.commands.line", {interpreter: interpreter, command: command}, false);

//         interpreter.game.subscribeListeners();

        speakerId = command.getAttribute("s");
        doNext = command.getAttribute("stop") === "false" ? true : false;

        if (speakerId === null)
        {
            interpreter.bus.trigger("wse.interpreter.warning", {
                element: command,
                message: "Element 'line' requires attribute 's'."
            });
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
                    interpreter.bus.trigger("wse.interpreter.warning", {
                        element: command,
                        message: "No textbox defined for character '" + speakerId + "'."
                    });
                    return {
                        doNext: true
                    };
                }
                try
                {
                    speakerName = current.getElementsByTagName("displayname")[0].childNodes[0].nodeValue;
                }
                catch (e)
                {}
                break;
            }
        }

        if (typeof interpreter.assets[textboxName] === "undefined")
        {
            interpreter.bus.trigger("wse.interpreter.warning", {
                element: command,
                message: "Trying to use an unknown textbox or character."
            });
            return {
                doNext: true
            };
        }

        text = command.childNodes[0].nodeValue;
        interpreter.log.push(
        {
            speaker: speakerId,
            text: text
        });
        interpreter.assets[textboxName].put(text, speakerName);
        return {
            doNext: doNext,
            wait: true
        };
    };

    out.Interpreter.prototype.commands["do"] = function (command, interpreter, args)
    {
        args = args || {};

        var assetName, action, isAnimation;
        
        interpreter.bus.trigger("wse.interpreter.commands.do", {interpreter: interpreter, command: command}, false);

        assetName = command.getAttribute("asset");
        action = command.getAttribute("action");
        isAnimation = args.animation || false;

        if (assetName === null)
        {
            interpreter.bus.trigger("wse.interpreter.warning", {
                element: command,
                message: "Element of type 'do' must have an attribute 'asset'. Element ignored."
            });
            return;
        }

        if (action === null)
        {
            interpreter.bus.trigger("wse.interpreter.warning", {
                element: command,
                message: "Element of type 'do' must have an attribute 'action'. Element ignored."
            });
            return;
        }

        if (typeof interpreter.assets[assetName] === "undefined" || interpreter.assets[assetName] === null)
        {
            interpreter.bus.trigger("wse.interpreter.warning", {
                element: command,
                message: "Reference to unknown asset '" + assetName + "'."
            });
            return {
                doNext: true
            };
        }

        if (typeof interpreter.assets[assetName][action] === "undefined")
        {
            interpreter.bus.trigger("wse.interpreter.warning", {
                element: command,
                message: "Action '" + action + "' is not defined for asset '" + assetName + "'."
            });
            return {
                doNext: true
            };
        }

        return interpreter.assets[assetName][action](command, args);
    };
    
    out.Interpreter.prototype.createTriggers = function ()
    {
        var triggers, i, len, cur, curName, self, curTrigger;
        
        this.bus.trigger("wse.interpreter.triggers.create", this, false);
        
        self = this;
        
        this.triggers = {};
        
        try
        {
            triggers = this.game.ws.getElementsByTagName("triggers")[0].getElementsByTagName("trigger");
        }
        catch (e)
        {
            console.log(e);
            return;
        }
        
        for (i = 0, len = triggers.length; i < len; i += 1)
        {
            cur = triggers[i];
            curName = cur.getAttribute("name") || null;
            
            if (curName === null)
            {
                this.bus.trigger(
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
                this.bus.trigger(
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

    out.Interpreter.prototype.buildAssets = function ()
    {
        var assets, len, i, cur;

        this.bus.trigger("wse.assets.loading.started");

        try
        {
            assets = this.story.getElementsByTagName("assets")[0].childNodes;
        }
        catch (e)
        {
            this.bus.trigger("wse.interpreter.error", {message: "Error while creating assets: " + e.getMessage()});
        }
        
        len = assets.length;

        for (i = 0; i < len; i += 1)
        {
            cur = assets[i];
            if (cur.nodeType !== 1)
            {
                continue;
            }
            this.createAsset(cur);
        }
    };

    out.Interpreter.prototype.createAsset = function (asset)
    {
        var name, type, self;
        
        this.bus.trigger("wse.interpreter.createasset", {interpreter: this, asset: asset}, false);
        
        name = asset.getAttribute("name");
        type = asset.tagName;
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
        
        type = out.tools.firstLetterUppercase(type);

        if (type in out.assets)
        {
            this.assets[name] = new out.assets[type](asset, this);
            return;
        }
        else
        {
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
        var assets, key, saves;
        
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
        var assets, key;
        
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
        
        var savegame, json, key, savegameList, listKey, lastKey;
        
        savegame = {};
        
        this.bus.trigger("wse.interpreter.save.before", {interpreter: this, savegame: savegame}, false);
        
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
        
        key = this.buildSavegameId(name);
        
        json = JSON.stringify(savegame);
        
        listKey = "wse_" + savegame.gameUrl + "_savegames_list";
        
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
            this.bus.trigger("wse.interpreter.warning", { message: "Savegame could not be created!" });
            this.bus.trigger("wse.interpreter.save.after.error", {interpreter: this, savegame: savegame}, false);
            return false;
        }
        
        this.bus.trigger("wse.interpreter.save.after.success", { interpreter: this, savegame: savegame });
        
        return true;
    };
    
    out.Interpreter.prototype.getSavegameList = function (reversed)
    {
        var json, key, names, i, len, out;
        key = "wse_" + this.game.url + "_savegames_list";
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
        
        this.bus.trigger("wse.interpreter.getsavegamelist", {interpreter: this, list: out, names: names}, false);
        
        return out;
    };
    
    out.Interpreter.prototype.buildSavegameId = function (name)
    {
        var vars = {};
        vars.name = name;
        vars.id = "wse_" + this.game.url + "_savegame_" + name;
        
        this.bus.trigger("wse.interpreter.save.before", {interpreter: this, vars: vars}, false);
        
        return vars.id;
    };
    
    out.Interpreter.prototype.load = function (name)
    {
        var ds, savegame, scene, sceneId, scenes, i, len, self, savegameId;
        self = this;
        
        savegameId = this.buildSavegameId(name);
        
        ds = this.datasource;
        savegame = ds.get(savegameId);
        
        this.bus.trigger("wse.interpreter.load.before", {interpreter: this, savegame: savegame}, false);
        
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
        
        this.currentCommands = scene.childNodes;
        
        // Re-insert choice menu to get back the DOM events associated with it:
        // Remove savegame menu on load:
        (function (interpreter)
        {
            var elements, i, len, cur, index, type, com, rem;
            elements = interpreter.stage.getElementsByTagName("*");
            
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
                    interpreter.bus.trigger("wse.interpreter.warning", { message: "No data-wse-index found on element." });
                    continue;
                }
                
                com = interpreter.currentCommands[index];
                
                if (com.nodeName === "#text" || com.nodeName === "#comment")
                {
                    continue;
                }
                
                console.log("Re-inserting choice menu: ", com);
                interpreter.stage.removeChild(cur);
                interpreter.commands.choice(com, interpreter);
                interpreter.waitCounter -= 1;
//                 interpreter.game.unsubscribeListeners();
            }
        }(this));
        
//         if (savegame.listenersSubscribed)
//         {
//             console.log("Subscribing listeners after loading a savegame...");
//             this.game.subscribeListeners();
//         }
        
        this.bus.trigger("wse.interpreter.load.after", {interpreter: this, savegame: savegame}, false);
        
        return true;
    };
    
    out.Interpreter.prototype.deleteSavegame = function (name)
    {
        var sgs, key, index, json, id;
        
        key = "wse_" + this.game.url + "_savegames_list";
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
            this.datasource.set("wse_" + this.game.url + "_savegames_list", JSON.stringify(sgs));
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
//                 this.game.subscribeListeners();
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
//         this.game.unsubscribeListeners();
        
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
//                     console.log("numberOfFunctionsToWaitFor before loading:", self.numberOfFunctionsToWaitFor);
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
                '<p class="name">' + cur.name + '</p>' +
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
    
    
    out.datasources = {};
    
    out.datasources.LocalStorage = function ()
    {
    };
    
    out.datasources.LocalStorage.prototype.set = function (key, value)
    {
        localStorage.setItem(key, value);
    };
    
    out.datasources.LocalStorage.prototype.get = function (key)
    {
        return localStorage.getItem(key);
    };
    
    out.datasources.LocalStorage.prototype.remove = function (key)
    {
        return localStorage.removeItem(key);
    };
    
    
    out.Trigger = function (trigger, interpreter)
    {
        var self = this, fn;
        
        this.name = trigger.getAttribute("name") || null;
        this.event = trigger.getAttribute("event") || null;
        this.special = trigger.getAttribute("special") || null;
        this.fnName = trigger.getAttribute("function") || null;
        this.interpreter = interpreter;
        this.isSubscribed = false;
        
        if (this.name === null)
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: trigger,
                    message: "No 'name' attribute specified on 'trigger' element."
                }
            );
            return;
        }
        
        if (this.event === null)
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: trigger,
                    message: "No 'event' attribute specified on 'trigger' element '" + this.name + "'."
                }
            );
            return;
        }
        
        if (this.special === null && this.fnName === null)
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: trigger,
                    message: "No suitable action or function found for trigger element '" + this.name + "'."
                }
            );
            return;
        }
        
        this.isKeyEvent = false;
        this.key = null;
        
//         if (this.sub !== null)
//         {
//             fn = function ()
//             {
//                 if (self.interpreter.state === "pause" || self.interpreter.waitCounter > 0)
//                 {
//                     return;
//                 }
//                 var sub = interpreter.game.ws.createElement("sub");
//                 sub.setAttribute("scene", self.sub);
// //                 sub.setAttribute("next", "false");
//                 interpreter.commands.sub(sub, interpreter);
//                 interpreter.next();
//             };
//         }
        
        if (this.special !== null && this.special !== "next")
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: trigger,
                    message: "Unknown special specified on trigger element '" + this.name + "'."
                }
            );
            return;
        }
        
        if (this.special === "next")
        {
            fn = function ()
            {
                if (self.interpreter.state === "pause" || self.interpreter.waitCounter > 0)
                {
                    return;
                }
                self.interpreter.next();
            };
        }
        
        if (this.fnName !== null)
        {
            if (typeof out.functions[this.fnName] !== "function")
            {
                interpreter.bus.trigger(
                    "wse.interpreter.warning",
                    {
                        element: trigger,
                        message: "Unknown function specified on trigger element '" + this.name + "'."
                    }
                );
                return;
            }
            fn = function ()
            {
                out.functions[self.fnName](self.interpreter);
            };
        }
        
        switch (this.event)
        {
            case "keyup":
            case "keydown":
            case "keypress":
                this.isKeyEvent = true;
                this.key = trigger.getAttribute("key") || null;
            
                if (this.key === null)
                {
                    interpreter.bus.trigger(
                        "wse.interpreter.warning",
                        {
                            element: trigger,
                            message: "No 'key' attribute specified on trigger element '" + this.name + "'."
                        }
                    );
                    return;
                }
                
                if (typeof interpreter.game.keys.keys[this.key] === "undefined" || interpreter.game.keys.keys[this.key] === null)
                {
                    interpreter.bus.trigger(
                        "wse.interpreter.warning",
                        {
                            element: trigger,
                            message: "Unknown key '" + this.key + "' specified on trigger element '" + this.name + "'."
                        }
                    );
                    return;
                }
                
                this.fn = function (data)
                {
                    if (data.keys[self.key].kc !== data.event.keyCode)
                    {
                        return;
                    }
                    if (interpreter.keysDisabled > 0)
                    {
                        return;
                    }
                    fn();
                };
                
                return;
            default:
                this.fn = fn;
        }
    };
    
    out.Trigger.prototype.activate = function ()
    {
        if (this.isSubscribed === true)
        {
            return;
        }
        
        this.interpreter.bus.subscribe(
            this.fn,
            this.event
        );
        
        this.isSubscribed = true;
    };
    
    out.Trigger.prototype.deactivate = function ()
    {
        if (this.isSubscribed === false)
        {
            return;
        }
        
        this.interpreter.bus.unsubscribe(
            this.fn,
            this.event
        );
        
        this.isSubscribed = false;
    };


    out.assets = {};
    out.assets.mixins = {};

    out.assets.mixins.move = function (command, args)
    {
        var x, y, z, element, self, 
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
                self.interpreter.waitCounter += 1;
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
                        self.interpreter.waitCounter -= 1;
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
                self.interpreter.waitCounter += 1;
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
                        self.interpreter.waitCounter -= 1;
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
                self.interpreter.waitCounter += 1;
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
                        self.interpreter.waitCounter -= 1;
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
    
    out.assets.mixins.flash = function (command, args)
    {
        var self, duration, wait, bus, stage, element, isAnimation, maxOpacity;
        
        args = args || {};
        self = this;
        wait = command.getAttribute("wait") === "yes" ? true : false;
        duration = command.getAttribute("duration") || 500;
        maxOpacity = command.getAttribute("opacity") || 1;
        element = args.element || document.getElementById(this.cssid);
        
        if (!element)
        {
            this.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "DOM Element for asset is missing!"
                }
            );
            return;
        }
        
        //         console.log("CSS ID: " + this.cssid, element);
        
        bus = args.bus || this.bus;
        stage = args.stage || this.stage;
        isAnimation = args.animation === true ? true : false;
        
        if (!isAnimation) 
        {
            self.interpreter.waitCounter += 1;
        }
            
        out.fx.transform(
            function (v)
            {
                element.style.opacity = v;
            }, 
            0, 
            maxOpacity, 
            {
                duration: duration / 3,
                onFinish: function ()
                {
                    out.fx.transform(
                        function (v)
                        {
                            element.style.opacity = v;
                        },
                        maxOpacity,
                        0,
                        {
                            duration: (duration / 3) * 2,
                            onFinish: !isAnimation ? function ()
                            {
                                self.interpreter.waitCounter -= 1;
                            } : null,
                            easing: out.fx.easing.easeInQuad
                        }
                    );
                },
                easing: out.fx.easing.easeInQuad
            }
        );
        
        bus.trigger("wse.assets.mixins.flash", this);
        
        return {
            doNext: true
        };
    };
    
    out.assets.mixins.flicker = function (command, args)
    {
        var self, duration, bus, stage, times, step, element, 
            isAnimation, fn, iteration, maxOpacity, val1, val2, dur1, dur2;
        
        args = args || {};
        self = this;
        duration = command.getAttribute("duration") || 500;
        times = command.getAttribute("times") || 10;
        maxOpacity = command.getAttribute("opacity") || 1;
        element = args.element || document.getElementById(this.cssid);
        step = duration / times;
        iteration = 0;
        
        if (!element)
        {
            this.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "DOM Element for asset is missing!"
                }
            );
            return;
        }
        
        if (!(parseInt(element.style.opacity, 10)))
        {
            val1 = 0;
            val2 = maxOpacity;
            dur1 = step / 3;
            dur2 = dur1 * 2;
        }
        else
        {
            val2 = 0;
            val1 = maxOpacity;
            dur2 = step / 3;
            dur1 = dur2 * 2;
        }
        
        //         console.log("CSS ID: " + this.cssid, element);
        
        bus = args.bus || this.bus;
        stage = args.stage || this.stage;
        isAnimation = args.animation === true ? true : false;
        
        if (!isAnimation) 
        {
            self.interpreter.waitCounter += 1;
        }
            
        fn = function ()
        {
            iteration += 1;
            out.fx.transform(
                function (v)
                {
                    element.style.opacity = v;
                }, 
                val1, 
                val2, 
                {
                    duration: dur1,
                    onFinish: function ()
                    {
                        out.fx.transform(
                            function (v)
                            {
                                element.style.opacity = v;
                            },
                            val2,
                            val1,
                            {
                                duration: dur2,
                                onFinish: function ()
                                {
                                    if (iteration <= times)
                                    {
                                        setTimeout(fn, 0);
                                        return;
                                    }
                                    if (!isAnimation)
                                    {
                                        self.interpreter.waitCounter -= 1;
                                    }
                                },
                                easing: out.fx.easing.easeInQuad
                            }
                        );
                    },
                    easing: out.fx.easing.easeInQuad
                }
            );
        };
        fn();
        
        bus.trigger("wse.assets.mixins.flicker", this);
        
        return {
            doNext: true
        };
    };

    out.assets.mixins.show = function (command, args)
    {
        var self, duration, wait, effect, direction, ox, oy, prop, 
            bus, stage, element, isAnimation, easing, easingType, interpreter;

        args = args || {};
        self = this;
        wait = command.getAttribute("wait") === "yes" ? true : false;
        duration = command.getAttribute("duration") || 500;
        effect = command.getAttribute("effect") || "fade";
        direction = command.getAttribute("direction") || "right";
        element = args.element || document.getElementById(this.cssid);
        
        if (!element)
        {
            this.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "DOM Element for asset is missing!"
                }
            );
            return;
        }
        
//         console.log("CSS ID: " + this.cssid, element);
        
        interpreter = args.interpreter || this.interpreter;
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
                interpreter.waitCounter += 1;
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
                        interpreter.waitCounter -= 1;
                    } : null,
                    easing: easing
                }
            );
        }
        else
        {
            if (!isAnimation) 
            {
                interpreter.waitCounter += 1;
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
                        interpreter.waitCounter -= 1;
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
        var self, duration, wait, effect, direction, 
            ox, oy, to, prop, isAnimation, element, easingType, easing;

        self = this;
        wait = command.getAttribute("wait") === "yes" ? true : false;
        duration = command.getAttribute("duration") || 500;
        effect = command.getAttribute("effect") || "fade";
        direction = command.getAttribute("direction") || "left";
        isAnimation = args.animation === true ? true : false;
        element = document.getElementById(this.cssid);
        easingType = command.getAttribute("easing") || "sineEaseOut";
        easing = (typeof out.fx.easing[easingType] !== null) ? out.fx.easing[easingType] : out.fx.easing.sineEaseOut;

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
                self.interpreter.waitCounter += 1;
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
                    easing: easing,
                    onFinish: function ()
                    {
                        if (!isAnimation) 
                        {
                            self.interpreter.waitCounter -= 1;
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
                self.interpreter.waitCounter += 1;
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
                    easing: easing,
                    onFinish: function ()
                    {
                        if (!isAnimation) 
                        {
                            self.interpreter.waitCounter -= 1;
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


    out.assets.Character = function (asset, interpreter)
    {
        this.asset = asset;
        this.stage = interpreter.stage;
        this.bus = interpreter.bus;
        this.id = out.tools.getUniqueId();
        this.bus.trigger("wse.assets.character.constructor", this);
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


    out.assets.Imagepack = function (asset, interpreter)
    {
        var element, images, children, i, len, current, name, 
            src, image, self, triggerDecreaseFn;

        this.stage = interpreter.stage;
        this.bus = interpreter.bus;
        this.name = asset.getAttribute("name");
        this.id = out.tools.getUniqueId();
        this.cssid = "wse_imagepack_" + this.id;
        this.interpreter = interpreter;

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

        this.stage.appendChild(element);
        
        this.bus.trigger("wse.assets.imagepack.constructor", this);
    };

    out.assets.Imagepack.prototype.move = out.assets.mixins.move;
    out.assets.Imagepack.prototype.show = out.assets.mixins.show;
    out.assets.Imagepack.prototype.hide = out.assets.mixins.hide;
    out.assets.Imagepack.prototype.flash = out.assets.mixins.flash;
    out.assets.Imagepack.prototype.flicker = out.assets.mixins.flicker;

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
            self.interpreter.waitCounter += 1;
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
                        self.interpreter.waitCounter -= 1;
                    }
                }
            }
        );

        if (this.current !== null)
        {
            if (!isAnimation) 
            {
                self.interpreter.waitCounter += 1;
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
                                    self.interpreter.waitCounter -= 1;
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
            images: images,
            z: this.z
        };
        this.bus.trigger("wse.assets.imagepack.save", { subject: this, saves: obj });
    };
    
    out.assets.Imagepack.prototype.restore = function (obj)
    {
        var name, save;
        save = obj[this.id];
        name = save.current;
        
        this.cssid = save.cssid;
        this.z = save.z;
        
        document.getElementById(this.cssid).style.zIndex = this.z;
        
        if (name !== null && this.images[name] !== null)
        {
            this.current = this.images[name];
        }
        
        this.bus.trigger("wse.assets.imagepack.restore", { subject: this, saves: obj });
    };



    out.assets.Textbox = function (asset, interpreter)
    {

        if (!(this instanceof out.assets.Textbox))
        {
            return new out.assets.Textbox(asset, interpreter);
        }

        var element, nameElement, textElement, cssid, x, y, width, height;

        this.interpreter = interpreter;
        this.name = asset.getAttribute("name");
        this.stage = interpreter.stage;
        this.bus = interpreter.bus;
        this.type = asset.getAttribute("behaviour") || "adv";
        this.z = asset.getAttribute("z") || 5000;
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
        
        element.style.zIndex = this.z;

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
        this.stage.appendChild(element);

        if (this.showNames === false)
        {
            nameElement.style.display = "none";
        }
        
        nameElement.setAttribute("id", this.cssid + "_name");
        textElement.setAttribute("id", this.cssid + "_text");

        this.nameElement = this.cssid + "_name";
        this.textElement = this.cssid + "_text";

        element.style.opacity = 0;

        this.bus.trigger("wse.assets.textbox.constructor", this);
    };

    out.assets.Textbox.prototype.show = out.assets.mixins.show;
    out.assets.Textbox.prototype.hide = out.assets.mixins.hide;
    out.assets.Textbox.prototype.move = out.assets.mixins.move;
    out.assets.Textbox.prototype.flash = out.assets.mixins.flash;
    out.assets.Textbox.prototype.flicker = out.assets.mixins.flicker;

    out.assets.Textbox.prototype.put = function (text, name)
    {
        name = name || null;

        var textElement, nameElement, namePart, self;

        self = this;
        textElement = document.getElementById(this.textElement);
        nameElement = document.getElementById(this.nameElement);

        text = out.tools.replaceVariables(text, this.interpreter);
        text = out.tools.textToHtml(text, this.nltobr);
        
        self.interpreter.waitCounter += 1;

        if (this.type === "adv")
        {
            self.interpreter.waitCounter += 1;
            out.fx.transform(
                function (v)
                {
                    textElement.style.opacity = v;
                }, 
                1, 
                0, 
                {
                    duration: 50,
                    onFinish: function ()
                    {
                        self.interpreter.waitCounter -= 1;
                    }
                }
            );
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
            self.interpreter.waitCounter += 1;
            setTimeout(
                function ()
                {
                    textElement.innerHTML += namePart + text;
                    nameElement.innerHTML = name;
                    out.fx.transform(
                        function (v)
                        {
                            textElement.style.opacity = v;
                        }, 
                        0, 
                        1, 
                        {
                            duration: 50,
                            onFinish: function ()
                            {
                                self.interpreter.waitCounter -= 1;
                            }
                        }
                    );
                }, 
                50
            );
        }
        else
        {
            self.interpreter.waitCounter += 1;
            setTimeout(
                function ()
                {
                    textElement.innerHTML += "<p>" + namePart + text + "</p>";
                    nameElement.innerHTML = name;
                    self.interpreter.waitCounter -= 1;
                }, 
                200
            );
        }
        
        this.bus.trigger("wse.assets.textbox.put", this, false);
        self.interpreter.waitCounter -= 1;

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
            textElement: this.textElement,
            z: this.z
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
        this.z = save.z;
        
        document.getElementById(this.cssid).style.zIndex = this.z;
    };



    out.assets.Audio = function (asset, interpreter)
    {
        var self, sources, i, len, j, jlen, current, track, trackName, trackFiles, href, type, source, tracks, bus;

        bus = interpreter.bus;
        self = this;
        this.au = new Audio();
        this.au.setAttribute("preload", "auto");
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
            track.setAttribute("preload", "auto");
            trackFiles = {};
            trackName = current.getAttribute("title");

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
            dupl.setAttribute("preload", "auto");
            src = self.current.src;
            try
            {
                document.body.removeChild(self.current);
            }
            catch (e)
            {
                console.log(e);
            }
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

            if (self.isPlaying === true)
            {
                self.stop(command);
            }
            
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
                self.current.volume = 0.0001;
                self.current.play();
                self.fadeIn();
            }
            else
            {
                self.current.play();
            }
            
            this.bus.trigger("wse.assets.audio.play", this);
            
            return {doNext: true};
        };

        this.stop = function ()
        {
            if (self.current === null)
            {
                this.bus.trigger("wse.interpreter.warning", {
                    element: asset,
                    message: "No track set for audio element '" + this.name + "'."
                });
                return {doNext: true};
            }
            if (self.fade === true)
            {
                self.fadeOut(
                    function ()
                    {
                        self.current.pause();
                        self.currentTime = 0.1;
                        self.renewCurrent();
                        self.isPlaying = false;
                    }
                );
            }
            else
            {
                self.current.pause();
                self.currentTime = 0.1;
                self.renewCurrent();
                self.isPlaying = false;
            }
            this.bus.trigger("wse.assets.audio.play", this);
            return {doNext: true};
        };
        
        this.pause = function ()
        {
            this.current.pause();
            return {doNext: true};
        };

        this.fadeIn = function ()
        {
            var fn;
            fn = function ()
            {
                if (self.current.volume > 0.99)
                {
                    self.current.volume = 1;
                    return;
                }
                self.current.volume += 0.01;
                setTimeout(fn, 10);
            };
            setTimeout(fn, 10);
            return {doNext: true};
        };

        this.fadeOut = function (cb)
        {
            var fn;
            cb = typeof cb === "function" ? cb : function () {};
            
            fn = function ()
            {
                if (self.current.volume < 0.01)
                {
                    self.current.volume = 0;
                    cb();
                    return;
                }
                self.current.volume -= 0.01;
                setTimeout(fn, 10);
            };
            
            setTimeout(fn, 10);
            return {doNext: true};
        };

        if (this.autopause === false)
        {
            console.log("autopause is false");
            return;
        }

        out.tools.attachEventListener(
        window, 'blur', function ()
        {
            console.log("onblur function for audio called");
            if (self.isPlaying === true)
            {
                self.fadeOut(function () { self.current.pause(); });
            }
        });

        out.tools.attachEventListener(
        window, 'focus', function ()
        {
            console.log("onfocus function for audio called");
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
            return {doNext: true};
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
        return {doNext: true};
    };
    
    out.assets.Audio.prototype.save = function (obj)
    {
        obj[this.id] = {
            assetType: "Audio",
            isPlaying: this.isPlaying,
            fade: this.fade,
            currentIndex: this.currentIndex,
            currentTime: 0
        };
        if (this.isPlaying)
        {
            obj[this.id].currentTime = this.current.currentTime;
        }
        this.bus.trigger("wse.assets.audio.save", this);
    };
    
    out.assets.Audio.prototype.restore = function (obj)
    {
        var vals = obj[this.id];
        this.isPlaying = vals.isPlaying;
        this.fade = vals.fade;
        this.currentIndex = vals.currentIndex;
        this.current.currentTime = vals.currentTime;
        if (this.isPlaying)
        {
            this.play();
        }
        else
        {
            this.stop();
        }
        this.bus.trigger("wse.assets.audio.restore", this);
    };



    out.assets.Animation = function (asset, interpreter)
    {
        var groups, i, len, current, transformations, jlen,  
            self, doElements, createTransformFn, loopFn, runDoCommandFn;

        if (!(this instanceof out.assets.Animation))
        {
            return new out.assets.Animation(asset, interpreter);
        }

        this.stage = interpreter.stage;
        this.bus = interpreter.bus;
        this.asset = asset;
        this.name = asset.getAttribute("name");
        this.cbs = [];
        this.assets = interpreter.assets;
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
        
        runDoCommandFn = function (del, tim)
        {
            var curDur, curDoEl;
            
            curDoEl = del;
            curDur = curDoEl.getAttribute("duration");
            //                     console.log("Running do command.");
            interpreter.commands["do"](curDoEl, interpreter, {
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
                from, to, unit, curTr, curAs, curAsName, dur, propName, j, easingType, opt, di;
                
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
                        curAs = document.getElementById(self.assets[curAsName].cssid) || self.stage;
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
                    runDoCommandFn(doEls[di], timers);
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
        this.bus.trigger("wse.assets.animation.started", this);
    };

    out.assets.Animation.prototype.stop = function ()
    {
        this.anim.stop();
        this.isRunning = false;
        this.bus.trigger("wse.assets.animation.stopped", this);
    };
    
    out.assets.Animation.prototype.save = function (obj)
    {
        obj[this.id] = { 
            assetType: "Animation",
            isRunning: this.isRunning,
            index: this.anim.index
        };
        this.bus.trigger("wse.assets.animation.save", { subject: this, saves: obj });
    };
    
    out.assets.Animation.prototype.restore = function (obj)
    {
        this.isRunning = obj[this.id].isRunning;
        
        if (this.isRunning === true)
        {
            this.anim.index = obj.index;
            this.start();
        }
        
        this.bus.trigger("wse.assets.animation.restore", { subject: this, saves: obj });
    };
    
    
    out.assets.Curtain = function (asset, interpreter)
    {
        this.asset = asset;
        this.interpreter = interpreter;
        this.bus = interpreter.bus;
        this.stage = interpreter.stage;
        this.color = asset.getAttribute("color") || "black";
        this.z = asset.getAttribute("z") || 20000;
        this.id = out.tools.getUniqueId();
        this.cssid = "WSECurtain_" + this.id;
        this.element = document.createElement("div");
        
        this.element.setAttribute("id", this.cssid);
        this.element.setAttribute("class", "WSECurtain");
        this.element.style.position = "absolute";
        this.element.style.left = 0;
        this.element.style.top = 0;
        this.element.style.width = this.stage.offsetWidth + "px";
        this.element.style.height = this.stage.offsetHeight + "px";
        this.element.style.opacity = 0;
        this.element.style.backgroundColor = this.color;
        this.element.style.zIndex = this.z;
        
        this.stage.appendChild(this.element);
    };
    
    out.assets.Curtain.prototype.set = function (asset)
    {
        this.color = asset.getAttribute("color") || "black";
        this.element.style.backgroundColor = this.color;
    };
    
    out.assets.Curtain.prototype.show = out.assets.mixins.show;
    out.assets.Curtain.prototype.hide = out.assets.mixins.hide;
    out.assets.Curtain.prototype.move = out.assets.mixins.move;
    out.assets.Curtain.prototype.flash = out.assets.mixins.flash;
    out.assets.Curtain.prototype.flicker = out.assets.mixins.flicker;
    
    out.assets.Curtain.prototype.save = function (obj)
    {
        obj[this.id] = {
            color: this.color,
            cssid: this.cssid,
            z: this.z
        };
    };
    
    out.assets.Curtain.prototype.restore = function (obj)
    {
        this.color = obj[this.id].color;
        this.cssid = obj[this.id].cssid;
        this.z = obj[this.id].z;
        try
        {
            this.element = document.getElementById(this.cssid);
        }
        catch (e)
        {
            this.bus.trigger(
                "wse.interpreter.warning", 
                { message: "Element with CSS ID '" + this.cssid + "' could not be found." }
            );
            return;
        }
        this.element.style.backgroundColor = this.color;
        this.element.style.zIndex = this.z;
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
            /\{\$\$([a-zA-Z0-9_]+)\}/g,
            function () 
            {
                var name = arguments[1];
                if (interpreter.globalVars.has(name))
                {
                    return "" + interpreter.globalVars.get(name);
                }
                return "";
            }
        );
        text = text.replace(
            /\{\$([a-zA-Z0-9_]+)\}/g,
            function () 
            {
                var name = arguments[1];
                if (name in interpreter.runVars)
                {
                    return "" + interpreter.runVars[name];
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
    
    out.tools.getUniqueId = (function ()
    {
        var uniqueIdCount = 0;
        return function ()
        {
            uniqueIdCount += 1;
            return uniqueIdCount;
        };
    }());
    
    out.tools.firstLetterUppercase = function (input)
    {
        if (input.length < 1)
        {
            return "";
        }
        return "" + input.charAt(0).toUpperCase() + input.replace(/^.{1}/, "");
    };
    
    
    
    out.tools.ui = {
        
        confirm: function (interpreter, args)
        {
            var title, message, trueText, falseText, callback, root, dialog;
            var tEl, mEl, yesEl, noEl, container, pause, oldState, doNext;
            
            interpreter.waitCounter += 1;
//             interpreter.keysDisabled += 1;
            
            args = args || {};
            title = args.title || "Confirm?";
            message = args.message || "Do you want to proceed?";
            trueText = args.trueText || "Yes";
            falseText = args.falseText || "No";
            callback = typeof args.callback === "function" ? args.callback : function () {};
            root = args.parent || interpreter.stage;
            pause = args.pause === true ? true : false;
            oldState = interpreter.state;
            doNext = args.doNext === true ? true : false;
            
            if (pause === true)
            {
                interpreter.state = "pause";
            }
            
            container = document.createElement("div");
            container.setAttribute("class", "WSEUIContainer");
            container.setAttribute("data-wse-remove", "true");
            dialog = document.createElement("div");
            dialog.setAttribute("class", "WSEUIDialog WSEUIConfirm");
            
            tEl = document.createElement("div");
            tEl.innerHTML = title;
            tEl.setAttribute("class", "title");
            
            mEl = document.createElement("div");
            mEl.innerHTML = message;
            mEl.setAttribute("class", "message");
            
            yesEl = document.createElement("input");
            yesEl.setAttribute("value", trueText);
            yesEl.value = trueText;
            yesEl.setAttribute("class", "true button");
            yesEl.setAttribute("type", "button");
            yesEl.addEventListener(
                "click",
                function (ev)
                {
                    ev.stopPropagation();
                    ev.preventDefault();
                    root.removeChild(container);
                    interpreter.waitCounter -= 1;
                    //                     interpreter.keysDisabled -= 1;
                    if (pause === true)
                    {
                        interpreter.state = oldState;
                    }
                    callback(true);
                    if (doNext === true)
                    {
                        setTimeout(function () { interpreter.next(); }, 0);
                    }
                }
            );
            
            noEl = document.createElement("input");
            noEl.setAttribute("value", falseText);
            noEl.value = falseText;
            noEl.setAttribute("class", "false button");
            noEl.setAttribute("type", "button");
            noEl.addEventListener(
                "click",
                function (ev)
                {
                    ev.stopPropagation();
                    ev.preventDefault();
                    root.removeChild(container);
                    interpreter.waitCounter -= 1;
                    //                     interpreter.keysDisabled -= 1;
                    if (pause === true)
                    {
                        interpreter.state = oldState;
                    }
                    callback(false);
                    if (doNext === true)
                    {
                        setTimeout(function () { interpreter.next(); }, 0);
                    }
                }
            );
            
            dialog.appendChild(tEl);
            dialog.appendChild(mEl);
            dialog.appendChild(yesEl);
            dialog.appendChild(noEl);
            container.appendChild(dialog);
            root.appendChild(container);
            
            yesEl.focus();
        },
        
        alert: function (interpreter, args)
        {
            var title, message, okText, callback, root, dialog;
            var tEl, mEl, buttonEl, container, pause, oldState, doNext;
            
            interpreter.waitCounter += 1;
//             interpreter.keysDisabled += 1;
            
            args = args || {};
            title = args.title || "Alert!";
            message = args.message || "Please take notice of this!";
            okText = args.okText || "OK";
            callback = typeof args.callback === "function" ? args.callback : function () {};
            root = args.parent || interpreter.stage;
            pause = args.pause === true ? true : false;
            oldState = interpreter.state;
            doNext = args.doNext === true ? true : false;
            
            if (pause === true)
            {
                interpreter.state = "pause";
            }
            
            container = document.createElement("div");
            container.setAttribute("class", "WSEUIContainer");
            container.setAttribute("data-wse-remove", "true");
            dialog = document.createElement("div");
            dialog.setAttribute("class", "WSEUIDialog WSEUIConfirm");
            
            tEl = document.createElement("div");
            tEl.innerHTML = title;
            tEl.setAttribute("class", "title");
            
            mEl = document.createElement("div");
            mEl.innerHTML = message;
            mEl.setAttribute("class", "message");
            
            buttonEl = document.createElement("input");
            buttonEl.setAttribute("value", okText);
            buttonEl.value = okText;
            buttonEl.setAttribute("class", "true button");
            buttonEl.setAttribute("type", "button");
            buttonEl.addEventListener(
                "click",
                function (ev)
                {
                    ev.stopPropagation();
                    ev.preventDefault();
                    root.removeChild(container);
                    interpreter.waitCounter -= 1;
                    //                     interpreter.keysDisabled -= 1;
                    if (pause === true)
                    {
                        interpreter.state = oldState;
                    }
                    callback(true);
                    if (doNext === true)
                    {
                        setTimeout(function () { interpreter.next(); }, 0);
                    }
                }
            );
            
            dialog.appendChild(tEl);
            dialog.appendChild(mEl);
            dialog.appendChild(buttonEl);
            container.appendChild(dialog);
            root.appendChild(container);
            
            buttonEl.focus();
        },
        
        prompt: function (interpreter, args)
        {
            var title, message, submitText, cancelText, callback, root, dialog, oldState;
            var tEl, mEl, buttonEl, cancelEl, inputEl, container, defaultValue, pause, doNext;
            
            interpreter.waitCounter += 1;
//             interpreter.keysDisabled += 1;
            
            args = args || {};
            title = args.title || "Input required";
            message = args.message || "Please enter something:";
            submitText = args.submitText || "Submit";
            cancelText = args.cancelText || "Cancel";
            defaultValue = args.defaultValue || "";
            callback = typeof args.callback === "function" ? args.callback : function () {};
            root = args.parent || interpreter.stage;
            pause = args.pause === true ? true : false;
            oldState = interpreter.state;
            doNext = args.doNext === true ? true : false;
            
            if (pause === true)
            {
                interpreter.state = "pause";
            }
            
            container = document.createElement("div");
            container.setAttribute("class", "WSEUIContainer");
            container.setAttribute("data-wse-remove", "true");
            dialog = document.createElement("div");
            dialog.setAttribute("class", "WSEUIDialog WSEUIPrompt");
            
            tEl = document.createElement("div");
            tEl.innerHTML = title;
            tEl.setAttribute("class", "title");
            
            mEl = document.createElement("div");
            mEl.innerHTML = message;
            mEl.setAttribute("class", "message");
            
            inputEl = document.createElement("input");
            inputEl.setAttribute("value", defaultValue);
            inputEl.value = defaultValue;
            inputEl.setAttribute("class", "input text");
            inputEl.setAttribute("type", "text");
            
            buttonEl = document.createElement("input");
            buttonEl.setAttribute("value", submitText);
            buttonEl.value = submitText;
            buttonEl.setAttribute("class", "submit button");
            buttonEl.setAttribute("type", "button");
            buttonEl.addEventListener(
                "click",
                function (ev)
                {
                    var val = inputEl.value;
                    ev.stopPropagation();
                    ev.preventDefault();
                    root.removeChild(container);
                    interpreter.waitCounter -= 1;
//                     interpreter.keysDisabled -= 1;
                    if (pause === true)
                    {
                        interpreter.state = oldState;
                    }
                    callback(val);
                    if (doNext === true)
                    {
                        setTimeout(function () { interpreter.next(); }, 0);
                    }
                }
            );
            
            cancelEl = document.createElement("input");
            cancelEl.setAttribute("value", cancelText);
            cancelEl.value = cancelText;
            cancelEl.setAttribute("class", "cancel button");
            cancelEl.setAttribute("type", "button");
            cancelEl.addEventListener(
                "click",
                function (ev)
                {
                    ev.stopPropagation();
                    ev.preventDefault();
                    root.removeChild(container);
                    interpreter.waitCounter -= 1;
                    //                     interpreter.keysDisabled -= 1;
                    if (pause === true)
                    {
                        interpreter.state = oldState;
                    }
                    callback(null);
                    if (doNext === true)
                    {
                        setTimeout(function () { interpreter.next(); }, 0);
                    }
                }
            );
            
            dialog.appendChild(tEl);
            dialog.appendChild(mEl);
            dialog.appendChild(inputEl);
            dialog.appendChild(buttonEl);
            dialog.appendChild(cancelEl);
            container.appendChild(dialog);
            root.appendChild(container);
            
            inputEl.focus();
        }
        
    };
    
    out.functions = {
        
        savegames: function (interpreter)
        {
            interpreter.toggleSavegameMenu();
        },
        
        stageclick_disable: function (interpreter)
        {
            interpreter.game.unsubscribeListeners();
        },
        
        stageclick_enable: function (interpreter)
        {
            interpreter.game.subscribeListeners();
        }
        
    };
    
    out.commands = out.Interpreter.prototype.commands;

    return out;

}(
    typeof Squiddle === "undefined" ? false : Squiddle, 
    typeof MO5 === "undefined" ? false : MO5, 
    typeof STEINBECK === "undefined" ? false : STEINBECK
));


(function (module)
{
    "use strict";
    
    var makeInputFn = function (type)
    {
        return function (command, interpreter)
        {
            var title, message, container, key, doNext;
            title = command.getAttribute("title") || "Input required...";
            message = command.getAttribute("message") || "Your input is required:";
            key = command.getAttribute("var") || null;
            doNext = command.getAttribute("next") === "false" ? false : true;
            
            if (key === null)
            {
                interpreter.bus.trigger(
                    "wse.interpreter.warning",
                    {element: command, message: "No 'var' attribute defined on " + type + " command. Command ignored."}
                );
                return {
                    doNext: true
                };
            }
            
            container = interpreter.runVars;
            
            module.tools.ui[type](
                interpreter, 
                {
                    title: title, 
                    message: message,
                    pause: true,
                    doNext: doNext,
                    callback: function (decision)
                    {
                        container[key] = "" + decision;
                    }
                }
            );
            return {doNext: true};
        };
    }; 
    
    module.commands.alert = function (command, interpreter)
    {
        var title, message, doNext;
        title = command.getAttribute("title") || "Alert!";
        message = command.getAttribute("message") || "Alert!";
        doNext = command.getAttribute("next") === "false" ? false : true;
        module.tools.ui.alert(
            interpreter, 
            {
                title: title, 
                message: message,
                pause: true,
                doNext: doNext
            }
        );
        return {doNext: true};
    };
    
    module.commands.confirm = makeInputFn("confirm");
    module.commands.prompt = makeInputFn("prompt");
}(WSE));