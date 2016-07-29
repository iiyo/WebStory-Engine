/* global using, require */

var move = require("move-js");
var transform = require("transform-js");
var databus = require("databus");
var xmugly = require("xmugly");
var eases = require("eases");

using().define("move", function () {
    return move;
});

using().define("transform", function () {
    return transform;
});

using().define("databus", function () {
    return databus;
});

using().define("xmugly", function () {
    return xmugly;
});

using().define("eases", function () {
    return eases;
});
