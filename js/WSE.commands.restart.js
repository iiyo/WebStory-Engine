(function (out)
{
    out.commands.restart = function (command, interpreter)
    {
        interpreter.bus.trigger(
            "wse.interpreter.commands.restart",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );

        interpreter.bus.trigger("wse.interpreter.message", "Restarting game...", false);
        interpreter.bus.trigger("wse.interpreter.restart", interpreter, false);

        interpreter.runVars = {};
        interpreter.log = [];
        interpreter.visitedScenes = [];
        interpreter.startTime = Math.round(+new Date() / 1000);
        interpreter.waitCounter = 0;
        interpreter.state = "listen";
        interpreter.stage.innerHTML = "";

        this.assets = {};
        interpreter.buildAssets();

        return {
            doNext: true,
            changeScene: interpreter.scenes[0]
        };
    };
}(WSE));