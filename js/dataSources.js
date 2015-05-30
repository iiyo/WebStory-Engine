/* global MO5 */

MO5("WSE.dataSources.LocalStorage").
define("WSE.dataSources", function (LocalStorageDataSource) {
    
    var dataSources = {
        LocalStorage: LocalStorageDataSource
    };
    
    return dataSources;
    
});