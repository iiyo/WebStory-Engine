/* global using */

using(
    "MO5.transform",
    "WSE.dataSources.LocalStorage",
    "WSE.Trigger",
    "WSE.tools",
    "WSE.tools.ui",
    "WSE",
    "WSE.tools::logError",
    "WSE.tools::warn",
    "WSE.LoadingScreen",
    "WSE.tools::getSerializedNodes"
).
define("WSE.Interpreter", function (
    transform,
    LocalStorageSource,
    Trigger,
    tools,
    ui,
    WSE,
    logError,
    warn,
    LoadingScreen,
    getSerializedNodes
) {
    
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
    function Interpreter (game) {
        
        var datasource, key;
        
        WSE.trigger("wse.interpreter.constructor", {game: game, interpreter: this});
        
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
        datasource = new LocalStorageSource();
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
            
            set: function (name, value) {
                datasource.set(key + name, value);
            },
            
            get: function (name) {
                return datasource.get(key + name);
            },
            
            has: function (name) {
                
                if (datasource.get(key + name) === null) {
                    return false;
                }
                
                return true;
            }
        };
        
        this._loadingScreen = new LoadingScreen();
        
        if (this.debug === true) {
            this.game.bus.debug = true;
        }
    };
    
    Interpreter.prototype.start = function () {
        
        var self, fn, makeKeyFn, bus, startTime = Date.now();
        
        this.story = this.game.ws;
        this.stage = this.game.stage;
        this.bus = this.game.bus;
        this.index = 0;
        this.currentElement = 0;
        this.sceneId = null;
        this.scenePath = [];
        this.currentCommands = [];
        this.wait = false;
        this.startTime = Math.round(+new Date() / 1000);
        this.stopped = false;
        
        self = this;
        bus = this.bus;
        
        this._startLoadingScreen();
        
        // Adds location info to warnings and errors.
        fn = function (data) {
            
            var section, element, msg;
            
            data = data || {};
            element = data.element || null;
            section = null;
            
            if (element !== null) {
                
                try {
                    section = data.element.tagName === "asset" ? "assets" : null;
                    section = data.element.parent.tagName === "settings" ? "settings" : null;
                }
                catch (e)
                {}
            }
            
            section = section || "scenes";
            
            switch (section) {
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
            function () {
                console.log("Game over.");
            }, 
            "wse.interpreter.end"
        );
        
        bus.subscribe(
            function () {
                self.numberOfFunctionsToWaitFor += 1;
            }, 
            "wse.interpreter.numberOfFunctionsToWaitFor.increase"
        );
        
        bus.subscribe(
            function () {
                self.numberOfFunctionsToWaitFor -= 1;
            },
            "wse.interpreter.numberOfFunctionsToWaitFor.decrease"
        );
        
        bus.subscribe(
            this._loadingScreen.addItem.bind(this._loadingScreen), 
            "wse.assets.loading.increase"
        );
        
        bus.subscribe(
            this._loadingScreen.itemLoaded.bind(this._loadingScreen), 
            "wse.assets.loading.decrease"
        );
        
        this.buildAssets();
        this.createTriggers();
        
        makeKeyFn = function (type) {
            
            return function (ev) {
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
        
        this._assetsLoaded = false;
        
        this._loadingScreen.subscribe("finished", function () {
            
            var time = Date.now() - startTime;
            
            if (self._assetsLoaded) {
                return;
            }
            
            self._assetsLoaded = true;
            
            if (time < 1000) {
                setTimeout(self.runStory.bind(self), 1000 - time);
            }
            else {
                self.runStory();
            }
        });
        
        if (this._loadingScreen.count() < 1) {
            this._assetsLoaded = true;
            this.runStory();
        }
    };
    
    Interpreter.prototype.runStory = function () {
        
        var self;
        
        self = this;
        
        if (this.assetsLoading > 0) {
            
            (function () {
                
                var timeoutFn;
                
                timeoutFn = function () {
                    self.runStory();
                };
                
                setTimeout(timeoutFn, 100);
            }());
            
            return;
        }
        
        this.bus.trigger("wse.assets.loading.finished");
        this._loadingScreen.hide();
        this.startTime = Math.round(+new Date() / 1000);
        this.changeScene(this.getFirstScene());
    };
    
    Interpreter.prototype.getFirstScene = function () {
        
        var scenes, len, startScene;
        
        scenes = this.story.getElementsByTagName("scene");
        this.scenes = scenes;
        len = scenes.length;
        
        startScene = this.getSceneById("start");
        
        if (startScene !== null) {
            return startScene;
        }
        
        if (len < 1) {
            logError(this.bus, "No scenes found!");
            return null;
        }
        
        return scenes[0];
    };
    
    Interpreter.prototype.changeScene = function (scene) {
        this.changeSceneNoNext(scene);
        this.next();
    };
    
    Interpreter.prototype.changeSceneNoNext = function (scene) {
        
        var len, id, bus = this.bus;
        
        bus.trigger(
            "wse.interpreter.changescene.before",
            {
                scene: scene,
                interpreter: this
            },
            false
        );
        
        if (typeof scene === "undefined" || scene === null) {
            logError(bus, "Scene does not exist.");
            return;
        }
        
        id = scene.getAttribute("id");
        this.visitedScenes.push(id);
        
        if (id === null) {
            logError(bus, "Encountered scene without id attribute.");
            return;
        }
        
        bus.trigger("wse.interpreter.message", "Entering scene '" + id + "'.");
        
        while (this.scenePath.length > 0) {
            this.popFromCallStack();
        }
        
        this.currentCommands = scene.childNodes;
        len = this.currentCommands.length;
        this.index = 0;
        this.sceneId = id;
        this.scenePath = [];
        this.currentElement = 0;
        
        if (len < 1) {
            warn(bus, "Scene '" + id + "' is empty.", scene);
            return;
        }
        
        this.numberOfFunctionsToWaitFor = 0;
        
        bus.trigger(
            "wse.interpreter.changescene.after",
            {
                scene: scene,
                interpreter: this
            },
            false
        );
    };
    
    Interpreter.prototype.pushToCallStack = function () {
        
        var obj = {};
        
        obj.index = this.index;
        obj.sceneId = this.sceneId;
        obj.scenePath = this.scenePath.slice();
        obj.currentElement = this.currentElement;
        
        this.callStack.push(obj);
    };
    
    Interpreter.prototype.popFromCallStack = function () {
        
        var top = this.callStack.pop(), scenePath = top.scenePath.slice();
        
        this.bus.trigger(
            "wse.interpreter.message", 
            "Returning from sub scene '" + this.sceneId + "' to scene '" + top.sceneId + "'...",
            false
        );
        
        this.index = top.index + 1;
        this.sceneId = top.sceneId;
        this.scenePath = top.scenePath;
        this.currentScene = this.getSceneById(top.sceneId);
        this.currentElement = top.currentElement;
        
        this.currentCommands = this.currentScene.childNodes;
        
        while (scenePath.length > 0) {
            this.currentCommands = this.currentCommands[scenePath.shift()].childNodes;
        }
    };
    
    Interpreter.prototype.getSceneById = function (sceneName) {
        
        var i, len, current, scene;
        
        scene = null;
        
        for (i = 0, len = this.scenes.length; i < len; i += 1) {
            
            current = this.scenes[i];
            
            if (current.getAttribute("id") === sceneName) {
                scene = current;
                break;
            }
        }
        
        if (scene === null) {
            warn(this.bus, "Scene '" + sceneName + "' not found!");
        }
        
        return scene;
    };
    
    Interpreter.prototype.next = function (triggeredByUser) {
        
        var nodeName, command, check, self, stopObj, bus = this.bus;
        
        stopObj = {
            stop: false
        };
        
        triggeredByUser = triggeredByUser === true ? true : false;
        
        bus.trigger("wse.interpreter.next.before", this, false);
        
        if (triggeredByUser === true) {
            bus.trigger("wse.interpreter.next.user", stopObj, false);
        }
        
        if (stopObj.stop === true) {
            return;
        }
        
        self = this;
        
        if (this.state === "pause") {
            return;
        }
        
        if (this.waitForTimer === true || (this.wait === true && this.waitCounter > 0)) {
            
            setTimeout(function () { self.next(); }, 0);
            
            return;
        }
        
        if (this.wait === true && this.numberOfFunctionsToWaitFor < 1) {
            this.wait = false;
        }
        
        this.stopped = false;
        
        if (this.index >= this.currentCommands.length) {
            
            if (this.callStack.length > 0) {
                
                this.popFromCallStack();
                setTimeout(function () { self.next(); }, 0);
                
                return;
            }
            
            bus.trigger("wse.interpreter.next.after.end", this, false);
            bus.trigger("wse.interpreter.end", this);
            
            return;
        }
        
        command = this.currentCommands[this.index];
        nodeName = command.nodeName;
        
        // ignore text and comment nodes:
        if (nodeName === "#text" || nodeName === "#comment") {
            
            this.index += 1;
            setTimeout(function () { self.next(); }, 0);
            bus.trigger("wse.interpreter.next.ignore", this, false);
            
            return;
        }
        
        bus.trigger("wse.interpreter.next.command", command);
        this.currentElement += 1;
        check = this.runCommand(this.currentCommands[this.index]);
        
        check = check || {};
        check.doNext = check.doNext === false ? false : true;
        check.wait = check.wait === true ? true : false;
        check.changeScene = check.changeScene || null;
        
        if (check.wait === true) {
            this.wait = true;
        }
        
        this.index += 1;
        
        if (check.changeScene !== null) {
            
            this.changeScene(check.changeScene);
            
            return;
        }
        
        if (check.doNext === true) {
            
            setTimeout(function () { self.next(); }, 0);
            bus.trigger("wse.interpreter.next.after.donext", this, false);
            
            return;
        }
        
        this.stopped = true;
        
        bus.trigger("wse.interpreter.next.after.nonext", this, false);
    };
    
    Interpreter.prototype.checkIfvar = function (command) {
        
        var ifvar, ifval, ifnot, varContainer, bus = this.bus;
        
        ifvar = command.getAttribute("ifvar") || null;
        ifval = command.getAttribute("ifvalue");
        ifnot = command.getAttribute("ifnot");
        
        if (ifvar !== null || ifval !== null || ifnot !== null) {
            
            varContainer = this.runVars;
            
            if (!(ifvar in varContainer)) {
                
                warn(bus, "Unknown variable '" + ifvar +
                    "' used in condition. Ignoring command.", command);
                
                bus.trigger(
                    "wse.interpreter.runcommand.after.condition.error.key",
                    {
                        interpreter: this,
                        command: command
                    }, 
                    false
                );
                
                return false;
            }
            
            if (ifnot !== null && ("" + varContainer[ifvar] === "" + ifnot)) {
                
                bus.trigger(
                    "wse.interpreter.message", "Conidition not met. " + ifvar + "==" + ifnot);
                bus.trigger(
                    "wse.interpreter.runcommand.after.condition.false",
                    {
                        interpreter: this,
                        command: command
                    }, 
                    false
                );
                
                return false;
            }
            else if (ifval !== null && ("" + varContainer[ifvar]) !== "" + ifval) {
                
                bus.trigger("wse.interpreter.message", "Conidition not met.");
                bus.trigger(
                    "wse.interpreter.runcommand.after.condition.false",
                    {
                        interpreter: this,
                        command: command
                    }, 
                    false
                );
                
                return false;
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
        
        return true;
    };
    
    Interpreter.prototype.runCommand = function (command) {
        
        var tagName, assetName, bus = this.bus;
        
        this.bus.trigger(
            "wse.interpreter.runcommand.before", 
            {
                interpreter: this,
                command: command
            }, 
            false
        );
        
        tagName = command.tagName;
        assetName = command.getAttribute("asset") || null;
        
        if (!this.checkIfvar(command)) {
            return {
                doNext: true
            };
        }
        
        if (tagName in WSE.commands) {
            
            bus.trigger(
                "wse.interpreter.runcommand.after.command",
                {
                    interpreter: this,
                    command: command
                }, 
                false
            );
            
            bus.trigger('game.commands.' + tagName);
            
            return WSE.commands[tagName](command, this);
        }
        else if (
            assetName !== null &&
            assetName in this.assets &&
            typeof this.assets[assetName][tagName] === "function" &&
            tagName.match(/(show|hide|clear|flicker|flash|play|start|stop|pause|move|shake|set)/)
        ) {
            
            bus.trigger('game.assets.' + assetName + '.' + tagName);
            
            return this.assets[assetName][tagName](command, this);
        }
        else {
            
            warn(bus, "Unknown element '" + tagName + "'.", command);
            
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
    
    Interpreter.prototype.createTriggers = function () {
        
        var triggers, i, len, cur, curName, self, curTrigger, bus = this.bus;
        
        bus.trigger("wse.interpreter.triggers.create", this, false);
        
        self = this;
        
        this.triggers = {};
        
        try {
            triggers = this.game.ws.getElementsByTagName("triggers")[0].
                getElementsByTagName("trigger");
        }
        catch (e) {
            console.log(e);
            return;
        }
        
        for (i = 0, len = triggers.length; i < len; i += 1) {
            
            cur = triggers[i];
            curName = cur.getAttribute("name") || null;
            
            if (curName === null) {
                warn(bus, "No name specified for trigger.", cur);
                continue;
            }
            
            if (typeof this.triggers[curName] !== "undefined" && this.triggers[curName] !== null) {
                warn(bus, "A trigger with the name '" + curName +
                    "' already exists.", cur);
                continue;
            }
            
            curTrigger = new Trigger(cur, this);
            
            if (typeof curTrigger.fn === "function") {
                this.triggers[curName] = curTrigger;
            }
        }
    };
    
    Interpreter.prototype.buildAssets = function () {
        
        var assets, len, i, cur, bus = this.bus;
        
        bus.trigger("wse.assets.loading.started");
        
        try {
            assets = this.story.getElementsByTagName("assets")[0].childNodes;
        }
        catch (e) {
            logError(bus, "Error while creating assets: " + e.getMessage());
        }
        
        len = assets.length;
        
        for (i = 0; i < len; i += 1) {
            
            cur = assets[i];
            
            if (cur.nodeType !== 1) {
                continue;
            }
            
            this.createAsset(cur);
        }
    };
    
    Interpreter.prototype.createAsset = function (asset) {
        
        var name, assetType, self, bus = this.bus;
        
        bus.trigger(
            "wse.interpreter.createasset",
            {
                interpreter: this,
                asset: asset
            }, 
            false
        );
        
        name = asset.getAttribute("name");
        assetType = asset.tagName;
        self = this;
        
        if (name === null) {
            logError(bus, "Expected attribute 'name'.", asset);
            return;
        }
        
        if (assetType === null) {
            warn(bus, "Expected attribute 'type' on asset '" + name + "'.", asset);
            return;
        }
        
        if (typeof this.assets[name] !== "undefined") {
            warn(bus, "Trying to override existing asset '" + name + "'.", asset);
        }
        
        assetType = tools.firstLetterUppercase(assetType);
        
        if (assetType in WSE.assets) {
            this.assets[name] = new WSE.assets[assetType](asset, this);
            return;
        }
        else {
            warn(bus, "Unknown asset type '" + assetType + "'.", asset);
            return;
        }
    };
    
    Interpreter.prototype.createSaveGame = function () {
        
        var assets, key, saves;
        
        saves = {};
        assets = this.assets;
        
        for (key in assets) {
            
            if (assets.hasOwnProperty(key)) {
                
                try {
                    saves[key] = assets[key].save();
                }
                catch (e) {
                    console.log("WSE Internal Error: Asset '" + key + 
                        "' does not have a 'save' method!");
                }
            }
        }
        
        return saves;
    };
    
    Interpreter.prototype.restoreSaveGame = function (saves) {
        
        var assets, key;
        
        assets = this.assets;
        
        for (key in assets) {
            
            if (assets.hasOwnProperty(key)) {
                
                try {
                    assets[key].restore(saves[key]);
                }
                catch (e) {
                    console.log(e);
                    warn(this.bus, "Could not restore asset state for asset '" + key + "'!");
                }
            }
        }
    };
    
    Interpreter.prototype.save = function (name) {
        
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
        savegame.scenePath = this.scenePath;
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
        
        if (lastKey >= 0) {
            savegameList.splice(lastKey, 1);
        }
        
        savegameList.push(key);
        
        try {
            this.datasource.set(key, json);
            this.datasource.set(listKey, JSON.stringify(savegameList));
        }
        catch (e) {
            
            warn(bus, "Savegame could not be created!");
            
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
    
    Interpreter.prototype.getSavegameList = function (reversed) {
        
        var json, key, names, i, len, out;
        
        key = "wse_" + location.pathname + "_" + this.game.url + "_savegames_list";
        json = this.datasource.get(key);
        
        if (json === null) {
            return [];
        }
        
        names = JSON.parse(json);
        out = [];
        
        for (i = 0, len = names.length; i < len; i += 1) {
            
            if (reversed === true) {
                out.unshift(JSON.parse(this.datasource.get(names[i])));
            }
            else {
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
    
    Interpreter.prototype.buildSavegameId = function (name) {
        
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
    
    Interpreter.prototype.load = function (name) {
        
        var ds, savegame, scene, sceneId, scenePath, scenes, i, len, self;
        var savegameId, bus = this.bus;
        
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
        
        if (!savegame) {
            warn(bus, "Could not load savegame '" + savegameId + "'!");
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
        this.sceneId = sceneId;
        
        scenes = this.story.getElementsByTagName("scene");
        this.scenes = scenes;
        
        for (i = 0, len = this.scenes.length; i < len; i += 1) {
            
            if (scenes[i].getAttribute("id") === sceneId) {
                scene = scenes[i];
                break;
            }
        }
        
        if (!scene) {
            
            bus.trigger(
                "wse.interpreter.error",
                {
                    message: "Loading savegame '" + savegameId + "' failed: Scene not found!"
                }
            );
            
            return false;
        }
        
        scenePath = savegame.scenePath;
        this.scenePath = scenePath.slice();
        
        this.currentCommands = scene.childNodes;
        
        while (scenePath.length > 0) {
            this.currentCommands = this.currentCommands[scenePath.shift()].childNodes;
        }
        
        // Re-insert choice menu to get back the DOM events associated with it:
        // Remove savegame menu on load:
        (function (interpreter) {
            
            var elements, i, len, cur, index, wseType, com, rem;
            
            elements = interpreter.stage.getElementsByTagName("*");
            
            for (i = 0, len = elements.length; i < len; i += 1) {
                
                cur = elements[i];
                
                if (typeof cur === "undefined" || cur === null) {
                    continue;
                }
                
                wseType = cur.getAttribute("data-wse-type") || "";
                rem = cur.getAttribute("data-wse-remove") === "true" ? true : false;
                
                if (rem === true) {
                    interpreter.stage.removeChild(cur);
                }
                
                if (wseType !== "choice") {
                    continue;
                }
                
                index = parseInt(cur.getAttribute("data-wse-index"), 10) || null;
                
                if (index === null) {
                    warn(interpreter.bus, "No data-wse-index found on element.");
                    continue;
                }
                
                com = interpreter.currentCommands[index];
                
                if (com.nodeName === "#text" || com.nodeName === "#comment") {
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
    
    Interpreter.prototype.deleteSavegame = function (name) {
        
        var sgs, key, index, json, id;
        
        key = "wse_" + location.pathname + "_" + this.game.url + "_savegames_list";
        json = this.datasource.get(key);
        
        if (json === null) {
            return false;
        }
        
        sgs = JSON.parse(json);
        id = this.buildSavegameId(name);
        index = sgs.indexOf(id);
        
        if (index >= 0) {
            
            sgs.splice(index, 1);
            
            this.datasource.set(
                "wse_" + location.pathname + "_" + this.game.url + "_savegames_list",
                JSON.stringify(sgs)
            );
            
            this.datasource.remove(id);
            
            return true;
        }
        
        return false;
    };
    
    Interpreter.prototype.toggleSavegameMenu = function () {
        
        var menu, deleteButton, loadButton, saveButton, self;
        var savegames, i, len, buttonPanel, resumeButton, id, sgList;
        var cur, curEl, makeClickFn, listenerStatus, curElapsed, oldState;
        
        self = this;
        id = "WSESaveGameMenu_" + this.game.url;
        listenerStatus = this.game.listenersSubscribed;
        
        menu = document.getElementById(id) || null;
        
        if (menu !== null) {
            
            try {
                
                listenerStatus =
                    menu.getAttribute("data-wse-listener-status") === "true" ? true : false;
                this.stage.removeChild(menu);
            }
            catch (e) {
                console.log(e);
            }
            
            if (listenerStatus === true) {
                this.savegameMenuVisible = false;
            }
            
            this.state = this.oldStateInSavegameMenu;
            this.waitCounter -= 1;
            
            return;
        }
        
        if (this.stopped !== true) {
            
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
            function (ev) {
                
                var active, savegameName, fn;
                
                ev.stopPropagation();
                ev.preventDefault();
            
                active = menu.querySelector(".active") || null;
            
                if (active === null) {
                    return;
                }
                
                savegameName = active.getAttribute("data-wse-savegame-name");
                
                fn = function (decision) {
                    
                    if (decision === false) {
                        return;
                    }
                    
                    self.deleteSavegame(savegameName);
                    self.toggleSavegameMenu();
                    self.toggleSavegameMenu();
                };
                
                ui.confirm(
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
            function (ev) {
                
                var active, savegameName;
                
                ev.stopPropagation();
                ev.preventDefault();
                
                active = menu.querySelector(".active") || null;
                
                if (active === null) {
                    
                    ui.prompt(
                        self,
                        {
                            title: "New savegame",
                            message: "Please enter a name for the savegame:",
                            callback: function (data) {
                                
                                if (data === null) {
                                    return;
                                }
                                
                                if (!data) {
                                    
                                    ui.alert(
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
                                
                                ui.alert(
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
                
                ui.confirm(
                    self,
                    {
                        title: "Overwrite savegame?",
                        message: "You are about to overwrite an old savegame. Are you sure?",
                        trueText: "Yes",
                        falseText: "No",
                        callback: function (decision) {
                            
                            if (decision === false) {
                                return;
                            }
                            
                            self.toggleSavegameMenu();
                            self.save(savegameName);
                            self.toggleSavegameMenu();
                            
                            ui.alert(
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
            function (ev) {
                
                var active, savegameName, fn;
                
                ev.stopPropagation();
                ev.preventDefault();
                
                active = menu.querySelector(".active") || null;
                
                if (active === null) {
                    return;
                }
                
                savegameName = active.getAttribute("data-wse-savegame-name");
                
                fn = function (decision) {
                    
                    if (decision === false) {
                        return;
                    }
                    
                    self.stage.removeChild(document.getElementById(id));
                    self.savegameMenuVisible = false;
                    self.waitCounter -= 1;
                    self.state = oldState;
                    self.load(savegameName);
                };
                
                ui.confirm(
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
            function (ev) {
                
                ev.stopPropagation();
                ev.preventDefault();
                self.stage.removeChild(document.getElementById(id));
                
                self.bus.trigger(
                    "wse.interpreter.numberOfFunctionsToWaitFor.decrease",
                    null,
                    false
                );
                
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
        
        makeClickFn = function (curEl) {
            
            return function (event) {
                
                var old;
                
                event.stopPropagation();
                event.preventDefault();
                
                try {
                    
                    old = sgList.querySelector(".active") || null;
                    
                    if (old !== null) {
                        old.setAttribute("class", old.getAttribute("class").replace(/active/, ""));
                    }
                }
                catch (e) {
                    console.log(e);
                }
                
                curEl.setAttribute("class", curEl.getAttribute("class") + " active");
                loadButton.focus();
            };
        };
        
        curEl = document.createElement("div");
        curEl.setAttribute("class", "button");
        
        for (i = 0, len = savegames.length; i < len; i += 1) {
            
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
            function (ev) {
                
                var active;
                
                ev.stopPropagation();
                ev.preventDefault();
                active = menu.querySelector(".active") || null;
                
                if (active === null) {
                    return;
                }
                
                active.setAttribute("class", active.getAttribute("class").replace(/active/, ""));
            },
            false
        );
        
        menu.appendChild(sgList);
        
        this.stage.appendChild(menu);
    };
    
    Interpreter.prototype._startLoadingScreen = function () {
        
        var template = this.story.querySelector("loadingScreen");
        
        if (template) {
            this._loadingScreen.setTemplate(getSerializedNodes(template));
        }
        
        this._loadingScreen.show(this.stage);
    };
    
    return Interpreter;
});