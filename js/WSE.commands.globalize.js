(function (out)
{
    out.commands.globalize = function (command, interpreter)
    {
        var key;

        key = command.getAttribute("name") || null;

        if (key === null)
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "No variable name defined on globalize element."
                }
            );
            
            return {
                doNext: true
            };
        }

        if (typeof interpreter.runVars[key] === "undefined" || interpreter.runVars[key] === null)
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Undefined local variable."
                }
            );
            
            return {
                doNext: true
            };
        }

        interpreter.globalVars.set(key, interpreter.runVars[key]);

        return {
            doNext: true
        };
    };    
}(WSE));