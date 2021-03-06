/* global using */

var warn = require("../tools/tools").warn;
var DisplayObject = require("../DisplayObject");

function Curtain (asset) {
    
    DisplayObject.apply(this, arguments);
    
    this.asset = asset;
    this.color = asset.getAttribute("color") || "black";
    this.z = asset.getAttribute("z") || 20000;
    this.cssid = this.cssid || "WSECurtain_" + this.id;
    
    this.element.setAttribute("class", "asset WSECurtain");
    this.element.style.left = 0;
    this.element.style.top = 0;
    this.element.style.width = this.stage.offsetWidth + "px";
    this.element.style.height = this.stage.offsetHeight + "px";
    this.element.style.opacity = 0;
    this.element.style.backgroundColor = this.color;
}

Curtain.prototype = Object.create(DisplayObject.prototype);

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

module.exports = Curtain;
