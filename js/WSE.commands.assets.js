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
        //var createAsset, buildLoadingScreen, iself = this;

		interpreter.buildLoadingScreen();

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
            assets = command.assets;
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

        for (i = 0; i < len; i += 1)
        {
            cur = assets[i];
            
            if (cur.nodeType !== 1)
            {
                continue;
            }
            
            this.createAsset(cur);
        }
        
        this.bus.trigger("wse.assets.loading.finished");        
        
        return {
            doNext: true
        };


/*
		buildLoadingScreen = function ()
		{
			var loadScreen, self, fn;

			loadScreen = document.createElement("div");
			loadScreen.setAttribute("id", "WSELoadingScreen");
			loadScreen.style.zIndex = 10000;
			loadScreen.style.width = "100%";
			loadScreen.style.height = "100%";

			loadScreen.innerHTML = '' + 
				'<div class="container">' + 
					'<div class="heading">' + 
						'<span id="WSELoadingScreenPercentage"></span>' + 
						'Loading...' + 
					'</div>' + 
					'<div class="progressBar">' + 
						'<div class="progress" id="WSELoadingScreenProgress" style="width: 100%;">' + 
						'</div>' + 
					'</div>' + 
				'</div>';

			interpreter.game.stage.appendChild(loadScreen);

			fn = function ()
			{
				var el, el2, perc;
				
				try
				{
					el = document.getElementById("WSELoadingScreenProgress");
					el2 = document.getElementById("WSELoadingScreenPercentage");
					perc = parseInt((interpreter.assetsLoaded / interpreter.assetsLoadingMax) * 100, 10);
					
					if (interpreter.assetsLoadingMax < 1)
					{
						perc = 0;
					}
					
					el.style.width = perc + "%";
					el2.innerHTML = "" + interpreter.assetsLoaded + "/" + interpreter.assetsLoadingMax + " (" + perc + "%)";
				}
				catch (e)
				{
					//console.log("Element missing.");
				}
			};

			this.bus.subscribe(fn, "wse.assets.loading.increase");
			this.bus.subscribe(fn, "wse.assets.loading.decrease");

			this.loadScreen = loadScreen;
		};
*/
		createAsset = function (asset)
		{
			var name, type, self, bus = iself.bus;
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
				interpreter.assets[name] = new out.assets[type](asset, this);
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

    };


	
}(WSE));
