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
    
    out.commands.assets = function (command, interpreter)
    {
        var assets, len, i, cur;
        var createAsset;

        interpreter.bus.trigger("wse.assets.loading.started");

        interpreter.bus.trigger(
            "wse.interpreter.commands.assets",
            {
                interpreter: interpreter,
                command: command
            },
            false
        );
        //         interpreter.game.subscribeListeners();

        try
        {
            assets = command.items;
        }
        catch (e)
        {
            interpreter.bus.trigger(
                "wse.interpreter.error",
                {
                    message: "Error while creating assets: " + e.getMessage()
                }
            );
        }

        len = assets.length;

        createAsset = function (asset)
        {
            var name, type, self, bus = interpreter.bus;
            var xmlObj; // temporary, for use with XML DOM conversion

            interpreter.bus.trigger(
                "wse.interpreter.createasset",
                {
                    interpreter: interpreter,
                    asset: asset
                },
                false
            );

            name = asset.name;
            type = asset.type;

            if (name === null)
            {
                interpreter.bus.trigger(
                    "wse.interpreter.error",
                    {
                        element: asset,
                        message: "Expected attribute 'name'."
                    }
                );
                
                return;
            }

            if (type === null)
            {
                interpreter.bus.trigger(
                    "wse.interpreter.warning",
                    {
                        element: asset,
                        message: "Expected attribute 'type' on asset '" + name + "'."
                    }
                );
                
                return;
            }

            if (typeof interpreter.assets[name] !== "undefined")
            {
                interpreter.bus.trigger(
                    "wse.interpreter.warning",
                    {
                        element: asset,
                        message: "Trying to override existing asset '" + name + "'."
                    }
                );
            }

            type = out.tools.firstLetterUppercase(type);

            if (type in out.assets)
            {
                interpreter.assets[name] = new out.assets[type](asset, interpreter);
                return;
            }
            
            else
            {
                interpreter.bus.trigger(
                    "wse.interpreter.warning",
                    {
                        element: asset,
                        message: "Unknown asset type '" + type + "'."
                    }
                );
                
                return;
            }
        };

        for (i = 0; i < len; i += 1)
        {
            cur = assets[i];
            createAsset(cur);
        }
        
        return {
            doNext: true
        };

    };
    
}(WSE));
