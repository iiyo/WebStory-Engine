(function (out)
{
    "use strict";
    
    out.assets.mixins.hide = function (command, args)
    {
        var self, duration, wait, effect, direction,
        ox, oy, to, prop, isAnimation, element, easingType, easing;

        self = this;
        wait = command.getAttribute("wait") === "yes" ? true : false;
        duration = command.getAttribute("duration") || 500;
        effect = command.getAttribute("effect") || "fade";
        direction = command.getAttribute("direction") || "left";
        isAnimation = args.animation === true ? true : false;
        element = document.getElementById(this.cssid);
        easingType = command.getAttribute("easing") || "sineEaseOut";
        easing = (typeof out.fx.easing[easingType] !== null) ? out.fx.easing[easingType] : out.fx.easing.sineEaseOut;

        if (effect === "slide")
        {
            ox = element.offsetLeft;
            oy = element.offsetTop;
            element.style.opacity = 1;
            
            switch (direction)
            {
                case "left":
                    to = ox - this.stage.offsetWidth;
                    prop = "left";
                    break;
                case "right":
                    to = ox + this.stage.offsetWidth;
                    prop = "left";
                    break;
                case "top":
                    to = oy - this.stage.offsetHeight;
                    prop = "top";
                    break;
                case "bottom":
                    to = oy + this.stage.offsetHeight;
                    prop = "top";
                    break;
                default:
                    to = ox - this.stage.offsetWidth;
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
                    element.style[prop] = v + "px";
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
                            element.style.left = ox + "px";
                            prop = "left";
                            break;
                        case "top":
                        case "bottom":
                            element.style.top = oy + "px";
                            prop = "top";
                            break;
                        default:
                            element.style.left = ox + "px";
                            prop = "left";
                    }
                };
                
                options = {
                    duration: duration,
                    easing: easing,
                    onFinish: finishFn
                };
                
                out.fx.transform(valFn, from, to, options);
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
                
                out.fx.transform(valFn, 1, 0, options);
            }());
        }

        this.bus.trigger("wse.assets.mixins.hide", this);

        return {
            doNext: true
        };
    };    
}(WSE));