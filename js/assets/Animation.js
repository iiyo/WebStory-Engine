/* global using */

using(
    "MO5.transform",
    "MO5.easing",
    "MO5.Animation",
    "MO5.CoreObject",
    "MO5.TimerWatcher",
    "WSE.commands",
    "WSE.tools::createTimer",
    "WSE.tools::warn"
).
define("WSE.assets.Animation", function (
    transform,
    easing,
    MO5Animation,
    CoreObject,
    TimerWatcher,
    commands,
    createTimer,
    warn
) {
    
    "use strict";
    
    function Animation (asset, interpreter) {
        
        var groups, i, len, current, transformations, jlen;
        var self, doElements;
        
        CoreObject.call(this);
        
        this.stage = interpreter.stage;
        this.bus = interpreter.bus;
        this.asset = asset;
        this.name = asset.getAttribute("name");
        this.cbs = [];
        this.assets = interpreter.assets;
        this.isRunning = false;
        
        self = this;
        groups = this.asset.getElementsByTagName("group");
        len = groups.length;
        
        if (len < 1) {
            
            warn(this.bus, "Animation asset '" + this.name + "' is empty.", asset);
            
            return {
                doNext: true
            };
        }
        
        function createTransformFn (as, f, t, pn, u, opt) {
            return transform(function (v) {
                as.style[pn] = v + u;
            }, f, t, opt);
        };
        
        function runDoCommandFn (del, watcher) {
            
            var curDur, curDoEl;
            
            curDoEl = del;
            curDur = curDoEl.getAttribute("duration");
            
            commands["do"](curDoEl, interpreter, {
                animation: true
            });
            
            if (curDur !== null) {
                watcher.addTimer(createTimer(curDur));
            }
        };
        
        function loopFn (transf, doEls) {
            
            var dlen; 
            
            dlen = doEls.length;
            jlen = transformations.length;
            
            self.cbs.push(function () {
                
                var from, to, unit, curTr, curAs, curAsName;
                var dur, propName, j, easingType, opt, di, watcher;
                
                watcher = new TimerWatcher();
                
                for (j = 0; j < jlen; j += 1) {
                    
                    curTr = transf[j];
                    
                    if (typeof curTr === "undefined" || curTr === null) {
                        continue;
                    }
                    
                    curAsName = curTr.getAttribute("asset");
                    
                    try {
                        curAs = document.getElementById(self.assets[curAsName].cssid) || self.stage;
                    }
                    catch (e) {
                        continue;
                    }
                    
                    easingType = curTr.getAttribute("easing");
                    from = parseInt(curTr.getAttribute("from"), 10);
                    to = parseInt(curTr.getAttribute("to"), 10);
                    unit = curTr.getAttribute("unit") || "";
                    dur = curTr.getAttribute("duration") || 500;
                    propName = curTr.getAttribute("property");
                    opt = {};
                    opt.duration = dur;
                    
                    if (easingType !== null && typeof easing[easingType] !== "undefined" &&
                            easing[easingType] !== null) {
                        
                        opt.easing = easing[easingType];
                    }
                    
                    watcher.addTimer(createTransformFn(curAs, from, to, propName, unit, opt));
                }
                
                for (di = 0; di < dlen; di += 1) {
                    runDoCommandFn(doEls[di], watcher);
                }
                
                return watcher;
            });
        };
        
        for (i = 0; i < len; i += 1) {
            
            current = groups[i];
            transformations = current.getElementsByTagName("transform");
            doElements = current.getElementsByTagName("do");
            
            loopFn(transformations, doElements);
        }
        
        this.anim = new MO5Animation();
        
        this.cbs.forEach(function (cb) {
            this.anim.addStep(cb);
        }.bind(this));
        
        this.bus.trigger("wse.assets.animation.constructor", this);
        
        (function () {
            
            function fn () {
                self.stop();
            };
            
            self.bus.subscribe(fn, "wse.interpreter.restart");
            self.bus.subscribe(fn, "wse.interpreter.end");
            self.bus.subscribe(fn, "wse.interpreter.load.before");
        }());
        
    };
    
    Animation.prototype = new CoreObject();
    
    Animation.prototype.start = function () {
        this.anim.start();
        this.isRunning = true;
        this.bus.trigger("wse.assets.animation.started", this);
    };
    
    Animation.prototype.stop = function () {
        
        if (this.anim.isRunning()) {
            this.anim.stop();
        }
        
        this.isRunning = false;
        this.bus.trigger("wse.assets.animation.stopped", this);
    };
    
    Animation.prototype.save = function () {
        
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
    
    Animation.prototype.restore = function (obj) {
        
        this.isRunning = obj.isRunning;
        
        if (this.isRunning === true) {
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
    
    return Animation;
    
});