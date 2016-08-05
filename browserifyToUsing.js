/* global using, require */

var transform = require("transform-js");
var databus = require("databus");
var xmugly = require("xmugly");
var eases = require("eases");
var ajax = require("easy-ajax");

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

using().define("easy-ajax", function () {
    return ajax;
});
