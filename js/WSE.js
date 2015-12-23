/* global using */

using("MO5.EventBus", "WSE.assets", "WSE.commands", "WSE.dataSources", "WSE.functions").
define("WSE", function (EventBus, assets, commands, dataSources, functions) {
    
    "use strict";
    
    var WSE = {}, version = "2015.12.1-final.1512231127";
    
    EventBus.inject(WSE);
    
    WSE.dataSources = dataSources;
    WSE.assets = assets;
    WSE.commands = commands;
    WSE.functions = functions;
    
    WSE.getVersion = function () {
        return version;
    };
    
    return WSE;
    
});