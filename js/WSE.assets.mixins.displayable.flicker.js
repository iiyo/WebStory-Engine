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
        command = command || {};
        duration = command.duration || 500;
        times = command.times || 10;
        maxOpacity = command.opacity || 1;
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