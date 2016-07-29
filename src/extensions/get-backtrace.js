/* global using */

using("WSE.commands").run(function (commands) {
    
    "use strict";
    
    console.log('Loading extension getBacktrace...');
    
    commands.getBacktrace = function (command, interpreter) {
        
        var i, frame, str = "", len = interpreter.callStack.length;
        
        for (i = 0; i < len; i += 1){
            frame = interpreter.callStack[i];
            str += "&nbsp;&nbsp;&nbsp;" + frame.sceneId+":" + frame.scenePath +
                ":" + frame.index + ":" + frame.currentElement + "<br/>";
        }
        
        str += "&nbsp;>&nbsp;" + interpreter.sceneId + ":" + interpreter.scenePath +
            ":" + interpreter.index + ":" + interpreter.currentElement + "<br/>";
        
        interpreter.runVars["backtrace"] = "" + str;
        
        return {
            doNext: true
        };
    };
});