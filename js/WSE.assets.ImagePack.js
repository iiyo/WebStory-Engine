(function (out)
{
    "use strict";
    
    /**
     * Constructor function for ImagePacks.
     * 
     * @param asset [DOM Element] The asset definition.
     * @param interpreter [WSE.Interpreter] The interpreter object.
     */
    out.assets.Imagepack = function (asset, interpreter)
    {
        var element, images, children, i, len, current, name;
        var src, image, self, triggerDecreaseFn;

        this.stage = interpreter.stage;
        this.bus = interpreter.bus;
        this.name = asset.getAttribute("name");
        this.id = out.tools.getUniqueId();
        this.cssid = "wse_imagepack_" + this.id;
        this.interpreter = interpreter;

        self = this;
        images = {};
        element = document.createElement("div");

        element.style.opacity = 0;
        element.draggable = false;

        element.setAttribute("class", "imagepack");
        element.setAttribute("id", this.cssid);

        children = asset.getElementsByTagName("image");

        triggerDecreaseFn = function ()
        {
            self.bus.trigger("wse.assets.loading.decrease");
        };

        for (i = 0, len = children.length; i < len; i += 1)
        {
            current = children[i];
            name = current.getAttribute("name");
            src = current.getAttribute("src");

            if (name === null)
            {
                this.bus.trigger(
                    "wse.interpreter.warning",
                    {
                        element: asset,
                        message: "Image without name in imagepack '" + this.name + "'."
                    }
                );
                continue;
            }

            if (src === null)
            {
                this.bus.trigger(
                    "wse.interpreter.warning",
                    {
                        element: asset,
                        message: "Image without src in imagepack '" + this.name + "'."
                    }
                );
                continue;
            }

            image = new Image();

            this.bus.trigger("wse.assets.loading.increase");
            out.tools.attachEventListener(image, 'load', triggerDecreaseFn);

            image.src = src;
            image.style.opacity = 0;
            image.style.position = "absolute";
            image.draggable = false;

            images[name] = this.cssid + "_" + name;
            image.setAttribute("id", images[name]);
            element.appendChild(image);
        }

        element.style.position = "absolute";
        element.style.left = asset.getAttribute("x") || 0;
        element.style.top = asset.getAttribute("y") || 0;
        element.style.zIndex = asset.getAttribute("z") || 0;

        this.images = images;
        this.current = null;

        this.stage.appendChild(element);

        this.bus.trigger("wse.assets.imagepack.constructor", this);
    };

    out.assets.Imagepack.prototype.move = out.assets.mixins.move;
    out.assets.Imagepack.prototype.show = out.assets.mixins.show;
    out.assets.Imagepack.prototype.hide = out.assets.mixins.hide;
    out.assets.Imagepack.prototype.flash = out.assets.mixins.flash;
    out.assets.Imagepack.prototype.flicker = out.assets.mixins.flicker;

    out.assets.Imagepack.prototype.set = function (command, args)
    {
        var image, name, self, old, duration, isAnimation;

        args = args || {};
        self = this;
        name = command.getAttribute("image");
        duration = command.getAttribute("duration") || 400;
        isAnimation = args.animation === true ? true : false;

        if (name === null)
        {
            this.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Missing attribute 'image' on 'do' element referencing imagepack '" + this.name + "'."
                }
            );
            return {
                doNext: true
            };
        }

        image = document.getElementById(this.images[name]);

        if (typeof image === "undefined" || image === null)
        {
            this.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Unknown image name on 'do' element referencing imagepack '" + this.name + "'."
                }
            );
            return {
                doNext: true
            };
        }

        old = this.current;

        for (var key in this.images)
        {
            if (this.images.hasOwnProperty(key))
            {
                if (key !== name)
                {
                    continue;
                }
                
                if (key === old)
                {
                    this.bus.trigger(
                        "wse.interpreter.warning",
                        {
                            element: command,
                            message: "Trying to set the image that is already set on imagepack '" + this.name + "'."
                        }
                    );
                    
                    return {
                        doNext: true
                    };
                }
            }
        }

        if (!isAnimation)
        {
            self.interpreter.waitCounter += 1;
        }
        
        (function ()
        {
            var valFn, finishFn, options;
            
            valFn = function (v)
            {
                image.style.opacity = v;
            };
            
            finishFn = function ()
            {
                if (!isAnimation)
                {
                    self.interpreter.waitCounter -= 1;
                }
            };
            
            options = {
                duration: duration / 2,
                easing: out.fx.easing.linear,
                onFinish: finishFn
            };
            
            out.fx.transform(valFn, 0, 1, options);
        }());

        if (this.current !== null)
        {
            if (!isAnimation)
            {
                self.interpreter.waitCounter += 1;
            }
            
            (function ()
            {
                var timeoutFn;
                
                timeoutFn = function()
                {
                    var oldEl, valFn, finishFn, options; 
                    
                    oldEl = document.getElementById(self.images[old]);
                    
                    valFn = function (v)
                    {
                        oldEl.style.opacity = v;
                    };
                    
                    finishFn = function ()
                    {
                        if (!isAnimation)
                        {
                            self.interpreter.waitCounter -= 1;
                        }
                    };
                    
                    options = {
                        duration: duration,
                        easing: out.fx.easing.linear,
                        onFinish: finishFn
                    };
                    
                    out.fx.transform(valFn, 1, 0, options);
                };
                
                setTimeout(timeoutFn, duration / 2);
            }());
        }

        this.current = name;

        return {
            doNext: true
        };
    };

    out.assets.Imagepack.prototype.save = function (obj)
    {
        var cur, key, images, name;
        images = this.images;
        cur = this.current || null;
        name = null;

        for (key in images)
        {
            if (images.hasOwnProperty(key))
            {
                if (images[key] === cur)
                {
                    name = key;
                }
            }
        }

        obj[this.id] = {
            assetType: "Imagepack",
            current: name,
            cssid: this.cssid,
            images: images,
            z: this.z
        };
        
        this.bus.trigger(
            "wse.assets.imagepack.save",
            {
                subject: this,
                saves: obj
            }
        );
    };

    out.assets.Imagepack.prototype.restore = function (obj)
    {
        var name, save;
        
        save = obj[this.id];
        name = save.current;
        this.cssid = save.cssid;
        this.z = save.z;

        document.getElementById(this.cssid).style.zIndex = this.z;

        if (name !== null && this.images[name] !== null)
        {
            this.current = this.images[name];
        }

        this.bus.trigger(
            "wse.assets.imagepack.restore",
            {
                subject: this,
                saves: obj
            }
        );
    };
}(WSE));