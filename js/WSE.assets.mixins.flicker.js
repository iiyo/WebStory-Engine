(function (out)
{
    out.assets.mixins.flicker = function (command, args)
    {
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

        if (!element)
        {
            this.bus.trigger("wse.interpreter.warning",
            {
                element: command,
                message: "DOM Element for asset is missing!"
            });
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

        //         console.log("CSS ID: " + this.cssid, element);

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
            out.fx.transform(

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
                    out.fx.transform(

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
                        easing: out.fx.easing.easeInQuad
                    });
                },
                easing: out.fx.easing.easeInQuad
            });
        };
        fn();

        bus.trigger("wse.assets.mixins.flicker", this);

        return {
            doNext: true
        };
    };
}(WSE));