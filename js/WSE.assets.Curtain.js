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
    
    out.assets.Curtain = function (asset, interpreter)
    {
        this.asset = asset;
        this.interpreter = interpreter;
        this.bus = interpreter.bus;
        this.stage = interpreter.stage;
        this.color = asset.color || "black";
        this.z = asset.z || 20000;
        this.id = out.tools.getUniqueId();
        this.cssid = "WSECurtain_" + this.id;
        this.element = document.createElement("div");
        this.name = asset.name;

        this.element.setAttribute("id", this.cssid);
        this.element.setAttribute("class", "WSECurtain");
        this.element.style.position = "absolute";
        this.element.style.left = 0;
        this.element.style.top = 0;
        this.element.style.width = this.stage.offsetWidth + "px";
        this.element.style.height = this.stage.offsetHeight + "px";
        this.element.style.opacity = 0;
        this.element.style.backgroundColor = this.color;
        this.element.style.zIndex = this.z;
        out.tools.applyAssetUnits(this, asset);

        this.stage.appendChild(this.element);
    };

    out.assets.Curtain.prototype.set = function (asset)
    {
        asset = out.tools.xmlToJs(asset);
        this.color = asset.color || "black";
        this.element.style.backgroundColor = this.color;
    };

    out.tools.mixin(out.assets.mixins.displayable, out.assets.Curtain.prototype);

    out.assets.Curtain.prototype.save = function ()
    {
        return {
            color: this.color,
            cssid: this.cssid,
            z: this.z
        };
    };

    out.assets.Curtain.prototype.restore = function (obj)
    {
        this.color = obj.color;
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
                    message: "Element with CSS ID '" + this.cssid + "' could not be found."
                }
            );
            
            return;
        }
        
        this.element.style.backgroundColor = this.color;
        this.element.style.zIndex = this.z;
    };
    
}(WSE));
