(function (out)
{
    out.commands.fn = function (command, interpreter)
    {
        var name, varName, ret;
        
        name = command.getAttribute("name") || null;
        varName = command.getAttribute("tovar") || null;

        if (typeof out.functions[name] !== "function")
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "No name supplied on fn element."
                }
            );
            
            return {
                doNext: true
            };
        }

        if (typeof out.functions[name] !== "function")
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Unknown function '" + name + "'."
                }
            );
            
            return {
                doNext: true
            };
        }

        ret = out.functions[name](interpreter);

        if (varName !== null)
        {
            interpreter.runVars[varName] = "" + ret;
        }

        return {
            doNext: true
        };
    };
}(WSE));