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

        // HACK - remove this later
        var origAsset = asset;
        asset = out.tools.xmlToJs(asset);

        this.stage = interpreter.stage;
        this.bus = interpreter.bus;
        this.asset = asset;
        this.name = asset.name;
        this.cbs = [];
        this.assets = interpreter.assets;
        this.id = out.tools.getUniqueId();
        this.isRunning = false;

        self = this;
        
        // HACK - remove this later
        groups = origAsset.getElementsByTagName("group");
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
            //                             console.log(f, t, pn, u, opt);
            return out.fx.transform(

            function (v)
            {
                as.style[pn] = v + u;
            }, f, t, opt);
        };

        runDoCommandFn = function (del, tim)
        {
            var curDur, curDoEl;

            curDoEl = out.tools.xmlToJs(del);
            curDur = curDoEl.duration;
            //                             console.log("Running do command.");
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

                    curAsName = curTr.asset;

                    try
                    {
                        curAs = document.getElementById(self.assets[curAsName].cssid) || self.stage;
                    }
                    catch (e)
                    {
                        continue;
                    }

                    easingType = curTr.easing;
                    //                     console.log(curAsName, curAs);
                    from = parseInt(curTr.from, 10);
                    to = parseInt(curTr.to, 10);
                    unit = curTr.unit || "";
                    dur = curTr.duration || 500;
                    propName = curTr.property;
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
