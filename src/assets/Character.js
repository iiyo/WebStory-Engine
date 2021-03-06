
function Character (asset, interpreter) {
    
    this.asset = asset;
    this.stage = interpreter.stage;
    this.bus = interpreter.bus;
    this.name = asset.getAttribute('name');
    this.bus.trigger("wse.assets.character.constructor", this);
}

Character.prototype.setTextbox = function (command) {
    this.asset.setAttribute("textbox", command.getAttribute("textbox"));
    this.bus.trigger("wse.assets.character.settextbox", this);
};

Character.prototype.save = function () {
    
    var obj = {
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
    
    return obj;
};

Character.prototype.restore = function (obj) {
    
    this.asset.setAttribute("textbox", obj.textboxName);
    
    this.bus.trigger(
        "wse.assets.character.restore",
        {
            subject: this,
            saves: obj
        }
    );
};

module.exports = Character;
