
var bus = require("./bus");
var assets = require("./assets");
var commands = require("./commands");
var functions = require("./functions");
var dataSources = require("./dataSources");

var Game = require("./Game");

var WSE = {}, version = "%%%version%%%";

WSE.instances = [];

WSE.dataSources = dataSources;
WSE.assets = assets;
WSE.commands = commands;
WSE.functions = functions;

bus.subscribe("wse.game.constructor", function (data) {
    WSE.instances.push(data.game);
});

WSE.getVersion = function () {
    return version;
};

WSE.bus = bus;
WSE.Game = Game;

module.exports = WSE;
