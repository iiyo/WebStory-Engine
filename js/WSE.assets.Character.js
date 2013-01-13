(function (out)
{
    "use strict";
    
    out.assets.Character = function (asset, interpreter)
    {
        this.asset = asset;
        this.stage = interpreter.stage;
        this.bus = interpreter.bus;
        this.id = out.tools.getUniqueId();
        this.bus.trigger("wse.assets.character.constructor", this);
    };

    out.assets.Character.prototype.setTextbox = function (command)
    {
        this.asset.setAttribute("textbox", command.getAttribute("textbox"));
        this.bus.trigger("wse.assets.character.settextbox", this);
    };

    out.assets.Character.prototype.save = function (obj)
    {
        obj[this.id] = {
            assetType: "Character",
            textboxName: this.asset.getAttribute("textbox")
        };
        
        this.bus.trigger(
            "wse.assets.character.save",
            {
                subject: this,
                saves: obj
            }
        );
    };

    out.assets.Character.prototype.restore = function (obj)
    {
        this.asset.setAttribute("textbox", obj[this.id].textboxName);
        this.bus.trigger(
            "wse.assets.character.restore",
            {
                subject: this,
                saves: obj
            }
        );
    };
}(WSE));