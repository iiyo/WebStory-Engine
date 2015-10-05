/* global using */

(function () {
    
    var base = using.path + "../../../../";
    
    using.modules["WSE.assets"] = base + "js/assets.js";
    using.modules["WSE.assets.Animation"] = base + "js/assets/Animation.js";
    using.modules["WSE.assets.Audio"] = base + "js/assets/Audio.js";
    using.modules["WSE.assets.Background"] = base + "js/assets/Background.js";
    using.modules["WSE.assets.Character"] = base + "js/assets/Character.js";
    using.modules["WSE.assets.Curtain"] = base + "js/assets/Curtain.js";
    using.modules["WSE.assets.Imagepack"] = base + "js/assets/Imagepack.js";
    using.modules["WSE.assets.Textbox"] = base + "js/assets/Textbox.js";
    using.modules["WSE.assets.mixins.displayable.flash"] =
        base + "js/assets/mixins/displayable/flash.js";
    using.modules["WSE.assets.mixins.displayable.flicker"] =
        base + "js/assets/mixins/displayable/flicker.js";
    using.modules["WSE.assets.mixins.displayable.hide"] =
        base + "js/assets/mixins/displayable/hide.js";
    using.modules["WSE.assets.mixins.displayable.move"] = 
        base + "js/assets/mixins/displayable/move.js";
    using.modules["WSE.assets.mixins.displayable.shake"] =
        base + "js/assets/mixins/displayable/shake.js";
    using.modules["WSE.assets.mixins.displayable.show"] =
        base + "js/assets/mixins/displayable/show.js";
    
    using.modules["WSE.commands"] = base + "js/commands.js";
    using.modules["WSE.commands.alert"] = base + "js/commands/alert.js";
    using.modules["WSE.commands.break"] = base + "js/commands/break.js";
    using.modules["WSE.commands.choice"] = base + "js/commands/choice.js";
    using.modules["WSE.commands.confirm"] = base + "js/commands/confirm.js";
    using.modules["WSE.commands.do"] = base + "js/commands/do.js";
    using.modules["WSE.commands.fn"] = base + "js/commands/fn.js";
    using.modules["WSE.commands.global"] = base + "js/commands/global.js";
    using.modules["WSE.commands.globalize"] = base + "js/commands/globalize.js";
    using.modules["WSE.commands.goto"] = base + "js/commands/goto.js";
    using.modules["WSE.commands.line"] = base + "js/commands/line.js";
    using.modules["WSE.commands.localize"] = base + "js/commands/localize.js";
    using.modules["WSE.commands.prompt"] = base + "js/commands/prompt.js";
    using.modules["WSE.commands.restart"] = base + "js/commands/restart.js";
    using.modules["WSE.commands.set_vars"] = base + "js/commands/set_vars.js";
    using.modules["WSE.commands.sub"] = base + "js/commands/sub.js";
    using.modules["WSE.commands.trigger"] = base + "js/commands/trigger.js";
    using.modules["WSE.commands.var"] = base + "js/commands/var.js";
    using.modules["WSE.commands.wait"] = base + "js/commands/wait.js";
    using.modules["WSE.commands.while"] = base + "js/commands/while.js";
    using.modules["WSE.commands.with"] = base + "js/commands/with.js";
    
    using.modules["WSE.dataSources"] = base + "js/dataSources.js";
    using.modules["WSE.dataSources.LocalStorage"] = base + "js/dataSources/LocalStorage.js";
    
    using.modules["WSE.functions"] = base + "js/functions.js";
    
    using.modules["WSE.tools"] = base + "js/tools/tools.js";
    using.modules["WSE.tools.ui"] = base + "js/tools/ui.js";
    
    using.modules["WSE.Keys"] = base + "js/Keys.js";
    
    using.modules["WSE.DisplayObject"] = base + "js/DisplayObject.js";
    using.modules["WSE.Game"] = base + "js/Game.js";
    using.modules["WSE.Interpreter"] = base + "js/Interpreter.js";
    using.modules["WSE.Trigger"] = base + "js/Trigger.js";
    using.modules["WSE"] = base + "js/WSE.js";
    
}());
