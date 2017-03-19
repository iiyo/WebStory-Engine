/*
    WebStory Engine (v2017.1.0)
    Build time: Sun, 19 Mar 2017 18:55:51 GMT
*/
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

window.WSE = require("./src/engine");

},{"./src/engine":122}],2:[function(require,module,exports){
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

function apply (fn, args) {
    
    if (typeof fn !== "function") {
        throw new TypeError("Argument 'fn' must be a function.");
    }
    
    return fn.apply(undefined, args);
}

module.exports = apply;

},{}],40:[function(require,module,exports){

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

},{"./apply":39,"./slice":44}],41:[function(require,module,exports){

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

},{"./auto":40,"enjoy-typechecks":46}],42:[function(require,module,exports){

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

},{"./auto":40,"./some":45}],43:[function(require,module,exports){

function free (method) {
    return Function.prototype.call.bind(method);
}

module.exports = free;

},{}],44:[function(require,module,exports){

var free = require("./free");

module.exports = free(Array.prototype.slice);

},{"./free":43}],45:[function(require,module,exports){

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

},{"./auto":40,"./free":43,"enjoy-typechecks":46}],46:[function(require,module,exports){
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

},{}],47:[function(require,module,exports){
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

},{}],48:[function(require,module,exports){
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

},{}],49:[function(require,module,exports){
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

},{"eases":68}],50:[function(require,module,exports){
arguments[4][5][0].apply(exports,arguments)
},{"dup":5}],51:[function(require,module,exports){
arguments[4][6][0].apply(exports,arguments)
},{"dup":6}],52:[function(require,module,exports){
arguments[4][7][0].apply(exports,arguments)
},{"dup":7}],53:[function(require,module,exports){
arguments[4][8][0].apply(exports,arguments)
},{"./bounce-out":55,"dup":8}],54:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"./bounce-out":55,"dup":9}],55:[function(require,module,exports){
arguments[4][10][0].apply(exports,arguments)
},{"dup":10}],56:[function(require,module,exports){
arguments[4][11][0].apply(exports,arguments)
},{"dup":11}],57:[function(require,module,exports){
arguments[4][12][0].apply(exports,arguments)
},{"dup":12}],58:[function(require,module,exports){
arguments[4][13][0].apply(exports,arguments)
},{"dup":13}],59:[function(require,module,exports){
arguments[4][14][0].apply(exports,arguments)
},{"dup":14}],60:[function(require,module,exports){
arguments[4][15][0].apply(exports,arguments)
},{"dup":15}],61:[function(require,module,exports){
arguments[4][16][0].apply(exports,arguments)
},{"dup":16}],62:[function(require,module,exports){
arguments[4][17][0].apply(exports,arguments)
},{"dup":17}],63:[function(require,module,exports){
arguments[4][18][0].apply(exports,arguments)
},{"dup":18}],64:[function(require,module,exports){
arguments[4][19][0].apply(exports,arguments)
},{"dup":19}],65:[function(require,module,exports){
arguments[4][20][0].apply(exports,arguments)
},{"dup":20}],66:[function(require,module,exports){
arguments[4][21][0].apply(exports,arguments)
},{"dup":21}],67:[function(require,module,exports){
arguments[4][22][0].apply(exports,arguments)
},{"dup":22}],68:[function(require,module,exports){
arguments[4][23][0].apply(exports,arguments)
},{"./back-in":51,"./back-in-out":50,"./back-out":52,"./bounce-in":54,"./bounce-in-out":53,"./bounce-out":55,"./circ-in":57,"./circ-in-out":56,"./circ-out":58,"./cubic-in":60,"./cubic-in-out":59,"./cubic-out":61,"./elastic-in":63,"./elastic-in-out":62,"./elastic-out":64,"./expo-in":66,"./expo-in-out":65,"./expo-out":67,"./linear":69,"./quad-in":71,"./quad-in-out":70,"./quad-out":72,"./quart-in":74,"./quart-in-out":73,"./quart-out":75,"./quint-in":77,"./quint-in-out":76,"./quint-out":78,"./sine-in":80,"./sine-in-out":79,"./sine-out":81,"dup":23}],69:[function(require,module,exports){
arguments[4][24][0].apply(exports,arguments)
},{"dup":24}],70:[function(require,module,exports){
arguments[4][25][0].apply(exports,arguments)
},{"dup":25}],71:[function(require,module,exports){
arguments[4][26][0].apply(exports,arguments)
},{"dup":26}],72:[function(require,module,exports){
arguments[4][27][0].apply(exports,arguments)
},{"dup":27}],73:[function(require,module,exports){
arguments[4][28][0].apply(exports,arguments)
},{"dup":28}],74:[function(require,module,exports){
arguments[4][29][0].apply(exports,arguments)
},{"dup":29}],75:[function(require,module,exports){
arguments[4][30][0].apply(exports,arguments)
},{"dup":30}],76:[function(require,module,exports){
arguments[4][31][0].apply(exports,arguments)
},{"dup":31}],77:[function(require,module,exports){
arguments[4][32][0].apply(exports,arguments)
},{"dup":32}],78:[function(require,module,exports){
arguments[4][33][0].apply(exports,arguments)
},{"dup":33}],79:[function(require,module,exports){
arguments[4][34][0].apply(exports,arguments)
},{"dup":34}],80:[function(require,module,exports){
arguments[4][35][0].apply(exports,arguments)
},{"dup":35}],81:[function(require,module,exports){
arguments[4][36][0].apply(exports,arguments)
},{"dup":36}],82:[function(require,module,exports){
/* global module, require */

module.exports = require("./src/xmugly.js");

},{"./src/xmugly.js":83}],83:[function(require,module,exports){
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

},{}],84:[function(require,module,exports){

var easing = require("eases");
var transform = require("transform-js").transform;

var tools = require("./tools/tools");

var warn = tools.warn;
var extractUnit = tools.extractUnit;
var applyUnits = tools.applyAssetUnits;
var anchoredValue = tools.calculateValueWithAnchor;

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

module.exports = DisplayObject;

},{"./tools/tools":128,"eases":23,"transform-js":49}],85:[function(require,module,exports){
/* eslint no-console: off */

var ajax = require("easy-ajax");
var DataBus = require("databus");

var tools = require("./tools/tools");
var loader = require("./loader");
var Keys = require("./Keys");
var Interpreter = require("./Interpreter");
var bus = require("./bus");

var truthy = tools.truthy;

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
    
    bus.trigger("wse.game.constructor", {args: args, game: this});
    
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
            
            var doResize = truthy(self.getSetting("host.stage.resize"));
            
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
    
    this.webInspectorEnabled = truthy(this.getSetting("host.inspector.enable"));
    
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

module.exports = Game;

},{"./Interpreter":86,"./Keys":87,"./bus":98,"./loader":124,"./tools/tools":128,"databus":3,"easy-ajax":38}],86:[function(require,module,exports){
/* eslint no-console: off */

var each = require("enjoy-core/each");
var find = require("enjoy-core/find");
var typechecks = require("enjoy-typechecks");

var ui = require("./tools/ui");
var bus = require("./bus");
var tools = require("./tools/tools");
var assets = require("./assets");
var Trigger = require("./Trigger");
var commands = require("./commands");
var savegames = require("./savegames");
var LoadingScreen = require("./LoadingScreen");
var LocalStorageSource = require("./dataSources/LocalStorage");

var isNull = typechecks.isNull;
var isUndefined = typechecks.isUndefined;

var warn = tools.warn;
var truthy = tools.truthy;
var logError = tools.logError;
var getSerializedNodes = tools.getSerializedNodes;

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
    
    bus.trigger("wse.interpreter.constructor", {game: game, interpreter: this});
    
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
    
    if (tagName in commands) {
        
        bus.trigger(
            "wse.interpreter.runcommand.after.command",
            {
                interpreter: this,
                command: command
            }, 
            false
        );
        
        bus.trigger('game.commands.' + tagName);
        
        return commands[tagName](command, this);
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
    
    if (assetType in assets) {
        this.assets[name] = new assets[assetType](asset, this);
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
            listenerStatus = truthy(menu.getAttribute("data-wse-listener-status"));
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

module.exports = Interpreter;

},{"./LoadingScreen":88,"./Trigger":89,"./assets":90,"./bus":98,"./commands":99,"./dataSources/LocalStorage":121,"./savegames":125,"./tools/tools":128,"./tools/ui":129,"enjoy-core/each":41,"enjoy-core/find":42,"enjoy-typechecks":46}],87:[function(require,module,exports){
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

module.exports = Keys;

},{}],88:[function(require,module,exports){

var DataBus = require("databus");
var transform = require("transform-js").transform;

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

function render (template, vars) {
    
    for (var key in vars) {
        template = insertVar(template, key, vars[key]);
    }
    
    return template;
}

function insertVar (template, name, value) {
    return ("" + template).split("{$" + name + "}").join("" + value);
}

module.exports = LoadingScreen;

},{"databus":3,"transform-js":49}],89:[function(require,module,exports){

var warn = require("./tools/tools").warn;
var commands = require("./commands");
var functions = require("./functions");

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

module.exports = Trigger;

},{"./commands":99,"./functions":123,"./tools/tools":128}],90:[function(require,module,exports){

var Audio = require("./assets/Audio");
var Background = require("./assets/Background");
var Character = require("./assets/Character");
var Composite = require("./assets/Composite");
var Curtain = require("./assets/Curtain");
var Imagepack = require("./assets/Imagepack");
var Textbox = require("./assets/Textbox");

var assets = {
    Audio: Audio,
    Background: Background,
    Character: Character,
    Curtain: Curtain,
    Imagepack: Imagepack,
    Textbox: Textbox,
    Composite: Composite
};

module.exports = assets;

},{"./assets/Audio":91,"./assets/Background":92,"./assets/Character":93,"./assets/Composite":94,"./assets/Curtain":95,"./assets/Imagepack":96,"./assets/Textbox":97}],91:[function(require,module,exports){
/* global using */

var tools = require("../tools/tools");
var Howl = require("howler").Howl;

var warn = tools.warn;
var truthy = tools.truthy;

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
    this.autopause = truthy(asset.getAttribute("autopause"));
    this.loop = truthy(asset.getAttribute("loop"));
    this.fade = truthy(asset.getAttribute("fade"));
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

module.exports = Audio;

},{"../tools/tools":128,"howler":47}],92:[function(require,module,exports){

var warn = require("../tools/tools").warn;
var DisplayObject = require("../DisplayObject");

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

module.exports = Background;

},{"../DisplayObject":84,"../tools/tools":128}],93:[function(require,module,exports){

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

module.exports = Character;

},{}],94:[function(require,module,exports){

var easing = require("eases");
var transform = require("transform-js").transform;

var warn = require("../tools/tools").warn;
var DisplayObject = require("../DisplayObject");

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

module.exports = Composite;

},{"../DisplayObject":84,"../tools/tools":128,"eases":23,"transform-js":49}],95:[function(require,module,exports){
/* global using */

var warn = require("../tools/tools").warn;
var DisplayObject = require("../DisplayObject");

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

module.exports = Curtain;

},{"../DisplayObject":84,"../tools/tools":128}],96:[function(require,module,exports){
/* global using, console */

var easing = require("eases");
var transform = require("transform-js").transform;

var warn = require("../tools/tools").warn;
var DisplayObject = require("../DisplayObject");

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

module.exports = Imagepack;

},{"../DisplayObject":84,"../tools/tools":128,"eases":23,"transform-js":49}],97:[function(require,module,exports){

var transform = require("transform-js").transform;
var classes = require("class-manipulator").list;

var tools = require("../tools/tools");
var reveal = require("../tools/reveal");
var DisplayObject = require("../DisplayObject");

var truthy = tools.truthy;
var replaceVars = tools.replaceVariables;

function Textbox (asset) {
    
    this.z = 1000;
    
    DisplayObject.apply(this, arguments);
    
    var element, nameElement, textElement;
    
    this.type = asset.getAttribute("behaviour") || "adv";
    this.showNames = truthy(asset.getAttribute("namebox"));
    this.nltobr = truthy(asset.getAttribute("nltobr"));
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

module.exports = Textbox;

},{"../DisplayObject":84,"../tools/reveal":127,"../tools/tools":128,"class-manipulator":2,"transform-js":49}],98:[function(require,module,exports){

var DataBus = require("databus");

module.exports = new DataBus();

},{"databus":3}],99:[function(require,module,exports){

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

},{"./commands/alert":100,"./commands/break":101,"./commands/choice":102,"./commands/confirm":103,"./commands/do":104,"./commands/fn":105,"./commands/global":106,"./commands/globalize":107,"./commands/goto":108,"./commands/line":109,"./commands/localize":110,"./commands/prompt":111,"./commands/restart":112,"./commands/set_vars":113,"./commands/sub":114,"./commands/trigger":115,"./commands/var":116,"./commands/wait":117,"./commands/while":118,"./commands/with":119}],100:[function(require,module,exports){

var ui = require("../tools/ui");
var tools = require("../tools/tools");

var replaceVars = tools.replaceVariables;

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

module.exports = alert;

},{"../tools/tools":128,"../tools/ui":129}],101:[function(require,module,exports){

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

},{}],102:[function(require,module,exports){

var tools = require("../tools/tools");
var DisplayObject = require("../DisplayObject");

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

module.exports = choice;

},{"../DisplayObject":84,"../tools/tools":128}],103:[function(require,module,exports){

var ui = require("../tools/ui");

module.exports = ui.makeInputFn("confirm");

},{"../tools/ui":129}],104:[function(require,module,exports){

var warn = require("../tools/tools").warn;

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

module.exports = doCommand;

},{"../tools/tools":128}],105:[function(require,module,exports){

var warn = require("../tools/tools").warn;
var functions = require("../functions");

function fn (command, interpreter) {
    
    var name, varName, ret;
    
    name = command.getAttribute("name") || null;
    varName = command.getAttribute("tovar") || null;
    
    if (typeof name !== "string") {
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

module.exports = fn;

},{"../functions":123,"../tools/tools":128}],106:[function(require,module,exports){

var warn = require("../tools/tools").warn;

function globalCommand (command, interpreter) {
    
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

module.exports = globalCommand;

},{"../tools/tools":128}],107:[function(require,module,exports){

var warn = require("../tools/tools").warn;

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

module.exports = globalize;

},{"../tools/tools":128}],108:[function(require,module,exports){

var tools = require("../tools/tools");

var logError = tools.logError;
var replaceVars = tools.replaceVariables;

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

module.exports = gotoCommand;

},{"../tools/tools":128}],109:[function(require,module,exports){

var tools = require("../tools/tools");

var warn = tools.warn;
var getSerializedNodes = tools.getSerializedNodes;

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

module.exports = line;

},{"../tools/tools":128}],110:[function(require,module,exports){

var warn = require("../tools/tools").warn;

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

module.exports = localize;

},{"../tools/tools":128}],111:[function(require,module,exports){

var ui = require("../tools/ui");

module.exports = ui.makeInputFn("prompt");

},{"../tools/ui":129}],112:[function(require,module,exports){

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

module.exports = restart;

},{}],113:[function(require,module,exports){

var logError = require("../tools/tools").logError;

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

module.exports = setVars;

},{"../tools/tools":128}],114:[function(require,module,exports){

var tools = require("../tools/tools");
var setVars = require("./set_vars");

var log = tools.log;
var warn = tools.warn;
var logError = tools.logError;
var replaceVars = tools.replaceVariables;

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

module.exports = sub;

},{"../tools/tools":128,"./set_vars":113}],115:[function(require,module,exports){

var warn = require("../tools/tools").warn;

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

module.exports = trigger;

},{"../tools/tools":128}],116:[function(require,module,exports){

var tools = require("../tools/tools");

var log = tools.log;
var warn = tools.warn;
var replaceVars = tools.replaceVariables;

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

module.exports = varCommand;

},{"../tools/tools":128}],117:[function(require,module,exports){

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

module.exports = wait;

},{}],118:[function(require,module,exports){

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

module.exports = whileCommand;

},{}],119:[function(require,module,exports){

var tools = require("../tools/tools");

var warn = tools.warn;
var getParsedAttribute = tools.getParsedAttribute;

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

module.exports = withCommand;

},{"../tools/tools":128}],120:[function(require,module,exports){

var LocalStorageDataSource = require("./dataSources/LocalStorage");

var dataSources = {
    LocalStorage: LocalStorageDataSource
};

module.exports = dataSources;

},{"./dataSources/LocalStorage":121}],121:[function(require,module,exports){

var Dict = require("string-dict");

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

module.exports = LocalStorageDataSource;

},{"string-dict":48}],122:[function(require,module,exports){

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

},{"./Game":85,"./assets":90,"./bus":98,"./commands":99,"./dataSources":120,"./functions":123}],123:[function(require,module,exports){

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

module.exports = functions;

},{}],124:[function(require,module,exports){

var ajax = require("easy-ajax");
var compile = require("./tools/compile").compile;

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

module.exports = {
    generateGameFile: generateGameFile,
    generateFromString: generateFromString
};

},{"./tools/compile":126,"easy-ajax":38}],125:[function(require,module,exports){

var each = require("enjoy-core/each");
var typechecks = require("enjoy-typechecks");

var engine = require("./engine");
var tools = require("./tools/tools");

var isNull = typechecks.isNull;
var isUndefined = typechecks.isUndefined;

var warn = tools.warn;
var truthy = tools.truthy;

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
            rem = truthy(cur.getAttribute("data-wse-remove"));
            
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
            engine.commands.choice(com, interpreter);
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

module.exports = {
    save: save,
    load: load,
    remove: remove,
    getSavegameList: getSavegameList
};

},{"./engine":122,"./tools/tools":128,"enjoy-core/each":41,"enjoy-typechecks":46}],126:[function(require,module,exports){
//
// A module containing functions for compiling a simple command language to the old
// WSE command elements.
//

var xmugly = require("xmugly");

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


//
// Compiles "(( c: I say something ))" to <line s="c">I say something</line>''.
//
function compileSpeech (text) {
    return text.replace(
        /([\s]*)\(\([\s]*([a-zA-Z0-9_-]+):[\s]*((.|[\s])*?)([\s]*)\)\)/g,
        '$1<line s="$2">$3</line>$5'
    );
}

module.exports = {
    compile: compile
};

},{"xmugly":82}],127:[function(require,module,exports){

var transform = require("transform-js").transform;

function reveal (element, args) {
    
    args = args || {};
    
    markCharacters(element);
    hideCharacters(element);
    return revealCharacters(element, args.speed || 50, args.onFinish || null);
}

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

module.exports = reveal;

},{"transform-js":49}],128:[function(require,module,exports){

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

//
// ## [function] truthy
//
// A function that checks whether an attribute value is considered truthy by
// the engine. Truthy values are `true` and `yes`.
//
//     truthy :: any -> boolean
//
tools.truthy = function (value) {
    return ["true", "yes"].indexOf(value) >= 0;
};

module.exports = tools;

},{}],129:[function(require,module,exports){

var tools = require("../tools/tools");

var warn = tools.warn;
var replaceVars = tools.replaceVariables;

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

module.exports = ui;

},{"../tools/tools":128}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzcy1tYW5pcHVsYXRvci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kYXRhYnVzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2RhdGFidXMvc3JjL2RhdGFidXMuanMiLCJub2RlX21vZHVsZXMvZWFzZXMvYmFjay1pbi1vdXQuanMiLCJub2RlX21vZHVsZXMvZWFzZXMvYmFjay1pbi5qcyIsIm5vZGVfbW9kdWxlcy9lYXNlcy9iYWNrLW91dC5qcyIsIm5vZGVfbW9kdWxlcy9lYXNlcy9ib3VuY2UtaW4tb3V0LmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL2JvdW5jZS1pbi5qcyIsIm5vZGVfbW9kdWxlcy9lYXNlcy9ib3VuY2Utb3V0LmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL2NpcmMtaW4tb3V0LmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL2NpcmMtaW4uanMiLCJub2RlX21vZHVsZXMvZWFzZXMvY2lyYy1vdXQuanMiLCJub2RlX21vZHVsZXMvZWFzZXMvY3ViaWMtaW4tb3V0LmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL2N1YmljLWluLmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL2N1YmljLW91dC5qcyIsIm5vZGVfbW9kdWxlcy9lYXNlcy9lbGFzdGljLWluLW91dC5qcyIsIm5vZGVfbW9kdWxlcy9lYXNlcy9lbGFzdGljLWluLmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL2VsYXN0aWMtb3V0LmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL2V4cG8taW4tb3V0LmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL2V4cG8taW4uanMiLCJub2RlX21vZHVsZXMvZWFzZXMvZXhwby1vdXQuanMiLCJub2RlX21vZHVsZXMvZWFzZXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZWFzZXMvbGluZWFyLmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL3F1YWQtaW4tb3V0LmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL3F1YWQtaW4uanMiLCJub2RlX21vZHVsZXMvZWFzZXMvcXVhZC1vdXQuanMiLCJub2RlX21vZHVsZXMvZWFzZXMvcXVhcnQtaW4tb3V0LmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL3F1YXJ0LWluLmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL3F1YXJ0LW91dC5qcyIsIm5vZGVfbW9kdWxlcy9lYXNlcy9xdWludC1pbi1vdXQuanMiLCJub2RlX21vZHVsZXMvZWFzZXMvcXVpbnQtaW4uanMiLCJub2RlX21vZHVsZXMvZWFzZXMvcXVpbnQtb3V0LmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL3NpbmUtaW4tb3V0LmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL3NpbmUtaW4uanMiLCJub2RlX21vZHVsZXMvZWFzZXMvc2luZS1vdXQuanMiLCJub2RlX21vZHVsZXMvZWFzeS1hamF4L2Vhc3ktYWpheC5qcyIsIm5vZGVfbW9kdWxlcy9lYXN5LWFqYXgvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZW5qb3ktY29yZS9hcHBseS5qcyIsIm5vZGVfbW9kdWxlcy9lbmpveS1jb3JlL2F1dG8uanMiLCJub2RlX21vZHVsZXMvZW5qb3ktY29yZS9lYWNoLmpzIiwibm9kZV9tb2R1bGVzL2Vuam95LWNvcmUvZmluZC5qcyIsIm5vZGVfbW9kdWxlcy9lbmpveS1jb3JlL2ZyZWUuanMiLCJub2RlX21vZHVsZXMvZW5qb3ktY29yZS9zbGljZS5qcyIsIm5vZGVfbW9kdWxlcy9lbmpveS1jb3JlL3NvbWUuanMiLCJub2RlX21vZHVsZXMvZW5qb3ktdHlwZWNoZWNrcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9ob3dsZXIvaG93bGVyLmpzIiwibm9kZV9tb2R1bGVzL3N0cmluZy1kaWN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RyYW5zZm9ybS1qcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy94bXVnbHkvaW5kZXguanMiLCJub2RlX21vZHVsZXMveG11Z2x5L3NyYy94bXVnbHkuanMiLCJzcmMvRGlzcGxheU9iamVjdC5qcyIsInNyYy9HYW1lLmpzIiwic3JjL0ludGVycHJldGVyLmpzIiwic3JjL0tleXMuanMiLCJzcmMvTG9hZGluZ1NjcmVlbi5qcyIsInNyYy9UcmlnZ2VyLmpzIiwic3JjL2Fzc2V0cy5qcyIsInNyYy9hc3NldHMvQXVkaW8uanMiLCJzcmMvYXNzZXRzL0JhY2tncm91bmQuanMiLCJzcmMvYXNzZXRzL0NoYXJhY3Rlci5qcyIsInNyYy9hc3NldHMvQ29tcG9zaXRlLmpzIiwic3JjL2Fzc2V0cy9DdXJ0YWluLmpzIiwic3JjL2Fzc2V0cy9JbWFnZXBhY2suanMiLCJzcmMvYXNzZXRzL1RleHRib3guanMiLCJzcmMvYnVzLmpzIiwic3JjL2NvbW1hbmRzLmpzIiwic3JjL2NvbW1hbmRzL2FsZXJ0LmpzIiwic3JjL2NvbW1hbmRzL2JyZWFrLmpzIiwic3JjL2NvbW1hbmRzL2Nob2ljZS5qcyIsInNyYy9jb21tYW5kcy9jb25maXJtLmpzIiwic3JjL2NvbW1hbmRzL2RvLmpzIiwic3JjL2NvbW1hbmRzL2ZuLmpzIiwic3JjL2NvbW1hbmRzL2dsb2JhbC5qcyIsInNyYy9jb21tYW5kcy9nbG9iYWxpemUuanMiLCJzcmMvY29tbWFuZHMvZ290by5qcyIsInNyYy9jb21tYW5kcy9saW5lLmpzIiwic3JjL2NvbW1hbmRzL2xvY2FsaXplLmpzIiwic3JjL2NvbW1hbmRzL3Byb21wdC5qcyIsInNyYy9jb21tYW5kcy9yZXN0YXJ0LmpzIiwic3JjL2NvbW1hbmRzL3NldF92YXJzLmpzIiwic3JjL2NvbW1hbmRzL3N1Yi5qcyIsInNyYy9jb21tYW5kcy90cmlnZ2VyLmpzIiwic3JjL2NvbW1hbmRzL3Zhci5qcyIsInNyYy9jb21tYW5kcy93YWl0LmpzIiwic3JjL2NvbW1hbmRzL3doaWxlLmpzIiwic3JjL2NvbW1hbmRzL3dpdGguanMiLCJzcmMvZGF0YVNvdXJjZXMuanMiLCJzcmMvZGF0YVNvdXJjZXMvTG9jYWxTdG9yYWdlLmpzIiwic3JjL2VuZ2luZS5qcyIsInNyYy9mdW5jdGlvbnMuanMiLCJzcmMvbG9hZGVyLmpzIiwic3JjL3NhdmVnYW1lcy5qcyIsInNyYy90b29scy9jb21waWxlLmpzIiwic3JjL3Rvb2xzL3JldmVhbC5qcyIsInNyYy90b29scy90b29scy5qcyIsInNyYy90b29scy91aS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BiQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckhBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeDBDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pNQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG53aW5kb3cuV1NFID0gcmVxdWlyZShcIi4vc3JjL2VuZ2luZVwiKTtcbiIsIi8vXG4vLyAjIGNsYXNzLW1hbmlwdWxhdG9yXG4vL1xuLy8gQSBjaGFpbmFibGUgd3JhcHBlciBBUEkgZm9yIG1hbmlwdWxhdGluZyBhIERPTSBFbGVtZW50J3MgY2xhc3NlcyBvciBjbGFzcyBzdHJpbmdzLlxuLy9cblxuLyogZ2xvYmFsIG1vZHVsZSAqL1xuXG4vL1xuLy8gIyMgUHVibGljIEFQSVxuLy9cblxuLy9cbi8vICoqbGlzdChlbGVtZW50KSAvIGxpc3QoY2xhc3NTdHJpbmcpKipcbi8vXG4vLyBDcmVhdGVzIGEgY2hhaW5hYmxlIEFQSSBmb3IgbWFuaXB1bGF0aW5nIGFuIGVsZW1lbnQncyBsaXN0IG9mIGNsYXNzZXMuIE5vIGNoYW5nZXNcbi8vIGFyZSBtYWRlIHRvIHRoZSBET00gRWxlbWVudCB1bmxlc3MgYC5hcHBseSgpYCBpcyBjYWxsZWQuXG4vL1xuLy8gICAgIERPTUVsZW1lbnR8c3RyaW5nIC0+IG9iamVjdFxuLy9cblxuZnVuY3Rpb24gbGlzdCAoZWxlbWVudCkge1xuICAgIFxuICAgIGVsZW1lbnQgPSB0eXBlb2YgZWxlbWVudCA9PT0gXCJvYmplY3RcIiA/IGVsZW1lbnQgOiBkdW1teShlbGVtZW50KTtcbiAgICBcbiAgICB2YXIgY2xhc3NlcyA9IHBhcnNlKGVsZW1lbnQpLCBjb250cm9scztcbiAgICBcbi8vXG4vLyAqKi5hcHBseSgpKipcbi8vXG4vLyBBcHBsaWVzIGNsYXNzIGxpc3QgdG8gdGhlIHNvdXJjZSBlbGVtZW50LlxuLy9cbi8vICAgICB2b2lkIC0+IG9iamVjdFxuLy9cbiAgICBcbiAgICBmdW5jdGlvbiBhcHBseSAoKSB7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgdG9TdHJpbmcoKSk7XG4gICAgICAgIHJldHVybiBjb250cm9scztcbiAgICB9XG4gICAgXG4vL1xuLy8gKiouYWRkKG5hbWUpKipcbi8vXG4vLyBBZGRzIGEgY2xhc3MgdG8gdGhlIGVsZW1lbnQncyBsaXN0IG9mIGNsYXNzIG5hbWVzLlxuLy9cbi8vICAgICBzdHJpbmcgLT4gb2JqZWN0XG4vL1xuICAgIFxuICAgIGZ1bmN0aW9uIGFkZCAobmFtZSkge1xuICAgICAgICBcbiAgICAgICAgaWYgKGhhc1NwYWNlcyhuYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIGFkZE1hbnkoY2xhc3NTdHJpbmdUb0FycmF5KG5hbWUpKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKCFoYXMobmFtZSkpIHtcbiAgICAgICAgICAgIGNsYXNzZXMucHVzaChuYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGNvbnRyb2xzO1xuICAgIH1cbiAgICBcbi8vXG4vLyAqKi5hZGRNYW55KG5hbWVzKSoqXG4vL1xuLy8gQWRkcyBtYW55IGNsYXNzZXMgdG8gdGhlIGxpc3QgYXQgb25jZS5cbi8vXG4vLyAgICAgW3N0cmluZ10gLT4gb2JqZWN0XG4vL1xuICAgIFxuICAgIGZ1bmN0aW9uIGFkZE1hbnkgKG5ld0NsYXNzZXMpIHtcbiAgICAgICAgXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShuZXdDbGFzc2VzKSkge1xuICAgICAgICAgICAgcmV0dXJuIGFkZChuZXdDbGFzc2VzKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgbmV3Q2xhc3Nlcy5mb3JFYWNoKGFkZCk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gY29udHJvbHM7XG4gICAgfVxuICAgIFxuLy9cbi8vICoqLmhhcyhuYW1lKSoqXG4vL1xuLy8gQ2hlY2tzIHdoZXRoZXIgYSBjbGFzcyBpcyBpbiB0aGUgZWxlbWVudCdzIGxpc3Qgb2YgY2xhc3MgbmFtZXMuXG4vL1xuLy8gICAgIHN0cmluZyAtPiBib29sZWFuXG4vL1xuICAgIFxuICAgIGZ1bmN0aW9uIGhhcyAobmFtZSkge1xuICAgICAgICBcbiAgICAgICAgaWYgKGhhc1NwYWNlcyhuYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIGhhc0FsbChuYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGNsYXNzZXMuaW5kZXhPZihuYW1lKSA+PSAwO1xuICAgIH1cbiAgICBcbi8vXG4vLyAqKi5oYXNTb21lKG5hbWVzKSoqXG4vL1xuLy8gQ2hlY2tzIHdoZXRoZXIgdGhlIGxpc3QgY29udGFpbnMgYXQgbGVhc3Qgb25lIG9mIHRoZSBzdXBwbGllZCBjbGFzc2VzLlxuLy9cbi8vICAgICBbc3RyaW5nXSAtPiBib29sZWFuXG4vL1xuICAgIFxuICAgIGZ1bmN0aW9uIGhhc1NvbWUgKG5hbWVzKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KG5hbWVzKSA/XG4gICAgICAgICAgICBuYW1lcy5zb21lKGhhcykgOlxuICAgICAgICAgICAgaGFzU29tZShjbGFzc1N0cmluZ1RvQXJyYXkobmFtZXMpKTtcbiAgICB9XG4gICAgXG4vL1xuLy8gKiouaGFzQWxsKG5hbWVzKSoqXG4vL1xuLy8gQ2hlY2tzIHdoZXRoZXIgdGhlIGxpc3QgY29udGFpbnMgYWxsIG9mIHRoZSBzdXBwbGllZCBjbGFzc2VzLlxuLy9cbi8vICAgICBbc3RyaW5nXSAtPiBib29sZWFuXG4vL1xuICAgIFxuICAgIGZ1bmN0aW9uIGhhc0FsbCAobmFtZXMpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkobmFtZXMpID9cbiAgICAgICAgICAgIG5hbWVzLmV2ZXJ5KGhhcykgOlxuICAgICAgICAgICAgaGFzQWxsKGNsYXNzU3RyaW5nVG9BcnJheShuYW1lcykpO1xuICAgIH1cbiAgICBcbi8vXG4vLyAqKi5yZW1vdmUobmFtZSkqKlxuLy9cbi8vIFJlbW92ZXMgYSBjbGFzcyBmcm9tIHRoZSBlbGVtZW50J3MgbGlzdCBvZiBjbGFzcyBuYW1lcy5cbi8vXG4vLyAgICAgc3RyaW5nIC0+IG9iamVjdFxuLy9cbiAgICBcbiAgICBmdW5jdGlvbiByZW1vdmUgKG5hbWUpIHtcbiAgICAgICAgXG4gICAgICAgIGlmIChoYXNTcGFjZXMobmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiByZW1vdmVNYW55KGNsYXNzU3RyaW5nVG9BcnJheShuYW1lKSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChoYXMobmFtZSkpIHtcbiAgICAgICAgICAgIGNsYXNzZXMuc3BsaWNlKGNsYXNzZXMuaW5kZXhPZihuYW1lKSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBjb250cm9scztcbiAgICB9XG4gICAgXG4vL1xuLy8gKioucmVtb3ZlTWFueShuYW1lcykqKlxuLy9cbi8vIFJlbW92ZXMgbWFueSBjbGFzc2VzIGZyb20gdGhlIGxpc3QgYXQgb25jZS5cbi8vXG4vLyAgICAgW3N0cmluZ10gLT4gb2JqZWN0XG4vL1xuICAgIFxuICAgIGZ1bmN0aW9uIHJlbW92ZU1hbnkgKHRvUmVtb3ZlKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkodG9SZW1vdmUpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVtb3ZlKHRvUmVtb3ZlKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdG9SZW1vdmUuZm9yRWFjaChyZW1vdmUpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGNvbnRyb2xzO1xuICAgIH1cbiAgICBcbi8vXG4vLyAqKi50b2dnbGUobmFtZSkqKlxuLy9cbi8vIFJlbW92ZXMgYSBjbGFzcyBmcm9tIHRoZSBjbGFzcyBsaXN0IHdoZW4gaXQncyBwcmVzZW50IG9yIGFkZHMgaXQgdG8gdGhlIGxpc3Qgd2hlbiBpdCdzIG5vdC5cbi8vXG4vLyAgICAgc3RyaW5nIC0+IG9iamVjdFxuLy9cbiAgICBcbiAgICBmdW5jdGlvbiB0b2dnbGUgKG5hbWUpIHtcbiAgICAgICAgXG4gICAgICAgIGlmIChoYXNTcGFjZXMobmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0b2dnbGVNYW55KGNsYXNzU3RyaW5nVG9BcnJheShuYW1lKSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiAoaGFzKG5hbWUpID8gcmVtb3ZlKG5hbWUpIDogYWRkKG5hbWUpKTtcbiAgICB9XG4gICAgXG4vL1xuLy8gKioudG9nZ2xlTWFueShuYW1lcykqKlxuLy9cbi8vIFRvZ2dsZXMgbWFueSBjbGFzc2VzIGF0IG9uY2UuXG4vL1xuLy8gICAgIFtzdHJpbmddIC0+IG9iamVjdFxuLy9cbiAgICBcbiAgICBmdW5jdGlvbiB0b2dnbGVNYW55IChuYW1lcykge1xuICAgICAgICBcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkobmFtZXMpKSB7XG4gICAgICAgICAgICBuYW1lcy5mb3JFYWNoKHRvZ2dsZSk7XG4gICAgICAgICAgICByZXR1cm4gY29udHJvbHM7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0b2dnbGVNYW55KGNsYXNzU3RyaW5nVG9BcnJheShuYW1lcykpO1xuICAgIH1cbiAgICBcbi8vXG4vLyAqKi50b0FycmF5KCkqKlxuLy9cbi8vIENyZWF0ZXMgYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGxpc3QncyBjbGFzcyBuYW1lcy5cbi8vXG4vLyAgICAgdm9pZCAtPiBbc3RyaW5nXVxuLy9cbiAgICBcbiAgICBmdW5jdGlvbiB0b0FycmF5ICgpIHtcbiAgICAgICAgcmV0dXJuIGNsYXNzZXMuc2xpY2UoKTtcbiAgICB9XG4gICAgXG4vL1xuLy8gKioudG9TdHJpbmcoKSoqXG4vL1xuLy8gUmV0dXJucyBhIHN0cmluZyBjb250YWluaW5nIGFsbCB0aGUgY2xhc3NlcyBpbiB0aGUgbGlzdCBzZXBhcmF0ZWQgYnkgYSBzcGFjZSBjaGFyYWN0ZXIuXG4vL1xuICAgIFxuICAgIGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgICAgICAgcmV0dXJuIGNsYXNzZXMuam9pbihcIiBcIik7XG4gICAgfVxuICAgIFxuLy9cbi8vICoqLmNvcHlUbyhvdGhlckVsZW1lbnQpKipcbi8vXG4vLyBDcmVhdGVzIGEgbmV3IGVtcHR5IGxpc3QgZm9yIGFub3RoZXIgZWxlbWVudCBhbmQgY29waWVzIHRoZSBzb3VyY2UgZWxlbWVudCdzIGNsYXNzIGxpc3QgdG8gaXQuXG4vL1xuLy8gICAgIERPTSBFbGVtZW50IC0+IG9iamVjdFxuLy9cbiAgICBcbiAgICBmdW5jdGlvbiBjb3B5VG8gKG90aGVyRWxlbWVudCkge1xuICAgICAgICByZXR1cm4gbGlzdChvdGhlckVsZW1lbnQpLmNsZWFyKCkuYWRkTWFueShjbGFzc2VzKTtcbiAgICB9XG4gICAgXG4vL1xuLy8gKiouY2xlYXIoKSoqXG4vL1xuLy8gUmVtb3ZlcyBhbGwgY2xhc3NlcyBmcm9tIHRoZSBsaXN0LlxuLy9cbi8vICAgICB2b2lkIC0+IG9iamVjdFxuLy9cbiAgICBcbiAgICBmdW5jdGlvbiBjbGVhciAoKSB7XG4gICAgICAgIGNsYXNzZXMubGVuZ3RoID0gMDtcbiAgICAgICAgcmV0dXJuIGNvbnRyb2xzO1xuICAgIH1cbiAgICBcbi8vXG4vLyAqKi5maWx0ZXIoZm4pKipcbi8vXG4vLyBSZW1vdmVzIHRob3NlIGNsYXNzIG5hbWVzIGZyb20gdGhlIGxpc3QgdGhhdCBmYWlsIGEgcHJlZGljYXRlIHRlc3QgZnVuY3Rpb24uXG4vL1xuLy8gICAgIChzdHJpbmcgLT4gbnVtYmVyIC0+IG9iamVjdCAtPiBib29sZWFuKSAtPiBvYmplY3Rcbi8vXG4gICAgXG4gICAgZnVuY3Rpb24gZmlsdGVyIChmbikge1xuICAgICAgICBcbiAgICAgICAgY2xhc3Nlcy5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lLCBpKSB7XG4gICAgICAgICAgICBpZiAoIWZuKG5hbWUsIGksIGNvbnRyb2xzKSkge1xuICAgICAgICAgICAgICAgIHJlbW92ZShuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gY29udHJvbHM7XG4gICAgfVxuICAgIFxuLy9cbi8vICoqLnNvcnQoW2ZuXSkqKlxuLy9cbi8vIFNvcnRzIHRoZSBuYW1lcyBpbiBwbGFjZS4gQSBjdXN0b20gc29ydCBmdW5jdGlvbiBjYW4gYmUgYXBwbGllZCBvcHRpb25hbGx5LiBJdCBtdXN0IGhhdmVcbi8vIHRoZSBzYW1lIHNpZ25hdHVyZSBhcyBKUyBBcnJheS5wcm90b3R5cGUuc29ydCgpIGNhbGxiYWNrcy5cbi8vXG4vLyAgICAgdm9pZHxmdW5jdGlvbiAtPiBvYmplY3Rcbi8vXG4gICAgXG4gICAgZnVuY3Rpb24gc29ydCAoZm4pIHtcbiAgICAgICAgY2xhc3Nlcy5zb3J0KGZuKTtcbiAgICAgICAgcmV0dXJuIGNvbnRyb2xzO1xuICAgIH1cbiAgICBcbi8vXG4vLyAqKi5zaXplKCkqKlxuLy9cbi8vIFJldHVybnMgdGhlIG51bWJlciBvZiBjbGFzc2VzIGluIHRoZSBsaXN0LlxuLy9cbi8vICAgICB2b2lkIC0+IG51bWJlclxuLy9cbiAgICBcbiAgICBmdW5jdGlvbiBzaXplICgpIHtcbiAgICAgICAgcmV0dXJuIGNsYXNzZXMubGVuZ3RoO1xuICAgIH1cbiAgICBcbiAgICBjb250cm9scyA9IHtcbiAgICAgICAgYWRkOiBhZGQsXG4gICAgICAgIGFkZE1hbnk6IGFkZE1hbnksXG4gICAgICAgIGhhczogaGFzLFxuICAgICAgICBoYXNTb21lOiBoYXNTb21lLFxuICAgICAgICBoYXNBbGw6IGhhc0FsbCxcbiAgICAgICAgcmVtb3ZlOiByZW1vdmUsXG4gICAgICAgIHJlbW92ZU1hbnk6IHJlbW92ZU1hbnksXG4gICAgICAgIHRvZ2dsZTogdG9nZ2xlLFxuICAgICAgICB0b2dnbGVNYW55OiB0b2dnbGVNYW55LFxuICAgICAgICBhcHBseTogYXBwbHksXG4gICAgICAgIGNsZWFyOiBjbGVhcixcbiAgICAgICAgY29weVRvOiBjb3B5VG8sXG4gICAgICAgIHRvQXJyYXk6IHRvQXJyYXksXG4gICAgICAgIHRvU3RyaW5nOiB0b1N0cmluZyxcbiAgICAgICAgZmlsdGVyOiBmaWx0ZXIsXG4gICAgICAgIHNvcnQ6IHNvcnQsXG4gICAgICAgIHNpemU6IHNpemVcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiBjb250cm9scztcbn1cblxuLy9cbi8vICoqYWRkKGVsZW1lbnQsIG5hbWUpKipcbi8vXG4vLyBBZGRzIGEgY2xhc3MgdG8gYSBET00gRWxlbWVudC5cbi8vXG4vLyAgICBET00gRWxlbWVudCAtPiBzdHJpbmcgLT4gb2JqZWN0XG4vL1xuXG5mdW5jdGlvbiBhZGQgKGVsZW1lbnQsIG5hbWUpIHtcbiAgICByZXR1cm4gbGlzdChlbGVtZW50KS5hZGQobmFtZSkuYXBwbHkoKTtcbn1cblxuLy9cbi8vICoqcmVtb3ZlKGVsZW1lbnQsIG5hbWUpKipcbi8vXG4vLyBSZW1vdmVzIGEgY2xhc3MgZnJvbSBhIERPTSBFbGVtZW50LlxuLy9cbi8vICAgICBET00gRWxlbWVudCAtPiBzdHJpbmcgLT4gb2JqZWN0XG4vL1xuXG5mdW5jdGlvbiByZW1vdmUgKGVsZW1lbnQsIG5hbWUpIHtcbiAgICByZXR1cm4gbGlzdChlbGVtZW50KS5yZW1vdmUobmFtZSkuYXBwbHkoKTtcbn1cblxuLy9cbi8vICoqdG9nZ2xlKGVsZW1lbnQsIG5hbWUpKipcbi8vXG4vLyBSZW1vdmVzIGEgY2xhc3MgZnJvbSBhIERPTSBFbGVtZW50IHdoZW4gaXQgaGFzIHRoZSBjbGFzcyBvciBhZGRzIGl0IHdoZW4gdGhlIGVsZW1lbnQgZG9lc24ndFxuLy8gaGF2ZSBpdC5cbi8vXG4vLyAgICAgRE9NRWxlbWVudCAtPiBzdHJpbmcgLT4gb2JqZWN0XG4vL1xuXG5mdW5jdGlvbiB0b2dnbGUgKGVsZW1lbnQsIG5hbWUpIHtcbiAgICByZXR1cm4gbGlzdChlbGVtZW50KS50b2dnbGUobmFtZSkuYXBwbHkoKTtcbn1cblxuLy9cbi8vICoqaGFzKGVsZW1lbnQsIG5hbWUpKipcbi8vXG4vLyBDaGVja3Mgd2hldGhlciBhIERPTSBFbGVtZW50IGhhcyBhIGNsYXNzLlxuLy9cbi8vICAgICBET01FbGVtZW50IC0+IHN0cmluZyAtPiBib29sZWFuXG4vL1xuXG5mdW5jdGlvbiBoYXMgKGVsZW1lbnQsIG5hbWUpIHtcbiAgICByZXR1cm4gbGlzdChlbGVtZW50KS5oYXMobmFtZSk7XG59XG5cbi8vXG4vLyAjIyBFeHBvcnRlZCBmdW5jdGlvbnNcbi8vXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGFkZDogYWRkLFxuICAgIHJlbW92ZTogcmVtb3ZlLFxuICAgIHRvZ2dsZTogdG9nZ2xlLFxuICAgIGhhczogaGFzLFxuICAgIGxpc3Q6IGxpc3Rcbn07XG5cblxuLy9cbi8vICMjIFByaXZhdGUgZnVuY3Rpb25zXG4vL1xuXG4vL1xuLy8gRXh0cmFjdHMgdGhlIGNsYXNzIG5hbWVzIGZyb20gYSBET00gRWxlbWVudCBhbmQgcmV0dXJucyB0aGVtIGluIGFuIGFycmF5LlxuLy9cbi8vICAgICBET01FbGVtZW50IC0+IFtzdHJpbmddXG4vL1xuXG5mdW5jdGlvbiBwYXJzZSAoZWxlbWVudCkge1xuICAgIHJldHVybiBjbGFzc1N0cmluZ1RvQXJyYXkoZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiKTtcbn1cblxuLy9cbi8vICAgICBzdHJpbmcgLT4gW3N0cmluZ11cbi8vXG5cbmZ1bmN0aW9uIGNsYXNzU3RyaW5nVG9BcnJheSAoY2xhc3NTdHJpbmcpIHtcbiAgICByZXR1cm4gKFwiXCIgKyBjbGFzc1N0cmluZykucmVwbGFjZSgvXFxzKy8sIFwiIFwiKS50cmltKCkuc3BsaXQoXCIgXCIpLmZpbHRlcihzdHJpbmdOb3RFbXB0eSk7XG59XG5cbi8vXG4vLyAgICAgc3RyaW5nIC0+IGJvb2xlYW5cbi8vXG5cbmZ1bmN0aW9uIHN0cmluZ05vdEVtcHR5IChzdHIpIHtcbiAgICByZXR1cm4gc3RyICE9PSBcIlwiO1xufVxuXG4vL1xuLy8gICAgIHN0cmluZyAtPiBib29sZWFuXG4vL1xuXG5mdW5jdGlvbiBoYXNTcGFjZXMgKHN0cikge1xuICAgIHJldHVybiAhIXN0ci5tYXRjaCgvXFxzLyk7XG59XG5cbi8vXG4vLyBDcmVhdGVzIGEgZHVtbXkgRE9NRWxlbWVudCBmb3Igd2hlbiB3ZSBkb24ndCBoYXZlIGFuIGFjdHVhbCBvbmUgZm9yIGEgbGlzdC5cbi8vXG4vLyAgICAgc3RyaW5nIC0+IG9iamVjdFxuLy9cblxuZnVuY3Rpb24gZHVtbXkgKGNsYXNzTGlzdCkge1xuICAgIFxuICAgIGlmICh0eXBlb2YgY2xhc3NMaXN0ICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZ1bmN0aW9uIGxpc3QoKSBleHBlY3RzIGFuIG9iamVjdCBvciBzdHJpbmcgYXMgaXRzIGFyZ3VtZW50LlwiKTtcbiAgICB9XG4gICAgXG4gICAgdmFyIGF0dHJpYnV0ZXMgPSB7XG4gICAgICAgIFwiY2xhc3NcIjogXCJcIiArIGNsYXNzU3RyaW5nVG9BcnJheShjbGFzc0xpc3QpLmpvaW4oXCIgXCIpXG4gICAgfTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBzZXRBdHRyaWJ1dGU6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkgeyBhdHRyaWJ1dGVzW25hbWVdID0gdmFsdWU7IH0sXG4gICAgICAgIGdldEF0dHJpYnV0ZTogZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIGF0dHJpYnV0ZXNbbmFtZV07IH1cbiAgICB9O1xufVxuIiwiLyogZ2xvYmFsIHJlcXVpcmUsIG1vZHVsZSAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL3NyYy9kYXRhYnVzXCIpO1xuIiwiLyogZ2xvYmFsIHVzaW5nLCBzZXRUaW1lb3V0LCBjb25zb2xlLCB3aW5kb3csIG1vZHVsZSAqL1xuXG4oZnVuY3Rpb24gRGF0YUJ1c0Jvb3RzdHJhcCAoKSB7XG4gICAgXG4gICAgaWYgKHR5cGVvZiByZXF1aXJlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBEYXRhQnVzTW9kdWxlKCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiB1c2luZyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHVzaW5nKCkuZGVmaW5lKFwiZGF0YWJ1c1wiLCBEYXRhQnVzTW9kdWxlKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHdpbmRvdy5EYXRhQnVzID0gRGF0YUJ1c01vZHVsZSgpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBEYXRhQnVzTW9kdWxlICgpIHtcbiAgICAgICAgXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBcbiAgICAgICAgZnVuY3Rpb24gRGF0YUJ1cyAoYXJncykge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGFyZ3MgPSBhcmdzIHx8IHt9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmRlYnVnID0gYXJncy5kZWJ1ZyB8fCBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJjZXB0RXJyb3JzID0gYXJncy5pbnRlcmNlcHRFcnJvcnMgfHwgZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmxvZyA9IGFyZ3MubG9nIHx8IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5sb2dEYXRhID0gYXJncy5sb2dEYXRhIHx8IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5kZWZhdWx0cyA9IGFyZ3MuZGVmYXVsdHMgfHwge307XG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRzLmZsb3dUeXBlID0gdGhpcy5kZWZhdWx0cy5mbG93VHlwZSB8fCBEYXRhQnVzLkZMT1dfVFlQRV9BU1lOQ0hST05PVVM7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2tzID0ge1xuICAgICAgICAgICAgICAgIFwiKlwiOiBbXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmUoZXJyb3JMaXN0ZW5lciwgXCJFdmVudEJ1cy5lcnJvclwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZnVuY3Rpb24gZXJyb3JMaXN0ZW5lciAoZGF0YSkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciBuYW1lO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmRlYnVnICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbmFtZSA9IGRhdGEuZXJyb3IubmFtZSB8fCBcIkVycm9yXCI7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cobmFtZSArIFwiIGluIGxpc3RlbmVyOyBFdmVudDogXCIgKyBkYXRhLmluZm8uZXZlbnQgKyBcIjsgTWVzc2FnZTogXCIgK1xuICAgICAgICAgICAgICAgICAgICBkYXRhLmVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBEYXRhQnVzLkZMT1dfVFlQRV9BU1lOQ0hST05PVVMgPSAwO1xuICAgICAgICBEYXRhQnVzLkZMT1dfVFlQRV9TWU5DSFJPTk9VUyA9IDE7XG4gICAgICAgIFxuICAgICAgICBEYXRhQnVzLmNyZWF0ZSA9IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYXJncyA9IGFyZ3MgfHwge307XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0YUJ1cyhhcmdzKTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIERhdGFCdXMucHJvdG90eXBlLnN1YnNjcmliZSA9IGZ1bmN0aW9uKHBhcmFtZXRlcjEsIHBhcmFtZXRlcjIpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGxpc3RlbmVyLCBldmVudCwgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChwYXJhbWV0ZXIyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBldmVudCA9IFwiKlwiO1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyID0gcGFyYW1ldGVyMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBwYXJhbWV0ZXIxID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBwYXJhbWV0ZXIxID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQgPSBwYXJhbWV0ZXIxO1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyID0gcGFyYW1ldGVyMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBwYXJhbWV0ZXIyID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBwYXJhbWV0ZXIyID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQgPSBwYXJhbWV0ZXIyO1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyID0gcGFyYW1ldGVyMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHR5cGVvZiBldmVudCAhPT0gXCJzdHJpbmdcIiAmJiB0eXBlb2YgZXZlbnQgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFdmVudCBuYW1lcyBjYW4gb25seSBiZSBzdHJpbmdzIG9yIG51bWJlcnMhIGV2ZW50OiBcIiwgZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJPbmx5IGZ1bmN0aW9ucyBtYXkgYmUgdXNlZCBhcyBsaXN0ZW5lcnMhXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBldmVudCA9IGV2ZW50IHx8ICcqJztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5jYWxsYmFja3NbZXZlbnRdID0gdGhpcy5jYWxsYmFja3NbZXZlbnRdIHx8IFtdO1xuICAgICAgICAgICAgdGhpcy5jYWxsYmFja3NbZXZlbnRdLnB1c2gobGlzdGVuZXIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoXG4gICAgICAgICAgICAgICAgXCJFdmVudEJ1cy5zdWJzY3JpYmVcIiwgXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcjogbGlzdGVuZXIsXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50OiBldmVudCxcbiAgICAgICAgICAgICAgICAgICAgYnVzOiB0aGlzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIHVuc3Vic2NyaWJlciAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi51bnN1YnNjcmliZShsaXN0ZW5lciwgZXZlbnQpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIERhdGFCdXMucHJvdG90eXBlLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24ocGFyYW1ldGVyMSwgcGFyYW1ldGVyMikge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgY2JzLCBsZW4sIGksIGxpc3RlbmVyLCBldmVudDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHBhcmFtZXRlcjIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGV2ZW50ID0gXCIqXCI7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIgPSBwYXJhbWV0ZXIxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHBhcmFtZXRlcjEgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIHBhcmFtZXRlcjEgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICBldmVudCA9IHBhcmFtZXRlcjE7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIgPSBwYXJhbWV0ZXIyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHBhcmFtZXRlcjIgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIHBhcmFtZXRlcjIgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICBldmVudCA9IHBhcmFtZXRlcjI7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIgPSBwYXJhbWV0ZXIxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodHlwZW9mIGV2ZW50ICE9PSBcInN0cmluZ1wiICYmIHR5cGVvZiBldmVudCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV2ZW50IG5hbWVzIGNhbiBvbmx5IGJlIHN0cmluZ3Mgb3IgbnVtYmVycyEgZXZlbnQ6IFwiLCBldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk9ubHkgZnVuY3Rpb25zIG1heSBiZSB1c2VkIGFzIGxpc3RlbmVycyFcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGV2ZW50ID0gZXZlbnQgfHwgJyonO1xuICAgICAgICAgICAgY2JzID0gdGhpcy5jYWxsYmFja3NbZXZlbnRdIHx8IFtdO1xuICAgICAgICAgICAgbGVuID0gY2JzLmxlbmd0aDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNic1tpXSA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWxsYmFja3NbZXZlbnRdLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcihcbiAgICAgICAgICAgICAgICBcIkV2ZW50QnVzLnVuc3Vic2NyaWJlXCIsIFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXI6IGxpc3RlbmVyLFxuICAgICAgICAgICAgICAgICAgICBldmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgICAgIGJ1czogdGhpc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBEYXRhQnVzLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gKGxpc3RlbmVyT3JFdmVudDEsIGxpc3RlbmVyT3JFdmVudDIpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGZuLCBzZWxmID0gdGhpcywgZXZlbnQsIGxpc3RlbmVyO1xuICAgICAgICAgICAgdmFyIGZpcnN0UGFyYW1Jc0Z1bmN0aW9uLCBzZWNvbmRQYXJhbUlzRnVuY3Rpb24sIGNhbGxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBmaXJzdFBhcmFtSXNGdW5jdGlvbiA9IHR5cGVvZiBsaXN0ZW5lck9yRXZlbnQxID09PSBcImZ1bmN0aW9uXCI7XG4gICAgICAgICAgICBzZWNvbmRQYXJhbUlzRnVuY3Rpb24gPSB0eXBlb2YgbGlzdGVuZXJPckV2ZW50MiA9PT0gXCJmdW5jdGlvblwiO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoKGZpcnN0UGFyYW1Jc0Z1bmN0aW9uICYmIHNlY29uZFBhcmFtSXNGdW5jdGlvbikgfHwgXG4gICAgICAgICAgICAgICAgICAgICghZmlyc3RQYXJhbUlzRnVuY3Rpb24gJiYgIXNlY29uZFBhcmFtSXNGdW5jdGlvbikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQYXJhbWV0ZXIgbWlzbWF0Y2g7IG9uZSBwYXJhbWV0ZXIgbmVlZHMgdG8gYmUgYSBmdW5jdGlvbiwgXCIgK1xuICAgICAgICAgICAgICAgICAgICBcInRoZSBvdGhlciBvbmUgbXVzdCBiZSBhIHN0cmluZy5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChmaXJzdFBhcmFtSXNGdW5jdGlvbikge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyID0gbGlzdGVuZXJPckV2ZW50MTtcbiAgICAgICAgICAgICAgICBldmVudCA9IGxpc3RlbmVyT3JFdmVudDI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lciA9IGxpc3RlbmVyT3JFdmVudDI7XG4gICAgICAgICAgICAgICAgZXZlbnQgPSBsaXN0ZW5lck9yRXZlbnQxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBldmVudCA9IGV2ZW50IHx8IFwiKlwiO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBmbiA9IGZ1bmN0aW9uIChkYXRhLCBpbmZvKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxlZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNhbGxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgc2VsZi51bnN1YnNjcmliZShmbiwgZXZlbnQpO1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyKGRhdGEsIGluZm8pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmUoZm4sIGV2ZW50KTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIERhdGFCdXMucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbihldmVudCwgZGF0YSwgYXN5bmMpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGNicywgbGVuLCBpbmZvLCBqLCBmLCBjdXIsIHNlbGYsIGZsb3dUeXBlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50ICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50ICE9PSBcInN0cmluZ1wiICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50ICE9PSBcIm51bWJlclwiXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFdmVudCBuYW1lcyBjYW4gb25seSBiZSBzdHJpbmdzIG9yIG51bWJlcnMhIGV2ZW50OiBcIiwgZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGV2ZW50ID0gYXJndW1lbnRzLmxlbmd0aCA/IGV2ZW50IDogXCIqXCI7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZsb3dUeXBlID0gKHR5cGVvZiBhc3luYyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBhc3luYyA9PT0gZmFsc2UpID9cbiAgICAgICAgICAgICAgICBEYXRhQnVzLkZMT1dfVFlQRV9TWU5DSFJPTk9VUyA6XG4gICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0cy5mbG93VHlwZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gZ2V0IHN1YnNjcmliZXJzIGluIGFsbCByZWxldmFudCBuYW1lc3BhY2VzXG4gICAgICAgICAgICBjYnMgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIG4sIHdvcmRzLCB3YywgbWF0Y2hlcywgaywga2MsIG9sZCA9IFwiXCIsIG91dCA9IFtdO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIHNwbGl0IGV2ZW50IG5hbWUgaW50byBuYW1lc3BhY2VzIGFuZCBnZXQgYWxsIHN1YnNjcmliZXJzXG4gICAgICAgICAgICAgICAgd29yZHMgPSBldmVudC5zcGxpdChcIi5cIik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZm9yIChuID0gMCwgd2MgPSB3b3Jkcy5sZW5ndGggOyBuIDwgd2MgOyArK24pIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIG9sZCA9IG9sZCArIChuID4gMCA/IFwiLlwiIDogXCJcIikgKyB3b3Jkc1tuXTtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlcyA9IHNlbGYuY2FsbGJhY2tzW29sZF0gfHwgW107XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBmb3IgKGsgPSAwLCBrYyA9IG1hdGNoZXMubGVuZ3RoOyBrIDwga2M7ICsraykge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0LnB1c2gobWF0Y2hlc1trXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50ID09PSBcIipcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBnZXQgc3Vic2NyaWJlcnMgZm9yIFwiKlwiIGFuZCBhZGQgdGhlbSwgdG9vXG4gICAgICAgICAgICAgICAgbWF0Y2hlcyA9IHNlbGYuY2FsbGJhY2tzW1wiKlwiXSB8fCBbXTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBmb3IgKGsgPSAwLCBrYyA9IG1hdGNoZXMubGVuZ3RoIDsgayA8IGtjIDsgKytrKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dC5wdXNoKCBtYXRjaGVzWyBrIF0gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgICAgIH0oKSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGxlbiA9IGNicy5sZW5ndGg7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGluZm8gPSB7XG4gICAgICAgICAgICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzOiBsZW4sXG4gICAgICAgICAgICAgICAgYXN5bmM6IGZsb3dUeXBlID09PSBEYXRhQnVzLkZMT1dfVFlQRV9BU1lOQ0hST05PVVMgPyB0cnVlIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgZ2V0UXVldWVMZW5ndGg6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsZW4gLSAoaiArIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZ1bmN0aW9uIGFzeW5jVGhyb3cgKGUpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gZnVuY3Rpb24gZm9yIGl0ZXJhdGluZyB0aHJvdWdoIHRoZSBsaXN0IG9mIHJlbGV2YW50IGxpc3RlbmVyc1xuICAgICAgICAgICAgZiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmxvZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkV2ZW50QnVzIGV2ZW50IHRyaWdnZXJlZDogXCIgKyBldmVudCArIFwiOyBTdWJzY3JpYmVyczogXCIgKyBsZW4sIFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dEYXRhID09PSB0cnVlID8gXCI7IERhdGE6IFwiICsgZGF0YSA6IFwiXCIgXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBsZW47ICsraikge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY3VyID0gY2JzW2pdO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cihkYXRhLCBpbmZvKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi50cmlnZ2VyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRXZlbnRCdXMuZXJyb3JcIiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mbzogaW5mb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmludGVyY2VwdEVycm9ycyAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jVGhyb3coZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoZmxvd1R5cGUgPT09IERhdGFCdXMuRkxPV19UWVBFX0FTWU5DSFJPTk9VUykge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZiwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBEYXRhQnVzLnByb3RvdHlwZS50cmlnZ2VyU3luYyA9IGZ1bmN0aW9uIChldmVudCwgZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJpZ2dlcihldmVudCwgZGF0YSwgZmFsc2UpO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgRGF0YUJ1cy5wcm90b3R5cGUudHJpZ2dlckFzeW5jID0gZnVuY3Rpb24gKGV2ZW50LCBkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmlnZ2VyKGV2ZW50LCBkYXRhLCB0cnVlKTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIERhdGFCdXMuaW5qZWN0ID0gZnVuY3Rpb24gKG9iaiwgYXJncykge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBhcmdzID0gYXJncyB8fCB7fTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHNxdWlkID0gbmV3IERhdGFCdXMoYXJncyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG9iai5zdWJzY3JpYmUgPSBmdW5jdGlvbiAobGlzdGVuZXIsIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgc3F1aWQuc3Vic2NyaWJlKGxpc3RlbmVyLCBldmVudCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBvYmoudW5zdWJzY3JpYmUgPSBmdW5jdGlvbiAobGlzdGVuZXIsIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgc3F1aWQudW5zdWJzY3JpYmUobGlzdGVuZXIsIGV2ZW50KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG9iai5vbmNlID0gZnVuY3Rpb24gKGxpc3RlbmVyLCBldmVudCkge1xuICAgICAgICAgICAgICAgIHNxdWlkLm9uY2UobGlzdGVuZXIsIGV2ZW50KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG9iai50cmlnZ2VyID0gZnVuY3Rpb24gKGV2ZW50LCBkYXRhLCBhc3luYykge1xuICAgICAgICAgICAgICAgIGFzeW5jID0gKHR5cGVvZiBhc3luYyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBhc3luYyA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlO1xuICAgICAgICAgICAgICAgIHNxdWlkLnRyaWdnZXIoZXZlbnQsIGRhdGEsIGFzeW5jKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG9iai50cmlnZ2VyU3luYyA9IHNxdWlkLnRyaWdnZXJTeW5jLmJpbmQoc3F1aWQpO1xuICAgICAgICAgICAgb2JqLnRyaWdnZXJBc3luYyA9IHNxdWlkLnRyaWdnZXJBc3luYy5iaW5kKHNxdWlkKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgb2JqLnN1YnNjcmliZShcImRlc3Ryb3llZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc3F1aWQuY2FsbGJhY2tzID0gW107XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBEYXRhQnVzO1xuICAgICAgICBcbiAgICB9XG59KCkpO1xuIiwiZnVuY3Rpb24gYmFja0luT3V0KHQpIHtcbiAgdmFyIHMgPSAxLjcwMTU4ICogMS41MjVcbiAgaWYgKCh0ICo9IDIpIDwgMSlcbiAgICByZXR1cm4gMC41ICogKHQgKiB0ICogKChzICsgMSkgKiB0IC0gcykpXG4gIHJldHVybiAwLjUgKiAoKHQgLT0gMikgKiB0ICogKChzICsgMSkgKiB0ICsgcykgKyAyKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhY2tJbk91dCIsImZ1bmN0aW9uIGJhY2tJbih0KSB7XG4gIHZhciBzID0gMS43MDE1OFxuICByZXR1cm4gdCAqIHQgKiAoKHMgKyAxKSAqIHQgLSBzKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhY2tJbiIsImZ1bmN0aW9uIGJhY2tPdXQodCkge1xuICB2YXIgcyA9IDEuNzAxNThcbiAgcmV0dXJuIC0tdCAqIHQgKiAoKHMgKyAxKSAqIHQgKyBzKSArIDFcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYWNrT3V0IiwidmFyIGJvdW5jZU91dCA9IHJlcXVpcmUoJy4vYm91bmNlLW91dCcpXG5cbmZ1bmN0aW9uIGJvdW5jZUluT3V0KHQpIHtcbiAgcmV0dXJuIHQgPCAwLjVcbiAgICA/IDAuNSAqICgxLjAgLSBib3VuY2VPdXQoMS4wIC0gdCAqIDIuMCkpXG4gICAgOiAwLjUgKiBib3VuY2VPdXQodCAqIDIuMCAtIDEuMCkgKyAwLjVcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBib3VuY2VJbk91dCIsInZhciBib3VuY2VPdXQgPSByZXF1aXJlKCcuL2JvdW5jZS1vdXQnKVxuXG5mdW5jdGlvbiBib3VuY2VJbih0KSB7XG4gIHJldHVybiAxLjAgLSBib3VuY2VPdXQoMS4wIC0gdClcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBib3VuY2VJbiIsImZ1bmN0aW9uIGJvdW5jZU91dCh0KSB7XG4gIHZhciBhID0gNC4wIC8gMTEuMFxuICB2YXIgYiA9IDguMCAvIDExLjBcbiAgdmFyIGMgPSA5LjAgLyAxMC4wXG5cbiAgdmFyIGNhID0gNDM1Ni4wIC8gMzYxLjBcbiAgdmFyIGNiID0gMzU0NDIuMCAvIDE4MDUuMFxuICB2YXIgY2MgPSAxNjA2MS4wIC8gMTgwNS4wXG5cbiAgdmFyIHQyID0gdCAqIHRcblxuICByZXR1cm4gdCA8IGFcbiAgICA/IDcuNTYyNSAqIHQyXG4gICAgOiB0IDwgYlxuICAgICAgPyA5LjA3NSAqIHQyIC0gOS45ICogdCArIDMuNFxuICAgICAgOiB0IDwgY1xuICAgICAgICA/IGNhICogdDIgLSBjYiAqIHQgKyBjY1xuICAgICAgICA6IDEwLjggKiB0ICogdCAtIDIwLjUyICogdCArIDEwLjcyXG59XG5cbm1vZHVsZS5leHBvcnRzID0gYm91bmNlT3V0IiwiZnVuY3Rpb24gY2lyY0luT3V0KHQpIHtcbiAgaWYgKCh0ICo9IDIpIDwgMSkgcmV0dXJuIC0wLjUgKiAoTWF0aC5zcXJ0KDEgLSB0ICogdCkgLSAxKVxuICByZXR1cm4gMC41ICogKE1hdGguc3FydCgxIC0gKHQgLT0gMikgKiB0KSArIDEpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2lyY0luT3V0IiwiZnVuY3Rpb24gY2lyY0luKHQpIHtcbiAgcmV0dXJuIDEuMCAtIE1hdGguc3FydCgxLjAgLSB0ICogdClcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjaXJjSW4iLCJmdW5jdGlvbiBjaXJjT3V0KHQpIHtcbiAgcmV0dXJuIE1hdGguc3FydCgxIC0gKCAtLXQgKiB0ICkpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2lyY091dCIsImZ1bmN0aW9uIGN1YmljSW5PdXQodCkge1xuICByZXR1cm4gdCA8IDAuNVxuICAgID8gNC4wICogdCAqIHQgKiB0XG4gICAgOiAwLjUgKiBNYXRoLnBvdygyLjAgKiB0IC0gMi4wLCAzLjApICsgMS4wXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3ViaWNJbk91dCIsImZ1bmN0aW9uIGN1YmljSW4odCkge1xuICByZXR1cm4gdCAqIHQgKiB0XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3ViaWNJbiIsImZ1bmN0aW9uIGN1YmljT3V0KHQpIHtcbiAgdmFyIGYgPSB0IC0gMS4wXG4gIHJldHVybiBmICogZiAqIGYgKyAxLjBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjdWJpY091dCIsImZ1bmN0aW9uIGVsYXN0aWNJbk91dCh0KSB7XG4gIHJldHVybiB0IDwgMC41XG4gICAgPyAwLjUgKiBNYXRoLnNpbigrMTMuMCAqIE1hdGguUEkvMiAqIDIuMCAqIHQpICogTWF0aC5wb3coMi4wLCAxMC4wICogKDIuMCAqIHQgLSAxLjApKVxuICAgIDogMC41ICogTWF0aC5zaW4oLTEzLjAgKiBNYXRoLlBJLzIgKiAoKDIuMCAqIHQgLSAxLjApICsgMS4wKSkgKiBNYXRoLnBvdygyLjAsIC0xMC4wICogKDIuMCAqIHQgLSAxLjApKSArIDEuMFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVsYXN0aWNJbk91dCIsImZ1bmN0aW9uIGVsYXN0aWNJbih0KSB7XG4gIHJldHVybiBNYXRoLnNpbigxMy4wICogdCAqIE1hdGguUEkvMikgKiBNYXRoLnBvdygyLjAsIDEwLjAgKiAodCAtIDEuMCkpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZWxhc3RpY0luIiwiZnVuY3Rpb24gZWxhc3RpY091dCh0KSB7XG4gIHJldHVybiBNYXRoLnNpbigtMTMuMCAqICh0ICsgMS4wKSAqIE1hdGguUEkvMikgKiBNYXRoLnBvdygyLjAsIC0xMC4wICogdCkgKyAxLjBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlbGFzdGljT3V0IiwiZnVuY3Rpb24gZXhwb0luT3V0KHQpIHtcbiAgcmV0dXJuICh0ID09PSAwLjAgfHwgdCA9PT0gMS4wKVxuICAgID8gdFxuICAgIDogdCA8IDAuNVxuICAgICAgPyArMC41ICogTWF0aC5wb3coMi4wLCAoMjAuMCAqIHQpIC0gMTAuMClcbiAgICAgIDogLTAuNSAqIE1hdGgucG93KDIuMCwgMTAuMCAtICh0ICogMjAuMCkpICsgMS4wXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb0luT3V0IiwiZnVuY3Rpb24gZXhwb0luKHQpIHtcbiAgcmV0dXJuIHQgPT09IDAuMCA/IHQgOiBNYXRoLnBvdygyLjAsIDEwLjAgKiAodCAtIDEuMCkpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb0luIiwiZnVuY3Rpb24gZXhwb091dCh0KSB7XG4gIHJldHVybiB0ID09PSAxLjAgPyB0IDogMS4wIC0gTWF0aC5wb3coMi4wLCAtMTAuMCAqIHQpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb091dCIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHQnYmFja0luT3V0JzogcmVxdWlyZSgnLi9iYWNrLWluLW91dCcpLFxuXHQnYmFja0luJzogcmVxdWlyZSgnLi9iYWNrLWluJyksXG5cdCdiYWNrT3V0JzogcmVxdWlyZSgnLi9iYWNrLW91dCcpLFxuXHQnYm91bmNlSW5PdXQnOiByZXF1aXJlKCcuL2JvdW5jZS1pbi1vdXQnKSxcblx0J2JvdW5jZUluJzogcmVxdWlyZSgnLi9ib3VuY2UtaW4nKSxcblx0J2JvdW5jZU91dCc6IHJlcXVpcmUoJy4vYm91bmNlLW91dCcpLFxuXHQnY2lyY0luT3V0JzogcmVxdWlyZSgnLi9jaXJjLWluLW91dCcpLFxuXHQnY2lyY0luJzogcmVxdWlyZSgnLi9jaXJjLWluJyksXG5cdCdjaXJjT3V0JzogcmVxdWlyZSgnLi9jaXJjLW91dCcpLFxuXHQnY3ViaWNJbk91dCc6IHJlcXVpcmUoJy4vY3ViaWMtaW4tb3V0JyksXG5cdCdjdWJpY0luJzogcmVxdWlyZSgnLi9jdWJpYy1pbicpLFxuXHQnY3ViaWNPdXQnOiByZXF1aXJlKCcuL2N1YmljLW91dCcpLFxuXHQnZWxhc3RpY0luT3V0JzogcmVxdWlyZSgnLi9lbGFzdGljLWluLW91dCcpLFxuXHQnZWxhc3RpY0luJzogcmVxdWlyZSgnLi9lbGFzdGljLWluJyksXG5cdCdlbGFzdGljT3V0JzogcmVxdWlyZSgnLi9lbGFzdGljLW91dCcpLFxuXHQnZXhwb0luT3V0JzogcmVxdWlyZSgnLi9leHBvLWluLW91dCcpLFxuXHQnZXhwb0luJzogcmVxdWlyZSgnLi9leHBvLWluJyksXG5cdCdleHBvT3V0JzogcmVxdWlyZSgnLi9leHBvLW91dCcpLFxuXHQnbGluZWFyJzogcmVxdWlyZSgnLi9saW5lYXInKSxcblx0J3F1YWRJbk91dCc6IHJlcXVpcmUoJy4vcXVhZC1pbi1vdXQnKSxcblx0J3F1YWRJbic6IHJlcXVpcmUoJy4vcXVhZC1pbicpLFxuXHQncXVhZE91dCc6IHJlcXVpcmUoJy4vcXVhZC1vdXQnKSxcblx0J3F1YXJ0SW5PdXQnOiByZXF1aXJlKCcuL3F1YXJ0LWluLW91dCcpLFxuXHQncXVhcnRJbic6IHJlcXVpcmUoJy4vcXVhcnQtaW4nKSxcblx0J3F1YXJ0T3V0JzogcmVxdWlyZSgnLi9xdWFydC1vdXQnKSxcblx0J3F1aW50SW5PdXQnOiByZXF1aXJlKCcuL3F1aW50LWluLW91dCcpLFxuXHQncXVpbnRJbic6IHJlcXVpcmUoJy4vcXVpbnQtaW4nKSxcblx0J3F1aW50T3V0JzogcmVxdWlyZSgnLi9xdWludC1vdXQnKSxcblx0J3NpbmVJbk91dCc6IHJlcXVpcmUoJy4vc2luZS1pbi1vdXQnKSxcblx0J3NpbmVJbic6IHJlcXVpcmUoJy4vc2luZS1pbicpLFxuXHQnc2luZU91dCc6IHJlcXVpcmUoJy4vc2luZS1vdXQnKVxufSIsImZ1bmN0aW9uIGxpbmVhcih0KSB7XG4gIHJldHVybiB0XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGluZWFyIiwiZnVuY3Rpb24gcXVhZEluT3V0KHQpIHtcbiAgICB0IC89IDAuNVxuICAgIGlmICh0IDwgMSkgcmV0dXJuIDAuNSp0KnRcbiAgICB0LS1cbiAgICByZXR1cm4gLTAuNSAqICh0Kih0LTIpIC0gMSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBxdWFkSW5PdXQiLCJmdW5jdGlvbiBxdWFkSW4odCkge1xuICByZXR1cm4gdCAqIHRcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBxdWFkSW4iLCJmdW5jdGlvbiBxdWFkT3V0KHQpIHtcbiAgcmV0dXJuIC10ICogKHQgLSAyLjApXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcXVhZE91dCIsImZ1bmN0aW9uIHF1YXJ0aWNJbk91dCh0KSB7XG4gIHJldHVybiB0IDwgMC41XG4gICAgPyArOC4wICogTWF0aC5wb3codCwgNC4wKVxuICAgIDogLTguMCAqIE1hdGgucG93KHQgLSAxLjAsIDQuMCkgKyAxLjBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBxdWFydGljSW5PdXQiLCJmdW5jdGlvbiBxdWFydGljSW4odCkge1xuICByZXR1cm4gTWF0aC5wb3codCwgNC4wKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHF1YXJ0aWNJbiIsImZ1bmN0aW9uIHF1YXJ0aWNPdXQodCkge1xuICByZXR1cm4gTWF0aC5wb3codCAtIDEuMCwgMy4wKSAqICgxLjAgLSB0KSArIDEuMFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHF1YXJ0aWNPdXQiLCJmdW5jdGlvbiBxaW50aWNJbk91dCh0KSB7XG4gICAgaWYgKCAoIHQgKj0gMiApIDwgMSApIHJldHVybiAwLjUgKiB0ICogdCAqIHQgKiB0ICogdFxuICAgIHJldHVybiAwLjUgKiAoICggdCAtPSAyICkgKiB0ICogdCAqIHQgKiB0ICsgMiApXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcWludGljSW5PdXQiLCJmdW5jdGlvbiBxaW50aWNJbih0KSB7XG4gIHJldHVybiB0ICogdCAqIHQgKiB0ICogdFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHFpbnRpY0luIiwiZnVuY3Rpb24gcWludGljT3V0KHQpIHtcbiAgcmV0dXJuIC0tdCAqIHQgKiB0ICogdCAqIHQgKyAxXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcWludGljT3V0IiwiZnVuY3Rpb24gc2luZUluT3V0KHQpIHtcbiAgcmV0dXJuIC0wLjUgKiAoTWF0aC5jb3MoTWF0aC5QSSp0KSAtIDEpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2luZUluT3V0IiwiZnVuY3Rpb24gc2luZUluICh0KSB7XG4gIHZhciB2ID0gTWF0aC5jb3ModCAqIE1hdGguUEkgKiAwLjUpXG4gIGlmIChNYXRoLmFicyh2KSA8IDFlLTE0KSByZXR1cm4gMVxuICBlbHNlIHJldHVybiAxIC0gdlxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNpbmVJblxuIiwiZnVuY3Rpb24gc2luZU91dCh0KSB7XG4gIHJldHVybiBNYXRoLnNpbih0ICogTWF0aC5QSS8yKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNpbmVPdXQiLCJcbihmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIEhUVFBfU1RBVFVTX09LID0gMjAwO1xuICAgIHZhciBSRUFEWV9TVEFURV9VTlNFTlQgPSAwO1xuICAgIHZhciBSRUFEWV9TVEFURV9PUEVORUQgPSAxO1xuICAgIHZhciBSRUFEWV9TVEFURV9IRUFERVJTX1JFQ0VJVkVEID0gMjtcbiAgICB2YXIgUkVBRFlfU1RBVEVfTE9BRElORyA9IDM7XG4gICAgdmFyIFJFQURZX1NUQVRFX0RPTkUgPSA0O1xuICAgIFxuICAgIGZ1bmN0aW9uIGFqYXggKG1ldGhvZCwgdXJsLCBvcHRpb25zLCB0aGVuKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgdGltZW91dCwgZGF0YTtcbiAgICAgICAgXG4gICAgICAgIHZhciByZXF1ZXN0T2JqZWN0ID0gWE1MSHR0cFJlcXVlc3QgP1xuICAgICAgICAgICAgbmV3IFhNTEh0dHBSZXF1ZXN0KCkgOlxuICAgICAgICAgICAgbmV3IEFjdGl2ZVhPYmplY3QoXCJNaWNyb3NvZnQuWE1MSFRUUFwiKTtcbiAgICAgICAgXG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICBcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSBcImZ1bmN0aW9uXCIgJiYgIXRoZW4pIHtcbiAgICAgICAgICAgIHRoZW4gPSBvcHRpb25zO1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGVuID0gdGhlbiB8fCBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgZGF0YSA9IChcImRhdGFcIiBpbiBvcHRpb25zKSA/IG9wdGlvbnMuZGF0YSA6IHVuZGVmaW5lZDtcbiAgICAgICAgdGltZW91dCA9IG9wdGlvbnMudGltZW91dDtcbiAgICAgICAgdXJsICs9IG9wdGlvbnMucmFuZG9taXplID8gXCI/cmFuZG9tPVwiICsgTWF0aC5yYW5kb20oKSA6IFwiXCI7XG4gICAgICAgIFxuICAgICAgICByZXF1ZXN0T2JqZWN0Lm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmVxdWVzdE9iamVjdC50aW1lb3V0ID0gdGltZW91dDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmVxdWVzdE9iamVjdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmVxdWVzdE9iamVjdC5hYm9ydCgpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoZW4obmV3IEVycm9yKFwiQ29ubmVjdGlvbiByZWFjaGVkIHRpbWVvdXQgb2YgXCIgKyB0aW1lb3V0ICsgXCIgbXMuXCIpLCByZXF1ZXN0T2JqZWN0KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJlcXVlc3RPYmplY3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBkb25lLCBzdGF0dXNPaztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZG9uZSA9IHJlcXVlc3RPYmplY3QucmVhZHlTdGF0ZSA9PT0gUkVBRFlfU1RBVEVfRE9ORTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXNPayA9IHJlcXVlc3RPYmplY3Quc3RhdHVzID09PSBIVFRQX1NUQVRVU19PSztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXNPayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoc3RhdHVzT2spIHtcbiAgICAgICAgICAgICAgICAgICAgdGhlbihudWxsLCByZXF1ZXN0T2JqZWN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoZW4obmV3IEVycm9yKFwiQUpBWCByZXF1ZXN0IHdhc24ndCBzdWNjZXNzZnVsLlwiKSwgcmVxdWVzdE9iamVjdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgIHJlcXVlc3RPYmplY3Quc2VuZChkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlcXVlc3RPYmplY3Quc2VuZCgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gcmVxdWVzdE9iamVjdDtcbiAgICB9XG4gICAgXG4gICAgYWpheC5IVFRQX1NUQVRVU19PSyA9IEhUVFBfU1RBVFVTX09LO1xuICAgIFxuICAgIGFqYXguUkVBRFlfU1RBVEVfVU5TRU5UID0gUkVBRFlfU1RBVEVfVU5TRU5UO1xuICAgIGFqYXguUkVBRFlfU1RBVEVfT1BFTkVEID0gUkVBRFlfU1RBVEVfT1BFTkVEO1xuICAgIGFqYXguUkVBRFlfU1RBVEVfSEVBREVSU19SRUNFSVZFRCA9IFJFQURZX1NUQVRFX0hFQURFUlNfUkVDRUlWRUQ7XG4gICAgYWpheC5SRUFEWV9TVEFURV9MT0FESU5HID0gUkVBRFlfU1RBVEVfTE9BRElORztcbiAgICBhamF4LlJFQURZX1NUQVRFX0RPTkUgPSBSRUFEWV9TVEFURV9ET05FO1xuICAgIFxuICAgIGFqYXguSFRUUF9NRVRIT0RfR0VUID0gXCJHRVRcIjtcbiAgICBhamF4LkhUVFBfTUVUSE9EX1BPU1QgPSBcIlBPU1RcIjtcbiAgICBhamF4LkhUVFBfTUVUSE9EX1BVVCA9IFwiUFVUXCI7XG4gICAgYWpheC5IVFRQX01FVEhPRF9ERUxFVEUgPSBcIkRFTEVURVwiO1xuICAgIGFqYXguSFRUUF9NRVRIT0RfSEVBRCA9IFwiSEVBRFwiO1xuICAgIFxuICAgIGFqYXguZ2V0ID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucywgdGhlbikge1xuICAgICAgICByZXR1cm4gYWpheChhamF4LkhUVFBfTUVUSE9EX0dFVCwgdXJsLCBvcHRpb25zLCB0aGVuKTtcbiAgICB9O1xuICAgIFxuICAgIGFqYXgucG9zdCA9IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMsIHRoZW4pIHtcbiAgICAgICAgXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gXCJmdW5jdGlvblwiICYmICF0aGVuKSB7XG4gICAgICAgICAgICB0aGVuID0gb3B0aW9ucztcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgb3B0aW9ucy5kYXRhID0gZGF0YTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBhamF4KGFqYXguSFRUUF9NRVRIT0RfUE9TVCwgdXJsLCBvcHRpb25zLCB0aGVuKTtcbiAgICB9O1xuICAgIFxuICAgIGlmICh0eXBlb2YgcmVxdWlyZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gYWpheDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHdpbmRvdy5hamF4ID0gYWpheDtcbiAgICB9XG4gICAgXG59KCkpO1xuIiwiXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL2Vhc3ktYWpheC5qc1wiKTtcbiIsIlxuZnVuY3Rpb24gYXBwbHkgKGZuLCBhcmdzKSB7XG4gICAgXG4gICAgaWYgKHR5cGVvZiBmbiAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJBcmd1bWVudCAnZm4nIG11c3QgYmUgYSBmdW5jdGlvbi5cIik7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBmbi5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFwcGx5O1xuIiwiXG52YXIgc2xpY2UgPSByZXF1aXJlKFwiLi9zbGljZVwiKTtcbnZhciBhcHBseSA9IHJlcXVpcmUoXCIuL2FwcGx5XCIpO1xuXG4vL1xuLy8gKiphdXRvKGZuWywgYXJpdHldKSoqXG4vL1xuLy8gV3JhcHMgYGZuYCBzbyB0aGF0IGlmIGl0IGlzIGNhbGxlZCB3aXRoIGxlc3MgYXJndW1lbnRzIHRoYW4gYGZuYCdzIGFyaXR5LFxuLy8gYSBwYXJ0aWFsIGFwcGxpY2F0aW9uIGlzIGRvbmUgaW5zdGVhZCBvZiBjYWxsaW5nIHRoZSBmdW5jdGlvbi4gVGhpcyBtZWFucyB0aGF0IHlvdSBjYW4gZG8gdGhpczpcbi8vXG4vLyAgICAgZWFjaChmbikoY29sbGVjdGlvbik7XG4vL1xuLy8gSW5zdGVhZCBvZiB0aGlzOlxuLy9cbi8vICAgICBlYWNoKGZuLCBjb2xsZWN0aW9uKTtcbi8vXG5cbmZ1bmN0aW9uIGF1dG8gKGZuLCBhcml0eSkge1xuICAgIFxuICAgIGFyaXR5ID0gYXJndW1lbnRzLmxlbmd0aCA+PSAyID8gYXJpdHkgOiBmbi5sZW5ndGg7XG4gICAgXG4gICAgZnVuY3Rpb24gd3JhcCAoKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgYXJncyA9IHNsaWNlKGFyZ3VtZW50cyk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgYXJncy5sZW5ndGggPj0gYXJpdHkgP1xuICAgICAgICAgICAgYXBwbHkoZm4sIGFyZ3MpIDpcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgcmV0dXJuIGFwcGx5KHdyYXAsIGFyZ3MuY29uY2F0KHNsaWNlKGFyZ3VtZW50cykpKTsgfVxuICAgICAgICApO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gd3JhcDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhdXRvO1xuIiwiXG52YXIgdHlwZXMgPSByZXF1aXJlKFwiZW5qb3ktdHlwZWNoZWNrc1wiKTtcbnZhciBhdXRvID0gcmVxdWlyZShcIi4vYXV0b1wiKTtcblxuZnVuY3Rpb24gZWFjaEluQXJyYXkgKGZuLCBjb2xsZWN0aW9uKSB7XG4gICAgW10uZm9yRWFjaC5jYWxsKGNvbGxlY3Rpb24sIGZuKTtcbn1cblxuZnVuY3Rpb24gZWFjaEluT2JqZWN0IChmbiwgY29sbGVjdGlvbikge1xuICAgIE9iamVjdC5rZXlzKGNvbGxlY3Rpb24pLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBmbihjb2xsZWN0aW9uW2tleV0sIGtleSwgY29sbGVjdGlvbik7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGVhY2ggKGZuLCBjb2xsZWN0aW9uKSB7XG4gICAgcmV0dXJuIHR5cGVzLmlzQXJyYXlMaWtlKGNvbGxlY3Rpb24pID9cbiAgICAgICAgZWFjaEluQXJyYXkoZm4sIGNvbGxlY3Rpb24pIDpcbiAgICAgICAgZWFjaEluT2JqZWN0KGZuLCBjb2xsZWN0aW9uKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhdXRvKGVhY2gpO1xuIiwiXG52YXIgc29tZSA9IHJlcXVpcmUoXCIuL3NvbWVcIik7XG52YXIgYXV0byA9IHJlcXVpcmUoXCIuL2F1dG9cIik7XG5cbmZ1bmN0aW9uIGZpbmQgKGZuLCBjb2xsZWN0aW9uKSB7XG4gICAgXG4gICAgdmFyIHZhbHVlO1xuICAgIFxuICAgIHNvbWUoZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuICAgICAgICBcbiAgICAgICAgaWYgKGZuKGl0ZW0sIGtleSwgY29sbGVjdGlvbikpIHtcbiAgICAgICAgICAgIHZhbHVlID0gaXRlbTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIFxuICAgIH0sIGNvbGxlY3Rpb24pO1xuICAgIFxuICAgIHJldHVybiB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhdXRvKGZpbmQpO1xuIiwiXG5mdW5jdGlvbiBmcmVlIChtZXRob2QpIHtcbiAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmNhbGwuYmluZChtZXRob2QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZyZWU7XG4iLCJcbnZhciBmcmVlID0gcmVxdWlyZShcIi4vZnJlZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmcmVlKEFycmF5LnByb3RvdHlwZS5zbGljZSk7XG4iLCJcbnZhciBhdXRvID0gcmVxdWlyZShcIi4vYXV0b1wiKTtcbnZhciBmcmVlID0gcmVxdWlyZShcIi4vZnJlZVwiKTtcbnZhciB0eXBlcyA9IHJlcXVpcmUoXCJlbmpveS10eXBlY2hlY2tzXCIpO1xuXG52YXIgc29tZUFycmF5ID0gZnJlZShBcnJheS5wcm90b3R5cGUuc29tZSk7XG5cbmZ1bmN0aW9uIHNvbWUgKGZuLCBjb2xsZWN0aW9uKSB7XG4gICAgaWYgKHR5cGVzLmlzQXJyYXlMaWtlKGNvbGxlY3Rpb24pKSB7XG4gICAgICAgIHJldHVybiBzb21lQXJyYXkoY29sbGVjdGlvbiwgZm4pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNvbWVPYmplY3QoZm4sIGNvbGxlY3Rpb24pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc29tZU9iamVjdCAoZm4sIGNvbGxlY3Rpb24pIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoY29sbGVjdGlvbikuc29tZShmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHJldHVybiBmbihjb2xsZWN0aW9uW2tleV0sIGtleSwgY29sbGVjdGlvbik7XG4gICAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXV0byhzb21lKTtcbiIsIi8qIGVzbGludCBuby1zZWxmLWNvbXBhcmU6IG9mZiAqL1xuXG5mdW5jdGlvbiBpc051bGwgKGEpIHtcbiAgICByZXR1cm4gYSA9PT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQgKGEpIHtcbiAgICByZXR1cm4gdHlwZW9mIGEgPT09IFwidW5kZWZpbmVkXCI7XG59XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbiAoYSkge1xuICAgIHJldHVybiB0eXBlb2YgYSA9PT0gXCJib29sZWFuXCI7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyIChhKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBhID09PSBcIm51bWJlclwiO1xufVxuXG5mdW5jdGlvbiBpc0Zpbml0ZU51bWJlciAoYSkge1xuICAgIHJldHVybiBpc051bWJlcihhKSAmJiBpc0Zpbml0ZShhKTtcbn1cblxuZnVuY3Rpb24gaXNJbmZpbml0ZU51bWJlciAoYSkge1xuICAgIHJldHVybiBpc051bWJlcihhKSAmJiAhaXNGaW5pdGUoYSk7XG59XG5cbmZ1bmN0aW9uIGlzSW5maW5pdHkgKGEpIHtcbiAgICByZXR1cm4gaXNQb3NpdGl2ZUluZmluaXR5KGEpIHx8IGlzTmVnYXRpdmVJbmZpbml0eShhKTtcbn1cblxuZnVuY3Rpb24gaXNQb3NpdGl2ZUluZmluaXR5IChhKSB7XG4gICAgcmV0dXJuIGEgPT09IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbn1cblxuZnVuY3Rpb24gaXNOZWdhdGl2ZUluZmluaXR5IChhKSB7XG4gICAgcmV0dXJuIGEgPT09IE51bWJlci5ORUdBVElWRV9JTkZJTklUWTtcbn1cblxuZnVuY3Rpb24gaXNOYU4gKGEpIHtcbiAgICByZXR1cm4gYSAhPT0gYTtcbn1cblxuLy9cbi8vIENoZWNrcyBpZiBhIG51bWJlciBpcyBhbiBpbnRlZ2VyLiBQbGVhc2Ugbm90ZSB0aGF0IHRoZXJlJ3MgY3VycmVudGx5IG5vIHdheVxuLy8gdG8gaWRlbnRpZnkgXCJ4LjAwMFwiIGFuZCBzaW1pbGFyIGFzIGVpdGhlciBpbnRlZ2VyIG9yIGZsb2F0IGluIEphdmFTY3JpcHQgYmVjYXVzZVxuLy8gdGhvc2UgYXJlIGF1dG9tYXRpY2FsbHkgdHJ1bmNhdGVkIHRvIFwieFwiLlxuLy9cbmZ1bmN0aW9uIGlzSW50ZWdlciAobikge1xuICAgIHJldHVybiBpc0Zpbml0ZU51bWJlcihuKSAmJiBuICUgMSA9PT0gMDtcbn1cblxuZnVuY3Rpb24gaXNGbG9hdCAobikge1xuICAgIHJldHVybiBpc0Zpbml0ZU51bWJlcihuKSAmJiBuICUgMSAhPT0gMDtcbn1cblxuZnVuY3Rpb24gaXNTdHJpbmcgKGEpIHtcbiAgICByZXR1cm4gdHlwZW9mIGEgPT09IFwic3RyaW5nXCI7XG59XG5cbmZ1bmN0aW9uIGlzQ2hhciAoYSkge1xuICAgIHJldHVybiBpc1N0cmluZyhhKSAmJiBhLmxlbmd0aCA9PT0gMTtcbn1cblxuZnVuY3Rpb24gaXNDb2xsZWN0aW9uIChhKSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGEpIHx8IGlzQXJyYXkoYSk7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0IChhKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBhID09PSBcIm9iamVjdFwiICYmIGEgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkgKGEpIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShhKTtcbn1cblxuZnVuY3Rpb24gaXNBcnJheUxpa2UgKGEpIHtcbiAgICByZXR1cm4gKGlzQXJyYXkoYSkgfHwgaXNTdHJpbmcoYSkgfHwgKFxuICAgICAgICBpc09iamVjdChhKSAmJiAoXCJsZW5ndGhcIiBpbiBhKSAmJiBpc0Zpbml0ZU51bWJlcihhLmxlbmd0aCkgJiYgKFxuICAgICAgICAgICAgKGEubGVuZ3RoID4gMCAmJiAoYS5sZW5ndGggLSAxKSBpbiBhKSB8fFxuICAgICAgICAgICAgKGEubGVuZ3RoID09PSAwKVxuICAgICAgICApXG4gICAgKSk7XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24gKGEpIHtcbiAgICByZXR1cm4gdHlwZW9mIGEgPT09IFwiZnVuY3Rpb25cIjtcbn1cblxuZnVuY3Rpb24gaXNQcmltaXRpdmUgKGEpIHtcbiAgICByZXR1cm4gaXNOdWxsKGEpIHx8IGlzVW5kZWZpbmVkKGEpIHx8IGlzTnVtYmVyKGEpIHx8IGlzU3RyaW5nKGEpIHx8IGlzQm9vbGVhbihhKTtcbn1cblxuZnVuY3Rpb24gaXNEYXRlIChhKSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGEpICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhKSA9PT0gXCJbb2JqZWN0IERhdGVdXCI7XG59XG5cbmZ1bmN0aW9uIGlzUmVnRXhwIChhKSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGEpICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhKSA9PT0gXCJbb2JqZWN0IFJlZ0V4cF1cIjtcbn1cblxuZnVuY3Rpb24gaXNFcnJvciAoYSkge1xuICAgIHJldHVybiBpc09iamVjdChhKSAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYSkgPT09IFwiW29iamVjdCBFcnJvcl1cIjtcbn1cblxuZnVuY3Rpb24gaXNBcmd1bWVudHNPYmplY3QgKGEpIHtcbiAgICByZXR1cm4gaXNPYmplY3QoYSkgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGEpID09PSBcIltvYmplY3QgQXJndW1lbnRzXVwiO1xufVxuXG5mdW5jdGlvbiBpc01hdGhPYmplY3QgKGEpIHtcbiAgICByZXR1cm4gYSA9PT0gTWF0aDtcbn1cblxuZnVuY3Rpb24gaXNUeXBlIChhKSB7XG4gICAgcmV0dXJuIGlzRGVyaXZhYmxlKGEpICYmIGEuJF9fdHlwZV9fID09PSBcInR5cGVcIiAmJiBpc0Z1bmN0aW9uKGEuJF9fY2hlY2tlcl9fKTtcbn1cblxuZnVuY3Rpb24gaXNEZXJpdmFibGUgKGEpIHtcbiAgICByZXR1cm4gaXNPYmplY3QoYSkgJiYgXCIkX19jaGlsZHJlbl9fXCIgaW4gYSAmJiBBcnJheS5pc0FycmF5KGEuJF9fY2hpbGRyZW5fXyk7XG59XG5cbmZ1bmN0aW9uIGlzTWV0aG9kIChhKSB7XG4gICAgcmV0dXJuIGlzRnVuY3Rpb24oYSkgJiYgYS4kX190eXBlX18gPT09IFwibWV0aG9kXCIgJiYgaXNGdW5jdGlvbihhLiRfX2RlZmF1bHRfXykgJiZcbiAgICAgICAgaXNBcnJheShhLiRfX2ltcGxlbWVudGF0aW9uc19fKSAmJiBpc0FycmF5KGEuJF9fZGlzcGF0Y2hlcnNfXyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGlzQXJndW1lbnRzT2JqZWN0OiBpc0FyZ3VtZW50c09iamVjdCxcbiAgICBpc0FycmF5OiBpc0FycmF5LFxuICAgIGlzQXJyYXlMaWtlOiBpc0FycmF5TGlrZSxcbiAgICBpc0Jvb2xlYW46IGlzQm9vbGVhbixcbiAgICBpc0NoYXI6IGlzQ2hhcixcbiAgICBpc0NvbGxlY3Rpb246IGlzQ29sbGVjdGlvbixcbiAgICBpc0RhdGU6IGlzRGF0ZSxcbiAgICBpc0Rlcml2YWJsZTogaXNEZXJpdmFibGUsXG4gICAgaXNFcnJvcjogaXNFcnJvcixcbiAgICBpc0Zpbml0ZU51bWJlcjogaXNGaW5pdGVOdW1iZXIsXG4gICAgaXNGbG9hdDogaXNGbG9hdCxcbiAgICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICAgIGlzSW5maW5pdGVOdW1iZXI6IGlzSW5maW5pdGVOdW1iZXIsXG4gICAgaXNJbmZpbml0eTogaXNJbmZpbml0eSxcbiAgICBpc0ludGVnZXI6IGlzSW50ZWdlcixcbiAgICBpc01hdGhPYmplY3Q6IGlzTWF0aE9iamVjdCxcbiAgICBpc01ldGhvZDogaXNNZXRob2QsXG4gICAgaXNOYU46IGlzTmFOLFxuICAgIGlzTmVnYXRpdmVJbmZpbml0eTogaXNOZWdhdGl2ZUluZmluaXR5LFxuICAgIGlzTnVsbDogaXNOdWxsLFxuICAgIGlzTnVtYmVyOiBpc051bWJlcixcbiAgICBpc1Bvc2l0aXZlSW5maW5pdHk6IGlzUG9zaXRpdmVJbmZpbml0eSxcbiAgICBpc1ByaW1pdGl2ZTogaXNQcmltaXRpdmUsXG4gICAgaXNSZWdFeHA6IGlzUmVnRXhwLFxuICAgIGlzU3RyaW5nOiBpc1N0cmluZyxcbiAgICBpc1R5cGU6IGlzVHlwZSxcbiAgICBpc1VuZGVmaW5lZDogaXNVbmRlZmluZWRcbn07XG4iLCIvKiFcbiAqICBob3dsZXIuanMgdjEuMS4yOVxuICogIGhvd2xlcmpzLmNvbVxuICpcbiAqICAoYykgMjAxMy0yMDE2LCBKYW1lcyBTaW1wc29uIG9mIEdvbGRGaXJlIFN0dWRpb3NcbiAqICBnb2xkZmlyZXN0dWRpb3MuY29tXG4gKlxuICogIE1JVCBMaWNlbnNlXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAvLyBzZXR1cFxuICB2YXIgY2FjaGUgPSB7fTtcblxuICAvLyBzZXR1cCB0aGUgYXVkaW8gY29udGV4dFxuICB2YXIgY3R4ID0gbnVsbCxcbiAgICB1c2luZ1dlYkF1ZGlvID0gdHJ1ZSxcbiAgICBub0F1ZGlvID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgaWYgKHR5cGVvZiBBdWRpb0NvbnRleHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjdHggPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygd2Via2l0QXVkaW9Db250ZXh0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY3R4ID0gbmV3IHdlYmtpdEF1ZGlvQ29udGV4dCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2luZ1dlYkF1ZGlvID0gZmFsc2U7XG4gICAgfVxuICB9IGNhdGNoKGUpIHtcbiAgICB1c2luZ1dlYkF1ZGlvID0gZmFsc2U7XG4gIH1cblxuICBpZiAoIXVzaW5nV2ViQXVkaW8pIHtcbiAgICBpZiAodHlwZW9mIEF1ZGlvICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbmV3IEF1ZGlvKCk7XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgbm9BdWRpbyA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vQXVkaW8gPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8vIGNyZWF0ZSBhIG1hc3RlciBnYWluIG5vZGVcbiAgaWYgKHVzaW5nV2ViQXVkaW8pIHtcbiAgICB2YXIgbWFzdGVyR2FpbiA9ICh0eXBlb2YgY3R4LmNyZWF0ZUdhaW4gPT09ICd1bmRlZmluZWQnKSA/IGN0eC5jcmVhdGVHYWluTm9kZSgpIDogY3R4LmNyZWF0ZUdhaW4oKTtcbiAgICBtYXN0ZXJHYWluLmdhaW4udmFsdWUgPSAxO1xuICAgIG1hc3RlckdhaW4uY29ubmVjdChjdHguZGVzdGluYXRpb24pO1xuICB9XG5cbiAgLy8gY3JlYXRlIGdsb2JhbCBjb250cm9sbGVyXG4gIHZhciBIb3dsZXJHbG9iYWwgPSBmdW5jdGlvbihjb2RlY3MpIHtcbiAgICB0aGlzLl92b2x1bWUgPSAxO1xuICAgIHRoaXMuX211dGVkID0gZmFsc2U7XG4gICAgdGhpcy51c2luZ1dlYkF1ZGlvID0gdXNpbmdXZWJBdWRpbztcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLm5vQXVkaW8gPSBub0F1ZGlvO1xuICAgIHRoaXMuX2hvd2xzID0gW107XG4gICAgdGhpcy5fY29kZWNzID0gY29kZWNzO1xuICAgIHRoaXMuaU9TQXV0b0VuYWJsZSA9IHRydWU7XG4gIH07XG4gIEhvd2xlckdsb2JhbC5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogR2V0L3NldCB0aGUgZ2xvYmFsIHZvbHVtZSBmb3IgYWxsIHNvdW5kcy5cbiAgICAgKiBAcGFyYW0gIHtGbG9hdH0gdm9sIFZvbHVtZSBmcm9tIDAuMCB0byAxLjAuXG4gICAgICogQHJldHVybiB7SG93bGVyL0Zsb2F0fSAgICAgUmV0dXJucyBzZWxmIG9yIGN1cnJlbnQgdm9sdW1lLlxuICAgICAqL1xuICAgIHZvbHVtZTogZnVuY3Rpb24odm9sKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIC8vIG1ha2Ugc3VyZSB2b2x1bWUgaXMgYSBudW1iZXJcbiAgICAgIHZvbCA9IHBhcnNlRmxvYXQodm9sKTtcblxuICAgICAgaWYgKHZvbCA+PSAwICYmIHZvbCA8PSAxKSB7XG4gICAgICAgIHNlbGYuX3ZvbHVtZSA9IHZvbDtcblxuICAgICAgICBpZiAodXNpbmdXZWJBdWRpbykge1xuICAgICAgICAgIG1hc3RlckdhaW4uZ2Fpbi52YWx1ZSA9IHZvbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCBjYWNoZSBhbmQgY2hhbmdlIHZvbHVtZSBvZiBhbGwgbm9kZXMgdGhhdCBhcmUgdXNpbmcgSFRNTDUgQXVkaW9cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNlbGYuX2hvd2xzKSB7XG4gICAgICAgICAgaWYgKHNlbGYuX2hvd2xzLmhhc093blByb3BlcnR5KGtleSkgJiYgc2VsZi5faG93bHNba2V5XS5fd2ViQXVkaW8gPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGF1ZGlvIG5vZGVzXG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8c2VsZi5faG93bHNba2V5XS5fYXVkaW9Ob2RlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIHNlbGYuX2hvd2xzW2tleV0uX2F1ZGlvTm9kZVtpXS52b2x1bWUgPSBzZWxmLl9ob3dsc1trZXldLl92b2x1bWUgKiBzZWxmLl92b2x1bWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICB9XG5cbiAgICAgIC8vIHJldHVybiB0aGUgY3VycmVudCBnbG9iYWwgdm9sdW1lXG4gICAgICByZXR1cm4gKHVzaW5nV2ViQXVkaW8pID8gbWFzdGVyR2Fpbi5nYWluLnZhbHVlIDogc2VsZi5fdm9sdW1lO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBNdXRlIGFsbCBzb3VuZHMuXG4gICAgICogQHJldHVybiB7SG93bGVyfVxuICAgICAqL1xuICAgIG11dGU6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fc2V0TXV0ZWQodHJ1ZSk7XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVbm11dGUgYWxsIHNvdW5kcy5cbiAgICAgKiBAcmV0dXJuIHtIb3dsZXJ9XG4gICAgICovXG4gICAgdW5tdXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX3NldE11dGVkKGZhbHNlKTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSBtdXRpbmcgYW5kIHVubXV0aW5nIGdsb2JhbGx5LlxuICAgICAqIEBwYXJhbSAge0Jvb2xlYW59IG11dGVkIElzIG11dGVkIG9yIG5vdC5cbiAgICAgKi9cbiAgICBfc2V0TXV0ZWQ6IGZ1bmN0aW9uKG11dGVkKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIHNlbGYuX211dGVkID0gbXV0ZWQ7XG5cbiAgICAgIGlmICh1c2luZ1dlYkF1ZGlvKSB7XG4gICAgICAgIG1hc3RlckdhaW4uZ2Fpbi52YWx1ZSA9IG11dGVkID8gMCA6IHNlbGYuX3ZvbHVtZTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIga2V5IGluIHNlbGYuX2hvd2xzKSB7XG4gICAgICAgIGlmIChzZWxmLl9ob3dscy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIHNlbGYuX2hvd2xzW2tleV0uX3dlYkF1ZGlvID09PSBmYWxzZSkge1xuICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgYXVkaW8gbm9kZXNcbiAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8c2VsZi5faG93bHNba2V5XS5fYXVkaW9Ob2RlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzZWxmLl9ob3dsc1trZXldLl9hdWRpb05vZGVbaV0ubXV0ZWQgPSBtdXRlZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgZm9yIGNvZGVjIHN1cHBvcnQuXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBleHQgQXVkaW8gZmlsZSBleHRlbnNpb24uXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBjb2RlY3M6IGZ1bmN0aW9uKGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2NvZGVjc1tleHRdO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBpT1Mgd2lsbCBvbmx5IGFsbG93IGF1ZGlvIHRvIGJlIHBsYXllZCBhZnRlciBhIHVzZXIgaW50ZXJhY3Rpb24uXG4gICAgICogQXR0ZW1wdCB0byBhdXRvbWF0aWNhbGx5IHVubG9jayBhdWRpbyBvbiB0aGUgZmlyc3QgdXNlciBpbnRlcmFjdGlvbi5cbiAgICAgKiBDb25jZXB0IGZyb206IGh0dHA6Ly9wYXVsYmFrYXVzLmNvbS90dXRvcmlhbHMvaHRtbDUvd2ViLWF1ZGlvLW9uLWlvcy9cbiAgICAgKiBAcmV0dXJuIHtIb3dsZXJ9XG4gICAgICovXG4gICAgX2VuYWJsZWlPU0F1ZGlvOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgLy8gb25seSBydW4gdGhpcyBvbiBpT1MgaWYgYXVkaW8gaXNuJ3QgYWxyZWFkeSBlYW5ibGVkXG4gICAgICBpZiAoY3R4ICYmIChzZWxmLl9pT1NFbmFibGVkIHx8ICEvaVBob25lfGlQYWR8aVBvZC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2VsZi5faU9TRW5hYmxlZCA9IGZhbHNlO1xuXG4gICAgICAvLyBjYWxsIHRoaXMgbWV0aG9kIG9uIHRvdWNoIHN0YXJ0IHRvIGNyZWF0ZSBhbmQgcGxheSBhIGJ1ZmZlcixcbiAgICAgIC8vIHRoZW4gY2hlY2sgaWYgdGhlIGF1ZGlvIGFjdHVhbGx5IHBsYXllZCB0byBkZXRlcm1pbmUgaWZcbiAgICAgIC8vIGF1ZGlvIGhhcyBub3cgYmVlbiB1bmxvY2tlZCBvbiBpT1NcbiAgICAgIHZhciB1bmxvY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY3JlYXRlIGFuIGVtcHR5IGJ1ZmZlclxuICAgICAgICB2YXIgYnVmZmVyID0gY3R4LmNyZWF0ZUJ1ZmZlcigxLCAxLCAyMjA1MCk7XG4gICAgICAgIHZhciBzb3VyY2UgPSBjdHguY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgICAgIHNvdXJjZS5idWZmZXIgPSBidWZmZXI7XG4gICAgICAgIHNvdXJjZS5jb25uZWN0KGN0eC5kZXN0aW5hdGlvbik7XG5cbiAgICAgICAgLy8gcGxheSB0aGUgZW1wdHkgYnVmZmVyXG4gICAgICAgIGlmICh0eXBlb2Ygc291cmNlLnN0YXJ0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHNvdXJjZS5ub3RlT24oMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc291cmNlLnN0YXJ0KDApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2V0dXAgYSB0aW1lb3V0IHRvIGNoZWNrIHRoYXQgd2UgYXJlIHVubG9ja2VkIG9uIHRoZSBuZXh0IGV2ZW50IGxvb3BcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoKHNvdXJjZS5wbGF5YmFja1N0YXRlID09PSBzb3VyY2UuUExBWUlOR19TVEFURSB8fCBzb3VyY2UucGxheWJhY2tTdGF0ZSA9PT0gc291cmNlLkZJTklTSEVEX1NUQVRFKSkge1xuICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSB1bmxvY2tlZCBzdGF0ZSBhbmQgcHJldmVudCB0aGlzIGNoZWNrIGZyb20gaGFwcGVuaW5nIGFnYWluXG4gICAgICAgICAgICBzZWxmLl9pT1NFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlbGYuaU9TQXV0b0VuYWJsZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvLyByZW1vdmUgdGhlIHRvdWNoIHN0YXJ0IGxpc3RlbmVyXG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB1bmxvY2ssIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDApO1xuICAgICAgfTtcblxuICAgICAgLy8gc2V0dXAgYSB0b3VjaCBzdGFydCBsaXN0ZW5lciB0byBhdHRlbXB0IGFuIHVubG9jayBpblxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdW5sb2NrLCBmYWxzZSk7XG5cbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH1cbiAgfTtcblxuICAvLyBjaGVjayBmb3IgYnJvd3NlciBjb2RlYyBzdXBwb3J0XG4gIHZhciBhdWRpb1Rlc3QgPSBudWxsO1xuICB2YXIgY29kZWNzID0ge307XG4gIGlmICghbm9BdWRpbykge1xuICAgIGF1ZGlvVGVzdCA9IG5ldyBBdWRpbygpO1xuICAgIGNvZGVjcyA9IHtcbiAgICAgIG1wMzogISFhdWRpb1Rlc3QuY2FuUGxheVR5cGUoJ2F1ZGlvL21wZWc7JykucmVwbGFjZSgvXm5vJC8sICcnKSxcbiAgICAgIG9wdXM6ICEhYXVkaW9UZXN0LmNhblBsYXlUeXBlKCdhdWRpby9vZ2c7IGNvZGVjcz1cIm9wdXNcIicpLnJlcGxhY2UoL15ubyQvLCAnJyksXG4gICAgICBvZ2c6ICEhYXVkaW9UZXN0LmNhblBsYXlUeXBlKCdhdWRpby9vZ2c7IGNvZGVjcz1cInZvcmJpc1wiJykucmVwbGFjZSgvXm5vJC8sICcnKSxcbiAgICAgIHdhdjogISFhdWRpb1Rlc3QuY2FuUGxheVR5cGUoJ2F1ZGlvL3dhdjsgY29kZWNzPVwiMVwiJykucmVwbGFjZSgvXm5vJC8sICcnKSxcbiAgICAgIGFhYzogISFhdWRpb1Rlc3QuY2FuUGxheVR5cGUoJ2F1ZGlvL2FhYzsnKS5yZXBsYWNlKC9ebm8kLywgJycpLFxuICAgICAgbTRhOiAhIShhdWRpb1Rlc3QuY2FuUGxheVR5cGUoJ2F1ZGlvL3gtbTRhOycpIHx8IGF1ZGlvVGVzdC5jYW5QbGF5VHlwZSgnYXVkaW8vbTRhOycpIHx8IGF1ZGlvVGVzdC5jYW5QbGF5VHlwZSgnYXVkaW8vYWFjOycpKS5yZXBsYWNlKC9ebm8kLywgJycpLFxuICAgICAgbXA0OiAhIShhdWRpb1Rlc3QuY2FuUGxheVR5cGUoJ2F1ZGlvL3gtbXA0OycpIHx8IGF1ZGlvVGVzdC5jYW5QbGF5VHlwZSgnYXVkaW8vbXA0OycpIHx8IGF1ZGlvVGVzdC5jYW5QbGF5VHlwZSgnYXVkaW8vYWFjOycpKS5yZXBsYWNlKC9ebm8kLywgJycpLFxuICAgICAgd2ViYTogISFhdWRpb1Rlc3QuY2FuUGxheVR5cGUoJ2F1ZGlvL3dlYm07IGNvZGVjcz1cInZvcmJpc1wiJykucmVwbGFjZSgvXm5vJC8sICcnKVxuICAgIH07XG4gIH1cblxuICAvLyBhbGxvdyBhY2Nlc3MgdG8gdGhlIGdsb2JhbCBhdWRpbyBjb250cm9sc1xuICB2YXIgSG93bGVyID0gbmV3IEhvd2xlckdsb2JhbChjb2RlY3MpO1xuXG4gIC8vIHNldHVwIHRoZSBhdWRpbyBvYmplY3RcbiAgdmFyIEhvd2wgPSBmdW5jdGlvbihvKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy8gc2V0dXAgdGhlIGRlZmF1bHRzXG4gICAgc2VsZi5fYXV0b3BsYXkgPSBvLmF1dG9wbGF5IHx8IGZhbHNlO1xuICAgIHNlbGYuX2J1ZmZlciA9IG8uYnVmZmVyIHx8IGZhbHNlO1xuICAgIHNlbGYuX2R1cmF0aW9uID0gby5kdXJhdGlvbiB8fCAwO1xuICAgIHNlbGYuX2Zvcm1hdCA9IG8uZm9ybWF0IHx8IG51bGw7XG4gICAgc2VsZi5fbG9vcCA9IG8ubG9vcCB8fCBmYWxzZTtcbiAgICBzZWxmLl9sb2FkZWQgPSBmYWxzZTtcbiAgICBzZWxmLl9zcHJpdGUgPSBvLnNwcml0ZSB8fCB7fTtcbiAgICBzZWxmLl9zcmMgPSBvLnNyYyB8fCAnJztcbiAgICBzZWxmLl9wb3MzZCA9IG8ucG9zM2QgfHwgWzAsIDAsIC0wLjVdO1xuICAgIHNlbGYuX3ZvbHVtZSA9IG8udm9sdW1lICE9PSB1bmRlZmluZWQgPyBvLnZvbHVtZSA6IDE7XG4gICAgc2VsZi5fdXJscyA9IG8udXJscyB8fCBbXTtcbiAgICBzZWxmLl9yYXRlID0gby5yYXRlIHx8IDE7XG5cbiAgICAvLyBhbGxvdyBmb3JjaW5nIG9mIGEgc3BlY2lmaWMgcGFubmluZ01vZGVsICgnZXF1YWxwb3dlcicgb3IgJ0hSVEYnKSxcbiAgICAvLyBpZiBub25lIGlzIHNwZWNpZmllZCwgZGVmYXVsdHMgdG8gJ2VxdWFscG93ZXInIGFuZCBzd2l0Y2hlcyB0byAnSFJURidcbiAgICAvLyBpZiAzZCBzb3VuZCBpcyB1c2VkXG4gICAgc2VsZi5fbW9kZWwgPSBvLm1vZGVsIHx8IG51bGw7XG5cbiAgICAvLyBzZXR1cCBldmVudCBmdW5jdGlvbnNcbiAgICBzZWxmLl9vbmxvYWQgPSBbby5vbmxvYWQgfHwgZnVuY3Rpb24oKSB7fV07XG4gICAgc2VsZi5fb25sb2FkZXJyb3IgPSBbby5vbmxvYWRlcnJvciB8fCBmdW5jdGlvbigpIHt9XTtcbiAgICBzZWxmLl9vbmVuZCA9IFtvLm9uZW5kIHx8IGZ1bmN0aW9uKCkge31dO1xuICAgIHNlbGYuX29ucGF1c2UgPSBbby5vbnBhdXNlIHx8IGZ1bmN0aW9uKCkge31dO1xuICAgIHNlbGYuX29ucGxheSA9IFtvLm9ucGxheSB8fCBmdW5jdGlvbigpIHt9XTtcblxuICAgIHNlbGYuX29uZW5kVGltZXIgPSBbXTtcblxuICAgIC8vIFdlYiBBdWRpbyBvciBIVE1MNSBBdWRpbz9cbiAgICBzZWxmLl93ZWJBdWRpbyA9IHVzaW5nV2ViQXVkaW8gJiYgIXNlbGYuX2J1ZmZlcjtcblxuICAgIC8vIGNoZWNrIGlmIHdlIG5lZWQgdG8gZmFsbCBiYWNrIHRvIEhUTUw1IEF1ZGlvXG4gICAgc2VsZi5fYXVkaW9Ob2RlID0gW107XG4gICAgaWYgKHNlbGYuX3dlYkF1ZGlvKSB7XG4gICAgICBzZWxmLl9zZXR1cEF1ZGlvTm9kZSgpO1xuICAgIH1cblxuICAgIC8vIGF1dG9tYXRpY2FsbHkgdHJ5IHRvIGVuYWJsZSBhdWRpbyBvbiBpT1NcbiAgICBpZiAodHlwZW9mIGN0eCAhPT0gJ3VuZGVmaW5lZCcgJiYgY3R4ICYmIEhvd2xlci5pT1NBdXRvRW5hYmxlKSB7XG4gICAgICBIb3dsZXIuX2VuYWJsZWlPU0F1ZGlvKCk7XG4gICAgfVxuXG4gICAgLy8gYWRkIHRoaXMgdG8gYW4gYXJyYXkgb2YgSG93bCdzIHRvIGFsbG93IGdsb2JhbCBjb250cm9sXG4gICAgSG93bGVyLl9ob3dscy5wdXNoKHNlbGYpO1xuXG4gICAgLy8gbG9hZCB0aGUgdHJhY2tcbiAgICBzZWxmLmxvYWQoKTtcbiAgfTtcblxuICAvLyBzZXR1cCBhbGwgb2YgdGhlIG1ldGhvZHNcbiAgSG93bC5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogTG9hZCBhbiBhdWRpbyBmaWxlLlxuICAgICAqIEByZXR1cm4ge0hvd2x9XG4gICAgICovXG4gICAgbG9hZDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIHVybCA9IG51bGw7XG5cbiAgICAgIC8vIGlmIG5vIGF1ZGlvIGlzIGF2YWlsYWJsZSwgcXVpdCBpbW1lZGlhdGVseVxuICAgICAgaWYgKG5vQXVkaW8pIHtcbiAgICAgICAgc2VsZi5vbignbG9hZGVycm9yJywgbmV3IEVycm9yKCdObyBhdWRpbyBzdXBwb3J0LicpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBsb29wIHRocm91Z2ggc291cmNlIFVSTHMgYW5kIHBpY2sgdGhlIGZpcnN0IG9uZSB0aGF0IGlzIGNvbXBhdGlibGVcbiAgICAgIGZvciAodmFyIGk9MDsgaTxzZWxmLl91cmxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBleHQsIHVybEl0ZW07XG5cbiAgICAgICAgaWYgKHNlbGYuX2Zvcm1hdCkge1xuICAgICAgICAgIC8vIHVzZSBzcGVjaWZpZWQgYXVkaW8gZm9ybWF0IGlmIGF2YWlsYWJsZVxuICAgICAgICAgIGV4dCA9IHNlbGYuX2Zvcm1hdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBmaWd1cmUgb3V0IHRoZSBmaWxldHlwZSAod2hldGhlciBhbiBleHRlbnNpb24gb3IgYmFzZTY0IGRhdGEpXG4gICAgICAgICAgdXJsSXRlbSA9IHNlbGYuX3VybHNbaV07XG4gICAgICAgICAgZXh0ID0gL15kYXRhOmF1ZGlvXFwvKFteOyxdKyk7L2kuZXhlYyh1cmxJdGVtKTtcbiAgICAgICAgICBpZiAoIWV4dCkge1xuICAgICAgICAgICAgZXh0ID0gL1xcLihbXi5dKykkLy5leGVjKHVybEl0ZW0uc3BsaXQoJz8nLCAxKVswXSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGV4dCkge1xuICAgICAgICAgICAgZXh0ID0gZXh0WzFdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYub24oJ2xvYWRlcnJvcicsIG5ldyBFcnJvcignQ291bGQgbm90IGV4dHJhY3QgZm9ybWF0IGZyb20gcGFzc2VkIFVSTHMsIHBsZWFzZSBhZGQgZm9ybWF0IHBhcmFtZXRlci4nKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvZGVjc1tleHRdKSB7XG4gICAgICAgICAgdXJsID0gc2VsZi5fdXJsc1tpXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIXVybCkge1xuICAgICAgICBzZWxmLm9uKCdsb2FkZXJyb3InLCBuZXcgRXJyb3IoJ05vIGNvZGVjIHN1cHBvcnQgZm9yIHNlbGVjdGVkIGF1ZGlvIHNvdXJjZXMuJykpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNlbGYuX3NyYyA9IHVybDtcblxuICAgICAgaWYgKHNlbGYuX3dlYkF1ZGlvKSB7XG4gICAgICAgIGxvYWRCdWZmZXIoc2VsZiwgdXJsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBuZXdOb2RlID0gbmV3IEF1ZGlvKCk7XG5cbiAgICAgICAgLy8gbGlzdGVuIGZvciBlcnJvcnMgd2l0aCBIVE1MNSBhdWRpbyAoaHR0cDovL2Rldi53My5vcmcvaHRtbDUvc3BlYy1hdXRob3Itdmlldy9zcGVjLmh0bWwjbWVkaWFlcnJvcilcbiAgICAgICAgbmV3Tm9kZS5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAobmV3Tm9kZS5lcnJvciAmJiBuZXdOb2RlLmVycm9yLmNvZGUgPT09IDQpIHtcbiAgICAgICAgICAgIEhvd2xlckdsb2JhbC5ub0F1ZGlvID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzZWxmLm9uKCdsb2FkZXJyb3InLCB7dHlwZTogbmV3Tm9kZS5lcnJvciA/IG5ld05vZGUuZXJyb3IuY29kZSA6IDB9KTtcbiAgICAgICAgfSwgZmFsc2UpO1xuXG4gICAgICAgIHNlbGYuX2F1ZGlvTm9kZS5wdXNoKG5ld05vZGUpO1xuXG4gICAgICAgIC8vIHNldHVwIHRoZSBuZXcgYXVkaW8gbm9kZVxuICAgICAgICBuZXdOb2RlLnNyYyA9IHVybDtcbiAgICAgICAgbmV3Tm9kZS5fcG9zID0gMDtcbiAgICAgICAgbmV3Tm9kZS5wcmVsb2FkID0gJ2F1dG8nO1xuICAgICAgICBuZXdOb2RlLnZvbHVtZSA9IChIb3dsZXIuX211dGVkKSA/IDAgOiBzZWxmLl92b2x1bWUgKiBIb3dsZXIudm9sdW1lKCk7XG5cbiAgICAgICAgLy8gc2V0dXAgdGhlIGV2ZW50IGxpc3RlbmVyIHRvIHN0YXJ0IHBsYXlpbmcgdGhlIHNvdW5kXG4gICAgICAgIC8vIGFzIHNvb24gYXMgaXQgaGFzIGJ1ZmZlcmVkIGVub3VnaFxuICAgICAgICB2YXIgbGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAvLyByb3VuZCB1cCB0aGUgZHVyYXRpb24gd2hlbiB1c2luZyBIVE1MNSBBdWRpbyB0byBhY2NvdW50IGZvciB0aGUgbG93ZXIgcHJlY2lzaW9uXG4gICAgICAgICAgc2VsZi5fZHVyYXRpb24gPSBNYXRoLmNlaWwobmV3Tm9kZS5kdXJhdGlvbiAqIDEwKSAvIDEwO1xuXG4gICAgICAgICAgLy8gc2V0dXAgYSBzcHJpdGUgaWYgbm9uZSBpcyBkZWZpbmVkXG4gICAgICAgICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHNlbGYuX3Nwcml0ZSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBzZWxmLl9zcHJpdGUgPSB7X2RlZmF1bHQ6IFswLCBzZWxmLl9kdXJhdGlvbiAqIDEwMDBdfTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXNlbGYuX2xvYWRlZCkge1xuICAgICAgICAgICAgc2VsZi5fbG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlbGYub24oJ2xvYWQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2VsZi5fYXV0b3BsYXkpIHtcbiAgICAgICAgICAgIHNlbGYucGxheSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGNsZWFyIHRoZSBldmVudCBsaXN0ZW5lclxuICAgICAgICAgIG5ld05vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2FucGxheXRocm91Z2gnLCBsaXN0ZW5lciwgZmFsc2UpO1xuICAgICAgICB9O1xuICAgICAgICBuZXdOb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NhbnBsYXl0aHJvdWdoJywgbGlzdGVuZXIsIGZhbHNlKTtcbiAgICAgICAgbmV3Tm9kZS5sb2FkKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQvc2V0IHRoZSBVUkxzIHRvIGJlIHB1bGxlZCBmcm9tIHRvIHBsYXkgaW4gdGhpcyBzb3VyY2UuXG4gICAgICogQHBhcmFtICB7QXJyYXl9IHVybHMgIEFycnkgb2YgVVJMcyB0byBsb2FkIGZyb21cbiAgICAgKiBAcmV0dXJuIHtIb3dsfSAgICAgICAgUmV0dXJucyBzZWxmIG9yIHRoZSBjdXJyZW50IFVSTHNcbiAgICAgKi9cbiAgICB1cmxzOiBmdW5jdGlvbih1cmxzKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIGlmICh1cmxzKSB7XG4gICAgICAgIHNlbGYuc3RvcCgpO1xuICAgICAgICBzZWxmLl91cmxzID0gKHR5cGVvZiB1cmxzID09PSAnc3RyaW5nJykgPyBbdXJsc10gOiB1cmxzO1xuICAgICAgICBzZWxmLl9sb2FkZWQgPSBmYWxzZTtcbiAgICAgICAgc2VsZi5sb2FkKCk7XG5cbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc2VsZi5fdXJscztcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUGxheSBhIHNvdW5kIGZyb20gdGhlIGN1cnJlbnQgdGltZSAoMCBieSBkZWZhdWx0KS5cbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgc3ByaXRlICAgKG9wdGlvbmFsKSBQbGF5cyBmcm9tIHRoZSBzcGVjaWZpZWQgcG9zaXRpb24gaW4gdGhlIHNvdW5kIHNwcml0ZSBkZWZpbml0aW9uLlxuICAgICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFjayAob3B0aW9uYWwpIFJldHVybnMgdGhlIHVuaXF1ZSBwbGF5YmFjayBpZCBmb3IgdGhpcyBzb3VuZCBpbnN0YW5jZS5cbiAgICAgKiBAcmV0dXJuIHtIb3dsfVxuICAgICAqL1xuICAgIHBsYXk6IGZ1bmN0aW9uKHNwcml0ZSwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgLy8gaWYgbm8gc3ByaXRlIHdhcyBwYXNzZWQgYnV0IGEgY2FsbGJhY2sgd2FzLCB1cGRhdGUgdGhlIHZhcmlhYmxlc1xuICAgICAgaWYgKHR5cGVvZiBzcHJpdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBzcHJpdGU7XG4gICAgICB9XG5cbiAgICAgIC8vIHVzZSB0aGUgZGVmYXVsdCBzcHJpdGUgaWYgbm9uZSBpcyBwYXNzZWRcbiAgICAgIGlmICghc3ByaXRlIHx8IHR5cGVvZiBzcHJpdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgc3ByaXRlID0gJ19kZWZhdWx0JztcbiAgICAgIH1cblxuICAgICAgLy8gaWYgdGhlIHNvdW5kIGhhc24ndCBiZWVuIGxvYWRlZCwgYWRkIGl0IHRvIHRoZSBldmVudCBxdWV1ZVxuICAgICAgaWYgKCFzZWxmLl9sb2FkZWQpIHtcbiAgICAgICAgc2VsZi5vbignbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHNlbGYucGxheShzcHJpdGUsIGNhbGxiYWNrKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICB9XG5cbiAgICAgIC8vIGlmIHRoZSBzcHJpdGUgZG9lc24ndCBleGlzdCwgcGxheSBub3RoaW5nXG4gICAgICBpZiAoIXNlbGYuX3Nwcml0ZVtzcHJpdGVdKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKCk7XG4gICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgfVxuXG4gICAgICAvLyBnZXQgdGhlIG5vZGUgdG8gcGxheWJhY2tcbiAgICAgIHNlbGYuX2luYWN0aXZlTm9kZShmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIC8vIHBlcnNpc3QgdGhlIHNwcml0ZSBiZWluZyBwbGF5ZWRcbiAgICAgICAgbm9kZS5fc3ByaXRlID0gc3ByaXRlO1xuXG4gICAgICAgIC8vIGRldGVybWluZSB3aGVyZSB0byBzdGFydCBwbGF5aW5nIGZyb21cbiAgICAgICAgdmFyIHBvcyA9IChub2RlLl9wb3MgPiAwKSA/IG5vZGUuX3BvcyA6IHNlbGYuX3Nwcml0ZVtzcHJpdGVdWzBdIC8gMTAwMDtcblxuICAgICAgICAvLyBkZXRlcm1pbmUgaG93IGxvbmcgdG8gcGxheSBmb3JcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gMDtcbiAgICAgICAgaWYgKHNlbGYuX3dlYkF1ZGlvKSB7XG4gICAgICAgICAgZHVyYXRpb24gPSBzZWxmLl9zcHJpdGVbc3ByaXRlXVsxXSAvIDEwMDAgLSBub2RlLl9wb3M7XG4gICAgICAgICAgaWYgKG5vZGUuX3BvcyA+IDApIHtcbiAgICAgICAgICAgIHBvcyA9IHNlbGYuX3Nwcml0ZVtzcHJpdGVdWzBdIC8gMTAwMCArIHBvcztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZHVyYXRpb24gPSBzZWxmLl9zcHJpdGVbc3ByaXRlXVsxXSAvIDEwMDAgLSAocG9zIC0gc2VsZi5fc3ByaXRlW3Nwcml0ZV1bMF0gLyAxMDAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGRldGVybWluZSBpZiB0aGlzIHNvdW5kIHNob3VsZCBiZSBsb29wZWRcbiAgICAgICAgdmFyIGxvb3AgPSAhIShzZWxmLl9sb29wIHx8IHNlbGYuX3Nwcml0ZVtzcHJpdGVdWzJdKTtcblxuICAgICAgICAvLyBzZXQgdGltZXIgdG8gZmlyZSB0aGUgJ29uZW5kJyBldmVudFxuICAgICAgICB2YXIgc291bmRJZCA9ICh0eXBlb2YgY2FsbGJhY2sgPT09ICdzdHJpbmcnKSA/IGNhbGxiYWNrIDogTWF0aC5yb3VuZChEYXRlLm5vdygpICogTWF0aC5yYW5kb20oKSkgKyAnJyxcbiAgICAgICAgICB0aW1lcklkO1xuICAgICAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICBpZDogc291bmRJZCxcbiAgICAgICAgICAgIHNwcml0ZTogc3ByaXRlLFxuICAgICAgICAgICAgbG9vcDogbG9vcFxuICAgICAgICAgIH07XG4gICAgICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBpZiBsb29waW5nLCByZXN0YXJ0IHRoZSB0cmFja1xuICAgICAgICAgICAgaWYgKCFzZWxmLl93ZWJBdWRpbyAmJiBsb29wKSB7XG4gICAgICAgICAgICAgIHNlbGYuc3RvcChkYXRhLmlkKS5wbGF5KHNwcml0ZSwgZGF0YS5pZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNldCB3ZWIgYXVkaW8gbm9kZSB0byBwYXVzZWQgYXQgZW5kXG4gICAgICAgICAgICBpZiAoc2VsZi5fd2ViQXVkaW8gJiYgIWxvb3ApIHtcbiAgICAgICAgICAgICAgc2VsZi5fbm9kZUJ5SWQoZGF0YS5pZCkucGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgc2VsZi5fbm9kZUJ5SWQoZGF0YS5pZCkuX3BvcyA9IDA7XG5cbiAgICAgICAgICAgICAgLy8gY2xlYXIgdGhlIGVuZCB0aW1lclxuICAgICAgICAgICAgICBzZWxmLl9jbGVhckVuZFRpbWVyKGRhdGEuaWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBlbmQgdGhlIHRyYWNrIGlmIGl0IGlzIEhUTUwgYXVkaW8gYW5kIGEgc3ByaXRlXG4gICAgICAgICAgICBpZiAoIXNlbGYuX3dlYkF1ZGlvICYmICFsb29wKSB7XG4gICAgICAgICAgICAgIHNlbGYuc3RvcChkYXRhLmlkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZmlyZSBlbmRlZCBldmVudFxuICAgICAgICAgICAgc2VsZi5vbignZW5kJywgc291bmRJZCk7XG4gICAgICAgICAgfSwgKGR1cmF0aW9uIC8gc2VsZi5fcmF0ZSkgKiAxMDAwKTtcblxuICAgICAgICAgIC8vIHN0b3JlIHRoZSByZWZlcmVuY2UgdG8gdGhlIHRpbWVyXG4gICAgICAgICAgc2VsZi5fb25lbmRUaW1lci5wdXNoKHt0aW1lcjogdGltZXJJZCwgaWQ6IGRhdGEuaWR9KTtcbiAgICAgICAgfSkoKTtcblxuICAgICAgICBpZiAoc2VsZi5fd2ViQXVkaW8pIHtcbiAgICAgICAgICB2YXIgbG9vcFN0YXJ0ID0gc2VsZi5fc3ByaXRlW3Nwcml0ZV1bMF0gLyAxMDAwLFxuICAgICAgICAgICAgbG9vcEVuZCA9IHNlbGYuX3Nwcml0ZVtzcHJpdGVdWzFdIC8gMTAwMDtcblxuICAgICAgICAgIC8vIHNldCB0aGUgcGxheSBpZCB0byB0aGlzIG5vZGUgYW5kIGxvYWQgaW50byBjb250ZXh0XG4gICAgICAgICAgbm9kZS5pZCA9IHNvdW5kSWQ7XG4gICAgICAgICAgbm9kZS5wYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgICByZWZyZXNoQnVmZmVyKHNlbGYsIFtsb29wLCBsb29wU3RhcnQsIGxvb3BFbmRdLCBzb3VuZElkKTtcbiAgICAgICAgICBzZWxmLl9wbGF5U3RhcnQgPSBjdHguY3VycmVudFRpbWU7XG4gICAgICAgICAgbm9kZS5nYWluLnZhbHVlID0gc2VsZi5fdm9sdW1lO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBub2RlLmJ1ZmZlclNvdXJjZS5zdGFydCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGxvb3AgPyBub2RlLmJ1ZmZlclNvdXJjZS5ub3RlR3JhaW5PbigwLCBwb3MsIDg2NDAwKSA6IG5vZGUuYnVmZmVyU291cmNlLm5vdGVHcmFpbk9uKDAsIHBvcywgZHVyYXRpb24pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb29wID8gbm9kZS5idWZmZXJTb3VyY2Uuc3RhcnQoMCwgcG9zLCA4NjQwMCkgOiBub2RlLmJ1ZmZlclNvdXJjZS5zdGFydCgwLCBwb3MsIGR1cmF0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG5vZGUucmVhZHlTdGF0ZSA9PT0gNCB8fCAhbm9kZS5yZWFkeVN0YXRlICYmIG5hdmlnYXRvci5pc0NvY29vbkpTKSB7XG4gICAgICAgICAgICBub2RlLnJlYWR5U3RhdGUgPSA0O1xuICAgICAgICAgICAgbm9kZS5pZCA9IHNvdW5kSWQ7XG4gICAgICAgICAgICBub2RlLmN1cnJlbnRUaW1lID0gcG9zO1xuICAgICAgICAgICAgbm9kZS5tdXRlZCA9IEhvd2xlci5fbXV0ZWQgfHwgbm9kZS5tdXRlZDtcbiAgICAgICAgICAgIG5vZGUudm9sdW1lID0gc2VsZi5fdm9sdW1lICogSG93bGVyLnZvbHVtZSgpO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgbm9kZS5wbGF5KCk7IH0sIDApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWxmLl9jbGVhckVuZFRpbWVyKHNvdW5kSWQpO1xuXG4gICAgICAgICAgICAoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgdmFyIHNvdW5kID0gc2VsZixcbiAgICAgICAgICAgICAgICBwbGF5U3ByaXRlID0gc3ByaXRlLFxuICAgICAgICAgICAgICAgIGZuID0gY2FsbGJhY2ssXG4gICAgICAgICAgICAgICAgbmV3Tm9kZSA9IG5vZGU7XG4gICAgICAgICAgICAgIHZhciBsaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNvdW5kLnBsYXkocGxheVNwcml0ZSwgZm4pO1xuXG4gICAgICAgICAgICAgICAgLy8gY2xlYXIgdGhlIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgICAgICAgbmV3Tm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKCdjYW5wbGF5dGhyb3VnaCcsIGxpc3RlbmVyLCBmYWxzZSk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIG5ld05vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2FucGxheXRocm91Z2gnLCBsaXN0ZW5lciwgZmFsc2UpO1xuICAgICAgICAgICAgfSkoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZmlyZSB0aGUgcGxheSBldmVudCBhbmQgc2VuZCB0aGUgc291bmRJZCBiYWNrIGluIHRoZSBjYWxsYmFja1xuICAgICAgICBzZWxmLm9uKCdwbGF5Jyk7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKHNvdW5kSWQpO1xuXG4gICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBQYXVzZSBwbGF5YmFjayBhbmQgc2F2ZSB0aGUgY3VycmVudCBwb3NpdGlvbi5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgKG9wdGlvbmFsKSBUaGUgcGxheSBpbnN0YW5jZSBJRC5cbiAgICAgKiBAcmV0dXJuIHtIb3dsfVxuICAgICAqL1xuICAgIHBhdXNlOiBmdW5jdGlvbihpZCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAvLyBpZiB0aGUgc291bmQgaGFzbid0IGJlZW4gbG9hZGVkLCBhZGQgaXQgdG8gdGhlIGV2ZW50IHF1ZXVlXG4gICAgICBpZiAoIXNlbGYuX2xvYWRlZCkge1xuICAgICAgICBzZWxmLm9uKCdwbGF5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc2VsZi5wYXVzZShpZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgfVxuXG4gICAgICAvLyBjbGVhciAnb25lbmQnIHRpbWVyXG4gICAgICBzZWxmLl9jbGVhckVuZFRpbWVyKGlkKTtcblxuICAgICAgdmFyIGFjdGl2ZU5vZGUgPSAoaWQpID8gc2VsZi5fbm9kZUJ5SWQoaWQpIDogc2VsZi5fYWN0aXZlTm9kZSgpO1xuICAgICAgaWYgKGFjdGl2ZU5vZGUpIHtcbiAgICAgICAgYWN0aXZlTm9kZS5fcG9zID0gc2VsZi5wb3MobnVsbCwgaWQpO1xuXG4gICAgICAgIGlmIChzZWxmLl93ZWJBdWRpbykge1xuICAgICAgICAgIC8vIG1ha2Ugc3VyZSB0aGUgc291bmQgaGFzIGJlZW4gY3JlYXRlZFxuICAgICAgICAgIGlmICghYWN0aXZlTm9kZS5idWZmZXJTb3VyY2UgfHwgYWN0aXZlTm9kZS5wYXVzZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGFjdGl2ZU5vZGUucGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgICBpZiAodHlwZW9mIGFjdGl2ZU5vZGUuYnVmZmVyU291cmNlLnN0b3AgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBhY3RpdmVOb2RlLmJ1ZmZlclNvdXJjZS5ub3RlT2ZmKDApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhY3RpdmVOb2RlLmJ1ZmZlclNvdXJjZS5zdG9wKDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhY3RpdmVOb2RlLnBhdXNlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc2VsZi5vbigncGF1c2UnKTtcblxuICAgICAgcmV0dXJuIHNlbGY7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFN0b3AgcGxheWJhY2sgYW5kIHJlc2V0IHRvIHN0YXJ0LlxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gaWQgIChvcHRpb25hbCkgVGhlIHBsYXkgaW5zdGFuY2UgSUQuXG4gICAgICogQHJldHVybiB7SG93bH1cbiAgICAgKi9cbiAgICBzdG9wOiBmdW5jdGlvbihpZCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAvLyBpZiB0aGUgc291bmQgaGFzbid0IGJlZW4gbG9hZGVkLCBhZGQgaXQgdG8gdGhlIGV2ZW50IHF1ZXVlXG4gICAgICBpZiAoIXNlbGYuX2xvYWRlZCkge1xuICAgICAgICBzZWxmLm9uKCdwbGF5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc2VsZi5zdG9wKGlkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICB9XG5cbiAgICAgIC8vIGNsZWFyICdvbmVuZCcgdGltZXJcbiAgICAgIHNlbGYuX2NsZWFyRW5kVGltZXIoaWQpO1xuXG4gICAgICB2YXIgYWN0aXZlTm9kZSA9IChpZCkgPyBzZWxmLl9ub2RlQnlJZChpZCkgOiBzZWxmLl9hY3RpdmVOb2RlKCk7XG4gICAgICBpZiAoYWN0aXZlTm9kZSkge1xuICAgICAgICBhY3RpdmVOb2RlLl9wb3MgPSAwO1xuXG4gICAgICAgIGlmIChzZWxmLl93ZWJBdWRpbykge1xuICAgICAgICAgIC8vIG1ha2Ugc3VyZSB0aGUgc291bmQgaGFzIGJlZW4gY3JlYXRlZFxuICAgICAgICAgIGlmICghYWN0aXZlTm9kZS5idWZmZXJTb3VyY2UgfHwgYWN0aXZlTm9kZS5wYXVzZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGFjdGl2ZU5vZGUucGF1c2VkID0gdHJ1ZTtcblxuICAgICAgICAgIGlmICh0eXBlb2YgYWN0aXZlTm9kZS5idWZmZXJTb3VyY2Uuc3RvcCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGFjdGl2ZU5vZGUuYnVmZmVyU291cmNlLm5vdGVPZmYoMCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFjdGl2ZU5vZGUuYnVmZmVyU291cmNlLnN0b3AoMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCFpc05hTihhY3RpdmVOb2RlLmR1cmF0aW9uKSkge1xuICAgICAgICAgIGFjdGl2ZU5vZGUucGF1c2UoKTtcbiAgICAgICAgICBhY3RpdmVOb2RlLmN1cnJlbnRUaW1lID0gMDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2VsZjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTXV0ZSB0aGlzIHNvdW5kLlxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gaWQgKG9wdGlvbmFsKSBUaGUgcGxheSBpbnN0YW5jZSBJRC5cbiAgICAgKiBAcmV0dXJuIHtIb3dsfVxuICAgICAqL1xuICAgIG11dGU6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIC8vIGlmIHRoZSBzb3VuZCBoYXNuJ3QgYmVlbiBsb2FkZWQsIGFkZCBpdCB0byB0aGUgZXZlbnQgcXVldWVcbiAgICAgIGlmICghc2VsZi5fbG9hZGVkKSB7XG4gICAgICAgIHNlbGYub24oJ3BsYXknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBzZWxmLm11dGUoaWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICAgIH1cblxuICAgICAgdmFyIGFjdGl2ZU5vZGUgPSAoaWQpID8gc2VsZi5fbm9kZUJ5SWQoaWQpIDogc2VsZi5fYWN0aXZlTm9kZSgpO1xuICAgICAgaWYgKGFjdGl2ZU5vZGUpIHtcbiAgICAgICAgaWYgKHNlbGYuX3dlYkF1ZGlvKSB7XG4gICAgICAgICAgYWN0aXZlTm9kZS5nYWluLnZhbHVlID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhY3RpdmVOb2RlLm11dGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2VsZjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVW5tdXRlIHRoaXMgc291bmQuXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBpZCAob3B0aW9uYWwpIFRoZSBwbGF5IGluc3RhbmNlIElELlxuICAgICAqIEByZXR1cm4ge0hvd2x9XG4gICAgICovXG4gICAgdW5tdXRlOiBmdW5jdGlvbihpZCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAvLyBpZiB0aGUgc291bmQgaGFzbid0IGJlZW4gbG9hZGVkLCBhZGQgaXQgdG8gdGhlIGV2ZW50IHF1ZXVlXG4gICAgICBpZiAoIXNlbGYuX2xvYWRlZCkge1xuICAgICAgICBzZWxmLm9uKCdwbGF5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc2VsZi51bm11dGUoaWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICAgIH1cblxuICAgICAgdmFyIGFjdGl2ZU5vZGUgPSAoaWQpID8gc2VsZi5fbm9kZUJ5SWQoaWQpIDogc2VsZi5fYWN0aXZlTm9kZSgpO1xuICAgICAgaWYgKGFjdGl2ZU5vZGUpIHtcbiAgICAgICAgaWYgKHNlbGYuX3dlYkF1ZGlvKSB7XG4gICAgICAgICAgYWN0aXZlTm9kZS5nYWluLnZhbHVlID0gc2VsZi5fdm9sdW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFjdGl2ZU5vZGUubXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2VsZjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0L3NldCB2b2x1bWUgb2YgdGhpcyBzb3VuZC5cbiAgICAgKiBAcGFyYW0gIHtGbG9hdH0gIHZvbCBWb2x1bWUgZnJvbSAwLjAgdG8gMS4wLlxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gaWQgIChvcHRpb25hbCkgVGhlIHBsYXkgaW5zdGFuY2UgSUQuXG4gICAgICogQHJldHVybiB7SG93bC9GbG9hdH0gICAgIFJldHVybnMgc2VsZiBvciBjdXJyZW50IHZvbHVtZS5cbiAgICAgKi9cbiAgICB2b2x1bWU6IGZ1bmN0aW9uKHZvbCwgaWQpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgLy8gbWFrZSBzdXJlIHZvbHVtZSBpcyBhIG51bWJlclxuICAgICAgdm9sID0gcGFyc2VGbG9hdCh2b2wpO1xuXG4gICAgICBpZiAodm9sID49IDAgJiYgdm9sIDw9IDEpIHtcbiAgICAgICAgc2VsZi5fdm9sdW1lID0gdm9sO1xuXG4gICAgICAgIC8vIGlmIHRoZSBzb3VuZCBoYXNuJ3QgYmVlbiBsb2FkZWQsIGFkZCBpdCB0byB0aGUgZXZlbnQgcXVldWVcbiAgICAgICAgaWYgKCFzZWxmLl9sb2FkZWQpIHtcbiAgICAgICAgICBzZWxmLm9uKCdwbGF5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLnZvbHVtZSh2b2wsIGlkKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFjdGl2ZU5vZGUgPSAoaWQpID8gc2VsZi5fbm9kZUJ5SWQoaWQpIDogc2VsZi5fYWN0aXZlTm9kZSgpO1xuICAgICAgICBpZiAoYWN0aXZlTm9kZSkge1xuICAgICAgICAgIGlmIChzZWxmLl93ZWJBdWRpbykge1xuICAgICAgICAgICAgYWN0aXZlTm9kZS5nYWluLnZhbHVlID0gdm9sO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhY3RpdmVOb2RlLnZvbHVtZSA9IHZvbCAqIEhvd2xlci52b2x1bWUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzZWxmLl92b2x1bWU7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldC9zZXQgd2hldGhlciB0byBsb29wIHRoZSBzb3VuZC5cbiAgICAgKiBAcGFyYW0gIHtCb29sZWFufSBsb29wIFRvIGxvb3Agb3Igbm90IHRvIGxvb3AsIHRoYXQgaXMgdGhlIHF1ZXN0aW9uLlxuICAgICAqIEByZXR1cm4ge0hvd2wvQm9vbGVhbn0gICAgICBSZXR1cm5zIHNlbGYgb3IgY3VycmVudCBsb29waW5nIHZhbHVlLlxuICAgICAqL1xuICAgIGxvb3A6IGZ1bmN0aW9uKGxvb3ApIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgaWYgKHR5cGVvZiBsb29wID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgc2VsZi5fbG9vcCA9IGxvb3A7XG5cbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc2VsZi5fbG9vcDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0L3NldCBzb3VuZCBzcHJpdGUgZGVmaW5pdGlvbi5cbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IHNwcml0ZSBFeGFtcGxlOiB7c3ByaXRlTmFtZTogW29mZnNldCwgZHVyYXRpb24sIGxvb3BdfVxuICAgICAqICAgICAgICAgICAgICAgIEBwYXJhbSB7SW50ZWdlcn0gb2Zmc2V0ICAgV2hlcmUgdG8gYmVnaW4gcGxheWJhY2sgaW4gbWlsbGlzZWNvbmRzXG4gICAgICogICAgICAgICAgICAgICAgQHBhcmFtIHtJbnRlZ2VyfSBkdXJhdGlvbiBIb3cgbG9uZyB0byBwbGF5IGluIG1pbGxpc2Vjb25kc1xuICAgICAqICAgICAgICAgICAgICAgIEBwYXJhbSB7Qm9vbGVhbn0gbG9vcCAgICAgKG9wdGlvbmFsKSBTZXQgdHJ1ZSB0byBsb29wIHRoaXMgc3ByaXRlXG4gICAgICogQHJldHVybiB7SG93bH0gICAgICAgIFJldHVybnMgY3VycmVudCBzcHJpdGUgc2hlZXQgb3Igc2VsZi5cbiAgICAgKi9cbiAgICBzcHJpdGU6IGZ1bmN0aW9uKHNwcml0ZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICBpZiAodHlwZW9mIHNwcml0ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgc2VsZi5fc3ByaXRlID0gc3ByaXRlO1xuXG4gICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuX3Nwcml0ZTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0L3NldCB0aGUgcG9zaXRpb24gb2YgcGxheWJhY2suXG4gICAgICogQHBhcmFtICB7RmxvYXR9ICBwb3MgVGhlIHBvc2l0aW9uIHRvIG1vdmUgY3VycmVudCBwbGF5YmFjayB0by5cbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGlkICAob3B0aW9uYWwpIFRoZSBwbGF5IGluc3RhbmNlIElELlxuICAgICAqIEByZXR1cm4ge0hvd2wvRmxvYXR9ICAgICAgUmV0dXJucyBzZWxmIG9yIGN1cnJlbnQgcGxheWJhY2sgcG9zaXRpb24uXG4gICAgICovXG4gICAgcG9zOiBmdW5jdGlvbihwb3MsIGlkKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIC8vIGlmIHRoZSBzb3VuZCBoYXNuJ3QgYmVlbiBsb2FkZWQsIGFkZCBpdCB0byB0aGUgZXZlbnQgcXVldWVcbiAgICAgIGlmICghc2VsZi5fbG9hZGVkKSB7XG4gICAgICAgIHNlbGYub24oJ2xvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBzZWxmLnBvcyhwb3MpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdHlwZW9mIHBvcyA9PT0gJ251bWJlcicgPyBzZWxmIDogc2VsZi5fcG9zIHx8IDA7XG4gICAgICB9XG5cbiAgICAgIC8vIG1ha2Ugc3VyZSB3ZSBhcmUgZGVhbGluZyB3aXRoIGEgbnVtYmVyIGZvciBwb3NcbiAgICAgIHBvcyA9IHBhcnNlRmxvYXQocG9zKTtcblxuICAgICAgdmFyIGFjdGl2ZU5vZGUgPSAoaWQpID8gc2VsZi5fbm9kZUJ5SWQoaWQpIDogc2VsZi5fYWN0aXZlTm9kZSgpO1xuICAgICAgaWYgKGFjdGl2ZU5vZGUpIHtcbiAgICAgICAgaWYgKHBvcyA+PSAwKSB7XG4gICAgICAgICAgc2VsZi5wYXVzZShpZCk7XG4gICAgICAgICAgYWN0aXZlTm9kZS5fcG9zID0gcG9zO1xuICAgICAgICAgIHNlbGYucGxheShhY3RpdmVOb2RlLl9zcHJpdGUsIGlkKTtcblxuICAgICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBzZWxmLl93ZWJBdWRpbyA/IGFjdGl2ZU5vZGUuX3BvcyArIChjdHguY3VycmVudFRpbWUgLSBzZWxmLl9wbGF5U3RhcnQpIDogYWN0aXZlTm9kZS5jdXJyZW50VGltZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChwb3MgPj0gMCkge1xuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGZpbmQgdGhlIGZpcnN0IGluYWN0aXZlIG5vZGUgdG8gcmV0dXJuIHRoZSBwb3MgZm9yXG4gICAgICAgIGZvciAodmFyIGk9MDsgaTxzZWxmLl9hdWRpb05vZGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoc2VsZi5fYXVkaW9Ob2RlW2ldLnBhdXNlZCAmJiBzZWxmLl9hdWRpb05vZGVbaV0ucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgICAgcmV0dXJuIChzZWxmLl93ZWJBdWRpbykgPyBzZWxmLl9hdWRpb05vZGVbaV0uX3BvcyA6IHNlbGYuX2F1ZGlvTm9kZVtpXS5jdXJyZW50VGltZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0L3NldCB0aGUgM0QgcG9zaXRpb24gb2YgdGhlIGF1ZGlvIHNvdXJjZS5cbiAgICAgKiBUaGUgbW9zdCBjb21tb24gdXNhZ2UgaXMgdG8gc2V0IHRoZSAneCcgcG9zaXRpb25cbiAgICAgKiB0byBhZmZlY3QgdGhlIGxlZnQvcmlnaHQgZWFyIHBhbm5pbmcuIFNldHRpbmcgYW55IHZhbHVlIGhpZ2hlciB0aGFuXG4gICAgICogMS4wIHdpbGwgYmVnaW4gdG8gZGVjcmVhc2UgdGhlIHZvbHVtZSBvZiB0aGUgc291bmQgYXMgaXQgbW92ZXMgZnVydGhlciBhd2F5LlxuICAgICAqIE5PVEU6IFRoaXMgb25seSB3b3JrcyB3aXRoIFdlYiBBdWRpbyBBUEksIEhUTUw1IEF1ZGlvIHBsYXliYWNrXG4gICAgICogd2lsbCBub3QgYmUgYWZmZWN0ZWQuXG4gICAgICogQHBhcmFtICB7RmxvYXR9ICB4ICBUaGUgeC1wb3NpdGlvbiBvZiB0aGUgcGxheWJhY2sgZnJvbSAtMTAwMC4wIHRvIDEwMDAuMFxuICAgICAqIEBwYXJhbSAge0Zsb2F0fSAgeSAgVGhlIHktcG9zaXRpb24gb2YgdGhlIHBsYXliYWNrIGZyb20gLTEwMDAuMCB0byAxMDAwLjBcbiAgICAgKiBAcGFyYW0gIHtGbG9hdH0gIHogIFRoZSB6LXBvc2l0aW9uIG9mIHRoZSBwbGF5YmFjayBmcm9tIC0xMDAwLjAgdG8gMTAwMC4wXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBpZCAob3B0aW9uYWwpIFRoZSBwbGF5IGluc3RhbmNlIElELlxuICAgICAqIEByZXR1cm4ge0hvd2wvQXJyYXl9ICAgUmV0dXJucyBzZWxmIG9yIHRoZSBjdXJyZW50IDNEIHBvc2l0aW9uOiBbeCwgeSwgel1cbiAgICAgKi9cbiAgICBwb3MzZDogZnVuY3Rpb24oeCwgeSwgeiwgaWQpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgLy8gc2V0IGEgZGVmYXVsdCBmb3IgdGhlIG9wdGlvbmFsICd5JyAmICd6J1xuICAgICAgeSA9ICh0eXBlb2YgeSA9PT0gJ3VuZGVmaW5lZCcgfHwgIXkpID8gMCA6IHk7XG4gICAgICB6ID0gKHR5cGVvZiB6ID09PSAndW5kZWZpbmVkJyB8fCAheikgPyAtMC41IDogejtcblxuICAgICAgLy8gaWYgdGhlIHNvdW5kIGhhc24ndCBiZWVuIGxvYWRlZCwgYWRkIGl0IHRvIHRoZSBldmVudCBxdWV1ZVxuICAgICAgaWYgKCFzZWxmLl9sb2FkZWQpIHtcbiAgICAgICAgc2VsZi5vbigncGxheScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHNlbGYucG9zM2QoeCwgeSwgeiwgaWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICAgIH1cblxuICAgICAgaWYgKHggPj0gMCB8fCB4IDwgMCkge1xuICAgICAgICBpZiAoc2VsZi5fd2ViQXVkaW8pIHtcbiAgICAgICAgICB2YXIgYWN0aXZlTm9kZSA9IChpZCkgPyBzZWxmLl9ub2RlQnlJZChpZCkgOiBzZWxmLl9hY3RpdmVOb2RlKCk7XG4gICAgICAgICAgaWYgKGFjdGl2ZU5vZGUpIHtcbiAgICAgICAgICAgIHNlbGYuX3BvczNkID0gW3gsIHksIHpdO1xuICAgICAgICAgICAgYWN0aXZlTm9kZS5wYW5uZXIuc2V0UG9zaXRpb24oeCwgeSwgeik7XG4gICAgICAgICAgICBhY3RpdmVOb2RlLnBhbm5lci5wYW5uaW5nTW9kZWwgPSBzZWxmLl9tb2RlbCB8fCAnSFJURic7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc2VsZi5fcG9zM2Q7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBGYWRlIGEgY3VycmVudGx5IHBsYXlpbmcgc291bmQgYmV0d2VlbiB0d28gdm9sdW1lcy5cbiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgZnJvbSAgICAgVGhlIHZvbHVtZSB0byBmYWRlIGZyb20gKDAuMCB0byAxLjApLlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gICB0byAgICAgICBUaGUgdm9sdW1lIHRvIGZhZGUgdG8gKDAuMCB0byAxLjApLlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gICBsZW4gICAgICBUaW1lIGluIG1pbGxpc2Vjb25kcyB0byBmYWRlLlxuICAgICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFjayAob3B0aW9uYWwpIEZpcmVkIHdoZW4gdGhlIGZhZGUgaXMgY29tcGxldGUuXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSAgIGlkICAgICAgIChvcHRpb25hbCkgVGhlIHBsYXkgaW5zdGFuY2UgSUQuXG4gICAgICogQHJldHVybiB7SG93bH1cbiAgICAgKi9cbiAgICBmYWRlOiBmdW5jdGlvbihmcm9tLCB0bywgbGVuLCBjYWxsYmFjaywgaWQpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgZGlmZiA9IE1hdGguYWJzKGZyb20gLSB0byksXG4gICAgICAgIGRpciA9IGZyb20gPiB0byA/ICdkb3duJyA6ICd1cCcsXG4gICAgICAgIHN0ZXBzID0gZGlmZiAvIDAuMDEsXG4gICAgICAgIHN0ZXBUaW1lID0gbGVuIC8gc3RlcHM7XG5cbiAgICAgIC8vIGlmIHRoZSBzb3VuZCBoYXNuJ3QgYmVlbiBsb2FkZWQsIGFkZCBpdCB0byB0aGUgZXZlbnQgcXVldWVcbiAgICAgIGlmICghc2VsZi5fbG9hZGVkKSB7XG4gICAgICAgIHNlbGYub24oJ2xvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBzZWxmLmZhZGUoZnJvbSwgdG8sIGxlbiwgY2FsbGJhY2ssIGlkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICB9XG5cbiAgICAgIC8vIHNldCB0aGUgdm9sdW1lIHRvIHRoZSBzdGFydCBwb3NpdGlvblxuICAgICAgc2VsZi52b2x1bWUoZnJvbSwgaWQpO1xuXG4gICAgICBmb3IgKHZhciBpPTE7IGk8PXN0ZXBzOyBpKyspIHtcbiAgICAgICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBjaGFuZ2UgPSBzZWxmLl92b2x1bWUgKyAoZGlyID09PSAndXAnID8gMC4wMSA6IC0wLjAxKSAqIGksXG4gICAgICAgICAgICB2b2wgPSBNYXRoLnJvdW5kKDEwMDAgKiBjaGFuZ2UpIC8gMTAwMCxcbiAgICAgICAgICAgIHRvVm9sID0gdG87XG5cbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi52b2x1bWUodm9sLCBpZCk7XG5cbiAgICAgICAgICAgIGlmICh2b2wgPT09IHRvVm9sKSB7XG4gICAgICAgICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCBzdGVwVGltZSAqIGkpO1xuICAgICAgICB9KSgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBbREVQUkVDQVRFRF0gRmFkZSBpbiB0aGUgY3VycmVudCBzb3VuZC5cbiAgICAgKiBAcGFyYW0gIHtGbG9hdH0gICAgdG8gICAgICBWb2x1bWUgdG8gZmFkZSB0byAoMC4wIHRvIDEuMCkuXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSAgIGxlbiAgICAgVGltZSBpbiBtaWxsaXNlY29uZHMgdG8gZmFkZS5cbiAgICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKiBAcmV0dXJuIHtIb3dsfVxuICAgICAqL1xuICAgIGZhZGVJbjogZnVuY3Rpb24odG8sIGxlbiwgY2FsbGJhY2spIHtcbiAgICAgIHJldHVybiB0aGlzLnZvbHVtZSgwKS5wbGF5KCkuZmFkZSgwLCB0bywgbGVuLCBjYWxsYmFjayk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFtERVBSRUNBVEVEXSBGYWRlIG91dCB0aGUgY3VycmVudCBzb3VuZCBhbmQgcGF1c2Ugd2hlbiBmaW5pc2hlZC5cbiAgICAgKiBAcGFyYW0gIHtGbG9hdH0gICAgdG8gICAgICAgVm9sdW1lIHRvIGZhZGUgdG8gKDAuMCB0byAxLjApLlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gICBsZW4gICAgICBUaW1lIGluIG1pbGxpc2Vjb25kcyB0byBmYWRlLlxuICAgICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqIEBwYXJhbSAge1N0cmluZ30gICBpZCAgICAgICAob3B0aW9uYWwpIFRoZSBwbGF5IGluc3RhbmNlIElELlxuICAgICAqIEByZXR1cm4ge0hvd2x9XG4gICAgICovXG4gICAgZmFkZU91dDogZnVuY3Rpb24odG8sIGxlbiwgY2FsbGJhY2ssIGlkKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIHJldHVybiBzZWxmLmZhZGUoc2VsZi5fdm9sdW1lLCB0bywgbGVuLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xuICAgICAgICBzZWxmLnBhdXNlKGlkKTtcblxuICAgICAgICAvLyBmaXJlIGVuZGVkIGV2ZW50XG4gICAgICAgIHNlbGYub24oJ2VuZCcpO1xuICAgICAgfSwgaWQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgYW4gYXVkaW8gbm9kZSBieSBJRC5cbiAgICAgKiBAcmV0dXJuIHtIb3dsfSBBdWRpbyBub2RlLlxuICAgICAqL1xuICAgIF9ub2RlQnlJZDogZnVuY3Rpb24oaWQpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgbm9kZSA9IHNlbGYuX2F1ZGlvTm9kZVswXTtcblxuICAgICAgLy8gZmluZCB0aGUgbm9kZSB3aXRoIHRoaXMgSURcbiAgICAgIGZvciAodmFyIGk9MDsgaTxzZWxmLl9hdWRpb05vZGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHNlbGYuX2F1ZGlvTm9kZVtpXS5pZCA9PT0gaWQpIHtcbiAgICAgICAgICBub2RlID0gc2VsZi5fYXVkaW9Ob2RlW2ldO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBub2RlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGZpcnN0IGFjdGl2ZSBhdWRpbyBub2RlLlxuICAgICAqIEByZXR1cm4ge0hvd2x9IEF1ZGlvIG5vZGUuXG4gICAgICovXG4gICAgX2FjdGl2ZU5vZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBub2RlID0gbnVsbDtcblxuICAgICAgLy8gZmluZCB0aGUgZmlyc3QgcGxheWluZyBub2RlXG4gICAgICBmb3IgKHZhciBpPTA7IGk8c2VsZi5fYXVkaW9Ob2RlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICghc2VsZi5fYXVkaW9Ob2RlW2ldLnBhdXNlZCkge1xuICAgICAgICAgIG5vZGUgPSBzZWxmLl9hdWRpb05vZGVbaV07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gcmVtb3ZlIGV4Y2VzcyBpbmFjdGl2ZSBub2Rlc1xuICAgICAgc2VsZi5fZHJhaW5Qb29sKCk7XG5cbiAgICAgIHJldHVybiBub2RlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGZpcnN0IGluYWN0aXZlIGF1ZGlvIG5vZGUuXG4gICAgICogSWYgdGhlcmUgaXMgbm9uZSwgY3JlYXRlIGEgbmV3IG9uZSBhbmQgYWRkIGl0IHRvIHRoZSBwb29sLlxuICAgICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFjayBGdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIGF1ZGlvIG5vZGUgaXMgcmVhZHkuXG4gICAgICovXG4gICAgX2luYWN0aXZlTm9kZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgbm9kZSA9IG51bGw7XG5cbiAgICAgIC8vIGZpbmQgZmlyc3QgaW5hY3RpdmUgbm9kZSB0byByZWN5Y2xlXG4gICAgICBmb3IgKHZhciBpPTA7IGk8c2VsZi5fYXVkaW9Ob2RlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChzZWxmLl9hdWRpb05vZGVbaV0ucGF1c2VkICYmIHNlbGYuX2F1ZGlvTm9kZVtpXS5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgLy8gc2VuZCB0aGUgbm9kZSBiYWNrIGZvciB1c2UgYnkgdGhlIG5ldyBwbGF5IGluc3RhbmNlXG4gICAgICAgICAgY2FsbGJhY2soc2VsZi5fYXVkaW9Ob2RlW2ldKTtcbiAgICAgICAgICBub2RlID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyByZW1vdmUgZXhjZXNzIGluYWN0aXZlIG5vZGVzXG4gICAgICBzZWxmLl9kcmFpblBvb2woKTtcblxuICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBjcmVhdGUgbmV3IG5vZGUgaWYgdGhlcmUgYXJlIG5vIGluYWN0aXZlc1xuICAgICAgdmFyIG5ld05vZGU7XG4gICAgICBpZiAoc2VsZi5fd2ViQXVkaW8pIHtcbiAgICAgICAgbmV3Tm9kZSA9IHNlbGYuX3NldHVwQXVkaW9Ob2RlKCk7XG4gICAgICAgIGNhbGxiYWNrKG5ld05vZGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5sb2FkKCk7XG4gICAgICAgIG5ld05vZGUgPSBzZWxmLl9hdWRpb05vZGVbc2VsZi5fYXVkaW9Ob2RlLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgIC8vIGxpc3RlbiBmb3IgdGhlIGNvcnJlY3QgbG9hZCBldmVudCBhbmQgZmlyZSB0aGUgY2FsbGJhY2tcbiAgICAgICAgdmFyIGxpc3RlbmVyRXZlbnQgPSBuYXZpZ2F0b3IuaXNDb2Nvb25KUyA/ICdjYW5wbGF5dGhyb3VnaCcgOiAnbG9hZGVkbWV0YWRhdGEnO1xuICAgICAgICB2YXIgbGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBuZXdOb2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIobGlzdGVuZXJFdmVudCwgbGlzdGVuZXIsIGZhbHNlKTtcbiAgICAgICAgICBjYWxsYmFjayhuZXdOb2RlKTtcbiAgICAgICAgfTtcbiAgICAgICAgbmV3Tm9kZS5hZGRFdmVudExpc3RlbmVyKGxpc3RlbmVyRXZlbnQsIGxpc3RlbmVyLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIElmIHRoZXJlIGFyZSBtb3JlIHRoYW4gNSBpbmFjdGl2ZSBhdWRpbyBub2RlcyBpbiB0aGUgcG9vbCwgY2xlYXIgb3V0IHRoZSByZXN0LlxuICAgICAqL1xuICAgIF9kcmFpblBvb2w6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBpbmFjdGl2ZSA9IDAsXG4gICAgICAgIGk7XG5cbiAgICAgIC8vIGNvdW50IHRoZSBudW1iZXIgb2YgaW5hY3RpdmUgbm9kZXNcbiAgICAgIGZvciAoaT0wOyBpPHNlbGYuX2F1ZGlvTm9kZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoc2VsZi5fYXVkaW9Ob2RlW2ldLnBhdXNlZCkge1xuICAgICAgICAgIGluYWN0aXZlKys7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gcmVtb3ZlIGV4Y2VzcyBpbmFjdGl2ZSBub2Rlc1xuICAgICAgZm9yIChpPXNlbGYuX2F1ZGlvTm9kZS5sZW5ndGgtMTsgaT49MDsgaS0tKSB7XG4gICAgICAgIGlmIChpbmFjdGl2ZSA8PSA1KSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VsZi5fYXVkaW9Ob2RlW2ldLnBhdXNlZCkge1xuICAgICAgICAgIC8vIGRpc2Nvbm5lY3QgdGhlIGF1ZGlvIHNvdXJjZSBpZiB1c2luZyBXZWIgQXVkaW9cbiAgICAgICAgICBpZiAoc2VsZi5fd2ViQXVkaW8pIHtcbiAgICAgICAgICAgIHNlbGYuX2F1ZGlvTm9kZVtpXS5kaXNjb25uZWN0KDApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGluYWN0aXZlLS07XG4gICAgICAgICAgc2VsZi5fYXVkaW9Ob2RlLnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDbGVhciAnb25lbmQnIHRpbWVvdXQgYmVmb3JlIGl0IGVuZHMuXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBzb3VuZElkICBUaGUgcGxheSBpbnN0YW5jZSBJRC5cbiAgICAgKi9cbiAgICBfY2xlYXJFbmRUaW1lcjogZnVuY3Rpb24oc291bmRJZCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBpbmRleCA9IC0xO1xuXG4gICAgICAvLyBsb29wIHRocm91Z2ggdGhlIHRpbWVycyB0byBmaW5kIHRoZSBvbmUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgc291bmRcbiAgICAgIGZvciAodmFyIGk9MDsgaTxzZWxmLl9vbmVuZFRpbWVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChzZWxmLl9vbmVuZFRpbWVyW2ldLmlkID09PSBzb3VuZElkKSB7XG4gICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciB0aW1lciA9IHNlbGYuX29uZW5kVGltZXJbaW5kZXhdO1xuICAgICAgaWYgKHRpbWVyKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lci50aW1lcik7XG4gICAgICAgIHNlbGYuX29uZW5kVGltZXIuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0dXAgdGhlIGdhaW4gbm9kZSBhbmQgcGFubmVyIGZvciBhIFdlYiBBdWRpbyBpbnN0YW5jZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBuZXcgYXVkaW8gbm9kZS5cbiAgICAgKi9cbiAgICBfc2V0dXBBdWRpb05vZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBub2RlID0gc2VsZi5fYXVkaW9Ob2RlLFxuICAgICAgICBpbmRleCA9IHNlbGYuX2F1ZGlvTm9kZS5sZW5ndGg7XG5cbiAgICAgIC8vIGNyZWF0ZSBnYWluIG5vZGVcbiAgICAgIG5vZGVbaW5kZXhdID0gKHR5cGVvZiBjdHguY3JlYXRlR2FpbiA9PT0gJ3VuZGVmaW5lZCcpID8gY3R4LmNyZWF0ZUdhaW5Ob2RlKCkgOiBjdHguY3JlYXRlR2FpbigpO1xuICAgICAgbm9kZVtpbmRleF0uZ2Fpbi52YWx1ZSA9IHNlbGYuX3ZvbHVtZTtcbiAgICAgIG5vZGVbaW5kZXhdLnBhdXNlZCA9IHRydWU7XG4gICAgICBub2RlW2luZGV4XS5fcG9zID0gMDtcbiAgICAgIG5vZGVbaW5kZXhdLnJlYWR5U3RhdGUgPSA0O1xuICAgICAgbm9kZVtpbmRleF0uY29ubmVjdChtYXN0ZXJHYWluKTtcblxuICAgICAgLy8gY3JlYXRlIHRoZSBwYW5uZXJcbiAgICAgIG5vZGVbaW5kZXhdLnBhbm5lciA9IGN0eC5jcmVhdGVQYW5uZXIoKTtcbiAgICAgIG5vZGVbaW5kZXhdLnBhbm5lci5wYW5uaW5nTW9kZWwgPSBzZWxmLl9tb2RlbCB8fCAnZXF1YWxwb3dlcic7XG4gICAgICBub2RlW2luZGV4XS5wYW5uZXIuc2V0UG9zaXRpb24oc2VsZi5fcG9zM2RbMF0sIHNlbGYuX3BvczNkWzFdLCBzZWxmLl9wb3MzZFsyXSk7XG4gICAgICBub2RlW2luZGV4XS5wYW5uZXIuY29ubmVjdChub2RlW2luZGV4XSk7XG5cbiAgICAgIHJldHVybiBub2RlW2luZGV4XTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2FsbC9zZXQgY3VzdG9tIGV2ZW50cy5cbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgZXZlbnQgRXZlbnQgdHlwZS5cbiAgICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm4gICAgRnVuY3Rpb24gdG8gY2FsbC5cbiAgICAgKiBAcmV0dXJuIHtIb3dsfVxuICAgICAqL1xuICAgIG9uOiBmdW5jdGlvbihldmVudCwgZm4pIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgZXZlbnRzID0gc2VsZlsnX29uJyArIGV2ZW50XTtcblxuICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBldmVudHMucHVzaChmbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8ZXZlbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGZuKSB7XG4gICAgICAgICAgICBldmVudHNbaV0uY2FsbChzZWxmLCBmbik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV2ZW50c1tpXS5jYWxsKHNlbGYpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2VsZjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGEgY3VzdG9tIGV2ZW50LlxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gICBldmVudCBFdmVudCB0eXBlLlxuICAgICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmbiAgICBMaXN0ZW5lciB0byByZW1vdmUuXG4gICAgICogQHJldHVybiB7SG93bH1cbiAgICAgKi9cbiAgICBvZmY6IGZ1bmN0aW9uKGV2ZW50LCBmbikge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBldmVudHMgPSBzZWxmWydfb24nICsgZXZlbnRdO1xuXG4gICAgICBpZiAoZm4pIHtcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGZ1bmN0aW9ucyBpbiB0aGUgZXZlbnQgZm9yIGNvbXBhcmlzb25cbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPGV2ZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChmbiA9PT0gZXZlbnRzW2ldKSB7XG4gICAgICAgICAgICBldmVudHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmWydfb24nICsgZXZlbnRdID0gW107XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVbmxvYWQgYW5kIGRlc3Ryb3kgdGhlIGN1cnJlbnQgSG93bCBvYmplY3QuXG4gICAgICogVGhpcyB3aWxsIGltbWVkaWF0ZWx5IHN0b3AgYWxsIHBsYXkgaW5zdGFuY2VzIGF0dGFjaGVkIHRvIHRoaXMgc291bmQuXG4gICAgICovXG4gICAgdW5sb2FkOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgLy8gc3RvcCBwbGF5aW5nIGFueSBhY3RpdmUgbm9kZXNcbiAgICAgIHZhciBub2RlcyA9IHNlbGYuX2F1ZGlvTm9kZTtcbiAgICAgIGZvciAodmFyIGk9MDsgaTxzZWxmLl9hdWRpb05vZGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gc3RvcCB0aGUgc291bmQgaWYgaXQgaXMgY3VycmVudGx5IHBsYXlpbmdcbiAgICAgICAgaWYgKCFub2Rlc1tpXS5wYXVzZWQpIHtcbiAgICAgICAgICBzZWxmLnN0b3Aobm9kZXNbaV0uaWQpO1xuICAgICAgICAgIHNlbGYub24oJ2VuZCcsIG5vZGVzW2ldLmlkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2VsZi5fd2ViQXVkaW8pIHtcbiAgICAgICAgICAvLyByZW1vdmUgdGhlIHNvdXJjZSBpZiB1c2luZyBIVE1MNSBBdWRpb1xuICAgICAgICAgIG5vZGVzW2ldLnNyYyA9ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGRpc2Nvbm5lY3QgdGhlIG91dHB1dCBmcm9tIHRoZSBtYXN0ZXIgZ2FpblxuICAgICAgICAgIG5vZGVzW2ldLmRpc2Nvbm5lY3QoMCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gbWFrZSBzdXJlIGFsbCB0aW1lb3V0cyBhcmUgY2xlYXJlZFxuICAgICAgZm9yIChpPTA7IGk8c2VsZi5fb25lbmRUaW1lci5sZW5ndGg7IGkrKykge1xuICAgICAgICBjbGVhclRpbWVvdXQoc2VsZi5fb25lbmRUaW1lcltpXS50aW1lcik7XG4gICAgICB9XG5cbiAgICAgIC8vIHJlbW92ZSB0aGUgcmVmZXJlbmNlIGluIHRoZSBnbG9iYWwgSG93bGVyIG9iamVjdFxuICAgICAgdmFyIGluZGV4ID0gSG93bGVyLl9ob3dscy5pbmRleE9mKHNlbGYpO1xuICAgICAgaWYgKGluZGV4ICE9PSBudWxsICYmIGluZGV4ID49IDApIHtcbiAgICAgICAgSG93bGVyLl9ob3dscy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuXG4gICAgICAvLyBkZWxldGUgdGhpcyBzb3VuZCBmcm9tIHRoZSBjYWNoZVxuICAgICAgZGVsZXRlIGNhY2hlW3NlbGYuX3NyY107XG4gICAgICBzZWxmID0gbnVsbDtcbiAgICB9XG5cbiAgfTtcblxuICAvLyBvbmx5IGRlZmluZSB0aGVzZSBmdW5jdGlvbnMgd2hlbiB1c2luZyBXZWJBdWRpb1xuICBpZiAodXNpbmdXZWJBdWRpbykge1xuXG4gICAgLyoqXG4gICAgICogQnVmZmVyIGEgc291bmQgZnJvbSBVUkwgKG9yIGZyb20gY2FjaGUpIGFuZCBkZWNvZGUgdG8gYXVkaW8gc291cmNlIChXZWIgQXVkaW8gQVBJKS5cbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IG9iaiBUaGUgSG93bCBvYmplY3QgZm9yIHRoZSBzb3VuZCB0byBsb2FkLlxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gdXJsIFRoZSBwYXRoIHRvIHRoZSBzb3VuZCBmaWxlLlxuICAgICAqL1xuICAgIHZhciBsb2FkQnVmZmVyID0gZnVuY3Rpb24ob2JqLCB1cmwpIHtcbiAgICAgIC8vIGNoZWNrIGlmIHRoZSBidWZmZXIgaGFzIGFscmVhZHkgYmVlbiBjYWNoZWRcbiAgICAgIGlmICh1cmwgaW4gY2FjaGUpIHtcbiAgICAgICAgLy8gc2V0IHRoZSBkdXJhdGlvbiBmcm9tIHRoZSBjYWNoZVxuICAgICAgICBvYmouX2R1cmF0aW9uID0gY2FjaGVbdXJsXS5kdXJhdGlvbjtcblxuICAgICAgICAvLyBsb2FkIHRoZSBzb3VuZCBpbnRvIHRoaXMgb2JqZWN0XG4gICAgICAgIGxvYWRTb3VuZChvYmopO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmICgvXmRhdGE6W147XSs7YmFzZTY0LC8udGVzdCh1cmwpKSB7XG4gICAgICAgIC8vIERlY29kZSBiYXNlNjQgZGF0YS1VUklzIGJlY2F1c2Ugc29tZSBicm93c2VycyBjYW5ub3QgbG9hZCBkYXRhLVVSSXMgd2l0aCBYTUxIdHRwUmVxdWVzdC5cbiAgICAgICAgdmFyIGRhdGEgPSBhdG9iKHVybC5zcGxpdCgnLCcpWzFdKTtcbiAgICAgICAgdmFyIGRhdGFWaWV3ID0gbmV3IFVpbnQ4QXJyYXkoZGF0YS5sZW5ndGgpO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8ZGF0YS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgIGRhdGFWaWV3W2ldID0gZGF0YS5jaGFyQ29kZUF0KGkpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBkZWNvZGVBdWRpb0RhdGEoZGF0YVZpZXcuYnVmZmVyLCBvYmosIHVybCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBsb2FkIHRoZSBidWZmZXIgZnJvbSB0aGUgVVJMXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZGVjb2RlQXVkaW9EYXRhKHhoci5yZXNwb25zZSwgb2JqLCB1cmwpO1xuICAgICAgICB9O1xuICAgICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIGFuIGVycm9yLCBzd2l0Y2ggdGhlIHNvdW5kIHRvIEhUTUwgQXVkaW9cbiAgICAgICAgICBpZiAob2JqLl93ZWJBdWRpbykge1xuICAgICAgICAgICAgb2JqLl9idWZmZXIgPSB0cnVlO1xuICAgICAgICAgICAgb2JqLl93ZWJBdWRpbyA9IGZhbHNlO1xuICAgICAgICAgICAgb2JqLl9hdWRpb05vZGUgPSBbXTtcbiAgICAgICAgICAgIGRlbGV0ZSBvYmouX2dhaW5Ob2RlO1xuICAgICAgICAgICAgZGVsZXRlIGNhY2hlW3VybF07XG4gICAgICAgICAgICBvYmoubG9hZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB4aHIuc2VuZCgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgeGhyLm9uZXJyb3IoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBEZWNvZGUgYXVkaW8gZGF0YSBmcm9tIGFuIGFycmF5IGJ1ZmZlci5cbiAgICAgKiBAcGFyYW0gIHtBcnJheUJ1ZmZlcn0gYXJyYXlidWZmZXIgVGhlIGF1ZGlvIGRhdGEuXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBvYmogVGhlIEhvd2wgb2JqZWN0IGZvciB0aGUgc291bmQgdG8gbG9hZC5cbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHVybCBUaGUgcGF0aCB0byB0aGUgc291bmQgZmlsZS5cbiAgICAgKi9cbiAgICB2YXIgZGVjb2RlQXVkaW9EYXRhID0gZnVuY3Rpb24oYXJyYXlidWZmZXIsIG9iaiwgdXJsKSB7XG4gICAgICAvLyBkZWNvZGUgdGhlIGJ1ZmZlciBpbnRvIGFuIGF1ZGlvIHNvdXJjZVxuICAgICAgY3R4LmRlY29kZUF1ZGlvRGF0YShcbiAgICAgICAgYXJyYXlidWZmZXIsXG4gICAgICAgIGZ1bmN0aW9uKGJ1ZmZlcikge1xuICAgICAgICAgIGlmIChidWZmZXIpIHtcbiAgICAgICAgICAgIGNhY2hlW3VybF0gPSBidWZmZXI7XG4gICAgICAgICAgICBsb2FkU291bmQob2JqLCBidWZmZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgb2JqLm9uKCdsb2FkZXJyb3InLCBlcnIpO1xuICAgICAgICB9XG4gICAgICApO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGaW5pc2hlcyBsb2FkaW5nIHRoZSBXZWIgQXVkaW8gQVBJIHNvdW5kIGFuZCBmaXJlcyB0aGUgbG9hZGVkIGV2ZW50XG4gICAgICogQHBhcmFtICB7T2JqZWN0fSAgb2JqICAgIFRoZSBIb3dsIG9iamVjdCBmb3IgdGhlIHNvdW5kIHRvIGxvYWQuXG4gICAgICogQHBhcmFtICB7T2JqZWNjdH0gYnVmZmVyIFRoZSBkZWNvZGVkIGJ1ZmZlciBzb3VuZCBzb3VyY2UuXG4gICAgICovXG4gICAgdmFyIGxvYWRTb3VuZCA9IGZ1bmN0aW9uKG9iaiwgYnVmZmVyKSB7XG4gICAgICAvLyBzZXQgdGhlIGR1cmF0aW9uXG4gICAgICBvYmouX2R1cmF0aW9uID0gKGJ1ZmZlcikgPyBidWZmZXIuZHVyYXRpb24gOiBvYmouX2R1cmF0aW9uO1xuXG4gICAgICAvLyBzZXR1cCBhIHNwcml0ZSBpZiBub25lIGlzIGRlZmluZWRcbiAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmouX3Nwcml0ZSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIG9iai5fc3ByaXRlID0ge19kZWZhdWx0OiBbMCwgb2JqLl9kdXJhdGlvbiAqIDEwMDBdfTtcbiAgICAgIH1cblxuICAgICAgLy8gZmlyZSB0aGUgbG9hZGVkIGV2ZW50XG4gICAgICBpZiAoIW9iai5fbG9hZGVkKSB7XG4gICAgICAgIG9iai5fbG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgb2JqLm9uKCdsb2FkJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmouX2F1dG9wbGF5KSB7XG4gICAgICAgIG9iai5wbGF5KCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIExvYWQgdGhlIHNvdW5kIGJhY2sgaW50byB0aGUgYnVmZmVyIHNvdXJjZS5cbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IG9iaiAgIFRoZSBzb3VuZCB0byBsb2FkLlxuICAgICAqIEBwYXJhbSAge0FycmF5fSAgbG9vcCAgTG9vcCBib29sZWFuLCBwb3MsIGFuZCBkdXJhdGlvbi5cbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGlkICAgIChvcHRpb25hbCkgVGhlIHBsYXkgaW5zdGFuY2UgSUQuXG4gICAgICovXG4gICAgdmFyIHJlZnJlc2hCdWZmZXIgPSBmdW5jdGlvbihvYmosIGxvb3AsIGlkKSB7XG4gICAgICAvLyBkZXRlcm1pbmUgd2hpY2ggbm9kZSB0byBjb25uZWN0IHRvXG4gICAgICB2YXIgbm9kZSA9IG9iai5fbm9kZUJ5SWQoaWQpO1xuXG4gICAgICAvLyBzZXR1cCB0aGUgYnVmZmVyIHNvdXJjZSBmb3IgcGxheWJhY2tcbiAgICAgIG5vZGUuYnVmZmVyU291cmNlID0gY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgICAgbm9kZS5idWZmZXJTb3VyY2UuYnVmZmVyID0gY2FjaGVbb2JqLl9zcmNdO1xuICAgICAgbm9kZS5idWZmZXJTb3VyY2UuY29ubmVjdChub2RlLnBhbm5lcik7XG4gICAgICBub2RlLmJ1ZmZlclNvdXJjZS5sb29wID0gbG9vcFswXTtcbiAgICAgIGlmIChsb29wWzBdKSB7XG4gICAgICAgIG5vZGUuYnVmZmVyU291cmNlLmxvb3BTdGFydCA9IGxvb3BbMV07XG4gICAgICAgIG5vZGUuYnVmZmVyU291cmNlLmxvb3BFbmQgPSBsb29wWzFdICsgbG9vcFsyXTtcbiAgICAgIH1cbiAgICAgIG5vZGUuYnVmZmVyU291cmNlLnBsYXliYWNrUmF0ZS52YWx1ZSA9IG9iai5fcmF0ZTtcbiAgICB9O1xuXG4gIH1cblxuICAvKipcbiAgICogQWRkIHN1cHBvcnQgZm9yIEFNRCAoQXN5bmNocm9ub3VzIE1vZHVsZSBEZWZpbml0aW9uKSBsaWJyYXJpZXMgc3VjaCBhcyByZXF1aXJlLmpzLlxuICAgKi9cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIEhvd2xlcjogSG93bGVyLFxuICAgICAgICBIb3dsOiBIb3dsXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBzdXBwb3J0IGZvciBDb21tb25KUyBsaWJyYXJpZXMgc3VjaCBhcyBicm93c2VyaWZ5LlxuICAgKi9cbiAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIGV4cG9ydHMuSG93bGVyID0gSG93bGVyO1xuICAgIGV4cG9ydHMuSG93bCA9IEhvd2w7XG4gIH1cblxuICAvLyBkZWZpbmUgZ2xvYmFsbHkgaW4gY2FzZSBBTUQgaXMgbm90IGF2YWlsYWJsZSBvciBhdmFpbGFibGUgYnV0IG5vdCB1c2VkXG5cbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgd2luZG93Lkhvd2xlciA9IEhvd2xlcjtcbiAgICB3aW5kb3cuSG93bCA9IEhvd2w7XG4gIH1cblxufSkoKTtcbiIsIi8vXG4vLyBBIHNpbXBsZSBkaWN0aW9uYXJ5IHByb3RvdHlwZSBmb3IgSmF2YVNjcmlwdCwgYXZvaWRpbmcgY29tbW9uIG9iamVjdCBwaXRmYWxsc1xuLy8gYW5kIG9mZmVyaW5nIHNvbWUgaGFuZHkgY29udmVuaWVuY2UgbWV0aG9kcy5cbi8vXG5cbi8qIGdsb2JhbCBtb2R1bGUsIHJlcXVpcmUsIHdpbmRvdyAqL1xuXG52YXIgcHJlZml4ID0gXCJzdHJpbmctZGljdF9cIjtcblxuZnVuY3Rpb24gbWFrZUtleSAoaykge1xuICAgIHJldHVybiBwcmVmaXggKyBrO1xufVxuXG5mdW5jdGlvbiByZXZva2VLZXkgKGspIHtcbiAgICByZXR1cm4gay5yZXBsYWNlKG5ldyBSZWdFeHAocHJlZml4KSwgXCJcIik7XG59XG5cbmZ1bmN0aW9uIERpY3QgKGNvbnRlbnQpIHtcbiAgICBcbiAgICB2YXIga2V5O1xuICAgIFxuICAgIHRoaXMuY2xlYXIoKTtcbiAgICBcbiAgICBpZiAoY29udGVudCkge1xuICAgICAgICBmb3IgKGtleSBpbiBjb250ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnNldChrZXksIGNvbnRlbnRba2V5XSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkRpY3QucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuaXRlbXMgPSB7fTtcbiAgICB0aGlzLmNvdW50ID0gMDtcbn07XG5cbkRpY3QucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb3VudDtcbn07XG5cbkRpY3QucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChrLCB2YWx1ZSkge1xuICAgIFxuICAgIHZhciBrZXkgPSBtYWtlS2V5KGspO1xuICAgIFxuICAgIGlmICghaykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEaWN0aW9uYXJ5IGtleXMgY2Fubm90IGJlIGZhbHN5LlwiKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMuaGFzKGtleSkpIHtcbiAgICAgICAgdGhpcy5yZW1vdmUoa2V5KTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5pdGVtc1trZXldID0gdmFsdWU7XG4gICAgdGhpcy5jb3VudCArPSAxO1xuICAgIFxuICAgIHJldHVybiB0aGlzO1xufTtcblxuRGljdC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGspIHtcbiAgICBcbiAgICB2YXIga2V5ID0gbWFrZUtleShrKTtcbiAgICBcbiAgICBpZiAoIXRoaXMuaXRlbXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gdGhpcy5pdGVtc1trZXldO1xufTtcblxuLy9cbi8vIFRoZSBzYW1lIGFzIC5nZXQoKSwgYnV0IHRocm93cyB3aGVuIHRoZSBrZXkgZG9lc24ndCBleGlzdC5cbi8vIFRoaXMgY2FuIGJlIHVzZWZ1bCBpZiB5b3Ugd2FudCB0byB1c2UgYSBkaWN0IGFzIHNvbWUgc29ydCBvZiByZWdpc3RyeS5cbi8vXG5EaWN0LnByb3RvdHlwZS5yZXF1aXJlID0gZnVuY3Rpb24gKGtleSkge1xuICAgIFxuICAgIGlmICghdGhpcy5oYXMoa2V5KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJSZXF1aXJlZCBrZXkgJ1wiICsga2V5ICsgXCInIGRvZXMgbm90IGV4aXN0LlwiKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHRoaXMuZ2V0KGtleSk7XG59O1xuXG5EaWN0LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoaykge1xuICAgIFxuICAgIHZhciBrZXkgPSBtYWtlS2V5KGspO1xuICAgIFxuICAgIGlmICh0aGlzLmhhcyhrKSkge1xuICAgICAgICBkZWxldGUgdGhpcy5pdGVtc1trZXldO1xuICAgICAgICB0aGlzLmNvdW50IC09IDE7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB0aGlzO1xufTtcblxuRGljdC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gKGspIHtcbiAgICBcbiAgICB2YXIga2V5ID0gbWFrZUtleShrKTtcbiAgICBcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5oYXNPd25Qcm9wZXJ0eShrZXkpO1xufTtcblxuRGljdC5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChmbikge1xuICAgIFxuICAgIGlmICghZm4gfHwgdHlwZW9mIGZuICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQXJndW1lbnQgMSBpcyBleHBlY3RlZCB0byBiZSBvZiB0eXBlIGZ1bmN0aW9uLlwiKTtcbiAgICB9XG4gICAgXG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMuaXRlbXMpIHtcbiAgICAgICAgZm4odGhpcy5pdGVtc1trZXldLCByZXZva2VLZXkoa2V5KSwgdGhpcyk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB0aGlzO1xufTtcblxuRGljdC5wcm90b3R5cGUuZmlsdGVyID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgXG4gICAgdmFyIG1hdGNoZXMgPSBuZXcgRGljdCgpO1xuICAgIFxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwga2V5LCBhbGwpIHtcbiAgICAgICAgaWYgKGZuKGl0ZW0sIGtleSwgYWxsKSkge1xuICAgICAgICAgICAgbWF0Y2hlcy5zZXQoa2V5LCBpdGVtKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiBtYXRjaGVzO1xufTtcblxuRGljdC5wcm90b3R5cGUuZmluZCA9IGZ1bmN0aW9uIChmbikge1xuICAgIFxuICAgIHZhciB2YWx1ZTtcbiAgICBcbiAgICB0aGlzLnNvbWUoZnVuY3Rpb24gKGl0ZW0sIGtleSwgYWxsKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAoZm4oaXRlbSwga2V5LCBhbGwpKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGl0ZW07XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiB2YWx1ZTtcbn07XG5cbkRpY3QucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uIChmbikge1xuICAgIFxuICAgIHZhciBtYXBwZWQgPSBuZXcgRGljdCgpO1xuICAgIFxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwga2V5LCBhbGwpIHtcbiAgICAgICAgbWFwcGVkLnNldChrZXksIGZuKGl0ZW0sIGtleSwgYWxsKSk7XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIG1hcHBlZDtcbn07XG5cbkRpY3QucHJvdG90eXBlLnJlZHVjZSA9IGZ1bmN0aW9uIChmbiwgaW5pdGlhbFZhbHVlKSB7XG4gICAgXG4gICAgdmFyIHJlc3VsdCA9IGluaXRpYWxWYWx1ZTtcbiAgICBcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGtleSwgYWxsKSB7XG4gICAgICAgIHJlc3VsdCA9IGZuKHJlc3VsdCwgaXRlbSwga2V5LCBhbGwpO1xuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG5EaWN0LnByb3RvdHlwZS5ldmVyeSA9IGZ1bmN0aW9uIChmbikge1xuICAgIHJldHVybiB0aGlzLnJlZHVjZShmdW5jdGlvbiAobGFzdCwgaXRlbSwga2V5LCBhbGwpIHtcbiAgICAgICAgcmV0dXJuIGxhc3QgJiYgZm4oaXRlbSwga2V5LCBhbGwpO1xuICAgIH0sIHRydWUpO1xufTtcblxuRGljdC5wcm90b3R5cGUuc29tZSA9IGZ1bmN0aW9uIChmbikge1xuICAgIFxuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLml0ZW1zKSB7XG4gICAgICAgIGlmIChmbih0aGlzLml0ZW1zW2tleV0sIHJldm9rZUtleShrZXkpLCB0aGlzKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIGZhbHNlO1xufTtcblxuLy9cbi8vIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyB0aGUgZGljdGlvbmFyeSdzIGtleXMuXG4vL1xuRGljdC5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIFxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG4gICAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiBrZXlzO1xufTtcblxuLy9cbi8vIFJldHVybnMgdGhlIGRpY3Rpb25hcnkncyB2YWx1ZXMgaW4gYW4gYXJyYXkuXG4vL1xuRGljdC5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIHZhbHVlcyA9IFtdO1xuICAgIFxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICB2YWx1ZXMucHVzaChpdGVtKTtcbiAgICB9KTtcbiAgICBcbiAgICByZXR1cm4gdmFsdWVzO1xufTtcblxuLy9cbi8vIENyZWF0ZXMgYSBub3JtYWwgSlMgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGNvbnRlbnRzIG9mIHRoZSBkaWN0aW9uYXJ5LlxuLy9cbkRpY3QucHJvdG90eXBlLnRvT2JqZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciBqc09iamVjdCA9IHt9O1xuICAgIFxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG4gICAgICAgIGpzT2JqZWN0W2tleV0gPSBpdGVtO1xuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiBqc09iamVjdDtcbn07XG5cbi8vXG4vLyBDcmVhdGVzIGFub3RoZXIgZGljdGlvbmFyeSB3aXRoIHRoZSBzYW1lIGNvbnRlbnRzIGFzIHRoaXMgb25lLlxuLy9cbkRpY3QucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciBjbG9uZSA9IG5ldyBEaWN0KCk7XG4gICAgXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcbiAgICAgICAgY2xvbmUuc2V0KGtleSwgaXRlbSk7XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIGNsb25lO1xufTtcblxuLy9cbi8vIEFkZHMgdGhlIGNvbnRlbnQgb2YgYW5vdGhlciBkaWN0aW9uYXJ5IHRvIHRoaXMgZGljdGlvbmFyeSdzIGNvbnRlbnQuXG4vL1xuRGljdC5wcm90b3R5cGUuYWRkTWFwID0gZnVuY3Rpb24gKG90aGVyTWFwKSB7XG4gICAgXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIFxuICAgIG90aGVyTWFwLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuICAgICAgICBzZWxmLnNldChrZXksIGl0ZW0pO1xuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiB0aGlzO1xufTtcblxuLy9cbi8vIFJldHVybnMgYSBuZXcgbWFwIHdoaWNoIGlzIHRoZSByZXN1bHQgb2Ygam9pbmluZyB0aGlzIG1hcFxuLy8gd2l0aCBhbm90aGVyIG1hcC4gVGhpcyBtYXAgaXNuJ3QgY2hhbmdlZCBpbiB0aGUgcHJvY2Vzcy5cbi8vIFRoZSBrZXlzIGZyb20gb3RoZXJNYXAgd2lsbCByZXBsYWNlIGFueSBrZXlzIGZyb20gdGhpcyBtYXAgdGhhdFxuLy8gYXJlIHRoZSBzYW1lLlxuLy9cbkRpY3QucHJvdG90eXBlLmpvaW4gPSBmdW5jdGlvbiAob3RoZXJNYXApIHtcbiAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmFkZE1hcChvdGhlck1hcCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpY3Q7XG4iLCIvKiBnbG9iYWwgcmVxdWVzdEFuaW1hdGlvbkZyYW1lICovXG5cbnZhciBlYXNlcyA9IHJlcXVpcmUoXCJlYXNlc1wiKTtcblxuaWYgKHR5cGVvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDEwMDAgLyA2MCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiB0cmFuc2Zvcm1hdGlvbiAoZnJvbSwgdG8sIGNhbGxiYWNrLCBhcmdzLCBhZnRlcikge1xuICAgIFxuICAgIHZhciBkdXIsIGVhc2luZywgY3YsIGRpZmYsIGMsIGxhc3RFeGVjdXRpb24sIGZwcztcbiAgICB2YXIgY2FuY2VsZWQsIHBhdXNlZCwgcnVubmluZywgc3RvcHBlZDtcbiAgICB2YXIgdGltZUVsYXBzZWQsIHN0YXJ0VGltZSwgcGF1c2VUaW1lRWxhcHNlZCwgcGF1c2VTdGFydFRpbWU7XG4gICAgXG4gICAgYXJncyA9IGFyZ3MgfHwge307XG4gICAgXG4gICAgaWYgKHR5cGVvZiBhcmdzID09PSBcImZ1bmN0aW9uXCIgJiYgIWFmdGVyKSB7XG4gICAgICAgIGFmdGVyID0gYXJncztcbiAgICAgICAgYXJncyA9IHt9O1xuICAgIH1cbiAgICBcbiAgICBhZnRlciA9IHR5cGVvZiBhZnRlciA9PT0gXCJmdW5jdGlvblwiID8gYWZ0ZXIgOiBmdW5jdGlvbiAoKSB7fTtcbiAgICBcbiAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcInVuZGVmaW5lZFwiIHx8ICFjYWxsYmFjaykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBcmd1bWVudCBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb24uXCIpO1xuICAgIH1cbiAgICBcbiAgICBpbml0KCk7XG4gICAgXG4gICAgZnVuY3Rpb24gaW5pdCAoKSB7XG4gICAgICAgIFxuICAgICAgICBkdXIgPSB0eXBlb2YgYXJncy5kdXJhdGlvbiAhPT0gXCJ1bmRlZmluZWRcIiAmJiBhcmdzLmR1cmF0aW9uID49IDAgPyBhcmdzLmR1cmF0aW9uIDogNTAwO1xuICAgICAgICBjdiA9IGZyb207XG4gICAgICAgIGRpZmYgPSB0byAtIGZyb207XG4gICAgICAgIGMgPSAwLCAvLyBudW1iZXIgb2YgdGltZXMgbG9vcCBnZXQncyBleGVjdXRlZFxuICAgICAgICBsYXN0RXhlY3V0aW9uID0gMDtcbiAgICAgICAgZnBzID0gYXJncy5mcHMgfHwgNjA7XG4gICAgICAgIGNhbmNlbGVkID0gZmFsc2U7XG4gICAgICAgIHBhdXNlZCA9IGZhbHNlO1xuICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHN0b3BwZWQgPSBmYWxzZTtcbiAgICAgICAgdGltZUVsYXBzZWQgPSAwO1xuICAgICAgICBzdGFydFRpbWUgPSAwO1xuICAgICAgICBwYXVzZVRpbWVFbGFwc2VkID0gMDtcbiAgICAgICAgcGF1c2VTdGFydFRpbWUgPSAwO1xuICAgICAgICBlYXNpbmcgPSBlYXNlcy5saW5lYXI7XG4gICAgICAgIFxuICAgICAgICBpZiAoYXJncy5lYXNpbmcpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXJncy5lYXNpbmcgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIGVhc2luZyA9IGFyZ3MuZWFzaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZWFzaW5nID0gZWFzZXNbYXJncy5lYXNpbmddO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGxvb3AgKCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIGR0LCB0RWxhcHNlZDtcbiAgICAgICAgXG4gICAgICAgIGlmICghcnVubmluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoKERhdGUubm93KCkgLSBsYXN0RXhlY3V0aW9uKSA+ICgxMDAwIC8gZnBzKSkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoY2FuY2VsZWQgfHwgcGF1c2VkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjICs9IDE7XG4gICAgICAgICAgICB0RWxhcHNlZCA9IGVsYXBzZWQoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHRFbGFwc2VkID4gZHVyIHx8IHN0b3BwZWQpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjdiA9IGZyb20gKyBkaWZmO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICghc3RvcHBlZCkge1xuICAgICAgICAgICAgICAgICAgICBzdG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY3YgPSBlYXNpbmcodEVsYXBzZWQgLyBkdXIpICogZGlmZiArIGZyb207XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNhbGxiYWNrKGN2KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZHQgPSBlbGFwc2VkKCkgLSB0RWxhcHNlZDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGFzdEV4ZWN1dGlvbiA9IERhdGUubm93KCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICB9O1xuICAgIFxuICAgIGZ1bmN0aW9uIGVsYXBzZWQgKCkge1xuICAgICAgICBcbiAgICAgICAgaWYgKHJ1bm5pbmcgJiYgIXBhdXNlZCkge1xuICAgICAgICAgICAgdGltZUVsYXBzZWQgPSAoKCsobmV3IERhdGUoKSkgLSBzdGFydFRpbWUpIC0gcGF1c2VUaW1lRWxhcHNlZCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0aW1lRWxhcHNlZDtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gc3RhcnQgKCkge1xuICAgICAgICBcbiAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgXG4gICAgICAgIHN0YXJ0VGltZSA9ICsobmV3IERhdGUoKSk7XG4gICAgICAgIHBhdXNlU3RhcnRUaW1lID0gc3RhcnRUaW1lO1xuICAgICAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gc3RvcCAoKSB7XG4gICAgICAgIFxuICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHBhdXNlZCA9IGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgY2FsbGJhY2sodG8pO1xuICAgICAgICBhZnRlcigpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiByZXN1bWUgKCkge1xuICAgICAgICBcbiAgICAgICAgaWYgKCFwYXVzZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcGF1c2VkID0gZmFsc2U7XG4gICAgICAgIHBhdXNlVGltZUVsYXBzZWQgKz0gKyhuZXcgRGF0ZSgpKSAtIHBhdXNlU3RhcnRUaW1lO1xuICAgICAgICBcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBwYXVzZSAoKSB7XG4gICAgICAgIHBhdXNlZCA9IHRydWU7XG4gICAgICAgIHBhdXNlU3RhcnRUaW1lID0gKyhuZXcgRGF0ZSgpKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gY2FuY2VsICgpIHtcbiAgICAgICAgXG4gICAgICAgIGlmICghcnVubmluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBlbGFwc2VkKCk7XG4gICAgICAgIFxuICAgICAgICBjYW5jZWxlZCA9IHRydWU7XG4gICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgcGF1c2VkID0gZmFsc2U7XG4gICAgICAgIFxuICAgICAgICBhZnRlcigpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiByZXNldCAoKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgY2FuY2VsKCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGluaXQoKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICBzdG9wOiBzdG9wLFxuICAgICAgICBwYXVzZTogcGF1c2UsXG4gICAgICAgIHJlc3VtZTogcmVzdW1lLFxuICAgICAgICBjYW5jZWw6IGNhbmNlbCxcbiAgICAgICAgZWxhcHNlZDogZWxhcHNlZCxcbiAgICAgICAgcmVzZXQ6IHJlc2V0XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gdHJhbnNmb3JtICgpIHtcbiAgICBcbiAgICB2YXIgdCA9IHRyYW5zZm9ybWF0aW9uLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgICBcbiAgICB0LnN0YXJ0KCk7XG4gICAgXG4gICAgcmV0dXJuIHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHRyYW5zZm9ybWF0aW9uOiB0cmFuc2Zvcm1hdGlvbixcbiAgICB0cmFuc2Zvcm06IHRyYW5zZm9ybVxufTtcbiIsIi8qIGdsb2JhbCBtb2R1bGUsIHJlcXVpcmUgKi9cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9zcmMveG11Z2x5LmpzXCIpO1xuIiwiLyogZ2xvYmFsIG1vZHVsZSAqL1xuXG4oZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIC8vXG4gICAgLy8gQ29tcGlsZXNcbiAgICAvLyAgICAgLiBzb21lX2VsZW1lbnQgYXR0cjEgdmFsMSwgYXR0cjIgdmFsMlxuICAgIC8vIHRvOlxuICAgIC8vICAgICA8c29tZV9lbGVtZW50IGF0dHIxPVwidmFsMVwiLCBhdHRyMj1cInZhbDJcIiAvPlxuICAgIC8vIGFuZFxuICAgIC8vICAgICAuIHNvbWVfZWxlbWVudCBhdHRyMSB2YWwxIDpcbiAgICAvLyAgICAgLi4uXG4gICAgLy8gICAgIC0tXG4gICAgLy8gdG9cbiAgICAvLyAgICAgPHNvbWVfZWxlbWVudCBhdHRyMT1cInZhbDFcIj5cbiAgICAvLyAgICAgLi4uXG4gICAgLy8gICAgIDwvc29tZV9lbGVtZW50PlxuICAgIC8vXG4gICAgZnVuY3Rpb24gY29tcGlsZSAodGV4dCwgZGVmYXVsdE1hY3Jvcykge1xuICAgICAgICBcbiAgICAvL1xuICAgIC8vIEEgc3RhY2sgb2YgZWxlbWVudCBuYW1lcywgc28gdGhhdCBrbm93IHdoaWNoIFwiLS1cIiBjbG9zZXMgd2hpY2ggZWxlbWVudC5cbiAgICAvL1xuICAgICAgICB2YXIgc3RhY2sgPSBbXTtcbiAgICAgICAgdmFyIGxpbmVzID0gdG9MaW5lcyh0ZXh0KTtcbiAgICAgICAgdmFyIG1hY3JvcyA9IHByb2Nlc3NNYWNyb3MobGluZXMpO1xuICAgICAgICBcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGVmYXVsdE1hY3JvcykpIHtcbiAgICAgICAgICAgIGRlZmF1bHRNYWNyb3MuZm9yRWFjaChmdW5jdGlvbiAobWFjcm8pIHtcbiAgICAgICAgICAgICAgICBtYWNyb3MucHVzaChtYWNybyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgbGluZXMgPSByZW1vdmVNYWNyb0RlZmluaXRpb25zKGxpbmVzKTtcbiAgICAgICAgXG4gICAgICAgIGxpbmVzID0gbGluZXMubWFwKGZ1bmN0aW9uIChsaW5lLCBpKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBuYW1lLCBhdHRyaWJ1dGVzLCBwYXJ0cywgdHJpbW1lZCwgaGVhZCwgd2hpdGVzcGFjZSwgc3RyaW5ncywgcmVzdWx0LCBoYXNDb250ZW50O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0cmltbWVkID0gbGluZS50cmltKCk7XG4gICAgICAgICAgICBzdHJpbmdzID0gW107XG4gICAgICAgICAgICB3aGl0ZXNwYWNlID0gbGluZS5yZXBsYWNlKC9eKFtcXHNdKikuKiQvLCBcIiQxXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodHJpbW1lZCA9PT0gXCItLVwiKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKCFzdGFjay5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDbG9zaW5nICctLScgd2l0aG91dCBtYXRjaGluZyBvcGVuaW5nIHRhZyBvbiBsaW5lIFwiICsgKGkgKyAxKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXR1cm4gd2hpdGVzcGFjZSArICc8LycgKyBzdGFjay5wb3AoKSArICc+JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHRyaW1tZWRbMF0gIT09IFwiLlwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRyaW1tZWQgPSB0cmltbWVkLnJlcGxhY2UoL1wiKFteXCJdKylcIi9nLCBmdW5jdGlvbiAobWF0Y2gsIHAxKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgc3RyaW5ncy5wdXNoKHAxKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJ7e1wiICsgc3RyaW5ncy5sZW5ndGggKyBcIn19XCI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHRyaW1tZWRbdHJpbW1lZC5sZW5ndGggLSAxXSA9PT0gXCI6XCIpIHtcbiAgICAgICAgICAgICAgICBoYXNDb250ZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0cmltbWVkID0gdHJpbW1lZC5yZXBsYWNlKC86JC8sIFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBwYXJ0cyA9IHRyaW1tZWQuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgaGVhZCA9IHBhcnRzWzBdLnNwbGl0KFwiIFwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaGVhZC5zaGlmdCgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBuYW1lID0gaGVhZFswXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGhhc0NvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKG5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBoZWFkLnNoaWZ0KCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHBhcnRzWzBdID0gaGVhZC5qb2luKFwiIFwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBwYXJ0cy5mb3JFYWNoKGZ1bmN0aW9uIChjdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIHNwbGl0LCBuYW1lLCB2YWx1ZSwgZW5sYXJnZWQ7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgc3BsaXQgPSBub3JtYWxpemVXaGl0ZXNwYWNlKGN1cnJlbnQpLnNwbGl0KFwiIFwiKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBuYW1lID0gc3BsaXRbMF0udHJpbSgpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICghbmFtZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGVubGFyZ2VkID0gYXBwbHlNYWNyb3MobmFtZSwgbWFjcm9zKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoZW5sYXJnZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBlbmxhcmdlZC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgbmFtZSA9IGVubGFyZ2VkLm5hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgc3BsaXQuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gc3BsaXQuam9pbihcIiBcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaChuYW1lICsgJz1cIicgKyB2YWx1ZSArICdcIicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJlc3VsdCA9IHdoaXRlc3BhY2UgKyAnPCcgKyBuYW1lICsgKGF0dHJpYnV0ZXMubGVuZ3RoID8gJyAnIDogJycpICtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzLmpvaW4oXCIgXCIpICsgKGhhc0NvbnRlbnQgPyAnPicgOiAnIC8+Jyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHN0cmluZ3MuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZShcInt7XCIgKyAoaSArIDEpICsgXCJ9fVwiLCB2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIFxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0b1RleHQobGluZXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvTGluZXMgKHRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRleHQuc3BsaXQoXCJcXG5cIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9UZXh0IChsaW5lcykge1xuICAgICAgICByZXR1cm4gbGluZXMuam9pbihcIlxcblwiKTtcbiAgICB9XG5cbiAgICAvL1xuICAgIC8vIENyZWF0ZXMgYSByZXBsYWNlbWVudCBydWxlIGZyb20gYW4gYXR0cmlidXRlIG1hY3JvIGxpbmUuXG4gICAgLy8gQXR0cmlidXRlIG1hY3JvcyBsb29rIGxpa2UgdGhpczpcbiAgICAvL1xuICAgIC8vIH4gQCBhc3NldCBfXG4gICAgLy9cbiAgICAvLyBUaGUgfiBhdCB0aGUgc3RhcnQgb2YgYSBsaW5lIHNpZ25hbGl6ZXMgdGhhdCB0aGlzIGlzIGFuIGF0dHJpYnV0ZSBtYWNyby5cbiAgICAvLyBUaGUgZmlyc3Qgbm9uLXdoaXRlc3BhY2UgcGFydCAoQCBpbiB0aGlzIGNhc2UpIGlzIHRoZSBjaGFyYWN0ZXIgb3IgdGV4dCBwYXJ0XG4gICAgLy8gd2hpY2ggd2lsbCBiZSB1c2VkIGFzIHRoZSBtYWNybyBpZGVudGlmaWVyLlxuICAgIC8vIFRoZSBzZWNvbmQgcGFydCAoYXNzZXQgaW4gdGhpcyBjYXNlKSBpcyB0aGUgYXR0cmlidXRlIG5hbWUuXG4gICAgLy8gVGhlIHRoaXJkIGFuZCBsYXN0IHBhcnQgKF8gaGVyZSkgaXMgdGhlIGF0dHJpYnV0ZSB2YWx1ZS5cbiAgICAvLyBUaGUgXCJfXCIgY2hhcmFjdGVyIHdpbGwgYmUgcmVwbGFjZWQgYnkgd2hhdGV2ZXIgZm9sbG93cyB0aGUgbWFjcm8gaWRlbnRpZmllci5cbiAgICAvLyBcbiAgICAvLyBUaGUgZXhhbXBsZSBhYm92ZSB3aWxsIHJlc3VsdCBpbiB0aGlzIHRyYW5zZm9ybWF0aW9uOlxuICAgIC8vXG4gICAgLy8gLiBtb3ZlIEBmcm9kbyA9PiA8bW92ZSBhc3NldD1cImZyb2RvXCIgLz5cbiAgICAvL1xuICAgIC8vIFNvbWUgbW9yZSBleGFtcGxlczpcbiAgICAvL1xuICAgIC8vIE1hY3JvOiB+IDogZHVyYXRpb24gX1xuICAgIC8vIFRyYW5zZm9ybWF0aW9uOiAuIHdhaXQgOjIwMCA9PiA8d2FpdCBkdXJhdGlvbj1cIjIwMFwiIC8+XG4gICAgLy9cbiAgICAvLyBNYWNybzogfiArIF8gdHJ1ZVxuICAgIC8vIE1hY3JvOiB+IC0gXyBmYWxzZVxuICAgIC8vIFRyYW5zZm9ybWF0aW9uOiAuIHN0YWdlIC1yZXNpemUsICtjZW50ZXIgPT4gPHN0YWdlIHJlc2l6ZT1cImZhbHNlXCIgY2VudGVyPVwidHJ1ZVwiIC8+XG4gICAgLy9cbiAgICBmdW5jdGlvbiBwcm9jZXNzQXR0cmlidXRlTWFjcm8gKGxpbmUpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBwYXJ0cyA9IG5vcm1hbGl6ZVdoaXRlc3BhY2UobGluZSkuc3BsaXQoXCIgXCIpO1xuICAgICAgICBcbiAgICAgICAgcGFydHMuc2hpZnQoKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpZGVudGlmaWVyOiBwYXJ0c1swXSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZTogcGFydHNbMV0sXG4gICAgICAgICAgICB2YWx1ZTogcGFydHNbMl1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzTWFjcm9zIChsaW5lcykge1xuICAgICAgICBcbiAgICAgICAgdmFyIG1hY3JvcyA9IFtdO1xuICAgICAgICBcbiAgICAgICAgbGluZXMuZm9yRWFjaChmdW5jdGlvbiAobGluZSkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAobGluZS50cmltKClbMF0gIT09IFwiflwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBtYWNyb3MucHVzaChwcm9jZXNzQXR0cmlidXRlTWFjcm8obGluZSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBtYWNyb3M7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXBwbHlNYWNyb3MgKHJhdywgbWFjcm9zKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgbmFtZSwgdmFsdWU7XG4gICAgICAgIFxuICAgICAgICBtYWNyb3Muc29tZShmdW5jdGlvbiAobWFjcm8pIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIG1hY3JvVmFsdWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChyYXdbMF0gIT09IG1hY3JvLmlkZW50aWZpZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG1hY3JvVmFsdWUgPSByYXcucmVwbGFjZShtYWNyby5pZGVudGlmaWVyLCBcIlwiKTtcbiAgICAgICAgICAgIG5hbWUgPSAobWFjcm8uYXR0cmlidXRlID09PSBcIl9cIiA/IG1hY3JvVmFsdWUgOiBtYWNyby5hdHRyaWJ1dGUpO1xuICAgICAgICAgICAgdmFsdWUgPSAobWFjcm8udmFsdWUgPT09IFwiX1wiID8gbWFjcm9WYWx1ZSA6IG1hY3JvLnZhbHVlKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gcmVtb3ZlTWFjcm9EZWZpbml0aW9ucyAobGluZXMpIHtcbiAgICAgICAgcmV0dXJuIGxpbmVzLmZpbHRlcihmdW5jdGlvbiAobGluZSkge1xuICAgICAgICAgICAgcmV0dXJuIGxpbmUudHJpbSgpWzBdICE9PSBcIn5cIjtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIC8vXG4gICAgLy8gUmVwbGFjZXMgYWxsIHdoaXRlc3BhY2Ugd2l0aCBhIHNpbmdsZSBzcGFjZSBjaGFyYWN0ZXIuXG4gICAgLy9cbiAgICBmdW5jdGlvbiBub3JtYWxpemVXaGl0ZXNwYWNlICh0ZXh0KSB7XG4gICAgICAgIHJldHVybiB0ZXh0LnRyaW0oKS5yZXBsYWNlKC9bXFxzXSsvZywgXCIgXCIpO1xuICAgIH1cbiAgICBcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgIGNvbXBpbGU6IGNvbXBpbGVcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHdpbmRvdy54bXVnbHkgPSB7XG4gICAgICAgICAgICBjb21waWxlOiBjb21waWxlXG4gICAgICAgIH07XG4gICAgfVxuICAgIFxufSgpKTtcbiIsIlxudmFyIGVhc2luZyA9IHJlcXVpcmUoXCJlYXNlc1wiKTtcbnZhciB0cmFuc2Zvcm0gPSByZXF1aXJlKFwidHJhbnNmb3JtLWpzXCIpLnRyYW5zZm9ybTtcblxudmFyIHRvb2xzID0gcmVxdWlyZShcIi4vdG9vbHMvdG9vbHNcIik7XG5cbnZhciB3YXJuID0gdG9vbHMud2FybjtcbnZhciBleHRyYWN0VW5pdCA9IHRvb2xzLmV4dHJhY3RVbml0O1xudmFyIGFwcGx5VW5pdHMgPSB0b29scy5hcHBseUFzc2V0VW5pdHM7XG52YXIgYW5jaG9yZWRWYWx1ZSA9IHRvb2xzLmNhbGN1bGF0ZVZhbHVlV2l0aEFuY2hvcjtcblxuLy9cbi8vIFRoZSBwcm90b3R5cGUgZm9yIGFsbCBkaXNwbGF5YWJsZSBhc3NldHMuXG4vL1xuLy8gU2V0IC5fYm94U2l6ZVNlbGVjdG9ycyB0byBhbiBhcnJheSBjb250YWluaW5nIENTUyBzZWxlY3RvcnMgaW4geW91clxuLy8gYXNzZXQgaWYgeW91IHdhbnQgdGhlIGluaXRpYWwgcG9zaXRpb24gb2YgdGhlIGFzc2V0IHRvIGJlIGNhbGN1bGF0ZWRcbi8vIGRlcGVuZGluZyBvbiBzb21lIG9mIGl0cyBlbGVtZW50J3MgY2hpbGRyZW4gaW5zdGVhZCBvZiB0aGUgZWxlbWVudCdzXG4vLyAub2Zmc2V0V2lkdGggYW5kIC5vZmZzZXRIZWlnaHQuIFRoaXMgY2FuIGJlIG5lY2Vzc2FyeSBmb3IgYXNzZXRzIHN1Y2hcbi8vIGFzIEltYWdlUGFja3MgYmVjYXVzZSB0aGUgYXNzZXQncyBlbGVtZW50IHdpbGwgbm90IGhhdmUgYSBzaXplIHVudGlsXG4vLyBhdCBsZWFzdCBzb21lIG9mIGl0cyBjaGlsZHJlbiBhcmUgc2hvd24uXG4vL1xuZnVuY3Rpb24gRGlzcGxheU9iamVjdCAoYXNzZXQsIGludGVycHJldGVyKSB7XG4gICAgXG4gICAgdGhpcy5zdGFnZSA9IGludGVycHJldGVyLnN0YWdlO1xuICAgIHRoaXMuYnVzID0gaW50ZXJwcmV0ZXIuYnVzO1xuICAgIHRoaXMubmFtZSA9IGFzc2V0LmdldEF0dHJpYnV0ZShcIm5hbWVcIik7XG4gICAgdGhpcy5jc3NpZCA9IGFzc2V0LmdldEF0dHJpYnV0ZShcImNzc2lkXCIpIHx8IFwid3NlX2ltYWdlcGFja19cIiArIHRoaXMubmFtZTtcbiAgICB0aGlzLmludGVycHJldGVyID0gaW50ZXJwcmV0ZXI7XG4gICAgdGhpcy54ID0gYXNzZXQuZ2V0QXR0cmlidXRlKFwieFwiKSB8fCAwO1xuICAgIHRoaXMueSA9IGFzc2V0LmdldEF0dHJpYnV0ZShcInlcIikgfHwgMDtcbiAgICB0aGlzLnogPSBhc3NldC5nZXRBdHRyaWJ1dGUoXCJ6XCIpIHx8IHRoaXMueiB8fCAwO1xuICAgIHRoaXMueEFuY2hvciA9IGFzc2V0LmdldEF0dHJpYnV0ZShcInhBbmNob3JcIik7XG4gICAgdGhpcy55QW5jaG9yID0gYXNzZXQuZ2V0QXR0cmlidXRlKFwieUFuY2hvclwiKTtcbiAgICB0aGlzLndpZHRoID0gYXNzZXQuZ2V0QXR0cmlidXRlKFwid2lkdGhcIikgfHwgdGhpcy53aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGFzc2V0LmdldEF0dHJpYnV0ZShcImhlaWdodFwiKSB8fCB0aGlzLmhlaWdodDtcbiAgICBcbiAgICB0aGlzLl9jcmVhdGVFbGVtZW50KCk7XG4gICAgXG4gICAgYXBwbHlVbml0cyh0aGlzLCBhc3NldCk7XG4gICAgXG59XG5cbkRpc3BsYXlPYmplY3QucHJvdG90eXBlLm9uTG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9jYWxjdWxhdGVCb3hTaXplKCk7XG4gICAgdGhpcy5fbW92ZVRvUG9zaXRpb24oKTtcbn07XG5cbkRpc3BsYXlPYmplY3QucHJvdG90eXBlLmZsYXNoID0gZnVuY3Rpb24gZmxhc2ggKGNvbW1hbmQsIGFyZ3MpIHtcbiAgICBcbiAgICB2YXIgc2VsZiwgZHVyYXRpb24sIGVsZW1lbnQsIGlzQW5pbWF0aW9uLCBtYXhPcGFjaXR5O1xuICAgIHZhciB2aXNpYmxlLCBwYXJzZSA9IHRvb2xzLmdldFBhcnNlZEF0dHJpYnV0ZTtcbiAgICBcbiAgICBhcmdzID0gYXJncyB8fCB7fTtcbiAgICBzZWxmID0gdGhpcztcbiAgICBkdXJhdGlvbiA9ICtwYXJzZShjb21tYW5kLCBcImR1cmF0aW9uXCIsIHRoaXMuaW50ZXJwcmV0ZXIsIDUwMCk7XG4gICAgbWF4T3BhY2l0eSA9ICtwYXJzZShjb21tYW5kLCBcIm9wYWNpdHlcIiwgdGhpcy5pbnRlcnByZXRlciwgMSk7XG4gICAgZWxlbWVudCA9IGFyZ3MuZWxlbWVudCB8fCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNzc2lkKTtcbiAgICBcbiAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgd2Fybih0aGlzLmJ1cywgXCJET00gRWxlbWVudCBmb3IgYXNzZXQgaXMgbWlzc2luZyFcIiwgY29tbWFuZCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaXNBbmltYXRpb24gPSBhcmdzLmFuaW1hdGlvbiA9PT0gdHJ1ZSA/IHRydWUgOiBmYWxzZTtcbiAgICB2aXNpYmxlID0gKCsoZWxlbWVudC5zdHlsZS5vcGFjaXR5LnJlcGxhY2UoL1teMC05XFwuXS8sIFwiXCIpKSkgPiAwID8gdHJ1ZSA6IGZhbHNlO1xuICAgIFxuICAgIGlmICghaXNBbmltYXRpb24pIHtcbiAgICAgICAgc2VsZi5pbnRlcnByZXRlci53YWl0Q291bnRlciArPSAxO1xuICAgIH1cbiAgICBcbiAgICB0cmFuc2Zvcm0oXG4gICAgICAgIHZpc2libGUgPyBtYXhPcGFjaXR5IDogMCxcbiAgICAgICAgdmlzaWJsZSA/IDAgOiBtYXhPcGFjaXR5LFxuICAgICAgICBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gdjtcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uIC8gMyxcbiAgICAgICAgICAgIGVhc2luZzogZWFzaW5nLmN1YmljSW5cbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgYXJnc09iajtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZnVuY3Rpb24gdHJhbmZvcm1GbiAodikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IHY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZ1bmN0aW9uIGZpbmlzaEZuICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNBbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBzZWxmLmludGVycHJldGVyLndhaXRDb3VudGVyIC09IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGFyZ3NPYmogPSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246IChkdXJhdGlvbiAvIDMpICogMixcbiAgICAgICAgICAgICAgICBlYXNpbmc6IGVhc2luZy5jdWJpY091dFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdHJhbnNmb3JtKFxuICAgICAgICAgICAgICAgIHZpc2libGUgPyAwIDogbWF4T3BhY2l0eSxcbiAgICAgICAgICAgICAgICB2aXNpYmxlID8gbWF4T3BhY2l0eSA6IDAsXG4gICAgICAgICAgICAgICAgdHJhbmZvcm1GbixcbiAgICAgICAgICAgICAgICBhcmdzT2JqLFxuICAgICAgICAgICAgICAgIGZpbmlzaEZuXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBkb05leHQ6IHRydWVcbiAgICB9O1xufTtcblxuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuZmxpY2tlciA9IGZ1bmN0aW9uIChjb21tYW5kLCBhcmdzKSB7XG4gICAgXG4gICAgdmFyIHNlbGYsIGR1cmF0aW9uLCB0aW1lcywgc3RlcCwgZWxlbWVudDtcbiAgICB2YXIgaXNBbmltYXRpb24sIGZuLCBpdGVyYXRpb24sIG1heE9wYWNpdHksIHZhbDEsIHZhbDIsIGR1cjEsIGR1cjI7XG4gICAgXG4gICAgYXJncyA9IGFyZ3MgfHwge307XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgZHVyYXRpb24gPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcImR1cmF0aW9uXCIpIHx8IDUwMDtcbiAgICB0aW1lcyA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwidGltZXNcIikgfHwgMTA7XG4gICAgbWF4T3BhY2l0eSA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwib3BhY2l0eVwiKSB8fCAxO1xuICAgIGVsZW1lbnQgPSBhcmdzLmVsZW1lbnQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jc3NpZCk7XG4gICAgc3RlcCA9IGR1cmF0aW9uIC8gdGltZXM7XG4gICAgaXRlcmF0aW9uID0gMDtcbiAgICBcbiAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgd2Fybih0aGlzLmJ1cywgXCJET00gRWxlbWVudCBmb3IgYXNzZXQgaXMgbWlzc2luZyFcIiwgY29tbWFuZCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaWYgKCEocGFyc2VJbnQoZWxlbWVudC5zdHlsZS5vcGFjaXR5LCAxMCkpKSB7XG4gICAgICAgIHZhbDEgPSAwO1xuICAgICAgICB2YWwyID0gbWF4T3BhY2l0eTtcbiAgICAgICAgZHVyMSA9IHN0ZXAgLyAzO1xuICAgICAgICBkdXIyID0gZHVyMSAqIDI7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YWwyID0gMDtcbiAgICAgICAgdmFsMSA9IG1heE9wYWNpdHk7XG4gICAgICAgIGR1cjIgPSBzdGVwIC8gMztcbiAgICAgICAgZHVyMSA9IGR1cjIgKiAyO1xuICAgIH1cbiAgICBcbiAgICBpc0FuaW1hdGlvbiA9IGFyZ3MuYW5pbWF0aW9uID09PSB0cnVlID8gdHJ1ZSA6IGZhbHNlO1xuICAgIFxuICAgIGlmICghaXNBbmltYXRpb24pIHtcbiAgICAgICAgc2VsZi5pbnRlcnByZXRlci53YWl0Q291bnRlciArPSAxO1xuICAgIH1cbiAgICBcbiAgICBmbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXG4gICAgICAgIGl0ZXJhdGlvbiArPSAxO1xuICAgICAgICBcbiAgICAgICAgdHJhbnNmb3JtKFxuICAgICAgICAgICAgdmFsMSxcbiAgICAgICAgICAgIHZhbDIsXG4gICAgICAgICAgICBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IHY7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXIxLFxuICAgICAgICAgICAgICAgIGVhc2luZzogZWFzaW5nLnF1YWRJblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm0oXG4gICAgICAgICAgICAgICAgICAgIHZhbDIsXG4gICAgICAgICAgICAgICAgICAgIHZhbDEsXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSB2O1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogZHVyMixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZzogZWFzaW5nLnF1YWRJblxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVyYXRpb24gPD0gdGltZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNBbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmludGVycHJldGVyLndhaXRDb3VudGVyIC09IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH07XG4gICAgXG4gICAgZm4oKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBkb05leHQ6IHRydWVcbiAgICB9O1xufTtcblxuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uIChjb21tYW5kLCBhcmdzKSB7XG4gICAgXG4gICAgdmFyIHNlbGYsIGR1cmF0aW9uLCBlZmZlY3QsIGRpcmVjdGlvbiwgb2Zmc2V0V2lkdGgsIG9mZnNldEhlaWdodDtcbiAgICB2YXIgb3gsIG95LCB0bywgcHJvcCwgaXNBbmltYXRpb24sIGVsZW1lbnQsIGVhc2luZ1R5cGUsIGVhc2luZ0ZuLCBzdGFnZTtcbiAgICB2YXIgeFVuaXQsIHlVbml0O1xuICAgIHZhciBwYXJzZSA9IHRvb2xzLmdldFBhcnNlZEF0dHJpYnV0ZTtcbiAgICBcbiAgICBhcmdzID0gYXJncyB8fCB7fTtcbiAgICBzZWxmID0gdGhpcztcbiAgICBkdXJhdGlvbiA9IHBhcnNlKGNvbW1hbmQsIFwiZHVyYXRpb25cIiwgdGhpcy5pbnRlcnByZXRlciwgNTAwKTtcbiAgICBlZmZlY3QgPSBwYXJzZShjb21tYW5kLCBcImVmZmVjdFwiLCB0aGlzLmludGVycHJldGVyLCBcImZhZGVcIik7XG4gICAgZGlyZWN0aW9uID0gcGFyc2UoY29tbWFuZCwgXCJkaXJlY3Rpb25cIiwgdGhpcy5pbnRlcnByZXRlciwgXCJsZWZ0XCIpO1xuICAgIGlzQW5pbWF0aW9uID0gYXJncy5hbmltYXRpb24gPT09IHRydWUgPyB0cnVlIDogZmFsc2U7XG4gICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY3NzaWQpO1xuICAgIGVhc2luZ1R5cGUgPSBwYXJzZShjb21tYW5kLCBcImVhc2luZ1wiLCB0aGlzLmludGVycHJldGVyLCBcInNpbmVFYXNlT3V0XCIpO1xuICAgIGVhc2luZ0ZuID0gKGVhc2luZ1tlYXNpbmdUeXBlXSkgPyBcbiAgICAgICAgZWFzaW5nW2Vhc2luZ1R5cGVdIDogXG4gICAgICAgIGVhc2luZy5zaW5lT3V0O1xuICAgIHN0YWdlID0gdGhpcy5zdGFnZTtcbiAgICB4VW5pdCA9IHRoaXMueFVuaXQgfHwgJ3B4JztcbiAgICB5VW5pdCA9IHRoaXMueVVuaXQgfHwgJ3B4JztcbiAgICBcbiAgICBpZiAoZWZmZWN0ID09PSBcInNsaWRlXCIpIHtcbiAgICAgICAgXG4gICAgICAgIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgICAgIFxuICAgICAgICBpZiAoeFVuaXQgPT09ICclJykge1xuICAgICAgICAgICAgb3ggPSBlbGVtZW50Lm9mZnNldExlZnQgLyAoc3RhZ2Uub2Zmc2V0V2lkdGggLyAxMDApO1xuICAgICAgICAgICAgb2Zmc2V0V2lkdGggPSAxMDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBveCA9IGVsZW1lbnQub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIG9mZnNldFdpZHRoID0gc3RhZ2Uub2Zmc2V0V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmICh5VW5pdCA9PT0gJyUnKSB7XG4gICAgICAgICAgICBveSA9IGVsZW1lbnQub2Zmc2V0VG9wIC8gKHN0YWdlLm9mZnNldEhlaWdodCAvIDEwMCk7XG4gICAgICAgICAgICBvZmZzZXRIZWlnaHQgPSAxMDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBveSA9IGVsZW1lbnQub2Zmc2V0VG9wO1xuICAgICAgICAgICAgb2Zmc2V0SGVpZ2h0ID0gc3RhZ2Uub2Zmc2V0SGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xuICAgICAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgICAgICAgICB0byA9IG94IC0gb2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICAgICAgcHJvcCA9IFwibGVmdFwiO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgICAgICAgICAgdG8gPSBveCArIG9mZnNldFdpZHRoO1xuICAgICAgICAgICAgICAgIHByb3AgPSBcImxlZnRcIjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJ0b3BcIjpcbiAgICAgICAgICAgICAgICB0byA9IG95IC0gb2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgICAgIHByb3AgPSBcInRvcFwiO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImJvdHRvbVwiOlxuICAgICAgICAgICAgICAgIHRvID0gb3kgKyBvZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgcHJvcCA9IFwidG9wXCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRvID0gb3ggLSBvZmZzZXRXaWR0aDtcbiAgICAgICAgICAgICAgICBwcm9wID0gXCJsZWZ0XCI7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmICghaXNBbmltYXRpb24pIHtcbiAgICAgICAgICAgIHNlbGYuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHZhbEZuLCBmcm9tLCBmaW5pc2hGbiwgb3B0aW9ucztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFsRm4gPSBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGVbcHJvcF0gPSB2ICsgKHByb3AgPT09ICdsZWZ0JyA/IHhVbml0IDogeVVuaXQpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZnJvbSA9IChwcm9wID09PSBcImxlZnRcIiA/IG94IDogb3kpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBmaW5pc2hGbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIWlzQW5pbWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9IG94ICsgeFVuaXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wID0gXCJsZWZ0XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInRvcFwiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYm90dG9tXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRvcCA9IG95ICsgeVVuaXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wID0gXCJ0b3BcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5sZWZ0ID0gb3ggKyB4VW5pdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3AgPSBcImxlZnRcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgICAgICBlYXNpbmc6IGVhc2luZ0ZuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0cmFuc2Zvcm0oZnJvbSwgdG8sIHZhbEZuLCBvcHRpb25zLCBmaW5pc2hGbik7XG4gICAgICAgIH0oKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBcbiAgICAgICAgaWYgKCFpc0FuaW1hdGlvbikge1xuICAgICAgICAgICAgc2VsZi5pbnRlcnByZXRlci53YWl0Q291bnRlciArPSAxO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgdmFsRm4sIG9wdGlvbnMsIGZpbmlzaEZuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YWxGbiA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gdjtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZpbmlzaEZuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICghaXNBbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnRlcnByZXRlci53YWl0Q291bnRlciAtPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgICAgICAgICAgZWFzaW5nOiBlYXNpbmdGblxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdHJhbnNmb3JtKDEsIDAsIHZhbEZuLCBvcHRpb25zLCBmaW5pc2hGbik7XG4gICAgICAgIH0oKSk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIGRvTmV4dDogdHJ1ZVxuICAgIH07XG59O1xuXG5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24gKGNvbW1hbmQsIGFyZ3MpIHtcbiAgICBcbiAgICB2YXIgeCwgeSwgeiwgZWxlbWVudCwgc2VsZiwgeFVuaXQsIHlVbml0LCBkdXJhdGlvbiwgZWFzaW5nVHlwZTtcbiAgICB2YXIgZWFzaW5nRm4sIGlzQW5pbWF0aW9uLCBveCwgb3ksIHN0YWdlO1xuICAgIHZhciB4QW5jaG9yLCB5QW5jaG9yLCBpbnRlcnByZXRlciA9IHRoaXMuaW50ZXJwcmV0ZXI7XG4gICAgdmFyIG9mZnNldExlZnQsIG9mZnNldFRvcCwgb2xkRWxlbWVudERpc3BsYXlTdHlsZTtcbiAgICBcbiAgICBhcmdzID0gYXJncyB8fCB7fTtcbiAgICBzZWxmID0gdGhpcztcbiAgICBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jc3NpZCk7XG4gICAgXG4gICAgeCA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwieFwiKTtcbiAgICB5ID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJ5XCIpO1xuICAgIHogPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcInpcIik7XG4gICAgXG4gICAgeEFuY2hvciA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwieEFuY2hvclwiKSB8fCBcIjBcIjtcbiAgICB5QW5jaG9yID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJ5QW5jaG9yXCIpIHx8IFwiMFwiO1xuICAgIFxuICAgIGlmICh4QW5jaG9yID09PSBudWxsICYmIHRoaXMueEFuY2hvciAhPT0gbnVsbCkge1xuICAgICAgICB4QW5jaG9yID0gdGhpcy54QW5jaG9yO1xuICAgIH1cbiAgICBcbiAgICBpZiAoeUFuY2hvciA9PT0gbnVsbCAgJiYgdGhpcy55QW5jaG9yICE9PSBudWxsKSB7XG4gICAgICAgIHlBbmNob3IgPSB0aGlzLnlBbmNob3I7XG4gICAgfVxuICAgIFxuICAgIHggPSB0b29scy5yZXBsYWNlVmFyaWFibGVzKHgsIHRoaXMuaW50ZXJwcmV0ZXIpO1xuICAgIHkgPSB0b29scy5yZXBsYWNlVmFyaWFibGVzKHksIHRoaXMuaW50ZXJwcmV0ZXIpO1xuICAgIHogPSB0b29scy5yZXBsYWNlVmFyaWFibGVzKHosIHRoaXMuaW50ZXJwcmV0ZXIpO1xuICAgIHhBbmNob3IgPSB0b29scy5yZXBsYWNlVmFyaWFibGVzKHhBbmNob3IsIHRoaXMuaW50ZXJwcmV0ZXIpO1xuICAgIHlBbmNob3IgPSB0b29scy5yZXBsYWNlVmFyaWFibGVzKHlBbmNob3IsIHRoaXMuaW50ZXJwcmV0ZXIpO1xuICAgIFxuICAgIGR1cmF0aW9uID0gdG9vbHMuZ2V0UGFyc2VkQXR0cmlidXRlKGNvbW1hbmQsIFwiZHVyYXRpb25cIiwgaW50ZXJwcmV0ZXIsIDUwMCk7XG4gICAgZWFzaW5nVHlwZSA9IHRvb2xzLmdldFBhcnNlZEF0dHJpYnV0ZShjb21tYW5kLCBcImVhc2luZ1wiLCBpbnRlcnByZXRlciwgXCJzaW5lRWFzZU91dFwiKTtcbiAgICBcbiAgICBlYXNpbmdGbiA9IChlYXNpbmdbZWFzaW5nVHlwZV0pID8gXG4gICAgICAgIGVhc2luZ1tlYXNpbmdUeXBlXSA6IFxuICAgICAgICBlYXNpbmcuc2luZU91dDtcbiAgICBcbiAgICBpc0FuaW1hdGlvbiA9IGFyZ3MuYW5pbWF0aW9uID09PSB0cnVlID8gdHJ1ZSA6IGZhbHNlO1xuICAgIHN0YWdlID0gdGhpcy5pbnRlcnByZXRlci5zdGFnZTtcbiAgICBcbiAgICBvZmZzZXRMZWZ0ID0gZWxlbWVudC5vZmZzZXRMZWZ0O1xuICAgIG9mZnNldFRvcCA9IGVsZW1lbnQub2Zmc2V0VG9wO1xuICAgIFxuICAgIGlmICh4ICE9PSBudWxsKSB7XG4gICAgICAgIHhVbml0ID0gdG9vbHMuZXh0cmFjdFVuaXQoeCkgfHwgXCJweFwiO1xuICAgICAgICB4ID0gcGFyc2VJbnQoeCwgMTApO1xuICAgIH1cbiAgICBcbiAgICBpZiAoeSAhPT0gbnVsbCkge1xuICAgICAgICB5VW5pdCA9IHRvb2xzLmV4dHJhY3RVbml0KHkpIHx8IFwicHhcIjtcbiAgICAgICAgeSA9IHBhcnNlSW50KHksIDEwKTtcbiAgICB9XG4gICAgXG4gICAgb2xkRWxlbWVudERpc3BsYXlTdHlsZSA9IGVsZW1lbnQuc3R5bGUuZGlzcGxheTtcbiAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuICAgIFxuICAgIGlmICh4VW5pdCA9PT0gXCIlXCIpIHtcbiAgICAgICAgeCA9IChzdGFnZS5vZmZzZXRXaWR0aCAvIDEwMCkgKiB4O1xuICAgICAgICB4VW5pdCA9IFwicHhcIjtcbiAgICB9XG4gICAgXG4gICAgaWYgKHlVbml0ID09PSBcIiVcIikge1xuICAgICAgICB5ID0gKHN0YWdlLm9mZnNldEhlaWdodCAvIDEwMCkgKiB5O1xuICAgICAgICB5VW5pdCA9IFwicHhcIjtcbiAgICB9XG4gICAgXG4gICAgeCA9IHRvb2xzLmNhbGN1bGF0ZVZhbHVlV2l0aEFuY2hvcih4LCB4QW5jaG9yLCBlbGVtZW50Lm9mZnNldFdpZHRoKTtcbiAgICB5ID0gdG9vbHMuY2FsY3VsYXRlVmFsdWVXaXRoQW5jaG9yKHksIHlBbmNob3IsIGVsZW1lbnQub2Zmc2V0SGVpZ2h0KTtcbiAgICBcbiAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBvbGRFbGVtZW50RGlzcGxheVN0eWxlO1xuICAgIFxuICAgIGlmICh4ID09PSBudWxsICYmIHkgPT09IG51bGwgJiYgeiA9PT0gbnVsbCkge1xuICAgICAgICB3YXJuKHRoaXMuYnVzLCBcIkNhbid0IGFwcGx5IGNvbW1hbmQgJ21vdmUnIHRvIGFzc2V0ICdcIiArIFxuICAgICAgICAgICAgdGhpcy5uYW1lICsgXCInIGJlY2F1c2Ugbm8geCwgeSBvciB6IHBvc2l0aW9uIFwiICtcbiAgICAgICAgICAgIFwiaGFzIGJlZW4gc3VwcGxpZWQuXCIsIGNvbW1hbmQpO1xuICAgIH1cbiAgICBcbiAgICBpZiAoeCAhPT0gbnVsbCkge1xuICAgICAgICBcbiAgICAgICAgaWYgKHhVbml0ID09PSAnJScpIHtcbiAgICAgICAgICAgIG94ID0gb2Zmc2V0TGVmdCAvIChzdGFnZS5vZmZzZXRXaWR0aCAvIDEwMCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBveCA9IG9mZnNldExlZnQ7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmICghaXNBbmltYXRpb24pIHtcbiAgICAgICAgICAgIHNlbGYuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdHJhbnNmb3JtKFxuICAgICAgICAgICAgb3gsXG4gICAgICAgICAgICB4LFxuICAgICAgICAgICAgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSB2ICsgeFVuaXQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgICAgICBlYXNpbmc6IGVhc2luZ0ZuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghaXNBbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnRlcnByZXRlci53YWl0Q291bnRlciAtPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHkgIT09IG51bGwpIHtcbiAgICAgICAgXG4gICAgICAgIGlmICh5VW5pdCA9PT0gJyUnKSB7XG4gICAgICAgICAgICBveSA9IG9mZnNldFRvcCAvIChzdGFnZS5vZmZzZXRIZWlnaHQgLyAxMDApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb3kgPSBvZmZzZXRUb3A7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmICghaXNBbmltYXRpb24pIHtcbiAgICAgICAgICAgIHNlbGYuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdHJhbnNmb3JtKFxuICAgICAgICAgICAgb3ksXG4gICAgICAgICAgICB5LFxuICAgICAgICAgICAgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRvcCA9IHYgKyB5VW5pdDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICAgICAgICAgIGVhc2luZzogZWFzaW5nRm5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc0FuaW1hdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmludGVycHJldGVyLndhaXRDb3VudGVyIC09IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbiAgICBcbiAgICBpZiAoeiAhPT0gbnVsbCkge1xuICAgICAgICBcbiAgICAgICAgaWYgKCFpc0FuaW1hdGlvbikge1xuICAgICAgICAgICAgc2VsZi5pbnRlcnByZXRlci53YWl0Q291bnRlciArPSAxO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0cmFuc2Zvcm0oXG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnpJbmRleCB8fCAwLFxuICAgICAgICAgICAgcGFyc2VJbnQoeiwgMTApLFxuICAgICAgICAgICAgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnpJbmRleCA9IHY7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgICAgICBlYXNpbmc6IGVhc2luZ0ZuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghaXNBbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnRlcnByZXRlci53YWl0Q291bnRlciAtPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5idXMudHJpZ2dlcihcIndzZS5hc3NldHMubWl4aW5zLm1vdmVcIiwgdGhpcyk7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZG9OZXh0OiB0cnVlXG4gICAgfTtcbn07XG5cbkRpc3BsYXlPYmplY3QucHJvdG90eXBlLnNoYWtlID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcbiAgICBcbiAgICB2YXIgZHgsIGR5LCBlbGVtZW50LCBzZWxmLCB4VW5pdCwgeVVuaXQsIGR1cmF0aW9uLCBwZXJpb2Q7XG4gICAgdmFyIG94LCBveSwgc3RhZ2U7XG4gICAgXG4gICAgc2VsZiA9IHRoaXM7XG4gICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY3NzaWQpO1xuICAgIGR4ID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJkeFwiKTtcbiAgICBkeSA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwiZHlcIik7XG4gICAgcGVyaW9kID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJwZXJpb2RcIikgfHwgNTA7XG4gICAgZHVyYXRpb24gPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcImR1cmF0aW9uXCIpIHx8IDI3NTtcbiAgICBzdGFnZSA9IHRoaXMuaW50ZXJwcmV0ZXIuc3RhZ2U7XG4gICAgXG4gICAgaWYgKGR4ID09PSBudWxsICYmIGR5ID09PSBudWxsKSB7XG4gICAgICAgIGR5ID0gXCItMTBweFwiO1xuICAgIH1cbiAgICBcbiAgICBpZiAoZHggIT09IG51bGwpIHtcbiAgICAgICAgeFVuaXQgPSB0b29scy5leHRyYWN0VW5pdChkeCk7XG4gICAgICAgIGR4ID0gcGFyc2VJbnQoZHgsIDEwKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKGR5ICE9PSBudWxsKSB7XG4gICAgICAgIHlVbml0ID0gdG9vbHMuZXh0cmFjdFVuaXQoZHkpO1xuICAgICAgICBkeSA9IHBhcnNlSW50KGR5LCAxMCk7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGVhc2luZyAoZCwgdCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIHggPSB0IC8gcGVyaW9kO1xuICAgICAgICBcbiAgICAgICAgd2hpbGUgKHggPiAyLjApIHtcbiAgICAgICAgICAgIHggLT0gMi4wO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAgKHggPiAxLjApIHtcbiAgICAgICAgICAgIHggPSAyLjAgLSB4O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4geDtcbiAgICB9XG4gICAgXG4gICAgaWYgKGR4ICE9PSBudWxsKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAoeFVuaXQgPT09ICclJykge1xuICAgICAgICAgICAgb3ggPSBlbGVtZW50Lm9mZnNldExlZnQgLyAoc3RhZ2Uub2Zmc2V0V2lkdGggLyAxMDApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb3ggPSBlbGVtZW50Lm9mZnNldExlZnQ7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHNlbGYuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgKz0gMTtcbiAgICAgICAgXG4gICAgICAgIHRyYW5zZm9ybShcbiAgICAgICAgICAgIG94IC0gZHgsXG4gICAgICAgICAgICBveCArIGR4LFxuICAgICAgICAgICAgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSB2ICsgeFVuaXQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgICAgICBlYXNpbmc6ICAgZWFzaW5nXG4gICAgICAgICAgICB9XG4gICAgICAgICkuXG4gICAgICAgIHRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5sZWZ0ID0gb3ggKyB4VW5pdDtcbiAgICAgICAgICAgIHNlbGYuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgLT0gMTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIGlmIChkeSAhPT0gbnVsbCkge1xuICAgICAgICBcbiAgICAgICAgaWYgKHlVbml0ID09PSAnJScpIHtcbiAgICAgICAgICAgIG95ID0gZWxlbWVudC5vZmZzZXRUb3AgLyAoc3RhZ2Uub2Zmc2V0SGVpZ2h0IC8gMTAwKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG95ID0gZWxlbWVudC5vZmZzZXRUb3A7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHNlbGYuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgKz0gMTtcbiAgICAgICAgXG4gICAgICAgIHRyYW5zZm9ybShcbiAgICAgICAgICAgIG95IC0gZHksXG4gICAgICAgICAgICBveSArIGR5LFxuICAgICAgICAgICAgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRvcCA9IHYgKyB5VW5pdDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICAgICAgICAgIGVhc2luZzogICBlYXNpbmdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50b3AgPSBveSArIHlVbml0O1xuICAgICAgICAgICAgICAgIHNlbGYuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgLT0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5idXMudHJpZ2dlcihcIndzZS5hc3NldHMubWl4aW5zLnNoYWtlXCIsIHRoaXMpO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIGRvTmV4dDogdHJ1ZVxuICAgIH07XG59O1xuXG5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKGNvbW1hbmQsIGFyZ3MpIHtcbiAgICBcbiAgICB2YXIgZHVyYXRpb24sIGVmZmVjdCwgZGlyZWN0aW9uLCBveCwgb3ksIHByb3AsIHhVbml0LCB5VW5pdDtcbiAgICB2YXIgc3RhZ2UsIGVsZW1lbnQsIGlzQW5pbWF0aW9uLCBlYXNpbmdGbiwgZWFzaW5nVHlwZSwgaW50ZXJwcmV0ZXI7XG4gICAgdmFyIG9mZnNldFdpZHRoLCBvZmZzZXRIZWlnaHQsIHN0YXJ0WCwgc3RhcnRZO1xuICAgIHZhciBwYXJzZSA9IHRvb2xzLmdldFBhcnNlZEF0dHJpYnV0ZTtcbiAgICBcbiAgICBhcmdzID0gYXJncyB8fCB7fTtcbiAgICBkdXJhdGlvbiA9IHBhcnNlKGNvbW1hbmQsIFwiZHVyYXRpb25cIiwgdGhpcy5pbnRlcnByZXRlciwgNTAwKTtcbiAgICBlZmZlY3QgPSBwYXJzZShjb21tYW5kLCBcImVmZmVjdFwiLCB0aGlzLmludGVycHJldGVyLCBcImZhZGVcIik7XG4gICAgZGlyZWN0aW9uID0gcGFyc2UoY29tbWFuZCwgXCJkaXJlY3Rpb25cIiwgdGhpcy5pbnRlcnByZXRlciwgXCJyaWdodFwiKTtcbiAgICBlbGVtZW50ID0gYXJncy5lbGVtZW50IHx8IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY3NzaWQpO1xuICAgIHhVbml0ID0gdGhpcy54VW5pdCB8fCAncHgnO1xuICAgIHlVbml0ID0gdGhpcy55VW5pdCB8fCAncHgnO1xuICAgIFxuICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICB3YXJuKHRoaXMuYnVzLCBcIkRPTSBFbGVtZW50IGZvciBhc3NldCBpcyBtaXNzaW5nIVwiLCBjb21tYW5kKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICBpbnRlcnByZXRlciA9IGFyZ3MuaW50ZXJwcmV0ZXIgfHwgdGhpcy5pbnRlcnByZXRlcjtcbiAgICBzdGFnZSA9IGFyZ3Muc3RhZ2UgfHwgdGhpcy5zdGFnZTtcbiAgICBlYXNpbmdUeXBlID0gcGFyc2UoY29tbWFuZCwgXCJlYXNpbmdcIiwgdGhpcy5pbnRlcnByZXRlciwgXCJzaW5lT3V0XCIpO1xuICAgIGVhc2luZ0ZuID0gKGVhc2luZ1tlYXNpbmdUeXBlXSkgPyBcbiAgICAgICAgZWFzaW5nW2Vhc2luZ1R5cGVdIDogXG4gICAgICAgIGVhc2luZy5zaW5lT3V0O1xuICAgIGlzQW5pbWF0aW9uID0gYXJncy5hbmltYXRpb24gPT09IHRydWUgPyB0cnVlIDogZmFsc2U7XG4gICAgXG4gICAgaWYgKGVmZmVjdCA9PT0gXCJzbGlkZVwiKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAoeFVuaXQgPT09ICclJykge1xuICAgICAgICAgICAgb3ggPSBlbGVtZW50Lm9mZnNldExlZnQgLyAoc3RhZ2Uub2Zmc2V0V2lkdGggLyAxMDApO1xuICAgICAgICAgICAgb2Zmc2V0V2lkdGggPSAxMDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBveCA9IGVsZW1lbnQub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIG9mZnNldFdpZHRoID0gc3RhZ2Uub2Zmc2V0V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmICh5VW5pdCA9PT0gJyUnKSB7XG4gICAgICAgICAgICBveSA9IGVsZW1lbnQub2Zmc2V0VG9wIC8gKHN0YWdlLm9mZnNldEhlaWdodCAvIDEwMCk7XG4gICAgICAgICAgICBvZmZzZXRIZWlnaHQgPSAxMDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBveSA9IGVsZW1lbnQub2Zmc2V0VG9wO1xuICAgICAgICAgICAgb2Zmc2V0SGVpZ2h0ID0gc3RhZ2Uub2Zmc2V0SGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xuICAgICAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSBveCArIG9mZnNldFdpZHRoICsgeFVuaXQ7XG4gICAgICAgICAgICAgICAgcHJvcCA9IFwibGVmdFwiO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5sZWZ0ID0gb3ggLSBvZmZzZXRXaWR0aCArIHhVbml0O1xuICAgICAgICAgICAgICAgIHByb3AgPSBcImxlZnRcIjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJ0b3BcIjpcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRvcCA9IG95ICsgb2Zmc2V0SGVpZ2h0ICsgeVVuaXQ7XG4gICAgICAgICAgICAgICAgcHJvcCA9IFwidG9wXCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwiYm90dG9tXCI6XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50b3AgPSBveSAtIG9mZnNldEhlaWdodCArIHlVbml0O1xuICAgICAgICAgICAgICAgIHByb3AgPSBcInRvcFwiO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSBveCAtIG9mZnNldFdpZHRoICsgeFVuaXQ7XG4gICAgICAgICAgICAgICAgcHJvcCA9IFwibGVmdFwiO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFpc0FuaW1hdGlvbikge1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKHhVbml0ID09PSAnJScpIHtcbiAgICAgICAgICAgIHN0YXJ0WCA9IGVsZW1lbnQub2Zmc2V0TGVmdCAvIChzdGFnZS5vZmZzZXRXaWR0aCAvIDEwMCk7XG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc3RhcnRYID0gZWxlbWVudC5vZmZzZXRMZWZ0O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoeVVuaXQgPT09ICclJykge1xuICAgICAgICAgICAgc3RhcnRZID0gZWxlbWVudC5vZmZzZXRUb3AgLyAoc3RhZ2Uub2Zmc2V0SGVpZ2h0IC8gMTAwKTtcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzdGFydFkgPSBlbGVtZW50Lm9mZnNldFRvcDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdHJhbnNmb3JtKFxuICAgICAgICAgICAgKHByb3AgPT09IFwibGVmdFwiID8gc3RhcnRYIDogc3RhcnRZKSwgXG4gICAgICAgICAgICAocHJvcCA9PT0gXCJsZWZ0XCIgPyBveCA6IG95KSxcbiAgICAgICAgICAgIGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZVtwcm9wXSA9IHYgKyAocHJvcCA9PT0gJ2xlZnQnID8geFVuaXQgOiB5VW5pdCk7XG4gICAgICAgICAgICB9LCBcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgICAgICAgICAgZWFzaW5nOiBlYXNpbmdGblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWlzQW5pbWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGludGVycHJldGVyLndhaXRDb3VudGVyIC09IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgXG4gICAgICAgIGlmICghaXNBbmltYXRpb24pIHtcbiAgICAgICAgICAgIGludGVycHJldGVyLndhaXRDb3VudGVyICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRyYW5zZm9ybShcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAxLFxuICAgICAgICAgICAgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSB2O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgICAgICAgICAgZWFzaW5nOiBlYXNpbmdGblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWlzQW5pbWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGludGVycHJldGVyLndhaXRDb3VudGVyIC09IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBkb05leHQ6IHRydWVcbiAgICB9O1xufTtcblxuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX2NyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0aGlzLmVsZW1lbnRUeXBlIHx8IFwiZGl2XCIpO1xuICAgIFxuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICB0aGlzLmVsZW1lbnQuZHJhZ2dhYmxlID0gZmFsc2U7XG4gICAgXG4gICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYXNzZXRcIik7XG4gICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcImlkXCIsIHRoaXMuY3NzaWQpO1xuICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXdzZS1hc3NldC1uYW1lXCIsIHRoaXMubmFtZSk7XG4gICAgXG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgIHRoaXMuZWxlbWVudC5zdHlsZS56SW5kZXggPSB0aGlzLno7XG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gdGhpcy53aWR0aDtcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgXG4gICAgdGhpcy5zdGFnZS5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnQpO1xufTtcblxuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX21vdmVUb1Bvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciB4LCB5LCB4VW5pdCwgeVVuaXQ7XG4gICAgdmFyIGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQ7XG4gICAgXG4gICAgeCA9IHBhcnNlSW50KHRoaXMueCwgMTApO1xuICAgIHkgPSBwYXJzZUludCh0aGlzLnksIDEwKTtcbiAgICB4VW5pdCA9IGV4dHJhY3RVbml0KHRoaXMueCkgfHwgXCJweFwiO1xuICAgIHlVbml0ID0gZXh0cmFjdFVuaXQodGhpcy55KSB8fCBcInB4XCI7XG4gICAgXG4gICAgaWYgKHhVbml0ID09PSBcIiVcIikge1xuICAgICAgICB4ID0gKHRoaXMuc3RhZ2Uub2Zmc2V0V2lkdGggLyAxMDApICogeDtcbiAgICB9XG4gICAgXG4gICAgaWYgKHlVbml0ID09PSBcIiVcIikge1xuICAgICAgICB5ID0gKHRoaXMuc3RhZ2Uub2Zmc2V0SGVpZ2h0IC8gMTAwKSAqIHk7XG4gICAgfVxuICAgIFxuICAgIHggPSBhbmNob3JlZFZhbHVlKHgsIHRoaXMueEFuY2hvciwgdGhpcy5ib3hXaWR0aCB8fCB0aGlzLmVsZW1lbnQub2Zmc2V0V2lkdGgpO1xuICAgIHkgPSBhbmNob3JlZFZhbHVlKHksIHRoaXMueUFuY2hvciwgdGhpcy5ib3hIZWlnaHQgfHwgdGhpcy5lbGVtZW50Lm9mZnNldEhlaWdodCk7XG4gICAgXG4gICAgaWYgKHhVbml0ID09PSBcIiVcIikge1xuICAgICAgICB4ID0geCAvICh0aGlzLnN0YWdlLm9mZnNldFdpZHRoIC8gMTAwKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHlVbml0ID09PSBcIiVcIikge1xuICAgICAgICB5ID0geSAvICh0aGlzLnN0YWdlLm9mZnNldEhlaWdodCAvIDEwMCk7XG4gICAgfVxuICAgIFxuICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9IFwiXCIgKyB4ICsgeFVuaXQ7XG4gICAgZWxlbWVudC5zdHlsZS50b3AgPSBcIlwiICsgeSArIHlVbml0O1xufTtcblxuLy9cbi8vIENhbGN1bGF0ZXMgLmJveFdpZHRoIGFuZCAuYm94SGVpZ2h0IGJ5IGZpbmRpbmcgdGhlIGhpZ2hlc3Qgd2lkdGggYW5kIGhlaWdodFxuLy8gb2YgdGhlIGVsZW1lbnQncyBjaGlsZHJlbiBkZXBlbmRpbmcgb24gdGhlIHNlbGVjdG9ycyBpbiAuX2JveFNpemVTZWxlY3RvcnMuXG4vL1xuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuX2NhbGN1bGF0ZUJveFNpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIHdpZHRoID0gMDtcbiAgICB2YXIgaGVpZ2h0ID0gMDtcbiAgICB2YXIgZWxlbWVudCA9IHRoaXMuZWxlbWVudDtcbiAgICBcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkodGhpcy5fYm94U2l6ZVNlbGVjdG9ycykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLl9ib3hTaXplU2VsZWN0b3JzLmZvckVhY2goZnVuY3Rpb24gKHNlbGVjdG9yKSB7XG4gICAgICAgIFxuICAgICAgICBbXS5mb3JFYWNoLmNhbGwoZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSwgZnVuY3Rpb24gKGltZykge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoaW1nLm9mZnNldFdpZHRoID4gd2lkdGgpIHtcbiAgICAgICAgICAgICAgICB3aWR0aCA9IGltZy5vZmZzZXRXaWR0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGltZy5vZmZzZXRIZWlnaHQgPiBoZWlnaHQpIHtcbiAgICAgICAgICAgICAgICBoZWlnaHQgPSBpbWcub2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgfSk7XG4gICAgXG4gICAgdGhpcy5ib3hXaWR0aCA9IHdpZHRoO1xuICAgIHRoaXMuYm94SGVpZ2h0ID0gaGVpZ2h0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBEaXNwbGF5T2JqZWN0O1xuIiwiLyogZXNsaW50IG5vLWNvbnNvbGU6IG9mZiAqL1xuXG52YXIgYWpheCA9IHJlcXVpcmUoXCJlYXN5LWFqYXhcIik7XG52YXIgRGF0YUJ1cyA9IHJlcXVpcmUoXCJkYXRhYnVzXCIpO1xuXG52YXIgdG9vbHMgPSByZXF1aXJlKFwiLi90b29scy90b29sc1wiKTtcbnZhciBsb2FkZXIgPSByZXF1aXJlKFwiLi9sb2FkZXJcIik7XG52YXIgS2V5cyA9IHJlcXVpcmUoXCIuL0tleXNcIik7XG52YXIgSW50ZXJwcmV0ZXIgPSByZXF1aXJlKFwiLi9JbnRlcnByZXRlclwiKTtcbnZhciBidXMgPSByZXF1aXJlKFwiLi9idXNcIik7XG5cbnZhciB0cnV0aHkgPSB0b29scy50cnV0aHk7XG5cbi8qKlxuICogQ29uc3RydWN0b3IgdXNlZCB0byBjcmVhdGUgaW5zdGFuY2VzIG9mIGdhbWVzLlxuICogXG4gKiBZb3UgY2FuIGNvbmZpZ3VyZSB0aGUgZ2FtZSBpbnN0YW5jZSB1c2luZyB0aGUgY29uZmlnIG9iamVjdFxuICogdGhhdCBjYW4gYmUgc3VwcGxpZWQgYXMgYSBwYXJhbWV0ZXIgdG8gdGhlIGNvbnN0cnVjdG9yIGZ1bmN0aW9uLlxuICogXG4gKiBUaGUgb3B0aW9ucyBhcmU6XG4gKiAgLSB1cmw6IFtzdHJpbmddIFRoZSBVUkwgb2YgdGhlIFdlYlN0b3J5IGZpbGUuXG4gKiAgLSBkZWJ1ZzogW2Jvb2xdIFNob3VsZCB0aGUgZ2FtZSBiZSBydW4gaW4gZGVidWcgbW9kZT8gKG5vdCB1c2VkIHlldClcbiAqICAtIGhvc3Q6IFtvYmplY3RdIFRoZSBIT1NUIG9iamVjdCBmb3IgdGhlIExvY2FsQ29udGFpbmVyIFxuICogICAgICB2ZXJzaW9uLiBPcHRpb25hbC5cbiAqIFxuICogQGV2ZW50IHdzZS5nYW1lLmNvbnN0cnVjdG9yQFdTRS5idXNcbiAqIEBwYXJhbSBhcmdzIEEgY29uZmlnIG9iamVjdC4gU2VlIGFib3ZlIGZvciBkZXRhaWxzLlxuICovXG5mdW5jdGlvbiBHYW1lIChhcmdzKSB7XG4gICAgXG4gICAgdmFyIGhvc3Q7XG4gICAgXG4gICAgYnVzLnRyaWdnZXIoXCJ3c2UuZ2FtZS5jb25zdHJ1Y3RvclwiLCB7YXJnczogYXJncywgZ2FtZTogdGhpc30pO1xuICAgIFxuICAgIGFyZ3MgPSBhcmdzIHx8IHt9O1xuICAgIHRoaXMuYnVzID0gbmV3IERhdGFCdXMoKTtcbiAgICB0aGlzLnVybCA9IGFyZ3MudXJsIHx8IFwiZ2FtZS54bWxcIjtcbiAgICB0aGlzLmdhbWVJZCA9IGFyZ3MuZ2FtZUlkIHx8IG51bGw7XG4gICAgdGhpcy53cyA9IG51bGw7XG4gICAgdGhpcy5kZWJ1ZyA9IGFyZ3MuZGVidWcgPT09IHRydWUgPyB0cnVlIDogZmFsc2U7XG4gICAgXG4gICAgaG9zdCA9IGFyZ3MuaG9zdCB8fCBmYWxzZTtcbiAgICB0aGlzLmhvc3QgPSBob3N0O1xuICAgIFxuICAgIGlmICh0aGlzLmdhbWVJZCkge1xuICAgICAgICBsb2FkZXIuZ2VuZXJhdGVGcm9tU3RyaW5nKFxuICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5nYW1lSWQpLmlubmVySFRNTCxcbiAgICAgICAgICAgIHRoaXMubG9hZC5iaW5kKHRoaXMpXG4gICAgICAgICk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAoaG9zdCkge1xuICAgICAgICAgICAgbG9hZGVyLmdlbmVyYXRlRnJvbVN0cmluZyhob3N0LmdldCh0aGlzLnVybCksIHRoaXMubG9hZC5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxvYWRlci5nZW5lcmF0ZUdhbWVGaWxlKHRoaXMudXJsLCB0aGlzLmxvYWQuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgdGhpcy5pbnRlcnByZXRlciA9IG5ldyBJbnRlcnByZXRlcih0aGlzLCB7XG4gICAgICAgIGRhdGFzb3VyY2U6IGFyZ3MuZGF0YXNvdXJjZVxuICAgIH0pO1xuICAgIFxuICAgIHRoaXMua2V5cyA9IG5ldyBLZXlzKCk7XG4gICAgdGhpcy5saXN0ZW5lcnNTdWJzY3JpYmVkID0gZmFsc2U7XG4gICAgLy9jb25zb2xlLmxvZyhcInRoaXMuaW50ZXJwcmV0ZXI6IFwiLCB0aGlzLmludGVycHJldGVyKTtcbiAgICBcbiAgICB0aGlzLmJ1cy5zdWJzY3JpYmUoXG4gICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIk1lc3NhZ2U6IFwiICsgZGF0YSk7XG4gICAgICAgIH0sIFxuICAgICAgICBcIndzZS5pbnRlcnByZXRlci5tZXNzYWdlXCJcbiAgICApO1xuICAgIFxuICAgIHRoaXMuYnVzLnN1YnNjcmliZShcbiAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiRXJyb3I6IFwiICsgZGF0YS5tZXNzYWdlKTtcbiAgICAgICAgfSwgXG4gICAgICAgIFwid3NlLmludGVycHJldGVyLmVycm9yXCJcbiAgICApO1xuICAgIFxuICAgIHRoaXMuYnVzLnN1YnNjcmliZShcbiAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiV2FybmluZzogXCIgKyBkYXRhLm1lc3NhZ2UsIGRhdGEuZWxlbWVudCk7XG4gICAgICAgIH0sIFxuICAgICAgICBcIndzZS5pbnRlcnByZXRlci53YXJuaW5nXCJcbiAgICApO1xufVxuXG4vKipcbiAqIExvYWRzIHRoZSBXZWJTdG9yeSBmaWxlIHVzaW5nIHRoZSBBSkFYIGZ1bmN0aW9uIGFuZCB0cmlnZ2Vyc1xuICogdGhlIGdhbWUgaW5pdGlhbGl6YXRpb24uXG4gKi9cbkdhbWUucHJvdG90eXBlLmxvYWQgPSBmdW5jdGlvbiAoZ2FtZURvY3VtZW50KSB7XG4gICAgdGhpcy53cyA9IGdhbWVEb2N1bWVudDtcbiAgICB0aGlzLmluaXQoKTtcbn07XG5cbkdhbWUucHJvdG90eXBlLmxvYWRGcm9tVXJsID0gZnVuY3Rpb24gKHVybCkge1xuICAgIFxuICAgIC8vY29uc29sZS5sb2coXCJMb2FkaW5nIGdhbWUgZmlsZS4uLlwiKTtcbiAgICB2YXIgZm4sIHNlbGY7XG4gICAgXG4gICAgdGhpcy51cmwgPSB1cmwgfHwgdGhpcy51cmw7XG4gICAgXG4gICAgc2VsZiA9IHRoaXM7XG4gICAgXG4gICAgZm4gPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgICAgIHNlbGYud3MgPSBvYmoucmVzcG9uc2VYTUw7XG4gICAgICAgIC8vY29uc29sZS5sb2coXCJSZXNwb25zZSBYTUw6IFwiICsgb2JqLnJlc3BvbnNlWE1MKTtcbiAgICAgICAgc2VsZi5pbml0KCk7XG4gICAgfTtcbiAgICBcbiAgICBhamF4LmdldCh0aGlzLnVybCwgbnVsbCwgZm4pO1xuICAgIFxufTtcblxuLyoqXG4gKiBJbml0aWFsaXplcyB0aGUgZ2FtZSBpbnN0YW5jZS5cbiAqL1xuR2FtZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgd3MsIHN0YWdlLCBzdGFnZUVsZW1lbnRzLCBzdGFnZUluZm8sIHdpZHRoLCBoZWlnaHQsIGlkLCBhbGlnbkZuLCByZXNpemVGbjtcbiAgICBcbiAgICB3cyA9IHRoaXMud3M7XG4gICAgXG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBwYXJzZUVycm9ycyA9IHdzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwicGFyc2VyZXJyb3JcIik7XG4gICAgICAgIFxuICAgICAgICBjb25zb2xlLmxvZyhcInBhcnNlcmVycm9yOlwiLCBwYXJzZUVycm9ycyk7XG4gICAgICAgIFxuICAgICAgICBpZiAocGFyc2VFcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmlubmVySFRNTCA9IFwiXCIgK1xuICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicGFyc2VFcnJvclwiPicrXG4gICAgICAgICAgICAgICAgICAgIFwiPGgxPkNhbm5vdCBwYXJzZSBXZWJTdG9yeSBmaWxlITwvaDM+XCIgK1xuICAgICAgICAgICAgICAgICAgICBcIjxwPllvdXIgV2ViU3RvcnkgZmlsZSBpcyBtYWwtZm9ybWVkIFhNTCBhbmQgY29udGFpbnMgdGhlc2UgZXJyb3JzOjwvcD5cIiArXG4gICAgICAgICAgICAgICAgICAgICc8cHJlIGNsYXNzPVwiZXJyb3JzXCI+JyArIHBhcnNlRXJyb3JzWzBdLmlubmVySFRNTCArICc8L3ByZT4nICtcbiAgICAgICAgICAgICAgICAnPC9kaXY+JztcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IHBhcnNlIGdhbWUgZmlsZSwgbm90IHdlbGwtZm9ybWVkIFhNTDpcIiwgcGFyc2VFcnJvcnNbMF0pO1xuICAgICAgICB9XG4gICAgfSgpKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgICBzdGFnZUVsZW1lbnRzID0gd3MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzdGFnZVwiKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgfVxuICAgIFxuICAgIHdpZHRoID0gXCI4MDBweFwiO1xuICAgIGhlaWdodCA9IFwiNDgwcHhcIjtcbiAgICBpZCA9IFwiU3RhZ2VcIjtcbiAgICBcbiAgICBpZiAoIXN0YWdlRWxlbWVudHMgfHwgc3RhZ2VFbGVtZW50cy5sZW5ndGggPCAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHN0YWdlIGRlZmluaXRpb24gZm91bmQhXCIpO1xuICAgIH1cbiAgICBcbiAgICBzdGFnZUluZm8gPSBzdGFnZUVsZW1lbnRzWzBdO1xuICAgIHdpZHRoID0gc3RhZ2VJbmZvLmdldEF0dHJpYnV0ZShcIndpZHRoXCIpIHx8IHdpZHRoO1xuICAgIGhlaWdodCA9IHN0YWdlSW5mby5nZXRBdHRyaWJ1dGUoXCJoZWlnaHRcIikgfHwgaGVpZ2h0O1xuICAgIGlkID0gc3RhZ2VJbmZvLmdldEF0dHJpYnV0ZShcImlkXCIpIHx8IGlkO1xuICAgIFxuICAgIC8vIENyZWF0ZSB0aGUgc3RhZ2UgZWxlbWVudCBvciBpbmplY3QgaW50byBleGlzdGluZyBvbmU/XG4gICAgaWYgKHN0YWdlSW5mby5nZXRBdHRyaWJ1dGUoXCJjcmVhdGVcIikgPT09IFwieWVzXCIpIHtcbiAgICAgICAgc3RhZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBzdGFnZS5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBpZCk7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc3RhZ2UpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc3RhZ2UgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk7XG4gICAgfVxuICAgIFxuICAgIHN0YWdlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiV1NFU3RhZ2VcIik7XG4gICAgXG4gICAgc3RhZ2Uuc3R5bGUud2lkdGggPSB3aWR0aDtcbiAgICBzdGFnZS5zdHlsZS5oZWlnaHQgPSBoZWlnaHQ7XG4gICAgXG4gICAgLy8gQWxpZ25zIHRoZSBzdGFnZSB0byBiZSBhbHdheXMgaW4gdGhlIGNlbnRlciBvZiB0aGUgYnJvd3NlciB3aW5kb3cuXG4gICAgLy8gTXVzdCBiZSBzcGVjaWZpZWQgaW4gdGhlIGdhbWUgZmlsZS5cbiAgICBhbGlnbkZuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIGRpbSA9IHRvb2xzLmdldFdpbmRvd0RpbWVuc2lvbnMoKTtcbiAgICAgICAgXG4gICAgICAgIHN0YWdlLnN0eWxlLmxlZnQgPSAoZGltLndpZHRoIC8gMikgLSAocGFyc2VJbnQod2lkdGgsIDEwKSAvIDIpICsgJ3B4JztcbiAgICAgICAgc3RhZ2Uuc3R5bGUudG9wID0gKGRpbS5oZWlnaHQgLyAyKSAtIChwYXJzZUludChoZWlnaHQsIDEwKSAvIDIpICsgJ3B4JztcbiAgICB9O1xuICAgIFxuICAgIGlmIChzdGFnZUluZm8uZ2V0QXR0cmlidXRlKFwiY2VudGVyXCIpID09PSBcInllc1wiKSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBhbGlnbkZuKTtcbiAgICAgICAgYWxpZ25GbigpO1xuICAgIH1cbiAgICBcbiAgICAvLyBSZXNpemVzIHRoZSBzdGFnZSB0byBmaXQgdGhlIGJyb3dzZXIgd2luZG93IGRpbWVuc2lvbnMuIE11c3QgYmVcbiAgICAvLyBzcGVjaWZpZWQgaW4gdGhlIGdhbWUgZmlsZS5cbiAgICByZXNpemVGbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJSZXNpemluZy4uLlwiKTtcbiAgICAgICAgdG9vbHMuZml0VG9XaW5kb3coc3RhZ2UsIHBhcnNlSW50KHdpZHRoLCAxMCksIHBhcnNlSW50KGhlaWdodCwgMTApKTtcbiAgICB9O1xuICAgIFxuICAgIGlmIChzdGFnZUluZm8uZ2V0QXR0cmlidXRlKFwicmVzaXplXCIpID09PSBcInllc1wiKSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCByZXNpemVGbik7XG4gICAgICAgIHJlc2l6ZUZuKCk7XG4gICAgfVxuICAgIFxuICAgIHRoaXMuc3RhZ2UgPSBzdGFnZTtcbiAgICAvLyAgICAgc3RhZ2Uub25jbGljayA9IGZ1bmN0aW9uKCkgeyBzZWxmLmludGVycHJldGVyLm5leHQoKTsgfTtcbiAgICBcbiAgICB0aGlzLmFwcGx5U2V0dGluZ3MoKTtcbiAgICBcbiAgICAvLyBUaGlzIHNlY3Rpb24gb25seSBhcHBsaWVzIHdoZW4gdGhlIGVuZ2luZSBpcyB1c2VkIGluc2lkZVxuICAgIC8vIHRoZSBsb2NhbCBjb250YWluZXIgYXBwLlxuICAgIGlmICh0aGlzLmhvc3QpIHtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaG9zdC53aW5kb3cud2lkdGggPSBwYXJzZUludCh3aWR0aCwgMTApO1xuICAgICAgICB0aGlzLmhvc3Qud2luZG93LmhlaWdodCA9IHBhcnNlSW50KGhlaWdodCwgMTApO1xuICAgICAgICBcbiAgICAgICAgKGZ1bmN0aW9uIChzZWxmKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBkb1Jlc2l6ZSA9IHRydXRoeShzZWxmLmdldFNldHRpbmcoXCJob3N0LnN0YWdlLnJlc2l6ZVwiKSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghZG9SZXNpemUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlc2l6aW5nLi4uXCIpO1xuICAgICAgICAgICAgICAgIHRvb2xzLmZpdFRvV2luZG93KHN0YWdlLCBwYXJzZUludCh3aWR0aCwgMTApLCBwYXJzZUludChoZWlnaHQsIDEwKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSh0aGlzKSk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSB2YWx1ZSBvZiBhIHNldHRpbmcgYXMgc3BlY2lmaWVkIGluIHRoZSBXZWJTdG9yeSBmaWxlLlxuICogQHBhcmFtIG5hbWUgW3N0cmluZ10gVGhlIG5hbWUgb2YgdGhlIHNldHRpbmcuXG4gKiBAcmV0dXJuIFttaXhlZF0gVGhlIHZhbHVlIG9mIHRoZSBzZXR0aW5nIG9yIG51bGwuXG4gKi9cbkdhbWUucHJvdG90eXBlLmdldFNldHRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIFxuICAgIHZhciByZXQsIHNldHRpbmdzLCBpLCBsZW4sIGN1ciwgY3VyTmFtZTtcbiAgICBcbiAgICBzZXR0aW5ncyA9IHRoaXMud3MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzZXR0aW5nXCIpO1xuICAgIFxuICAgIGZvciAoaSA9IDAsIGxlbiA9IHNldHRpbmdzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgIFxuICAgICAgICBjdXIgPSBzZXR0aW5nc1tpXTtcbiAgICAgICAgY3VyTmFtZSA9IGN1ci5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpIHx8IG51bGw7XG4gICAgICAgIFxuICAgICAgICBpZiAoY3VyTmFtZSAhPT0gbnVsbCAmJiBjdXJOYW1lID09PSBuYW1lKSB7XG4gICAgICAgICAgICByZXQgPSBjdXIuZ2V0QXR0cmlidXRlKFwidmFsdWVcIikgfHwgbnVsbDtcbiAgICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIG51bGw7XG59O1xuXG4vLyBGSVhNRTogaW1wbGVtZW50Li4uXG5HYW1lLnByb3RvdHlwZS5hcHBseVNldHRpbmdzID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHRoaXMud2ViSW5zcGVjdG9yRW5hYmxlZCA9IHRydXRoeSh0aGlzLmdldFNldHRpbmcoXCJob3N0Lmluc3BlY3Rvci5lbmFibGVcIikpO1xuICAgIFxuICAgIGlmICh0aGlzLmhvc3QpIHtcbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLndlYkluc3BlY3RvckVuYWJsZWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuaG9zdC5pbnNwZWN0b3Iuc2hvdygpO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqXG4gKiBVc2UgdGhpcyBtZXRob2QgdG8gc3RhcnQgdGhlIGdhbWUuIFRoZSBXZWJTdG9yeSBmaWxlIG11c3QgaGF2ZVxuICogYmVlbiBzdWNjZXNzZnVsbHkgbG9hZGVkIGZvciB0aGlzIHRvIHdvcmsuXG4gKi9cbkdhbWUucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciBmbiwgY29udGV4dG1lbnVfcHJveHksIHNlbGY7XG4gICAgXG4gICAgc2VsZiA9IHRoaXM7XG4gICAgXG4gICAgaWYgKHRoaXMud3MgPT09IG51bGwpIHtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYuc3RhcnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgLy8gTGlzdGVuZXIgdGhhdCBzZXRzIHRoZSBpbnRlcnByZXRlcidzIHN0YXRlIG1hY2hpbmUgdG8gdGhlIG5leHQgc3RhdGVcbiAgICAvLyBpZiB0aGUgY3VycmVudCBzdGF0ZSBpcyBub3QgcGF1c2Ugb3Igd2FpdCBtb2RlLlxuICAgIC8vIFRoaXMgZnVuY3Rpb24gZ2V0cyBleGVjdXRlZCB3aGVuIGEgdXNlciBjbGlja3Mgb24gdGhlIHN0YWdlLlxuICAgIGZuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBcbiAgICAgICAgaWYgKHNlbGYuaW50ZXJwcmV0ZXIuc3RhdGUgPT09IFwicGF1c2VcIiB8fCBzZWxmLmludGVycHJldGVyLndhaXRDb3VudGVyID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvL2NvbnNvbGUubG9nKFwiTmV4dCB0cmlnZ2VyZWQgYnkgdXNlci4uLlwiKTtcbiAgICAgICAgc2VsZi5pbnRlcnByZXRlci5uZXh0KHRydWUpO1xuICAgIH07XG4gICAgXG4gICAgY29udGV4dG1lbnVfcHJveHkgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBcbiAgICAgICAgc2VsZi5idXMudHJpZ2dlcihcImNvbnRleHRtZW51XCIsIHt9KTtcbiAgICAgICAgXG4gICAgICAgIC8vIGxldCdzIHRyeSB0byBwcmV2ZW50IHJlYWwgY29udGV4dCBtZW51IHNob3dpbmdcbiAgICAgICAgaWYgKGUgJiYgdHlwZW9mIGUucHJldmVudERlZmF1bHQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICBcbiAgICB0aGlzLnN1YnNjcmliZUxpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuc3RhZ2UuYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBjb250ZXh0bWVudV9wcm94eSk7XG4gICAgICAgIHRoaXMuc3RhZ2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmbik7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmxpc3RlbmVyc1N1YnNjcmliZWQgPSB0cnVlO1xuICAgIH07XG4gICAgXG4gICAgdGhpcy51bnN1YnNjcmliZUxpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuc3RhZ2UucmVtb3ZlRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBjb250ZXh0bWVudV9wcm94eSk7XG4gICAgICAgIHRoaXMuc3RhZ2UucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmbik7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmxpc3RlbmVyc1N1YnNjcmliZWQgPSBmYWxzZTtcbiAgICB9O1xuICAgIFxuICAgIHRoaXMuaW50ZXJwcmV0ZXIuc3RhcnQoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcbiIsIi8qIGVzbGludCBuby1jb25zb2xlOiBvZmYgKi9cblxudmFyIGVhY2ggPSByZXF1aXJlKFwiZW5qb3ktY29yZS9lYWNoXCIpO1xudmFyIGZpbmQgPSByZXF1aXJlKFwiZW5qb3ktY29yZS9maW5kXCIpO1xudmFyIHR5cGVjaGVja3MgPSByZXF1aXJlKFwiZW5qb3ktdHlwZWNoZWNrc1wiKTtcblxudmFyIHVpID0gcmVxdWlyZShcIi4vdG9vbHMvdWlcIik7XG52YXIgYnVzID0gcmVxdWlyZShcIi4vYnVzXCIpO1xudmFyIHRvb2xzID0gcmVxdWlyZShcIi4vdG9vbHMvdG9vbHNcIik7XG52YXIgYXNzZXRzID0gcmVxdWlyZShcIi4vYXNzZXRzXCIpO1xudmFyIFRyaWdnZXIgPSByZXF1aXJlKFwiLi9UcmlnZ2VyXCIpO1xudmFyIGNvbW1hbmRzID0gcmVxdWlyZShcIi4vY29tbWFuZHNcIik7XG52YXIgc2F2ZWdhbWVzID0gcmVxdWlyZShcIi4vc2F2ZWdhbWVzXCIpO1xudmFyIExvYWRpbmdTY3JlZW4gPSByZXF1aXJlKFwiLi9Mb2FkaW5nU2NyZWVuXCIpO1xudmFyIExvY2FsU3RvcmFnZVNvdXJjZSA9IHJlcXVpcmUoXCIuL2RhdGFTb3VyY2VzL0xvY2FsU3RvcmFnZVwiKTtcblxudmFyIGlzTnVsbCA9IHR5cGVjaGVja3MuaXNOdWxsO1xudmFyIGlzVW5kZWZpbmVkID0gdHlwZWNoZWNrcy5pc1VuZGVmaW5lZDtcblxudmFyIHdhcm4gPSB0b29scy53YXJuO1xudmFyIHRydXRoeSA9IHRvb2xzLnRydXRoeTtcbnZhciBsb2dFcnJvciA9IHRvb2xzLmxvZ0Vycm9yO1xudmFyIGdldFNlcmlhbGl6ZWROb2RlcyA9IHRvb2xzLmdldFNlcmlhbGl6ZWROb2RlcztcblxuLyoqXG4gKiBDb25zdHJ1Y3RvciB0byBjcmVhdGUgYW4gaW5zdGFuY2Ugb2YgdGhlIGVuZ2luZSdzIGludGVycHJldGVyLlxuICogRWFjaCBnYW1lIGhhcyBpdCdzIG93biBpbnRlcnByZXRlciBpbnN0YW5jZS4gVGhlIGludGVycHJldGVyXG4gKiByZWFkcyB0aGUgaW5mb3JtYXRpb24gaW4gdGhlIFdlYlN0b3J5IGZpbGUgYW5kIHRyaWdnZXJzIHRoZSBleGVjdXRpb25cbiAqIG9mIHRoZSBhcHByb3ByaWF0ZSBjb21tYW5kcy5cbiAqIFxuICogQGV2ZW50XG4gKiBAcGFyYW0gZ2FtZSBbb2JqZWN0XSBUaGUgV1NFLkdhbWUgaW5zdGFuY2UgdGhlIGludGVycHJldGVyIGJlbG9uZ3MgdG8uXG4gKi9cbmZ1bmN0aW9uIEludGVycHJldGVyIChnYW1lLCBvcHRpb25zKSB7XG4gICAgXG4gICAgdmFyIGRhdGFzb3VyY2UsIGtleTtcbiAgICBcbiAgICBidXMudHJpZ2dlcihcIndzZS5pbnRlcnByZXRlci5jb25zdHJ1Y3RvclwiLCB7Z2FtZTogZ2FtZSwgaW50ZXJwcmV0ZXI6IHRoaXN9KTtcbiAgICBcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICAgIHRoaXMuYXNzZXRzID0ge307XG4gICAgXG4gICAgLyoqIEB2YXIgSW5kZXggb2YgdGhlIGN1cnJlbnRseSBleGFtaW5lZCBlbGVtZW50IGluc2lkZSB0aGUgYWN0aXZlIHNjZW5lLiAqL1xuICAgIHRoaXMuaW5kZXggPSAwO1xuICAgIHRoaXMudmlzaXRlZFNjZW5lcyA9IFtdO1xuICAgIFxuICAgIC8qKiBAdmFyIEEgdGV4dCBsb2cgb2YgZXZlcnl0aGluZyB0aGF0IGhhcyBiZWVuIHNob3duIG9uIHRleHQgYm94ZXMuICovXG4gICAgdGhpcy5sb2cgPSBbXTtcbiAgICB0aGlzLndhaXRGb3JUaW1lciA9IGZhbHNlO1xuICAgIFxuICAgIC8qKiBAdmFyIE51bWJlciBvZiBhc3NldHMgdGhhdCBhcmUgY3VycmVudGx5IGJlaW5nIGZldGNoZWQgZnJvbSB0aGUgc2VydmVyLiAqL1xuICAgIHRoaXMuYXNzZXRzTG9hZGluZyA9IDA7XG4gICAgXG4gICAgLyoqIEB2YXIgVG90YWwgbnVtYmVyIG9mIGFzc2V0cyB0byBsb2FkLiAqL1xuICAgIHRoaXMuYXNzZXRzTG9hZGluZ01heCA9IDA7XG4gICAgXG4gICAgLyoqIEB2YXIgTnVtYmVyIG9mIGFzc2V0cyBhbHJlYWR5IGZldGNoZWQgZnJvbSB0aGUgc2VydmVyLiAqL1xuICAgIHRoaXMuYXNzZXRzTG9hZGVkID0gMDtcbiAgICBcbiAgICAvKiogQHZhciBUaGUgdGltZXN0YW1wIGZyb20gd2hlbiB0aGUgZ2FtZSBzdGFydHMuIFVzZWQgZm9yIHNhdmVnYW1lcy4gKi9cbiAgICB0aGlzLnN0YXJ0VGltZSA9IDA7XG4gICAgXG4gICAgLyoqIEB2YXIgSG9sZHMgJ25vcm1hbCcgdmFyaWFibGVzLiBUaGVzZSBhcmUgb25seSByZW1lbWJlcmVkIGZvciB0aGUgY3VycmVudCByb3V0ZS4gKi9cbiAgICB0aGlzLnJ1blZhcnMgPSB7fTtcbiAgICBcbiAgICAvKiogQHZhciBUaGUgY2FsbCBzdGFjayBmb3Igc3ViIHNjZW5lcy4gKi9cbiAgICB0aGlzLmNhbGxTdGFjayA9IFtdO1xuICAgIHRoaXMua2V5c0Rpc2FibGVkID0gMDsgLy8gaWYgdGhpcyBpcyA+IDAsIGtleSB0cmlnZ2VycyBzaG91bGQgYmUgZGlzYWJsZWRcbiAgICBcbiAgICAvKiogQHZhciBUaGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgaW50ZXJwcmV0ZXIncyBzdGF0ZSBtYWNoaW5lLiBcbiAgICAgKiAgICdsaXN0ZW4nIG1lYW5zIHRoYXQgY2xpY2tpbmcgb24gdGhlIHN0YWdlIG9yIGdvaW5nIHRvIHRoZSBuZXh0IGxpbmVcbiAgICAgKiAgIGlzIHBvc3NpYmxlLiBcbiAgICAgKi9cbiAgICB0aGlzLnN0YXRlID0gXCJsaXN0ZW5cIjtcbiAgICBcbiAgICAvKiogQHZhciBBbGwgZnVuY3Rpb25zIHRoYXQgcmVxdWlyZSB0aGUgaW50ZXJwcmV0ZXIncyBzdGF0ZSBtYWNoaW5lXG4gICAgICogICB0byB3YWl0LiBUaGUgZ2FtZSB3aWxsIG9ubHkgY29udGludWUgd2hlbiB0aGlzIGlzIHNldCB0byAwLlxuICAgICAqICAgVGhpcyBjYW4gYmUgdXNlZCB0byBwcmV2ZW50IGUuZy4gdGhhdCB0aGUgc3RvcnkgY29udGludWVzIGluXG4gICAgICogICB0aGUgYmFja2dyb3VuZCB3aGlsZSBhIGRpYWxvZyBpcyBkaXNwbGF5ZWQgaW4gdGhlIGZvcmVncm91bmQuXG4gICAgICovXG4gICAgdGhpcy53YWl0Q291bnRlciA9IDA7XG4gICAgXG4gICAgLyoqIEB2YXIgU2hvdWxkIHRoZSBnYW1lIGJlIHJ1biBpbiBkZWJ1ZyBtb2RlPyAqL1xuICAgIHRoaXMuZGVidWcgPSBnYW1lLmRlYnVnID09PSB0cnVlID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgLy8gVGhlIGRhdGFzb3VyY2UgdG8gdXNlIGZvciBzYXZpbmcgZ2FtZXMgYW5kIGdsb2JhbCB2YXJpYWJsZXMuXG4gICAgLy8gSGFyZGNvZGVkIHRvIGxvY2FsU3RvcmFnZSBmb3Igbm93LlxuICAgIGRhdGFzb3VyY2UgPSBvcHRpb25zLmRhdGFzb3VyY2UgfHwgbmV3IExvY2FsU3RvcmFnZVNvdXJjZSgpO1xuICAgIHRoaXMuZGF0YXNvdXJjZSA9IGRhdGFzb3VyY2U7XG4gICAgXG4gICAgLy8gRWFjaCBnYW1lIG11c3QgaGF2ZSBpdCdzIG93biB1bmlxdWUgc3RvcmFnZSBrZXkgc28gdGhhdCBtdWx0aXBsZVxuICAgIC8vIGdhbWVzIGNhbiBiZSBydW4gb24gdGhlIHNhbWUgd2ViIHBhZ2UuXG4gICAga2V5ID0gXCJ3c2VfZ2xvYmFsc19cIiArIGxvY2F0aW9uLnBhdGhuYW1lICsgXCJfXCIgKyB0aGlzLmdhbWUudXJsICsgXCJfXCI7XG4gICAgXG4gICAgLyoqIEB2YXIgU3RvcmVzIGdsb2JhbCB2YXJpYWJsZXMuIFRoYXQgaXMsIHZhcmlhYmxlcyB0aGF0IHdpbGxcbiAgICAgKiAgIGJlIHJlbWVtYmVyZWQgaW5kZXBlbmRlbnRseSBvZiB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgZ2FtZS5cbiAgICAgKiAgIENhbiBiZSB1c2VkIGZvciB1bmxvY2tpbmcgaGlkZGVuIGZlYXR1cmVzIGFmdGVyIHRoZSBmaXJzdFxuICAgICAqICAgcGxheXRocm91Z2ggZXRjLlxuICAgICAqL1xuICAgIHRoaXMuZ2xvYmFsVmFycyA9IHtcbiAgICAgICAgXG4gICAgICAgIHNldDogZnVuY3Rpb24gKG5hbWUsIHZhbHVlKSB7XG4gICAgICAgICAgICBkYXRhc291cmNlLnNldChrZXkgKyBuYW1lLCB2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICBnZXQ6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YXNvdXJjZS5nZXQoa2V5ICsgbmFtZSk7XG4gICAgICAgIH0sXG4gICAgICAgIFxuICAgICAgICBoYXM6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChpc051bGwoZGF0YXNvdXJjZS5nZXQoa2V5ICsgbmFtZSkpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgXG4gICAgdGhpcy5fbG9hZGluZ1NjcmVlbiA9IG5ldyBMb2FkaW5nU2NyZWVuKCk7XG4gICAgXG4gICAgaWYgKHRoaXMuZGVidWcgPT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5nYW1lLmJ1cy5kZWJ1ZyA9IHRydWU7XG4gICAgfVxufVxuXG5JbnRlcnByZXRlci5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIHNlbGYsIGZuLCBtYWtlS2V5Rm4sIGJ1cywgc3RhcnRUaW1lID0gRGF0ZS5ub3coKTtcbiAgICBcbiAgICB0aGlzLnN0b3J5ID0gdGhpcy5nYW1lLndzO1xuICAgIHRoaXMuc3RhZ2UgPSB0aGlzLmdhbWUuc3RhZ2U7XG4gICAgdGhpcy5idXMgPSB0aGlzLmdhbWUuYnVzO1xuICAgIHRoaXMuaW5kZXggPSAwO1xuICAgIHRoaXMuY3VycmVudEVsZW1lbnQgPSAwO1xuICAgIHRoaXMuc2NlbmVJZCA9IG51bGw7XG4gICAgdGhpcy5zY2VuZVBhdGggPSBbXTtcbiAgICB0aGlzLmN1cnJlbnRDb21tYW5kcyA9IFtdO1xuICAgIHRoaXMud2FpdCA9IGZhbHNlO1xuICAgIHRoaXMuc3RhcnRUaW1lID0gTWF0aC5yb3VuZCgrbmV3IERhdGUoKSAvIDEwMDApO1xuICAgIHRoaXMuc3RvcHBlZCA9IGZhbHNlO1xuICAgIFxuICAgIHNlbGYgPSB0aGlzO1xuICAgIGJ1cyA9IHRoaXMuYnVzO1xuICAgIFxuICAgIHRoaXMuX3N0YXJ0TG9hZGluZ1NjcmVlbigpO1xuICAgIFxuICAgIC8vIEFkZHMgbG9jYXRpb24gaW5mbyB0byB3YXJuaW5ncyBhbmQgZXJyb3JzLlxuICAgIGZuID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBzZWN0aW9uLCBlbGVtZW50LCBtc2c7XG4gICAgICAgIFxuICAgICAgICBkYXRhID0gZGF0YSB8fCB7fTtcbiAgICAgICAgZWxlbWVudCA9IGRhdGEuZWxlbWVudCB8fCBudWxsO1xuICAgICAgICBzZWN0aW9uID0gbnVsbDtcbiAgICAgICAgXG4gICAgICAgIGlmIChlbGVtZW50ICE9PSBudWxsKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgc2VjdGlvbiA9IGRhdGEuZWxlbWVudC50YWdOYW1lID09PSBcImFzc2V0XCIgPyBcImFzc2V0c1wiIDogbnVsbDtcbiAgICAgICAgICAgICAgICBzZWN0aW9uID0gZGF0YS5lbGVtZW50LnBhcmVudC50YWdOYW1lID09PSBcInNldHRpbmdzXCIgPyBcInNldHRpbmdzXCIgOiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAvLyBkbyBub3RoaW5nXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHNlY3Rpb24gPSBzZWN0aW9uIHx8IFwic2NlbmVzXCI7XG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggKHNlY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgXCJhc3NldHNcIjpcbiAgICAgICAgICAgICAgICBtc2cgPSBcIiAgICAgICAgIEVuY291bnRlcmVkIGluIHNlY3Rpb24gJ2Fzc2V0cycuXCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwic2V0dGluZ3NcIjpcbiAgICAgICAgICAgICAgICBtc2cgPSBcIiAgICAgICAgIEVuY291bnRlcmVkIGluIHNlY3Rpb24gJ3NldHRpbmdzJy5cIjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgbXNnID0gXCIgICAgICAgICBFbmNvdW50ZXJlZCBpbiBzY2VuZSAnXCIgKyBzZWxmLnNjZW5lSWQgKyBcIicsIGVsZW1lbnQgXCIgKyBzZWxmLmN1cnJlbnRFbGVtZW50ICsgXCIuXCI7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgfTtcbiAgICBcbiAgICBidXMuc3Vic2NyaWJlKGZuLCBcIndzZS5pbnRlcnByZXRlci5lcnJvclwiKTtcbiAgICBidXMuc3Vic2NyaWJlKGZuLCBcIndzZS5pbnRlcnByZXRlci53YXJuaW5nXCIpO1xuICAgIGJ1cy5zdWJzY3JpYmUoZm4sIFwid3NlLmludGVycHJldGVyLm1lc3NhZ2VcIik7XG4gICAgXG4gICAgYnVzLnN1YnNjcmliZShcbiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJHYW1lIG92ZXIuXCIpO1xuICAgICAgICB9LCBcbiAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIuZW5kXCJcbiAgICApO1xuICAgIFxuICAgIGJ1cy5zdWJzY3JpYmUoXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYubnVtYmVyT2ZGdW5jdGlvbnNUb1dhaXRGb3IgKz0gMTtcbiAgICAgICAgfSwgXG4gICAgICAgIFwid3NlLmludGVycHJldGVyLm51bWJlck9mRnVuY3Rpb25zVG9XYWl0Rm9yLmluY3JlYXNlXCJcbiAgICApO1xuICAgIFxuICAgIGJ1cy5zdWJzY3JpYmUoXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNlbGYubnVtYmVyT2ZGdW5jdGlvbnNUb1dhaXRGb3IgLT0gMTtcbiAgICAgICAgfSxcbiAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIubnVtYmVyT2ZGdW5jdGlvbnNUb1dhaXRGb3IuZGVjcmVhc2VcIlxuICAgICk7XG4gICAgXG4gICAgYnVzLnN1YnNjcmliZShcbiAgICAgICAgdGhpcy5fbG9hZGluZ1NjcmVlbi5hZGRJdGVtLmJpbmQodGhpcy5fbG9hZGluZ1NjcmVlbiksIFxuICAgICAgICBcIndzZS5hc3NldHMubG9hZGluZy5pbmNyZWFzZVwiXG4gICAgKTtcbiAgICBcbiAgICBidXMuc3Vic2NyaWJlKFxuICAgICAgICB0aGlzLl9sb2FkaW5nU2NyZWVuLml0ZW1Mb2FkZWQuYmluZCh0aGlzLl9sb2FkaW5nU2NyZWVuKSwgXG4gICAgICAgIFwid3NlLmFzc2V0cy5sb2FkaW5nLmRlY3JlYXNlXCJcbiAgICApO1xuICAgIFxuICAgIHRoaXMuYnVpbGRBc3NldHMoKTtcbiAgICB0aGlzLmNyZWF0ZVRyaWdnZXJzKCk7XG4gICAgXG4gICAgbWFrZUtleUZuID0gZnVuY3Rpb24gKHR5cGUpIHtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIGJ1cy50cmlnZ2VyKFxuICAgICAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBldmVudDogZXYsXG4gICAgICAgICAgICAgICAgICAgIGtleXM6IHNlbGYuZ2FtZS5rZXlzLmtleXNcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9O1xuICAgIH07XG4gICAgXG4gICAgdGhpcy5nYW1lLmtleXMuZm9yQWxsKG1ha2VLZXlGbihcImtleXVwXCIpLCBcInVwXCIpO1xuICAgIHRoaXMuZ2FtZS5rZXlzLmZvckFsbChtYWtlS2V5Rm4oXCJrZXlkb3duXCIpLCBcImRvd25cIik7XG4gICAgdGhpcy5nYW1lLmtleXMuZm9yQWxsKG1ha2VLZXlGbihcImtleXByZXNzXCIpLCBcInByZXNzXCIpO1xuICAgIFxuICAgIHRoaXMuZ2FtZS5zdWJzY3JpYmVMaXN0ZW5lcnMoKTtcbiAgICBcbiAgICB0aGlzLl9hc3NldHNMb2FkZWQgPSBmYWxzZTtcbiAgICBcbiAgICB0aGlzLl9sb2FkaW5nU2NyZWVuLnN1YnNjcmliZShcImZpbmlzaGVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciB0aW1lID0gRGF0ZS5ub3coKSAtIHN0YXJ0VGltZTtcbiAgICAgICAgXG4gICAgICAgIGlmIChzZWxmLl9hc3NldHNMb2FkZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgc2VsZi5fYXNzZXRzTG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgIHNlbGYuY2FsbE9uTG9hZCgpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHRpbWUgPCAxMDAwKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KHNlbGYucnVuU3RvcnkuYmluZChzZWxmKSwgMTAwMCAtIHRpbWUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc2VsZi5ydW5TdG9yeSgpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgXG4gICAgaWYgKHRoaXMuX2xvYWRpbmdTY3JlZW4uY291bnQoKSA8IDEpIHtcbiAgICAgICAgdGhpcy5fYXNzZXRzTG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5ydW5TdG9yeSgpO1xuICAgIH1cbn07XG5cbkludGVycHJldGVyLnByb3RvdHlwZS5jYWxsT25Mb2FkID0gZnVuY3Rpb24gKCkge1xuICAgIGVhY2goZnVuY3Rpb24gKGFzc2V0KSB7XG4gICAgICAgIGlmICh0eXBlb2YgYXNzZXQub25Mb2FkID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGFzc2V0Lm9uTG9hZCgpO1xuICAgICAgICB9XG4gICAgfSwgdGhpcy5hc3NldHMpO1xufTtcblxuSW50ZXJwcmV0ZXIucHJvdG90eXBlLnJ1blN0b3J5ID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIGlmICh0aGlzLmFzc2V0c0xvYWRpbmcgPiAwKSB7XG4gICAgICAgIHNldFRpbWVvdXQodGhpcy5ydW5TdG9yeS5iaW5kKHRoaXMpLCAxMDApO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIHRoaXMuYnVzLnRyaWdnZXIoXCJ3c2UuYXNzZXRzLmxvYWRpbmcuZmluaXNoZWRcIik7XG4gICAgdGhpcy5fbG9hZGluZ1NjcmVlbi5oaWRlKCk7XG4gICAgdGhpcy5zdGFydFRpbWUgPSBNYXRoLnJvdW5kKCtuZXcgRGF0ZSgpIC8gMTAwMCk7XG4gICAgdGhpcy5jaGFuZ2VTY2VuZSh0aGlzLmdldEZpcnN0U2NlbmUoKSk7XG59O1xuXG5JbnRlcnByZXRlci5wcm90b3R5cGUuZ2V0Rmlyc3RTY2VuZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgc2NlbmVzLCBsZW4sIHN0YXJ0U2NlbmU7XG4gICAgXG4gICAgc2NlbmVzID0gdGhpcy5zdG9yeS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjZW5lXCIpO1xuICAgIHRoaXMuc2NlbmVzID0gc2NlbmVzO1xuICAgIGxlbiA9IHNjZW5lcy5sZW5ndGg7XG4gICAgXG4gICAgc3RhcnRTY2VuZSA9IHRoaXMuZ2V0U2NlbmVCeUlkKFwic3RhcnRcIik7XG4gICAgXG4gICAgaWYgKHN0YXJ0U2NlbmUgIT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHN0YXJ0U2NlbmU7XG4gICAgfVxuICAgIFxuICAgIGlmIChsZW4gPCAxKSB7XG4gICAgICAgIGxvZ0Vycm9yKHRoaXMuYnVzLCBcIk5vIHNjZW5lcyBmb3VuZCFcIik7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gc2NlbmVzWzBdO1xufTtcblxuSW50ZXJwcmV0ZXIucHJvdG90eXBlLmNoYW5nZVNjZW5lID0gZnVuY3Rpb24gKHNjZW5lKSB7XG4gICAgdGhpcy5jaGFuZ2VTY2VuZU5vTmV4dChzY2VuZSk7XG4gICAgdGhpcy5uZXh0KCk7XG59O1xuXG5JbnRlcnByZXRlci5wcm90b3R5cGUuY2hhbmdlU2NlbmVOb05leHQgPSBmdW5jdGlvbiAoc2NlbmUpIHtcbiAgICBcbiAgICB2YXIgbGVuLCBpZCwgYnVzID0gdGhpcy5idXM7XG4gICAgXG4gICAgYnVzLnRyaWdnZXIoXG4gICAgICAgIFwid3NlLmludGVycHJldGVyLmNoYW5nZXNjZW5lLmJlZm9yZVwiLFxuICAgICAgICB7XG4gICAgICAgICAgICBzY2VuZTogc2NlbmUsXG4gICAgICAgICAgICBpbnRlcnByZXRlcjogdGhpc1xuICAgICAgICB9LFxuICAgICAgICBmYWxzZVxuICAgICk7XG4gICAgXG4gICAgaWYgKGlzVW5kZWZpbmVkKHNjZW5lKSB8fCBpc051bGwoc2NlbmUpKSB7XG4gICAgICAgIGxvZ0Vycm9yKGJ1cywgXCJTY2VuZSBkb2VzIG5vdCBleGlzdC5cIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaWQgPSBzY2VuZS5nZXRBdHRyaWJ1dGUoXCJpZFwiKTtcbiAgICB0aGlzLnZpc2l0ZWRTY2VuZXMucHVzaChpZCk7XG4gICAgXG4gICAgaWYgKGlzTnVsbChpZCkpIHtcbiAgICAgICAgbG9nRXJyb3IoYnVzLCBcIkVuY291bnRlcmVkIHNjZW5lIHdpdGhvdXQgaWQgYXR0cmlidXRlLlwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICBidXMudHJpZ2dlcihcIndzZS5pbnRlcnByZXRlci5tZXNzYWdlXCIsIFwiRW50ZXJpbmcgc2NlbmUgJ1wiICsgaWQgKyBcIicuXCIpO1xuICAgIFxuICAgIHdoaWxlICh0aGlzLnNjZW5lUGF0aC5sZW5ndGggPiAwKSB7XG4gICAgICAgIHRoaXMucG9wRnJvbUNhbGxTdGFjaygpO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLmN1cnJlbnRDb21tYW5kcyA9IHNjZW5lLmNoaWxkTm9kZXM7XG4gICAgbGVuID0gdGhpcy5jdXJyZW50Q29tbWFuZHMubGVuZ3RoO1xuICAgIHRoaXMuaW5kZXggPSAwO1xuICAgIHRoaXMuc2NlbmVJZCA9IGlkO1xuICAgIHRoaXMuc2NlbmVQYXRoID0gW107XG4gICAgdGhpcy5jdXJyZW50RWxlbWVudCA9IDA7XG4gICAgXG4gICAgaWYgKGxlbiA8IDEpIHtcbiAgICAgICAgd2FybihidXMsIFwiU2NlbmUgJ1wiICsgaWQgKyBcIicgaXMgZW1wdHkuXCIsIHNjZW5lKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLm51bWJlck9mRnVuY3Rpb25zVG9XYWl0Rm9yID0gMDtcbiAgICBcbiAgICBidXMudHJpZ2dlcihcbiAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIuY2hhbmdlc2NlbmUuYWZ0ZXJcIixcbiAgICAgICAge1xuICAgICAgICAgICAgc2NlbmU6IHNjZW5lLFxuICAgICAgICAgICAgaW50ZXJwcmV0ZXI6IHRoaXNcbiAgICAgICAgfSxcbiAgICAgICAgZmFsc2VcbiAgICApO1xufTtcblxuSW50ZXJwcmV0ZXIucHJvdG90eXBlLnB1c2hUb0NhbGxTdGFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgb2JqID0ge307XG4gICAgXG4gICAgb2JqLmluZGV4ID0gdGhpcy5pbmRleDtcbiAgICBvYmouc2NlbmVJZCA9IHRoaXMuc2NlbmVJZDtcbiAgICBvYmouc2NlbmVQYXRoID0gdGhpcy5zY2VuZVBhdGguc2xpY2UoKTtcbiAgICBvYmouY3VycmVudEVsZW1lbnQgPSB0aGlzLmN1cnJlbnRFbGVtZW50O1xuICAgIFxuICAgIHRoaXMuY2FsbFN0YWNrLnB1c2gob2JqKTtcbn07XG5cbkludGVycHJldGVyLnByb3RvdHlwZS5wb3BGcm9tQ2FsbFN0YWNrID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciB0b3AgPSB0aGlzLmNhbGxTdGFjay5wb3AoKSwgc2NlbmVQYXRoID0gdG9wLnNjZW5lUGF0aC5zbGljZSgpO1xuICAgIFxuICAgIHRoaXMuYnVzLnRyaWdnZXIoXG4gICAgICAgIFwid3NlLmludGVycHJldGVyLm1lc3NhZ2VcIiwgXG4gICAgICAgIFwiUmV0dXJuaW5nIGZyb20gc3ViIHNjZW5lICdcIiArIHRoaXMuc2NlbmVJZCArIFwiJyB0byBzY2VuZSAnXCIgKyB0b3Auc2NlbmVJZCArIFwiJy4uLlwiLFxuICAgICAgICBmYWxzZVxuICAgICk7XG4gICAgXG4gICAgdGhpcy5pbmRleCA9IHRvcC5pbmRleCArIDE7XG4gICAgdGhpcy5zY2VuZUlkID0gdG9wLnNjZW5lSWQ7XG4gICAgdGhpcy5zY2VuZVBhdGggPSB0b3Auc2NlbmVQYXRoO1xuICAgIHRoaXMuY3VycmVudFNjZW5lID0gdGhpcy5nZXRTY2VuZUJ5SWQodG9wLnNjZW5lSWQpO1xuICAgIHRoaXMuY3VycmVudEVsZW1lbnQgPSB0b3AuY3VycmVudEVsZW1lbnQ7XG4gICAgXG4gICAgdGhpcy5jdXJyZW50Q29tbWFuZHMgPSB0aGlzLmN1cnJlbnRTY2VuZS5jaGlsZE5vZGVzO1xuICAgIFxuICAgIHdoaWxlIChzY2VuZVBhdGgubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRDb21tYW5kcyA9IHRoaXMuY3VycmVudENvbW1hbmRzW3NjZW5lUGF0aC5zaGlmdCgpXS5jaGlsZE5vZGVzO1xuICAgIH1cbn07XG5cbkludGVycHJldGVyLnByb3RvdHlwZS5nZXRTY2VuZUJ5SWQgPSBmdW5jdGlvbiAoc2NlbmVOYW1lKSB7XG4gICAgXG4gICAgdmFyIHNjZW5lID0gZmluZChmdW5jdGlvbiAoY3VycmVudCkge1xuICAgICAgICByZXR1cm4gY3VycmVudC5nZXRBdHRyaWJ1dGUoXCJpZFwiKSA9PT0gc2NlbmVOYW1lO1xuICAgIH0sIHRoaXMuc2NlbmVzKTtcbiAgICBcbiAgICBpZiAoaXNOdWxsKHNjZW5lKSkge1xuICAgICAgICB3YXJuKHRoaXMuYnVzLCBcIlNjZW5lICdcIiArIHNjZW5lTmFtZSArIFwiJyBub3QgZm91bmQhXCIpO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gc2NlbmU7XG59O1xuXG5JbnRlcnByZXRlci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uICh0cmlnZ2VyZWRCeVVzZXIpIHtcbiAgICBcbiAgICB2YXIgbm9kZU5hbWUsIGNvbW1hbmQsIGNoZWNrLCBzZWxmLCBzdG9wT2JqLCBidXMgPSB0aGlzLmJ1cztcbiAgICBcbiAgICBzdG9wT2JqID0ge1xuICAgICAgICBzdG9wOiBmYWxzZVxuICAgIH07XG4gICAgXG4gICAgdHJpZ2dlcmVkQnlVc2VyID0gdHJpZ2dlcmVkQnlVc2VyID09PSB0cnVlID8gdHJ1ZSA6IGZhbHNlO1xuICAgIFxuICAgIGJ1cy50cmlnZ2VyKFwid3NlLmludGVycHJldGVyLm5leHQuYmVmb3JlXCIsIHRoaXMsIGZhbHNlKTtcbiAgICBcbiAgICBpZiAodHJpZ2dlcmVkQnlVc2VyID09PSB0cnVlKSB7XG4gICAgICAgIGJ1cy50cmlnZ2VyKFwid3NlLmludGVycHJldGVyLm5leHQudXNlclwiLCBzdG9wT2JqLCBmYWxzZSk7XG4gICAgfVxuICAgIFxuICAgIGlmIChzdG9wT2JqLnN0b3AgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICBzZWxmID0gdGhpcztcbiAgICBcbiAgICBpZiAodGhpcy5zdGF0ZSA9PT0gXCJwYXVzZVwiKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMud2FpdEZvclRpbWVyID09PSB0cnVlIHx8ICh0aGlzLndhaXQgPT09IHRydWUgJiYgdGhpcy53YWl0Q291bnRlciA+IDApKSB7XG4gICAgICAgIFxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgc2VsZi5uZXh0KCk7IH0sIDApO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICBpZiAodGhpcy53YWl0ID09PSB0cnVlICYmIHRoaXMubnVtYmVyT2ZGdW5jdGlvbnNUb1dhaXRGb3IgPCAxKSB7XG4gICAgICAgIHRoaXMud2FpdCA9IGZhbHNlO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLnN0b3BwZWQgPSBmYWxzZTtcbiAgICBcbiAgICBpZiAodGhpcy5jYW5jZWxDaGFyQW5pbWF0aW9uKSB7XG4gICAgICAgIHRoaXMuY2FuY2VsQ2hhckFuaW1hdGlvbigpO1xuICAgICAgICB0aGlzLmNhbmNlbENoYXJBbmltYXRpb24gPSBudWxsO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGlmICh0aGlzLmluZGV4ID49IHRoaXMuY3VycmVudENvbW1hbmRzLmxlbmd0aCkge1xuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuY2FsbFN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5wb3BGcm9tQ2FsbFN0YWNrKCk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgc2VsZi5uZXh0KCk7IH0sIDApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGJ1cy50cmlnZ2VyKFwid3NlLmludGVycHJldGVyLm5leHQuYWZ0ZXIuZW5kXCIsIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgYnVzLnRyaWdnZXIoXCJ3c2UuaW50ZXJwcmV0ZXIuZW5kXCIsIHRoaXMpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICBjb21tYW5kID0gdGhpcy5jdXJyZW50Q29tbWFuZHNbdGhpcy5pbmRleF07XG4gICAgbm9kZU5hbWUgPSBjb21tYW5kLm5vZGVOYW1lO1xuICAgIFxuICAgIC8vIGlnbm9yZSB0ZXh0IGFuZCBjb21tZW50IG5vZGVzOlxuICAgIGlmIChub2RlTmFtZSA9PT0gXCIjdGV4dFwiIHx8IG5vZGVOYW1lID09PSBcIiNjb21tZW50XCIpIHtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5kZXggKz0gMTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHNlbGYubmV4dCgpOyB9LCAwKTtcbiAgICAgICAgYnVzLnRyaWdnZXIoXCJ3c2UuaW50ZXJwcmV0ZXIubmV4dC5pZ25vcmVcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICBidXMudHJpZ2dlcihcIndzZS5pbnRlcnByZXRlci5uZXh0LmNvbW1hbmRcIiwgY29tbWFuZCk7XG4gICAgdGhpcy5jdXJyZW50RWxlbWVudCArPSAxO1xuICAgIGNoZWNrID0gdGhpcy5ydW5Db21tYW5kKHRoaXMuY3VycmVudENvbW1hbmRzW3RoaXMuaW5kZXhdKTtcbiAgICBcbiAgICBjaGVjayA9IGNoZWNrIHx8IHt9O1xuICAgIGNoZWNrLmRvTmV4dCA9IGNoZWNrLmRvTmV4dCA9PT0gZmFsc2UgPyBmYWxzZSA6IHRydWU7XG4gICAgY2hlY2sud2FpdCA9IGNoZWNrLndhaXQgPT09IHRydWUgPyB0cnVlIDogZmFsc2U7XG4gICAgY2hlY2suY2hhbmdlU2NlbmUgPSBjaGVjay5jaGFuZ2VTY2VuZSB8fCBudWxsO1xuICAgIFxuICAgIGlmIChjaGVjay53YWl0ID09PSB0cnVlKSB7XG4gICAgICAgIHRoaXMud2FpdCA9IHRydWU7XG4gICAgfVxuICAgIFxuICAgIHRoaXMuaW5kZXggKz0gMTtcbiAgICBcbiAgICBpZiAoY2hlY2suY2hhbmdlU2NlbmUgIT09IG51bGwpIHtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuY2hhbmdlU2NlbmUoY2hlY2suY2hhbmdlU2NlbmUpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICBpZiAoY2hlY2suZG9OZXh0ID09PSB0cnVlKSB7XG4gICAgICAgIFxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgc2VsZi5uZXh0KCk7IH0sIDApO1xuICAgICAgICBidXMudHJpZ2dlcihcIndzZS5pbnRlcnByZXRlci5uZXh0LmFmdGVyLmRvbmV4dFwiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIHRoaXMuc3RvcHBlZCA9IHRydWU7XG4gICAgXG4gICAgYnVzLnRyaWdnZXIoXCJ3c2UuaW50ZXJwcmV0ZXIubmV4dC5hZnRlci5ub25leHRcIiwgdGhpcywgZmFsc2UpO1xufTtcblxuSW50ZXJwcmV0ZXIucHJvdG90eXBlLmNoZWNrSWZ2YXIgPSBmdW5jdGlvbiAoY29tbWFuZCkge1xuICAgIFxuICAgIHZhciBpZnZhciwgaWZ2YWwsIGlmbm90LCB2YXJDb250YWluZXIsIGJ1cyA9IHRoaXMuYnVzO1xuICAgIFxuICAgIGlmdmFyID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJpZnZhclwiKSB8fCBudWxsO1xuICAgIGlmdmFsID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJpZnZhbHVlXCIpO1xuICAgIGlmbm90ID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJpZm5vdFwiKTtcbiAgICBcbiAgICBpZiAoaWZ2YXIgIT09IG51bGwgfHwgaWZ2YWwgIT09IG51bGwgfHwgaWZub3QgIT09IG51bGwpIHtcbiAgICAgICAgXG4gICAgICAgIHZhckNvbnRhaW5lciA9IHRoaXMucnVuVmFycztcbiAgICAgICAgXG4gICAgICAgIGlmICghKGlmdmFyIGluIHZhckNvbnRhaW5lcikpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgd2FybihidXMsIFwiVW5rbm93biB2YXJpYWJsZSAnXCIgKyBpZnZhciArXG4gICAgICAgICAgICAgICAgXCInIHVzZWQgaW4gY29uZGl0aW9uLiBJZ25vcmluZyBjb21tYW5kLlwiLCBjb21tYW5kKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYnVzLnRyaWdnZXIoXG4gICAgICAgICAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIucnVuY29tbWFuZC5hZnRlci5jb25kaXRpb24uZXJyb3Iua2V5XCIsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnByZXRlcjogdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogY29tbWFuZFxuICAgICAgICAgICAgICAgIH0sIFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChpZm5vdCAhPT0gbnVsbCAmJiAoXCJcIiArIHZhckNvbnRhaW5lcltpZnZhcl0gPT09IFwiXCIgKyBpZm5vdCkpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYnVzLnRyaWdnZXIoXG4gICAgICAgICAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIubWVzc2FnZVwiLCBcIkNvbmlkaXRpb24gbm90IG1ldC4gXCIgKyBpZnZhciArIFwiPT1cIiArIGlmbm90KTtcbiAgICAgICAgICAgIGJ1cy50cmlnZ2VyKFxuICAgICAgICAgICAgICAgIFwid3NlLmludGVycHJldGVyLnJ1bmNvbW1hbmQuYWZ0ZXIuY29uZGl0aW9uLmZhbHNlXCIsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnByZXRlcjogdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogY29tbWFuZFxuICAgICAgICAgICAgICAgIH0sIFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaWZ2YWwgIT09IG51bGwgJiYgKFwiXCIgKyB2YXJDb250YWluZXJbaWZ2YXJdKSAhPT0gXCJcIiArIGlmdmFsKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGJ1cy50cmlnZ2VyKFwid3NlLmludGVycHJldGVyLm1lc3NhZ2VcIiwgXCJDb25pZGl0aW9uIG5vdCBtZXQuXCIpO1xuICAgICAgICAgICAgYnVzLnRyaWdnZXIoXG4gICAgICAgICAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIucnVuY29tbWFuZC5hZnRlci5jb25kaXRpb24uZmFsc2VcIixcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGludGVycHJldGVyOiB0aGlzLFxuICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiBjb21tYW5kXG4gICAgICAgICAgICAgICAgfSwgXG4gICAgICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgYnVzLnRyaWdnZXIoXG4gICAgICAgICAgICBcIndzZS5pbnRlcnByZXRlci5ydW5jb21tYW5kLmNvbmRpdGlvbi5tZXRcIixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpbnRlcnByZXRlcjogdGhpcyxcbiAgICAgICAgICAgICAgICBjb21tYW5kOiBjb21tYW5kXG4gICAgICAgICAgICB9LCBcbiAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG4gICAgICAgIFxuICAgICAgICBidXMudHJpZ2dlcihcIndzZS5pbnRlcnByZXRlci5tZXNzYWdlXCIsIFwiQ29uaWRpdGlvbiBtZXQuXCIpO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cbkludGVycHJldGVyLnByb3RvdHlwZS5ydW5Db21tYW5kID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcbiAgICBcbiAgICB2YXIgdGFnTmFtZSwgYXNzZXROYW1lLCBidXMgPSB0aGlzLmJ1cztcbiAgICBcbiAgICB0aGlzLmJ1cy50cmlnZ2VyKFxuICAgICAgICBcIndzZS5pbnRlcnByZXRlci5ydW5jb21tYW5kLmJlZm9yZVwiLCBcbiAgICAgICAge1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXI6IHRoaXMsXG4gICAgICAgICAgICBjb21tYW5kOiBjb21tYW5kXG4gICAgICAgIH0sIFxuICAgICAgICBmYWxzZVxuICAgICk7XG4gICAgXG4gICAgdGFnTmFtZSA9IGNvbW1hbmQudGFnTmFtZTtcbiAgICBhc3NldE5hbWUgPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcImFzc2V0XCIpIHx8IG51bGw7XG4gICAgXG4gICAgaWYgKCF0aGlzLmNoZWNrSWZ2YXIoY29tbWFuZCkpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRvTmV4dDogdHJ1ZVxuICAgICAgICB9O1xuICAgIH1cbiAgICBcbiAgICBpZiAodGFnTmFtZSBpbiBjb21tYW5kcykge1xuICAgICAgICBcbiAgICAgICAgYnVzLnRyaWdnZXIoXG4gICAgICAgICAgICBcIndzZS5pbnRlcnByZXRlci5ydW5jb21tYW5kLmFmdGVyLmNvbW1hbmRcIixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpbnRlcnByZXRlcjogdGhpcyxcbiAgICAgICAgICAgICAgICBjb21tYW5kOiBjb21tYW5kXG4gICAgICAgICAgICB9LCBcbiAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG4gICAgICAgIFxuICAgICAgICBidXMudHJpZ2dlcignZ2FtZS5jb21tYW5kcy4nICsgdGFnTmFtZSk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gY29tbWFuZHNbdGFnTmFtZV0oY29tbWFuZCwgdGhpcyk7XG4gICAgfVxuICAgIGVsc2UgaWYgKFxuICAgICAgICBhc3NldE5hbWUgIT09IG51bGwgJiZcbiAgICAgICAgYXNzZXROYW1lIGluIHRoaXMuYXNzZXRzICYmXG4gICAgICAgIHR5cGVvZiB0aGlzLmFzc2V0c1thc3NldE5hbWVdW3RhZ05hbWVdID09PSBcImZ1bmN0aW9uXCIgJiZcbiAgICAgICAgdGFnTmFtZS5tYXRjaCgvKHNob3d8aGlkZXxjbGVhcnxmbGlja2VyfGZsYXNofHBsYXl8c3RhcnR8c3RvcHxwYXVzZXxtb3ZlfHNoYWtlfHNldHx0YWcpLylcbiAgICApIHtcbiAgICAgICAgXG4gICAgICAgIGJ1cy50cmlnZ2VyKCdnYW1lLmFzc2V0cy4nICsgYXNzZXROYW1lICsgJy4nICsgdGFnTmFtZSk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpcy5hc3NldHNbYXNzZXROYW1lXVt0YWdOYW1lXShjb21tYW5kLCB0aGlzKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIFxuICAgICAgICB3YXJuKGJ1cywgXCJVbmtub3duIGVsZW1lbnQgJ1wiICsgdGFnTmFtZSArIFwiJy5cIiwgY29tbWFuZCk7XG4gICAgICAgIFxuICAgICAgICBidXMudHJpZ2dlcihcbiAgICAgICAgICAgIFwid3NlLmludGVycHJldGVyLnJ1bmNvbW1hbmQuYWZ0ZXIuZXJyb3JcIixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpbnRlcnByZXRlcjogdGhpcyxcbiAgICAgICAgICAgICAgICBjb21tYW5kOiBjb21tYW5kXG4gICAgICAgICAgICB9LCBcbiAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZG9OZXh0OiB0cnVlXG4gICAgICAgIH07XG4gICAgfVxufTtcblxuSW50ZXJwcmV0ZXIucHJvdG90eXBlLmNyZWF0ZVRyaWdnZXJzID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciB0cmlnZ2VycywgY3VyTmFtZSwgY3VyVHJpZ2dlciwgYnVzID0gdGhpcy5idXM7XG4gICAgdmFyIGludGVycHJldGVyID0gdGhpcztcbiAgICBcbiAgICBidXMudHJpZ2dlcihcIndzZS5pbnRlcnByZXRlci50cmlnZ2Vycy5jcmVhdGVcIiwgdGhpcywgZmFsc2UpO1xuICAgIFxuICAgIHRoaXMudHJpZ2dlcnMgPSB7fTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgICB0cmlnZ2VycyA9IHRoaXMuZ2FtZS53cy5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRyaWdnZXJzXCIpWzBdLlxuICAgICAgICAgICAgZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0cmlnZ2VyXCIpO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICBlYWNoKGZ1bmN0aW9uIChjdXIpIHtcbiAgICAgICAgXG4gICAgICAgIGN1ck5hbWUgPSBjdXIuZ2V0QXR0cmlidXRlKFwibmFtZVwiKSB8fCBudWxsO1xuICAgICAgICBcbiAgICAgICAgaWYgKGN1ck5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHdhcm4oYnVzLCBcIk5vIG5hbWUgc3BlY2lmaWVkIGZvciB0cmlnZ2VyLlwiLCBjdXIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAodHlwZW9mIGludGVycHJldGVyLnRyaWdnZXJzW2N1ck5hbWVdICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXIudHJpZ2dlcnNbY3VyTmFtZV0gIT09IG51bGwpIHtcbiAgICAgICAgICAgIHdhcm4oYnVzLCBcIkEgdHJpZ2dlciB3aXRoIHRoZSBuYW1lICdcIiArIGN1ck5hbWUgK1xuICAgICAgICAgICAgICAgIFwiJyBhbHJlYWR5IGV4aXN0cy5cIiwgY3VyKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgY3VyVHJpZ2dlciA9IG5ldyBUcmlnZ2VyKGN1ciwgaW50ZXJwcmV0ZXIpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHR5cGVvZiBjdXJUcmlnZ2VyLmZuID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGludGVycHJldGVyLnRyaWdnZXJzW2N1ck5hbWVdID0gY3VyVHJpZ2dlcjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9LCB0cmlnZ2Vycyk7XG4gICAgXG59O1xuXG5JbnRlcnByZXRlci5wcm90b3R5cGUuYnVpbGRBc3NldHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIGFzc2V0cywgYnVzID0gdGhpcy5idXM7XG4gICAgXG4gICAgYnVzLnRyaWdnZXIoXCJ3c2UuYXNzZXRzLmxvYWRpbmcuc3RhcnRlZFwiKTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgICBhc3NldHMgPSB0aGlzLnN0b3J5LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYXNzZXRzXCIpWzBdLmNoaWxkTm9kZXM7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGxvZ0Vycm9yKGJ1cywgXCJFcnJvciB3aGlsZSBjcmVhdGluZyBhc3NldHM6IFwiICsgZS5nZXRNZXNzYWdlKCkpO1xuICAgIH1cbiAgICBcbiAgICBlYWNoKGZ1bmN0aW9uIChhc3NldCkge1xuICAgICAgICBcbiAgICAgICAgaWYgKGFzc2V0Lm5vZGVUeXBlICE9PSAxKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuY3JlYXRlQXNzZXQoYXNzZXQpO1xuICAgICAgICBcbiAgICB9LmJpbmQodGhpcyksIGFzc2V0cyk7XG4gICAgXG59O1xuXG5JbnRlcnByZXRlci5wcm90b3R5cGUuY3JlYXRlQXNzZXQgPSBmdW5jdGlvbiAoYXNzZXQpIHtcbiAgICBcbiAgICB2YXIgbmFtZSwgYXNzZXRUeXBlLCBidXMgPSB0aGlzLmJ1cztcbiAgICBcbiAgICBidXMudHJpZ2dlcihcbiAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIuY3JlYXRlYXNzZXRcIixcbiAgICAgICAge1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXI6IHRoaXMsXG4gICAgICAgICAgICBhc3NldDogYXNzZXRcbiAgICAgICAgfSwgXG4gICAgICAgIGZhbHNlXG4gICAgKTtcbiAgICBcbiAgICBuYW1lID0gYXNzZXQuZ2V0QXR0cmlidXRlKFwibmFtZVwiKTtcbiAgICBhc3NldFR5cGUgPSBhc3NldC50YWdOYW1lO1xuICAgIFxuICAgIGlmIChuYW1lID09PSBudWxsKSB7XG4gICAgICAgIGxvZ0Vycm9yKGJ1cywgXCJFeHBlY3RlZCBhdHRyaWJ1dGUgJ25hbWUnLlwiLCBhc3NldCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaWYgKGFzc2V0VHlwZSA9PT0gbnVsbCkge1xuICAgICAgICB3YXJuKGJ1cywgXCJFeHBlY3RlZCBhdHRyaWJ1dGUgJ3R5cGUnIG9uIGFzc2V0ICdcIiArIG5hbWUgKyBcIicuXCIsIGFzc2V0KTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICBpZiAodHlwZW9mIHRoaXMuYXNzZXRzW25hbWVdICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHdhcm4oYnVzLCBcIlRyeWluZyB0byBvdmVycmlkZSBleGlzdGluZyBhc3NldCAnXCIgKyBuYW1lICsgXCInLlwiLCBhc3NldCk7XG4gICAgfVxuICAgIFxuICAgIGFzc2V0VHlwZSA9IHRvb2xzLmZpcnN0TGV0dGVyVXBwZXJjYXNlKGFzc2V0VHlwZSk7XG4gICAgXG4gICAgaWYgKGFzc2V0VHlwZSBpbiBhc3NldHMpIHtcbiAgICAgICAgdGhpcy5hc3NldHNbbmFtZV0gPSBuZXcgYXNzZXRzW2Fzc2V0VHlwZV0oYXNzZXQsIHRoaXMpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB3YXJuKGJ1cywgXCJVbmtub3duIGFzc2V0IHR5cGUgJ1wiICsgYXNzZXRUeXBlICsgXCInLlwiLCBhc3NldCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG59O1xuXG5JbnRlcnByZXRlci5wcm90b3R5cGUudG9nZ2xlU2F2ZWdhbWVNZW51ID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciBtZW51LCBkZWxldGVCdXR0b24sIGxvYWRCdXR0b24sIHNhdmVCdXR0b24sIHNlbGY7XG4gICAgdmFyIHNhdmVzLCBidXR0b25QYW5lbCwgcmVzdW1lQnV0dG9uLCBpZCwgc2dMaXN0O1xuICAgIHZhciBjdXJFbCwgbGlzdGVuZXJTdGF0dXMsIGN1ckVsYXBzZWQsIG9sZFN0YXRlO1xuICAgIFxuICAgIHNlbGYgPSB0aGlzO1xuICAgIGlkID0gXCJXU0VTYXZlR2FtZU1lbnVfXCIgKyB0aGlzLmdhbWUudXJsO1xuICAgIGxpc3RlbmVyU3RhdHVzID0gdGhpcy5nYW1lLmxpc3RlbmVyc1N1YnNjcmliZWQ7XG4gICAgXG4gICAgbWVudSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSB8fCBudWxsO1xuICAgIFxuICAgIGlmIChtZW51ICE9PSBudWxsKSB7XG4gICAgICAgIFxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGlzdGVuZXJTdGF0dXMgPSB0cnV0aHkobWVudS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXdzZS1saXN0ZW5lci1zdGF0dXNcIikpO1xuICAgICAgICAgICAgdGhpcy5zdGFnZS5yZW1vdmVDaGlsZChtZW51KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChsaXN0ZW5lclN0YXR1cyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5zYXZlZ2FtZU1lbnVWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLm9sZFN0YXRlSW5TYXZlZ2FtZU1lbnU7XG4gICAgICAgIHRoaXMud2FpdENvdW50ZXIgLT0gMTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMuc3RvcHBlZCAhPT0gdHJ1ZSkge1xuICAgICAgICBcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHNlbGYudG9nZ2xlU2F2ZWdhbWVNZW51KCk7IH0sIDIwKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgb2xkU3RhdGUgPSB0aGlzLnN0YXRlO1xuICAgIHRoaXMub2xkU3RhdGVJblNhdmVnYW1lTWVudSA9IG9sZFN0YXRlO1xuICAgIHRoaXMuc3RhdGUgPSBcInBhdXNlXCI7XG4gICAgdGhpcy53YWl0Q291bnRlciArPSAxO1xuICAgIHRoaXMuc2F2ZWdhbWVNZW51VmlzaWJsZSA9IHRydWU7XG4gICAgXG4gICAgbWVudSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgbWVudS5pbm5lckhUTUwgPSBcIlwiO1xuICAgIG1lbnUuc2V0QXR0cmlidXRlKFwiaWRcIiwgaWQpO1xuICAgIG1lbnUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJXU0VTYXZlZ2FtZU1lbnVcIik7XG4gICAgbWVudS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXdzZS1yZW1vdmVcIiwgXCJ0cnVlXCIpO1xuICAgIG1lbnUuc2V0QXR0cmlidXRlKFwiZGF0YS13c2UtbGlzdGVuZXItc3RhdHVzXCIsIGxpc3RlbmVyU3RhdHVzKTtcbiAgICBtZW51LnN0eWxlLnpJbmRleCA9IDEwMDAwMDtcbiAgICBtZW51LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgIFxuICAgIHNhdmVzID0gc2F2ZWdhbWVzLmdldFNhdmVnYW1lTGlzdCh0aGlzLCB0cnVlKTtcbiAgICBcbiAgICBkZWxldGVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgZGVsZXRlQnV0dG9uLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYnV0dG9uIGRlbGV0ZVwiKTtcbiAgICBkZWxldGVCdXR0b24uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcbiAgICBkZWxldGVCdXR0b24udmFsdWUgPSBcIkRlbGV0ZVwiO1xuICAgIFxuICAgIGRlbGV0ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgYWN0aXZlLCBzYXZlZ2FtZU5hbWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgXG4gICAgICAgICAgICBhY3RpdmUgPSBtZW51LnF1ZXJ5U2VsZWN0b3IoXCIuYWN0aXZlXCIpIHx8IG51bGw7XG4gICAgICAgIFxuICAgICAgICAgICAgaWYgKGFjdGl2ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2F2ZWdhbWVOYW1lID0gYWN0aXZlLmdldEF0dHJpYnV0ZShcImRhdGEtd3NlLXNhdmVnYW1lLW5hbWVcIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZ1bmN0aW9uIGZuIChkZWNpc2lvbikge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChkZWNpc2lvbiA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBzYXZlZ2FtZXMucmVtb3ZlKHNlbGYsIHNhdmVnYW1lTmFtZSk7XG4gICAgICAgICAgICAgICAgc2VsZi50b2dnbGVTYXZlZ2FtZU1lbnUoKTtcbiAgICAgICAgICAgICAgICBzZWxmLnRvZ2dsZVNhdmVnYW1lTWVudSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB1aS5jb25maXJtKFxuICAgICAgICAgICAgICAgIHNlbGYsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJEZWxldGUgZ2FtZT9cIixcbiAgICAgICAgICAgICAgICAgICAgbWVzc2FnZTogXCJEbyB5b3UgcmVhbGx5IHdhbnQgdG8gZGVsZXRlIHNhdmVnYW1lICdcIiArIHNhdmVnYW1lTmFtZSArIFwiJz9cIixcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSxcbiAgICAgICAgZmFsc2VcbiAgICApO1xuICAgIFxuICAgIHNhdmVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgc2F2ZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImJ1dHRvbiBzYXZlXCIpO1xuICAgIHNhdmVCdXR0b24uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcbiAgICBzYXZlQnV0dG9uLnZhbHVlID0gXCJTYXZlXCI7XG4gICAgXG4gICAgc2F2ZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgYWN0aXZlLCBzYXZlZ2FtZU5hbWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYWN0aXZlID0gbWVudS5xdWVyeVNlbGVjdG9yKFwiLmFjdGl2ZVwiKSB8fCBudWxsO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoYWN0aXZlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdWkucHJvbXB0KFxuICAgICAgICAgICAgICAgICAgICBzZWxmLFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJOZXcgc2F2ZWdhbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiUGxlYXNlIGVudGVyIGEgbmFtZSBmb3IgdGhlIHNhdmVnYW1lOlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVpLmFsZXJ0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJFcnJvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiVGhlIHNhdmVnYW1lIG5hbWUgY2Fubm90IGJlIGVtcHR5IVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudG9nZ2xlU2F2ZWdhbWVNZW51KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5nYW1lLmxpc3RlbmVyc1N1YnNjcmliZWQgPSBsaXN0ZW5lclN0YXR1cztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzYXZlZ2FtZXMuc2F2ZShzZWxmLCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnRvZ2dsZVNhdmVnYW1lTWVudSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZ2FtZS5saXN0ZW5lcnNTdWJzY3JpYmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdWkuYWxlcnQoXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkdhbWUgc2F2ZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiWW91ciBnYW1lIGhhcyBiZWVuIHNhdmVkLlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNhdmVnYW1lTmFtZSA9IGFjdGl2ZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXdzZS1zYXZlZ2FtZS1uYW1lXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB1aS5jb25maXJtKFxuICAgICAgICAgICAgICAgIHNlbGYsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJPdmVyd3JpdGUgc2F2ZWdhbWU/XCIsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiWW91IGFyZSBhYm91dCB0byBvdmVyd3JpdGUgYW4gb2xkIHNhdmVnYW1lLiBBcmUgeW91IHN1cmU/XCIsXG4gICAgICAgICAgICAgICAgICAgIHRydWVUZXh0OiBcIlllc1wiLFxuICAgICAgICAgICAgICAgICAgICBmYWxzZVRleHQ6IFwiTm9cIixcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uIChkZWNpc2lvbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVjaXNpb24gPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnRvZ2dsZVNhdmVnYW1lTWVudSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZWdhbWVzLnNhdmUoc2VsZiwgc2F2ZWdhbWVOYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudG9nZ2xlU2F2ZWdhbWVNZW51KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHVpLmFsZXJ0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJHYW1lIHNhdmVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiWW91ciBnYW1lIGhhcyBiZWVuIHNhdmVkLlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0sXG4gICAgICAgIGZhbHNlXG4gICAgKTtcbiAgICBcbiAgICBsb2FkQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgIGxvYWRCdXR0b24uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJidXR0b24gbG9hZFwiKTtcbiAgICBsb2FkQnV0dG9uLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJidXR0b25cIik7XG4gICAgbG9hZEJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCAxKTtcbiAgICBsb2FkQnV0dG9uLnZhbHVlID0gXCJMb2FkXCI7XG4gICAgXG4gICAgbG9hZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgYWN0aXZlLCBzYXZlZ2FtZU5hbWUsIGZuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGFjdGl2ZSA9IG1lbnUucXVlcnlTZWxlY3RvcihcIi5hY3RpdmVcIikgfHwgbnVsbDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGFjdGl2ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2F2ZWdhbWVOYW1lID0gYWN0aXZlLmdldEF0dHJpYnV0ZShcImRhdGEtd3NlLXNhdmVnYW1lLW5hbWVcIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZuID0gZnVuY3Rpb24gKGRlY2lzaW9uKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGRlY2lzaW9uID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHNlbGYuc3RhZ2UucmVtb3ZlQ2hpbGQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpKTtcbiAgICAgICAgICAgICAgICBzZWxmLnNhdmVnYW1lTWVudVZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBzZWxmLndhaXRDb3VudGVyIC09IDE7XG4gICAgICAgICAgICAgICAgc2VsZi5zdGF0ZSA9IG9sZFN0YXRlO1xuICAgICAgICAgICAgICAgIHNhdmVnYW1lcy5sb2FkKHNlbGYsIHNhdmVnYW1lTmFtZSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB1aS5jb25maXJtKFxuICAgICAgICAgICAgICAgIHNlbGYsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJMb2FkIGdhbWU/XCIsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiTG9hZGluZyBhIHNhdmVnYW1lIHdpbGwgZGlzY2FyZCBhbGwgdW5zYXZlZCBwcm9ncmVzcy4gQ29udGludWU/XCIsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0sXG4gICAgICAgIGZhbHNlXG4gICAgKTtcbiAgICBcbiAgICBidXR0b25QYW5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgYnV0dG9uUGFuZWwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJwYW5lbFwiKTtcbiAgICByZXN1bWVCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgcmVzdW1lQnV0dG9uLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYnV0dG9uIHJlc3VtZVwiKTtcbiAgICByZXN1bWVCdXR0b24uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcbiAgICByZXN1bWVCdXR0b24udmFsdWUgPSBcIlJlc3VtZVwiO1xuICAgIFxuICAgIHJlc3VtZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICBcImNsaWNrXCIsXG4gICAgICAgIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBzZWxmLnN0YWdlLnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNlbGYuYnVzLnRyaWdnZXIoXG4gICAgICAgICAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIubnVtYmVyT2ZGdW5jdGlvbnNUb1dhaXRGb3IuZGVjcmVhc2VcIixcbiAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZWxmLnNhdmVnYW1lTWVudVZpc2libGUgPSBmYWxzZTtcbiAgICAgICAgICAgIHNlbGYud2FpdENvdW50ZXIgLT0gMTtcbiAgICAgICAgICAgIHNlbGYuc3RhdGUgPSBvbGRTdGF0ZTtcbiAgICAgICAgfSxcbiAgICAgICAgZmFsc2VcbiAgICApO1xuICAgIFxuICAgIHNnTGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgc2dMaXN0LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibGlzdFwiKTtcbiAgICBcbiAgICBidXR0b25QYW5lbC5hcHBlbmRDaGlsZChsb2FkQnV0dG9uKTtcbiAgICBidXR0b25QYW5lbC5hcHBlbmRDaGlsZChzYXZlQnV0dG9uKTtcbiAgICBidXR0b25QYW5lbC5hcHBlbmRDaGlsZChkZWxldGVCdXR0b24pO1xuICAgIGJ1dHRvblBhbmVsLmFwcGVuZENoaWxkKHJlc3VtZUJ1dHRvbik7XG4gICAgbWVudS5hcHBlbmRDaGlsZChidXR0b25QYW5lbCk7XG4gICAgXG4gICAgZnVuY3Rpb24gbWFrZUNsaWNrRm4gKGN1ckVsKSB7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBvbGQ7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBvbGQgPSBzZ0xpc3QucXVlcnlTZWxlY3RvcihcIi5hY3RpdmVcIikgfHwgbnVsbDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAob2xkICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIG9sZC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBvbGQuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIikucmVwbGFjZSgvYWN0aXZlLywgXCJcIikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGN1ckVsLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGN1ckVsLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpICsgXCIgYWN0aXZlXCIpO1xuICAgICAgICAgICAgbG9hZEJ1dHRvbi5mb2N1cygpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBcbiAgICBjdXJFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgY3VyRWwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJidXR0b25cIik7XG4gICAgXG4gICAgZWFjaChmdW5jdGlvbiAoY3VyKSB7XG4gICAgICAgIFxuICAgICAgICBjdXJFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGN1ckVsYXBzZWQgPSBjdXIuc2F2ZVRpbWUgLSBjdXIuc3RhcnRUaW1lO1xuICAgICAgICBjdXJFbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImJ1dHRvblwiKTtcbiAgICAgICAgY3VyRWwuc2V0QXR0cmlidXRlKFwiZGF0YS13c2Utc2F2ZWdhbWUtbmFtZVwiLCBjdXIubmFtZSk7XG4gICAgICAgIFxuICAgICAgICBjdXJFbC5pbm5lckhUTUwgPSAnJyArIFxuICAgICAgICAgICAgJzxwIGNsYXNzPVwibmFtZVwiPicgKyBcbiAgICAgICAgICAgICAgICBjdXIubmFtZSArIFxuICAgICAgICAgICAgJzwvcD4nICsgXG4gICAgICAgICAgICAnPHAgY2xhc3M9XCJkZXNjcmlwdGlvblwiPicgKyBcbiAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJlbGFwc2VkXCI+JyArIFxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludCgoY3VyRWxhcHNlZCAvIDYwKSAvIDYwLCAxMCkgKyAnaCAnICsgXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KChjdXJFbGFwc2VkIC8gNjApICUgNjAsIDEwKSArICdtICcgKyBcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQoY3VyRWxhcHNlZCAlIDYwLCAxMCkgKyAncycgKyBcbiAgICAgICAgICAgICAgICAnPC9zcGFuPicgKyBcbiAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJkYXRlXCI+JyArIFxuICAgICAgICAgICAgICAgICAgICBuZXcgRGF0ZShjdXIuc2F2ZVRpbWUgKiAxMDAwKS50b1VUQ1N0cmluZygpICsgXG4gICAgICAgICAgICAgICAgJzwvc3Bhbj4nICsgXG4gICAgICAgICAgICAnPC9wPic7XG4gICAgICAgIFxuICAgICAgICBjdXJFbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgbWFrZUNsaWNrRm4oY3VyRWwsIGN1ciksIGZhbHNlKTtcbiAgICAgICAgc2dMaXN0LmFwcGVuZENoaWxkKGN1ckVsKTtcbiAgICAgICAgXG4gICAgfSwgc2F2ZXMpO1xuICAgIFxuICAgIG1lbnUuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGFjdGl2ZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgYWN0aXZlID0gbWVudS5xdWVyeVNlbGVjdG9yKFwiLmFjdGl2ZVwiKSB8fCBudWxsO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoYWN0aXZlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBhY3RpdmUuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgYWN0aXZlLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpLnJlcGxhY2UoL2FjdGl2ZS8sIFwiXCIpKTtcbiAgICAgICAgfSxcbiAgICAgICAgZmFsc2VcbiAgICApO1xuICAgIFxuICAgIG1lbnUuYXBwZW5kQ2hpbGQoc2dMaXN0KTtcbiAgICBcbiAgICB0aGlzLnN0YWdlLmFwcGVuZENoaWxkKG1lbnUpO1xufTtcblxuSW50ZXJwcmV0ZXIucHJvdG90eXBlLl9zdGFydExvYWRpbmdTY3JlZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIHRlbXBsYXRlID0gdGhpcy5zdG9yeS5xdWVyeVNlbGVjdG9yKFwibG9hZGluZ1NjcmVlblwiKTtcbiAgICBcbiAgICBpZiAodGVtcGxhdGUpIHtcbiAgICAgICAgdGhpcy5fbG9hZGluZ1NjcmVlbi5zZXRUZW1wbGF0ZShnZXRTZXJpYWxpemVkTm9kZXModGVtcGxhdGUpKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5fbG9hZGluZ1NjcmVlbi5zaG93KHRoaXMuc3RhZ2UpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcnByZXRlcjtcbiIsIi8qKlxuICAgIFxuICAgIEBtb2R1bGUgV1NFLktleXNcbiAgICBcbiAgICBbQ29uc3RydWN0b3JdIFdTRS5LZXlzXG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIFxuICAgICAgICBBIHNpbXBsZSBvYmplY3QgdG8gaGFuZGxlIGtleSBwcmVzcyBldmVudHMuXG4gICAgICAgIEhhcyBhIG51bWJlciBvZiBoYW5keSBwc2V1ZG8gY29uc3RhbnRzIHdoaWNoIGNhblxuICAgICAgICBiZSB1c2VkIHRvIGlkZW50aWZ5IGtleXMuXG4gICAgICAgIFxuICAgICAgICBJZiB0aGVyZSdzIGEga2V5IGlkZW50aWZpZXIgbWlzc2luZywgeW91IGNhbiBhZGQgeW91ciBvd24gYnkgZGVmaW5pbmdcbiAgICAgICAgYSBwbGFpbiBvYmplY3QgbGl0ZXJhbCB3aXRoIGEga2MgcHJvcGVydHkgZm9yIHRoZSBrZXljb2RlXG4gICAgICAgIGFuZCBhbiBvcHRpb25hbCB3aGljaCBwcm9wZXJ0eSBmb3IgdGhlIGV2ZW50IHR5cGUuXG4gICAgICAgIFxuICAgICAgICBcbiAgICBQYXJhbWV0ZXJzXG4gICAgLS0tLS0tLS0tLVxuICAgICAgICBcbiAgICAgICAgMS4gYXJnczpcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgW09iamVjdF0gQW4gb2JqZWN0IHRvIGNvbmZpZ3VyZSB0aGUgaW5zdGFuY2UncyBiZWhhdmlvdXIuXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEhhcyB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAqIGVsZW1lbnQ6IFxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgW0RPTUVsZW1lbnRdIFRoZSBIVE1MIGVsZW1lbnQgdG8gYmluZCB0aGUgbGlzdGVuZXJzIHRvLiBcbiAgICAgICAgICAgICAgICAgICAgRGVmYXVsdDogd2luZG93XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgKiBsb2c6XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIFtCb29sZWFuXSBMb2cgdGhlIGNhcHR1cmVkIGV2ZW50cyB0byB0aGUgY29uc29sZT9cbiAgICAgICAgICAgICAgICAgICAgRGVmYXVsdDogZmFsc2UuXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBcbiAgICBQcm9wZXJ0aWVzXG4gICAgLS0tLS0tLS0tLVxuICAgICAgICBcbiAgICAgICAgKiBrZXlzOlxuICAgICAgICAgICAgXG4gICAgICAgICAgICBbT2JqZWN0XSBBbiBvYmplY3Qgd2l0aCAnY29uc3RhbnRzJyBmb3IgZWFzaWVyIGtleSBpZGVudGlmaWNhdGlvbi5cbiAgICAgICAgICAgIFRoZSBwcm9wZXJ0eSBuYW1lcyBhcmUgdGhlIG5hbWVzIG9mIHRoZSBrZXlzIGFuZCB0aGUgdmFsdWVzXG4gICAgICAgICAgICBhcmUgb2JqZWN0cyB3aXRoIGEgXCJrY1wiIHByb3BlcnR5IGZvciB0aGUgS2V5Q29kZSBhbmQgb3B0aW9uYWxseVxuICAgICAgICAgICAgYSBcIndoaWNoXCIgcHJvcGVydHkgZm9yIHRoZSBldmVudCB0eXBlLlxuICAgICAgICAgICAgXG4gICAgICAgICAgICBUaGUgcHJvcGVydHkgbmFtZXMgYXJlIGFsbCBVUFBFUkNBU0UuXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIEV4YW1wbGVzOlxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICogU1BBQ0VcbiAgICAgICAgICAgICAgICAqIEVOVEVSXG4gICAgICAgICAgICAgICAgKiBUQUJcbiAgICAgICAgICAgICAgICAqIENUUkxcbiAgICAgICAgICAgICAgICAqIEFMVFxuICAgICAgICAgICAgICAgICogU0hJRlRcbiAgICAgICAgICAgICAgICAqIExFRlRfQVJST1csIFJJR0hUX0FSUk9XLCBVUF9BUlJPVywgRE9XTl9BUlJPV1xuICAgICAgICAgICAgICAgICogQSB0byBaXG4gICAgICAgICAgICAgICAgKiBOVU1fMCB0byBOVU1fOVxuICAgICAgICAgICAgICAgICogTlVNUEFEXzAgdG8gTlVNUEFEXzlcbiAgICAgICAgICAgICAgICAqIEYxIHRvIEYxMlxuICAgICAgICAgICAgICAgICogQURELCBTVUJTVFJBQ1QsIE1VTFRJUExZLCBESVZJREUsIEVRVUFMU1xuICAgICAgICAgICAgICAgICogUEVSSU9EXG4gICAgICAgICAgICAgICAgKiBDT01NQVxuICAgICAgICAgICAgICAgIFxuKi9cbmZ1bmN0aW9uIEtleXMgKGFyZ3MpIHtcbiAgICBcbiAgICBhcmdzID0gYXJncyB8fCB7fTtcbiAgICBcbiAgICB0aGlzLmtleXMgPSB7fTtcbiAgICB0aGlzLmtleXMuQkFDS1NQQUNFICAgICA9IHtrYzogICA4fTtcbiAgICB0aGlzLmtleXMuVEFCICAgICAgICAgICA9IHtrYzogICA5fTtcbiAgICB0aGlzLmtleXMuRU5URVIgICAgICAgICA9IHtrYzogIDEzLCB3aGljaDogMTN9O1xuICAgIHRoaXMua2V5cy5TSElGVCAgICAgICAgID0ge2tjOiAgMTZ9O1xuICAgIHRoaXMua2V5cy5DVFJMICAgICAgICAgID0ge2tjOiAgMTd9O1xuICAgIHRoaXMua2V5cy5BTFQgICAgICAgICAgID0ge2tjOiAgMTh9O1xuICAgIHRoaXMua2V5cy5QQVVTRSAgICAgICAgID0ge2tjOiAgMTl9O1xuICAgIHRoaXMua2V5cy5DQVBTX0xPQ0sgICAgID0ge2tjOiAgMjB9O1xuICAgIHRoaXMua2V5cy5FU0NBUEUgICAgICAgID0ge2tjOiAgMjd9O1xuICAgIHRoaXMua2V5cy5TUEFDRSAgICAgICAgID0ge2tjOiAgMzJ9O1xuICAgIHRoaXMua2V5cy5QQUdFX1VQICAgICAgID0ge2tjOiAgMzN9O1xuICAgIHRoaXMua2V5cy5QQUdFX0RPV04gICAgID0ge2tjOiAgMjB9O1xuICAgIHRoaXMua2V5cy5FTkQgICAgICAgICAgID0ge2tjOiAgMjB9O1xuICAgIHRoaXMua2V5cy5IT01FICAgICAgICAgID0ge2tjOiAgMjB9O1xuICAgIHRoaXMua2V5cy5MRUZUX0FSUk9XICAgID0ge2tjOiAgMzd9O1xuICAgIHRoaXMua2V5cy5VUF9BUlJPVyAgICAgID0ge2tjOiAgMzh9O1xuICAgIHRoaXMua2V5cy5SSUdIVF9BUlJPVyAgID0ge2tjOiAgMzl9O1xuICAgIHRoaXMua2V5cy5ET1dOX0FSUk9XICAgID0ge2tjOiAgNDB9O1xuICAgIHRoaXMua2V5cy5JTlNFUlQgICAgICAgID0ge2tjOiAgNDV9O1xuICAgIHRoaXMua2V5cy5ERUxFVEUgICAgICAgID0ge2tjOiAgNDZ9O1xuICAgIHRoaXMua2V5cy5OVU1fMCAgICAgICAgID0ge2tjOiAgNDh9O1xuICAgIHRoaXMua2V5cy5OVU1fMSAgICAgICAgID0ge2tjOiAgNDl9O1xuICAgIHRoaXMua2V5cy5OVU1fMiAgICAgICAgID0ge2tjOiAgNTB9O1xuICAgIHRoaXMua2V5cy5OVU1fMyAgICAgICAgID0ge2tjOiAgNTF9O1xuICAgIHRoaXMua2V5cy5OVU1fNCAgICAgICAgID0ge2tjOiAgNTJ9O1xuICAgIHRoaXMua2V5cy5OVU1fNSAgICAgICAgID0ge2tjOiAgNTN9O1xuICAgIHRoaXMua2V5cy5OVU1fNiAgICAgICAgID0ge2tjOiAgNTR9O1xuICAgIHRoaXMua2V5cy5OVU1fNyAgICAgICAgID0ge2tjOiAgNTV9O1xuICAgIHRoaXMua2V5cy5OVU1fOCAgICAgICAgID0ge2tjOiAgNTZ9O1xuICAgIHRoaXMua2V5cy5OVU1fOSAgICAgICAgID0ge2tjOiAgNTd9O1xuICAgIHRoaXMua2V5cy5BICAgICAgICAgICAgID0ge2tjOiAgNjV9O1xuICAgIHRoaXMua2V5cy5CICAgICAgICAgICAgID0ge2tjOiAgNjZ9O1xuICAgIHRoaXMua2V5cy5DICAgICAgICAgICAgID0ge2tjOiAgNjd9O1xuICAgIHRoaXMua2V5cy5EICAgICAgICAgICAgID0ge2tjOiAgNjh9O1xuICAgIHRoaXMua2V5cy5FICAgICAgICAgICAgID0ge2tjOiAgNjl9O1xuICAgIHRoaXMua2V5cy5GICAgICAgICAgICAgID0ge2tjOiAgNzB9O1xuICAgIHRoaXMua2V5cy5HICAgICAgICAgICAgID0ge2tjOiAgNzF9O1xuICAgIHRoaXMua2V5cy5IICAgICAgICAgICAgID0ge2tjOiAgNzJ9O1xuICAgIHRoaXMua2V5cy5JICAgICAgICAgICAgID0ge2tjOiAgNzN9O1xuICAgIHRoaXMua2V5cy5KICAgICAgICAgICAgID0ge2tjOiAgNzR9O1xuICAgIHRoaXMua2V5cy5LICAgICAgICAgICAgID0ge2tjOiAgNzV9O1xuICAgIHRoaXMua2V5cy5MICAgICAgICAgICAgID0ge2tjOiAgNzZ9O1xuICAgIHRoaXMua2V5cy5NICAgICAgICAgICAgID0ge2tjOiAgNzd9O1xuICAgIHRoaXMua2V5cy5OICAgICAgICAgICAgID0ge2tjOiAgNzh9O1xuICAgIHRoaXMua2V5cy5PICAgICAgICAgICAgID0ge2tjOiAgNzl9O1xuICAgIHRoaXMua2V5cy5QICAgICAgICAgICAgID0ge2tjOiAgODB9O1xuICAgIHRoaXMua2V5cy5RICAgICAgICAgICAgID0ge2tjOiAgODF9O1xuICAgIHRoaXMua2V5cy5SICAgICAgICAgICAgID0ge2tjOiAgODJ9O1xuICAgIHRoaXMua2V5cy5TICAgICAgICAgICAgID0ge2tjOiAgODN9O1xuICAgIHRoaXMua2V5cy5UICAgICAgICAgICAgID0ge2tjOiAgODR9O1xuICAgIHRoaXMua2V5cy5VICAgICAgICAgICAgID0ge2tjOiAgODV9O1xuICAgIHRoaXMua2V5cy5WICAgICAgICAgICAgID0ge2tjOiAgODZ9O1xuICAgIHRoaXMua2V5cy5XICAgICAgICAgICAgID0ge2tjOiAgODd9O1xuICAgIHRoaXMua2V5cy5YICAgICAgICAgICAgID0ge2tjOiAgODh9O1xuICAgIHRoaXMua2V5cy5ZICAgICAgICAgICAgID0ge2tjOiAgODl9O1xuICAgIHRoaXMua2V5cy5aICAgICAgICAgICAgID0ge2tjOiAgOTB9O1xuICAgIHRoaXMua2V5cy5MRUZUX1dJTiAgICAgID0ge2tjOiAgOTF9O1xuICAgIHRoaXMua2V5cy5SSUdIVF9XSU4gICAgID0ge2tjOiAgOTJ9O1xuICAgIHRoaXMua2V5cy5TRUxFQ1QgICAgICAgID0ge2tjOiAgOTN9O1xuICAgIHRoaXMua2V5cy5OVU1QQURfMCAgICAgID0ge2tjOiAgOTZ9O1xuICAgIHRoaXMua2V5cy5OVU1QQURfMSAgICAgID0ge2tjOiAgOTd9O1xuICAgIHRoaXMua2V5cy5OVU1QQURfMiAgICAgID0ge2tjOiAgOTh9O1xuICAgIHRoaXMua2V5cy5OVU1QQURfMyAgICAgID0ge2tjOiAgOTl9O1xuICAgIHRoaXMua2V5cy5OVU1QQURfNCAgICAgID0ge2tjOiAxMDB9O1xuICAgIHRoaXMua2V5cy5OVU1QQURfNSAgICAgID0ge2tjOiAxMDF9O1xuICAgIHRoaXMua2V5cy5OVU1QQURfNiAgICAgID0ge2tjOiAxMDJ9O1xuICAgIHRoaXMua2V5cy5OVU1QQURfNyAgICAgID0ge2tjOiAxMDN9O1xuICAgIHRoaXMua2V5cy5OVU1QQURfOCAgICAgID0ge2tjOiAxMDR9O1xuICAgIHRoaXMua2V5cy5OVU1QQURfOSAgICAgID0ge2tjOiAxMDV9O1xuICAgIHRoaXMua2V5cy5NVUxUSVBMWSAgICAgID0ge2tjOiAxMDZ9O1xuICAgIHRoaXMua2V5cy5BREQgICAgICAgICAgID0ge2tjOiAxMDd9O1xuICAgIHRoaXMua2V5cy5TVUJTVFJBQ1QgICAgID0ge2tjOiAxMDl9O1xuICAgIHRoaXMua2V5cy5ERUNJTUFMX1BPSU5UID0ge2tjOiAxMTB9O1xuICAgIHRoaXMua2V5cy5ESVZJREUgICAgICAgID0ge2tjOiAxMTF9O1xuICAgIHRoaXMua2V5cy5GMSAgICAgICAgICAgID0ge2tjOiAxMTJ9O1xuICAgIHRoaXMua2V5cy5GMiAgICAgICAgICAgID0ge2tjOiAxMTN9O1xuICAgIHRoaXMua2V5cy5GMyAgICAgICAgICAgID0ge2tjOiAxMTR9O1xuICAgIHRoaXMua2V5cy5GNCAgICAgICAgICAgID0ge2tjOiAxMTV9O1xuICAgIHRoaXMua2V5cy5GNSAgICAgICAgICAgID0ge2tjOiAxMTZ9O1xuICAgIHRoaXMua2V5cy5GNiAgICAgICAgICAgID0ge2tjOiAxMTd9O1xuICAgIHRoaXMua2V5cy5GNyAgICAgICAgICAgID0ge2tjOiAxMTh9O1xuICAgIHRoaXMua2V5cy5GOCAgICAgICAgICAgID0ge2tjOiAxMTl9O1xuICAgIHRoaXMua2V5cy5GOSAgICAgICAgICAgID0ge2tjOiAxMjB9O1xuICAgIHRoaXMua2V5cy5GMTAgICAgICAgICAgID0ge2tjOiAxMjF9O1xuICAgIHRoaXMua2V5cy5GMTEgICAgICAgICAgID0ge2tjOiAxMjJ9O1xuICAgIHRoaXMua2V5cy5GMTIgICAgICAgICAgID0ge2tjOiAxMjN9O1xuICAgIHRoaXMua2V5cy5OVU1fTE9DSyAgICAgID0ge2tjOiAxNDR9O1xuICAgIHRoaXMua2V5cy5TQ1JPTExfTE9DSyAgID0ge2tjOiAxNDV9O1xuICAgIHRoaXMua2V5cy5TRU1JX0NPTE9OICAgID0ge2tjOiAxODZ9O1xuICAgIHRoaXMua2V5cy5FUVVBTFMgICAgICAgID0ge2tjOiAxODd9O1xuICAgIHRoaXMua2V5cy5DT01NQSAgICAgICAgID0ge2tjOiAxODh9O1xuICAgIHRoaXMua2V5cy5EQVNIICAgICAgICAgID0ge2tjOiAxODl9O1xuICAgIHRoaXMua2V5cy5QRVJJT0QgICAgICAgID0ge2tjOiAxOTB9O1xuICAgIHRoaXMua2V5cy5TTEFTSCAgICAgICAgID0ge2tjOiAxOTF9O1xuICAgIHRoaXMua2V5cy5HUkFWRSAgICAgICAgID0ge2tjOiAxOTJ9O1xuICAgIHRoaXMua2V5cy5PUEVOX0JSQUNLRVQgID0ge2tjOiAyMTl9O1xuICAgIHRoaXMua2V5cy5CQUNLX1NMQVNIICAgID0ge2tjOiAyMjB9O1xuICAgIHRoaXMua2V5cy5DTE9TRV9CUkFDS0VUID0ge2tjOiAyMjF9O1xuICAgIHRoaXMua2V5cy5TSU5HTEVfUVVPVEUgID0ge2tjOiAyMjJ9O1xuICAgIFxuICAgIHRoaXMubGlzdGVuZXJzID0gW107XG4gICAgXG4gICAgdmFyIGF0dGFjaCwgXG4gICAgICAgIGNhcHR1cmUsXG4gICAgICAgIGNhcHR1cmVVcCxcbiAgICAgICAgY2FwdHVyZURvd24sXG4gICAgICAgIGNhcHR1cmVQcmVzcyxcbiAgICAgICAgZXhhbWluZUV2ZW50LFxuICAgICAgICBsb2dFdmVudHMgPSBhcmdzLmxvZyB8fCBmYWxzZSxcbiAgICAgICAgZWxlbWVudCA9IGFyZ3MuZWxlbWVudCB8fCB3aW5kb3csXG4gICAgICAgIHNlbGYgPSB0aGlzO1xuICAgIFxuICAgIGF0dGFjaCA9IGZ1bmN0aW9uKGVsZW0pIHtcbiAgICAgICAgXG4gICAgICAgIGlmIChlbGVtID09IG51bGwgfHwgdHlwZW9mIGVsZW0gPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKGVsZW0uYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBjYXB0dXJlVXAsIGZhbHNlKTtcbiAgICAgICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgY2FwdHVyZURvd24sIGZhbHNlKTtcbiAgICAgICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihcImtleXByZXNzXCIsIGNhcHR1cmVQcmVzcywgZmFsc2UpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAobG9nRXZlbnRzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZXhhbWluZUV2ZW50LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBleGFtaW5lRXZlbnQsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBleGFtaW5lRXZlbnQsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSBpZiAoZWxlbS5hdHRhY2hFdmVudCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBlbGVtLmF0dGFjaEV2ZW50KFwib25rZXl1cFwiLCBjYXB0dXJlVXApO1xuICAgICAgICAgICAgZWxlbS5hdHRhY2hFdmVudChcIm9ua2V5ZG93blwiLCBjYXB0dXJlRG93bik7XG4gICAgICAgICAgICBlbGVtLmF0dGFjaEV2ZW50KFwib25rZXlwcmVzc1wiLCBjYXB0dXJlUHJlc3MpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAobG9nRXZlbnRzID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgZWxlbS5hdHRhY2hFdmVudChcIm9ua2V5dXBcIiwgZXhhbWluZUV2ZW50KTtcbiAgICAgICAgICAgICAgICBlbGVtLmF0dGFjaEV2ZW50KFwib25rZXlkb3duXCIsIGV4YW1pbmVFdmVudCk7XG4gICAgICAgICAgICAgICAgZWxlbS5hdHRhY2hFdmVudChcIm9ua2V5cHJlc3NcIiwgZXhhbWluZUV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgXG4gICAgY2FwdHVyZSA9IGZ1bmN0aW9uIChldmVudCwgdHlwZSkge1xuICAgICAgICBcbiAgICAgICAgdmFyIGxlbiA9IHNlbGYubGlzdGVuZXJzLmxlbmd0aCwgY3VyLCBpLCBrYywgd2hpY2g7XG4gICAgICAgIFxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY3VyID0gc2VsZi5saXN0ZW5lcnNbaV07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY3VyID09ICd1bmRlZmluZWQnIHx8IGN1ci50eXBlICE9IHR5cGUpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY3VyLmtleSA9IGN1ci5rZXkgfHwge307XG4gICAgICAgICAgICBrYyA9IGN1ci5rZXkua2MgfHwgbnVsbDtcbiAgICAgICAgICAgIHdoaWNoID0gY3VyLmtleS53aGljaCB8fCBudWxsO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT0gd2hpY2ggfHwgZXZlbnQua2V5Q29kZSA9PSBrYykge1xuICAgICAgICAgICAgICAgIGN1ci5jYWxsYmFjayhldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFxuICAgIGNhcHR1cmVVcCA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBjYXB0dXJlKGV2ZW50LCBcInVwXCIpO1xuICAgIH07XG4gICAgXG4gICAgY2FwdHVyZURvd24gPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgY2FwdHVyZShldmVudCwgXCJkb3duXCIpO1xuICAgIH07XG4gICAgXG4gICAgY2FwdHVyZVByZXNzID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGNhcHR1cmUoZXZlbnQsIFwicHJlc3NcIik7XG4gICAgfTtcbiAgICBcbiAgICBleGFtaW5lRXZlbnQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudCk7XG4gICAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tY29uc29sZSAqL1xuICAgIH07XG4gICAgXG4gICAgYXR0YWNoKGVsZW1lbnQpO1xufVxuXG4vKipcbiAgICBcbiAgICBAbW9kdWxlIFdTRS5LZXlzXG4gICAgXG4gICAgW0Z1bmN0aW9uXSBXU0UuS2V5cy5hZGRMaXN0ZW5lclxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBcbiAgICAgICAgQmluZHMgYSBuZXcgY2FsbGJhY2sgdG8gYSBrZXkuXG4gICAgXG4gICAgUGFyYW1ldGVyc1xuICAgIC0tLS0tLS0tLS1cbiAgICAgICAgXG4gICAgICAgIDEuIGtleTpcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgW09iamVjdF0gT25lIG9mIHRoZSBXU0UuS2V5cyBwc2V1ZG8gY29uc3RhbnRzLlxuICAgICAgICAgICAgXG4gICAgICAgIDIuIGNhbGxiYWNrOlxuICAgICAgICAgICAgXG4gICAgICAgICAgICBbRnVuY3Rpb25dIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIG9uY2UgdGhlIGtleSBoYXMgYmVlbiBwcmVzc2VkLlxuICAgICAgICAgICAgXG4gICAgICAgIDMuIHR5cGU6IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBbU3RyaW5nXSBUaGUgZXZlbnQgdHlwZSB0byB1c2UuIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBPbmUgb2Y6XG4gICAgICAgIFxuICAgICAgICAgICAgICAgICogXCJ1cFwiICAgIGZvciBcImtleXVwXCIsXG4gICAgICAgICAgICAgICAgKiBcImRvd25cIiAgZm9yIFwia2V5ZG93blwiLFxuICAgICAgICAgICAgICAgICogXCJwcmVzc1wiIGZvciBcImtleXByZXNzXCJcbiAgICAgICAgXG4gICAgICAgICAgICBEZWZhdWx0OiBcInVwXCJcbiAgICAgICAgICAgIFxuICAgIEVycm9yc1xuICAgIC0tLS0tLVxuICAgICAgICAgICAgXG4gICAgICAgIFRocm93cyBhbiBFcnJvciB3aGVuIHRoZSB0eXBlIHBhcmFtZXRlciBpcyBub3QgcmVjb2duaXplZC5cbiAgICAgICAgICAgIFxuKi9cbktleXMucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24oa2V5LCBjYWxsYmFjaywgdHlwZSkge1xuICAgIFxuICAgIHR5cGUgPSB0eXBlIHx8IFwidXBcIjtcbiAgICBcbiAgICBpZiAodHlwZSAhPT0gXCJ1cFwiICYmIHR5cGUgIT09IFwiZG93blwiICYmIHR5cGUgIT09IFwicHJlc3NcIikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFdmVudCB0eXBlIG5vdCByZWNvZ25pemVkLlwiKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5saXN0ZW5lcnMucHVzaCh7XG4gICAgICAgIGtleToga2V5LFxuICAgICAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgICAgIHR5cGU6IHR5cGVcbiAgICB9KTtcbn07XG5cbi8qKlxuXG4gICAgQG1vZHVsZSBXU0UuS2V5c1xuXG4gICAgW0Z1bmN0aW9uXSBXU0UuS2V5cy5yZW1vdmVMaXN0ZW5lclxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgICAgICBSZW1vdmVzIHRoZSBldmVudCBsaXN0ZW5lcnMgZm9yIGEga2V5LlxuICAgICAgICBcblxuICAgIFBhcmFtZXRlcnNcbiAgICAtLS0tLS0tLS0tXG4gICAgXG4gICAgICAgIDEuIGtleTpcbiAgICAgICAgXG4gICAgICAgICAgICBbT2JqZWN0XSBPbmUgb2YgV1NFLktleXMgcHNldWRvIGNvbnN0YW50cy5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgXG4qL1xuS2V5cy5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiAoa2V5LCBjYWxsYmFjaywgdHlwZSkge1xuICAgIFxuICAgIHZhciBsZW4gPSB0aGlzLmxpc3RlbmVycy5sZW5ndGg7XG4gICAgdmFyIGN1cjtcbiAgICBcbiAgICB0eXBlID0gdHlwZSB8fCBudWxsO1xuICAgIFxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgXG4gICAgICAgIGN1ciA9IHRoaXMubGlzdGVuZXJzW2ldO1xuICAgICAgICBcbiAgICAgICAgaWYgKHR5cGUgIT09IG51bGwgJiYgY3VyLnR5cGUgIT0gdHlwZSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmICh0eXBlb2YgY3VyICE9PSAndW5kZWZpbmVkJyAmJiBjdXIua2V5ID09PSBrZXkgJiYgY3VyLmNhbGxiYWNrID09PSBjYWxsYmFjaykge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMubGlzdGVuZXJzW2ldO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuLyoqIFxuIFxuICAgIEBtb2R1bGUgV1NFLktleXNcblxuICAgIFtGdW5jdGlvbl0gV1NFLktleXMuZm9yQWxsXG4gICAgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBcbiAgICAgICAgRXhlY3V0ZXMgYSBjYWxsYmFjayBmb3IgYW55IGtleSBldmVudCB0aGF0IG9jY3Vycy5cbiAgICBcbiAgICBcbiAgICBQYXJhbWV0ZXJzXG4gICAgLS0tLS0tLS0tLVxuICAgIFxuICAgICAgICAxLiBjYWxsYmFjazpcbiAgICAgICAgXG4gICAgICAgICAgICBbRnVuY3Rpb25dIEEgY2FsbGJhY2sgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWQgd2hlbiBhIGtleWJvYXJkXG4gICAgICAgICAgICBldmVudCBvY2N1cnMuXG4gICAgICAgICAgICBcbiAgICAgICAgMi4gdHlwZTogXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFtTdHJpbmddIFRoZSBrZXlib2FyZCBldmVudCB0eXBlIHRvIHVzZS4gXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIE9uZSBvZjpcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICogXCJ1cFwiICAgIGZvciBcImtleXVwXCIsXG4gICAgICAgICAgICAgICAgKiBcImRvd25cIiAgZm9yIFwia2V5ZG93blwiLFxuICAgICAgICAgICAgICAgICogXCJwcmVzc1wiIGZvciBcImtleXByZXNzXCJcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgRGVmYXVsdDogXCJ1cFwiXG5cbiAgICBFcnJvcnNcbiAgICAtLS0tLS1cbiAgICBcbiAgICAgICAgVGhyb3dzIGFuIEVycm9yIHdoZW4gdGhlIHR5cGUgcGFyYW1ldGVyIGlzIG5vdCByZWNvZ25pemVkLlxuICAgICAgICBcblxuKi9cbktleXMucHJvdG90eXBlLmZvckFsbCA9IGZ1bmN0aW9uIChjYWxsYmFjaywgdHlwZSkge1xuICAgIFxuICAgIHR5cGUgPSB0eXBlIHx8IFwidXBcIjtcbiAgICBcbiAgICBpZiAodHlwZSAhPT0gXCJ1cFwiICYmIHR5cGUgIT09IFwiZG93blwiICYmIHR5cGUgIT09IFwicHJlc3NcIikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFdmVudCB0eXBlIG5vdCByZWNvZ25pemVkLlwiKTtcbiAgICB9XG4gICAgXG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMua2V5cykge1xuICAgICAgICBcbiAgICAgICAgaWYgKCF0aGlzLmtleXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuYWRkTGlzdGVuZXIodGhpcy5rZXlzW2tleV0sIGNhbGxiYWNrLCB0eXBlKTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtleXM7XG4iLCJcbnZhciBEYXRhQnVzID0gcmVxdWlyZShcImRhdGFidXNcIik7XG52YXIgdHJhbnNmb3JtID0gcmVxdWlyZShcInRyYW5zZm9ybS1qc1wiKS50cmFuc2Zvcm07XG5cbmZ1bmN0aW9uIExvYWRpbmdTY3JlZW4gKCkge1xuICAgIFxuICAgIERhdGFCdXMuaW5qZWN0KHRoaXMpO1xuICAgIFxuICAgIHRoaXMuX2xvYWRpbmcgPSAwO1xuICAgIHRoaXMuX2xvYWRlZCA9IDA7XG4gICAgdGhpcy5fbWF4ID0gMDtcbiAgICB0aGlzLl9maW5pc2hlZCA9IGZhbHNlO1xuICAgIFxuICAgIHRoaXMuX3RlbXBsYXRlID0gJycgKyBcbiAgICAgICAgJzxkaXYgY2xhc3M9XCJjb250YWluZXJcIj4nICsgXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImxvZ29cIj4nICtcbiAgICAgICAgICAgICAgICAnPGltZyBzcmM9XCJhc3NldHMvaW1hZ2VzL2xvZ28ucG5nXCInICtcbiAgICAgICAgICAgICAgICAgICAgJ29uZXJyb3I9XCJ0aGlzLnN0eWxlLmRpc3BsYXk9XFwnbm9uZVxcJ1wiLz4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiaGVhZGluZ1wiPicgKyBcbiAgICAgICAgICAgICAgICAnPHNwYW4gaWQ9XCJXU0VMb2FkaW5nU2NyZWVuUGVyY2VudGFnZVwiPnskcHJvZ3Jlc3N9JTwvc3Bhbj4nICsgXG4gICAgICAgICAgICAgICAgJ0xvYWRpbmcuLi4nICsgXG4gICAgICAgICAgICAnPC9kaXY+JyArIFxuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJwcm9ncmVzc0JhclwiPicgKyBcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInByb2dyZXNzXCIgaWQ9XCJXU0VMb2FkaW5nU2NyZWVuUHJvZ3Jlc3NcIiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ3N0eWxlPVwid2lkdGg6IHskcHJvZ3Jlc3N9JTtcIj4nICsgXG4gICAgICAgICAgICAgICAgJzwvZGl2PicgKyBcbiAgICAgICAgICAgICc8L2Rpdj4nICsgXG4gICAgICAgICc8L2Rpdj4nO1xuICAgIFxuICAgIHRoaXMuX2NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgdGhpcy5fY29udGFpbmVyLnNldEF0dHJpYnV0ZShcImlkXCIsIFwiV1NFTG9hZGluZ1NjcmVlblwiKTtcbiAgICB0aGlzLl9jb250YWluZXIuc3R5bGUuekluZGV4ID0gMTAwMDA7XG4gICAgdGhpcy5fY29udGFpbmVyLnN0eWxlLndpZHRoID0gXCIxMDAlXCI7XG4gICAgdGhpcy5fY29udGFpbmVyLnN0eWxlLmhlaWdodCA9IFwiMTAwJVwiO1xuICAgIFxufVxuXG5Mb2FkaW5nU2NyZWVuLnByb3RvdHlwZS5zZXRUZW1wbGF0ZSA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSkge1xuICAgIHRoaXMuX3RlbXBsYXRlID0gdGVtcGxhdGU7XG59O1xuXG5Mb2FkaW5nU2NyZWVuLnByb3RvdHlwZS5hZGRJdGVtID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIGlmICh0aGlzLl9maW5pc2hlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIHRoaXMuX2xvYWRpbmcgKz0gMTtcbiAgICB0aGlzLl9tYXggKz0gMTtcbiAgICBcbiAgICB0aGlzLnVwZGF0ZSgpO1xufTtcblxuTG9hZGluZ1NjcmVlbi5wcm90b3R5cGUuY291bnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX21heDtcbn07XG5cbkxvYWRpbmdTY3JlZW4ucHJvdG90eXBlLml0ZW1Mb2FkZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgaWYgKHRoaXMuX2ZpbmlzaGVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMuX2xvYWRlZCA9PT0gdGhpcy5fbWF4KSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5fbG9hZGluZyAtPSAxO1xuICAgIHRoaXMuX2xvYWRlZCArPSAxO1xuICAgIFxuICAgIGlmICh0aGlzLl9sb2FkZWQgPT09IHRoaXMuX21heCkge1xuICAgICAgICB0aGlzLl9maW5pc2hlZCA9IHRydWU7XG4gICAgICAgIHRoaXMudHJpZ2dlcihcImZpbmlzaGVkXCIpO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLnVwZGF0ZSgpO1xufTtcblxuTG9hZGluZ1NjcmVlbi5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciBwcm9ncmVzcztcbiAgICBcbiAgICBpZiAodGhpcy5fbG9hZGVkID4gdGhpcy5fbWF4KSB7XG4gICAgICAgIHRoaXMuX2xvYWRlZCA9IHRoaXMuX21heDtcbiAgICB9XG4gICAgXG4gICAgcHJvZ3Jlc3MgPSBwYXJzZUludCgodGhpcy5fbG9hZGVkIC8gdGhpcy5fbWF4KSAqIDEwMCwgMTApO1xuICAgIFxuICAgIGlmICh0aGlzLl9tYXggPCAxKSB7XG4gICAgICAgIHByb2dyZXNzID0gMDtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5fY29udGFpbmVyLmlubmVySFRNTCA9IHJlbmRlcih0aGlzLl90ZW1wbGF0ZSwge1xuICAgICAgICBhbGw6IHRoaXMuX21heCxcbiAgICAgICAgcmVtYWluaW5nOiB0aGlzLl9tYXggLSB0aGlzLl9sb2FkZWQsXG4gICAgICAgIGxvYWRlZDogdGhpcy5fbG9hZGVkLFxuICAgICAgICBwcm9ncmVzczogcHJvZ3Jlc3NcbiAgICB9KTtcbiAgICBcbn07XG5cbkxvYWRpbmdTY3JlZW4ucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAocGFyZW50KSB7XG4gICAgdGhpcy5fY29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLl9jb250YWluZXIpO1xuICAgIHRoaXMudXBkYXRlKCk7XG59O1xuXG5Mb2FkaW5nU2NyZWVuLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBcbiAgICBmdW5jdGlvbiB2YWxGbiAodikge1xuICAgICAgICBzZWxmLl9jb250YWluZXIuc3R5bGUub3BhY2l0eSA9IHY7XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGZpbmlzaEZuICgpIHtcbiAgICAgICAgc2VsZi5fY29udGFpbmVyLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgc2VsZi5fY29udGFpbmVyLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2VsZi5fY29udGFpbmVyKTtcbiAgICB9XG4gICAgXG4gICAgdHJhbnNmb3JtKDEsIDAsIHZhbEZuLCB7XG4gICAgICAgIGR1cmF0aW9uOiA1MDAsXG4gICAgICAgIG9uRmluaXNoOiBmaW5pc2hGblxuICAgIH0pO1xuICAgIFxuICAgIHRoaXMuX2NvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG59O1xuXG5mdW5jdGlvbiByZW5kZXIgKHRlbXBsYXRlLCB2YXJzKSB7XG4gICAgXG4gICAgZm9yICh2YXIga2V5IGluIHZhcnMpIHtcbiAgICAgICAgdGVtcGxhdGUgPSBpbnNlcnRWYXIodGVtcGxhdGUsIGtleSwgdmFyc1trZXldKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHRlbXBsYXRlO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRWYXIgKHRlbXBsYXRlLCBuYW1lLCB2YWx1ZSkge1xuICAgIHJldHVybiAoXCJcIiArIHRlbXBsYXRlKS5zcGxpdChcInskXCIgKyBuYW1lICsgXCJ9XCIpLmpvaW4oXCJcIiArIHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBMb2FkaW5nU2NyZWVuO1xuIiwiXG52YXIgd2FybiA9IHJlcXVpcmUoXCIuL3Rvb2xzL3Rvb2xzXCIpLndhcm47XG52YXIgY29tbWFuZHMgPSByZXF1aXJlKFwiLi9jb21tYW5kc1wiKTtcbnZhciBmdW5jdGlvbnMgPSByZXF1aXJlKFwiLi9mdW5jdGlvbnNcIik7XG5cbmZ1bmN0aW9uIFRyaWdnZXIgKHRyaWdnZXIsIGludGVycHJldGVyKSB7XG4gICAgXG4gICAgdmFyIHNlbGYgPSB0aGlzLCBmbjtcbiAgICBcbiAgICB0aGlzLm5hbWUgPSB0cmlnZ2VyLmdldEF0dHJpYnV0ZShcIm5hbWVcIikgfHwgbnVsbDtcbiAgICB0aGlzLmV2ZW50ID0gdHJpZ2dlci5nZXRBdHRyaWJ1dGUoXCJldmVudFwiKSB8fCBudWxsO1xuICAgIHRoaXMuc3BlY2lhbCA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKFwic3BlY2lhbFwiKSB8fCBudWxsO1xuICAgIHRoaXMuZm5OYW1lID0gdHJpZ2dlci5nZXRBdHRyaWJ1dGUoXCJmdW5jdGlvblwiKSB8fCBudWxsO1xuICAgIHRoaXMuc2NlbmUgPSB0cmlnZ2VyLmdldEF0dHJpYnV0ZShcInNjZW5lXCIpIHx8IG51bGw7XG4gICAgdGhpcy5pbnRlcnByZXRlciA9IGludGVycHJldGVyO1xuICAgIHRoaXMuaXNTdWJzY3JpYmVkID0gZmFsc2U7XG4gICAgXG4gICAgaWYgKHRoaXMubmFtZSA9PT0gbnVsbCkge1xuICAgICAgICB3YXJuKGludGVycHJldGVyLmJ1cywgXCJObyAnbmFtZScgYXR0cmlidXRlIHNwZWNpZmllZCBvbiAndHJpZ2dlcicgZWxlbWVudC5cIiwgdHJpZ2dlcik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMuZXZlbnQgPT09IG51bGwpIHtcbiAgICAgICAgXG4gICAgICAgIHdhcm4oaW50ZXJwcmV0ZXIuYnVzLCBcIk5vICdldmVudCcgYXR0cmlidXRlIHNwZWNpZmllZCBvbiAndHJpZ2dlcicgZWxlbWVudCAnXCIgK1xuICAgICAgICAgICAgdGhpcy5uYW1lICsgXCInLlwiLCB0cmlnZ2VyKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMuc3BlY2lhbCA9PT0gbnVsbCAmJiB0aGlzLmZuTmFtZSA9PT0gbnVsbCAmJiB0aGlzLnNjZW5lID09PSBudWxsKSB7XG4gICAgICAgIFxuICAgICAgICB3YXJuKGludGVycHJldGVyLmJ1cywgXCJObyBzdWl0YWJsZSBhY3Rpb24gb3IgZnVuY3Rpb24gZm91bmQgZm9yIHRyaWdnZXIgZWxlbWVudCAnXCIgK1xuICAgICAgICAgICAgdGhpcy5uYW1lICsgXCInLlwiLCB0cmlnZ2VyKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMuc2NlbmUpIHtcbiAgICAgICAgXG4gICAgICAgIGZuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY29tbWFuZHMuc3ViKHRyaWdnZXIsIGludGVycHJldGVyKTtcbiAgICAgICAgICAgIGludGVycHJldGVyLmluZGV4ID0gMDtcbiAgICAgICAgICAgIGludGVycHJldGVyLmN1cnJlbnRFbGVtZW50ID0gMDtcbiAgICAgICAgICAgIGludGVycHJldGVyLm5leHQoKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5pc0tleUV2ZW50ID0gZmFsc2U7XG4gICAgdGhpcy5rZXkgPSBudWxsO1xuICAgIFxuICAgIGlmICh0aGlzLnNwZWNpYWwgIT09IG51bGwgJiYgdGhpcy5zcGVjaWFsICE9PSBcIm5leHRcIikge1xuICAgICAgICBcbiAgICAgICAgd2FybihpbnRlcnByZXRlci5idXMsIFwiVW5rbm93biBzcGVjaWFsIHNwZWNpZmllZCBvbiB0cmlnZ2VyIGVsZW1lbnQgJ1wiICtcbiAgICAgICAgICAgIHRoaXMubmFtZSArIFwiJy5cIiwgdHJpZ2dlcik7XG4gICAgICAgIFxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGlmICh0aGlzLnNwZWNpYWwgPT09IFwibmV4dFwiKSB7XG4gICAgICAgIFxuICAgICAgICBmbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHNlbGYuaW50ZXJwcmV0ZXIuc3RhdGUgPT09IFwicGF1c2VcIiB8fCBzZWxmLmludGVycHJldGVyLndhaXRDb3VudGVyID4gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2VsZi5pbnRlcnByZXRlci5uZXh0KCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIGlmICh0aGlzLmZuTmFtZSAhPT0gbnVsbCkge1xuICAgICAgICBcbiAgICAgICAgaWYgKHR5cGVvZiBmdW5jdGlvbnNbdGhpcy5mbk5hbWVdICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgd2FybihpbnRlcnByZXRlci5idXMsIFwiVW5rbm93biBmdW5jdGlvbiBzcGVjaWZpZWQgb24gdHJpZ2dlciBlbGVtZW50ICdcIiArXG4gICAgICAgICAgICAgICAgdGhpcy5uYW1lICsgXCInLlwiLCB0cmlnZ2VyKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBmbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uc1tzZWxmLmZuTmFtZV0oc2VsZi5pbnRlcnByZXRlciwgdHJpZ2dlcik7XG4gICAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIHN3aXRjaCAodGhpcy5ldmVudCkge1xuICAgICAgICBcbiAgICAgICAgY2FzZSBcImtleXVwXCI6XG4gICAgICAgIGNhc2UgXCJrZXlkb3duXCI6XG4gICAgICAgIGNhc2UgXCJrZXlwcmVzc1wiOlxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmlzS2V5RXZlbnQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5rZXkgPSB0cmlnZ2VyLmdldEF0dHJpYnV0ZShcImtleVwiKSB8fCBudWxsO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodGhpcy5rZXkgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB3YXJuKGludGVycHJldGVyLmJ1cywgXCJObyAna2V5JyBhdHRyaWJ1dGUgc3BlY2lmaWVkIG9uIHRyaWdnZXIgZWxlbWVudCAnXCIgK1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5hbWUgKyBcIicuXCIsIHRyaWdnZXIpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgIHR5cGVvZiBpbnRlcnByZXRlci5nYW1lLmtleXMua2V5c1t0aGlzLmtleV0gPT09IFwidW5kZWZpbmVkXCIgfHxcbiAgICAgICAgICAgICAgICBpbnRlcnByZXRlci5nYW1lLmtleXMua2V5c1t0aGlzLmtleV0gPT09IG51bGxcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHdhcm4oaW50ZXJwcmV0ZXIuYnVzLCBcIlVua25vd24ga2V5ICdcIiArIHRoaXMua2V5ICsgXCInIHNwZWNpZmllZCBvbiB0cmlnZ2VyIFwiICtcbiAgICAgICAgICAgICAgICAgICAgXCJlbGVtZW50ICdcIiArIHRoaXMubmFtZSArIFwiJy5cIiwgdHJpZ2dlcik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmZuID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5rZXlzW3NlbGYua2V5XS5rYyAhPT0gZGF0YS5ldmVudC5rZXlDb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGludGVycHJldGVyLmtleXNEaXNhYmxlZCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB0aGlzLmZuID0gZm47XG4gICAgfVxufVxuXG5UcmlnZ2VyLnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICBpZiAodGhpcy5pc1N1YnNjcmliZWQgPT09IHRydWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLmludGVycHJldGVyLmJ1cy5zdWJzY3JpYmUodGhpcy5mbiwgdGhpcy5ldmVudCk7XG4gICAgdGhpcy5pc1N1YnNjcmliZWQgPSB0cnVlO1xufTtcblxuVHJpZ2dlci5wcm90b3R5cGUuZGVhY3RpdmF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICBpZiAodGhpcy5pc1N1YnNjcmliZWQgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5pbnRlcnByZXRlci5idXMudW5zdWJzY3JpYmUodGhpcy5mbiwgdGhpcy5ldmVudCk7XG4gICAgdGhpcy5pc1N1YnNjcmliZWQgPSBmYWxzZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHJpZ2dlcjtcbiIsIlxudmFyIEF1ZGlvID0gcmVxdWlyZShcIi4vYXNzZXRzL0F1ZGlvXCIpO1xudmFyIEJhY2tncm91bmQgPSByZXF1aXJlKFwiLi9hc3NldHMvQmFja2dyb3VuZFwiKTtcbnZhciBDaGFyYWN0ZXIgPSByZXF1aXJlKFwiLi9hc3NldHMvQ2hhcmFjdGVyXCIpO1xudmFyIENvbXBvc2l0ZSA9IHJlcXVpcmUoXCIuL2Fzc2V0cy9Db21wb3NpdGVcIik7XG52YXIgQ3VydGFpbiA9IHJlcXVpcmUoXCIuL2Fzc2V0cy9DdXJ0YWluXCIpO1xudmFyIEltYWdlcGFjayA9IHJlcXVpcmUoXCIuL2Fzc2V0cy9JbWFnZXBhY2tcIik7XG52YXIgVGV4dGJveCA9IHJlcXVpcmUoXCIuL2Fzc2V0cy9UZXh0Ym94XCIpO1xuXG52YXIgYXNzZXRzID0ge1xuICAgIEF1ZGlvOiBBdWRpbyxcbiAgICBCYWNrZ3JvdW5kOiBCYWNrZ3JvdW5kLFxuICAgIENoYXJhY3RlcjogQ2hhcmFjdGVyLFxuICAgIEN1cnRhaW46IEN1cnRhaW4sXG4gICAgSW1hZ2VwYWNrOiBJbWFnZXBhY2ssXG4gICAgVGV4dGJveDogVGV4dGJveCxcbiAgICBDb21wb3NpdGU6IENvbXBvc2l0ZVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBhc3NldHM7XG4iLCIvKiBnbG9iYWwgdXNpbmcgKi9cblxudmFyIHRvb2xzID0gcmVxdWlyZShcIi4uL3Rvb2xzL3Rvb2xzXCIpO1xudmFyIEhvd2wgPSByZXF1aXJlKFwiaG93bGVyXCIpLkhvd2w7XG5cbnZhciB3YXJuID0gdG9vbHMud2FybjtcbnZhciB0cnV0aHkgPSB0b29scy50cnV0aHk7XG5cbi8qKlxuICogQ29uc3RydWN0b3IgZm9yIHRoZSA8YXVkaW8+IGFzc2V0LlxuICogXG4gKiBAcGFyYW0gYXNzZXQgW1hNTCBET00gRWxlbWVudF0gVGhlIGFzc2V0IGRlZmluaXRpb24uXG4gKiBAcGFyYW0gaW50ZXJwcmV0ZXIgW29iamVjdF0gVGhlIGludGVycHJldGVyIGluc3RhbmNlLlxuICogQHRyaWdnZXIgd3NlLmludGVycHJldGVyLndhcm5pbmdAaW50ZXJwcmV0ZXJcbiAqIEB0cmlnZ2VyIHdzZS5hc3NldHMuYXVkaW8uY29uc3RydWN0b3JAaW50ZXJwcmV0ZXJcbiAqL1xuZnVuY3Rpb24gQXVkaW8gKGFzc2V0LCBpbnRlcnByZXRlcikge1xuICAgIFxuICAgIHZhciBzb3VyY2VzLCBpLCBsZW4sIGosIGpsZW4sIGN1cnJlbnQsIHRyYWNrLCB0cmFja05hbWU7XG4gICAgdmFyIHRyYWNrRmlsZXMsIGhyZWYsIHR5cGUsIHNvdXJjZSwgdHJhY2tzLCBidXMsIHRyYWNrU2V0dGluZ3M7XG4gICAgXG4gICAgYnVzID0gaW50ZXJwcmV0ZXIuYnVzO1xuICAgIFxuICAgIHRoaXMuaW50ZXJwcmV0ZXIgPSBpbnRlcnByZXRlcjtcbiAgICB0aGlzLmJ1cyA9IGJ1cztcbiAgICB0aGlzLm5hbWUgPSBhc3NldC5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpO1xuICAgIHRoaXMudHJhY2tzID0ge307XG4gICAgdGhpcy5hdXRvcGF1c2UgPSB0cnV0aHkoYXNzZXQuZ2V0QXR0cmlidXRlKFwiYXV0b3BhdXNlXCIpKTtcbiAgICB0aGlzLmxvb3AgPSB0cnV0aHkoYXNzZXQuZ2V0QXR0cmlidXRlKFwibG9vcFwiKSk7XG4gICAgdGhpcy5mYWRlID0gdHJ1dGh5KGFzc2V0LmdldEF0dHJpYnV0ZShcImZhZGVcIikpO1xuICAgIHRoaXMuZmFkZWluRHVyYXRpb24gPSBwYXJzZUludChhc3NldC5nZXRBdHRyaWJ1dGUoXCJmYWRlaW5cIikpIHx8IDEwMDA7XG4gICAgdGhpcy5mYWRlb3V0RHVyYXRpb24gPSBwYXJzZUludChhc3NldC5nZXRBdHRyaWJ1dGUoXCJmYWRlb3V0XCIpKSB8fCAxMDAwO1xuICAgIHRoaXMuX3BsYXlpbmcgPSBmYWxzZTtcbiAgICBcbiAgICB0cmFja3MgPSBhc3NldC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInRyYWNrXCIpO1xuICAgIGxlbiA9IHRyYWNrcy5sZW5ndGg7XG4gICAgXG4gICAgaWYgKGxlbiA8IDEpIHtcbiAgICAgICAgXG4gICAgICAgIHdhcm4odGhpcy5idXMsIFwiTm8gdHJhY2tzIGRlZmluZWQgZm9yIGF1ZGlvIGVsZW1lbnQgJ1wiICsgdGhpcy5uYW1lICsgXCInLlwiLCBhc3NldCk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZG9OZXh0OiB0cnVlXG4gICAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIC8vIGNoZWNrIGFsbCBzb3VyY2VzIGFuZCBjcmVhdGUgSG93bCBpbnN0YW5jZXM6XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgIFxuICAgICAgICBjdXJyZW50ID0gdHJhY2tzW2ldO1xuICAgICAgICBcbiAgICAgICAgdHJhY2tOYW1lID0gY3VycmVudC5nZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiKTtcbiAgICAgICAgXG4gICAgICAgIGlmICh0cmFja05hbWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgd2Fybih0aGlzLmJ1cywgXCJObyB0aXRsZSBkZWZpbmVkIGZvciB0cmFjayAnXCIgKyB0cmFja05hbWUgKyBcbiAgICAgICAgICAgICAgICBcIicgaW4gYXVkaW8gZWxlbWVudCAnXCIgKyB0aGlzLm5hbWUgKyBcIicuXCIsIGFzc2V0KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHNvdXJjZXMgPSBjdXJyZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic291cmNlXCIpO1xuICAgICAgICBqbGVuID0gc291cmNlcy5sZW5ndGg7XG4gICAgICAgIFxuICAgICAgICBpZiAoamxlbiA8IDEpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgd2Fybih0aGlzLmJ1cywgXCJObyBzb3VyY2VzIGRlZmluZWQgZm9yIHRyYWNrICdcIiArIHRyYWNrTmFtZSArXG4gICAgICAgICAgICAgICAgXCInIGluIGF1ZGlvIGVsZW1lbnQgJ1wiICsgdGhpcy5uYW1lICsgXCInLlwiLCBhc3NldCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0cmFja1NldHRpbmdzID0ge1xuICAgICAgICAgICAgdXJsczogW10sXG4gICAgICAgICAgICBhdXRvcGxheTogZmFsc2UsXG4gICAgICAgICAgICBsb29wOiB0aGlzLmxvb3AgfHwgZmFsc2UsXG4gICAgICAgICAgICBvbmxvYWQ6IHRoaXMuYnVzLnRyaWdnZXIuYmluZCh0aGlzLmJ1cywgXCJ3c2UuYXNzZXRzLmxvYWRpbmcuZGVjcmVhc2VcIilcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIHRyYWNrRmlsZXMgPSB7fTtcbiAgICAgICAgXG4gICAgICAgIGZvciAoaiA9IDA7IGogPCBqbGVuOyBqICs9IDEpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc291cmNlID0gc291cmNlc1tqXTtcbiAgICAgICAgICAgIGhyZWYgPSBzb3VyY2UuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKTtcbiAgICAgICAgICAgIHR5cGUgPSBzb3VyY2UuZ2V0QXR0cmlidXRlKFwidHlwZVwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGhyZWYgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB3YXJuKHRoaXMuYnVzLCBcIk5vIGhyZWYgZGVmaW5lZCBmb3Igc291cmNlIGluIHRyYWNrICdcIiArXG4gICAgICAgICAgICAgICAgICAgIHRyYWNrTmFtZSArIFwiJyBpbiBhdWRpbyBlbGVtZW50ICdcIiArIHRoaXMubmFtZSArIFwiJy5cIiwgYXNzZXQpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHdhcm4odGhpcy5idXMsIFwiTm8gdHlwZSBkZWZpbmVkIGZvciBzb3VyY2UgaW4gdHJhY2sgJ1wiICsgXG4gICAgICAgICAgICAgICAgICAgIHRyYWNrTmFtZSArIFwiJyBpbiBhdWRpbyBlbGVtZW50ICdcIiArIHRoaXMubmFtZSArIFwiJy5cIiwgYXNzZXQpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0cmFja0ZpbGVzW3R5cGVdID0gaHJlZjtcbiAgICAgICAgICAgIHRyYWNrU2V0dGluZ3MudXJscy5wdXNoKGhyZWYpO1xuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuYnVzLnRyaWdnZXIoXCJ3c2UuYXNzZXRzLmxvYWRpbmcuaW5jcmVhc2VcIik7XG4gICAgICAgIFxuICAgICAgICB0cmFjayA9IG5ldyBIb3dsKHRyYWNrU2V0dGluZ3MpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy50cmFja3NbdHJhY2tOYW1lXSA9IHRyYWNrO1xuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBTdGFydHMgcGxheWluZyB0aGUgY3VycmVudCB0cmFjay5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gY29tbWFuZCBbWE1MIERPTSBFbGVtZW50XSBUaGUgY29tbWFuZCBhcyB3cml0dGVuIGluIHRoZSBXZWJTdG9yeS5cbiAgICAgKiBAcmV0dXJuIFtvYmplY3RdIE9iamVjdCB0aGF0IGRldGVybWluZXMgdGhlIG5leHQgc3RhdGUgb2YgdGhlIGludGVycHJldGVyLlxuICAgICAqL1xuICAgIHRoaXMucGxheSA9IGZ1bmN0aW9uIChjb21tYW5kKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgZmFkZUR1cmF0aW9uO1xuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuX3BsYXlpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZG9OZXh0OiB0cnVlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLl9wbGF5aW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fcGF1c2VkID0gZmFsc2U7XG4gICAgICAgIFxuICAgICAgICBpZiAoY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJmYWRlaW5cIikpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5pbnRlcnByZXRlci53YWl0Q291bnRlciArPSAxO1xuICAgICAgICAgICAgZmFkZUR1cmF0aW9uID0gK2NvbW1hbmQuZ2V0QXR0cmlidXRlKFwiZmFkZWluXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLnRyYWNrc1t0aGlzLl9jdXJyZW50VHJhY2tdLnZvbHVtZSgwKTtcbiAgICAgICAgICAgIHRoaXMudHJhY2tzW3RoaXMuX2N1cnJlbnRUcmFja10ucGxheSgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLnRyYWNrc1t0aGlzLl9jdXJyZW50VHJhY2tdLmZhZGUoMCwgMSwgZmFkZUR1cmF0aW9uLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcnByZXRlci53YWl0Q291bnRlciAtPSAxO1xuICAgICAgICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudHJhY2tzW3RoaXMuX2N1cnJlbnRUcmFja10ucGxheSgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZG9OZXh0OiB0cnVlXG4gICAgICAgIH07XG4gICAgfTtcbiAgICBcbiAgICAvKipcbiAgICAgKiBTdG9wcyBwbGF5aW5nIHRoZSBjdXJyZW50IHRyYWNrLlxuICAgICAqIFxuICAgICAqIEBwYXJhbSBjb21tYW5kIFtYTUwgRE9NIEVsZW1lbnRdIFRoZSBjb21tYW5kIGFzIHdyaXR0ZW4gaW4gdGhlIFdlYlN0b3J5LlxuICAgICAqIEByZXR1cm4gW29iamVjdF0gT2JqZWN0IHRoYXQgZGV0ZXJtaW5lcyB0aGUgbmV4dCBzdGF0ZSBvZiB0aGUgaW50ZXJwcmV0ZXIuXG4gICAgICovXG4gICAgdGhpcy5zdG9wID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBmYWRlRHVyYXRpb247XG4gICAgICAgIFxuICAgICAgICBpZiAoIXRoaXMuX2N1cnJlbnRUcmFjaykge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBkb05leHQ6IHRydWVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuX3BsYXlpbmcgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fcGF1c2VkID0gZmFsc2U7XG4gICAgICAgIFxuICAgICAgICBpZiAoY29tbWFuZCAmJiBjb21tYW5kLmdldEF0dHJpYnV0ZShcImZhZGVvdXRcIikpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5pbnRlcnByZXRlci53YWl0Q291bnRlciArPSAxO1xuICAgICAgICAgICAgZmFkZUR1cmF0aW9uID0gK2NvbW1hbmQuZ2V0QXR0cmlidXRlKFwiZmFkZW91dFwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy50cmFja3NbdGhpcy5fY3VycmVudFRyYWNrXS5mYWRlKDEsIDAsIGZhZGVEdXJhdGlvbiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMudHJhY2tzW3RoaXMuX2N1cnJlbnRUcmFja10uc3RvcCgpO1xuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgLT0gMTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRyYWNrc1t0aGlzLl9jdXJyZW50VHJhY2tdLnN0b3AoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5idXMudHJpZ2dlcihcIndzZS5hc3NldHMuYXVkaW8uc3RvcFwiLCB0aGlzKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkb05leHQ6IHRydWVcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIFxuICAgIC8qKlxuICAgICAqIFBhdXNlcyBwbGF5aW5nIHRoZSBjdXJyZW4gdHJhY2suXG4gICAgICogXG4gICAgICogQHJldHVybiBbb2JqZWN0XSBPYmplY3QgdGhhdCBkZXRlcm1pbmVzIHRoZSBuZXh0IHN0YXRlIG9mIHRoZSBpbnRlcnByZXRlci5cbiAgICAgKi9cbiAgICB0aGlzLnBhdXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBcbiAgICAgICAgaWYgKCF0aGlzLl9jdXJyZW50VHJhY2sgfHwgIXRoaXMuX3BsYXlpbmcpIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZG9OZXh0OiB0cnVlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLl9wYXVzZWQgPSB0cnVlO1xuICAgICAgICBcbiAgICAgICAgdGhpcy50cmFja3NbdGhpcy5fY3VycmVudFRyYWNrXS5wYXVzZSgpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRvTmV4dDogdHJ1ZVxuICAgICAgICB9O1xuICAgIH07XG4gICAgXG4gICAgdGhpcy5idXMudHJpZ2dlcihcIndzZS5hc3NldHMuYXVkaW8uY29uc3RydWN0b3JcIiwgdGhpcyk7XG4gICAgXG4gICAgdGhpcy5idXMuc3Vic2NyaWJlKFwid3NlLmludGVycHJldGVyLnJlc3RhcnRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICB9LmJpbmQodGhpcykpO1xuICAgIFxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9wbGF5aW5nKSB7XG4gICAgICAgICAgICB0aGlzLnRyYWNrc1t0aGlzLl9jdXJyZW50VHJhY2tdLmZhZGUoMSwgMCwgMjAwKTtcbiAgICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSk7XG4gICAgXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLl9wbGF5aW5nKSB7XG4gICAgICAgICAgICB0aGlzLnRyYWNrc1t0aGlzLl9jdXJyZW50VHJhY2tdLmZhZGUoMCwgMSwgMjAwKTtcbiAgICAgICAgfVxuICAgIH0uYmluZCh0aGlzKSk7XG59XG5cbi8qKlxuICogQ2hhbmdlcyB0aGUgY3VycmVudGx5IGFjdGl2ZSB0cmFjay5cbiAqIFxuICogQHBhcmFtIGNvbW1hbmQgW0RPTSBFbGVtZW50XSBUaGUgY29tbWFuZCBhcyBzcGVjaWZpZWQgaW4gdGhlIFdlYlN0b3J5LlxuICogQHRyaWdnZXIgd3NlLmludGVycHJldGVyLndhcm5pbmdAaW50ZXJwcmV0ZXJcbiAqIEB0cmlnZ2VyIHdzZS5hc3NldHMuYXVkaW8uc2V0QGludGVycHJldGVyXG4gKi9cbkF1ZGlvLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoY29tbWFuZCkge1xuICAgIFxuICAgIHZhciB3YXNQbGF5aW5nID0gZmFsc2U7XG4gICAgXG4gICAgaWYgKHRoaXMuX3BsYXlpbmcpIHtcbiAgICAgICAgd2FzUGxheWluZyA9IHRydWU7XG4gICAgfVxuICAgIFxuICAgIHRoaXMuc3RvcCgpO1xuICAgIFxuICAgIHRoaXMuX2N1cnJlbnRUcmFjayA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwidHJhY2tcIik7XG4gICAgXG4gICAgaWYgKHdhc1BsYXlpbmcpIHtcbiAgICAgICAgdGhpcy5wbGF5KGNvbW1hbmQpO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBkb05leHQ6IHRydWVcbiAgICB9O1xufTtcblxuLyoqXG4gKiBHYXRoZXJzIHRoZSBkYXRhIHRvIHB1dCBpbnRvIGEgc2F2ZWdhbWUuXG4gKiBcbiAqIEBwYXJhbSBvYmogW29iamVjdF0gVGhlIHNhdmVnYW1lIG9iamVjdC5cbiAqL1xuQXVkaW8ucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIG9iaiA9IHtcbiAgICAgICAgY3VycmVudFRyYWNrOiB0aGlzLl9jdXJyZW50VHJhY2ssXG4gICAgICAgIHBsYXlpbmc6IHRoaXMuX3BsYXlpbmcsXG4gICAgICAgIHBhdXNlZDogdGhpcy5fcGF1c2VkXG4gICAgfTtcbiAgICBcbiAgICB0aGlzLmJ1cy50cmlnZ2VyKFwid3NlLmFzc2V0cy5hdWRpby5zYXZlXCIsIHRoaXMpO1xuICAgIFxuICAgIHJldHVybiBvYmo7XG59O1xuXG4vKipcbiAqIFJlc3RvcmUgZnVuY3Rpb24gZm9yIGxvYWRpbmcgdGhlIHN0YXRlIGZyb20gYSBzYXZlZ2FtZS5cbiAqIFxuICogQHBhcmFtIG9iaiBbb2JqZWN0XSBUaGUgc2F2ZWdhbWUgZGF0YS5cbiAqIEB0cmlnZ2VyIHdzZS5hc3NldHMuYXVkaW8ucmVzdG9yZUBpbnRlcnByZXRlclxuICovXG5BdWRpby5wcm90b3R5cGUucmVzdG9yZSA9IGZ1bmN0aW9uICh2YWxzKSB7XG4gICAgXG4gICAgdmFyIGtleTtcbiAgICBcbiAgICB0aGlzLl9wbGF5aW5nID0gdmFscy5wbGF5aW5nO1xuICAgIHRoaXMuX3BhdXNlZCA9IHZhbHMucGF1c2VkO1xuICAgIHRoaXMuX2N1cnJlbnRUcmFjayA9IHZhbHMuY3VycmVudFRyYWNrO1xuICAgIFxuICAgIGZvciAoa2V5IGluIHRoaXMudHJhY2tzKSB7XG4gICAgICAgIHRoaXMudHJhY2tzW2tleV0uc3RvcCgpO1xuICAgIH1cbiAgICBcbiAgICBpZiAodGhpcy5fcGxheWluZyAmJiAhdGhpcy5fcGF1c2VkKSB7XG4gICAgICAgIHRoaXMudHJhY2tzW3RoaXMuX2N1cnJlbnRUcmFja10ucGxheSgpO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLmJ1cy50cmlnZ2VyKFwid3NlLmFzc2V0cy5hdWRpby5yZXN0b3JlXCIsIHRoaXMpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBBdWRpbztcbiIsIlxudmFyIHdhcm4gPSByZXF1aXJlKFwiLi4vdG9vbHMvdG9vbHNcIikud2FybjtcbnZhciBEaXNwbGF5T2JqZWN0ID0gcmVxdWlyZShcIi4uL0Rpc3BsYXlPYmplY3RcIik7XG5cbmZ1bmN0aW9uIHJlc2l6ZSAoc2VsZikge1xuICAgIHNlbGYuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCBzZWxmLnN0YWdlLm9mZnNldFdpZHRoKTtcbiAgICBzZWxmLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIHNlbGYuc3RhZ2Uub2Zmc2V0SGVpZ2h0KTtcbn1cblxuZnVuY3Rpb24gc3R5bGVFbGVtZW50IChzZWxmKSB7XG4gICAgXG4gICAgdmFyIHMgPSBzZWxmLmVsZW1lbnQuc3R5bGU7XG4gICAgXG4gICAgc2VsZi5lbGVtZW50LnNldEF0dHJpYnV0ZShcImlkXCIsIHNlbGYuY3NzaWQpO1xuICAgIHNlbGYuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIldTRUJhY2tncm91bmRcIik7XG4gICAgc2VsZi5lbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgIHNlbGYuZWxlbWVudC5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICBzLmxlZnQgPSAwO1xuICAgIHMudG9wID0gMDtcbiAgICBzLm9wYWNpdHkgPSAwO1xuICAgIHMuekluZGV4ID0gc2VsZi56O1xufVxuXG5mdW5jdGlvbiBCYWNrZ3JvdW5kIChhc3NldCkge1xuICAgIFxuICAgIHRoaXMuZWxlbWVudFR5cGUgPSBcImltZ1wiO1xuICAgIFxuICAgIERpc3BsYXlPYmplY3QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgXG4gICAgdGhpcy5hc3NldCA9IGFzc2V0O1xuICAgIHRoaXMuY3NzaWQgPSB0aGlzLmNzc2lkIHx8IFwiV1NFQmFja2dyb3VuZF9cIiArIHRoaXMuaWQ7XG4gICAgdGhpcy5zcmMgPSBhc3NldC5nZXRBdHRyaWJ1dGUoJ3NyYycpO1xuICAgIFxuICAgIGlmICghdGhpcy5zcmMpIHtcbiAgICAgICAgd2Fybih0aGlzLmJ1cywgJ05vIHNvdXJjZSBkZWZpbmVkIG9uIGJhY2tncm91bmQgYXNzZXQuJywgYXNzZXQpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3NyYycsIHRoaXMuc3JjKTtcbiAgICBcbiAgICBzdHlsZUVsZW1lbnQodGhpcyk7XG4gICAgcmVzaXplKHRoaXMpO1xuICAgIFxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBmdW5jdGlvbiAoKSB7IHJlc2l6ZShzZWxmKTsgfSk7XG59XG5cbkJhY2tncm91bmQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShEaXNwbGF5T2JqZWN0LnByb3RvdHlwZSk7XG5cbkJhY2tncm91bmQucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY3NzaWQ6IHRoaXMuY3NzaWQsXG4gICAgICAgIHo6IHRoaXMuelxuICAgIH07XG59O1xuXG5CYWNrZ3JvdW5kLnByb3RvdHlwZS5yZXN0b3JlID0gZnVuY3Rpb24gKG9iaikge1xuICAgIFxuICAgIHRoaXMuY3NzaWQgPSBvYmouY3NzaWQ7XG4gICAgdGhpcy56ID0gb2JqLno7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jc3NpZCk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIHdhcm4odGhpcy5idXMsIFwiRWxlbWVudCB3aXRoIENTUyBJRCAnXCIgKyB0aGlzLmNzc2lkICsgXCInIGNvdWxkIG5vdCBiZSBmb3VuZC5cIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJhY2tncm91bmQ7XG4iLCJcbmZ1bmN0aW9uIENoYXJhY3RlciAoYXNzZXQsIGludGVycHJldGVyKSB7XG4gICAgXG4gICAgdGhpcy5hc3NldCA9IGFzc2V0O1xuICAgIHRoaXMuc3RhZ2UgPSBpbnRlcnByZXRlci5zdGFnZTtcbiAgICB0aGlzLmJ1cyA9IGludGVycHJldGVyLmJ1cztcbiAgICB0aGlzLm5hbWUgPSBhc3NldC5nZXRBdHRyaWJ1dGUoJ25hbWUnKTtcbiAgICB0aGlzLmJ1cy50cmlnZ2VyKFwid3NlLmFzc2V0cy5jaGFyYWN0ZXIuY29uc3RydWN0b3JcIiwgdGhpcyk7XG59XG5cbkNoYXJhY3Rlci5wcm90b3R5cGUuc2V0VGV4dGJveCA9IGZ1bmN0aW9uIChjb21tYW5kKSB7XG4gICAgdGhpcy5hc3NldC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0Ym94XCIsIGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwidGV4dGJveFwiKSk7XG4gICAgdGhpcy5idXMudHJpZ2dlcihcIndzZS5hc3NldHMuY2hhcmFjdGVyLnNldHRleHRib3hcIiwgdGhpcyk7XG59O1xuXG5DaGFyYWN0ZXIucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIG9iaiA9IHtcbiAgICAgICAgYXNzZXRUeXBlOiBcIkNoYXJhY3RlclwiLFxuICAgICAgICB0ZXh0Ym94TmFtZTogdGhpcy5hc3NldC5nZXRBdHRyaWJ1dGUoXCJ0ZXh0Ym94XCIpXG4gICAgfTtcbiAgICBcbiAgICB0aGlzLmJ1cy50cmlnZ2VyKFxuICAgICAgICBcIndzZS5hc3NldHMuY2hhcmFjdGVyLnNhdmVcIixcbiAgICAgICAge1xuICAgICAgICAgICAgc3ViamVjdDogdGhpcyxcbiAgICAgICAgICAgIHNhdmVzOiBvYmpcbiAgICAgICAgfVxuICAgICk7XG4gICAgXG4gICAgcmV0dXJuIG9iajtcbn07XG5cbkNoYXJhY3Rlci5wcm90b3R5cGUucmVzdG9yZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICBcbiAgICB0aGlzLmFzc2V0LnNldEF0dHJpYnV0ZShcInRleHRib3hcIiwgb2JqLnRleHRib3hOYW1lKTtcbiAgICBcbiAgICB0aGlzLmJ1cy50cmlnZ2VyKFxuICAgICAgICBcIndzZS5hc3NldHMuY2hhcmFjdGVyLnJlc3RvcmVcIixcbiAgICAgICAge1xuICAgICAgICAgICAgc3ViamVjdDogdGhpcyxcbiAgICAgICAgICAgIHNhdmVzOiBvYmpcbiAgICAgICAgfVxuICAgICk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IENoYXJhY3RlcjtcbiIsIlxudmFyIGVhc2luZyA9IHJlcXVpcmUoXCJlYXNlc1wiKTtcbnZhciB0cmFuc2Zvcm0gPSByZXF1aXJlKFwidHJhbnNmb3JtLWpzXCIpLnRyYW5zZm9ybTtcblxudmFyIHdhcm4gPSByZXF1aXJlKFwiLi4vdG9vbHMvdG9vbHNcIikud2FybjtcbnZhciBEaXNwbGF5T2JqZWN0ID0gcmVxdWlyZShcIi4uL0Rpc3BsYXlPYmplY3RcIik7XG5cbi8qKlxuICogQ29uc3RydWN0b3IgZnVuY3Rpb24gZm9yIENvbXBvc2l0ZXMuXG4gKiBcbiAqIEBwYXJhbSBhc3NldCBbRE9NIEVsZW1lbnRdIFRoZSBhc3NldCBkZWZpbml0aW9uLlxuICogQHBhcmFtIGludGVycHJldGVyIFtXU0UuSW50ZXJwcmV0ZXJdIFRoZSBpbnRlcnByZXRlciBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIENvbXBvc2l0ZSAoYXNzZXQpIHtcbiAgICBcbiAgICB2YXIgZWxlbWVudCwgY2hpbGRyZW47XG4gICAgdmFyIHNlbGYsIHRyaWdnZXJEZWNyZWFzZUZuLCB3aWR0aCwgaGVpZ2h0O1xuICAgIFxuICAgIHRoaXMuX2JveFNpemVTZWxlY3RvcnMgPSBbXCJpbWdcIl07XG4gICAgXG4gICAgRGlzcGxheU9iamVjdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIFxuICAgIHRoaXMuY3NzaWQgPSB0aGlzLmNzc2lkIHx8IFwid3NlX2NvbXBvc2l0ZV9cIiArIHRoaXMubmFtZTtcbiAgICBcbiAgICBzZWxmID0gdGhpcztcbiAgICBlbGVtZW50ID0gdGhpcy5lbGVtZW50O1xuICAgIHdpZHRoID0gdGhpcy53aWR0aDtcbiAgICBoZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICBcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYXNzZXQgY29tcG9zaXRlXCIpO1xuICAgIFxuICAgIGNoaWxkcmVuID0gYXNzZXQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbWFnZVwiKTtcbiAgICB0cmlnZ2VyRGVjcmVhc2VGbiA9XG4gICAgICAgIHNlbGYuYnVzLnRyaWdnZXIuYmluZChzZWxmLmJ1cywgXCJ3c2UuYXNzZXRzLmxvYWRpbmcuZGVjcmVhc2VcIiwgbnVsbCwgZmFsc2UpO1xuICAgIFxuICAgIFtdLmZvckVhY2guY2FsbChjaGlsZHJlbiwgZnVuY3Rpb24gKGN1cnJlbnQpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciB0YWdzLCBzcmMsIGltYWdlO1xuICAgICAgICBcbiAgICAgICAgdGFncyA9IGN1cnJlbnQuZ2V0QXR0cmlidXRlKFwidGFnc1wiKTtcbiAgICAgICAgc3JjID0gY3VycmVudC5nZXRBdHRyaWJ1dGUoXCJzcmNcIik7XG4gICAgICAgIFxuICAgICAgICBpZiAodGFncyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgd2FybihzZWxmLmJ1cywgXCJJbWFnZSB3aXRob3V0IHRhZ3MgaW4gY29tcG9zaXRlICdcIiArIHNlbGYubmFtZSArIFwiJy5cIiwgYXNzZXQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoc3JjID09PSBudWxsKSB7XG4gICAgICAgICAgICB3YXJuKHNlbGYuYnVzLCBcIkltYWdlIHdpdGhvdXQgc3JjIGluIGNvbXBvc2l0ZSAnXCIgKyBzZWxmLm5hbWUgKyBcIicuXCIsIGFzc2V0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgXG4gICAgICAgIHNlbGYuYnVzLnRyaWdnZXIoXCJ3c2UuYXNzZXRzLmxvYWRpbmcuaW5jcmVhc2VcIiwgbnVsbCwgZmFsc2UpO1xuICAgICAgICBpbWFnZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgdHJpZ2dlckRlY3JlYXNlRm4pO1xuICAgICAgICBcbiAgICAgICAgaW1hZ2Uuc3JjID0gc3JjO1xuICAgICAgICBpbWFnZS5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgaW1hZ2Uuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICAgIGltYWdlLmRyYWdnYWJsZSA9IGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKFwiZGF0YS13c2UtdGFnc1wiLCB0YWdzKTtcbiAgICAgICAgXG4gICAgICAgIGlmICh3aWR0aCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHdpZHRoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKGhlaWdodCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKGltYWdlKTtcbiAgICAgICAgXG4gICAgfSk7XG4gICAgXG4gICAgdGhpcy5jdXJyZW50ID0gW107XG59XG5cbkNvbXBvc2l0ZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKERpc3BsYXlPYmplY3QucHJvdG90eXBlKTtcblxuQ29tcG9zaXRlLnByb3RvdHlwZS50YWcgPSBmdW5jdGlvbiAoY29tbWFuZCwgYXJncykge1xuICAgIFxuICAgIHZhciBzZWxmLCBvbGQsIGR1cmF0aW9uLCBpc0FuaW1hdGlvbiwgYnVzID0gdGhpcy5idXMsIGVsZW1lbnQ7XG4gICAgdmFyIHRvQWRkLCB0b1JlbW92ZSwgaW1hZ2VzQnlUYWdzLCBvbGRJbWFnZXMsIG5ld0ltYWdlcztcbiAgICBcbiAgICBhcmdzID0gYXJncyB8fCB7fTtcbiAgICBzZWxmID0gdGhpcztcbiAgICB0b0FkZCA9IGV4dHJhY3RUYWdzKGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwiYWRkXCIpIHx8IFwiXCIpO1xuICAgIHRvUmVtb3ZlID0gZXh0cmFjdFRhZ3MoY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJyZW1vdmVcIikgfHwgXCJcIik7XG4gICAgZHVyYXRpb24gPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcImR1cmF0aW9uXCIpIHx8IDQwMDtcbiAgICBpc0FuaW1hdGlvbiA9IGFyZ3MuYW5pbWF0aW9uID09PSB0cnVlID8gdHJ1ZSA6IGZhbHNlO1xuICAgIFxuICAgIGlmICghdG9BZGQubGVuZ3RoICYmICF0b1JlbW92ZS5sZW5ndGgpIHtcbiAgICAgICAgXG4gICAgICAgIHdhcm4oYnVzLCBcIk5vIGF0dHJpYnV0ZSAnYWRkJyBvciAncmVtb3ZlJyBvbiBlbGVtZW50IFwiICtcbiAgICAgICAgICAgIFwicmVmZXJlbmNpbmcgY29tcG9zaXRlICdcIiArIHRoaXMubmFtZSArIFwiJy4gRXhwZWN0ZWQgYXQgbGVhc3Qgb25lLlwiLCBjb21tYW5kKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkb05leHQ6IHRydWVcbiAgICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgb2xkID0gdGhpcy5jdXJyZW50O1xuICAgIFxuICAgIGlmICh0b1JlbW92ZS5sZW5ndGggJiYgdG9SZW1vdmVbMF0gPT09IFwiKlwiKSB7XG4gICAgICAgIHRoaXMuY3VycmVudCA9IHRvQWRkLnNsaWNlKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gb2xkLmZpbHRlcihmdW5jdGlvbiAodGFnKSB7XG4gICAgICAgICAgICByZXR1cm4gdG9SZW1vdmUuaW5kZXhPZih0YWcpIDwgMDtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICB0b0FkZC5mb3JFYWNoKGZ1bmN0aW9uICh0YWcpIHtcbiAgICAgICAgICAgIGlmIChzZWxmLmN1cnJlbnQuaW5kZXhPZih0YWcpIDwgMCkge1xuICAgICAgICAgICAgICAgIHNlbGYuY3VycmVudC5wdXNoKHRhZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBcbiAgICBpbWFnZXNCeVRhZ3MgPSBnZXRJbWFnZXNCeVRhZ3ModGhpcyk7XG4gICAgb2xkSW1hZ2VzID0gW107XG4gICAgbmV3SW1hZ2VzID0gW107XG4gICAgXG4gICAgb2xkLmZvckVhY2goZnVuY3Rpb24gKHRhZykge1xuICAgICAgICBpZiAoaW1hZ2VzQnlUYWdzW3RhZ10pIHtcbiAgICAgICAgICAgIGltYWdlc0J5VGFnc1t0YWddLmZvckVhY2goZnVuY3Rpb24gKGltYWdlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG9sZEltYWdlcy5pbmRleE9mKGltYWdlKSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgb2xkSW1hZ2VzLnB1c2goaW1hZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgXG4gICAgdGhpcy5jdXJyZW50LmZvckVhY2goZnVuY3Rpb24gKHRhZykge1xuICAgICAgICBpZiAoaW1hZ2VzQnlUYWdzW3RhZ10pIHtcbiAgICAgICAgICAgIGltYWdlc0J5VGFnc1t0YWddLmZvckVhY2goZnVuY3Rpb24gKGltYWdlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5ld0ltYWdlcy5pbmRleE9mKGltYWdlKSA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3SW1hZ2VzLnB1c2goaW1hZ2UpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgXG4gICAgbmV3SW1hZ2VzID0gbmV3SW1hZ2VzLmZpbHRlcihmdW5jdGlvbiAoaW1hZ2UpIHtcbiAgICAgICAgXG4gICAgICAgIGlmIChvbGRJbWFnZXMuaW5kZXhPZihpbWFnZSkgPj0gMCkge1xuICAgICAgICAgICAgb2xkSW1hZ2VzLnNwbGljZShvbGRJbWFnZXMuaW5kZXhPZihpbWFnZSksIDEpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgICBcbiAgICBpZiAoIWlzQW5pbWF0aW9uKSB7XG4gICAgICAgIHNlbGYuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgKz0gMTtcbiAgICB9XG4gICAgXG4gICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY3NzaWQpO1xuICAgIGVsZW1lbnQuc3R5bGUud2lkdGggPSBoaWdoZXN0KG5ld0ltYWdlcywgXCJvZmZzZXRXaWR0aFwiKSArIFwicHhcIjtcbiAgICBlbGVtZW50LnN0eWxlLmhlaWdodCA9IGhpZ2hlc3QobmV3SW1hZ2VzLCBcIm9mZnNldEhlaWdodFwiKSArIFwicHhcIjtcbiAgICBcbiAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIHZhbEZuLCBmaW5pc2hGbiwgb3B0aW9ucztcbiAgICAgICAgXG4gICAgICAgIHZhbEZuID0gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgIG5ld0ltYWdlcy5mb3JFYWNoKGZ1bmN0aW9uIChpbWFnZSkge1xuICAgICAgICAgICAgICAgIGltYWdlLnN0eWxlLm9wYWNpdHkgPSB2O1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBmaW5pc2hGbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFpc0FuaW1hdGlvbikge1xuICAgICAgICAgICAgICAgIHNlbGYuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgLT0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgICAgICBlYXNpbmc6IGVhc2luZy5jdWJpY091dFxuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgdHJhbnNmb3JtKDAsIDEsIHZhbEZuLCBvcHRpb25zLCBmaW5pc2hGbik7XG4gICAgfSgpKTtcbiAgICBcbiAgICBpZiAodGhpcy5jdXJyZW50ICE9PSBudWxsKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWlzQW5pbWF0aW9uKSB7XG4gICAgICAgICAgICBzZWxmLmludGVycHJldGVyLndhaXRDb3VudGVyICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZ1bmN0aW9uIHRpbWVvdXRGbiAoKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIG9wdGlvbnM7IFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHZhbEZuICh2KSB7XG4gICAgICAgICAgICAgICAgICAgIG9sZEltYWdlcy5mb3JFYWNoKGZ1bmN0aW9uIChpbWFnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2Uuc3R5bGUub3BhY2l0eSA9IHY7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiBmaW5pc2hGbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNBbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgICAgICAgICAgICAgIGVhc2luZzogZWFzaW5nLmN1YmljSW5cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybSgxLCAwLCB2YWxGbiwgb3B0aW9ucywgZmluaXNoRm4pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aW1lb3V0Rm4oKTtcbiAgICAgICAgfSgpKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZG9OZXh0OiB0cnVlXG4gICAgfTtcbn07XG5cbkNvbXBvc2l0ZS5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgY3VyLCBvYmo7XG4gICAgXG4gICAgY3VyID0gdGhpcy5jdXJyZW50IHx8IFtdO1xuICAgIFxuICAgIG9iaiA9IHtcbiAgICAgICAgYXNzZXRUeXBlOiBcIkNvbXBvc2l0ZVwiLFxuICAgICAgICBjdXJyZW50OiBjdXIsXG4gICAgICAgIGNzc2lkOiB0aGlzLmNzc2lkLFxuICAgICAgICB4QW5jaG9yOiB0aGlzLnhBbmNob3IsXG4gICAgICAgIHlBbmNob3I6IHRoaXMueUFuY2hvcixcbiAgICAgICAgejogdGhpcy56XG4gICAgfTtcbiAgICBcbiAgICB0aGlzLmJ1cy50cmlnZ2VyKFxuICAgICAgICBcIndzZS5hc3NldHMuY29tcG9zaXRlLnNhdmVcIixcbiAgICAgICAge1xuICAgICAgICAgICAgc3ViamVjdDogdGhpcyxcbiAgICAgICAgICAgIHNhdmVzOiBvYmpcbiAgICAgICAgfVxuICAgICk7XG4gICAgXG4gICAgcmV0dXJuIG9iajtcbn07XG5cbkNvbXBvc2l0ZS5wcm90b3R5cGUucmVzdG9yZSA9IGZ1bmN0aW9uIChzYXZlKSB7XG4gICAgXG4gICAgdGhpcy5jc3NpZCA9IHNhdmUuY3NzaWQ7XG4gICAgdGhpcy56ID0gc2F2ZS56O1xuICAgIHRoaXMuY3VycmVudCA9IHNhdmUuY3VycmVudC5zbGljZSgpO1xuICAgIHRoaXMueEFuY2hvciA9IHNhdmUueEFuY2hvcjtcbiAgICB0aGlzLnlBbmNob3IgPSBzYXZlLnlBbmNob3I7XG4gICAgXG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jc3NpZCk7XG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLnpJbmRleCA9IHRoaXMuejtcbiAgICBcbiAgICB0aGlzLmJ1cy50cmlnZ2VyKFxuICAgICAgICBcIndzZS5hc3NldHMuY29tcG9zaXRlLnJlc3RvcmVcIixcbiAgICAgICAge1xuICAgICAgICAgICAgc3ViamVjdDogdGhpcyxcbiAgICAgICAgICAgIHNhdmVzOiBzYXZlXG4gICAgICAgIH1cbiAgICApO1xufTtcblxuZnVuY3Rpb24gZ2V0SW1hZ2VzQnlUYWdzIChzZWxmKSB7XG4gICAgXG4gICAgdmFyIGltYWdlcywgaW1hZ2VzQnlUYWc7XG4gICAgXG4gICAgaW1hZ2VzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc2VsZi5jc3NpZCkuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbWdcIik7XG4gICAgaW1hZ2VzQnlUYWcgPSB7fTtcbiAgICBcbiAgICBbXS5mb3JFYWNoLmNhbGwoaW1hZ2VzLCBmdW5jdGlvbiAoaW1hZ2UpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciB0YWdzID0gZXh0cmFjdFRhZ3MoaW1hZ2UuZ2V0QXR0cmlidXRlKFwiZGF0YS13c2UtdGFnc1wiKSB8fCBcIlwiKTtcbiAgICAgICAgXG4gICAgICAgIHRhZ3MuZm9yRWFjaChmdW5jdGlvbiAodGFnKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShpbWFnZXNCeVRhZ1t0YWddKSkge1xuICAgICAgICAgICAgICAgIGltYWdlc0J5VGFnW3RhZ10gPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaW1hZ2VzQnlUYWdbdGFnXS5wdXNoKGltYWdlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIGltYWdlc0J5VGFnO1xufVxuXG5mdW5jdGlvbiBleHRyYWN0VGFncyAocmF3KSB7XG4gICAgcmV0dXJuIHJhdy5zcGxpdChcIixcIikubWFwKGZ1bmN0aW9uIChyYXdUYWcpIHtcbiAgICAgICAgcmV0dXJuIHJhd1RhZy50cmltKCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGhpZ2hlc3QgKGFsbCwga2V5KSB7XG4gICAgXG4gICAgdmFyIGJpZ2dlc3QgPSAwO1xuICAgIFxuICAgIGFsbC5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIGlmIChpdGVtW2tleV0gPiBiaWdnZXN0KSB7XG4gICAgICAgICAgICBiaWdnZXN0ID0gaXRlbVtrZXldO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIGJpZ2dlc3Q7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29tcG9zaXRlO1xuIiwiLyogZ2xvYmFsIHVzaW5nICovXG5cbnZhciB3YXJuID0gcmVxdWlyZShcIi4uL3Rvb2xzL3Rvb2xzXCIpLndhcm47XG52YXIgRGlzcGxheU9iamVjdCA9IHJlcXVpcmUoXCIuLi9EaXNwbGF5T2JqZWN0XCIpO1xuXG5mdW5jdGlvbiBDdXJ0YWluIChhc3NldCkge1xuICAgIFxuICAgIERpc3BsYXlPYmplY3QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBcbiAgICB0aGlzLmFzc2V0ID0gYXNzZXQ7XG4gICAgdGhpcy5jb2xvciA9IGFzc2V0LmdldEF0dHJpYnV0ZShcImNvbG9yXCIpIHx8IFwiYmxhY2tcIjtcbiAgICB0aGlzLnogPSBhc3NldC5nZXRBdHRyaWJ1dGUoXCJ6XCIpIHx8IDIwMDAwO1xuICAgIHRoaXMuY3NzaWQgPSB0aGlzLmNzc2lkIHx8IFwiV1NFQ3VydGFpbl9cIiArIHRoaXMuaWQ7XG4gICAgXG4gICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYXNzZXQgV1NFQ3VydGFpblwiKTtcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IDA7XG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IDA7XG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gdGhpcy5zdGFnZS5vZmZzZXRXaWR0aCArIFwicHhcIjtcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5zdGFnZS5vZmZzZXRIZWlnaHQgKyBcInB4XCI7XG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmNvbG9yO1xufVxuXG5DdXJ0YWluLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRGlzcGxheU9iamVjdC5wcm90b3R5cGUpO1xuXG5DdXJ0YWluLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoYXNzZXQpIHtcbiAgICB0aGlzLmNvbG9yID0gYXNzZXQuZ2V0QXR0cmlidXRlKFwiY29sb3JcIikgfHwgXCJibGFja1wiO1xuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSB0aGlzLmNvbG9yO1xufTtcblxuQ3VydGFpbi5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgICBjb2xvcjogdGhpcy5jb2xvcixcbiAgICAgICAgY3NzaWQ6IHRoaXMuY3NzaWQsXG4gICAgICAgIHo6IHRoaXMuelxuICAgIH07XG59O1xuXG5DdXJ0YWluLnByb3RvdHlwZS5yZXN0b3JlID0gZnVuY3Rpb24gKG9iaikge1xuICAgIFxuICAgIHRoaXMuY29sb3IgPSBvYmouY29sb3I7XG4gICAgdGhpcy5jc3NpZCA9IG9iai5jc3NpZDtcbiAgICB0aGlzLnogPSBvYmouejtcbiAgICBcbiAgICB0cnkge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNzc2lkKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgd2Fybih0aGlzLmJ1cywgXCJFbGVtZW50IHdpdGggQ1NTIElEICdcIiArIHRoaXMuY3NzaWQgKyBcIicgY291bGQgbm90IGJlIGZvdW5kLlwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5jb2xvcjtcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuekluZGV4ID0gdGhpcy56O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDdXJ0YWluO1xuIiwiLyogZ2xvYmFsIHVzaW5nLCBjb25zb2xlICovXG5cbnZhciBlYXNpbmcgPSByZXF1aXJlKFwiZWFzZXNcIik7XG52YXIgdHJhbnNmb3JtID0gcmVxdWlyZShcInRyYW5zZm9ybS1qc1wiKS50cmFuc2Zvcm07XG5cbnZhciB3YXJuID0gcmVxdWlyZShcIi4uL3Rvb2xzL3Rvb2xzXCIpLndhcm47XG52YXIgRGlzcGxheU9iamVjdCA9IHJlcXVpcmUoXCIuLi9EaXNwbGF5T2JqZWN0XCIpO1xuXG4vKipcbiAqIENvbnN0cnVjdG9yIGZ1bmN0aW9uIGZvciBJbWFnZVBhY2tzLlxuICogXG4gKiBAcGFyYW0gYXNzZXQgW0RPTSBFbGVtZW50XSBUaGUgYXNzZXQgZGVmaW5pdGlvbi5cbiAqIEBwYXJhbSBpbnRlcnByZXRlciBbV1NFLkludGVycHJldGVyXSBUaGUgaW50ZXJwcmV0ZXIgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBJbWFnZXBhY2sgKGFzc2V0KSB7XG4gICAgXG4gICAgdmFyIGltYWdlcywgY2hpbGRyZW4sIGksIGxlbiwgY3VycmVudCwgbmFtZTtcbiAgICB2YXIgc3JjLCBpbWFnZSwgc2VsZiwgdHJpZ2dlckRlY3JlYXNlRm4sIHdpZHRoLCBoZWlnaHQ7XG4gICAgXG4gICAgdGhpcy5fYm94U2l6ZVNlbGVjdG9ycyA9IFtcImltZ1wiXTtcbiAgICBcbiAgICBEaXNwbGF5T2JqZWN0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgXG4gICAgdGhpcy5jc3NpZCA9IHRoaXMuY3NzaWQgfHwgXCJ3c2VfaW1hZ2VwYWNrX1wiICsgdGhpcy5uYW1lO1xuICAgIFxuICAgIHNlbGYgPSB0aGlzO1xuICAgIGltYWdlcyA9IHt9O1xuICAgIHdpZHRoID0gYXNzZXQuZ2V0QXR0cmlidXRlKCd3aWR0aCcpO1xuICAgIGhlaWdodCA9IGFzc2V0LmdldEF0dHJpYnV0ZSgnaGVpZ2h0Jyk7XG4gICAgXG4gICAgdGhpcy5lbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYXNzZXQgaW1hZ2VwYWNrXCIpO1xuICAgIFxuICAgIGNoaWxkcmVuID0gYXNzZXQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJpbWFnZVwiKTtcbiAgICB0cmlnZ2VyRGVjcmVhc2VGbiA9XG4gICAgICAgIHNlbGYuYnVzLnRyaWdnZXIuYmluZChzZWxmLmJ1cywgXCJ3c2UuYXNzZXRzLmxvYWRpbmcuZGVjcmVhc2VcIiwgbnVsbCwgZmFsc2UpO1xuICAgIFxuICAgIGZvciAoaSA9IDAsIGxlbiA9IGNoaWxkcmVuLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgIFxuICAgICAgICBjdXJyZW50ID0gY2hpbGRyZW5baV07XG4gICAgICAgIG5hbWUgPSBjdXJyZW50LmdldEF0dHJpYnV0ZShcIm5hbWVcIik7XG4gICAgICAgIHNyYyA9IGN1cnJlbnQuZ2V0QXR0cmlidXRlKFwic3JjXCIpO1xuICAgICAgICBcbiAgICAgICAgaWYgKG5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHdhcm4odGhpcy5idXMsIFwiSW1hZ2Ugd2l0aG91dCBuYW1lIGluIGltYWdlcGFjayAnXCIgKyB0aGlzLm5hbWUgKyBcIicuXCIsIGFzc2V0KTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoc3JjID09PSBudWxsKSB7XG4gICAgICAgICAgICB3YXJuKHRoaXMuYnVzLCBcIkltYWdlIHdpdGhvdXQgc3JjIGluIGltYWdlcGFjayAnXCIgKyB0aGlzLm5hbWUgKyBcIicuXCIsIGFzc2V0KTtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpbWFnZSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5idXMudHJpZ2dlcihcIndzZS5hc3NldHMubG9hZGluZy5pbmNyZWFzZVwiLCBudWxsLCBmYWxzZSk7XG4gICAgICAgIGltYWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCB0cmlnZ2VyRGVjcmVhc2VGbik7XG4gICAgICAgIFxuICAgICAgICBpbWFnZS5zcmMgPSBzcmM7XG4gICAgICAgIGltYWdlLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgICBpbWFnZS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgaW1hZ2UuZHJhZ2dhYmxlID0gZmFsc2U7XG4gICAgICAgIFxuICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoXCJkYXRhLXdzZS1hc3NldC1pbWFnZS1uYW1lXCIsIG5hbWUpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHdpZHRoICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgd2lkdGgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoaGVpZ2h0ICE9PSBudWxsKSB7XG4gICAgICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGltYWdlc1tuYW1lXSA9IHRoaXMuY3NzaWQgKyBcIl9cIiArIG5hbWU7XG4gICAgICAgIGltYWdlLnNldEF0dHJpYnV0ZShcImlkXCIsIGltYWdlc1tuYW1lXSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoaW1hZ2UpO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLmltYWdlcyA9IGltYWdlcztcbiAgICB0aGlzLmN1cnJlbnQgPSBudWxsO1xuICAgIFxufVxuXG5JbWFnZXBhY2sucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShEaXNwbGF5T2JqZWN0LnByb3RvdHlwZSk7XG5cbkltYWdlcGFjay5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGNvbW1hbmQsIGFyZ3MpIHtcbiAgICBcbiAgICB2YXIgaW1hZ2UsIG5hbWUsIHNlbGYsIG9sZCwgZHVyYXRpb24sIGlzQW5pbWF0aW9uLCBidXMgPSB0aGlzLmJ1cywgZWxlbWVudDtcbiAgICBcbiAgICBhcmdzID0gYXJncyB8fCB7fTtcbiAgICBzZWxmID0gdGhpcztcbiAgICBuYW1lID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJpbWFnZVwiKTtcbiAgICBkdXJhdGlvbiA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwiZHVyYXRpb25cIikgfHwgNDAwO1xuICAgIGlzQW5pbWF0aW9uID0gYXJncy5hbmltYXRpb24gPT09IHRydWUgPyB0cnVlIDogZmFsc2U7XG4gICAgXG4gICAgaWYgKG5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgXG4gICAgICAgIHdhcm4oYnVzLCBcIk1pc3NpbmcgYXR0cmlidXRlICdpbWFnZScgb24gJ2RvJyBlbGVtZW50IFwiICtcbiAgICAgICAgICAgIFwicmVmZXJlbmNpbmcgaW1hZ2VwYWNrICdcIiArIHRoaXMubmFtZSArIFwiJy5cIiwgY29tbWFuZCk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZG9OZXh0OiB0cnVlXG4gICAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIHRyeSB7XG4gICAgICAgIGltYWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pbWFnZXNbbmFtZV0pO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiRE9NIEVsZW1lbnQgZm9yIEltYWdlIFwiICsgbmFtZSArIFwiIG9uIEltYWdlcGFjayBcIiArXG4gICAgICAgICAgICB0aGlzLm5hbWUgKyBcIiBub3QgZm91bmQhXCIsIGUpO1xuICAgIH1cbiAgICBcbiAgICBpZiAodHlwZW9mIGltYWdlID09PSBcInVuZGVmaW5lZFwiIHx8IGltYWdlID09PSBudWxsKSB7XG4gICAgICAgIFxuICAgICAgICB3YXJuKGJ1cywgXCJVbmtub3duIGltYWdlIG5hbWUgb24gJ2RvJyBlbGVtZW50IHJlZmVyZW5jaW5nIFwiICtcbiAgICAgICAgICAgIFwiaW1hZ2VwYWNrICdcIiArIHRoaXMubmFtZSArIFwiJy5cIiwgY29tbWFuZCk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZG9OZXh0OiB0cnVlXG4gICAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIG9sZCA9IHRoaXMuY3VycmVudDtcbiAgICBcbiAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5pbWFnZXMpIHtcbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLmltYWdlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChrZXkgIT09IG5hbWUpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGtleSA9PT0gb2xkKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgd2FybihidXMsIFwiVHJ5aW5nIHRvIHNldCB0aGUgaW1hZ2UgdGhhdCBpcyBhbHJlYWR5IHNldCBvbiBpbWFnZXBhY2sgJ1wiICtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uYW1lICsgXCInLlwiLCBjb21tYW5kKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBkb05leHQ6IHRydWVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGlmICghaXNBbmltYXRpb24pIHtcbiAgICAgICAgc2VsZi5pbnRlcnByZXRlci53YWl0Q291bnRlciArPSAxO1xuICAgIH1cbiAgICBcbiAgICBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jc3NpZCk7XG4gICAgZWxlbWVudC5zdHlsZS53aWR0aCA9IGltYWdlLm9mZnNldFdpZHRoICsgXCJweFwiO1xuICAgIGVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gaW1hZ2Uub2Zmc2V0SGVpZ2h0ICsgXCJweFwiO1xuICAgIFxuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgdmFsRm4sIGZpbmlzaEZuLCBvcHRpb25zO1xuICAgICAgICBcbiAgICAgICAgdmFsRm4gPSBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgaW1hZ2Uuc3R5bGUub3BhY2l0eSA9IHY7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBmaW5pc2hGbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFpc0FuaW1hdGlvbikge1xuICAgICAgICAgICAgICAgIHNlbGYuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgLT0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgICAgICBlYXNpbmc6IGVhc2luZy5jdWJpY091dFxuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgdHJhbnNmb3JtKDAsIDEsIHZhbEZuLCBvcHRpb25zLCBmaW5pc2hGbik7XG4gICAgfSgpKTtcbiAgICBcbiAgICBpZiAodGhpcy5jdXJyZW50ICE9PSBudWxsKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWlzQW5pbWF0aW9uKSB7XG4gICAgICAgICAgICBzZWxmLmludGVycHJldGVyLndhaXRDb3VudGVyICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciB0aW1lb3V0Rm47XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRpbWVvdXRGbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciBvbGRFbCwgdmFsRm4sIGZpbmlzaEZuLCBvcHRpb25zOyBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBvbGRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNlbGYuaW1hZ2VzW29sZF0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhbEZuID0gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICAgICAgb2xkRWwuc3R5bGUub3BhY2l0eSA9IHY7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBmaW5pc2hGbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmICghaXNBbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgLT0gMTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICBlYXNpbmc6IGVhc2luZy5jdWJpY0luXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm0oMSwgMCwgdmFsRm4sIG9wdGlvbnMsIGZpbmlzaEZuKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRpbWVvdXRGbigpO1xuICAgICAgICB9KCkpO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLmN1cnJlbnQgPSBuYW1lO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIGRvTmV4dDogdHJ1ZVxuICAgIH07XG59O1xuXG5JbWFnZXBhY2sucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIGN1ciwgaW1hZ2VzLCBvYmo7XG4gICAgXG4gICAgaW1hZ2VzID0gdGhpcy5pbWFnZXM7XG4gICAgY3VyID0gdGhpcy5jdXJyZW50IHx8IG51bGw7XG4gICAgXG4gICAgb2JqID0ge1xuICAgICAgICBhc3NldFR5cGU6IFwiSW1hZ2VwYWNrXCIsXG4gICAgICAgIGN1cnJlbnQ6IGN1cixcbiAgICAgICAgY3NzaWQ6IHRoaXMuY3NzaWQsXG4gICAgICAgIGltYWdlczogaW1hZ2VzLFxuICAgICAgICB4QW5jaG9yOiB0aGlzLnhBbmNob3IsXG4gICAgICAgIHlBbmNob3I6IHRoaXMueUFuY2hvcixcbiAgICAgICAgejogdGhpcy56XG4gICAgfTtcbiAgICBcbiAgICB0aGlzLmJ1cy50cmlnZ2VyKFxuICAgICAgICBcIndzZS5hc3NldHMuaW1hZ2VwYWNrLnNhdmVcIixcbiAgICAgICAge1xuICAgICAgICAgICAgc3ViamVjdDogdGhpcyxcbiAgICAgICAgICAgIHNhdmVzOiBvYmpcbiAgICAgICAgfVxuICAgICk7XG4gICAgXG4gICAgcmV0dXJuIG9iajtcbn07XG5cbkltYWdlcGFjay5wcm90b3R5cGUucmVzdG9yZSA9IGZ1bmN0aW9uIChzYXZlKSB7XG4gICAgXG4gICAgdmFyIG5hbWU7XG4gICAgXG4gICAgbmFtZSA9IHNhdmUuY3VycmVudDtcbiAgICB0aGlzLmNzc2lkID0gc2F2ZS5jc3NpZDtcbiAgICB0aGlzLnogPSBzYXZlLno7XG4gICAgdGhpcy5jdXJyZW50ID0gbmFtZTtcbiAgICB0aGlzLnhBbmNob3IgPSBzYXZlLnhBbmNob3I7XG4gICAgdGhpcy55QW5jaG9yID0gc2F2ZS55QW5jaG9yO1xuICAgIFxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY3NzaWQpLnN0eWxlLnpJbmRleCA9IHRoaXMuejtcbiAgICBcbiAgICB0aGlzLmJ1cy50cmlnZ2VyKFxuICAgICAgICBcIndzZS5hc3NldHMuaW1hZ2VwYWNrLnJlc3RvcmVcIixcbiAgICAgICAge1xuICAgICAgICAgICAgc3ViamVjdDogdGhpcyxcbiAgICAgICAgICAgIHNhdmVzOiBzYXZlXG4gICAgICAgIH1cbiAgICApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbWFnZXBhY2s7XG4iLCJcbnZhciB0cmFuc2Zvcm0gPSByZXF1aXJlKFwidHJhbnNmb3JtLWpzXCIpLnRyYW5zZm9ybTtcbnZhciBjbGFzc2VzID0gcmVxdWlyZShcImNsYXNzLW1hbmlwdWxhdG9yXCIpLmxpc3Q7XG5cbnZhciB0b29scyA9IHJlcXVpcmUoXCIuLi90b29scy90b29sc1wiKTtcbnZhciByZXZlYWwgPSByZXF1aXJlKFwiLi4vdG9vbHMvcmV2ZWFsXCIpO1xudmFyIERpc3BsYXlPYmplY3QgPSByZXF1aXJlKFwiLi4vRGlzcGxheU9iamVjdFwiKTtcblxudmFyIHRydXRoeSA9IHRvb2xzLnRydXRoeTtcbnZhciByZXBsYWNlVmFycyA9IHRvb2xzLnJlcGxhY2VWYXJpYWJsZXM7XG5cbmZ1bmN0aW9uIFRleHRib3ggKGFzc2V0KSB7XG4gICAgXG4gICAgdGhpcy56ID0gMTAwMDtcbiAgICBcbiAgICBEaXNwbGF5T2JqZWN0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgXG4gICAgdmFyIGVsZW1lbnQsIG5hbWVFbGVtZW50LCB0ZXh0RWxlbWVudDtcbiAgICBcbiAgICB0aGlzLnR5cGUgPSBhc3NldC5nZXRBdHRyaWJ1dGUoXCJiZWhhdmlvdXJcIikgfHwgXCJhZHZcIjtcbiAgICB0aGlzLnNob3dOYW1lcyA9IHRydXRoeShhc3NldC5nZXRBdHRyaWJ1dGUoXCJuYW1lYm94XCIpKTtcbiAgICB0aGlzLm5sdG9iciA9IHRydXRoeShhc3NldC5nZXRBdHRyaWJ1dGUoXCJubHRvYnJcIikpO1xuICAgIHRoaXMuY3NzaWQgPSB0aGlzLmNzc2lkIHx8IFwid3NlX3RleHRib3hfXCIgKyB0aGlzLm5hbWU7XG4gICAgdGhpcy5lZmZlY3RUeXBlID0gYXNzZXQuZ2V0QXR0cmlidXRlKFwiZWZmZWN0XCIpIHx8IFwidHlwZXdyaXRlclwiO1xuICAgIHRoaXMuc3BlZWQgPSBhc3NldC5nZXRBdHRyaWJ1dGUoXCJzcGVlZFwiKSB8fCAwO1xuICAgIHRoaXMuc3BlZWQgPSBwYXJzZUludCh0aGlzLnNwZWVkLCAxMCk7XG4gICAgdGhpcy5mYWRlRHVyYXRpb24gPSBhc3NldC5nZXRBdHRyaWJ1dGUoXCJmYWRlRHVyYXRpb25cIikgfHwgMDtcbiAgICBcbiAgICAoZnVuY3Rpb24gKGN0eCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIGVsLCBpLCBsZW4sIGVsbXM7XG4gICAgICAgIFxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBlbG1zID0gYXNzZXQuY2hpbGROb2RlcztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yIChpID0gMCwgbGVuID0gZWxtcy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChlbG1zW2ldLm5vZGVUeXBlID09PSAxICYmIGVsbXNbaV0udGFnTmFtZSA9PT0gJ25hbWVUZW1wbGF0ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgZWwgPSBlbG1zW2ldO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghZWwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIG5hbWVUZW1wbGF0ZSBmb3VuZC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY3R4Lm5hbWVUZW1wbGF0ZSA9IG5ldyBYTUxTZXJpYWxpemVyKCkuc2VyaWFsaXplVG9TdHJpbmcoZWwpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjdHgubmFtZVRlbXBsYXRlID0gJ3tuYW1lfTogJztcbiAgICAgICAgfVxuICAgIH0odGhpcykpO1xuICAgIFxuICAgIGlmICh0aGlzLnR5cGUgPT09IFwibnZsXCIpIHtcbiAgICAgICAgdGhpcy5zaG93TmFtZXMgPSBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgZWxlbWVudCA9IHRoaXMuZWxlbWVudDtcbiAgICBuYW1lRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgdGV4dEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIFxuICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJhc3NldCB0ZXh0Ym94XCIpO1xuICAgIHRleHRFbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwidGV4dFwiKTtcbiAgICBuYW1lRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIm5hbWVcIik7XG4gICAgXG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChuYW1lRWxlbWVudCk7XG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZCh0ZXh0RWxlbWVudCk7XG4gICAgXG4gICAgaWYgKHRoaXMuc2hvd05hbWVzID09PSBmYWxzZSkge1xuICAgICAgICBuYW1lRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgfVxuICAgIFxuICAgIG5hbWVFbGVtZW50LnNldEF0dHJpYnV0ZShcImlkXCIsIHRoaXMuY3NzaWQgKyBcIl9uYW1lXCIpO1xuICAgIHRleHRFbGVtZW50LnNldEF0dHJpYnV0ZShcImlkXCIsIHRoaXMuY3NzaWQgKyBcIl90ZXh0XCIpO1xuICAgIFxuICAgIHRoaXMubmFtZUVsZW1lbnQgPSB0aGlzLmNzc2lkICsgXCJfbmFtZVwiO1xuICAgIHRoaXMudGV4dEVsZW1lbnQgPSB0aGlzLmNzc2lkICsgXCJfdGV4dFwiO1xuICAgIFxuICAgIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgXG4gICAgdGhpcy5idXMudHJpZ2dlcihcIndzZS5hc3NldHMudGV4dGJveC5jb25zdHJ1Y3RvclwiLCB0aGlzKTtcbn1cblxuVGV4dGJveC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKERpc3BsYXlPYmplY3QucHJvdG90eXBlKTtcblxuVGV4dGJveC5wcm90b3R5cGUucHV0ID0gZnVuY3Rpb24gKHRleHQsIG5hbWUsIHNwZWFrZXJJZCkge1xuICAgIFxuICAgIHZhciB0ZXh0RWxlbWVudCwgbmFtZUVsZW1lbnQsIG5hbWVQYXJ0LCBzZWxmLCBjc3NDbGFzcyA9IFwid3NlX25vX2NoYXJhY3RlclwiLCBlbGVtZW50O1xuICAgIFxuICAgIG5hbWUgPSBuYW1lIHx8IG51bGw7XG4gICAgc3BlYWtlcklkID0gc3BlYWtlcklkIHx8IFwiX25vX29uZVwiO1xuICAgIFxuICAgIHNlbGYgPSB0aGlzO1xuICAgIHRleHRFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50ZXh0RWxlbWVudCk7XG4gICAgbmFtZUVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLm5hbWVFbGVtZW50KTtcbiAgICBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jc3NpZCk7XG4gICAgXG4gICAgdGV4dCA9IHJlcGxhY2VWYXJzKHRleHQsIHRoaXMuaW50ZXJwcmV0ZXIpO1xuICAgIFxuICAgIHNlbGYuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgKz0gMTtcbiAgICBcbiAgICBuYW1lUGFydCA9IFwiXCI7XG4gICAgXG4gICAgaWYgKHRoaXMuc2hvd05hbWVzID09PSBmYWxzZSAmJiAhKCFuYW1lKSkge1xuICAgICAgICBuYW1lUGFydCA9IHRoaXMubmFtZVRlbXBsYXRlLnJlcGxhY2UoL1xce25hbWVcXH0vZywgbmFtZSk7XG4gICAgfVxuICAgIFxuICAgIGlmIChuYW1lID09PSBudWxsKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy5zaG93TmFtZXMpIHtcbiAgICAgICAgICAgIG5hbWVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgbmFtZSA9IFwiXCI7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuc2hvd05hbWVzKSB7XG4gICAgICAgICAgICBuYW1lRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgY3NzQ2xhc3MgPSBcIndzZV9jaGFyYWN0ZXJfXCIgKyBzcGVha2VySWQuc3BsaXQoXCIgXCIpLmpvaW4oXCJfXCIpO1xuICAgIH1cbiAgICBcbiAgICBpZiAodGhpcy5fbGFzdENzc0NsYXNzKSB7XG4gICAgICAgIGNsYXNzZXMoZWxlbWVudCkucmVtb3ZlKHRoaXMuX2xhc3RDc3NDbGFzcykuYXBwbHkoKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5fbGFzdENzc0NsYXNzID0gY3NzQ2xhc3M7XG4gICAgXG4gICAgY2xhc3NlcyhlbGVtZW50KS5hZGQoY3NzQ2xhc3MpLmFwcGx5KCk7XG4gICAgXG4gICAgaWYgKHRoaXMuc3BlZWQgPCAxKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy5mYWRlRHVyYXRpb24gPiAwKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNlbGYuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgKz0gMTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgdmFsRm4sIGZpbmlzaEZuLCBvcHRpb25zO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhbEZuID0gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dEVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IHY7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBmaW5pc2hGbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnRlcnByZXRlci53YWl0Q291bnRlciAtPSAxO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IHNlbGYuZmFkZUR1cmF0aW9uXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm0oMSwgMCwgdmFsRm4sIG9wdGlvbnMsIGZpbmlzaEZuKTtcbiAgICAgICAgICAgIH0oKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwdXRUZXh0KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMuc3BlZWQgPiAwKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAoc2VsZi50eXBlID09PSAnYWR2Jykge1xuICAgICAgICAgICAgdGV4dEVsZW1lbnQuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGNvbnRhaW5lcjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKCdjbGFzcycsICdsaW5lJyk7XG4gICAgICAgICAgICB0ZXh0RWxlbWVudC5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICAgICAgICAgICAgY29udGFpbmVyLmlubmVySFRNTCA9IG5hbWVQYXJ0ICsgdGV4dDtcbiAgICAgICAgICAgIG5hbWVFbGVtZW50LmlubmVySFRNTCA9IHNlbGYubmFtZVRlbXBsYXRlLnJlcGxhY2UoL1xce25hbWVcXH0vZywgbmFtZSk7XG4gICAgICAgICAgICAvL3NlbGYuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgKz0gMTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2VsZi5pbnRlcnByZXRlci5jYW5jZWxDaGFyQW5pbWF0aW9uID0gcmV2ZWFsKFxuICAgICAgICAgICAgICAgIGNvbnRhaW5lciwgXG4gICAgICAgICAgICAgICAgeyBcbiAgICAgICAgICAgICAgICAgICAgc3BlZWQ6IHNlbGYuc3BlZWQsXG4gICAgICAgICAgICAgICAgICAgIG9uRmluaXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvL3NlbGYuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgLT0gMTsgXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmludGVycHJldGVyLmNhbmNlbENoYXJBbmltYXRpb24gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKS5jYW5jZWw7XG4gICAgICAgIH0oKSk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHRoaXMuZmFkZUR1cmF0aW9uID4gMCkge1xuICAgICAgICBcbiAgICAgICAgc2VsZi5pbnRlcnByZXRlci53YWl0Q291bnRlciArPSAxO1xuICAgICAgICBcbiAgICAgICAgc2V0VGltZW91dChcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBwdXRUZXh0KCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYudHlwZSA9PT0gJ252bCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dEVsZW1lbnQuaW5uZXJIVE1MID0gJzxkaXY+JyArIHRleHRFbGVtZW50LmlubmVySFRNTCArICc8L2Rpdj4nO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm0oXG4gICAgICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgICAgIDEsXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0RWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gdjtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IHNlbGYuZmFkZUR1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgb25GaW5pc2g6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmludGVycHJldGVyLndhaXRDb3VudGVyIC09IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNlbGYuZmFkZUR1cmF0aW9uXG4gICAgICAgICk7XG4gICAgfVxuICAgIFxuICAgIHRoaXMuYnVzLnRyaWdnZXIoXCJ3c2UuYXNzZXRzLnRleHRib3gucHV0XCIsIHRoaXMsIGZhbHNlKTtcbiAgICBzZWxmLmludGVycHJldGVyLndhaXRDb3VudGVyIC09IDE7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZG9OZXh0OiBmYWxzZVxuICAgIH07XG4gICAgXG4gICAgZnVuY3Rpb24gcHV0VGV4dCAoKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAoc2VsZi50eXBlID09PSAnYWR2Jykge1xuICAgICAgICAgICAgdGV4dEVsZW1lbnQuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGV4dEVsZW1lbnQuaW5uZXJIVE1MICs9IG5hbWVQYXJ0ICsgdGV4dDtcbiAgICAgICAgbmFtZUVsZW1lbnQuaW5uZXJIVE1MID0gc2VsZi5uYW1lVGVtcGxhdGUucmVwbGFjZSgvXFx7bmFtZVxcfS9nLCBuYW1lKTtcbiAgICB9XG59O1xuXG5UZXh0Ym94LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLnRleHRFbGVtZW50KS5pbm5lckhUTUwgPSBcIlwiO1xuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMubmFtZUVsZW1lbnQpLmlubmVySFRNTCA9IFwiXCI7XG4gICAgdGhpcy5idXMudHJpZ2dlcihcIndzZS5hc3NldHMudGV4dGJveC5jbGVhclwiLCB0aGlzKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBkb05leHQ6IHRydWVcbiAgICB9O1xufTtcblxuVGV4dGJveC5wcm90b3R5cGUuc2F2ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBhc3NldFR5cGU6IFwiVGV4dGJveFwiLFxuICAgICAgICB0eXBlOiB0aGlzLnR5cGUsXG4gICAgICAgIHNob3dOYW1lczogdGhpcy5zaG93TmFtZXMsXG4gICAgICAgIG5sdG9icjogdGhpcy5ubHRvYnIsXG4gICAgICAgIGNzc2lkOiB0aGlzLmNzc2lkLFxuICAgICAgICBuYW1lRWxlbWVudDogdGhpcy5uYW1lRWxlbWVudCxcbiAgICAgICAgdGV4dEVsZW1lbnQ6IHRoaXMudGV4dEVsZW1lbnQsXG4gICAgICAgIHo6IHRoaXMuelxuICAgIH07XG59O1xuXG5UZXh0Ym94LnByb3RvdHlwZS5yZXN0b3JlID0gZnVuY3Rpb24gKHNhdmUpIHtcbiAgICBcbiAgICB0aGlzLnR5cGUgPSBzYXZlLnR5cGU7XG4gICAgdGhpcy5zaG93TmFtZXMgPSBzYXZlLnNob3dOYW1lcztcbiAgICB0aGlzLm5sdG9iciA9IHNhdmUubmx0b2JyO1xuICAgIHRoaXMuY3NzaWQgPSBzYXZlLmNzc2lkO1xuICAgIHRoaXMubmFtZUVsZW1lbnQgPSBzYXZlLm5hbWVFbGVtZW50O1xuICAgIHRoaXMudGV4dEVsZW1lbnQgPSBzYXZlLnRleHRFbGVtZW50O1xuICAgIHRoaXMueiA9IHNhdmUuejtcbiAgICBcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNzc2lkKS5zdHlsZS56SW5kZXggPSB0aGlzLno7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRleHRib3g7XG4iLCJcbnZhciBEYXRhQnVzID0gcmVxdWlyZShcImRhdGFidXNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IERhdGFCdXMoKTtcbiIsIlxudmFyIGFsZXJ0Q29tbWFuZCA9IHJlcXVpcmUoXCIuL2NvbW1hbmRzL2FsZXJ0XCIpO1xudmFyIGJyZWFrQ29tbWFuZCA9IHJlcXVpcmUoXCIuL2NvbW1hbmRzL2JyZWFrXCIpO1xudmFyIGNob2ljZUNvbW1hbmQgPSByZXF1aXJlKFwiLi9jb21tYW5kcy9jaG9pY2VcIik7XG52YXIgY29uZmlybUNvbW1hbmQgPSByZXF1aXJlKFwiLi9jb21tYW5kcy9jb25maXJtXCIpO1xudmFyIGRvQ29tbWFuZCA9IHJlcXVpcmUoXCIuL2NvbW1hbmRzL2RvXCIpO1xudmFyIGZuQ29tbWFuZCA9IHJlcXVpcmUoXCIuL2NvbW1hbmRzL2ZuXCIpO1xudmFyIGdsb2JhbENvbW1hbmQgPSByZXF1aXJlKFwiLi9jb21tYW5kcy9nbG9iYWxcIik7XG52YXIgZ2xvYmFsaXplQ29tbWFuZCA9IHJlcXVpcmUoXCIuL2NvbW1hbmRzL2dsb2JhbGl6ZVwiKTtcbnZhciBnb3RvQ29tbWFuZCA9IHJlcXVpcmUoXCIuL2NvbW1hbmRzL2dvdG9cIik7XG52YXIgbGluZUNvbW1hbmQgPSByZXF1aXJlKFwiLi9jb21tYW5kcy9saW5lXCIpO1xudmFyIGxvY2FsaXplQ29tbWFuZCA9IHJlcXVpcmUoXCIuL2NvbW1hbmRzL2xvY2FsaXplXCIpO1xudmFyIHByb21wdENvbW1hbmQgPSByZXF1aXJlKFwiLi9jb21tYW5kcy9wcm9tcHRcIik7XG52YXIgcmVzdGFydENvbW1hbmQgPSByZXF1aXJlKFwiLi9jb21tYW5kcy9yZXN0YXJ0XCIpO1xudmFyIHNldFZhcnNDb21tYW5kID0gcmVxdWlyZShcIi4vY29tbWFuZHMvc2V0X3ZhcnNcIik7XG52YXIgc3ViQ29tbWFuZCA9IHJlcXVpcmUoXCIuL2NvbW1hbmRzL3N1YlwiKTtcbnZhciB0cmlnZ2VyQ29tbWFuZCA9IHJlcXVpcmUoXCIuL2NvbW1hbmRzL3RyaWdnZXJcIik7XG52YXIgdmFyQ29tbWFuZCA9IHJlcXVpcmUoXCIuL2NvbW1hbmRzL3ZhclwiKTtcbnZhciB3YWl0Q29tbWFuZCA9IHJlcXVpcmUoXCIuL2NvbW1hbmRzL3dhaXRcIik7XG52YXIgd2hpbGVDb21tYW5kID0gcmVxdWlyZShcIi4vY29tbWFuZHMvd2hpbGVcIik7XG52YXIgd2l0aENvbW1hbmQgPSByZXF1aXJlKFwiLi9jb21tYW5kcy93aXRoXCIpO1xuXG52YXIgY29tbWFuZHMgPSB7XG4gICAgXCJhbGVydFwiOiBhbGVydENvbW1hbmQsXG4gICAgXCJicmVha1wiOiBicmVha0NvbW1hbmQsXG4gICAgXCJjaG9pY2VcIjogY2hvaWNlQ29tbWFuZCxcbiAgICBcImNvbmZpcm1cIjogY29uZmlybUNvbW1hbmQsXG4gICAgXCJkb1wiOiBkb0NvbW1hbmQsXG4gICAgXCJmblwiOiBmbkNvbW1hbmQsXG4gICAgXCJnbG9iYWxcIjogZ2xvYmFsQ29tbWFuZCxcbiAgICBcImdsb2JhbGl6ZVwiOiBnbG9iYWxpemVDb21tYW5kLFxuICAgIFwiZ290b1wiOiBnb3RvQ29tbWFuZCxcbiAgICBcImxpbmVcIjogbGluZUNvbW1hbmQsXG4gICAgXCJsb2NhbGl6ZVwiOiBsb2NhbGl6ZUNvbW1hbmQsXG4gICAgXCJwcm9tcHRcIjogcHJvbXB0Q29tbWFuZCxcbiAgICBcInJlc3RhcnRcIjogcmVzdGFydENvbW1hbmQsXG4gICAgXCJzZXRfdmFyc1wiOiBzZXRWYXJzQ29tbWFuZCxcbiAgICBcInN1YlwiOiBzdWJDb21tYW5kLFxuICAgIFwidHJpZ2dlclwiOiB0cmlnZ2VyQ29tbWFuZCxcbiAgICBcInZhclwiOiB2YXJDb21tYW5kLFxuICAgIFwid2FpdFwiOiB3YWl0Q29tbWFuZCxcbiAgICBcIndoaWxlXCI6IHdoaWxlQ29tbWFuZCxcbiAgICBcIndpdGhcIjogd2l0aENvbW1hbmRcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gY29tbWFuZHM7XG4iLCJcbnZhciB1aSA9IHJlcXVpcmUoXCIuLi90b29scy91aVwiKTtcbnZhciB0b29scyA9IHJlcXVpcmUoXCIuLi90b29scy90b29sc1wiKTtcblxudmFyIHJlcGxhY2VWYXJzID0gdG9vbHMucmVwbGFjZVZhcmlhYmxlcztcblxuZnVuY3Rpb24gYWxlcnQgKGNvbW1hbmQsIGludGVycHJldGVyKSB7XG4gICAgXG4gICAgdmFyIHRpdGxlLCBtZXNzYWdlLCBkb05leHQ7XG4gICAgXG4gICAgdGl0bGUgPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcInRpdGxlXCIpIHx8IFwiQWxlcnQhXCI7XG4gICAgbWVzc2FnZSA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwibWVzc2FnZVwiKSB8fCBcIkFsZXJ0IVwiO1xuICAgIFxuICAgIGRvTmV4dCA9IHJlcGxhY2VWYXJzKGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwibmV4dFwiKSB8fCBcIlwiLCBpbnRlcnByZXRlcikgPT09IFwiZmFsc2VcIiA/XG4gICAgICAgIGZhbHNlIDpcbiAgICAgICAgdHJ1ZTtcbiAgICBcbiAgICBtZXNzYWdlID0gcmVwbGFjZVZhcnMobWVzc2FnZSwgaW50ZXJwcmV0ZXIpO1xuICAgIHRpdGxlID0gcmVwbGFjZVZhcnModGl0bGUsIGludGVycHJldGVyKTtcbiAgICBcbiAgICBtZXNzYWdlID0gdG9vbHMudGV4dFRvSHRtbChtZXNzYWdlKTtcbiAgICBcbiAgICBpbnRlcnByZXRlci5idXMudHJpZ2dlcihcIndzZS5pbnRlcnByZXRlci5jb21tYW5kcy5hbGVydFwiLCBjb21tYW5kKTtcbiAgICBcbiAgICB1aS5hbGVydChcbiAgICAgICAgaW50ZXJwcmV0ZXIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgICAgICAgICBwYXVzZTogdHJ1ZSxcbiAgICAgICAgICAgIGRvTmV4dDogZG9OZXh0XG4gICAgICAgIH1cbiAgICApO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIGRvTmV4dDogdHJ1ZVxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYWxlcnQ7XG4iLCJcbmZ1bmN0aW9uIGJyZWFrRm4gKGNvbW1hbmQsIGludGVycHJldGVyKSB7XG4gICAgXG4gICAgaW50ZXJwcmV0ZXIuYnVzLnRyaWdnZXIoXG4gICAgICAgIFwid3NlLmludGVycHJldGVyLmNvbW1hbmRzLmJyZWFrXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGludGVycHJldGVyOiBpbnRlcnByZXRlcixcbiAgICAgICAgICAgIGNvbW1hbmQ6IGNvbW1hbmRcbiAgICAgICAgfSwgXG4gICAgICAgIGZhbHNlXG4gICAgKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBkb05leHQ6IGZhbHNlLFxuICAgICAgICB3YWl0OiB0cnVlXG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBicmVha0ZuO1xuIiwiXG52YXIgdG9vbHMgPSByZXF1aXJlKFwiLi4vdG9vbHMvdG9vbHNcIik7XG52YXIgRGlzcGxheU9iamVjdCA9IHJlcXVpcmUoXCIuLi9EaXNwbGF5T2JqZWN0XCIpO1xuXG5mdW5jdGlvbiBjaG9pY2UgKGNvbW1hbmQsIGludGVycHJldGVyKSB7XG4gICAgXG4gICAgdmFyIG1lbnVFbGVtZW50LCBidXR0b25zLCBjaGlsZHJlbiwgbGVuLCBpLCBjdXJyZW50O1xuICAgIHZhciBjdXJyZW50QnV0dG9uLCBzY2VuZXMsIHNlbGYsIHNjZW5lTmFtZTtcbiAgICB2YXIgbWFrZUJ1dHRvbkNsaWNrRm4sIG9sZFN0YXRlLCBjc3NpZDtcbiAgICBcbiAgICBpbnRlcnByZXRlci5idXMudHJpZ2dlcihcbiAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIuY29tbWFuZHMuY2hvaWNlXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGludGVycHJldGVyOiBpbnRlcnByZXRlcixcbiAgICAgICAgICAgIGNvbW1hbmQ6IGNvbW1hbmRcbiAgICAgICAgfSwgXG4gICAgICAgIGZhbHNlXG4gICAgKTtcbiAgICBcbiAgICBvbGRTdGF0ZSA9IGludGVycHJldGVyLnN0YXRlO1xuICAgIGludGVycHJldGVyLnN0YXRlID0gXCJwYXVzZVwiO1xuICAgIFxuICAgIGJ1dHRvbnMgPSBbXTtcbiAgICBzY2VuZXMgPSBbXTtcbiAgICBzZWxmID0gaW50ZXJwcmV0ZXI7XG4gICAgY2hpbGRyZW4gPSBjb21tYW5kLmNoaWxkTm9kZXM7XG4gICAgbGVuID0gY2hpbGRyZW4ubGVuZ3RoO1xuICAgIGNzc2lkID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJjc3NpZFwiKSB8fCBcIldTRUNob2ljZU1lbnVcIjtcbiAgICBcbiAgICBtYWtlQnV0dG9uQ2xpY2tGbiA9IGZ1bmN0aW9uIChjdXIsIG1lLCBzYywgaWR4KSB7XG4gICAgICAgIFxuICAgICAgICBzYyA9IHNjIHx8IG51bGw7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2V0VGltZW91dChcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB2YXIgY2hpbGRyZW5MZW4gPSBjdXIuY2hpbGROb2RlcyA/IGN1ci5jaGlsZE5vZGVzLmxlbmd0aCA6IDA7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB2YXIgb2xkSW5kZXggPSBpbnRlcnByZXRlci5pbmRleDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9sZFNjZW5lSWQgPSBpbnRlcnByZXRlci5zY2VuZUlkO1xuICAgICAgICAgICAgICAgICAgICB2YXIgb2xkU2NlbmVQYXRoID0gaW50ZXJwcmV0ZXIuc2NlbmVQYXRoLnNsaWNlKCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvbGRDdXJyZW50U2NlbmUgPSBpbnRlcnByZXRlci5jdXJyZW50U2NlbmU7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAoc2MgIT09IG51bGwpIHsgIFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jaGFuZ2VTY2VuZU5vTmV4dChzYyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGlmIChjaGlsZHJlbkxlbiA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXIucHVzaFRvQ2FsbFN0YWNrKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRlcnByZXRlci5jdXJyZW50Q29tbWFuZHMgPSBjdXIuY2hpbGROb2RlcztcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVycHJldGVyLnNjZW5lSWQgPSBvbGRTY2VuZUlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXIuc2NlbmVQYXRoID0gb2xkU2NlbmVQYXRoO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXIuc2NlbmVQYXRoLnB1c2gob2xkSW5kZXgtMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRlcnByZXRlci5zY2VuZVBhdGgucHVzaChpZHgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXIuaW5kZXggPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXIuY3VycmVudFNjZW5lID0gb2xkQ3VycmVudFNjZW5lO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXIuY3VycmVudEVsZW1lbnQgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBzZWxmLm5leHQoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIDBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNlbGYuc3RhZ2UucmVtb3ZlQ2hpbGQobWUpO1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgLT0gMTtcbiAgICAgICAgICAgIGludGVycHJldGVyLnN0YXRlID0gb2xkU3RhdGU7XG4gICAgICAgIH07XG4gICAgfTtcbiAgICBcbiAgICBpZiAobGVuIDwgMSkge1xuICAgICAgICBcbiAgICAgICAgaW50ZXJwcmV0ZXIuYnVzLnRyaWdnZXIoXG4gICAgICAgICAgICBcIndzZS5pbnRlcnByZXRlci53YXJuaW5nXCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZWxlbWVudDogY29tbWFuZCxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkVsZW1lbnQgJ2Nob2ljZScgaXMgZW1wdHkuIEV4cGVjdGVkIGF0IFwiICtcbiAgICAgICAgICAgICAgICAgICAgXCJsZWFzdCBvbmUgJ29wdGlvbicgZWxlbWVudC5cIlxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbiAgICBcbiAgICBtZW51RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgbWVudUVsZW1lbnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJtZW51XCIpO1xuICAgIG1lbnVFbGVtZW50LnNldEF0dHJpYnV0ZShcImlkXCIsIGNzc2lkKTtcbiAgICBcbiAgICAvLyBhc3NvY2lhdGUgSFRNTCBlbGVtZW50IHdpdGggWE1MIGVsZW1lbnQ7IHVzZWQgd2hlbiBsb2FkaW5nIHNhdmVnYW1lczpcbiAgICBtZW51RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXdzZS1pbmRleFwiLCBpbnRlcnByZXRlci5pbmRleCk7XG4gICAgbWVudUVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS13c2Utc2NlbmUtaWRcIiwgaW50ZXJwcmV0ZXIuc2NlbmVJZCk7XG4gICAgbWVudUVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS13c2UtZ2FtZVwiLCBpbnRlcnByZXRlci5nYW1lLnVybCk7XG4gICAgbWVudUVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS13c2UtdHlwZVwiLCBcImNob2ljZVwiKTtcbiAgICBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgXG4gICAgICAgIGN1cnJlbnQgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgXG4gICAgICAgIGlmICghY3VycmVudC50YWdOYW1lIHx8XG4gICAgICAgICAgICAgICAgY3VycmVudC50YWdOYW1lICE9PSBcIm9wdGlvblwiIHx8XG4gICAgICAgICAgICAgICAgIWludGVycHJldGVyLmNoZWNrSWZ2YXIoY3VycmVudCkpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGN1cnJlbnRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgIGN1cnJlbnRCdXR0b24uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJidXR0b25cIik7XG4gICAgICAgIGN1cnJlbnRCdXR0b24uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcbiAgICAgICAgY3VycmVudEJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0YWJpbmRleFwiLCBpICsgMSk7XG4gICAgICAgIGN1cnJlbnRCdXR0b24uc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgY3VycmVudC5nZXRBdHRyaWJ1dGUoXCJsYWJlbFwiKSk7XG4gICAgICAgIFxuICAgICAgICBjdXJyZW50QnV0dG9uLnZhbHVlID0gdG9vbHMucmVwbGFjZVZhcmlhYmxlcyhcbiAgICAgICAgICAgIGN1cnJlbnQuZ2V0QXR0cmlidXRlKFwibGFiZWxcIiksXG4gICAgICAgICAgICBpbnRlcnByZXRlclxuICAgICAgICApO1xuICAgICAgICBcbiAgICAgICAgc2NlbmVOYW1lID0gY3VycmVudC5nZXRBdHRyaWJ1dGUoXCJzY2VuZVwiKSB8fCBudWxsO1xuICAgICAgICBcbiAgICAgICAgc2NlbmVzW2ldID0gc2NlbmVOYW1lID8gaW50ZXJwcmV0ZXIuZ2V0U2NlbmVCeUlkKHNjZW5lTmFtZSkgOiBudWxsO1xuICAgICAgICBcbiAgICAgICAgY3VycmVudEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCBcbiAgICAgICAgICAgICdjbGljaycsXG4gICAgICAgICAgICBtYWtlQnV0dG9uQ2xpY2tGbihjdXJyZW50LCBtZW51RWxlbWVudCwgc2NlbmVzW2ldLCBpKVxuICAgICAgICApO1xuICAgICAgICBcbiAgICAgICAgYnV0dG9ucy5wdXNoKGN1cnJlbnRCdXR0b24pO1xuICAgICAgICBtZW51RWxlbWVudC5hcHBlbmRDaGlsZChjdXJyZW50QnV0dG9uKTtcbiAgICB9XG4gICAgXG4gICAgbWVudUVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgaW50ZXJwcmV0ZXIuc3RhZ2UuYXBwZW5kQ2hpbGQobWVudUVsZW1lbnQpO1xuICAgIFxuICAgIERpc3BsYXlPYmplY3QucHJvdG90eXBlLnNob3cuY2FsbChcbiAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICBjb21tYW5kLFxuICAgICAgICB7XG4gICAgICAgICAgICBlbGVtZW50OiBtZW51RWxlbWVudCxcbiAgICAgICAgICAgIGJ1czogaW50ZXJwcmV0ZXIuYnVzLFxuICAgICAgICAgICAgc3RhZ2U6IGludGVycHJldGVyLnN0YWdlLFxuICAgICAgICAgICAgaW50ZXJwcmV0ZXI6IGludGVycHJldGVyXG4gICAgICAgIH1cbiAgICApO1xuICAgIFxuICAgIGludGVycHJldGVyLndhaXRDb3VudGVyICs9IDE7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZG9OZXh0OiBmYWxzZSxcbiAgICAgICAgd2FpdDogdHJ1ZVxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2hvaWNlO1xuIiwiXG52YXIgdWkgPSByZXF1aXJlKFwiLi4vdG9vbHMvdWlcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gdWkubWFrZUlucHV0Rm4oXCJjb25maXJtXCIpO1xuIiwiXG52YXIgd2FybiA9IHJlcXVpcmUoXCIuLi90b29scy90b29sc1wiKS53YXJuO1xuXG5mdW5jdGlvbiBkb0NvbW1hbmQgKGNvbW1hbmQsIGludGVycHJldGVyLCBhcmdzKSB7XG4gICAgXG4gICAgdmFyIGFzc2V0TmFtZSwgYWN0aW9uLCBidXMgPSBpbnRlcnByZXRlci5idXMsIGFzc2V0cyA9IGludGVycHJldGVyLmFzc2V0cztcbiAgICBcbiAgICBhcmdzID0gYXJncyB8fCB7fTtcbiAgICBcbiAgICBidXMudHJpZ2dlcihcbiAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIuY29tbWFuZHMuZG9cIixcbiAgICAgICAge1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXI6IGludGVycHJldGVyLFxuICAgICAgICAgICAgY29tbWFuZDogY29tbWFuZFxuICAgICAgICB9LCBcbiAgICAgICAgZmFsc2VcbiAgICApO1xuICAgIFxuICAgIGFzc2V0TmFtZSA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwiYXNzZXRcIik7XG4gICAgYWN0aW9uID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJhY3Rpb25cIik7XG4gICAgXG4gICAgaWYgKGFzc2V0TmFtZSA9PT0gbnVsbCkge1xuICAgICAgICB3YXJuKGJ1cywgXCJFbGVtZW50IG9mIHR5cGUgJ2RvJyBtdXN0IGhhdmUgYW4gYXR0cmlidXRlICdhc3NldCcuIFwiICtcbiAgICAgICAgICAgIFwiRWxlbWVudCBpZ25vcmVkLlwiLCBjb21tYW5kKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICBpZiAoYWN0aW9uID09PSBudWxsKSB7XG4gICAgICAgIHdhcm4oYnVzLCBcIkVsZW1lbnQgb2YgdHlwZSAnZG8nIG11c3QgaGF2ZSBhbiBhdHRyaWJ1dGUgJ2FjdGlvbicuXCIgK1xuICAgICAgICAgICAgXCIgRWxlbWVudCBpZ25vcmVkLlwiLCBjb21tYW5kKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICBpZiAodHlwZW9mIGFzc2V0c1thc3NldE5hbWVdID09PSBcInVuZGVmaW5lZFwiIHx8IGFzc2V0c1thc3NldE5hbWVdID09PSBudWxsKSB7XG4gICAgICAgIHdhcm4oYnVzLCBcIlJlZmVyZW5jZSB0byB1bmtub3duIGFzc2V0ICdcIiArIGFzc2V0TmFtZSArIFwiJy5cIiwgY29tbWFuZCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkb05leHQ6IHRydWVcbiAgICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHR5cGVvZiBhc3NldHNbYXNzZXROYW1lXVthY3Rpb25dID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHdhcm4oYnVzLCBcIkFjdGlvbiAnXCIgKyBhY3Rpb24gKyBcIicgaXMgbm90IGRlZmluZWQgZm9yIGFzc2V0ICdcIiArXG4gICAgICAgICAgICBhc3NldE5hbWUgKyBcIicuXCIsIGNvbW1hbmQpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZG9OZXh0OiB0cnVlXG4gICAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBhc3NldHNbYXNzZXROYW1lXVthY3Rpb25dKGNvbW1hbmQsIGFyZ3MpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRvQ29tbWFuZDtcbiIsIlxudmFyIHdhcm4gPSByZXF1aXJlKFwiLi4vdG9vbHMvdG9vbHNcIikud2FybjtcbnZhciBmdW5jdGlvbnMgPSByZXF1aXJlKFwiLi4vZnVuY3Rpb25zXCIpO1xuXG5mdW5jdGlvbiBmbiAoY29tbWFuZCwgaW50ZXJwcmV0ZXIpIHtcbiAgICBcbiAgICB2YXIgbmFtZSwgdmFyTmFtZSwgcmV0O1xuICAgIFxuICAgIG5hbWUgPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcIm5hbWVcIikgfHwgbnVsbDtcbiAgICB2YXJOYW1lID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJ0b3ZhclwiKSB8fCBudWxsO1xuICAgIFxuICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICB3YXJuKGludGVycHJldGVyLmJ1cywgXCJObyBuYW1lIHN1cHBsaWVkIG9uIGZuIGVsZW1lbnQuXCIsIGNvbW1hbmQpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZG9OZXh0OiB0cnVlXG4gICAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIGlmICh0eXBlb2YgZnVuY3Rpb25zW25hbWVdICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgd2FybihpbnRlcnByZXRlci5idXMsIFwiVW5rbm93biBmdW5jdGlvbiAnXCIgKyBuYW1lICsgXCInLlwiLCBjb21tYW5kKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRvTmV4dDogdHJ1ZVxuICAgICAgICB9O1xuICAgIH1cbiAgICBcbiAgICByZXQgPSBmdW5jdGlvbnNbbmFtZV0oaW50ZXJwcmV0ZXIpO1xuICAgIFxuICAgIGlmICh2YXJOYW1lICE9PSBudWxsKXtcbiAgICAgICAgaW50ZXJwcmV0ZXIucnVuVmFyc1t2YXJOYW1lXSA9IFwiXCIgKyByZXQ7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIGRvTmV4dDogdHJ1ZVxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZm47XG4iLCJcbnZhciB3YXJuID0gcmVxdWlyZShcIi4uL3Rvb2xzL3Rvb2xzXCIpLndhcm47XG5cbmZ1bmN0aW9uIGdsb2JhbENvbW1hbmQgKGNvbW1hbmQsIGludGVycHJldGVyKSB7XG4gICAgXG4gICAgdmFyIG5hbWUsIHZhbHVlLCBuZXh0O1xuICAgIFxuICAgIG5hbWUgPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcIm5hbWVcIikgfHwgbnVsbDtcbiAgICB2YWx1ZSA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwidmFsdWVcIikgfHwgbnVsbDtcbiAgICBuZXh0ID0ge2RvTmV4dDogdHJ1ZX07XG4gICAgXG4gICAgaWYgKG5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgd2FybihpbnRlcnByZXRlci5idXMsIFwiTm8gbmFtZSBkZWZpbmVkIG9uIGVsZW1lbnQgJ2dsb2JhbCcuXCIsIGNvbW1hbmQpO1xuICAgICAgICByZXR1cm4gbmV4dDtcbiAgICB9XG4gICAgXG4gICAgaWYgKHZhbHVlID09PSBudWxsKSB7XG4gICAgICAgIHdhcm4oaW50ZXJwcmV0ZXIuYnVzLCBcIk5vIHZhbHVlIGRlZmluZWQgb24gZWxlbWVudCAnZ2xvYmFsJy5cIiwgY29tbWFuZCk7XG4gICAgICAgIHJldHVybiBuZXh0O1xuICAgIH1cbiAgICBcbiAgICBpbnRlcnByZXRlci5nbG9iYWxWYXJzLnNldChuYW1lLCB2YWx1ZSk7XG4gICAgXG4gICAgcmV0dXJuIG5leHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2xvYmFsQ29tbWFuZDtcbiIsIlxudmFyIHdhcm4gPSByZXF1aXJlKFwiLi4vdG9vbHMvdG9vbHNcIikud2FybjtcblxuZnVuY3Rpb24gZ2xvYmFsaXplIChjb21tYW5kLCBpbnRlcnByZXRlcikge1xuICAgIFxuICAgIHZhciBrZXksIG5leHQ7XG4gICAgXG4gICAga2V5ID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpIHx8IG51bGw7XG4gICAgbmV4dCA9IHtkb05leHQ6IHRydWV9O1xuICAgIFxuICAgIGlmIChrZXkgPT09IG51bGwpIHtcbiAgICAgICAgd2FybihpbnRlcnByZXRlci5idXMsIFwiTm8gdmFyaWFibGUgbmFtZSBkZWZpbmVkIG9uIGdsb2JhbGl6ZSBlbGVtZW50LlwiLCBjb21tYW5kKTtcbiAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfVxuICAgIFxuICAgIGlmICh0eXBlb2YgaW50ZXJwcmV0ZXIucnVuVmFyc1trZXldID09PSBcInVuZGVmaW5lZFwiIHx8IGludGVycHJldGVyLnJ1blZhcnNba2V5XSA9PT0gbnVsbCkge1xuICAgICAgICB3YXJuKGludGVycHJldGVyLmJ1cywgXCJVbmRlZmluZWQgbG9jYWwgdmFyaWFibGUuXCIsIGNvbW1hbmQpO1xuICAgICAgICByZXR1cm4gbmV4dDtcbiAgICB9XG4gICAgXG4gICAgaW50ZXJwcmV0ZXIuZ2xvYmFsVmFycy5zZXQoa2V5LCBpbnRlcnByZXRlci5ydW5WYXJzW2tleV0pO1xuICAgIFxuICAgIHJldHVybiBuZXh0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdsb2JhbGl6ZTtcbiIsIlxudmFyIHRvb2xzID0gcmVxdWlyZShcIi4uL3Rvb2xzL3Rvb2xzXCIpO1xuXG52YXIgbG9nRXJyb3IgPSB0b29scy5sb2dFcnJvcjtcbnZhciByZXBsYWNlVmFycyA9IHRvb2xzLnJlcGxhY2VWYXJpYWJsZXM7XG5cbmZ1bmN0aW9uIGdvdG9Db21tYW5kIChjb21tYW5kLCBpbnRlcnByZXRlcikge1xuICAgIFxuICAgIHZhciBzY2VuZSwgc2NlbmVOYW1lLCBidXMgPSBpbnRlcnByZXRlci5idXM7XG4gICAgXG4gICAgYnVzLnRyaWdnZXIoXG4gICAgICAgIFwid3NlLmludGVycHJldGVyLmNvbW1hbmRzLmdvdG9cIixcbiAgICAgICAge1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXI6IGludGVycHJldGVyLFxuICAgICAgICAgICAgY29tbWFuZDogY29tbWFuZFxuICAgICAgICB9LCBcbiAgICAgICAgZmFsc2VcbiAgICApO1xuICAgIFxuICAgIHNjZW5lTmFtZSA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwic2NlbmVcIik7XG4gICAgXG4gICAgaWYgKHNjZW5lTmFtZSA9PT0gbnVsbCkge1xuICAgICAgICBsb2dFcnJvcihidXMsIFwiRWxlbWVudCAnZ290bycgbWlzc2VzIGF0dHJpYnV0ZSAnc2NlbmUnLlwiKTtcbiAgICB9XG4gICAgXG4gICAgc2NlbmVOYW1lID0gcmVwbGFjZVZhcnMoc2NlbmVOYW1lLCBpbnRlcnByZXRlcik7XG4gICAgXG4gICAgc2NlbmUgPSBpbnRlcnByZXRlci5nZXRTY2VuZUJ5SWQoc2NlbmVOYW1lKTtcbiAgICBcbiAgICBpZiAoc2NlbmUgPT09IG51bGwpIHtcbiAgICAgICAgbG9nRXJyb3IoYnVzLCBcIlVua25vd24gc2NlbmUgJ1wiICsgc2NlbmVOYW1lICsgXCInLlwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBjaGFuZ2VTY2VuZTogc2NlbmVcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdvdG9Db21tYW5kO1xuIiwiXG52YXIgdG9vbHMgPSByZXF1aXJlKFwiLi4vdG9vbHMvdG9vbHNcIik7XG5cbnZhciB3YXJuID0gdG9vbHMud2FybjtcbnZhciBnZXRTZXJpYWxpemVkTm9kZXMgPSB0b29scy5nZXRTZXJpYWxpemVkTm9kZXM7XG5cbmZ1bmN0aW9uIGxpbmUgKGNvbW1hbmQsIGludGVycHJldGVyKSB7XG4gICAgXG4gICAgdmFyIHNwZWFrZXJJZCwgc3BlYWtlck5hbWUsIHRleHRib3hOYW1lLCBpLCBsZW4sIGN1cnJlbnQ7XG4gICAgdmFyIGFzc2V0RWxlbWVudHMsIHRleHQsIGRvTmV4dCwgYnVzID0gaW50ZXJwcmV0ZXIuYnVzLCBuZXh0O1xuICAgIFxuICAgIG5leHQgPSB7ZG9OZXh0OiB0cnVlfTtcbiAgICBcbiAgICBidXMudHJpZ2dlcihcbiAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIuY29tbWFuZHMubGluZVwiLFxuICAgICAgICB7XG4gICAgICAgICAgICBpbnRlcnByZXRlcjogaW50ZXJwcmV0ZXIsXG4gICAgICAgICAgICBjb21tYW5kOiBjb21tYW5kXG4gICAgICAgIH0sIFxuICAgICAgICBmYWxzZVxuICAgICk7XG4gICAgXG4gICAgc3BlYWtlcklkID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJzXCIpO1xuICAgIGRvTmV4dCA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwic3RvcFwiKSA9PT0gXCJmYWxzZVwiID8gdHJ1ZSA6IGZhbHNlO1xuICAgIFxuICAgIGlmIChzcGVha2VySWQgPT09IG51bGwpIHtcbiAgICAgICAgd2FybihidXMsIFwiRWxlbWVudCAnbGluZScgcmVxdWlyZXMgYXR0cmlidXRlICdzJy5cIiwgY29tbWFuZCk7XG4gICAgICAgIHJldHVybiBuZXh0O1xuICAgIH1cbiAgICBcbiAgICBhc3NldEVsZW1lbnRzID0gaW50ZXJwcmV0ZXIuc3RvcnkuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJjaGFyYWN0ZXJcIik7XG4gICAgbGVuID0gYXNzZXRFbGVtZW50cy5sZW5ndGg7XG4gICAgXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgIFxuICAgICAgICBjdXJyZW50ID0gYXNzZXRFbGVtZW50c1tpXTtcbiAgICAgICAgXG4gICAgICAgIGlmIChjdXJyZW50LmdldEF0dHJpYnV0ZShcIm5hbWVcIikgPT09IHNwZWFrZXJJZCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0ZXh0Ym94TmFtZSA9IGN1cnJlbnQuZ2V0QXR0cmlidXRlKFwidGV4dGJveFwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHR5cGVvZiB0ZXh0Ym94TmFtZSA9PT0gXCJ1bmRlZmluZWRcIiB8fCB0ZXh0Ym94TmFtZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHdhcm4oYnVzLCBcIk5vIHRleHRib3ggZGVmaW5lZCBmb3IgY2hhcmFjdGVyICdcIiArIHNwZWFrZXJJZCArIFwiJy5cIiwgY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgc3BlYWtlck5hbWUgPVxuICAgICAgICAgICAgICAgICAgICBnZXRTZXJpYWxpemVkTm9kZXMoY3VycmVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImRpc3BsYXluYW1lXCIpWzBdKS50cmltKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge31cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgaWYgKHR5cGVvZiBpbnRlcnByZXRlci5hc3NldHNbdGV4dGJveE5hbWVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIHdhcm4oYnVzLCBcIlRyeWluZyB0byB1c2UgYW4gdW5rbm93biB0ZXh0Ym94IG9yIGNoYXJhY3Rlci5cIiwgY29tbWFuZCk7XG4gICAgICAgIHJldHVybiBuZXh0O1xuICAgIH1cbiAgICBcbiAgICB0ZXh0ID0gZ2V0U2VyaWFsaXplZE5vZGVzKGNvbW1hbmQpO1xuICAgIFxuICAgIGludGVycHJldGVyLmxvZy5wdXNoKHtzcGVha2VyOiBzcGVha2VySWQsIHRleHQ6IHRleHR9KTtcbiAgICBpbnRlcnByZXRlci5hc3NldHNbdGV4dGJveE5hbWVdLnB1dCh0ZXh0LCBzcGVha2VyTmFtZSwgc3BlYWtlcklkKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBkb05leHQ6IGRvTmV4dCxcbiAgICAgICAgd2FpdDogdHJ1ZVxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGluZTtcbiIsIlxudmFyIHdhcm4gPSByZXF1aXJlKFwiLi4vdG9vbHMvdG9vbHNcIikud2FybjtcblxuZnVuY3Rpb24gbG9jYWxpemUgKGNvbW1hbmQsIGludGVycHJldGVyKSB7XG4gICAgXG4gICAgdmFyIGtleSwgbmV4dDtcbiAgICBcbiAgICBuZXh0ID0ge2RvTmV4dDogdHJ1ZX07XG4gICAga2V5ID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpIHx8IG51bGw7XG4gICAgXG4gICAgaWYgKGtleSA9PT0gbnVsbCkge1xuICAgICAgICB3YXJuKGludGVycHJldGVyLmJ1cywgXCJObyB2YXJpYWJsZSBuYW1lIGRlZmluZWQgb24gbG9jYWxpemUgZWxlbWVudC5cIiwgY29tbWFuZCk7XG4gICAgICAgIHJldHVybiBuZXh0O1xuICAgIH1cbiAgICBcbiAgICBpZiAoIWludGVycHJldGVyLmdsb2JhbFZhcnMuaGFzKGtleSkpIHtcbiAgICAgICAgd2FybihpbnRlcnByZXRlci5idXMsIFwiVW5kZWZpbmVkIGdsb2JhbCB2YXJpYWJsZS5cIiwgY29tbWFuZCk7XG4gICAgICAgIHJldHVybiBuZXh0O1xuICAgIH1cbiAgICBcbiAgICBpbnRlcnByZXRlci5ydW5WYXJzW2tleV0gPSBpbnRlcnByZXRlci5nbG9iYWxWYXJzLmdldChrZXkpO1xuICAgIFxuICAgIHJldHVybiBuZXh0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxvY2FsaXplO1xuIiwiXG52YXIgdWkgPSByZXF1aXJlKFwiLi4vdG9vbHMvdWlcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gdWkubWFrZUlucHV0Rm4oXCJwcm9tcHRcIik7XG4iLCJcbmZ1bmN0aW9uIHJlc3RhcnQgKGNvbW1hbmQsIGludGVycHJldGVyKSB7XG4gICAgXG4gICAgaW50ZXJwcmV0ZXIuYnVzLnRyaWdnZXIoXG4gICAgICAgIFwid3NlLmludGVycHJldGVyLmNvbW1hbmRzLnJlc3RhcnRcIixcbiAgICAgICAge1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXI6IGludGVycHJldGVyLFxuICAgICAgICAgICAgY29tbWFuZDogY29tbWFuZFxuICAgICAgICB9LCBcbiAgICAgICAgZmFsc2VcbiAgICApO1xuICAgIFxuICAgIGludGVycHJldGVyLmJ1cy50cmlnZ2VyKFwid3NlLmludGVycHJldGVyLm1lc3NhZ2VcIiwgXCJSZXN0YXJ0aW5nIGdhbWUuLi5cIiwgZmFsc2UpO1xuICAgIGludGVycHJldGVyLmJ1cy50cmlnZ2VyKFwid3NlLmludGVycHJldGVyLnJlc3RhcnRcIiwgaW50ZXJwcmV0ZXIsIGZhbHNlKTtcbiAgICBcbiAgICBpbnRlcnByZXRlci5ydW5WYXJzID0ge307XG4gICAgaW50ZXJwcmV0ZXIubG9nID0gW107XG4gICAgaW50ZXJwcmV0ZXIudmlzaXRlZFNjZW5lcyA9IFtdO1xuICAgIGludGVycHJldGVyLnN0YXJ0VGltZSA9IE1hdGgucm91bmQoK25ldyBEYXRlKCkgLyAxMDAwKTtcbiAgICBpbnRlcnByZXRlci53YWl0Q291bnRlciA9IDA7XG4gICAgaW50ZXJwcmV0ZXIuc3RhdGUgPSBcImxpc3RlblwiO1xuICAgIGludGVycHJldGVyLnN0YWdlLmlubmVySFRNTCA9IFwiXCI7XG4gICAgXG4gICAgaW50ZXJwcmV0ZXIuYXNzZXRzID0ge307XG4gICAgaW50ZXJwcmV0ZXIuYnVpbGRBc3NldHMoKTtcbiAgICBpbnRlcnByZXRlci5jYWxsT25Mb2FkKCk7XG4gICAgXG4gICAgd2hpbGUgKGludGVycHJldGVyLmNhbGxTdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgIGludGVycHJldGVyLmNhbGxTdGFjay5zaGlmdCgpO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBkb05leHQ6IHRydWUsXG4gICAgICAgIGNoYW5nZVNjZW5lOiBpbnRlcnByZXRlci5nZXRGaXJzdFNjZW5lKClcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJlc3RhcnQ7XG4iLCJcbnZhciBsb2dFcnJvciA9IHJlcXVpcmUoXCIuLi90b29scy90b29sc1wiKS5sb2dFcnJvcjtcblxuZnVuY3Rpb24gc2V0VmFycyAoY29tbWFuZCwgaW50ZXJwcmV0ZXIpIHtcbiAgICBcbiAgICB2YXIgY29udGFpbmVyID0gaW50ZXJwcmV0ZXIucnVuVmFycywga2V5cywgdmFsdWVzLCBuZXh0O1xuICAgIFxuICAgIG5leHQgPSB7ZG9OZXh0OiB0cnVlfTtcbiAgICBrZXlzID0gKGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwibmFtZXNcIikgfHwgXCJcIikuc3BsaXQoXCIsXCIpO1xuICAgIHZhbHVlcyA9IChjb21tYW5kLmdldEF0dHJpYnV0ZShcInZhbHVlc1wiKSB8fCBcIlwiKS5zcGxpdChcIixcIik7XG4gICAgXG4gICAgaWYgKGtleXMubGVuZ3RoICE9PSB2YWx1ZXMubGVuZ3RoKSB7XG4gICAgICAgIGxvZ0Vycm9yKGludGVycHJldGVyLmJ1cywgXCJOdW1iZXIgb2YgbmFtZXMgZG9lcyBub3QgbWF0Y2ggbnVtYmVyIG9mIHZhbHVlcyBcIiArXG4gICAgICAgICAgICBcImluIDxzZXRfdmFycz4gY29tbWFuZC5cIik7XG4gICAgICAgIHJldHVybiBuZXh0O1xuICAgIH1cbiAgICBcbiAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSwgaSkge1xuICAgICAgICBjb250YWluZXJba2V5LnRyaW0oKV0gPSBcIlwiICsgdmFsdWVzW2ldLnRyaW0oKTtcbiAgICB9KTtcbiAgICBcbiAgICByZXR1cm4gbmV4dDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXRWYXJzO1xuIiwiXG52YXIgdG9vbHMgPSByZXF1aXJlKFwiLi4vdG9vbHMvdG9vbHNcIik7XG52YXIgc2V0VmFycyA9IHJlcXVpcmUoXCIuL3NldF92YXJzXCIpO1xuXG52YXIgbG9nID0gdG9vbHMubG9nO1xudmFyIHdhcm4gPSB0b29scy53YXJuO1xudmFyIGxvZ0Vycm9yID0gdG9vbHMubG9nRXJyb3I7XG52YXIgcmVwbGFjZVZhcnMgPSB0b29scy5yZXBsYWNlVmFyaWFibGVzO1xuXG5mdW5jdGlvbiBzdWIgKGNvbW1hbmQsIGludGVycHJldGVyKSB7XG4gICAgXG4gICAgdmFyIHNjZW5lSWQsIHNjZW5lLCBkb05leHQsIG5leHQ7XG4gICAgXG4gICAgaW50ZXJwcmV0ZXIuYnVzLnRyaWdnZXIoXG4gICAgICAgIFwid3NlLmludGVycHJldGVyLmNvbW1hbmRzLnN1YlwiLFxuICAgICAgICB7XG4gICAgICAgICAgICBpbnRlcnByZXRlcjogaW50ZXJwcmV0ZXIsXG4gICAgICAgICAgICBjb21tYW5kOiBjb21tYW5kXG4gICAgICAgIH0sIFxuICAgICAgICBmYWxzZVxuICAgICk7XG4gICAgXG4gICAgbmV4dCA9IHtkb05leHQ6IHRydWV9O1xuICAgIHNjZW5lSWQgPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcInNjZW5lXCIpIHx8IG51bGw7XG4gICAgZG9OZXh0ID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJuZXh0XCIpID09PSBmYWxzZSA/IGZhbHNlIDogdHJ1ZTtcbiAgICBcbiAgICBpZiAoc2NlbmVJZCA9PT0gbnVsbCkge1xuICAgICAgICB3YXJuKGludGVycHJldGVyLmJ1cywgXCJNaXNzaW5nICdzY2VuZScgYXR0cmlidXRlIG9uICdzdWInIGNvbW1hbmQhXCIsIGNvbW1hbmQpO1xuICAgICAgICByZXR1cm4gbmV4dDtcbiAgICB9XG4gICAgXG4gICAgc2NlbmVJZCA9IHJlcGxhY2VWYXJzKHNjZW5lSWQsIGludGVycHJldGVyKTtcbiAgICBzY2VuZSA9IGludGVycHJldGVyLmdldFNjZW5lQnlJZChzY2VuZUlkKTtcbiAgICBcbiAgICBpZiAoIXNjZW5lKSB7XG4gICAgICAgIGxvZ0Vycm9yKGludGVycHJldGVyLmJ1cywgXCJObyBzdWNoIHNjZW5lICdcIiArIHNjZW5lSWQgKyBcIichXCIsIGNvbW1hbmQpO1xuICAgICAgICByZXR1cm4gbmV4dDtcbiAgICB9XG4gICAgXG4gICAgbG9nKGludGVycHJldGVyLmJ1cywgXCJFbnRlcmluZyBzdWIgc2NlbmUgJ1wiICsgc2NlbmVJZCArIFwiJy4uLlwiKTtcbiAgICBcbiAgICBpbnRlcnByZXRlci5wdXNoVG9DYWxsU3RhY2soKTtcbiAgICBcbiAgICBpbnRlcnByZXRlci5jdXJyZW50Q29tbWFuZHMgPSBzY2VuZS5jaGlsZE5vZGVzO1xuICAgIGludGVycHJldGVyLmluZGV4ID0gLTE7XG4gICAgaW50ZXJwcmV0ZXIuc2NlbmVJZCA9IHNjZW5lSWQ7XG4gICAgaW50ZXJwcmV0ZXIuc2NlbmVQYXRoID0gW107XG4gICAgaW50ZXJwcmV0ZXIuY3VycmVudEVsZW1lbnQgPSAtMTtcbiAgICBcbiAgICBpZiAoY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJuYW1lc1wiKSkge1xuICAgICAgICBzZXRWYXJzKGNvbW1hbmQsIGludGVycHJldGVyKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZG9OZXh0OiBkb05leHRcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN1YjtcbiIsIlxudmFyIHdhcm4gPSByZXF1aXJlKFwiLi4vdG9vbHMvdG9vbHNcIikud2FybjtcblxuZnVuY3Rpb24gdHJpZ2dlciAoY29tbWFuZCwgaW50ZXJwcmV0ZXIpIHtcbiAgICBcbiAgICB2YXIgdHJpZ2dlck5hbWUsIGFjdGlvbiwgbmV4dDtcbiAgICBcbiAgICBuZXh0ID0ge2RvTmV4dDogdHJ1ZX07XG4gICAgXG4gICAgaW50ZXJwcmV0ZXIuYnVzLnRyaWdnZXIoXG4gICAgICAgIFwid3NlLmludGVycHJldGVyLmNvbW1hbmRzLnRyaWdnZXJcIixcbiAgICAgICAge1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXI6IGludGVycHJldGVyLFxuICAgICAgICAgICAgY29tbWFuZDogY29tbWFuZFxuICAgICAgICB9LCBcbiAgICAgICAgZmFsc2VcbiAgICApO1xuICAgIFxuICAgIHRyaWdnZXJOYW1lID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpIHx8IG51bGw7XG4gICAgYWN0aW9uID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJhY3Rpb25cIikgfHwgbnVsbDtcbiAgICBcbiAgICBpZiAodHJpZ2dlck5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgd2FybihpbnRlcnByZXRlci5idXMsIFwiTm8gbmFtZSBzcGVjaWZpZWQgb24gdHJpZ2dlciBjb21tYW5kLlwiLCBjb21tYW5kKTtcbiAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfVxuICAgIFxuICAgIGlmIChhY3Rpb24gPT09IG51bGwpIHtcbiAgICAgICAgd2FybihpbnRlcnByZXRlci5idXMsIFwiTm8gYWN0aW9uIHNwZWNpZmllZCBvbiB0cmlnZ2VyIGNvbW1hbmQgXCIgK1xuICAgICAgICAgICAgXCJyZWZlcmVuY2luZyB0cmlnZ2VyICdcIiArIHRyaWdnZXJOYW1lICsgXCInLlwiLCBjb21tYW5kKTtcbiAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfVxuICAgIFxuICAgIGlmIChcbiAgICAgICAgdHlwZW9mIGludGVycHJldGVyLnRyaWdnZXJzW3RyaWdnZXJOYW1lXSA9PT0gXCJ1bmRlZmluZWRcIiB8fFxuICAgICAgICBpbnRlcnByZXRlci50cmlnZ2Vyc1t0cmlnZ2VyTmFtZV0gPT09IG51bGxcbiAgICApIHtcbiAgICAgICAgd2FybihpbnRlcnByZXRlci5idXMsIFwiUmVmZXJlbmNlIHRvIHVua25vd24gdHJpZ2dlciAnXCIgKyB0cmlnZ2VyTmFtZSArIFwiJy5cIiwgY29tbWFuZCk7XG4gICAgICAgIHJldHVybiBuZXh0O1xuICAgIH1cbiAgICBcbiAgICBpZiAodHlwZW9mIGludGVycHJldGVyLnRyaWdnZXJzW3RyaWdnZXJOYW1lXVthY3Rpb25dICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgd2FybihpbnRlcnByZXRlci5idXMsIFwiVW5rbm93biBhY3Rpb24gJ1wiICsgYWN0aW9uICtcbiAgICAgICAgICAgIFwiJyBvbiB0cmlnZ2VyIGNvbW1hbmQgcmVmZXJlbmNpbmcgdHJpZ2dlciAnXCIgKyB0cmlnZ2VyTmFtZSArIFwiJy5cIiwgY29tbWFuZCk7XG4gICAgICAgIHJldHVybiBuZXh0O1xuICAgIH1cbiAgICBcbiAgICBpbnRlcnByZXRlci50cmlnZ2Vyc1t0cmlnZ2VyTmFtZV1bYWN0aW9uXShjb21tYW5kKTtcbiAgICBcbiAgICByZXR1cm4gbmV4dDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0cmlnZ2VyO1xuIiwiXG52YXIgdG9vbHMgPSByZXF1aXJlKFwiLi4vdG9vbHMvdG9vbHNcIik7XG5cbnZhciBsb2cgPSB0b29scy5sb2c7XG52YXIgd2FybiA9IHRvb2xzLndhcm47XG52YXIgcmVwbGFjZVZhcnMgPSB0b29scy5yZXBsYWNlVmFyaWFibGVzO1xuXG5mdW5jdGlvbiB2YXJDb21tYW5kIChjb21tYW5kLCBpbnRlcnByZXRlcikge1xuICAgIFxuICAgIHZhciBrZXksIHZhbCwgbHZhbCwgYWN0aW9uLCBjb250YWluZXIsIG5leHQ7XG4gICAgXG4gICAgbmV4dCA9IHtkb05leHQ6IHRydWV9O1xuICAgIFxuICAgIGludGVycHJldGVyLmJ1cy50cmlnZ2VyKFxuICAgICAgICBcIndzZS5pbnRlcnByZXRlci5jb21tYW5kcy52YXJcIixcbiAgICAgICAge1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXI6IGludGVycHJldGVyLFxuICAgICAgICAgICAgY29tbWFuZDogY29tbWFuZFxuICAgICAgICB9LCBcbiAgICAgICAgZmFsc2VcbiAgICApO1xuICAgIFxuICAgIGtleSA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwibmFtZVwiKSB8fCBudWxsO1xuICAgIHZhbCA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwidmFsdWVcIikgfHwgXCIxXCI7XG4gICAgYWN0aW9uID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJhY3Rpb25cIikgfHwgXCJzZXRcIjtcbiAgICBcbiAgICBpZiAoa2V5ID09PSBudWxsKSB7XG4gICAgICAgIHdhcm4oaW50ZXJwcmV0ZXIuYnVzLCBcIkNvbW1hbmQgJ3ZhcicgbXVzdCBoYXZlIGEgJ25hbWUnIGF0dHJpYnV0ZS5cIiwgY29tbWFuZCk7XG4gICAgICAgIHJldHVybiBuZXh0O1xuICAgIH1cbiAgICBcbiAgICBjb250YWluZXIgPSBpbnRlcnByZXRlci5ydW5WYXJzO1xuICAgIFxuICAgIGlmIChhY3Rpb24gIT09IFwic2V0XCIgJiYgIShrZXkgaW4gY29udGFpbmVyIHx8IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwibHZhbHVlXCIpKSkge1xuICAgICAgICB3YXJuKGludGVycHJldGVyLmJ1cywgXCJVbmRlZmluZWQgdmFyaWFibGUuXCIsIGNvbW1hbmQpO1xuICAgICAgICByZXR1cm4gbmV4dDtcbiAgICB9XG4gICAgXG4gICAgdmFsICA9IHJlcGxhY2VWYXJzKHZhbCwgIGludGVycHJldGVyKTtcbiAgICBcbiAgICBpZiAoYWN0aW9uID09PSBcInNldFwiKSB7XG4gICAgICAgIGNvbnRhaW5lcltrZXldID0gXCJcIiArIHZhbDtcbiAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfVxuICAgIFxuICAgIGx2YWwgPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcImx2YWx1ZVwiKSB8fCBjb250YWluZXJba2V5XTtcbiAgICBsdmFsID0gcmVwbGFjZVZhcnMobHZhbCwgaW50ZXJwcmV0ZXIpO1xuICAgIFxuICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgIFxuICAgICAgICBjYXNlIFwiZGVsZXRlXCI6XG4gICAgICAgICAgICBkZWxldGUgY29udGFpbmVyW2tleV07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgXG4gICAgICAgIGNhc2UgXCJpbmNyZWFzZVwiOlxuICAgICAgICAgICAgY29udGFpbmVyW2tleV0gPSBcIlwiICsgKHBhcnNlRmxvYXQobHZhbCkgKyBwYXJzZUZsb2F0KHZhbCkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJkZWNyZWFzZVwiOlxuICAgICAgICAgICAgY29udGFpbmVyW2tleV0gPSBcIlwiICsgKHBhcnNlRmxvYXQobHZhbCkgLSBwYXJzZUZsb2F0KHZhbCkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJtdWx0aXBseVwiOlxuICAgICAgICAgICAgY29udGFpbmVyW2tleV0gPSBcIlwiICsgKHBhcnNlRmxvYXQobHZhbCkgKiBwYXJzZUZsb2F0KHZhbCkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJkaXZpZGVcIjpcbiAgICAgICAgICAgIGNvbnRhaW5lcltrZXldID0gXCJcIiArIChwYXJzZUZsb2F0KGx2YWwpIC8gcGFyc2VGbG9hdCh2YWwpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibW9kdWx1c1wiOlxuICAgICAgICAgICAgY29udGFpbmVyW2tleV0gPSBcIlwiICsgKHBhcnNlRmxvYXQobHZhbCkgJSBwYXJzZUZsb2F0KHZhbCkpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSBcImFuZFwiOlxuICAgICAgICAgICAgY29udGFpbmVyW2tleV0gPSBcIlwiICsgKHBhcnNlRmxvYXQobHZhbCkgJiYgcGFyc2VGbG9hdCh2YWwpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwib3JcIjpcbiAgICAgICAgICAgIGNvbnRhaW5lcltrZXldID0gXCJcIiArIChwYXJzZUZsb2F0KGx2YWwpIHx8IHBhcnNlRmxvYXQodmFsKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm5vdFwiOlxuICAgICAgICAgICAgY29udGFpbmVyW2tleV0gPSBwYXJzZUZsb2F0KGx2YWwpID8gXCIwXCIgOiBcIjFcIjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBcbiAgICAgICAgY2FzZSBcImlzX2dyZWF0ZXJcIjpcbiAgICAgICAgICAgIGNvbnRhaW5lcltrZXldID0gcGFyc2VGbG9hdChsdmFsKSA+IHBhcnNlRmxvYXQodmFsKSA/IFwiMVwiIDogXCIwXCI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImlzX2xlc3NcIjpcbiAgICAgICAgICAgIGNvbnRhaW5lcltrZXldID0gcGFyc2VGbG9hdChsdmFsKSA8IHBhcnNlRmxvYXQodmFsKSA/IFwiMVwiIDogXCIwXCI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImlzX2VxdWFsXCI6XG4gICAgICAgICAgICBjb250YWluZXJba2V5XSA9IHBhcnNlRmxvYXQobHZhbCkgPT09IHBhcnNlRmxvYXQodmFsKSA/IFwiMVwiIDogXCIwXCI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm5vdF9ncmVhdGVyXCI6XG4gICAgICAgICAgICBjb250YWluZXJba2V5XSA9IHBhcnNlRmxvYXQobHZhbCkgPD0gcGFyc2VGbG9hdCh2YWwpID8gXCIxXCIgOiBcIjBcIjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibm90X2xlc3NcIjpcbiAgICAgICAgICAgIGNvbnRhaW5lcltrZXldID0gcGFyc2VGbG9hdChsdmFsKSA+PSBwYXJzZUZsb2F0KHZhbCkgPyBcIjFcIiA6IFwiMFwiO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJub3RfZXF1YWxcIjpcbiAgICAgICAgICAgIGNvbnRhaW5lcltrZXldID0gcGFyc2VGbG9hdChsdmFsKSAhPT0gcGFyc2VGbG9hdCh2YWwpID8gXCIxXCIgOiBcIjBcIjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBcbiAgICAgICAgY2FzZSBcInByaW50XCI6XG4gICAgICAgICAgICBsb2coaW50ZXJwcmV0ZXIuYnVzLCBcIlZhcmlhYmxlICdcIiArIGtleSArIFwiJyBpczogXCIgKyBjb250YWluZXJba2V5XSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICB3YXJuKGludGVycHJldGVyLmJ1cywgXCJVbmtub3duIGFjdGlvbiAnXCIgKyBhY3Rpb24gK1xuICAgICAgICAgICAgICAgIFwiJyBkZWZpbmVkIG9uICd2YXInIGNvbW1hbmQuXCIsIGNvbW1hbmQpO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gbmV4dDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB2YXJDb21tYW5kO1xuIiwiXG5mdW5jdGlvbiB3YWl0IChjb21tYW5kLCBpbnRlcnByZXRlcikge1xuICAgIFxuICAgIHZhciBkdXJhdGlvbiwgc2VsZjtcbiAgICBcbiAgICBpbnRlcnByZXRlci5idXMudHJpZ2dlcihcbiAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIuY29tbWFuZHMud2FpdFwiLFxuICAgICAgICB7XG4gICAgICAgICAgICBpbnRlcnByZXRlcjogaW50ZXJwcmV0ZXIsXG4gICAgICAgICAgICBjb21tYW5kOiBjb21tYW5kXG4gICAgICAgIH0sIFxuICAgICAgICBmYWxzZVxuICAgICk7XG4gICAgXG4gICAgc2VsZiA9IGludGVycHJldGVyO1xuICAgIGR1cmF0aW9uID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJkdXJhdGlvblwiKTtcbiAgICBcbiAgICBpZiAoZHVyYXRpb24gIT09IG51bGwpIHtcbiAgICAgICAgXG4gICAgICAgIGR1cmF0aW9uID0gcGFyc2VJbnQoZHVyYXRpb24sIDEwKTtcbiAgICAgICAgaW50ZXJwcmV0ZXIud2FpdEZvclRpbWVyID0gdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgIHNldFRpbWVvdXQoXG4gICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi53YWl0Rm9yVGltZXIgPSBmYWxzZTtcbiAgICAgICAgICAgIH0sIFxuICAgICAgICAgICAgZHVyYXRpb25cbiAgICAgICAgKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkb05leHQ6IHRydWUsXG4gICAgICAgICAgICB3YWl0OiBmYWxzZVxuICAgICAgICB9O1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBkb05leHQ6IHRydWUsXG4gICAgICAgIHdhaXQ6IHRydWVcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHdhaXQ7XG4iLCJcbmZ1bmN0aW9uIHdoaWxlQ29tbWFuZCAoY29tbWFuZCwgaW50ZXJwcmV0ZXIpIHtcbiAgICBcbiAgICBpbnRlcnByZXRlci5pbmRleCAtPSAxO1xuICAgIGludGVycHJldGVyLmN1cnJlbnRFbGVtZW50IC09IDE7XG4gICAgaW50ZXJwcmV0ZXIucHVzaFRvQ2FsbFN0YWNrKCk7XG4gICAgaW50ZXJwcmV0ZXIuY3VycmVudENvbW1hbmRzID0gY29tbWFuZC5jaGlsZE5vZGVzO1xuICAgIGludGVycHJldGVyLnNjZW5lUGF0aC5wdXNoKGludGVycHJldGVyLmluZGV4KzEpO1xuICAgIGludGVycHJldGVyLmluZGV4ID0gLTE7XG4gICAgaW50ZXJwcmV0ZXIuY3VycmVudEVsZW1lbnQgPSAtMTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBkb05leHQ6IHRydWVcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHdoaWxlQ29tbWFuZDtcbiIsIlxudmFyIHRvb2xzID0gcmVxdWlyZShcIi4uL3Rvb2xzL3Rvb2xzXCIpO1xuXG52YXIgd2FybiA9IHRvb2xzLndhcm47XG52YXIgZ2V0UGFyc2VkQXR0cmlidXRlID0gdG9vbHMuZ2V0UGFyc2VkQXR0cmlidXRlO1xuXG5mdW5jdGlvbiB3aXRoQ29tbWFuZCAoY29tbWFuZCwgaW50ZXJwcmV0ZXIpIHtcbiAgICBcbiAgICB2YXIgY29udGFpbmVyID0gaW50ZXJwcmV0ZXIucnVuVmFycztcbiAgICB2YXIgY2hpbGRyZW4gPSBjb21tYW5kLmNoaWxkTm9kZXM7XG4gICAgdmFyIHZhcmlhYmxlTmFtZSA9IGdldFBhcnNlZEF0dHJpYnV0ZShjb21tYW5kLCBcInZhclwiLCBpbnRlcnByZXRlcik7XG4gICAgdmFyIGksIG51bWJlck9mQ2hpbGRyZW4gPSBjaGlsZHJlbi5sZW5ndGgsIGN1cnJlbnQ7XG4gICAgXG4gICAgZm9yIChpID0gMDsgaSA8IG51bWJlck9mQ2hpbGRyZW47IGkgKz0gMSkge1xuICAgICAgICBcbiAgICAgICAgY3VycmVudCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICBcbiAgICAgICAgaWYgKHNob3VsZEJlU2tpcHBlZChjdXJyZW50LCBpbnRlcnByZXRlcikpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoaXNXaGVuKGN1cnJlbnQpICYmICFoYXNDb25kaXRpb24oY3VycmVudCkpIHtcbiAgICAgICAgICAgIHdhcm4oaW50ZXJwcmV0ZXIuYnVzLCBcIkVsZW1lbnQgJ3doZW4nIHdpdGhvdXQgYSBjb25kaXRpb24uIElnbm9yZWQuXCIsIGNvbW1hbmQpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoaXNFbHNlKGN1cnJlbnQpICYmIGhhc0NvbmRpdGlvbihjdXJyZW50KSkge1xuICAgICAgICAgICAgd2FybihpbnRlcnByZXRlci5idXMsIFwiRWxlbWVudCAnZWxzZScgd2l0aCBhIGNvbmRpdGlvbi4gSWdub3JlZC5cIiwgY29tbWFuZCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChpc0Vsc2UoY3VycmVudCkgfHxcbiAgICAgICAgICAgICAgICBpc1doZW4oY3VycmVudCkgJiYgaGFzQ29uZGl0aW9uKGN1cnJlbnQpICYmXG4gICAgICAgICAgICAgICAgZ2V0UGFyc2VkQXR0cmlidXRlKGN1cnJlbnQsIFwiaXNcIikgPT09IGNvbnRhaW5lclt2YXJpYWJsZU5hbWVdKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGludGVycHJldGVyLnB1c2hUb0NhbGxTdGFjaygpO1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXIuY3VycmVudENvbW1hbmRzID0gY3VycmVudC5jaGlsZE5vZGVzO1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXIuc2NlbmVQYXRoLnB1c2goaW50ZXJwcmV0ZXIuaW5kZXgpO1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXIuc2NlbmVQYXRoLnB1c2goaSk7XG4gICAgICAgICAgICBpbnRlcnByZXRlci5pbmRleCA9IC0xO1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXIuY3VycmVudEVsZW1lbnQgPSAtMTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZG9OZXh0OiB0cnVlXG4gICAgfTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkQmVTa2lwcGVkIChlbGVtZW50LCBpbnRlcnByZXRlcikge1xuICAgIHJldHVybiAhZWxlbWVudC50YWdOYW1lIHx8ICFpbnRlcnByZXRlci5jaGVja0lmdmFyKGVsZW1lbnQpIHx8XG4gICAgICAgIChlbGVtZW50LnRhZ05hbWUgIT09IFwid2hlblwiICYmIGVsZW1lbnQudGFnTmFtZSAhPT0gXCJlbHNlXCIpO1xufVxuXG5mdW5jdGlvbiBpc1doZW4gKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gdGFnTmFtZUlzKGVsZW1lbnQsIFwid2hlblwiKTtcbn1cblxuZnVuY3Rpb24gaXNFbHNlIChlbGVtZW50KSB7XG4gICAgcmV0dXJuIHRhZ05hbWVJcyhlbGVtZW50LCBcImVsc2VcIik7XG59XG5cbmZ1bmN0aW9uIHRhZ05hbWVJcyAoZWxlbWVudCwgbmFtZSkge1xuICAgIHJldHVybiBlbGVtZW50LnRhZ05hbWUgPT09IG5hbWU7XG59XG5cbmZ1bmN0aW9uIGhhc0NvbmRpdGlvbiAoZWxlbWVudCkge1xuICAgIHJldHVybiBlbGVtZW50Lmhhc0F0dHJpYnV0ZShcImlzXCIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHdpdGhDb21tYW5kO1xuIiwiXG52YXIgTG9jYWxTdG9yYWdlRGF0YVNvdXJjZSA9IHJlcXVpcmUoXCIuL2RhdGFTb3VyY2VzL0xvY2FsU3RvcmFnZVwiKTtcblxudmFyIGRhdGFTb3VyY2VzID0ge1xuICAgIExvY2FsU3RvcmFnZTogTG9jYWxTdG9yYWdlRGF0YVNvdXJjZVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBkYXRhU291cmNlcztcbiIsIlxudmFyIERpY3QgPSByZXF1aXJlKFwic3RyaW5nLWRpY3RcIik7XG5cbnZhciB0ZXN0S2V5ID0gXCJfX193c2Vfc3RvcmFnZV90ZXN0XCI7XG52YXIgbG9jYWxTdG9yYWdlRW5hYmxlZCA9IGZhbHNlO1xudmFyIGRhdGE7XG5cbnRyeSB7XG4gICAgXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0odGVzdEtleSwgXCJ3b3Jrc1wiKTtcbiAgICBcbiAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0odGVzdEtleSkgPT09IFwid29ya3NcIikge1xuICAgICAgICBsb2NhbFN0b3JhZ2VFbmFibGVkID0gdHJ1ZTtcbiAgICB9XG59XG5jYXRjaCAoZXJyb3IpIHtcbiAgICBcbiAgICBjb25zb2xlLmVycm9yKFwiTG9jYWxTdG9yYWdlIG5vdCBhdmFpbGFibGUsIHVzaW5nIEpTIG9iamVjdCBhcyBmYWxsYmFjay5cIik7XG4gICAgXG4gICAgZGF0YSA9IG5ldyBEaWN0KCk7XG59XG5cbmZ1bmN0aW9uIExvY2FsU3RvcmFnZURhdGFTb3VyY2UgKCkge31cblxuTG9jYWxTdG9yYWdlRGF0YVNvdXJjZS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICBcbiAgICBpZiAoIWxvY2FsU3RvcmFnZUVuYWJsZWQpIHtcbiAgICAgICAgZGF0YS5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKTtcbiAgICB9XG59O1xuXG5Mb2NhbFN0b3JhZ2VEYXRhU291cmNlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgXG4gICAgaWYgKCFsb2NhbFN0b3JhZ2VFbmFibGVkKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWRhdGEuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gZGF0YS5nZXQoa2V5KTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSk7XG59O1xuXG5Mb2NhbFN0b3JhZ2VEYXRhU291cmNlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgXG4gICAgaWYgKCFsb2NhbFN0b3JhZ2VFbmFibGVkKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWRhdGEuaGFzKGtleSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGRhdGEucmVtb3ZlKGtleSk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShrZXkpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMb2NhbFN0b3JhZ2VEYXRhU291cmNlO1xuIiwiXG52YXIgYnVzID0gcmVxdWlyZShcIi4vYnVzXCIpO1xudmFyIGFzc2V0cyA9IHJlcXVpcmUoXCIuL2Fzc2V0c1wiKTtcbnZhciBjb21tYW5kcyA9IHJlcXVpcmUoXCIuL2NvbW1hbmRzXCIpO1xudmFyIGZ1bmN0aW9ucyA9IHJlcXVpcmUoXCIuL2Z1bmN0aW9uc1wiKTtcbnZhciBkYXRhU291cmNlcyA9IHJlcXVpcmUoXCIuL2RhdGFTb3VyY2VzXCIpO1xuXG52YXIgR2FtZSA9IHJlcXVpcmUoXCIuL0dhbWVcIik7XG5cbnZhciBXU0UgPSB7fSwgdmVyc2lvbiA9IFwiJSUldmVyc2lvbiUlJVwiO1xuXG5XU0UuaW5zdGFuY2VzID0gW107XG5cbldTRS5kYXRhU291cmNlcyA9IGRhdGFTb3VyY2VzO1xuV1NFLmFzc2V0cyA9IGFzc2V0cztcbldTRS5jb21tYW5kcyA9IGNvbW1hbmRzO1xuV1NFLmZ1bmN0aW9ucyA9IGZ1bmN0aW9ucztcblxuYnVzLnN1YnNjcmliZShcIndzZS5nYW1lLmNvbnN0cnVjdG9yXCIsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgV1NFLmluc3RhbmNlcy5wdXNoKGRhdGEuZ2FtZSk7XG59KTtcblxuV1NFLmdldFZlcnNpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHZlcnNpb247XG59O1xuXG5XU0UuYnVzID0gYnVzO1xuV1NFLkdhbWUgPSBHYW1lO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFdTRTtcbiIsIlxudmFyIGZ1bmN0aW9ucyA9IHtcbiAgICBcbiAgICBzYXZlZ2FtZXM6IGZ1bmN0aW9uIChpbnRlcnByZXRlcikge1xuICAgICAgICBpbnRlcnByZXRlci50b2dnbGVTYXZlZ2FtZU1lbnUoKTtcbiAgICB9LFxuICAgIFxuICAgIHN0YWdlY2xpY2tfZGlzYWJsZTogZnVuY3Rpb24gKGludGVycHJldGVyKSB7XG4gICAgICAgIGludGVycHJldGVyLmdhbWUudW5zdWJzY3JpYmVMaXN0ZW5lcnMoKTtcbiAgICB9LFxuICAgIFxuICAgIHN0YWdlY2xpY2tfZW5hYmxlOiBmdW5jdGlvbiAoaW50ZXJwcmV0ZXIpIHtcbiAgICAgICAgaW50ZXJwcmV0ZXIuZ2FtZS5zdWJzY3JpYmVMaXN0ZW5lcnMoKTtcbiAgICB9XG4gICAgXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9ucztcbiIsIlxudmFyIGFqYXggPSByZXF1aXJlKFwiZWFzeS1hamF4XCIpO1xudmFyIGNvbXBpbGUgPSByZXF1aXJlKFwiLi90b29scy9jb21waWxlXCIpLmNvbXBpbGU7XG5cbmZ1bmN0aW9uIGdlbmVyYXRlR2FtZUZpbGUgKG1haW5GaWxlUGF0aCwgdGhlbikge1xuICAgIGNvbXBpbGVGaWxlKG1haW5GaWxlUGF0aCwgZnVuY3Rpb24gKG1haW5GaWxlKSB7XG4gICAgICAgIGdlbmVyYXRlR2FtZUZpbGVGcm9tU3RyaW5nKG1haW5GaWxlLCB0aGVuKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVHYW1lRmlsZUZyb21TdHJpbmcgKHRleHQsIHRoZW4pIHtcbiAgICBcbiAgICB2YXIgZ2FtZURvY3VtZW50ID0gcGFyc2VYbWwodGV4dCk7XG4gICAgdmFyIGZpbGVEZWZpbml0aW9ucyA9IGdldEZpbGVEZWZpbml0aW9ucyhnYW1lRG9jdW1lbnQpO1xuICAgIFxuICAgIGNvbXBpbGVGaWxlcyhmaWxlRGVmaW5pdGlvbnMsIGZ1bmN0aW9uIChmaWxlcykge1xuICAgICAgICBmaWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChmaWxlLCBpKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciB0eXBlID0gZmlsZURlZmluaXRpb25zW2ldLnR5cGU7XG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gZ2FtZURvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKHR5cGUpWzBdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIXBhcmVudCkge1xuICAgICAgICAgICAgICAgIHBhcmVudCA9IGdhbWVEb2N1bWVudC5jcmVhdGVFbGVtZW50KHR5cGUpO1xuICAgICAgICAgICAgICAgIGdhbWVEb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuYXBwZW5kQ2hpbGQocGFyZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcGFyZW50LmlubmVySFRNTCArPSBcIlxcblwiICsgZmlsZSArIFwiXFxuXCI7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgdGhlbihnYW1lRG9jdW1lbnQpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBnZW5lcmF0ZUZyb21TdHJpbmcgKHRleHQsIHRoZW4pIHtcbiAgICBnZW5lcmF0ZUdhbWVGaWxlRnJvbVN0cmluZyhjb21waWxlKHRleHQpLCB0aGVuKTtcbn1cblxuZnVuY3Rpb24gY29tcGlsZUZpbGVzIChmaWxlRGVmaW5pdGlvbnMsIHRoZW4pIHtcbiAgICBcbiAgICB2YXIgbG9hZGVkID0gMDtcbiAgICB2YXIgY291bnQgPSBmaWxlRGVmaW5pdGlvbnMubGVuZ3RoO1xuICAgIHZhciBmaWxlcyA9IFtdO1xuICAgIFxuICAgIGZpbGVEZWZpbml0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChkZWZpbml0aW9uLCBpKSB7XG4gICAgICAgIFxuICAgICAgICBjb21waWxlRmlsZShkZWZpbml0aW9uLnVybCwgZnVuY3Rpb24gKGZpbGUpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZmlsZXNbaV0gPSBmaWxlO1xuICAgICAgICAgICAgbG9hZGVkICs9IDE7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChsb2FkZWQgPj0gY291bnQpIHtcbiAgICAgICAgICAgICAgICB0aGVuKGZpbGVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgXG4gICAgaWYgKGNvdW50IDwgMSkge1xuICAgICAgICB0aGVuKGZpbGVzKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNvbXBpbGVGaWxlIChwYXRoLCB0aGVuKSB7XG4gICAgYWpheC5nZXQocGF0aCArIFwiP3JhbmRvbT1cIiArIE1hdGgucmFuZG9tKCksIGZ1bmN0aW9uIChlcnJvciwgb2JqKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGVuKGNvbXBpbGUob2JqLnJlc3BvbnNlVGV4dCkpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBwYXJzZVhtbCAodGV4dCkge1xuICAgIHJldHVybiBuZXcgRE9NUGFyc2VyKCkucGFyc2VGcm9tU3RyaW5nKHRleHQsIFwiYXBwbGljYXRpb24veG1sXCIpO1xufVxuXG5mdW5jdGlvbiBnZXRGaWxlRGVmaW5pdGlvbnMgKHhtbCkge1xuICAgIFxuICAgIHZhciBlbGVtZW50cyA9IHhtbC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImZpbGVcIik7XG4gICAgXG4gICAgcmV0dXJuIFtdLm1hcC5jYWxsKGVsZW1lbnRzLCBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdHlwZTogZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ0eXBlXCIpLFxuICAgICAgICAgICAgdXJsOiBlbGVtZW50LmdldEF0dHJpYnV0ZShcInVybFwiKVxuICAgICAgICB9O1xuICAgIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBnZW5lcmF0ZUdhbWVGaWxlOiBnZW5lcmF0ZUdhbWVGaWxlLFxuICAgIGdlbmVyYXRlRnJvbVN0cmluZzogZ2VuZXJhdGVGcm9tU3RyaW5nXG59O1xuIiwiXG52YXIgZWFjaCA9IHJlcXVpcmUoXCJlbmpveS1jb3JlL2VhY2hcIik7XG52YXIgdHlwZWNoZWNrcyA9IHJlcXVpcmUoXCJlbmpveS10eXBlY2hlY2tzXCIpO1xuXG52YXIgZW5naW5lID0gcmVxdWlyZShcIi4vZW5naW5lXCIpO1xudmFyIHRvb2xzID0gcmVxdWlyZShcIi4vdG9vbHMvdG9vbHNcIik7XG5cbnZhciBpc051bGwgPSB0eXBlY2hlY2tzLmlzTnVsbDtcbnZhciBpc1VuZGVmaW5lZCA9IHR5cGVjaGVja3MuaXNVbmRlZmluZWQ7XG5cbnZhciB3YXJuID0gdG9vbHMud2FybjtcbnZhciB0cnV0aHkgPSB0b29scy50cnV0aHk7XG5cbmZ1bmN0aW9uIGxvYWQgKGludGVycHJldGVyLCBuYW1lKSB7XG4gICAgXG4gICAgdmFyIGRzLCBzYXZlZ2FtZSwgc2NlbmUsIHNjZW5lSWQsIHNjZW5lUGF0aCwgc2NlbmVzO1xuICAgIHZhciBzYXZlZ2FtZUlkLCBidXMgPSBpbnRlcnByZXRlci5idXM7XG4gICAgXG4gICAgc2F2ZWdhbWVJZCA9IGJ1aWxkU2F2ZWdhbWVJZChpbnRlcnByZXRlciwgbmFtZSk7XG4gICAgZHMgPSBpbnRlcnByZXRlci5kYXRhc291cmNlO1xuICAgIHNhdmVnYW1lID0gZHMuZ2V0KHNhdmVnYW1lSWQpO1xuICAgIFxuICAgIGJ1cy50cmlnZ2VyKFxuICAgICAgICBcIndzZS5pbnRlcnByZXRlci5sb2FkLmJlZm9yZVwiLFxuICAgICAgICB7XG4gICAgICAgICAgICBpbnRlcnByZXRlcjogaW50ZXJwcmV0ZXIsXG4gICAgICAgICAgICBzYXZlZ2FtZTogc2F2ZWdhbWVcbiAgICAgICAgfSwgXG4gICAgICAgIGZhbHNlXG4gICAgKTtcbiAgICBcbiAgICBpZiAoIXNhdmVnYW1lKSB7XG4gICAgICAgIHdhcm4oYnVzLCBcIkNvdWxkIG5vdCBsb2FkIHNhdmVnYW1lICdcIiArIHNhdmVnYW1lSWQgKyBcIichXCIpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIFxuICAgIHNhdmVnYW1lID0gSlNPTi5wYXJzZShzYXZlZ2FtZSk7XG4gICAgaW50ZXJwcmV0ZXIuc3RhZ2UuaW5uZXJIVE1MID0gc2F2ZWdhbWUuc2NyZWVuQ29udGVudHM7XG4gICAgXG4gICAgcmVzdG9yZVNhdmVnYW1lKGludGVycHJldGVyLCBzYXZlZ2FtZS5zYXZlcyk7XG4gICAgXG4gICAgaW50ZXJwcmV0ZXIuc3RhcnRUaW1lID0gc2F2ZWdhbWUuc3RhcnRUaW1lO1xuICAgIGludGVycHJldGVyLnJ1blZhcnMgPSBzYXZlZ2FtZS5ydW5WYXJzO1xuICAgIGludGVycHJldGVyLmxvZyA9IHNhdmVnYW1lLmxvZztcbiAgICBpbnRlcnByZXRlci52aXNpdGVkU2NlbmVzID0gc2F2ZWdhbWUudmlzaXRlZFNjZW5lcztcbiAgICBpbnRlcnByZXRlci5pbmRleCA9IHNhdmVnYW1lLmluZGV4O1xuICAgIGludGVycHJldGVyLndhaXQgPSBzYXZlZ2FtZS53YWl0O1xuICAgIGludGVycHJldGVyLndhaXRGb3JUaW1lciA9IHNhdmVnYW1lLndhaXRGb3JUaW1lcjtcbiAgICBpbnRlcnByZXRlci5jdXJyZW50RWxlbWVudCA9IHNhdmVnYW1lLmN1cnJlbnRFbGVtZW50O1xuICAgIGludGVycHJldGVyLmNhbGxTdGFjayA9IHNhdmVnYW1lLmNhbGxTdGFjaztcbiAgICBpbnRlcnByZXRlci53YWl0Q291bnRlciA9IHNhdmVnYW1lLndhaXRDb3VudGVyO1xuICAgIGludGVycHJldGVyLnN0YXRlID0gXCJsaXN0ZW5cIjtcbiAgICBcbiAgICBzY2VuZUlkID0gc2F2ZWdhbWUuc2NlbmVJZDtcbiAgICBpbnRlcnByZXRlci5zY2VuZUlkID0gc2NlbmVJZDtcbiAgICBcbiAgICBzY2VuZXMgPSBpbnRlcnByZXRlci5zdG9yeS5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjZW5lXCIpO1xuICAgIGludGVycHJldGVyLnNjZW5lcyA9IHNjZW5lcztcbiAgICBcbiAgICBzY2VuZSA9IGZpbmQoZnVuY3Rpb24gKHNjZW5lKSB7XG4gICAgICAgIHJldHVybiBzY2VuZS5nZXRBdHRyaWJ1dGUoXCJpZFwiKSA9PT0gc2NlbmVJZDtcbiAgICB9LCBpbnRlcnByZXRlci5zY2VuZXMpO1xuICAgIFxuICAgIGlmICghc2NlbmUpIHtcbiAgICAgICAgXG4gICAgICAgIGJ1cy50cmlnZ2VyKFxuICAgICAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIuZXJyb3JcIixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkxvYWRpbmcgc2F2ZWdhbWUgJ1wiICsgc2F2ZWdhbWVJZCArIFwiJyBmYWlsZWQ6IFNjZW5lIG5vdCBmb3VuZCFcIlxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBcbiAgICBzY2VuZVBhdGggPSBzYXZlZ2FtZS5zY2VuZVBhdGg7XG4gICAgaW50ZXJwcmV0ZXIuc2NlbmVQYXRoID0gc2NlbmVQYXRoLnNsaWNlKCk7XG4gICAgXG4gICAgaW50ZXJwcmV0ZXIuY3VycmVudENvbW1hbmRzID0gc2NlbmUuY2hpbGROb2RlcztcbiAgICBcbiAgICB3aGlsZSAoc2NlbmVQYXRoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaW50ZXJwcmV0ZXIuY3VycmVudENvbW1hbmRzID0gaW50ZXJwcmV0ZXIuY3VycmVudENvbW1hbmRzW3NjZW5lUGF0aC5zaGlmdCgpXS5jaGlsZE5vZGVzO1xuICAgIH1cbiAgICBcbiAgICAvLyBSZS1pbnNlcnQgY2hvaWNlIG1lbnUgdG8gZ2V0IGJhY2sgdGhlIERPTSBldmVudHMgYXNzb2NpYXRlZCB3aXRoIGl0OlxuICAgIC8vIFJlbW92ZSBzYXZlZ2FtZSBtZW51IG9uIGxvYWQ6XG4gICAgKGZ1bmN0aW9uIChpbnRlcnByZXRlcikge1xuICAgICAgICBcbiAgICAgICAgdmFyIGluZGV4LCB3c2VUeXBlLCBjb20sIHJlbTtcbiAgICAgICAgXG4gICAgICAgIGVhY2goZnVuY3Rpb24gKGN1cikge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoaXNVbmRlZmluZWQoY3VyKSB8fCBpc051bGwoY3VyKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgd3NlVHlwZSA9IGN1ci5nZXRBdHRyaWJ1dGUoXCJkYXRhLXdzZS10eXBlXCIpIHx8IFwiXCI7XG4gICAgICAgICAgICByZW0gPSB0cnV0aHkoY3VyLmdldEF0dHJpYnV0ZShcImRhdGEtd3NlLXJlbW92ZVwiKSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChyZW0gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBpbnRlcnByZXRlci5zdGFnZS5yZW1vdmVDaGlsZChjdXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAod3NlVHlwZSAhPT0gXCJjaG9pY2VcIikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaW5kZXggPSBwYXJzZUludChjdXIuZ2V0QXR0cmlidXRlKFwiZGF0YS13c2UtaW5kZXhcIiksIDEwKSB8fCBudWxsO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB3YXJuKGludGVycHJldGVyLmJ1cywgXCJObyBkYXRhLXdzZS1pbmRleCBmb3VuZCBvbiBlbGVtZW50LlwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbSA9IGludGVycHJldGVyLmN1cnJlbnRDb21tYW5kc1tpbmRleF07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChjb20ubm9kZU5hbWUgPT09IFwiI3RleHRcIiB8fCBjb20ubm9kZU5hbWUgPT09IFwiI2NvbW1lbnRcIikge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaW50ZXJwcmV0ZXIuc3RhZ2UucmVtb3ZlQ2hpbGQoY3VyKTtcbiAgICAgICAgICAgIGVuZ2luZS5jb21tYW5kcy5jaG9pY2UoY29tLCBpbnRlcnByZXRlcik7XG4gICAgICAgICAgICBpbnRlcnByZXRlci53YWl0Q291bnRlciAtPSAxO1xuICAgICAgICAgICAgXG4gICAgICAgIH0sIGludGVycHJldGVyLnN0YWdlLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiKlwiKSk7XG4gICAgICAgIFxuICAgIH0oaW50ZXJwcmV0ZXIpKTtcbiAgICBcbiAgICBidXMudHJpZ2dlcihcbiAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIubG9hZC5hZnRlclwiLFxuICAgICAgICB7XG4gICAgICAgICAgICBpbnRlcnByZXRlcjogaW50ZXJwcmV0ZXIsXG4gICAgICAgICAgICBzYXZlZ2FtZTogc2F2ZWdhbWVcbiAgICAgICAgfSwgXG4gICAgICAgIGZhbHNlXG4gICAgKTtcbiAgICBcbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gc2F2ZSAoaW50ZXJwcmV0ZXIsIG5hbWUpIHtcbiAgICBcbiAgICBuYW1lID0gbmFtZSB8fCBcIm5vIG5hbWVcIjtcbiAgICBcbiAgICB2YXIgc2F2ZWdhbWUsIGpzb24sIGtleSwgc2F2ZWdhbWVMaXN0LCBsaXN0S2V5LCBsYXN0S2V5LCBidXMgPSBpbnRlcnByZXRlci5idXM7XG4gICAgXG4gICAgc2F2ZWdhbWUgPSB7fTtcbiAgICBcbiAgICBidXMudHJpZ2dlcihcbiAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIuc2F2ZS5iZWZvcmVcIixcbiAgICAgICAge1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXI6IGludGVycHJldGVyLFxuICAgICAgICAgICAgc2F2ZWdhbWU6IHNhdmVnYW1lXG4gICAgICAgIH0sIFxuICAgICAgICBmYWxzZVxuICAgICk7XG4gICAgXG4gICAgc2F2ZWdhbWUuc2F2ZXMgPSBjcmVhdGVTYXZlZ2FtZShpbnRlcnByZXRlcik7XG4gICAgc2F2ZWdhbWUuc3RhcnRUaW1lID0gaW50ZXJwcmV0ZXIuc3RhcnRUaW1lO1xuICAgIHNhdmVnYW1lLnNhdmVUaW1lID0gTWF0aC5yb3VuZChEYXRlLm5vdygpIC8gMTAwMCk7XG4gICAgc2F2ZWdhbWUuc2NyZWVuQ29udGVudHMgPSBpbnRlcnByZXRlci5zdGFnZS5pbm5lckhUTUw7XG4gICAgc2F2ZWdhbWUucnVuVmFycyA9IGludGVycHJldGVyLnJ1blZhcnM7XG4gICAgc2F2ZWdhbWUubmFtZSA9IG5hbWU7XG4gICAgc2F2ZWdhbWUubG9nID0gaW50ZXJwcmV0ZXIubG9nO1xuICAgIHNhdmVnYW1lLnZpc2l0ZWRTY2VuZXMgPSBpbnRlcnByZXRlci52aXNpdGVkU2NlbmVzO1xuICAgIHNhdmVnYW1lLmdhbWVVcmwgPSBpbnRlcnByZXRlci5nYW1lLnVybDtcbiAgICBzYXZlZ2FtZS5pbmRleCA9IGludGVycHJldGVyLmluZGV4O1xuICAgIHNhdmVnYW1lLndhaXQgPSBpbnRlcnByZXRlci53YWl0O1xuICAgIHNhdmVnYW1lLndhaXRGb3JUaW1lciA9IGludGVycHJldGVyLndhaXRGb3JUaW1lcjtcbiAgICBzYXZlZ2FtZS5jdXJyZW50RWxlbWVudCA9IGludGVycHJldGVyLmN1cnJlbnRFbGVtZW50O1xuICAgIHNhdmVnYW1lLnNjZW5lSWQgPSBpbnRlcnByZXRlci5zY2VuZUlkO1xuICAgIHNhdmVnYW1lLnNjZW5lUGF0aCA9IGludGVycHJldGVyLnNjZW5lUGF0aDtcbiAgICBzYXZlZ2FtZS5saXN0ZW5lcnNTdWJzY3JpYmVkID0gaW50ZXJwcmV0ZXIuZ2FtZS5saXN0ZW5lcnNTdWJzY3JpYmVkO1xuICAgIHNhdmVnYW1lLmNhbGxTdGFjayA9IGludGVycHJldGVyLmNhbGxTdGFjaztcbiAgICBzYXZlZ2FtZS53YWl0Q291bnRlciA9IGludGVycHJldGVyLndhaXRDb3VudGVyO1xuICAgIHNhdmVnYW1lLnBhdGhuYW1lID0gbG9jYXRpb24ucGF0aG5hbWU7XG4gICAgXG4gICAga2V5ID0gYnVpbGRTYXZlZ2FtZUlkKGludGVycHJldGVyLCBuYW1lKTtcbiAgICBcbiAgICBqc29uID0gSlNPTi5zdHJpbmdpZnkoc2F2ZWdhbWUpO1xuICAgIFxuICAgIGxpc3RLZXkgPSBcIndzZV9cIiArIHNhdmVnYW1lLnBhdGhuYW1lICsgXCJfXCIgKyBzYXZlZ2FtZS5nYW1lVXJsICsgXCJfc2F2ZWdhbWVzX2xpc3RcIjtcbiAgICBcbiAgICBzYXZlZ2FtZUxpc3QgPSBKU09OLnBhcnNlKGludGVycHJldGVyLmRhdGFzb3VyY2UuZ2V0KGxpc3RLZXkpKTtcbiAgICBzYXZlZ2FtZUxpc3QgPSBzYXZlZ2FtZUxpc3QgfHwgW107XG4gICAgbGFzdEtleSA9IHNhdmVnYW1lTGlzdC5pbmRleE9mKGtleSk7XG4gICAgXG4gICAgaWYgKGxhc3RLZXkgPj0gMCkge1xuICAgICAgICBzYXZlZ2FtZUxpc3Quc3BsaWNlKGxhc3RLZXksIDEpO1xuICAgIH1cbiAgICBcbiAgICBzYXZlZ2FtZUxpc3QucHVzaChrZXkpO1xuICAgIFxuICAgIHRyeSB7XG4gICAgICAgIGludGVycHJldGVyLmRhdGFzb3VyY2Uuc2V0KGtleSwganNvbik7XG4gICAgICAgIGludGVycHJldGVyLmRhdGFzb3VyY2Uuc2V0KGxpc3RLZXksIEpTT04uc3RyaW5naWZ5KHNhdmVnYW1lTGlzdCkpO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICBcbiAgICAgICAgd2FybihidXMsIFwiU2F2ZWdhbWUgY291bGQgbm90IGJlIGNyZWF0ZWQhXCIpO1xuICAgICAgICBcbiAgICAgICAgYnVzLnRyaWdnZXIoXG4gICAgICAgICAgICBcIndzZS5pbnRlcnByZXRlci5zYXZlLmFmdGVyLmVycm9yXCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXI6IGludGVycHJldGVyLFxuICAgICAgICAgICAgICAgIHNhdmVnYW1lOiBzYXZlZ2FtZVxuICAgICAgICAgICAgfSwgXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBcbiAgICBidXMudHJpZ2dlcihcbiAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIuc2F2ZS5hZnRlci5zdWNjZXNzXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGludGVycHJldGVyOiBpbnRlcnByZXRlcixcbiAgICAgICAgICAgIHNhdmVnYW1lOiBzYXZlZ2FtZVxuICAgICAgICB9XG4gICAgKTtcbiAgICBcbiAgICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlU2F2ZWdhbWUgKGludGVycHJldGVyKSB7XG4gICAgXG4gICAgdmFyIHNhdmVzID0ge307XG4gICAgXG4gICAgZWFjaChmdW5jdGlvbiAoYXNzZXQsIGtleSkge1xuICAgICAgICBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNhdmVzW2tleV0gPSBhc3NldC5zYXZlKCk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJXU0UgSW50ZXJuYWwgRXJyb3I6IEFzc2V0ICdcIiArIGtleSArIFxuICAgICAgICAgICAgICAgIFwiJyBkb2VzIG5vdCBoYXZlIGEgJ3NhdmUnIG1ldGhvZCFcIik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfSwgaW50ZXJwcmV0ZXIuYXNzZXRzKTtcbiAgICBcbiAgICByZXR1cm4gc2F2ZXM7XG59XG5cbmZ1bmN0aW9uIHJlc3RvcmVTYXZlZ2FtZSAoaW50ZXJwcmV0ZXIsIHNhdmVzKSB7XG4gICAgXG4gICAgZWFjaChmdW5jdGlvbiAoYXNzZXQsIGtleSkge1xuICAgICAgICBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGFzc2V0LnJlc3RvcmUoc2F2ZXNba2V5XSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICB3YXJuKGludGVycHJldGVyLmJ1cywgXCJDb3VsZCBub3QgcmVzdG9yZSBhc3NldCBzdGF0ZSBmb3IgYXNzZXQgJ1wiICsga2V5ICsgXCInIVwiKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9LCBpbnRlcnByZXRlci5hc3NldHMpO1xuICAgIFxufVxuXG5mdW5jdGlvbiBidWlsZFNhdmVnYW1lSWQgKGludGVycHJldGVyLCBuYW1lKSB7XG4gICAgXG4gICAgdmFyIHZhcnMgPSB7fTtcbiAgICBcbiAgICB2YXJzLm5hbWUgPSBuYW1lO1xuICAgIHZhcnMuaWQgPSBcIndzZV9cIiArIGxvY2F0aW9uLnBhdGhuYW1lICsgXCJfXCIgKyBpbnRlcnByZXRlci5nYW1lLnVybCArIFwiX3NhdmVnYW1lX1wiICsgbmFtZTtcbiAgICBcbiAgICBpbnRlcnByZXRlci5idXMudHJpZ2dlcihcbiAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIuc2F2ZS5iZWZvcmVcIixcbiAgICAgICAge1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXI6IGludGVycHJldGVyLFxuICAgICAgICAgICAgdmFyczogdmFyc1xuICAgICAgICB9LCBcbiAgICAgICAgZmFsc2VcbiAgICApO1xuICAgIFxuICAgIHJldHVybiB2YXJzLmlkO1xufVxuXG5mdW5jdGlvbiBnZXRTYXZlZ2FtZUxpc3QgKGludGVycHJldGVyLCByZXZlcnNlZCkge1xuICAgIFxuICAgIHZhciBuYW1lcztcbiAgICB2YXIgb3V0ID0gW107XG4gICAgdmFyIGtleSA9IFwid3NlX1wiICsgbG9jYXRpb24ucGF0aG5hbWUgKyBcIl9cIiArIGludGVycHJldGVyLmdhbWUudXJsICsgXCJfc2F2ZWdhbWVzX2xpc3RcIjtcbiAgICB2YXIganNvbiA9IGludGVycHJldGVyLmRhdGFzb3VyY2UuZ2V0KGtleSk7XG4gICAgXG4gICAgaWYgKGpzb24gPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG4gICAgXG4gICAgbmFtZXMgPSBKU09OLnBhcnNlKGpzb24pO1xuICAgIG91dCA9IFtdO1xuICAgIFxuICAgIGVhY2goZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgXG4gICAgICAgIGlmIChyZXZlcnNlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgb3V0LnVuc2hpZnQoSlNPTi5wYXJzZShpbnRlcnByZXRlci5kYXRhc291cmNlLmdldChuYW1lKSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb3V0LnB1c2goSlNPTi5wYXJzZShpbnRlcnByZXRlci5kYXRhc291cmNlLmdldChuYW1lKSkpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH0sIG5hbWVzKTtcbiAgICBcbiAgICBpbnRlcnByZXRlci5idXMudHJpZ2dlcihcbiAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIuZ2V0c2F2ZWdhbWVsaXN0XCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGludGVycHJldGVyOiBpbnRlcnByZXRlcixcbiAgICAgICAgICAgIGxpc3Q6IG91dCxcbiAgICAgICAgICAgIG5hbWVzOiBuYW1lc1xuICAgICAgICB9LCBcbiAgICAgICAgZmFsc2VcbiAgICApO1xuICAgIFxuICAgIHJldHVybiBvdXQ7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZSAoaW50ZXJwcmV0ZXIsIG5hbWUpIHtcbiAgICBcbiAgICB2YXIgc2dzLCBrZXksIGluZGV4LCBqc29uLCBpZDtcbiAgICBcbiAgICBrZXkgPSBcIndzZV9cIiArIGxvY2F0aW9uLnBhdGhuYW1lICsgXCJfXCIgKyBpbnRlcnByZXRlci5nYW1lLnVybCArIFwiX3NhdmVnYW1lc19saXN0XCI7XG4gICAganNvbiA9IGludGVycHJldGVyLmRhdGFzb3VyY2UuZ2V0KGtleSk7XG4gICAgXG4gICAgaWYgKGpzb24gPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBcbiAgICBzZ3MgPSBKU09OLnBhcnNlKGpzb24pO1xuICAgIGlkID0gYnVpbGRTYXZlZ2FtZUlkKGludGVycHJldGVyLCBuYW1lKTtcbiAgICBpbmRleCA9IHNncy5pbmRleE9mKGlkKTtcbiAgICBcbiAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICBcbiAgICAgICAgc2dzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIFxuICAgICAgICBpbnRlcnByZXRlci5kYXRhc291cmNlLnNldChcbiAgICAgICAgICAgIFwid3NlX1wiICsgbG9jYXRpb24ucGF0aG5hbWUgKyBcIl9cIiArIGludGVycHJldGVyLmdhbWUudXJsICsgXCJfc2F2ZWdhbWVzX2xpc3RcIixcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHNncylcbiAgICAgICAgKTtcbiAgICAgICAgXG4gICAgICAgIGludGVycHJldGVyLmRhdGFzb3VyY2UucmVtb3ZlKGlkKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHNhdmU6IHNhdmUsXG4gICAgbG9hZDogbG9hZCxcbiAgICByZW1vdmU6IHJlbW92ZSxcbiAgICBnZXRTYXZlZ2FtZUxpc3Q6IGdldFNhdmVnYW1lTGlzdFxufTtcbiIsIi8vXG4vLyBBIG1vZHVsZSBjb250YWluaW5nIGZ1bmN0aW9ucyBmb3IgY29tcGlsaW5nIGEgc2ltcGxlIGNvbW1hbmQgbGFuZ3VhZ2UgdG8gdGhlIG9sZFxuLy8gV1NFIGNvbW1hbmQgZWxlbWVudHMuXG4vL1xuXG52YXIgeG11Z2x5ID0gcmVxdWlyZShcInhtdWdseVwiKTtcblxuLy9cbi8vIENvbXBpbGVzIHRoZSBuZXcgV1NFIGNvbW1hbmQgbGFuZ3VhZ2UgdG8gWE1MIGVsZW1lbnRzLlxuLy9cbmZ1bmN0aW9uICBjb21waWxlICh0ZXh0KSB7XG4gICAgXG4gICAgdGV4dCA9IHhtdWdseS5jb21waWxlKHRleHQsIFtcbiAgICAgICAge1xuICAgICAgICAgICAgaWRlbnRpZmllcjogXCJAXCIsXG4gICAgICAgICAgICBhdHRyaWJ1dGU6IFwiYXNzZXRcIixcbiAgICAgICAgICAgIHZhbHVlOiBcIl9cIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBpZGVudGlmaWVyOiBcIjpcIixcbiAgICAgICAgICAgIGF0dHJpYnV0ZTogXCJkdXJhdGlvblwiLFxuICAgICAgICAgICAgdmFsdWU6IFwiX1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlkZW50aWZpZXI6IFwiK1wiLFxuICAgICAgICAgICAgYXR0cmlidXRlOiBcIl9cIixcbiAgICAgICAgICAgIHZhbHVlOiBcInllc1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlkZW50aWZpZXI6IFwiLVwiLFxuICAgICAgICAgICAgYXR0cmlidXRlOiBcIl9cIixcbiAgICAgICAgICAgIHZhbHVlOiBcIm5vXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgaWRlbnRpZmllcjogXCIjXCIsXG4gICAgICAgICAgICBhdHRyaWJ1dGU6IFwiaWRcIixcbiAgICAgICAgICAgIHZhbHVlOiBcIl9cIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBpZGVudGlmaWVyOiBcIn5cIixcbiAgICAgICAgICAgIGF0dHJpYnV0ZTogXCJuYW1lXCIsXG4gICAgICAgICAgICB2YWx1ZTogXCJfXCJcbiAgICAgICAgfVxuICAgIF0pO1xuICAgIFxuICAgIHRleHQgPSBjb21waWxlU3BlZWNoKHRleHQpO1xuICAgIFxuICAgIHJldHVybiB0ZXh0O1xufVxuXG5cbi8vXG4vLyBDb21waWxlcyBcIigoIGM6IEkgc2F5IHNvbWV0aGluZyApKVwiIHRvIDxsaW5lIHM9XCJjXCI+SSBzYXkgc29tZXRoaW5nPC9saW5lPicnLlxuLy9cbmZ1bmN0aW9uIGNvbXBpbGVTcGVlY2ggKHRleHQpIHtcbiAgICByZXR1cm4gdGV4dC5yZXBsYWNlKFxuICAgICAgICAvKFtcXHNdKilcXChcXChbXFxzXSooW2EtekEtWjAtOV8tXSspOltcXHNdKigoLnxbXFxzXSkqPykoW1xcc10qKVxcKVxcKS9nLFxuICAgICAgICAnJDE8bGluZSBzPVwiJDJcIj4kMzwvbGluZT4kNSdcbiAgICApO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBjb21waWxlOiBjb21waWxlXG59O1xuIiwiXG52YXIgdHJhbnNmb3JtID0gcmVxdWlyZShcInRyYW5zZm9ybS1qc1wiKS50cmFuc2Zvcm07XG5cbmZ1bmN0aW9uIHJldmVhbCAoZWxlbWVudCwgYXJncykge1xuICAgIFxuICAgIGFyZ3MgPSBhcmdzIHx8IHt9O1xuICAgIFxuICAgIG1hcmtDaGFyYWN0ZXJzKGVsZW1lbnQpO1xuICAgIGhpZGVDaGFyYWN0ZXJzKGVsZW1lbnQpO1xuICAgIHJldHVybiByZXZlYWxDaGFyYWN0ZXJzKGVsZW1lbnQsIGFyZ3Muc3BlZWQgfHwgNTAsIGFyZ3Mub25GaW5pc2ggfHwgbnVsbCk7XG59XG5cbmZ1bmN0aW9uIHJldmVhbENoYXJhY3RlcnMgKGVsZW1lbnQsIHNwZWVkLCB0aGVuKSB7XG4gICAgXG4gICAgdmFyIGNoYXJzID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLkNoYXJcIik7XG4gICAgdmFyIG9mZnNldCA9IDEwMDAgLyAoc3BlZWQgfHwgNDApO1xuICAgIHZhciBzdG9wID0gZmFsc2U7XG4gICAgdmFyIHRpbWVvdXRzID0gW107XG4gICAgdmFyIGxlZnQgPSBjaGFycy5sZW5ndGg7XG4gICAgXG4gICAgdGhlbiA9IHRoZW4gfHwgZnVuY3Rpb24gKCkge307XG4gICAgXG4gICAgW10uZm9yRWFjaC5jYWxsKGNoYXJzLCBmdW5jdGlvbiAoY2hhciwgaSkge1xuICAgICAgICBcbiAgICAgICAgdmFyIGlkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIFdvcmthcm91bmQgZm9yIHN0cmFuZ2UgbW92ZS5qcyBiZWhhdmlvdXI6XG4gICAgICAgICAgICAvLyBTb21ldGltZXMgdGhlIGxhc3QgLmVuZCgpIGNhbGxiYWNrIGRvZXNuJ3QgZ2V0IGNhbGxlZCwgc29cbiAgICAgICAgICAgIC8vIHdlIHNldCBhbm90aGVyIHRpbWVvdXQgdG8gY29ycmVjdCB0aGlzIG1pc3Rha2UgaWYgaXQgaGFwcGVucy5cbiAgICAgICAgICAgIHZhciBjYWxsZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHZhciBkdXJhdGlvbiA9IDEwICogb2Zmc2V0O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoc3RvcCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdHJhbnNmb3JtKDAsIDEsIHNldE9wYWNpdHksIHtkdXJhdGlvbjogZHVyYXRpb259LCBlbmQpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGVuZCwgZHVyYXRpb24gKyAyMDAwKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZnVuY3Rpb24gc2V0T3BhY2l0eSAodikge1xuICAgICAgICAgICAgICAgIGNoYXIuc3R5bGUub3BhY2l0eSA9IHY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZ1bmN0aW9uIGVuZCAoKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxlZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNhbGxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbGVmdCAtPSAxO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChzdG9wKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGxlZnQgPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICB0aGVuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIH0sIGkgKiBvZmZzZXQpO1xuICAgICAgICBcbiAgICAgICAgdGltZW91dHMucHVzaChpZCk7XG4gICAgfSk7XG4gICAgXG4gICAgZnVuY3Rpb24gY2FuY2VsICgpIHtcbiAgICAgICAgXG4gICAgICAgIGlmIChzdG9wIHx8IGxlZnQgPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBzdG9wID0gdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgIHRpbWVvdXRzLmZvckVhY2goZnVuY3Rpb24gKGlkKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQoaWQpO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIFtdLmZvckVhY2guY2FsbChjaGFycywgZnVuY3Rpb24gKGNoYXIpIHtcbiAgICAgICAgICAgIGNoYXIuc3R5bGUub3BhY2l0eSA9IFwiMVwiO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHRoZW4oKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBjYW5jZWw6IGNhbmNlbFxuICAgIH07XG59XG5cbmZ1bmN0aW9uIGhpZGVDaGFyYWN0ZXJzIChlbGVtZW50KSB7XG4gICAgXG4gICAgdmFyIGNoYXJzID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLkNoYXJcIik7XG4gICAgXG4gICAgW10uZm9yRWFjaC5jYWxsKGNoYXJzLCBmdW5jdGlvbiAoY2hhcikge1xuICAgICAgICBjaGFyLnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBtYXJrQ2hhcmFjdGVycyAoZWxlbWVudCwgb2Zmc2V0KSB7XG4gICAgXG4gICAgdmFyIFRFWFRfTk9ERSA9IDM7XG4gICAgdmFyIEVMRU1FTlQgPSAxO1xuICAgIFxuICAgIG9mZnNldCA9IG9mZnNldCB8fCAwO1xuICAgIFxuICAgIFtdLmZvckVhY2guY2FsbChlbGVtZW50LmNoaWxkTm9kZXMsIGZ1bmN0aW9uIChjaGlsZCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIHRleHQgPSBcIlwiLCBuZXdOb2RlO1xuICAgICAgICBcbiAgICAgICAgaWYgKGNoaWxkLm5vZGVUeXBlID09PSBURVhUX05PREUpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgW10uZm9yRWFjaC5jYWxsKGNoaWxkLnRleHRDb250ZW50LCBmdW5jdGlvbiAoY2hhcikge1xuICAgICAgICAgICAgICAgIHRleHQgKz0gJzxzcGFuIGNsYXNzPVwiQ2hhclwiIGRhdGEtY2hhcj1cIicgKyBvZmZzZXQgKyAnXCI+JyArIGNoYXIgKyAnPC9zcGFuPic7XG4gICAgICAgICAgICAgICAgb2Zmc2V0ICs9IDE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbmV3Tm9kZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBuZXdOb2RlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiQ2hhckNvbnRhaW5lclwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbmV3Tm9kZS5pbm5lckhUTUwgPSB0ZXh0O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjaGlsZC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChuZXdOb2RlLCBjaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY2hpbGQubm9kZVR5cGUgPT09IEVMRU1FTlQpIHtcbiAgICAgICAgICAgIG9mZnNldCA9IG1hcmtDaGFyYWN0ZXJzKGNoaWxkLCBvZmZzZXQpO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIG9mZnNldDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXZlYWw7XG4iLCJcbnZhciB0b29scyA9IHt9O1xuXG4vKipcbiAqIFNldHMgdGhlIHggYW5kIHkgdW5pdHMgb24gYW4gYXNzZXQgb2JqZWN0IGFjY29yZGluZ1xuICogdG8gaXQncyBkZWZpbml0aW9uIGluIHRoZSBXZWJTdG9yeS5cbiAqIEBwYXJhbSBvYmogVGhlIEphdmFTY3JpcHQgb2JqZWN0IGFzc2V0LlxuICogQHBhcmFtIGFzc2V0IFRoZSBYTUwgRWxlbWVudCB3aXRoIHRoZSBhc3NldCdzIGluZm9ybWF0aW9uLlxuICovXG50b29scy5hcHBseUFzc2V0VW5pdHMgPSBmdW5jdGlvbiAob2JqLCBhc3NldCkge1xuICAgIFxuICAgIHZhciB4LCB5O1xuICAgIFxuICAgIHggPSBhc3NldC5nZXRBdHRyaWJ1dGUoJ3gnKSB8fCBcIlwiO1xuICAgIHkgPSBhc3NldC5nZXRBdHRyaWJ1dGUoJ3knKSB8fCBcIlwiO1xuICAgIG9iai54VW5pdCA9IHgucmVwbGFjZSgvXi4qKHB4fCUpJC8sICckMScpO1xuICAgIG9iai54VW5pdCA9IG9iai54VW5pdCB8fCAncHgnO1xuICAgIG9iai55VW5pdCA9IHkucmVwbGFjZSgvXi4qKHB4fCUpJC8sICckMScpO1xuICAgIG9iai55VW5pdCA9IG9iai55VW5pdCB8fCAncHgnO1xuICAgIFxuICAgIGlmIChvYmoueFVuaXQgIT09IFwicHhcIiAmJiBvYmoueFVuaXQgIT09IFwiJVwiKSB7XG4gICAgICAgIG9iai54VW5pdCA9IFwicHhcIjtcbiAgICB9XG4gICAgXG4gICAgaWYgKG9iai55VW5pdCAhPT0gXCJweFwiICYmIG9iai55VW5pdCAhPT0gXCIlXCIpIHtcbiAgICAgICAgb2JqLnlVbml0ID0gXCJweFwiO1xuICAgIH1cbn07XG5cbi8qKlxuICogUmVtb3ZlcyBhIERPTSBFdmVudCBmcm9tIGEgRE9NIEVsZW1lbnQuXG4gKi9cbnRvb2xzLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBmdW5jdGlvbiAoZWxlbSwgdHlwZSwgbGlzdGVuZXIpIHtcbiAgICBcbiAgICBpZiAodHlwZW9mIGVsZW0gPT09IFwidW5kZWZpbmVkXCIgfHwgZWxlbSA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgZmFsc2UpO1xufTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0aGF0IHJlcGxhY2VzIHRoZSBuYW1lcyBvZiB2YXJpYWJsZXMgaW4gYSBzdHJpbmdcbiAqIHdpdGggdGhlaXIgcmVzcGVjdGl2ZSB2YWx1ZXMuXG4gKiBcbiAqIEBwYXJhbSB0ZXh0IFtzdHJpbmddIFRoZSB0ZXh0IHRoYXQgY29udGFpbnMgdmFyaWFibGVzLlxuICogQHBhcmFtIGludGVycHJldGVyIFtXU0UuSW50ZXJwcmV0ZXJdIFRoZSBpbnRlcnByZXRlciBpbnN0YW5jZS5cbiAqIEByZXR1cm4gW3N0cmluZ10gVGhlIHRleHQgd2l0aCB0aGUgaW5zZXJ0ZWQgdmFyaWFibGUgdmFsdWVzLlxuICovXG50b29scy5yZXBsYWNlVmFyaWFibGVzID0gZnVuY3Rpb24gKHRleHQsIGludGVycHJldGVyKSB7XG4gICAgXG4gICAgdmFyIGYxLCBmMjtcbiAgICBcbiAgICBpZiAodGV4dCA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdGV4dDtcbiAgICB9XG4gICAgXG4gICAgaWYgKHR5cGVvZiB0ZXh0ICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGludGVycHJldGVyLmJ1cy50cmlnZ2VyKFwid3NlLmludGVycHJldGVyLmVycm9yXCIsIHtcbiAgICAgICAgICAgIG1lc3NhZ2U6IFwiQXJndW1lbnQgc3VwcGxpZWQgdG8gdGhlIHJlcGxhY2VWYXJpYWJsZXMgZnVuY3Rpb24gbXVzdCBiZSBhIHN0cmluZy5cIlxuICAgICAgICB9KTtcbiAgICAgICAgdGV4dCA9IFwiXCI7XG4gICAgfVxuICAgIFxuICAgIGYxID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIG5hbWUgPSBhcmd1bWVudHNbMV07XG4gICAgICAgIFxuICAgICAgICBpZiAoaW50ZXJwcmV0ZXIuZ2xvYmFsVmFycy5oYXMobmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiICsgaW50ZXJwcmV0ZXIuZ2xvYmFsVmFycy5nZXQobmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH07XG4gICAgXG4gICAgZjIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgbmFtZSA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgXG4gICAgICAgIGlmIChuYW1lIGluIGludGVycHJldGVyLnJ1blZhcnMpIHtcbiAgICAgICAgICAgIHJldHVybiBcIlwiICsgaW50ZXJwcmV0ZXIucnVuVmFyc1tuYW1lXTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfTtcbiAgICBcbiAgICAvLyBpbnNlcnQgdmFsdWVzIG9mIGdsb2JhbCB2YXJpYWJsZXMgKCQkdmFyKTpcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cXHtcXCRcXCQoW2EtekEtWjAtOV9dKylcXH0vZywgZjEpO1xuICAgIFxuICAgIC8vIGluc2VydCB2YWx1ZXMgb2YgbG9jYWwgdmFyaWFibGVzICgkdmFyKTpcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cXHtcXCQoW2EtekEtWjAtOV9dKylcXH0vZywgZjIpO1xuICAgIFxuICAgIHJldHVybiB0ZXh0O1xufTtcblxudG9vbHMuZ2V0U2VyaWFsaXplZE5vZGVzID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICBcbiAgICB2YXIgc2VyID0gbmV3IFhNTFNlcmlhbGl6ZXIoKSwgbm9kZXMgPSBlbGVtZW50LmNoaWxkTm9kZXMsIGksIGxlbjsgICAgICAgIFxuICAgIHZhciB0ZXh0ID0gJyc7XG4gICAgXG4gICAgZm9yIChpID0gMCwgbGVuID0gbm9kZXMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgdGV4dCArPSBzZXIuc2VyaWFsaXplVG9TdHJpbmcobm9kZXNbaV0pO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gdGV4dDtcbn07XG5cbnRvb2xzLmdldFBhcnNlZEF0dHJpYnV0ZSA9IGZ1bmN0aW9uIChlbGVtZW50LCBhdHRyaWJ1dGVOYW1lLCBpbnRlcnByZXRlciwgZGVmYXVsdFZhbHVlKSB7XG4gICAgXG4gICAgdmFyIHZhbHVlO1xuICAgIFxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMykge1xuICAgICAgICBkZWZhdWx0VmFsdWUgPSBcIlwiO1xuICAgIH1cbiAgICBcbiAgICB2YWx1ZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpIHx8IChcIlwiICsgZGVmYXVsdFZhbHVlKTtcbiAgICBcbiAgICByZXR1cm4gdG9vbHMucmVwbGFjZVZhcmlhYmxlcyh2YWx1ZSwgaW50ZXJwcmV0ZXIpO1xufTtcblxuLyoqXG4gKiBSZXBsYWNlcyB7IGFuZCB9IHRvIDwgYW5kID4gZm9yIG1ha2luZyBpdCBIVE1MLlxuICogT3B0aW9uYWxseSByZXBsYWNlcyBuZXdsaW5lcyB3aXRoIDxicmVhaz4gZWxlbWVudHMuXG4gKiBcbiAqIEBwYXJhbSB0ZXh0IFtzdHJpbmddIFRoZSB0ZXh0IHRvIGNvbnZlcnQgdG8gSFRNTC5cbiAqIEBwYXJhbSBubHRvYnIgW2Jvb2xdIFNob3VsZCBuZXdsaW5lcyBiZSBjb252ZXJ0ZWQgdG8gYnJlYWtzPyBEZWZhdWx0OiBmYWxzZS5cbiAqL1xudG9vbHMudGV4dFRvSHRtbCA9IGZ1bmN0aW9uICh0ZXh0LCBubHRvYnIpIHtcbiAgICBcbiAgICBubHRvYnIgPSBubHRvYnIgfHwgZmFsc2U7XG4gICAgXG4gICAgaWYgKCEoU3RyaW5nLnByb3RvdHlwZS50cmltKSkge1xuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9eXFxuLywgXCJcIik7XG4gICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoL1xcbiQvLCBcIlwiKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRleHQgPSB0ZXh0LnRyaW0oKTtcbiAgICB9XG4gICAgXG4gICAgdGV4dCA9IG5sdG9iciA9PT0gdHJ1ZSA/IHRleHQucmVwbGFjZSgvXFxuL2csIFwiPGJyIC8+XCIpIDogdGV4dDtcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cXHsvZywgXCI8XCIpO1xuICAgIHRleHQgPSB0ZXh0LnJlcGxhY2UoL1xcfS9nLCBcIj5cIik7XG4gICAgXG4gICAgcmV0dXJuIHRleHQ7XG59O1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhIHVuaXF1ZSBJRC4gVXNlZCBieSBhc3NldHMgdG8gaWRlbnRpZnkgdGhlaXIgb3duIHN0dWZmXG4gKiBpbiBzYXZlZ2FtZXMgYW5kIHRoZSBET00gb2YgdGhlIHN0YWdlLlxuICogXG4gKiBAcmV0dXJuIFtudW1iZXJdIFRoZSB1bmlxdWUgSUQuXG4gKi9cbnRvb2xzLmdldFVuaXF1ZUlkID0gKGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgdW5pcXVlSWRDb3VudCA9IDA7XG4gICAgXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdW5pcXVlSWRDb3VudCArPSAxO1xuICAgICAgICByZXR1cm4gdW5pcXVlSWRDb3VudDtcbiAgICB9O1xufSgpKTtcblxuLyoqXG4gKiBDb252ZXJ0cyB0aGUgZmlyc3QgY2hhcmFjdGVyIGluIGEgc3RyaW5nIHRvIHVwcGVyIGNhc2UuXG4gKiBcbiAqIEBwYXJhbSBpbnB1dCBbc3RyaW5nXSBUaGUgc3RyaW5nIHRvIHRyYW5zZm9ybS5cbiAqIEByZXR1cm4gW3N0cmluZ10gVGhlIHRyYW5zZm9ybWVkIHN0cmluZy5cbiAqL1xudG9vbHMuZmlyc3RMZXR0ZXJVcHBlcmNhc2UgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICBcbiAgICBpZiAoaW5wdXQubGVuZ3RoIDwgMSkge1xuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIFwiXCIgKyBpbnB1dC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGlucHV0LnJlcGxhY2UoL14uezF9LywgXCJcIik7XG59O1xuXG50b29scy5taXhpbiA9IGZ1bmN0aW9uIChzb3VyY2UsIHRhcmdldCkge1xuICAgIFxuICAgIHZhciBrZXk7XG4gICAgXG4gICAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG50b29scy5leHRyYWN0VW5pdCA9IGZ1bmN0aW9uIChudW1iZXJTdHJpbmcpIHtcbiAgICByZXR1cm4gdHlwZW9mIG51bWJlclN0cmluZyAhPT0gXCJzdHJpbmdcIiA/IFwiXCIgOiBudW1iZXJTdHJpbmcucmVwbGFjZSgvXigtKXswLDF9WzAtOV0qLywgXCJcIik7XG59O1xuXG50b29scy5jYWxjdWxhdGVWYWx1ZVdpdGhBbmNob3IgPSBmdW5jdGlvbiAob2xkVmFsdWUsIGFuY2hvciwgbWF4VmFsdWUpIHtcblxuICAgIHZhciB2YWx1ZSA9IDAsIGFuY2hvclVuaXQgPSBcInB4XCI7XG4gICAgXG4gICAgaWYgKCFhbmNob3IpIHtcbiAgICAgICAgcmV0dXJuIG9sZFZhbHVlO1xuICAgIH1cbiAgICBcbiAgICBhbmNob3JVbml0ID0gdG9vbHMuZXh0cmFjdFVuaXQoYW5jaG9yKTtcbiAgICBhbmNob3IgPSBwYXJzZUludChhbmNob3IsIDEwKTtcbiAgICBcbiAgICBpZiAoYW5jaG9yVW5pdCA9PT0gXCIlXCIpIHtcbiAgICAgICAgdmFsdWUgPSBvbGRWYWx1ZSAtICgobWF4VmFsdWUgLyAxMDApICogYW5jaG9yKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhbHVlID0gb2xkVmFsdWUgLSBhbmNob3I7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB2YWx1ZTtcbn07XG5cbnRvb2xzLmdldFdpbmRvd0RpbWVuc2lvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIGUgPSB3aW5kb3csXG4gICAgICAgIGEgPSAnaW5uZXInO1xuICAgIFxuICAgIGlmICghKCdpbm5lcldpZHRoJyBpbiBlKSkge1xuICAgICAgICBhID0gJ2NsaWVudCc7XG4gICAgICAgIGUgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgfHwgZG9jdW1lbnQuYm9keTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgd2lkdGg6IGVbYSArICdXaWR0aCddLFxuICAgICAgICBoZWlnaHQ6IGVbYSArICdIZWlnaHQnXVxuICAgIH07XG59O1xuXG50b29scy5maXRUb1dpbmRvdyA9IGZ1bmN0aW9uIChlbCwgdywgaCkge1xuICAgIFxuICAgIHZhciBkaW0sIHJhdGlvLCBzdywgc2gsIHJhdGlvVywgcmF0aW9IO1xuICAgIFxuICAgIGRpbSA9IHRvb2xzLmdldFdpbmRvd0RpbWVuc2lvbnMoKTtcbiAgICBcbiAgICBzdyA9IGRpbS53aWR0aDsgLy8gLSAoZGltLndpZHRoICogMC4wMSk7XG4gICAgc2ggPSBkaW0uaGVpZ2h0OyAvLyAtIChkaW0uaGVpZ2h0ICogMC4wMSk7XG4gICAgXG4gICAgcmF0aW9XID0gc3cgLyB3O1xuICAgIHJhdGlvSCA9IHNoIC8gaDtcbiAgICBcbiAgICByYXRpbyA9IHJhdGlvVyA+IHJhdGlvSCA/IHJhdGlvSCA6IHJhdGlvVztcbiAgICBcbiAgICAvL3JhdGlvID0gcGFyc2VJbnQocmF0aW8gKiAxMDApIC8gMTAwO1xuICAgIFxuICAgIGVsLnNldEF0dHJpYnV0ZSgnc3R5bGUnLFxuICAgIGVsLmdldEF0dHJpYnV0ZSgnc3R5bGUnKSArICcgLW1vei10cmFuc2Zvcm06IHNjYWxlKCcgKyByYXRpbyArICcsJyArIHJhdGlvICtcbiAgICAgICAgJykgcm90YXRlKDAuMDFkZWcpOycgKyAnIC1tcy10cmFuc2Zvcm06IHNjYWxlKCcgKyByYXRpbyArICcsJyArIHJhdGlvICtcbiAgICAgICAgJyk7JyArICcgLW8tdHJhbnNmb3JtOiBzY2FsZSgnICsgcmF0aW8gKyAnLCcgKyByYXRpbyArXG4gICAgICAgICcpOycgKyAnIC13ZWJraXQtdHJhbnNmb3JtOiBzY2FsZSgnICsgcmF0aW8gKyAnLCcgKyByYXRpbyArICcpOycgK1xuICAgICAgICAnIHRyYW5zZm9ybTogc2NhbGUoJyArIHJhdGlvICsgJywnICsgcmF0aW8gKyAnKTsnKTtcbn07XG5cbnRvb2xzLmxvZyA9IGZ1bmN0aW9uIChidXMsIG1lc3NhZ2UpIHtcbiAgICB0b29scy50cmlnZ2VyKGJ1cywgXCJ3c2UuaW50ZXJwcmV0ZXIubWVzc2FnZVwiLCBtZXNzYWdlKTtcbn07XG5cbnRvb2xzLndhcm4gPSBmdW5jdGlvbiAoYnVzLCBtZXNzYWdlLCBlbGVtZW50KSB7XG4gICAgdG9vbHMudHJpZ2dlcihidXMsIFwid3NlLmludGVycHJldGVyLndhcm5pbmdcIiwgbWVzc2FnZSwgZWxlbWVudCk7XG59O1xuXG50b29scy5sb2dFcnJvciA9IGZ1bmN0aW9uIChidXMsIG1lc3NhZ2UsIGVsZW1lbnQpIHtcbiAgICB0b29scy50cmlnZ2VyKGJ1cywgXCJ3c2UuaW50ZXJwcmV0ZXIuZXJyb3JcIiwgbWVzc2FnZSwgZWxlbWVudCk7XG59O1xuXG50b29scy50cmlnZ2VyID0gZnVuY3Rpb24gKGJ1cywgY2hhbm5lbCwgbWVzc2FnZSwgZWxlbWVudCkge1xuICAgIGJ1cy50cmlnZ2VyKGNoYW5uZWwsIHtcbiAgICAgICAgZWxlbWVudDogZWxlbWVudCB8fCBudWxsLFxuICAgICAgICBtZXNzYWdlOiBtZXNzYWdlXG4gICAgfSk7XG59O1xuXG4vL1xuLy8gIyMgW2Z1bmN0aW9uXSB0cnV0aHlcbi8vXG4vLyBBIGZ1bmN0aW9uIHRoYXQgY2hlY2tzIHdoZXRoZXIgYW4gYXR0cmlidXRlIHZhbHVlIGlzIGNvbnNpZGVyZWQgdHJ1dGh5IGJ5XG4vLyB0aGUgZW5naW5lLiBUcnV0aHkgdmFsdWVzIGFyZSBgdHJ1ZWAgYW5kIGB5ZXNgLlxuLy9cbi8vICAgICB0cnV0aHkgOjogYW55IC0+IGJvb2xlYW5cbi8vXG50b29scy50cnV0aHkgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICByZXR1cm4gW1widHJ1ZVwiLCBcInllc1wiXS5pbmRleE9mKHZhbHVlKSA+PSAwO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB0b29scztcbiIsIlxudmFyIHRvb2xzID0gcmVxdWlyZShcIi4uL3Rvb2xzL3Rvb2xzXCIpO1xuXG52YXIgd2FybiA9IHRvb2xzLndhcm47XG52YXIgcmVwbGFjZVZhcnMgPSB0b29scy5yZXBsYWNlVmFyaWFibGVzO1xuXG52YXIgS0VZQ09ERV9FTlRFUiA9IDEzO1xudmFyIEtFWUNPREVfRVNDQVBFID0gMjc7XG5cbnZhciB1aSA9IHtcbiAgICBcbiAgICBjb25maXJtOiBmdW5jdGlvbiAoaW50ZXJwcmV0ZXIsIGFyZ3MpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciB0aXRsZSwgbWVzc2FnZSwgdHJ1ZVRleHQsIGZhbHNlVGV4dCwgY2FsbGJhY2ssIHJvb3QsIGRpYWxvZztcbiAgICAgICAgdmFyIHRFbCwgbUVsLCB5ZXNFbCwgbm9FbCwgY29udGFpbmVyLCBwYXVzZSwgb2xkU3RhdGUsIGRvTmV4dDtcbiAgICAgICAgXG4gICAgICAgIGludGVycHJldGVyLndhaXRDb3VudGVyICs9IDE7XG4gICAgICAgIFxuICAgICAgICBhcmdzID0gYXJncyB8fCB7fTtcbiAgICAgICAgdGl0bGUgPSBhcmdzLnRpdGxlIHx8IFwiQ29uZmlybT9cIjtcbiAgICAgICAgbWVzc2FnZSA9IGFyZ3MubWVzc2FnZSB8fCBcIkRvIHlvdSB3YW50IHRvIHByb2NlZWQ/XCI7XG4gICAgICAgIHRydWVUZXh0ID0gYXJncy50cnVlVGV4dCB8fCBcIlllc1wiO1xuICAgICAgICBmYWxzZVRleHQgPSBhcmdzLmZhbHNlVGV4dCB8fCBcIk5vXCI7XG4gICAgICAgIGNhbGxiYWNrID0gdHlwZW9mIGFyZ3MuY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIiA/IGFyZ3MuY2FsbGJhY2sgOiBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgcm9vdCA9IGFyZ3MucGFyZW50IHx8IGludGVycHJldGVyLnN0YWdlO1xuICAgICAgICBwYXVzZSA9IGFyZ3MucGF1c2UgPT09IHRydWUgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIG9sZFN0YXRlID0gaW50ZXJwcmV0ZXIuc3RhdGU7XG4gICAgICAgIGRvTmV4dCA9IGFyZ3MuZG9OZXh0ID09PSB0cnVlID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgaWYgKHBhdXNlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBpbnRlcnByZXRlci5zdGF0ZSA9IFwicGF1c2VcIjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiV1NFVUlDb250YWluZXJcIik7XG4gICAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoXCJkYXRhLXdzZS1yZW1vdmVcIiwgXCJ0cnVlXCIpO1xuICAgICAgICBkaWFsb2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBkaWFsb2cuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJXU0VVSURpYWxvZyBXU0VVSUNvbmZpcm1cIik7XG4gICAgICAgIFxuICAgICAgICB0RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0RWwuaW5uZXJIVE1MID0gdGl0bGU7XG4gICAgICAgIHRFbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInRpdGxlXCIpO1xuICAgICAgICBcbiAgICAgICAgbUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgbUVsLmlubmVySFRNTCA9IG1lc3NhZ2U7XG4gICAgICAgIG1FbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIm1lc3NhZ2VcIik7XG4gICAgICAgIFxuICAgICAgICB5ZXNFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgeWVzRWwuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgdHJ1ZVRleHQpO1xuICAgICAgICB5ZXNFbC52YWx1ZSA9IHRydWVUZXh0O1xuICAgICAgICB5ZXNFbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInRydWUgYnV0dG9uXCIpO1xuICAgICAgICB5ZXNFbC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYnV0dG9uXCIpO1xuICAgICAgICB5ZXNFbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixcbiAgICAgICAgXG4gICAgICAgIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByb290LnJlbW92ZUNoaWxkKGNvbnRhaW5lcik7XG4gICAgICAgICAgICBpbnRlcnByZXRlci53YWl0Q291bnRlciAtPSAxO1xuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICBpbnRlcnByZXRlci5rZXlzRGlzYWJsZWQgLT0gMTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHBhdXNlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXIuc3RhdGUgPSBvbGRTdGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY2FsbGJhY2sodHJ1ZSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChkb05leHQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXIubmV4dCgpO1xuICAgICAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIG5vRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgIG5vRWwuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgZmFsc2VUZXh0KTtcbiAgICAgICAgbm9FbC52YWx1ZSA9IGZhbHNlVGV4dDtcbiAgICAgICAgbm9FbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImZhbHNlIGJ1dHRvblwiKTtcbiAgICAgICAgbm9FbC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYnV0dG9uXCIpO1xuICAgICAgICBub0VsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLFxuICAgICAgICBcbiAgICAgICAgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJvb3QucmVtb3ZlQ2hpbGQoY29udGFpbmVyKTtcbiAgICAgICAgICAgIGludGVycHJldGVyLndhaXRDb3VudGVyIC09IDE7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChwYXVzZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGludGVycHJldGVyLnN0YXRlID0gb2xkU3RhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGRvTmV4dCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnByZXRlci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgZGlhbG9nLmFwcGVuZENoaWxkKHRFbCk7XG4gICAgICAgIGRpYWxvZy5hcHBlbmRDaGlsZChtRWwpO1xuICAgICAgICBkaWFsb2cuYXBwZW5kQ2hpbGQoeWVzRWwpO1xuICAgICAgICBkaWFsb2cuYXBwZW5kQ2hpbGQobm9FbCk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaWFsb2cpO1xuICAgICAgICByb290LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgICAgIFxuICAgICAgICB5ZXNFbC5mb2N1cygpO1xuICAgIH0sXG4gICAgXG4gICAgYWxlcnQ6IGZ1bmN0aW9uIChpbnRlcnByZXRlciwgYXJncykge1xuICAgICAgICBcbiAgICAgICAgdmFyIHRpdGxlLCBtZXNzYWdlLCBva1RleHQsIGNhbGxiYWNrLCByb290LCBkaWFsb2c7XG4gICAgICAgIHZhciB0RWwsIG1FbCwgYnV0dG9uRWwsIGNvbnRhaW5lciwgcGF1c2UsIG9sZFN0YXRlLCBkb05leHQ7XG4gICAgICAgIFxuICAgICAgICBpbnRlcnByZXRlci53YWl0Q291bnRlciArPSAxO1xuICAgICAgICBcbiAgICAgICAgYXJncyA9IGFyZ3MgfHwge307XG4gICAgICAgIHRpdGxlID0gYXJncy50aXRsZSB8fCBcIkFsZXJ0IVwiO1xuICAgICAgICBtZXNzYWdlID0gYXJncy5tZXNzYWdlIHx8IFwiUGxlYXNlIHRha2Ugbm90aWNlIG9mIHRoaXMhXCI7XG4gICAgICAgIG9rVGV4dCA9IGFyZ3Mub2tUZXh0IHx8IFwiT0tcIjtcbiAgICAgICAgY2FsbGJhY2sgPSB0eXBlb2YgYXJncy5jYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiID8gYXJncy5jYWxsYmFjayA6IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICByb290ID0gYXJncy5wYXJlbnQgfHwgaW50ZXJwcmV0ZXIuc3RhZ2U7XG4gICAgICAgIHBhdXNlID0gYXJncy5wYXVzZSA9PT0gdHJ1ZSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgb2xkU3RhdGUgPSBpbnRlcnByZXRlci5zdGF0ZTtcbiAgICAgICAgZG9OZXh0ID0gYXJncy5kb05leHQgPT09IHRydWUgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIFxuICAgICAgICBpZiAocGF1c2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGludGVycHJldGVyLnN0YXRlID0gXCJwYXVzZVwiO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJXU0VVSUNvbnRhaW5lclwiKTtcbiAgICAgICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZShcImRhdGEtd3NlLXJlbW92ZVwiLCBcInRydWVcIik7XG4gICAgICAgIGRpYWxvZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGRpYWxvZy5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIldTRVVJRGlhbG9nIFdTRVVJQ29uZmlybVwiKTtcbiAgICAgICAgXG4gICAgICAgIHRFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHRFbC5pbm5lckhUTUwgPSB0aXRsZTtcbiAgICAgICAgdEVsLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwidGl0bGVcIik7XG4gICAgICAgIFxuICAgICAgICBtRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBtRWwuaW5uZXJIVE1MID0gbWVzc2FnZTtcbiAgICAgICAgbUVsLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibWVzc2FnZVwiKTtcbiAgICAgICAgXG4gICAgICAgIGJ1dHRvbkVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICBidXR0b25FbC5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCBva1RleHQpO1xuICAgICAgICBidXR0b25FbC52YWx1ZSA9IG9rVGV4dDtcbiAgICAgICAgYnV0dG9uRWwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJ0cnVlIGJ1dHRvblwiKTtcbiAgICAgICAgYnV0dG9uRWwuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcbiAgICAgICAgYnV0dG9uRWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsXG4gICAgICAgIFxuICAgICAgICBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcm9vdC5yZW1vdmVDaGlsZChjb250YWluZXIpO1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgLT0gMTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHBhdXNlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXIuc3RhdGUgPSBvbGRTdGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY2FsbGJhY2sodHJ1ZSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChkb05leHQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXIubmV4dCgpO1xuICAgICAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGRpYWxvZy5hcHBlbmRDaGlsZCh0RWwpO1xuICAgICAgICBkaWFsb2cuYXBwZW5kQ2hpbGQobUVsKTtcbiAgICAgICAgZGlhbG9nLmFwcGVuZENoaWxkKGJ1dHRvbkVsKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGRpYWxvZyk7XG4gICAgICAgIHJvb3QuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICAgICAgXG4gICAgICAgIGJ1dHRvbkVsLmZvY3VzKCk7XG4gICAgfSxcbiAgICBcbiAgICBwcm9tcHQ6IGZ1bmN0aW9uIChpbnRlcnByZXRlciwgYXJncykge1xuICAgICAgICBcbiAgICAgICAgdmFyIHRpdGxlLCBtZXNzYWdlLCBzdWJtaXRUZXh0LCBjYW5jZWxUZXh0LCBjYWxsYmFjaywgcm9vdCwgZGlhbG9nLCBvbGRTdGF0ZTtcbiAgICAgICAgdmFyIHRFbCwgbUVsLCBidXR0b25FbCwgY2FuY2VsRWwsIGlucHV0RWwsIGNvbnRhaW5lciwgcGF1c2UsIGRvTmV4dDtcbiAgICAgICAgdmFyIGFsbG93RW1wdHlJbnB1dCwgaGlkZUNhbmNlbEJ1dHRvbiwgcHJlZmlsbDtcbiAgICAgICAgXG4gICAgICAgIGludGVycHJldGVyLndhaXRDb3VudGVyICs9IDE7XG4gICAgICAgIFxuICAgICAgICBhcmdzID0gYXJncyB8fCB7fTtcbiAgICAgICAgdGl0bGUgPSBhcmdzLnRpdGxlIHx8IFwiSW5wdXQgcmVxdWlyZWRcIjtcbiAgICAgICAgbWVzc2FnZSA9IGFyZ3MubWVzc2FnZSB8fCBcIlBsZWFzZSBlbnRlciBzb21ldGhpbmc6XCI7XG4gICAgICAgIHN1Ym1pdFRleHQgPSBhcmdzLnN1Ym1pdFRleHQgfHwgXCJTdWJtaXRcIjtcbiAgICAgICAgY2FuY2VsVGV4dCA9IGFyZ3MuY2FuY2VsVGV4dCB8fCBcIkNhbmNlbFwiO1xuICAgICAgICBjYWxsYmFjayA9IHR5cGVvZiBhcmdzLmNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIgPyBhcmdzLmNhbGxiYWNrIDogZnVuY3Rpb24gKCkge307XG4gICAgICAgIHJvb3QgPSBhcmdzLnBhcmVudCB8fCBpbnRlcnByZXRlci5zdGFnZTtcbiAgICAgICAgcGF1c2UgPSBhcmdzLnBhdXNlID09PSB0cnVlID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICBvbGRTdGF0ZSA9IGludGVycHJldGVyLnN0YXRlO1xuICAgICAgICBkb05leHQgPSBhcmdzLmRvTmV4dCA9PT0gdHJ1ZSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgYWxsb3dFbXB0eUlucHV0ID0gYXJncy5hbGxvd0VtcHR5SW5wdXQ7XG4gICAgICAgIGhpZGVDYW5jZWxCdXR0b24gPSBhcmdzLmhpZGVDYW5jZWxCdXR0b247XG4gICAgICAgIHByZWZpbGwgPSBhcmdzLnByZWZpbGwgfHwgXCJcIjtcbiAgICAgICAgXG4gICAgICAgIGlmIChwYXVzZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXIuc3RhdGUgPSBcInBhdXNlXCI7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIldTRVVJQ29udGFpbmVyXCIpO1xuICAgICAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKFwiZGF0YS13c2UtcmVtb3ZlXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgZGlhbG9nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgZGlhbG9nLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiV1NFVUlEaWFsb2cgV1NFVUlQcm9tcHRcIik7XG4gICAgICAgIFxuICAgICAgICB0RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0RWwuaW5uZXJIVE1MID0gdGl0bGU7XG4gICAgICAgIHRFbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInRpdGxlXCIpO1xuICAgICAgICBcbiAgICAgICAgbUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgbUVsLmlubmVySFRNTCA9IG1lc3NhZ2U7XG4gICAgICAgIG1FbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIm1lc3NhZ2VcIik7XG4gICAgICAgIFxuICAgICAgICBpbnB1dEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICBpbnB1dEVsLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIHByZWZpbGwpO1xuICAgICAgICBpbnB1dEVsLnZhbHVlID0gcHJlZmlsbDtcbiAgICAgICAgaW5wdXRFbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImlucHV0IHRleHRcIik7XG4gICAgICAgIGlucHV0RWwuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInRleHRcIik7XG4gICAgICAgIFxuICAgICAgICBpbnB1dEVsLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXl1cFwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGNhbmNlbE9uRXNjYXBlKCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChhbGxvd0VtcHR5SW5wdXQpIHtcbiAgICAgICAgICAgICAgICBzdWJtaXRPbkVudGVyKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoaW5wdXRFbC52YWx1ZSkge1xuICAgICAgICAgICAgICAgIGJ1dHRvbkVsLmRpc2FibGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgc3VibWl0T25FbnRlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uRWwuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBmdW5jdGlvbiBzdWJtaXRPbkVudGVyICgpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gS0VZQ09ERV9FTlRFUikge1xuICAgICAgICAgICAgICAgICAgICBidXR0b25FbC5jbGljaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZnVuY3Rpb24gY2FuY2VsT25Fc2NhcGUgKCkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSBLRVlDT0RFX0VTQ0FQRSAmJiAhaGlkZUNhbmNlbEJ1dHRvbikge1xuICAgICAgICAgICAgICAgICAgICBjYW5jZWxFbC5jbGljaygpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGJ1dHRvbkVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICBidXR0b25FbC5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCBzdWJtaXRUZXh0KTtcbiAgICAgICAgYnV0dG9uRWwudmFsdWUgPSBzdWJtaXRUZXh0O1xuICAgICAgICBidXR0b25FbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInN1Ym1pdCBidXR0b25cIik7XG4gICAgICAgIGJ1dHRvbkVsLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJidXR0b25cIik7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWFsbG93RW1wdHlJbnB1dCAmJiAhcHJlZmlsbCkge1xuICAgICAgICAgICAgYnV0dG9uRWwuZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBidXR0b25FbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciB2YWwgPSBpbnB1dEVsLnZhbHVlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIWFsbG93RW1wdHlJbnB1dCAmJiAhdmFsKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByb290LnJlbW92ZUNoaWxkKGNvbnRhaW5lcik7XG4gICAgICAgICAgICBpbnRlcnByZXRlci53YWl0Q291bnRlciAtPSAxO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAocGF1c2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBpbnRlcnByZXRlci5zdGF0ZSA9IG9sZFN0YXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjYWxsYmFjayh2YWwpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoZG9OZXh0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGludGVycHJldGVyLm5leHQoKTtcbiAgICAgICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBjYW5jZWxFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgY2FuY2VsRWwuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgY2FuY2VsVGV4dCk7XG4gICAgICAgIGNhbmNlbEVsLnZhbHVlID0gY2FuY2VsVGV4dDtcbiAgICAgICAgY2FuY2VsRWwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJjYW5jZWwgYnV0dG9uXCIpO1xuICAgICAgICBjYW5jZWxFbC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYnV0dG9uXCIpO1xuICAgICAgICBcbiAgICAgICAgY2FuY2VsRWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByb290LnJlbW92ZUNoaWxkKGNvbnRhaW5lcik7XG4gICAgICAgICAgICBpbnRlcnByZXRlci53YWl0Q291bnRlciAtPSAxO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAocGF1c2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBpbnRlcnByZXRlci5zdGF0ZSA9IG9sZFN0YXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjYWxsYmFjayhudWxsKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGRvTmV4dCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnByZXRlci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgZGlhbG9nLmFwcGVuZENoaWxkKHRFbCk7XG4gICAgICAgIGRpYWxvZy5hcHBlbmRDaGlsZChtRWwpO1xuICAgICAgICBkaWFsb2cuYXBwZW5kQ2hpbGQoaW5wdXRFbCk7XG4gICAgICAgIGRpYWxvZy5hcHBlbmRDaGlsZChidXR0b25FbCk7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWhpZGVDYW5jZWxCdXR0b24pIHtcbiAgICAgICAgICAgIGRpYWxvZy5hcHBlbmRDaGlsZChjYW5jZWxFbCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaWFsb2cpO1xuICAgICAgICByb290LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgICAgIFxuICAgICAgICBpbnB1dEVsLmZvY3VzKCk7XG4gICAgfVxuICAgIFxufTtcblxudWkubWFrZUlucHV0Rm4gPSBmdW5jdGlvbiAodHlwZSkge1xuICAgIFxuICAgIHJldHVybiBmdW5jdGlvbiAoY29tbWFuZCwgaW50ZXJwcmV0ZXIpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciB0aXRsZSwgbWVzc2FnZSwgY29udGFpbmVyLCBrZXksIGRvTmV4dCwgaGlkZUNhbmNlbEJ1dHRvbiwgYWxsb3dFbXB0eUlucHV0O1xuICAgICAgICB2YXIgc3VibWl0VGV4dCwgY2FuY2VsVGV4dCwgcHJlZmlsbDtcbiAgICAgICAgXG4gICAgICAgIHRpdGxlID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiKSB8fCBcIklucHV0IHJlcXVpcmVkLi4uXCI7XG4gICAgICAgIG1lc3NhZ2UgPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcIm1lc3NhZ2VcIikgfHwgXCJZb3VyIGlucHV0IGlzIHJlcXVpcmVkOlwiO1xuICAgICAgICBrZXkgPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcInZhclwiKSB8fCBudWxsO1xuICAgICAgICBzdWJtaXRUZXh0ID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJzdWJtaXRUZXh0XCIpIHx8IFwiXCI7XG4gICAgICAgIGNhbmNlbFRleHQgPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcImNhbmNlbFRleHRcIikgfHwgXCJcIjtcbiAgICAgICAgcHJlZmlsbCA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwicHJlZmlsbFwiKSB8fCBcIlwiO1xuICAgICAgICBcbiAgICAgICAgYWxsb3dFbXB0eUlucHV0ID1cbiAgICAgICAgICAgIHJlcGxhY2VWYXJzKGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwiYWxsb3dFbXB0eUlucHV0XCIpIHx8IFwiXCIsIGludGVycHJldGVyKSA9PT0gXCJub1wiID9cbiAgICAgICAgICAgICAgICBmYWxzZSA6XG4gICAgICAgICAgICAgICAgdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgIGhpZGVDYW5jZWxCdXR0b24gPVxuICAgICAgICAgICAgcmVwbGFjZVZhcnMoY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJoaWRlQ2FuY2VsQnV0dG9uXCIpIHx8IFwiXCIsIGludGVycHJldGVyKSA9PT0gXCJ5ZXNcIiA/XG4gICAgICAgICAgICAgICAgdHJ1ZSA6XG4gICAgICAgICAgICAgICAgZmFsc2U7XG4gICAgICAgIFxuICAgICAgICBkb05leHQgPSByZXBsYWNlVmFycyhjb21tYW5kLmdldEF0dHJpYnV0ZShcIm5leHRcIikgfHwgXCJcIiwgaW50ZXJwcmV0ZXIpID09PSBcImZhbHNlXCIgP1xuICAgICAgICAgICAgZmFsc2UgOlxuICAgICAgICAgICAgdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgIGlmIChrZXkgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGtleSA9IHJlcGxhY2VWYXJzKGtleSwgaW50ZXJwcmV0ZXIpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aXRsZSA9IHJlcGxhY2VWYXJzKHRpdGxlLCBpbnRlcnByZXRlcik7XG4gICAgICAgIG1lc3NhZ2UgPSByZXBsYWNlVmFycyhtZXNzYWdlLCBpbnRlcnByZXRlcik7XG4gICAgICAgIGNhbmNlbFRleHQgPSByZXBsYWNlVmFycyhjYW5jZWxUZXh0LCBpbnRlcnByZXRlcik7XG4gICAgICAgIHN1Ym1pdFRleHQgPSByZXBsYWNlVmFycyhzdWJtaXRUZXh0LCBpbnRlcnByZXRlcik7XG4gICAgICAgIHByZWZpbGwgPSByZXBsYWNlVmFycyhwcmVmaWxsLCBpbnRlcnByZXRlcik7XG4gICAgICAgIFxuICAgICAgICBpbnRlcnByZXRlci5idXMudHJpZ2dlcihcIndzZS5pbnRlcnByZXRlci5jb21tYW5kcy5cIiArIHR5cGUsIGNvbW1hbmQpO1xuICAgICAgICBcbiAgICAgICAgaWYgKGtleSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgd2FybihpbnRlcnByZXRlci5idXMsIFwiTm8gJ3ZhcicgYXR0cmlidXRlIGRlZmluZWQgb24gXCIgKyB0eXBlICtcbiAgICAgICAgICAgICAgICBcIiBjb21tYW5kLiBDb21tYW5kIGlnbm9yZWQuXCIsIGNvbW1hbmQpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBkb05leHQ6IHRydWVcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNvbnRhaW5lciA9IGludGVycHJldGVyLnJ1blZhcnM7XG4gICAgICAgIFxuICAgICAgICB1aVt0eXBlXShcbiAgICAgICAgICAgIGludGVycHJldGVyLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRpdGxlOiB0aXRsZSxcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgICAgICAgICAgIHBhdXNlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGRvTmV4dDogZG9OZXh0LFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiAoZGVjaXNpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyW2tleV0gPSBcIlwiICsgZGVjaXNpb247XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhbGxvd0VtcHR5SW5wdXQ6IGFsbG93RW1wdHlJbnB1dCxcbiAgICAgICAgICAgICAgICBoaWRlQ2FuY2VsQnV0dG9uOiBoaWRlQ2FuY2VsQnV0dG9uLFxuICAgICAgICAgICAgICAgIHN1Ym1pdFRleHQ6IHN1Ym1pdFRleHQsXG4gICAgICAgICAgICAgICAgY2FuY2VsVGV4dDogY2FuY2VsVGV4dCxcbiAgICAgICAgICAgICAgICBwcmVmaWxsOiBwcmVmaWxsXG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZG9OZXh0OiB0cnVlXG4gICAgICAgIH07XG4gICAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdWk7XG4iXX0=
