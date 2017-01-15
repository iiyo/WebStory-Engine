

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

 Using.js - Simple JavaScript module loader.

 Copyright (c) 2015 Jonathan Steinbeck
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.

 * Neither the name using.js nor the names of its contributors 
   may be used to endorse or promote products derived from this software 
   without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/* global document, console */

var using = (function () {
    
    "use strict";
    
    var modules = {}, loadedScripts = {}, dependencies = {}, definitions = {}, dependingOn = {};
    var runners = [], selectors = {}, runnersCheckInProgress = false;
    
    var getAbsoluteUrl = (function () {
        
        var a = document.createElement('a');
        
        return function (url) {
            a.href = url;
            return a.href;
        };
    }());
    
    function updateModule (moduleName) {
        
        var deps = [], depNames = dependencies[moduleName], moduleResult;
        var currentSelectors = selectors[moduleName];
        
        if (modules[moduleName]) {
            return;
        }
        
        if (depNames.length === 0) {
            
            moduleResult = definitions[moduleName]();
            
            if (!moduleResult) {
                console.error("Module '" + moduleName + "' returned nothing");
            }
            
            modules[moduleName] = moduleResult;
            
            dependingOn[moduleName].forEach(updateModule);
        }
        else if (allModulesLoaded(depNames)) {
            
            //console.log("currentSelectors, depNames:", currentSelectors, depNames);
            
            depNames.forEach(function (name, i) {
                deps.push(select(name, currentSelectors[i]));
            });
            
            moduleResult = definitions[moduleName].apply(undefined, deps);
            
            if (!moduleResult) {
                console.error("Module '" + moduleName + "' returned nothing.");
            }
            
            modules[moduleName] = moduleResult;
            
            dependingOn[moduleName].forEach(updateModule);
        }
        
        startRunnersCheck();
    }
    
    function startRunnersCheck () {
        
        if (runnersCheckInProgress) {
            return;
        }
        
        runnersCheckInProgress = true;
        
        checkRunners();
    }
    
    function checkRunners () {
        
        runners.forEach(function (runner) {
            runner();
        });
        
        if (runners.length) {
            setTimeout(checkRunners, 20);
        }
        else {
            runnersCheckInProgress = false;
        }
    }
    
    function allModulesLoaded (moduleNames) {
        
        var loaded = true;
        
        moduleNames.forEach(function (name) {
            if (!modules[name]) {
                loaded = false;
            }
        });
        
        return loaded;
    }
    
    function select (moduleName, selectors) {
        
        var argSelectors, mod;
        
        mod = modules[moduleName];
        
        if (!selectors) {
            console.log("Module has no selectors:", moduleName);
            return mod;
        }
        
        argSelectors = selectors.slice();
        
        while (argSelectors.length) {
            
            if (typeof mod !== "object" || mod === null) {
                throw new TypeError("Module '" + moduleName + "' has no property '" +
                    argSelectors.join("::") + "'.");
            }
            
            mod = mod[argSelectors.shift()];
        }
        
        return mod;
    }
    
    function using (/* module names */) {
        
        var args, moduleNames, moduleSelectors, capabilityObject;
        
        moduleNames = [];
        moduleSelectors = [];
        args = [].slice.call(arguments);
        
        args.forEach(function (arg, index) {
            
            var selector, moduleName;
            var parts = arg.split("::");
            var protocolParts = parts[0].split(":");
            var protocol = protocolParts.length > 1 ? protocolParts[0] : "";
            
            parts[0] = protocolParts.length > 1 ? protocolParts[1] : protocolParts[0];
            
            selector = parts.slice(1);
            moduleName = parts[0];
            
            if (protocol === "ajax") {
                moduleNames.push(arg);
            }
            else {
                moduleNames.push(moduleName);
            }
            
            moduleSelectors.push(selector);
            
            if (!(moduleName in dependencies) && !(moduleName in modules)) {
                
                if (protocol === "ajax") {
                    
                    dependencies[arg] = [];
                    
                    if (!dependingOn[arg]) {
                        dependingOn[arg] = [];
                    }
                    
                    using.ajax(using.ajax.HTTP_METHOD_GET, arg.replace(/^ajax:/, ""),
                        null, ajaxResourceSuccessFn, ajaxResourceSuccessFn);
                }
                else {
                    
                    dependencies[moduleName] = [];
                    
                    if (!dependingOn[moduleName]) {
                        dependingOn[moduleName] = [];
                    }
                    
                    loadModule(moduleName);
                }
            }
            
            function ajaxResourceSuccessFn (request) {
                modules[arg] = request;
                dependingOn[arg].forEach(updateModule);
            }
        });
        
        
        capabilityObject = {
            run: run,
            define: define
        };
        
        return capabilityObject;
        
        
        function run (callback) {
            
            if (!runner(true)) {
                runners.push(runner);
            }
            
            startRunnersCheck();
            
            return capabilityObject;
            
            function runner (doNotRemove) {
                
                var deps = [];
                
                if (allModulesLoaded(moduleNames)) {
                    
                    //console.log("moduleSelectors, moduleNames:", moduleSelectors, moduleNames);
                    
                    moduleNames.forEach(function (name, i) {
                        deps.push(select(name, moduleSelectors[i]));
                    });
                    
                    callback.apply(undefined, deps);
                    
                    if (!doNotRemove) {
                        runners.splice(runners.indexOf(runner), 1);
                    }
                    
                    return true;
                }
                
                return false;
            }
        }
        
        function define (moduleName, callback) {
            
            if (exists(moduleName)) {
                console.warn("Module '" + moduleName + "' is already defined.");
                return capabilityObject;
            }
            
            definitions[moduleName] = callback;
            dependencies[moduleName] = moduleNames;
            selectors[moduleName] = moduleSelectors;
            
            if (!dependingOn[moduleName]) {
                dependingOn[moduleName] = [];
            }
            
            moduleNames.forEach(function (name) {
                
                if (!dependingOn[name]) {
                    dependingOn[name] = [];
                }
                
                dependingOn[name].push(moduleName);
            });
            
            updateModule(moduleName);
            
            return capabilityObject;
            
        }
    }
    
    function exists (name) {
        return name in definitions;
    }
    
    using.exists = exists;
    using.path = "";
    
    (function () {
        
        var scripts = document.getElementsByTagName("script");
        
        using.path = scripts[scripts.length - 1].src.replace(/using\.js$/, "");
        
    }());
    
    using.modules = {};
    
    function loadModule (moduleName) {
        
        if (!(moduleName in using.modules)) {
            throw new Error("Unknown module '" + moduleName + "'.");
        }
        
        using.loadScript(using.modules[moduleName]);
    }
    
    using.loadScript = function (url) {
        
        url = getAbsoluteUrl(url);
        
        var script = document.createElement("script");
        
        if (loadedScripts[url] || scriptExists(url)) {
            return;
        }
        
        script.setAttribute("data-inserted-by", "using.js");
        
        script.src = url;
        loadedScripts[url] = true;
        
        document.body.appendChild(script);
    };
    
    function scriptExists (url) {
        
        var exists = false;
        var scripts = document.getElementsByTagName("script");
        
        [].forEach.call(scripts, function (script) {
            
            var src = script.getAttribute("src");
            
            if (src && getAbsoluteUrl(src) === url) {
                exists = true;
            }
        });
        
        return exists;
    }
    
    return using;
    
}());

/* global using, XMLHttpRequest, ActiveXObject */

using.ajax = (function () {
    
    var HTTP_STATUS_OK = 200;
    var READY_STATE_UNSENT = 0;
    var READY_STATE_OPENED = 1;
    var READY_STATE_HEADERS_RECEIVED = 2;
    var READY_STATE_LOADING = 3;
    var READY_STATE_DONE = 4;
    
    function ajax (method, url, data, onSuccess, onError, timeout) {
        
        var requestObject = XMLHttpRequest ?
            new XMLHttpRequest() :
            new ActiveXObject("Microsoft.XMLHTTP");
        
        requestObject.open(method, url + "?random=" + Math.random(), true);
        
        if (timeout) {
            
            requestObject.timeout = timeout;
            
            requestObject.ontimeout = function () {
                
                requestObject.abort();
                
                if (!onError) {
                    return;
                }
                
                onError(new Error("Connection has reached the timeout of " + timeout + " ms."));
            };
        }
        
        requestObject.onreadystatechange = function() {
            
            var done, statusOk;
            
            done = requestObject.readyState === READY_STATE_DONE;
            
            if (done) {
                
                try {
                    statusOk = requestObject.status === HTTP_STATUS_OK;
                }
                catch (error) {
                    console.error(error);
                    statusOk = false;
                }
                
                if (statusOk) {
                    onSuccess(requestObject);
                }
                else {
                    onError(requestObject);
                }
            }
        };
        
        if (data) {
            requestObject.send(data);
        }
        else {
            requestObject.send();
        }
        
        return requestObject;
    }
    
    ajax.HTTP_STATUS_OK = HTTP_STATUS_OK;
    
    ajax.READY_STATE_UNSENT = READY_STATE_UNSENT;
    ajax.READY_STATE_OPENED = READY_STATE_OPENED;
    ajax.READY_STATE_HEADERS_RECEIVED = READY_STATE_HEADERS_RECEIVED;
    ajax.READY_STATE_LOADING = READY_STATE_LOADING;
    ajax.READY_STATE_DONE = READY_STATE_DONE;
    
    ajax.HTTP_METHOD_GET = "GET";
    ajax.HTTP_METHOD_POST = "POST";
    ajax.HTTP_METHOD_PUT = "PUT";
    ajax.HTTP_METHOD_DELETE = "DELETE";
    ajax.HTTP_METHOD_HEAD = "HEAD";
    
    return ajax;
    
}());


/*
    WebStory Engine dependencies (v2017.1.0)
    Build time: Sun, 15 Jan 2017 08:52:14 GMT
*/
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global using, require */

using().define("class-manipulator", function () { return require("class-manipulator"); });

using().define("databus", function () { return require("databus"); });

using().define("eases", function () { return require("eases"); });

using().define("easy-ajax", function () { return require("easy-ajax"); });

using().define("enjoy-core", function () { return require("enjoy-core"); });

using().define("enjoy-typechecks", function () { return require("enjoy-typechecks"); });

using().define("howler", function () { return require("howler"); });

using().define("string-dict", function () { return require("string-dict"); });

using().define("transform-js", function () { return require("transform-js"); });

using().define("xmugly", function () { return require("xmugly"); });

},{"class-manipulator":2,"databus":3,"eases":23,"easy-ajax":38,"enjoy-core":59,"enjoy-typechecks":85,"howler":86,"string-dict":87,"transform-js":88,"xmugly":121}],2:[function(require,module,exports){
//
// # class-manipulator
//
// A chainable wrapper API for manipulating a DOM Element's classes or class strings.
//

/* global module */

//
// ## Public API
//

//
// **list(element) / list(classString)**
//
// Creates a chainable API for manipulating an element's list of classes. No changes
// are made to the DOM Element unless `.apply()` is called.
//
//     DOMElement|string -> object
//

function list (element) {
    
    element = typeof element === "object" ? element : dummy(element);
    
    var classes = parse(element), controls;
    
//
// **.apply()**
//
// Applies class list to the source element.
//
//     void -> object
//
    
    function apply () {
        element.setAttribute("class", toString());
        return controls;
    }
    
//
// **.add(name)**
//
// Adds a class to the element's list of class names.
//
//     string -> object
//
    
    function add (name) {
        
        if (hasSpaces(name)) {
            return addMany(classStringToArray(name));
        }
        
        if (!has(name)) {
            classes.push(name);
        }
        
        return controls;
    }
    
//
// **.addMany(names)**
//
// Adds many classes to the list at once.
//
//     [string] -> object
//
    
    function addMany (newClasses) {
        
        if (!Array.isArray(newClasses)) {
            return add(newClasses);
        }
        
        newClasses.forEach(add);
        
        return controls;
    }
    
//
// **.has(name)**
//
// Checks whether a class is in the element's list of class names.
//
//     string -> boolean
//
    
    function has (name) {
        
        if (hasSpaces(name)) {
            return hasAll(name);
        }
        
        return classes.indexOf(name) >= 0;
    }
    
//
// **.hasSome(names)**
//
// Checks whether the list contains at least one of the supplied classes.
//
//     [string] -> boolean
//
    
    function hasSome (names) {
        return Array.isArray(names) ?
            names.some(has) :
            hasSome(classStringToArray(names));
    }
    
//
// **.hasAll(names)**
//
// Checks whether the list contains all of the supplied classes.
//
//     [string] -> boolean
//
    
    function hasAll (names) {
        return Array.isArray(names) ?
            names.every(has) :
            hasAll(classStringToArray(names));
    }
    
//
// **.remove(name)**
//
// Removes a class from the element's list of class names.
//
//     string -> object
//
    
    function remove (name) {
        
        if (hasSpaces(name)) {
            return removeMany(classStringToArray(name));
        }
        
        if (has(name)) {
            classes.splice(classes.indexOf(name), 1);
        }
        
        return controls;
    }
    
//
// **.removeMany(names)**
//
// Removes many classes from the list at once.
//
//     [string] -> object
//
    
    function removeMany (toRemove) {
        
        if (!Array.isArray(toRemove)) {
            return remove(toRemove);
        }
        
        toRemove.forEach(remove);
        
        return controls;
    }
    
//
// **.toggle(name)**
//
// Removes a class from the class list when it's present or adds it to the list when it's not.
//
//     string -> object
//
    
    function toggle (name) {
        
        if (hasSpaces(name)) {
            return toggleMany(classStringToArray(name));
        }
        
        return (has(name) ? remove(name) : add(name));
    }
    
//
// **.toggleMany(names)**
//
// Toggles many classes at once.
//
//     [string] -> object
//
    
    function toggleMany (names) {
        
        if (Array.isArray(names)) {
            names.forEach(toggle);
            return controls;
        }
        
        return toggleMany(classStringToArray(names));
    }
    
//
// **.toArray()**
//
// Creates an array containing all of the list's class names.
//
//     void -> [string]
//
    
    function toArray () {
        return classes.slice();
    }
    
//
// **.toString()**
//
// Returns a string containing all the classes in the list separated by a space character.
//
    
    function toString () {
        return classes.join(" ");
    }
    
//
// **.copyTo(otherElement)**
//
// Creates a new empty list for another element and copies the source element's class list to it.
//
//     DOM Element -> object
//
    
    function copyTo (otherElement) {
        return list(otherElement).clear().addMany(classes);
    }
    
//
// **.clear()**
//
// Removes all classes from the list.
//
//     void -> object
//
    
    function clear () {
        classes.length = 0;
        return controls;
    }
    
//
// **.filter(fn)**
//
// Removes those class names from the list that fail a predicate test function.
//
//     (string -> number -> object -> boolean) -> object
//
    
    function filter (fn) {
        
        classes.forEach(function (name, i) {
            if (!fn(name, i, controls)) {
                remove(name);
            }
        });
        
        return controls;
    }
    
//
// **.sort([fn])**
//
// Sorts the names in place. A custom sort function can be applied optionally. It must have
// the same signature as JS Array.prototype.sort() callbacks.
//
//     void|function -> object
//
    
    function sort (fn) {
        classes.sort(fn);
        return controls;
    }
    
//
// **.size()**
//
// Returns the number of classes in the list.
//
//     void -> number
//
    
    function size () {
        return classes.length;
    }
    
    controls = {
        add: add,
        addMany: addMany,
        has: has,
        hasSome: hasSome,
        hasAll: hasAll,
        remove: remove,
        removeMany: removeMany,
        toggle: toggle,
        toggleMany: toggleMany,
        apply: apply,
        clear: clear,
        copyTo: copyTo,
        toArray: toArray,
        toString: toString,
        filter: filter,
        sort: sort,
        size: size
    };
    
    return controls;
}

//
// **add(element, name)**
//
// Adds a class to a DOM Element.
//
//    DOM Element -> string -> object
//

function add (element, name) {
    return list(element).add(name).apply();
}

//
// **remove(element, name)**
//
// Removes a class from a DOM Element.
//
//     DOM Element -> string -> object
//

function remove (element, name) {
    return list(element).remove(name).apply();
}

//
// **toggle(element, name)**
//
// Removes a class from a DOM Element when it has the class or adds it when the element doesn't
// have it.
//
//     DOMElement -> string -> object
//

function toggle (element, name) {
    return list(element).toggle(name).apply();
}

//
// **has(element, name)**
//
// Checks whether a DOM Element has a class.
//
//     DOMElement -> string -> boolean
//

function has (element, name) {
    return list(element).has(name);
}

//
// ## Exported functions
//

module.exports = {
    add: add,
    remove: remove,
    toggle: toggle,
    has: has,
    list: list
};


//
// ## Private functions
//

//
// Extracts the class names from a DOM Element and returns them in an array.
//
//     DOMElement -> [string]
//

function parse (element) {
    return classStringToArray(element.getAttribute("class") || "");
}

//
//     string -> [string]
//

function classStringToArray (classString) {
    return ("" + classString).replace(/\s+/, " ").trim().split(" ").filter(stringNotEmpty);
}

//
//     string -> boolean
//

function stringNotEmpty (str) {
    return str !== "";
}

//
//     string -> boolean
//

function hasSpaces (str) {
    return !!str.match(/\s/);
}

//
// Creates a dummy DOMElement for when we don't have an actual one for a list.
//
//     string -> object
//

function dummy (classList) {
    
    if (typeof classList !== "string") {
        throw new Error("Function list() expects an object or string as its argument.");
    }
    
    var attributes = {
        "class": "" + classStringToArray(classList).join(" ")
    };
    
    return {
        setAttribute: function (name, value) { attributes[name] = value; },
        getAttribute: function (name) { return attributes[name]; }
    };
}

},{}],3:[function(require,module,exports){
/* global require, module */

module.exports = require("./src/databus");

},{"./src/databus":4}],4:[function(require,module,exports){
/* global using, setTimeout, console, window, module */

(function DataBusBootstrap () {
    
    if (typeof require === "function") {
        module.exports = DataBusModule();
    }
    else if (typeof using === "function") {
        using().define("databus", DataBusModule);
    }
    else {
        window.DataBus = DataBusModule();
    }
    
    function DataBusModule () {
        
        "use strict";
        
        function DataBus (args) {
            
            var self = this;
            
            args = args || {};
            
            this.debug = args.debug || false;
            this.interceptErrors = args.interceptErrors || false;
            this.log = args.log || false;
            this.logData = args.logData || false;
            this.defaults = args.defaults || {};
            this.defaults.flowType = this.defaults.flowType || DataBus.FLOW_TYPE_ASYNCHRONOUS;
            
            this.callbacks = {
                "*": []
            };
            
            this.subscribe(errorListener, "EventBus.error");
            
            function errorListener (data) {
                
                var name;
                
                if (self.debug !== true) {
                    return;
                }
                
                name = data.error.name || "Error";
                console.log(name + " in listener; Event: " + data.info.event + "; Message: " +
                    data.error.message);
            }
        }
        
        DataBus.FLOW_TYPE_ASYNCHRONOUS = 0;
        DataBus.FLOW_TYPE_SYNCHRONOUS = 1;
        
        DataBus.create = function(args) {
            
            args = args || {};
            
            return new DataBus(args);
        };
        
        DataBus.prototype.subscribe = function(parameter1, parameter2) {
            
            var listener, event, self = this;
            
            if (parameter2 === undefined) {
                event = "*";
                listener = parameter1;
            }
            else if (typeof parameter1 === "string" || typeof parameter1 === "number") {
                event = parameter1;
                listener = parameter2;
            }
            else if (typeof parameter2 === "string" || typeof parameter2 === "number") {
                event = parameter2;
                listener = parameter1;
            }
            
            if (typeof event !== "string" && typeof event !== "number") {
                throw new Error("Event names can only be strings or numbers! event: ", event);
            }
            
            if (typeof listener !== "function") {
                throw new Error("Only functions may be used as listeners!");
            }
            
            event = event || '*';
            
            this.callbacks[event] = this.callbacks[event] || [];
            this.callbacks[event].push(listener);
            
            this.trigger(
                "EventBus.subscribe", 
                {
                    listener: listener,
                    event: event,
                    bus: this
                }
            );
            
            return function unsubscriber () {
                self.unsubscribe(listener, event);
            };
        };
        
        DataBus.prototype.unsubscribe = function(parameter1, parameter2) {
            
            var cbs, len, i, listener, event;
            
            if (parameter2 === undefined) {
                event = "*";
                listener = parameter1;
            }
            else if (typeof parameter1 === "string" || typeof parameter1 === "number") {
                event = parameter1;
                listener = parameter2;
            }
            else if (typeof parameter2 === "string" || typeof parameter2 === "number") {
                event = parameter2;
                listener = parameter1;
            }
            
            if (typeof event !== "string" && typeof event !== "number") {
                throw new Error("Event names can only be strings or numbers! event: ", event);
            }
            
            if (typeof listener !== "function") {
                throw new Error("Only functions may be used as listeners!");
            }
            
            event = event || '*';
            cbs = this.callbacks[event] || [];
            len = cbs.length;
            
            for (i = 0; i < len; ++i) {
                if (cbs[i] === listener) {
                    this.callbacks[event].splice(i, 1);
                }
            }
            
            this.trigger(
                "EventBus.unsubscribe", 
                {
                    listener: listener,
                    event: event,
                    bus: this
                }
            );
        };
        
        DataBus.prototype.once = function (listenerOrEvent1, listenerOrEvent2) {
            
            var fn, self = this, event, listener;
            var firstParamIsFunction, secondParamIsFunction, called = false;
            
            firstParamIsFunction = typeof listenerOrEvent1 === "function";
            secondParamIsFunction = typeof listenerOrEvent2 === "function";
            
            if ((firstParamIsFunction && secondParamIsFunction) || 
                    (!firstParamIsFunction && !secondParamIsFunction)) {
                throw new Error("Parameter mismatch; one parameter needs to be a function, " +
                    "the other one must be a string.");
            }
            
            if (firstParamIsFunction) {
                listener = listenerOrEvent1;
                event = listenerOrEvent2;
            }
            else {
                listener = listenerOrEvent2;
                event = listenerOrEvent1;
            }
            
            event = event || "*";
            
            fn = function (data, info) {
                
                if (called) {
                    return;
                }
                
                called = true;
                self.unsubscribe(fn, event);
                listener(data, info);
            };
            
            this.subscribe(fn, event);
        };
        
        DataBus.prototype.trigger = function(event, data, async) {
            
            var cbs, len, info, j, f, cur, self, flowType;
            
            if (
                typeof event !== "undefined" &&
                typeof event !== "string" &&
                typeof event !== "number"
            ) {
                throw new Error("Event names can only be strings or numbers! event: ", event);
            }
            
            self = this;
            event = arguments.length ? event : "*";
            
            flowType = (typeof async !== "undefined" && async === false) ?
                DataBus.FLOW_TYPE_SYNCHRONOUS :
                this.defaults.flowType;
            
            // get subscribers in all relevant namespaces
            cbs = (function() {
                
                var n, words, wc, matches, k, kc, old = "", out = [];
                
                // split event name into namespaces and get all subscribers
                words = event.split(".");
                
                for (n = 0, wc = words.length ; n < wc ; ++n) {
                    
                    old = old + (n > 0 ? "." : "") + words[n];
                    matches = self.callbacks[old] || [];
                    
                    for (k = 0, kc = matches.length; k < kc; ++k) {
                        out.push(matches[k]);
                    }
                }
                
                if (event === "*") {
                    return out;
                }
                
                // get subscribers for "*" and add them, too
                matches = self.callbacks["*"] || [];
                
                for (k = 0, kc = matches.length ; k < kc ; ++k) {
                    out.push( matches[ k ] );
                }
                
                return out;
            }());
            
            len = cbs.length;
            
            info = {
                event: event,
                subscribers: len,
                async: flowType === DataBus.FLOW_TYPE_ASYNCHRONOUS ? true : false,
                getQueueLength: function() {
                    
                    if (len === 0) {
                        return 0;
                    }
                    
                    return len - (j + 1);
                }
            };
            
            function asyncThrow (e) {
                setTimeout(
                    function () {
                        throw e;
                    },
                    0
                );
            }
            
            // function for iterating through the list of relevant listeners
            f = function() {
                
                if (self.log === true) {
                    console.log( 
                        "EventBus event triggered: " + event + "; Subscribers: " + len, 
                        self.logData === true ? "; Data: " + data : "" 
                    );
                }
                
                for (j = 0; j < len; ++j) {
                    
                    cur = cbs[j];
                    
                    try {
                        cur(data, info);
                    }
                    catch (e) {
                        
                        console.log(e);
                        
                        self.trigger(
                            "EventBus.error", 
                            {
                                error: e,
                                info: info
                            }
                        );
                        
                        if (self.interceptErrors !== true) {
                            asyncThrow(e);
                        }
                    }
                }
            };
            
            if (flowType === DataBus.FLOW_TYPE_ASYNCHRONOUS) {
                setTimeout(f, 0);
            }
            else {
                f();
            }
        };
        
        DataBus.prototype.triggerSync = function (event, data) {
            return this.trigger(event, data, false);
        };
        
        DataBus.prototype.triggerAsync = function (event, data) {
            return this.trigger(event, data, true);
        };
        
        DataBus.inject = function (obj, args) {
            
            args = args || {};
            
            var squid = new DataBus(args);
            
            obj.subscribe = function (listener, event) {
                squid.subscribe(listener, event);
            };
            
            obj.unsubscribe = function (listener, event) {
                squid.unsubscribe(listener, event);
            };
            
            obj.once = function (listener, event) {
                squid.once(listener, event);
            };
            
            obj.trigger = function (event, data, async) {
                async = (typeof async !== "undefined" && async === false) ? false : true;
                squid.trigger(event, data, async);
            };
            
            obj.triggerSync = squid.triggerSync.bind(squid);
            obj.triggerAsync = squid.triggerAsync.bind(squid);
            
            obj.subscribe("destroyed", function () {
                squid.callbacks = [];
            });
        };
        
        return DataBus;
        
    }
}());

},{}],5:[function(require,module,exports){
function backInOut(t) {
  var s = 1.70158 * 1.525
  if ((t *= 2) < 1)
    return 0.5 * (t * t * ((s + 1) * t - s))
  return 0.5 * ((t -= 2) * t * ((s + 1) * t + s) + 2)
}

module.exports = backInOut
},{}],6:[function(require,module,exports){
function backIn(t) {
  var s = 1.70158
  return t * t * ((s + 1) * t - s)
}

module.exports = backIn
},{}],7:[function(require,module,exports){
function backOut(t) {
  var s = 1.70158
  return --t * t * ((s + 1) * t + s) + 1
}

module.exports = backOut
},{}],8:[function(require,module,exports){
var bounceOut = require('./bounce-out')

function bounceInOut(t) {
  return t < 0.5
    ? 0.5 * (1.0 - bounceOut(1.0 - t * 2.0))
    : 0.5 * bounceOut(t * 2.0 - 1.0) + 0.5
}

module.exports = bounceInOut
},{"./bounce-out":10}],9:[function(require,module,exports){
var bounceOut = require('./bounce-out')

function bounceIn(t) {
  return 1.0 - bounceOut(1.0 - t)
}

module.exports = bounceIn
},{"./bounce-out":10}],10:[function(require,module,exports){
function bounceOut(t) {
  var a = 4.0 / 11.0
  var b = 8.0 / 11.0
  var c = 9.0 / 10.0

  var ca = 4356.0 / 361.0
  var cb = 35442.0 / 1805.0
  var cc = 16061.0 / 1805.0

  var t2 = t * t

  return t < a
    ? 7.5625 * t2
    : t < b
      ? 9.075 * t2 - 9.9 * t + 3.4
      : t < c
        ? ca * t2 - cb * t + cc
        : 10.8 * t * t - 20.52 * t + 10.72
}

module.exports = bounceOut
},{}],11:[function(require,module,exports){
function circInOut(t) {
  if ((t *= 2) < 1) return -0.5 * (Math.sqrt(1 - t * t) - 1)
  return 0.5 * (Math.sqrt(1 - (t -= 2) * t) + 1)
}

module.exports = circInOut
},{}],12:[function(require,module,exports){
function circIn(t) {
  return 1.0 - Math.sqrt(1.0 - t * t)
}

module.exports = circIn
},{}],13:[function(require,module,exports){
function circOut(t) {
  return Math.sqrt(1 - ( --t * t ))
}

module.exports = circOut
},{}],14:[function(require,module,exports){
function cubicInOut(t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0
}

module.exports = cubicInOut
},{}],15:[function(require,module,exports){
function cubicIn(t) {
  return t * t * t
}

module.exports = cubicIn
},{}],16:[function(require,module,exports){
function cubicOut(t) {
  var f = t - 1.0
  return f * f * f + 1.0
}

module.exports = cubicOut
},{}],17:[function(require,module,exports){
function elasticInOut(t) {
  return t < 0.5
    ? 0.5 * Math.sin(+13.0 * Math.PI/2 * 2.0 * t) * Math.pow(2.0, 10.0 * (2.0 * t - 1.0))
    : 0.5 * Math.sin(-13.0 * Math.PI/2 * ((2.0 * t - 1.0) + 1.0)) * Math.pow(2.0, -10.0 * (2.0 * t - 1.0)) + 1.0
}

module.exports = elasticInOut
},{}],18:[function(require,module,exports){
function elasticIn(t) {
  return Math.sin(13.0 * t * Math.PI/2) * Math.pow(2.0, 10.0 * (t - 1.0))
}

module.exports = elasticIn
},{}],19:[function(require,module,exports){
function elasticOut(t) {
  return Math.sin(-13.0 * (t + 1.0) * Math.PI/2) * Math.pow(2.0, -10.0 * t) + 1.0
}

module.exports = elasticOut
},{}],20:[function(require,module,exports){
function expoInOut(t) {
  return (t === 0.0 || t === 1.0)
    ? t
    : t < 0.5
      ? +0.5 * Math.pow(2.0, (20.0 * t) - 10.0)
      : -0.5 * Math.pow(2.0, 10.0 - (t * 20.0)) + 1.0
}

module.exports = expoInOut
},{}],21:[function(require,module,exports){
function expoIn(t) {
  return t === 0.0 ? t : Math.pow(2.0, 10.0 * (t - 1.0))
}

module.exports = expoIn
},{}],22:[function(require,module,exports){
function expoOut(t) {
  return t === 1.0 ? t : 1.0 - Math.pow(2.0, -10.0 * t)
}

module.exports = expoOut
},{}],23:[function(require,module,exports){
module.exports = {
	'backInOut': require('./back-in-out'),
	'backIn': require('./back-in'),
	'backOut': require('./back-out'),
	'bounceInOut': require('./bounce-in-out'),
	'bounceIn': require('./bounce-in'),
	'bounceOut': require('./bounce-out'),
	'circInOut': require('./circ-in-out'),
	'circIn': require('./circ-in'),
	'circOut': require('./circ-out'),
	'cubicInOut': require('./cubic-in-out'),
	'cubicIn': require('./cubic-in'),
	'cubicOut': require('./cubic-out'),
	'elasticInOut': require('./elastic-in-out'),
	'elasticIn': require('./elastic-in'),
	'elasticOut': require('./elastic-out'),
	'expoInOut': require('./expo-in-out'),
	'expoIn': require('./expo-in'),
	'expoOut': require('./expo-out'),
	'linear': require('./linear'),
	'quadInOut': require('./quad-in-out'),
	'quadIn': require('./quad-in'),
	'quadOut': require('./quad-out'),
	'quartInOut': require('./quart-in-out'),
	'quartIn': require('./quart-in'),
	'quartOut': require('./quart-out'),
	'quintInOut': require('./quint-in-out'),
	'quintIn': require('./quint-in'),
	'quintOut': require('./quint-out'),
	'sineInOut': require('./sine-in-out'),
	'sineIn': require('./sine-in'),
	'sineOut': require('./sine-out')
}
},{"./back-in":6,"./back-in-out":5,"./back-out":7,"./bounce-in":9,"./bounce-in-out":8,"./bounce-out":10,"./circ-in":12,"./circ-in-out":11,"./circ-out":13,"./cubic-in":15,"./cubic-in-out":14,"./cubic-out":16,"./elastic-in":18,"./elastic-in-out":17,"./elastic-out":19,"./expo-in":21,"./expo-in-out":20,"./expo-out":22,"./linear":24,"./quad-in":26,"./quad-in-out":25,"./quad-out":27,"./quart-in":29,"./quart-in-out":28,"./quart-out":30,"./quint-in":32,"./quint-in-out":31,"./quint-out":33,"./sine-in":35,"./sine-in-out":34,"./sine-out":36}],24:[function(require,module,exports){
function linear(t) {
  return t
}

module.exports = linear
},{}],25:[function(require,module,exports){
function quadInOut(t) {
    t /= 0.5
    if (t < 1) return 0.5*t*t
    t--
    return -0.5 * (t*(t-2) - 1)
}

module.exports = quadInOut
},{}],26:[function(require,module,exports){
function quadIn(t) {
  return t * t
}

module.exports = quadIn
},{}],27:[function(require,module,exports){
function quadOut(t) {
  return -t * (t - 2.0)
}

module.exports = quadOut
},{}],28:[function(require,module,exports){
function quarticInOut(t) {
  return t < 0.5
    ? +8.0 * Math.pow(t, 4.0)
    : -8.0 * Math.pow(t - 1.0, 4.0) + 1.0
}

module.exports = quarticInOut
},{}],29:[function(require,module,exports){
function quarticIn(t) {
  return Math.pow(t, 4.0)
}

module.exports = quarticIn
},{}],30:[function(require,module,exports){
function quarticOut(t) {
  return Math.pow(t - 1.0, 3.0) * (1.0 - t) + 1.0
}

module.exports = quarticOut
},{}],31:[function(require,module,exports){
function qinticInOut(t) {
    if ( ( t *= 2 ) < 1 ) return 0.5 * t * t * t * t * t
    return 0.5 * ( ( t -= 2 ) * t * t * t * t + 2 )
}

module.exports = qinticInOut
},{}],32:[function(require,module,exports){
function qinticIn(t) {
  return t * t * t * t * t
}

module.exports = qinticIn
},{}],33:[function(require,module,exports){
function qinticOut(t) {
  return --t * t * t * t * t + 1
}

module.exports = qinticOut
},{}],34:[function(require,module,exports){
function sineInOut(t) {
  return -0.5 * (Math.cos(Math.PI*t) - 1)
}

module.exports = sineInOut
},{}],35:[function(require,module,exports){
function sineIn (t) {
  var v = Math.cos(t * Math.PI * 0.5)
  if (Math.abs(v) < 1e-14) return 1
  else return 1 - v
}

module.exports = sineIn

},{}],36:[function(require,module,exports){
function sineOut(t) {
  return Math.sin(t * Math.PI/2)
}

module.exports = sineOut
},{}],37:[function(require,module,exports){

(function () {
    
    var HTTP_STATUS_OK = 200;
    var READY_STATE_UNSENT = 0;
    var READY_STATE_OPENED = 1;
    var READY_STATE_HEADERS_RECEIVED = 2;
    var READY_STATE_LOADING = 3;
    var READY_STATE_DONE = 4;
    
    function ajax (method, url, options, then) {
        
        var timeout, data;
        
        var requestObject = XMLHttpRequest ?
            new XMLHttpRequest() :
            new ActiveXObject("Microsoft.XMLHTTP");
        
        options = options || {};
        
        if (typeof options === "function" && !then) {
            then = options;
            options = {};
        }
        
        then = then || function () {};
        data = ("data" in options) ? options.data : undefined;
        timeout = options.timeout;
        url += options.randomize ? "?random=" + Math.random() : "";
        
        requestObject.open(method, url, true);
        
        if (timeout) {
            
            requestObject.timeout = timeout;
            
            requestObject.ontimeout = function () {
                
                requestObject.abort();
                
                then(new Error("Connection reached timeout of " + timeout + " ms."), requestObject);
            };
        }
        
        requestObject.onreadystatechange = function() {
            
            var done, statusOk;
            
            done = requestObject.readyState === READY_STATE_DONE;
            
            if (done) {
                
                try {
                    statusOk = requestObject.status === HTTP_STATUS_OK;
                }
                catch (error) {
                    console.error(error);
                    statusOk = false;
                }
                
                if (statusOk) {
                    then(null, requestObject);
                }
                else {
                    then(new Error("AJAX request wasn't successful."), requestObject);
                }
            }
        };
        
        if (data) {
            requestObject.send(data);
        }
        else {
            requestObject.send();
        }
        
        return requestObject;
    }
    
    ajax.HTTP_STATUS_OK = HTTP_STATUS_OK;
    
    ajax.READY_STATE_UNSENT = READY_STATE_UNSENT;
    ajax.READY_STATE_OPENED = READY_STATE_OPENED;
    ajax.READY_STATE_HEADERS_RECEIVED = READY_STATE_HEADERS_RECEIVED;
    ajax.READY_STATE_LOADING = READY_STATE_LOADING;
    ajax.READY_STATE_DONE = READY_STATE_DONE;
    
    ajax.HTTP_METHOD_GET = "GET";
    ajax.HTTP_METHOD_POST = "POST";
    ajax.HTTP_METHOD_PUT = "PUT";
    ajax.HTTP_METHOD_DELETE = "DELETE";
    ajax.HTTP_METHOD_HEAD = "HEAD";
    
    ajax.get = function (url, options, then) {
        return ajax(ajax.HTTP_METHOD_GET, url, options, then);
    };
    
    ajax.post = function (url, data, options, then) {
        
        if (typeof options === "function" && !then) {
            then = options;
            options = {};
        }
        
        options.data = data;
        
        return ajax(ajax.HTTP_METHOD_POST, url, options, then);
    };
    
    if (typeof require === "function") {
        module.exports = ajax;
    }
    else {
        window.ajax = ajax;
    }
    
}());

},{}],38:[function(require,module,exports){

module.exports = require("./easy-ajax.js");

},{"./easy-ajax.js":37}],39:[function(require,module,exports){

var auto = require("./auto");

function add () {
    return Array.prototype.reduce.call(arguments, function (a, b) { return a + b; });
}

module.exports = auto(add, 2);

},{"./auto":42}],40:[function(require,module,exports){

function apply (fn, args) {
    
    if (typeof fn !== "function") {
        throw new TypeError("Argument 'fn' must be a function.");
    }
    
    return fn.apply(undefined, args);
}

module.exports = apply;

},{}],41:[function(require,module,exports){

var auto = require("./auto");

function at (collection, key) {
    return collection[key];
}

module.exports = auto(at);

},{"./auto":42}],42:[function(require,module,exports){

var slice = require("./slice");
var apply = require("./apply");

//
// **auto(fn[, arity])**
//
// Wraps `fn` so that if it is called with less arguments than `fn`'s arity,
// a partial application is done instead of calling the function. This means that you can do this:
//
//     each(fn)(collection);
//
// Instead of this:
//
//     each(fn, collection);
//

function auto (fn, arity) {
    
    arity = arguments.length >= 2 ? arity : fn.length;
    
    function wrap () {
        
        var args = slice(arguments);
        
        return (
            args.length >= arity ?
            apply(fn, args) :
            function () { return apply(wrap, args.concat(slice(arguments))); }
        );
    }
    
    return wrap;
}

module.exports = auto;

},{"./apply":40,"./slice":78}],43:[function(require,module,exports){

function bind (fn) {
    
    var args = [].slice.call(arguments);
    
    args.shift();
    
    return function () {
        
        var allArgs = args.slice(), i;
        
        for (i = 0; i < arguments.length; i += 1) {
            allArgs.push(arguments[i]);
        }
        
        return fn.apply(undefined, allArgs);
    };
}

module.exports = bind;

},{}],44:[function(require,module,exports){

function call (fn) {
    
    var args = [].slice.call(arguments);
    
    args.shift();
    
    return fn.apply(undefined, args);
}

module.exports = call;

},{}],45:[function(require,module,exports){

var apply = require("./apply");
var pipe = require("./pipe");
var toArray = require("./toArray");

function compose () {
    
    var functions = toArray(arguments);
    
    return function (value) {
        
        var args = functions.slice();
        
        args.unshift(value);
        
        return apply(pipe, args);
    };
}

module.exports = compose;

},{"./apply":40,"./pipe":69,"./toArray":83}],46:[function(require,module,exports){

var some = require("./some");
var auto = require("./auto");

function contains (collection, item) {
    return some(function (currentItem) {
        return item === currentItem;
    }, collection) || false;
}

module.exports = auto(contains);

},{"./auto":42,"./some":79}],47:[function(require,module,exports){

var auto = require("./auto");

function divide () {
    return Array.prototype.reduce.call(arguments, function (a, b) { return a / b; });
}

module.exports = auto(divide, 2);

},{"./auto":42}],48:[function(require,module,exports){

var types = require("enjoy-typechecks");
var auto = require("./auto");

function eachInArray (fn, collection) {
    [].forEach.call(collection, fn);
}

function eachInObject (fn, collection) {
    Object.keys(collection).forEach(function (key) {
        fn(collection[key], key, collection);
    });
}

function each (fn, collection) {
    return types.isArrayLike(collection) ?
        eachInArray(fn, collection) :
        eachInObject(fn, collection);
}

module.exports = auto(each);

},{"./auto":42,"enjoy-typechecks":85}],49:[function(require,module,exports){

var some = require("./some");
var auto = require("./auto");

function every (fn, collection) {
    
    var result = true;
    
    some(someToEvery, collection);
    
    function someToEvery (item, key) {
        
        if (!fn(item, key, collection)) {
            result = false;
            return true;
        }
        
        return false;
    }
    
    return result;
}

module.exports = auto(every);

},{"./auto":42,"./some":79}],50:[function(require,module,exports){

var each = require("./each");
var auto = require("./auto");

//
// Turns an array of objects into an object where the keys are the
// values of a property of the objects contained within the original array.
//
// Example:
//
//     [{name: "foo"},{name: "bar"}] => {foo: {name: "foo"}, bar: {name: "bar"}}
//

function expose (collection, key) {
    
    var result = {};
    
    each(function (item) {
        result[item[key]] = item;
    }, collection);
    
    return result;
}

module.exports = auto(expose);

},{"./auto":42,"./each":48}],51:[function(require,module,exports){

var auto = require("./auto");

function fallback (fn, instead) {
    try {
        return fn();
    }
    catch (error) {
        return instead(error);
    }
}

module.exports = auto(fallback);

},{"./auto":42}],52:[function(require,module,exports){

var each = require("./each");
var auto = require("./auto");

function filter (fn, collection) {
    
    var items = [];
    
    each(applyFilter, collection);
    
    function applyFilter (item, key) {
        if (fn(item, key, collection)) {
            items.push(item);
        }
    }
    
    return items;
}

module.exports = auto(filter);

},{"./auto":42,"./each":48}],53:[function(require,module,exports){

var some = require("./some");
var auto = require("./auto");

function find (fn, collection) {
    
    var value;
    
    some(function (item, key) {
        
        if (fn(item, key, collection)) {
            value = item;
            return true;
        }
        
        return false;
        
    }, collection);
    
    return value;
}

module.exports = auto(find);

},{"./auto":42,"./some":79}],54:[function(require,module,exports){

var apply = require("./apply");
var toArray = require("./toArray");

//
// Reverses a function's order of arguments.
//

function flip (fn) {
    return function () {
        return apply(fn, toArray(arguments).reverse())
    };
}

module.exports = flip;

},{"./apply":40,"./toArray":83}],55:[function(require,module,exports){

function free (method) {
    return Function.prototype.call.bind(method);
}

module.exports = free;

},{}],56:[function(require,module,exports){

var at = require("./at");
var bind = require("./bind");

//
// ### Function getter(collection)
//
//     collection -> (string | number -> any)
//
// Binds `at` to a `collection`.
//

function getter (collection) {
    return bind(at, collection);
}

module.exports = getter;

},{"./at":41,"./bind":43}],57:[function(require,module,exports){

var some = require("./some");
var auto = require("./auto");

function has (collection, key) {
    return some(function (item, currentKey) {
        return key === currentKey;
    }, collection) || false;
}

module.exports = auto(has);

},{"./auto":42,"./some":79}],58:[function(require,module,exports){

function id (thing) {
    return thing;
}

module.exports = id;

},{}],59:[function(require,module,exports){
/* eslint "global-require": "off" */

module.exports = {
    "add": require("./add"),
    "apply": require("./apply"),
    "at": require("./at"),
    "auto": require("./auto"),
    "bind": require("./bind"),
    "call": require("./call"),
    "contains": require("./contains"),
    "divide": require("./divide"),
    "each": require("./each"),
    "every": require("./every"),
    "expose": require("./expose"),
    "fallback": require("./fallback"),
    "filter": require("./filter"),
    "find": require("./find"),
    "flip": require("./flip"),
    "free": require("./free"),
    "getter": require("./getter"),
    "has": require("./has"),
    "id": require("./id"),
    "join": require("./join"),
    "keys": require("./keys"),
    "loop": require("./loop"),
    "map": require("./map"),
    "mod": require("./mod"),
    "multiply": require("./multiply"),
    "not": require("./not"),
    "partial": require("./partial"),
    "picker": require("./picker"),
    "pipe": require("./pipe"),
    "compose": require("./compose"),
    "pluck": require("./pluck"),
    "privatize": require("./privatize"),
    "put": require("./put"),
    "putter": require("./putter"),
    "reduce": require("./reduce"),
    "repeat": require("./repeat"),
    "reverse": require("./reverse"),
    "setter": require("./setter"),
    "slice": require("./slice"),
    "some": require("./some"),
    "sort": require("./sort"),
    "split": require("./split"),
    "subtract": require("./subtract"),
    "toArray": require("./toArray"),
    "values": require("./values")
};

},{"./add":39,"./apply":40,"./at":41,"./auto":42,"./bind":43,"./call":44,"./compose":45,"./contains":46,"./divide":47,"./each":48,"./every":49,"./expose":50,"./fallback":51,"./filter":52,"./find":53,"./flip":54,"./free":55,"./getter":56,"./has":57,"./id":58,"./join":60,"./keys":61,"./loop":62,"./map":63,"./mod":64,"./multiply":65,"./not":66,"./partial":67,"./picker":68,"./pipe":69,"./pluck":70,"./privatize":71,"./put":72,"./putter":73,"./reduce":74,"./repeat":75,"./reverse":76,"./setter":77,"./slice":78,"./some":79,"./sort":80,"./split":81,"./subtract":82,"./toArray":83,"./values":84}],60:[function(require,module,exports){

var free = require("./free");
var auto = require("./auto");
var reduce = require("./reduce");
var isArrayLike = require("enjoy-typechecks").isArrayLike;

var joinArrayLike = free(Array.prototype.join);

function join (collection, glue) {
    
    if (arguments.length < 2) {
        glue = "";
    }
    
    if (isArrayLike(collection)) {
        return joinArrayLike(collection, glue);
    }
    
    return reduce(function (previous, current) {
        return previous + "" + glue + current
    }, collection, "");
}

module.exports = auto(join);

},{"./auto":42,"./free":55,"./reduce":74,"enjoy-typechecks":85}],61:[function(require,module,exports){

var map = require("./map");

function keys (collection) {
    return map(function (value, key) {
        return key;
    }, collection);
}

module.exports = keys;

},{"./map":63}],62:[function(require,module,exports){

function loop (fn) {
    while (fn()) {
        /* do nothing */
    }
}

module.exports = loop;

},{}],63:[function(require,module,exports){

var each = require("./each");
var auto = require("./auto");

function map (fn, collection) {
    
    var items = [];
    
    each(function (item, key) {
        items.push(fn(item, key, collection));
    }, collection);
    
    return items;
}

module.exports = auto(map);

},{"./auto":42,"./each":48}],64:[function(require,module,exports){

var auto = require("./auto");

function mod () {
    return Array.prototype.reduce.call(arguments, function (a, b) { return a % b; });
}

module.exports = auto(mod, 2);

},{"./auto":42}],65:[function(require,module,exports){

var auto = require("./auto");

function multiply () {
    return Array.prototype.reduce.call(arguments, function (a, b) { return a * b; });
}

module.exports = auto(multiply, 2);

},{"./auto":42}],66:[function(require,module,exports){

function not (thing) {
    return !thing;
}

module.exports = not;

},{}],67:[function(require,module,exports){

var apply = require("./apply");

function partial (fn) {
    
    var args = Array.prototype.slice.call(arguments, 1);
    
    return function () {
        
        var callArgs = Array.prototype.slice.call(arguments);
        
        var allArgs = args.map(function (arg) {
            
            if (typeof arg === "undefined") {
                return callArgs.shift();
            }
            
            return arg;
        });
        
        if (callArgs.length) {
            callArgs.forEach(function (arg) {
                allArgs.push(arg);
            });
        }
        
        return apply(fn, allArgs);
    };
}

module.exports = partial;

},{"./apply":40}],68:[function(require,module,exports){

var at = require("./at");
var partial = require("./partial");

//
// ### Function picker(key)
//
//     string | number -> (collection -> any)
//
// Binds `at` to a `key`.
//

function picker (key) {
    return partial(at, undefined, key);
}

module.exports = picker;

},{"./at":41,"./partial":67}],69:[function(require,module,exports){

var each = require("./each");
var auto = require("./auto");

function pipe (value) {
    
    each(function (fn, index) {
        if (index > 0) {
            value = fn(value);
        }
    }, arguments);
    
    return value;
}

module.exports = auto(pipe, 2);

},{"./auto":42,"./each":48}],70:[function(require,module,exports){

var map = require("./map");
var auto = require("./auto");

function pluck (collection, key) {
    
    var result = [];
    
    map(function (item) {
        if (key in item || (Array.isArray(item) && key < item.length)) {
            result.push(item[key]);
        }
    }, collection);
    
    return result;
}

module.exports = auto(pluck);

},{"./auto":42,"./map":63}],71:[function(require,module,exports){

var each = require("./each");
var auto = require("./auto");

//
// Turns an object into an array by putting its keys into the objects
// contained within the array.
//
// Example:
//
//     {foo: {}, bar: {}} => [{name: "foo"},{name: "bar"}]
//

function privatize (collection, key) {
    
    var result = [];
    
    each(function (item, currentKey) {
        
        item[key] = currentKey;
        
        result.push(item);
        
    }, collection);
    
    return result;
}

module.exports = auto(privatize);

},{"./auto":42,"./each":48}],72:[function(require,module,exports){

var auto = require("./auto");

//
// ### Function put(collection, key, value)
//
//     collection -> string -> any -> undefined
//
// Puts a `value` into a collection at `key`.
//

function put (collection, key, value) {
    collection[key] = value;
}

module.exports = auto(put);

},{"./auto":42}],73:[function(require,module,exports){

var put = require("./put");
var partial = require("./partial");

//
// ### Function putter(key)
//
//     string -> (collection -> value -> undefined)
//
// Binds `put` to a key.
//

function putter (key) {
    return partial(put, undefined, key, undefined);
}

module.exports = putter;

},{"./partial":67,"./put":72}],74:[function(require,module,exports){

var each = require("./each");
var auto = require("./auto");
var isArrayLike = require("enjoy-typechecks").isArrayLike;

//
// ### Function reduce(fn, collection[, value])
//
//     (any -> any -> string|number -> collection) -> collection -> any -> any
//
// Reduces a collection to a single value by applying every item in the collection
// along with the item's key, the previously reduced value (or the start value)
// and the collection itself to a reducer function `fn`.
//

function reduce (fn, collection, value) {
    
    var hasValue = arguments.length > 2;
    
    // If the collection is array-like, the native .reduce() method is used for performance:
    if (isArrayLike(collection)) {
        
        if (hasValue) {
            return Array.prototype.reduce.call(collection, fn, value);
        }
        
        return Array.prototype.reduce.call(collection, fn);
    }
    
    each(function (item, key) {
        
        if (!hasValue) {
            hasValue = true;
            value = item;
            return;
        }
        
        value = fn(value, item, key, collection);
        
    }, collection);
    
    return value;
}

module.exports = auto(reduce);

},{"./auto":42,"./each":48,"enjoy-typechecks":85}],75:[function(require,module,exports){

var auto = require("./auto");

function repeat (fn, times) {
    for (var i = 0; i < times; i += 1) {
        fn();
    }
}

module.exports = auto(repeat);

},{"./auto":42}],76:[function(require,module,exports){

var free = require("./free");
var slice = require("./slice");
var compose = require("./compose");

module.exports = compose(slice, free(Array.prototype.reverse));

},{"./compose":45,"./free":55,"./slice":78}],77:[function(require,module,exports){

var put = require("./put");
var bind = require("./bind");

//
// ### Function setter(collection)
//
//     collection -> (string -> value -> undefined)
//
// Binds `put` to a collection.
//

function setter (collection) {
    return bind(put, collection);
}

module.exports = setter;

},{"./bind":43,"./put":72}],78:[function(require,module,exports){

var free = require("./free");

module.exports = free(Array.prototype.slice);

},{"./free":55}],79:[function(require,module,exports){

var auto = require("./auto");
var free = require("./free");
var types = require("enjoy-typechecks");

var someArray = free(Array.prototype.some);

function some (fn, collection) {
    if (types.isArrayLike(collection)) {
        return someArray(collection, fn);
    }
    else {
        return someObject(fn, collection);
    }
}

function someObject (fn, collection) {
    return Object.keys(collection).some(function (key) {
        return fn(collection[key], key, collection);
    });
}

module.exports = auto(some);

},{"./auto":42,"./free":55,"enjoy-typechecks":85}],80:[function(require,module,exports){

var free = require("./free");
var slice = require("./slice");
var compose = require("./compose");

module.exports = compose(slice, free(Array.prototype.sort));

},{"./compose":45,"./free":55,"./slice":78}],81:[function(require,module,exports){

var free = require("./free");

module.exports = free(String.prototype.split);

},{"./free":55}],82:[function(require,module,exports){

var auto = require("./auto");

function subtract () {
    return Array.prototype.reduce.call(arguments, function (a, b) { return a - b; });
}

module.exports = auto(subtract, 2);

},{"./auto":42}],83:[function(require,module,exports){

function toArray (thing) {
    return Array.prototype.slice.call(thing);
}

module.exports = toArray;

},{}],84:[function(require,module,exports){

var map = require("./map");
var id = require("./id");

//
// ### Function values(collection)
//
//     collection -> [any]
//
// Extracts all values from a collection such as `array` or `object`.
//

function values (collection) {
    return map(id, collection);
}

module.exports = values;

},{"./id":58,"./map":63}],85:[function(require,module,exports){
/* eslint no-self-compare: off */

function isNull (a) {
    return a === null;
}

function isUndefined (a) {
    return typeof a === "undefined";
}

function isBoolean (a) {
    return typeof a === "boolean";
}

function isNumber (a) {
    return typeof a === "number";
}

function isFiniteNumber (a) {
    return isNumber(a) && isFinite(a);
}

function isInfiniteNumber (a) {
    return isNumber(a) && !isFinite(a);
}

function isInfinity (a) {
    return isPositiveInfinity(a) || isNegativeInfinity(a);
}

function isPositiveInfinity (a) {
    return a === Number.POSITIVE_INFINITY;
}

function isNegativeInfinity (a) {
    return a === Number.NEGATIVE_INFINITY;
}

function isNaN (a) {
    return a !== a;
}

//
// Checks if a number is an integer. Please note that there's currently no way
// to identify "x.000" and similar as either integer or float in JavaScript because
// those are automatically truncated to "x".
//
function isInteger (n) {
    return isFiniteNumber(n) && n % 1 === 0;
}

function isFloat (n) {
    return isFiniteNumber(n) && n % 1 !== 0;
}

function isString (a) {
    return typeof a === "string";
}

function isChar (a) {
    return isString(a) && a.length === 1;
}

function isCollection (a) {
    return isObject(a) || isArray(a);
}

function isObject (a) {
    return typeof a === "object" && a !== null;
}

function isArray (a) {
    return Array.isArray(a);
}

function isArrayLike (a) {
    return (isArray(a) || isString(a) || (
        isObject(a) && ("length" in a) && isFiniteNumber(a.length) && (
            (a.length > 0 && (a.length - 1) in a) ||
            (a.length === 0)
        )
    ));
}

function isFunction (a) {
    return typeof a === "function";
}

function isPrimitive (a) {
    return isNull(a) || isUndefined(a) || isNumber(a) || isString(a) || isBoolean(a);
}

function isDate (a) {
    return isObject(a) && Object.prototype.toString.call(a) === "[object Date]";
}

function isRegExp (a) {
    return isObject(a) && Object.prototype.toString.call(a) === "[object RegExp]";
}

function isError (a) {
    return isObject(a) && Object.prototype.toString.call(a) === "[object Error]";
}

function isArgumentsObject (a) {
    return isObject(a) && Object.prototype.toString.call(a) === "[object Arguments]";
}

function isMathObject (a) {
    return a === Math;
}

function isType (a) {
    return isDerivable(a) && a.$__type__ === "type" && isFunction(a.$__checker__);
}

function isDerivable (a) {
    return isObject(a) && "$__children__" in a && Array.isArray(a.$__children__);
}

function isMethod (a) {
    return isFunction(a) && a.$__type__ === "method" && isFunction(a.$__default__) &&
        isArray(a.$__implementations__) && isArray(a.$__dispatchers__);
}

module.exports = {
    isArgumentsObject: isArgumentsObject,
    isArray: isArray,
    isArrayLike: isArrayLike,
    isBoolean: isBoolean,
    isChar: isChar,
    isCollection: isCollection,
    isDate: isDate,
    isDerivable: isDerivable,
    isError: isError,
    isFiniteNumber: isFiniteNumber,
    isFloat: isFloat,
    isFunction: isFunction,
    isInfiniteNumber: isInfiniteNumber,
    isInfinity: isInfinity,
    isInteger: isInteger,
    isMathObject: isMathObject,
    isMethod: isMethod,
    isNaN: isNaN,
    isNegativeInfinity: isNegativeInfinity,
    isNull: isNull,
    isNumber: isNumber,
    isPositiveInfinity: isPositiveInfinity,
    isPrimitive: isPrimitive,
    isRegExp: isRegExp,
    isString: isString,
    isType: isType,
    isUndefined: isUndefined
};

},{}],86:[function(require,module,exports){
/*!
 *  howler.js v1.1.29
 *  howlerjs.com
 *
 *  (c) 2013-2016, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

(function() {
  // setup
  var cache = {};

  // setup the audio context
  var ctx = null,
    usingWebAudio = true,
    noAudio = false;
  try {
    if (typeof AudioContext !== 'undefined') {
      ctx = new AudioContext();
    } else if (typeof webkitAudioContext !== 'undefined') {
      ctx = new webkitAudioContext();
    } else {
      usingWebAudio = false;
    }
  } catch(e) {
    usingWebAudio = false;
  }

  if (!usingWebAudio) {
    if (typeof Audio !== 'undefined') {
      try {
        new Audio();
      } catch(e) {
        noAudio = true;
      }
    } else {
      noAudio = true;
    }
  }

  // create a master gain node
  if (usingWebAudio) {
    var masterGain = (typeof ctx.createGain === 'undefined') ? ctx.createGainNode() : ctx.createGain();
    masterGain.gain.value = 1;
    masterGain.connect(ctx.destination);
  }

  // create global controller
  var HowlerGlobal = function(codecs) {
    this._volume = 1;
    this._muted = false;
    this.usingWebAudio = usingWebAudio;
    this.ctx = ctx;
    this.noAudio = noAudio;
    this._howls = [];
    this._codecs = codecs;
    this.iOSAutoEnable = true;
  };
  HowlerGlobal.prototype = {
    /**
     * Get/set the global volume for all sounds.
     * @param  {Float} vol Volume from 0.0 to 1.0.
     * @return {Howler/Float}     Returns self or current volume.
     */
    volume: function(vol) {
      var self = this;

      // make sure volume is a number
      vol = parseFloat(vol);

      if (vol >= 0 && vol <= 1) {
        self._volume = vol;

        if (usingWebAudio) {
          masterGain.gain.value = vol;
        }

        // loop through cache and change volume of all nodes that are using HTML5 Audio
        for (var key in self._howls) {
          if (self._howls.hasOwnProperty(key) && self._howls[key]._webAudio === false) {
            // loop through the audio nodes
            for (var i=0; i<self._howls[key]._audioNode.length; i++) {
              self._howls[key]._audioNode[i].volume = self._howls[key]._volume * self._volume;
            }
          }
        }

        return self;
      }

      // return the current global volume
      return (usingWebAudio) ? masterGain.gain.value : self._volume;
    },

    /**
     * Mute all sounds.
     * @return {Howler}
     */
    mute: function() {
      this._setMuted(true);

      return this;
    },

    /**
     * Unmute all sounds.
     * @return {Howler}
     */
    unmute: function() {
      this._setMuted(false);

      return this;
    },

    /**
     * Handle muting and unmuting globally.
     * @param  {Boolean} muted Is muted or not.
     */
    _setMuted: function(muted) {
      var self = this;

      self._muted = muted;

      if (usingWebAudio) {
        masterGain.gain.value = muted ? 0 : self._volume;
      }

      for (var key in self._howls) {
        if (self._howls.hasOwnProperty(key) && self._howls[key]._webAudio === false) {
          // loop through the audio nodes
          for (var i=0; i<self._howls[key]._audioNode.length; i++) {
            self._howls[key]._audioNode[i].muted = muted;
          }
        }
      }
    },

    /**
     * Check for codec support.
     * @param  {String} ext Audio file extension.
     * @return {Boolean}
     */
    codecs: function(ext) {
      return this._codecs[ext];
    },

    /**
     * iOS will only allow audio to be played after a user interaction.
     * Attempt to automatically unlock audio on the first user interaction.
     * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
     * @return {Howler}
     */
    _enableiOSAudio: function() {
      var self = this;

      // only run this on iOS if audio isn't already eanbled
      if (ctx && (self._iOSEnabled || !/iPhone|iPad|iPod/i.test(navigator.userAgent))) {
        return;
      }

      self._iOSEnabled = false;

      // call this method on touch start to create and play a buffer,
      // then check if the audio actually played to determine if
      // audio has now been unlocked on iOS
      var unlock = function() {
        // create an empty buffer
        var buffer = ctx.createBuffer(1, 1, 22050);
        var source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);

        // play the empty buffer
        if (typeof source.start === 'undefined') {
          source.noteOn(0);
        } else {
          source.start(0);
        }

        // setup a timeout to check that we are unlocked on the next event loop
        setTimeout(function() {
          if ((source.playbackState === source.PLAYING_STATE || source.playbackState === source.FINISHED_STATE)) {
            // update the unlocked state and prevent this check from happening again
            self._iOSEnabled = true;
            self.iOSAutoEnable = false;

            // remove the touch start listener
            window.removeEventListener('touchend', unlock, false);
          }
        }, 0);
      };

      // setup a touch start listener to attempt an unlock in
      window.addEventListener('touchend', unlock, false);

      return self;
    }
  };

  // check for browser codec support
  var audioTest = null;
  var codecs = {};
  if (!noAudio) {
    audioTest = new Audio();
    codecs = {
      mp3: !!audioTest.canPlayType('audio/mpeg;').replace(/^no$/, ''),
      opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ''),
      ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
      wav: !!audioTest.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ''),
      aac: !!audioTest.canPlayType('audio/aac;').replace(/^no$/, ''),
      m4a: !!(audioTest.canPlayType('audio/x-m4a;') || audioTest.canPlayType('audio/m4a;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
      mp4: !!(audioTest.canPlayType('audio/x-mp4;') || audioTest.canPlayType('audio/mp4;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
      weba: !!audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, '')
    };
  }

  // allow access to the global audio controls
  var Howler = new HowlerGlobal(codecs);

  // setup the audio object
  var Howl = function(o) {
    var self = this;

    // setup the defaults
    self._autoplay = o.autoplay || false;
    self._buffer = o.buffer || false;
    self._duration = o.duration || 0;
    self._format = o.format || null;
    self._loop = o.loop || false;
    self._loaded = false;
    self._sprite = o.sprite || {};
    self._src = o.src || '';
    self._pos3d = o.pos3d || [0, 0, -0.5];
    self._volume = o.volume !== undefined ? o.volume : 1;
    self._urls = o.urls || [];
    self._rate = o.rate || 1;

    // allow forcing of a specific panningModel ('equalpower' or 'HRTF'),
    // if none is specified, defaults to 'equalpower' and switches to 'HRTF'
    // if 3d sound is used
    self._model = o.model || null;

    // setup event functions
    self._onload = [o.onload || function() {}];
    self._onloaderror = [o.onloaderror || function() {}];
    self._onend = [o.onend || function() {}];
    self._onpause = [o.onpause || function() {}];
    self._onplay = [o.onplay || function() {}];

    self._onendTimer = [];

    // Web Audio or HTML5 Audio?
    self._webAudio = usingWebAudio && !self._buffer;

    // check if we need to fall back to HTML5 Audio
    self._audioNode = [];
    if (self._webAudio) {
      self._setupAudioNode();
    }

    // automatically try to enable audio on iOS
    if (typeof ctx !== 'undefined' && ctx && Howler.iOSAutoEnable) {
      Howler._enableiOSAudio();
    }

    // add this to an array of Howl's to allow global control
    Howler._howls.push(self);

    // load the track
    self.load();
  };

  // setup all of the methods
  Howl.prototype = {
    /**
     * Load an audio file.
     * @return {Howl}
     */
    load: function() {
      var self = this,
        url = null;

      // if no audio is available, quit immediately
      if (noAudio) {
        self.on('loaderror', new Error('No audio support.'));
        return;
      }

      // loop through source URLs and pick the first one that is compatible
      for (var i=0; i<self._urls.length; i++) {
        var ext, urlItem;

        if (self._format) {
          // use specified audio format if available
          ext = self._format;
        } else {
          // figure out the filetype (whether an extension or base64 data)
          urlItem = self._urls[i];
          ext = /^data:audio\/([^;,]+);/i.exec(urlItem);
          if (!ext) {
            ext = /\.([^.]+)$/.exec(urlItem.split('?', 1)[0]);
          }

          if (ext) {
            ext = ext[1].toLowerCase();
          } else {
            self.on('loaderror', new Error('Could not extract format from passed URLs, please add format parameter.'));
            return;
          }
        }

        if (codecs[ext]) {
          url = self._urls[i];
          break;
        }
      }

      if (!url) {
        self.on('loaderror', new Error('No codec support for selected audio sources.'));
        return;
      }

      self._src = url;

      if (self._webAudio) {
        loadBuffer(self, url);
      } else {
        var newNode = new Audio();

        // listen for errors with HTML5 audio (http://dev.w3.org/html5/spec-author-view/spec.html#mediaerror)
        newNode.addEventListener('error', function () {
          if (newNode.error && newNode.error.code === 4) {
            HowlerGlobal.noAudio = true;
          }

          self.on('loaderror', {type: newNode.error ? newNode.error.code : 0});
        }, false);

        self._audioNode.push(newNode);

        // setup the new audio node
        newNode.src = url;
        newNode._pos = 0;
        newNode.preload = 'auto';
        newNode.volume = (Howler._muted) ? 0 : self._volume * Howler.volume();

        // setup the event listener to start playing the sound
        // as soon as it has buffered enough
        var listener = function() {
          // round up the duration when using HTML5 Audio to account for the lower precision
          self._duration = Math.ceil(newNode.duration * 10) / 10;

          // setup a sprite if none is defined
          if (Object.getOwnPropertyNames(self._sprite).length === 0) {
            self._sprite = {_default: [0, self._duration * 1000]};
          }

          if (!self._loaded) {
            self._loaded = true;
            self.on('load');
          }

          if (self._autoplay) {
            self.play();
          }

          // clear the event listener
          newNode.removeEventListener('canplaythrough', listener, false);
        };
        newNode.addEventListener('canplaythrough', listener, false);
        newNode.load();
      }

      return self;
    },

    /**
     * Get/set the URLs to be pulled from to play in this source.
     * @param  {Array} urls  Arry of URLs to load from
     * @return {Howl}        Returns self or the current URLs
     */
    urls: function(urls) {
      var self = this;

      if (urls) {
        self.stop();
        self._urls = (typeof urls === 'string') ? [urls] : urls;
        self._loaded = false;
        self.load();

        return self;
      } else {
        return self._urls;
      }
    },

    /**
     * Play a sound from the current time (0 by default).
     * @param  {String}   sprite   (optional) Plays from the specified position in the sound sprite definition.
     * @param  {Function} callback (optional) Returns the unique playback id for this sound instance.
     * @return {Howl}
     */
    play: function(sprite, callback) {
      var self = this;

      // if no sprite was passed but a callback was, update the variables
      if (typeof sprite === 'function') {
        callback = sprite;
      }

      // use the default sprite if none is passed
      if (!sprite || typeof sprite === 'function') {
        sprite = '_default';
      }

      // if the sound hasn't been loaded, add it to the event queue
      if (!self._loaded) {
        self.on('load', function() {
          self.play(sprite, callback);
        });

        return self;
      }

      // if the sprite doesn't exist, play nothing
      if (!self._sprite[sprite]) {
        if (typeof callback === 'function') callback();
        return self;
      }

      // get the node to playback
      self._inactiveNode(function(node) {
        // persist the sprite being played
        node._sprite = sprite;

        // determine where to start playing from
        var pos = (node._pos > 0) ? node._pos : self._sprite[sprite][0] / 1000;

        // determine how long to play for
        var duration = 0;
        if (self._webAudio) {
          duration = self._sprite[sprite][1] / 1000 - node._pos;
          if (node._pos > 0) {
            pos = self._sprite[sprite][0] / 1000 + pos;
          }
        } else {
          duration = self._sprite[sprite][1] / 1000 - (pos - self._sprite[sprite][0] / 1000);
        }

        // determine if this sound should be looped
        var loop = !!(self._loop || self._sprite[sprite][2]);

        // set timer to fire the 'onend' event
        var soundId = (typeof callback === 'string') ? callback : Math.round(Date.now() * Math.random()) + '',
          timerId;
        (function() {
          var data = {
            id: soundId,
            sprite: sprite,
            loop: loop
          };
          timerId = setTimeout(function() {
            // if looping, restart the track
            if (!self._webAudio && loop) {
              self.stop(data.id).play(sprite, data.id);
            }

            // set web audio node to paused at end
            if (self._webAudio && !loop) {
              self._nodeById(data.id).paused = true;
              self._nodeById(data.id)._pos = 0;

              // clear the end timer
              self._clearEndTimer(data.id);
            }

            // end the track if it is HTML audio and a sprite
            if (!self._webAudio && !loop) {
              self.stop(data.id);
            }

            // fire ended event
            self.on('end', soundId);
          }, (duration / self._rate) * 1000);

          // store the reference to the timer
          self._onendTimer.push({timer: timerId, id: data.id});
        })();

        if (self._webAudio) {
          var loopStart = self._sprite[sprite][0] / 1000,
            loopEnd = self._sprite[sprite][1] / 1000;

          // set the play id to this node and load into context
          node.id = soundId;
          node.paused = false;
          refreshBuffer(self, [loop, loopStart, loopEnd], soundId);
          self._playStart = ctx.currentTime;
          node.gain.value = self._volume;

          if (typeof node.bufferSource.start === 'undefined') {
            loop ? node.bufferSource.noteGrainOn(0, pos, 86400) : node.bufferSource.noteGrainOn(0, pos, duration);
          } else {
            loop ? node.bufferSource.start(0, pos, 86400) : node.bufferSource.start(0, pos, duration);
          }
        } else {
          if (node.readyState === 4 || !node.readyState && navigator.isCocoonJS) {
            node.readyState = 4;
            node.id = soundId;
            node.currentTime = pos;
            node.muted = Howler._muted || node.muted;
            node.volume = self._volume * Howler.volume();
            setTimeout(function() { node.play(); }, 0);
          } else {
            self._clearEndTimer(soundId);

            (function(){
              var sound = self,
                playSprite = sprite,
                fn = callback,
                newNode = node;
              var listener = function() {
                sound.play(playSprite, fn);

                // clear the event listener
                newNode.removeEventListener('canplaythrough', listener, false);
              };
              newNode.addEventListener('canplaythrough', listener, false);
            })();

            return self;
          }
        }

        // fire the play event and send the soundId back in the callback
        self.on('play');
        if (typeof callback === 'function') callback(soundId);

        return self;
      });

      return self;
    },

    /**
     * Pause playback and save the current position.
     * @param {String} id (optional) The play instance ID.
     * @return {Howl}
     */
    pause: function(id) {
      var self = this;

      // if the sound hasn't been loaded, add it to the event queue
      if (!self._loaded) {
        self.on('play', function() {
          self.pause(id);
        });

        return self;
      }

      // clear 'onend' timer
      self._clearEndTimer(id);

      var activeNode = (id) ? self._nodeById(id) : self._activeNode();
      if (activeNode) {
        activeNode._pos = self.pos(null, id);

        if (self._webAudio) {
          // make sure the sound has been created
          if (!activeNode.bufferSource || activeNode.paused) {
            return self;
          }

          activeNode.paused = true;
          if (typeof activeNode.bufferSource.stop === 'undefined') {
            activeNode.bufferSource.noteOff(0);
          } else {
            activeNode.bufferSource.stop(0);
          }
        } else {
          activeNode.pause();
        }
      }

      self.on('pause');

      return self;
    },

    /**
     * Stop playback and reset to start.
     * @param  {String} id  (optional) The play instance ID.
     * @return {Howl}
     */
    stop: function(id) {
      var self = this;

      // if the sound hasn't been loaded, add it to the event queue
      if (!self._loaded) {
        self.on('play', function() {
          self.stop(id);
        });

        return self;
      }

      // clear 'onend' timer
      self._clearEndTimer(id);

      var activeNode = (id) ? self._nodeById(id) : self._activeNode();
      if (activeNode) {
        activeNode._pos = 0;

        if (self._webAudio) {
          // make sure the sound has been created
          if (!activeNode.bufferSource || activeNode.paused) {
            return self;
          }

          activeNode.paused = true;

          if (typeof activeNode.bufferSource.stop === 'undefined') {
            activeNode.bufferSource.noteOff(0);
          } else {
            activeNode.bufferSource.stop(0);
          }
        } else if (!isNaN(activeNode.duration)) {
          activeNode.pause();
          activeNode.currentTime = 0;
        }
      }

      return self;
    },

    /**
     * Mute this sound.
     * @param  {String} id (optional) The play instance ID.
     * @return {Howl}
     */
    mute: function(id) {
      var self = this;

      // if the sound hasn't been loaded, add it to the event queue
      if (!self._loaded) {
        self.on('play', function() {
          self.mute(id);
        });

        return self;
      }

      var activeNode = (id) ? self._nodeById(id) : self._activeNode();
      if (activeNode) {
        if (self._webAudio) {
          activeNode.gain.value = 0;
        } else {
          activeNode.muted = true;
        }
      }

      return self;
    },

    /**
     * Unmute this sound.
     * @param  {String} id (optional) The play instance ID.
     * @return {Howl}
     */
    unmute: function(id) {
      var self = this;

      // if the sound hasn't been loaded, add it to the event queue
      if (!self._loaded) {
        self.on('play', function() {
          self.unmute(id);
        });

        return self;
      }

      var activeNode = (id) ? self._nodeById(id) : self._activeNode();
      if (activeNode) {
        if (self._webAudio) {
          activeNode.gain.value = self._volume;
        } else {
          activeNode.muted = false;
        }
      }

      return self;
    },

    /**
     * Get/set volume of this sound.
     * @param  {Float}  vol Volume from 0.0 to 1.0.
     * @param  {String} id  (optional) The play instance ID.
     * @return {Howl/Float}     Returns self or current volume.
     */
    volume: function(vol, id) {
      var self = this;

      // make sure volume is a number
      vol = parseFloat(vol);

      if (vol >= 0 && vol <= 1) {
        self._volume = vol;

        // if the sound hasn't been loaded, add it to the event queue
        if (!self._loaded) {
          self.on('play', function() {
            self.volume(vol, id);
          });

          return self;
        }

        var activeNode = (id) ? self._nodeById(id) : self._activeNode();
        if (activeNode) {
          if (self._webAudio) {
            activeNode.gain.value = vol;
          } else {
            activeNode.volume = vol * Howler.volume();
          }
        }

        return self;
      } else {
        return self._volume;
      }
    },

    /**
     * Get/set whether to loop the sound.
     * @param  {Boolean} loop To loop or not to loop, that is the question.
     * @return {Howl/Boolean}      Returns self or current looping value.
     */
    loop: function(loop) {
      var self = this;

      if (typeof loop === 'boolean') {
        self._loop = loop;

        return self;
      } else {
        return self._loop;
      }
    },

    /**
     * Get/set sound sprite definition.
     * @param  {Object} sprite Example: {spriteName: [offset, duration, loop]}
     *                @param {Integer} offset   Where to begin playback in milliseconds
     *                @param {Integer} duration How long to play in milliseconds
     *                @param {Boolean} loop     (optional) Set true to loop this sprite
     * @return {Howl}        Returns current sprite sheet or self.
     */
    sprite: function(sprite) {
      var self = this;

      if (typeof sprite === 'object') {
        self._sprite = sprite;

        return self;
      } else {
        return self._sprite;
      }
    },

    /**
     * Get/set the position of playback.
     * @param  {Float}  pos The position to move current playback to.
     * @param  {String} id  (optional) The play instance ID.
     * @return {Howl/Float}      Returns self or current playback position.
     */
    pos: function(pos, id) {
      var self = this;

      // if the sound hasn't been loaded, add it to the event queue
      if (!self._loaded) {
        self.on('load', function() {
          self.pos(pos);
        });

        return typeof pos === 'number' ? self : self._pos || 0;
      }

      // make sure we are dealing with a number for pos
      pos = parseFloat(pos);

      var activeNode = (id) ? self._nodeById(id) : self._activeNode();
      if (activeNode) {
        if (pos >= 0) {
          self.pause(id);
          activeNode._pos = pos;
          self.play(activeNode._sprite, id);

          return self;
        } else {
          return self._webAudio ? activeNode._pos + (ctx.currentTime - self._playStart) : activeNode.currentTime;
        }
      } else if (pos >= 0) {
        return self;
      } else {
        // find the first inactive node to return the pos for
        for (var i=0; i<self._audioNode.length; i++) {
          if (self._audioNode[i].paused && self._audioNode[i].readyState === 4) {
            return (self._webAudio) ? self._audioNode[i]._pos : self._audioNode[i].currentTime;
          }
        }
      }
    },

    /**
     * Get/set the 3D position of the audio source.
     * The most common usage is to set the 'x' position
     * to affect the left/right ear panning. Setting any value higher than
     * 1.0 will begin to decrease the volume of the sound as it moves further away.
     * NOTE: This only works with Web Audio API, HTML5 Audio playback
     * will not be affected.
     * @param  {Float}  x  The x-position of the playback from -1000.0 to 1000.0
     * @param  {Float}  y  The y-position of the playback from -1000.0 to 1000.0
     * @param  {Float}  z  The z-position of the playback from -1000.0 to 1000.0
     * @param  {String} id (optional) The play instance ID.
     * @return {Howl/Array}   Returns self or the current 3D position: [x, y, z]
     */
    pos3d: function(x, y, z, id) {
      var self = this;

      // set a default for the optional 'y' & 'z'
      y = (typeof y === 'undefined' || !y) ? 0 : y;
      z = (typeof z === 'undefined' || !z) ? -0.5 : z;

      // if the sound hasn't been loaded, add it to the event queue
      if (!self._loaded) {
        self.on('play', function() {
          self.pos3d(x, y, z, id);
        });

        return self;
      }

      if (x >= 0 || x < 0) {
        if (self._webAudio) {
          var activeNode = (id) ? self._nodeById(id) : self._activeNode();
          if (activeNode) {
            self._pos3d = [x, y, z];
            activeNode.panner.setPosition(x, y, z);
            activeNode.panner.panningModel = self._model || 'HRTF';
          }
        }
      } else {
        return self._pos3d;
      }

      return self;
    },

    /**
     * Fade a currently playing sound between two volumes.
     * @param  {Number}   from     The volume to fade from (0.0 to 1.0).
     * @param  {Number}   to       The volume to fade to (0.0 to 1.0).
     * @param  {Number}   len      Time in milliseconds to fade.
     * @param  {Function} callback (optional) Fired when the fade is complete.
     * @param  {String}   id       (optional) The play instance ID.
     * @return {Howl}
     */
    fade: function(from, to, len, callback, id) {
      var self = this,
        diff = Math.abs(from - to),
        dir = from > to ? 'down' : 'up',
        steps = diff / 0.01,
        stepTime = len / steps;

      // if the sound hasn't been loaded, add it to the event queue
      if (!self._loaded) {
        self.on('load', function() {
          self.fade(from, to, len, callback, id);
        });

        return self;
      }

      // set the volume to the start position
      self.volume(from, id);

      for (var i=1; i<=steps; i++) {
        (function() {
          var change = self._volume + (dir === 'up' ? 0.01 : -0.01) * i,
            vol = Math.round(1000 * change) / 1000,
            toVol = to;

          setTimeout(function() {
            self.volume(vol, id);

            if (vol === toVol) {
              if (callback) callback();
            }
          }, stepTime * i);
        })();
      }
    },

    /**
     * [DEPRECATED] Fade in the current sound.
     * @param  {Float}    to      Volume to fade to (0.0 to 1.0).
     * @param  {Number}   len     Time in milliseconds to fade.
     * @param  {Function} callback
     * @return {Howl}
     */
    fadeIn: function(to, len, callback) {
      return this.volume(0).play().fade(0, to, len, callback);
    },

    /**
     * [DEPRECATED] Fade out the current sound and pause when finished.
     * @param  {Float}    to       Volume to fade to (0.0 to 1.0).
     * @param  {Number}   len      Time in milliseconds to fade.
     * @param  {Function} callback
     * @param  {String}   id       (optional) The play instance ID.
     * @return {Howl}
     */
    fadeOut: function(to, len, callback, id) {
      var self = this;

      return self.fade(self._volume, to, len, function() {
        if (callback) callback();
        self.pause(id);

        // fire ended event
        self.on('end');
      }, id);
    },

    /**
     * Get an audio node by ID.
     * @return {Howl} Audio node.
     */
    _nodeById: function(id) {
      var self = this,
        node = self._audioNode[0];

      // find the node with this ID
      for (var i=0; i<self._audioNode.length; i++) {
        if (self._audioNode[i].id === id) {
          node = self._audioNode[i];
          break;
        }
      }

      return node;
    },

    /**
     * Get the first active audio node.
     * @return {Howl} Audio node.
     */
    _activeNode: function() {
      var self = this,
        node = null;

      // find the first playing node
      for (var i=0; i<self._audioNode.length; i++) {
        if (!self._audioNode[i].paused) {
          node = self._audioNode[i];
          break;
        }
      }

      // remove excess inactive nodes
      self._drainPool();

      return node;
    },

    /**
     * Get the first inactive audio node.
     * If there is none, create a new one and add it to the pool.
     * @param  {Function} callback Function to call when the audio node is ready.
     */
    _inactiveNode: function(callback) {
      var self = this,
        node = null;

      // find first inactive node to recycle
      for (var i=0; i<self._audioNode.length; i++) {
        if (self._audioNode[i].paused && self._audioNode[i].readyState === 4) {
          // send the node back for use by the new play instance
          callback(self._audioNode[i]);
          node = true;
          break;
        }
      }

      // remove excess inactive nodes
      self._drainPool();

      if (node) {
        return;
      }

      // create new node if there are no inactives
      var newNode;
      if (self._webAudio) {
        newNode = self._setupAudioNode();
        callback(newNode);
      } else {
        self.load();
        newNode = self._audioNode[self._audioNode.length - 1];

        // listen for the correct load event and fire the callback
        var listenerEvent = navigator.isCocoonJS ? 'canplaythrough' : 'loadedmetadata';
        var listener = function() {
          newNode.removeEventListener(listenerEvent, listener, false);
          callback(newNode);
        };
        newNode.addEventListener(listenerEvent, listener, false);
      }
    },

    /**
     * If there are more than 5 inactive audio nodes in the pool, clear out the rest.
     */
    _drainPool: function() {
      var self = this,
        inactive = 0,
        i;

      // count the number of inactive nodes
      for (i=0; i<self._audioNode.length; i++) {
        if (self._audioNode[i].paused) {
          inactive++;
        }
      }

      // remove excess inactive nodes
      for (i=self._audioNode.length-1; i>=0; i--) {
        if (inactive <= 5) {
          break;
        }

        if (self._audioNode[i].paused) {
          // disconnect the audio source if using Web Audio
          if (self._webAudio) {
            self._audioNode[i].disconnect(0);
          }

          inactive--;
          self._audioNode.splice(i, 1);
        }
      }
    },

    /**
     * Clear 'onend' timeout before it ends.
     * @param  {String} soundId  The play instance ID.
     */
    _clearEndTimer: function(soundId) {
      var self = this,
        index = -1;

      // loop through the timers to find the one associated with this sound
      for (var i=0; i<self._onendTimer.length; i++) {
        if (self._onendTimer[i].id === soundId) {
          index = i;
          break;
        }
      }

      var timer = self._onendTimer[index];
      if (timer) {
        clearTimeout(timer.timer);
        self._onendTimer.splice(index, 1);
      }
    },

    /**
     * Setup the gain node and panner for a Web Audio instance.
     * @return {Object} The new audio node.
     */
    _setupAudioNode: function() {
      var self = this,
        node = self._audioNode,
        index = self._audioNode.length;

      // create gain node
      node[index] = (typeof ctx.createGain === 'undefined') ? ctx.createGainNode() : ctx.createGain();
      node[index].gain.value = self._volume;
      node[index].paused = true;
      node[index]._pos = 0;
      node[index].readyState = 4;
      node[index].connect(masterGain);

      // create the panner
      node[index].panner = ctx.createPanner();
      node[index].panner.panningModel = self._model || 'equalpower';
      node[index].panner.setPosition(self._pos3d[0], self._pos3d[1], self._pos3d[2]);
      node[index].panner.connect(node[index]);

      return node[index];
    },

    /**
     * Call/set custom events.
     * @param  {String}   event Event type.
     * @param  {Function} fn    Function to call.
     * @return {Howl}
     */
    on: function(event, fn) {
      var self = this,
        events = self['_on' + event];

      if (typeof fn === 'function') {
        events.push(fn);
      } else {
        for (var i=0; i<events.length; i++) {
          if (fn) {
            events[i].call(self, fn);
          } else {
            events[i].call(self);
          }
        }
      }

      return self;
    },

    /**
     * Remove a custom event.
     * @param  {String}   event Event type.
     * @param  {Function} fn    Listener to remove.
     * @return {Howl}
     */
    off: function(event, fn) {
      var self = this,
        events = self['_on' + event];

      if (fn) {
        // loop through functions in the event for comparison
        for (var i=0; i<events.length; i++) {
          if (fn === events[i]) {
            events.splice(i, 1);
            break;
          }
        }
      } else {
        self['_on' + event] = [];
      }

      return self;
    },

    /**
     * Unload and destroy the current Howl object.
     * This will immediately stop all play instances attached to this sound.
     */
    unload: function() {
      var self = this;

      // stop playing any active nodes
      var nodes = self._audioNode;
      for (var i=0; i<self._audioNode.length; i++) {
        // stop the sound if it is currently playing
        if (!nodes[i].paused) {
          self.stop(nodes[i].id);
          self.on('end', nodes[i].id);
        }

        if (!self._webAudio) {
          // remove the source if using HTML5 Audio
          nodes[i].src = '';
        } else {
          // disconnect the output from the master gain
          nodes[i].disconnect(0);
        }
      }

      // make sure all timeouts are cleared
      for (i=0; i<self._onendTimer.length; i++) {
        clearTimeout(self._onendTimer[i].timer);
      }

      // remove the reference in the global Howler object
      var index = Howler._howls.indexOf(self);
      if (index !== null && index >= 0) {
        Howler._howls.splice(index, 1);
      }

      // delete this sound from the cache
      delete cache[self._src];
      self = null;
    }

  };

  // only define these functions when using WebAudio
  if (usingWebAudio) {

    /**
     * Buffer a sound from URL (or from cache) and decode to audio source (Web Audio API).
     * @param  {Object} obj The Howl object for the sound to load.
     * @param  {String} url The path to the sound file.
     */
    var loadBuffer = function(obj, url) {
      // check if the buffer has already been cached
      if (url in cache) {
        // set the duration from the cache
        obj._duration = cache[url].duration;

        // load the sound into this object
        loadSound(obj);
        return;
      }
      
      if (/^data:[^;]+;base64,/.test(url)) {
        // Decode base64 data-URIs because some browsers cannot load data-URIs with XMLHttpRequest.
        var data = atob(url.split(',')[1]);
        var dataView = new Uint8Array(data.length);
        for (var i=0; i<data.length; ++i) {
          dataView[i] = data.charCodeAt(i);
        }
        
        decodeAudioData(dataView.buffer, obj, url);
      } else {
        // load the buffer from the URL
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function() {
          decodeAudioData(xhr.response, obj, url);
        };
        xhr.onerror = function() {
          // if there is an error, switch the sound to HTML Audio
          if (obj._webAudio) {
            obj._buffer = true;
            obj._webAudio = false;
            obj._audioNode = [];
            delete obj._gainNode;
            delete cache[url];
            obj.load();
          }
        };
        try {
          xhr.send();
        } catch (e) {
          xhr.onerror();
        }
      }
    };

    /**
     * Decode audio data from an array buffer.
     * @param  {ArrayBuffer} arraybuffer The audio data.
     * @param  {Object} obj The Howl object for the sound to load.
     * @param  {String} url The path to the sound file.
     */
    var decodeAudioData = function(arraybuffer, obj, url) {
      // decode the buffer into an audio source
      ctx.decodeAudioData(
        arraybuffer,
        function(buffer) {
          if (buffer) {
            cache[url] = buffer;
            loadSound(obj, buffer);
          }
        },
        function(err) {
          obj.on('loaderror', err);
        }
      );
    };

    /**
     * Finishes loading the Web Audio API sound and fires the loaded event
     * @param  {Object}  obj    The Howl object for the sound to load.
     * @param  {Objecct} buffer The decoded buffer sound source.
     */
    var loadSound = function(obj, buffer) {
      // set the duration
      obj._duration = (buffer) ? buffer.duration : obj._duration;

      // setup a sprite if none is defined
      if (Object.getOwnPropertyNames(obj._sprite).length === 0) {
        obj._sprite = {_default: [0, obj._duration * 1000]};
      }

      // fire the loaded event
      if (!obj._loaded) {
        obj._loaded = true;
        obj.on('load');
      }

      if (obj._autoplay) {
        obj.play();
      }
    };

    /**
     * Load the sound back into the buffer source.
     * @param  {Object} obj   The sound to load.
     * @param  {Array}  loop  Loop boolean, pos, and duration.
     * @param  {String} id    (optional) The play instance ID.
     */
    var refreshBuffer = function(obj, loop, id) {
      // determine which node to connect to
      var node = obj._nodeById(id);

      // setup the buffer source for playback
      node.bufferSource = ctx.createBufferSource();
      node.bufferSource.buffer = cache[obj._src];
      node.bufferSource.connect(node.panner);
      node.bufferSource.loop = loop[0];
      if (loop[0]) {
        node.bufferSource.loopStart = loop[1];
        node.bufferSource.loopEnd = loop[1] + loop[2];
      }
      node.bufferSource.playbackRate.value = obj._rate;
    };

  }

  /**
   * Add support for AMD (Asynchronous Module Definition) libraries such as require.js.
   */
  if (typeof define === 'function' && define.amd) {
    define(function() {
      return {
        Howler: Howler,
        Howl: Howl
      };
    });
  }

  /**
   * Add support for CommonJS libraries such as browserify.
   */
  if (typeof exports !== 'undefined') {
    exports.Howler = Howler;
    exports.Howl = Howl;
  }

  // define globally in case AMD is not available or available but not used

  if (typeof window !== 'undefined') {
    window.Howler = Howler;
    window.Howl = Howl;
  }

})();

},{}],87:[function(require,module,exports){
//
// A simple dictionary prototype for JavaScript, avoiding common object pitfalls
// and offering some handy convenience methods.
//

/* global module, require, window */

var prefix = "string-dict_";

function makeKey (k) {
    return prefix + k;
}

function revokeKey (k) {
    return k.replace(new RegExp(prefix), "");
}

function Dict (content) {
    
    var key;
    
    this.clear();
    
    if (content) {
        for (key in content) {
            this.set(key, content[key]);
        }
    }
}

Dict.prototype.clear = function () {
    this.items = {};
    this.count = 0;
};

Dict.prototype.length = function () {
    return this.count;
};

Dict.prototype.set = function (k, value) {
    
    var key = makeKey(k);
    
    if (!k) {
        throw new Error("Dictionary keys cannot be falsy.");
    }
    
    if (this.has(key)) {
        this.remove(key);
    }
    
    this.items[key] = value;
    this.count += 1;
    
    return this;
};

Dict.prototype.get = function (k) {
    
    var key = makeKey(k);
    
    if (!this.items.hasOwnProperty(key)) {
        return undefined;
    }
    
    return this.items[key];
};

//
// The same as .get(), but throws when the key doesn't exist.
// This can be useful if you want to use a dict as some sort of registry.
//
Dict.prototype.require = function (key) {
    
    if (!this.has(key)) {
        throw new Error("Required key '" + key + "' does not exist.");
    }
    
    return this.get(key);
};

Dict.prototype.remove = function (k) {
    
    var key = makeKey(k);
    
    if (this.has(k)) {
        delete this.items[key];
        this.count -= 1;
    }
    
    return this;
};

Dict.prototype.has = function (k) {
    
    var key = makeKey(k);
    
    return this.items.hasOwnProperty(key);
};

Dict.prototype.forEach = function (fn) {
    
    if (!fn || typeof fn !== "function") {
        throw new Error("Argument 1 is expected to be of type function.");
    }
    
    for (var key in this.items) {
        fn(this.items[key], revokeKey(key), this);
    }
    
    return this;
};

Dict.prototype.filter = function (fn) {
    
    var matches = new Dict();
    
    this.forEach(function (item, key, all) {
        if (fn(item, key, all)) {
            matches.set(key, item);
        }
    });
    
    return matches;
};

Dict.prototype.find = function (fn) {
    
    var value;
    
    this.some(function (item, key, all) {
        
        if (fn(item, key, all)) {
            value = item;
            return true;
        }
        
        return false;
    });
    
    return value;
};

Dict.prototype.map = function (fn) {
    
    var mapped = new Dict();
    
    this.forEach(function (item, key, all) {
        mapped.set(key, fn(item, key, all));
    });
    
    return mapped;
};

Dict.prototype.reduce = function (fn, initialValue) {
    
    var result = initialValue;
    
    this.forEach(function (item, key, all) {
        result = fn(result, item, key, all);
    });
    
    return result;
};

Dict.prototype.every = function (fn) {
    return this.reduce(function (last, item, key, all) {
        return last && fn(item, key, all);
    }, true);
};

Dict.prototype.some = function (fn) {
    
    for (var key in this.items) {
        if (fn(this.items[key], revokeKey(key), this)) {
            return true;
        }
    }
    
    return false;
};

//
// Returns an array containing the dictionary's keys.
//
Dict.prototype.keys = function () {
    
    var keys = [];
    
    this.forEach(function (item, key) {
        keys.push(key);
    });
    
    return keys;
};

//
// Returns the dictionary's values in an array.
//
Dict.prototype.values = function () {

    var values = [];
    
    this.forEach(function (item) {
        values.push(item);
    });
    
    return values;
};

//
// Creates a normal JS object containing the contents of the dictionary.
//
Dict.prototype.toObject = function () {
    
    var jsObject = {};
    
    this.forEach(function (item, key) {
        jsObject[key] = item;
    });
    
    return jsObject;
};

//
// Creates another dictionary with the same contents as this one.
//
Dict.prototype.clone = function () {
    
    var clone = new Dict();
    
    this.forEach(function (item, key) {
        clone.set(key, item);
    });
    
    return clone;
};

//
// Adds the content of another dictionary to this dictionary's content.
//
Dict.prototype.addMap = function (otherMap) {
    
    var self = this;
    
    otherMap.forEach(function (item, key) {
        self.set(key, item);
    });
    
    return this;
};

//
// Returns a new map which is the result of joining this map
// with another map. This map isn't changed in the process.
// The keys from otherMap will replace any keys from this map that
// are the same.
//
Dict.prototype.join = function (otherMap) {
    return this.clone().addMap(otherMap);
};

module.exports = Dict;

},{}],88:[function(require,module,exports){
/* global requestAnimationFrame */

var eases = require("eases");

if (typeof requestAnimationFrame === "undefined") {
    var requestAnimationFrame = function (fn) {
        setTimeout(fn, 1000 / 60);
    }
}

function transformation (from, to, callback, args, after) {
    
    var dur, easing, cv, diff, c, lastExecution, fps;
    var canceled, paused, running, stopped;
    var timeElapsed, startTime, pauseTimeElapsed, pauseStartTime;
    
    args = args || {};
    
    if (typeof args === "function" && !after) {
        after = args;
        args = {};
    }
    
    after = typeof after === "function" ? after : function () {};
    
    if (typeof callback === "undefined" || !callback) {
        throw new Error("Argument callback must be a function.");
    }
    
    init();
    
    function init () {
        
        dur = typeof args.duration !== "undefined" && args.duration >= 0 ? args.duration : 500;
        cv = from;
        diff = to - from;
        c = 0, // number of times loop get's executed
        lastExecution = 0;
        fps = args.fps || 60;
        canceled = false;
        paused = false;
        running = false;
        stopped = false;
        timeElapsed = 0;
        startTime = 0;
        pauseTimeElapsed = 0;
        pauseStartTime = 0;
        easing = eases.linear;
        
        if (args.easing) {
            if (typeof args.easing === "function") {
                easing = args.easing;
            }
            else {
                easing = eases[args.easing];
            }
        }
    }
    
    function loop () {
        
        var dt, tElapsed;
        
        if (!running) {
            return;
        }
        
        if ((Date.now() - lastExecution) > (1000 / fps)) {
            
            if (canceled || paused) {
                return;
            }
            
            c += 1;
            tElapsed = elapsed();
            
            if (tElapsed > dur || stopped) {
                
                cv = from + diff;
                
                if (!stopped) {
                    stop();
                }
                
                return;
            }
            
            cv = easing(tElapsed / dur) * diff + from;
            
            callback(cv);
            
            dt = elapsed() - tElapsed;
            
            lastExecution = Date.now();
        }
        
        requestAnimationFrame(loop);
    };
    
    function elapsed () {
        
        if (running && !paused) {
            timeElapsed = ((+(new Date()) - startTime) - pauseTimeElapsed);
        }
        
        return timeElapsed;
    }
    
    function start () {
        
        reset();
        
        startTime = +(new Date());
        pauseStartTime = startTime;
        running = true;
        
        requestAnimationFrame(loop);
    }
    
    function stop () {
        
        running = false;
        paused = false;
        
        callback(to);
        after();
    }
    
    function resume () {
        
        if (!paused) {
            return;
        }
        
        paused = false;
        pauseTimeElapsed += +(new Date()) - pauseStartTime;
        
        requestAnimationFrame(loop);
    }
    
    function pause () {
        paused = true;
        pauseStartTime = +(new Date());
    }
    
    function cancel () {
        
        if (!running) {
            return;
        }
        
        elapsed();
        
        canceled = true;
        running = false;
        paused = false;
        
        after();
    }
    
    function reset () {
        
        if (running) {
            cancel();
        }
        
        init();
    }
    
    return {
        start: start,
        stop: stop,
        pause: pause,
        resume: resume,
        cancel: cancel,
        elapsed: elapsed,
        reset: reset
    };
}

function transform () {
    
    var t = transformation.apply(undefined, arguments);
    
    t.start();
    
    return t;
}

module.exports = {
    transformation: transformation,
    transform: transform
};

},{"eases":107}],89:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],90:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],91:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],92:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"./bounce-out":94,"dup":8}],93:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"./bounce-out":94,"dup":9}],94:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10}],95:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"dup":11}],96:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],97:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],98:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"dup":14}],99:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15}],100:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"dup":16}],101:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"dup":17}],102:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],103:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19}],104:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],105:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],106:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],107:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"./back-in":90,"./back-in-out":89,"./back-out":91,"./bounce-in":93,"./bounce-in-out":92,"./bounce-out":94,"./circ-in":96,"./circ-in-out":95,"./circ-out":97,"./cubic-in":99,"./cubic-in-out":98,"./cubic-out":100,"./elastic-in":102,"./elastic-in-out":101,"./elastic-out":103,"./expo-in":105,"./expo-in-out":104,"./expo-out":106,"./linear":108,"./quad-in":110,"./quad-in-out":109,"./quad-out":111,"./quart-in":113,"./quart-in-out":112,"./quart-out":114,"./quint-in":116,"./quint-in-out":115,"./quint-out":117,"./sine-in":119,"./sine-in-out":118,"./sine-out":120,"dup":23}],108:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"dup":24}],109:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}],110:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],111:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],112:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28}],113:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],114:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],115:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],116:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],117:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],118:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],119:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],120:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"dup":36}],121:[function(require,module,exports){
/* global module, require */

module.exports = require("./src/xmugly.js");

},{"./src/xmugly.js":122}],122:[function(require,module,exports){
/* global module */

(function () {
    
    //
    // Compiles
    //     . some_element attr1 val1, attr2 val2
    // to:
    //     <some_element attr1="val1", attr2="val2" />
    // and
    //     . some_element attr1 val1 :
    //     ...
    //     --
    // to
    //     <some_element attr1="val1">
    //     ...
    //     </some_element>
    //
    function compile (text, defaultMacros) {
        
    //
    // A stack of element names, so that know which "--" closes which element.
    //
        var stack = [];
        var lines = toLines(text);
        var macros = processMacros(lines);
        
        if (Array.isArray(defaultMacros)) {
            defaultMacros.forEach(function (macro) {
                macros.push(macro);
            });
        }
        
        lines = removeMacroDefinitions(lines);
        
        lines = lines.map(function (line, i) {
            
            var name, attributes, parts, trimmed, head, whitespace, strings, result, hasContent;
            
            trimmed = line.trim();
            strings = [];
            whitespace = line.replace(/^([\s]*).*$/, "$1");
            
            if (trimmed === "--") {
                
                if (!stack.length) {
                    throw new SyntaxError(
                        "Closing '--' without matching opening tag on line " + (i + 1)
                    );
                }
                
                return whitespace + '</' + stack.pop() + '>';
            }
            
            if (trimmed[0] !== ".") {
                return line;
            }
            
            trimmed = trimmed.replace(/"([^"]+)"/g, function (match, p1) {
                
                strings.push(p1);
                
                return "{{" + strings.length + "}}";
            });
            
            if (trimmed[trimmed.length - 1] === ":") {
                hasContent = true;
                trimmed = trimmed.replace(/:$/, "");
            }
            
            parts = trimmed.split(",");
            head = parts[0].split(" ");
            
            head.shift();
            
            name = head[0];
            
            if (hasContent) {
                stack.push(name);
            }
            
            head.shift();
            
            parts[0] = head.join(" ");
            
            attributes = [];
            
            parts.forEach(function (current) {
                
                var split, name, value, enlarged;
                
                split = normalizeWhitespace(current).split(" ");
                
                name = split[0].trim();
                
                if (!name) {
                    return;
                }
                
                enlarged = applyMacros(name, macros);
                
                if (enlarged) {
                    value = enlarged.value;
                    name = enlarged.name;
                }
                else {
                    
                    split.shift();
                    
                    value = split.join(" ");
                }
                
                attributes.push(name + '="' + value + '"');
            });
            
            result = whitespace + '<' + name + (attributes.length ? ' ' : '') +
                attributes.join(" ") + (hasContent ? '>' : ' />');
            
            strings.forEach(function (value, i) {
                result = result.replace("{{" + (i + 1) + "}}", value);
            });
            
            return result;
            
        });
        
        return toText(lines);
    }

    function toLines (text) {
        return text.split("\n");
    }

    function toText (lines) {
        return lines.join("\n");
    }

    //
    // Creates a replacement rule from an attribute macro line.
    // Attribute macros look like this:
    //
    // ~ @ asset _
    //
    // The ~ at the start of a line signalizes that this is an attribute macro.
    // The first non-whitespace part (@ in this case) is the character or text part
    // which will be used as the macro identifier.
    // The second part (asset in this case) is the attribute name.
    // The third and last part (_ here) is the attribute value.
    // The "_" character will be replaced by whatever follows the macro identifier.
    // 
    // The example above will result in this transformation:
    //
    // . move @frodo => <move asset="frodo" />
    //
    // Some more examples:
    //
    // Macro: ~ : duration _
    // Transformation: . wait :200 => <wait duration="200" />
    //
    // Macro: ~ + _ true
    // Macro: ~ - _ false
    // Transformation: . stage -resize, +center => <stage resize="false" center="true" />
    //
    function processAttributeMacro (line) {
        
        var parts = normalizeWhitespace(line).split(" ");
        
        parts.shift();
        
        return {
            identifier: parts[0],
            attribute: parts[1],
            value: parts[2]
        };
    }

    function processMacros (lines) {
        
        var macros = [];
        
        lines.forEach(function (line) {
            
            if (line.trim()[0] !== "~") {
                return;
            }
            
            macros.push(processAttributeMacro(line));
        });
        
        return macros;
    }

    function applyMacros (raw, macros) {
        
        var name, value;
        
        macros.some(function (macro) {
            
            var macroValue;
            
            if (raw[0] !== macro.identifier) {
                return false;
            }
            
            macroValue = raw.replace(macro.identifier, "");
            name = (macro.attribute === "_" ? macroValue : macro.attribute);
            value = (macro.value === "_" ? macroValue : macro.value);
            
            return true;
        });
        
        if (!name) {
            return null;
        }
        
        return {
            name: name,
            value: value
        };
    }
    
    function removeMacroDefinitions (lines) {
        return lines.filter(function (line) {
            return line.trim()[0] !== "~";
        });
    }
    
    //
    // Replaces all whitespace with a single space character.
    //
    function normalizeWhitespace (text) {
        return text.trim().replace(/[\s]+/g, " ");
    }
    
    if (typeof module !== "undefined") {
        module.exports = {
            compile: compile
        };
    }
    else {
        window.xmugly = {
            compile: compile
        };
    }
    
}());

},{}]},{},[1]);


/*/////////////////////////////////////////////////////////////////////////////////

 MO5.js - Modular JavaScript. Batteries included.

 Copyright (c) 2015 Jonathan Steinbeck
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.

 * Neither the name MO5.js nor the names of its contributors 
   may be used to endorse or promote products derived from this software 
   without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/////////////////////////////////////////////////////////////////////////////////*/

/* global using, window, require, process, document, console */

if (typeof window !== "undefined") {
    // If the browser doesn't support requestAnimationFrame, use a fallback.
    window.requestAnimationFrame = (function ()
    {
        "use strict";
     
        return window.requestAnimationFrame || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame || 
            window.oRequestAnimationFrame || 
            window.msRequestAnimationFrame || 
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    }());
}

// [].forEach() shim
(function () {
    
    if (Array.prototype.forEach) {
        return;
    }
    
    Array.prototype.forEach = function (callback) {
        for (var i = 0, len = this.length; i < len; i += 1) {
            callback(this[i], i, this);
        }
    };
    
}());

// [].indexOf() shim
(function () {
    
    if (Array.prototype.indexOf) {
        return;
    }
    
    Array.prototype.indexOf = function (searchElement, fromIndex) {
        
        var k;
        
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }
        
        var O = Object(this);
        
        var len = O.length >>> 0;
        
        if (len === 0) {
            return -1;
        }
        
        var n = +fromIndex || 0;
        
        if (Math.abs(n) === Infinity) {
            n = 0;
        }
        
        if (n >= len) {
            return -1;
        }
        
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        
        while (k < len) {
            
            if (k in O && O[k] === searchElement) {
                return k;
            }
            
            k++;
        }
        
        return -1;
    };
    
}());


if (typeof console === "undefined") {
    this.console = {};
}

if (!console.log) {
    console.log = function () {};
}

if (!console.dir) {
    console.dir = console.log;
}

if (!console.error) {
    console.error = console.log;
}

if (!console.warn) {
    console.warn = console.log;
}


(function () {
    
    var scripts = document.getElementsByTagName("script");
    var path = scripts[scripts.length - 1].src.replace(/MO5\.js$/, "");
    
    using.modules = {
        "MO5.ajax": path + "ajax.js",
        "MO5.assert": path + "assert.js",
        "MO5.Exception": path + "Exception.js",
        "MO5.fail": path + "fail.js",
        "MO5.EventBus": path + "EventBus.js",
        "MO5.CoreObject": path + "CoreObject.js",
        "MO5.List": path + "List.js",
        "MO5.Queue": path + "Queue.js",
        "MO5.Map": path + "Map.js",
        "MO5.Set": path + "Set.js",
        "MO5.Result": path + "Result.js", // deprecated - use MO5.Promise instead!
        "MO5.Promise": path + "Promise.js",
        "MO5.Timer": path + "Timer.js",
        "MO5.TimerWatcher": path + "TimerWatcher.js",
        "MO5.easing": path + "easing.js",
        "MO5.transform": path + "transform.js",
        "MO5.range": path + "range.js",
        "MO5.tools": path + "tools.js",
        "MO5.Point": path + "Point.js",
        "MO5.Size": path + "Size.js",
        "MO5.Animation": path + "Animation.js",
        "MO5.dom.effects.typewriter": path + "dom.effects.typewriter.js",
        "MO5.dom.Element": path + "dom.Element.js",
        "MO5.dom.escape": path + "dom.escape.js",
        "MO5.globals.document": path + "globals.document.js",
        "MO5.globals.window": path + "globals.window.js",
        "MO5.types": path + "types.js"
    };
}());


var $__WSEScripts = document.getElementsByTagName('script');
WSEPath = $__WSEScripts[$__WSEScripts.length - 1].src;

using.modules['MO5.ajax'] = WSEPath;
using.modules['MO5.Animation'] = WSEPath;
using.modules['MO5.assert'] = WSEPath;
using.modules['MO5.CoreObject'] = WSEPath;
using.modules['MO5.dom.effects.typewriter'] = WSEPath;
using.modules['MO5.dom.Element'] = WSEPath;
using.modules['MO5.dom.escape'] = WSEPath;
using.modules['MO5.easing'] = WSEPath;
using.modules['MO5.EventBus'] = WSEPath;
using.modules['MO5.Exception'] = WSEPath;
using.modules['MO5.fail'] = WSEPath;
using.modules['MO5.globals.document'] = WSEPath;
using.modules['MO5.globals.window'] = WSEPath;
using.modules['MO5.List'] = WSEPath;
using.modules['MO5.Map'] = WSEPath;
using.modules['MO5.Point'] = WSEPath;
using.modules['MO5.Promise'] = WSEPath;
using.modules['MO5.Queue'] = WSEPath;
using.modules['MO5.range'] = WSEPath;
using.modules['MO5.Result'] = WSEPath;
using.modules['MO5.Set'] = WSEPath;
using.modules['MO5.Size'] = WSEPath;
using.modules['MO5.Timer'] = WSEPath;
using.modules['MO5.TimerWatcher'] = WSEPath;
using.modules['MO5.tools'] = WSEPath;
using.modules['MO5.transform'] = WSEPath;
using.modules['MO5.types'] = WSEPath;
using.modules['WSE.assets'] = WSEPath;
using.modules['WSE.commands'] = WSEPath;
using.modules['WSE.functions'] = WSEPath;
using.modules['WSE.dataSources'] = WSEPath;
using.modules['WSE'] = WSEPath;
using.modules['WSE.Keys'] = WSEPath;
using.modules['WSE.tools'] = WSEPath;
using.modules['WSE.loader'] = WSEPath;
using.modules['WSE.dataSources.LocalStorage'] = WSEPath;
using.modules['WSE.Trigger'] = WSEPath;
using.modules['WSE.Game'] = WSEPath;
using.modules['WSE.Interpreter'] = WSEPath;
using.modules['WSE.LoadingScreen'] = WSEPath;
using.modules['WSE.tools.ui'] = WSEPath;
using.modules['WSE.tools.reveal'] = WSEPath;
using.modules['WSE.tools.compile'] = WSEPath;
using.modules['WSE.savegames'] = WSEPath;
using.modules['WSE.DisplayObject'] = WSEPath;
using.modules['WSE.assets.Animation'] = WSEPath;
using.modules['WSE.assets.Audio'] = WSEPath;
using.modules['WSE.assets.Character'] = WSEPath;
using.modules['WSE.assets.Curtain'] = WSEPath;
using.modules['WSE.assets.Imagepack'] = WSEPath;
using.modules['WSE.assets.Textbox'] = WSEPath;
using.modules['WSE.assets.Background'] = WSEPath;
using.modules['WSE.assets.Composite'] = WSEPath;
using.modules['WSE.commands.alert'] = WSEPath;
using.modules['WSE.commands.break'] = WSEPath;
using.modules['WSE.commands.choice'] = WSEPath;
using.modules['WSE.commands.confirm'] = WSEPath;
using.modules['WSE.commands.do'] = WSEPath;
using.modules['WSE.commands.fn'] = WSEPath;
using.modules['WSE.commands.global'] = WSEPath;
using.modules['WSE.commands.globalize'] = WSEPath;
using.modules['WSE.commands.goto'] = WSEPath;
using.modules['WSE.commands.line'] = WSEPath;
using.modules['WSE.commands.localize'] = WSEPath;
using.modules['WSE.commands.prompt'] = WSEPath;
using.modules['WSE.commands.restart'] = WSEPath;
using.modules['WSE.commands.sub'] = WSEPath;
using.modules['WSE.commands.trigger'] = WSEPath;
using.modules['WSE.commands.var'] = WSEPath;
using.modules['WSE.commands.set_vars'] = WSEPath;
using.modules['WSE.commands.wait'] = WSEPath;
using.modules['WSE.commands.with'] = WSEPath;
using.modules['WSE.commands.while'] = WSEPath;

/* global using */

/**
 * A wrapper module for ajax.
 */
using().define("MO5.ajax", function () {
    return using.ajax;
});

/*/////////////////////////////////////////////////////////////////////////////////

 MO5.js - JavaScript Library For Building Modern DOM And Canvas Applications

 Copyright (c) 2013 - 2014 Jonathan Steinbeck
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.

 * Neither the name MO5.js nor the names of its contributors 
   may be used to endorse or promote products derived from this software 
   without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/////////////////////////////////////////////////////////////////////////////////*/

/* global MO5, setTimeout, window, module, require */

(function MO5AnimationBootstrap () {
    
    if (typeof using === "function") {
        using("MO5.Exception", "MO5.CoreObject", "MO5.Queue", "MO5.Timer", "MO5.TimerWatcher").
        define("MO5.Animation", MO5AnimationModule);
    }
    else if (typeof window !== "undefined") {
        window.MO5.Animation = MO5AnimationModule(
            MO5.Exception,
            MO5.CoreObject,
            MO5.Queue,
            MO5.Timer,
            MO5.TimerWatcher
        );
    }
    else {
        module.exports = MO5AnimationModule(
            require("./Exception.js"),
            require("./CoreObject.js"),
            require("./Queue.js"),
            require("./Timer.js"),
            require("./TimerWatcher.js")
        );
    }
    
    function MO5AnimationModule (Exception, CoreObject, Queue, Timer, TimerWatcher) {
        
        /**
         * Uses callbacks to animate.
         * @param callbacks Optional list of callbacks. Can be of type Array or MO5.Queue.
         */
        function Animation (callbacks) {
            
            CoreObject.call(this);
            
            this.callbacks = new Queue();
            this.queue = new Queue();
            this.running = false;
            this.canceled = false;
            this.paused = false;
            this.limit = 0;
            this.count = 0;
            this.currentWatcher = null;
            
            if (callbacks && callbacks instanceof Queue) {
                this.callbacks = callbacks;
            }
            else if (callbacks && callbacks instanceof Array) {
                this.callbacks.replace(callbacks.slice());
            }
            else if (callbacks) {
                throw new Error("Parameter 1 is expected to be of type Array or MO5.Queue.");
            }
        }
        
        Animation.prototype = new CoreObject();
        Animation.prototype.constructor = Animation;
        
        Animation.prototype.addStep = function (cb) {
            
            if (this.running) {
                throw new Error("Cannot add steps to a running animation.");
            }
            
            this.callbacks.add(cb);
            this.trigger("updated", null, false);
            
            return this;
        };
        
        Animation.prototype.isRunning = function () {
            return this.running;
        };
        
        Animation.prototype.isCanceled = function () {
            return this.canceled;
        };
        
        Animation.prototype.isPaused = function () {
            return this.paused;
        };
        
        Animation.prototype.start = function () {
            var fn, self = this, cbs;
            
            if (this.running) {
                throw new Error("Animation is already running.");
            }
            
            cbs = this.callbacks.clone();
            this.queue = cbs;
            
            this.running = true;
            this.canceled = false;
            
            fn = function () {
                var next, watcher;
                
                if (!cbs.hasNext()) {
                    
                    self.count += 1;
                    
                    if (self.isRunning()) {
                        
                        if (self.limit && self.count == self.limit) {
                            
                            self.running = false;
                            self.trigger("stopped", null, false);
                            self.count = 0;
                            self.limit = 0;
                            
                            return;
                        }
                        
                        cbs = self.callbacks.clone();
                        this.queue = cbs;
                        setTimeout(fn, 0);
                        
                        return;
                    }
                    
                    self.trigger("stopped", null, false);
                    
                    return;
                }
                
                next = cbs.next();
                watcher = next();
                
                if (watcher && watcher instanceof TimerWatcher) {
                    self.currentWatcher = watcher;
                    watcher.once(fn, "stopped");
                }
                else {
                    setTimeout(fn, 0);
                }
            };
            
            setTimeout(fn, 0);
            
            return this;
        };
        
        Animation.prototype.pause = function () {
            
            if (this.paused) {
                throw new Error("Trying to pause an already paused animation.");
            }
            
            this.paused = true;
            
            if (this.currentWatcher) {
                this.currentWatcher.pause();
            }
            
            this.trigger("paused", null, false);
            
            return this;
        };
        
        Animation.prototype.resume = function () {
            if (!this.paused) {
                throw new Error("Trying to resume an animation that isn't paused.");
            }
            
            this.paused = false;
            
            if (this.currentWatcher) {
                this.currentWatcher.resume();
            }
            
            this.trigger("resumed", null, false);
            
            return this;
        };
        
        Animation.prototype.cancel = function () {
            
            if (this.canceled) {
                throw new Error("Trying to cancel an already canceled animation.");
            }
            
            this.canceled = true;
            this.running = false;
            this.count = 0;
            this.limit = 0;
            
            if (this.currentWatcher) {
                this.currentWatcher.cancel();
            }
            
            this.trigger("canceled", null, false);
            
            return this;
        };
        
        Animation.prototype.stop = function () {
            
            if (!this.running) {
                throw new Error("Trying to stop an animation that isn't running. " + 
                    "Check isRunning() beforehand.");
            }
            
            this.running = false;
            this.count = 0;
            this.limit = 0;
            
            return this;
        };
        
        Animation.prototype.loop = function (c) {
            
            if (c < 1) {
                throw new Error("Parameter 1 is expected to be greater than zero.");
            }
            
            this.count = 0;
            this.limit = c;
            
            return this.start();
        };
        
        Animation.prototype.promise = function () {
            return Timer.prototype.promise.call(this);
        };
        
        return Animation;

    }
    
}());


/* global using */

using("MO5.Exception").define("MO5.assert", function (Exception) {
    
    function AssertionException () {
        Exception.apply(this, arguments);
        this.name = "AssertionException";
    }
    
    AssertionException.prototype = new Exception();
    
    function assert (condition, message) {
        if (!condition) {
            throw new AssertionException(message);
        }
    }
    
    return assert;
    
});

/*/////////////////////////////////////////////////////////////////////////////////

 MO5.js - JavaScript Library For Building Modern DOM And Canvas Applications

 Copyright (c) 2013 - 2015 Jonathan Steinbeck
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.

 * Neither the name MO5.js nor the names of its contributors 
   may be used to endorse or promote products derived from this software 
   without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/////////////////////////////////////////////////////////////////////////////////*/

/* global using, MO5, window, module, require */

(function MO5CoreObjectBootstrap () {
    
    if (typeof using === "function") {
        using("MO5.Exception", "MO5.fail", "MO5.EventBus").
        define("MO5.CoreObject", MO5CoreObjectModule);
    }
    else if (typeof window !== "undefined") {
        window.MO5.CoreObject = MO5CoreObjectModule(MO5.Exception, MO5.fail, MO5.EventBus);
    }
    else {
        module.exports = MO5CoreObjectModule(
            require("./Exception.js"),
            require("./fail.js"),
            require("./EventBus.js")
        );
    }
    
    function MO5CoreObjectModule (Exception, fail, EventBus) {
        
        var flags = {}, prefix = "CoreObject", highestId = 0;
        
        /**
         * The MO5 base type for almost all other types used in MO5.
         *
         * All CoreObject instances are observable by subscribing
         * to the events that they emit.
         *
         * @type object -> CoreObject
         * @event flag_removed(name_of_flag) When the flag has been removed.
         * @event flag_set(name_of_flag) When the flag has been set.
         * @event destroyed()
         * @return CoreObject
         */
        function CoreObject (args) {
            
            args = args || {};
            args.bus = args.bus || {};
            
            highestId += 1;
            
            if (Object.defineProperty) {
                Object.defineProperty(this, "id", {
                    value: highestId,
                    configurable: false,
                    enumerable: false,
                    writable: false
                });
            }
            else {
                this.id = highestId;
            }
            
            this.destroyed = false;
            
            EventBus.inject(this, args.bus);
            
            flags[this.id] = {};
            
            this.$children = [];
            this.$parent = null;
        }
        
        /**
         * Checks whether an object has an ID property.
         *
         * @type any -> boolean
         * @param obj The object to be checked.
         * @return boolean Is the argument an object and has an ID property?
         */
        CoreObject.hasId = function (obj) {
            return typeof obj === "object" && obj !== null && typeof obj.id === "number";
        };
        
        /**
         * Checks whether an object is an instance of CoreObject.
         *
         * @type any -> boolean
         * @param obj The object to check.
         * @return boolean Is the argument a CoreObject instance?
         */
        CoreObject.isCoreObject = function (obj) {
            return obj instanceof CoreObject;
        };
        
        CoreObject.prototype.addChild = function (child) {
            
            if (this.$children.indexOf(child) >= 0) {
                return;
            }
            
            child.$parent = this;
            
            this.$children.push(child);
        };
        
        CoreObject.prototype.removeChild = function (child) {
            
            var index = this.$children.indexOf(child);
            
            if (index < 0) {
                return;
            }
            
            child.$parent = null;
            
            this.$children.splice(index, 1);
        };
        
        CoreObject.prototype.hasChild = function (child) {
            return this.$children.indexOf(child) >= 0;
        };
        
        /**
         * Sets a flag on this object. Flags can be used to specify abilities of
         * a CoreObject. A flag has no value and can be in on of two
         * states - it can either exist or not exist.
         *
         * @type string -> CoreObject
         * @event flag_set(name_of_flag) When the flag has been set.
         * @param flag The name of the flag.
         * @return The CoreObject itself.
         */
        CoreObject.prototype.setFlag = function (flag) {
            
            var internalKey = externalKeyToInternalKey(flag);
            
            if (!flags[this.id]) {
                return;
            }
            
            flags[this.id][internalKey] = true;
            
            this.trigger("flag_set", flag);
            
            return this;
        };
        
        /**
         * Removes a flag from this object.
         *
         * @type string -> CoreObject
         * @event flag_removed(name_of_flag) When the flag has been removed.
         * @param flag The name of the flag.
         * @return The CoreObject itself.
         */
        CoreObject.prototype.removeFlag = function (flag) {
            
            if (!this.hasFlag(flag)) {
                return;
            }
            
            delete flags[this.id][externalKeyToInternalKey(flag)];
            
            this.trigger("flag_removed", flag);
            
            return this;
        };
        
        /**
         * Checks whether this object has a flag set.
         *
         * @type string -> boolean
         * @param flag The name of the flag.
         * @return Is the flag set on this CoreObject instance?
         */
        CoreObject.prototype.hasFlag = function (flag) {
            
            var internalKey = externalKeyToInternalKey(flag);
            
            return flags[this.id] && 
                flags[this.id].hasOwnProperty(internalKey);
        };
        
        /**
         * Returns an array containing all the flags set on this CoreObject.
         *
         * @type void -> [string]
         * @return An array containing the names of the flags.
         */
        CoreObject.prototype.getFlags = function () {
            
            var arr = [];
            
            for (var key in flags[this.id]) {
                arr.push(internalKeyToExternalKey(key));
            }
            
            return arr;
        };
        
        /**
         * Connects an event on this CoreObject to an event on another CoreObject.
         * This means that if CoreObject A emits the specified event then CoreObject B
         * will emit another event as a reaction.
         *
         * @type string -> CoreObject -> string -> (boolean ->) CoreObject
         * @param event1 The event on this CoreObject.
         * @param obj2 The other CoreObject.
         * @param event2 The event on the other CoreObject.
         * @param async boolean Should the event on the other CoreObject be triggered async?
         *     This is optional. The default is true.
         * @return This CoreObject.
         */
        CoreObject.prototype.connect = function (event1, obj2, event2, async) {
            
            var self = this;
            
            event1 = event1 || "*";
            event2 = event2 || "*";
            
            if (!obj2 || !(obj2 instanceof CoreObject)) {
                throw new Exception("Cannot connect events: Parameter 3 is " +
                    "expected to be of type CoreObject.");
            }
            
            function listener (data) {
                
                data = data || null;
                
                if (typeof async !== "undefined" && (async === true || async === false)) {
                    obj2.trigger(event2, data, async);
                }
                else {
                    obj2.trigger(event2, data);
                }
            }
            
            this.subscribe(listener, event1);
            
            obj2.once(function () { self.unsubscribe(listener, event1); }, "destroyed");
            
            return this;
        };
        
        /**
         * Checks whether this CoreObject complies to an interface by
         * comparing each properties type.
         *
         * @type object -> boolean
         * @param interface An object representing the interface.
         * @return Does this CoreObject implement the interface?
         */
        CoreObject.prototype.implements = function (interface) {
            
            for (var key in interface) {
                if (typeof this[key] !== typeof interface[key]) {
                    return false;
                }
            }
            
            return true;
        };
        
        /**
         * CoreObject instances have a unique ID; when used as a string,
         * the ID of the object is used as a representation.
         *
         * @type string
         * @return This CoreObjet's ID as a string.
         */
        CoreObject.prototype.toString = function () {
            return "" + this.id;
        };
        
        /**
         * Returns this CoreObject's ID.
         *
         * @type number
         * @return This CoreObject's ID.
         */
        CoreObject.prototype.valueOf = function () {
            return this.id;
        };

        /**
         * Emits the destroyed() event and deletes all of the instances properties.
         * After this method has been called on an CoreObject, it can not be used
         * anymore and should be considered dead.
         *
         * All users of a CoreObject should hook to the destroyed() event and delete
         * their references to the CoreObject when its destroyed() event is emitted.
         *
         * @event destroyed()
         * @return void
         */
        CoreObject.prototype.destroy = function () {
            
            var id = this.id;
            
            if (this.$parent) {
                this.$parent.removeChild(this);
            }
            
            this.$children.forEach(function (child) {
                if (typeof child === "object" && typeof child.destroy === "function") {
                    child.destroy();
                }
            });
            
            this.destroyed = true;
            this.trigger("destroyed", null, false);
            
            for (var key in this) {
                this[key] = null;
            }
            
            delete flags[id];
            
            this.destroyed = true;
            this.id = id;
            
            delete this.toString;
            delete this.valueOf;
            
        };
        
        CoreObject.prototype.subscribeTo = function (bus, event, listener) {
            
            var self = this;
            
            if (!(typeof bus.subscribe === "function" && typeof bus.unsubscribe === "function")) {
                throw new Exception("Cannot subscribe: Parameter 1 is " +
                    "expected to be of type CoreObject or EventBus.");
            }
            
            if (typeof event !== "string") {
                throw new Exception("Cannot subscribe: Parameter 2 is " +
                    "expected to be of type String.");
            }
            
            if (typeof listener !== "function") {
                throw new Exception("Cannot subscribe: Parameter 3 is " +
                    "expected to be of type Function.");
            }
            
            listener = listener.bind(this);
            
            bus.subscribe(event, listener);
            
            this.subscribe("destroyed", thisDestroyed);
            bus.subscribe("destroyed", busDestroyed);
            
            return this;
            
            function thisDestroyed () {
                bus.unsubscribe(event, listener);
                self.unsubscribe("destroyed", thisDestroyed);
                bus.unsubscribe("destroyed", busDestroyed);
            }
            
            function busDestroyed () {
                bus.unsubscribe("destroyed", busDestroyed);
                self.unsubscribe("destroyed", thisDestroyed);
            }
        };
        
        return CoreObject;
        
        ///////////////////////////////////
        // Helper functions
        ///////////////////////////////////
        
        function externalKeyToInternalKey (key) {
            return prefix + key;
        }
        
        function internalKeyToExternalKey (key) {
            return key.replace(new RegExp(prefix), "");
        }
        
    }
    
}());

/*/////////////////////////////////////////////////////////////////////////////////

 MO5.js - JavaScript Library For Building Modern DOM And Canvas Applications

 Copyright (c) 2013 Jonathan Steinbeck
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.

 * Neither the name MO5.js nor the names of its contributors 
   may be used to endorse or promote products derived from this software 
   without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/////////////////////////////////////////////////////////////////////////////////*/

/* global using, setTimeout */

using().define("MO5.dom.effects.typewriter", function () {
    
    function typewriter (element, args) {
        
        var TYPE_ELEMENT = 1, TYPE_TEXT = 3, speed, cb;
        
        args = args || {};
        speed = args.speed || 50;
        cb = args.onFinish || null;
        
        function hideChildren(el) {
            
            var childNodes = el.childNodes, i, len;
            
            if (el.nodeType === TYPE_ELEMENT) {
                
                el.style.display = 'none';
                
                for (i = 0, len = childNodes.length; i < len; i += 1) {
                    hideChildren(childNodes[i]);
                }
            }
        }
        
        hideChildren(element);
        
        function showChildren(el, cb) {
            
            if (el.nodeType === TYPE_ELEMENT) {
                (function () {
                    
                    var children = [];
                    
                    while (el.hasChildNodes()) {
                        children.push(el.removeChild(el.firstChild));
                    }
                    
                    el.style.display = '';
                    
                    (function loopChildren() {
                        
                        if (children.length > 0) {
                            showChildren(children[0], loopChildren);
                            el.appendChild(children.shift());
                        }
                        else if (cb) {
                            setTimeout(cb, 0);
                        }
                    }());
                    
                }());
            }
            else if (el.nodeType === TYPE_TEXT) {
                
                (function () {
                    
                    var textContent = el.data.replace(/ +/g, ' '), i, len;
                    
                    el.data = '';
                    i = 0;
                    len = textContent.length;
                    
                    function insertTextContent() {
                        
                        el.data += textContent[i];
                        i += 1;
                        
                        if (i < len) {
                            setTimeout(insertTextContent, 1000 / speed);
                        }
                        else if (cb) {
                            setTimeout(cb, 0);
                        }
                    }
                    
                    insertTextContent();
                }());
            }
        }
        
        showChildren(element, cb);
    }
    
    return typewriter;
    
});

/*/////////////////////////////////////////////////////////////////////////////////

 MO5.js - JavaScript Library For Building Modern DOM And Canvas Applications

 Copyright (c) 2013 Jonathan Steinbeck
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.

 * Neither the name MO5.js nor the names of its contributors 
   may be used to endorse or promote products derived from this software 
   without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/////////////////////////////////////////////////////////////////////////////////*/

/* global using, document, console */

using("MO5.CoreObject", "MO5.transform", "MO5.TimerWatcher", "MO5.dom.effects.typewriter",
        "MO5.types", "MO5.Point", "MO5.Size").
define("MO5.dom.Element", function (CoreObject, transform, TimerWatcher,
        typewriter, types, Point, Size) {
    
    function Element (args) {
        
        var self = this;
        
        args = args || {};
        
        CoreObject.call(this);

        this.parent = args.parent || document.body;
        this.nodeType = args.nodeType || "div";
        this.element = args.element || document.createElement(this.nodeType);
        
        wrapElement(this, this.element);
        
        Element.propertiesToExclude.forEach(function (property) {
            delete self[property];
        });
    }
    
    // Properties that should not shadow the DOM element's properties.
    // If you want to add a method with the same name as a DOM element's
    // property to the prototype, you need to add the method's name to this array.
    Element.propertiesToExclude = [
        "appendChild",
        "removeChild"
    ];
    
    /**
     * Creates an Element instance for a DOMElement.
     */
    Element.fromDomElement = function (domElement) {
        return new Element({element: domElement, nodeType: domElement.nodeName});
    };
    
    Element.prototype = new CoreObject();
    Element.prototype.constructor = Element;
    
    Element.prototype.appendTo = function (element) {
        return element.appendChild(this.element);
    };
    
    Element.prototype.remove = function () {
        return this.element.parentNode.removeChild(this.element);
    };
    
    Element.prototype.appendChild = function (child) {
        var node = child instanceof Element ? child.element : child;
        return this.element.appendChild(node);
    };
    
    /**
     * Adds a child element as the first child of this element.
     */
    Element.prototype.addAsFirstChild = function (child) {
        
        var node = child instanceof Element ? child.element : child;
        
        return this.element.childElementCount > 0 ?
            this.element.insertBefore(node, this.element.childNodes[0]) :
            this.element.appendChild(node);
    };

    Element.prototype.fadeIn = function (args) {
        
        args = args || {};
        
        var element = this.element;
        
        if (this._lastFadeTimer && this._lastFadeTimer.isRunning()) {
            this._lastFadeTimer.cancel();
        }
        
        this.show();
        
        this._lastFadeTimer = transform(
            function (v) {
                element.style.opacity = v;
            },
            parseInt(element.style.opacity, 10) || 0,
            1,
            args
        );
        
        return this._lastFadeTimer;
    };

    Element.prototype.fadeOut = function (args) {
        
        args = args || {};
        
        var element = this.element;
        
        if (this._lastFadeTimer && this._lastFadeTimer.isRunning()) {
            this._lastFadeTimer.cancel();
        }
        
        this._lastFadeTimer = transform(
            function (v) {
                element.style.opacity = v;
            },
            parseInt(element.style.opacity, 10) || 1,
            0,
            args
        );
        
        this._lastFadeTimer.once("stopped", this.hide.bind(this));
        
        return this._lastFadeTimer;
    };
    
    Element.prototype.opacity = function (value) {
        
        if (typeof value === "number") {
            this.element.style.opacity = value;
        }
        
        return this.element.style.opacity;
    };
    
    Element.prototype.position = function (point) {
        
        var element = this.element, rect = {}, scrollLeft, scrollTop;
        
        if (types.isObject(point)) {
            element.style.left = "" + (+point.x) + "px";
            element.style.top = "" + (+point.y) + "px";
        }
        
        rect.left = element.offsetLeft;
        rect.top = element.offsetTop;
        
        if (element.getBoundingClientRect) {
            rect = element.getBoundingClientRect();
        }
        
        scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
        scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
        
        return new Point(scrollLeft + rect.left, scrollTop + rect.top);
        
    };
    
    Element.prototype.size = function (size) {
        
        if (types.isObject(size)) {
            this.element.style.width = "" + size.width + "px";
            this.element.style.height = "" + size.height + "px";
        }
        
        return new Size(this.element.offsetWidth, this.element.offsetHeight);
    };
    
    Element.prototype.width = function (width) {
        
        if (types.isNumber(width)) {
            this.element.style.width = "" + width + "px";
        }
        
        return this.element.offsetWidth;
    };
    
    Element.prototype.height = function (height) {
        
        if (types.isNumber(height)) {
            this.element.style.height = "" + height + "px";
        }
        
        return this.element.offsetHeight;
    };

    Element.prototype.moveTo = function (x, y, args) {
        
        args = args || {};
        
        var element = this.element,
            ox = element.offsetLeft,
            oy = element.offsetTop,
            t0, t1;
            
        t0 = transform(
            function (v) {
                element.style.left = v + "px";
            },
            ox,
            x,
            args
        );
        
        t1 = transform(
            function (v) {
                element.style.top = v + "px";
            },
            oy,
            y,
            args
        );
        
        return new TimerWatcher().addTimer(t0).addTimer(t1);
    };
    
    Element.prototype.move = function (x, y, args) {
        
        args = args || {};
        
        var element = this.element,
            dx = element.offsetLeft + x,
            dy = element.offsetTop + y;
        
        return this.moveTo(dx, dy, args);
    };
    
    Element.prototype.display = function () {
        this.element.style.visibility = "";
    };
    
    Element.prototype.show = Element.prototype.display;
    
    Element.prototype.hide = function () {
        this.element.style.visibility = "hidden";
    };
    
    Element.prototype.typewriter = function (args) {
        args = args || {};
        typewriter(this.element, args);
    };
    
    Element.prototype.addCssClass = function (classToAdd) {
        
        var classes;
        
        if (this.element.classList) {
            this.element.classList.add(classToAdd);
            return this;
        }
        
        classes = this.getCssClasses();
        
        if (!contains(classes, classToAdd)) {
            classes.push(classToAdd);
            this.element.setAttribute("class", classes.join(" "));
        }
        
        return this;
    };
    
    Element.prototype.removeCssClass = function (classToRemove) {
        
        var classes;
        
        if (this.element.classList) {
            this.element.classList.remove(classToRemove);
        }
        
        classes = this.getCssClasses();
        
        if (contains(classes, classToRemove)) {
            this.element.setAttribute("class", classes.filter(function (item) {
                return item !== classToRemove;
            }).join(" "));
        }
        
        return this;
    };
    
    Element.prototype.getCssClasses = function () {
        return (this.element.getAttribute("class") || "").split(" ");
    };
    
    Element.prototype.hasCssClass = function (classToCheckFor) {
        return this.element.classList ?
            this.element.classList.contains(classToCheckFor) :
            contains(this.getCssClasses(), classToCheckFor);
    };
    
    Element.prototype.clearCssClasses = function () {
        this.element.setAttribute("class", "");
        return this;
    };
    
    Element.prototype.setCssId = function (cssId) {
        this.element.setAttribute("id", cssId);
        return this;
    };
    
    Element.prototype.destroy = function () {
        
        try {
            this.element.parentNode.removeChild(this.element);
        }
        catch (e) {
            console.log(e);
        }
        
        CoreObject.prototype.destroy.call(this);
    };
    
    ////////////////////////////////////////
    // dom.Element helper functions
    ////////////////////////////////////////
    
    function wrapElement (element, domElement) {
        for (var key in domElement) {
            (function (currentProperty, key) {
                
                if (key === "id") {
                    return;
                }
                
                if (typeof currentProperty === "function") {
                    element[key] = function () {
                        return domElement[key].apply(domElement, arguments);
                    };
                }
                else {
                    element[key] = function (content) {
                        
                        if (arguments.length) {
                            domElement[key] = content;
                            return element;
                        }
                        
                        return domElement[key];
                    };
                }
            }(domElement[key], key));
        }
    }
    
    function contains (array, item) {
        return array.indexOf(item) !== -1;
    }
    
    return Element;

});

/* global using */

using().define("MO5.dom.escape", function () {

    function escape (unescapedHtml) {
        
        var escaped = "";
        
        escaped = unescapedHtml.replace(/&/g, "&amp;").replace(/</g, "&lt;").
            replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
        
        return escaped;
    }

    return escape;
});

/*/////////////////////////////////////////////////////////////////////////////////

 MO5.js - JavaScript Library For Building Modern DOM And Canvas Applications

 Copyright (c) 2013 Jonathan Steinbeck
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.

 * Neither the name MO5.js nor the names of its contributors 
   may be used to endorse or promote products derived from this software 
   without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/////////////////////////////////////////////////////////////////////////////////*/

/* global using, window */

using().define("MO5.easing", function () {
    
    /**
     * Acceleration functions for use in MO5.transform().
     */
    var easing = (function (stdLib) {
        
        "use asm";

        /*!
         * TERMS OF USE - EASING EQUATIONS
         * Open source under the BSD License.
         * Copyright 2001 Robert Penner All rights reserved.
         * 
         * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
         * 
         * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
         * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
         * Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.
        * 
        * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
        */

        /**
         * Function for linear transformations.
         */
        function linear (d, t) {
            d = d|0;
            t = t|0;
            
            return +(t / d);
        }

        /**
         * Function for sine transformations.
         */
        function sineEaseOut (d, t) {
            d = d|0;
            t = t|0;
            
            var s = +(stdLib.Math.PI / (2 * d));
            var y = +(stdLib.Math.abs(stdLib.Math.sin(t * s)));
            
            return +y;
        }
        
        function sineEaseIn (d, t) {
            d = d|0;
            t = t|0;
            
            var s = +(stdLib.Math.PI / (2 * d));
            var y = +(stdLib.Math.abs(-stdLib.Math.cos(t * s) + 1));
            
            return +y;
        }
        
        function sineEaseInOut (d, t) {
            d = d|0;
            t = t|0;
            
            if (+(t / (d / 2) < 1)) {
                return +sineEaseIn(d, t);
            }
            else {
                return +sineEaseOut(d, t);
            }
        }
        
        
        /*
         * EaseOutBounce for JavaScript, taken from jQuery Easing v1.3 - http://gsgd.co.uk/sandbox/jquery/easing/
         *
         * TERMS OF USE - jQuery Easing
         * 
         * Open source under the BSD License. 
         * 
         * Copyright © 2008 George McGinley Smith
         * All rights reserved.
         * 
         * Redistribution and use in source and binary forms, with or without modification, 
         * are permitted provided that the following conditions are met:
         * 
         * Redistributions of source code must retain the above copyright notice, this list of 
         * conditions and the following disclaimer.
         * Redistributions in binary form must reproduce the above copyright notice, this list 
         * of conditions and the following disclaimer in the documentation and/or other materials 
         * provided with the distribution.
         * 
         * Neither the name of the author nor the names of contributors may be used to endorse 
         * or promote products derived from this software without specific prior written permission.
         * 
         * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
         * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
         * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
         *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
         *  EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
         *  GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
         * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
         *  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
         * OF THE POSSIBILITY OF SUCH DAMAGE. 
         *
         */
        function easeOutBounce (d, t) {
            d = d|0;
            t = t|0;
            
            var b = 0, c = 1, val = 0.0;

            if ((t /= d) < (1 / 2.75)) {
                
                val = +(c * (7.5625 * t * t) + b);
            }
            else if (t < (2 / 2.75)) {
                
                val = +(c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b);
            }
            else if (t < (2.5 / 2.75)) {
                
                val = +(c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b);
            }
            else {
                
                val = +(c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b);
            }
            
            return +val;
        }
        
        function easeOut (potency, d, t) {
            d = d|0;
            t = t|0;
            
            return +(1 - stdLib.Math.pow(1 - (t / d), potency));
        }
        
        function easeIn (potency, d, t) {
            d = d|0;
            t = t|0;
            
            return +(stdLib.Math.pow((t / d), potency));
        }
        
        function easeInOut (potency, d, t) {
            d = d|0;
            t = t|0;
            
            var val = 0.0;
            
            if (t > d / 2) {
                val = +easeOut(potency, d, t);
            }
            else {
                val = +easeIn(potency, d, t);
            }
            
            return +val;
        }
        
        return {
            linear: linear,
            sineEaseOut: sineEaseOut,
            sineEaseIn: sineEaseIn,
            sineEaseInOut: sineEaseInOut,
            easeOutBounce: easeOutBounce,
            easeIn: easeIn,
            easeOut: easeOut,
            easeInOut: easeInOut
        };
        
    }(window));
    
    easing.easingFunctionGenerator = easingFunctionGenerator;
    easing.createEaseInFunction = createEaseInFunction;
    easing.createEaseOutFunction = createEaseOutFunction;
    easing.createEaseInOutFunction = createEaseInOutFunction;
    
    easing.easeInQuad = createEaseInFunction(2);
    easing.easeInCubic = createEaseInFunction(3);
    easing.easeInQuart = createEaseInFunction(4);
    easing.easeInQuint = createEaseInFunction(5);
    
    easing.easeOutQuad = createEaseOutFunction(2);
    easing.easeOutCubic = createEaseOutFunction(3);
    easing.easeOutQuart = createEaseOutFunction(4);
    easing.easeOutQuint = createEaseOutFunction(5);
    
    easing.easeInOutQuad = createEaseInOutFunction(2);
    easing.easeInOutCubic = createEaseInOutFunction(3);
    easing.easeInOutQuart = createEaseInOutFunction(4);
    easing.easeInOutQuint = createEaseInOutFunction(5);

    return easing;
    
    function easingFunctionGenerator (type) {
        return function (potency) {
            return function (d, t) {
                return easing[type](potency, d, t);
            };
        };
    }
    
    function createEaseInFunction (potency) {
        return easingFunctionGenerator("easeIn")(potency);
    }
    
    function createEaseOutFunction (potency) {
        return easingFunctionGenerator("easeOut")(potency);
    }
    
    function createEaseInOutFunction (potency) {
        return easingFunctionGenerator("easeInOut")(potency);
    }
    
});

/* global using, MO5, setTimeout, console, window, module */

(function MO5EventBusBootstrap () {
    
    if (typeof using === "function") {
        using().define("MO5.EventBus", MO5EventBusModule);
    }
    else if (typeof window !== "undefined") {
        window.MO5 = MO5 || {};
        window.MO5.EventBus = MO5EventBusModule();
    }
    else {
        module.exports = MO5EventBusModule();
    }
    
    function MO5EventBusModule () {
        
        "use strict";
        
        function EventBus (args) {
            
            var self = this;
            
            args = args || {};
            
            this.debug = args.debug || false;
            this.interceptErrors = args.interceptErrors || false;
            this.log = args.log || false;
            this.logData = args.logData || false;
            this.defaults = args.defaults || {};
            this.defaults.flowType = this.defaults.flowType || EventBus.FLOW_TYPE_ASYNCHRONOUS;
            
            this.callbacks = {
                "*": []
            };
            
            this.subscribe(errorListener, "EventBus.error");
            
            function errorListener (data) {
                
                var name;
                
                if (self.debug !== true) {
                    return;
                }
                
                name = data.error.name || "Error";
                console.log(name + " in listener; Event: " + data.info.event + "; Message: " +
                    data.error.message);
            }
        }
        
        EventBus.FLOW_TYPE_ASYNCHRONOUS = 0;
        EventBus.FLOW_TYPE_SYNCHRONOUS = 1;
        
        EventBus.create = function(args) {
            
            args = args || {};
            
            return new EventBus(args);
        };
        
        EventBus.prototype.subscribe = function(parameter1, parameter2) {
            
            var listener, event, self = this;
            
            if (parameter2 === undefined) {
                event = "*";
                listener = parameter1;
            }
            else if (typeof parameter1 === "string" || typeof parameter1 === "number") {
                event = parameter1;
                listener = parameter2;
            }
            else if (typeof parameter2 === "string" || typeof parameter2 === "number") {
                event = parameter2;
                listener = parameter1;
            }
            
            if (typeof event !== "string" && typeof event !== "number") {
                throw new Error("Event names can only be strings or numbers! event: ", event);
            }
            
            if (typeof listener !== "function") {
                throw new Error("Only functions may be used as listeners!");
            }
            
            event = event || '*';
            
            this.callbacks[event] = this.callbacks[event] || [];
            this.callbacks[event].push(listener);
            
            this.trigger(
                "EventBus.subscribe", 
                {
                    listener: listener,
                    event: event,
                    bus: this
                }
            );
            
            return function unsubscriber () {
                self.unsubscribe(listener, event);
            };
        };
        
        EventBus.prototype.unsubscribe = function(parameter1, parameter2) {
            
            var cbs, len, i, listener, event;
            
            if (parameter2 === undefined) {
                event = "*";
                listener = parameter1;
            }
            else if (typeof parameter1 === "string" || typeof parameter1 === "number") {
                event = parameter1;
                listener = parameter2;
            }
            else if (typeof parameter2 === "string" || typeof parameter2 === "number") {
                event = parameter2;
                listener = parameter1;
            }
            
            if (typeof event !== "string" && typeof event !== "number") {
                throw new Error("Event names can only be strings or numbers! event: ", event);
            }
            
            if (typeof listener !== "function") {
                throw new Error("Only functions may be used as listeners!");
            }
            
            event = event || '*';
            cbs = this.callbacks[event] || [];
            len = cbs.length;
            
            for (i = 0; i < len; ++i) {
                if (cbs[i] === listener) {
                    this.callbacks[event].splice(i, 1);
                }
            }
            
            this.trigger(
                "EventBus.unsubscribe", 
                {
                    listener: listener,
                    event: event,
                    bus: this
                }
            );
        };
        
        EventBus.prototype.once = function (listenerOrEvent1, listenerOrEvent2) {
            
            var fn, self = this, event, listener;
            var firstParamIsFunction, secondParamIsFunction, called = false;
            
            firstParamIsFunction = typeof listenerOrEvent1 === "function";
            secondParamIsFunction = typeof listenerOrEvent2 === "function";
            
            if ((firstParamIsFunction && secondParamIsFunction) || 
                    (!firstParamIsFunction && !secondParamIsFunction)) {
                throw new Error("Parameter mismatch; one parameter needs to be a function, " +
                    "the other one must be a string.");
            }
            
            if (firstParamIsFunction) {
                listener = listenerOrEvent1;
                event = listenerOrEvent2;
            }
            else {
                listener = listenerOrEvent2;
                event = listenerOrEvent1;
            }
            
            event = event || "*";
            
            fn = function (data, info) {
                
                if (called) {
                    return;
                }
                
                called = true;
                self.unsubscribe(fn, event);
                listener(data, info);
            };
            
            this.subscribe(fn, event);
        };
        
        EventBus.prototype.trigger = function(event, data, async) {
            
            var cbs, len, info, j, f, cur, self, flowType;
            
            if (
                typeof event !== "undefined" &&
                typeof event !== "string" &&
                typeof event !== "number"
            ) {
                throw new Error("Event names can only be strings or numbers! event: ", event);
            }
            
            self = this;
            event = arguments.length ? event : "*";
            
            flowType = (typeof async !== "undefined" && async === false) ?
                EventBus.FLOW_TYPE_SYNCHRONOUS :
                this.defaults.flowType;
            
            // get subscribers in all relevant namespaces
            cbs = (function() {
                
                var n, words, wc, matches, k, kc, old = "", out = [];
                
                // split event name into namespaces and get all subscribers
                words = event.split(".");
                
                for (n = 0, wc = words.length ; n < wc ; ++n) {
                    
                    old = old + (n > 0 ? "." : "") + words[n];
                    matches = self.callbacks[old] || [];
                    
                    for (k = 0, kc = matches.length; k < kc; ++k) {
                        out.push(matches[k]);
                    }
                }
                
                if (event === "*") {
                    return out;
                }
                
                // get subscribers for "*" and add them, too
                matches = self.callbacks["*"] || [];
                
                for (k = 0, kc = matches.length ; k < kc ; ++k) {
                    out.push( matches[ k ] );
                }
                
                return out;
            }());
            
            len = cbs.length;
            
            info = {
                event: event,
                subscribers: len,
                async: flowType === EventBus.FLOW_TYPE_ASYNCHRONOUS ? true : false,
                getQueueLength: function() {
                    
                    if (len === 0) {
                        return 0;
                    }
                    
                    return len - (j + 1);
                }
            };
            
            function asyncThrow (e) {
                setTimeout(
                    function () {
                        throw e;
                    },
                    0
                );
            }
            
            // function for iterating through the list of relevant listeners
            f = function() {
                
                if (self.log === true) {
                    console.log( 
                        "EventBus event triggered: " + event + "; Subscribers: " + len, 
                        self.logData === true ? "; Data: " + data : "" 
                    );
                }
                
                for (j = 0; j < len; ++j) {
                    
                    cur = cbs[j];
                    
                    try {
                        cur(data, info);
                    }
                    catch (e) {
                        
                        console.log(e);
                        
                        self.trigger(
                            "EventBus.error", 
                            {
                                error: e,
                                info: info
                            }
                        );
                        
                        if (self.interceptErrors !== true) {
                            asyncThrow(e);
                        }
                    }
                }
            };
            
            if (flowType === EventBus.FLOW_TYPE_ASYNCHRONOUS) {
                setTimeout(f, 0);
            }
            else {
                f();
            }
        };
        
        EventBus.prototype.triggerSync = function (event, data) {
            return this.trigger(event, data, false);
        };
        
        EventBus.prototype.triggerAsync = function (event, data) {
            return this.trigger(event, data, true);
        };
        
        EventBus.inject = function (obj, args) {
            
            args = args || {};
            
            var squid = new EventBus(args);
            
            obj.subscribe = function (listener, event) {
                squid.subscribe(listener, event);
            };
            
            obj.unsubscribe = function (listener, event) {
                squid.unsubscribe(listener, event);
            };
            
            obj.once = function (listener, event) {
                squid.once(listener, event);
            };
            
            obj.trigger = function (event, data, async) {
                async = (typeof async !== "undefined" && async === false) ? false : true;
                squid.trigger(event, data, async);
            };
            
            obj.triggerSync = squid.triggerSync.bind(squid);
            obj.triggerAsync = squid.triggerAsync.bind(squid);
            
            obj.subscribe("destroyed", function () {
                squid.callbacks = [];
            });
        };
        
        return EventBus;
        
    }
}());


/*/////////////////////////////////////////////////////////////////////////////////

 MO5.js - JavaScript Library For Building Modern DOM And Canvas Applications

 Copyright (c) 2013 Jonathan Steinbeck
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.

 * Neither the name MO5.js nor the names of its contributors 
   may be used to endorse or promote products derived from this software 
   without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/////////////////////////////////////////////////////////////////////////////////*/

/* global using, module, window */

(function MO5ExceptionBootstrap () {
    
    if (typeof using === "function") {
        using().define("MO5.Exception", MO5ExceptionModule);
    }
    else if (typeof window !== "undefined") {
        window.MO5 = window.MO5 || {};
        window.MO5.Exception = MO5ExceptionModule();
    }
    else {
        module.exports = MO5ExceptionModule();
    }
    
    function MO5ExceptionModule () {
        
        function Exception (msg) {
            
            var e = Error.apply(null, arguments), key;
            
            // we need to copy the properties manually since
            // Javascript's Error constructor ignores the first
            // parameter used with .call()...
            for (key in e) {
                this[key] = e[key];
            }
            
            this.message = msg;
            this.name = "MO5.Exception";
        }
        
        Exception.prototype = new Error();
        Exception.prototype.constructor = Exception;
        
        return Exception;
        
    }
    
}());

/*/////////////////////////////////////////////////////////////////////////////////

 MO5.js - JavaScript Library For Building Modern DOM And Canvas Applications

 Copyright (c) 2013 Jonathan Steinbeck
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.

 * Neither the name MO5.js nor the names of its contributors 
   may be used to endorse or promote products derived from this software 
   without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/////////////////////////////////////////////////////////////////////////////////*/

/* global using, window, console, module */

(function MO5failBootstrap () {
    
    if (typeof using === "function") {
        using().define("MO5.fail", MO5failModule);
    }
    else if (typeof window !== "undefined") {
        window.MO5.fail = MO5failModule();
    }
    else {
        module.exports = MO5failModule();
    }
    
    function MO5failModule () {
        
        /**
         * A function to log errors with stack traces to the console.
         * Useful if you encounter some minor errors that are no show-stoppers
         * and should therefore not be thrown, but which can help
         * debug your code by looking at the console output.
         */
        function fail (e) {
            
            if (console.error) {
                console.error(e.toString());
            }
            else {
                console.log(e.toString());
            }
            
            if (e.stack) {
                console.log(e.stack);
            }
        }
        
        return fail;
        
    }
}());


/* global using, document */

using().define("MO5.globals.document", function () {
    return document;
});


/* global using, window */

using().define("MO5.globals.window", function () {
    return window;
});


/*/////////////////////////////////////////////////////////////////////////////////

 MO5.js - JavaScript Library For Building Modern DOM And Canvas Applications

 Copyright (c) 2013 Jonathan Steinbeck
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.

 * Neither the name MO5.js nor the names of its contributors 
   may be used to endorse or promote products derived from this software 
   without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/////////////////////////////////////////////////////////////////////////////////*/

/* global MO5, window, require, module */

(function MO5ListBootstrap () {
    
    if (typeof using === "function") {
        using("MO5.CoreObject", "MO5.Queue", "MO5.types").
        define("MO5.List", MO5ListModule);
    }
    else if (typeof window !== "undefined") {
        window.MO5.List = MO5ListModule(MO5.CoreObject, MO5.Queue, MO5.types);
    }
    else {
        module.exports = MO5ListModule(
            require("./CoreObject.js"),
            require("./Queue.js"),
            require("./types.js")
        );
    }
    
    function MO5ListModule (CoreObject, Queue, types) {
        
        function List (items) {
            
            CoreObject.call(this);
            
            this.unsubscribers = {};
            this.items = types.isArray(items) ? items : [];
        }
        
        List.prototype = new CoreObject();
        
        List.prototype.length = function () {
            return this.items.length;
        };
        
        List.prototype.append = function (value) {
            
            var self = this;
            
            function listener () {
                
                var i, len;
                
                for (i = 0, len = self.items.length; i < len; i += 1) {
                    if (self.items[i] === value) {
                        self.items.splice(i, 1);
                    }
                }
                
                delete self.unsubscribers[value.id];
            }
            
            function unsubscribe () {
                value.unsubscribe(listener, "destroyed");
            }
            
            if (CoreObject.isCoreObject(value)) {
                this.unsubscribers[value.id] = unsubscribe;
                value.subscribe(listener, "destroyed");
                value.subscribe("destroyed", function () {value = null;});
            }
            
            this.items.push(value);
            
            return this;
        };
        
        List.prototype.remove = function (i) {
            
            var val = this.items[i];
            
            if (CoreObject.isCoreObject(val)) {
                this.unsubscribers[val.id]();
                delete this.unsubscribers[val.id];
            }
            
            this.items.splice(i, 1);
            
            return this;
        };
        
        List.prototype.clear = function () {
            
            var list = this;
            
            this.forEach(function (item, i) {
                list.remove(i);
            });
        };
        
        List.prototype.at = function (i) {
            return this.items[+i];
        };
        
        List.prototype.indexOf = function (item) {
            return this.items.indexOf(item);
        };
        
        List.prototype.values = function () {
        
            var values = [];
            
            this.forEach(function (value) {
                values.push(value);
            });
            
            return values;
        };
        
        List.prototype.toQueue = function () {
            
            var q = new Queue();
            
            this.items.forEach(function (item) {
                q.add(item);
            });
            
            return q;
        };
        
        List.prototype.forEach = function (fn) {
            this.items.forEach(fn);
        };
        
        List.prototype.filter = function (fn) {
            return this.items.filter(fn);
        };
        
        List.prototype.map = function (fn) {
            return this.items.map(fn);
        };
        
        List.prototype.reduce = function (fn) {
            return this.items.reduce(fn);
        };
        
        List.prototype.every = function (fn) {
            return this.items.every(fn);
        };
        
        List.prototype.some = function (fn) {
            return this.items.some(fn);
        };
        
        List.prototype.find = function (fn) {
            
            var i, numberOfItems = this.items.length;
            
            for (i = 0; i < numberOfItems; i += 1) {
                if (fn(this.items[i])) {
                    return this.items[i];
                }
            }
            
            return undefined;
        };
        
        /**
         * Returns a list which is this list with all the items from another list
         * appended to it.
         */
        List.prototype.combine = function (otherList) {
            return new List(this.items.slice().concat(otherList.items));
        };
        
        List.prototype.clone = function () {
            return new List(this.items.slice());
        };
        
        List.prototype.destroy = function () {
            
            if (this.destroyed) {
                return;
            }
            
            for (var i = 0; i < this.unsubscribers.length; i++) {
                this.unsubscribers[i]();
                delete this.unsubscribers[i];
            };
            
            CoreObject.prototype.destroy.apply(this, arguments);
        }
        
        return List;
        
    }
}());


/*/////////////////////////////////////////////////////////////////////////////////

 MO5.js - JavaScript Library For Building Modern DOM And Canvas Applications

 Copyright (c) 2013 Jonathan Steinbeck
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.

 * Neither the name MO5.js nor the names of its contributors 
   may be used to endorse or promote products derived from this software 
   without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/////////////////////////////////////////////////////////////////////////////////*/

/* global using, module, require, window */

(function MO5MapBootstrap () {
    
    if (typeof using === "function") {
        using("MO5.CoreObject", "MO5.Exception").
        define("MO5.Map", MO5MapModule);
    }
    else if (typeof window !== "undefined") {
        window.MO5.Map = MO5MapModule(MO5.CoreObject, MO5.Exception);
    }
    else {
        module.exports = MO5MapModule(
            require("./CoreObject.js"),
            require("./Exception.js")
        );
    }
    
    function MO5MapModule (CoreObject, Exception) {
        
        var prefix = "MO5Map";
        
        function makeKey (k) {
            return prefix + k;
        }
        
        function revokeKey (k) {
            return k.replace(new RegExp(prefix), "");
        }
        
        function Map (content) {
            
            var key;
            
            CoreObject.call(this);
            
            this.clear();
            
            if (content) {
                for (key in content) {
                    this.set(key, content[key]);
                }
            }
        }
        
        Map.prototype = new CoreObject();
        
        Map.prototype.clear = function () {
            this.items = {};
            this.unsubscribers = {};
            this.count = 0;
        };
        
        Map.prototype.length = function () {
            return this.count;
        };
        
        Map.prototype.set = function (k, value) {
            
            var self = this, key = makeKey(k);
            
            function whenDestroyed () {
                if (self.has(k)) {
                    self.remove(k);
                }
            }
            
            if (!k) {
                throw new Error("MO5.Map keys cannot be falsy.");
            }
            
            if (this.has(key)) {
                this.remove(key);
            }
            
            if (value && value instanceof CoreObject) {
                
                if (value.destroyed) {
                    throw new Error("Trying to add an MO5.Object that has " +
                        "already been destroyed.");
                }
                
                value.subscribe(whenDestroyed, "destroyed");
            }
            
            if (k instanceof CoreObject) {
                
                if (k.destroyed) {
                    throw new Error("Trying to use an MO5.Object as key that " +
                        "has already been destroyed.");
                }
                
                k.subscribe(whenDestroyed, "destroyed");
                
            }
            
            if (value && value instanceof CoreObject || k instanceof CoreObject) {
                
                this.unsubscribers[key] = function () {
                    
                    if (value instanceof CoreObject) {
                        value.unsubscribe(whenDestroyed, "destroyed");
                    }
                    
                    if (k instanceof CoreObject) {
                        k.unsubscribe(whenDestroyed, "destroyed");
                    }
                };
            }
            
            this.items[key] = value;
            this.count += 1;
            
            this.trigger("updated", null, false);
            this.trigger("set", key, false);
            
            return this;
        };
        
        Map.prototype.get = function (k) {
            
            var key = makeKey(k);
            
            if (!this.items.hasOwnProperty(key)) {
                return undefined;
            }
            
            return this.items[key];
        };
        
        /**
         * The same as .get(), but throws when the key doesn't exist.
         * This can be useful if you want to use a map as some sort of registry.
         */
        Map.prototype.require = function (key) {
            
            if (!this.has(key)) {
                throw new Error("Required key '" + key + "' does not exist.");
            }
            
            return this.get(key);
        };
        
        Map.prototype.remove = function (k) {
            
            var key = makeKey(k);
            
            if (!this.has(k)) {
                throw new Error("Trying to remove an unknown key from an MO5.Map.");
            }
            
            if (this.unsubscribers.hasOwnProperty(key)) {
                this.unsubscribers[key]();
                delete this.unsubscribers[key];
            }
            
            delete this.items[key];
            this.count -= 1;
            
            this.trigger("updated", null, false);
            this.trigger("removed", key, false);
            
            return this;
        };
        
        Map.prototype.has = function (k) {
            
            var key = makeKey(k);
            
            return this.items.hasOwnProperty(key);
        };
        
        Map.prototype.destroy = function () {
            
            for (var key in this.unsubscribers) {
                this.unsubscribers[key]();
                delete this.unsubscribers[key];
            }
            
            CoreObject.prototype.destroy.call(this);
        };
        
        Map.prototype.forEach = function (fn) {
            
            if (!fn || typeof fn !== "function") {
                throw new Error("Parameter 1 is expected to be of type function.");
            }
            
            for (var key in this.items) {
                fn(this.items[key], revokeKey(key), this);
            }
            
            return this;
        };
        
        Map.prototype.filter = function (fn) {
            
            var matches = new Map();
            
            this.forEach(function (item, key, all) {
                if (fn(item, key, all)) {
                    matches.set(key, item);
                }
            });
            
            return matches;
        };
        
        Map.prototype.find = function (fn) {
            
            var value, valueFound = false;
            
            this.forEach(function (item, key, all) {
                if (!valueFound && fn(item, key, all)) {
                    value = item;
                    valueFound = true;
                }
            });
            
            return value;
        };
        
        Map.prototype.map = function (fn) {
            
            var mapped = new Map();
            
            this.forEach(function (item, key, all) {
                mapped.set(key, fn(item, key, all));
            });
            
            return mapped;
        };
        
        Map.prototype.reduce = function (fn, initialValue) {
            
            var result = initialValue;
            
            this.forEach(function (item, key, all) {
                result = fn(result, item, key, all);
            });
            
            return result;
        };
        
        Map.prototype.every = function (fn) {
            return this.reduce(function (last, item, key, all) {
                return last && fn(item, key, all);
            }, true);
        };
        
        Map.prototype.some = function (fn) {
            
            var matchFound = false;
            
            this.forEach(function (item, key, all) {
                if (!matchFound && fn(item, key, all)) {
                    matchFound = true;
                }
            });
            
            return matchFound;
        };
        
        Map.prototype.keys = function () {
            
            var keys = [];
            
            this.forEach(function (item, key) {
                keys.push(key);
            });
            
            return keys;
        };
        
        /**
         * Returns the map's values in an array.
         */
        Map.prototype.values = function () {
        
            var values = [];
            
            this.forEach(function (item) {
                values.push(item);
            });
            
            return values;
        };
        
        Map.prototype.toObject = function () {
            
            var jsObject = {};
            
            this.forEach(function (item, key) {
                jsObject[key] = item;
            });
            
            return jsObject;
        };
        
        Map.prototype.clone = function () {
            var clone = new Map();
            
            this.forEach(function (item, key) {
                clone.set(key, item);
            });
            
            return clone;
        };
        
        /**
         * Adds the content of another map to this map's content.
         * @param otherMap Another MO5.Map.
         */
        Map.prototype.addMap = function (otherMap) {
            
            var self = this;
            
            otherMap.forEach(function (item, key) {
                self.set(key, item);
            });
            
            return this;
        };
        
        /**
         * Returns a new map which is the result of joining this map
         * with another map. This map isn't changed in the process.
         * The keys from otherMap will replace any keys from this map that
         * are the same.
         * @param otherMap A map to join with this map.
         */
        Map.prototype.join = function (otherMap) {
            return this.clone().addMap(otherMap);
        };
        
        return Map;
        
    }
    
}());


/*/////////////////////////////////////////////////////////////////////////////////

 MO5.js - JavaScript Library For Building Modern DOM And Canvas Applications

 Copyright (c) 2013 Jonathan Steinbeck
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.

 * Neither the name MO5.js nor the names of its contributors 
   may be used to endorse or promote products derived from this software 
   without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/////////////////////////////////////////////////////////////////////////////////*/

/* global using */

using().define("MO5.Point", function () {
    
    function Point (x, y) {
        this.x = x;
        this.y = y;
    }
    
    Point.prototype.getDistance = function (otherPoint) {
        
        var dx = this.x - otherPoint.x,
            dy = this.y - otherPoint.y,
            dist = Math.squrt(dx * dx + dy * dy);
        
        return dist;
    };
    
    return Point;
    
});

/* global global, window, process, document, using, Promise, module */

(function() {
var define, requireModule, require, requirejs;

(function() {
  var registry = {}, seen = {};

  define = function(name, deps, callback) {
    registry[name] = { deps: deps, callback: callback };
  };

  requirejs = require = requireModule = function(name) {
  requirejs._eak_seen = registry;

    if (seen[name]) { return seen[name]; }
    seen[name] = {};

    if (!registry[name]) {
      throw new Error("Could not find module " + name);
    }

    var mod = registry[name],
        deps = mod.deps,
        callback = mod.callback,
        reified = [],
        exports;

    for (var i=0, l=deps.length; i<l; i++) {
      if (deps[i] === 'exports') {
        reified.push(exports = {});
      } else {
        reified.push(requireModule(resolve(deps[i])));
      }
    }

    var value = callback.apply(this, reified);
    return seen[name] = exports || value;

    function resolve(child) {
      if (child.charAt(0) !== '.') { return child; }
      var parts = child.split("/");
      var parentBase = name.split("/").slice(0, -1);

      for (var i=0, l=parts.length; i<l; i++) {
        var part = parts[i];

        if (part === '..') { parentBase.pop(); }
        else if (part === '.') { continue; }
        else { parentBase.push(part); }
      }

      return parentBase.join("/");
    }
  };
})();

define("promise/all", 
  ["./utils","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    /* global toString */

    var isArray = __dependency1__.isArray;
    var isFunction = __dependency1__.isFunction;

    /**
      Returns a promise that is fulfilled when all the given promises have been
      fulfilled, or rejected if any of them become rejected. The return promise
      is fulfilled with an array that gives all the values in the order they were
      passed in the `promises` array argument.

      Example:

      ```javascript
      var promise1 = RSVP.resolve(1);
      var promise2 = RSVP.resolve(2);
      var promise3 = RSVP.resolve(3);
      var promises = [ promise1, promise2, promise3 ];

      RSVP.all(promises).then(function(array){
        // The array here would be [ 1, 2, 3 ];
      });
      ```

      If any of the `promises` given to `RSVP.all` are rejected, the first promise
      that is rejected will be given as an argument to the returned promises's
      rejection handler. For example:

      Example:

      ```javascript
      var promise1 = RSVP.resolve(1);
      var promise2 = RSVP.reject(new Error("2"));
      var promise3 = RSVP.reject(new Error("3"));
      var promises = [ promise1, promise2, promise3 ];

      RSVP.all(promises).then(function(array){
        // Code here never runs because there are rejected promises!
      }, function(error) {
        // error.message === "2"
      });
      ```

      @method all
      @for RSVP
      @param {Array} promises
      @param {String} label
      @return {Promise} promise that is fulfilled when all `promises` have been
      fulfilled, or rejected if any of them become rejected.
    */
    function all(promises) {
      /*jshint validthis:true */
      var Promise = this;

      if (!isArray(promises)) {
        throw new TypeError('You must pass an array to all.');
      }

      return new Promise(function(resolve, reject) {
        var results = [], remaining = promises.length,
        promise;

        if (remaining === 0) {
          resolve([]);
        }

        function resolver(index) {
          return function(value) {
            resolveAll(index, value);
          };
        }

        function resolveAll(index, value) {
          results[index] = value;
          if (--remaining === 0) {
            resolve(results);
          }
        }

        for (var i = 0; i < promises.length; i++) {
          promise = promises[i];

          if (promise && isFunction(promise.then)) {
            promise.then(resolver(i), reject);
          } else {
            resolveAll(i, promise);
          }
        }
      });
    }

    __exports__.all = all;
  });
define("promise/asap", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var browserGlobal = (typeof window !== 'undefined') ? window : {};
    var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
    var local = (typeof global !== 'undefined') ? global : (this === undefined? window:this);

    // node
    function useNextTick() {
      return function() {
        process.nextTick(flush);
      };
    }

    function useMutationObserver() {
      var iterations = 0;
      var observer = new BrowserMutationObserver(flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function() {
        node.data = (iterations = ++iterations % 2);
      };
    }

    function useSetTimeout() {
      return function() {
        local.setTimeout(flush, 1);
      };
    }

    var queue = [];
    function flush() {
      for (var i = 0; i < queue.length; i++) {
        var tuple = queue[i];
        var callback = tuple[0], arg = tuple[1];
        callback(arg);
      }
      queue = [];
    }

    var scheduleFlush;

    // Decide what async method to use to triggering processing of queued callbacks:
    if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
      scheduleFlush = useNextTick();
    } else if (BrowserMutationObserver) {
      scheduleFlush = useMutationObserver();
    } else {
      scheduleFlush = useSetTimeout();
    }

    function asap(callback, arg) {
      var length = queue.push([callback, arg]);
      if (length === 1) {
        // If length is 1, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        scheduleFlush();
      }
    }

    __exports__.asap = asap;
  });
define("promise/config", 
  ["exports"],
  function(__exports__) {
    "use strict";
    var config = {
      instrument: false
    };

    function configure(name, value) {
      if (arguments.length === 2) {
        config[name] = value;
      } else {
        return config[name];
      }
    }

    __exports__.config = config;
    __exports__.configure = configure;
  });
define("promise/polyfill", 
  ["./promise","./utils","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    /*global self*/
    var RSVPPromise = __dependency1__.Promise;
    var isFunction = __dependency2__.isFunction;

    function polyfill() {
      var local;

      if (typeof global !== 'undefined') {
        local = global;
      } else if (typeof window !== 'undefined' && window.document) {
        local = window;
      } else {
        local = self;
      }

      var es6PromiseSupport = 
        "Promise" in local &&
        // Some of these methods are missing from
        // Firefox/Chrome experimental implementations
        "resolve" in local.Promise &&
        "reject" in local.Promise &&
        "all" in local.Promise &&
        "race" in local.Promise &&
        // Older version of the spec had a resolver object
        // as the arg rather than a function
        (function() {
          var resolve;
          new local.Promise(function(r) { resolve = r; });
          return isFunction(resolve);
        }());

      if (!es6PromiseSupport) {
        local.Promise = RSVPPromise;
      }
    }

    __exports__.polyfill = polyfill;
  });
define("promise/promise", 
  ["./config","./utils","./all","./race","./resolve","./reject","./asap","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __exports__) {
    "use strict";
    var config = __dependency1__.config;
    var configure = __dependency1__.configure;
    var objectOrFunction = __dependency2__.objectOrFunction;
    var isFunction = __dependency2__.isFunction;
    var now = __dependency2__.now;
    var all = __dependency3__.all;
    var race = __dependency4__.race;
    var staticResolve = __dependency5__.resolve;
    var staticReject = __dependency6__.reject;
    var asap = __dependency7__.asap;

    var counter = 0;

    config.async = asap; // default async is asap;

    function Promise(resolver) {
      if (!isFunction(resolver)) {
        throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
      }

      if (!(this instanceof Promise)) {
        throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
      }

      this._subscribers = [];

      invokeResolver(resolver, this);
    }

    function invokeResolver(resolver, promise) {
      function resolvePromise(value) {
        resolve(promise, value);
      }

      function rejectPromise(reason) {
        reject(promise, reason);
      }

      try {
        resolver(resolvePromise, rejectPromise);
      } catch(e) {
        rejectPromise(e);
      }
    }

    function invokeCallback(settled, promise, callback, detail) {
      var hasCallback = isFunction(callback),
          value, error, succeeded, failed;

      if (hasCallback) {
        try {
          value = callback(detail);
          succeeded = true;
        } catch(e) {
          failed = true;
          error = e;
        }
      } else {
        value = detail;
        succeeded = true;
      }

      if (handleThenable(promise, value)) {
        return;
      } else if (hasCallback && succeeded) {
        resolve(promise, value);
      } else if (failed) {
        reject(promise, error);
      } else if (settled === FULFILLED) {
        resolve(promise, value);
      } else if (settled === REJECTED) {
        reject(promise, value);
      }
    }

    var PENDING   = void 0;
    var SEALED    = 0;
    var FULFILLED = 1;
    var REJECTED  = 2;

    function subscribe(parent, child, onFulfillment, onRejection) {
      var subscribers = parent._subscribers;
      var length = subscribers.length;

      subscribers[length] = child;
      subscribers[length + FULFILLED] = onFulfillment;
      subscribers[length + REJECTED]  = onRejection;
    }

    function publish(promise, settled) {
      var child, callback, subscribers = promise._subscribers, detail = promise._detail;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        invokeCallback(settled, child, callback, detail);
      }

      promise._subscribers = null;
    }

    Promise.prototype = {
      constructor: Promise,

      _state: undefined,
      _detail: undefined,
      _subscribers: undefined,

      then: function(onFulfillment, onRejection) {
        var promise = this;

        var thenPromise = new this.constructor(function() {});

        if (this._state) {
          var callbacks = arguments;
          config.async(function invokePromiseCallback() {
            invokeCallback(promise._state, thenPromise, callbacks[promise._state - 1], promise._detail);
          });
        } else {
          subscribe(this, thenPromise, onFulfillment, onRejection);
        }

        return thenPromise;
      },

      'catch': function(onRejection) {
        return this.then(null, onRejection);
      }
    };

    Promise.all = all;
    Promise.race = race;
    Promise.resolve = staticResolve;
    Promise.reject = staticReject;

    function handleThenable(promise, value) {
      var then = null,
      resolved;

      try {
        if (promise === value) {
          throw new TypeError("A promises callback cannot return that same promise.");
        }

        if (objectOrFunction(value)) {
          then = value.then;

          if (isFunction(then)) {
            then.call(value, function(val) {
              if (resolved) { return true; }
              resolved = true;

              if (value !== val) {
                resolve(promise, val);
              } else {
                fulfill(promise, val);
              }
            }, function(val) {
              if (resolved) { return true; }
              resolved = true;

              reject(promise, val);
            });

            return true;
          }
        }
      } catch (error) {
        if (resolved) { return true; }
        reject(promise, error);
        return true;
      }

      return false;
    }

    function resolve(promise, value) {
      if (promise === value) {
        fulfill(promise, value);
      } else if (!handleThenable(promise, value)) {
        fulfill(promise, value);
      }
    }

    function fulfill(promise, value) {
      if (promise._state !== PENDING) { return; }
      promise._state = SEALED;
      promise._detail = value;

      config.async(publishFulfillment, promise);
    }

    function reject(promise, reason) {
      if (promise._state !== PENDING) { return; }
      promise._state = SEALED;
      promise._detail = reason;

      config.async(publishRejection, promise);
    }

    function publishFulfillment(promise) {
      publish(promise, promise._state = FULFILLED);
    }

    function publishRejection(promise) {
      publish(promise, promise._state = REJECTED);
    }

    __exports__.Promise = Promise;
  });
define("promise/race", 
  ["./utils","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    /* global toString */
    var isArray = __dependency1__.isArray;

    /**
      `RSVP.race` allows you to watch a series of promises and act as soon as the
      first promise given to the `promises` argument fulfills or rejects.

      Example:

      ```javascript
      var promise1 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          resolve("promise 1");
        }, 200);
      });

      var promise2 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          resolve("promise 2");
        }, 100);
      });

      RSVP.race([promise1, promise2]).then(function(result){
        // result === "promise 2" because it was resolved before promise1
        // was resolved.
      });
      ```

      `RSVP.race` is deterministic in that only the state of the first completed
      promise matters. For example, even if other promises given to the `promises`
      array argument are resolved, but the first completed promise has become
      rejected before the other promises became fulfilled, the returned promise
      will become rejected:

      ```javascript
      var promise1 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          resolve("promise 1");
        }, 200);
      });

      var promise2 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          reject(new Error("promise 2"));
        }, 100);
      });

      RSVP.race([promise1, promise2]).then(function(result){
        // Code here never runs because there are rejected promises!
      }, function(reason){
        // reason.message === "promise2" because promise 2 became rejected before
        // promise 1 became fulfilled
      });
      ```

      @method race
      @for RSVP
      @param {Array} promises array of promises to observe
      @param {String} label optional string for describing the promise returned.
      Useful for tooling.
      @return {Promise} a promise that becomes fulfilled with the value the first
      completed promises is resolved with if the first completed promise was
      fulfilled, or rejected with the reason that the first completed promise
      was rejected with.
    */
    function race(promises) {
      /*jshint validthis:true */
      var Promise = this;

      if (!isArray(promises)) {
        throw new TypeError('You must pass an array to race.');
      }
      return new Promise(function(resolve, reject) {
        var results = [], promise;

        for (var i = 0; i < promises.length; i++) {
          promise = promises[i];

          if (promise && typeof promise.then === 'function') {
            promise.then(resolve, reject);
          } else {
            resolve(promise);
          }
        }
      });
    }

    __exports__.race = race;
  });
define("promise/reject", 
  ["exports"],
  function(__exports__) {
    "use strict";
    /**
      `RSVP.reject` returns a promise that will become rejected with the passed
      `reason`. `RSVP.reject` is essentially shorthand for the following:

      ```javascript
      var promise = new RSVP.Promise(function(resolve, reject){
        reject(new Error('WHOOPS'));
      });

      promise.then(function(value){
        // Code here doesn't run because the promise is rejected!
      }, function(reason){
        // reason.message === 'WHOOPS'
      });
      ```

      Instead of writing the above, your code now simply becomes the following:

      ```javascript
      var promise = RSVP.reject(new Error('WHOOPS'));

      promise.then(function(value){
        // Code here doesn't run because the promise is rejected!
      }, function(reason){
        // reason.message === 'WHOOPS'
      });
      ```

      @method reject
      @for RSVP
      @param {Any} reason value that the returned promise will be rejected with.
      @param {String} label optional string for identifying the returned promise.
      Useful for tooling.
      @return {Promise} a promise that will become rejected with the given
      `reason`.
    */
    function reject(reason) {
      /*jshint validthis:true */
      var Promise = this;

      return new Promise(function (resolve, reject) {
        reject(reason);
      });
    }

    __exports__.reject = reject;
  });
define("promise/resolve", 
  ["exports"],
  function(__exports__) {
    "use strict";
    function resolve(value) {
      /*jshint validthis:true */
      if (value && typeof value === 'object' && value.constructor === this) {
        return value;
      }

      var Promise = this;

      return new Promise(function(resolve) {
        resolve(value);
      });
    }

    __exports__.resolve = resolve;
  });
define("promise/utils", 
  ["exports"],
  function(__exports__) {
    "use strict";
    function objectOrFunction(x) {
      return isFunction(x) || (typeof x === "object" && x !== null);
    }

    function isFunction(x) {
      return typeof x === "function";
    }

    function isArray(x) {
      return Object.prototype.toString.call(x) === "[object Array]";
    }

    // Date.now is not available in browsers < IE9
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now#Compatibility
    var now = Date.now || function() { return new Date().getTime(); };


    __exports__.objectOrFunction = objectOrFunction;
    __exports__.isFunction = isFunction;
    __exports__.isArray = isArray;
    __exports__.now = now;
  });
requireModule('promise/polyfill').polyfill();
}());



(function MO5PromiseBootstrap () {
    
    if (typeof using === "function") {
        using().define("MO5.Promise", MO5PromiseModule);
    }
    else if (typeof window !== "undefined") {
        window.MO5.Promise = MO5PromiseModule();
    }
    else {
        module.exports = MO5PromiseModule();
    }
    
    function MO5PromiseModule () {
        
        function MO5Promise (fn) {
            
            var success, failure, promise = new Promise(function (resolve, reject) {
                
                success = function (value) {
                    resolve(value);
                    return promise;
                };
                
                failure = function (reason) {
                    reject(reason);
                    return promise;
                };
            });
            
            promise.success = success;
            promise.failure = failure;
            promise.resolve = success;
            promise.reject = failure;
            
            if (typeof fn === "function") {
                fn(success, failure);
            }
            
            return promise;
        }
        
        MO5Promise.resolve = Promise.resolve;
        MO5Promise.reject = Promise.reject;
        MO5Promise.all = Promise.all;
        MO5Promise.race = Promise.race;
        
        MO5Promise.consolify = function (promise) {
            promise.
            then(console.log.bind(console)).
            catch(function (error) {
                console.error(error);
                console.log(error.stack);
            });
        };
        
        return MO5Promise;
    }
    
}());


/*/////////////////////////////////////////////////////////////////////////////////

 MO5.js - JavaScript Library For Building Modern DOM And Canvas Applications

 Copyright (c) 2013 Jonathan Steinbeck
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.

 * Neither the name MO5.js nor the names of its contributors 
   may be used to endorse or promote products derived from this software 
   without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/////////////////////////////////////////////////////////////////////////////////*/

/* global MO5, require, module, window */

(function MO5QueueBootstrap () {
    
    if (typeof using === "function") {
        using("MO5.Exception", "MO5.CoreObject").
        define("MO5.Queue", MO5QueueModule);
    }
    else if (typeof window !== "undefined") {
        window.MO5.Queue = MO5QueueModule(MO5.Exception, MO5.CoreObject);
    }
    else {
        module.exports = MO5QueueModule(
            require("./Exception.js"),
            require("./CoreObject.js")
        );
    }
    
    function MO5QueueModule (Exception, CoreObject) {
        
        function Queue (arr) {
            CoreObject.call(this);
            
            if (arr && !(arr instanceof Array)) {
                throw new Exception("Parameter 1 is expected to be of type Array.");
            }
            
            this.arr = arr || [];
        }
        
        Queue.prototype = new CoreObject();
        Queue.prototype.constructor = Queue;
        
        Queue.prototype.length = function () {
            return this.arr.length;
        };
        
        /**
         * Adds an item to the back of the queue.
         */
        Queue.prototype.add = function (val) {
            
            var self = this, index = this.arr.length;
            
            if (val instanceof CoreObject) {
                
                if (val.destroyed) {
                    throw new Exception("Trying to add an MO5.Object that has " +
                        "already been destroyed.");
                }
                
                val.once(function () {
                    if (!self.destroyed) {
                        self.arr.splice(index, 1);
                    }
                }, "destroyed");
            }
            
            this.arr.push(val);
            this.trigger("updated");
            this.trigger("added", val);
            
            return this;
        };
        
        /**
         * Replaces all items of the queue with the items in the first parameter.
         * @param arr An array containing the new items.
         */
        Queue.prototype.replace = function (arr) {
            
            if (!(arr instanceof Array)) {
                throw new Exception("Parameter 1 is expected to be of type Array.");
            }
            
            this.arr = arr;
            
            this.trigger("updated");
            this.trigger("replaced", arr);
            
            return this;
        };
        
        /**
         * Removes the front of the queue and returns it.
         */
        Queue.prototype.next = function () {
            
            if (!this.hasNext()) {
                throw new Exception("Calling next() on empty queue.");
            }
            
            var ret = this.arr.shift();
            
            this.trigger("updated");
            this.trigger("next");
            
            if (this.arr.length < 1) {
                this.trigger("emptied");
            }
            
            return ret;
        };
        
        /**
         * Returns the front item of the queue without removing it.
         */
        Queue.prototype.peak = function () {
            return this.isEmpty() ? undefined : this.arr[0];
        };
        
        Queue.prototype.isEmpty = function () {
            return !this.hasNext();
        };
        
        Queue.prototype.hasNext = function () {
            return this.arr.length > 0;
        };
        
        /**
         * Removes all items from the queue.
         */
        Queue.prototype.clear = function () {
            
            this.arr = [];
            this.trigger("updated");
            this.trigger("cleared");
            
            return this;
        };
        
        /**
         * Reverses the queue's order so that the first item becomes the last.
         */
        Queue.prototype.reverse = function () {
            
            var q = new Queue(), len = this.length(), i = len - 1;
            
            while (i >= 0) {
                q.add(this.arr[i]);
                i -= 1;
            }
            
            return q;
        };
        
        /**
         * Returns a shallow copy of the queue.
         */
        Queue.prototype.clone = function () {
            return new Queue(this.arr.slice());
        };
        
        return Queue;
        
    }
    
}());


/* global MO5, window, module */

(function MO5rangeBootstrap () {
    
    if (typeof using === "function") {
        using().define("MO5.range", MO5rangeModule);
    }
    else if (typeof window !== "undefined") {
        window.MO5.range = MO5rangeModule();
    }
    else {
        module.exports = MO5rangeModule();
    }
    
    function MO5rangeModule () {
        
        function range (first, last) {
            
            var bag = [], i;
            
            for (i = first; i <= last; i += 1) {
                bag.push(i);
            }
            
            return bag;
        }
        
        return range;
    }
    
}());

/*/////////////////////////////////////////////////////////////////////////////////

 MO5.js - JavaScript Library For Building Modern DOM And Canvas Applications

 Copyright (c) 2013 Jonathan Steinbeck
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.

 * Neither the name MO5.js nor the names of its contributors 
   may be used to endorse or promote products derived from this software 
   without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/////////////////////////////////////////////////////////////////////////////////*/

/* global using, window, setTimeout, module, require, process, console */

(function MO5ResultBootstrap () {
    
    console.warn("MO5.Result is deprecated - use MO5.Promise instead!");
    
    if (typeof using === "function") {
        using("MO5.CoreObject", "MO5.Queue", "MO5.Exception", "MO5.fail").
        define("MO5.Result", MO5ResultModule);
    }
    else if (typeof window !== "undefined") {
        window.MO5.CoreObject = MO5ResultModule(
            MO5.CoreObject,
            MO5.Queue,
            MO5.Exception,
            MO5.fail
        );
    }
    else {
        module.exports = MO5ResultModule(
            require("./CoreObject.js"),
            require("./Queue.js"),
            require("./Exception.js"),
            require("./fail.js")
        );
    }
    
    function MO5ResultModule (CoreObject, Queue, Exception, fail) {
        
        var setImmediate;
        
        if (typeof window !== "undefined" && window.setImmediate) {
            setImmediate = window.setImmediate;
        }
        else if (typeof process !== "undefined") {
            setImmediate = function (fn) { process.nextTick(fn); };
        }
        else {
            setImmediate = function (fn) { setTimeout(fn, 0); };
        }
        
        function resolve (queue, value) {
            
            while (queue.hasNext()) {
                setImmediate((function (cur) { 
                    return function () { 
                        cur(value); 
                    };
                }(queue.next())));
            }
        }
        
        function addToQueue (type, queue, cb, action) {
            
            if (typeof cb === "function") {
                queue.add(function (value) {
                    
                    var nextValue;
                    
                    try {
                        nextValue = cb(value);
                        
                        if (nextValue && nextValue instanceof Promise) {
                            nextValue.then(action.success, action.failure);
                        }
                        else {
                            action.success(nextValue);
                        }
                    }
                    catch (e) {
                        action.failure(e);
                    }
                    
                    return nextValue;
                });
            }
            else {
                queue.add(function (value) { action[type](value); });
            }
        }
        
        function Result () {
            
            CoreObject.call(this);
            
            this.successQueue = new Queue();
            this.failureQueue = new Queue();
            this.value = undefined;
            this.status = Result.STATUS_PENDING;
            
            this.promise = new Promise(this);
        }
        
        Result.STATUS_PENDING = 1;
        Result.STATUS_FAILURE = 2;
        Result.STATUS_SUCCESS = 3;
        
        Result.getFulfilledPromise = function () {
            return new Result().success().promise;
        };
        
        Result.getBrokenPromise = function () {
            return new Result().failure().promise;
        };
        
        Result.prototype = new CoreObject();
        
        Result.prototype.isPending = function () {
            return this.status === Result.STATUS_PENDING;
        };
        
        Result.prototype.failure = function (reason) {
            if (this.status !== Result.STATUS_PENDING) {
                fail(new Exception("The result of the action has already been determined."));
                return;
            }
            
            this.value = reason;
            this.status = Result.STATUS_FAILURE;
            resolve(this.failureQueue, reason);
            this.successQueue.clear();
            this.failureQueue.clear();
            
            return this;
        };
        
        Result.prototype.success = function (value) {
            if (this.status !== Result.STATUS_PENDING) {
                fail(new Exception("The result of the action has already been determined."));
                return;
            }
            
            this.value = value;
            this.status = Result.STATUS_SUCCESS;
            resolve(this.successQueue, value);
            this.successQueue.clear();
            this.failureQueue.clear();
            
            return this;
        };
        
        Result.addToQueue = addToQueue;
        Result.resolve = resolve;
        
        function Promise (result) {
            
            CoreObject.call(this);
            
            this.then = function (success, failure) {
                
                var newResult = new Result();
                
                switch (result.status) {
                    case Result.STATUS_PENDING:
                        Result.addToQueue("success", result.successQueue, success, newResult);
                        Result.addToQueue("failure", result.failureQueue, failure, newResult);
                        break;
                    case Result.STATUS_SUCCESS:
                        Result.addToQueue("success", result.successQueue, success, newResult);
                        Result.resolve(result.successQueue, result.value);
                        break;
                    case Result.STATUS_FAILURE:
                        Result.addToQueue("failure", result.failureQueue, failure, newResult);
                        Result.resolve(result.failureQueue, result.value);
                        break;
                }
                
                return newResult.promise;
            };
        }
        
        Promise.prototype = new CoreObject();
        
        return Result;
        
    }
    
}());


/* global using, module, require, window */

(function MO5SetBootstrap () {
    
    if (typeof using === "function") {
        using("MO5.CoreObject", "MO5.types").
        define("MO5.Set", MO5SetModule);
    }
    else if (typeof window !== "undefined") {
        window.MO5.Set = MO5SetModule(MO5.CoreObject, MO5.types);
    }
    else {
        module.exports = MO5SetModule(require("./CoreObject.js"), require("./types.js"));
    }
    
    function MO5SetModule (CoreObject, types) {
        
        var KEY_PREFIX = "MO5Set_";
        
        /**
         * A set implementation that is similar to the ES6 Set, but knows about CoreObjects.
         *
         * @type void|[any] -> Set
         * @param items Optional array or other .forEach()-implementing object with items to add.
         */
        function Set (items) {
            
            CoreObject.call(this);
            
            // We need to hold onto CoreObject listeners to unsubscribe them
            // when the item gets deleted from the set:
            this._unsubscribers = {};
            
            // An object where the keys are "hashes" for simple values or CoreObject IDs:
            this._stringItems = {};
            
            // An array that holds non-"hashable" items, that is arrays and non-CoreObject objects:
            this._items = [];
            
            if (items && types.hasForEach(items)) {
                this.addMany(items);
            }
        }
        
        Set.fromRange = function (first, last) {
            
            var set = new Set(), i;
            
            for (i = first; i <= last; i += 1) {
                set.add(i);
            }
            
            return set;
        };
        
        Set.prototype = new CoreObject();
        
        /**
         * Checks whether an item is contained in the set.
         *
         * @type any -> boolean
         * @param item The item to check.
         * @return Is the item contained in the set?
         */
        Set.prototype.has = function (item) {
            
            var i, length;
            
            if (canBeConvertedToKey(item)) {
                return (toKey(item) in  this._stringItems);
            }
            else {
                
                for (i = 0, length = this._items.length; i < length; i += 1) {
                    if (this._items[i] === item) {
                        return true;
                    }
                }
                
                return false;
            }
        };
        
        /**
         * Adds an item to the set.
         *
         * @type any -> Set
         * @param item The item to add.
         * @return The Set object.
         */
        Set.prototype.add = function (item) {
            
            var key;
            
            if (this.has(item)) {
                return this;
            }
            
            if (canBeConvertedToKey(item)) {
                
                key = toKey(item);
                this._stringItems[key] = item;
                
                if (CoreObject.isCoreObject(item)) {
                    this._unsubscribers[key] = this.delete.bind(this, item);
                    item.subscribe("destroyed", this._unsubscribers[key]);
                }
            }
            else {
                this._items.push(item);
            }
            
            return this;
        };
        
        /**
         * Removes an item from the set.
         *
         * @type any -> boolean
         * @param item The item to remove.
         * @return Has the item been deleted?
         */
        Set.prototype.delete = function (item) {
            
            var key;
            
            if (!this.has(item)) {
                return false;
            }
            
            if (canBeConvertedToKey(item)) {
                
                key = toKey(item);
                
                delete this._stringItems[key];
                
                if (CoreObject.isCoreObject(item)) {
                    item.unsubscribe("destroyed", this._unsubscribers[key]);
                    delete this._unsubscribers[key];
                }
            }
            else {
                this._items.splice(this._items.indexOf(item), 1);
            }
            
            return true;
        };
        
        /**
         * Removes all items from the set.
         *
         * @type void -> undefined
         */
        Set.prototype.clear = function () {
            this._items.forEach(this.delete.bind(this));
            this._items = [];
            this._stringItems = {};
            this._unsubscribers = {};
        };
        
        /**
         * Calls a callback for each of the items in the set with the following arguments:
         * 1) the item
         * 2) the index - this should be in the order in which the items have been added
         * 3) the set itself
         *
         * @type function -> undefined
         * @param fn A callback function.
         */
        Set.prototype.forEach = function (fn) {
            
            var key, i = 0;
            
            for (key in this._stringItems) {
                fn(this._stringItems[key], i, this);
                i += 1;
            }
            
            this._items.forEach(function (item) {
                fn(item, i, this);
                i += 1;
            }.bind(this));
        };
        
        /**
         * Returns all items in the set as an array.
         *
         * @type void -> [any]
         */
        Set.prototype.values = function () {
            
            var values = [];
            
            this.forEach(function (item) {
                values.push(item);
            });
            
            return values;
        };
        
        Set.prototype.keys = Set.prototype.values;
        
        /**
         * Adds many items to the set at once.
         *
         * @type [any] -> Set
         * @param items An array or other iterable object with a .forEach() method.
         * @return The Set object.
         */
        Set.prototype.addMany = function (items) {
            items.forEach(this.add.bind(this));
            return this;
        };
        
        Set.prototype.intersection = function (otherSet) {
            
            var result = new Set();
            
            otherSet.forEach(function (item) {
                if (this.has(item)) {
                    result.add(item);
                }
            }.bind(this));
            
            return result;
        };
        
        Set.prototype.difference = function (otherSet) {
            
            var result = new Set(this.values());
            
            otherSet.forEach(function (item) {
                if (result.has(item)) {
                    result.delete(item);
                }
                else {
                    result.add(item);
                }
            });
            
            return result;
        };
        
        Set.prototype.size = function () {
            
            var length = this._items.length, key;
            
            for (key in this._stringItems) {
                length += 1;
            }
            
            return length;
        };
        
        return Set;
        
        /**
         * Checks whether an item can be converted to string in some form to be used as a key.
         *
         * @type any -> boolean
         * @param item The item to check.
         * @return Can the item be converted to key?
         */
        function canBeConvertedToKey (item) {
            
            if (types.isObject(item)) {
                
                if (types.isNumber(item.id)) {
                    return true;
                }
                
                return false;
            }
            
            return true;
        }
        
        /**
         * Converts an item to a key that can be used as a primitive "hash" to identifiy
         * the object inside the set.
         *
         * @type any -> string
         * @param item The item to convert to key.
         * @return The key as a string.
         */
        function toKey (item) {
            
            if (types.isObject(item)) {
                return KEY_PREFIX + "MO5CoreObject_" + item.id;
            }
            
            return KEY_PREFIX + "SimpleValue_" + JSON.stringify(item);
        }
        
    }
    
}());


/*/////////////////////////////////////////////////////////////////////////////////

 MO5.js - JavaScript Library For Building Modular HTML5 and Node.js Apps

 Copyright (c) 2014 Jonathan Steinbeck
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.

 * Neither the name MO5.js nor the names of its contributors 
   may be used to endorse or promote products derived from this software 
   without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/////////////////////////////////////////////////////////////////////////////////*/

/* global using */

using().define("MO5.Size", function () {
    
    function Size (width, height) {
        this.width = width || 0;
        this.height = height || 0;
    }
    
    return Size;
    
});

/*/////////////////////////////////////////////////////////////////////////////////

 MO5.js - JavaScript Library For Building Modern DOM And Canvas Applications

 Copyright (c) 2013 Jonathan Steinbeck
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.

 * Neither the name MO5.js nor the names of its contributors 
   may be used to endorse or promote products derived from this software 
   without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/////////////////////////////////////////////////////////////////////////////////*/

/* global using, window, module, require */

(function MO5TimerBootstrap () {
    
    if (typeof using === "function") {
        using("MO5.Exception", "MO5.CoreObject", "MO5.fail", "MO5.Promise").
        define("MO5.Timer", MO5TimerModule);
    }
    else if (typeof window !== "undefined") {
        window.MO5.Timer = MO5TimerModule(MO5.Exception, MO5.CoreObject, MO5.fail, MO5.Promise);
    }
    else {
        module.exports = MO5TimerModule(
            require("./Exception.js"),
            require("./CoreObject.js"),
            require("./fail.js"),
            require("./Promise.js")
        );
    }
    
    function MO5TimerModule (Exception, CoreObject, fail, Promise) {
        
        function TimerError (msg) {
            
            Exception.call(this);
            
            this.message = msg;
            this.name = "MO5.TimerError";
        }
        
        TimerError.prototype = new Exception();
        
        /**
         * A Timer object is returned by the transform() function.
         * It can be used to control the transformation during its
         * execution and it can also be used to obtain information
         * about the state of a transformation, e.g. whether it's
         * still ongoing.
         */
        function Timer () {
            
            CoreObject.call(this);
            
            this.running = false;
            this.paused = false;
            this.canceled = false;
            this.startTime = +(new Date());
            this.timeElapsed = 0;
            this.pauseTimeElapsed = 0;
            this.pauseStartTime = this.startTime;
        }
        
        Timer.prototype = new CoreObject();
        Timer.prototype.constructor = Timer;
        
        Timer.prototype.start = function () {
            this.startTime = +(new Date());
            this.running = true;
            
            this.trigger("started", null, false);
            
            return this;
        };
        
        Timer.prototype.stop = function () {
            this.running = false;
            this.paused = false;
            
            this.trigger("stopped", null, false);
            
            return this;
        };
        
        Timer.prototype.cancel = function () {
            if (!this.running) {
                fail(new TimerError("Trying to cancel a Timer that isn't running."));
            }
            
            this.elapsed();
            this.canceled = true;
            this.running = false;
            this.paused = false;
            
            this.trigger("canceled", null, false);
            
            return this;
        };
        
        Timer.prototype.isRunning = function () {
            return this.running;
        };
        
        Timer.prototype.isCanceled = function () {
            return this.canceled;
        };
        
        Timer.prototype.isPaused = function () {
            return this.paused;
        };
        
        Timer.prototype.pause = function () {
            this.paused = true;
            this.pauseStartTime = +(new Date());
            this.trigger("paused", null, false);
        };
        
        Timer.prototype.resume = function () {
            
            if (!this.paused) {
                fail(new TimerError("Trying to resume a timer that isn't paused."));
            }
            
            this.paused = false;
            this.pauseTimeElapsed += +(new Date()) - this.pauseStartTime;
            this.trigger("resumed", null, false);
        };
        
        /**
         * Returns the number of milliseconds since the call of start(). If the
         * Timer's already been stopped, then the number of milliseconds between 
         * start() and stop() is returned. The number of milliseconds does not
         * include the times between pause() and resume()!
         */
        Timer.prototype.elapsed = function () {
            
            if (this.running && !this.paused) {
                this.timeElapsed = ((+(new Date()) - this.startTime) - this.pauseTimeElapsed);
            }
            
            return this.timeElapsed;
        };
        
        /**
         * Returns a capability object that can be given to other objects
         * by those owning a reference to the Timer. It is read only so that
         * the receiver of the capability object can only obtain information
         * about the Timer's state, but not modify it.
         */
        Timer.prototype.getReadOnlyCapability = function () {
            
            var self = this;
            
            return {
                isRunning: function () { return self.running; },
                isCanceled: function () { return self.canceled; },
                isPaused: function () { return self.paused; },
                elapsed: function () { return self.elapsed(); }
            };
        };
        
        Timer.prototype.promise = function () {
            
            var promise = new Promise(), self = this;
            
            this.once(
                function () {
                    promise.resolve(self);
                }, 
                "stopped"
            );
            
            this.once(
                function () {
                    promise.reject(self);
                },
                "canceled"
            );
            
            this.once(
                function () {
                    promise.reject(self);
                },
                "destroyed"
            );
            
            return promise;
        };
        
        return Timer;
        
    }
}());


/*/////////////////////////////////////////////////////////////////////////////////

 MO5.js - JavaScript Library For Building Modern DOM And Canvas Applications

 Copyright (c) 2013 Jonathan Steinbeck
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.

 * Neither the name MO5.js nor the names of its contributors 
   may be used to endorse or promote products derived from this software 
   without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/////////////////////////////////////////////////////////////////////////////////*/

/* global using, window, module, require */

(function MO5TimerWatcherBootstrap () {
    
    if (typeof using === "function") {
        using("MO5.Exception", "MO5.CoreObject", "MO5.fail", "MO5.Timer").
        define("MO5.TimerWatcher", MO5TimerWatcherModule);
    }
    else if (typeof window !== "undefined") {
        window.MO5.TimerWatcher = MO5TimerWatcherModule(
            MO5.Exception,
            MO5.CoreObject,
            MO5.fail,
            MO5.Timer
        );
    }
    else {
        module.exports = MO5TimerWatcherModule(
            require("./Exception.js"),
            require("./CoreObject.js"),
            require("./fail.js"),
            require("./Timer.js")
        );
    }
    
    function MO5TimerWatcherModule (Exception, CoreObject, fail, Timer) {
        
        /**
         * A TimerWatcher object can be used to bundle MO5.Timer objects
         * together and observe them. The TimerWatcher object emits the
         * same events as a Timer does and has almost the same API, so that 
         * in most cases, a TimerWatcher object can be used as if it was a Timer.
         * 
         * A TimerWatcher extends MO5.Object.
         * 
         * @type Constructor
         * 
         * @event added(MO5.Timer)
         * @event canceled()
         * @event created(MO5.Timer)
         * @event pause()
         * @event resume()
         * @event started()
         * @event stopped()
         */
        function TimerWatcher (timers) {
            
            var self;
            
            CoreObject.call(this);
            
            if (timers && !(timers instanceof Array)) {
                throw new Exception("Parameter 1 is expected to be of type Array.").log();
            }
            
            timers = timers || [];
            
            self = this;
            this.timers = {};
            this.count = 0;
            
            timers.forEach(function (t) {
                self.addTimer(t);
            });
        }
        
        TimerWatcher.prototype = new CoreObject();
        TimerWatcher.prototype.constructor = TimerWatcher;
        
        TimerWatcher.prototype.addTimer = function (timer) {
            
            var fn, self = this;
            
            if (this.timers[+timer]) {
                throw new Exception(
                    "A timer with ID '" + timer + "' has already been added to the watcher.");
            }
            
            this.count += 1;
            
            fn = function () {
                
                self.count -= 1;
                
                if (self.count < 1) {
                    self.trigger("stopped", null, false);
                }
            };
            
            this.timers[+timer] = {
                timer: timer,
                unsubscribe: function () {
                    timer.unsubscribe(fn, "stopped");
                }
            };
            
            timer.subscribe(fn, "stopped");
            this.trigger("added", timer, false);
            
            return this;
        };
        
        /**
         * Creates and returns a Timer that is already added to
         * the TimerWatcher when it's returned to the caller.
         */
        TimerWatcher.prototype.createTimer = function () {
            
            var timer = new Timer();
            
            this.trigger("created", timer, false);
            this.addTimer(timer);
            
            return timer;
        };
        
        TimerWatcher.prototype.removeTimer = function (timer) {
            
            if (!this.timers[+timer]) {
                fail(new Exception("Trying to remove a timer that is unknown to the watcher."));
                return this;
            }
            
            this.timers[+timer].unsubscribe();
            delete this.timers[+timer];
            
            this.trigger("removed", timer, false);
            
            return this;
        };
        
        TimerWatcher.prototype.forAll = function (what) {
            
            var key, cur;
            
            for (key in this.timers) {
                
                if (!(this.timers.hasOwnProperty(key))) {
                    continue;
                }
                
                cur = this.timers[key].timer;
                
                if (cur instanceof TimerWatcher) {
                    this.timers[key].timer.forAll(what);
                }
                else {
                    this.timers[key].timer[what]();
                }
            }
            
            return this;
        };
        
        TimerWatcher.prototype.cancel = function () {
            
            this.forAll("cancel");
            this.trigger("canceled", null, false);
            
            return this;
        };
        
        TimerWatcher.prototype.pause = function () {
            
            this.forAll("pause");
            this.trigger("paused", null, false);
            
            return this;
        };
        
        TimerWatcher.prototype.resume = function () {
            
            this.forAll("resume");
            this.trigger("resumed", null, false);
            
            return this;
        };
        
        TimerWatcher.prototype.stop = function () {
            return this.forAll("stop");
        };
        
        TimerWatcher.prototype.start = function () {
            
            this.forAll("start");
            this.trigger("started", null, false);
            
            return this;
        };
        
        TimerWatcher.prototype.promise = function () {
            return Timer.prototype.promise.call(this);
        };
        
        return TimerWatcher;
        
    }
}());


/*/////////////////////////////////////////////////////////////////////////////////

 MO5.js - JavaScript Library For Building Modern DOM And Canvas Applications

 Copyright (c) 2013 Jonathan Steinbeck
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.

 * Neither the name MO5.js nor the names of its contributors 
   may be used to endorse or promote products derived from this software 
   without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/////////////////////////////////////////////////////////////////////////////////*/

/* global using, window, document, console */

using().define("MO5.tools", function () {
    
    var tools = {};
    
    /**
     * Returns a unique ID for MO5 objects.
     * @return [Number] The unique ID.
     */
    tools.getUniqueId = (function () {
        
        var n = 0;
        
        return function () {
            return n++;
        };
    }());
    
    /**
     * Returns the window's width and height.
     * @return Object An object with a width and a height property.
     */
    tools.getWindowDimensions = function () {
        
        var e = window, a = 'inner';
        
        if (!('innerWidth' in e)) {
            a = 'client';
            e = document.documentElement || document.body;
        }
        
        return {
            width: e[a + 'Width'],
            height: e[a + 'Height']
        };
    };
    
    /**
     * Scales an element to fit the window using CSS transforms.
     * @param el The DOM element to scale.
     * @param w The normal width of the element.
     * @param h The normal height of the element.
     */
    tools.fitToWindow = function (el, w, h) {
        
        var dim, ratio, sw, sh, ratioW, ratioH;
        
        dim = tools.getWindowDimensions();
        sw = dim.width; // - (dim.width * 0.01);
        sh = dim.height; // - (dim.height * 0.01);
        
        ratioW = sw / w;
        ratioH = sh / h;
        
        ratio = ratioW > ratioH ? ratioH : ratioW;
        
        el.setAttribute('style',
        el.getAttribute('style') + ' -moz-transform: scale(' + ratio + ',' + ratio + ') rotate(0.01deg);' + ' -ms-transform: scale(' + ratio + ',' + ratio + ');' + ' -o-transform: scale(' + ratio + ',' + ratio + ');' + ' -webkit-transform: scale(' + ratio + ',' + ratio + ');' + ' transform: scale(' + ratio + ',' + ratio + ');');
    };
    
    tools.timeoutInspector = (function () {
        
        var oldSetTimeout, oldSetInterval, oldClearTimeout;
        var oldClearInterval, oldRequestAnimationFrame;
        var activeIntervals = {}, timeoutCalls = 0, intervalCalls = 0, animationFrameRequests = 0;
        
        oldSetTimeout = window.setTimeout;
        oldSetInterval = window.setInterval;
        oldClearTimeout = window.clearTimeout;
        oldClearInterval = window.clearInterval;
        oldRequestAnimationFrame = window.requestAnimationFrame;
        
        return {
            
            logAnimationFrameRequests: false,
            logTimeouts: false,
            logIntervals: false,
            
            enable: function () {
                
                window.setTimeout = function (f, t) {
                    
                    var h = oldSetTimeout(f, t);
                    
                    timeoutCalls += 1;
                    
                    if (this.logTimeouts) {
                        console.log("Setting timeout: ", {callback: f.toString(), time: t}, h);
                    }
                    
                    return h;
                };
                
                window.setInterval = function (f, t) {
                    
                    var h = oldSetInterval(f, t);
                    
                    intervalCalls += 1;
                    activeIntervals[h] = true;
                    
                    if (this.logIntervals) {
                        console.log("Setting interval: ", {callback: f.toString(), time: t}, h);
                    }
                    
                    return h;
                };
                
                window.clearTimeout = function (h) {
                    
                    console.log("Clearing timeout: ", h);
                    
                    return oldClearTimeout(h);
                };
                
                window.clearInterval = function (h) {
                    
                    console.log("Clearing interval: ", h);
                    
                    if (!(h in activeIntervals)) {
                        console.log("Warning: Interval " + h + " doesn't exist.");
                    }
                    else {
                        delete activeIntervals[h];
                    }
                    
                    return oldClearInterval(h);
                };
                
                window.requestAnimationFrame = function (f) {
                    
                    animationFrameRequests += 1;
                    
                    if (this.logAnimationFrameRequests) {
                        console.log("Requesting animation frame: ", {callback: f.toString()});
                    }
                    
                    return oldRequestAnimationFrame(f);
                };
            },
            
            disable: function () {
                window.setTimeout = oldSetTimeout;
                window.setInterval = oldSetInterval;
                window.clearTimeout = oldClearTimeout;
                window.clearInterval = oldClearInterval;
                window.requestAnimationFrame = oldRequestAnimationFrame;
            },
            
            getActiveIntervals: function () {
                
                var key, handles = [];
                
                for (key in this.activeIntervals) {
                    handles.push(key);
                }
                
                return handles;
            },
            
            totalTimeoutCalls: function () {
                return timeoutCalls;
            },
            
            totalIntervalCalls: function () {
                return intervalCalls;
            },
            
            totalRequestAnimationFrameCalls: function () {
                return animationFrameRequests;
            }
        };
    }());
    
    return tools;
    
});

/*/////////////////////////////////////////////////////////////////////////////////

 MO5.js - JavaScript Library For Building Modern DOM And Canvas Applications

 Copyright (c) 2013 Jonathan Steinbeck
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.

 * Neither the name MO5.js nor the names of its contributors 
   may be used to endorse or promote products derived from this software 
   without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/////////////////////////////////////////////////////////////////////////////////*/

/* global using, requestAnimationFrame, console */

using("MO5.Exception", "MO5.Timer", "MO5.easing").
define("MO5.transform", function (Exception, Timer, easing) {
    
    /**
     * 
     *    [Function] MO5.transform
     *    ========================
     * 
     *        The main tween function for animations. Calculates values between 
     *        a start and an end value using either a sine function or a user 
     *        defined function and feeds them into a callback function. 
     * 
     *        
     *        Parameters
     *        ----------
     *        
     *            1. callback:
     *                [Function] The callback function. It takes one
     *                argument, which is the current calculated value. Use this
     *                callback function to set the value(s) you want to transform.
     * 
     *            2. from:
     *                [Number] The start value.
     *                
     *            3. to:
     *                [Number] The end value.
     *                
     *            4. args:
     *                [Object] (optional) Arguments object. 
     *                
     *                The options are:
     *                
     *                * duration: 
     *                    [Number] How long the transformation shall take 
     *                    (in milliseconds). Default: 1000
     *                
     *                * log: 
     *                    [Boolean] Log each calculated value to the browser's 
     *                    console?
     *                
     *                * easing: 
     *                    [Function] The function to actually calculate the values.
     *                    It must conform to this signature [Number] function(d, t)
     *                    where d is the full duration of the transformation and
     *                    t is the time the transformation took up to that point. 
     *                    Default: MO5.easing.sineEaseOut
     *                
     *                * onFinish:
     *                    [Function] Callback that gets executed once the
     *                    transformation is finished.
     * 
     *                * timer:
     *                    [MO5.Timer] A timer to use instead of creating a new one.
     *                      This can be useful if you want to use one timer for multiple
     *                      transformations.
     *                    
     * 
     *        Return value
     *        ------------
     *        
     *            [MO5.Timer] A timer to control the transformation or see if it's still running.
     *              When stop() is called on the timer, the transformation is immediately finished.
     *              Calling cancel() on the timer stops the transformation at the current value.
     *              Calling pause() pauses the transformation until resume() is called.
     *            
     * 
     */
    function transform (callback, from, to, args) {
        
        args = args || {};
        
        if (typeof callback === "undefined" || !callback) {
            throw new Exception("MO5.transform expects parameter callback to be a function.");
        }
        
        var dur = typeof args.duration !== "undefined" && args.duration >= 0 ? args.duration : 500,
            f,
            func,
            cv = from,
            timer = args.timer || new Timer(),
            diff = to - from,
            doLog = args.log || false,
            c = 0, // number of times func get's executed
            lastExecution = 0,
            fps = args.fps || 60;
        
        f = args.easing || easing.sineEaseOut;
        
        func = function () {
            
            var dt, tElapsed;
            
            if ((Date.now() - lastExecution) > (1000 / fps)) {
                
                if (timer.canceled) {
                    return;
                }
                
                if (timer.paused) {
                    timer.once(func, "resumed");
                    
                    return;
                }
                
                c += 1;
                tElapsed = timer.elapsed();
                
                if (tElapsed > dur || timer.stopped) {
                    cv = from + diff;
                    callback(to);
                    
                    if (!timer.stopped) {
                        timer.stop();
                    }
                    
                    return;
                }
                
                cv = f(dur, tElapsed) * diff + from;
                
                callback(cv);
                
                dt = timer.elapsed() - tElapsed;
                
                if (doLog === true) {
                    console.log("Current value: " + cv + "; c: " + c + "; Exec time: " + dt);
                }
                
                lastExecution = Date.now();
            }
            
            requestAnimationFrame(func);
        };
        
        timer.start();
        requestAnimationFrame(func);
        
        return timer;
    }
    
    return transform;
    
});

/* global using, window, module */

(function MO5typesBootstrap () {
    
    if (typeof using === "function") {
        using().define("MO5.types", MO5typesModule);
    }
    else if (typeof window !== "undefined") {
        window.MO5.types = MO5typesModule();
    }
    else {
        module.exports = MO5typesModule();
    }
    
    function MO5typesModule () {
        
        var types = {};
        
        types.isObject = function (thing) {
            return (typeof thing === "object" && thing !== null);
        };
        
        types.isString = function (thing) {
            return typeof thing === "string";
        };
        
        types.isNumber = function (thing) {
            return typeof thing === "number";
        };
        
        types.isFunction = function (thing) {
            return typeof thing === "function";
        };
        
        types.isArray = function (thing) {
            
            if (Array.isArray) {
                return Array.isArray(thing);
            }
            
            if (!types.isObject(thing)) {
                return false;
            }
            
            return thing instanceof Array;
        };
        
        types.hasForEach = function (thing) {
            return types.isObject(thing) && types.isFunction(thing.forEach);
        };
        
        return types;
        
    }
}());

/* global using */

using(
    "WSE.assets.Animation",
    "WSE.assets.Audio",
    "WSE.assets.Background",
    "WSE.assets.Character",
    "WSE.assets.Curtain",
    "WSE.assets.Imagepack",
    "WSE.assets.Textbox",
    "WSE.assets.Composite"
).
define("WSE.assets", function (
    AnimationAsset,
    AudioAsset,
    BackgroundAsset,
    CharacterAsset,
    CurtainAsset,
    ImagepackAsset,
    TextboxAsset,
    CompositeAsset
) {
    
    var assets = {
        Animation: AnimationAsset,
        Audio: AudioAsset,
        Background: BackgroundAsset,
        Character: CharacterAsset,
        Curtain: CurtainAsset,
        Imagepack: ImagepackAsset,
        Textbox: TextboxAsset,
        Composite: CompositeAsset
    };
    
    return assets;
    
});


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


/* global using */

using().define("WSE.functions", function () {
    
    "use strict";
    
    var functions = {
        
        savegames: function (interpreter) {
            interpreter.toggleSavegameMenu();
        },
        
        stageclick_disable: function (interpreter) {
            interpreter.game.unsubscribeListeners();
        },
        
        stageclick_enable: function (interpreter) {
            interpreter.game.subscribeListeners();
        }
        
    };
    
    return functions;
    
});


/* global using */

using("WSE.dataSources.LocalStorage").
define("WSE.dataSources", function (LocalStorageDataSource) {
    
    var dataSources = {
        LocalStorage: LocalStorageDataSource
    };
    
    return dataSources;
    
});


/* global using */

using("databus", "WSE.assets", "WSE.commands", "WSE.dataSources", "WSE.functions").
define("WSE", function (DataBus, assets, commands, dataSources, functions) {
    
    "use strict";
    
    var WSE = {}, version = "2017.1.0";
    
    DataBus.inject(WSE);
    
    WSE.instances = [];
    
    WSE.dataSources = dataSources;
    WSE.assets = assets;
    WSE.commands = commands;
    WSE.functions = functions;
    
    WSE.getVersion = function () {
        return version;
    };
    
    return WSE;
    
});


/* global using */

using().define("WSE.Keys", function () {
    
    /**
    
        @module WSE.Keys
    
        [Constructor] WSE.Keys
        ============================
    
            A simple object to handle key press events.
            Has a number of handy pseudo constants which can
            be used to identify keys.
    
            If there's a key identifier missing, you can add your own by defining
            a plain object literal with a kc property for the keycode
            and an optional which property for the event type.
    
    
        Parameters
        ----------
        
            1. args:
                
                [Object] An object to configure the instance's behaviour.
                
                Has the following properties:
        
                    * element: 
                        
                        [DOMElement] The HTML element to bind the listeners to. 
                        Default: window
                    
                    * log:
                    
                        [Boolean] Log the captured events to the console?
                        Default: false.
                        
                        
        Properties
        ----------
        
            * keys:
            
                [Object] An object with 'constants' for easier key identification.
                The property names are the names of the keys and the values
                are objects with a "kc" property for the KeyCode and optionally
                a "which" property for the event type.
                
                The property names are all UPPERCASE.
                
                Examples:
                
                    * SPACE
                    * ENTER
                    * TAB
                    * CTRL
                    * ALT
                    * SHIFT
                    * LEFT_ARROW, RIGHT_ARROW, UP_ARROW, DOWN_ARROW
                    * A to Z
                    * NUM_0 to NUM_9
                    * NUMPAD_0 to NUMPAD_9
                    * F1 to F12
                    * ADD, SUBSTRACT, MULTIPLY, DIVIDE, EQUALS
                    * PERIOD
                    * COMMA
        
                        
    */
    function Keys (args) {
    
        args = args || {};
        
        this.keys = {};
        this.keys.BACKSPACE     = {kc:   8};
        this.keys.TAB           = {kc:   9};
        this.keys.ENTER         = {kc:  13, which: 13};
        this.keys.SHIFT         = {kc:  16};
        this.keys.CTRL          = {kc:  17};
        this.keys.ALT           = {kc:  18};
        this.keys.PAUSE         = {kc:  19};
        this.keys.CAPS_LOCK     = {kc:  20};
        this.keys.ESCAPE        = {kc:  27};
        this.keys.SPACE         = {kc:  32};
        this.keys.PAGE_UP       = {kc:  33};
        this.keys.PAGE_DOWN     = {kc:  20};
        this.keys.END           = {kc:  20};
        this.keys.HOME          = {kc:  20};
        this.keys.LEFT_ARROW    = {kc:  37};
        this.keys.UP_ARROW      = {kc:  38};
        this.keys.RIGHT_ARROW   = {kc:  39};
        this.keys.DOWN_ARROW    = {kc:  40};
        this.keys.INSERT        = {kc:  45};
        this.keys.DELETE        = {kc:  46};
        this.keys.NUM_0         = {kc:  48};
        this.keys.NUM_1         = {kc:  49};
        this.keys.NUM_2         = {kc:  50};
        this.keys.NUM_3         = {kc:  51};
        this.keys.NUM_4         = {kc:  52};
        this.keys.NUM_5         = {kc:  53};
        this.keys.NUM_6         = {kc:  54};
        this.keys.NUM_7         = {kc:  55};
        this.keys.NUM_8         = {kc:  56};
        this.keys.NUM_9         = {kc:  57};
        this.keys.A             = {kc:  65};
        this.keys.B             = {kc:  66};
        this.keys.C             = {kc:  67};
        this.keys.D             = {kc:  68};
        this.keys.E             = {kc:  69};
        this.keys.F             = {kc:  70};
        this.keys.G             = {kc:  71};
        this.keys.H             = {kc:  72};
        this.keys.I             = {kc:  73};
        this.keys.J             = {kc:  74};
        this.keys.K             = {kc:  75};
        this.keys.L             = {kc:  76};
        this.keys.M             = {kc:  77};
        this.keys.N             = {kc:  78};
        this.keys.O             = {kc:  79};
        this.keys.P             = {kc:  80};
        this.keys.Q             = {kc:  81};
        this.keys.R             = {kc:  82};
        this.keys.S             = {kc:  83};
        this.keys.T             = {kc:  84};
        this.keys.U             = {kc:  85};
        this.keys.V             = {kc:  86};
        this.keys.W             = {kc:  87};
        this.keys.X             = {kc:  88};
        this.keys.Y             = {kc:  89};
        this.keys.Z             = {kc:  90};
        this.keys.LEFT_WIN      = {kc:  91};
        this.keys.RIGHT_WIN     = {kc:  92};
        this.keys.SELECT        = {kc:  93};
        this.keys.NUMPAD_0      = {kc:  96};
        this.keys.NUMPAD_1      = {kc:  97};
        this.keys.NUMPAD_2      = {kc:  98};
        this.keys.NUMPAD_3      = {kc:  99};
        this.keys.NUMPAD_4      = {kc: 100};
        this.keys.NUMPAD_5      = {kc: 101};
        this.keys.NUMPAD_6      = {kc: 102};
        this.keys.NUMPAD_7      = {kc: 103};
        this.keys.NUMPAD_8      = {kc: 104};
        this.keys.NUMPAD_9      = {kc: 105};
        this.keys.MULTIPLY      = {kc: 106};
        this.keys.ADD           = {kc: 107};
        this.keys.SUBSTRACT     = {kc: 109};
        this.keys.DECIMAL_POINT = {kc: 110};
        this.keys.DIVIDE        = {kc: 111};
        this.keys.F1            = {kc: 112};
        this.keys.F2            = {kc: 113};
        this.keys.F3            = {kc: 114};
        this.keys.F4            = {kc: 115};
        this.keys.F5            = {kc: 116};
        this.keys.F6            = {kc: 117};
        this.keys.F7            = {kc: 118};
        this.keys.F8            = {kc: 119};
        this.keys.F9            = {kc: 120};
        this.keys.F10           = {kc: 121};
        this.keys.F11           = {kc: 122};
        this.keys.F12           = {kc: 123};
        this.keys.NUM_LOCK      = {kc: 144};
        this.keys.SCROLL_LOCK   = {kc: 145};
        this.keys.SEMI_COLON    = {kc: 186};
        this.keys.EQUALS        = {kc: 187};
        this.keys.COMMA         = {kc: 188};
        this.keys.DASH          = {kc: 189};
        this.keys.PERIOD        = {kc: 190};
        this.keys.SLASH         = {kc: 191};
        this.keys.GRAVE         = {kc: 192};
        this.keys.OPEN_BRACKET  = {kc: 219};
        this.keys.BACK_SLASH    = {kc: 220};
        this.keys.CLOSE_BRACKET = {kc: 221};
        this.keys.SINGLE_QUOTE  = {kc: 222};
        
        this.listeners = [];
        
        var attach, 
            capture,
            captureUp,
            captureDown,
            capturePress,
            examineEvent,
            logEvents = args.log || false,
            element = args.element || window,
            self = this;
        
        attach = function(elem) {
            
            if (elem == null || typeof elem == 'undefined') {
                return;
            }
            
            if (elem.addEventListener) {
                
                elem.addEventListener("keyup", captureUp, false);
                elem.addEventListener("keydown", captureDown, false);
                elem.addEventListener("keypress", capturePress, false);
                
                if (logEvents === true) {
                    elem.addEventListener("keyup", examineEvent, false);
                    elem.addEventListener("keydown", examineEvent, false);
                    elem.addEventListener("keypress", examineEvent, false);
                }
            } 
            else if (elem.attachEvent) {
                
                elem.attachEvent("onkeyup", captureUp);
                elem.attachEvent("onkeydown", captureDown);
                elem.attachEvent("onkeypress", capturePress);
                
                if (logEvents === true) {
                    elem.attachEvent("onkeyup", examineEvent);
                    elem.attachEvent("onkeydown", examineEvent);
                    elem.attachEvent("onkeypress", examineEvent);
                }
            }
        };
        
        capture = function (event, type) {
            
            var len = self.listeners.length, cur, i, kc, which;
            
            for (i = 0; i < len; ++i) {
                
                cur = self.listeners[i];
                
                if (typeof cur == 'undefined' || cur.type != type) {
                    continue;
                }
                
                cur.key = cur.key || {};
                kc = cur.key.kc || null;
                which = cur.key.which || null;
                
                if (event.which == which || event.keyCode == kc) {
                    cur.callback(event);
                }
            }
        };
        
        captureUp = function (event) {
            capture(event, "up");
        };
        
        captureDown = function (event) {
            capture(event, "down");
        };
        
        capturePress = function (event) {
            capture(event, "press");
        };
        
        examineEvent = function (event) {
            /* eslint-disable no-console */
            console.log(event);
            /* eslint-enable no-console */
        };
        
        attach(element);
    }
    
    /**
    
        @module WSE.Keys
    
        [Function] WSE.Keys.addListener
        =====================================
    
            Binds a new callback to a key.
        
    
        Parameters
        ----------
        
            1. key:
                
                [Object] One of the WSE.Keys pseudo constants.
                
            2. callback:
            
                [Function] The callback to execute once the key has been pressed.
            
            3. type: 
    
                [String] The event type to use. 
                
                One of:
            
                    * "up"    for "keyup",
                    * "down"  for "keydown",
                    * "press" for "keypress"
            
                Default: "up"
                
        Errors
        ------
                
            Throws an Error when the type parameter is not recognized.
                
                
    */
    Keys.prototype.addListener = function(key, callback, type) {
        
        type = type || "up";
        
        if (type !== "up" && type !== "down" && type !== "press") {
            throw new Error("Event type not recognized.");
        }
        
        this.listeners.push({
            key: key,
            callback: callback,
            type: type
        });
    };
    
    /**
    
        @module WSE.Keys
    
        [Function] WSE.Keys.removeListener
        ========================================
    
            Removes the event listeners for a key.
            
    
        Parameters
        ----------
        
            1. key:
            
                [Object] One of WSE.Keys pseudo constants.
                
                
    */
    Keys.prototype.removeListener = function (key, callback, type) {
        
        var len = this.listeners.length;
        var cur;
        
        type = type || null;
        
        for (var i = 0; i < len; ++i) {
            
            cur = this.listeners[i];
            
            if (type !== null && cur.type != type) {
                continue;
            }
            
            if (typeof cur !== 'undefined' && cur.key === key && cur.callback === callback) {
                delete this.listeners[i];
            }
        }
    };
    
    /** 
     
        @module WSE.Keys
    
        [Function] WSE.Keys.forAll
        ================================
        
            Executes a callback for any key event that occurs.
        
        
        Parameters
        ----------
        
            1. callback:
            
                [Function] A callback function to be executed when a keyboard
                event occurs.
                
            2. type: 
                
                [String] The keyboard event type to use. 
                
                One of:
                
                    * "up"    for "keyup",
                    * "down"  for "keydown",
                    * "press" for "keypress"
                
                Default: "up"
    
        Errors
        ------
        
            Throws an Error when the type parameter is not recognized.
            
    
    */
    Keys.prototype.forAll = function (callback, type) {
        
        type = type || "up";
        
        if (type !== "up" && type !== "down" && type !== "press") {
            throw new Error("Event type not recognized.");
        }
        
        for (var key in this.keys) {
            
            if (!this.keys.hasOwnProperty(key)) {
                continue;
            }
            
            this.addListener(this.keys[key], callback, type);
        }
    };
    
    return Keys;
    
});


/* global using */

using("MO5.Timer").define("WSE.tools", function (Timer) {
    
    "use strict";
    
    var tools = {};
    
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


/* global using */

using("easy-ajax", "WSE.tools.compile::compile").
define("WSE.loader", function (ajax, compile) {
    
    function generateGameFile (mainFilePath, then) {
        compileFile(mainFilePath, function (mainFile) {
            generateGameFileFromString(mainFile, then);
        });
    }
    
    function generateGameFileFromString (text, then) {
        
        var gameDocument = parseXml(text);
        var fileDefinitions = getFileDefinitions(gameDocument);
        
        compileFiles(fileDefinitions, function (files) {
            files.forEach(function (file, i) {
                
                var type = fileDefinitions[i].type;
                var parent = gameDocument.getElementsByTagName(type)[0];
                
                if (!parent) {
                    parent = gameDocument.createElement(type);
                    gameDocument.documentElement.appendChild(parent);
                }
                
                parent.innerHTML += "\n" + file + "\n";
            });
            
            then(gameDocument);
        });
    }
    
    function generateFromString (text, then) {
        generateGameFileFromString(compile(text), then);
    }
    
    function compileFiles (fileDefinitions, then) {
        
        var loaded = 0;
        var count = fileDefinitions.length;
        var files = [];
        
        fileDefinitions.forEach(function (definition, i) {
            
            compileFile(definition.url, function (file) {
                
                files[i] = file;
                loaded += 1;
                
                if (loaded >= count) {
                    then(files);
                }
            });
        });
        
        if (count < 1) {
            then(files);
        }
    }
    
    function compileFile (path, then) {
        ajax.get(path + "?random=" + Math.random(), function (error, obj) {
            
            if (error) {
                console.error(error);
                return;
            }
            
            then(compile(obj.responseText));
        });
    }
    
    function parseXml (text) {
        return new DOMParser().parseFromString(text, "application/xml");
    }
    
    function getFileDefinitions (xml) {
        
        var elements = xml.getElementsByTagName("file");
        
        return [].map.call(elements, function (element) {
            return {
                type: element.getAttribute("type"),
                url: element.getAttribute("url")
            };
        });
    }
    
    return {
        generateGameFile: generateGameFile,
        generateFromString: generateFromString
    };
    
});


/* global using */

using("string-dict").define("WSE.dataSources.LocalStorage", function (Dict) {
    
    "use strict";
    
    var testKey = "___wse_storage_test";
    var localStorageEnabled = false;
    var data;
    
    try {
        
        localStorage.setItem(testKey, "works");
        
        if (localStorage.getItem(testKey) === "works") {
            localStorageEnabled = true;
        }
    }
    catch (error) {
        
        console.error("LocalStorage not available, using JS object as fallback.");
        
        data = new Dict();
    }
    
    function LocalStorageDataSource () {}
    
    LocalStorageDataSource.prototype.set = function (key, value) {
        
        if (!localStorageEnabled) {
            data.set(key, value);
        }
        else {
            localStorage.setItem(key, value);
        }
    };
    
    LocalStorageDataSource.prototype.get = function (key) {
        
        if (!localStorageEnabled) {
            
            if (!data.has(key)) {
                return null;
            }
            
            return data.get(key);
        }
        
        return localStorage.getItem(key);
    };
    
    LocalStorageDataSource.prototype.remove = function (key) {
        
        if (!localStorageEnabled) {
            
            if (!data.has(key)) {
                return;
            }
            
            return data.remove(key);
        }
        
        return localStorage.removeItem(key);
    };
    
    return LocalStorageDataSource;
    
});


/* global using */

using("WSE.commands", "WSE.functions", "WSE.tools::warn").
define("WSE.Trigger", function (commands, functions, warn) {
    
    "use strict";
    
    function Trigger (trigger, interpreter) {
        
        var self = this, fn;
        
        this.name = trigger.getAttribute("name") || null;
        this.event = trigger.getAttribute("event") || null;
        this.special = trigger.getAttribute("special") || null;
        this.fnName = trigger.getAttribute("function") || null;
        this.scene = trigger.getAttribute("scene") || null;
        this.interpreter = interpreter;
        this.isSubscribed = false;
        
        if (this.name === null) {
            warn(interpreter.bus, "No 'name' attribute specified on 'trigger' element.", trigger);
            return;
        }
        
        if (this.event === null) {
            
            warn(interpreter.bus, "No 'event' attribute specified on 'trigger' element '" +
                this.name + "'.", trigger);
            
            return;
        }
        
        if (this.special === null && this.fnName === null && this.scene === null) {
            
            warn(interpreter.bus, "No suitable action or function found for trigger element '" +
                this.name + "'.", trigger);
            
            return;
        }
        
        if (this.scene) {
            
            fn = function () {
                commands.sub(trigger, interpreter);
                interpreter.index = 0;
                interpreter.currentElement = 0;
                interpreter.next();
            };
        }
        
        this.isKeyEvent = false;
        this.key = null;
        
        if (this.special !== null && this.special !== "next") {
            
            warn(interpreter.bus, "Unknown special specified on trigger element '" +
                this.name + "'.", trigger);
            
            return;
        }
        
        if (this.special === "next") {
            
            fn = function () {
                
                if (self.interpreter.state === "pause" || self.interpreter.waitCounter > 0) {
                    return;
                }
                
                self.interpreter.next();
            };
        }
        
        if (this.fnName !== null) {
            
            if (typeof functions[this.fnName] !== "function") {
                
                warn(interpreter.bus, "Unknown function specified on trigger element '" +
                    this.name + "'.", trigger);
                
                return;
            }
            
            fn = function () {
                functions[self.fnName](self.interpreter, trigger);
            };
        }
        
        switch (this.event) {
            
            case "keyup":
            case "keydown":
            case "keypress":
                
                this.isKeyEvent = true;
                this.key = trigger.getAttribute("key") || null;
                
                if (this.key === null) {
                    
                    warn(interpreter.bus, "No 'key' attribute specified on trigger element '" +
                        this.name + "'.", trigger);
                    
                    return;
                }
                
                if (
                    typeof interpreter.game.keys.keys[this.key] === "undefined" ||
                    interpreter.game.keys.keys[this.key] === null
                ) {
                    
                    warn(interpreter.bus, "Unknown key '" + this.key + "' specified on trigger " +
                        "element '" + this.name + "'.", trigger);
                    
                    return;
                }
                
                this.fn = function (data) {
                    
                    if (data.keys[self.key].kc !== data.event.keyCode) {
                        return;
                    }
                    
                    if (interpreter.keysDisabled > 0) {
                        return;
                    }
                    
                    fn();
                };
                
                return;
                
            default:
                this.fn = fn;
        }
    }
    
    Trigger.prototype.activate = function () {
        
        if (this.isSubscribed === true) {
            return;
        }
        
        this.interpreter.bus.subscribe(this.fn, this.event);
        this.isSubscribed = true;
    };
    
    Trigger.prototype.deactivate = function () {
        
        if (this.isSubscribed === false) {
            return;
        }
        
        this.interpreter.bus.unsubscribe(this.fn, this.event);
        this.isSubscribed = false;
    };
    
    return Trigger;
    
});


/* global using */
/* eslint no-console: off */

using(
    "databus",
    "easy-ajax",
    "WSE.Keys",
    "WSE.Interpreter",
    "WSE.tools",
    "WSE",
    "WSE.loader"
).
define("WSE.Game", function (DataBus, ajax, Keys, Interpreter, tools, WSE, loader) {
    
    "use strict";
    
    /**
     * Constructor used to create instances of games.
     * 
     * You can configure the game instance using the config object
     * that can be supplied as a parameter to the constructor function.
     * 
     * The options are:
     *  - url: [string] The URL of the WebStory file.
     *  - debug: [bool] Should the game be run in debug mode? (not used yet)
     *  - host: [object] The HOST object for the LocalContainer 
     *      version. Optional.
     * 
     * @event wse.game.constructor@WSE.bus
     * @param args A config object. See above for details.
     */
    function Game (args) {
        
        var host;
        
        WSE.instances.push(this);
        
        WSE.trigger("wse.game.constructor", {args: args, game: this});
        
        args = args || {};
        this.bus = new DataBus();
        this.url = args.url || "game.xml";
        this.gameId = args.gameId || null;
        this.ws = null;
        this.debug = args.debug === true ? true : false;
        
        host = args.host || false;
        this.host = host;
        
        if (this.gameId) {
            loader.generateFromString(
                document.getElementById(this.gameId).innerHTML,
                this.load.bind(this)
            );
        }
        else {
            if (host) {
                loader.generateFromString(host.get(this.url), this.load.bind(this));
            }
            else {
                loader.generateGameFile(this.url, this.load.bind(this));
            }
        }
        
        this.interpreter = new Interpreter(this, {
            datasource: args.datasource
        });
        
        this.keys = new Keys();
        this.listenersSubscribed = false;
        //console.log("this.interpreter: ", this.interpreter);
        
        this.bus.subscribe(
            function (data) {
                console.log("Message: " + data);
            }, 
            "wse.interpreter.message"
        );
        
        this.bus.subscribe(
            function (data) {
                console.log("Error: " + data.message);
            }, 
            "wse.interpreter.error"
        );
        
        this.bus.subscribe(
            function (data) {
                console.log("Warning: " + data.message, data.element);
            }, 
            "wse.interpreter.warning"
        );
    }
    
    /**
     * Loads the WebStory file using the AJAX function and triggers
     * the game initialization.
     */
    Game.prototype.load = function (gameDocument) {
        this.ws = gameDocument;
        this.init();
    };
    
    Game.prototype.loadFromUrl = function (url) {
        
        //console.log("Loading game file...");
        var fn, self;
        
        this.url = url || this.url;
        
        self = this;
        
        fn = function (obj) {
            self.ws = obj.responseXML;
            //console.log("Response XML: " + obj.responseXML);
            self.init();
        };
        
        ajax.get(this.url, null, fn);
        
    };
    
    /**
     * Initializes the game instance.
     */
    Game.prototype.init = function () {
        
        var ws, stage, stageElements, stageInfo, width, height, id, alignFn, resizeFn;
        
        ws = this.ws;
        
        (function () {
            
            var parseErrors = ws.getElementsByTagName("parsererror");
            
            console.log("parsererror:", parseErrors);
            
            if (parseErrors.length) {
                document.body.innerHTML = "" +
                    '<div class="parseError">'+
                        "<h1>Cannot parse WebStory file!</h3>" +
                        "<p>Your WebStory file is mal-formed XML and contains these errors:</p>" +
                        '<pre class="errors">' + parseErrors[0].innerHTML + '</pre>' +
                    '</div>';
                throw new Error("Can't parse game file, not well-formed XML:", parseErrors[0]);
            }
        }());
        
        try {
            stageElements = ws.getElementsByTagName("stage");
        }
        catch (e) {
            console.log(e);
        }
        
        width = "800px";
        height = "480px";
        id = "Stage";
        
        if (!stageElements || stageElements.length < 1) {
            throw new Error("No stage definition found!");
        }
        
        stageInfo = stageElements[0];
        width = stageInfo.getAttribute("width") || width;
        height = stageInfo.getAttribute("height") || height;
        id = stageInfo.getAttribute("id") || id;
        
        // Create the stage element or inject into existing one?
        if (stageInfo.getAttribute("create") === "yes") {
            stage = document.createElement("div");
            stage.setAttribute("id", id);
            document.body.appendChild(stage);
        }
        else {
            stage = document.getElementById(id);
        }
        
        stage.setAttribute("class", "WSEStage");
        
        stage.style.width = width;
        stage.style.height = height;
        
        // Aligns the stage to be always in the center of the browser window.
        // Must be specified in the game file.
        alignFn = function () {
            
            var dim = tools.getWindowDimensions();
            
            stage.style.left = (dim.width / 2) - (parseInt(width, 10) / 2) + 'px';
            stage.style.top = (dim.height / 2) - (parseInt(height, 10) / 2) + 'px';
        };
        
        if (stageInfo.getAttribute("center") === "yes") {
            window.addEventListener('resize', alignFn);
            alignFn();
        }
        
        // Resizes the stage to fit the browser window dimensions. Must be
        // specified in the game file.
        resizeFn = function () {
            console.log("Resizing...");
            tools.fitToWindow(stage, parseInt(width, 10), parseInt(height, 10));
        };
        
        if (stageInfo.getAttribute("resize") === "yes") {
            window.addEventListener('resize', resizeFn);
            resizeFn();
        }
        
        this.stage = stage;
        //     stage.onclick = function() { self.interpreter.next(); };
        
        this.applySettings();
        
        // This section only applies when the engine is used inside
        // the local container app.
        if (this.host) {
            
            this.host.window.width = parseInt(width, 10);
            this.host.window.height = parseInt(height, 10);
            
            (function (self) {
                
                var doResize = self.getSetting("host.stage.resize") === "true" ? true : false;
                
                if (!doResize) {
                    return;
                }
                
                window.addEventListener("resize", function () {
                    console.log("Resizing...");
                    tools.fitToWindow(stage, parseInt(width, 10), parseInt(height, 10));
                });
            }(this));
        }
    };
    
    /**
     * Returns the value of a setting as specified in the WebStory file.
     * @param name [string] The name of the setting.
     * @return [mixed] The value of the setting or null.
     */
    Game.prototype.getSetting = function (name) {
        
        var ret, settings, i, len, cur, curName;
        
        settings = this.ws.getElementsByTagName("setting");
        
        for (i = 0, len = settings.length; i < len; i += 1) {
            
            cur = settings[i];
            curName = cur.getAttribute("name") || null;
            
            if (curName !== null && curName === name) {
                ret = cur.getAttribute("value") || null;
                return ret;
            }
        }
        
        return null;
    };
    
    // FIXME: implement...
    Game.prototype.applySettings = function () {
        
        this.webInspectorEnabled =
            this.getSetting("host.inspector.enable") === "true" ? true : false;
        
        if (this.host) {
            
            if (this.webInspectorEnabled === true) {
                this.host.inspector.show();
            }
        }
    };
    
    /**
     * Use this method to start the game. The WebStory file must have
     * been successfully loaded for this to work.
     */
    Game.prototype.start = function () {
        
        var fn, contextmenu_proxy, self;
        
        self = this;
        
        if (this.ws === null) {
            
            return setTimeout(
                function () {
                    self.start();
                }
            );
        }
        
        // Listener that sets the interpreter's state machine to the next state
        // if the current state is not pause or wait mode.
        // This function gets executed when a user clicks on the stage.
        fn = function () {
            
            if (self.interpreter.state === "pause" || self.interpreter.waitCounter > 0) {
                return;
            }
            
            //console.log("Next triggered by user...");
            self.interpreter.next(true);
        };
        
        contextmenu_proxy = function (e) {
            
            self.bus.trigger("contextmenu", {});
            
            // let's try to prevent real context menu showing
            if (e && typeof e.preventDefault === "function") {
                e.preventDefault();
            }
            
            return false;
        };
        
        this.subscribeListeners = function () {
            
            this.stage.addEventListener('contextmenu', contextmenu_proxy);
            this.stage.addEventListener('click', fn);
            
            this.listenersSubscribed = true;
        };
        
        this.unsubscribeListeners = function () {
            
            this.stage.removeEventListener('contextmenu', contextmenu_proxy);
            this.stage.removeEventListener('click', fn);
            
            this.listenersSubscribed = false;
        };
        
        this.interpreter.start();
    };
    
    return Game;
    
});


/* global using */
/* eslint no-console: off */

using(
    "WSE.dataSources.LocalStorage",
    "WSE.Trigger",
    "WSE.tools",
    "WSE.tools.ui",
    "WSE",
    "WSE.tools::logError",
    "WSE.tools::warn",
    "WSE.LoadingScreen",
    "WSE.tools::getSerializedNodes",
    "enjoy-core::each",
    "enjoy-core::find",
    "enjoy-typechecks::isUndefined",
    "enjoy-typechecks::isNull",
    "WSE.savegames"
).
define("WSE.Interpreter", function (
    LocalStorageSource,
    Trigger,
    tools,
    ui,
    WSE,
    logError,
    warn,
    LoadingScreen,
    getSerializedNodes,
    each,
    find,
    isUndefined,
    isNull,
    savegames
) {
    
    "use strict";
    
    /**
     * Constructor to create an instance of the engine's interpreter.
     * Each game has it's own interpreter instance. The interpreter
     * reads the information in the WebStory file and triggers the execution
     * of the appropriate commands.
     * 
     * @event
     * @param game [object] The WSE.Game instance the interpreter belongs to.
     */
    function Interpreter (game, options) {
        
        var datasource, key;
        
        WSE.trigger("wse.interpreter.constructor", {game: game, interpreter: this});
        
        this.game = game;
        this.assets = {};
        
        /** @var Index of the currently examined element inside the active scene. */
        this.index = 0;
        this.visitedScenes = [];
        
        /** @var A text log of everything that has been shown on text boxes. */
        this.log = [];
        this.waitForTimer = false;
        
        /** @var Number of assets that are currently being fetched from the server. */
        this.assetsLoading = 0;
        
        /** @var Total number of assets to load. */
        this.assetsLoadingMax = 0;
        
        /** @var Number of assets already fetched from the server. */
        this.assetsLoaded = 0;
        
        /** @var The timestamp from when the game starts. Used for savegames. */
        this.startTime = 0;
        
        /** @var Holds 'normal' variables. These are only remembered for the current route. */
        this.runVars = {};
        
        /** @var The call stack for sub scenes. */
        this.callStack = [];
        this.keysDisabled = 0; // if this is > 0, key triggers should be disabled
        
        /** @var The current state of the interpreter's state machine. 
         *   'listen' means that clicking on the stage or going to the next line
         *   is possible. 
         */
        this.state = "listen";
        
        /** @var All functions that require the interpreter's state machine
         *   to wait. The game will only continue when this is set to 0.
         *   This can be used to prevent e.g. that the story continues in
         *   the background while a dialog is displayed in the foreground.
         */
        this.waitCounter = 0;
        
        /** @var Should the game be run in debug mode? */
        this.debug = game.debug === true ? true : false;

        // The datasource to use for saving games and global variables.
        // Hardcoded to localStorage for now.
        datasource = options.datasource || new LocalStorageSource();
        this.datasource = datasource;
        
        // Each game must have it's own unique storage key so that multiple
        // games can be run on the same web page.
        key = "wse_globals_" + location.pathname + "_" + this.game.url + "_";
        
        /** @var Stores global variables. That is, variables that will
         *   be remembered independently of the current state of the game.
         *   Can be used for unlocking hidden features after the first
         *   playthrough etc.
         */
        this.globalVars = {
            
            set: function (name, value) {
                datasource.set(key + name, value);
            },
            
            get: function (name) {
                return datasource.get(key + name);
            },
            
            has: function (name) {
                
                if (isNull(datasource.get(key + name))) {
                    return false;
                }
                
                return true;
            }
        };
        
        this._loadingScreen = new LoadingScreen();
        
        if (this.debug === true) {
            this.game.bus.debug = true;
        }
    }
    
    Interpreter.prototype.start = function () {
        
        var self, fn, makeKeyFn, bus, startTime = Date.now();
        
        this.story = this.game.ws;
        this.stage = this.game.stage;
        this.bus = this.game.bus;
        this.index = 0;
        this.currentElement = 0;
        this.sceneId = null;
        this.scenePath = [];
        this.currentCommands = [];
        this.wait = false;
        this.startTime = Math.round(+new Date() / 1000);
        this.stopped = false;
        
        self = this;
        bus = this.bus;
        
        this._startLoadingScreen();
        
        // Adds location info to warnings and errors.
        fn = function (data) {
            
            var section, element, msg;
            
            data = data || {};
            element = data.element || null;
            section = null;
            
            if (element !== null) {
                
                try {
                    section = data.element.tagName === "asset" ? "assets" : null;
                    section = data.element.parent.tagName === "settings" ? "settings" : null;
                }
                catch (e) {
                    // do nothing
                }
            }
            
            section = section || "scenes";
            
            switch (section) {
                case "assets":
                    msg = "         Encountered in section 'assets'.";
                    break;
                case "settings":
                    msg = "         Encountered in section 'settings'.";
                    break;
                default:
                    msg = "         Encountered in scene '" + self.sceneId + "', element " + self.currentElement + ".";
            }
            
            console.log(msg);
        };
        
        bus.subscribe(fn, "wse.interpreter.error");
        bus.subscribe(fn, "wse.interpreter.warning");
        bus.subscribe(fn, "wse.interpreter.message");
        
        bus.subscribe(
            function () {
                console.log("Game over.");
            }, 
            "wse.interpreter.end"
        );
        
        bus.subscribe(
            function () {
                self.numberOfFunctionsToWaitFor += 1;
            }, 
            "wse.interpreter.numberOfFunctionsToWaitFor.increase"
        );
        
        bus.subscribe(
            function () {
                self.numberOfFunctionsToWaitFor -= 1;
            },
            "wse.interpreter.numberOfFunctionsToWaitFor.decrease"
        );
        
        bus.subscribe(
            this._loadingScreen.addItem.bind(this._loadingScreen), 
            "wse.assets.loading.increase"
        );
        
        bus.subscribe(
            this._loadingScreen.itemLoaded.bind(this._loadingScreen), 
            "wse.assets.loading.decrease"
        );
        
        this.buildAssets();
        this.createTriggers();
        
        makeKeyFn = function (type) {
            
            return function (ev) {
                bus.trigger(
                    type,
                    {
                        event: ev,
                        keys: self.game.keys.keys
                    }
                );
            };
        };
        
        this.game.keys.forAll(makeKeyFn("keyup"), "up");
        this.game.keys.forAll(makeKeyFn("keydown"), "down");
        this.game.keys.forAll(makeKeyFn("keypress"), "press");
        
        this.game.subscribeListeners();
        
        this._assetsLoaded = false;
        
        this._loadingScreen.subscribe("finished", function () {
            
            var time = Date.now() - startTime;
            
            if (self._assetsLoaded) {
                return;
            }
            
            self._assetsLoaded = true;
            
            self.callOnLoad();
            
            if (time < 1000) {
                setTimeout(self.runStory.bind(self), 1000 - time);
            }
            else {
                self.runStory();
            }
        });
        
        if (this._loadingScreen.count() < 1) {
            this._assetsLoaded = true;
            this.runStory();
        }
    };
    
    Interpreter.prototype.callOnLoad = function () {
        each(function (asset) {
            if (typeof asset.onLoad === "function") {
                asset.onLoad();
            }
        }, this.assets);
    };
    
    Interpreter.prototype.runStory = function () {
        
        if (this.assetsLoading > 0) {
            setTimeout(this.runStory.bind(this), 100);
            return;
        }
        
        this.bus.trigger("wse.assets.loading.finished");
        this._loadingScreen.hide();
        this.startTime = Math.round(+new Date() / 1000);
        this.changeScene(this.getFirstScene());
    };
    
    Interpreter.prototype.getFirstScene = function () {
        
        var scenes, len, startScene;
        
        scenes = this.story.getElementsByTagName("scene");
        this.scenes = scenes;
        len = scenes.length;
        
        startScene = this.getSceneById("start");
        
        if (startScene !== null) {
            return startScene;
        }
        
        if (len < 1) {
            logError(this.bus, "No scenes found!");
            return null;
        }
        
        return scenes[0];
    };
    
    Interpreter.prototype.changeScene = function (scene) {
        this.changeSceneNoNext(scene);
        this.next();
    };
    
    Interpreter.prototype.changeSceneNoNext = function (scene) {
        
        var len, id, bus = this.bus;
        
        bus.trigger(
            "wse.interpreter.changescene.before",
            {
                scene: scene,
                interpreter: this
            },
            false
        );
        
        if (isUndefined(scene) || isNull(scene)) {
            logError(bus, "Scene does not exist.");
            return;
        }
        
        id = scene.getAttribute("id");
        this.visitedScenes.push(id);
        
        if (isNull(id)) {
            logError(bus, "Encountered scene without id attribute.");
            return;
        }
        
        bus.trigger("wse.interpreter.message", "Entering scene '" + id + "'.");
        
        while (this.scenePath.length > 0) {
            this.popFromCallStack();
        }
        
        this.currentCommands = scene.childNodes;
        len = this.currentCommands.length;
        this.index = 0;
        this.sceneId = id;
        this.scenePath = [];
        this.currentElement = 0;
        
        if (len < 1) {
            warn(bus, "Scene '" + id + "' is empty.", scene);
            return;
        }
        
        this.numberOfFunctionsToWaitFor = 0;
        
        bus.trigger(
            "wse.interpreter.changescene.after",
            {
                scene: scene,
                interpreter: this
            },
            false
        );
    };
    
    Interpreter.prototype.pushToCallStack = function () {
        
        var obj = {};
        
        obj.index = this.index;
        obj.sceneId = this.sceneId;
        obj.scenePath = this.scenePath.slice();
        obj.currentElement = this.currentElement;
        
        this.callStack.push(obj);
    };
    
    Interpreter.prototype.popFromCallStack = function () {
        
        var top = this.callStack.pop(), scenePath = top.scenePath.slice();
        
        this.bus.trigger(
            "wse.interpreter.message", 
            "Returning from sub scene '" + this.sceneId + "' to scene '" + top.sceneId + "'...",
            false
        );
        
        this.index = top.index + 1;
        this.sceneId = top.sceneId;
        this.scenePath = top.scenePath;
        this.currentScene = this.getSceneById(top.sceneId);
        this.currentElement = top.currentElement;
        
        this.currentCommands = this.currentScene.childNodes;
        
        while (scenePath.length > 0) {
            this.currentCommands = this.currentCommands[scenePath.shift()].childNodes;
        }
    };
    
    Interpreter.prototype.getSceneById = function (sceneName) {
        
        var scene = find(function (current) {
            return current.getAttribute("id") === sceneName;
        }, this.scenes);
        
        if (isNull(scene)) {
            warn(this.bus, "Scene '" + sceneName + "' not found!");
        }
        
        return scene;
    };
    
    Interpreter.prototype.next = function (triggeredByUser) {
        
        var nodeName, command, check, self, stopObj, bus = this.bus;
        
        stopObj = {
            stop: false
        };
        
        triggeredByUser = triggeredByUser === true ? true : false;
        
        bus.trigger("wse.interpreter.next.before", this, false);
        
        if (triggeredByUser === true) {
            bus.trigger("wse.interpreter.next.user", stopObj, false);
        }
        
        if (stopObj.stop === true) {
            return;
        }
        
        self = this;
        
        if (this.state === "pause") {
            return;
        }
        
        if (this.waitForTimer === true || (this.wait === true && this.waitCounter > 0)) {
            
            setTimeout(function () { self.next(); }, 0);
            
            return;
        }
        
        if (this.wait === true && this.numberOfFunctionsToWaitFor < 1) {
            this.wait = false;
        }
        
        this.stopped = false;
        
        if (this.cancelCharAnimation) {
            this.cancelCharAnimation();
            this.cancelCharAnimation = null;
            return;
        }
        
        if (this.index >= this.currentCommands.length) {
            
            if (this.callStack.length > 0) {
                
                this.popFromCallStack();
                setTimeout(function () { self.next(); }, 0);
                
                return;
            }
            
            bus.trigger("wse.interpreter.next.after.end", this, false);
            bus.trigger("wse.interpreter.end", this);
            
            return;
        }
        
        command = this.currentCommands[this.index];
        nodeName = command.nodeName;
        
        // ignore text and comment nodes:
        if (nodeName === "#text" || nodeName === "#comment") {
            
            this.index += 1;
            setTimeout(function () { self.next(); }, 0);
            bus.trigger("wse.interpreter.next.ignore", this, false);
            
            return;
        }
        
        bus.trigger("wse.interpreter.next.command", command);
        this.currentElement += 1;
        check = this.runCommand(this.currentCommands[this.index]);
        
        check = check || {};
        check.doNext = check.doNext === false ? false : true;
        check.wait = check.wait === true ? true : false;
        check.changeScene = check.changeScene || null;
        
        if (check.wait === true) {
            this.wait = true;
        }
        
        this.index += 1;
        
        if (check.changeScene !== null) {
            
            this.changeScene(check.changeScene);
            
            return;
        }
        
        if (check.doNext === true) {
            
            setTimeout(function () { self.next(); }, 0);
            bus.trigger("wse.interpreter.next.after.donext", this, false);
            
            return;
        }
        
        this.stopped = true;
        
        bus.trigger("wse.interpreter.next.after.nonext", this, false);
    };
    
    Interpreter.prototype.checkIfvar = function (command) {
        
        var ifvar, ifval, ifnot, varContainer, bus = this.bus;
        
        ifvar = command.getAttribute("ifvar") || null;
        ifval = command.getAttribute("ifvalue");
        ifnot = command.getAttribute("ifnot");
        
        if (ifvar !== null || ifval !== null || ifnot !== null) {
            
            varContainer = this.runVars;
            
            if (!(ifvar in varContainer)) {
                
                warn(bus, "Unknown variable '" + ifvar +
                    "' used in condition. Ignoring command.", command);
                
                bus.trigger(
                    "wse.interpreter.runcommand.after.condition.error.key",
                    {
                        interpreter: this,
                        command: command
                    }, 
                    false
                );
                
                return false;
            }
            
            if (ifnot !== null && ("" + varContainer[ifvar] === "" + ifnot)) {
                
                bus.trigger(
                    "wse.interpreter.message", "Conidition not met. " + ifvar + "==" + ifnot);
                bus.trigger(
                    "wse.interpreter.runcommand.after.condition.false",
                    {
                        interpreter: this,
                        command: command
                    }, 
                    false
                );
                
                return false;
            }
            else if (ifval !== null && ("" + varContainer[ifvar]) !== "" + ifval) {
                
                bus.trigger("wse.interpreter.message", "Conidition not met.");
                bus.trigger(
                    "wse.interpreter.runcommand.after.condition.false",
                    {
                        interpreter: this,
                        command: command
                    }, 
                    false
                );
                
                return false;
            }
            
            bus.trigger(
                "wse.interpreter.runcommand.condition.met",
                {
                    interpreter: this,
                    command: command
                }, 
                false
            );
            
            bus.trigger("wse.interpreter.message", "Conidition met.");
        }
        
        return true;
    };
    
    Interpreter.prototype.runCommand = function (command) {
        
        var tagName, assetName, bus = this.bus;
        
        this.bus.trigger(
            "wse.interpreter.runcommand.before", 
            {
                interpreter: this,
                command: command
            }, 
            false
        );
        
        tagName = command.tagName;
        assetName = command.getAttribute("asset") || null;
        
        if (!this.checkIfvar(command)) {
            return {
                doNext: true
            };
        }
        
        if (tagName in WSE.commands) {
            
            bus.trigger(
                "wse.interpreter.runcommand.after.command",
                {
                    interpreter: this,
                    command: command
                }, 
                false
            );
            
            bus.trigger('game.commands.' + tagName);
            
            return WSE.commands[tagName](command, this);
        }
        else if (
            assetName !== null &&
            assetName in this.assets &&
            typeof this.assets[assetName][tagName] === "function" &&
            tagName.match(/(show|hide|clear|flicker|flash|play|start|stop|pause|move|shake|set|tag)/)
        ) {
            
            bus.trigger('game.assets.' + assetName + '.' + tagName);
            
            return this.assets[assetName][tagName](command, this);
        }
        else {
            
            warn(bus, "Unknown element '" + tagName + "'.", command);
            
            bus.trigger(
                "wse.interpreter.runcommand.after.error",
                {
                    interpreter: this,
                    command: command
                }, 
                false
            );
            
            return {
                doNext: true
            };
        }
    };
    
    Interpreter.prototype.createTriggers = function () {
        
        var triggers, curName, curTrigger, bus = this.bus;
        var interpreter = this;
        
        bus.trigger("wse.interpreter.triggers.create", this, false);
        
        this.triggers = {};
        
        try {
            triggers = this.game.ws.getElementsByTagName("triggers")[0].
                getElementsByTagName("trigger");
        }
        catch (e) {
            console.log(e);
            return;
        }
        
        each(function (cur) {
            
            curName = cur.getAttribute("name") || null;
            
            if (curName === null) {
                warn(bus, "No name specified for trigger.", cur);
                return;
            }
            
            if (typeof interpreter.triggers[curName] !== "undefined" &&
                    interpreter.triggers[curName] !== null) {
                warn(bus, "A trigger with the name '" + curName +
                    "' already exists.", cur);
                return;
            }
            
            curTrigger = new Trigger(cur, interpreter);
            
            if (typeof curTrigger.fn === "function") {
                interpreter.triggers[curName] = curTrigger;
            }
            
        }, triggers);
        
    };
    
    Interpreter.prototype.buildAssets = function () {
        
        var assets, bus = this.bus;
        
        bus.trigger("wse.assets.loading.started");
        
        try {
            assets = this.story.getElementsByTagName("assets")[0].childNodes;
        }
        catch (e) {
            logError(bus, "Error while creating assets: " + e.getMessage());
        }
        
        each(function (asset) {
            
            if (asset.nodeType !== 1) {
                return;
            }
            
            this.createAsset(asset);
            
        }.bind(this), assets);
        
    };
    
    Interpreter.prototype.createAsset = function (asset) {
        
        var name, assetType, bus = this.bus;
        
        bus.trigger(
            "wse.interpreter.createasset",
            {
                interpreter: this,
                asset: asset
            }, 
            false
        );
        
        name = asset.getAttribute("name");
        assetType = asset.tagName;
        
        if (name === null) {
            logError(bus, "Expected attribute 'name'.", asset);
            return;
        }
        
        if (assetType === null) {
            warn(bus, "Expected attribute 'type' on asset '" + name + "'.", asset);
            return;
        }
        
        if (typeof this.assets[name] !== "undefined") {
            warn(bus, "Trying to override existing asset '" + name + "'.", asset);
        }
        
        assetType = tools.firstLetterUppercase(assetType);
        
        if (assetType in WSE.assets) {
            this.assets[name] = new WSE.assets[assetType](asset, this);
            return;
        }
        else {
            warn(bus, "Unknown asset type '" + assetType + "'.", asset);
            return;
        }
    };
    
    Interpreter.prototype.toggleSavegameMenu = function () {
        
        var menu, deleteButton, loadButton, saveButton, self;
        var saves, buttonPanel, resumeButton, id, sgList;
        var curEl, listenerStatus, curElapsed, oldState;
        
        self = this;
        id = "WSESaveGameMenu_" + this.game.url;
        listenerStatus = this.game.listenersSubscribed;
        
        menu = document.getElementById(id) || null;
        
        if (menu !== null) {
            
            try {
                
                listenerStatus =
                    menu.getAttribute("data-wse-listener-status") === "true" ? true : false;
                this.stage.removeChild(menu);
            }
            catch (e) {
                console.log(e);
            }
            
            if (listenerStatus === true) {
                this.savegameMenuVisible = false;
            }
            
            this.state = this.oldStateInSavegameMenu;
            this.waitCounter -= 1;
            
            return;
        }
        
        if (this.stopped !== true) {
            
            setTimeout(function () { self.toggleSavegameMenu(); }, 20);
            
            return;
        }
        
        oldState = this.state;
        this.oldStateInSavegameMenu = oldState;
        this.state = "pause";
        this.waitCounter += 1;
        this.savegameMenuVisible = true;
        
        menu = document.createElement("div");
        menu.innerHTML = "";
        menu.setAttribute("id", id);
        menu.setAttribute("class", "WSESavegameMenu");
        menu.setAttribute("data-wse-remove", "true");
        menu.setAttribute("data-wse-listener-status", listenerStatus);
        menu.style.zIndex = 100000;
        menu.style.position = "absolute";
        
        saves = savegames.getSavegameList(this, true);
        
        deleteButton = document.createElement("input");
        deleteButton.setAttribute("class", "button delete");
        deleteButton.setAttribute("type", "button");
        deleteButton.value = "Delete";
        
        deleteButton.addEventListener(
            "click",
            function (ev) {
                
                var active, savegameName;
                
                ev.stopPropagation();
                ev.preventDefault();
            
                active = menu.querySelector(".active") || null;
            
                if (active === null) {
                    return;
                }
                
                savegameName = active.getAttribute("data-wse-savegame-name");
                
                function fn (decision) {
                    
                    if (decision === false) {
                        return;
                    }
                    
                    savegames.remove(self, savegameName);
                    self.toggleSavegameMenu();
                    self.toggleSavegameMenu();
                }
                
                ui.confirm(
                    self,
                    {
                        title: "Delete game?",
                        message: "Do you really want to delete savegame '" + savegameName + "'?",
                        callback: fn
                    }
                );
            },
            false
        );
        
        saveButton = document.createElement("input");
        saveButton.setAttribute("class", "button save");
        saveButton.setAttribute("type", "button");
        saveButton.value = "Save";
        
        saveButton.addEventListener(
            "click",
            function (ev) {
                
                var active, savegameName;
                
                ev.stopPropagation();
                ev.preventDefault();
                
                active = menu.querySelector(".active") || null;
                
                if (active === null) {
                    
                    ui.prompt(
                        self,
                        {
                            title: "New savegame",
                            message: "Please enter a name for the savegame:",
                            callback: function (data) {
                                
                                if (data === null) {
                                    return;
                                }
                                
                                if (!data) {
                                    
                                    ui.alert(
                                        self,
                                        {
                                            title: "Error",
                                            message: "The savegame name cannot be empty!"
                                        }
                                    );
                                    
                                    return;
                                }
                                
                                self.toggleSavegameMenu();
                                self.game.listenersSubscribed = listenerStatus;
                                savegames.save(self, data);
                                self.toggleSavegameMenu();
                                self.game.listenersSubscribed = false;
                                
                                ui.alert(
                                    self,
                                    {
                                        title: "Game saved",
                                        message: "Your game has been saved."
                                    }
                                );
                            }
                        }
                    );
                    
                    return;
                }
                
                savegameName = active.getAttribute("data-wse-savegame-name");
                
                ui.confirm(
                    self,
                    {
                        title: "Overwrite savegame?",
                        message: "You are about to overwrite an old savegame. Are you sure?",
                        trueText: "Yes",
                        falseText: "No",
                        callback: function (decision) {
                            
                            if (decision === false) {
                                return;
                            }
                            
                            self.toggleSavegameMenu();
                            savegames.save(self, savegameName);
                            self.toggleSavegameMenu();
                            
                            ui.alert(
                                self,
                                {
                                    title: "Game saved",
                                    message: "Your game has been saved."
                                }
                            );
                        }
                    }
                );
            },
            false
        );
        
        loadButton = document.createElement("input");
        loadButton.setAttribute("class", "button load");
        loadButton.setAttribute("type", "button");
        loadButton.setAttribute("tabindex", 1);
        loadButton.value = "Load";
        
        loadButton.addEventListener(
            "click",
            function (ev) {
                
                var active, savegameName, fn;
                
                ev.stopPropagation();
                ev.preventDefault();
                
                active = menu.querySelector(".active") || null;
                
                if (active === null) {
                    return;
                }
                
                savegameName = active.getAttribute("data-wse-savegame-name");
                
                fn = function (decision) {
                    
                    if (decision === false) {
                        return;
                    }
                    
                    self.stage.removeChild(document.getElementById(id));
                    self.savegameMenuVisible = false;
                    self.waitCounter -= 1;
                    self.state = oldState;
                    savegames.load(self, savegameName);
                };
                
                ui.confirm(
                    self,
                    {
                        title: "Load game?",
                        message: "Loading a savegame will discard all unsaved progress. Continue?",
                        callback: fn
                    }
                );
            },
            false
        );
        
        buttonPanel = document.createElement("div");
        buttonPanel.setAttribute("class", "panel");
        resumeButton = document.createElement("input");
        resumeButton.setAttribute("class", "button resume");
        resumeButton.setAttribute("type", "button");
        resumeButton.value = "Resume";
        
        resumeButton.addEventListener(
            "click",
            function (ev) {
                
                ev.stopPropagation();
                ev.preventDefault();
                self.stage.removeChild(document.getElementById(id));
                
                self.bus.trigger(
                    "wse.interpreter.numberOfFunctionsToWaitFor.decrease",
                    null,
                    false
                );
                
                self.savegameMenuVisible = false;
                self.waitCounter -= 1;
                self.state = oldState;
            },
            false
        );
        
        sgList = document.createElement("div");
        sgList.setAttribute("class", "list");
        
        buttonPanel.appendChild(loadButton);
        buttonPanel.appendChild(saveButton);
        buttonPanel.appendChild(deleteButton);
        buttonPanel.appendChild(resumeButton);
        menu.appendChild(buttonPanel);
        
        function makeClickFn (curEl) {
            
            return function (event) {
                
                var old;
                
                event.stopPropagation();
                event.preventDefault();
                
                try {
                    
                    old = sgList.querySelector(".active") || null;
                    
                    if (old !== null) {
                        old.setAttribute("class", old.getAttribute("class").replace(/active/, ""));
                    }
                }
                catch (e) {
                    console.log(e);
                }
                
                curEl.setAttribute("class", curEl.getAttribute("class") + " active");
                loadButton.focus();
            };
        }
        
        curEl = document.createElement("div");
        curEl.setAttribute("class", "button");
        
        each(function (cur) {
            
            curEl = document.createElement("div");
            curElapsed = cur.saveTime - cur.startTime;
            curEl.setAttribute("class", "button");
            curEl.setAttribute("data-wse-savegame-name", cur.name);
            
            curEl.innerHTML = '' + 
                '<p class="name">' + 
                    cur.name + 
                '</p>' + 
                '<p class="description">' + 
                    '<span class="elapsed">' + 
                        parseInt((curElapsed / 60) / 60, 10) + 'h ' + 
                        parseInt((curElapsed / 60) % 60, 10) + 'm ' + 
                        parseInt(curElapsed % 60, 10) + 's' + 
                    '</span>' + 
                    '<span class="date">' + 
                        new Date(cur.saveTime * 1000).toUTCString() + 
                    '</span>' + 
                '</p>';
            
            curEl.addEventListener("click", makeClickFn(curEl, cur), false);
            sgList.appendChild(curEl);
            
        }, saves);
        
        menu.addEventListener(
            "click",
            function (ev) {
                
                var active;
                
                ev.stopPropagation();
                ev.preventDefault();
                active = menu.querySelector(".active") || null;
                
                if (active === null) {
                    return;
                }
                
                active.setAttribute("class", active.getAttribute("class").replace(/active/, ""));
            },
            false
        );
        
        menu.appendChild(sgList);
        
        this.stage.appendChild(menu);
    };
    
    Interpreter.prototype._startLoadingScreen = function () {
        
        var template = this.story.querySelector("loadingScreen");
        
        if (template) {
            this._loadingScreen.setTemplate(getSerializedNodes(template));
        }
        
        this._loadingScreen.show(this.stage);
    };
    
    return Interpreter;
});


/* global using */

using("transform-js::transform", "databus").
define("WSE.LoadingScreen", function (transform, DataBus) {
    
    function LoadingScreen () {
        
        DataBus.inject(this);
        
        this._loading = 0;
        this._loaded = 0;
        this._max = 0;
        this._finished = false;
        
        this._template = '' + 
            '<div class="container">' + 
                '<div class="logo">' +
                    '<img src="assets/images/logo.png"' +
                        'onerror="this.style.display=\'none\'"/>' +
                '</div>' +
                '<div class="heading">' + 
                    '<span id="WSELoadingScreenPercentage">{$progress}%</span>' + 
                    'Loading...' + 
                '</div>' + 
                '<div class="progressBar">' + 
                    '<div class="progress" id="WSELoadingScreenProgress" ' +
                        'style="width: {$progress}%;">' + 
                    '</div>' + 
                '</div>' + 
            '</div>';
        
        this._container = document.createElement("div");
        this._container.setAttribute("id", "WSELoadingScreen");
        this._container.style.zIndex = 10000;
        this._container.style.width = "100%";
        this._container.style.height = "100%";
        
    }
    
    LoadingScreen.prototype.setTemplate = function (template) {
        this._template = template;
    };
    
    LoadingScreen.prototype.addItem = function () {
        
        if (this._finished) {
            return;
        }
        
        this._loading += 1;
        this._max += 1;
        
        this.update();
    };
    
    LoadingScreen.prototype.count = function () {
        return this._max;
    };
    
    LoadingScreen.prototype.itemLoaded = function () {
        
        if (this._finished) {
            return;
        }
        
        if (this._loaded === this._max) {
            return;
        }
        
        this._loading -= 1;
        this._loaded += 1;
        
        if (this._loaded === this._max) {
            this._finished = true;
            this.trigger("finished");
        }
        
        this.update();
    };
    
    LoadingScreen.prototype.update = function () {
        
        var progress;
        
        if (this._loaded > this._max) {
            this._loaded = this._max;
        }
        
        progress = parseInt((this._loaded / this._max) * 100, 10);
        
        if (this._max < 1) {
            progress = 0;
        }
        
        this._container.innerHTML = render(this._template, {
            all: this._max,
            remaining: this._max - this._loaded,
            loaded: this._loaded,
            progress: progress
        });
        
    };
    
    LoadingScreen.prototype.show = function (parent) {
        this._container.style.display = "";
        parent.appendChild(this._container);
        this.update();
    };
    
    LoadingScreen.prototype.hide = function () {
        
        var self = this;
        
        function valFn (v) {
            self._container.style.opacity = v;
        }
        
        function finishFn () {
            self._container.style.display = "none";
            self._container.parentNode.removeChild(self._container);
        }
        
        transform(1, 0, valFn, {
            duration: 500,
            onFinish: finishFn
        });
        
        this._container.style.display = "none";
    };
    
    return LoadingScreen;
    
    function render (template, vars) {
        
        for (var key in vars) {
            template = insertVar(template, key, vars[key]);
        }
        
        return template;
    }
    
    function insertVar (template, name, value) {
        return ("" + template).split("{$" + name + "}").join("" + value);
    }
    
});


/* global using */

using(
    "WSE.tools::warn",
    "WSE.tools::replaceVariables"
).define("WSE.tools.ui", function (warn, replaceVars) {
    
    "use strict";
    
    var KEYCODE_ENTER = 13;
    var KEYCODE_ESCAPE = 27;
    
    var ui = {
        
        confirm: function (interpreter, args) {
            
            var title, message, trueText, falseText, callback, root, dialog;
            var tEl, mEl, yesEl, noEl, container, pause, oldState, doNext;
            
            interpreter.waitCounter += 1;
            
            args = args || {};
            title = args.title || "Confirm?";
            message = args.message || "Do you want to proceed?";
            trueText = args.trueText || "Yes";
            falseText = args.falseText || "No";
            callback = typeof args.callback === "function" ? args.callback : function () {};
            root = args.parent || interpreter.stage;
            pause = args.pause === true ? true : false;
            oldState = interpreter.state;
            doNext = args.doNext === true ? true : false;
            
            if (pause === true) {
                interpreter.state = "pause";
            }
            
            container = document.createElement("div");
            container.setAttribute("class", "WSEUIContainer");
            container.setAttribute("data-wse-remove", "true");
            dialog = document.createElement("div");
            dialog.setAttribute("class", "WSEUIDialog WSEUIConfirm");
            
            tEl = document.createElement("div");
            tEl.innerHTML = title;
            tEl.setAttribute("class", "title");
            
            mEl = document.createElement("div");
            mEl.innerHTML = message;
            mEl.setAttribute("class", "message");
            
            yesEl = document.createElement("input");
            yesEl.setAttribute("value", trueText);
            yesEl.value = trueText;
            yesEl.setAttribute("class", "true button");
            yesEl.setAttribute("type", "button");
            yesEl.addEventListener("click",
            
            function (ev) {
                
                ev.stopPropagation();
                ev.preventDefault();
                root.removeChild(container);
                interpreter.waitCounter -= 1;
                //                     interpreter.keysDisabled -= 1;
                
                if (pause === true) {
                    interpreter.state = oldState;
                }
                
                callback(true);
                
                if (doNext === true) {
                    setTimeout(function () {
                        interpreter.next();
                    }, 0);
                }
            });
            
            noEl = document.createElement("input");
            noEl.setAttribute("value", falseText);
            noEl.value = falseText;
            noEl.setAttribute("class", "false button");
            noEl.setAttribute("type", "button");
            noEl.addEventListener("click",
            
            function (ev) {
                
                ev.stopPropagation();
                ev.preventDefault();
                root.removeChild(container);
                interpreter.waitCounter -= 1;
                
                if (pause === true) {
                    interpreter.state = oldState;
                }
                
                callback(false);
                
                if (doNext === true) {
                    setTimeout(function () {
                        interpreter.next();
                    }, 0);
                }
            });
            
            dialog.appendChild(tEl);
            dialog.appendChild(mEl);
            dialog.appendChild(yesEl);
            dialog.appendChild(noEl);
            container.appendChild(dialog);
            root.appendChild(container);
            
            yesEl.focus();
        },
        
        alert: function (interpreter, args) {
            
            var title, message, okText, callback, root, dialog;
            var tEl, mEl, buttonEl, container, pause, oldState, doNext;
            
            interpreter.waitCounter += 1;
            
            args = args || {};
            title = args.title || "Alert!";
            message = args.message || "Please take notice of this!";
            okText = args.okText || "OK";
            callback = typeof args.callback === "function" ? args.callback : function () {};
            root = args.parent || interpreter.stage;
            pause = args.pause === true ? true : false;
            oldState = interpreter.state;
            doNext = args.doNext === true ? true : false;
            
            if (pause === true) {
                interpreter.state = "pause";
            }
            
            container = document.createElement("div");
            container.setAttribute("class", "WSEUIContainer");
            container.setAttribute("data-wse-remove", "true");
            dialog = document.createElement("div");
            dialog.setAttribute("class", "WSEUIDialog WSEUIConfirm");
            
            tEl = document.createElement("div");
            tEl.innerHTML = title;
            tEl.setAttribute("class", "title");
            
            mEl = document.createElement("div");
            mEl.innerHTML = message;
            mEl.setAttribute("class", "message");
            
            buttonEl = document.createElement("input");
            buttonEl.setAttribute("value", okText);
            buttonEl.value = okText;
            buttonEl.setAttribute("class", "true button");
            buttonEl.setAttribute("type", "button");
            buttonEl.addEventListener("click",
            
            function (ev) {
                
                ev.stopPropagation();
                ev.preventDefault();
                root.removeChild(container);
                interpreter.waitCounter -= 1;
                
                if (pause === true) {
                    interpreter.state = oldState;
                }
                
                callback(true);
                
                if (doNext === true) {
                    setTimeout(function () {
                        interpreter.next();
                    }, 0);
                }
            });
            
            dialog.appendChild(tEl);
            dialog.appendChild(mEl);
            dialog.appendChild(buttonEl);
            container.appendChild(dialog);
            root.appendChild(container);
            
            buttonEl.focus();
        },
        
        prompt: function (interpreter, args) {
            
            var title, message, submitText, cancelText, callback, root, dialog, oldState;
            var tEl, mEl, buttonEl, cancelEl, inputEl, container, pause, doNext;
            var allowEmptyInput, hideCancelButton, prefill;
            
            interpreter.waitCounter += 1;
            
            args = args || {};
            title = args.title || "Input required";
            message = args.message || "Please enter something:";
            submitText = args.submitText || "Submit";
            cancelText = args.cancelText || "Cancel";
            callback = typeof args.callback === "function" ? args.callback : function () {};
            root = args.parent || interpreter.stage;
            pause = args.pause === true ? true : false;
            oldState = interpreter.state;
            doNext = args.doNext === true ? true : false;
            allowEmptyInput = args.allowEmptyInput;
            hideCancelButton = args.hideCancelButton;
            prefill = args.prefill || "";
            
            if (pause === true) {
                interpreter.state = "pause";
            }
            
            container = document.createElement("div");
            container.setAttribute("class", "WSEUIContainer");
            container.setAttribute("data-wse-remove", "true");
            dialog = document.createElement("div");
            dialog.setAttribute("class", "WSEUIDialog WSEUIPrompt");
            
            tEl = document.createElement("div");
            tEl.innerHTML = title;
            tEl.setAttribute("class", "title");
            
            mEl = document.createElement("div");
            mEl.innerHTML = message;
            mEl.setAttribute("class", "message");
            
            inputEl = document.createElement("input");
            inputEl.setAttribute("value", prefill);
            inputEl.value = prefill;
            inputEl.setAttribute("class", "input text");
            inputEl.setAttribute("type", "text");
            
            inputEl.addEventListener("keyup", function (event) {
                
                if (cancelOnEscape()) {
                    return;
                }
                
                if (allowEmptyInput) {
                    submitOnEnter();
                    return;
                }
                
                if (inputEl.value) {
                    buttonEl.disabled = false;
                    submitOnEnter();
                }
                else {
                    buttonEl.disabled = true;
                }
                
                function submitOnEnter () {
                    
                    if (event.keyCode === KEYCODE_ENTER) {
                        buttonEl.click();
                    }
                }
                
                function cancelOnEscape () {
                    
                    if (event.keyCode === KEYCODE_ESCAPE && !hideCancelButton) {
                        cancelEl.click();
                        return true;
                    }
                    
                    return false;
                }
            });
            
            buttonEl = document.createElement("input");
            buttonEl.setAttribute("value", submitText);
            buttonEl.value = submitText;
            buttonEl.setAttribute("class", "submit button");
            buttonEl.setAttribute("type", "button");
            
            if (!allowEmptyInput && !prefill) {
                buttonEl.disabled = true;
            }
            
            buttonEl.addEventListener("click", function (ev) {
                
                var val = inputEl.value;
                
                if (!allowEmptyInput && !val) {
                    return;
                }
                
                ev.stopPropagation();
                ev.preventDefault();
                root.removeChild(container);
                interpreter.waitCounter -= 1;
                
                if (pause === true) {
                    interpreter.state = oldState;
                }
                
                callback(val);
                
                if (doNext === true) {
                    
                    setTimeout(function () {
                        interpreter.next();
                    }, 0);
                }
            });
            
            cancelEl = document.createElement("input");
            cancelEl.setAttribute("value", cancelText);
            cancelEl.value = cancelText;
            cancelEl.setAttribute("class", "cancel button");
            cancelEl.setAttribute("type", "button");
            
            cancelEl.addEventListener("click", function (ev) {
                
                ev.stopPropagation();
                ev.preventDefault();
                root.removeChild(container);
                interpreter.waitCounter -= 1;
                
                if (pause === true) {
                    interpreter.state = oldState;
                }
                
                callback(null);
                
                if (doNext === true) {
                    
                    setTimeout(function () {
                        interpreter.next();
                    }, 0);
                }
            });
            
            dialog.appendChild(tEl);
            dialog.appendChild(mEl);
            dialog.appendChild(inputEl);
            dialog.appendChild(buttonEl);
            
            if (!hideCancelButton) {
                dialog.appendChild(cancelEl);
            }
            
            container.appendChild(dialog);
            root.appendChild(container);
            
            inputEl.focus();
        }
        
    };
    
    ui.makeInputFn = function (type) {
        
        return function (command, interpreter) {
            
            var title, message, container, key, doNext, hideCancelButton, allowEmptyInput;
            var submitText, cancelText, prefill;
            
            title = command.getAttribute("title") || "Input required...";
            message = command.getAttribute("message") || "Your input is required:";
            key = command.getAttribute("var") || null;
            submitText = command.getAttribute("submitText") || "";
            cancelText = command.getAttribute("cancelText") || "";
            prefill = command.getAttribute("prefill") || "";
            
            allowEmptyInput =
                replaceVars(command.getAttribute("allowEmptyInput") || "", interpreter) === "no" ?
                    false :
                    true;
            
            hideCancelButton =
                replaceVars(command.getAttribute("hideCancelButton") || "", interpreter) === "yes" ?
                    true :
                    false;
            
            doNext = replaceVars(command.getAttribute("next") || "", interpreter) === "false" ?
                false :
                true;
            
            if (key !== null) {
                key = replaceVars(key, interpreter);
            }
            
            title = replaceVars(title, interpreter);
            message = replaceVars(message, interpreter);
            cancelText = replaceVars(cancelText, interpreter);
            submitText = replaceVars(submitText, interpreter);
            prefill = replaceVars(prefill, interpreter);
            
            interpreter.bus.trigger("wse.interpreter.commands." + type, command);
            
            if (key === null) {
                warn(interpreter.bus, "No 'var' attribute defined on " + type +
                    " command. Command ignored.", command);
                return {
                    doNext: true
                };
            }
            
            container = interpreter.runVars;
            
            ui[type](
                interpreter,
                {
                    title: title,
                    message: message,
                    pause: true,
                    doNext: doNext,
                    callback: function (decision) {
                        container[key] = "" + decision;
                    },
                    allowEmptyInput: allowEmptyInput,
                    hideCancelButton: hideCancelButton,
                    submitText: submitText,
                    cancelText: cancelText,
                    prefill: prefill
                }
            );
            
            return {
                doNext: true
            };
        };
    };
    
    return ui;
    
});


/*/////////////////////////////////////////////////////////////////////////////////

 MO5.js - JavaScript Library For Building Modern DOM And Canvas Applications

 Copyright (c) 2013 Jonathan Steinbeck
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright
   notice, this list of conditions and the following disclaimer.

 * Redistributions in binary form must reproduce the above copyright
   notice, this list of conditions and the following disclaimer in the
   documentation and/or other materials provided with the distribution.

 * Neither the name MO5.js nor the names of its contributors 
   may be used to endorse or promote products derived from this software 
   without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/////////////////////////////////////////////////////////////////////////////////*/

/* global using, setTimeout */

using("transform-js::transform").define("WSE.tools.reveal", function (transform) {
    
    function reveal (element, args) {
        
        args = args || {};
        
        markCharacters(element);
        hideCharacters(element);
        return revealCharacters(element, args.speed || 50, args.onFinish || null);
    }
    
    return reveal;
    
    
    function revealCharacters (element, speed, then) {
        
        var chars = element.querySelectorAll(".Char");
        var offset = 1000 / (speed || 40);
        var stop = false;
        var timeouts = [];
        var left = chars.length;
        
        then = then || function () {};
        
        [].forEach.call(chars, function (char, i) {
            
            var id = setTimeout(function () {
                
                // Workaround for strange move.js behaviour:
                // Sometimes the last .end() callback doesn't get called, so
                // we set another timeout to correct this mistake if it happens.
                var called = false;
                var duration = 10 * offset;
                
                if (stop) {
                    return;
                }
                
                transform(0, 1, setOpacity, {duration: duration}, end);
                
                setTimeout(end, duration + 2000);
                
                function setOpacity (v) {
                    char.style.opacity = v;
                }
                
                function end () {
                    
                    if (called) {
                        return;
                    }
                    
                    called = true;
                    
                    left -= 1;
                    
                    if (stop) {
                        return;
                    }
                    
                    if (left <= 0) {
                        then();
                    }
                    
                }
                
            }, i * offset);
            
            timeouts.push(id);
        });
        
        function cancel () {
            
            if (stop || left <= 0) {
                return false;
            }
            
            stop = true;
            
            timeouts.forEach(function (id) {
                clearTimeout(id);
            });
            
            [].forEach.call(chars, function (char) {
                char.style.opacity = "1";
            });
            
            then();
            
            return true;
        }
        
        return {
            cancel: cancel
        };
    }
    
    function hideCharacters (element) {
        
        var chars = element.querySelectorAll(".Char");
        
        [].forEach.call(chars, function (char) {
            char.style.opacity = 0;
        });
    }
    
    function markCharacters (element, offset) {
        
        var TEXT_NODE = 3;
        var ELEMENT = 1;
        
        offset = offset || 0;
        
        [].forEach.call(element.childNodes, function (child) {
            
            var text = "", newNode;
            
            if (child.nodeType === TEXT_NODE) {
                
                [].forEach.call(child.textContent, function (char) {
                    text += '<span class="Char" data-char="' + offset + '">' + char + '</span>';
                    offset += 1;
                });
                
                newNode = document.createElement("span");
                
                newNode.setAttribute("class", "CharContainer");
                
                newNode.innerHTML = text;
                
                child.parentNode.replaceChild(newNode, child);
            }
            else if (child.nodeType === ELEMENT) {
                offset = markCharacters(child, offset);
            }
        });
        
        return offset;
    }
    
});


//
// A module containing functions for compiling a simple command language to the old
// WSE command elements.
//

/* global using */

using("xmugly").define("WSE.tools.compile", function (xmugly) {
    
//
// Compiles the new WSE command language to XML elements.
//
    function  compile (text) {
        
        text = xmugly.compile(text, [
            {
                identifier: "@",
                attribute: "asset",
                value: "_"
            },
            {
                identifier: ":",
                attribute: "duration",
                value: "_"
            },
            {
                identifier: "+",
                attribute: "_",
                value: "yes"
            },
            {
                identifier: "-",
                attribute: "_",
                value: "no"
            },
            {
                identifier: "#",
                attribute: "id",
                value: "_"
            },
            {
                identifier: "~",
                attribute: "name",
                value: "_"
            }
        ]);
        
        text = compileSpeech(text);
        
        return text;
    }
    
    return {
        compile: compile
    };
    
    
//
// Compiles "(( c: I say something ))" to <line s="c">I say something</line>''.
//
    function compileSpeech (text) {
        return text.replace(
            /([\s]*)\(\([\s]*([a-zA-Z0-9_-]+):[\s]*((.|[\s])*?)([\s]*)\)\)/g,
            '$1<line s="$2">$3</line>$5'
        );
    }
    
});


/* global using */

using(
    "enjoy-core::each",
    "WSE.tools::warn",
    "enjoy-typechecks::isNull",
    "enjoy-typechecks::isUndefined",
    "WSE"
).
define("WSE.savegames", function (each, warn, isNull, isUndefined, WSE) {
    
    function load (interpreter, name) {
        
        var ds, savegame, scene, sceneId, scenePath, scenes;
        var savegameId, bus = interpreter.bus;
        
        savegameId = buildSavegameId(interpreter, name);
        ds = interpreter.datasource;
        savegame = ds.get(savegameId);
        
        bus.trigger(
            "wse.interpreter.load.before",
            {
                interpreter: interpreter,
                savegame: savegame
            }, 
            false
        );
        
        if (!savegame) {
            warn(bus, "Could not load savegame '" + savegameId + "'!");
            return false;
        }
        
        savegame = JSON.parse(savegame);
        interpreter.stage.innerHTML = savegame.screenContents;
        
        restoreSavegame(interpreter, savegame.saves);
        
        interpreter.startTime = savegame.startTime;
        interpreter.runVars = savegame.runVars;
        interpreter.log = savegame.log;
        interpreter.visitedScenes = savegame.visitedScenes;
        interpreter.index = savegame.index;
        interpreter.wait = savegame.wait;
        interpreter.waitForTimer = savegame.waitForTimer;
        interpreter.currentElement = savegame.currentElement;
        interpreter.callStack = savegame.callStack;
        interpreter.waitCounter = savegame.waitCounter;
        interpreter.state = "listen";
        
        sceneId = savegame.sceneId;
        interpreter.sceneId = sceneId;
        
        scenes = interpreter.story.getElementsByTagName("scene");
        interpreter.scenes = scenes;
        
        scene = find(function (scene) {
            return scene.getAttribute("id") === sceneId;
        }, interpreter.scenes);
        
        if (!scene) {
            
            bus.trigger(
                "wse.interpreter.error",
                {
                    message: "Loading savegame '" + savegameId + "' failed: Scene not found!"
                }
            );
            
            return false;
        }
        
        scenePath = savegame.scenePath;
        interpreter.scenePath = scenePath.slice();
        
        interpreter.currentCommands = scene.childNodes;
        
        while (scenePath.length > 0) {
            interpreter.currentCommands = interpreter.currentCommands[scenePath.shift()].childNodes;
        }
        
        // Re-insert choice menu to get back the DOM events associated with it:
        // Remove savegame menu on load:
        (function (interpreter) {
            
            var index, wseType, com, rem;
            
            each(function (cur) {
                
                if (isUndefined(cur) || isNull(cur)) {
                    return;
                }
                
                wseType = cur.getAttribute("data-wse-type") || "";
                rem = cur.getAttribute("data-wse-remove") === "true" ? true : false;
                
                if (rem === true) {
                    interpreter.stage.removeChild(cur);
                }
                
                if (wseType !== "choice") {
                    return;
                }
                
                index = parseInt(cur.getAttribute("data-wse-index"), 10) || null;
                
                if (index === null) {
                    warn(interpreter.bus, "No data-wse-index found on element.");
                    return;
                }
                
                com = interpreter.currentCommands[index];
                
                if (com.nodeName === "#text" || com.nodeName === "#comment") {
                    return;
                }
                
                interpreter.stage.removeChild(cur);
                WSE.commands.choice(com, interpreter);
                interpreter.waitCounter -= 1;
                
            }, interpreter.stage.getElementsByTagName("*"));
            
        }(interpreter));
        
        bus.trigger(
            "wse.interpreter.load.after",
            {
                interpreter: interpreter,
                savegame: savegame
            }, 
            false
        );
        
        return true;
    }
    
    function save (interpreter, name) {
        
        name = name || "no name";
        
        var savegame, json, key, savegameList, listKey, lastKey, bus = interpreter.bus;
        
        savegame = {};
        
        bus.trigger(
            "wse.interpreter.save.before",
            {
                interpreter: interpreter,
                savegame: savegame
            }, 
            false
        );
        
        savegame.saves = createSavegame(interpreter);
        savegame.startTime = interpreter.startTime;
        savegame.saveTime = Math.round(Date.now() / 1000);
        savegame.screenContents = interpreter.stage.innerHTML;
        savegame.runVars = interpreter.runVars;
        savegame.name = name;
        savegame.log = interpreter.log;
        savegame.visitedScenes = interpreter.visitedScenes;
        savegame.gameUrl = interpreter.game.url;
        savegame.index = interpreter.index;
        savegame.wait = interpreter.wait;
        savegame.waitForTimer = interpreter.waitForTimer;
        savegame.currentElement = interpreter.currentElement;
        savegame.sceneId = interpreter.sceneId;
        savegame.scenePath = interpreter.scenePath;
        savegame.listenersSubscribed = interpreter.game.listenersSubscribed;
        savegame.callStack = interpreter.callStack;
        savegame.waitCounter = interpreter.waitCounter;
        savegame.pathname = location.pathname;
        
        key = buildSavegameId(interpreter, name);
        
        json = JSON.stringify(savegame);
        
        listKey = "wse_" + savegame.pathname + "_" + savegame.gameUrl + "_savegames_list";
        
        savegameList = JSON.parse(interpreter.datasource.get(listKey));
        savegameList = savegameList || [];
        lastKey = savegameList.indexOf(key);
        
        if (lastKey >= 0) {
            savegameList.splice(lastKey, 1);
        }
        
        savegameList.push(key);
        
        try {
            interpreter.datasource.set(key, json);
            interpreter.datasource.set(listKey, JSON.stringify(savegameList));
        }
        catch (e) {
            
            warn(bus, "Savegame could not be created!");
            
            bus.trigger(
                "wse.interpreter.save.after.error",
                {
                    interpreter: interpreter,
                    savegame: savegame
                }, 
                false
            );
            
            return false;
        }
        
        bus.trigger(
            "wse.interpreter.save.after.success",
            {
                interpreter: interpreter,
                savegame: savegame
            }
        );
        
        return true;
    }
    
    function createSavegame (interpreter) {
        
        var saves = {};
        
        each(function (asset, key) {
            
            try {
                saves[key] = asset.save();
            }
            catch (e) {
                console.error("WSE Internal Error: Asset '" + key + 
                    "' does not have a 'save' method!");
            }
            
        }, interpreter.assets);
        
        return saves;
    }
    
    function restoreSavegame (interpreter, saves) {
        
        each(function (asset, key) {
            
            try {
                asset.restore(saves[key]);
            }
            catch (e) {
                console.error(e);
                warn(interpreter.bus, "Could not restore asset state for asset '" + key + "'!");
            }
            
        }, interpreter.assets);
        
    }
    
    function buildSavegameId (interpreter, name) {
        
        var vars = {};
        
        vars.name = name;
        vars.id = "wse_" + location.pathname + "_" + interpreter.game.url + "_savegame_" + name;
        
        interpreter.bus.trigger(
            "wse.interpreter.save.before",
            {
                interpreter: interpreter,
                vars: vars
            }, 
            false
        );
        
        return vars.id;
    }
    
    function getSavegameList (interpreter, reversed) {
        
        var names;
        var out = [];
        var key = "wse_" + location.pathname + "_" + interpreter.game.url + "_savegames_list";
        var json = interpreter.datasource.get(key);
        
        if (json === null) {
            return out;
        }
        
        names = JSON.parse(json);
        out = [];
        
        each(function (name) {
            
            if (reversed === true) {
                out.unshift(JSON.parse(interpreter.datasource.get(name)));
            }
            else {
                out.push(JSON.parse(interpreter.datasource.get(name)));
            }
            
        }, names);
        
        interpreter.bus.trigger(
            "wse.interpreter.getsavegamelist",
            {
                interpreter: interpreter,
                list: out,
                names: names
            }, 
            false
        );
        
        return out;
    }
    
    function remove (interpreter, name) {
        
        var sgs, key, index, json, id;
        
        key = "wse_" + location.pathname + "_" + interpreter.game.url + "_savegames_list";
        json = interpreter.datasource.get(key);
        
        if (json === null) {
            return false;
        }
        
        sgs = JSON.parse(json);
        id = buildSavegameId(interpreter, name);
        index = sgs.indexOf(id);
        
        if (index >= 0) {
            
            sgs.splice(index, 1);
            
            interpreter.datasource.set(
                "wse_" + location.pathname + "_" + interpreter.game.url + "_savegames_list",
                JSON.stringify(sgs)
            );
            
            interpreter.datasource.remove(id);
            
            return true;
        }
        
        return false;
    }
    
    return {
        save: save,
        load: load,
        remove: remove,
        getSavegameList: getSavegameList
    };
    
});


/* global using */

using(
    "transform-js::transform",
    "eases",
    "WSE.tools",
    "WSE.tools::warn",
    "WSE.tools::applyAssetUnits",
    "WSE.tools::extractUnit",
    "WSE.tools::calculateValueWithAnchor"
).
define("WSE.DisplayObject", function (
    transform,
    easing,
    tools,
    warn,
    applyUnits,
    extractUnit,
    anchoredValue
) {
    
    //
    // The prototype for all displayable assets.
    //
    // Set ._boxSizeSelectors to an array containing CSS selectors in your
    // asset if you want the initial position of the asset to be calculated
    // depending on some of its element's children instead of the element's
    // .offsetWidth and .offsetHeight. This can be necessary for assets such
    // as ImagePacks because the asset's element will not have a size until
    // at least some of its children are shown.
    //
    function DisplayObject (asset, interpreter) {
        
        this.stage = interpreter.stage;
        this.bus = interpreter.bus;
        this.name = asset.getAttribute("name");
        this.cssid = asset.getAttribute("cssid") || "wse_imagepack_" + this.name;
        this.interpreter = interpreter;
        this.x = asset.getAttribute("x") || 0;
        this.y = asset.getAttribute("y") || 0;
        this.z = asset.getAttribute("z") || this.z || 0;
        this.xAnchor = asset.getAttribute("xAnchor");
        this.yAnchor = asset.getAttribute("yAnchor");
        this.width = asset.getAttribute("width") || this.width;
        this.height = asset.getAttribute("height") || this.height;
        
        this._createElement();
        
        applyUnits(this, asset);
        
    }
    
    DisplayObject.prototype.onLoad = function () {
        this._calculateBoxSize();
        this._moveToPosition();
    };
    
    DisplayObject.prototype.flash = function flash (command, args) {
        
        var self, duration, element, isAnimation, maxOpacity;
        var visible, parse = tools.getParsedAttribute;
        
        args = args || {};
        self = this;
        duration = +parse(command, "duration", this.interpreter, 500);
        maxOpacity = +parse(command, "opacity", this.interpreter, 1);
        element = args.element || document.getElementById(this.cssid);
        
        if (!element) {
            warn(this.bus, "DOM Element for asset is missing!", command);
            return;
        }
        
        isAnimation = args.animation === true ? true : false;
        visible = (+(element.style.opacity.replace(/[^0-9\.]/, ""))) > 0 ? true : false;
        
        if (!isAnimation) {
            self.interpreter.waitCounter += 1;
        }
        
        transform(
            visible ? maxOpacity : 0,
            visible ? 0 : maxOpacity,
            function (v) {
                element.style.opacity = v;
            },
            {
                duration: duration / 3,
                easing: easing.cubicIn
            },
            function () {
                
                var argsObj;
                
                function tranformFn (v) {
                    element.style.opacity = v;
                }
                
                function finishFn () {
                    if (isAnimation) {
                        return;
                    }
                    
                    self.interpreter.waitCounter -= 1;
                }
                
                argsObj = {
                    duration: (duration / 3) * 2,
                    easing: easing.cubicOut
                };
                
                transform(
                    visible ? 0 : maxOpacity,
                    visible ? maxOpacity : 0,
                    tranformFn,
                    argsObj,
                    finishFn
                );
            }
        );
        
        return {
            doNext: true
        };
    };
    
    DisplayObject.prototype.flicker = function (command, args) {
        
        var self, duration, times, step, element;
        var isAnimation, fn, iteration, maxOpacity, val1, val2, dur1, dur2;
        
        args = args || {};
        self = this;
        duration = command.getAttribute("duration") || 500;
        times = command.getAttribute("times") || 10;
        maxOpacity = command.getAttribute("opacity") || 1;
        element = args.element || document.getElementById(this.cssid);
        step = duration / times;
        iteration = 0;
        
        if (!element) {
            warn(this.bus, "DOM Element for asset is missing!", command);
            return;
        }
        
        if (!(parseInt(element.style.opacity, 10))) {
            val1 = 0;
            val2 = maxOpacity;
            dur1 = step / 3;
            dur2 = dur1 * 2;
        }
        else {
            val2 = 0;
            val1 = maxOpacity;
            dur2 = step / 3;
            dur1 = dur2 * 2;
        }
        
        isAnimation = args.animation === true ? true : false;
        
        if (!isAnimation) {
            self.interpreter.waitCounter += 1;
        }
        
        fn = function () {
            
            iteration += 1;
            
            transform(
                val1,
                val2,
                function (v) {
                    element.style.opacity = v;
                },
                {
                    duration: dur1,
                    easing: easing.quadIn
                },
                function () {
                    
                    transform(
                        val2,
                        val1,
                        function (v) {
                            element.style.opacity = v;
                        },
                        {
                            duration: dur2,
                            easing: easing.quadIn
                        },
                        function () {
                            
                            if (iteration <= times) {
                                setTimeout(fn, 0);
                                return;
                            }
                            
                            if (!isAnimation) {
                                self.interpreter.waitCounter -= 1;
                            }
                        }
                    );
                }
            );
        };
        
        fn();
        
        return {
            doNext: true
        };
    };
    
    DisplayObject.prototype.hide = function (command, args) {
        
        var self, duration, effect, direction, offsetWidth, offsetHeight;
        var ox, oy, to, prop, isAnimation, element, easingType, easingFn, stage;
        var xUnit, yUnit;
        var parse = tools.getParsedAttribute;
        
        args = args || {};
        self = this;
        duration = parse(command, "duration", this.interpreter, 500);
        effect = parse(command, "effect", this.interpreter, "fade");
        direction = parse(command, "direction", this.interpreter, "left");
        isAnimation = args.animation === true ? true : false;
        element = document.getElementById(this.cssid);
        easingType = parse(command, "easing", this.interpreter, "sineEaseOut");
        easingFn = (easing[easingType]) ? 
            easing[easingType] : 
            easing.sineOut;
        stage = this.stage;
        xUnit = this.xUnit || 'px';
        yUnit = this.yUnit || 'px';
        
        if (effect === "slide") {
            
            element.style.opacity = 1;
            
            if (xUnit === '%') {
                ox = element.offsetLeft / (stage.offsetWidth / 100);
                offsetWidth = 100;
            }
            else {
                ox = element.offsetLeft;
                offsetWidth = stage.offsetWidth;
            }
            
            if (yUnit === '%') {
                oy = element.offsetTop / (stage.offsetHeight / 100);
                offsetHeight = 100;
            }
            else {
                oy = element.offsetTop;
                offsetHeight = stage.offsetHeight;
            }
            
            switch (direction) {
                case "left":
                    to = ox - offsetWidth;
                    prop = "left";
                    break;
                case "right":
                    to = ox + offsetWidth;
                    prop = "left";
                    break;
                case "top":
                    to = oy - offsetHeight;
                    prop = "top";
                    break;
                case "bottom":
                    to = oy + offsetHeight;
                    prop = "top";
                    break;
                default:
                    to = ox - offsetWidth;
                    prop = "left";
            }
            
            if (!isAnimation) {
                self.interpreter.waitCounter += 1;
            }
            
            (function () {
                
                var valFn, from, finishFn, options;
                
                valFn = function (v) {
                    element.style[prop] = v + (prop === 'left' ? xUnit : yUnit);
                };
                
                from = (prop === "left" ? ox : oy);
                
                finishFn = function () {
                    
                    if (!isAnimation) {
                        self.interpreter.waitCounter -= 1;
                    }
                    
                    element.style.opacity = 0;
                    
                    switch (direction) {
                        case "left":
                        case "right":
                            element.style.left = ox + xUnit;
                            prop = "left";
                            break;
                        case "top":
                        case "bottom":
                            element.style.top = oy + yUnit;
                            prop = "top";
                            break;
                        default:
                            element.style.left = ox + xUnit;
                            prop = "left";
                    }
                };
                
                options = {
                    duration: duration,
                    easing: easingFn
                };
                
                transform(from, to, valFn, options, finishFn);
            }());
        }
        else {
            
            if (!isAnimation) {
                self.interpreter.waitCounter += 1;
            }
            
            (function () {
                
                var valFn, options, finishFn;
                
                valFn = function (v) {
                    element.style.opacity = v;
                };
                
                finishFn = function () {
                    
                    if (!isAnimation) {
                        self.interpreter.waitCounter -= 1;
                    }
                    
                    element.style.opacity = 0;
                };
                
                options = {
                    duration: duration,
                    easing: easingFn
                };
                
                transform(1, 0, valFn, options, finishFn);
            }());
        }
        
        return {
            doNext: true
        };
    };
    
    DisplayObject.prototype.move = function (command, args) {
        
        var x, y, z, element, self, xUnit, yUnit, duration, easingType;
        var easingFn, isAnimation, ox, oy, stage;
        var xAnchor, yAnchor, interpreter = this.interpreter;
        var offsetLeft, offsetTop, oldElementDisplayStyle;
        
        args = args || {};
        self = this;
        element = document.getElementById(this.cssid);
        
        x = command.getAttribute("x");
        y = command.getAttribute("y");
        z = command.getAttribute("z");
        
        xAnchor = command.getAttribute("xAnchor") || "0";
        yAnchor = command.getAttribute("yAnchor") || "0";
        
        if (xAnchor === null && this.xAnchor !== null) {
            xAnchor = this.xAnchor;
        }
        
        if (yAnchor === null  && this.yAnchor !== null) {
            yAnchor = this.yAnchor;
        }
        
        x = tools.replaceVariables(x, this.interpreter);
        y = tools.replaceVariables(y, this.interpreter);
        z = tools.replaceVariables(z, this.interpreter);
        xAnchor = tools.replaceVariables(xAnchor, this.interpreter);
        yAnchor = tools.replaceVariables(yAnchor, this.interpreter);
        
        duration = tools.getParsedAttribute(command, "duration", interpreter, 500);
        easingType = tools.getParsedAttribute(command, "easing", interpreter, "sineEaseOut");
        
        easingFn = (easing[easingType]) ? 
            easing[easingType] : 
            easing.sineOut;
        
        isAnimation = args.animation === true ? true : false;
        stage = this.interpreter.stage;
        
        offsetLeft = element.offsetLeft;
        offsetTop = element.offsetTop;
        
        if (x !== null) {
            xUnit = tools.extractUnit(x) || "px";
            x = parseInt(x, 10);
        }
        
        if (y !== null) {
            yUnit = tools.extractUnit(y) || "px";
            y = parseInt(y, 10);
        }
        
        oldElementDisplayStyle = element.style.display;
        element.style.display = "";
        
        if (xUnit === "%") {
            x = (stage.offsetWidth / 100) * x;
            xUnit = "px";
        }
        
        if (yUnit === "%") {
            y = (stage.offsetHeight / 100) * y;
            yUnit = "px";
        }
        
        x = tools.calculateValueWithAnchor(x, xAnchor, element.offsetWidth);
        y = tools.calculateValueWithAnchor(y, yAnchor, element.offsetHeight);
        
        element.style.display = oldElementDisplayStyle;
        
        if (x === null && y === null && z === null) {
            warn(this.bus, "Can't apply command 'move' to asset '" + 
                this.name + "' because no x, y or z position " +
                "has been supplied.", command);
        }
        
        if (x !== null) {
            
            if (xUnit === '%') {
                ox = offsetLeft / (stage.offsetWidth / 100);
            }
            else {
                ox = offsetLeft;
            }
            
            if (!isAnimation) {
                self.interpreter.waitCounter += 1;
            }
            
            transform(
                ox,
                x,
                function (v) {
                    element.style.left = v + xUnit;
                },
                {
                    duration: duration,
                    easing: easingFn
                },
                function () {
                    if (!isAnimation) {
                        self.interpreter.waitCounter -= 1;
                    }
                }
            );
        }
        
        if (y !== null) {
            
            if (yUnit === '%') {
                oy = offsetTop / (stage.offsetHeight / 100);
            }
            else {
                oy = offsetTop;
            }
            
            if (!isAnimation) {
                self.interpreter.waitCounter += 1;
            }
            
            transform(
                oy,
                y,
                function (v) {
                    element.style.top = v + yUnit;
                },
                {
                    duration: duration,
                    easing: easingFn
                },
                function () {
                    if (!isAnimation) {
                        self.interpreter.waitCounter -= 1;
                    }
                }
            );
        }
        
        if (z !== null) {
            
            if (!isAnimation) {
                self.interpreter.waitCounter += 1;
            }
            
            transform(
                element.style.zIndex || 0,
                parseInt(z, 10),
                function (v) {
                    element.style.zIndex = v;
                },
                {
                    duration: duration,
                    easing: easingFn
                },
                function () {
                    if (!isAnimation) {
                        self.interpreter.waitCounter -= 1;
                    }
                }
            );
        }
        
        this.bus.trigger("wse.assets.mixins.move", this);
        
        return {
            doNext: true
        };
    };
    
    DisplayObject.prototype.shake = function (command) {
        
        var dx, dy, element, self, xUnit, yUnit, duration, period;
        var ox, oy, stage;
        
        self = this;
        element = document.getElementById(this.cssid);
        dx = command.getAttribute("dx");
        dy = command.getAttribute("dy");
        period = command.getAttribute("period") || 50;
        duration = command.getAttribute("duration") || 275;
        stage = this.interpreter.stage;
        
        if (dx === null && dy === null) {
            dy = "-10px";
        }
        
        if (dx !== null) {
            xUnit = tools.extractUnit(dx);
            dx = parseInt(dx, 10);
        }
        
        if (dy !== null) {
            yUnit = tools.extractUnit(dy);
            dy = parseInt(dy, 10);
        }
        
        function easing (d, t) {
            
            var x = t / period;
            
            while (x > 2.0) {
                x -= 2.0;
            }
            
            if  (x > 1.0) {
                x = 2.0 - x;
            }
            
            return x;
        }
        
        if (dx !== null) {
            
            if (xUnit === '%') {
                ox = element.offsetLeft / (stage.offsetWidth / 100);
            }
            else {
                ox = element.offsetLeft;
            }
            
            self.interpreter.waitCounter += 1;
            
            transform(
                ox - dx,
                ox + dx,
                function (v) {
                    element.style.left = v + xUnit;
                },
                {
                    duration: duration,
                    easing:   easing
                }
            ).
            then(function () {
                element.style.left = ox + xUnit;
                self.interpreter.waitCounter -= 1;
            });
        }
        
        if (dy !== null) {
            
            if (yUnit === '%') {
                oy = element.offsetTop / (stage.offsetHeight / 100);
            }
            else {
                oy = element.offsetTop;
            }
            
            self.interpreter.waitCounter += 1;
            
            transform(
                oy - dy,
                oy + dy,
                function (v) {
                    element.style.top = v + yUnit;
                },
                {
                    duration: duration,
                    easing:   easing
                },
                function () {
                    element.style.top = oy + yUnit;
                    self.interpreter.waitCounter -= 1;
                }
            );
        }
        
        this.bus.trigger("wse.assets.mixins.shake", this);
        
        return {
            doNext: true
        };
    };
    
    DisplayObject.prototype.show = function (command, args) {
        
        var duration, effect, direction, ox, oy, prop, xUnit, yUnit;
        var stage, element, isAnimation, easingFn, easingType, interpreter;
        var offsetWidth, offsetHeight, startX, startY;
        var parse = tools.getParsedAttribute;
        
        args = args || {};
        duration = parse(command, "duration", this.interpreter, 500);
        effect = parse(command, "effect", this.interpreter, "fade");
        direction = parse(command, "direction", this.interpreter, "right");
        element = args.element || document.getElementById(this.cssid);
        xUnit = this.xUnit || 'px';
        yUnit = this.yUnit || 'px';
        
        if (!element) {
            warn(this.bus, "DOM Element for asset is missing!", command);
            return;
        }
        
        interpreter = args.interpreter || this.interpreter;
        stage = args.stage || this.stage;
        easingType = parse(command, "easing", this.interpreter, "sineOut");
        easingFn = (easing[easingType]) ? 
            easing[easingType] : 
            easing.sineOut;
        isAnimation = args.animation === true ? true : false;
        
        if (effect === "slide") {
            
            if (xUnit === '%') {
                ox = element.offsetLeft / (stage.offsetWidth / 100);
                offsetWidth = 100;
            }
            else {
                ox = element.offsetLeft;
                offsetWidth = stage.offsetWidth;
            }
            
            if (yUnit === '%') {
                oy = element.offsetTop / (stage.offsetHeight / 100);
                offsetHeight = 100;
            }
            else {
                oy = element.offsetTop;
                offsetHeight = stage.offsetHeight;
            }
            
            switch (direction) {
                case "left":
                    element.style.left = ox + offsetWidth + xUnit;
                    prop = "left";
                    break;
                case "right":
                    element.style.left = ox - offsetWidth + xUnit;
                    prop = "left";
                    break;
                case "top":
                    element.style.top = oy + offsetHeight + yUnit;
                    prop = "top";
                    break;
                case "bottom":
                    element.style.top = oy - offsetHeight + yUnit;
                    prop = "top";
                    break;
                default:
                    element.style.left = ox - offsetWidth + xUnit;
                    prop = "left";
                    break;
            }
            
            element.style.opacity = 1;
            
            if (!isAnimation) {
                interpreter.waitCounter += 1;
            }
            
            if (xUnit === '%') {
                startX = element.offsetLeft / (stage.offsetWidth / 100);
            } 
            else {
                startX = element.offsetLeft;
            }
            
            if (yUnit === '%') {
                startY = element.offsetTop / (stage.offsetHeight / 100);
            } 
            else {
                startY = element.offsetTop;
            }
            
            transform(
                (prop === "left" ? startX : startY), 
                (prop === "left" ? ox : oy),
                function (v) {
                    element.style[prop] = v + (prop === 'left' ? xUnit : yUnit);
                }, 
                {
                    duration: duration,
                    easing: easingFn
                },
                function () {
                    if (!isAnimation) {
                        interpreter.waitCounter -= 1;
                    }
                }
            );
        }
        else {
            
            if (!isAnimation) {
                interpreter.waitCounter += 1;
            }
            
            transform(
                0,
                1,
                function (v) {
                    element.style.opacity = v;
                },
                {
                    duration: duration,
                    easing: easingFn
                },
                function () {
                    if (!isAnimation) {
                        interpreter.waitCounter -= 1;
                    }
                }
            );
        }
        
        return {
            doNext: true
        };
    };
    
    DisplayObject.prototype._createElement = function () {
        
        this.element = document.createElement(this.elementType || "div");
        
        this.element.style.opacity = 0;
        this.element.draggable = false;
        
        this.element.setAttribute("class", "asset");
        this.element.setAttribute("id", this.cssid);
        this.element.setAttribute("data-wse-asset-name", this.name);
        
        this.element.style.position = "absolute";
        this.element.style.zIndex = this.z;
        this.element.style.width = this.width;
        this.element.style.height = this.height;
        
        this.stage.appendChild(this.element);
    };
    
    DisplayObject.prototype._moveToPosition = function () {
        
        var x, y, xUnit, yUnit;
        var element = this.element;
        
        x = parseInt(this.x, 10);
        y = parseInt(this.y, 10);
        xUnit = extractUnit(this.x) || "px";
        yUnit = extractUnit(this.y) || "px";
        
        if (xUnit === "%") {
            x = (this.stage.offsetWidth / 100) * x;
        }
        
        if (yUnit === "%") {
            y = (this.stage.offsetHeight / 100) * y;
        }
        
        x = anchoredValue(x, this.xAnchor, this.boxWidth || this.element.offsetWidth);
        y = anchoredValue(y, this.yAnchor, this.boxHeight || this.element.offsetHeight);
        
        if (xUnit === "%") {
            x = x / (this.stage.offsetWidth / 100);
        }
        
        if (yUnit === "%") {
            y = y / (this.stage.offsetHeight / 100);
        }
        
        element.style.left = "" + x + xUnit;
        element.style.top = "" + y + yUnit;
    };
    
    //
    // Calculates .boxWidth and .boxHeight by finding the highest width and height
    // of the element's children depending on the selectors in ._boxSizeSelectors.
    //
    DisplayObject.prototype._calculateBoxSize = function () {
        
        var width = 0;
        var height = 0;
        var element = this.element;
        
        if (!Array.isArray(this._boxSizeSelectors)) {
            return;
        }
        
        this._boxSizeSelectors.forEach(function (selector) {
            
            [].forEach.call(element.querySelectorAll(selector), function (img) {
                
                if (img.offsetWidth > width) {
                    width = img.offsetWidth;
                }
                
                if (img.offsetHeight > height) {
                    height = img.offsetHeight;
                }
            });
            
        });
        
        this.boxWidth = width;
        this.boxHeight = height;
    };
    
    return DisplayObject;
    
});


/* global using */

using(
    "transform-js::transform",
    "eases",
    "MO5.Animation",
    "MO5.TimerWatcher",
    "WSE.commands",
    "WSE.tools::createTimer",
    "WSE.tools::warn"
).
define("WSE.assets.Animation", function (
    transform,
    easing,
    MO5Animation,
    TimerWatcher,
    commands,
    createTimer,
    warn
) {
    
    "use strict";
    
    function Animation (asset, interpreter) {
        
        var groups, i, len, current, transformations, jlen;
        var self, doElements;
        
        this.stage = interpreter.stage;
        this.bus = interpreter.bus;
        this.asset = asset;
        this.name = asset.getAttribute("name");
        this.cbs = [];
        this.assets = interpreter.assets;
        this.isRunning = false;
        
        self = this;
        groups = this.asset.getElementsByTagName("group");
        len = groups.length;
        
        if (len < 1) {
            
            warn(this.bus, "Animation asset '" + this.name + "' is empty.", asset);
            
            return {
                doNext: true
            };
        }
        
        function createTransformFn (as, f, t, pn, u, opt) {
            return transform(f, t, function (v) {
                as.style[pn] = v + u;
            }, opt);
        }
        
        function runDoCommandFn (del, watcher) {
            
            var curDur, curDoEl;
            
            curDoEl = del;
            curDur = curDoEl.getAttribute("duration");
            
            commands["do"](curDoEl, interpreter, {
                animation: true
            });
            
            if (curDur !== null) {
                watcher.addTimer(createTimer(curDur));
            }
        }
        
        function loopFn (transf, doEls) {
            
            var dlen; 
            
            dlen = doEls.length;
            jlen = transformations.length;
            
            self.cbs.push(function () {
                
                var from, to, unit, curTr, curAs, curAsName;
                var dur, propName, j, easingType, opt, di, watcher;
                
                watcher = new TimerWatcher();
                
                for (j = 0; j < jlen; j += 1) {
                    
                    curTr = transf[j];
                    
                    if (typeof curTr === "undefined" || curTr === null) {
                        continue;
                    }
                    
                    curAsName = curTr.getAttribute("asset");
                    
                    try {
                        curAs = document.getElementById(self.assets[curAsName].cssid) || self.stage;
                    }
                    catch (e) {
                        continue;
                    }
                    
                    easingType = curTr.getAttribute("easing");
                    from = parseInt(curTr.getAttribute("from"), 10);
                    to = parseInt(curTr.getAttribute("to"), 10);
                    unit = curTr.getAttribute("unit") || "";
                    dur = curTr.getAttribute("duration") || 500;
                    propName = curTr.getAttribute("property");
                    opt = {};
                    opt.duration = dur;
                    
                    if (easingType !== null && typeof easing[easingType] !== "undefined" &&
                            easing[easingType] !== null) {
                        
                        opt.easing = easing[easingType];
                    }
                    
                    watcher.addTimer(createTransformFn(curAs, from, to, propName, unit, opt));
                }
                
                for (di = 0; di < dlen; di += 1) {
                    runDoCommandFn(doEls[di], watcher);
                }
                
                return watcher;
            });
        }
        
        for (i = 0; i < len; i += 1) {
            
            current = groups[i];
            transformations = current.getElementsByTagName("transform");
            doElements = current.getElementsByTagName("do");
            
            loopFn(transformations, doElements);
        }
        
        this.anim = new MO5Animation();
        
        this.cbs.forEach(function (cb) {
            this.anim.addStep(cb);
        }.bind(this));
        
        this.bus.trigger("wse.assets.animation.constructor", this);
        
        (function () {
            
            function fn () {
                self.stop();
            }
            
            self.bus.subscribe(fn, "wse.interpreter.restart");
            self.bus.subscribe(fn, "wse.interpreter.end");
            self.bus.subscribe(fn, "wse.interpreter.load.before");
        }());
        
    }
    
    Animation.prototype.start = function () {
        this.anim.start();
        this.isRunning = true;
        this.bus.trigger("wse.assets.animation.started", this);
    };
    
    Animation.prototype.stop = function () {
        
        if (this.anim.isRunning()) {
            this.anim.stop();
        }
        
        this.isRunning = false;
        this.bus.trigger("wse.assets.animation.stopped", this);
    };
    
    Animation.prototype.save = function () {
        
        var obj = {
            assetType: "Animation",
            isRunning: this.isRunning,
            index: this.anim.index
        };
        
        this.bus.trigger(
            "wse.assets.animation.save",
            {
                subject: this,
                saves: obj
            }
        );
        
        return obj;
    };
    
    Animation.prototype.restore = function (obj) {
        
        this.isRunning = obj.isRunning;
        
        if (this.isRunning === true) {
            this.anim.index = obj.index;
            this.start();
        }
        
        this.bus.trigger(
            "wse.assets.animation.restore",
            {
                subject: this,
                saves: obj
            }
        );
    };
    
    return Animation;
    
});


/* global using */

using("WSE.tools::warn", "howler::Howl").
define("WSE.assets.Audio", function (warn, Howl) {
    
    "use strict";
    
    /**
     * Constructor for the <audio> asset.
     * 
     * @param asset [XML DOM Element] The asset definition.
     * @param interpreter [object] The interpreter instance.
     * @trigger wse.interpreter.warning@interpreter
     * @trigger wse.assets.audio.constructor@interpreter
     */
    function Audio (asset, interpreter) {
        
        var sources, i, len, j, jlen, current, track, trackName;
        var trackFiles, href, type, source, tracks, bus, trackSettings;
        
        bus = interpreter.bus;
        
        this.interpreter = interpreter;
        this.bus = bus;
        this.name = asset.getAttribute("name");
        this.tracks = {};
        this.autopause = asset.getAttribute("autopause") === "true" ? true : false;
        this.loop = asset.getAttribute("loop") === "true" ? true : false;
        this.fade = asset.getAttribute("fade") === "true" ? true : false;
        this.fadeinDuration = parseInt(asset.getAttribute("fadein")) || 1000;
        this.fadeoutDuration = parseInt(asset.getAttribute("fadeout")) || 1000;
        this._playing = false;
        
        tracks = asset.getElementsByTagName("track");
        len = tracks.length;
        
        if (len < 1) {
            
            warn(this.bus, "No tracks defined for audio element '" + this.name + "'.", asset);
            
            return {
                doNext: true
            };
        }
        
        // check all sources and create Howl instances:
        for (i = 0; i < len; i += 1) {
            
            current = tracks[i];
            
            trackName = current.getAttribute("title");
            
            if (trackName === null) {
                
                warn(this.bus, "No title defined for track '" + trackName + 
                    "' in audio element '" + this.name + "'.", asset);
                
                continue;
            }
            
            sources = current.getElementsByTagName("source");
            jlen = sources.length;
            
            if (jlen < 1) {
                
                warn(this.bus, "No sources defined for track '" + trackName +
                    "' in audio element '" + this.name + "'.", asset);
                
                continue;
            }
            
            trackSettings = {
                urls: [],
                autoplay: false,
                loop: this.loop || false,
                onload: this.bus.trigger.bind(this.bus, "wse.assets.loading.decrease")
            };
            
            trackFiles = {};
            
            for (j = 0; j < jlen; j += 1) {
                
                source = sources[j];
                href = source.getAttribute("href");
                type = source.getAttribute("type");
                
                if (href === null) {
                    
                    warn(this.bus, "No href defined for source in track '" +
                        trackName + "' in audio element '" + this.name + "'.", asset);
                    
                    continue;
                }
                
                if (type === null) {
                    
                    warn(this.bus, "No type defined for source in track '" + 
                        trackName + "' in audio element '" + this.name + "'.", asset);
                    
                    continue;
                }
                
                trackFiles[type] = href;
                trackSettings.urls.push(href);
                
            }
            
            this.bus.trigger("wse.assets.loading.increase");
            
            track = new Howl(trackSettings);
            
            this.tracks[trackName] = track;
        }
        
        /**
         * Starts playing the current track.
         * 
         * @param command [XML DOM Element] The command as written in the WebStory.
         * @return [object] Object that determines the next state of the interpreter.
         */
        this.play = function (command) {
            
            var fadeDuration;
            
            if (this._playing) {
                return {
                    doNext: true
                };
            }
            
            this._playing = true;
            this._paused = false;
            
            if (command.getAttribute("fadein")) {
                
                this.interpreter.waitCounter += 1;
                fadeDuration = +command.getAttribute("fadein");
                
                this.tracks[this._currentTrack].volume(0);
                this.tracks[this._currentTrack].play();
                
                this.tracks[this._currentTrack].fade(0, 1, fadeDuration, function () {
                    this.interpreter.waitCounter -= 1;
                }.bind(this));
            }
            else {
                this.tracks[this._currentTrack].play();
            }
            
            return {
                doNext: true
            };
        };
        
        /**
         * Stops playing the current track.
         * 
         * @param command [XML DOM Element] The command as written in the WebStory.
         * @return [object] Object that determines the next state of the interpreter.
         */
        this.stop = function (command) {
            
            var fadeDuration;
            
            if (!this._currentTrack) {
                return {
                    doNext: true
                };
            }
            
            this._playing = false;
            this._paused = false;
            
            if (command && command.getAttribute("fadeout")) {
                
                this.interpreter.waitCounter += 1;
                fadeDuration = +command.getAttribute("fadeout");
                
                this.tracks[this._currentTrack].fade(1, 0, fadeDuration, function () {
                    this.tracks[this._currentTrack].stop();
                    this.interpreter.waitCounter -= 1;
                }.bind(this));
            }
            else {
                this.tracks[this._currentTrack].stop();
            }
            
            this.bus.trigger("wse.assets.audio.stop", this);
            
            return {
                doNext: true
            };
        };
        
        /**
         * Pauses playing the curren track.
         * 
         * @return [object] Object that determines the next state of the interpreter.
         */
        this.pause = function () {
            
            if (!this._currentTrack || !this._playing) {
                return {
                    doNext: true
                };
            }
            
            this._paused = true;
            
            this.tracks[this._currentTrack].pause();
            
            return {
                doNext: true
            };
        };
        
        this.bus.trigger("wse.assets.audio.constructor", this);
        
        this.bus.subscribe("wse.interpreter.restart", function () {
            this.stop();
        }.bind(this));
        
        window.addEventListener("blur", function () {
            if (this._playing) {
                this.tracks[this._currentTrack].fade(1, 0, 200);
            }
        }.bind(this));
        
        window.addEventListener("focus", function () {
            if (this._playing) {
                this.tracks[this._currentTrack].fade(0, 1, 200);
            }
        }.bind(this));
    }
    
    /**
     * Changes the currently active track.
     * 
     * @param command [DOM Element] The command as specified in the WebStory.
     * @trigger wse.interpreter.warning@interpreter
     * @trigger wse.assets.audio.set@interpreter
     */
    Audio.prototype.set = function (command) {
        
        var wasPlaying = false;
        
        if (this._playing) {
            wasPlaying = true;
        }
        
        this.stop();
        
        this._currentTrack = command.getAttribute("track");
        
        if (wasPlaying) {
            this.play(command);
        }
        
        return {
            doNext: true
        };
    };

    /**
     * Gathers the data to put into a savegame.
     * 
     * @param obj [object] The savegame object.
     */
    Audio.prototype.save = function () {
        
        var obj = {
            currentTrack: this._currentTrack,
            playing: this._playing,
            paused: this._paused
        };
        
        this.bus.trigger("wse.assets.audio.save", this);
        
        return obj;
    };

    /**
     * Restore function for loading the state from a savegame.
     * 
     * @param obj [object] The savegame data.
     * @trigger wse.assets.audio.restore@interpreter
     */
    Audio.prototype.restore = function (vals) {
        
        var key;
        
        this._playing = vals.playing;
        this._paused = vals.paused;
        this._currentTrack = vals.currentTrack;
        
        for (key in this.tracks) {
            this.tracks[key].stop();
        }
        
        if (this._playing && !this._paused) {
            this.tracks[this._currentTrack].play();
        }
        
        this.bus.trigger("wse.assets.audio.restore", this);
    };
    
    return Audio;
    
});


/* global using */

using().define("WSE.assets.Character", function () {
    
    "use strict";
    
    function Character (asset, interpreter) {
        
        this.asset = asset;
        this.stage = interpreter.stage;
        this.bus = interpreter.bus;
        this.name = asset.getAttribute('name');
        this.bus.trigger("wse.assets.character.constructor", this);
    }
    
    Character.prototype.setTextbox = function (command) {
        this.asset.setAttribute("textbox", command.getAttribute("textbox"));
        this.bus.trigger("wse.assets.character.settextbox", this);
    };
    
    Character.prototype.save = function () {
        
        var obj = {
            assetType: "Character",
            textboxName: this.asset.getAttribute("textbox")
        };
        
        this.bus.trigger(
            "wse.assets.character.save",
            {
                subject: this,
                saves: obj
            }
        );
        
        return obj;
    };
    
    Character.prototype.restore = function (obj) {
        
        this.asset.setAttribute("textbox", obj.textboxName);
        
        this.bus.trigger(
            "wse.assets.character.restore",
            {
                subject: this,
                saves: obj
            }
        );
    };
    
    return Character;
    
});


/* global using */

using("WSE.DisplayObject", "WSE.tools::warn").
define("WSE.assets.Curtain", function (DisplayObject, warn) {
    
    "use strict";
    
    function Curtain (asset) {
        
        DisplayObject.apply(this, arguments);
        
        this.asset = asset;
        this.color = asset.getAttribute("color") || "black";
        this.z = asset.getAttribute("z") || 20000;
        this.cssid = this.cssid || "WSECurtain_" + this.id;
        
        this.element.setAttribute("class", "asset WSECurtain");
        this.element.style.left = 0;
        this.element.style.top = 0;
        this.element.style.width = this.stage.offsetWidth + "px";
        this.element.style.height = this.stage.offsetHeight + "px";
        this.element.style.opacity = 0;
        this.element.style.backgroundColor = this.color;
    }
    
    Curtain.prototype = Object.create(DisplayObject.prototype);
    
    Curtain.prototype.set = function (asset) {
        this.color = asset.getAttribute("color") || "black";
        this.element.style.backgroundColor = this.color;
    };
    
    Curtain.prototype.save = function () {
        return {
            color: this.color,
            cssid: this.cssid,
            z: this.z
        };
    };

    Curtain.prototype.restore = function (obj) {
        
        this.color = obj.color;
        this.cssid = obj.cssid;
        this.z = obj.z;
        
        try {
            this.element = document.getElementById(this.cssid);
        }
        catch (e) {
            warn(this.bus, "Element with CSS ID '" + this.cssid + "' could not be found.");
            return;
        }
        
        this.element.style.backgroundColor = this.color;
        this.element.style.zIndex = this.z;
    };
    
    return Curtain;
    
});


/* global using, console */

using(
    "transform-js::transform",
    "eases",
    "WSE.DisplayObject",
    "WSE.tools::applyAssetUnits",
    "WSE.tools::extractUnit",
    "WSE.tools::calculateValueWithAnchor",
    "WSE.tools::warn"
).
define("WSE.assets.Imagepack", function (
    transform,
    easing,
    DisplayObject,
    applyUnits,
    extractUnit,
    anchoredValue,
    warn
) {
    
    "use strict";
    
    /**
     * Constructor function for ImagePacks.
     * 
     * @param asset [DOM Element] The asset definition.
     * @param interpreter [WSE.Interpreter] The interpreter object.
     */
    function Imagepack (asset) {
        
        var images, children, i, len, current, name;
        var src, image, self, triggerDecreaseFn, width, height;
        
        this._boxSizeSelectors = ["img"];
        
        DisplayObject.apply(this, arguments);
        
        this.cssid = this.cssid || "wse_imagepack_" + this.name;
        
        self = this;
        images = {};
        width = asset.getAttribute('width');
        height = asset.getAttribute('height');
        
        this.element.setAttribute("class", "asset imagepack");
        
        children = asset.getElementsByTagName("image");
        triggerDecreaseFn =
            self.bus.trigger.bind(self.bus, "wse.assets.loading.decrease", null, false);
        
        for (i = 0, len = children.length; i < len; i += 1) {
            
            current = children[i];
            name = current.getAttribute("name");
            src = current.getAttribute("src");
            
            if (name === null) {
                warn(this.bus, "Image without name in imagepack '" + this.name + "'.", asset);
                continue;
            }
            
            if (src === null) {
                warn(this.bus, "Image without src in imagepack '" + this.name + "'.", asset);
                continue;
            }
            
            image = new Image();
            
            this.bus.trigger("wse.assets.loading.increase", null, false);
            image.addEventListener('load', triggerDecreaseFn);
            
            image.src = src;
            image.style.opacity = 0;
            image.style.position = "absolute";
            image.draggable = false;
            
            image.setAttribute("data-wse-asset-image-name", name);
            
            if (width !== null) {
                image.setAttribute('width', width);
            }
            
            if (height !== null) {
                image.setAttribute('height', height);
            }
            
            images[name] = this.cssid + "_" + name;
            image.setAttribute("id", images[name]);
            
            this.element.appendChild(image);
        }
        
        this.images = images;
        this.current = null;
        
    }
    
    Imagepack.prototype = Object.create(DisplayObject.prototype);
    
    Imagepack.prototype.set = function (command, args) {
        
        var image, name, self, old, duration, isAnimation, bus = this.bus, element;
        
        args = args || {};
        self = this;
        name = command.getAttribute("image");
        duration = command.getAttribute("duration") || 400;
        isAnimation = args.animation === true ? true : false;
        
        if (name === null) {
            
            warn(bus, "Missing attribute 'image' on 'do' element " +
                "referencing imagepack '" + this.name + "'.", command);
            
            return {
                doNext: true
            };
        }
        
        try {
            image = document.getElementById(this.images[name]);
        }
        catch (e) {
            console.error("DOM Element for Image " + name + " on Imagepack " +
                this.name + " not found!", e);
        }
        
        if (typeof image === "undefined" || image === null) {
            
            warn(bus, "Unknown image name on 'do' element referencing " +
                "imagepack '" + this.name + "'.", command);
            
            return {
                doNext: true
            };
        }
        
        old = this.current;
        
        for (var key in this.images) {
            
            if (this.images.hasOwnProperty(key)) {
                
                if (key !== name) {
                    continue;
                }
                
                if (key === old) {
                    
                    warn(bus, "Trying to set the image that is already set on imagepack '" +
                        this.name + "'.", command);
                    
                    return {
                        doNext: true
                    };
                }
            }
        }
        
        if (!isAnimation) {
            self.interpreter.waitCounter += 1;
        }
        
        element = document.getElementById(this.cssid);
        element.style.width = image.offsetWidth + "px";
        element.style.height = image.offsetHeight + "px";
        
        (function () {
            
            var valFn, finishFn, options;
            
            valFn = function (v) {
                image.style.opacity = v;
            };
            
            finishFn = function () {
                
                if (!isAnimation) {
                    self.interpreter.waitCounter -= 1;
                }
            };
            
            options = {
                duration: duration,
                easing: easing.cubicOut
            };
            
            transform(0, 1, valFn, options, finishFn);
        }());
        
        if (this.current !== null) {
            
            if (!isAnimation) {
                self.interpreter.waitCounter += 1;
            }
            
            (function () {
                
                var timeoutFn;
                
                timeoutFn = function() {
                    
                    var oldEl, valFn, finishFn, options; 
                    
                    oldEl = document.getElementById(self.images[old]);
                    
                    valFn = function (v) {
                        oldEl.style.opacity = v;
                    };
                    
                    finishFn = function () {
                        
                        if (!isAnimation) {
                            self.interpreter.waitCounter -= 1;
                        }
                    };
                    
                    options = {
                        duration: duration,
                        easing: easing.cubicIn
                    };
                    
                    transform(1, 0, valFn, options, finishFn);
                };
                
                timeoutFn();
            }());
        }
        
        this.current = name;
        
        return {
            doNext: true
        };
    };
    
    Imagepack.prototype.save = function () {
        
        var cur, images, obj;
        
        images = this.images;
        cur = this.current || null;
        
        obj = {
            assetType: "Imagepack",
            current: cur,
            cssid: this.cssid,
            images: images,
            xAnchor: this.xAnchor,
            yAnchor: this.yAnchor,
            z: this.z
        };
        
        this.bus.trigger(
            "wse.assets.imagepack.save",
            {
                subject: this,
                saves: obj
            }
        );
        
        return obj;
    };
    
    Imagepack.prototype.restore = function (save) {
        
        var name;
        
        name = save.current;
        this.cssid = save.cssid;
        this.z = save.z;
        this.current = name;
        this.xAnchor = save.xAnchor;
        this.yAnchor = save.yAnchor;
        
        document.getElementById(this.cssid).style.zIndex = this.z;
        
        this.bus.trigger(
            "wse.assets.imagepack.restore",
            {
                subject: this,
                saves: save
            }
        );
    };
    
    return Imagepack;
    
});


/* global using */

using(
    "transform-js::transform",
    "WSE.tools.reveal",
    "class-manipulator::list",
    "WSE.DisplayObject",
    "WSE.tools::applyAssetUnits",
    "WSE.tools::replaceVariables"
).
define("WSE.assets.Textbox", function (
    transform,
    reveal,
    classes,
    DisplayObject,
    applyUnits,
    replaceVars
) {
    
    "use strict";
    
    function Textbox (asset) {
        
        this.z = 1000;
        
        DisplayObject.apply(this, arguments);
        
        var element, nameElement, textElement;
        
        this.type = asset.getAttribute("behaviour") || "adv";
        this.showNames = asset.getAttribute("namebox") === "yes" ? true : false;
        this.nltobr = asset.getAttribute("nltobr") === "true" ? true : false;
        this.cssid = this.cssid || "wse_textbox_" + this.name;
        this.effectType = asset.getAttribute("effect") || "typewriter";
        this.speed = asset.getAttribute("speed") || 0;
        this.speed = parseInt(this.speed, 10);
        this.fadeDuration = asset.getAttribute("fadeDuration") || 0;
        
        (function (ctx) {
            
            var el, i, len, elms;
            
            try {
                
                elms = asset.childNodes;
                
                for (i = 0, len = elms.length; i < len; i += 1) {
                    
                    if (elms[i].nodeType === 1 && elms[i].tagName === 'nameTemplate') {
                        el = elms[i];
                        break;
                    }
                }
                
                if (!el) {
                    throw new Error('No nameTemplate found.');
                }
                
                ctx.nameTemplate = new XMLSerializer().serializeToString(el);
            }
            catch (e) {
                ctx.nameTemplate = '{name}: ';
            }
        }(this));
        
        if (this.type === "nvl") {
            this.showNames = false;
        }
        
        element = this.element;
        nameElement = document.createElement("div");
        textElement = document.createElement("div");
        
        element.setAttribute("class", "asset textbox");
        textElement.setAttribute("class", "text");
        nameElement.setAttribute("class", "name");
        
        element.appendChild(nameElement);
        element.appendChild(textElement);
        
        if (this.showNames === false) {
            nameElement.style.display = "none";
        }
        
        nameElement.setAttribute("id", this.cssid + "_name");
        textElement.setAttribute("id", this.cssid + "_text");
        
        this.nameElement = this.cssid + "_name";
        this.textElement = this.cssid + "_text";
        
        element.style.opacity = 0;
        
        this.bus.trigger("wse.assets.textbox.constructor", this);
    }
    
    Textbox.prototype = Object.create(DisplayObject.prototype);
    
    Textbox.prototype.put = function (text, name, speakerId) {
        
        var textElement, nameElement, namePart, self, cssClass = "wse_no_character", element;
        
        name = name || null;
        speakerId = speakerId || "_no_one";
        
        self = this;
        textElement = document.getElementById(this.textElement);
        nameElement = document.getElementById(this.nameElement);
        element = document.getElementById(this.cssid);
        
        text = replaceVars(text, this.interpreter);
        
        self.interpreter.waitCounter += 1;
        
        namePart = "";
        
        if (this.showNames === false && !(!name)) {
            namePart = this.nameTemplate.replace(/\{name\}/g, name);
        }
        
        if (name === null) {
            
            if (this.showNames) {
                nameElement.style.display = "none";
            }
            
            name = "";
        }
        else {
            
            if (this.showNames) {
                nameElement.style.display = "";
            }
            
            cssClass = "wse_character_" + speakerId.split(" ").join("_");
        }
        
        if (this._lastCssClass) {
            classes(element).remove(this._lastCssClass).apply();
        }
        
        this._lastCssClass = cssClass;
        
        classes(element).add(cssClass).apply();
        
        if (this.speed < 1) {
            
            if (this.fadeDuration > 0) {
                
                self.interpreter.waitCounter += 1;
                
                (function () {
                    
                    var valFn, finishFn, options;
                    
                    valFn = function (v) {
                        textElement.style.opacity = v;
                    };
                    
                    finishFn = function () {
                        self.interpreter.waitCounter -= 1;
                    };
                    
                    options = {
                        duration: self.fadeDuration
                    };
                    
                    transform(1, 0, valFn, options, finishFn);
                }());
            }
            else {
                putText();
            }
        }
        
        if (this.speed > 0) {
            
            if (self.type === 'adv') {
                textElement.innerHTML = "";
            }
            
            (function () {
                
                var container;
                
                container = document.createElement('div');
                container.setAttribute('class', 'line');
                textElement.appendChild(container);
                container.innerHTML = namePart + text;
                nameElement.innerHTML = self.nameTemplate.replace(/\{name\}/g, name);
                //self.interpreter.waitCounter += 1;
                
                self.interpreter.cancelCharAnimation = reveal(
                    container, 
                    { 
                        speed: self.speed,
                        onFinish: function () {
                            //self.interpreter.waitCounter -= 1; 
                            self.interpreter.cancelCharAnimation = null;
                        }
                    }
                ).cancel;
            }());
        }
        else if (this.fadeDuration > 0) {
            
            self.interpreter.waitCounter += 1;
            
            setTimeout(
                function () {
                    
                    putText();
                    
                    if (self.type === 'nvl') {
                        textElement.innerHTML = '<div>' + textElement.innerHTML + '</div>';
                    }
                    
                    transform(
                        0,
                        1,
                        function (v) {
                            textElement.style.opacity = v;
                        },
                        {
                            duration: self.fadeDuration,
                            onFinish: function () {
                                self.interpreter.waitCounter -= 1;
                            }
                        }
                    );
                },
                self.fadeDuration
            );
        }
        
        this.bus.trigger("wse.assets.textbox.put", this, false);
        self.interpreter.waitCounter -= 1;
        
        return {
            doNext: false
        };
        
        function putText () {
            
            if (self.type === 'adv') {
                textElement.innerHTML = "";
            }
            
            textElement.innerHTML += namePart + text;
            nameElement.innerHTML = self.nameTemplate.replace(/\{name\}/g, name);
        }
    };
    
    Textbox.prototype.clear = function () {
        
        document.getElementById(this.textElement).innerHTML = "";
        document.getElementById(this.nameElement).innerHTML = "";
        this.bus.trigger("wse.assets.textbox.clear", this);
        
        return {
            doNext: true
        };
    };

    Textbox.prototype.save = function () {
        
        return {
            assetType: "Textbox",
            type: this.type,
            showNames: this.showNames,
            nltobr: this.nltobr,
            cssid: this.cssid,
            nameElement: this.nameElement,
            textElement: this.textElement,
            z: this.z
        };
    };
    
    Textbox.prototype.restore = function (save) {
        
        this.type = save.type;
        this.showNames = save.showNames;
        this.nltobr = save.nltobr;
        this.cssid = save.cssid;
        this.nameElement = save.nameElement;
        this.textElement = save.textElement;
        this.z = save.z;
        
        document.getElementById(this.cssid).style.zIndex = this.z;
    };
    
    return Textbox;
    
});


/* global using */

using("WSE.tools::applyAssetUnits", "WSE.DisplayObject", "WSE.tools::warn").
define("WSE.assets.Background", function (applyUnits, DisplayObject, warn) {
    
    "use strict";
    
    function resize (self) {
        self.element.setAttribute("width", self.stage.offsetWidth);
        self.element.setAttribute("height", self.stage.offsetHeight);
    }
    
    function styleElement (self) {
        
        var s = self.element.style;
        
        self.element.setAttribute("id", self.cssid);
        self.element.setAttribute("class", "WSEBackground");
        self.element.style.position = "absolute";
        self.element.draggable = false;
        s.left = 0;
        s.top = 0;
        s.opacity = 0;
        s.zIndex = self.z;
    }
    
    function Background (asset) {
        
        this.elementType = "img";
        
        DisplayObject.apply(this, arguments);
        
        var self = this;
        
        this.asset = asset;
        this.cssid = this.cssid || "WSEBackground_" + this.id;
        this.src = asset.getAttribute('src');
        
        if (!this.src) {
            warn(this.bus, 'No source defined on background asset.', asset);
            return;
        }
        
        this.element.setAttribute('src', this.src);
        
        styleElement(this);
        resize(this);
        
        window.addEventListener('resize', function () { resize(self); });
    }
    
    Background.prototype = Object.create(DisplayObject.prototype);
    
    Background.prototype.save = function () {
        return {
            cssid: this.cssid,
            z: this.z
        };
    };
    
    Background.prototype.restore = function (obj) {
        
        this.cssid = obj.cssid;
        this.z = obj.z;
        
        try {
            this.element = document.getElementById(this.cssid);
        }
        catch (e) {
            warn(this.bus, "Element with CSS ID '" + this.cssid + "' could not be found.");
            return;
        }
    };
    
    return Background;
    
});


/* global using */

using(
    "transform-js::transform",
    "eases",
    "WSE.DisplayObject",
    "WSE.tools::applyAssetUnits",
    "WSE.tools::extractUnit",
    "WSE.tools::calculateValueWithAnchor",
    "WSE.tools::warn"
).
define("WSE.assets.Composite", function (
    transform,
    easing,
    DisplayObject,
    applyUnits,
    extractUnit,
    anchoredValue,
    warn
) {
    
    "use strict";
    
    /**
     * Constructor function for Composites.
     * 
     * @param asset [DOM Element] The asset definition.
     * @param interpreter [WSE.Interpreter] The interpreter object.
     */
    function Composite (asset) {
        
        var element, children;
        var self, triggerDecreaseFn, width, height;
        
        this._boxSizeSelectors = ["img"];
        
        DisplayObject.apply(this, arguments);
        
        this.cssid = this.cssid || "wse_composite_" + this.name;
        
        self = this;
        element = this.element;
        width = this.width;
        height = this.height;
        
        element.setAttribute("class", "asset composite");
        
        children = asset.getElementsByTagName("image");
        triggerDecreaseFn =
            self.bus.trigger.bind(self.bus, "wse.assets.loading.decrease", null, false);
        
        [].forEach.call(children, function (current) {
            
            var tags, src, image;
            
            tags = current.getAttribute("tags");
            src = current.getAttribute("src");
            
            if (tags === null) {
                warn(self.bus, "Image without tags in composite '" + self.name + "'.", asset);
                return;
            }
            
            if (src === null) {
                warn(self.bus, "Image without src in composite '" + self.name + "'.", asset);
                return;
            }
            
            image = new Image();
            
            self.bus.trigger("wse.assets.loading.increase", null, false);
            image.addEventListener('load', triggerDecreaseFn);
            
            image.src = src;
            image.style.opacity = 0;
            image.style.position = "absolute";
            image.draggable = false;
            
            image.setAttribute("data-wse-tags", tags);
            
            if (width !== null) {
                image.setAttribute('width', width);
            }
            
            if (height !== null) {
                image.setAttribute('height', height);
            }
            
            element.appendChild(image);
            
        });
        
        this.current = [];
    }
    
    Composite.prototype = Object.create(DisplayObject.prototype);
    
    Composite.prototype.tag = function (command, args) {
        
        var self, old, duration, isAnimation, bus = this.bus, element;
        var toAdd, toRemove, imagesByTags, oldImages, newImages;
        
        args = args || {};
        self = this;
        toAdd = extractTags(command.getAttribute("add") || "");
        toRemove = extractTags(command.getAttribute("remove") || "");
        duration = command.getAttribute("duration") || 400;
        isAnimation = args.animation === true ? true : false;
        
        if (!toAdd.length && !toRemove.length) {
            
            warn(bus, "No attribute 'add' or 'remove' on element " +
                "referencing composite '" + this.name + "'. Expected at least one.", command);
            
            return {
                doNext: true
            };
        }
        
        old = this.current;
        
        if (toRemove.length && toRemove[0] === "*") {
            this.current = toAdd.slice();
        }
        else {
            
            this.current = old.filter(function (tag) {
                return toRemove.indexOf(tag) < 0;
            });
            
            toAdd.forEach(function (tag) {
                if (self.current.indexOf(tag) < 0) {
                    self.current.push(tag);
                }
            });
        }
        
        imagesByTags = getImagesByTags(this);
        oldImages = [];
        newImages = [];
        
        old.forEach(function (tag) {
            if (imagesByTags[tag]) {
                imagesByTags[tag].forEach(function (image) {
                    if (oldImages.indexOf(image) < 0) {
                        oldImages.push(image);
                    }
                });
            }
        });
        
        this.current.forEach(function (tag) {
            if (imagesByTags[tag]) {
                imagesByTags[tag].forEach(function (image) {
                    if (newImages.indexOf(image) < 0) {
                        newImages.push(image);
                    }
                });
            }
        });
        
        newImages = newImages.filter(function (image) {
            
            if (oldImages.indexOf(image) >= 0) {
                oldImages.splice(oldImages.indexOf(image), 1);
                return false;
            }
            
            return true;
        });
        
        if (!isAnimation) {
            self.interpreter.waitCounter += 1;
        }
        
        element = document.getElementById(this.cssid);
        element.style.width = highest(newImages, "offsetWidth") + "px";
        element.style.height = highest(newImages, "offsetHeight") + "px";
        
        (function () {
            
            var valFn, finishFn, options;
            
            valFn = function (v) {
                newImages.forEach(function (image) {
                    image.style.opacity = v;
                });
            };
            
            finishFn = function () {
                
                if (!isAnimation) {
                    self.interpreter.waitCounter -= 1;
                }
            };
            
            options = {
                duration: duration,
                easing: easing.cubicOut
            };
            
            transform(0, 1, valFn, options, finishFn);
        }());
        
        if (this.current !== null) {
            
            if (!isAnimation) {
                self.interpreter.waitCounter += 1;
            }
            
            (function () {
                
                function timeoutFn () {
                    
                    var options; 
                    
                    function valFn (v) {
                        oldImages.forEach(function (image) {
                            image.style.opacity = v;
                        });
                    }
                    
                    function finishFn () {
                        if (!isAnimation) {
                            self.interpreter.waitCounter -= 1;
                        }
                    }
                    
                    options = {
                        duration: duration,
                        easing: easing.cubicIn
                    };
                    
                    transform(1, 0, valFn, options, finishFn);
                }
                
                timeoutFn();
            }());
        }
        
        return {
            doNext: true
        };
    };
    
    Composite.prototype.save = function () {
        
        var cur, obj;
        
        cur = this.current || [];
        
        obj = {
            assetType: "Composite",
            current: cur,
            cssid: this.cssid,
            xAnchor: this.xAnchor,
            yAnchor: this.yAnchor,
            z: this.z
        };
        
        this.bus.trigger(
            "wse.assets.composite.save",
            {
                subject: this,
                saves: obj
            }
        );
        
        return obj;
    };
    
    Composite.prototype.restore = function (save) {
        
        this.cssid = save.cssid;
        this.z = save.z;
        this.current = save.current.slice();
        this.xAnchor = save.xAnchor;
        this.yAnchor = save.yAnchor;
        
        this.element = document.getElementById(this.cssid);
        this.element.style.zIndex = this.z;
        
        this.bus.trigger(
            "wse.assets.composite.restore",
            {
                subject: this,
                saves: save
            }
        );
    };
    
    return Composite;
    
    function getImagesByTags (self) {
        
        var images, imagesByTag;
        
        images = document.getElementById(self.cssid).getElementsByTagName("img");
        imagesByTag = {};
        
        [].forEach.call(images, function (image) {
            
            var tags = extractTags(image.getAttribute("data-wse-tags") || "");
            
            tags.forEach(function (tag) {
                
                if (!Array.isArray(imagesByTag[tag])) {
                    imagesByTag[tag] = [];
                }
                
                imagesByTag[tag].push(image);
            });
        });
        
        return imagesByTag;
    }
    
    function extractTags (raw) {
        return raw.split(",").map(function (rawTag) {
            return rawTag.trim();
        });
    }
    
    function highest (all, key) {
        
        var biggest = 0;
        
        all.forEach(function (item) {
            if (item[key] > biggest) {
                biggest = item[key];
            }
        });
        
        return biggest;
    }
    
});


/* global using */

using(
    "WSE.tools.ui",
    "WSE.tools",
    "WSE.tools::replaceVariables"
).define("WSE.commands.alert", function (ui, tools, replaceVars) {
    
    function alert (command, interpreter) {
        
        var title, message, doNext;
        
        title = command.getAttribute("title") || "Alert!";
        message = command.getAttribute("message") || "Alert!";
        
        doNext = replaceVars(command.getAttribute("next") || "", interpreter) === "false" ?
            false :
            true;
        
        message = replaceVars(message, interpreter);
        title = replaceVars(title, interpreter);
        
        message = tools.textToHtml(message);
        
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


/* global using */

using().define("WSE.commands.break", function () {
    
    "use strict";
    
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
    
    return breakFn;
    
});


/* global using */

using("WSE.tools", "WSE.DisplayObject").
define("WSE.commands.choice", function (tools, DisplayObject) {
    
    "use strict";
    
    function choice (command, interpreter) {
        
        var menuElement, buttons, children, len, i, current;
        var currentButton, scenes, self, sceneName;
        var makeButtonClickFn, oldState, cssid;
        
        interpreter.bus.trigger(
            "wse.interpreter.commands.choice",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );
        
        oldState = interpreter.state;
        interpreter.state = "pause";
        
        buttons = [];
        scenes = [];
        self = interpreter;
        children = command.childNodes;
        len = children.length;
        cssid = command.getAttribute("cssid") || "WSEChoiceMenu";
        
        makeButtonClickFn = function (cur, me, sc, idx) {
            
            sc = sc || null;
            
            return function (ev) {
                
                ev.stopPropagation();
                ev.preventDefault();
                
                setTimeout(
                    function () {
                        
                        var childrenLen = cur.childNodes ? cur.childNodes.length : 0;
                        
                        var oldIndex = interpreter.index;
                        var oldSceneId = interpreter.sceneId;
                        var oldScenePath = interpreter.scenePath.slice();
                        var oldCurrentScene = interpreter.currentScene;
                        
                        if (sc !== null) {  
                            self.changeSceneNoNext(sc);
                        }
                        
                        if (childrenLen > 0) {
                            
                            interpreter.pushToCallStack();
                            interpreter.currentCommands = cur.childNodes;
                            interpreter.sceneId = oldSceneId;
                            interpreter.scenePath = oldScenePath;
                            interpreter.scenePath.push(oldIndex-1);
                            interpreter.scenePath.push(idx);
                            interpreter.index = 0;
                            interpreter.currentScene = oldCurrentScene;
                            interpreter.currentElement = 0;
                        }
                        
                        self.next();
                    },
                    0
                );
                
                self.stage.removeChild(me);
                interpreter.waitCounter -= 1;
                interpreter.state = oldState;
            };
        };
        
        if (len < 1) {
            
            interpreter.bus.trigger(
                "wse.interpreter.warning",
                {
                    element: command,
                    message: "Element 'choice' is empty. Expected at " +
                        "least one 'option' element."
                }
            );
        }
        
        menuElement = document.createElement("div");
        menuElement.setAttribute("class", "menu");
        menuElement.setAttribute("id", cssid);
        
        // associate HTML element with XML element; used when loading savegames:
        menuElement.setAttribute("data-wse-index", interpreter.index);
        menuElement.setAttribute("data-wse-scene-id", interpreter.sceneId);
        menuElement.setAttribute("data-wse-game", interpreter.game.url);
        menuElement.setAttribute("data-wse-type", "choice");
        
        for (i = 0; i < len; i += 1) {
            
            current = children[i];
            
            if (!current.tagName ||
                    current.tagName !== "option" ||
                    !interpreter.checkIfvar(current)) {
                
                continue;
            }
            
            currentButton = document.createElement("input");
            currentButton.setAttribute("class", "button");
            currentButton.setAttribute("type", "button");
            currentButton.setAttribute("tabindex", i + 1);
            currentButton.setAttribute("value", current.getAttribute("label"));
            
            currentButton.value = tools.replaceVariables(
                current.getAttribute("label"),
                interpreter
            );
            
            sceneName = current.getAttribute("scene") || null;
            
            scenes[i] = sceneName ? interpreter.getSceneById(sceneName) : null;
            
            currentButton.addEventListener( 
                'click',
                makeButtonClickFn(current, menuElement, scenes[i], i)
            );
            
            buttons.push(currentButton);
            menuElement.appendChild(currentButton);
        }
        
        menuElement.style.opacity = 0;
        interpreter.stage.appendChild(menuElement);
        
        DisplayObject.prototype.show.call(
            undefined,
            command,
            {
                element: menuElement,
                bus: interpreter.bus,
                stage: interpreter.stage,
                interpreter: interpreter
            }
        );
        
        interpreter.waitCounter += 1;
        
        return {
            doNext: false,
            wait: true
        };
    }
    
    return choice;
    
});


/* global using */

using("WSE.tools.ui").define("WSE.commands.confirm", function (ui) {
    return ui.makeInputFn("confirm");
});


/* global using */

using("WSE.tools::warn").define("WSE.commands.do", function (warn) {
    
    "use strict";
    
    function doCommand (command, interpreter, args) {
        
        var assetName, action, bus = interpreter.bus, assets = interpreter.assets;
        
        args = args || {};
        
        bus.trigger(
            "wse.interpreter.commands.do",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );
        
        assetName = command.getAttribute("asset");
        action = command.getAttribute("action");
        
        if (assetName === null) {
            warn(bus, "Element of type 'do' must have an attribute 'asset'. " +
                "Element ignored.", command);
            return;
        }
        
        if (action === null) {
            warn(bus, "Element of type 'do' must have an attribute 'action'." +
                " Element ignored.", command);
            return;
        }
        
        if (typeof assets[assetName] === "undefined" || assets[assetName] === null) {
            warn(bus, "Reference to unknown asset '" + assetName + "'.", command);
            return {
                doNext: true
            };
        }
        
        if (typeof assets[assetName][action] === "undefined") {
            warn(bus, "Action '" + action + "' is not defined for asset '" +
                assetName + "'.", command);
            return {
                doNext: true
            };
        }
        
        return assets[assetName][action](command, args);
    }
    
    return doCommand;
      
});


/* global using */

using("WSE.functions", "WSE.tools::warn").define("WSE.commands.fn", function (functions, warn) {
    
    "use strict";
    
    function fn (command, interpreter) {
        
        var name, varName, ret;
        
        name = command.getAttribute("name") || null;
        varName = command.getAttribute("tovar") || null;
        
        if (typeof functions[name] !== "function") {
            warn(interpreter.bus, "No name supplied on fn element.", command);
            return {
                doNext: true
            };
        }
        
        if (typeof functions[name] !== "function") {
            warn(interpreter.bus, "Unknown function '" + name + "'.", command);
            return {
                doNext: true
            };
        }
        
        ret = functions[name](interpreter);
        
        if (varName !== null){
            interpreter.runVars[varName] = "" + ret;
        }
        
        return {
            doNext: true
        };
    }
    
    return fn;
    
});


/* global using */

using("WSE.tools::warn").define("WSE.commands.global", function (warn) {
    
    "use strict";
    
    function global (command, interpreter) {
        
        var name, value, next;
        
        name = command.getAttribute("name") || null;
        value = command.getAttribute("value") || null;
        next = {doNext: true};
        
        if (name === null) {
            warn(interpreter.bus, "No name defined on element 'global'.", command);
            return next;
        }
        
        if (value === null) {
            warn(interpreter.bus, "No value defined on element 'global'.", command);
            return next;
        }
        
        interpreter.globalVars.set(name, value);
        
        return next;
    }
    
    return global;
    
});


/* global using */

using("WSE.tools::warn").define("WSE.commands.globalize", function (warn) {
    
    "use strict";
    
    function globalize (command, interpreter) {
        
        var key, next;
        
        key = command.getAttribute("name") || null;
        next = {doNext: true};
        
        if (key === null) {
            warn(interpreter.bus, "No variable name defined on globalize element.", command);
            return next;
        }
        
        if (typeof interpreter.runVars[key] === "undefined" || interpreter.runVars[key] === null) {
            warn(interpreter.bus, "Undefined local variable.", command);
            return next;
        }
        
        interpreter.globalVars.set(key, interpreter.runVars[key]);
        
        return next;
    }
    
    return globalize;
    
});


/* global using */

using(
    "WSE.tools::replaceVariables",
    "WSE.tools::logError"
).
define("WSE.commands.goto", function (replaceVars, logError) {
    
    "use strict";
    
    function gotoCommand (command, interpreter) {
        
        var scene, sceneName, bus = interpreter.bus;
        
        bus.trigger(
            "wse.interpreter.commands.goto",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );
        
        sceneName = command.getAttribute("scene");
        
        if (sceneName === null) {
            logError(bus, "Element 'goto' misses attribute 'scene'.");
        }
        
        sceneName = replaceVars(sceneName, interpreter);
        
        scene = interpreter.getSceneById(sceneName);
        
        if (scene === null) {
            logError(bus, "Unknown scene '" + sceneName + "'.");
            return;
        }
        
        return {
            changeScene: scene
        };
    }
    
    return gotoCommand;
    
});


/* global using */

using("WSE.tools::getSerializedNodes", "WSE.tools::warn").
define("WSE.commands.line", function (getSerializedNodes, warn) {
    
    "use strict";
    
    function line (command, interpreter) {
        
        var speakerId, speakerName, textboxName, i, len, current;
        var assetElements, text, doNext, bus = interpreter.bus, next;
        
        next = {doNext: true};
        
        bus.trigger(
            "wse.interpreter.commands.line",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );
        
        speakerId = command.getAttribute("s");
        doNext = command.getAttribute("stop") === "false" ? true : false;
        
        if (speakerId === null) {
            warn(bus, "Element 'line' requires attribute 's'.", command);
            return next;
        }
        
        assetElements = interpreter.story.getElementsByTagName("character");
        len = assetElements.length;
        
        for (i = 0; i < len; i += 1) {
            
            current = assetElements[i];
            
            if (current.getAttribute("name") === speakerId) {
                
                textboxName = current.getAttribute("textbox");
                
                if (typeof textboxName === "undefined" || textboxName === null) {
                    warn(bus, "No textbox defined for character '" + speakerId + "'.", command);
                    return next;
                }
                
                try {
                    speakerName =
                        getSerializedNodes(current.getElementsByTagName("displayname")[0]).trim();
                }
                catch (e) {}
                
                break;
            }
        }
        
        if (typeof interpreter.assets[textboxName] === "undefined") {
            warn(bus, "Trying to use an unknown textbox or character.", command);
            return next;
        }
        
        text = getSerializedNodes(command);
        
        interpreter.log.push({speaker: speakerId, text: text});
        interpreter.assets[textboxName].put(text, speakerName, speakerId);
        
        return {
            doNext: doNext,
            wait: true
        };
    }
    
    return line;
     
});


/* global using */

using("WSE.tools::warn").define("WSE.commands.localize", function (warn) {
    
    "use strict";
    
    function localize (command, interpreter) {
        
        var key, next;
        
        next = {doNext: true};
        key = command.getAttribute("name") || null;
        
        if (key === null) {
            warn(interpreter.bus, "No variable name defined on localize element.", command);
            return next;
        }
        
        if (!interpreter.globalVars.has(key)) {
            warn(interpreter.bus, "Undefined global variable.", command);
            return next;
        }
        
        interpreter.runVars[key] = interpreter.globalVars.get(key);
        
        return next;
    }
    
    return localize;
    
});


/* global using */

using("WSE.tools.ui").define("WSE.commands.prompt", function (ui) {
    return ui.makeInputFn("prompt");
});


/* global using */

using().define("WSE.commands.restart", function () {
    
    "use strict";
    
    function restart (command, interpreter) {
        
        interpreter.bus.trigger(
            "wse.interpreter.commands.restart",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );
        
        interpreter.bus.trigger("wse.interpreter.message", "Restarting game...", false);
        interpreter.bus.trigger("wse.interpreter.restart", interpreter, false);
        
        interpreter.runVars = {};
        interpreter.log = [];
        interpreter.visitedScenes = [];
        interpreter.startTime = Math.round(+new Date() / 1000);
        interpreter.waitCounter = 0;
        interpreter.state = "listen";
        interpreter.stage.innerHTML = "";
        
        interpreter.assets = {};
        interpreter.buildAssets();
        interpreter.callOnLoad();
        
        while (interpreter.callStack.length > 0) {
            interpreter.callStack.shift();
        }
        
        return {
            doNext: true,
            changeScene: interpreter.getFirstScene()
        };
    }
    
    return restart;
    
});


/* global using */

using(
    "WSE.tools::replaceVariables",
    "WSE.commands.set_vars",
    "WSE.tools::warn",
    "WSE.tools::logError",
    "WSE.tools::log"
).
define("WSE.commands.sub", function (replaceVars, setVars, warn, logError, log) {
    
    "use strict";
    
    function sub (command, interpreter) {
        
        var sceneId, scene, doNext, next;
        
        interpreter.bus.trigger(
            "wse.interpreter.commands.sub",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );
        
        next = {doNext: true};
        sceneId = command.getAttribute("scene") || null;
        doNext = command.getAttribute("next") === false ? false : true;
        
        if (sceneId === null) {
            warn(interpreter.bus, "Missing 'scene' attribute on 'sub' command!", command);
            return next;
        }
        
        sceneId = replaceVars(sceneId, interpreter);
        scene = interpreter.getSceneById(sceneId);
        
        if (!scene) {
            logError(interpreter.bus, "No such scene '" + sceneId + "'!", command);
            return next;
        }
        
        log(interpreter.bus, "Entering sub scene '" + sceneId + "'...");
        
        interpreter.pushToCallStack();
        
        interpreter.currentCommands = scene.childNodes;
        interpreter.index = -1;
        interpreter.sceneId = sceneId;
        interpreter.scenePath = [];
        interpreter.currentElement = -1;
        
        if (command.getAttribute("names")) {
            setVars(command, interpreter);
        }
        
        return {
            doNext: doNext
        };
    }
    
    return sub;
    
});


/* global using */

using("WSE.tools::warn").define("WSE.commands.trigger", function (warn) {
    
    "use strict";
    
    function trigger (command, interpreter) {
        
        var triggerName, action, next;
        
        next = {doNext: true};
        
        interpreter.bus.trigger(
            "wse.interpreter.commands.trigger",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );
        
        triggerName = command.getAttribute("name") || null;
        action = command.getAttribute("action") || null;
        
        if (triggerName === null) {
            warn(interpreter.bus, "No name specified on trigger command.", command);
            return next;
        }
        
        if (action === null) {
            warn(interpreter.bus, "No action specified on trigger command " +
                "referencing trigger '" + triggerName + "'.", command);
            return next;
        }
        
        if (
            typeof interpreter.triggers[triggerName] === "undefined" ||
            interpreter.triggers[triggerName] === null
        ) {
            warn(interpreter.bus, "Reference to unknown trigger '" + triggerName + "'.", command);
            return next;
        }
        
        if (typeof interpreter.triggers[triggerName][action] !== "function") {
            warn(interpreter.bus, "Unknown action '" + action +
                "' on trigger command referencing trigger '" + triggerName + "'.", command);
            return next;
        }
        
        interpreter.triggers[triggerName][action](command);
        
        return next;
    }
    
    return trigger;
     
});


/* global using */

using("WSE.tools::replaceVariables", "WSE.tools::warn", "WSE.tools::log").
define("WSE.commands.var", function (replaceVars, warn, log) {
    
    "use strict";
    
    function varCommand (command, interpreter) {
        
        var key, val, lval, action, container, next;
        
        next = {doNext: true};
        
        interpreter.bus.trigger(
            "wse.interpreter.commands.var",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );
        
        key = command.getAttribute("name") || null;
        val = command.getAttribute("value") || "1";
        action = command.getAttribute("action") || "set";
        
        if (key === null) {
            warn(interpreter.bus, "Command 'var' must have a 'name' attribute.", command);
            return next;
        }
        
        container = interpreter.runVars;
        
        if (action !== "set" && !(key in container || command.getAttribute("lvalue"))) {
            warn(interpreter.bus, "Undefined variable.", command);
            return next;
        }
        
        val  = replaceVars(val,  interpreter);
        
        if (action === "set") {
            container[key] = "" + val;
            return next;
        }
        
        lval = command.getAttribute("lvalue") || container[key];
        lval = replaceVars(lval, interpreter);
        
        switch (action) {
            
            case "delete":
                delete container[key];
                break;
            
            case "increase":
                container[key] = "" + (parseFloat(lval) + parseFloat(val));
                break;
            case "decrease":
                container[key] = "" + (parseFloat(lval) - parseFloat(val));
                break;
            case "multiply":
                container[key] = "" + (parseFloat(lval) * parseFloat(val));
                break;
            case "divide":
                container[key] = "" + (parseFloat(lval) / parseFloat(val));
                break;
            case "modulus":
                container[key] = "" + (parseFloat(lval) % parseFloat(val));
                break;
    
            case "and":
                container[key] = "" + (parseFloat(lval) && parseFloat(val));
                break;
            case "or":
                container[key] = "" + (parseFloat(lval) || parseFloat(val));
                break;
            case "not":
                container[key] = parseFloat(lval) ? "0" : "1";
                break;
            
            case "is_greater":
                container[key] = parseFloat(lval) > parseFloat(val) ? "1" : "0";
                break;
            case "is_less":
                container[key] = parseFloat(lval) < parseFloat(val) ? "1" : "0";
                break;
            case "is_equal":
                container[key] = parseFloat(lval) === parseFloat(val) ? "1" : "0";
                break;
            case "not_greater":
                container[key] = parseFloat(lval) <= parseFloat(val) ? "1" : "0";
                break;
            case "not_less":
                container[key] = parseFloat(lval) >= parseFloat(val) ? "1" : "0";
                break;
            case "not_equal":
                container[key] = parseFloat(lval) !== parseFloat(val) ? "1" : "0";
                break;
            
            case "print":
                log(interpreter.bus, "Variable '" + key + "' is: " + container[key]);
                break;
            
            default:
                warn(interpreter.bus, "Unknown action '" + action +
                    "' defined on 'var' command.", command);
        }
        
        return next;
    }
    
    return varCommand;
    
});


/* global using */

using("WSE.tools::logError").define("WSE.commands.set_vars", function (logError) {
    
    "use strict";
    
    function setVars (command, interpreter) {
        
        var container = interpreter.runVars, keys, values, next;
        
        next = {doNext: true};
        keys = (command.getAttribute("names") || "").split(",");
        values = (command.getAttribute("values") || "").split(",");
        
        if (keys.length !== values.length) {
            logError(interpreter.bus, "Number of names does not match number of values " +
                "in <set_vars> command.");
            return next;
        }
        
        keys.forEach(function (key, i) {
            container[key.trim()] = "" + values[i].trim();
        });
        
        return next;
    }
    
    return setVars;
    
});


/* global using */

using().define("WSE.commands.wait", function () {
    
    "use strict";
    
    function wait (command, interpreter) {
        
        var duration, self;
        
        interpreter.bus.trigger(
            "wse.interpreter.commands.wait",
            {
                interpreter: interpreter,
                command: command
            }, 
            false
        );
        
        self = interpreter;
        duration = command.getAttribute("duration");
        
        if (duration !== null) {
            
            duration = parseInt(duration, 10);
            interpreter.waitForTimer = true;
            
            setTimeout(
                function () {
                    self.waitForTimer = false;
                }, 
                duration
            );
            
            return {
                doNext: true,
                wait: false
            };
        }
        
        return {
            doNext: true,
            wait: true
        };
    }
    
    return wait;
    
});


/* global using */

using("WSE.tools::getParsedAttribute", "WSE.tools::warn").
define("WSE.commands.with", function (getParsedAttribute, warn) {
    
    "use strict";
    
    function withCommand (command, interpreter) {
        
        var container = interpreter.runVars;
        var children = command.childNodes;
        var variableName = getParsedAttribute(command, "var", interpreter);
        var i, numberOfChildren = children.length, current;
        
        for (i = 0; i < numberOfChildren; i += 1) {
            
            current = children[i];
            
            if (shouldBeSkipped(current, interpreter)) {
                continue;
            }
            
            if (isWhen(current) && !hasCondition(current)) {
                warn(interpreter.bus, "Element 'when' without a condition. Ignored.", command);
            }
            
            if (isElse(current) && hasCondition(current)) {
                warn(interpreter.bus, "Element 'else' with a condition. Ignored.", command);
            }
            
            if (isElse(current) ||
                    isWhen(current) && hasCondition(current) &&
                    getParsedAttribute(current, "is") === container[variableName]) {
                
                interpreter.pushToCallStack();
                interpreter.currentCommands = current.childNodes;
                interpreter.scenePath.push(interpreter.index);
                interpreter.scenePath.push(i);
                interpreter.index = -1;
                interpreter.currentElement = -1;
                
                break;
            }
        }
        
        return {
            doNext: true
        };
    }
    
    return withCommand;
    
    
    function shouldBeSkipped (element, interpreter) {
        return !element.tagName || !interpreter.checkIfvar(element) ||
            (element.tagName !== "when" && element.tagName !== "else");
    }
    
    function isWhen (element) {
        return tagNameIs(element, "when");
    }
    
    function isElse (element) {
        return tagNameIs(element, "else");
    }
    
    function tagNameIs (element, name) {
        return element.tagName === name;
    }
    
    function hasCondition (element) {
        return element.hasAttribute("is");
    }
    
});


/* global using */

using().define("WSE.commands.while", function () {
    
    "use strict";
    
    function whileCommand (command, interpreter) {
        
        interpreter.index -= 1;
        interpreter.currentElement -= 1;
        interpreter.pushToCallStack();
        interpreter.currentCommands = command.childNodes;
        interpreter.scenePath.push(interpreter.index+1);
        interpreter.index = -1;
        interpreter.currentElement = -1;
        
        return {
            doNext: true
        };
    }
    
    return whileCommand;
    
});
