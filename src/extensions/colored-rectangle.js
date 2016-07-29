/* global using */

using("WSE.assets", "WSE.DisplayObject", "WSE.tools").
define("WSE.assets.Rectangle", function (assets, DisplayObject, tools) {
    
    "use strict";
    
    console.log('Loading extension colored-rectangle...');
    
    // An asset constructor is given the XML element that defines the asset instance
    // and a reference to the interpreter object:
    function Rectangle (asset, interpreter) {
        
        DisplayObject.call(this);
        
        var el, cssid, width, height, x, y, z, color;
        
        // read the preferences from the definition:
        width = asset.getAttribute("width") || "200px";
        height = asset.getAttribute("height") || "100px";
        x = asset.getAttribute("x") || 0;
        y = asset.getAttribute("y") || 0;
        z = asset.getAttribute("z") || 10000;
        color = asset.getAttribute("color") || "red";
        cssid = asset.getAttribute("cssid") || "WseRectangle" + this.id;
        
        tools.applyAssetUnits(this, asset);
        
        el = document.createElement("div");
        
        el.setAttribute("id", cssid);
        el.setAttribute("class", "WseRectangle");
        
        el.style.backgroundColor = color;
        el.style.position = "absolute";
        el.style.left = x;
        el.style.top = y;
        el.style.zIndex = z;
        el.style.width = width;
        el.style.height = height;
        
        // the rectangle should only be visible when the show command
        // has been used on it; therefore, make the element invisible at start:
        el.style.opacity = 0;
        
        this.cssid = cssid; // this is needed for the mixin functions
        this.color = color;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.z = z;
        
        // also needed for mixin functions:
        this.bus = interpreter.bus;
        this.interpreter = interpreter;
        
        // the interpreter holds a reference to the stage element:
        interpreter.stage.appendChild(el);
    };
    
    Rectangle.prototype = new DisplayObject();

    // This function will be called when a savegame is created.
    // Use it to save whatever information needs to be saved.
    Rectangle.prototype.save = function () {
        
        // use the unique ID to identify the savegame data
        // for the current asset instance:
        return {
            assetType: "Rectangle",
            cssid: this.cssid
        };
    };

    // You can use this function to restore the asset instance's state.
    // The function will be called when a user attempts to load a savegame.
    Rectangle.prototype.restore = function (obj) {
        
        // restore whatever needs to be restored here...
        this.cssid = obj.cssid;
    };
    
    // Add the asset to WSE's assets, so that the interpreter can use it:
    assets.Rectangle = Rectangle;
    
    // Return the constructor so that other assets can use it as a base class:
    return Rectangle;
    
});
