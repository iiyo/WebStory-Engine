/* global using */

using("MO5.CoreObject", "MO5.transform", "MO5.easing", "WSE.tools", "WSE.tools::warn").
define("WSE.DisplayObject", function (CoreObject, transform, easing, tools, warn) {
    
    function DisplayObject () {
        CoreObject.call(this);
    }
    
    DisplayObject.prototype = new CoreObject();
    
    DisplayObject.prototype.flash = function flash (command, args) {
        
        var self, duration, wait, bus, stage, element, isAnimation, maxOpacity;
        var visible, parse = tools.getParsedAttribute;
        
        args = args || {};
        self = this;
        wait = parse(command, "wait", this.interpreter) === "yes" ? true : false;
        duration = +parse(command, "duration", this.interpreter, 500);
        maxOpacity = +parse(command, "opacity", this.interpreter, 1);
        element = args.element || document.getElementById(this.cssid);
        
        if (!element) {
            warn(this.bus, "DOM Element for asset is missing!", command);
            return;
        }
    
        bus = args.bus || this.bus;
        stage = args.stage || this.stage;
        isAnimation = args.animation === true ? true : false;
        visible = (+(element.style.opacity.replace(/[^0-9\.]/, ""))) > 0 ? true : false;
        
        if (!isAnimation) {
            self.interpreter.waitCounter += 1;
        }
        
        transform(
            function (v) {
                element.style.opacity = v;
            },
            visible ? maxOpacity : 0,
            visible ? 0 : maxOpacity,
            {
                duration: duration / 3,
                easing: easing.easeInCubic
            }
        ).promise().
        then(function () {
            
            var argsObj;
            
            function tranformFn (v) {
                element.style.opacity = v;
            };
            
            function finishFn () {
                if (isAnimation) {
                    return;
                }
                
                self.interpreter.waitCounter -= 1;
            };
            
            argsObj = {
                duration: (duration / 3) * 2,
                easing: easing.easeOutCubic
            };
            
            transform(
                tranformFn,
                visible ? 0 : maxOpacity,
                visible ? maxOpacity : 0,
                argsObj
            ).promise().
            then(finishFn);
        });
        
        return {
            doNext: true
        };
    };
    
    DisplayObject.prototype.flicker = function (command, args) {
        
        var self, duration, bus, stage, times, step, element;
        var isAnimation, fn, iteration, maxOpacity, val1, val2, dur1, dur2;
        
        args = args || {};
        self = this;
        duration = command.getAttribute("duration") || 500;
        times = command.getAttribute("times") || 10;
        maxOpacity = command.getAttribute("opacity") || 1;
        element = args.element || document.getElementById(this.cssid);
        step = duration / times;
        iteration = 0;
        
        if (!element) {
            warn(this.bus, "DOM Element for asset is missing!", command);
            return;
        }
        
        if (!(parseInt(element.style.opacity, 10))) {
            val1 = 0;
            val2 = maxOpacity;
            dur1 = step / 3;
            dur2 = dur1 * 2;
        }
        else {
            val2 = 0;
            val1 = maxOpacity;
            dur2 = step / 3;
            dur1 = dur2 * 2;
        }
        
        bus = args.bus || this.bus;
        stage = args.stage || this.stage;
        isAnimation = args.animation === true ? true : false;
        
        if (!isAnimation) {
            self.interpreter.waitCounter += 1;
        }
        
        fn = function () {
            
            iteration += 1;
            
            transform(
                function (v) {
                    element.style.opacity = v;
                },
                val1,
                val2,
                {
                    duration: dur1,
                    easing: easing.easeInQuad
                }
            ).promise().
            then(function () {
                
                transform(
                    function (v) {
                        element.style.opacity = v;
                    },
                    val2,
                    val1,
                    {
                        duration: dur2,
                        easing: easing.easeInQuad
                    }
                ).promise().
                then(function () {
                    
                    if (iteration <= times) {
                        setTimeout(fn, 0);
                        return;
                    }
                    
                    if (!isAnimation) {
                        self.interpreter.waitCounter -= 1;
                    }
                });
            });
        };
        
        fn();
        
        return {
            doNext: true
        };
    };
    
    DisplayObject.prototype.hide = function (command, args) {
        
        var self, duration, wait, effect, direction, offsetWidth, offsetHeight;
        var ox, oy, to, prop, isAnimation, element, easingType, easingFn, stage;
        var xUnit, yUnit;
        var parse = tools.getParsedAttribute;
        
        args = args || {};
        self = this;
        wait = parse(command, "wait", this.interpreter) === "yes" ? true : false;
        duration = parse(command, "duration", this.interpreter, 500);
        effect = parse(command, "effect", this.interpreter, "fade");
        direction = parse(command, "direction", this.interpreter, "left");
        isAnimation = args.animation === true ? true : false;
        element = document.getElementById(this.cssid);
        easingType = parse(command, "easing", this.interpreter, "sineEaseOut");
        easingFn = (typeof easing[easingType] !== null) ? 
            easing[easingType] : 
            easing.sineEaseOut;
        stage = this.stage;
        xUnit = this.xUnit || 'px';
        yUnit = this.yUnit || 'px';
        
        if (effect === "slide") {
            
            element.style.opacity = 1;
            
            if (xUnit === '%') {
                ox = element.offsetLeft / (stage.offsetWidth / 100);
                offsetWidth = 100;
            }
            else {
                ox = element.offsetLeft;
                offsetWidth = stage.offsetWidth;
            }
            
            if (yUnit === '%') {
                oy = element.offsetTop / (stage.offsetHeight / 100);
                offsetHeight = 100;
            }
            else {
                oy = element.offsetTop;
                offsetHeight = stage.offsetHeight;
            }
            
            switch (direction) {
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
            
            if (!isAnimation) {
                self.interpreter.waitCounter += 1;
            }
            
            (function () {
                
                var valFn, from, finishFn, options;
                
                valFn = function (v) {
                    element.style[prop] = v + (prop === 'left' ? xUnit : yUnit);
                };
                
                from = (prop === "left" ? ox : oy);
                
                finishFn = function () {
                    
                    if (!isAnimation) {
                        self.interpreter.waitCounter -= 1;
                    }
                    
                    element.style.opacity = 0;
                    
                    switch (direction) {
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
                    easing: easingFn
                };
                
                transform(valFn, from, to, options).promise().
                then(finishFn);
            }());
        }
        else {
            
            if (!isAnimation) {
                self.interpreter.waitCounter += 1;
            }
            
            (function () {
                
                var valFn, options, finishFn;
                
                valFn = function (v) {
                    element.style.opacity = v;
                };
                
                finishFn = function () {
                    
                    if (!isAnimation) {
                        self.interpreter.waitCounter -= 1;
                    }
                    
                    element.style.opacity = 0;
                };
                
                options = {
                    duration: duration,
                    easing: easingFn
                };
                
                transform(valFn, 1, 0, options).promise().
                then(finishFn);
            }());
        }
        
        return {
            doNext: true
        };
    };
    
    DisplayObject.prototype.move = function (command, args) {
        
        var x, y, z, element, self, wait, xUnit, yUnit, duration, easingType;
        var easingFn, waitX, waitY, waitZ, isAnimation, ox, oy, stage;
        var xAnchor, yAnchor, interpreter = this.interpreter;
        var offsetLeft, offsetTop, oldElementDisplayStyle;
        
        args = args || {};
        self = this;
        element = document.getElementById(this.cssid);
        
        x = command.getAttribute("x");
        y = command.getAttribute("y");
        z = command.getAttribute("z");
        
        xAnchor = command.getAttribute("xAnchor") || "0";
        yAnchor = command.getAttribute("yAnchor") || "0";
        
        if (xAnchor === null && this.xAnchor !== null) {
            xAnchor = this.xAnchor;
        }
        
        if (yAnchor === null  && this.yAnchor !== null) {
            yAnchor = this.yAnchor;
        }
        
        x = tools.replaceVariables(x, this.interpreter);
        y = tools.replaceVariables(y, this.interpreter);
        z = tools.replaceVariables(z, this.interpreter);
        xAnchor = tools.replaceVariables(xAnchor, this.interpreter);
        yAnchor = tools.replaceVariables(yAnchor, this.interpreter);
        
        duration = tools.getParsedAttribute(command, "duration", interpreter, 500);
        easingType = tools.getParsedAttribute(command, "easing", interpreter, "sineEaseOut");
        
        easingFn = (typeof easing[easingType] !== null) ? 
            easing[easingType] : 
            easing.sineEaseOut;
        
        isAnimation = args.animation === true ? true : false;
        stage = this.interpreter.stage;
        
        offsetLeft = element.offsetLeft;
        offsetTop = element.offsetTop;
        
        if (x !== null) {
            xUnit = tools.extractUnit(x) || "px";
            x = parseInt(x, 10);
        }
        
        if (y !== null) {
            yUnit = tools.extractUnit(y) || "px";
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
        
        x = tools.calculateValueWithAnchor(x, xAnchor, element.offsetWidth);
        y = tools.calculateValueWithAnchor(y, yAnchor, element.offsetHeight);
        
        element.style.display = oldElementDisplayStyle;
        
        wait = tools.getParsedAttribute(command, "wait", interpreter) === "yes" ? true : false;
        waitX = false;
        waitY = false;
        waitZ = false;
        
        if (x === null && y === null && z === null) {
            warn(this.bus, "Can't apply command 'move' to asset '" + 
                this.name + "' because no x, y or z position " +
                "has been supplied.", command);
        }
        
        if (x !== null) {
            
            if (xUnit === '%') {
                ox = offsetLeft / (stage.offsetWidth / 100);
            }
            else {
                ox = offsetLeft;
            }
            
            if (!isAnimation) {
                self.interpreter.waitCounter += 1;
            }
            
            transform(
                function (v) {
                    element.style.left = v + xUnit;
                },
                ox,
                x,
                {
                    duration: duration,
                    easing: easingFn
                }
            ).promise().
            then(function () {
                if (!isAnimation) {
                    self.interpreter.waitCounter -= 1;
                }
            });
        }
        
        if (y !== null) {
            
            if (yUnit === '%') {
                oy = offsetTop / (stage.offsetHeight / 100);
            }
            else {
                oy = offsetTop;
            }
            
            if (!isAnimation) {
                self.interpreter.waitCounter += 1;
            }
            
            transform(
                function (v) {
                    element.style.top = v + yUnit;
                },
                oy,
                y,
                {
                    duration: duration,
                    easing: easingFn
                }
            ).promise().
            then(function () {
                if (!isAnimation) {
                    self.interpreter.waitCounter -= 1;
                }
            });
        }
        
        if (z !== null) {
            
            if (!isAnimation) {
                self.interpreter.waitCounter += 1;
            }
            
            transform(
                function (v) {
                    element.style.zIndex = v;
                },
                element.style.zIndex || 0,
                parseInt(z, 10),
                {
                    duration: duration,
                    easing: easingFn
                }
            ).promise().
            then(function () {
                if (!isAnimation) {
                    self.interpreter.waitCounter -= 1;
                }
            });
        }
        
        this.bus.trigger("wse.assets.mixins.move", this);
        
        return {
            doNext: true
        };
    };
    
    DisplayObject.prototype.shake = function (command, args) {
        
        var dx, dy, element, self, xUnit, yUnit, duration, period;
        var isAnimation, ox, oy, stage;

        args = args || {};
        self = this;
        element = document.getElementById(this.cssid);
        dx = command.getAttribute("dx");
        dy = command.getAttribute("dy");
        period = command.getAttribute("period") || 50;
        duration = command.getAttribute("duration") || 275;
        isAnimation = args.animation === true ? true : false;
        stage = this.interpreter.stage;
        
        if (dx === null && dy === null) {
            dy = "-10px";
        }
        
        if (dx !== null) {
            xUnit = tools.extractUnit(dx);
            dx = parseInt(dx, 10);
        }
        
        if (dy !== null) {
            yUnit = tools.extractUnit(dy);
            dy = parseInt(dy, 10);
        }
        
        function easing (d, t) {
            
            var x = t / period;
            
            while (x > 2.0) {
                x -= 2.0;
            }
            
            if  (x > 1.0) {
                x = 2.0 - x;
            }
            
            return x;
        };
        
        if (dx !== null) {
            
            if (xUnit === '%') {
                ox = element.offsetLeft / (stage.offsetWidth / 100);
            }
            else {
                ox = element.offsetLeft;
            }
            
            self.interpreter.waitCounter += 1;
            
            transform(
                function (v)
                {
                    element.style.left = v + xUnit;
                },
                ox - dx,
                ox + dx,
                {
                    duration: duration,
                    easing:   easing
                }
            ).
            then(function () {
                element.style.left = ox + xUnit;
                self.interpreter.waitCounter -= 1;
            });
        }
        
        if (dy !== null) {
            
            if (yUnit === '%') {
                oy = element.offsetTop / (stage.offsetHeight / 100);
            }
            else {
                oy = element.offsetTop;
            }
            
            self.interpreter.waitCounter += 1;
            
            transform(
                function (v) {
                    element.style.top = v + yUnit;
                },
                oy - dy,
                oy + dy,
                {
                    duration: duration,
                    easing:   easing
                }
            ).promise().
            then(function () {
                element.style.top = oy + yUnit;
                self.interpreter.waitCounter -= 1;
            });
        }
        
        this.bus.trigger("wse.assets.mixins.shake", this);
        
        return {
            doNext: true
        };
    };
    
    DisplayObject.prototype.show = function (command, args) {
        
        var self, duration, wait, effect, direction, ox, oy, prop, xUnit, yUnit;
        var bus, stage, element, isAnimation, easingFn, easingType, interpreter;
        var offsetWidth, offsetHeight, startX, startY;
        var parse = tools.getParsedAttribute;
        
        args = args || {};
        self = this;
        wait = parse(command, "wait", this.interpreter) === "yes" ? true : false;
        duration = parse(command, "duration", this.interpreter, 500);
        effect = parse(command, "effect", this.interpreter, "fade");
        direction = parse(command, "direction", this.interpreter, "right");
        element = args.element || document.getElementById(this.cssid);
        xUnit = this.xUnit || 'px';
        yUnit = this.yUnit || 'px';
        
        if (!element) {
            warn(this.bus, "DOM Element for asset is missing!", command);
            return;
        }
        
        interpreter = args.interpreter || this.interpreter;
        bus = args.bus || this.bus;
        stage = args.stage || this.stage;
        easingType = parse(command, "easing", this.interpreter, "sineEaseOut");
        easingFn = (typeof easing[easingType] !== null) ? 
            easing[easingType] : 
            easing.sineEaseOut;
        isAnimation = args.animation === true ? true : false;
        
        if (effect === "slide") {
            
            if (xUnit === '%') {
                ox = element.offsetLeft / (stage.offsetWidth / 100);
                offsetWidth = 100;
            }
            else {
                ox = element.offsetLeft;
                offsetWidth = stage.offsetWidth;
            }
            
            if (yUnit === '%') {
                oy = element.offsetTop / (stage.offsetHeight / 100);
                offsetHeight = 100;
            }
            else {
                oy = element.offsetTop;
                offsetHeight = stage.offsetHeight;
            }
            
            switch (direction) {
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
            
            if (!isAnimation) {
                interpreter.waitCounter += 1;
            }
            
            if (xUnit === '%') {
                startX = element.offsetLeft / (stage.offsetWidth / 100);
            } 
            else {
                startX = element.offsetLeft;
            }
            
            if (yUnit === '%') {
                startY = element.offsetTop / (stage.offsetHeight / 100);
            } 
            else {
                startY = element.offsetTop;
            }
            
            transform(
                function (v) {
                    element.style[prop] = v + (prop === 'left' ? xUnit : yUnit);
                }, 
                (prop === "left" ? startX : startY), 
                (prop === "left" ? ox : oy),
                {
                    duration: duration,
                    easing: easingFn
                }
            ).promise().
            then(function () {
                if (!isAnimation) {
                    interpreter.waitCounter -= 1;
                }
            });
        }
        else {
            
            if (!isAnimation) {
                interpreter.waitCounter += 1;
            }
            
            transform(
                function (v) {
                    element.style.opacity = v;
                },
                0,
                1,
                {
                    duration: duration,
                    easing: easingFn
                }
            ).promise().
            then(function () {
                if (!isAnimation) {
                    interpreter.waitCounter -= 1;
                }
            });
        }
        
        return {
            doNext: true
        };
    };
    
    return DisplayObject;
    
});
