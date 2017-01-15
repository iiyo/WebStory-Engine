/* global using */
/* eslint no-console: off */

using(
    "WSE.dataSources.LocalStorage",
    "WSE.Trigger",
    "WSE.tools",
    "WSE.tools.ui",
    "WSE",
    "WSE.tools::logError",
    "WSE.tools::warn",
    "WSE.LoadingScreen",
    "WSE.tools::getSerializedNodes",
    "enjoy-core::each",
    "enjoy-core::find",
    "enjoy-typechecks::isUndefined",
    "enjoy-typechecks::isNull",
    "WSE.savegames"
).
define("WSE.Interpreter", function (
    LocalStorageSource,
    Trigger,
    tools,
    ui,
    WSE,
    logError,
    warn,
    LoadingScreen,
    getSerializedNodes,
    each,
    find,
    isUndefined,
    isNull,
    savegames
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
    function Interpreter (game, options) {
        
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
        datasource = options.datasource || new LocalStorageSource();
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
                
                if (isNull(datasource.get(key + name))) {
                    return false;
                }
                
                return true;
            }
        };
        
        this._loadingScreen = new LoadingScreen();
        
        if (this.debug === true) {
            this.game.bus.debug = true;
        }
    }
    
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
                catch (e) {
                    // do nothing
                }
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
            
            self.callOnLoad();
            
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
    
    Interpreter.prototype.callOnLoad = function () {
        each(function (asset) {
            if (typeof asset.onLoad === "function") {
                asset.onLoad();
            }
        }, this.assets);
    };
    
    Interpreter.prototype.runStory = function () {
        
        if (this.assetsLoading > 0) {
            setTimeout(this.runStory.bind(this), 100);
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
        
        if (isUndefined(scene) || isNull(scene)) {
            logError(bus, "Scene does not exist.");
            return;
        }
        
        id = scene.getAttribute("id");
        this.visitedScenes.push(id);
        
        if (isNull(id)) {
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
        
        var scene = find(function (current) {
            return current.getAttribute("id") === sceneName;
        }, this.scenes);
        
        if (isNull(scene)) {
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
        
        if (this.cancelCharAnimation) {
            this.cancelCharAnimation();
            this.cancelCharAnimation = null;
            return;
        }
        
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
            tagName.match(/(show|hide|clear|flicker|flash|play|start|stop|pause|move|shake|set|tag)/)
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
        
        var triggers, curName, curTrigger, bus = this.bus;
        var interpreter = this;
        
        bus.trigger("wse.interpreter.triggers.create", this, false);
        
        this.triggers = {};
        
        try {
            triggers = this.game.ws.getElementsByTagName("triggers")[0].
                getElementsByTagName("trigger");
        }
        catch (e) {
            console.log(e);
            return;
        }
        
        each(function (cur) {
            
            curName = cur.getAttribute("name") || null;
            
            if (curName === null) {
                warn(bus, "No name specified for trigger.", cur);
                return;
            }
            
            if (typeof interpreter.triggers[curName] !== "undefined" &&
                    interpreter.triggers[curName] !== null) {
                warn(bus, "A trigger with the name '" + curName +
                    "' already exists.", cur);
                return;
            }
            
            curTrigger = new Trigger(cur, interpreter);
            
            if (typeof curTrigger.fn === "function") {
                interpreter.triggers[curName] = curTrigger;
            }
            
        }, triggers);
        
    };
    
    Interpreter.prototype.buildAssets = function () {
        
        var assets, bus = this.bus;
        
        bus.trigger("wse.assets.loading.started");
        
        try {
            assets = this.story.getElementsByTagName("assets")[0].childNodes;
        }
        catch (e) {
            logError(bus, "Error while creating assets: " + e.getMessage());
        }
        
        each(function (asset) {
            
            if (asset.nodeType !== 1) {
                return;
            }
            
            this.createAsset(asset);
            
        }.bind(this), assets);
        
    };
    
    Interpreter.prototype.createAsset = function (asset) {
        
        var name, assetType, bus = this.bus;
        
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
    
    Interpreter.prototype.toggleSavegameMenu = function () {
        
        var menu, deleteButton, loadButton, saveButton, self;
        var saves, buttonPanel, resumeButton, id, sgList;
        var curEl, listenerStatus, curElapsed, oldState;
        
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
        
        saves = savegames.getSavegameList(this, true);
        
        deleteButton = document.createElement("input");
        deleteButton.setAttribute("class", "button delete");
        deleteButton.setAttribute("type", "button");
        deleteButton.value = "Delete";
        
        deleteButton.addEventListener(
            "click",
            function (ev) {
                
                var active, savegameName;
                
                ev.stopPropagation();
                ev.preventDefault();
            
                active = menu.querySelector(".active") || null;
            
                if (active === null) {
                    return;
                }
                
                savegameName = active.getAttribute("data-wse-savegame-name");
                
                function fn (decision) {
                    
                    if (decision === false) {
                        return;
                    }
                    
                    savegames.remove(self, savegameName);
                    self.toggleSavegameMenu();
                    self.toggleSavegameMenu();
                }
                
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
                                savegames.save(self, data);
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
                            savegames.save(self, savegameName);
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
                    savegames.load(self, savegameName);
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
        
        function makeClickFn (curEl) {
            
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
        }
        
        curEl = document.createElement("div");
        curEl.setAttribute("class", "button");
        
        each(function (cur) {
            
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
            
        }, saves);
        
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
