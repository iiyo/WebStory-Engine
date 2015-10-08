/* global using */

using("WSE.DisplayObject", "WSE.tools", "MO5.transform", "MO5.easing").
define("WSE.assets.Imagepack", function (DisplayObject, tools, transform, easing) {
    
    "use strict";
    
    /**
     * Constructor function for ImagePacks.
     * 
     * @param asset [DOM Element] The asset definition.
     * @param interpreter [WSE.Interpreter] The interpreter object.
     */
    function Imagepack (asset, interpreter)
    {
        var element, images, children, i, len, current, name;
        var src, image, self, triggerDecreaseFn, width, height, x, y, xUnit, yUnit;
        
        DisplayObject.call(this);
        
        this.stage = interpreter.stage;
        this.bus = interpreter.bus;
        this.name = asset.getAttribute("name");
        this.cssid = asset.getAttribute("cssid") || "wse_imagepack_" + this.name;
        this.interpreter = interpreter;
        this.xAnchor = asset.getAttribute("xAnchor");
        this.yAnchor = asset.getAttribute("yAnchor");
        this.width = parseInt(asset.getAttribute("width"), 10) || 100;
        this.height = parseInt(asset.getAttribute("height"), 10) || 100;
        
        tools.applyAssetUnits(this, asset);
        
        self = this;
        images = {};
        element = document.createElement("div");
        width = asset.getAttribute('width');
        height = asset.getAttribute('height');
        
        element.style.opacity = 0;
        element.draggable = false;
        
        element.setAttribute("class", "imagepack");
        element.setAttribute("id", this.cssid);
        
        element.setAttribute("data-wse-asset-name", this.name);
        
        children = asset.getElementsByTagName("image");
        
        triggerDecreaseFn = function () {
            self.bus.trigger("wse.assets.loading.decrease");
        };
        
        for (i = 0, len = children.length; i < len; i += 1) {
            
            current = children[i];
            name = current.getAttribute("name");
            src = current.getAttribute("src");
            
            if (name === null) {
                
                this.bus.trigger(
                    "wse.interpreter.warning",
                    {
                        element: asset,
                        message: "Image without name in imagepack '" + 
                            this.name + "'."
                    }
                );
                continue;
            }
            
            if (src === null) {
                
                this.bus.trigger(
                    "wse.interpreter.warning",
                    {
                        element: asset,
                        message: "Image without src in imagepack '" + 
                            this.name + "'."
                    }
                );
                continue;
            }
            
            image = new Image();
            
            this.bus.trigger("wse.assets.loading.increase");
            tools.attachEventListener(image, 'load', triggerDecreaseFn);
            
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
            
            element.appendChild(image);
        }
        
        element.style.position = "absolute";
        element.style.zIndex = asset.getAttribute("z") || 0;
        
        this.stage.appendChild(element);
        
        x = parseInt(asset.getAttribute("x") || 0, 10);
        y = parseInt(asset.getAttribute("y") || 0, 10);
        xUnit = tools.extractUnit(asset.getAttribute("x")) || "px";
        yUnit = tools.extractUnit(asset.getAttribute("y")) || "px";
        
        if (xUnit === "%") {
            x = (this.stage.offsetWidth / 100) * x;
        }
        
        if (yUnit === "%") {
            y = (this.stage.offsetHeight / 100) * y;
        }
        
        x = tools.calculateValueWithAnchor(x, this.xAnchor, this.width);
        y = tools.calculateValueWithAnchor(y, this.yAnchor, this.height);
        
        if (xUnit === "%") {
            x = x / (this.stage.offsetWidth / 100);
        }
        
        if (yUnit === "%") {
            y = y / (this.stage.offsetHeight / 100);
        }
        
        element.style.left = "" + x + xUnit;
        element.style.top = "" + y + yUnit;
        
        this.images = images;
        this.current = null;
        
    }
    
    Imagepack.prototype = new DisplayObject();
    
    Imagepack.prototype.set = function (command, args) {
        
        var image, name, self, old, duration, isAnimation, bus = this.bus, element;
        
        args = args || {};
        self = this;
        name = command.getAttribute("image");
        duration = command.getAttribute("duration") || 400;
        isAnimation = args.animation === true ? true : false;
        
        if (name === null) {
            
            bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Missing attribute 'image' on 'do' element " +
                        "referencing imagepack '" + this.name + "'."
                }
            );
            
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
            
            bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Unknown image name on 'do' element referencing " +
                        "imagepack '" + this.name + "'."
                }
            );
            
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
                    
                    bus.trigger(
                        "wse.interpreter.warning",
                        {
                            element: command,
                            message: "Trying to set the image that is " +
                                "already set on imagepack '" + this.name + "'."
                        }
                    );
                    
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
                        easing: easing.easeInCubic
                    };
                    
                    transform(valFn, 1, 0, options).promise().
                    then(finishFn);
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
        
        var cur, key, images, name, obj;
        
        images = this.images;
        cur = this.current || null;
        name = null;
        
        for (key in images) {
            
            if (images.hasOwnProperty(key)) {
                
                if (images[key] === cur) {
                    name = key;
                }
            }
        }
        
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