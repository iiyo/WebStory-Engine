
var tools = require("../tools/tools");
var assets = require("../assets");
var functions = require("../functions");
var DisplayObject = require("../DisplayObject");

function Button (asset, interpreter) {
    
    var el, cssid, x, y, z, clickFn, text;
    
    DisplayObject.call(this);
    
    // read the preferences from the definition:
    x = asset.getAttribute("x") || 0;
    y = asset.getAttribute("y") || 0;
    z = asset.getAttribute("z") || 10000;
    cssid = asset.getAttribute("cssid") || "WSEButton" + this.id;
    text = asset.getAttribute("text") || "";
    
    tools.applyAssetUnits(this, asset);
    
    el = document.createElement("div");
    
    el.setAttribute("id", cssid);
    el.setAttribute("class", "WSEButton button");
    
    el.style.position = "absolute";
    el.style.left = x;
    el.style.top = y;
    el.style.zIndex = z;
    el.style.opacity = 0;
    el.innerHTML = text;
    
    this.x = x;
    this.y = y;
    this.z = z;
    
    this.cssid = cssid;
    this.bus = interpreter.bus;
    this.interpreter = interpreter;
    
    clickFn = function (ev) {
        ev.stopPropagation();
        ev.preventDefault();
        functions.savegames(interpreter);
    };
    
    el.addEventListener('click', clickFn);
    
    interpreter.stage.appendChild(el);
}

Button.prototype = new DisplayObject();

Button.prototype.save = function () {
    return {
        assetType: "Button",
        cssid: this.cssid
    };
};

Button.prototype.restore = function (obj) {
    this.cssid = obj.cssid;
};

assets.Button = Button;

module.exports = Button;
