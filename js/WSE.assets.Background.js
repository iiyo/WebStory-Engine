/* global document, window, WSE */
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
    
    function resize (self)
    {
        self.element.setAttribute("width", self.stage.offsetWidth);
        self.element.setAttribute("height", self.stage.offsetHeight);
    }
    
    function styleElement (self)
    {
        var s = self.element.style;
        
        self.element.setAttribute("id", self.cssid);
        self.element.setAttribute("class", "WSEBackground");
        self.element.style.position = "absolute";
        self.element.draggable = false;
        s.left = 0;
        s.top = 0;
        s.opacity = 0;
        s.zIndex = self.z;
    }
    
    engine.assets.Background = function (asset, interpreter)
    {
        var self = this;
        
        this.asset = asset;
        this.interpreter = interpreter;
        this.bus = interpreter.bus;
        this.stage = interpreter.stage;
        this.z = asset.getAttribute("z") || 10;
        this.id = engine.tools.getUniqueId();
        this.cssid = "WSEBackground_" + this.id;
        this.element = document.createElement("img");
        this.src = asset.getAttribute('src');
        this.name = asset.getAttribute('name');
        
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
        styleElement(this);
        resize(this);
        window.addEventListener('resize', function () { resize(self); });

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