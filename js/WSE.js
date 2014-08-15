/*<ON_DEPLOY_REMOVE>*/
/* global console, XMLHttpRequest, Squiddle, MO5, STEINBECK */
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
/*</ON_DEPLOY_REMOVE>*/
var WSE = (function (Squiddle, MO5, STEINBECK)
{
    "use strict";
    
    var out = {}, version = "0.4.0";
    
    out.fx = MO5;
    out.Keys = STEINBECK.Keys;
    Squiddle.inject(out);
    
    out.ajax = {};
    out.datasources = {};
    out.assets = {};
    out.assets.mixins = {
        displayable: {}
    };
    
    out.getVersion = function ()
    {
        return version;
    };
    
    console.log('WebStory Engine version ' + out.getVersion() + ' starting up...');
    
    /**
     * Function to asynchronously load the WebStory file.
     * @param url The URL that locates the WebStory file.
     * @param cb A callback function to execute when the file has been fetched.
     */
    out.ajax.get = function (url, cb)
    {
        url = url + "?random=" + Math.random();
        //console.log("Requesting remote file: " + url);
        var http = new XMLHttpRequest();
        http.onreadystatechange = function ()
        {
            //console.log("AJAX state change occured.");
            if (http.readyState === 4 && http.status === 200)
            {
                //console.log("File fetched.");
                cb(http);
            }
            if (http.readyState === 4 && http.status !== 200)
            {
                throw new Error("WSE: Cannot load XML file.");
            }
        };
        if (http.overrideMimeType)
        {
            http.overrideMimeType("text/xml");
        }
        http.open("GET", url, true);
        http.send();
    };
    
    out.functions = {
        
        savegames: function (interpreter)
        {
            interpreter.toggleSavegameMenu();
        },
        
        stageclick_disable: function (interpreter)
        {
            interpreter.game.unsubscribeListeners();
        },
        
        stageclick_enable: function (interpreter)
        {
            interpreter.game.subscribeListeners();
        },
        
        execute: function (interpreter, command) {
            
            var commands = [].slice.call(command.children).filter(function (child) {
                if (child.tagName &&
                        out.functions.execute.allowedCommands.indexOf(child.tagName) >= 0) {
                    
                    return true;
                }
            });
            
            commands.forEach(function (varCommand) {
                interpreter.runCommand(varCommand);
            });
        }
        
    };
    
    out.functions.execute.allowedCommands = [
        "var", "global", "localize", "globalize", "set_vars", "move", "hide", "show",
        "flash", "flicker", "shake", "play", "set", "fn", "restart", "trigger",
        "confirm", "alert", "prompt", "with"
    ];
    
    return out;

}(
typeof Squiddle === "undefined" ? false : Squiddle,
typeof MO5 === "undefined" ? false : MO5,
typeof STEINBECK === "undefined" ? false : STEINBECK));