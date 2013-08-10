/*
    Copyright (c) 2012, 2013 The WebStory Engine Contributors
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:
    
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.

    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

    * Neither the name WebStory Engine nor the names of its contributors 
      may be used to endorse or promote products derived from this software 
      without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
    ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
    WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS BE LIABLE FOR ANY
    DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
    SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
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
        var src, image, self, triggerDecreaseFn, width, height;

        this.stage = interpreter.stage;
        this.bus = interpreter.bus;
        this.name = asset.name;
        this.id = out.tools.getUniqueId();
        this.cssid = asset.cssid || "wse_imagepack_" + this.id;
        this.interpreter = interpreter;
        out.tools.applyAssetUnits(this, asset);

        self = this;
        images = {};
        element = document.createElement("div");
        width = asset.width;
        height = asset.height;

        element.style.opacity = 0;
        element.draggable = false;

        element.setAttribute("class", "imagepack");
        element.setAttribute("id", this.cssid);

        children = asset.items;

        triggerDecreaseFn = function ()
        {
            self.bus.trigger("wse.assets.loading.decrease");
        };

        for (i = 0, len = children.length; i < len; i += 1)
        {
            current = children[i];
            name = current.name;
            src = current.src;

            if (name === null)
            {
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

            if (src === null)
            {
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

            out.tools.attachEventListener(image, 'load', triggerDecreaseFn);

            image.src = src;
            image.style.opacity = 0;
            image.style.position = "absolute";
            image.draggable = false;
            
            if (width !== null)
            {
                image.setAttribute('width', width);
            }
            
            if (height !== null)
            {
                image.setAttribute('height', height);
            }

            images[name] = this.cssid + "_" + name;
            image.setAttribute("id", images[name]);
            element.appendChild(image);

            this.bus.trigger("wse.assets.loading.increase");

        }

        element.style.position = "absolute";
        element.style.left = asset.x || 0;
        element.style.top = asset.y || 0;
        element.style.zIndex = asset.z || 0;

        this.images = images;
        this.current = null;

        this.stage.appendChild(element);

        this.bus.trigger("wse.assets.imagepack.constructor", this);
    };

    out.tools.mixin(out.assets.mixins.displayable, out.assets.Imagepack.prototype);

    out.assets.Imagepack.prototype.set = function (command, args)
    {
        var image, name, self, old, duration, isAnimation, bus = this.bus;

        args = args || {};
        command = command || {};
        self = this;
        name = command.image;
        duration = command.duration || 400;
        isAnimation = args.animation === true ? true : false;

        if (name === null)
        {
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

        image = document.getElementById(this.images[name]);

        if (typeof image === "undefined" || image === null)
        {
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

    out.assets.Imagepack.prototype.save = function ()
    {
        var cur, key, images, name, obj;
        
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

        obj = {
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
        
        return obj;
    };

    out.assets.Imagepack.prototype.restore = function (save)
    {
        var name;
        
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
                saves: save
            }
        );
    };
}(WSE));
