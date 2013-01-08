(function (out)
{
    out.assets.mixins.show = function (command, args)
    {
        var self, duration, wait, effect, direction, ox, oy, prop,
        bus, stage, element, isAnimation, easing, easingType, interpreter;

        args = args || {};
        self = this;
        wait = command.getAttribute("wait") === "yes" ? true : false;
        duration = command.getAttribute("duration") || 500;
        effect = command.getAttribute("effect") || "fade";
        direction = command.getAttribute("direction") || "right";
        element = args.element || document.getElementById(this.cssid);

        if (!element)
        {
            this.bus.trigger("wse.interpreter.warning",
            {
                element: command,
                message: "DOM Element for asset is missing!"
            });
            return;
        }

        //         console.log("CSS ID: " + this.cssid, element);

        interpreter = args.interpreter || this.interpreter;
        bus = args.bus || this.bus;
        stage = args.stage || this.stage;
        easingType = command.getAttribute("easing") || "sineEaseOut";
        easing = (typeof out.fx.easing[easingType] !== null) ? out.fx.easing[easingType] : out.fx.easing.sineEaseOut;
        isAnimation = args.animation === true ? true : false;

        if (effect === "slide")
        {
            ox = element.offsetLeft;
            oy = element.offsetTop;
            switch (direction)
            {
            case "left":
                element.style.left = ox + stage.offsetWidth + "px";
                prop = "left";
                break;
            case "right":
                element.style.left = ox - stage.offsetWidth + "px";
                prop = "left";
                break;
            case "top":
                element.style.top = oy + stage.offsetHeight + "px";
                prop = "top";
                break;
            case "bottom":
                element.style.top = oy - stage.offsetHeight + "px";
                prop = "top";
                break;
            default:
                element.style.left = ox - stage.offsetWidth + "px";
                prop = "left";
                break;
            }
            element.style.opacity = 1;

            if (!isAnimation)
            {
                interpreter.waitCounter += 1;
            }

            out.fx.transform(

            function (v)
            {
                element.style[prop] = v + "px";
            }, (prop === "left" ? element.offsetLeft : element.offsetTop), (prop === "left" ? ox : oy),
            {
                duration: duration,
                onFinish: !isAnimation ? function ()
                {
                    interpreter.waitCounter -= 1;
                } : null,
                easing: easing
            });
        }
        else
        {
            if (!isAnimation)
            {
                interpreter.waitCounter += 1;
            }

            out.fx.transform(

            function (v)
            {
                element.style.opacity = v;
            },
            0,
            1,
            {
                duration: duration,
                onFinish: !isAnimation ? function ()
                {
                    interpreter.waitCounter -= 1;
                } : null,
                easing: easing
            });
        }

        bus.trigger("wse.assets.mixins.show", this);

        return {
            doNext: true
        };
    };
}(WSE));