/* global using */

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
define("WSE.assets.Composite", function (
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
     * Constructor function for Composites.
     * 
     * @param asset [DOM Element] The asset definition.
     * @param interpreter [WSE.Interpreter] The interpreter object.
     */
    function Composite (asset) {
        
        var element, children;
        var self, triggerDecreaseFn, width, height;
        
        this._boxSizeSelectors = ["img"];
        
        DisplayObject.apply(this, arguments);
        
        this.cssid = this.cssid || "wse_composite_" + this.name;
        
        self = this;
        element = this.element;
        width = this.width;
        height = this.height;
        
        element.setAttribute("class", "asset composite");
        
        children = asset.getElementsByTagName("image");
        triggerDecreaseFn =
            self.bus.trigger.bind(self.bus, "wse.assets.loading.decrease", null, false);
        
        [].forEach.call(children, function (current) {
            
            var tags, src, image;
            
            tags = current.getAttribute("tags");
            src = current.getAttribute("src");
            
            if (tags === null) {
                warn(self.bus, "Image without tags in composite '" + self.name + "'.", asset);
                return;
            }
            
            if (src === null) {
                warn(self.bus, "Image without src in composite '" + self.name + "'.", asset);
                return;
            }
            
            image = new Image();
            
            self.bus.trigger("wse.assets.loading.increase", null, false);
            attachListener(image, 'load', triggerDecreaseFn);
            
            image.src = src;
            image.style.opacity = 0;
            image.style.position = "absolute";
            image.draggable = false;
            
            image.setAttribute("data-wse-tags", tags);
            
            if (width !== null) {
                image.setAttribute('width', width);
            }
            
            if (height !== null) {
                image.setAttribute('height', height);
            }
            
            element.appendChild(image);
            
        });
        
        this.current = [];
    }
    
    Composite.prototype = Object.create(DisplayObject.prototype);
    
    Composite.prototype.tag = function (command, args) {
        
        var self, old, duration, isAnimation, bus = this.bus, element;
        var toAdd, toRemove, imagesByTags, oldImages, newImages;
        
        args = args || {};
        self = this;
        toAdd = extractTags(command.getAttribute("add") || "");
        toRemove = extractTags(command.getAttribute("remove") || "");
        duration = command.getAttribute("duration") || 400;
        isAnimation = args.animation === true ? true : false;
        
        if (!toAdd.length && !toRemove.length) {
            
            warn(bus, "No attribute 'add' or 'remove' on element " +
                "referencing composite '" + this.name + "'. Expected at least one.", command);
            
            return {
                doNext: true
            };
        }
        
        old = this.current;
        
        if (toRemove.length && toRemove[0] === "*") {
            this.current = toAdd.slice();
        }
        else {
            
            this.current = old.filter(function (tag) {
                return toRemove.indexOf(tag) < 0;
            });
            
            toAdd.forEach(function (tag) {
                if (self.current.indexOf(tag) < 0) {
                    self.current.push(tag);
                }
            });
        }
        
        imagesByTags = getImagesByTags(this);
        oldImages = [];
        newImages = [];
        
        old.forEach(function (tag) {
            if (imagesByTags[tag]) {
                imagesByTags[tag].forEach(function (image) {
                    if (oldImages.indexOf(image) < 0) {
                        oldImages.push(image);
                    }
                });
            }
        });
        
        this.current.forEach(function (tag) {
            if (imagesByTags[tag]) {
                imagesByTags[tag].forEach(function (image) {
                    if (newImages.indexOf(image) < 0) {
                        newImages.push(image);
                    }
                });
            }
        });
        
        newImages = newImages.filter(function (image) {
            
            if (oldImages.indexOf(image) >= 0) {
                oldImages.splice(oldImages.indexOf(image), 1);
                return false;
            }
            
            return true;
        });
        
        if (!isAnimation) {
            self.interpreter.waitCounter += 1;
        }
        
        element = document.getElementById(this.cssid);
        element.style.width = highest(newImages, "offsetWidth") + "px";
        element.style.height = highest(newImages, "offsetHeight") + "px";
        
        (function () {
            
            var valFn, finishFn, options;
            
            valFn = function (v) {
                newImages.forEach(function (image) {
                    image.style.opacity = v;
                });
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
                
                function timeoutFn () {
                    
                    var options; 
                    
                    function valFn (v) {
                        oldImages.forEach(function (image) {
                            image.style.opacity = v;
                        });
                    }
                    
                    function finishFn () {
                        if (!isAnimation) {
                            self.interpreter.waitCounter -= 1;
                        }
                    }
                    
                    options = {
                        duration: duration,
                        easing: easing.cubicIn
                    };
                    
                    transform(1, 0, valFn, options, finishFn);
                }
                
                timeoutFn();
            }());
        }
        
        return {
            doNext: true
        };
    };
    
    Composite.prototype.save = function () {
        
        var cur, obj;
        
        cur = this.current || [];
        
        obj = {
            assetType: "Composite",
            current: cur,
            cssid: this.cssid,
            xAnchor: this.xAnchor,
            yAnchor: this.yAnchor,
            z: this.z
        };
        
        this.bus.trigger(
            "wse.assets.composite.save",
            {
                subject: this,
                saves: obj
            }
        );
        
        return obj;
    };
    
    Composite.prototype.restore = function (save) {
        
        this.cssid = save.cssid;
        this.z = save.z;
        this.current = save.current.slice();
        this.xAnchor = save.xAnchor;
        this.yAnchor = save.yAnchor;
        
        this.element = document.getElementById(this.cssid);
        this.element.style.zIndex = this.z;
        
        this.bus.trigger(
            "wse.assets.composite.restore",
            {
                subject: this,
                saves: save
            }
        );
    };
    
    return Composite;
    
    function getImagesByTags (self) {
        
        var images, imagesByTag;
        
        images = document.getElementById(self.cssid).getElementsByTagName("img");
        imagesByTag = {};
        
        [].forEach.call(images, function (image) {
            
            var tags = extractTags(image.getAttribute("data-wse-tags") || "");
            
            tags.forEach(function (tag) {
                
                if (!Array.isArray(imagesByTag[tag])) {
                    imagesByTag[tag] = [];
                }
                
                imagesByTag[tag].push(image);
            });
        });
        
        return imagesByTag;
    }
    
    function extractTags (raw) {
        return raw.split(",").map(function (rawTag) {
            return rawTag.trim();
        });
    }
    
    function highest (all, key) {
        
        var biggest = 0;
        
        all.forEach(function (item) {
            if (item[key] > biggest) {
                biggest = item[key];
            }
        });
        
        return biggest;
    }
    
});
