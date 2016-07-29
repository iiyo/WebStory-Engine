/* global using */

using(
    "WSE.tools.ui",
    "WSE.tools",
    "WSE.tools::replaceVariables"
).define("WSE.commands.alert", function (ui, tools, replaceVars) {
    
    function alert (command, interpreter) {
        
        var title, message, doNext;
        
        title = command.getAttribute("title") || "Alert!";
        message = command.getAttribute("message") || "Alert!";
        
        doNext = replaceVars(command.getAttribute("next") || "", interpreter) === "false" ?
            false :
            true;
        
        message = replaceVars(message, interpreter);
        title = replaceVars(title, interpreter);
        
        message = tools.textToHtml(message);
        
        interpreter.bus.trigger("wse.interpreter.commands.alert", command);
        
        ui.alert(
            interpreter,
            {
                title: title,
                message: message,
                pause: true,
                doNext: doNext
            }
        );
        
        return {
            doNext: true
        };
    }
    
    return alert;
    
});
