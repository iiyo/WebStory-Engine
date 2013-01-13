(function (out)
{
    out.commands["do"] = function (command, interpreter, args)
    {
        var assetName, action, isAnimation;
        
        args = args || {};

        interpreter.bus.trigger(
            "wse.interpreter.commands.do",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );

        assetName = command.getAttribute("asset");
        action = command.getAttribute("action");
        isAnimation = args.animation || false;

        if (assetName === null)
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Element of type 'do' must have an attribute 'asset'. Element ignored."
                }
            );
            
            return;
        }

        if (action === null)
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Element of type 'do' must have an attribute 'action'. Element ignored."
                }
            );
            
            return;
        }

        if (typeof interpreter.assets[assetName] === "undefined" || interpreter.assets[assetName] === null)
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Reference to unknown asset '" + assetName + "'."
                }
            );
            
            return {
                doNext: true
            };
        }

        if (typeof interpreter.assets[assetName][action] === "undefined")
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Action '" + action + "' is not defined for asset '" + assetName + "'."
                }
            );
            
            return {
                doNext: true
            };
        }

        return interpreter.assets[assetName][action](command, args);
    };    
}(WSE));