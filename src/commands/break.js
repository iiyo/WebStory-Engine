
function breakFn (command, interpreter) {
    
    interpreter.bus.trigger(
        "wse.interpreter.commands.break",
        {
            interpreter: interpreter,
            command: command
        }, 
        false
    );
    
    return {
        doNext: false,
        wait: true
    };
}

module.exports = breakFn;
