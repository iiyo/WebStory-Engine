(function (out)
{
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

    out.assets.Animation.prototype.save = function (obj)
    {
        obj[this.id] = {
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
    };

    out.assets.Animation.prototype.restore = function (obj)
    {
        this.isRunning = obj[this.id].isRunning;

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