/* global using */

using("WSE.DisplayObject", "WSE.tools::applyAssetUnits", "WSE.tools::warn").
define("WSE.assets.Curtain", function (DisplayObject, applyUnits, warn) {
    
    "use strict";
    
    function Curtain (asset, interpreter) {
        
        DisplayObject.call(this);
        
        this.asset = asset;
        this.interpreter = interpreter;
        this.bus = interpreter.bus;
        this.stage = interpreter.stage;
        this.color = asset.getAttribute("color") || "black";
        this.z = asset.getAttribute("z") || 20000;
        this.cssid = "WSECurtain_" + this.id;
        this.element = document.createElement("div");
        this.name = asset.getAttribute('name');

        this.element.setAttribute("id", this.cssid);
        this.element.setAttribute("class", "WSECurtain");
        this.element.style.position = "absolute";
        this.element.style.left = 0;
        this.element.style.top = 0;
        this.element.style.width = this.stage.offsetWidth + "px";
        this.element.style.height = this.stage.offsetHeight + "px";
        this.element.style.opacity = 0;
        this.element.style.backgroundColor = this.color;
        this.element.style.zIndex = this.z;
        
        applyUnits(this, asset);
        
        this.stage.appendChild(this.element);
    };
    
    Curtain.prototype = new DisplayObject();
    
    Curtain.prototype.set = function (asset) {
        this.color = asset.getAttribute("color") || "black";
        this.element.style.backgroundColor = this.color;
    };
    
    Curtain.prototype.save = function () {
        return {
            color: this.color,
            cssid: this.cssid,
            z: this.z
        };
    };

    Curtain.prototype.restore = function (obj) {
        
        this.color = obj.color;
        this.cssid = obj.cssid;
        this.z = obj.z;
        
        try {
            this.element = document.getElementById(this.cssid);
        }
        catch (e) {
            warn(this.bus, "Element with CSS ID '" + this.cssid + "' could not be found.");
            return;
        }
        
        this.element.style.backgroundColor = this.color;
        this.element.style.zIndex = this.z;
    };
    
    return Curtain;
    
});