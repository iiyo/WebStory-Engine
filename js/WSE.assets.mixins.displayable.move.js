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
    
    out.assets.mixins.displayable.move = function (command, args)
    {
        var x, y, z, element, self, wait, xUnit, yUnit, duration, easingType;
        var easing, waitX, waitY, waitZ, isAnimation, ox, oy, stage, fx = out.fx;

        args = args || {};
        self = this;
        command = command || {};
        element = document.getElementById(this.cssid);
        x = command.x || null;
        y = command.y || null;
        z = command.z || null;
        duration = command.duration || 500;
        easingType = command.easing || "sineEaseOut";
        easing = (typeof fx.easing[easingType] !== null) ? 
            fx.easing[easingType] : 
            fx.easing.sineEaseOut;
        isAnimation = args.animation === true ? true : false;
        stage = this.interpreter.stage;

        if (x !== null)
        {
            xUnit = x.replace(/^(-){0,1}[0-9]*/, "");
            x = parseInt(x, 10);
        }

        if (y !== null)
        {
            yUnit = y.replace(/^(-){0,1}[0-9]*/, "");
            y = parseInt(y, 10);
        }

        wait = command.wait || "no";
        wait = wait === "yes" ? true : false;
        waitX = false;
        waitY = false;
        waitZ = false;

        if (x === null && y === null && z === null)
        {
            this.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Can't apply command 'move' to asset '" + 
                        this.name + "' because no x, y or z position " +
                        "has been supplied."
                }
            );
        }

        if (x !== null)
        {
            if (xUnit === '%')
            {
                ox = element.offsetLeft / (stage.offsetWidth / 100);
            }
            else
            {
                ox = element.offsetLeft;
            }
            
            if (!isAnimation)
            {
                self.interpreter.waitCounter += 1;
            }

            fx.transform(
                function (v)
                {
                    element.style.left = v + xUnit;
                },
                ox,
                x,
                {
                    onFinish: !isAnimation ? 
                        function ()
                        {
                            self.interpreter.waitCounter -= 1;
                        } : 
                        null,
                    duration: duration,
                    easing: easing
                }
            );
        }

        if (y !== null)
        {   
            if (yUnit === '%')
            {
                oy = element.offsetTop / (stage.offsetHeight / 100);
            }
            else
            {
                oy = element.offsetTop;
            }
            
            if (!isAnimation)
            {
                self.interpreter.waitCounter += 1;
            }

            fx.transform(
                function (v)
                {
                    element.style.top = v + yUnit;
                },
                oy,
                y,
                {
                    onFinish: !isAnimation ? 
                        function ()
                        {
                            self.interpreter.waitCounter -= 1;
                        } : 
                        null,
                    duration: duration,
                    easing: easing
                }
            );
        }

        if (z !== null)
        {
            if (!isAnimation)
            {
                self.interpreter.waitCounter += 1;
            }

            fx.transform(
                function (v)
                {
                    element.style.zIndex = v;
                },
                element.style.zIndex || 0,
                parseInt(z, 10),
                {
                    onFinish: !isAnimation ? 
                        function ()
                        {
                            self.interpreter.waitCounter -= 1;
                        } : 
                        null,
                    duration: duration,
                    easing: easing
                }
            );
        }

        this.bus.trigger("wse.assets.mixins.move", this);

        return {
            doNext: true
        };
    };    
}(WSE));
