(function (out)
{
    out.commands["break"] = function (command, interpreter)
    {
        interpreter.bus.trigger(
            "wse.interpreter.commands.break",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );
        //         interpreter.game.subscribeListeners();
        
        return {
            doNext: false,
            wait: true
        };
    };
    
}(WSE));