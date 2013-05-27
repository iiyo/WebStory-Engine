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
(function (engine)
{
    "use strict";
    
    function resize (ev)
    {
        this.element.setAttribute("width", this.stage.offsetWidth);
        this.element.setAttribute("height", this.stage.offsetHeight);
    }
    
    function styleElement ()
    {
        var s = this.element.style;
        
        this.element.setAttribute("id", this.cssid);
        this.element.setAttribute("class", "WSEBackground");
        this.element.style.position = "absolute";
        this.element.draggable = false;
        s.left = 0;
        s.top = 0;
        s.opacity = 0;
        s.zIndex = this.z;
    }
    
    engine.assets.Background = function (asset, interpreter)
    {
        var self = this;
        
        this.asset = asset;
        this.interpreter = interpreter;
        this.bus = interpreter.bus;
        this.stage = interpreter.stage;
        this.z = asset.z || 10;
        this.id = engine.tools.getUniqueId();
        this.cssid = "WSEBackground_" + this.id;
        this.element = document.createElement("img");
        this.src = asset.src;
        this.name = asset.name;
        
        if (!this.src)
        {
            this.bus.trigger(
                'wse.interpreter.warning',
                {
                    element: asset,
                    message: 'No source defined on background asset.'
                }
            );
            
            return;
        }
        
        engine.tools.applyAssetUnits(this, asset);
        this.element.setAttribute('src', this.src);
        styleElement.call(this);
        resize.call(this);
        window.addEventListener('resize', function () { resize.call(self); });

        this.stage.appendChild(this.element);
    };

    engine.tools.mixin(engine.assets.mixins.displayable, engine.assets.Background.prototype);

    engine.assets.Background.prototype.save = function ()
    {
        return {
            cssid: this.cssid,
            z: this.z
        };
    };

    engine.assets.Background.prototype.restore = function (obj)
    {
        this.cssid = obj.cssid;
        this.z = obj.z;
        
        try
        {
            this.element = document.getElementById(this.cssid);
        }
        catch (e)
        {
            this.bus.trigger(
                "wse.interpreter.warning",
                {
                    message: "Element with CSS ID '" + this.cssid + 
                        "' could not be found."
                }
            );
            
            return;
        }
    };
    
}(WSE));
