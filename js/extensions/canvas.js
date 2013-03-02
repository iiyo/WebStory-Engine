(function (engine)
{
    "use strict";
    
    console.log('Loading extension canvas...');
    
    (function ()
    {
        var fn;
        
        fn = function (game) 
        { 
            game.interpreter.canvas = new engine.fx.canvas.Canvas();
        };
        
        engine.subscribe(fn, "wse.interpreter.constructor");
    }());
    
    // An asset constructor is given the XML element that defines the asset instance
    // and a reference to the interpreter object:
    engine.assets.CanvasImagePack = function (asset, interpreter)
    {
        var el, id, cssid, width, height, x, y, z, color;
        
        // generate a unique ID for this asset:
        id = engine.tools.getUniqueId();
        
        // read the preferences from the definition:
        width = asset.getAttribute("width") || "200px";
        height = asset.getAttribute("height") || "100px";
        x = asset.getAttribute("x") || 0;
        y = asset.getAttribute("y") || 0;
        z = asset.getAttribute("z") || 10000;
        color = asset.getAttribute("color") || "red";
        cssid = asset.getAttribute("cssid") || "WseRectangle" + id;
        
        el = document.createElement("div");
        
        el.setAttribute("id", cssid);
        el.setAttribute("class", "WseRectangle");
        
        el.style.backgroundColor = color;
        el.style.position = "absolute";
        el.style.left = x;
        el.style.top = y;
        el.style.zIndex = z;
        el.style.width = width;
        el.style.height = height;
        
        // the rectangle should only be visible when the show command
        // has been used on it; therefore, make the element invisible at start:
        el.style.opacity = 0;
        
        this.cssid = cssid; // this is needed for the mixin functions
        this.id = id;
        this.color = color;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.z = z;
        
        // also needed for mixin functions:
        this.bus = interpreter.bus;
        this.interpreter = interpreter;
        
        // the interpreter holds a reference to the stage element:
        interpreter.stage.appendChild(el);
    };

    engine.tools.mixin(engine.assets.mixins.displayable, engine.assets.CanvasImagePack.prototype);
}(WSE));