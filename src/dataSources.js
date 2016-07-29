/* global using */

using("WSE.dataSources.LocalStorage").
define("WSE.dataSources", function (LocalStorageDataSource) {
    
    var dataSources = {
        LocalStorage: LocalStorageDataSource
    };
    
    return dataSources;
    
});