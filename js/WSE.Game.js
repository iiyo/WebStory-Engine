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
    out.Game = function (args)
    {
        var host, self;
        
        out.trigger("wse.game.constructor", {args: args, game: this});
        
        args = args || {};
        this.bus = new Squiddle();
        this.debug = args.debug === true ? true : false;
        
        self = this;
        
        this.dataService = new out.services.gamedata[args.mode]( { url: args.url, host: args.host, game: args.game }, 
            function(settings) 
            {
                self.settings = settings;
                self.firstSceneId = settings.options["scenes.first"];
                self.interpreter = new out.Interpreter(self);
                self.keys = new out.Keys();
                self.listenersSubscribed = false;
                self.init();
            }
        );

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
            }, 
            "wse.interpreter.warning"
        );
    };
    
    /**
     * Initializes the game instance.
     */
    out.Game.prototype.init = function ()
    {
        //console.log("Initializing game...");
        var stage, stageElements, stageInfo, width, height, id, self, alignFn, resizeFn;
        
        self = this;

        width = "800px";
        height = "480px";
        id = "Stage";
        
        if (typeof this.settings.stages === 'undefined')
        {
            throw new Error("No stage definition found!");
        }
        
        stageInfo = this.settings.stages[0];
        width = stageInfo.width || width;
        height = stageInfo.height || height;
        id = stageInfo.id || id;
        
        // Create the stage element or inject into existing one?
        if (stageInfo.create === "yes")
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
        
        stage.style.width = width;
        stage.style.height = height;
        
        // Aligns the stage to be always in the center of the browser window.
        // Must be specified in the game file.
        alignFn = function ()
        {
            var dim = out.fx.getWindowDimensions();
            stage.style.left = (dim.width / 2) - (parseInt(width, 10) / 2) + 'px';
            stage.style.top = (dim.height / 2) - (parseInt(height, 10) / 2) + 'px';
        };
        
        if (stageInfo.center === "yes")
        {
            out.tools.attachEventListener(window, 'resize', alignFn);
            alignFn();
        }
        
        // Resizes the stage to fit the browser window dimensions. Must be
        // specified in the game file.
        resizeFn = function ()
        {
            console.log("Resizing...");
            out.fx.fitToWindow(stage, parseInt(width, 10), parseInt(height, 10));
        };
        
        if (stageInfo.resize === "yes")
        {
            out.tools.attachEventListener(window, 'resize', resizeFn);
            resizeFn();
        }
        
        this.stage = stage;
        
        this.applySettings();
        
        // This section only applies when the engine is used inside
        // the local container app.
        if (this.host)
        {
            this.host.window.width = parseInt(width, 10);
            this.host.window.height = parseInt(height, 10);
            
            (function (self)
            {
                var doResize = self.getSetting("host.stage.resize") === "true" ? true : false;
                
                if (!doResize)
                {
                    return;
                }
                
                window.addEventListener(
                    "resize",

                    function ()
                    {
                        console.log("Resizing...");
                        out.fx.fitToWindow(stage, parseInt(width, 10), parseInt(height, 10));
                    }
                );
            }(this));
        }
    };
    
    /**
     * Returns the value of a setting as specified in the WebStory file.
     * @param name [string] The name of the setting.
     * @return [mixed] The value of the setting or null.
     */
    out.Game.prototype.getSetting = function (name)
    {
        return this.settings.options[name];
    };
    
    // FIXME: implement...
    out.Game.prototype.applySettings = function ()
    {
        this.webInspectorEnabled = this.getSetting("host.inspector.enable") === "true" ? true : false;
        
        if (this.host)
        {
            if (this.webInspectorEnabled === true)
            {
                this.host.inspector.show();
            }
        }
    };
    
    /**
     * Use this method to start the game. The WebStory file must have
     * been successfully loaded for this to work.
     */
    out.Game.prototype.start = function ()
    {
        var fn, self;
        
        self = this;
        
        // test for the presence of the interpreter object - created when the configuration has finished loading
        if (typeof this.interpreter === 'undefined')
        {
            return setTimeout(
                function ()
                {
                    self.start();
                }
            );
        }
        
        // Listener that sets the interpreter's state machine to the next state
        // if the current state is not pause or wait mode.
        // This function gets executed when a user clicks on the stage.
        fn = function ()
        {
            if (self.interpreter.state === "pause" || self.interpreter.waitCounter > 0)
            {
                return;
            }
            
            console.log("Next triggered by user...");
            self.interpreter.next(true);
        };
        
        this.subscribeListeners = function ()
        {
            out.tools.attachEventListener(this.stage, 'click', fn);
            this.listenersSubscribed = true;
        };
        
        this.unsubscribeListeners = function ()
        {
            out.tools.removeEventListener(this.stage, 'click', fn);
            this.listenersSubscribed = false;
        };
                
        this.interpreter.start();
    };

}(WSE));
