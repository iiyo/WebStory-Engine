/* global using */

using("WSE.tools.ui", "WSE.tools::textToHtml", "WSE.tools::init").
define("WSE.commands.alert", function (ui, textToHtml, init) {
    
    function alert (command, interpreter) {
        
        var title, message, doNext, props = command.properties;
        
        title = init(props, "title", "Alert!");
        message = init(props, "message", "Alert!");
        message = textToHtml(message);
        doNext = props.next === "false" ? false : true;
        
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
