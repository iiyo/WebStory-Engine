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
    out.assets.mixins.flash = function (command, args)
    {
        var self, duration, wait, bus, stage, element, isAnimation, maxOpacity;

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

        if (!isAnimation)
        {
            self.interpreter.waitCounter += 1;
        }

        out.fx.transform(
            function (v)
            {
                element.style.opacity = v;
            },
            0,
            maxOpacity,
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
                        easing: out.fx.easing.easeInQuad
                    };
                
                    out.fx.transform(tranformFn, maxOpacity, 0, argsObj);
                },
                easing: out.fx.easing.easeInQuad
            }
        );

        bus.trigger("wse.assets.mixins.flash", this);

        return {
            doNext: true
        };
    };
}(WSE));