
var warn = require("../tools/tools").warn;
var DisplayObject = require("../DisplayObject");

function resize (self) {
    self.element.setAttribute("width", self.stage.offsetWidth);
    self.element.setAttribute("height", self.stage.offsetHeight);
}

function styleElement (self) {
    
    var s = self.element.style;
    
    self.element.setAttribute("id", self.cssid);
    self.element.setAttribute("class", "WSEBackground");
    self.element.style.position = "absolute";
    self.element.draggable = false;
    s.left = 0;
    s.top = 0;
    s.opacity = 0;
    s.zIndex = self.z;
}

function Background (asset) {
    
    this.elementType = "img";
    
    DisplayObject.apply(this, arguments);
    
    var self = this;
    
    this.asset = asset;
    this.cssid = this.cssid || "WSEBackground_" + this.id;
    this.src = asset.getAttribute('src');
    
    if (!this.src) {
        warn(this.bus, 'No source defined on background asset.', asset);
        return;
    }
    
    this.element.setAttribute('src', this.src);
    
    styleElement(this);
    resize(this);
    
    window.addEventListener('resize', function () { resize(self); });
}

Background.prototype = Object.create(DisplayObject.prototype);

Background.prototype.save = function () {
    return {
        cssid: this.cssid,
        z: this.z
    };
};

Background.prototype.restore = function (obj) {
    
    this.cssid = obj.cssid;
    this.z = obj.z;
    
    try {
        this.element = document.getElementById(this.cssid);
    }
    catch (e) {
        warn(this.bus, "Element with CSS ID '" + this.cssid + "' could not be found.");
        return;
    }
};

module.exports = Background;
