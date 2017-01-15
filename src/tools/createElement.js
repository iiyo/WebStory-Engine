/* global using */

using("enjoy-core::free", "enjoy-core::bind", "enjoy-core::keys", "enjoy-core::each").
define("WSE.tools.createElement", function (free, bind, keys, each) {
    
    var setAttribute = free(HTMLElement.prototype.setAttribute);
    
    function copyItem (source, target, key) {
        target[key] = source[key];
    }
    
    function copyItemIfExists (source, target, key) {
        if (key in source) {
            copyItem(source, target, key);
        }
    }
    
    function copyAll (source, target) {
        if (source) {
            copySome(source, target, keys(source));
        }
    }
    
    function copySome (source, target, keys) {
        each(bind(copyItemIfExists, source, target), keys);
    }
    
    function createElement (options) {
        
        var element = document.createElement(options.tagName || "div");
        var attributes = options.attributes || {};
        
        if (options.classes) {
            attributes["class"] = options.classes;
        }
        
        each(bind(setAttribute, element), attributes);
        copySome(options, element, ["value", "innerHTML"]);
        each(function (key) { copyAll(options[key], element[key]); }, ["style"]);
        
        return element;
    }
    
    return createElement;
});
