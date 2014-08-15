

var Squiddle=function(a,b){"use strict";a=a||{log:function(){},dir:function(){}};b=b||{};var c,d;c=function(b){b=b||{};if(!(this instanceof c)){return new c(b)}this.debug=b.debug||false;this.interceptErrors=b.interceptErrors||false;this.log=b.log||false;this.logData=b.logData||false;this.callbacks={"*":[]};var d=this,e;e=function(b,c){if(d.debug!==true){return}var e=b.error.name||"Error";a.log(e+" in listener; Event: "+b.info.event+"; Message: "+b.error.message)};this.subscribe(e,"squiddle.error")};c.create=function(a){a=a||{};return new c(a)};c.prototype.subscribe=function(a,b){if(typeof b!=="undefined"&&typeof b!=="string"&&typeof b!=="number"){throw new Error("Event names can only be strings or numbers!")}if(typeof a!=="function"){throw new Error("Only functions may be used as listeners!")}b=b||"*";this.callbacks[b]=this.callbacks[b]||[];this.callbacks[b].push(a);this.trigger("squiddle.subscribe",{listener:a,event:b,bus:this})};c.prototype.unsubscribe=function(a,b){if(typeof b!=="undefined"&&typeof b!=="string"&&typeof b!=="number"){throw new Error("Event names can only be strings or numbers!")}b=b||"*";var c=this.callbacks[b]||[],d=c.length,e;for(e=0;e<d;++e){if(c[e]===a){this.callbacks[b].splice(e,1)}}this.trigger("squiddle.unsubscribe",{listener:a,event:b,bus:this})};c.prototype.trigger=function(b,c,e){if(typeof b!=="undefined"&&typeof b!=="string"&&typeof b!=="number"){throw new Error("Event names can only be strings or numbers!")}b=b||"*";c=c||null;e=typeof e!=="undefined"&&e===false?false:true;var f,g,h,i,j,k,l=this;f=function(){var a,c,d,e,f,g,h="",i=[];c=b.split(".");for(a=0,d=c.length;a<d;++a){h=h+(a>0?".":"")+c[a];e=l.callbacks[h]||[];for(f=0,g=e.length;f<g;++f){i.push(e[f])}}if(b==="*"){return i}e=l.callbacks["*"]||[];for(f=0,g=e.length;f<g;++f){i.push(e[f])}return i}();g=f.length;h={event:b,subscribers:g,getQueueLength:function(){if(g===0){return 0}return g-(i+1)}};d=function(a){setTimeout(function(){throw a},0)};j=function(){if(l.log===true){a.log("Squiddle event triggered: "+b+"; Subscribers: "+g,l.logData===true?"; Data: "+c:"")}for(i=0;i<g;++i){k=f[i];try{k(c,h)}catch(e){a.log("Error is: "+e);l.trigger("squiddle.error",{error:e,info:h});if(l.interceptErrors!==true){d(e)}}}};if(e===true){setTimeout(j,0)}else{j()}};c.inject=function(a,b){b=b||{};var d=new c(b);a.subscribe=function(a,b){b=b||"*";d.subscribe(a,b)};a.unsubscribe=function(a,b){b=b||"*";d.unsubscribe(a,b)};a.trigger=function(a,b,c){a=a||"*";b=b||null;c=typeof c!=="undefined"&&c===false?false:true;d.trigger(a,b,c)}};b.create=c;b.inject=c.inject;return c}(typeof console==="undefined"?false:console,typeof exports==="undefined"?false:exports)

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

/*global Squiddle: true, requestAnimationFrame: false */
/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, 
 strict:true, undef:true, curly:true, browser:true, node:true, 
 indent:4, maxerr:50, globalstrict:true, white:false */
/**
 * 
 *    MO5.js - Javascript library for canvas and DOM animation and effects
 *    ====================================================================
 * 
 *        Copyright (c) 2012 The MO5.js contributors.
 *        
 * 
 *        License
 *        -------
 * 
 *            Redistribution and use in source and binary forms, with or without
 *            modification, are permitted provided that the following conditions 
 *            are met:
 *            
 *              * Redistributions of source code must retain the above copyright
 *              notice, this list of conditions and the following disclaimer.
 * 
 *              * Redistributions in binary form must reproduce the above copyright
 *              notice, this list of conditions and the following disclaimer in 
 *              the documentation and/or other materials provided with the 
 *              distribution.
 * 
 *              * Neither the name of the project nor the names of its contributors 
 *              may be used to endorse or promote products derived from this 
 *              software without specific prior written permission.
 * 
 *            THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 
 *            "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
 *            LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS 
 *            FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE 
 *            COPYRIGHT HOLDERS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, 
 *            SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT 
 *            LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF 
 *            USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 *            ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, 
 *            OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT 
 *            OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY 
 *            OF SUCH DAMAGE.
 * 
 *            
 *        Authors
 *        -------
 * 
 *            Jonathan Steinbeck <jonathan@steinbeck.in>
 *        
 *        
 *        Dependencies
 *        ------------
 *        
 *            Squiddle.js
 * 
 *            
 */

// If the browser doesn't support requestAnimationFrame, use a fallback.
window.requestAnimationFrame = (function ()
{
    "use strict";
    return window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        window.oRequestAnimationFrame || 
        window.msRequestAnimationFrame || 
        function (callback)
        {
            window.setTimeout(callback, 1000 / 60);
        };
})();

/**
 * 
 *    [Object] MO5
 *    ============
 *    
 *        The main (and only) global object of the project. Used as a
 *        namespace.
 *        
 * 
 */
var MO5 = (function ()
{
    "use strict";
 
    // Use a mock console object when the browser doesn't support the console API.
    var console = console || { log: function () {} };
    
    var out = {};
    out.timers = {};
    out.highestId = 0;

    out.bus = new Squiddle();

    /**
     *    
     *    [Function] MO5.getUniqueId
     *    =======================
     * 
     *        Returns a unique ID for MO5 objects.
     * 
     *    
     *        Return value
     *        ------------
     *    
     *            [Number] The unique ID.
     *        
     *        
     */

    out.getUniqueId = function ()
    {
        var p1, p2, p3, ret;
        
        p1 = 255 * Math.random();
        p2 = 255 * Math.random();
        p3 = 255 * Math.random();
        out.highestId += 1;
        ret = out.highestId + parseInt(p1 * p2 * p3, 10);
        
        return ret;
    };

    /**
     * Scales an element to fit the window using CSS transforms.
     * @param el The element to scale.
     * @param w The normal width of the element.
     * @param h The normal height of the element.
     */
    out.fitToWindow = function (el, w, h)
    {
        var dim, ratio, sw, sh, ratioW, ratioH;
        dim = out.getWindowDimensions();

        sw = dim.width; // - (dim.width * 0.01);
        sh = dim.height; // - (dim.height * 0.01);

        ratioW = sw / w;
        ratioH = sh / h;

        ratio = ratioW > ratioH ? ratioH : ratioW;

        //ratio = parseInt(ratio * 100) / 100;

        el.setAttribute('style',
        el.getAttribute('style') + ' -moz-transform: scale(' + ratio + ',' + ratio + ') rotate(0.01deg);' + ' -ms-transform: scale(' + ratio + ',' + ratio + ');' + ' -o-transform: scale(' + ratio + ',' + ratio + ');' + ' -webkit-transform: scale(' + ratio + ',' + ratio + ');' + ' transform: scale(' + ratio + ',' + ratio + ');');
    };


    /**
     * 
     *    [Function] MO5.transform
     *    ========================
     * 
     *        The main tween function for animations. Calculates values between 
     *        a start and an end value using either a sine function or a user 
     *        defined function and feeds them into a callback function. 
     * 
     *        
     *        Parameters
     *        ----------
     *        
     *            1. callback:
     *                [Function] The callback function. It takes one
     *                argument, which is the current calculated value. Use this
     *                callback function to set the value(s) you want to transform.
     * 
     *            2. from:
     *                [Number] The start value.
     *                
     *            3. to:
     *                [Number] The end value.
     *                
     *            4. args:
     *                [Object] (optional) Arguments object. 
     *                
     *                The options are:
     *                
     *                * duration: 
     *                    [Number] How long the transformation shall take 
     *                    (in milliseconds). Default: 1000
     *                
     *                * log: 
     *                    [Boolean] Log each calculated value to the browser's 
     *                    console?
     *                
     *                * function: 
     *                    [Function] The function to actually calculate the values.
     *                    It must conform to this signature [Number] function(d, t)
     *                    where d is the full duration of the transformation and
     *                    t is the time the transformation took up to that point. 
     *                    Default: MO5.functions.sine
     *                
     *                * onFinish:
     *                    [Function] Callback that gets executed once the
     *                    transformation is finished.
     *                    
     * 
     *        Return value
     *        ------------
     *        
     *            [Number] An ID to identify the interval used for the transformation.
     *            
     * 
     */
    out.transform = function (callback, from, to, args)
    {
        args = args || {};

        if (typeof callback === "undefined" || !callback)
        {
            throw new Error("MO5.transform expects parameter callback to be a function.");
        }

        var dur,
            now,
            f,
            tStart = new Date().getTime(),
            func,
            cv = from,
            timer,
            tElapsed = 0,
            diff = to - from,
            doLog = args.log || false,
            c = 0, // number of times func get's executed
            onFinish = args.onFinish || function () {};
        
        dur = typeof args.duration !== "undefined" ? args.duration : 1000;

        now = Date.now || function () { return +(new Date()); };

        f = args.easing || out.easing.sineEaseOut;

        func = function ()
        {
            var t, tb, dt;

            tb = now();
            c += 1;
            t = now();
            tElapsed = t - tStart;

            if (tElapsed > dur)
            {
                cv = from + diff;
                callback(to);
                clearInterval(timer);
                delete out.timers[timer];
                onFinish();
                
                return;
            }

            requestAnimationFrame(func);
            cv = f(dur, tElapsed) * diff + from;

            callback(cv);

            dt = now() - tb;

            if (doLog === true)
            {
                console.log("Current value: " + cv + "; c: " + c + "; Exec time: " + dt);
            }
        };

        timer = out.getUniqueId();
        //     timer = setInterval(func, 100);
        requestAnimationFrame(func);
        out.timers[timer] = true;
        
        return timer;
    };

    /**
     * Sets a timer that is valid for a specific time span and returns it's handle.
     * This function can be used to wait for non-MO5 functions in animations.
     * @param duration The time after which the timer is invalid.
     */
    out.createTimer = function (duration)
    {
        var timer;

        duration = duration || 0;
        duration = duration < 0 ? 0 : duration;

        timer = setTimeout(
            function ()
            {
                delete out.timers[timer];
            },
            duration
        );

        out.timers[timer] = true;

        return timer;
    };

    /**
     * Returns the window's width and height.
     * @return Object An object with a width and a height property.
     */
    out.getWindowDimensions = function ()
    {
        var e = window,
            a = 'inner';
        
        if (!('innerWidth' in e))
        {
            a = 'client';
            e = document.documentElement || document.body;
        }
        
        return {
            width: e[a + 'Width'],
            height: e[a + 'Height']
        };
    };

    /**
     * 
     *    [Constructor] out.Point
     *    =======================
     * 
     *        Simple object representing points.
     * 
     *        
     *        Parameters
     *        ----------
     *        
     *            1. x: [Number] The x value.
     *            2. y: [Number] The y value.
     *                
     * 
     */
    out.Point = function (x, y)
    {
        this.x = x;
        this.y = y;
    };

    /**
     * 
     *    [Function] MO5.Point.getDistance
     *    ================================
     *    
     *        Calculates the distance between the point and another point.
     *        
     *        
     *        Parameters
     *        ----------
     *        
     *            1. otherPoint: [MO5.Point] The other point.
     *            
     *            
     *        Return value
     *        ------------
     *        
     *            [Number] The distance between the two points.
     *            
     *            
     */
    out.Point.prototype.getDistance = function (otherPoint)
    {
        var dx = this.x - otherPoint.x,
            dy = this.y - otherPoint.y,
            dist = Math.squrt(dx * dx + dy * dy);
        
        return dist;
    };


    //////////////////////////////////////
    // MO5.easing                       //
    //////////////////////////////////////

    /**
     * Acceleration functions for use in MO5.transform().
     */
    out.easing = {};

    /*!
     * TERMS OF USE - EASING EQUATIONS
     * Open source under the BSD License.
     * Copyright 2001 Robert Penner All rights reserved.
     * 
     * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
     * 
     * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
     * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
     * Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.
     * 
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
     */

    /**
     * Function for linear transformations.
     */
    out.easing.linear = function (d, t)
    {
        return t / d;
    };

    /**
     * Function for sine transformations.
     */
    out.easing.sineEaseOut = function (d, t)
    {
        var s = Math.PI / (2 * d);
        var y = Math.abs(Math.sin(t * s));
        
        return y;
    };

    out.easing.sineEaseIn = function (d, t)
    {
        var s = Math.PI / (2 * d);
        var y = Math.abs(-Math.cos(t * s) + 1);
        
        return y;
    };

    out.easing.sineEaseInOut = function (d, t)
    {
        if (t / (d / 2) < 1)
        {
            return out.easing.sineEaseIn(d, t);
        }
        else
        {
            return out.easing.sineEaseOut(d, t);
        }
    };


    /*
     * EaseOutBounce for JavaScript, taken from jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
     *
     * TERMS OF USE - jQuery Easing
     * 
     * Open source under the BSD License. 
     * 
     * Copyright © 2008 George McGinley Smith
     * All rights reserved.
     * 
     * Redistribution and use in source and binary forms, with or without modification, 
     * are permitted provided that the following conditions are met:
     * 
     * Redistributions of source code must retain the above copyright notice, this list of 
     * conditions and the following disclaimer.
     * Redistributions in binary form must reproduce the above copyright notice, this list 
     * of conditions and the following disclaimer in the documentation and/or other materials 
     * provided with the distribution.
     * 
     * Neither the name of the author nor the names of contributors may be used to endorse 
     * or promote products derived from this software without specific prior written permission.
     * 
     * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
     * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
     * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
     *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
     *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
     *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
     * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
     *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
     * OF THE POSSIBILITY OF SUCH DAMAGE. 
     *
     */
    out.easing.easeOutBounce = function (d, t)
    {
        var b = 0,
            c = 1;

        if ((t /= d) < (1 / 2.75))
        {
            return c * (7.5625 * t * t) + b;
        }
        else if (t < (2 / 2.75))
        {
            return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
        }
        else if (t < (2.5 / 2.75))
        {
            return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
        }
        else
        {
            return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
        }
    };

    out.easing.createEaseOutFunction = function (potency)
    {
        var fn = function (d, t)
        {
            return 1 - Math.pow(1 - (t / d), potency);
        };
        
        return fn;
    };

    out.easing.createEaseInFunction = function (potency)
    {
        var fn = function (d, t)
        {
            return Math.pow((t / d), potency);
        };
        
        return fn;
    };

    out.easing.createEaseInOutFunction = function (potency)
    {
        var fn, eIn, eOut;
        eIn = out.easing.createEaseInFunction(potency);
        eOut = out.easing.createEaseOutFunction(potency);
        
        fn = function (d, t)
        {
            var val;
            
            if (t > d / 2)
            {
                val = eOut(d, t);
            }
            else
            {
                val = eIn(d, t);
            }
            
            return val;
        };
        
        return fn;
    };

    out.easing.easeOutQuad = out.easing.createEaseOutFunction(2);
    out.easing.easeOutCubic = out.easing.createEaseOutFunction(3);
    out.easing.easeOutQuart = out.easing.createEaseOutFunction(4);
    out.easing.easeOutQuint = out.easing.createEaseOutFunction(5);

    out.easing.easeInQuad = out.easing.createEaseInFunction(2);
    out.easing.easeInCubic = out.easing.createEaseInFunction(3);
    out.easing.easeInQuart = out.easing.createEaseInFunction(4);
    out.easing.easeInQuint = out.easing.createEaseInFunction(5);

    out.easing.easeInOutQuad = out.easing.createEaseInOutFunction(2);
    out.easing.easeInOutCubic = out.easing.createEaseInOutFunction(3);
    out.easing.easeInOutQuart = out.easing.createEaseInOutFunction(4);
    out.easing.easeInOutQuint = out.easing.createEaseInOutFunction(5);


    //////////////////////////////////////
    // MO5.mixins                       //
    //////////////////////////////////////

    out.mixins = {};

    /**
     * Mixin function for adding a drawing function
     * to the canvas.
     */
    out.mixins.display = function ()
    {
        var self = this;
        
        this.canvas.addCallback(
            this.id, function ()
            {
                self.draw();
            }, 
            this.layer || 0, 
            this
        );
    };

    /**
     * Mixin function to remove a drawing function
     * from the canvas.
     */
    out.mixins.hide = function ()
    {
        this.canvas.removeCallback(this.id);
    };

    /**
     * Mixin function to calculate the center of a MO5 object.
     */
    out.mixins.getCenter = function ()
    {
        var x = (this.x + (this.width / 2)),
            y = (this.y + (this.height / 2));
        
        return new out.Point(x, y);
    };

    /**
     * Changes an object property and sets the internal update flag.
     */
    out.mixins.change = function (key, value)
    {
        this[key] = value;
        this.updated = true;
    };


    out.mixins.moveTo = function (x, y, args)
    {
        args = args || {};
        var t0,
        t1,
        self = this;
        
        t0 = out.transform(
            function (v)
            {
                self.x = v;
            },
            this.x,
            x,
            args
        );
        
        t1 = out.transform(
            function (v)
            {
                self.y = v;
            },
            this.y,
            y,
            args
        );
        
        return [t0, t1];
    };

    out.mixins.move = function (x, y, args)
    {
        var dx, dy;
        
        args = args || {};
        dx = this.x + x;
        dy = this.y + y;
        
        return this.moveTo(dx, dy, args);
    };

    out.mixins.fadeIn = function (args)
    {
        args = args || {};
        var self = this;
        return out.transform(

        function (v)
        {
            self.opacity = v;
        },
        this.opacity,
        1,
        args);
    };

    out.mixins.fadeOut = function (args)
    {
        args = args || {};
        var self = this;
        return out.transform(

        function (v)
        {
            self.opacity = v;
        },
        this.opacity,
        0,
        args);
    };


    //////////////////////////////////////
    // MO5.Animation                    //
    //////////////////////////////////////

    out.Animation = function (callbacks)
    {
        if (!(this instanceof out.Animation))
        {
            return new out.Animation(callbacks);
        }

        this.cbs = callbacks.slice();
        this.isRunning = false;
        this.stopped = true;
        this.paused = false;
        this.timers = {};
        this.index = 0;
    };

    out.Animation.prototype.animate = function (callbacks, onFinish)
    {
        onFinish = onFinish || function ()
        {};

        var self = this,
            cbs = callbacks.slice(),
            cur = cbs[this.index],
            ts,
            len,
            i,
            cb;

        if (typeof cur === "undefined" || cur === null)
        {
            this.index = 0;
            return onFinish();
        }

        this.index += 1;

        ts = cur();
        if (typeof ts === "undefined")
        {
            this.animate(cbs, onFinish);
            return;
        }

        len = ts.length;
        for (i = 0; i < len; ++i)
        {
            this.timers[ts[i]] = out.timers[ts[i]];
        }

        cb = function ()
        {
            self.animate(cbs, onFinish);
        };

        this.onTimersFinished(ts, cb);
    };

    out.Animation.prototype.onTimersFinished = function (ts, cb)
    {
        var len = ts.length, i, self = this, recFn;
        
        recFn = function ()
        {
            self.onTimersFinished(ts, cb);
        };
        
        for (i = 0; i < len; ++i)
        {
            if (typeof out.timers[ts[i]] !== 'undefined' && out.timers[ts[i]] === true)
            {
                setTimeout(recFn, 20);
                return;
            }
        }
        cb();
    };

    out.Animation.prototype.run = function ()
    {
        var self = this;
        if (this.isRunning === false)
        {
            return;
        }
        setTimeout(

        function ()
        {
            if (this.stopped === true)
            {
                return;
            }
            if (this.paused === true)
            {
                return self.run();
            }
            self.animate(
            self.cbs,

            function ()
            {
                self.run();
            });
        },
        0);
    };

    out.Animation.prototype.start = function ()
    {
        this.stopped = false;
        this.isRunning = true;
        this.run();
    };

    out.Animation.prototype.loop = function (max, cur)
    {
        var self = this;
        max = max || 1;
        cur = cur || 0;
        setTimeout(
            function ()
            {
                cur++;
                if (cur > max)
                {
                    return;
                }
                self.animate(self.cbs, function () { self.loop(max, cur); });
            },
            20
        );
    };

    out.Animation.prototype.stop = function (finishCurrent)
    {
        var fc = finishCurrent || false,
            key,
            self = this;
        this.stopped = !fc;
        if (fc !== true)
        {
            for (key in this.timers)
            {
                if (this.timers.hasOwnProperty(key))
                {
                    clearInterval(key);
                    if (typeof self.timers[key] !== 'undefined')
                    {
                        delete self.timers[key];
                    }
                }
            }
        }
        this.isRunning = false;
    };


    out.canvas = {};

    out.canvas.PrototypeObject = function () {};
    out.canvas.PrototypeObject.prototype.move = out.mixins.move;
    out.canvas.PrototypeObject.prototype.moveTo = out.mixins.moveTo;
    out.canvas.PrototypeObject.prototype.fadeIn = out.mixins.fadeIn;
    out.canvas.PrototypeObject.prototype.fadeOut = out.mixins.fadeOut;
    out.canvas.PrototypeObject.prototype.display = out.mixins.display;
    out.canvas.PrototypeObject.prototype.hide = out.mixins.hide;
    out.canvas.PrototypeObject.prototype.getCenter = out.mixins.getCenter;
    out.canvas.PrototypeObject.prototype.change = out.mixins.change;


    //////////////////////////////////////
    // MO5.canvas.Canvas                //
    //////////////////////////////////////

    /**
     * Constructor function for an object to wrap the HTML5 canvas 
     * and provide an animation loop.
     * 
     * @param Object args Optional arguments for the Canvas.
     *     Properties:
     *     - [String] id The HTML ID of a canvas element to use.
     *     - [Number] width The width of the canvas element in pixels. Default: 800.
     *     - [Number] height The height of the canvas element in pixels. Default: 450.
     *     - [Boolean] scale Should the canvas be scaled? Default: false.
     *     - [Number] scaleX The scale factor on the x axis. Default: 1.
     *     - [Number] scaleY The scale factor on the y axis. Default: 1.
     */
    out.canvas.Canvas = function (args)
    {
        args = args || {};

        this.id = out.getUniqueId();
        var self = this,
            id = args.id || null,
            isFrozen = false;
        if (id === null)
        {
            this.cv = document.createElement("canvas");
            this.cv.setAttribute("id", "MO5Canvas" + this.id);
        }
        else
        {
            this.cv = document.getElementById(id);
        }
        this.ct = this.cv.getContext("2d");
        this.fps = args.fps || 30;
        this.tbf = 1 / this.fps;
        this.time = 0;
        this.sine = 0;
        this.width = args.width || 800;
        this.height = args.height || 450;
        this.functions = [];
        this.functionsByKey = {};
        this.functionsByPriority = [];
        this.scale = args.scale || false;
        this.scaleX = args.scaleX || 1;
        this.scaleY = args.scaleY || 1;
        this.frozen = false;
        this.temp = document.createElement("canvas");
        this.stopped = true;
        this.bus = args.bus || out.bus;

        this.cv.width = this.width;
        this.cv.height = this.height;
        this.temp.width = this.width;
        this.temp.height = this.height;
        document.body.appendChild(this.cv);

        this.draw = function ()
        {
            if (self.stopped === false)
            {
                requestAnimationFrame(self.draw);
            }
            
            var tbf = self.tbf;
            self.time += tbf;
            var env, len, i, time = self.time, funcs = self.functions;
            var cv = self.cv, ct = self.ct;
            
            if (self.frozen === true && isFrozen === true)
            {
                ct.drawImage(self.temp, 0, 0);
                return;
            }
            else if (self.frozen === false && isFrozen === true)
            {
                isFrozen = false;
            }
            
            self.sine = (Math.sin(time) + 1) / 2;
            
            env = {
                context: ct,
                canvas: cv,
                fps: self.fps,
                tbf: tbf,
                time: time,
                sine: self.sine
            };
            
            ct.clearRect(0, 0, cv.width, cv.height);
            
            for (i = 0, len = funcs.length; i < len; ++i)
            {
                funcs[i].callback(env);
            }
            if (self.frozen === true)
            {
                self.temp.clearRect(0, 0, self.width, self.height);
                self.temp.drawImage(cv, 0, 0);
                isFrozen = true;
            }
        };
    };

    /**
     * Adds a drawing function to the Canvas. The function will be called
     * on each animation loop iteration.
     * 
     * @param [String] key A key to identify the drawing function.
     * @param [Function] cb The drawing function.
     * @
     * param [Number] (optional) The priority that determines the order in which
     *    drawing functions will be executed. The higher the number,
     *    the later the drawing function will be called. That means
     *    the things that should be drawn in the foreground should
     *    have the highest priority. Default: 0.
     */
    out.canvas.Canvas.prototype.addCallback = function (key, cb, priority)
    {
        var fbp = this.functionsByPriority,
            func = {
                key: key,
                callback: cb,
                priority: priority || 0
            };
        if (typeof fbp[priority] === 'undefined' || fbp[priority] === null)
        {
            this.functionsByPriority[priority] = [];
        }
        this.functionsByPriority[priority].push(func);
        this.functionsByKey[key] = func;
        this.rebuildFunctionQueue();
    };

    /**
     * Rebuilds the function queue. This function is not meant 
     * to be used by MO5 users and should be considered private.
     */
    out.canvas.Canvas.prototype.rebuildFunctionQueue = function ()
    {
        var len, cur, i, j, plen;
        this.functions = [];
        len = this.functionsByPriority.length;
        for (i = 0; i < len; ++i)
        {
            if (typeof this.functionsByPriority[i] === "undefined")
            {
                continue;
            }
            cur = this.functionsByPriority[i];
            plen = cur.length;
            for (j = 0; j < plen; ++j)
            {
                this.functions.push(cur[j]);
            }
        }
    };

    /**
     * Removes a drawing function from the Canvas queue.
     * @param String key The key to identify the drawing function.
     */
    out.canvas.Canvas.prototype.removeCallback = function (key)
    {
        if (typeof this.functionsByKey[key] === "undefined")
        {
            return;
        }
        var func = this.functionsByKey[key],
            priority = func.priority,
            bucket = this.functionsByPriority[priority],
            len = bucket.length,
            i;
        for (i = 0; i < len; ++i)
        {
            if (bucket[i].key !== key)
            {
                continue;
            }
            this.functionsByPriority[priority].splice(i, 1);
        }
        this.rebuildFunctionQueue();
        delete this.functionsByKey[key];
    };

    /**
     * Starts the animation loop.
     */
    out.canvas.Canvas.prototype.start = function ()
    {
        this.stopped = false;
        this.draw();
    };

    /**
     * Stops the animation loop.
     */
    out.canvas.Canvas.prototype.stop = function ()
    {
        this.stopped = true;
    };

    /**
     * Scales the canvas to fit the window.
     * @param Boolean onlyIfSmaller (optional) Only resize the canvas to
     *     the current window dimensions when the window is smaller
     *     than the canvas?
     *     Default: false
     */
    out.canvas.Canvas.prototype.fitToWindow = function (onlyIfSmaller)
    {
        var dim = out.getWindowDimensions(),
            el = this.cv,
            ww = dim.width,
            wh = dim.height,
            ratio = this.width / this.height,
            hv = ww / ratio,
            wv = wh * ratio,
            newRatio = ww / wh;
        
        onlyIfSmaller = onlyIfSmaller || false;

        if (onlyIfSmaller === true && ww >= this.width && wh >= this.height)
        {
            return;
        }

        if (ratio < newRatio)
        {
            hv = wh;
        }
        else
        {
            wv = ww;
        }

        el.setAttribute('style', ' width: ' + wv + 'px; height: ' + hv + 'px; margin: auto; position: absolute;' + ' left: ' + ((ww - wv) / 2) + 'px; top: ' + ((wh - hv) / 2) + 'px;');
    };

    /**
     * Moves the canvas to the center of the browser window.
     */
    out.canvas.Canvas.prototype.center = function ()
    {
        var dim = out.getWindowDimensions(),
            el = this.cv,
            ww = dim.width,
            wh = dim.height,
            hv = this.height,
            wv = this.width;

        el.setAttribute('style', 'position: absolute; left: ' + ((ww - wv) / 2) + 'px; top: ' + ((wh - hv) / 2) + 'px;');
    };


    //////////////////////////////////////
    // MO5.canvas.ImagePack
    //////////////////////////////////////

    /**
     * Constructor function for ImagePacks. An ImagePack is an object that
     * wraps one or more images on the canvas. This can be used to animate
     * sprites.
     * 
     * @param MO5.canvas.Canvas canvas The Canvas object to use.
     * @param Object args An object literal containing optional arguments.
     *     Properties:
     *     - [Number] x: The position on the x axis. Default: 0.
     *     - [Number] y: The position on the y axis. Default: 0.
     *     - [Number] layer: The layer on which the images will be drawn.
     *         On the Canvas object, this is called the priority. Default: 0.
     *     - [Number] rotation: The rotation of the images in degrees. Default: 0.
     *     - [Number] alpha: The transparency of the images on a scale from
     *         0 (invisible) to 1 (no transparency). Default: 1.
     *     - [Number] pivotX: The pivot position on the x axis (used for rotation).
     *     - [Number] pivotY: The pivot position on the y axis (used for rotation).
     *     - [Number] shadowX: The shadow offset on the x axis. Default: 5.
     *     - [Number] shadowY: The shadow offset on the y axis. Default: 5.
     *     - [Number] shadowBlur: The radius for the blur effect of the 
     *         shadow in pixels. Default: 5.
     *     - [String] shadowColor: CSS color of the shadow.
     *     - [Boolean] hasShadow: Display a shadow? Default: false.
     */
    out.canvas.ImagePack = function (canvas, args)
    {
        args = args || {};

        if (!(this instanceof out.canvas.ImagePack))
        {
            return new out.canvas.ImagePack(canvas, args);
        }

        this.images = {};
        this.current = null;
        this.x = args.x || 0;
        this.y = args.y || 0;
        this.id = out.getUniqueId();
        this.canvas = canvas;
        this.layer = args.layer || 0;
        this.alpha = args.alpha || 1;
        this.rotation = args.rotation || 0;
        this.pivotX = args.pivotX || this.x;
        this.pivotY = args.pivotY || this.y;
        this.shadowX = args.shadowX || 5;
        this.shadowY = args.shadowY || 5;
        this.shadowBlur = args.shadowBlur || 5;
        this.shadowColor = args.shadowColor || "rgba(0, 0, 0, 0.5)";
        this.hasShadow = args.hasShadow || false;
        this.updated = true;
    };

    out.canvas.ImagePack.prototype = new out.canvas.PrototypeObject();
    /*
out.canvas.ImagePack.prototype.display = out.mixins.display;
out.canvas.ImagePack.prototype.hide = out.mixins.hide;
out.canvas.ImagePack.prototype.getCenter = out.mixins.getCenter;
out.canvas.ImagePack.prototype.moveTo = out.mixins.moveTo;
out.canvas.ImagePack.prototype.move = out.mixins.move;*/

    /**
     * Drawing callback function for ImagePack objects.
     * WARNING: Only to be used by library developers.
     * @param Object env An object containing information about the canvas.
     */
    out.canvas.ImagePack.prototype.draw = function ()
    {
        var self = this,
            ct = self.canvas.ct,
            x = self.x,
            y = self.y,
            rotation = self.rotation,
            pivotX = self.pivotX,
            pivotY = self.pivotY;
            
        if (self.current === null)
        {
            throw new Error("You need to use set() before this method!");
        }
        
        ct.save();
        ct.globalAlpha = self.alpha;
        
        if (rotation > 0)
        {
            ct.translate(pivotX, pivotY);
            ct.rotate((Math.PI * rotation) / 180);
            ct.translate(-pivotX, - pivotY);
        }
        
        if (self.hasShadow === true)
        {
            ct.shadowOffsetX = self.shadowX;
            ct.shadowOffsetY = self.shadowY;
            ct.shadowBlur = self.shadowBlur;
            ct.shadowColor = self.shadowColor;
        }
        
        ct.drawImage(self.current, ((0.5 + x) | 0), ((0.5 + y) | 0));
        ct.restore();
    };

    /**
     * Adds an image to the ImagePack.
     * @param String name The name to identify the image.
     * @param String source The source URL of the image.
     */
    out.canvas.ImagePack.prototype.addImage = function (name, source)
    {
        var img = new Image();
        img.src = source;
        this.images[name] = img;
    };

    /**
     * Removes an image from the ImagePack.
     * @param String name The name of the image specified in the addImage
     *     function.
     */
    out.canvas.ImagePack.prototype.removeImage = function (name)
    {
        delete this.images[name];
    };

    /**
     * Sets the current image of the ImagePack. Only this image will be shown.
     * @param String name The image's name specified on addImage().
     */
    out.canvas.ImagePack.prototype.set = function (name)
    {
        if (typeof this.images[name] === 'undefined')
        {
            throw new Error("This ImagePack doesn't have such an image.");
        }
        this.current = this.images[name];
        this.width = this.current.width;
        this.height = this.current.height;
        this.pivotX = this.x + (this.width / 2);
        this.pivotY = this.y + (this.height / 2);
    };

    /**
     * Creates an MO5.Animation object to cycle through the images 
     * of the ImagePack.
     * 
     * @param Object args Object with optional arguments.
     *     Properties:
     *     - [Number] duration: The length of the cycle in milliseconds. 
     *         Default: 1000.
     *     - [Array] names: Array containing the names of the images to be
     *         used for the animation. The images will be shown in the order
     *         in which they are found in the array.
     *         If you do not provide this parameter, all images will be cycled
     *         through in no specific order. That means if the order of the images
     *         is relevant for the animation (and it will be in most cases)
     *         you should probably use this property.
     * @return MO5.Animation An animation object to start, stop or loop 
     *     the animation.
     */
    out.canvas.ImagePack.prototype.animate = function (args)
    {
        args = args || {};
        var names = args.names || null,
            cbs = [],
            images,
            duration = args.duration || 1000,
            self = this,
            len,
            i,
            key,
            imageArr = [];
        if (names === null)
        {
            images = this.images;
        }
        else
        {
            for (i = 0, len = names.length; i > len; ++i)
            {
                if (typeof this.images[names[i]] === "undefined")
                {
                    throw new Error("No such image in this ImagePack.");
                }
                images[names[i]] = this.images[names[i]];
            }
        }
        for (key in images)
        {
            if (images.hasOwnProperty(key))
            {
                imageArr.push(images[key]);
            }
        }
        cbs.push(

        function ()
        {
            var t0 = out.transform(

            function (v)
            {
                v = (0.5 + v) | 0;
                if (typeof imageArr[v] === "undefined" || imageArr[v] === null)
                {
                    console.log("No such image: " + v);
                    return;
                }
                self.current = imageArr[v];
            },
            0,
            imageArr.length - 1,
            {
                duration: duration,
                easing: out.easing.linear
            });
            return [t0];
        });
        return new out.Animation(cbs);
    };




    /**
     * 
     *    [Constructor] MO5.canvas.TextBox
     *    ================================
     * 
     *        A TextBox object can be used to display text on the canvas with a 
     *        specific width. If the text is longer than the width of the TextBox, 
     *        the text will be displayed on multiple lines.
     * 
     *        TextBox objects consider words to be atomic and will only start newlines
     *        at the end of words.
     * 
     * 
     *    Concepts:
     *    ---------
     * 
     * Layer
     * Shadow
     * Position
     * Rotation
     * 
     * 
     *    Parameters:
     *    -----------
     * 
     *        1. canvas:
     *            [MO5.canvas.Canvas] A Canvas object to use.
     * 
     *        2. args:
     *            [Object] An object literal to initialize the properties.
     * 
     * 
     *    Properties:
     *    -----------
     * 
     * text: 
     *            [String] The text to be displayed. Default: "".
     * 
     * lineHeight:
     *            [Number] The height of lines in pixels. Default: 18.
     * 
     * color:
     *            [String] The CSS color of the text. Default: "#fff".
     * 
     * font:
     *            [String] The CSS font settings. 
     *            Default: "bold 15px Arial, Helvetica, sans-serfif".
     * 
     * align:
     *            [String] How the text should be aligned. 
     *            Default: "left".
     * 
     * 
     */
    out.canvas.TextBox = function (canvas, args)
    {
        args = args || {};

        if (!(this instanceof out.canvas.TextBox))
        {
            return new out.canvas.TextBox(canvas, args);
        }
        
        this.lastText = "";
        this.lines = [];
        this.id = out.getUniqueId();
        this.canvas = canvas;
        this.width = canvas.cv.width;
        this.height = canvas.cv.height;
        this.layer = args.layer || 0;
        this.alpha = args.alpha || 1;
        this.x = args.x || 0;
        this.y = args.y || 0;
        this.rotation = args.rotation || 0;
        this.pivotX = args.pivotX || (this.x + (this.width / 2));
        this.pivotY = args.pivotY || (this.y + (this.height / 2));
        this.text = args.text || "";
        this.lineHeight = 18;
        this.color = "#fff";
        this.font = args.font || "bold 15px Arial, Helvetica, sans-serif";
        this.align = args.align || "left";
        this.shadowX = args.shadowX || 2;
        this.shadowY = args.shadowY || 2;
        this.shadowBlur = args.shadowBlur || 2;
        this.shadowColor = args.shadowColor || "rgba(0, 0, 0, 0.5)";
        this.hasShadow = args.hasShadow || false;
        this.updated = true;
    };

    out.canvas.TextBox.prototype = new out.canvas.PrototypeObject();

    out.canvas.TextBox.prototype.draw = function ()
    {
        var self = this,
            ct = self.canvas.ct,
            words = self.text.split(" "),
            word = "",
            line = "",
            len = words.length,
            i,
            lineLen;
            
        ct.save();
        ct.globalAlpha = self.alpha;
        
        if (self.rotation > 0)
        {
            ct.translate(self.pivotX, self.pivotY);
            ct.rotate((Math.PI * self.rotation) / 180);
            ct.translate(-self.pivotX, - self.pivotY);
        }
        
        if (self.hasShadow === true)
        {
            ct.shadowOffsetX = self.shadowX;
            ct.shadowOffsetY = self.shadowY;
            ct.shadowBlur = self.shadowBlur;
            ct.shadowColor = self.shadowColor;
        }
        
        ct.fillStyle = self.color;
        ct.font = self.font;
        ct.textAlign = self.align;
        
        if (this.text !== self.lastText)
        {
            self.lines = [];
            for (i = 0; i < len; ++i)
            {
                word = words[i];
                if (ct.measureText(line + " " + word).width > self.width)
                {
                    self.lines.push(line);
                    line = "";
                }
                line = line + " " + word;
                if (i === len - 1)
                {
                    self.lines.push(line);
                }
            }
        }
        
        lineLen = self.lines.length;
        
        for (i = 0; i < lineLen; ++i)
        {
            ct.fillText(
            self.lines[i], ((0.5 + self.x) | 0), ((0.5 + (self.y + self.lineHeight * i)) | 0));
        }
        
        self.lastText = self.text;
        self.canvas.ct.restore();
    };



    /**
     * 
     *   [Constructor] MO5.canvas.Rectangle:
     *   ===================================
     *   
     *      Wraps the rectangle functionality of the HTML5 Canvas.
     *  
     *  
     *      Concepts:
     *      ---------
     *  
     * Dimensions
     * Position
     * Layer
     * Rotation
     * Border
     * Shadow
     * Transparency
     * Canvas Object
     * 
     *  
     *      Parameters:
     *      -----------
     *  
     *         1. canvas:
     *            [MO5.canvas.Canvas] The Canvas object to use.
     *  
     *         2. args:
     *            [Object] An object literal for initializing optional arguments.
     *            Take a look at the concepts section for all possible properties.
     *       
     *            Properties:
     *  
     * color: 
     *                  [String] The fill color of the rectangle. 
     *                  Default: "#fff".
     *  
     *  
     */
    out.canvas.Rectangle = function (canvas, args)
    {
        args = args || {};

        if (!(this instanceof out.canvas.Rectangle))
        {
            return new out.canvas.Rectangle(canvas, args);
        }

        this.id = out.getUniqueId();
        this.canvas = canvas;
        this.width = args.width || canvas.cv.width;
        this.height = args.height || canvas.cv.height;
        this.layer = args.layer || 0;
        this.alpha = args.alpha || 1;
        this.x = args.x || 0;
        this.y = args.y || 0;
        this.rotation = args.rotation || 0;
        this.pivotX = args.pivotX || (this.x + (this.width / 2));
        this.pivotY = args.pivotY || (this.y + (this.height / 2));
        this.color = args.color || "#fff";
        this.borderColor = args.borderColor || "#000";
        this.borderWidth = args.borderWidth || 0;
        this.shadowX = args.shadowX || 5;
        this.shadowY = args.shadowY || 5;
        this.shadowBlur = args.shadowBlur || 5;
        this.shadowColor = args.shadowColor || "rgba(0, 0, 0, 0.5)";
        this.hasShadow = args.hasShadow || false;
    };
    out.canvas.Rectangle.prototype = new out.canvas.PrototypeObject();

    out.canvas.Rectangle.prototype.draw = function ()
    {
        var self = this,
            ct = self.canvas.ct,
            x = self.x,
            y = self.y,
            width = self.width,
            height = self.height,
            rotation = self.rotation,
            pivotX = self.pivotX,
            pivotY = self.pivotY;
        ct.save();
        ct.globalAlpha = self.alpha;
        if (rotation > 0)
        {
            ct.translate(pivotX, pivotY);
            ct.rotate((Math.PI * rotation) / 180);
            ct.translate(-pivotX, - pivotY);
        }
        if (self.hasShadow === true)
        {
            ct.shadowOffsetX = self.shadowX;
            ct.shadowOffsetY = self.shadowY;
            ct.shadowBlur = self.shadowBlur;
            ct.shadowColor = self.shadowColor;
        }
        ct.fillStyle = self.color;
        ct.fillRect(x, y, width, height);
        if (self.borderWidth > 0)
        {
            ct.strokeStyle = self.borderColor;
            ct.lineWidth = self.borderWidth;
            ct.strokeRect(x, y, width, height);
        }
        ct.restore();
    };





    //////////////////////////////////////
    // MO5.canvas.Rain
    //////////////////////////////////////

    /**
     *    [Constructor] MO5.canvas.Rain
     *    =============================
     *    
     *        A rain effect.
     *        
     *        Concepts:
     *        ---------
     *        
     * Dimensions
     * Layer
     * Transparency
     * Rotation
     * Position
     *        
     *        Parameters:
     *        -----------
     *        
     *            1. canvas:
     *                [MO5.canvas.Canvas] The Canvas object to use.
     *            
     *            2. args:
     *                [Object] An object literal with optional arguments.
     *                
     *                Properties:
     *                
     * speed:
     *                        [Number] The number of pixels to move on each iteration.
     *                    
     * drops:
     *                        [Number] The number of rain drops to display.
     *                        
     *                        
     */
    out.canvas.Rain = function (canvas, args)
    {
        args = args || {};

        if (!(this instanceof out.canvas.Rain))
        {
            return new out.canvas.Rain(canvas, args);
        }

        var self = this;

        this.id = out.getUniqueId();
        this.canvas = canvas;
        this.width = args.width || canvas.cv.width * 2;
        this.height = args.height || canvas.cv.height * 2;
        this.layer = args.layer || 0;
        this.alpha = args.alpha || 1;
        this.rotation = args.rotation || 0;
        this.pivotX = args.pivotX || (this.canvas.cv.width / 2);
        this.pivotY = args.pivotY || (this.canvas.cv.height / 2);
        this.color = args.color || "#fff";
        this.drops = args.drops || 100;
        this.data = null;
        this.speed = args.speed || 20;
        this.x = args.x || ((this.width - canvas.cv.width) / 2);
        this.y = args.y || ((this.height - canvas.cv.height) / 2);
        this.lastDrawTime = 0;

        this.canvas.bus.subscribe(

        function ()
        {
            self.hide();
        }, "mo5.canvas.rain.hideAll");

        this.canvas.bus.subscribe(

        function ()
        {
            self.display();
        }, "mo5.canvas.rain.displayAll");
    };
    out.canvas.Rain.prototype = new out.canvas.PrototypeObject();

    out.canvas.Rain.prototype.draw = function ()
    {
        var self = this,
            ct = self.canvas.ct,
            drops = self.drops,
            i,
            data = self.data,
            x,
            fy,
            ly,
            width = self.width,
            height = self.height,
            cur;
        ct.save();
        ct.globalAlpha = self.alpha;
        if (self.rotation > 0)
        {
            ct.translate(self.pivotX, self.pivotY);
            ct.rotate((Math.PI * self.rotation) / 180);
            ct.translate(-self.pivotX, - self.pivotY);
        }
        if (data === null)
        {
            data = [];
            for (i = 0; i < drops; ++i)
            {
                x = Math.random() * width - (self.width - self.canvas.cv.width) / 2;
                fy = Math.random() * height - (self.height - self.canvas.cv.height) / 2;
                ly = Math.random() * 40 + 5;
                data.push(
                {
                    x: x,
                    fy: fy,
                    ly: ly
                });
            }
        }
        ct.strokeStyle = self.color;
        ct.lineWidth = 1;
        ct.beginPath();
        for (i = 0; i < drops; ++i)
        {
            cur = data[i];
            cur.fy += self.speed;
            if (cur.fy > self.canvas.cv.height + cur.ly)
            {
                cur.fy = 0 - (self.height - self.canvas.cv.height) / 2 - cur.ly;
                cur.x = Math.random() * width - (self.width - self.canvas.cv.width) / 2;
            }
            ct.moveTo(cur.x, cur.fy);
            ct.lineTo(cur.x, cur.fy + cur.ly);
            ct.moveTo(cur.x - 1, cur.fy + 2 * (cur.ly / 3));
            ct.lineTo(cur.x - 1, cur.fy + cur.ly);
            data[i] = cur;
        }
        ct.stroke();
        ct.closePath();
        ct.restore();
        self.data = data;
    };

    out.canvas.Rain.prototype.display = out.mixins.display;
    out.canvas.Rain.prototype.hide = out.mixins.hide;
    out.canvas.Rain.prototype.getCenter = out.mixins.getCenter;
    out.canvas.Rain.prototype.fadeIn = out.mixins.fadeIn;
    out.canvas.Rain.prototype.fadeOut = out.mixins.fadeOut;


    //////////////////////////////////////
    // MO5.canvas.PixelManipulator
    //////////////////////////////////////

    out.canvas.PixelManipulator = function (canvas, args)
    {
        args = args || {};

        if (!(this instanceof out.canvas.PixelManipulator))
        {
            return new out.canvas.PixelManipulator(canvas, args);
        }

        var self = this;
        this.id = out.getUniqueId();
        this.canvas = canvas;
        this.width = args.width || canvas.cv.width;
        this.height = args.height || canvas.cv.height;
        this.layer = args.layer || 0;
        this.alpha = args.alpha || 1;
        this.rotation = args.rotation || 0;
        this.pivotX = args.pivotX || (this.canvas.cv.width / 2);
        this.pivotY = args.pivotY || (this.canvas.cv.height / 2);
        this.x = args.x || 0;
        this.y = args.y || 0;
        this.data = this.canvas.ct.createImageData(this.width, this.height);
        this.lastWidth = this.width;
        this.lastHeight = this.height;
        this.isChanged = true;
        this.img = new Image();

        this.draw = function ()
        {
            var ct = self.canvas.ct,
                data = self.data,
                cv2 = document.createElement("canvas"),
                ct2 = cv2.getContext("2d");
            
            ct.save();
            ct.globalAlpha = self.alpha;
            
            if (self.rotation > 0)
            {
                ct.translate(self.pivotX, self.pivotY);
                ct.rotate((Math.PI * self.rotation) / 180);
                ct.translate(-self.pivotX, - self.pivotY);
            }
            
            if (this.isChanged === false)
            {
                ct.drawImage(self.img, self.x, self.y);
                ct.restore();
                return;
            }
            
            this.isChanged = false;
            
            if (self.lastWidth !== self.width || self.lastHeight !== self.height)
            {
                data = ct.createImageData(self.width, self.height);
            }
            cv2.width = self.width;
            cv2.height = self.height;
            ct2.putImageData(data, self.x, self.y);
            self.img.src = cv2.toDataURL();
            ct.drawImage(self.img, self.x, self.y);
            ct.restore();
            self.data = data;
        };
    };

    out.canvas.PixelManipulator.prototype.setPixel = function (x, y, r, g, b, a)
    {
        var i = (x + y * this.width) * 4,
            data = this.data.data;
        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
        data[i + 3] = a;
        this.isChanged = true;
    };

    out.canvas.PixelManipulator.prototype.display = out.mixins.display;
    out.canvas.PixelManipulator.prototype.hide = out.mixins.hide;
    out.canvas.PixelManipulator.prototype.getCenter = out.mixins.getCenter;
    out.canvas.PixelManipulator.prototype.moveTo = out.mixins.moveTo;
    out.canvas.PixelManipulator.prototype.move = out.mixins.move;
    out.canvas.PixelManipulator.prototype.fadeIn = out.mixins.fadeIn;
    out.canvas.PixelManipulator.prototype.fadeOut = out.mixins.fadeOut;





    out.dom = {};
    
    out.dom.effects = {};
    
    out.dom.effects.typewriter = function (element, args)
    {
        var TYPE_ELEMENT = 1, TYPE_TEXT = 3, speed, cb;
        
        args = args || {};
        speed = args.speed || 50;
        cb = args.onFinish || null;
        
        function hideChildren(el)
        {
            var childNodes = el.childNodes, i, len;
            
            if (el.nodeType === TYPE_ELEMENT)
            {
                el.style.display = 'none';
                
                for (i = 0, len = childNodes.length; i < len; i += 1)
                {
                    hideChildren(childNodes[i]);
                }
            }
        }
        
        hideChildren(element);
        
        function showChildren(el, cb)
        {
            if (el.nodeType === TYPE_ELEMENT)
            {
                (function ()
                {
                    var children = [], i, len;
                    
                    while (el.hasChildNodes())
                    {
                        children.push(el.removeChild(el.firstChild));
                    }
                    
                    el.style.display = '';
                    
                    (function loopChildren()
                    {
                        if (children.length > 0)
                        {
                            showChildren(children[0], loopChildren);
                            el.appendChild(children.shift());
                        }
                        else if (cb)
                        {
                            setTimeout(cb, 0);
                        }
                    }());
                    
                }());
            }
            else if (el.nodeType === TYPE_TEXT)
            {
                (function ()
                {
                    var textContent = el.data.replace(/ +/g, ' '), i, len;
                    
                    el.data = '';
                    i = 0;
                    len = textContent.length;
                    
                    function insertTextContent()
                    {
                        el.data += textContent[i];
                        i += 1;
                        
                        if (i < len)
                        {
                            setTimeout(insertTextContent, 1000 / speed);
                        }
                        else if (cb)
                        {
                            setTimeout(cb, 0);
                        }
                    }
                    
                    insertTextContent();
                }());
            }
        }
        
        showChildren(element, cb);
    };

    out.dom.PrototypeObject = function ()
    {};

    out.dom.PrototypeObject.prototype.fadeIn = function (args)
    {
        args = args || {};
        var node = this.node;
        return out.transform(

        function (v)
        {
            node.style.opacity = v;
        },
        0,
        1,
        args);
    };

    out.dom.PrototypeObject.prototype.fadeOut = function (args)
    {
        args = args || {};
        var node = this.node;
        return out.transform(

        function (v)
        {
            node.style.opacity = v;
        },
        1,
        0,
        args);
    };

    out.dom.PrototypeObject.prototype.moveTo = function (x, y, args)
    {
        args = args || {};
        
        var node = this.node,
            ox = node.offsetLeft,
            oy = node.offsetTop,
            t0, t1;
            
        t0 = out.transform(
            function (v)
            {
                node.style.left = v + "px";
            },
            ox,
            x,
            args
        );
        
        t1 = out.transform(
            function (v)
            {
                node.style.top = v + "px";
            },
            oy,
            y,
            args
        );
        
        return [t0, t1];
    };

    out.dom.PrototypeObject.prototype.move = function (x, y, args)
    {
        args = args || {};
        
        var node = this.node,
            dx = node.offsetLeft + x,
            dy = node.offsetTop + y;
        
        return this.moveTo(dx, dy, args);
    };

    out.dom.PrototypeObject.prototype.display = function ()
    {
        var parent;
        
        try
        {
            parent = this.parent || document.getElementsByTagName("body")[0];
            parent.appendChild(this.node);
        }
        catch (e) {}
    };

    out.dom.PrototypeObject.prototype.hide = function ()
    {
        var parent;
        
        try
        {
            parent = this.parent || document.getElementsByTagName("body")[0];
            parent.removeChild(this.node);
        }
        catch (e) {}
    };




    out.dom.Node = function (args)
    {
        args = args || {};

        if (!(this instanceof out.dom.Node))
        {
            return new out.dom.Node(args);
        }

        this.parent = args.parent || document.getElementsByTagName("body")[0];
        this.nodeType = args.nodeType || "div";
        this.node = args.node || document.createElement(this.nodeType);
        this.bus = args.bus || out.bus;

        this.bus.trigger("mo5.dom.node.create", this);
    };
    out.dom.Node.prototype = new out.dom.PrototypeObject();
    out.dom.Node.prototype.constructor = out.dom.Node;





    out.dom.ImagePack = function (args)
    {
        args = args || {};

        if (!(this instanceof out.dom.ImagePack))
        {
            return new out.dom.ImagePack(args);
        }

        this.parent = args.parent || document.getElementsByTagName("body")[0];
        this.nodeType = args.nodeType || "div";
        this.node = args.node || document.createElement(this.nodeType);
        this.bus = args.bus || out.bus;

        this.bus.trigger("mo5.dom.imagepack.create", this);
    };
    out.dom.ImagePack.prototype = new out.dom.PrototypeObject();
    
    return out;

}());

/* global console, XMLHttpRequest, Squiddle, MO5, STEINBECK */
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
var WSE = (function (Squiddle, MO5, STEINBECK)
{
    "use strict";
    
    var out = {}, version = "0.4.0";
    
    out.fx = MO5;
    out.Keys = STEINBECK.Keys;
    Squiddle.inject(out);
    
    out.ajax = {};
    out.datasources = {};
    out.assets = {};
    out.assets.mixins = {
        displayable: {}
    };
    
    out.getVersion = function ()
    {
        return version;
    };
    
    console.log('WebStory Engine version ' + out.getVersion() + ' starting up...');
    
    /**
     * Function to asynchronously load the WebStory file.
     * @param url The URL that locates the WebStory file.
     * @param cb A callback function to execute when the file has been fetched.
     */
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
        },
        
        execute: function (interpreter, command) {
            
            var commands = [].slice.call(command.children).filter(function (child) {
                if (child.tagName &&
                        out.functions.execute.allowedCommands.indexOf(child.tagName) >= 0) {
                    
                    return true;
                }
            });
            
            commands.forEach(function (varCommand) {
                interpreter.runCommand(varCommand);
            });
        }
        
    };
    
    out.functions.execute.allowedCommands = [
        "var", "global", "localize", "globalize", "set_vars", "move", "hide", "show",
        "flash", "flicker", "shake", "play", "set", "fn", "restart", "trigger",
        "confirm", "alert", "prompt", "with"
    ];
    
    return out;

}(
typeof Squiddle === "undefined" ? false : Squiddle,
typeof MO5 === "undefined" ? false : MO5,
typeof STEINBECK === "undefined" ? false : STEINBECK));

/* global WSE */
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
    
    out.tools = out.tools || {};
    
    /**
     * Attaches a DOM Event to a DOM Element.
     * 
     * FIXME: Is this even needed? Supported browsers should all 
     * have .addEventListener()...
     */
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
    
    /**
     * Sets the x and y units on an asset object according
     * to it's definition in the WebStory.
     * @param obj The JavaScript object asset.
     * @param asset The XML Element with the asset's information.
     */
    out.tools.applyAssetUnits = function (obj, asset)
    {
        var x, y;
        
        x = asset.getAttribute('x') || "";
        y = asset.getAttribute('y') || "";
        obj.xUnit = x.replace(/^.*(px|%)$/, '$1');
        obj.xUnit = obj.xUnit || 'px';
        obj.yUnit = y.replace(/^.*(px|%)$/, '$1');
        obj.yUnit = obj.yUnit || 'px';
        
        if (obj.xUnit !== "px" && obj.xUnit !== "%") {
            obj.xUnit = "px";
        }
        
        if (obj.yUnit !== "px" && obj.yUnit !== "%") {
            obj.yUnit = "px";
        }
    };
    
    /**
     * Removes a DOM Event from a DOM Element.
     */
    out.tools.removeEventListener = function (elem, type, listener)
    {
        if (typeof elem === "undefined" || elem === null)
        {
            return;
        }
        elem.removeEventListener(type, listener, false);
    };
    
    /**
     * Function that replaces the names of variables in a string
     * with their respective values.
     * 
     * @param text [string] The text that contains variables.
     * @param interpreter [WSE.Interpreter] The interpreter instance.
     * @return [string] The text with the inserted variable values.
     */
    out.tools.replaceVariables = function (text, interpreter)
    {
        var f1, f2;
        
        if (typeof text !== "string") {
            interpreter.bus.trigger("wse.interpreter.error", {
                message: "Argument supplied to the replaceVariables function must be a string."
            });
            text = "";
        }
        
        f1 = function ()
        {
            var name = arguments[1];
            
            if (interpreter.globalVars.has(name))
            {
                return "" + interpreter.globalVars.get(name);
            }
            
            return "";
        };
        
        f2 = function ()
        {
            var name = arguments[1];
            
            if (name in interpreter.runVars)
            {
                return "" + interpreter.runVars[name];
            }
            
            return "";
        };
        
        // insert values of global variables ($$var):
        text = text.replace(/\{\$\$([a-zA-Z0-9_]+)\}/g, f1);
        
        // insert values of local variables ($var):
        text = text.replace(/\{\$([a-zA-Z0-9_]+)\}/g, f2);
        
        return text;
    };
    
    out.tools.getParsedAttribute = function (element, attributeName, interpreter, defaultValue) {
        
        var value;
        
        if (arguments.length < 3) {
            defaultValue = "";
        }
        
        value = element.getAttribute(attributeName) || ("" + defaultValue);
        
        return out.tools.replaceVariables(value, interpreter);
    };
    
    /**
     * Replaces { and } to < and > for making it HTML.
     * Optionally replaces newlines with <break> elements.
     * 
     * @param text [string] The text to convert to HTML.
     * @param nltobr [bool] Should newlines be converted to breaks? Default: false.
     */
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
    
    /**
     * Generates a unique ID. Used by assets to identify their own stuff
     * in savegames and the DOM of the stage.
     * 
     * @return [number] The unique ID.
     */
    out.tools.getUniqueId = (function ()
    {
        var uniqueIdCount = 0;
        
        return function ()
        {
            uniqueIdCount += 1;
            return uniqueIdCount;
        };
    }());
    
    /**
     * Converts the first character in a string to upper case.
     * 
     * @param input [string] The string to transform.
     * @return [string] The transformed string.
     */
    out.tools.firstLetterUppercase = function (input)
    {
        if (input.length < 1)
        {
            return "";
        }
        
        return "" + input.charAt(0).toUpperCase() + input.replace(/^.{1}/, "");
    };
    
    out.tools.mixin = function (source, target)
    {
        var key;
        
        for (key in source)
        {
            if (source.hasOwnProperty(key))
            {
                target[key] = source[key];
            }
        }
    };
    
    out.tools.extractUnit = function (numberString) {
        return typeof numberString !== "string" ? "" : numberString.replace(/^(-){0,1}[0-9]*/, "");
    };
    
    out.tools.calculateValueWithAnchor = function (oldValue, anchor, maxValue) {
    
        var value = 0, anchorUnit = "px";
        
        if (anchor === null) {
            return oldValue;
        }
        
        anchorUnit = out.tools.extractUnit(anchor);
        anchor = parseInt(anchor, 10);
        
        if (anchorUnit === "%") {
            value = oldValue - ((maxValue / 100) * anchor);
        }
        else {
            value = oldValue - anchor;
        }
        
        return value;
    };
    
}(WSE));

/* global localStorage, WSE */
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
    
    out.datasources = {};
    
    out.datasources.LocalStorage = function ()
    {};
    
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
    
}(WSE));

/* global console, WSE */
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
    
    out.Trigger = function (trigger, interpreter)
    {
        var self = this, fn;

        this.name = trigger.getAttribute("name") || null;
        this.event = trigger.getAttribute("event") || null;
        this.special = trigger.getAttribute("special") || null;
        this.fnName = trigger.getAttribute("function") || null;
        this.scene = trigger.getAttribute("scene") || null;
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

        if (this.special === null && this.fnName === null && this.scene === null)
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
        
        if (this.scene)
        {
            this.fn = function ()
            {
                console.log('Triggering event "' + self.event + '"...');
                out.commands.sub(trigger, interpreter);
            };
            return;
        }

        this.isKeyEvent = false;
        this.key = null;

        // FIXME: can this be deleted?
        //
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
                interpreter.bus.trigger("wse.interpreter.warning",
                {
                    element: trigger,
                    message: "Unknown function specified on trigger element '" + this.name + "'."
                });
                return;
            }
            
            fn = function ()
            {
                out.functions[self.fnName](self.interpreter, trigger);
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

                if (
                    typeof interpreter.game.keys.keys[this.key] === "undefined" ||
                    interpreter.game.keys.keys[this.key] === null
                )
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

        this.interpreter.bus.subscribe(this.fn, this.event);
        this.isSubscribed = true;
    };

    out.Trigger.prototype.deactivate = function ()
    {
        if (this.isSubscribed === false)
        {
            return;
        }

        this.interpreter.bus.unsubscribe(this.fn, this.event);
        this.isSubscribed = false;
    };

}(WSE));

/* global Squiddle, DOMParser, console, document, window, setTimeout, WSE */
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
        var host;
        
        out.trigger("wse.game.constructor", {args: args, game: this});
        
        args = args || {};
        this.bus = new Squiddle();
        this.url = args.url || "game.xml";
        this.ws = null;
        this.debug = args.debug === true ? true : false;
        
        host = args.host || false;
        this.host = host;
        
        if (host)
        {
            this.ws = (function (url)
            {
                var xml, parser;
                
                parser = new DOMParser();
                xml = host.get(url);
                       
                return parser.parseFromString(xml, "application/xml");
            }(this.url));
            
            this.init();
        }
        else
        {
            this.load(this.url);
        }
        
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
            }, 
            "wse.interpreter.warning"
        );
    };
    
    /**
     * Loads the WebStory file using the AJAX function and triggers
     * the game initialization.
     */
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
    
    /**
     * Initializes the game instance.
     */
    out.Game.prototype.init = function ()
    {
        //console.log("Initializing game...");
        var ws, stage, stageElements, stageInfo, width, height, id, self, alignFn, resizeFn;
        
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
        
        // Create the stage element or inject into existing one?
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
        
        if (stageInfo.getAttribute("center") === "yes")
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
        
        if (stageInfo.getAttribute("resize") === "yes")
        {
            out.tools.attachEventListener(window, 'resize', resizeFn);
            resizeFn();
        }
        
        this.stage = stage;
        //     stage.onclick = function() { self.interpreter.next(); };
        
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
                
                window.addEventListener("resize",
                                        
                                        function ()
                                        {
                                            console.log("Resizing...");
                                            out.fx.fitToWindow(stage, parseInt(width, 10), parseInt(height, 10));
                                        });
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
        var ret, settings, i, len, cur, curName;
        
        settings = this.ws.getElementsByTagName("setting");
        
        for (i = 0, len = settings.length; i < len; i += 1)
        {
            cur = settings[i];
            curName = cur.getAttribute("name") || null;
            
            if (curName !== null && curName === name)
            {
                ret = cur.getAttribute("value") || null;
                return ret;
            }
        }
        
        return null;
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
        
        if (this.ws === null)
        {
            return setTimeout(
                function ()
                {
                    self.start();
                }
            );
        }
        
        /*
         * this.next = function ()
         * {
         *    self.bus.trigger("wse.game.next", this);
         *    self.interpreter.next(true);
    };*/
        
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

/* global location, document, console, setTimeout, WSE */
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
        var loadScreen, self, fn;

        self = this;

        loadScreen = document.createElement("div");
        loadScreen.setAttribute("id", "WSELoadingScreen");
        loadScreen.style.zIndex = 10000;
        loadScreen.style.width = "100%";
        loadScreen.style.height = "100%";

        loadScreen.innerHTML = '' + 
            '<div class="container">' + 
                '<div class="heading">' + 
                    '<span id="WSELoadingScreenPercentage"></span>' + 
                    'Loading assets...' + 
                '</div>' + 
                '<div class="progressBar">' + 
                    '<div class="progress" id="WSELoadingScreenProgress" style="width: 100%;">' + 
                    '</div>' + 
                '</div>' + 
            '</div>';

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
                //console.log("Element missing.");
            }
        };

        this.bus.subscribe(fn, "wse.assets.loading.increase");
        this.bus.subscribe(fn, "wse.assets.loading.decrease");

        this.loadScreen = loadScreen;
    };

    out.Interpreter.prototype.start = function ()
    {
        var self, fn, makeKeyFn, bus;
        
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

        (function ()
        {
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
            };
            
            bus.subscribe(subscrFn, "wse.assets.loading.finished");
        }());

        this.buildAssets();
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
        var scenes, len, i, current, self;

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
        
        this.bus.trigger("wse.assets.loading.finished");

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
            this.bus.trigger(
                "wse.interpreter.error",
                {
                    message: "No scenes found!"
                }
            );
            
            return;
        }
        
        this.startTime = Math.round(+new Date() / 1000);
        this.changeScene(scenes[0]);
    };

    out.Interpreter.prototype.changeScene = function (scene)
    {
        var len, id, bus = this.bus;

        bus.trigger(
            "wse.interpreter.changescene.before",
            {
                scene: scene,
                interpreter: this
            },
            false
        );

        if (typeof scene === "undefined" || scene === null)
        {
            bus.trigger(
                "wse.interpreter.error",
                {
                    message: "Scene does not exist."
                }
            );
            
            return;
        }

        id = scene.getAttribute("id");
        this.visitedScenes.push(id);

        if (id === null)
        {
            bus.trigger(
                "wse.interpreter.error",
                {
                    message: "Encountered scene without id attribute."
                }
            );

            return;
        }

        bus.trigger("wse.interpreter.message", "Entering scene '" + id + "'.");
        this.currentCommands = scene.childNodes;
        len = this.currentCommands.length;
        this.index = 0;
        this.sceneId = id;
        this.currentElement = 0;

        if (len < 1)
        {
            bus.trigger(
                "wse.interpreter.warning",
                {
                    element: scene,
                    message: "Scene '" + id + "' is empty."
                }
            );
            
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
        this.currentScene = this.getSceneById(top.sceneId);
        this.currentElement = top.currentElement;
        this.currentCommands = this.currentScene.childNodes;
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

        if (this.waitForTimer === true || (this.wait === true && this.waitCounter > 0))
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
        nodeName = command.nodeName;

        // ignore text and comment nodes:
        if (nodeName === "#text" || nodeName === "#comment")
        {
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
        var tagName, ifvar, ifval, ifnot, varContainer, assetName, bus = this.bus;

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

        ifvar = command.getAttribute("ifvar") || null;
        ifval = command.getAttribute("ifvalue");
        ifnot = command.getAttribute("ifnot");

        if (ifvar !== null || ifval !== null || ifnot !== null)
        {
            varContainer = this.runVars;

            if (!(ifvar in varContainer))
            {
                bus.trigger(
                    "wse.interpreter.warning",
                    {
                        element: command,
                        message: "Unknown variable '" + ifvar +
                            "' used in condition. Ignoring command."
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
            assetName !== null &&
            assetName in this.assets &&
            typeof this.assets[assetName][tagName] === "function" &&
            tagName.match(/(show|hide|clear|flicker|flash|play|start|stop|pause|move|shake|set)/)
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

    out.Interpreter.prototype.buildAssets = function ()
    {
        var assets, len, i, cur, bus = this.bus;

        bus.trigger("wse.assets.loading.started");

        try
        {
            assets = this.story.getElementsByTagName("assets")[0].childNodes;
        }
        catch (e)
        {
            bus.trigger(
                "wse.interpreter.error",
                {
                    message: "Error while creating assets: " + e.getMessage()
                }
            );
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
        var name, type, self, bus = this.bus;

        bus.trigger(
            "wse.interpreter.createasset",
            {
                interpreter: this,
                asset: asset
            }, 
            false
        );

        name = asset.getAttribute("name");
        type = asset.tagName;
        self = this;

        if (name === null)
        {
            bus.trigger(
                "wse.interpreter.error",
                {
                    element: asset,
                    message: "Expected attribute 'name'."
                }
            );
            
            return;
        }

        if (type === null)
        {
            bus.trigger(
                "wse.interpreter.warning",
                {
                    element: asset,
                    message: "Expected attribute 'type' on asset '" + name + "'."
                }
            );
            
            return;
        }

        if (typeof this.assets[name] !== "undefined")
        {
            bus.trigger(
                "wse.interpreter.warning",
                {
                    element: asset,
                    message: "Trying to override existing asset '" + name + "'."
                }
            );
        }

        type = out.tools.firstLetterUppercase(type);

        if (type in out.assets)
        {
            this.assets[name] = new out.assets[type](asset, this);
            return;
        }
        else
        {
            console.log(out.assets);
            bus.trigger(
                "wse.interpreter.warning",
                {
                    element: asset,
                    message: "Unknown asset type '" + type + "'."
                }
            );
            
            return;
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
                    this.bus.trigger("wse.interpreter.warning", {
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
            bus.trigger(
                "wse.interpreter.error",
                {
                    message: "Loading savegame '" + savegameId + "' failed: Scene not found!"
                }
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

/* global document, setTimeout, WSE */
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
            yesEl.addEventListener("click",

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
                    setTimeout(function ()
                    {
                        interpreter.next();
                    }, 0);
                }
            });

            noEl = document.createElement("input");
            noEl.setAttribute("value", falseText);
            noEl.value = falseText;
            noEl.setAttribute("class", "false button");
            noEl.setAttribute("type", "button");
            noEl.addEventListener("click",

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
                    setTimeout(function ()
                    {
                        interpreter.next();
                    }, 0);
                }
            });

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
            buttonEl.addEventListener("click",

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
                    setTimeout(function ()
                    {
                        interpreter.next();
                    }, 0);
                }
            });

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
            buttonEl.addEventListener("click",

            function (ev)
            {
                var val;
                
                val = inputEl.value;
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
                    setTimeout(function ()
                    {
                        interpreter.next();
                    }, 0);
                }
            });

            cancelEl = document.createElement("input");
            cancelEl.setAttribute("value", cancelText);
            cancelEl.value = cancelText;
            cancelEl.setAttribute("class", "cancel button");
            cancelEl.setAttribute("type", "button");
            cancelEl.addEventListener("click",

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
                    setTimeout(function ()
                    {
                        interpreter.next();
                    }, 0);
                }
            });

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

}(WSE));

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
                interpreter.bus.trigger("wse.interpreter.warning",
                                        {
                                            element: command,
                                        message: "No 'var' attribute defined on " + type + " command. Command ignored."
                                        });
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
                });
            return {
                doNext: true
            };
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
        return {
            doNext: true
        };
    };
    
    module.commands.confirm = makeInputFn("confirm");
    module.commands.prompt = makeInputFn("prompt");
}(WSE));

/* global document, WSE */
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
     * The <flash> effect. Can be mixed into all visible assets.
     * 
     * The function has a config object as it's second argument.
     * It provides the following options:
     * 
     *  * args.animation: [bool] Is this effect part of an animation asset? If so,
     *      the engine does not need to wait for the effect to finish before
     *      executing the next commands.
     * 
     * @param command The DOM element of the command.
     * @param args Additional arguments. See above for details. Optional.
     */
    out.assets.mixins.displayable.flash = function (command, args)
    {
        var self, duration, wait, bus, stage, element, isAnimation, maxOpacity;
        var fx = out.fx, visible;

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
        visible = (+(element.style.opacity.replace(/[^0-9\.]/, ""))) > 0 ? true : false;

        if (!isAnimation)
        {
            self.interpreter.waitCounter += 1;
        }

        fx.transform(
            function (v)
            {
                element.style.opacity = v;
            },
            visible ? maxOpacity : 0,
            visible ? 0 : maxOpacity,
            {
                duration: duration / 3,
                onFinish: function ()
                {
                    var tranformFn, finishFn, argsObj;
                
                    tranformFn = function (v)
                    {
                        element.style.opacity = v;
                    };
                
                    finishFn = function ()
                    {
                            self.interpreter.waitCounter -= 1;
                    };
                
                    argsObj = {
                        duration: (duration / 3) * 2,
                        onFinish: !isAnimation ? finishFn : null,
                        easing: fx.easing.easeInQuad
                    };
                
                    fx.transform(tranformFn, visible ? 0 : maxOpacity, visible ? maxOpacity : 0, argsObj);
                },
                easing: fx.easing.easeInQuad
            }
        );

        bus.trigger("wse.assets.mixins.flash", this);

        return {
            doNext: true
        };
    };
}(WSE));

/* global document, setTimeout, WSE */
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
    
    out.assets.mixins.displayable.flicker = function (command, args)
    {
        var self, duration, bus, stage, times, step, element, fx = out.fx;
        var isAnimation, fn, iteration, maxOpacity, val1, val2, dur1, dur2;

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
            fx.transform(
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
                        fx.transform(
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
                                easing: fx.easing.easeInQuad
                            }
                        );
                    },
                    easing: fx.easing.easeInQuad
                }
            );
        };
        fn();

        bus.trigger("wse.assets.mixins.flicker", this);

        return {
            doNext: true
        };
    };
}(WSE));

/* global document, WSE */
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
    
    out.assets.mixins.displayable.hide = function (command, args)
    {
        var self, duration, wait, effect, direction, offsetWidth, offsetHeight;
        var ox, oy, to, prop, isAnimation, element, easingType, easing, stage;
        var xUnit, yUnit, fx = out.fx;
        var parse = out.tools.getParsedAttribute;

        args = args || {};
        self = this;
        wait = parse(command, "wait", this.interpreter) === "yes" ? true : false;
        duration = parse(command, "duration", this.interpreter, 500);
        effect = parse(command, "effect", this.interpreter, "fade");
        direction = parse(command, "direction", this.interpreter, "left");
        isAnimation = args.animation === true ? true : false;
        element = document.getElementById(this.cssid);
        easingType = parse(command, "easing", this.interpreter, "sineEaseOut");
        easing = (typeof fx.easing[easingType] !== null) ? 
            fx.easing[easingType] : 
            fx.easing.sineEaseOut;
        stage = this.stage;
        xUnit = this.xUnit || 'px';
        yUnit = this.yUnit || 'px';

        if (effect === "slide")
        {
            element.style.opacity = 1;
            
            if (xUnit === '%')
            {
                ox = element.offsetLeft / (stage.offsetWidth / 100);
                offsetWidth = 100;
            }
            else
            {
                ox = element.offsetLeft;
                offsetWidth = stage.offsetWidth;
            }
            
            if (yUnit === '%')
            {
                oy = element.offsetTop / (stage.offsetHeight / 100);
                offsetHeight = 100;
            }
            else
            {
                oy = element.offsetTop;
                offsetHeight = stage.offsetHeight;
            }
            
            switch (direction)
            {
                case "left":
                    to = ox - offsetWidth;
                    prop = "left";
                    break;
                case "right":
                    to = ox + offsetWidth;
                    prop = "left";
                    break;
                case "top":
                    to = oy - offsetHeight;
                    prop = "top";
                    break;
                case "bottom":
                    to = oy + offsetHeight;
                    prop = "top";
                    break;
                default:
                    to = ox - offsetWidth;
                    prop = "left";
            }

            if (!isAnimation)
            {
                self.interpreter.waitCounter += 1;
            }

            (function ()
            {
                var valFn, from, finishFn, options;
                
                valFn = function (v)
                {
                    element.style[prop] = v + (prop === 'left' ? xUnit : yUnit);
                };
                
                from = (prop === "left" ? ox : oy);
                
                finishFn = function ()
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
                            element.style.left = ox + xUnit;
                            prop = "left";
                            break;
                        case "top":
                        case "bottom":
                            element.style.top = oy + yUnit;
                            prop = "top";
                            break;
                        default:
                            element.style.left = ox + xUnit;
                            prop = "left";
                    }
                };
                
                options = {
                    duration: duration,
                    easing: easing,
                    onFinish: finishFn
                };
                
                fx.transform(valFn, from, to, options);
            }());
        }
        else
        {
            if (!isAnimation)
            {
                self.interpreter.waitCounter += 1;
            }
            
            (function ()
            {
                var valFn, options, finishFn;
                
                valFn = function (v)
                {
                    element.style.opacity = v;
                };
                
                finishFn = function ()
                {
                    if (!isAnimation)
                    {
                        self.interpreter.waitCounter -= 1;
                    }
                    
                    element.style.opacity = 0;
                };
                
                options = {
                    duration: duration,
                    easing: easing,
                    onFinish: finishFn
                };
                
                fx.transform(valFn, 1, 0, options);
            }());
        }

        this.bus.trigger("wse.assets.mixins.hide", this);

        return {
            doNext: true
        };
    };    
}(WSE));

/* global document, console, WSE */
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
    
    out.assets.mixins.displayable.move = function (command, args)
    {
        var x, y, z, element, self, wait, xUnit, yUnit, duration, easingType;
        var easing, waitX, waitY, waitZ, isAnimation, ox, oy, stage, fx = out.fx;
        var xAnchor, yAnchor, interpreter = this.interpreter;
        var offsetLeft, offsetTop, oldElementDisplayStyle;

        args = args || {};
        self = this;
        element = document.getElementById(this.cssid);
        
        x = command.getAttribute("x");
        y = command.getAttribute("y");
        z = command.getAttribute("z");
        
        xAnchor = command.getAttribute("xAnchor");
        yAnchor = command.getAttribute("yAnchor");
        
        if (xAnchor === null && this.xAnchor !== null) {
            xAnchor = this.xAnchor;
        }
        
        if (yAnchor === null  && this.yAnchor !== null) {
            yAnchor = this.yAnchor;
        }
        
        x = out.tools.replaceVariables(x, this.interpreter);
        y = out.tools.replaceVariables(y, this.interpreter);
        z = out.tools.replaceVariables(z, this.interpreter);
        xAnchor = out.tools.replaceVariables(xAnchor, this.interpreter);
        yAnchor = out.tools.replaceVariables(yAnchor, this.interpreter);
        
        duration = out.tools.getParsedAttribute(command, "duration", interpreter, 500);
        easingType = out.tools.getParsedAttribute(command, "easing", interpreter, "sineEaseOut");
        easing = (typeof fx.easing[easingType] !== null) ? 
            fx.easing[easingType] : 
            fx.easing.sineEaseOut;
        isAnimation = args.animation === true ? true : false;
        stage = this.interpreter.stage;
        
        offsetLeft = element.offsetLeft;
        offsetTop = element.offsetTop;

        if (x !== null)
        {
            xUnit = out.tools.extractUnit(x);
            x = parseInt(x, 10);
        }

        if (y !== null)
        {
            yUnit = out.tools.extractUnit(y);
            y = parseInt(y, 10);
        }
        
        oldElementDisplayStyle = element.style.display;
        element.style.display = "";
        
        if (xUnit === "%") {
            x = (stage.offsetWidth / 100) * x;
            xUnit = "px";
        }
        
        if (yUnit === "%") {
            y = (stage.offsetHeight / 100) * y;
            yUnit = "px";
        }
        
        x = out.tools.calculateValueWithAnchor(x, xAnchor, element.offsetWidth);
        y = out.tools.calculateValueWithAnchor(y, yAnchor, element.offsetHeight);
        
        element.style.display = oldElementDisplayStyle;

        wait = out.tools.getParsedAttribute(command, "wait", interpreter) === "yes" ? true : false;
        waitX = false;
        waitY = false;
        waitZ = false;

        if (x === null && y === null && z === null)
        {
            this.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Can't apply command 'move' to asset '" + 
                        this.name + "' because no x, y or z position " +
                        "has been supplied."
                }
            );
        }

        if (x !== null)
        {
            if (xUnit === '%')
            {
                ox = offsetLeft / (stage.offsetWidth / 100);
            }
            else
            {
                ox = offsetLeft;
            }
            
            if (!isAnimation)
            {
                self.interpreter.waitCounter += 1;
            }

            fx.transform(
                function (v)
                {
                    element.style.left = v + xUnit;
                },
                ox,
                x,
                {
                    onFinish: !isAnimation ? 
                        function ()
                        {
                            self.interpreter.waitCounter -= 1;
                        } : 
                        null,
                    duration: duration,
                    easing: easing
                }
            );
        }

        if (y !== null)
        {   
            if (yUnit === '%')
            {
                oy = offsetTop / (stage.offsetHeight / 100);
            }
            else
            {
                oy = offsetTop;
            }
            
            if (!isAnimation)
            {
                self.interpreter.waitCounter += 1;
            }

            fx.transform(
                function (v)
                {
                    element.style.top = v + yUnit;
                },
                oy,
                y,
                {
                    onFinish: !isAnimation ? 
                        function ()
                        {
                            self.interpreter.waitCounter -= 1;
                        } : 
                        null,
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

            fx.transform(
                function (v)
                {
                    element.style.zIndex = v;
                },
                element.style.zIndex || 0,
                parseInt(z, 10),
                {
                    onFinish: !isAnimation ? 
                        function ()
                        {
                            self.interpreter.waitCounter -= 1;
                        } : 
                        null,
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
}(WSE));

/* global WSE, document */
/*
    Copyright (c) 2012, 2013, 2014 The WebStory Engine Contributors
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
    
    out.assets.mixins.displayable.shake = function (command, args)
    {
        var dx, dy, element, self, xUnit, yUnit, duration, period;
        var easing, isAnimation, ox, oy, stage, fx = out.fx;

        args = args || {};
        self = this;
        element = document.getElementById(this.cssid);
        dx = command.getAttribute("dx");
        dy = command.getAttribute("dy");
        period = command.getAttribute("period") || 50;
        duration = command.getAttribute("duration") || 275;
        isAnimation = args.animation === true ? true : false;
        stage = this.interpreter.stage;

        if (dx === null && dy === null)
        {
            dy = "-10px";
        }

        if (dx !== null)
        {
            xUnit = out.tools.extractUnit(dx);
            dx = parseInt(dx, 10);
        }

        if (dy !== null)
        {
            yUnit = out.tools.extractUnit(dy);
            dy = parseInt(dy, 10);
        }

        easing = function (d, t)
        {
            var x = t / period;
            while ( x > 2.0 )
            {
                x -= 2.0;
            }
            if  ( x > 1.0 )
            {
                x = 2.0 - x;
            }
            return x;
        };

        if (dx !== null)
        {
            if (xUnit === '%')
            {
                ox = element.offsetLeft / (stage.offsetWidth / 100);
            }
            else
            {
                ox = element.offsetLeft;
            }
            
            self.interpreter.waitCounter += 1;

            fx.transform(
                function (v)
                {
                    element.style.left = v + xUnit;
                },
                ox - dx,
                ox + dx,
                {
                    onFinish: function ()
                              {
                                  element.style.left = ox + xUnit;
                                  self.interpreter.waitCounter -= 1;
                              },
                    duration: duration,
                    easing:   easing
                }
            );
        }

        if (dy !== null)
        {
            if (yUnit === '%')
            {
                oy = element.offsetTop / (stage.offsetHeight / 100);
            }
            else
            {
                oy = element.offsetTop;
            }
            
            self.interpreter.waitCounter += 1;

            fx.transform(
                function (v)
                {
                    element.style.top = v + yUnit;
                },
                oy - dy,
                oy + dy,
                {
                    onFinish: function ()
                              {
                                  element.style.top = oy + yUnit;
                                  self.interpreter.waitCounter -= 1;
                              },
                    duration: duration,
                    easing:   easing
                }
            );
        }

        this.bus.trigger("wse.assets.mixins.shake", this);

        return {
            doNext: true
        };
    };    
}(WSE));

/* global document, WSE */
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
    
    out.assets.mixins.displayable.show = function (command, args)
    {
        var self, duration, wait, effect, direction, ox, oy, prop, xUnit, yUnit;
        var bus, stage, element, isAnimation, easing, easingType, interpreter;
        var offsetWidth, offsetHeight, startX, startY, fx = out.fx;
        var parse = out.tools.getParsedAttribute;

        args = args || {};
        self = this;
        wait = parse(command, "wait", this.interpreter) === "yes" ? true : false;
        duration = parse(command, "duration", this.interpreter, 500);
        effect = parse(command, "effect", this.interpreter, "fade");
        direction = parse(command, "direction", this.interpreter, "right");
        element = args.element || document.getElementById(this.cssid);
        xUnit = this.xUnit || 'px';
        yUnit = this.yUnit || 'px';
        
        console.log("duration:", duration);

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
        easingType = parse(command, "easing", this.interpreter, "sineEaseOut");
        easing = (typeof fx.easing[easingType] !== null) ? 
            fx.easing[easingType] : 
            fx.easing.sineEaseOut;
        isAnimation = args.animation === true ? true : false;

        if (effect === "slide")
        {
            if (xUnit === '%')
            {
                ox = element.offsetLeft / (stage.offsetWidth / 100);
                offsetWidth = 100;
            }
            else
            {
                ox = element.offsetLeft;
                offsetWidth = stage.offsetWidth;
            }
            
            if (yUnit === '%')
            {
                oy = element.offsetTop / (stage.offsetHeight / 100);
                offsetHeight = 100;
            }
            else
            {
                oy = element.offsetTop;
                offsetHeight = stage.offsetHeight;
            }
            
            switch (direction)
            {
                case "left":
                    element.style.left = ox + offsetWidth + xUnit;
                    prop = "left";
                    break;
                case "right":
                    element.style.left = ox - offsetWidth + xUnit;
                    prop = "left";
                    break;
                case "top":
                    element.style.top = oy + offsetHeight + yUnit;
                    prop = "top";
                    break;
                case "bottom":
                    element.style.top = oy - offsetHeight + yUnit;
                    prop = "top";
                    break;
                default:
                    element.style.left = ox - offsetWidth + xUnit;
                    prop = "left";
                    break;
            }
            element.style.opacity = 1;

            if (!isAnimation)
            {
                interpreter.waitCounter += 1;
            }
            
            if (xUnit === '%')
            {
                startX = element.offsetLeft / (stage.offsetWidth / 100);
            } 
            else 
            {
                startX = element.offsetLeft;
            }
            
            if (yUnit === '%')
            {
                startY = element.offsetTop / (stage.offsetHeight / 100);
            } 
            else 
            {
                startY = element.offsetTop;
            }

            fx.transform(
                function (v)
                {
                    element.style[prop] = v + (prop === 'left' ? xUnit : yUnit);
                }, 
                (prop === "left" ? startX : startY), 
                (prop === "left" ? ox : oy),
                {
                    duration: duration,
                    onFinish: !isAnimation ? 
                        function ()
                        {
                            interpreter.waitCounter -= 1;
                        } : 
                        null,
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

            fx.transform(
                function (v)
                {
                    element.style.opacity = v;
                },
                0,
                1,
                {
                    duration: duration,
                    onFinish: !isAnimation ? 
                        function ()
                        {
                            interpreter.waitCounter -= 1;
                        } : 
                        null,
                    easing: easing
                }
            );
        }

        bus.trigger("wse.assets.mixins.show", this);

        return {
            doNext: true
        };
    };
}(WSE));

/* global document, WSE */
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
    
    out.assets.Animation = function (asset, interpreter)
    {
        var groups, i, len, current, transformations, jlen;
        var self, doElements, createTransformFn, loopFn, runDoCommandFn;

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
            this.bus.trigger("wse.interpreter.warning",
            {
                element: asset,
                message: "Animation asset '" + this.name + "' is empty."
            });
            return {
                doNext: true
            };
        }

        createTransformFn = function (as, f, t, pn, u, opt)
        {
            return out.fx.transform(

            function (v)
            {
                as.style[pn] = v + u;
            }, f, t, opt);
        };

        runDoCommandFn = function (del, tim)
        {
            var curDur, curDoEl;

            curDoEl = del;
            curDur = curDoEl.getAttribute("duration");
            //                     console.log("Running do command.");
            interpreter.commands["do"](curDoEl, interpreter,
            {
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
            var dlen; 
            
            dlen = doEls.length;
            jlen = transformations.length;

            self.cbs.push(function ()
            {
                var timers = [], from, to, unit, curTr, curAs, curAsName;
                var dur, propName, j, easingType, opt, di;

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
        
        (function ()
        {
            var fn;
            
            fn = function ()
            {
                self.stop();
            };
            
            self.bus.subscribe(fn, "wse.interpreter.restart");
            self.bus.subscribe(fn, "wse.interpreter.end");
            self.bus.subscribe(fn, "wse.interpreter.load.before");
        }());

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

    out.assets.Animation.prototype.save = function ()
    {
        var obj = {
            assetType: "Animation",
            isRunning: this.isRunning,
            index: this.anim.index
        };
        
        this.bus.trigger(
            "wse.assets.animation.save",
            {
                subject: this,
                saves: obj
            }
        );
        
        return obj;
    };

    out.assets.Animation.prototype.restore = function (obj)
    {
        this.isRunning = obj.isRunning;

        if (this.isRunning === true)
        {
            this.anim.index = obj.index;
            this.start();
        }

        this.bus.trigger(
            "wse.assets.animation.restore",
            {
                subject: this,
                saves: obj
            }
        );
    };
    
}(WSE));

/* global Audio, console, setTimeout, document, window, WSE */
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
     * Constructor for the <audio> asset.
     * 
     * @param asset [XML DOM Element] The asset definition.
     * @param interpreter [object] The interpreter instance.
     * @trigger wse.interpreter.warning@interpreter
     * @trigger wse.assets.audio.constructor@interpreter
     */
    out.assets.Audio = function (asset, interpreter)
    {
        var self, sources, i, len, j, jlen, current, track, trackName;
        var trackFiles, href, type, source, tracks, bus;

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
        this.fadeinDuration = parseInt(asset.getAttribute("fadein")) || 1000;
        this.fadeoutDuration = parseInt(asset.getAttribute("fadeout")) || 1000;
        this.id = out.tools.getUniqueId();
        this.locked = false;

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
            
            return {
                doNext: true
            };
        }

        // check all sources and create <audio> elements:
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
            track.setAttribute("preload", "auto");
            
            if (this.loop)
            {
                track.loop = true;
            }
            
            trackFiles = {};
            trackName = current.getAttribute("title");

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
                            message: "No href defined for source in track '" +
                                trackName + "' in audio element '" + 
                                this.name + "'."
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
                            message: "No type defined for source in track '" + 
                                trackName + "' in audio element '" + 
                                this.name + "'."
                        }
                    );
                    continue;
                }

                trackFiles[type] = href;
            }

            // Progress bar doesn't work... because audio/video get streamed?
            /*
             * this.bus.trigger("wse.assets.loading.increase");
             * out.tools.attachEventListener(track, 'load', function() { self.bus.trigger("wse.assets.loading.decrease"); });*/

            if (
                track.canPlayType("audio/mpeg") &&
                typeof trackFiles.mp3 !== "undefined"
            )
            {
                track.src = trackFiles.mp3;
            }
            else
            {
                if (typeof trackFiles.ogg === "undefined")
                {
                    this.bus.trigger(
                        "wse.interpreter.warning",
                        {
                            element: asset,
                            message: "No usable source found for track '" + 
                                trackName + "' in audio element '" + 
                                this.name + "'."
                        }
                    );
                    continue;
                }
                track.src = trackFiles.ogg;
            }
            
            interpreter.stage.appendChild(track);

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
                interpreter.stage.removeChild(self.current);
            }
            catch (e)
            {
                console.log(e);
            }
            
            dupl.src = src;
            self.current = dupl;
            self.tracks[self.currentIndex] = dupl;
            interpreter.stage.appendChild(dupl);
        };

        /**
         * Starts playing the current track.
         * 
         * @param command [XML DOM Element] The command as written in the WebStory.
         * @return [object] Object that determines the next state of the interpreter.
         */
        this.play = function (command)
        {
            command = command || document.createElement("div");
            var fade = command.getAttribute("fade") === "true" ? true : command.getAttribute("fade") === "false" ? false : this.fade;
            var fadeinDuration = parseInt(command.getAttribute("fadein")) || this.fadeinDuration;

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

            if (self.isPlaying === true)
            {
                self.stop(command);
            }

            self.isPlaying = true;

            if (self.loop === true)
            {
                out.tools.attachEventListener(
                    self.current, 
                    'ended', 
                    function ()
                    {
                        self.renewCurrent();
                        setTimeout(
                            function ()
                            {
                                self.play();
                            }, 
                            0
                        );
                    }
                );
            }
            else
            {
                out.tools.attachEventListener(
                    self.current, 
                    'ended', 
                    function ()
                    {
                        self.isPlaying = false;
                    }
                );
            }

            if (fade === true)
            {
                //console.log("Starting audio asset with fade in " + fadeinDuration + "msec");
                self.current.volume = 0.0001;
                self.current.play();
                self.fadeIn(fadeinDuration);
            }
            else
            {
                //console.log("Starting audio asset without fade");
                self.current.play();
            }

            this.bus.trigger("wse.assets.audio.play", this);

            return {
                doNext: true
            };
        };

        /**
         * Stops playing the current track.
         * 
         * @param command [XML DOM Element] The command as written in the WebStory.
         * @return [object] Object that determines the next state of the interpreter.
         */
        this.stop = function (command)
        {
            command = command || document.createElement("div");
            var fade = command.getAttribute("fade") === "true" ? true : command.getAttribute("fade") === "false" ? false : self.fade;
            var fadeoutDuration = parseInt(command.getAttribute("fadeout")) || self.fadeoutDuration;

            if (self.current === null)
            {
                this.bus.trigger(
                    "wse.interpreter.warning",
                    {
                        element: asset,
                        message: "No track set for audio element '" + 
                            this.name + "'."
                    }
                );
                
                return {
                    doNext: true
                };
            }
            
            if (fade === true)
            {
                //console.log("Stopping audio asset with fade in " + fadeoutDuration + "msec");
                self.fadeOut(
                    fadeoutDuration,
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
                //console.log("Stopping audio asset without fade");
                self.current.pause();
                self.currentTime = 0.1;
                self.renewCurrent();
                self.isPlaying = false;
            }
            
            this.bus.trigger("wse.assets.audio.stop", this);
            
            return {
                doNext: true
            };
        };

        /**
         * Pauses playing the curren track.
         * 
         * @return [object] Object that determines the next state of the interpreter.
         */
        this.pause = function ()
        {
            this.current.pause();
            
            return {
                doNext: true
            };
        };

        this.fadeIn = function (duration)
        {
            var fn;
            
            fn = function ()
            {
                if ( self.locked === false )
                {
                    //console.log("fadeIn timer callback is called");
                    var newVolume = self.current.volume + 1.0 * 10 / duration;
                    self.current.volume = newVolume < 1.0 ? newVolume : 1.0;
                }
                if (self.current.volume < 1.0)
                {
                    setTimeout(fn, 10);
                }
            };
            
            setTimeout(fn, 10);
            
            return {
                doNext: true
            };
        };

        this.fadeOut = function (duration, cb)
        {
            var fn;
            cb = typeof cb === "function" ? cb : function () {};

            fn = function ()
            {
                //console.log("fadeOut timer callback is called");

                var newVolume = self.current.volume - 1.0 * 10 / duration;
                self.current.volume = newVolume > 0.0 ? newVolume : 0.0;
                if (self.current.volume > 0.0)
                {
                    self.locked = true;
                    setTimeout(fn, 10);
                }
                else
                {
                    self.locked = false;
                    cb();
                }
            };

            setTimeout(fn, 10);
            
            return {
                doNext: true
            };
        };

        if (this.autopause === false)
        {
            //console.log("autopause is false");
            return;
        }

        out.tools.attachEventListener(
            window, 
            'blur', 
            function ()
            {
                //console.log("onblur function for audio called");
                if (self.isPlaying === true)
                {
                    self.fadeOut(
                        1000,
                        function ()
                        {
                            self.current.pause();
                        }
                    );
                }
            }
        );

        out.tools.attachEventListener(
            window, 
            'focus', 
            function ()
            {
                //console.log("onfocus function for audio called");
                if (self.isPlaying === true)
                {
                    self.current.play();
                    self.fadeIn(1000);
                }
            }
        );

        this.bus.trigger("wse.assets.audio.constructor", this);
    };

    /**
     * Changes the currently active track.
     * 
     * @param command [DOM Element] The command as specified in the WebStory.
     * @trigger wse.interpreter.warning@interpreter
     * @trigger wse.assets.audio.set@interpreter
     */
    out.assets.Audio.prototype.set = function (command)
    {
        var name, wasPlaying, self;
        var fade = command.getAttribute("fade") === "true" ? true : command.getAttribute("fade") === "false" ? false : this.fade;
        var fadeoutDuration = parseInt(command.getAttribute("fadeout")) || this.fadeoutDuration;

        self = this;
        name = command.getAttribute("track");
        wasPlaying = this.isPlaying;

        if (typeof this.tracks[name] === "undefined" || this.tracks[name] === null)
        {
            this.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Unknown track '" + name + "' in audio element '" + this.name + "'."
                }
            );
            
            return {
                doNext: true
            };
        }

        if (wasPlaying === true && fade == true)
        {
            self.fadeOut(
                fadeoutDuration,
                function ()
                {
                    self.current.pause();
                    self.currentTime = 0.1;
                    self.renewCurrent();
                    self.isPlaying = false;
                    self.currentIndex = name;
                    self.current = self.tracks[name];
                    self.play(command);
                }
            );
        }
        else
        {
            if (wasPlaying === true)
            {
                this.stop(command);
            }
            
            this.currentIndex = name;
            this.current = this.tracks[name];

            if (wasPlaying === true)
            {
                this.play(command);
            }
        }
        
        this.bus.trigger("wse.assets.audio.set", this);
        
        return {
            doNext: true
        };
    };

    /**
     * Gathers the data to put into a savegame.
     * 
     * @param obj [object] The savegame object.
     */
    out.assets.Audio.prototype.save = function ()
    {
        var obj = {
            assetType: "Audio",
            isPlaying: this.isPlaying,
            fade: this.fade,
            fadeinDuration: this.fadeinDuration,
            fadeoutDuration: this.fadeoutDuration,
            currentIndex: this.currentIndex,
            currentTime: 0
        };
        
        if (this.isPlaying)
        {
            obj.currentTime = this.current.currentTime;
        }
        
        this.bus.trigger("wse.assets.audio.save", this);
        
        return obj;
    };

    /**
     * Restore function for loading the state from a savegame.
     * 
     * @param obj [object] The savegame data.
     * @trigger wse.assets.audio.restore@interpreter
     */
    out.assets.Audio.prototype.restore = function (vals)
    {
        this.isPlaying = vals.isPlaying;
        this.fade = vals.fade;
        this.fadeinDuration = vals.fadeinDuration;
        this.fadeoutDuration = vals.fadeoutDuration;
        this.currentIndex = vals.currentIndex;
        
        if (this.tracks[this.currentIndex]) 
        {
            this.current = this.tracks[this.currentIndex];
            this.current.currentTime = vals.currentTime;
        }

        this.locked = false;
        
        if (this.isPlaying)
        {
            this.fade = false;
            this.play();
            this.fade = vals.fade;
        }
        else
        {
            this.stop();
        }
        
        this.bus.trigger("wse.assets.audio.restore", this);
    };

}(WSE));

/* global WSE */
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
    
    out.assets.Character = function (asset, interpreter)
    {
        this.asset = asset;
        this.stage = interpreter.stage;
        this.bus = interpreter.bus;
        this.id = out.tools.getUniqueId();
        this.name = asset.getAttribute('name');
        this.bus.trigger("wse.assets.character.constructor", this);
    };

    out.assets.Character.prototype.setTextbox = function (command)
    {
        this.asset.setAttribute("textbox", command.getAttribute("textbox"));
        this.bus.trigger("wse.assets.character.settextbox", this);
    };

    out.assets.Character.prototype.save = function ()
    {
        var obj = {
            assetType: "Character",
            textboxName: this.asset.getAttribute("textbox")
        };
        
        this.bus.trigger(
            "wse.assets.character.save",
            {
                subject: this,
                saves: obj
            }
        );
        
        return obj;
    };

    out.assets.Character.prototype.restore = function (obj)
    {
        this.asset.setAttribute("textbox", obj.textboxName);
        this.bus.trigger(
            "wse.assets.character.restore",
            {
                subject: this,
                saves: obj
            }
        );
    };
}(WSE));

/* global document, WSE */
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
        this.name = asset.getAttribute('name');

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
        out.tools.applyAssetUnits(this, asset);

        this.stage.appendChild(this.element);
    };

    out.assets.Curtain.prototype.set = function (asset)
    {
        this.color = asset.getAttribute("color") || "black";
        this.element.style.backgroundColor = this.color;
    };

    out.tools.mixin(out.assets.mixins.displayable, out.assets.Curtain.prototype);

    out.assets.Curtain.prototype.save = function ()
    {
        return {
            color: this.color,
            cssid: this.cssid,
            z: this.z
        };
    };

    out.assets.Curtain.prototype.restore = function (obj)
    {
        this.color = obj.color;
        this.cssid = obj.cssid;
        this.z = obj.z;
        
        try
        {
            this.element = document.getElementById(this.cssid);
        }
        catch (e)
        {
            this.bus.trigger(
                "wse.interpreter.warning",
                {
                    message: "Element with CSS ID '" + this.cssid + "' could not be found."
                }
            );
            
            return;
        }
        
        this.element.style.backgroundColor = this.color;
        this.element.style.zIndex = this.z;
    };
    
}(WSE));

/* global console, Image, WSE */
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

/* global document, Image, console, WSE */

(function (out)
{
    "use strict";
    
    /**
     * Constructor function for ImagePacks.
     * 
     * @param asset [DOM Element] The asset definition.
     * @param interpreter [WSE.Interpreter] The interpreter object.
     */
    out.assets.Imagepack = function (asset, interpreter)
    {
        var element, images, children, i, len, current, name;
        var src, image, self, triggerDecreaseFn, width, height, x, y, xUnit, yUnit;

        this.stage = interpreter.stage;
        this.bus = interpreter.bus;
        this.name = asset.getAttribute("name");
        this.id = out.tools.getUniqueId();
        this.cssid = asset.getAttribute("cssid") || "wse_imagepack_" + this.name;
        this.interpreter = interpreter;
        this.xAnchor = asset.getAttribute("xAnchor");
        this.yAnchor = asset.getAttribute("yAnchor");
        this.width = parseInt(asset.getAttribute("width"), 10) || 100;
        this.height = parseInt(asset.getAttribute("height"), 10) || 100;
        
        out.tools.applyAssetUnits(this, asset);

        self = this;
        images = {};
        element = document.createElement("div");
        width = asset.getAttribute('width');
        height = asset.getAttribute('height');

        element.style.opacity = 0;
        element.draggable = false;

        element.setAttribute("class", "imagepack");
        element.setAttribute("id", this.cssid);
        
        element.setAttribute("data-wse-asset-name", this.name);

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
                this.bus.trigger(
                    "wse.interpreter.warning",
                    {
                        element: asset,
                        message: "Image without name in imagepack '" + 
                            this.name + "'."
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
                        message: "Image without src in imagepack '" + 
                            this.name + "'."
                    }
                );
                continue;
            }

            image = new Image();

            this.bus.trigger("wse.assets.loading.increase");
            out.tools.attachEventListener(image, 'load', triggerDecreaseFn);

            image.src = src;
            image.style.opacity = 0;
            image.style.position = "absolute";
            image.draggable = false;
            
            image.setAttribute("data-wse-asset-image-name", name);
            
            if (width !== null)
            {
                image.setAttribute('width', width);
            }
            
            if (height !== null)
            {
                image.setAttribute('height', height);
            }

            images[name] = this.cssid + "_" + name;
            image.setAttribute("id", images[name]);
            
            element.appendChild(image);
        }

        element.style.position = "absolute";
        element.style.zIndex = asset.getAttribute("z") || 0;
        
        this.stage.appendChild(element);
        
        x = parseInt(asset.getAttribute("x") || 0, 10);
        y = parseInt(asset.getAttribute("y") || 0, 10);
        xUnit = out.tools.extractUnit(asset.getAttribute("x")) || "px";
        yUnit = out.tools.extractUnit(asset.getAttribute("y")) || "px";
        
        if (xUnit === "%") {
            x = (this.stage.offsetWidth / 100) * x;
        }
        
        if (yUnit === "%") {
            y = (this.stage.offsetHeight / 100) * y;
        }
        
        x = out.tools.calculateValueWithAnchor(x, this.xAnchor, this.width);
        y = out.tools.calculateValueWithAnchor(y, this.yAnchor, this.height);
        
        if (xUnit === "%") {
            x = x / (this.stage.offsetWidth / 100);
        }
        
        if (yUnit === "%") {
            y = y / (this.stage.offsetHeight / 100);
        }
        
        element.style.left = "" + x + xUnit;
        element.style.top = "" + y + yUnit;

        this.images = images;
        this.current = null;


        this.bus.trigger("wse.assets.imagepack.constructor", this);
    };

    out.tools.mixin(out.assets.mixins.displayable, out.assets.Imagepack.prototype);

    out.assets.Imagepack.prototype.set = function (command, args)
    {
        var image, name, self, old, duration, isAnimation, bus = this.bus, element;

        args = args || {};
        self = this;
        name = command.getAttribute("image");
        duration = command.getAttribute("duration") || 400;
        isAnimation = args.animation === true ? true : false;

        if (name === null)
        {
            bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Missing attribute 'image' on 'do' element " +
                        "referencing imagepack '" + this.name + "'."
                }
            );
            
            return {
                doNext: true
            };
        }

        try {
            image = document.getElementById(this.images[name]);
        }
        catch (e) {
            console.error("DOM Element for Image " + name + " on Imagepack " + this.name + " not found!", e);
        }

        if (typeof image === "undefined" || image === null)
        {
            bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Unknown image name on 'do' element referencing " +
                        "imagepack '" + this.name + "'."
                }
            );
            
            return {
                doNext: true
            };
        }

        old = this.current;

        for (var key in this.images)
        {
            if (this.images.hasOwnProperty(key))
            {
                if (key !== name)
                {
                    continue;
                }
                
                if (key === old)
                {
                    bus.trigger(
                        "wse.interpreter.warning",
                        {
                            element: command,
                            message: "Trying to set the image that is " +
                                "already set on imagepack '" + this.name + "'."
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
        
        element = document.getElementById(this.cssid);
        element.style.width = image.offsetWidth + "px";
        element.style.height = image.offsetHeight + "px";
        
        (function ()
        {
            var valFn, finishFn, options;
            
            valFn = function (v)
            {
                image.style.opacity = v;
            };
            
            finishFn = function ()
            {
                if (!isAnimation)
                {
                    self.interpreter.waitCounter -= 1;
                }
            };
            
            options = {
                duration: duration,
                easing: out.fx.easing.easeOutCubic,
                onFinish: finishFn
            };
            
            out.fx.transform(valFn, 0, 1, options);
        }());

        if (this.current !== null)
        {
            if (!isAnimation)
            {
                self.interpreter.waitCounter += 1;
            }
            
            (function ()
            {
                var timeoutFn;
                
                timeoutFn = function()
                {
                    var oldEl, valFn, finishFn, options; 
                    
                    oldEl = document.getElementById(self.images[old]);
                    
                    valFn = function (v)
                    {
                        oldEl.style.opacity = v;
                    };
                    
                    finishFn = function ()
                    {
                        if (!isAnimation)
                        {
                            self.interpreter.waitCounter -= 1;
                        }
                    };
                    
                    options = {
                        duration: duration,
                        easing: out.fx.easing.easeInCubic,
                        onFinish: finishFn
                    };
                    
                    out.fx.transform(valFn, 1, 0, options);
                };
                
                timeoutFn();
            }());
        }

        this.current = name;

        return {
            doNext: true
        };
    };

    out.assets.Imagepack.prototype.save = function ()
    {
        var cur, key, images, name, obj;
        
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

        obj = {
            assetType: "Imagepack",
            current: cur,
            cssid: this.cssid,
            images: images,
            xAnchor: this.xAnchor,
            yAnchor: this.yAnchor,
            z: this.z
        };
        
        this.bus.trigger(
            "wse.assets.imagepack.save",
            {
                subject: this,
                saves: obj
            }
        );
        
        return obj;
    };

    out.assets.Imagepack.prototype.restore = function (save)
    {
        var name;
        
        name = save.current;
        this.cssid = save.cssid;
        this.z = save.z;
        this.current = name;
        this.xAnchor = save.xAnchor;
        this.yAnchor = save.yAnchor;

        document.getElementById(this.cssid).style.zIndex = this.z;

        this.bus.trigger(
            "wse.assets.imagepack.restore",
            {
                subject: this,
                saves: save
            }
        );
    };
}(WSE));

/* global XMLSerializer, document, setTimeout, WSE */
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
        this.showNames = asset.getAttribute("namebox") === "yes" ? true : false;
        this.nltobr = asset.getAttribute("nltobr") === "true" ? true : false;
        this.id = out.tools.getUniqueId();
        this.cssid = "wse_textbox_" + this.name;
        this.effectType = asset.getAttribute("effect") || "typewriter";
        this.speed = asset.getAttribute("speed") || 0;
        this.speed = parseInt(this.speed, 10);
        this.fadeDuration = asset.getAttribute("fadeDuration") || 0;
        
        out.tools.applyAssetUnits(this, asset);

        (function (ctx)
        {
            var el, i, len, elms;
            
            try 
            {
                elms = asset.childNodes;
                
                for (i = 0, len = elms.length; i < len; i += 1)
                {
                    if (elms[i].nodeType === 1 && elms[i].tagName === 'nameTemplate')
                    {
                        el = elms[i];
                        break;
                    }
                }
                
                if (!el)
                {
                    throw new Error('No nameTemplate found.');
                }
                
                ctx.nameTemplate = new XMLSerializer().serializeToString(el);
            }
            catch (e) 
            {
                ctx.nameTemplate = '{name}: ';
            }
        }(this));
        
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
        height = asset.getAttribute("height");
        
        if (width)
        {
            element.style.width = width;
        }
        
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

    out.tools.mixin(out.assets.mixins.displayable, out.assets.Textbox.prototype);

    out.assets.Textbox.prototype.put = function (text, name)
    {
        var textElement, nameElement, namePart, self;
        
        name = name || null;

        self = this;
        textElement = document.getElementById(this.textElement);
        nameElement = document.getElementById(this.nameElement);

        text = out.tools.replaceVariables(text, this.interpreter);
        //text = out.tools.textToHtml(text, this.nltobr);

        self.interpreter.waitCounter += 1;

        namePart = "";
        if (this.showNames === false && !(!name))
        {
            namePart = this.nameTemplate.replace(/\{name\}/g, name);
        }

        if (name === null)
        {
            name = "";
        }

        if (this.speed < 1)
        {
            if (this.fadeDuration > 0) {
                self.interpreter.waitCounter += 1;
            
                (function ()
                {
                    var valFn, finishFn, options;
                    
                    valFn = function (v)
                    {
                        textElement.style.opacity = v;
                    };
                    
                    finishFn = function ()
                    {
                        self.interpreter.waitCounter -= 1;
                    };
                    
                    options = {
                        duration: self.fadeDuration,
                        onFinish: finishFn
                    };
                    
                    out.fx.transform(valFn, 1, 0, options);
                }());
            }
            else {
                putText();
            }
        }

        if (this.speed > 0)
        {
            if (self.type === 'adv')
            {
                textElement.innerHTML = "";
            }
            
            (function ()
            {
                var container;
                
                container = document.createElement('div');
                container.setAttribute('class', 'line');
                textElement.appendChild(container);
                container.innerHTML = namePart + text;
                nameElement.innerHTML = self.nameTemplate.replace(/\{name\}/g, name);
                self.interpreter.waitCounter += 1;
                
                out.fx.dom.effects.typewriter(
                    container, 
                    { 
                        speed: self.speed, 
                        onFinish: function () 
                        { 
                            self.interpreter.waitCounter -= 1; 
                        }
                    }
                );
            }());
        }
        else if (this.fadeDuration > 0)
        {
            self.interpreter.waitCounter += 1;
            
            setTimeout(
                function ()
                {
            
                    putText();
                    
                    if (self.type === 'nvl')
                    {
                        textElement.innerHTML = '<div>' + textElement.innerHTML + '</div>';
                    }
                    
                    out.fx.transform(
                        function (v)
                        {
                            textElement.style.opacity = v;
                        },
                        0,
                        1,
                        {
                            duration: self.fadeDuration,
                            onFinish: function ()
                            {
                                self.interpreter.waitCounter -= 1;
                            }
                        }
                    );
                },
                self.fadeDuration
            );
        }

        this.bus.trigger("wse.assets.textbox.put", this, false);
        self.interpreter.waitCounter -= 1;

        return {
            doNext: false
        };
        
        function putText () {

            if (self.type === 'adv')
            {
                textElement.innerHTML = "";
            }
            
            textElement.innerHTML += namePart + text;
            nameElement.innerHTML = self.nameTemplate.replace(/\{name\}/g, name);
        }
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

    out.assets.Textbox.prototype.save = function ()
    {
        return {
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

    out.assets.Textbox.prototype.restore = function (save)
    {
        this.type = save.type;
        this.showNames = save.showNames;
        this.nltobr = save.nltobr;
        this.cssid = save.cssid;
        this.nameElement = save.nameElement;
        this.textElement = save.textElement;
        this.z = save.z;

        document.getElementById(this.cssid).style.zIndex = this.z;
    };    
}(WSE));

/* global document, window, WSE */
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
(function (engine)
{
    "use strict";
    
    function resize (self)
    {
        self.element.setAttribute("width", self.stage.offsetWidth);
        self.element.setAttribute("height", self.stage.offsetHeight);
    }
    
    function styleElement (self)
    {
        var s = self.element.style;
        
        self.element.setAttribute("id", self.cssid);
        self.element.setAttribute("class", "WSEBackground");
        self.element.style.position = "absolute";
        self.element.draggable = false;
        s.left = 0;
        s.top = 0;
        s.opacity = 0;
        s.zIndex = self.z;
    }
    
    engine.assets.Background = function (asset, interpreter)
    {
        var self = this;
        
        this.asset = asset;
        this.interpreter = interpreter;
        this.bus = interpreter.bus;
        this.stage = interpreter.stage;
        this.z = asset.getAttribute("z") || 10;
        this.id = engine.tools.getUniqueId();
        this.cssid = "WSEBackground_" + this.id;
        this.element = document.createElement("img");
        this.src = asset.getAttribute('src');
        this.name = asset.getAttribute('name');
        
        if (!this.src)
        {
            this.bus.trigger(
                'wse.interpreter.warning',
                {
                    element: asset,
                    message: 'No source defined on background asset.'
                }
            );
            
            return;
        }
        
        engine.tools.applyAssetUnits(this, asset);
        this.element.setAttribute('src', this.src);
        styleElement(this);
        resize(this);
        window.addEventListener('resize', function () { resize(self); });

        this.stage.appendChild(this.element);
    };

    engine.tools.mixin(engine.assets.mixins.displayable, engine.assets.Background.prototype);

    engine.assets.Background.prototype.save = function ()
    {
        return {
            cssid: this.cssid,
            z: this.z
        };
    };

    engine.assets.Background.prototype.restore = function (obj)
    {
        this.cssid = obj.cssid;
        this.z = obj.z;
        
        try
        {
            this.element = document.getElementById(this.cssid);
        }
        catch (e)
        {
            this.bus.trigger(
                "wse.interpreter.warning",
                {
                    message: "Element with CSS ID '" + this.cssid + 
                        "' could not be found."
                }
            );
            
            return;
        }
    };
    
}(WSE));

/* global WSE */
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
    
    out.commands["break"] = function (command, interpreter)
    {
        interpreter.bus.trigger(
            "wse.interpreter.commands.break",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );
        //         interpreter.game.subscribeListeners();
        
        return {
            doNext: false,
            wait: true
        };
    };
    
}(WSE));

/* global setTimeout, document, WSE */
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
    
    out.commands.choice = function (command, interpreter)
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
                            interpreter.runCommand(cmds[i]);
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

        out.assets.mixins.displayable.show(
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

/* global WSE */
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
    
    out.commands["do"] = function (command, interpreter, args)
    {
        var assetName, action, isAnimation, bus = interpreter.bus, assets = interpreter.assets;
        
        args = args || {};

        bus.trigger(
            "wse.interpreter.commands.do",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );

        assetName = command.getAttribute("asset");
        action = command.getAttribute("action");
        isAnimation = args.animation || false;

        if (assetName === null)
        {
            bus.trigger(
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
            bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Element of type 'do' must have an attribute 'action'. Element ignored."
                }
            );
            
            return;
        }

        if (typeof assets[assetName] === "undefined" || assets[assetName] === null)
        {
            bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Reference to unknown asset '" + assetName + "'."
                }
            );
            
            return {
                doNext: true
            };
        }

        if (typeof assets[assetName][action] === "undefined")
        {
            bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Action '" + action + "' is not defined for asset '" + assetName + "'."
                }
            );
            
            return {
                doNext: true
            };
        }

        return assets[assetName][action](command, args);
    };    
}(WSE));

/* global WSE */
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
    
    out.commands.fn = function (command, interpreter)
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
            
            return {
                doNext: true
            };
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
            
            return {
                doNext: true
            };
        }

        ret = out.functions[name](interpreter);

        if (varName !== null)
        {
            interpreter.runVars[varName] = "" + ret;
        }

        return {
            doNext: true
        };
    };
}(WSE));

/* global WSE */
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
    
    out.commands.global = function (command, interpreter)
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
            
            return {
                doNext: true
            };
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
            
            return {
                doNext: true
            };
        }

        interpreter.globalVars.set(name, value);

        return {
            doNext: true
        };
    };    
}(WSE));

/* global WSE */
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
    
    out.commands.globalize = function (command, interpreter)
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
            
            return {
                doNext: true
            };
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
            
            return {
                doNext: true
            };
        }

        interpreter.globalVars.set(key, interpreter.runVars[key]);

        return {
            doNext: true
        };
    };    
}(WSE));

/* global WSE */
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
    
    out.commands.goto = function (command, interpreter)
    {
        var scene, sceneName, i, len, current, bus = interpreter.bus;

        bus.trigger(
            "wse.interpreter.commands.goto",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );

        sceneName = command.getAttribute("scene");

        if (sceneName === null)
        {
            bus.trigger(
                "wse.interpreter.error",
                {
                    message: "Element 'goto' misses attribute 'scene'."
                }
            );
        }

        sceneName = out.tools.replaceVariables(sceneName, interpreter);

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
            bus.trigger(
                "wse.interpreter.error",
                {
                    message: "Unknown scene '" + sceneName + "'."
                }
            );
            
            return;
        }

        return {
            changeScene: scene
        };
    };    
}(WSE));

/* global XMLSerializer, WSE */
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
    
    out.commands.line = function (command, interpreter)
    {
        var speakerId, speakerName, textboxName, i, len, current;
        var assetElements, text, doNext, bus = interpreter.bus;

        bus.trigger(
            "wse.interpreter.commands.line",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );

        speakerId = command.getAttribute("s");
        doNext = command.getAttribute("stop") === "false" ? true : false;

        if (speakerId === null)
        {
            bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Element 'line' requires attribute 's'."
                }
            );
            
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
                    bus.trigger(
                        "wse.interpreter.warning",
                        {
                            element: command,
                            message: "No textbox defined for character '" + speakerId + "'."
                        }
                    );
                    
                    return {
                        doNext: true
                    };
                }
                
                try
                {
                    speakerName = current.getElementsByTagName("displayname")[0].childNodes[0].nodeValue;
                }
                catch (e) {}
                
                break;
            }
        }

        if (typeof interpreter.assets[textboxName] === "undefined")
        {
            bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Trying to use an unknown textbox or character."
                }
            );
            
            return {
                doNext: true
            };
        }

        //text = new XMLSerializer().serializeToString(command);//command.childNodes[0].nodeValue;
        
        (function ()
        {
            var ser = new XMLSerializer(), nodes = command.childNodes, i, len;
            
            text = '';
            
            for (i = 0, len = nodes.length; i < len; i += 1)
            {
                text += ser.serializeToString(nodes[i]);
            }
        }());
        
        interpreter.log.push({speaker: speakerId, text: text});
        interpreter.assets[textboxName].put(text, speakerName);
        
        return {
            doNext: doNext,
            wait: true
        };
    };    
}(WSE));

/* global WSE */
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
    
    out.commands.localize = function (command, interpreter)
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
            
            return {
                doNext: true
            };
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
            
            return {
                doNext: true
            };
        }

        interpreter.runVars[key] = interpreter.globalVars.get(key);

        return {
            doNext: true
        };
    };    
}(WSE));

/* global WSE */
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
    
    out.commands.restart = function (command, interpreter)
    {
        interpreter.bus.trigger(
            "wse.interpreter.commands.restart",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );

        interpreter.bus.trigger("wse.interpreter.message", "Restarting game...", false);
        interpreter.bus.trigger("wse.interpreter.restart", interpreter, false);

        interpreter.runVars = {};
        interpreter.log = [];
        interpreter.visitedScenes = [];
        interpreter.startTime = Math.round(+new Date() / 1000);
        interpreter.waitCounter = 0;
        interpreter.state = "listen";
        interpreter.stage.innerHTML = "";

        interpreter.assets = {};
        interpreter.buildAssets();

        return {
            doNext: true,
            changeScene: interpreter.scenes[0]
        };
    };
}(WSE));

/* global WSE */
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
    
    out.commands.sub = function (command, interpreter)
    {
        var sceneId, scene, doNext;

        interpreter.bus.trigger(
            "wse.interpreter.commands.sub",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );

        sceneId = command.getAttribute("scene") || null;
        doNext = command.getAttribute("next") === false ? false : true;

        //console.log("doNext in .sub() is: ", doNext);

        if (sceneId === null)
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Missing 'scene' attribute on 'sub' command!"
                }
            );
            
            return {
                doNext: true
            };
        }

        sceneId = out.tools.replaceVariables(sceneId, interpreter);
        scene = interpreter.getSceneById(sceneId);
        
        if (!scene) {
            
            interpreter.bus.trigger("wse.interpreter.error", {
                message: "No such scene '" + sceneId + "'!",
                command: command
            });
            
            return {doNext: true};
        }

        interpreter.bus.trigger(
            "wse.interpreter.message", 
            "Entering sub scene '" + sceneId + "'...",
            false
        );

        interpreter.pushToCallStack();

        interpreter.currentCommands = scene.childNodes;
        interpreter.index = -1;
        interpreter.sceneId = sceneId;
        interpreter.currentElement = -1;
        
        if (command.getAttribute("names")) {
            out.commands.set_vars(command, interpreter);
        }

        return {
            doNext: doNext
        };
    };
}(WSE));

/* global WSE */
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
    
    out.commands.trigger = function (command, interpreter)
    {
        var triggerName, action;

        interpreter.bus.trigger(
            "wse.interpreter.commands.trigger",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );

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
            
            return {
                doNext: true
            };
        }

        if (action === null)
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "No action specified on trigger command " +
                        "referencing trigger '" + triggerName + "'."
                }
            );
            
            return {
                doNext: true
            };
        }

        if (
            typeof interpreter.triggers[triggerName] === "undefined" ||
            interpreter.triggers[triggerName] === null
        )
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Reference to unknown trigger '" + triggerName + "'."
                }
            );
            
            return {
                doNext: true
            };
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
            
            return {
                doNext: true
            };
        }

        interpreter.triggers[triggerName][action](command);

        return {
            doNext: true
        };
    };    
}(WSE));

/* global WSE */
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
    
    out.commands["var"] = function (command, interpreter)
    {
        var key, val, lval, action, container;

        interpreter.bus.trigger(
            "wse.interpreter.commands.var",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );

        key = command.getAttribute("name") || null;
        val = command.getAttribute("value") || "1";
        action = command.getAttribute("action") || "set";

        if (key === null)
        {
            interpreter.bus.trigger("wse.interpreter.warning",
            {
                element: command,
                message: "Command 'var' must have a 'name' attribute."
            });
            return {
                doNext: true
            };
        }

        container = interpreter.runVars;

        if (action !== "set" && !(key in container || command.getAttribute("lvalue")))
        {
            interpreter.bus.trigger("wse.interpreter.warning",
            {
                element: command,
                message: "Undefined variable."
            });
            return {
                doNext: true
            };
        }

        if (action === "set")
        {
            container[key] = "" + val;
            return {
                doNext: true
            };
        }

        lval = command.getAttribute("lvalue") || container[key];
        lval = out.tools.replaceVariables(lval, interpreter);
        val  = out.tools.replaceVariables(val,  interpreter);

        switch (action)
        {
        case "delete":
            delete container[key];
            break;

        case "increase":
            container[key] = "" + (parseFloat(lval) + parseFloat(val));
            break;
        case "decrease":
            container[key] = "" + (parseFloat(lval) - parseFloat(val));
            break;
        case "multiply":
            container[key] = "" + (parseFloat(lval) * parseFloat(val));
            break;
        case "divide":
            container[key] = "" + (parseFloat(lval) / parseFloat(val));
            break;
        case "modulus":
            container[key] = "" + (parseFloat(lval) % parseFloat(val));
            break;

        case "and":
            container[key] = "" + (parseFloat(lval) && parseFloat(val));
            break;
        case "or":
            container[key] = "" + (parseFloat(lval) || parseFloat(val));
            break;
        case "not":
            container[key] = parseFloat(lval) ? "0" : "1";
            break;

        case "is_greater":
            container[key] = parseFloat(lval) > parseFloat(val) ? "1" : "0";
            break;
        case "is_less":
            container[key] = parseFloat(lval) < parseFloat(val) ? "1" : "0";
            break;
        case "is_equal":
            container[key] = parseFloat(lval) === parseFloat(val) ? "1" : "0";
            break;
        case "not_greater":
            container[key] = parseFloat(lval) <= parseFloat(val) ? "1" : "0";
            break;
        case "not_less":
            container[key] = parseFloat(lval) >= parseFloat(val) ? "1" : "0";
            break;
        case "not_equal":
            container[key] = parseFloat(lval) !== parseFloat(val) ? "1" : "0";
            break;

        case "print":
            interpreter.bus.trigger("wse.interpreter.message", "Variable '" + key + "' is: " + container[key]);
            break;
        default:
            interpreter.bus.trigger("wse.interpreter.warning",
            {
                element: command,
                message: "Unknown action '" + action + "' defined on 'var' command."
            });
        }

        return {
            doNext: true
        };
    };    
}(WSE));

/* global WSE */
/*
    Copyright (c) 2012 - 2014 The WebStory Engine Contributors
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
    
    out.commands.set_vars = function (command, interpreter)
    {
        var container = interpreter.runVars, keys, values;
        
        keys = (command.getAttribute("names") || "").split(",");
        values = (command.getAttribute("values") || "").split(",");
        
        if (keys.length !== values.length) {
            
            interpreter.bus.trigger("wse.interpreter.error", {
                message: "Number of names does not match number of values in <set_vars> command."
            });

            return {
                doNext: true
            };
        }
        
        keys.forEach(function (key, i) {
            container[key.trim()] = "" + values[i].trim();
        });
        
        return {
            doNext: true
        };
    };
}(WSE));

/* global setTimeout, WSE */
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
    
    out.commands.wait = function (command, interpreter)
    {
        var duration, self;

        interpreter.bus.trigger(
            "wse.interpreter.commands.wait",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );

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
                }, 
                duration
            );
            
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
}(WSE));

/* global WSE */
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
    
    out.commands["with"] = function (command, interpreter)
    {
        var container = interpreter.runVars;
        var whens = [].slice.call(command.children).filter(function (child) {
            if (child.tagName && child.tagName === "when") {
                
                return true;
            }
        });
        var variableName = out.tools.getParsedAttribute(command, "var", interpreter);
        var i, numberOfWhens = whens.length, currentWhen;
        
        for (i = 0; i < numberOfWhens; i += 1) {
            
            currentWhen = whens[i];
            
            if (currentWhen.hasAttribute("is") &&
                    out.tools.getParsedAttribute(currentWhen, "is") === container[variableName]) {
                
                out.functions.execute(interpreter, currentWhen);
                
                break;
            }
            else {
                interpreter.bus.trigger("wse.interpreter.warning", {
                    message: "Element 'when' without a condition. Ignored.", command: command
                });
            }
        }
        
        return {
            doNext: true
        };
    };
}(WSE));
