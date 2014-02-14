/* global console, WSE */
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
    
    out.Trigger = function (trigger, interpreter)
    {
        var self = this, fn;

        this.name = trigger.getAttribute("name") || null;
        this.event = trigger.getAttribute("event") || null;
        this.special = trigger.getAttribute("special") || null;
        this.fnName = trigger.getAttribute("function") || null;
        this.scene = trigger.getAttribute("scene") || null;
        this.interpreter = interpreter;
        this.isSubscribed = false;

        if (this.name === null)
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: trigger,
                    message: "No 'name' attribute specified on 'trigger' element."
                }
            );
            
            return;
        }

        if (this.event === null)
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: trigger,
                    message: "No 'event' attribute specified on 'trigger' element '" + this.name + "'."
                }
            );
            
            return;
        }

        if (this.special === null && this.fnName === null && this.scene === null)
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: trigger,
                    message: "No suitable action or function found for trigger element '" + this.name + "'."
                }
            );
            
            return;
        }
        
        if (this.scene)
        {
            this.fn = function ()
            {
                console.log('Triggering event "' + self.event + '"...');
                out.commands.sub(trigger, interpreter);
            };
            return;
        }

        this.isKeyEvent = false;
        this.key = null;

        // FIXME: can this be deleted?
        //
        //         if (this.sub !== null)
        //         {
        //             fn = function ()
        //             {
        //                 if (self.interpreter.state === "pause" || self.interpreter.waitCounter > 0)
        //                 {
        //                     return;
        //                 }
        //                 var sub = interpreter.game.ws.createElement("sub");
        //                 sub.setAttribute("scene", self.sub);
        // //                 sub.setAttribute("next", "false");
        //                 interpreter.commands.sub(sub, interpreter);
        //                 interpreter.next();
        //             };
        //         }

        if (this.special !== null && this.special !== "next")
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: trigger,
                    message: "Unknown special specified on trigger element '" + this.name + "'."
                }
            );
            
            return;
        }

        if (this.special === "next")
        {
            fn = function ()
            {
                if (self.interpreter.state === "pause" || self.interpreter.waitCounter > 0)
                {
                    return;
                }
                
                self.interpreter.next();
            };
        }

        if (this.fnName !== null)
        {
            if (typeof out.functions[this.fnName] !== "function")
            {
                interpreter.bus.trigger("wse.interpreter.warning",
                {
                    element: trigger,
                    message: "Unknown function specified on trigger element '" + this.name + "'."
                });
                return;
            }
            
            fn = function ()
            {
                out.functions[self.fnName](self.interpreter);
            };
        }

        switch (this.event)
        {
            case "keyup":
            case "keydown":
            case "keypress":
                
                this.isKeyEvent = true;
                this.key = trigger.getAttribute("key") || null;

                if (this.key === null)
                {
                    interpreter.bus.trigger(
                        "wse.interpreter.warning",
                        {
                            element: trigger,
                            message: "No 'key' attribute specified on trigger element '" + this.name + "'."
                        }
                    );
                
                    return;
                }

                if (
                    typeof interpreter.game.keys.keys[this.key] === "undefined" ||
                    interpreter.game.keys.keys[this.key] === null
                )
                {
                    interpreter.bus.trigger(
                        "wse.interpreter.warning",
                        {
                            element: trigger,
                            message: "Unknown key '" + this.key + "' specified on trigger element '" + this.name + "'."
                        }
                    );
                
                    return;
                }

                this.fn = function (data)
                {
                    if (data.keys[self.key].kc !== data.event.keyCode)
                    {
                        return;
                    }
                
                    if (interpreter.keysDisabled > 0)
                    {
                        return;
                    }
                
                    fn();
                };

                return;
            
            default:
                this.fn = fn;
        }
    };

    out.Trigger.prototype.activate = function ()
    {
        if (this.isSubscribed === true)
        {
            return;
        }

        this.interpreter.bus.subscribe(this.fn, this.event);
        this.isSubscribed = true;
    };

    out.Trigger.prototype.deactivate = function ()
    {
        if (this.isSubscribed === false)
        {
            return;
        }

        this.interpreter.bus.unsubscribe(this.fn, this.event);
        this.isSubscribed = false;
    };

}(WSE));