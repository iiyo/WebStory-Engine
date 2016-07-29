/* global using */

using("MO5.Map").define("WSE.dataSources.LocalStorage", function (Dict) {
    
    "use strict";
    
    var testKey = "___wse_storage_test";
    var localStorageEnabled = false;
    var data;
    
    try {
        
        localStorage.setItem(testKey, "works");
        
        if (localStorage.getItem(testKey) === "works") {
            localStorageEnabled = true;
        }
    }
    catch (error) {
        
        console.error("LocalStorage not available, using JS object as fallback.");
        
        data = new Dict();
    }
    
    function LocalStorageDataSource () {}
    
    LocalStorageDataSource.prototype.set = function (key, value) {
        
        if (!localStorageEnabled) {
            data.set(key, value);
        }
        else {
            localStorage.setItem(key, value);
        }
    };
    
    LocalStorageDataSource.prototype.get = function (key) {
        
        if (!localStorageEnabled) {
            
            if (!data.has(key)) {
                return null;
            }
            
            return data.get(key);
        }
        
        return localStorage.getItem(key);
    };
    
    LocalStorageDataSource.prototype.remove = function (key) {
        
        if (!localStorageEnabled) {
            
            if (!data.has(key)) {
                return;
            }
            
            return data.remove(key);
        }
        
        return localStorage.removeItem(key);
    };
    
    return LocalStorageDataSource;
    
});