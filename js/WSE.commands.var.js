(function (out)
{
    out.commands["var"] = function (command, interpreter)
    {
        var key, val, action, container;

        interpreter.bus.trigger(
            "wse.interpreter.commands.var",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );

        key = command.getAttribute("name") || null;
        val = command.getAttribute("value") || null;
        action = command.getAttribute("action") || "set";

        if (key === null)
        {
            interpreter.bus.trigger("wse.interpreter.warning",
            {
                element: command,
                message: "Command 'var' must have a 'name' attribute."
            });
            return {
                doNext: true
            };
        }

        if (action !== "set" && action !== "delete" && action !== "increase" && action !== "decrease" && action !== "print")
        {
            interpreter.bus.trigger("wse.interpreter.warning",
            {
                element: command,
                message: "Unknown action '" + action + "' defined on 'var' command."
            });
            return {
                doNext: true
            };
        }

        container = interpreter.runVars;

        if (action !== "set" && !(key in container))
        {
            interpreter.bus.trigger("wse.interpreter.warning",
            {
                element: command,
                message: "Undefined variable."
            });
            return {
                doNext: true
            };
        }

        switch (action)
        {
        case "delete":
            delete container[key];
            break;
        case "increase":
            container[key]++;
            break;
        case "decrease":
            container[key]--;
            break;
        case "print":
            interpreter.bus.trigger("wse.interpreter.message", "Variable '" + key + "' is: " + container[key]);
            break;
        default:
            container[key] = "" + val;
        }

        return {
            doNext: true
        };
    };    
}(WSE));