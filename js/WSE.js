var WSE = (function (Squiddle, MO5, STEINBECK)
{
    "use strict";
    
    var out = {};
    
    out.fx = MO5;
    out.Keys = STEINBECK.Keys;
    Squiddle.inject(out);
    
    out.ajax = {};
    out.datasources = {};
    out.assets = {};
    out.assets.mixins = {};
    
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
        }
        
    };
    
    return out;

}(
typeof Squiddle === "undefined" ? false : Squiddle,
typeof MO5 === "undefined" ? false : MO5,
typeof STEINBECK === "undefined" ? false : STEINBECK));