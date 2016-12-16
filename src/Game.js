/* global using */
/* eslint no-console: off */

using(
    "databus",
    "easy-ajax",
    "WSE.Keys",
    "WSE.Interpreter",
    "WSE.tools",
    "WSE",
    "WSE.loader"
).
define("WSE.Game", function (DataBus, ajax, Keys, Interpreter, tools, WSE, loader) {
    
    "use strict";
    
    /**
     * Constructor used to create instances of games.
     * 
     * You can configure the game instance using the config object
     * that can be supplied as a parameter to the constructor function.
     * 
     * The options are:
     *  - url: [string] The URL of the WebStory file.
     *  - debug: [bool] Should the game be run in debug mode? (not used yet)
     *  - host: [object] The HOST object for the LocalContainer 
     *      version. Optional.
     * 
     * @event wse.game.constructor@WSE.bus
     * @param args A config object. See above for details.
     */
    function Game (args) {
        
        var host;
        
        WSE.instances.push(this);
        
        WSE.trigger("wse.game.constructor", {args: args, game: this});
        
        args = args || {};
        this.bus = new DataBus();
        this.url = args.url || "game.xml";
        this.gameId = args.gameId || null;
        this.ws = null;
        this.debug = args.debug === true ? true : false;
        
        host = args.host || false;
        this.host = host;
        
        if (this.gameId) {
            loader.generateFromString(
                document.getElementById(this.gameId).innerHTML,
                this.load.bind(this)
            );
        }
        else {
            if (host) {
                loader.generateFromString(host.get(this.url), this.load.bind(this));
            }
            else {
                loader.generateGameFile(this.url, this.load.bind(this));
            }
        }
        
        this.interpreter = new Interpreter(this);
        this.keys = new Keys();
        this.listenersSubscribed = false;
        //console.log("this.interpreter: ", this.interpreter);
        
        this.bus.subscribe(
            function (data) {
                console.log("Message: " + data);
            }, 
            "wse.interpreter.message"
        );
        
        this.bus.subscribe(
            function (data) {
                console.log("Error: " + data.message);
            }, 
            "wse.interpreter.error"
        );
        
        this.bus.subscribe(
            function (data) {
                console.log("Warning: " + data.message, data.element);
            }, 
            "wse.interpreter.warning"
        );
    }
    
    /**
     * Loads the WebStory file using the AJAX function and triggers
     * the game initialization.
     */
    Game.prototype.load = function (gameDocument) {
        this.ws = gameDocument;
        this.init();
    };
    
    Game.prototype.loadFromUrl = function (url) {
        
        //console.log("Loading game file...");
        var fn, self;
        
        this.url = url || this.url;
        
        self = this;
        
        fn = function (obj) {
            self.ws = obj.responseXML;
            //console.log("Response XML: " + obj.responseXML);
            self.init();
        };
        
        ajax.get(this.url, null, fn);
        
    };
    
    /**
     * Initializes the game instance.
     */
    Game.prototype.init = function () {
        
        var ws, stage, stageElements, stageInfo, width, height, id, alignFn, resizeFn;
        
        ws = this.ws;
        
        (function () {
            
            var parseErrors = ws.getElementsByTagName("parsererror");
            
            console.log("parsererror:", parseErrors);
            
            if (parseErrors.length) {
                document.body.innerHTML = "" +
                    '<div class="parseError">'+
                        "<h1>Cannot parse WebStory file!</h3>" +
                        "<p>Your WebStory file is mal-formed XML and contains these errors:</p>" +
                        '<pre class="errors">' + parseErrors[0].innerHTML + '</pre>' +
                    '</div>';
                throw new Error("Can't parse game file, not well-formed XML:", parseErrors[0]);
            }
        }());
        
        try {
            stageElements = ws.getElementsByTagName("stage");
        }
        catch (e) {
            console.log(e);
        }
        
        width = "800px";
        height = "480px";
        id = "Stage";
        
        if (!stageElements || stageElements.length < 1) {
            throw new Error("No stage definition found!");
        }
        
        stageInfo = stageElements[0];
        width = stageInfo.getAttribute("width") || width;
        height = stageInfo.getAttribute("height") || height;
        id = stageInfo.getAttribute("id") || id;
        
        // Create the stage element or inject into existing one?
        if (stageInfo.getAttribute("create") === "yes") {
            stage = document.createElement("div");
            stage.setAttribute("id", id);
            document.body.appendChild(stage);
        }
        else {
            stage = document.getElementById(id);
        }
        
        stage.setAttribute("class", "WSEStage");
        
        stage.style.width = width;
        stage.style.height = height;
        
        // Aligns the stage to be always in the center of the browser window.
        // Must be specified in the game file.
        alignFn = function () {
            
            var dim = tools.getWindowDimensions();
            
            stage.style.left = (dim.width / 2) - (parseInt(width, 10) / 2) + 'px';
            stage.style.top = (dim.height / 2) - (parseInt(height, 10) / 2) + 'px';
        };
        
        if (stageInfo.getAttribute("center") === "yes") {
            window.addEventListener('resize', alignFn);
            alignFn();
        }
        
        // Resizes the stage to fit the browser window dimensions. Must be
        // specified in the game file.
        resizeFn = function () {
            console.log("Resizing...");
            tools.fitToWindow(stage, parseInt(width, 10), parseInt(height, 10));
        };
        
        if (stageInfo.getAttribute("resize") === "yes") {
            window.addEventListener('resize', resizeFn);
            resizeFn();
        }
        
        this.stage = stage;
        //     stage.onclick = function() { self.interpreter.next(); };
        
        this.applySettings();
        
        // This section only applies when the engine is used inside
        // the local container app.
        if (this.host) {
            
            this.host.window.width = parseInt(width, 10);
            this.host.window.height = parseInt(height, 10);
            
            (function (self) {
                
                var doResize = self.getSetting("host.stage.resize") === "true" ? true : false;
                
                if (!doResize) {
                    return;
                }
                
                window.addEventListener("resize", function () {
                    console.log("Resizing...");
                    tools.fitToWindow(stage, parseInt(width, 10), parseInt(height, 10));
                });
            }(this));
        }
    };
    
    /**
     * Returns the value of a setting as specified in the WebStory file.
     * @param name [string] The name of the setting.
     * @return [mixed] The value of the setting or null.
     */
    Game.prototype.getSetting = function (name) {
        
        var ret, settings, i, len, cur, curName;
        
        settings = this.ws.getElementsByTagName("setting");
        
        for (i = 0, len = settings.length; i < len; i += 1) {
            
            cur = settings[i];
            curName = cur.getAttribute("name") || null;
            
            if (curName !== null && curName === name) {
                ret = cur.getAttribute("value") || null;
                return ret;
            }
        }
        
        return null;
    };
    
    // FIXME: implement...
    Game.prototype.applySettings = function () {
        
        this.webInspectorEnabled =
            this.getSetting("host.inspector.enable") === "true" ? true : false;
        
        if (this.host) {
            
            if (this.webInspectorEnabled === true) {
                this.host.inspector.show();
            }
        }
    };
    
    /**
     * Use this method to start the game. The WebStory file must have
     * been successfully loaded for this to work.
     */
    Game.prototype.start = function () {
        
        var fn, contextmenu_proxy, self;
        
        self = this;
        
        if (this.ws === null) {
            
            return setTimeout(
                function () {
                    self.start();
                }
            );
        }
        
        // Listener that sets the interpreter's state machine to the next state
        // if the current state is not pause or wait mode.
        // This function gets executed when a user clicks on the stage.
        fn = function () {
            
            if (self.interpreter.state === "pause" || self.interpreter.waitCounter > 0) {
                return;
            }
            
            //console.log("Next triggered by user...");
            self.interpreter.next(true);
        };
        
        contextmenu_proxy = function (e) {
            
            self.bus.trigger("contextmenu", {});
            
            // let's try to prevent real context menu showing
            if (e && typeof e.preventDefault === "function") {
                e.preventDefault();
            }
            
            return false;
        };
        
        this.subscribeListeners = function () {
            
            this.stage.addEventListener('contextmenu', contextmenu_proxy);
            this.stage.addEventListener('click', fn);
            
            this.listenersSubscribed = true;
        };
        
        this.unsubscribeListeners = function () {
            
            this.stage.removeEventListener('contextmenu', contextmenu_proxy);
            this.stage.removeEventListener('click', fn);
            
            this.listenersSubscribed = false;
        };
        
        this.interpreter.start();
    };
    
    return Game;
    
});
