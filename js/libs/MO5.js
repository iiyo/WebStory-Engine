/**

    MO5.js - Javascript library for canvas and DOM animation and effects
    ====================================================================

        Copyright (c) 2012 The MO5.js contributors.
        

        License
        -------

            Redistribution and use in source and binary forms, with or without
            modification, are permitted provided that the following conditions 
            are met:
            
            * Redistributions of source code must retain the above copyright
              notice, this list of conditions and the following disclaimer.

            * Redistributions in binary form must reproduce the above copyright
              notice, this list of conditions and the following disclaimer in 
              the documentation and/or other materials provided with the 
              distribution.

            * Neither the name of the project nor the names of its contributors 
              may be used to endorse or promote products derived from this 
              software without specific prior written permission.

            THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 
            "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT 
            LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS 
            FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE 
            COPYRIGHT HOLDERS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, 
            SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT 
            LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF 
            USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
            ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, 
            OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT 
            OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY 
            OF SUCH DAMAGE.

            
        Authors
        -------

            * Jonathan Steinbeck <jonathan@steinbeck.in>
        
        
        Dependencies
        ------------
        
            * Squiddle.js

            
*/

// Use a mock console object when the browser doesn't support the console API.
var console = console || {log: function(){}};

// If the browser doesn't support requestAnimationFrame, use a fallback.
window.requestAnimationFrame = (
    function()
    {
        return  window.requestAnimationFrame   || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function( callback )
            {
                window.setTimeout(callback, 1000 / 60);
            };
    }
)();

/**

    [Object] MO5
    ============
    
        The main (and only) global object of the project. Used as a
        namespace.
        

*/
var MO5 = {};
MO5.timers = {};
MO5.highestId = 0;

MO5.bus = new Squiddle();

/**
    
    [Function] MO5.getUniqueId
    =======================

        Returns a unique ID for MO5 objects.

    
        Return value
        ------------
    
            [Number] The unique ID.
        
        
        */

MO5.getUniqueId = function()
{
    var p1, p2, p3, out;
    p1 = 255 * Math.random();
    p2 = 255 * Math.random();
    p3 = 255 * Math.random();
    MO5.highestId += 1;
    out = MO5.highestId + parseInt(p1 * p2 * p3);
    return out;
};

/**

    [Function] MO5.transform
    ========================

        The main tween function for animations. Calculates values between 
        a start and an end value using either a sine function or a user 
        defined function and feeds them into a callback function. 

        
        Parameters
        ----------
        
            1. callback:
                [Function] The callback function. It takes one
                argument, which is the current calculated value. Use this
                callback function to set the value(s) you want to transform.

            2. from:
                [Number] The start value.
                
            3. to:
                [Number] The end value.
                
            4. args:
                [Object] (optional) Arguments object. 
                
                The options are:
                
                * duration: 
                    [Number] How long the transformation shall take 
                    (in milliseconds). Default: 1000
                
                * log: 
                    [Boolean] Log each calculated value to the browser's 
                    console?
                
                * function: 
                    [Function] The function to actually calculate the values.
                    It must conform to this signature [Number] function(d, t)
                    where d is the full duration of the transformation and
                    t is the time the transformation took up to that point. 
                    Default: MO5.functions.sine
                
                * onFinish:
                    [Function] Callback that gets executed once the
                    transformation is finished.
                    

        Return value
        ------------
        
            [Number] An ID to identify the interval used for the transformation.
            

*/
MO5.transform = function(callback, from, to, args) 
{
	args = args || {};
    
    if (typeof callback === "undefined" || !callback)
    {
        throw new Error("MO5.transform expects parameter callback to be a function.");
    }
	
	var dur = args.duration || 1000,
        now,
		f,
		tStart = new Date().getTime(),
		func, 
		cv = from, 
		av = [], 
		timer, 
		cur = 0,
		tElapsed = 0,
		wasPaused = false,
		diff = to - from,
		doLog = args.log || false,
        c = 0, // number of times func get's executed
        onFinish = args.onFinish || function() {};
	
    if (!Date.now) 
    {  
        now = function () 
        {  
            return +(new Date);  
        };  
    }  
    else
    {
        now = Date.now;
    }
    
	f = args.easing || MO5.easing.sineEaseOut;
	
	func = function() 
	{
        var t, tb, dt;
        
        tb = now();
        c += 1;
        t = now();
		tElapsed = t - tStart;
//         console.log("t: " + t + "; tStart: " + tStart + "; Elapsed: " + tElapsed + "; cv: " + cv + "; from: " + from + "; to: " + to, callback);
        
        if (tElapsed > dur)
		{
			cv = from + diff;
			callback(to);
			clearInterval(timer);
            delete MO5.timers[timer];
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
	
    timer = MO5.getUniqueId();
//     timer = setInterval(func, 100);
    requestAnimationFrame(func);
	MO5.timers[timer] = true;
	return timer;
};

/**
 * Sets a timer that is valid for a specific time span and returns it's handle.
 * This function can be used to wait for non-MO5 functions in animations.
 * @param duration The time after which the timer is invalid.
 */
MO5.createTimer = function(duration)
{
    var timer;
    
    duration = duration || 0;
    duration = duration < 0 ? 0 : duration;
    
    timer = setTimeout(
        function() 
        {
            delete MO5.timers[timer];
        }, 
        duration
    );
    
    MO5.timers[timer] = true;
    
    return timer;
};

/**
 * Returns the window's width and height.
 * @return Object An object with a width and a height property.
 */
MO5.getWindowDimensions = function()
{
	var e = window, a = 'inner';
	if ( !( 'innerWidth' in e ) )
	{
		a = 'client';
		e = document.documentElement || document.body;
	}
	return { 
		width: e[ a+'Width' ],
		height: e[ a+'Height' ]
	};
};

/**

    [Constructor] MO5.Point
    =======================

        Simple object representing points.

        
        Parameters
        ----------
        
            1. x: [Number] The x value.
            2. y: [Number] The y value.
                

*/
MO5.Point = function(x, y)
{
	this.x = x;
    this.y = y;
};

/**

    [Function] MO5.Point.getDistance
    ================================
    
        Calculates the distance between the point and another point.
        
        
        Parameters
        ----------
        
            1. otherPoint: [MO5.Point] The other point.
            
            
        Return value
        ------------
        
            [Number] The distance between the two points.
            
            
*/
MO5.Point.prototype.getDistance = function(otherPoint)
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
MO5.easing = {};

/*!
TERMS OF USE - EASING EQUATIONS
Open source under the BSD License.
Copyright 2001 Robert Penner All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/**
 * Function for linear transformations.
 */
MO5.easing.linear = function(d, t)
{
    return t / d;
};

/**
 * Function for sine transformations.
 */
MO5.easing.sineEaseOut = function( d, t ) 
{ 
	var s = Math.PI / ( 2 * d );
	var y = Math.abs( Math.sin( t * s ) );
	return y; 
};

MO5.easing.sineEaseIn = function( d, t ) 
{ 
    var s = Math.PI / ( 2 * d );
    var y = Math.abs( -Math.cos( t * s ) + 1 );
    return y; 
};

MO5.easing.sineEaseInOut = function( d, t ) 
{
    if ( t / ( d / 2 ) < 1 )
    {
        return MO5.easing.sineEaseIn( d, t );
    }
    else
    {
        return MO5.easing.sineEaseOut( d, t );
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
MO5.easing.easeOutBounce = function (d, t) 
{
    var b = 0, c = 1;
    
    if ((t/=d) < (1/2.75)) 
    {
        return c*(7.5625*t*t) + b;
    } 
    else if (t < (2/2.75)) 
    {
        return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
    } 
    else if (t < (2.5/2.75)) 
    {
        return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
    } 
    else 
    {
        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
    }
}

MO5.easing.createEaseOutFunction = function( potency )
{
    var fn = function( d, t ) 
    {
        return 1 - Math.pow( 1 - ( t / d ), potency );
    };
    return fn;
};

MO5.easing.createEaseInFunction = function( potency )
{
    var fn = function( d, t ) 
    {
        return Math.pow( ( t / d ), potency );
    };
    return fn;
};

MO5.easing.createEaseInOutFunction = function( potency )
{
    var fn, eIn, eOut;
    eIn = MO5.easing.createEaseInFunction( potency );
    eOut = MO5.easing.createEaseOutFunction( potency );
    fn = function( d, t ) 
    {
        var val;
        if ( t > d / 2 )
        {
            val = eOut( d, t );
        }
        else
        {
            val = eIn( d, t );
        }
        return val;
    };
    return fn;
};

MO5.easing.easeOutQuad   = MO5.easing.createEaseOutFunction(2);
MO5.easing.easeOutCubic  = MO5.easing.createEaseOutFunction(3);
MO5.easing.easeOutQuart  = MO5.easing.createEaseOutFunction(4);
MO5.easing.easeOutQuint  = MO5.easing.createEaseOutFunction(5);

MO5.easing.easeInQuad   = MO5.easing.createEaseInFunction(2);
MO5.easing.easeInCubic  = MO5.easing.createEaseInFunction(3);
MO5.easing.easeInQuart  = MO5.easing.createEaseInFunction(4);
MO5.easing.easeInQuint  = MO5.easing.createEaseInFunction(5);

MO5.easing.easeInOutQuad   = MO5.easing.createEaseInOutFunction(2);
MO5.easing.easeInOutCubic  = MO5.easing.createEaseInOutFunction(3);
MO5.easing.easeInOutQuart  = MO5.easing.createEaseInOutFunction(4);
MO5.easing.easeInOutQuint  = MO5.easing.createEaseInOutFunction(5);


//////////////////////////////////////
// MO5.mixins                       //
//////////////////////////////////////

MO5.mixins = {};

/**
 * Mixin function for adding a drawing function
 * to the canvas.
 */
MO5.mixins.display = function()
{
	var self = this;
	this.canvas.addCallback(this.id, function() { self.draw(); }, this.layer || 0, this);
};

/**
 * Mixin function to remove a drawing function
 * from the canvas.
 */
MO5.mixins.hide = function()
{
	this.canvas.removeCallback(this.id);
};

/**
 * Mixin function to calculate the center of a MO5 object.
 */
MO5.mixins.getCenter = function()
{
	var x = (this.x + (this.width / 2)),
		y = (this.y + (this.height / 2));
	return new MO5.Point(x, y);
};

/**
 * Changes an object property and sets the internal update flag.
 */
MO5.mixins.change = function(key, value)
{
	this[key] = value;
	this.updated = true;
};


MO5.mixins.moveTo = function(x, y, args)
{
    args = args || {};
    var t0, 
        t1, 
        self = this;
    t0 = MO5.transform(
        function(v)
        {
            self.x = v;
        },
        this.x,
        x,
        args
    );
    t1 = MO5.transform(
        function(v)
        {
            self.y = v;
        },
        this.y,
        y,
        args
    );
    return [t0, t1];
};

MO5.mixins.move = function(x, y, args)
{
    args = args || {};
    dx = this.x + x;
    dy = this.y + y;
    return this.moveTo(dx, dy, args);
};

MO5.mixins.fadeIn = function(args)
{
    args = args || {};
    var self = this;
    return MO5.transform(
        function(v)
        {
            self.opacity = v;
        },
        this.opacity,
        1,
        args
    );
};

MO5.mixins.fadeOut = function(args)
{
    args = args || {};
    var self = this;
    return MO5.transform(
        function(v)
        {
            self.opacity = v;
        },
        this.opacity,
        0,
        args
    );
};


//////////////////////////////////////
// MO5.Animation                    //
//////////////////////////////////////

MO5.Animation = function(callbacks)
{
	if (!(this instanceof MO5.Animation))
	{
		return new MO5.Animation(callbacks);
	}

	this.cbs = callbacks.slice();
	this.isRunning = false;
	this.stopped = true;
	this.paused = false;
	this.timers = {};
    this.index = 0;
};

MO5.Animation.prototype.animate = function(callbacks,onFinish)
{
	onFinish = onFinish || function(){};

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
		this.animate(cbs,onFinish);
		return;
	}

	len = ts.length;
	for (i = 0; i < len; ++i)
	{
		this.timers[ts[i]] = MO5.timers[ts[i]];
	}

	cb = function()
	{
		self.animate(cbs,onFinish);
	};

	this.onTimersFinished(ts,cb);
};

MO5.Animation.prototype.onTimersFinished = function(ts,cb)
{
	var len = ts.length, i, self = this;
	for (i = 0; i < len; ++i)
	{
		if (typeof MO5.timers[ts[i]] !== 'undefined' 
			&& MO5.timers[ts[i]] === true)
		{
			setTimeout(
				function()
				{
					self.onTimersFinished(ts,cb);
				},
				20
			);
			return;
		}
	}
	cb();
};

MO5.Animation.prototype.run = function()
{
	var self = this;
	if (this.isRunning === false)
	{
		return;
	}
	setTimeout(
		function() 
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
				function()
				{
					self.run();
				}
			);
		},
		0
	);
};

MO5.Animation.prototype.start = function()
{
	this.stopped = false;
	this.isRunning = true;
	this.run();
};

MO5.Animation.prototype.loop = function(max,cur)
{
	var self = this;
	max = max || 1;
	cur = cur || 0;
	setTimeout(
		function() 
		{
			cur++;
			if (cur > max)
			{
				return;
			}
			self.animate(
				self.cbs,
				function()
				{
					self.loop(max,cur);
				}
			);
		},
		20
	);
};

MO5.Animation.prototype.stop = function(finishCurrent)
{
	var fc = finishCurrent || false,
		key,
		self = this;
	this.stopped = !fc;
	if (fc !== true)
	{
		for (key in this.timers)
		{
			clearInterval(key);
			if (typeof self.timers[key] !== 'undefined')
			{
				delete self.timers[key];
			}
		}
	}
	this.isRunning = false;
};


MO5.canvas = {};

MO5.canvas.PrototypeObject = function() {}
MO5.canvas.PrototypeObject.prototype.move = MO5.mixins.move,
MO5.canvas.PrototypeObject.prototype.moveTo = MO5.mixins.moveTo,
MO5.canvas.PrototypeObject.prototype.fadeIn = MO5.mixins.fadeIn,
MO5.canvas.PrototypeObject.prototype.fadeOut = MO5.mixins.fadeOut,
MO5.canvas.PrototypeObject.prototype.display = MO5.mixins.display,
MO5.canvas.PrototypeObject.prototype.hide = MO5.mixins.hide,
MO5.canvas.PrototypeObject.prototype.getCenter = MO5.mixins.getCenter,
MO5.canvas.PrototypeObject.prototype.change = MO5.mixins.change


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
MO5.canvas.Canvas = function(args)
{
	args = args || {};
	
	this.id = MO5.getUniqueId();
	var self = this, id = args.id || null, isFrozen = false;
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
	this.timerId;
	this.functions = [];
	this.functionsByKey = {};
	this.functionsByPriority = [];
	this.scale = args.scale || false;
	this.scaleX = args.scaleX || 1;
	this.scaleY = args.scaleY || 1;
	this.frozen = false;
	this.temp = document.createElement("canvas");
	this.stopped = true;
    this.bus = args.bus || MO5.bus;
	
	this.cv.width = this.width;
	this.cv.height = this.height;
	this.temp.width = this.width;
	this.temp.height = this.height;
	document.body.appendChild(this.cv);
	
	this.draw = function()
	{
		if (self.stopped === false)
		{
			requestAnimationFrame(self.draw);
		}
		var tbf = self.tbf;
		self.time += tbf;
		var key, 
			env, 
			sorted, 
			len, 
			i, 
			time = self.time,
			funcs = self.functions,
			cv = self.cv,
			ct = self.ct,
			obj,
			alpha;
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
		len = funcs.length;
		for (i = 0; i < len; ++i)
		{
			funcs[i]["callback"](env);
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
MO5.canvas.Canvas.prototype.addCallback = function(key, cb, priority)
{
	var fbp = this.functionsByPriority,
		func =  {
			key: key,
			callback: cb,
			priority: priority || 0
		};
	if (typeof fbp[priority] == 'undefined' || fbp[priority] === null)
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
MO5.canvas.Canvas.prototype.rebuildFunctionQueue = function()
{
	var len, cur, i, j, plen;
	this.functions = [];
	len = this.functionsByPriority.length;
	for (i = 0; i < len; ++i)
	{
		if (typeof this.functionsByPriority[i] == "undefined")
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
MO5.canvas.Canvas.prototype.removeCallback = function(key)
{
	if (typeof this.functionsByKey[key] == "undefined")
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
MO5.canvas.Canvas.prototype.start = function()
{
	this.stopped = false;
	this.draw();
};

/**
 * Stops the animation loop.
 */
MO5.canvas.Canvas.prototype.stop = function()
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
MO5.canvas.Canvas.prototype.fitToWindow = function(onlyIfSmaller)
{
	var dim = MO5.getWindowDimensions(),
		el = this.cv,
		ww = dim.width,
		wh = dim.height,
		val = '',
		type = 'width',
		ratio = this.width / this.height,
		hv = ww / ratio,
		wv = wh * ratio,
		newRatio = ww / wh,
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
	
	el.setAttribute(
		'style',
		' width: '+wv+'px; height: '+hv+'px; margin: auto; position: absolute;'+
		' left: '+((ww - wv) / 2)+'px; top: '+((wh - hv) / 2)+'px;'
	);
};

/**
 * Moves the canvas to the center of the browser window.
 */
MO5.canvas.Canvas.prototype.center = function()
{
	var dim = MO5.getWindowDimensions(),
		el = this.cv,
		ww = dim.width,
		wh = dim.height,
		hv = this.height,
		wv = this.width;
	
	el.setAttribute(
		'style',
		'position: absolute; left: '+((ww - wv) / 2)+'px; top: '+((wh - hv) / 2)+'px;'
	);
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
MO5.canvas.ImagePack = function(canvas, args)
{
	args = args || {};
	
	if (!(this instanceof MO5.canvas.ImagePack))
	{
		return new MO5.canvas.ImagePack(canvas, args);
	}

	this.images   = {};
	this.current  = null;
	this.x        = args.x || 0;
	this.y        = args.y || 0;
	this.id       = MO5.getUniqueId();
	this.canvas   = canvas;
	this.layer    = args.layer || 0;
	this.alpha    = args.alpha || 1;
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

MO5.canvas.ImagePack.prototype = new MO5.canvas.PrototypeObject();/*
MO5.canvas.ImagePack.prototype.display = MO5.mixins.display;
MO5.canvas.ImagePack.prototype.hide = MO5.mixins.hide;
MO5.canvas.ImagePack.prototype.getCenter = MO5.mixins.getCenter;
MO5.canvas.ImagePack.prototype.moveTo = MO5.mixins.moveTo;
MO5.canvas.ImagePack.prototype.move = MO5.mixins.move;*/

/**
 * Drawing callback function for ImagePack objects.
 * WARNING: Only to be used by library developers.
 * @param Object env An object containing information about the canvas.
 */
MO5.canvas.ImagePack.prototype.draw = function(env)
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
		ct.translate(-pivotX, -pivotY);
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
MO5.canvas.ImagePack.prototype.addImage = function(name, source)
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
MO5.canvas.ImagePack.prototype.removeImage = function(name)
{
	delete this.images[name];
};

/**
 * Sets the current image of the ImagePack. Only this image will be shown.
 * @param String name The image's name specified on addImage().
 */
MO5.canvas.ImagePack.prototype.set = function(name)
{
	if (typeof this.images[name] == 'undefined')
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
MO5.canvas.ImagePack.prototype.animate = function(args)
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
		if (!(images.hasOwnProperty(key)))
		{
			continue;
		}
		imageArr.push(images[key]);
	}
	cbs.push(
		function()
		{
			var t0 = MO5.transform(
				function(v)
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
					function: MO5.easing.linear
				}
			);
			return [t0];
		}
	);
	return new MO5.Animation(cbs);
};




/**

    [Constructor] MO5.canvas.TextBox
    ================================

        A TextBox object can be used to display text on the canvas with a 
        specific width. If the text is longer than the width of the TextBox, 
        the text will be displayed on multiple lines.

        TextBox objects consider words to be atomic and will only start newlines
        at the end of words.


    Concepts:
    ---------

        * Layer
        * Shadow
        * Position
        * Rotation


    Parameters:
    -----------

        1. canvas:
            [MO5.canvas.Canvas] A Canvas object to use.

        2. args:
            [Object] An object literal to initialize the properties.


    Properties:
    -----------

        * text: 
            [String] The text to be displayed. Default: "".

        * lineHeight:
            [Number] The height of lines in pixels. Default: 18.

        * color:
            [String] The CSS color of the text. Default: "#fff".

        * font:
            [String] The CSS font settings. 
            Default: "bold 15px Arial, Helvetica, sans-serfif".

        * align:
            [String] How the text should be aligned. 
            Default: "left".


*/
MO5.canvas.TextBox = function(canvas, args)
{
	args = args || {};
	
	if (!(this instanceof MO5.canvas.TextBox))
	{
		return new MO5.canvas.TextBox(canvas, args);
	}
	
	var self = this, lines = [], lastText = "";
	this.lastText = "";
	this.lines = [];
	this.id = MO5.getUniqueId();
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

MO5.canvas.TextBox.prototype = new MO5.canvas.PrototypeObject();

MO5.canvas.TextBox.prototype.draw = function(env)
{
	var self = this,
		ct = self.canvas.ct,
		words = self.text.split(" "),
		word = "",
		line = "",
		len = words.length,
		i,
		currentLine = 0,
		lineLen;
	ct.save();
	ct.globalAlpha = self.alpha;
	if (self.rotation > 0)
	{
		ct.translate(self.pivotX, self.pivotY);
		ct.rotate((Math.PI * self.rotation) / 180);
		ct.translate(-self.pivotX, -self.pivotY);
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
			self.lines[i], 
			((0.5 + self.x) | 0), 
			((0.5 + (self.y + self.lineHeight * i)) | 0)
		);
	}
	self.lastText = self.text;
	self.canvas.ct.restore();
};



/**

   [Constructor] MO5.canvas.Rectangle:
   ===================================
   
      Wraps the rectangle functionality of the HTML5 Canvas.
  
  
      Concepts:
      ---------
  
         * Dimensions
         * Position
         * Layer
         * Rotation
         * Border
         * Shadow
         * Transparency
         * Canvas Object

  
      Parameters:
      -----------
  
         1. canvas:
            [MO5.canvas.Canvas] The Canvas object to use.
  
         2. args:
            [Object] An object literal for initializing optional arguments.
            Take a look at the concepts section for all possible properties.
       
            Properties:
  
               * color: 
                  [String] The fill color of the rectangle. 
                  Default: "#fff".
  
  
*/
MO5.canvas.Rectangle = function(canvas, args)
{
	args = args || {};
	
	if (!(this instanceof MO5.canvas.Rectangle))
	{
		return new MO5.canvas.Rectangle(canvas, args);
	}
	
	var self = this;
	this.id = MO5.getUniqueId();
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
MO5.canvas.Rectangle.prototype = new MO5.canvas.PrototypeObject();
	
MO5.canvas.Rectangle.prototype.draw = function(env)
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
		ct.translate(-pivotX, -pivotY);
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
	[Constructor] MO5.canvas.Rain
	=============================
	
		A rain effect.
		
		Concepts:
		---------
		
			* Dimensions
			* Layer
			* Transparency
			* Rotation
			* Position
		
		Parameters:
		-----------
		
			1. canvas:
				[MO5.canvas.Canvas] The Canvas object to use.
			
			2. args:
				[Object] An object literal with optional arguments.
				
				Properties:
				
					* speed:
						[Number] The number of pixels to move on each iteration.
					
					* drops:
						[Number] The number of rain drops to display.
						
						
*/
MO5.canvas.Rain = function(canvas, args)
{
	args = args || {};
	
	if (!(this instanceof MO5.canvas.Rain))
	{
		return new MO5.canvas.Rain(canvas, args);
	}
	
	var self = this;
	
	this.id = MO5.getUniqueId();
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
        function()
        {
            self.hide();
        },
        "mo5.canvas.rain.hideAll"
    );
    
    this.canvas.bus.subscribe(
        function()
        {
            self.display();
        },
        "mo5.canvas.rain.displayAll"
    );
};
MO5.canvas.Rain.prototype = new MO5.canvas.PrototypeObject();

MO5.canvas.Rain.prototype.draw = function(env)
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
		ct.translate(-self.pivotX, -self.pivotY);
	}
	if (data === null)
	{
		data = [];
		for (i = 0; i < drops; ++i)
		{
			x = Math.random() * width - (self.width - self.canvas.cv.width) / 2;
			fy = Math.random() * height - (self.height - self.canvas.cv.height) / 2;
			ly = Math.random() * 40 + 5;
			data.push({x: x, fy: fy, ly: ly});
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

MO5.canvas.Rain.prototype.display = MO5.mixins.display;
MO5.canvas.Rain.prototype.hide = MO5.mixins.hide;
MO5.canvas.Rain.prototype.getCenter = MO5.mixins.getCenter;
MO5.canvas.Rain.prototype.fadeIn = MO5.mixins.fadeIn;
MO5.canvas.Rain.prototype.fadeOut = MO5.mixins.fadeOut;


//////////////////////////////////////
// MO5.canvas.PixelManipulator
//////////////////////////////////////

MO5.canvas.PixelManipulator = function(canvas, args)
{
	args = args || {};
	
	if (!(this instanceof MO5.canvas.PixelManipulator))
	{
		return new MO5.canvas.PixelManipulator(canvas, args);
	}
	
	var self = this;
	this.id = MO5.getUniqueId();
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
	
	this.draw = function(env)
	{
		var ct = self.canvas.ct,
			data = self.data,
			len, 
			cv2 = document.createElement("canvas"),
			ct2 = cv2.getContext("2d"),
			img;
		ct.save();
		ct.globalAlpha = self.alpha;
		if (self.rotation > 0)
		{
			ct.translate(self.pivotX, self.pivotY);
			ct.rotate((Math.PI * self.rotation) / 180);
			ct.translate(-self.pivotX, -self.pivotY);
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

MO5.canvas.PixelManipulator.prototype.setPixel = function(x, y, r, g, b, a)
{
	var i = (x + y * this.width) * 4, data = this.data.data;
	data[i] = r;
	data[i+1] = g;
	data[i+2] = b;
	data[i+3] = a;
	this.isChanged = true;
};

MO5.canvas.PixelManipulator.prototype.display = MO5.mixins.display;
MO5.canvas.PixelManipulator.prototype.hide = MO5.mixins.hide;
MO5.canvas.PixelManipulator.prototype.getCenter = MO5.mixins.getCenter;
MO5.canvas.PixelManipulator.prototype.moveTo = MO5.mixins.moveTo;
MO5.canvas.PixelManipulator.prototype.move = MO5.mixins.move;
MO5.canvas.PixelManipulator.prototype.fadeIn = MO5.mixins.fadeIn;
MO5.canvas.PixelManipulator.prototype.fadeOut = MO5.mixins.fadeOut;





MO5.dom = {};

MO5.dom.PrototypeObject = function() {};

MO5.dom.PrototypeObject.prototype.fadeIn = function(args)
{
    args = args || {};
    var node = this.node;
    return MO5.transform(
        function(v) { node.style.opacity = v; },
        0,
        1,
        args
    );
};

MO5.dom.PrototypeObject.prototype.fadeOut = function(args)
{
    args = args || {};
    var node = this.node;
    return MO5.transform(
        function(v) { node.style.opacity = v; },
        1,
        0,
        args
    );
};

MO5.dom.PrototypeObject.prototype.moveTo = function(x, y, args)
{
    args = args || {};
    var node = this.node,
        ox = node.offsetLeft,
        oy = node.offsetTop,
        t0, t1;
    t0 = MO5.transform(
        function(v) { node.style.left = v + "px"; },
        ox,
        x,
        args
    );
    t1 = MO5.transform(
        function(v) { node.style.top = v + "px"; },
        oy,
        y,
        args
    );
    return [t0, t1];
};

MO5.dom.PrototypeObject.prototype.move = function(x, y, args)
{
    args = args || {};
    var node = this.node,
    dx = node.offsetLeft + x,
    dy = node.offsetTop + y;
    return this.moveTo(dx, dy, args);
};

MO5.dom.PrototypeObject.prototype.display = function()
{
    var parent;
    try
    {
        parent = this.parent || document.getElementsByTagName("body")[0];
        parent.appendChild(this.node);
    }
    catch (e) {};
};

MO5.dom.PrototypeObject.prototype.hide = function()
{
    var parent;
    try
    {
        parent = this.parent || document.getElementsByTagName("body")[0];
        parent.removeChild(this.node);
    }
    catch (e) {};
};




MO5.dom.Node = function(args)
{
    args = args || {};
    
    if (!(this instanceof MO5.dom.Node))
    {
        return new MO5.dom.Node(node, args);
    }
    
    this.parent = args.parent || document.getElementsByTagName("body")[0];
    this.nodeType = args.nodeType || "div";
    this.node = args.node || document.createElement(this.nodeType);
    this.bus = args.bus || MO5.bus;
    
    this.bus.trigger("mo5.dom.node.create", this);
};
MO5.dom.Node.prototype = new MO5.dom.PrototypeObject();
MO5.dom.Node.prototype.constructor = MO5.dom.Node;





MO5.dom.ImagePack = function(args)
{
    args = args || {};
    
    if (!(this instanceof MO5.dom.ImagePack))
    {
        return new MO5.dom.ImagePack(node, args);
    }
    
    this.parent = args.parent || document.getElementsByTagName("body")[0];
    this.nodeType = args.nodeType || "div";
    this.node = args.node || document.createElement(this.nodeType);
    this.bus = args.bus || MO5.bus;
    
    this.bus.trigger("mo5.dom.imagepack.create", this);
};
MO5.dom.ImagePack.prototype = new MO5.dom.PrototypeObject();


