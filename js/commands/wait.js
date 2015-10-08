/* global using */

using().define("WSE.commands.wait", function () {
    
    "use strict";
    
    function wait (command, interpreter) {
        
        var duration, self;
        
        interpreter.bus.trigger(
            "wse.interpreter.commands.wait",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );
        
        self = interpreter;
        duration = command.getAttribute("duration");
        
        if (duration !== null) {
            
            duration = parseInt(duration, 10);
            interpreter.waitForTimer = true;
            
            setTimeout(
                function () {
                    self.waitForTimer = false;
                }, 
                duration
            );
            
            return {
                doNext: true,
                wait: false
            };
        }
        
        return {
            doNext: true,
            wait: true
        };
    }
    
    return wait;
    
});
