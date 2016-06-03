/* global using */

using(
    "MO5.transform",
    "MO5.easing",
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
    function Composite (asset, interpreter)
    {
        var element, children, i, len, current, name;
        var src, image, self, triggerDecreaseFn, width, height, x, y, xUnit, yUnit;
        
        DisplayObject.call(this);
        
        this.stage = interpreter.stage;
        this.bus = interpreter.bus;
        this.name = asset.getAttribute("name");
        this.cssid = asset.getAttribute("cssid") || "wse_composite_" + this.name;
        this.interpreter = interpreter;
        this.xAnchor = asset.getAttribute("xAnchor");
        this.yAnchor = asset.getAttribute("yAnchor");
        this.width = parseInt(asset.getAttribute("width"), 10) || 100;
        this.height = parseInt(asset.getAttribute("height"), 10) || 100;
        
        applyUnits(this, asset);
        
        self = this;
        element = document.createElement("div");
        width = asset.getAttribute('width');
        height = asset.getAttribute('height');
        
        element.style.opacity = 0;
        element.draggable = false;
        
        element.setAttribute("class", "composite");
        element.setAttribute("id", this.cssid);
        
        element.setAttribute("data-wse-asset-name", this.name);
        
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
        
        element.style.position = "absolute";
        element.style.zIndex = asset.getAttribute("z") || 0;
        
        this.stage.appendChild(element);
        
        x = parseInt(asset.getAttribute("x") || 0, 10);
        y = parseInt(asset.getAttribute("y") || 0, 10);
        xUnit = extractUnit(asset.getAttribute("x")) || "px";
        yUnit = extractUnit(asset.getAttribute("y")) || "px";
        
        if (xUnit === "%") {
            x = (this.stage.offsetWidth / 100) * x;
        }
        
        if (yUnit === "%") {
            y = (this.stage.offsetHeight / 100) * y;
        }
        
        x = anchoredValue(x, this.xAnchor, this.width);
        y = anchoredValue(y, this.yAnchor, this.height);
        
        if (xUnit === "%") {
            x = x / (this.stage.offsetWidth / 100);
        }
        
        if (yUnit === "%") {
            y = y / (this.stage.offsetHeight / 100);
        }
        
        element.style.left = "" + x + xUnit;
        element.style.top = "" + y + yUnit;
        
        this.current = [];
        this.element = element;
        
    }
    
    Composite.prototype = new DisplayObject();
    
    Composite.prototype.tag = function (command, args) {
        
        var images, self, old, duration, isAnimation, bus = this.bus, element;
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
                easing: easing.easeOutCubic
            };
            
            transform(valFn, 0, 1, options).promise().
            then(finishFn);
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
                        easing: easing.easeInCubic
                    };
                    
                    transform(valFn, 1, 0, options).promise().
                    then(finishFn);
                }
                
                timeoutFn();
            }());
        }
        
        console.log(this);
        
        return {
            doNext: true
        };
    };
    
    Composite.prototype.save = function () {
        
        var cur, key, images, obj;
        
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
        tis.element.style.zIndex = this.z;
        
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