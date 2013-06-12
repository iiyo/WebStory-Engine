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
    
    out.assets.Character = function (asset, interpreter)
    {
        var displayName;
        
        this.asset = asset;
        this.stage = interpreter.stage;
        this.bus = interpreter.bus;
        this.id = out.tools.getUniqueId();
        this.name = asset.name;
        this.textbox = asset.textbox;
        
        /*try 
        {
            [].forEach.call(asset.childNodes, function (node)
            {
                if (node.tagName && node.tagName === 'displayname')
                {
                    displayName = node.textContent;
                }
            });
            
            this.displayName = displayName;
        }
        catch (e)
        {
            console.log(e);
            this.displayName = null;
        }*/
        
        this.bus.trigger("wse.assets.character.constructor", this);
    };

    out.assets.Character.prototype.setTextbox = function (command)
    {
        this.asset.textbox = command.textbox;
        this.bus.trigger("wse.assets.character.settextbox", this);
    };

    out.assets.Character.prototype.save = function ()
    {
        var obj = {
            assetType: "Character",
            textboxName: this.asset.textbox
        };
        
        this.bus.trigger(
            "wse.assets.character.save",
            {
                subject: this,
                saves: obj
            }
        );
        
        return obj;
    };

    out.assets.Character.prototype.restore = function (obj)
    {
        this.asset.textbox = obj.textboxName;
        this.bus.trigger(
            "wse.assets.character.restore",
            {
                subject: this,
                saves: obj
            }
        );
    };
}(WSE));
