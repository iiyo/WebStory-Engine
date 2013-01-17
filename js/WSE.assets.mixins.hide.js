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