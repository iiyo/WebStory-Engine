/* global using */

using("MO5.Timer").define("WSE.tools", function (Timer) {
    
    "use strict";
    
    var tools = {};
    
    /**
     * Attaches a DOM Event to a DOM Element.
     * 
     * FIXME: Is this even needed? Supported browsers should all 
     * have .addEventListener()...
     */
    tools.attachEventListener = function (elem, type, listener) {
        
        if (elem === null || typeof elem === "undefined") {
            return;
        }
        
        if (elem.addEventListener) {
            elem.addEventListener(type, listener, false);
        }
        else if (elem.attachEvent) {
            elem.attachEvent("on" + type, listener);
        }
    };
    
    /**
     * Sets the x and y units on an asset object according
     * to it's definition in the WebStory.
     * @param obj The JavaScript object asset.
     * @param asset The XML Element with the asset's information.
     */
    tools.applyAssetUnits = function (obj, asset) {
        
        var x, y;
        
        x = asset.getAttribute('x') || "";
        y = asset.getAttribute('y') || "";
        obj.xUnit = x.replace(/^.*(px|%)$/, '$1');
        obj.xUnit = obj.xUnit || 'px';
        obj.yUnit = y.replace(/^.*(px|%)$/, '$1');
        obj.yUnit = obj.yUnit || 'px';
        
        if (obj.xUnit !== "px" && obj.xUnit !== "%") {
            obj.xUnit = "px";
        }
        
        if (obj.yUnit !== "px" && obj.yUnit !== "%") {
            obj.yUnit = "px";
        }
    };
    
    /**
     * Removes a DOM Event from a DOM Element.
     */
    tools.removeEventListener = function (elem, type, listener) {
        
        if (typeof elem === "undefined" || elem === null) {
            return;
        }
        
        elem.removeEventListener(type, listener, false);
    };
    
    /**
     * Function that replaces the names of variables in a string
     * with their respective values.
     * 
     * @param text [string] The text that contains variables.
     * @param interpreter [WSE.Interpreter] The interpreter instance.
     * @return [string] The text with the inserted variable values.
     */
    tools.replaceVariables = function (text, interpreter) {
        
        var f1, f2;
        
        if (text === null) {
            return text;
        }
        
        if (typeof text !== "string") {
            interpreter.bus.trigger("wse.interpreter.error", {
                message: "Argument supplied to the replaceVariables function must be a string."
            });
            text = "";
        }
        
        f1 = function () {
            
            var name = arguments[1];
            
            if (interpreter.globalVars.has(name)) {
                return "" + interpreter.globalVars.get(name);
            }
            
            return "";
        };
        
        f2 = function () {
            
            var name = arguments[1];
            
            if (name in interpreter.runVars) {
                return "" + interpreter.runVars[name];
            }
            
            return "";
        };
        
        // insert values of global variables ($$var):
        text = text.replace(/\{\$\$([a-zA-Z0-9_]+)\}/g, f1);
        
        // insert values of local variables ($var):
        text = text.replace(/\{\$([a-zA-Z0-9_]+)\}/g, f2);
        
        return text;
    };
    
    tools.getSerializedNodes = function (element) {
        
        var ser = new XMLSerializer(), nodes = element.childNodes, i, len;        
        var text = '';
        
        for (i = 0, len = nodes.length; i < len; i += 1) {
            text += ser.serializeToString(nodes[i]);
        }
        
        return text;
    };
    
    tools.getParsedAttribute = function (element, attributeName, interpreter, defaultValue) {
        
        var value;
        
        if (arguments.length < 3) {
            defaultValue = "";
        }
        
        value = element.getAttribute(attributeName) || ("" + defaultValue);
        
        return tools.replaceVariables(value, interpreter);
    };
    
    /**
     * Replaces { and } to < and > for making it HTML.
     * Optionally replaces newlines with <break> elements.
     * 
     * @param text [string] The text to convert to HTML.
     * @param nltobr [bool] Should newlines be converted to breaks? Default: false.
     */
    tools.textToHtml = function (text, nltobr) {
        
        nltobr = nltobr || false;
        
        if (!(String.prototype.trim)) {
            text = text.replace(/^\n/, "");
            text = text.replace(/\n$/, "");
        }
        else {
            text = text.trim();
        }
        
        text = nltobr === true ? text.replace(/\n/g, "<br />") : text;
        text = text.replace(/\{/g, "<");
        text = text.replace(/\}/g, ">");
        
        return text;
    };
    
    /**
     * Generates a unique ID. Used by assets to identify their own stuff
     * in savegames and the DOM of the stage.
     * 
     * @return [number] The unique ID.
     */
    tools.getUniqueId = (function () {
        
        var uniqueIdCount = 0;
        
        return function () {
            uniqueIdCount += 1;
            return uniqueIdCount;
        };
    }());
    
    /**
     * Converts the first character in a string to upper case.
     * 
     * @param input [string] The string to transform.
     * @return [string] The transformed string.
     */
    tools.firstLetterUppercase = function (input) {
        
        if (input.length < 1) {
            return "";
        }
        
        return "" + input.charAt(0).toUpperCase() + input.replace(/^.{1}/, "");
    };
    
    tools.mixin = function (source, target) {
        
        var key;
        
        for (key in source) {
            
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    };
    
    tools.extractUnit = function (numberString) {
        return typeof numberString !== "string" ? "" : numberString.replace(/^(-){0,1}[0-9]*/, "");
    };
    
    tools.calculateValueWithAnchor = function (oldValue, anchor, maxValue) {
    
        var value = 0, anchorUnit = "px";
        
        if (!anchor) {
            return oldValue;
        }
        
        anchorUnit = tools.extractUnit(anchor);
        anchor = parseInt(anchor, 10);
        
        if (anchorUnit === "%") {
            value = oldValue - ((maxValue / 100) * anchor);
        }
        else {
            value = oldValue - anchor;
        }
        
        return value;
    };
    
    tools.createTimer = function (duration) {
        
        var timer = new Timer();
        
        duration = duration || 0;
        duration = duration < 0 ? 0 : duration;
        
        timer.start();
        
        setTimeout(timer.stop.bind(timer), duration);
        
        return timer;
    };
    
    tools.getWindowDimensions = function () {
        
        var e = window,
            a = 'inner';
        
        if (!('innerWidth' in e)) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        
        return {
            width: e[a + 'Width'],
            height: e[a + 'Height']
        };
    };
    
    tools.fitToWindow = function (el, w, h) {
        
        var dim, ratio, sw, sh, ratioW, ratioH;
        
        dim = tools.getWindowDimensions();
        
        sw = dim.width; // - (dim.width * 0.01);
        sh = dim.height; // - (dim.height * 0.01);
        
        ratioW = sw / w;
        ratioH = sh / h;
        
        ratio = ratioW > ratioH ? ratioH : ratioW;
        
        //ratio = parseInt(ratio * 100) / 100;
        
        el.setAttribute('style',
        el.getAttribute('style') + ' -moz-transform: scale(' + ratio + ',' + ratio +
            ') rotate(0.01deg);' + ' -ms-transform: scale(' + ratio + ',' + ratio +
            ');' + ' -o-transform: scale(' + ratio + ',' + ratio +
            ');' + ' -webkit-transform: scale(' + ratio + ',' + ratio + ');' +
            ' transform: scale(' + ratio + ',' + ratio + ');');
    };
    
    tools.log = function (bus, message) {
        tools.trigger(bus, "wse.interpreter.message", message);
    };
    
    tools.warn = function (bus, message, element) {
        tools.trigger(bus, "wse.interpreter.warning", message, element);
    };
    
    tools.logError = function (bus, message, element) {
        tools.trigger(bus, "wse.interpreter.error", message, element);
    };
    
    tools.trigger = function (bus, channel, message, element) {
        bus.trigger(channel, {
            element: element || null,
            message: message
        });
    };
    
    return tools;
    
});
