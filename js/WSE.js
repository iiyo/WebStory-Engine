/* global using */

using("databus", "WSE.assets", "WSE.commands", "WSE.dataSources", "WSE.functions").
define("WSE", function (DataBus, assets, commands, dataSources, functions) {
    
    "use strict";
    
    var WSE = {}, version = "2016.7.0-final.1607281539";
    
    DataBus.inject(WSE);
    
    WSE.dataSources = dataSources;
    WSE.assets = assets;
    WSE.commands = commands;
    WSE.functions = functions;
    
    WSE.getVersion = function () {
        return version;
    };
    
    return WSE;
    
});