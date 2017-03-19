
var alertCommand = require("./commands/alert");
var breakCommand = require("./commands/break");
var choiceCommand = require("./commands/choice");
var confirmCommand = require("./commands/confirm");
var doCommand = require("./commands/do");
var fnCommand = require("./commands/fn");
var globalCommand = require("./commands/global");
var globalizeCommand = require("./commands/globalize");
var gotoCommand = require("./commands/goto");
var lineCommand = require("./commands/line");
var localizeCommand = require("./commands/localize");
var promptCommand = require("./commands/prompt");
var restartCommand = require("./commands/restart");
var setVarsCommand = require("./commands/set_vars");
var subCommand = require("./commands/sub");
var triggerCommand = require("./commands/trigger");
var varCommand = require("./commands/var");
var waitCommand = require("./commands/wait");
var whileCommand = require("./commands/while");
var withCommand = require("./commands/with");

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

module.exports = commands;
