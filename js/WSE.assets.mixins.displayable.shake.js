/*
    Copyright (c) 2012, 2013, 2014 The WebStory Engine Contributors
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
    
    out.assets.mixins.displayable.shake = function (command, args)
    {
        var dx, dy, element, self, xUnit, yUnit, duration, period;
        var easing, isAnimation, ox, oy, stage, fx = out.fx;

        args = args || {};
        self = this;
        element = document.getElementById(this.cssid);
        dx = command.getAttribute("dx");
        dy = command.getAttribute("dy");
        period = command.getAttribute("period") || 50;
        duration = command.getAttribute("duration") || 275;
        isAnimation = args.animation === true ? true : false;
        stage = this.interpreter.stage;

        if (dx !== null)
        {
            xUnit = dx.replace(/^(-){0,1}[0-9]*/, "");
            dx = parseInt(dx, 10);
        }

        if (dy !== null)
        {
            yUnit = dy.replace(/^(-){0,1}[0-9]*/, "");
            dy = parseInt(dy, 10);
        }

        if (dx === null && dy === null)
        {
            this.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Can't apply command 'shake' to asset '" + 
                        this.name + "' because no dx or dy of position " +
                        "has been supplied."
                }
            );
        }

        easing = function (d, t)
        {
            var x = t / period;
            while ( x > 2.0 )
            {
                x -= 2.0;
            }
            if  ( x > 1.0 )
            {
                x = 2.0 - x;
            }
            return x;
        }

        if (dx !== null)
        {
            if (xUnit === '%')
            {
                ox = element.offsetLeft / (stage.offsetWidth / 100);
            }
            else
            {
                ox = element.offsetLeft;
            }
            
            self.interpreter.waitCounter += 1;

            fx.transform(
                function (v)
                {
                    element.style.left = v + xUnit;
                },
                ox - dx,
                ox + dx,
                {
                    onFinish: function ()
                              {
                                  element.style.left = ox + xUnit;
                                  self.interpreter.waitCounter -= 1;
                              },
                    duration: duration,
                    easing:   easing
                }
            );
        }

        if (dy !== null)
        {
            if (yUnit === '%')
            {
                oy = element.offsetTop / (stage.offsetHeight / 100);
            }
            else
            {
                oy = element.offsetTop;
            }
            
            self.interpreter.waitCounter += 1;

            fx.transform(
                function (v)
                {
                    element.style.top = v + yUnit;
                },
                oy - dy,
                oy + dy,
                {
                    onFinish: function ()
                              {
                                  element.style.top = oy + yUnit;
                                  self.interpreter.waitCounter -= 1;
                              },
                    duration: duration,
                    easing:   easing
                }
            );
        }

        this.bus.trigger("wse.assets.mixins.shake", this);

        return {
            doNext: true
        };
    };    
}(WSE));