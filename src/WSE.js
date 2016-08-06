/* global using */

using("databus", "WSE.assets", "WSE.commands", "WSE.dataSources", "WSE.functions").
define("WSE", function (DataBus, assets, commands, dataSources, functions) {
    
    "use strict";
    
    var WSE = {}, version = "%%%version%%%";
    
    DataBus.inject(WSE);
    
    WSE.instances = [];
    
    WSE.dataSources = dataSources;
    WSE.assets = assets;
    WSE.commands = commands;
    WSE.functions = functions;
    
    WSE.getVersion = function () {
        return version;
    };
    
    return WSE;
    
});