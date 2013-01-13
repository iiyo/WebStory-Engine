(function (out)
{
    out.commands.sub = function (command, interpreter)
    {
        var sceneId, scene, doNext;

        interpreter.bus.trigger(
            "wse.interpreter.commands.sub",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );

        sceneId = command.getAttribute("scene") || null;
        doNext = command.getAttribute("next") === false ? false : true;

        //console.log("doNext in .sub() is: ", doNext);

        if (sceneId === null)
        {
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Missing 'scene' attribute on 'sub' command!"
                }
            );
            
            return {
                doNext: true
            };
        }

        interpreter.bus.trigger(
            "wse.interpreter.message", 
            "Entering sub scene '" + sceneId + "'...",
            false
        );

        interpreter.pushToCallStack();
        scene = interpreter.getSceneById(sceneId);

        interpreter.currentCommands = scene.childNodes;
        interpreter.index = -1;
        interpreter.sceneId = sceneId;
        interpreter.currentElement = -1;

        return {
            doNext: doNext
        };
    };    
}(WSE));