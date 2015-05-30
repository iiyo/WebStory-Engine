/* global MO5 */

MO5(
    "WSE.commands.break",
    "WSE.commands.choice",
    "WSE.commands.do",
    "WSE.commands.fn",
    "WSE.commands.global",
    "WSE.commands.globalize",
    "WSE.commands.goto",
    "WSE.commands.line",
    "WSE.commands.localize",
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
    breakCommand,
    choiceCommand,
    doCommand,
    fnCommand,
    globalCommand,
    globalizeCommand,
    gotoCommand,
    lineCommand,
    localizeCommand,
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
        "break": breakCommand,
        "choice": choiceCommand,
        "do": doCommand,
        "fn": fnCommand,
        "global": globalCommand,
        "globalize": globalizeCommand,
        "goto": gotoCommand,
        "line": lineCommand,
        "localize": localizeCommand,
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