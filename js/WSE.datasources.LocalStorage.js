(function (out)
{
    out.datasources = {};
    
    out.datasources.LocalStorage = function ()
    {};
    
    out.datasources.LocalStorage.prototype.set = function (key, value)
    {
        localStorage.setItem(key, value);
    };
    
    out.datasources.LocalStorage.prototype.get = function (key)
    {
        return localStorage.getItem(key);
    };
    
    out.datasources.LocalStorage.prototype.remove = function (key)
    {
        return localStorage.removeItem(key);
    };
    
}(WSE));