var console = console || { log: function() {} };
var STEINBECK = STEINBECK || {};

/**

    @module STEINBECK.Keys

    [Constructor] STEINBECK.Keys
    ============================

        A simple object to handle key press events.
        Has a number of handy pseudo constants which can
        be used to identify keys.

        If there's a key identifier missing, you can add your own by defining
        a plain object literal with a kc property for the keycode
        and an optional which property for the event type.


    Parameters
    ----------
    
        1. args:
            
            [Object] An object to configure the instance's behaviour.
            
            Has the following properties:
    
                * element: 
                    
                    [DOMElement] The HTML element to bind the listeners to. 
                    Default: window
                
                * log:
                
                    [Boolean] Log the captured events to the console?
                    Default: false.
                    
                    
    Properties
    ----------
    
        * keys:
        
            [Object] An object with 'constants' for easier key identification.
            The property names are the names of the keys and the values
            are objects with a "kc" property for the KeyCode and optionally
            a "which" property for the event type.
            
            The property names are all UPPERCASE.
            
            Examples:
            
                * SPACE
                * ENTER
                * TAB
                * CTRL
                * ALT
                * SHIFT
                * LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW
                * A to Z
                * NUM_0 to NUM_9
                * NUMPAD_0 to NUMPAD_9
                * F1 to F12
                * ADD, SUBSTRACT, MULTIPLY, DIVIDE, EQUALS
                * PERIOD
                * COMMA
    
                    
*/
STEINBECK.Keys = function(args) 
{

    args = args || {};

    if (!(this instanceof STEINBECK.Keys))
    {
        return new STEINBECK.Keys(args);
    }

    this.keys = {};
    this.keys.BACKSPACE     = {kc:   8};
    this.keys.TAB           = {kc:   9};
    this.keys.ENTER         = {kc:  13, which: 13};
    this.keys.SHIFT         = {kc:  16};
    this.keys.CTRL          = {kc:  17};
    this.keys.ALT           = {kc:  18};
    this.keys.PAUSE         = {kc:  19};
    this.keys.CAPS_LOCK     = {kc:  20};
    this.keys.ESCAPE        = {kc:  27};
    this.keys.SPACE         = {kc:  32};
    this.keys.PAGE_UP       = {kc:  33};
    this.keys.PAGE_DOWN     = {kc:  20};
    this.keys.END           = {kc:  20};
    this.keys.HOME          = {kc:  20};
    this.keys.LEFT_ARROW    = {kc:  37};
    this.keys.UP_ARROW      = {kc:  38};
    this.keys.RIGHT_ARROW   = {kc:  39};
    this.keys.DOWN_ARROW    = {kc:  40};
    this.keys.INSERT        = {kc:  45};
    this.keys.DELETE        = {kc:  46};
    this.keys.NUM_0         = {kc:  48};
    this.keys.NUM_1         = {kc:  49};
    this.keys.NUM_2         = {kc:  50};
    this.keys.NUM_3         = {kc:  51};
    this.keys.NUM_4         = {kc:  52};
    this.keys.NUM_5         = {kc:  53};
    this.keys.NUM_6         = {kc:  54};
    this.keys.NUM_7         = {kc:  55};
    this.keys.NUM_8         = {kc:  56};
    this.keys.NUM_9         = {kc:  57};
    this.keys.A             = {kc:  65};
    this.keys.B             = {kc:  66};
    this.keys.C             = {kc:  67};
    this.keys.D             = {kc:  68};
    this.keys.E             = {kc:  69};
    this.keys.F             = {kc:  70};
    this.keys.G             = {kc:  71};
    this.keys.H             = {kc:  72};
    this.keys.I             = {kc:  73};
    this.keys.J             = {kc:  74};
    this.keys.K             = {kc:  75};
    this.keys.L             = {kc:  76};
    this.keys.M             = {kc:  77};
    this.keys.N             = {kc:  78};
    this.keys.O             = {kc:  79};
    this.keys.P             = {kc:  80};
    this.keys.Q             = {kc:  81};
    this.keys.R             = {kc:  82};
    this.keys.S             = {kc:  83};
    this.keys.T             = {kc:  84};
    this.keys.U             = {kc:  85};
    this.keys.V             = {kc:  86};
    this.keys.W             = {kc:  87};
    this.keys.X             = {kc:  88};
    this.keys.Y             = {kc:  89};
    this.keys.Z             = {kc:  90};
    this.keys.LEFT_WIN      = {kc:  91};
    this.keys.RIGHT_WIN     = {kc:  92};
    this.keys.SELECT        = {kc:  93};
    this.keys.NUMPAD_0      = {kc:  96};
    this.keys.NUMPAD_1      = {kc:  97};
    this.keys.NUMPAD_2      = {kc:  98};
    this.keys.NUMPAD_3      = {kc:  99};
    this.keys.NUMPAD_4      = {kc: 100};
    this.keys.NUMPAD_5      = {kc: 101};
    this.keys.NUMPAD_6      = {kc: 102};
    this.keys.NUMPAD_7      = {kc: 103};
    this.keys.NUMPAD_8      = {kc: 104};
    this.keys.NUMPAD_9      = {kc: 105};
    this.keys.MULTIPLY      = {kc: 106};
    this.keys.ADD           = {kc: 107};
    this.keys.SUBSTRACT     = {kc: 109};
    this.keys.DECIMAL_POINT = {kc: 110};
    this.keys.DIVIDE        = {kc: 111};
    this.keys.F1            = {kc: 112};
    this.keys.F2            = {kc: 113};
    this.keys.F3            = {kc: 114};
    this.keys.F4            = {kc: 115};
    this.keys.F5            = {kc: 116};
    this.keys.F6            = {kc: 117};
    this.keys.F7            = {kc: 118};
    this.keys.F8            = {kc: 119};
    this.keys.F9            = {kc: 120};
    this.keys.F10           = {kc: 121};
    this.keys.F11           = {kc: 122};
    this.keys.F12           = {kc: 123};
    this.keys.NUM_LOCK      = {kc: 144};
    this.keys.SCROLL_LOCK   = {kc: 145};
    this.keys.SEMI_COLON    = {kc: 186};
    this.keys.EQUALS        = {kc: 187};
    this.keys.COMMA         = {kc: 188};
    this.keys.DASH          = {kc: 189};
    this.keys.PERIOD        = {kc: 190};
    this.keys.SLASH         = {kc: 191};
    this.keys.GRAVE         = {kc: 192};
    this.keys.OPEN_BRACKET  = {kc: 219};
    this.keys.BACK_SLASH    = {kc: 220};
    this.keys.CLOSE_BRACKET = {kc: 221};
    this.keys.SINGLE_QUOTE  = {kc: 222};

    this.listeners = [];

    var attach, 
        capture,
        captureUp,
        captureDown,
        capturePress,
        examineEvent,
        logEvents = args.log || false,
        element = args.element || window,
        self = this;

    attach = function(elem) 
    {
        if (elem == null || typeof elem == 'undefined') 
        {
            return;
        }
        if (elem.addEventListener) 
        {
            elem.addEventListener("keyup", captureUp, false);
            elem.addEventListener("keydown", captureDown, false);
            elem.addEventListener("keypress", capturePress, false);
            if (logEvents === true) 
            {
                elem.addEventListener("keyup", examineEvent, false);
                elem.addEventListener("keydown", examineEvent, false);
                elem.addEventListener("keypress", examineEvent, false);
            }
        } 
        else if (elem.attachEvent) 
        {
            elem.attachEvent("onkeyup", captureUp);
            elem.attachEvent("onkeydown", captureDown);
            elem.attachEvent("onkeypress", capturePress);
            if (logEvents === true) 
            {
                elem.attachEvent("onkeyup", examineEvent);
                elem.attachEvent("onkeydown", examineEvent);
                elem.attachEvent("onkeypress", examineEvent);
            }
        }
    };

    capture = function(event, type) 
    {
        var len = self.listeners.length,
            cur,
            i;
        for (i = 0; i < len; ++i)
        {
            cur = self.listeners[i];
            if (typeof cur == 'undefined' || cur.type != type)
            {
                continue;
            }
            cur.key = cur.key || {};
            kc = cur.key.kc || null;
            which = cur.key.which || null;
            if (event.which == which || event.keyCode == kc)
            {
                cur.callback(event);
            }
        }
    };

    captureUp = function(event)
    {
        capture(event, "up");
    };

    captureDown = function(event)
    {
        capture(event, "down");
    };

    capturePress = function(event)
    {
        capture(event, "press");
    };

    examineEvent = function(event)
    {
        console.log(event);
    };

    attach(element);
};

/**

    @module STEINBECK.Keys

    [Function] STEINBECK.Keys.addListener
    =====================================

        Binds a new callback to a key.
    

    Parameters
    ----------
    
        1. key:
            
            [Object] One of the STEINBECK.Keys pseudo constants.
            
        2. callback:
        
            [Function] The callback to execute once the key has been pressed.
        
        3. type: 

            [String] The event type to use. 
            
            One of:
        
                * "up"    for "keyup",
                * "down"  for "keydown",
                * "press" for "keypress"
        
            Default: "up"
            
    Errors
    ------
            
        Throws an Error when the type parameter is not recognized.
            
            
*/
STEINBECK.Keys.prototype.addListener = function(key, callback, type)
{
    type = type || "up";
    if (type !== "up" && type !== "down" && type !== "press")
    {
        throw new Error("Event type not recognized.");
    }
    this.listeners.push({
        key: key,
        callback: callback,
        type: type
    });
};

/**

    @module STEINBECK.Keys

    [Function] STEINBECK.Keys.removeListener
    ========================================

        Removes the event listeners for a key.
        

    Parameters
    ----------
    
        1. key:
        
            [Object] One of STEINBECK.Keys pseudo constants.
            
            
*/
STEINBECK.Keys.prototype.removeListener = function(key, callback, type)
{
    type = type || null;
    var len = this.listeners.length;
    var cur;
    for (var i = 0; i < len; ++i)
    {
        cur = this.listeners[i];
        if (type !== null && cur.type != type)
        {
            continue;
        }
        if (typeof cur !== 'undefined' && cur.key === key && cur.callback === callback)
        {
            delete this.listeners[i];
        }
    }
};

/** 
 
    @module STEINBECK.Keys

    [Function] STEINBECK.Keys.forAll
    ================================
    
        Executes a callback for any key event that occurs.
    
    
    Parameters
    ----------
    
        1. callback:
        
            [Function] A callback function to be executed when a keyboard
            event occurs.
            
        2. type: 
            
            [String] The keyboard event type to use. 
            
            One of:
            
                * "up"    for "keyup",
                * "down"  for "keydown",
                * "press" for "keypress"
            
            Default: "up"

    Errors
    ------
    
        Throws an Error when the type parameter is not recognized.
        

*/
STEINBECK.Keys.prototype.forAll = function(callback, type)
{
    type = type || "up";
    if (type !== "up" && type !== "down" && type !== "press")
    {
        throw new Error("Event type not recognized.");
    }
    for (var key in this.keys)
    {
        if (!this.keys.hasOwnProperty(key))
        {
            continue;
        }
        this.addListener(this.keys[key], callback, type);
    }
};