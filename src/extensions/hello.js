
var ui = require("../tools/ui");
var commands = require("../commands");

// A command is given the XML element that triggered the command
// and a reference to the interpreter object:
function hello (command, interpreter) {
    
    // The UI tools offer equivalents to the browser's alert(), prompt() and confirm() functions
    // that don't block further execution of JavaScript.
    ui.alert(
        interpreter,
        {
            title: "Hello extension says:",
            message: "Hello World!",
            doNext: true, // trigger next command after user clicked "ok"
            pause: true // prevent the game from running in the background
        }
    );
    
    // return an object with a "doNext" property that tells 
    // the interpreter to stop after executing this command:
    return {
        doNext: false
    };
}

// Add it to WSE's commands:
commands.hello = hello;

// Export the hello function so that others can use it, too.
module.exports = hello;
