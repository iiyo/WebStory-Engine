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
    
    out.assets.mixins.displayable.show = function (command, args)
    {
        var self, duration, wait, effect, direction, ox, oy, prop, xUnit, yUnit;
        var bus, stage, element, isAnimation, easing, easingType, interpreter;
        var offsetWidth, offsetHeight, startX, startY, fx = out.fx;

        args = args || {};
        self = this;
        wait = command.getAttribute("wait") === "yes" ? true : false;
        duration = command.getAttribute("duration") || 500;
        effect = command.getAttribute("effect") || "fade";
        direction = command.getAttribute("direction") || "right";
        element = args.element || document.getElementById(this.cssid);
        xUnit = this.xUnit || 'px';
        yUnit = this.yUnit || 'px';

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

        interpreter = args.interpreter || this.interpreter;
        bus = args.bus || this.bus;
        stage = args.stage || this.stage;
        easingType = command.getAttribute("easing") || "sineEaseOut";
        easing = (typeof fx.easing[easingType] !== null) ? 
            fx.easing[easingType] : 
            fx.easing.sineEaseOut;
        isAnimation = args.animation === true ? true : false;

        if (effect === "slide")
        {
            if (xUnit === '%')
            {
                ox = element.offsetLeft / (stage.offsetWidth / 100);
                offsetWidth = 100;
            }
            else
            {
                ox = element.offsetLeft;
                offsetWidth = stage.offsetWidth;
            }
            
            if (yUnit === '%')
            {
                oy = element.offsetTop / (stage.offsetHeight / 100);
                offsetHeight = 100;
            }
            else
            {
                oy = element.offsetTop;
                offsetHeight = stage.offsetHeight;
            }
            
            switch (direction)
            {
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

            if (!isAnimation)
            {
                interpreter.waitCounter += 1;
            }
            
            if (xUnit === '%')
            {
                startX = element.offsetLeft / (stage.offsetWidth / 100);
            } 
            else 
            {
                startX = element.offsetLeft;
            }
            
            if (yUnit === '%')
            {
                startY = element.offsetTop / (stage.offsetHeight / 100);
            } 
            else 
            {
                startY = element.offsetTop;
            }
            
//             console.log('direction: ' + direction);
//             console.log('prop: ' + prop);
//             console.log('xUnit: ' + xUnit);
//             console.log('yUnit: ' + yUnit);
//             console.log('startX: ' + startX);
//             console.log('startY: ' + startY);
//             console.log('offsetWidth: ' + offsetWidth);
//             console.log('offsetHeight: ' + offsetHeight);

            fx.transform(
                function (v)
                {
                    element.style[prop] = v + (prop === 'left' ? xUnit : yUnit);
                }, 
                (prop === "left" ? startX : startY), 
                (prop === "left" ? ox : oy),
                {
                    duration: duration,
                    onFinish: !isAnimation ? 
                        function ()
                        {
                            interpreter.waitCounter -= 1;
                        } : 
                        null,
                    easing: easing
                }
            );
        }
        else
        {
            if (!isAnimation)
            {
                interpreter.waitCounter += 1;
            }

            fx.transform(
                function (v)
                {
                    element.style.opacity = v;
                },
                0,
                1,
                {
                    duration: duration,
                    onFinish: !isAnimation ? 
                        function ()
                        {
                            interpreter.waitCounter -= 1;
                        } : 
                        null,
                    easing: easing
                }
            );
        }

        bus.trigger("wse.assets.mixins.show", this);

        return {
            doNext: true
        };
    };
}(WSE));