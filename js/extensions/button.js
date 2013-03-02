(function (engine)
{
    "use strict";
    
    console.log('Loading extension button...');
    
    engine.assets.Button = function (asset, interpreter)
    {
        var el, id, cssid, width, height, x, y, z, clickFn, text;
        
        // generate a unique ID for this asset:
        id = engine.tools.getUniqueId();
        
        // read the preferences from the definition:
        width = asset.getAttribute("width") || "20px";
        height = asset.getAttribute("height") || "20px";
        x = asset.getAttribute("x") || 0;
        y = asset.getAttribute("y") || 0;
        z = asset.getAttribute("z") || 10000;
        cssid = asset.getAttribute("cssid") || "WSEButton" + id;
        text = asset.getAttribute("text") || "";
        engine.tools.applyAssetUnits(this, asset);
        
        el = document.createElement("div");
        
        el.setAttribute("id", cssid);
        el.setAttribute("class", "WSEButton button");
        
        el.style.position = "absolute";
        el.style.left = x;
        el.style.top = y;
        el.style.zIndex = z;
//         el.style.width = width;
//         el.style.height = height;
        el.style.opacity = 0;
        el.innerHTML = text;
        
        this.id = id;
//         this.width = width;
//         this.height = height;
        this.x = x;
        this.y = y;
        this.z = z;
        
        // needed for mixin functions:
        this.cssid = cssid;
        this.bus = interpreter.bus;
        this.interpreter = interpreter;
        
        clickFn = function (ev)
        {
            ev.stopPropagation();
            ev.preventDefault();
            engine.functions.savegames(interpreter);
        };
        
        engine.tools.attachEventListener(el, 'click', clickFn);
        
        interpreter.stage.appendChild(el);
    };

    engine.assets.Button.prototype.save = function ()
    {
        return {
            assetType: "Button",
            cssid: this.cssid
        };
    };

    engine.assets.Button.prototype.restore = function (obj)
    {
        this.cssid = obj.cssid;
    };

    engine.tools.mixin(engine.assets.mixins.displayable, engine.assets.Button.prototype);
}(WSE));