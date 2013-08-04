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
   
    out.services.gamedata.Web = function (args, callback)
    {
        args = args || null;
        if (typeof args !== 'null') 
        {
            this.load(args, callback);
        }
    };

    out.services.gamedata.Web.prototype.ajaxPost = function(req, id, callback) {

        var xmlHttp = new XMLHttpRequest()
            , parameters = req + "=" + id
        ;

        xmlHttp.open("POST", this.url, true);

        xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        xmlHttp.onreadystatechange = function()
        {
            if(xmlHttp.readyState == 4 && xmlHttp.status == 200)
            {
                callback(JSON.parse(xmlHttp.responseText));
            }
        }

        xmlHttp.send(parameters);
    };

    out.services.gamedata.Web.prototype.load = function (args, callback)
    {
        var iself;
        
        this.url = args.url;
        this.data = null;
        this.scenes = null;
        
        iself = this;
        this.ajaxPost('s', args.game, 
            function (data)
            {
                iself.settings = {
                    stages: data.stages,
                    triggers: data.triggers,
                    options: data.options
                };

                if (callback && typeof(callback) === "function") 
                {
                    callback(iself.settings);
                }
            }
        );
    };

    out.services.gamedata.Web.prototype.getTriggers = function ()
    {
        return this.settings.triggers;
    };

    out.services.gamedata.Web.prototype.getScene = function (id, input, callback)
    {
        // Add code here to handle input variable
        this.ajaxPost('n', id,
            function (data)
            {
                callback({ id: id, commands: data });
            }
        );
    };
    
}(WSE));
