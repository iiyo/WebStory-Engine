/* global using, console */

using(
    "transform-js::transform",
    "eases",
    "WSE.DisplayObject",
    "WSE.tools::applyAssetUnits",
    "WSE.tools::attachEventListener",
    "WSE.tools::extractUnit",
    "WSE.tools::calculateValueWithAnchor",
    "WSE.tools::warn"
).
define("WSE.assets.Imagepack", function (
    transform,
    easing,
    DisplayObject,
    applyUnits,
    attachListener,
    extractUnit,
    anchoredValue,
    warn
) {
    
    "use strict";
    
    /**
     * Constructor function for ImagePacks.
     * 
     * @param asset [DOM Element] The asset definition.
     * @param interpreter [WSE.Interpreter] The interpreter object.
     */
    function Imagepack (asset) {
        
        var images, children, i, len, current, name;
        var src, image, self, triggerDecreaseFn, width, height;
        
        this._boxSizeSelectors = ["img"];
        
        DisplayObject.apply(this, arguments);
        
        this.cssid = this.cssid || "wse_imagepack_" + this.name;
        
        self = this;
        images = {};
        width = asset.getAttribute('width');
        height = asset.getAttribute('height');
        
        this.element.setAttribute("class", "asset imagepack");
        
        children = asset.getElementsByTagName("image");
        triggerDecreaseFn =
            self.bus.trigger.bind(self.bus, "wse.assets.loading.decrease", null, false);
        
        for (i = 0, len = children.length; i < len; i += 1) {
            
            current = children[i];
            name = current.getAttribute("name");
            src = current.getAttribute("src");
            
            if (name === null) {
                warn(this.bus, "Image without name in imagepack '" + this.name + "'.", asset);
                continue;
            }
            
            if (src === null) {
                warn(this.bus, "Image without src in imagepack '" + this.name + "'.", asset);
                continue;
            }
            
            image = new Image();
            
            this.bus.trigger("wse.assets.loading.increase", null, false);
            attachListener(image, 'load', triggerDecreaseFn);
            
            image.src = src;
            image.style.opacity = 0;
            image.style.position = "absolute";
            image.draggable = false;
            
            image.setAttribute("data-wse-asset-image-name", name);
            
            if (width !== null) {
                image.setAttribute('width', width);
            }
            
            if (height !== null) {
                image.setAttribute('height', height);
            }
            
            images[name] = this.cssid + "_" + name;
            image.setAttribute("id", images[name]);
            
            this.element.appendChild(image);
        }
        
        this.images = images;
        this.current = null;
        
    }
    
    Imagepack.prototype = Object.create(DisplayObject.prototype);
    
    Imagepack.prototype.set = function (command, args) {
        
        var image, name, self, old, duration, isAnimation, bus = this.bus, element;
        
        args = args || {};
        self = this;
        name = command.getAttribute("image");
        duration = command.getAttribute("duration") || 400;
        isAnimation = args.animation === true ? true : false;
        
        if (name === null) {
            
            warn(bus, "Missing attribute 'image' on 'do' element " +
                "referencing imagepack '" + this.name + "'.", command);
            
            return {
                doNext: true
            };
        }
        
        try {
            image = document.getElementById(this.images[name]);
        }
        catch (e) {
            console.error("DOM Element for Image " + name + " on Imagepack " +
                this.name + " not found!", e);
        }
        
        if (typeof image === "undefined" || image === null) {
            
            warn(bus, "Unknown image name on 'do' element referencing " +
                "imagepack '" + this.name + "'.", command);
            
            return {
                doNext: true
            };
        }
        
        old = this.current;
        
        for (var key in this.images) {
            
            if (this.images.hasOwnProperty(key)) {
                
                if (key !== name) {
                    continue;
                }
                
                if (key === old) {
                    
                    warn(bus, "Trying to set the image that is already set on imagepack '" +
                        this.name + "'.", command);
                    
                    return {
                        doNext: true
                    };
                }
            }
        }
        
        if (!isAnimation) {
            self.interpreter.waitCounter += 1;
        }
        
        element = document.getElementById(this.cssid);
        element.style.width = image.offsetWidth + "px";
        element.style.height = image.offsetHeight + "px";
        
        (function () {
            
            var valFn, finishFn, options;
            
            valFn = function (v) {
                image.style.opacity = v;
            };
            
            finishFn = function () {
                
                if (!isAnimation) {
                    self.interpreter.waitCounter -= 1;
                }
            };
            
            options = {
                duration: duration,
                easing: easing.cubicOut
            };
            
            transform(0, 1, valFn, options, finishFn);
        }());
        
        if (this.current !== null) {
            
            if (!isAnimation) {
                self.interpreter.waitCounter += 1;
            }
            
            (function () {
                
                var timeoutFn;
                
                timeoutFn = function() {
                    
                    var oldEl, valFn, finishFn, options; 
                    
                    oldEl = document.getElementById(self.images[old]);
                    
                    valFn = function (v) {
                        oldEl.style.opacity = v;
                    };
                    
                    finishFn = function () {
                        
                        if (!isAnimation) {
                            self.interpreter.waitCounter -= 1;
                        }
                    };
                    
                    options = {
                        duration: duration,
                        easing: easing.cubicIn
                    };
                    
                    transform(1, 0, valFn, options, finishFn);
                };
                
                timeoutFn();
            }());
        }
        
        this.current = name;
        
        return {
            doNext: true
        };
    };
    
    Imagepack.prototype.save = function () {
        
        var cur, images, obj;
        
        images = this.images;
        cur = this.current || null;
        
        obj = {
            assetType: "Imagepack",
            current: cur,
            cssid: this.cssid,
            images: images,
            xAnchor: this.xAnchor,
            yAnchor: this.yAnchor,
            z: this.z
        };
        
        this.bus.trigger(
            "wse.assets.imagepack.save",
            {
                subject: this,
                saves: obj
            }
        );
        
        return obj;
    };
    
    Imagepack.prototype.restore = function (save) {
        
        var name;
        
        name = save.current;
        this.cssid = save.cssid;
        this.z = save.z;
        this.current = name;
        this.xAnchor = save.xAnchor;
        this.yAnchor = save.yAnchor;
        
        document.getElementById(this.cssid).style.zIndex = this.z;
        
        this.bus.trigger(
            "wse.assets.imagepack.restore",
            {
                subject: this,
                saves: save
            }
        );
    };
    
    return Imagepack;
    
});
