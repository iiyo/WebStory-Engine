/*<ON_DEPLOY_REMOVE>*/
/* global document, WSE */
/*
    Copyright (c) 2012 - 2014 The WebStory Engine Contributors
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
/*</ON_DEPLOY_REMOVE>*/
(function (out)
{
    "use strict";
    
    out.assets.mixins.displayable.hide = function (command, args)
    {
        var self, duration, wait, effect, direction, offsetWidth, offsetHeight;
        var ox, oy, to, prop, isAnimation, element, easingType, easing, stage;
        var xUnit, yUnit, fx = out.fx;
        var parse = out.tools.getParsedAttribute;

        args = args || {};
        self = this;
        wait = parse(command, "wait", this.interpreter) === "yes" ? true : false;
        duration = parse(command, "duration", this.interpreter, 500);
        effect = parse(command, "effect", this.interpreter, "fade");
        direction = parse(command, "direction", this.interpreter, "left");
        isAnimation = args.animation === true ? true : false;
        element = document.getElementById(this.cssid);
        easingType = parse(command, "easing", this.interpreter, "sineEaseOut");
        easing = (typeof fx.easing[easingType] !== null) ? 
            fx.easing[easingType] : 
            fx.easing.sineEaseOut;
        stage = this.stage;
        xUnit = this.xUnit || 'px';
        yUnit = this.yUnit || 'px';

        if (effect === "slide")
        {
            element.style.opacity = 1;
            
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

            if (!isAnimation)
            {
                self.interpreter.waitCounter += 1;
            }

            (function ()
            {
                var valFn, from, finishFn, options;
                
                valFn = function (v)
                {
                    element.style[prop] = v + (prop === 'left' ? xUnit : yUnit);
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
                    easing: easing,
                    onFinish: finishFn
                };
                
                fx.transform(valFn, from, to, options);
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
                
                fx.transform(valFn, 1, 0, options);
            }());
        }

        this.bus.trigger("wse.assets.mixins.hide", this);

        return {
            doNext: true
        };
    };    
}(WSE));