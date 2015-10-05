/* global using */

using().define("WSE.commands.do", function () {
    
    "use strict";
    
    function doCommand (command, interpreter, args) {
        
        var assetName, action, isAnimation, bus = interpreter.bus, assets = interpreter.assets;
        
        args = args || {};
        
        bus.trigger(
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
        
        if (assetName === null) {
            
            bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Element of type 'do' must have an attribute 'asset'. Element ignored."
                }
            );
            
            return;
        }
        
        if (action === null) {
            
            bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Element of type 'do' must have an attribute 'action'." +
                        " Element ignored."
                }
            );
            
            return;
        }

        if (typeof assets[assetName] === "undefined" || assets[assetName] === null) {
            bus.trigger(
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
        
        if (typeof assets[assetName][action] === "undefined") {
            
            bus.trigger(
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

        return assets[assetName][action](command, args);
    };
    
    return doCommand;
      
});