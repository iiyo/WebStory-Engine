var WSE = {};

WSE.fx = MO5;
WSE.Keys = STEINBECK.Keys;

WSE.ajax = {};

WSE.ajax.get = function(url, cb)
{
    url = url + "?random=" + Math.random();
    //console.log("Requesting remote file: " + url);
    var http = new XMLHttpRequest();
    http.onreadystatechange = function()
    {
        //console.log("AJAX state change occured.");
        if (http.readyState === 4 && http.status === 200)
        {
            //console.log("File fetched.");
            cb(http);
        }
        if (http.readyState === 4 && http.status !== 200)
        {
            //console.log("Could not fetch file.");
        }
    };
    if (http.overrideMimeType)
    {
        http.overrideMimeType("text/xml");
    }
    http.open("GET", url, true);
    http.send();
};

WSE.Game = function(args)
{
    args = args || {};
    this.bus = new Squiddle();
    this.url = args.url || "game.xml";
    this.ws = null;
    this.load(this.url);
    this.interpreter = new WSE.Interpreter(this);
    this.keys = new WSE.Keys();
    //console.log("this.interpreter: ", this.interpreter);
    this.bus.subscribe(
        function(data)
        {
            console.log("Message: " + data);
        },
        "wse.interpreter.message"
    );
    this.bus.subscribe(
        function(data)
        {
            console.log("Error: " + data.message);
        },
        "wse.interpreter.error"
    );
    this.bus.subscribe(
        function(data)
        {
            console.log("Warning: " + data.message, data.element);
        },
        "wse.interpreter.warning"
    );
};

WSE.Game.prototype.load = function(url)
{
    //console.log("Loading game file...");
    var fn, self;
    self = this;
    fn = function(obj)
    {
        self.ws = obj.responseXML;
        //console.log("Response XML: " + obj.responseXML);
        self.init();
    };
    WSE.ajax.get(this.url, fn);
};

WSE.Game.prototype.init = function()
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
    
    alignFn = function() 
    {
        var dim = WSE.fx.getWindowDimensions();
        stage.style.left = (dim.width / 2) - (parseInt(width) / 2)+'px';
        stage.style.top = (dim.height / 2) - (parseInt(height) / 2)+'px';
    };
    
    stage.style.width = width;
    stage.style.height = height;
    
    if (stageInfo.getAttribute("center") === "yes")
    {
        WSE.tools.attachEventListener(
            window,
            'resize',
            alignFn
        );
        alignFn();
    }
    this.stage = stage;
//     stage.onclick = function() { self.interpreter.next(); };
};

WSE.Game.prototype.start = function()
{
    var fn, self;
    self = this;
   
    if (this.ws === null)
    {
        return setTimeout(function() { self.start(); });
    }
    
    this.next = function() 
    { 
        self.bus.trigger("wse.game.next", this);/*
        if (self.interpreter.rush === true || self.interpreter.wait === true)
        {
            self.interpreter.wait = false;
            return;
        }*/
        self.interpreter.next(true); 
    };
    fn = function() { self.interpreter.next(); };
    this.subscribeListeners = function()
    {
        WSE.tools.attachEventListener(
            this.stage,
            'click',
            fn
        );
        this.keys.addListener(this.keys.keys.RIGHT_ARROW, this.next);
        this.keys.addListener(this.keys.keys.SPACE, this.next);
    };
    this.unsubscribeListeners = function()
    {
        WSE.tools.removeEventListener(
            this.stage,
            'click',
            fn
        );
        this.keys.removeListener(this.keys.keys.RIGHT_ARROW, this.next);
        this.keys.removeListener(this.keys.keys.SPACE, this.next);
    };
    this.interpreter.start();
};



WSE.Interpreter = function(game)
{
    if (!(this instanceof WSE.Interpreter))
    {
        return new WSE.Interpreter(game);
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
};

WSE.Interpreter.prototype.buildLoadingScreen = function()
{
    var loadScreen, heading, self, fn;
    
    self = this;
    
    loadScreen = document.createElement("div");
    loadScreen.setAttribute("id", "WSELoadingScreen");
    loadScreen.style.zIndex = 10000;
    loadScreen.style.width = "100%";
    loadScreen.style.height = "100%";
    
    loadScreen.innerHTML = '' +
        '<div class="container">'+
        '<div class="heading"><span id="WSELoadingScreenPercentage"></span>Loading assets...</div>'+
        '<div class="progressBar">'+
        '<div class="progress" id="WSELoadingScreenProgress" style="width: 100%;">'+
        '</div>'+
        '</div>'+
        '</div>'+
        '';
    
    this.game.stage.appendChild(loadScreen);
    
    fn = function() 
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
    
    this.bus.subscribe(
        fn,
        "wse.assets.loading.increase"
    );
    
    this.bus.subscribe(
        fn,
        "wse.assets.loading.decrease"
    );
    
    this.loadScreen = loadScreen;
};

WSE.Interpreter.prototype.start = function()
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
    
    this.bus.subscribe(
        function()
        {
            //self.currentElement += 1;
        },
        "wse.interpreter.next"
    );
    
    // Adds location info to warnings and errors.
    fn = function(data)
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
            catch (e) {}
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
    this.bus.subscribe(
        function()
        {
            console.log("Game over.");
        },
        "wse.interpreter.end"
    );
    
    this.bus.subscribe(
        function() { self.numberOfFunctionsToWaitFor += 1; },
        "wse.interpreter.numberOfFunctionsToWaitFor.increase"
    );
    
    this.bus.subscribe(
        function() { self.numberOfFunctionsToWaitFor -= 1; },
        "wse.interpreter.numberOfFunctionsToWaitFor.decrease"
    );
    
    this.bus.subscribe(
        function() { self.assetsLoading += 1; self.assetsLoadingMax += 1; },
        "wse.assets.loading.increase"
    );
    
    this.bus.subscribe(
        function() { self.assetsLoading -= 1; self.assetsLoaded += 1; },
        "wse.assets.loading.decrease"
    );
    
    this.bus.subscribe(
        function() 
        { 
            WSE.fx.transform(
                function(v) 
                { 
                    self.loadScreen.style.opacity = v; 
                }, 
                1, 
                0,
                {
                    duration: 500,
                    onFinish: function() { self.loadScreen.style.display = "none"; }
                }
            ); 
            console.log("Hiding loading screen...");
        },
        "wse.assets.loading.finished"
    );
    
    this.buildAssets();
    setTimeout(function() { self.runStory(); }, 1000);
    
};

WSE.Interpreter.prototype.runStory = function()
{
    var scenes, len, i, current, self;
    
    self = this;
    
    if (this.assetsLoading > 0)
    {
        return setTimeout(function() { self.runStory(); }, 100);
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
        this.bus.trigger("wse.interpreter.error", {message: "No scenes found!"});
        return;
    }
    this.changeScene(scenes[0]);
};

WSE.Interpreter.prototype.changeScene = function(scene)
{
    var children, len, i, nodeName, id;
    
    if (typeof scene === "undefined" || scene === null)
    {
        this.bus.trigger("wse.interpreter.error", {message: "Scene does not exist."});
        return;
    }
    
    id = scene.getAttribute("id");
    
    this.visitedScenes.push(id);
    
    if (id === null)
    {
        this.bus.trigger("wse.interpreter.error", {message: "Encountered scene without id attribute."});
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
        this.bus.trigger("wse.interpreter.warning", {element: scene, message: "Scene '" + id + "' is empty."});
        return;
    }
    
    this.numberOfFunctionsToWaitFor = 0;
    
    this.next();
};

WSE.Interpreter.prototype.next = function(triggeredByUser)
{
    var nodeName, command, check, self, waiter;
    
    this.game.unsubscribeListeners();
    
    triggeredByUser = triggeredByUser === true ? true : false;
    
    self = this;
    
    if (this.waitForTimer === true || (this.wait === true && this.numberOfFunctionsToWaitFor > 0))
    {
        setTimeout(function() { self.next(); }, 10);
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
        setTimeout(function() { self.next(); }, 0);
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
        setTimeout(function() { self.next(); }, 0);
        return;
    }
    
//     this.game.subscribeListeners():
};

WSE.Interpreter.prototype.runCommand = function(command)
{
    var tagName;
    tagName = command.tagName;
    switch (tagName)
    {
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
        case "stop":
            this.game.subscribeListeners();
            return { doNext: false, wait: true };
        default:
            this.bus.trigger(
                "wse.interpreter.warning", 
                {
                    element: command, 
                    message: "Unknown element '" + tagName + "'."      
                }
            );
            return { doNext: true };
    }
};

WSE.Interpreter.prototype.runWaitCommand = function(command)
{
    var duration, self;
    
    self = this;
    duration = command.getAttribute("duration");
    
    if (duration !== null)
    {
        duration = parseInt(duration, 10);
        this.waitForTimer = true;
        setTimeout(
            function()
            {
                self.waitForTimer = false;
            },
            duration
        );
        return { doNext: true, wait: false };
    }
    
    return { doNext: true, wait: true };
};

WSE.Interpreter.prototype.runChoiceCommand = function(command)
{
    var menuElement, buttons, children, len, i, current, duration,
        currentButton, scenes, self, j, jlen, currentScene;
    
    buttons = [];
    scenes = [];
    self = this;
    children = command.getElementsByTagName("option");
    len = children.length;
    duration = command.getAttribute("duration") || 500;
    duration = parseInt(duration, 10);
    
    if (len < 1)
    {
        this.bus.trigger(
            "wse.interpreter.warning",
            { element: command, message: "Element 'choice' is empty. Expected at least one 'option' element." }
        );
    }
    
    menuElement = document.createElement("div");
    menuElement.setAttribute("class", "menu");
    
    for (i = 0; i < len; i += 1)
    {
        current = children[i];
        currentButton = document.createElement("div");
        currentButton.setAttribute("class", "button");
        try
        {
            currentButton.innerHTML = current.childNodes[0].nodeValue;
        }
        catch (e)
        {
            this.bus.trigger(
                "wse.interpreter.warning",
                { element: command, message: "Element 'option' is empty." }
            );
        }
        sceneName = current.getAttribute("scene");
        for (j = 0, jlen = this.scenes.length; j < jlen; j += 1)
        {
            currentScene = this.scenes[j];
            if (currentScene.getAttribute("id") === sceneName)
            {
                scenes[i] = currentScene;
                break;
            }
        }
        
        WSE.tools.attachEventListener(
            currentButton,
            'click',
            (function(scene, mEl)
            {
                return function()
                {
                    setTimeout(
                        function()
                        {
                            self.changeScene(scene);
                        },
                        0
                    );
                    self.stage.removeChild(mEl);
                };
            }(scenes[i], menuElement))
        );
        buttons.push(currentButton);
        menuElement.appendChild(currentButton);
    }
    
    menuElement.style.opacity = 0;
    this.stage.appendChild(menuElement);
    
    this.bus.trigger(
        "wse.interpreter.numberOfFunctionsToWaitFor.increase"
    );/*
    
    WSE.fx.transform(
        function(v) { menuElement.style.opacity = v; }, 0, 1,
        { 
            onFinish: function() { self.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.decrease"); },
            duration: duration
        }
    );*/
    
    WSE.assets.mixins.show(command, menuElement, this.bus, this.stage);
    
    return { doNext: false, wait: true };
};

WSE.Interpreter.prototype.runGotoCommand = function(command)
{
    var scene, sceneName, i, len, current;
    
    sceneName = command.getAttribute("scene");
    
    if (sceneName === null)
    {
        this.bus.trigger(
            "wse.interpreter.error",
            { message: "Element 'goto' misses attribute 'scene'." }
        );
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
        this.bus.trigger(
            "wse.interpreter.error",
            { message: "Unknown scene '" + sceneName + "'." }
        );
        return;
    }
    
    return { changeScene: scene };
};

WSE.Interpreter.prototype.runLineCommand = function(command)
{
    var speakerId, speakerName, textboxName, i, len, current, 
        assetElements, text, doNext;
    
    this.game.subscribeListeners();
    
    speakerId = command.getAttribute("s");
    doNext = command.getAttribute("stop") === "false" ? true : false;
    
    if (speakerId === null)
    {
        this.bus.trigger("wse.interpreter.warning", {element: command, message: "Element 'line' requires attribute 's'."});
        return { doNext: true };
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
                this.bus.trigger(
                    "wse.interpreter.warning", 
                    {
                        element: command, 
                        message: "No textbox defined for character '" + speakerId + "'."
                    }
                );
                return { doNext: true };
            }
            try
            {
                speakerName = current.getElementsByTagName("name")[0].childNodes[0].nodeValue;
            }
            catch (e) {}
            break;
        }
    }
    
    if (typeof this.assets[textboxName] === "undefined")
    {
        this.bus.trigger(
            "wse.interpreter.warning",
            {
                element: command,
                message: "Trying to use an unknown textbox or character."
            }
        );
        return {doNext: true};
    }
    
    text = command.childNodes[0].nodeValue;
    this.log.push(
        {
            speaker: speakerId,
            text: text
        }
    );
    this.assets[textboxName]["put"](text, speakerName);
    return { doNext: doNext, wait: true };
};

WSE.Interpreter.prototype.runDoCommand = function(command)
{
    var assetName, action;
    
    assetName = command.getAttribute("asset");
    action = command.getAttribute("action");
    
    if (assetName === null)
    {
        this.bus.trigger(
            "wse.interpreter.warning", 
            {
                element: command, 
                message: "Element of type 'do' must have an attribute 'asset'. Element ignored."
            }
        );
        return;
    }
    
    if (action === null)
    {
        this.bus.trigger(
            "wse.interpreter.warning", 
            {
                element: command, 
                message: "Element of type 'do' must have an attribute 'action'. Element ignored."
            }
        );
        return;
    }
    
    if (typeof this.assets[assetName] === "undefined" || this.assets[assetName] === null)
    {
        this.bus.trigger(
            "wse.interpreter.warning", 
            {
                element: command, 
                message: "Reference to unknown asset '" + assetName + "'."
            }
        );
        return { doNext: true };
    }
    
    if (typeof this.assets[assetName][action] === "undefined")
    {
        this.bus.trigger(
            "wse.interpreter.warning", 
            {
                element: command, 
                message: "Action '" + action + "' is not defined for asset '" + assetName + "'."
            }
        );
        return { doNext: true };
    }
    
    return this.assets[assetName][action](command);
};

WSE.Interpreter.prototype.buildAssets = function() 
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

WSE.Interpreter.prototype.createAsset = function(asset) 
{
    var name, type;
    name = asset.getAttribute("name");
    type = asset.getAttribute("type");
    
    if (name === null)
    {
        this.game.bus.trigger("wse.interpreter.error", {element: asset, message: "Expected attribute 'name'."});
        return;
    }
    
    if (type === null)
    {
        this.game.bus.trigger("wse.interpreter.warning", {element: asset, message: "Expected attribute 'type' on asset '" + name + "'."});
        return;
    }
    
    if (typeof this.assets[name] !== "undefined")
    {
        this.game.bus.trigger("wse.interpreter.warning", {element: asset, message: "Trying to override existing asset '" + name + "'."});
    }
    
    switch (type)
    {
        case "textbox":
            this.assets[name] = new WSE.assets.Textbox(asset, this.stage, this.bus);
            break;
        case "character":
            this.assets[name] = new WSE.assets.Character(asset, this.stage, this.bus);
            break;
        case "imagepack":
            this.assets[name] = new WSE.assets.Imagepack(asset, this.stage, this.bus);
            break;
        case "audio":
            this.assets[name] = new WSE.assets.Audio(asset, this.bus);
            break;
        case "animation":
            this.assets[name] = new WSE.assets.Animation(asset, this.stage, this.bus, this.assets, this);
            break;
        default:
            this.game.bus.trigger("wse.interpreter.warning", {element: asset, message: "Unknown asset type '" + type + "'."});
            return;
    }
};


WSE.assets = {};
WSE.assets.mixins = {};

WSE.assets.mixins.move = function(command)
{
    var x, y, z, element, xHandle, yHandle, zHandle, xFn, yFn, zFn, self, wait,
        xUnit, yUnit, duration;
    self = this;
    element = this.element;
    x = command.getAttribute("x");
    y = command.getAttribute("y");
    z = command.getAttribute("z");
    duration = command.getAttribute("duration") || 500;
    
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
        this.bus.trigger(
            "wse.interpreter.warning", 
            {
                element: command,
                message: "Can't apply action 'move' to asset '" + this.name + 
                "' because no x, y or z position has been supplied."
            }
        );
    }
    
    if (x !== null)
    {
        this.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.increase");
        WSE.fx.transform(
            function(v) { element.style.left = v + xUnit; }, element.offsetLeft, x,
            {
                onFinish: function() { self.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.decrease"); },
                duration: duration
            }
        );
    }
    
    if (y !== null)
    {
        this.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.increase");
        WSE.fx.transform(
            function(v) { element.style.top = v + yUnit; }, element.offsetTop, y,
            {
                onFinish: function() { self.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.decrease"); },
                duration: duration
            }
        );
    }
    
    if (z !== null)
    {
        this.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.increase");
        WSE.fx.transform(
            function(v) { element.style.zIndex = v; }, element.style.zIndex || 0, parseInt(z),
            {
                onFinish: function() { self.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.decrease"); },
                duration: duration
            }
        );
    }
    
    return { doNext: true };
};

WSE.assets.mixins.show = function(command, element, bus, stage)
{
    var self, duration, handle, fn, wait, effect, direction, ox, oy, prop;
    
    self = this;
    wait = command.getAttribute("wait") === "yes" ? true : false;
    duration = command.getAttribute("duration") || 500;
    effect = command.getAttribute("effect") || "fade";
    direction = command.getAttribute("direction") || "right";
    element = element || this.element;
    bus = bus || this.bus;
    stage = stage || this.stage;
    
    if (effect === "slide")
    {
        ox = element.offsetLeft;
        oy = element.offsetTop;
        switch (direction)
        {
            case "left":
                element.style.left =  ox + stage.offsetWidth + "px";
                prop = "left";
                break;
            case "right":
                element.style.left =  ox - stage.offsetWidth + "px";
                prop = "left";
                break;
            case "top":
                element.style.top =  oy + stage.offsetHeight + "px";
                prop = "top";
                break;
            case "bottom":
                element.style.top =  oy - stage.offsetHeight + "px";
                prop = "top";
                break;
            default:
                element.style.left =  ox - stage.offsetWidth + "px";
                prop = "left";
                break;
        }
        element.style.opacity = 1;
        bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.increase");
        WSE.fx.transform(
            function(v) { element.style[prop] = v + "px"; }, 
            (prop === "left" ? element.offsetLeft : element.offsetTop), 
            (prop === "left" ? ox : oy), 
            {
                duration: duration,
                onFinish: function() { bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.decrease"); }
            }
        );
    }
    else
    {
        bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.increase");
        WSE.fx.transform(
            function(v) { element.style.opacity = v; }, 0, 1, 
            {
                duration: duration,
                onFinish: function() { bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.decrease"); }
            }
        );
    }
    
    return { doNext: true };
};

WSE.assets.mixins.hide = function(command)
{
    var self, duration, handle, fn, wait, effect, direction, ox, oy, to;
    
    self = this;
    wait = command.getAttribute("wait") === "yes" ? true : false;
    duration = command.getAttribute("duration") || 500;
    effect = command.getAttribute("effect") || "fade";
    direction = command.getAttribute("direction") || "left";
    
    if (effect === "slide")
    {
        ox = this.element.offsetLeft;
        oy = this.element.offsetTop;
        this.element.style.opacity = 1;
        switch (direction)
        {
            case "left":
                to =  ox - this.stage.offsetWidth;
                prop = "left";
                break;
            case "right":
                to =  ox + this.stage.offsetWidth;
                prop = "left";
                break;
            case "top":
                to =  oy - this.stage.offsetHeight;
                prop = "top";
                break;
            case "bottom":
                to =  oy + this.stage.offsetHeight;
                prop = "top";
                break;
            default:
                to =  ox - this.stage.offsetWidth;
                prop = "left";
                break;
        }
        self.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.increase");
        WSE.fx.transform(
            function(v) { self.element.style[prop] = v + "px"; }, 
            (prop === "left" ? ox : oy), 
            to, 
            {
                duration: duration,
                onFinish: function() 
                { 
                    self.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.decrease");
                    self.element.style.opacity = 0;
                    switch (direction)
                    {
                        case "left":
                        case "right":
                            self.element.style.left =  ox + "px";
                            prop = "left";
                            break;
                        case "top":
                        case "bottom":
                            self.element.style.top =  oy + "px";
                            prop = "top";
                            break;
                        default:
                            self.element.style.left =  ox + "px";
                            prop = "left";
                            break;
                    }
                }
            }
        );
    }
    else
    {
        self.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.increase");
        WSE.fx.transform(
            function(v) { self.element.style.opacity = v; }, 1, 0, 
            {
                duration: duration,
                onFinish: function() 
                { 
                    self.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.decrease"); 
                    self.element.style.opacity = 0;
                }
            }
        );
    }
    
    
    return { doNext: true };
};


WSE.assets.Character = function(asset, stage, bus)
{
    this.asset = asset;
    this.stage = stage;
    this.bus = bus;
};

WSE.assets.Character.prototype.setTextbox = function(command)
{
    this.asset.setAttribute("textbox", command.getAttribute("textbox"));
};


WSE.assets.Imagepack = function(asset, stage, bus)
{
    var element, images, children, i, len, current, name, src, image, self;
    
    this.stage = stage;
    this.bus = bus;
    this.name = asset.getAttribute("name");
    
    self = this;
    images = {};
    element = document.createElement("div");
    
    element.style.opacity = 0;
    element.draggable = false;
    
    element.setAttribute("class", "imagepack");
    
    children = asset.getElementsByTagName("image");
    
    for (i = 0, len = children.length; i < len; i += 1)
    {
        current = children[i];
        name = current.getAttribute("name");
        src = current.getAttribute("src");
        
        if (name === null)
        {
            this.bus.trigger(
                "wse.interpreter.warning", 
                {
                    element: asset, 
                    message: "Image without name in imagepack '" + this.name + "'."
                }
            );
            continue;
        }
        
        if (src === null)
        {
            this.bus.trigger(
                "wse.interpreter.warning", 
                {
                    element: asset, 
                    message: "Image without src in imagepack '" + this.name + "'."
                }
            );
            continue;
        }
        
        image = new Image();
        
        this.bus.trigger("wse.assets.loading.increase");
        WSE.tools.attachEventListener(image, 'load', function() { self.bus.trigger("wse.assets.loading.decrease"); });
        
        image.src = src;
        image.style.opacity = 0;
        image.style.position = "absolute";
        image.draggable = false;
        
        images[name] = image;
        element.appendChild(image);
    }
    
    element.style.position = "absolute";
    element.style.left = asset.getAttribute("x") || 0;
    element.style.top = asset.getAttribute("y") || 0;
    element.style.zIndex = asset.getAttribute("z") || 0;
    
    this.element = element;
    this.images = images;
    this.current = null;
    
    stage.appendChild(element);
};

WSE.assets.Imagepack.prototype.move = WSE.assets.mixins.move;
WSE.assets.Imagepack.prototype.show = WSE.assets.mixins.show;
WSE.assets.Imagepack.prototype.hide = WSE.assets.mixins.hide;

WSE.assets.Imagepack.prototype.set = function(command)
{
    var image, name, self, old, duration;
    
    self = this;
    name = command.getAttribute("image");
    duration = command.getAttribute("duration") || 400;
    
    if (name === null)
    {
        this.bus.trigger(
            "wse.interpreter.warning", 
            {
                element: command,
                message: "Missing attribute 'image' on 'do' element referencing imagepack '" + this.name + "'."
            }
        );
        return { doNext: true };
    }
    
    image = this.images[name];
    
    if (typeof image === "undefined" || image === null)
    {
        this.bus.trigger(
            "wse.interpreter.warning", 
            {
                element: command,
                message: "Unknown image name on 'do' element referencing imagepack '" + this.name + "'."
            }
        );
        return { doNext: true };
    }
    
    old = this.current;
    
    for (var key in this.images)
    {
        if (!(this.images.hasOwnProperty(key)))
        {
            continue;
        }
        if (key !== name)
        {
            continue;
        }
        if (this.images[key] === old)
        {
            this.bus.trigger(
                "wse.interpreter.warning",
                { element: command, message: "Trying to set the image that is already set on imagepack '" + this.name + "'." }
            );
            return { doNext:true };
        }
    }
    
    self.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.increase");
    WSE.fx.transform(
        function(v) { image.style.opacity = v; },
        0,
        1,
        {
            duration: duration / 2,
            easing: WSE.fx.easing.linear,
            onFinish: function() { self.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.decrease"); }
        }
    );
    
    if (this.current !== null)
    {
        self.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.increase");
        setTimeout(
            function()
            {
                WSE.fx.transform(
                    function(v) { old.style.opacity = v; },
                    1,
                    0,
                    {
                        duration: duration,
                        onFinish: function() 
                        { 
                            self.bus.trigger("wse.interpreter.numberOfFunctionsToWaitFor.decrease");
                        },
                        easing: WSE.fx.easing.linear
                    }
                );
            },
            duration / 2
        );
    }
    
    this.current = image;
    
    return { doNext: true };
};



WSE.assets.Textbox = function(asset, stage, bus)
{
    
    if (!(this instanceof WSE.assets.Textbox))
    {
        return new WSE.assets.Textbox(asset, stage, bus);
    }
    
    var element, nameElement, textElement, cssid, x, y, width, height;
    
    this.name = asset.getAttribute("name");
    this.stage = stage;
    this.bus = bus;
    this.type = asset.getAttribute("behaviour") || "adv";
    this.showNames = asset.getAttribute("names") === "yes" ? true : false;
    
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
    
    cssid = asset.getAttribute("cssid");
    if (cssid)
    {
        element.setAttribute("id", cssid);
    }
    
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
    
    this.element = element;
    this.nameElement = nameElement;
    this.textElement = textElement;
    
    this.element.style.opacity = 0;
    
    this.bus.trigger("wse.assets.textbox.created", this);
};

WSE.assets.Textbox.prototype.show = WSE.assets.mixins.show;
WSE.assets.Textbox.prototype.hide = WSE.assets.mixins.hide;
WSE.assets.Textbox.prototype.move = WSE.assets.mixins.move;

WSE.assets.Textbox.prototype.put = function(text, name)
{
    name = name || null;
    
    var textElement, nameElement, namePart;
    
    textElement = this.textElement;
    nameElement = this.nameElement;
    
    text = WSE.tools.textToHtml(text);
    
    if (this.type === "adv")
    {
        WSE.fx.transform(
            function(v) { textElement.style.opacity = v; }, 1, 0,
            { duration: 50 }
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
        setTimeout(
            function() 
            {
                
                textElement.innerHTML += namePart + text;
                nameElement.innerHTML = name;
                WSE.fx.transform(
                    function(v) { textElement.style.opacity = v; }, 0, 1,
                    { duration: 50 }
                );
            },
            50
        );
    }
    else
    {
        setTimeout(
            function() 
            {
                
                textElement.innerHTML += "<p>" + namePart + text + "</p>";
                nameElement.innerHTML = name;
            },
            200
        );
    }
    
    return { doNext: false };
};

WSE.assets.Textbox.prototype.clear = function()
{
    this.textElement.innerHTML = "";
    this.nameElement.innerHTML = "";
    return { doNext: true };
};



WSE.assets.Audio = function(asset, bus) 
{
    var self, sources, i, len, j, jlen, current, track, trackName, trackFiles, 
        href, type, source, key, loopFn;
    
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
    
    tracks = asset.getElementsByTagName("track");
    len = tracks.length;
    
    if (len < 1)
    {
        this.bus.trigger(
            "wse.interpreter.warning",
            {
                element: asset,
                message: "No tracks defined for audio element '" + this.name + "'."
            }
        );
        return { doNext: true };
    }
    
    for (i = 0; i < len; i += 1)
    {
        current = tracks[i];
        sources = current.getElementsByTagName("source");
        jlen = sources.length;
        
        if (jlen < 1)
        {
            this.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: asset,
                    message: "No sources defined for track '" + trackName + "' in audio element '" + this.name + "'."
                }
            );
            continue;
        }
        
        track = new Audio();
        trackFiles = {};
        trackName = current.getAttribute("title");
        track.preload = true;
        
        if (trackName === null)
        {
            this.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: asset,
                    message: "No title defined for track '" + trackName + "' in audio element '" + this.name + "'."
                }
            );
            continue;
        }
        
        for (j = 0; j < jlen; j += 1)
        {
            source = sources[j];
            href = source.getAttribute("href");
            type = source.getAttribute("type");
            
            if (href === null)
            {
                this.bus.trigger(
                    "wse.interpreter.warning",
                    {
                        element: asset,
                        message: "No href defined for source in track '" + trackName + "' in audio element '" + this.name + "'."
                    }
                );
                continue;
            }
            
            if (type === null)
            {
                this.bus.trigger(
                    "wse.interpreter.warning",
                    {
                        element: asset,
                        message: "No type defined for source in track '" + trackName + "' in audio element '" + this.name + "'."
                    }
                );
                continue;
            }
            
            trackFiles[type] = href;
        }
        
        // Progress bar doesn't work... because audio/video get streamed?
        /*
        this.bus.trigger("wse.assets.loading.increase");
        WSE.tools.attachEventListener(track, 'load', function() { self.bus.trigger("wse.assets.loading.decrease"); });*/
        
        if (track.canPlayType("audio/mpeg") && typeof trackFiles["mp3"] !== "undefined")
        {
            track.src = trackFiles["mp3"];
        }
        else
        {
            if (typeof trackFiles["ogg"] === "undefined")
            {
                this.bus.trigger(
                    "wse.interpreter.warning",
                    {
                        element: asset,
                        message: "No usable source found for track '" + trackName + "' in audio element '" + this.name + "'."
                    }
                );
                continue;
            }
            track.src = trackFiles["ogg"];
        }
        document.body.appendChild(track);
        
        this.tracks[trackName] = track;
    }
    
    this.isPlaying = false;
    
    // We need to reload the audio element because stupid Chrome is too dumb to loop.
    this.renewCurrent = function()
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
    
    this.play = function(command) 
    {
        command = command || document.createElement("div");
        var fade = command.getAttribute("fade") === "true" ? true : this.fade;
        
        if (self.current === null)
        {
            this.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: asset,
                    message: "No usable source found for track '" + trackName + "' in audio element '" + this.name + "'."
                }
            );
            return;
        }
        
        self.stop(command);
        
        self.isPlaying = true;
        
        if (self.loop === true)
        {
            WSE.tools.attachEventListener(
                self.current, 
                'ended', 
                function() 
                {
                    self.renewCurrent();
                    setTimeout(function() { self.play(); }, 0);
                }
            );
        }
        else
        {
            WSE.tools.attachEventListener(
                self.current, 
                'ended', 
                function() 
                {
                    self.isPlaying = false;
                }
            );
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
    };
    
    this.stop = function() 
    {
        if (self.current === null)
        {
            this.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: asset,
                    message: "No track set for audio element '" + this.name + "'."
                }
            );
            return;
        }
        if (self.fade === true)
        {
            self.fadeOut();
            setTimeout(
                function()
                {
                    self.current.pause();
                    self.currentTime = 0.1;
                    self.renewCurrent();
                    self.isPlaying = false;
                },
                1000
            );
        }
        else 
        {
            self.current.pause();
            self.currentTime = 0.1;
            self.renewCurrent();
            self.isPlaying = false;
        }
    };
    
    this.fadeIn = function()
    {
        var timer,
        fn;
        fn = function()
        {
            if (self.current.volume > 0.99)
            {
                self.current.volume = 1;
                clearInterval(timer);
                timer = null;
                return;
            }
            self.current.volume += 0.01;
        }
        timer = setInterval(fn, 5);
        return timer;
    };
    
    this.fadeOut = function()
    {
        var timer,
        fn;
        fn = function()
        {
            if (self.current.volume  < 0.01)
            {
                self.current.volume = 0;
                clearInterval(timer);
                timer = null;
                return;
            }
            self.current.volume -= 0.01;
        }
        timer = setInterval(fn, 5);
        return;
    };
    
    if (this.autopause === false)
    {
        return;
    }
    
    WSE.tools.attachEventListener(
        self.stage,
        'blur',
        function() {
            if (self.isPlaying === true)
            {
                self.fadeOut();
                setTimeout(function() { self.current.pause(); }, 1000);
            }
        }
    );
    
    WSE.tools.attachEventListener(
        self.stage,
        'focus',
        function() {
            if (self.isPlaying === true)
            {
                self.current.play();
                self.fadeIn();
            }
        }
    );
};

WSE.assets.Audio.prototype.set = function(command)
{
    var name, isPlaying, self;
    
    self = this;
    name = command.getAttribute("track");
    isPlaying = this.isPlaying === true && this.loop === true ? true : false;
    
    if (typeof this.tracks[name] === "undefined" || this.tracks[name] === null)
    {
        this.bus.trigger(
            "wse.interpreter.warning",
            {
                element: command,
                message: "Unknown track '" + name + "' in audio element '" + this.name + "'."
            }
        );
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
            setTimeout(function() { self.play(); }, 1010);
        }
        else
        {
            this.play();
        }
    }
};



WSE.assets.Animation = function(asset, stage, bus, assets, interpreter)
{
    var groups, i, len, current, curFn, transformations, j, jlen, self;
    
    if (!(this instanceof WSE.assets.Animation))
    {
        return new WSE.assets.Animation(asset, stage, bus);
    }
    
    this.stage = stage;
    this.bus = bus;
    this.asset = asset;
    this.name= asset.getAttribute("name");
    this.cbs = [];
    this.assets = assets;
    
    self = this;
    groups = this.asset.getElementsByTagName("group");
    len = groups.length;
    
    if (len < 1)
    {
        this.bus.trigger(
            "wse.interpreter.warning",
            {
                element: asset,
                message: "Animation asset '" + this.name + "' is empty."
            }
        );
        return { doNext: true };
    }
    
    for (i = 0; i < len; i += 1)
    {
        current = groups[i];
        transformations = current.getElementsByTagName("transform");
        doElements = current.getElementsByTagName("do");
        
        (function(transf, doEls)
        {
            var dlen = doEls.length;
            jlen = transformations.length;
            self.cbs.push(function()
            {
                var timers = [], from, to, unit, curTr, curAs, curAsName, dur, 
                    propName, j, easingFn, easingType, opt, di;
                for (j = 0; j < jlen; j += 1)
                {
                    curTr = transf[j];
                    
                    if (typeof curTr === "undefined")
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
                    if (easingType !== null 
                        && typeof WSE.fx.easing[easingType] !== "undefined" 
                        && WSE.fx.easing[easingType] !== null)
                    {
                        opt.easing = WSE.fx.easing[easingType];
                    }
                    timers.push(
                        (function(as, f, t, pn, u, opt)
                        {
//                             console.log(f, t, pn, u, opt);
                            return WSE.fx.transform(
                                function(v) { as.style[pn] = v + u; },
                                f,
                                t,
                                opt
                            );
                        }(curAs, from, to, propName, unit, opt))
                    );
                }
                for (di = 0; di < dlen; di += 1)
                {
                    (function()
                    {
                        var curDur, curDoEl;
                        curDoEl = doEls[di];
                        curDur = curDoEl.getAttribute("duration");
//                     console.log("Running do command.");
                        interpreter.runDoCommand(curDoEl);
                        if (curDur !== null)
                        {
                            console.log("Creating timer...");
                            timers.push(
                                WSE.fx.createTimer(curDur)
                            );
                        }
                    }());
                }
//                 console.log(timers);
                return timers;
            });
        }(transformations, doElements));
    }
    
    this.anim = new WSE.fx.Animation(this.cbs);
    
};

WSE.assets.Animation.prototype.start = function()
{
    this.anim.start();
};

WSE.assets.Animation.prototype.stop = function()
{
    this.anim.stop();
};


WSE.assets.Rain = function(asset, stage, bus)
{
    if (!(this instanceof WSE.assets.Rain))
    {
        return new WSE.assets.Rain(asset, stage, bus);
    }
    
    this.asset = asset;
    this.stage = stage;
    this.bus = bus;
    this.canvas = new WSE.fx.canvas.Canvas(
        { 
            width: stage.offsetWidth, 
            height: stage.offsetHeight
        }
    );
};



WSE.tools = {};

WSE.tools.attachEventListener = function(elem, type, listener)  
{
    if (elem == null || typeof elem == 'undefined')  
    {
        return;
    }
    if ( elem.addEventListener )  
    {
        elem.addEventListener( type, listener, false );
    } 
    else if ( elem.attachEvent ) 
    {
        elem.attachEvent( "on" + type, listener );
    }
};

WSE.tools.removeEventListener = function(elem, type, listener)  
{
    if (typeof elem === "undefined" || elem === null)  
    {
        return;
    }
    elem.removeEventListener( type, listener, false );
};

WSE.tools.textToHtml = function(text)
{
    if (!(String.prototype.trim))
    {
        text = text.replace(/^\n/, "");
        text = text.replace(/\n$/, "");
    }
    else
    {
        text = text.trim();
    }
    text = text.replace(/\n/g, "<br />");
    text = text.replace(/\[:/g, "<");
    text = text.replace(/:\]/g, ">");
    return text;
};