/* global using */

using(
    "WSE.commands.alert",
    "WSE.commands.break",
    "WSE.commands.choice",
    "WSE.commands.confirm",
    "WSE.commands.do",
    "WSE.commands.fn",
    "WSE.commands.global",
    "WSE.commands.globalize",
    "WSE.commands.goto",
    "WSE.commands.line",
    "WSE.commands.localize",
    "WSE.commands.prompt",
    "WSE.commands.restart",
    "WSE.commands.set_vars",
    "WSE.commands.sub",
    "WSE.commands.trigger",
    "WSE.commands.var",
    "WSE.commands.wait",
    "WSE.commands.while",
    "WSE.commands.with"
).
define("WSE.commands", function (
    alertCommand,
    breakCommand,
    choiceCommand,
    confirmCommand,
    doCommand,
    fnCommand,
    globalCommand,
    globalizeCommand,
    gotoCommand,
    lineCommand,
    localizeCommand,
    promptCommand,
    restartCommand,
    setVarsCommand,
    subCommand,
    triggerCommand,
    varCommand,
    waitCommand,
    whileCommand,
    withCommand
) {
    
    "use strict";
    
    var commands = {
        "alert": alertCommand,
        "break": breakCommand,
        "choice": choiceCommand,
        "confirm": confirmCommand,
        "do": doCommand,
        "fn": fnCommand,
        "global": globalCommand,
        "globalize": globalizeCommand,
        "goto": gotoCommand,
        "line": lineCommand,
        "localize": localizeCommand,
        "prompt": promptCommand,
        "restart": restartCommand,
        "set_vars": setVarsCommand,
        "sub": subCommand,
        "trigger": triggerCommand,
        "var": varCommand,
        "wait": waitCommand,
        "while": whileCommand,
        "with": withCommand
    };
    
    return commands;
    
});