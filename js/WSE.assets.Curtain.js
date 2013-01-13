(function (out)
{
    out.assets.Curtain = function (asset, interpreter)
    {
        this.asset = asset;
        this.interpreter = interpreter;
        this.bus = interpreter.bus;
        this.stage = interpreter.stage;
        this.color = asset.getAttribute("color") || "black";
        this.z = asset.getAttribute("z") || 20000;
        this.id = out.tools.getUniqueId();
        this.cssid = "WSECurtain_" + this.id;
        this.element = document.createElement("div");

        this.element.setAttribute("id", this.cssid);
        this.element.setAttribute("class", "WSECurtain");
        this.element.style.position = "absolute";
        this.element.style.left = 0;
        this.element.style.top = 0;
        this.element.style.width = this.stage.offsetWidth + "px";
        this.element.style.height = this.stage.offsetHeight + "px";
        this.element.style.opacity = 0;
        this.element.style.backgroundColor = this.color;
        this.element.style.zIndex = this.z;

        this.stage.appendChild(this.element);
    };

    out.assets.Curtain.prototype.set = function (asset)
    {
        this.color = asset.getAttribute("color") || "black";
        this.element.style.backgroundColor = this.color;
    };

    out.assets.Curtain.prototype.show = out.assets.mixins.show;
    out.assets.Curtain.prototype.hide = out.assets.mixins.hide;
    out.assets.Curtain.prototype.move = out.assets.mixins.move;
    out.assets.Curtain.prototype.flash = out.assets.mixins.flash;
    out.assets.Curtain.prototype.flicker = out.assets.mixins.flicker;

    out.assets.Curtain.prototype.save = function (obj)
    {
        obj[this.id] = {
            color: this.color,
            cssid: this.cssid,
            z: this.z
        };
    };

    out.assets.Curtain.prototype.restore = function (obj)
    {
        this.color = obj[this.id].color;
        this.cssid = obj[this.id].cssid;
        this.z = obj[this.id].z;
        
        try
        {
            this.element = document.getElementById(this.cssid);
        }
        catch (e)
        {
            this.bus.trigger("wse.interpreter.warning",
            {
                message: "Element with CSS ID '" + this.cssid + "' could not be found."
            });
            return;
        }
        
        this.element.style.backgroundColor = this.color;
        this.element.style.zIndex = this.z;
    };
    
}(WSE));