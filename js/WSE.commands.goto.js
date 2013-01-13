(function (out)
{
    out.commands.goto = function (command, interpreter)
    {
        var scene, sceneName, i, len, current;

        interpreter.bus.trigger(
            "wse.interpreter.commands.goto",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );

        sceneName = command.getAttribute("scene");

        if (sceneName === null)
        {
            interpreter.bus.trigger(
                "wse.interpreter.error",
                {
                    message: "Element 'goto' misses attribute 'scene'."
                }
            );
        }

        for (i = 0, len = interpreter.scenes.length; i < len; i += 1)
        {
            current = interpreter.scenes[i];
            
            if (current.getAttribute("id") === sceneName)
            {
                scene = current;
                break;
            }
        }

        if (typeof scene === "undefined")
        {
            interpreter.bus.trigger(
                "wse.interpreter.error",
                {
                    message: "Unknown scene '" + sceneName + "'."
                }
            );
            
            return;
        }

        return {
            changeScene: scene
        };
    };    
}(WSE));