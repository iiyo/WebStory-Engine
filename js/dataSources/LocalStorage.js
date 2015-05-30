/* global MO5 */

MO5().define("WSE.dataSources.LocalStorage", function () {
    
    "use strict";
    
    function LocalStorageDataSource ()
    {};
    
    LocalStorageDataSource.prototype.set = function (key, value) {
        localStorage.setItem(key, value);
    };
    
    LocalStorageDataSource.prototype.get = function (key) {
        return localStorage.getItem(key);
    };
    
    LocalStorageDataSource.prototype.remove = function (key) {
        return localStorage.removeItem(key);
    };
    
    return LocalStorageDataSource;
    
});