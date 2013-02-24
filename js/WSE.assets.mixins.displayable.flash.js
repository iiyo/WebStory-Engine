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
    out.assets.mixins.displayable.flash = function (command, args)
    {
        var self, duration, wait, bus, stage, element, isAnimation, maxOpacity, fx = out.fx;

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

        fx.transform(
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
                        easing: fx.easing.easeInQuad
                    };
                
                    fx.transform(tranformFn, maxOpacity, 0, argsObj);
                },
                easing: fx.easing.easeInQuad
            }
        );

        bus.trigger("wse.assets.mixins.flash", this);

        return {
            doNext: true
        };
    };
}(WSE));