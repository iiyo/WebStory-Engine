/* global MO5 */

MO5("WSE.tools.ui", "WSE.tools").define("WSE.commands.alert", function (ui, tools) {
    
    function alert (command, interpreter) {
        
        var title, message, doNext;
        
        title = command.getAttribute("title") || "Alert!";
        message = command.getAttribute("message") || "Alert!";
        message = tools.textToHtml(message);
        doNext = command.getAttribute("next") === "false" ? false : true;
        
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
