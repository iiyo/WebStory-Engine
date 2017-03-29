/*
    WebStory Engine (v2017.1.0)
    Build time: Wed, 29 Mar 2017 19:15:09 GMT
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
    
    var dx, dy, element, self, xUnit, yUnit, duration, times;
    var ox, oy, stage;
    
    self = this;
    element = document.getElementById(this.cssid);
    dx = command.getAttribute("dx");
    dy = command.getAttribute("dy");
    times = command.getAttribute("times") || 2;
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
    
    function easing (distance) {
        return function (x) {
            return distance * Math.sin(x * (times * 2) * Math.PI);
        };
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
            0,
            1,
            function (v) {
                element.style.left = v + xUnit;
            },
            {
                duration: duration,
                easing: easing(dx)
            },
            function () {
                element.style.left = ox + xUnit;
                self.interpreter.waitCounter -= 1;
            }
        );
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
            0,
            1,
            function (v) {
                element.style.top = v + yUnit;
            },
            {
                duration: duration,
                easing: easing(dy)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jbGFzcy1tYW5pcHVsYXRvci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9kYXRhYnVzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2RhdGFidXMvc3JjL2RhdGFidXMuanMiLCJub2RlX21vZHVsZXMvZWFzZXMvYmFjay1pbi1vdXQuanMiLCJub2RlX21vZHVsZXMvZWFzZXMvYmFjay1pbi5qcyIsIm5vZGVfbW9kdWxlcy9lYXNlcy9iYWNrLW91dC5qcyIsIm5vZGVfbW9kdWxlcy9lYXNlcy9ib3VuY2UtaW4tb3V0LmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL2JvdW5jZS1pbi5qcyIsIm5vZGVfbW9kdWxlcy9lYXNlcy9ib3VuY2Utb3V0LmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL2NpcmMtaW4tb3V0LmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL2NpcmMtaW4uanMiLCJub2RlX21vZHVsZXMvZWFzZXMvY2lyYy1vdXQuanMiLCJub2RlX21vZHVsZXMvZWFzZXMvY3ViaWMtaW4tb3V0LmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL2N1YmljLWluLmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL2N1YmljLW91dC5qcyIsIm5vZGVfbW9kdWxlcy9lYXNlcy9lbGFzdGljLWluLW91dC5qcyIsIm5vZGVfbW9kdWxlcy9lYXNlcy9lbGFzdGljLWluLmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL2VsYXN0aWMtb3V0LmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL2V4cG8taW4tb3V0LmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL2V4cG8taW4uanMiLCJub2RlX21vZHVsZXMvZWFzZXMvZXhwby1vdXQuanMiLCJub2RlX21vZHVsZXMvZWFzZXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZWFzZXMvbGluZWFyLmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL3F1YWQtaW4tb3V0LmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL3F1YWQtaW4uanMiLCJub2RlX21vZHVsZXMvZWFzZXMvcXVhZC1vdXQuanMiLCJub2RlX21vZHVsZXMvZWFzZXMvcXVhcnQtaW4tb3V0LmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL3F1YXJ0LWluLmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL3F1YXJ0LW91dC5qcyIsIm5vZGVfbW9kdWxlcy9lYXNlcy9xdWludC1pbi1vdXQuanMiLCJub2RlX21vZHVsZXMvZWFzZXMvcXVpbnQtaW4uanMiLCJub2RlX21vZHVsZXMvZWFzZXMvcXVpbnQtb3V0LmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL3NpbmUtaW4tb3V0LmpzIiwibm9kZV9tb2R1bGVzL2Vhc2VzL3NpbmUtaW4uanMiLCJub2RlX21vZHVsZXMvZWFzZXMvc2luZS1vdXQuanMiLCJub2RlX21vZHVsZXMvZWFzeS1hamF4L2Vhc3ktYWpheC5qcyIsIm5vZGVfbW9kdWxlcy9lYXN5LWFqYXgvaW5kZXguanMiLCJub2RlX21vZHVsZXMvZW5qb3ktY29yZS9hcHBseS5qcyIsIm5vZGVfbW9kdWxlcy9lbmpveS1jb3JlL2F1dG8uanMiLCJub2RlX21vZHVsZXMvZW5qb3ktY29yZS9lYWNoLmpzIiwibm9kZV9tb2R1bGVzL2Vuam95LWNvcmUvZmluZC5qcyIsIm5vZGVfbW9kdWxlcy9lbmpveS1jb3JlL2ZyZWUuanMiLCJub2RlX21vZHVsZXMvZW5qb3ktY29yZS9zbGljZS5qcyIsIm5vZGVfbW9kdWxlcy9lbmpveS1jb3JlL3NvbWUuanMiLCJub2RlX21vZHVsZXMvZW5qb3ktdHlwZWNoZWNrcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9ob3dsZXIvaG93bGVyLmpzIiwibm9kZV9tb2R1bGVzL3N0cmluZy1kaWN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3RyYW5zZm9ybS1qcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy94bXVnbHkvaW5kZXguanMiLCJub2RlX21vZHVsZXMveG11Z2x5L3NyYy94bXVnbHkuanMiLCJzcmMvRGlzcGxheU9iamVjdC5qcyIsInNyYy9HYW1lLmpzIiwic3JjL0ludGVycHJldGVyLmpzIiwic3JjL0tleXMuanMiLCJzcmMvTG9hZGluZ1NjcmVlbi5qcyIsInNyYy9UcmlnZ2VyLmpzIiwic3JjL2Fzc2V0cy5qcyIsInNyYy9hc3NldHMvQXVkaW8uanMiLCJzcmMvYXNzZXRzL0JhY2tncm91bmQuanMiLCJzcmMvYXNzZXRzL0NoYXJhY3Rlci5qcyIsInNyYy9hc3NldHMvQ29tcG9zaXRlLmpzIiwic3JjL2Fzc2V0cy9DdXJ0YWluLmpzIiwic3JjL2Fzc2V0cy9JbWFnZXBhY2suanMiLCJzcmMvYXNzZXRzL1RleHRib3guanMiLCJzcmMvYnVzLmpzIiwic3JjL2NvbW1hbmRzLmpzIiwic3JjL2NvbW1hbmRzL2FsZXJ0LmpzIiwic3JjL2NvbW1hbmRzL2JyZWFrLmpzIiwic3JjL2NvbW1hbmRzL2Nob2ljZS5qcyIsInNyYy9jb21tYW5kcy9jb25maXJtLmpzIiwic3JjL2NvbW1hbmRzL2RvLmpzIiwic3JjL2NvbW1hbmRzL2ZuLmpzIiwic3JjL2NvbW1hbmRzL2dsb2JhbC5qcyIsInNyYy9jb21tYW5kcy9nbG9iYWxpemUuanMiLCJzcmMvY29tbWFuZHMvZ290by5qcyIsInNyYy9jb21tYW5kcy9saW5lLmpzIiwic3JjL2NvbW1hbmRzL2xvY2FsaXplLmpzIiwic3JjL2NvbW1hbmRzL3Byb21wdC5qcyIsInNyYy9jb21tYW5kcy9yZXN0YXJ0LmpzIiwic3JjL2NvbW1hbmRzL3NldF92YXJzLmpzIiwic3JjL2NvbW1hbmRzL3N1Yi5qcyIsInNyYy9jb21tYW5kcy90cmlnZ2VyLmpzIiwic3JjL2NvbW1hbmRzL3Zhci5qcyIsInNyYy9jb21tYW5kcy93YWl0LmpzIiwic3JjL2NvbW1hbmRzL3doaWxlLmpzIiwic3JjL2NvbW1hbmRzL3dpdGguanMiLCJzcmMvZGF0YVNvdXJjZXMuanMiLCJzcmMvZGF0YVNvdXJjZXMvTG9jYWxTdG9yYWdlLmpzIiwic3JjL2VuZ2luZS5qcyIsInNyYy9mdW5jdGlvbnMuanMiLCJzcmMvbG9hZGVyLmpzIiwic3JjL3NhdmVnYW1lcy5qcyIsInNyYy90b29scy9jb21waWxlLmpzIiwic3JjL3Rvb2xzL3JldmVhbC5qcyIsInNyYy90b29scy90b29scy5qcyIsInNyYy90b29scy91aS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BiQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckhBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeDBDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pNQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1MEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG53aW5kb3cuV1NFID0gcmVxdWlyZShcIi4vc3JjL2VuZ2luZVwiKTtcbiIsIi8vXG4vLyAjIGNsYXNzLW1hbmlwdWxhdG9yXG4vL1xuLy8gQSBjaGFpbmFibGUgd3JhcHBlciBBUEkgZm9yIG1hbmlwdWxhdGluZyBhIERPTSBFbGVtZW50J3MgY2xhc3NlcyBvciBjbGFzcyBzdHJpbmdzLlxuLy9cblxuLyogZ2xvYmFsIG1vZHVsZSAqL1xuXG4vL1xuLy8gIyMgUHVibGljIEFQSVxuLy9cblxuLy9cbi8vICoqbGlzdChlbGVtZW50KSAvIGxpc3QoY2xhc3NTdHJpbmcpKipcbi8vXG4vLyBDcmVhdGVzIGEgY2hhaW5hYmxlIEFQSSBmb3IgbWFuaXB1bGF0aW5nIGFuIGVsZW1lbnQncyBsaXN0IG9mIGNsYXNzZXMuIE5vIGNoYW5nZXNcbi8vIGFyZSBtYWRlIHRvIHRoZSBET00gRWxlbWVudCB1bmxlc3MgYC5hcHBseSgpYCBpcyBjYWxsZWQuXG4vL1xuLy8gICAgIERPTUVsZW1lbnR8c3RyaW5nIC0+IG9iamVjdFxuLy9cblxuZnVuY3Rpb24gbGlzdCAoZWxlbWVudCkge1xuICAgIFxuICAgIGVsZW1lbnQgPSB0eXBlb2YgZWxlbWVudCA9PT0gXCJvYmplY3RcIiA/IGVsZW1lbnQgOiBkdW1teShlbGVtZW50KTtcbiAgICBcbiAgICB2YXIgY2xhc3NlcyA9IHBhcnNlKGVsZW1lbnQpLCBjb250cm9scztcbiAgICBcbi8vXG4vLyAqKi5hcHBseSgpKipcbi8vXG4vLyBBcHBsaWVzIGNsYXNzIGxpc3QgdG8gdGhlIHNvdXJjZSBlbGVtZW50LlxuLy9cbi8vICAgICB2b2lkIC0+IG9iamVjdFxuLy9cbiAgICBcbiAgICBmdW5jdGlvbiBhcHBseSAoKSB7XG4gICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgdG9TdHJpbmcoKSk7XG4gICAgICAgIHJldHVybiBjb250cm9scztcbiAgICB9XG4gICAgXG4vL1xuLy8gKiouYWRkKG5hbWUpKipcbi8vXG4vLyBBZGRzIGEgY2xhc3MgdG8gdGhlIGVsZW1lbnQncyBsaXN0IG9mIGNsYXNzIG5hbWVzLlxuLy9cbi8vICAgICBzdHJpbmcgLT4gb2JqZWN0XG4vL1xuICAgIFxuICAgIGZ1bmN0aW9uIGFkZCAobmFtZSkge1xuICAgICAgICBcbiAgICAgICAgaWYgKGhhc1NwYWNlcyhuYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIGFkZE1hbnkoY2xhc3NTdHJpbmdUb0FycmF5KG5hbWUpKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKCFoYXMobmFtZSkpIHtcbiAgICAgICAgICAgIGNsYXNzZXMucHVzaChuYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGNvbnRyb2xzO1xuICAgIH1cbiAgICBcbi8vXG4vLyAqKi5hZGRNYW55KG5hbWVzKSoqXG4vL1xuLy8gQWRkcyBtYW55IGNsYXNzZXMgdG8gdGhlIGxpc3QgYXQgb25jZS5cbi8vXG4vLyAgICAgW3N0cmluZ10gLT4gb2JqZWN0XG4vL1xuICAgIFxuICAgIGZ1bmN0aW9uIGFkZE1hbnkgKG5ld0NsYXNzZXMpIHtcbiAgICAgICAgXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShuZXdDbGFzc2VzKSkge1xuICAgICAgICAgICAgcmV0dXJuIGFkZChuZXdDbGFzc2VzKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgbmV3Q2xhc3Nlcy5mb3JFYWNoKGFkZCk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gY29udHJvbHM7XG4gICAgfVxuICAgIFxuLy9cbi8vICoqLmhhcyhuYW1lKSoqXG4vL1xuLy8gQ2hlY2tzIHdoZXRoZXIgYSBjbGFzcyBpcyBpbiB0aGUgZWxlbWVudCdzIGxpc3Qgb2YgY2xhc3MgbmFtZXMuXG4vL1xuLy8gICAgIHN0cmluZyAtPiBib29sZWFuXG4vL1xuICAgIFxuICAgIGZ1bmN0aW9uIGhhcyAobmFtZSkge1xuICAgICAgICBcbiAgICAgICAgaWYgKGhhc1NwYWNlcyhuYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIGhhc0FsbChuYW1lKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGNsYXNzZXMuaW5kZXhPZihuYW1lKSA+PSAwO1xuICAgIH1cbiAgICBcbi8vXG4vLyAqKi5oYXNTb21lKG5hbWVzKSoqXG4vL1xuLy8gQ2hlY2tzIHdoZXRoZXIgdGhlIGxpc3QgY29udGFpbnMgYXQgbGVhc3Qgb25lIG9mIHRoZSBzdXBwbGllZCBjbGFzc2VzLlxuLy9cbi8vICAgICBbc3RyaW5nXSAtPiBib29sZWFuXG4vL1xuICAgIFxuICAgIGZ1bmN0aW9uIGhhc1NvbWUgKG5hbWVzKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KG5hbWVzKSA/XG4gICAgICAgICAgICBuYW1lcy5zb21lKGhhcykgOlxuICAgICAgICAgICAgaGFzU29tZShjbGFzc1N0cmluZ1RvQXJyYXkobmFtZXMpKTtcbiAgICB9XG4gICAgXG4vL1xuLy8gKiouaGFzQWxsKG5hbWVzKSoqXG4vL1xuLy8gQ2hlY2tzIHdoZXRoZXIgdGhlIGxpc3QgY29udGFpbnMgYWxsIG9mIHRoZSBzdXBwbGllZCBjbGFzc2VzLlxuLy9cbi8vICAgICBbc3RyaW5nXSAtPiBib29sZWFuXG4vL1xuICAgIFxuICAgIGZ1bmN0aW9uIGhhc0FsbCAobmFtZXMpIHtcbiAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkobmFtZXMpID9cbiAgICAgICAgICAgIG5hbWVzLmV2ZXJ5KGhhcykgOlxuICAgICAgICAgICAgaGFzQWxsKGNsYXNzU3RyaW5nVG9BcnJheShuYW1lcykpO1xuICAgIH1cbiAgICBcbi8vXG4vLyAqKi5yZW1vdmUobmFtZSkqKlxuLy9cbi8vIFJlbW92ZXMgYSBjbGFzcyBmcm9tIHRoZSBlbGVtZW50J3MgbGlzdCBvZiBjbGFzcyBuYW1lcy5cbi8vXG4vLyAgICAgc3RyaW5nIC0+IG9iamVjdFxuLy9cbiAgICBcbiAgICBmdW5jdGlvbiByZW1vdmUgKG5hbWUpIHtcbiAgICAgICAgXG4gICAgICAgIGlmIChoYXNTcGFjZXMobmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiByZW1vdmVNYW55KGNsYXNzU3RyaW5nVG9BcnJheShuYW1lKSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChoYXMobmFtZSkpIHtcbiAgICAgICAgICAgIGNsYXNzZXMuc3BsaWNlKGNsYXNzZXMuaW5kZXhPZihuYW1lKSwgMSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBjb250cm9scztcbiAgICB9XG4gICAgXG4vL1xuLy8gKioucmVtb3ZlTWFueShuYW1lcykqKlxuLy9cbi8vIFJlbW92ZXMgbWFueSBjbGFzc2VzIGZyb20gdGhlIGxpc3QgYXQgb25jZS5cbi8vXG4vLyAgICAgW3N0cmluZ10gLT4gb2JqZWN0XG4vL1xuICAgIFxuICAgIGZ1bmN0aW9uIHJlbW92ZU1hbnkgKHRvUmVtb3ZlKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkodG9SZW1vdmUpKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVtb3ZlKHRvUmVtb3ZlKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdG9SZW1vdmUuZm9yRWFjaChyZW1vdmUpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGNvbnRyb2xzO1xuICAgIH1cbiAgICBcbi8vXG4vLyAqKi50b2dnbGUobmFtZSkqKlxuLy9cbi8vIFJlbW92ZXMgYSBjbGFzcyBmcm9tIHRoZSBjbGFzcyBsaXN0IHdoZW4gaXQncyBwcmVzZW50IG9yIGFkZHMgaXQgdG8gdGhlIGxpc3Qgd2hlbiBpdCdzIG5vdC5cbi8vXG4vLyAgICAgc3RyaW5nIC0+IG9iamVjdFxuLy9cbiAgICBcbiAgICBmdW5jdGlvbiB0b2dnbGUgKG5hbWUpIHtcbiAgICAgICAgXG4gICAgICAgIGlmIChoYXNTcGFjZXMobmFtZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0b2dnbGVNYW55KGNsYXNzU3RyaW5nVG9BcnJheShuYW1lKSk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiAoaGFzKG5hbWUpID8gcmVtb3ZlKG5hbWUpIDogYWRkKG5hbWUpKTtcbiAgICB9XG4gICAgXG4vL1xuLy8gKioudG9nZ2xlTWFueShuYW1lcykqKlxuLy9cbi8vIFRvZ2dsZXMgbWFueSBjbGFzc2VzIGF0IG9uY2UuXG4vL1xuLy8gICAgIFtzdHJpbmddIC0+IG9iamVjdFxuLy9cbiAgICBcbiAgICBmdW5jdGlvbiB0b2dnbGVNYW55IChuYW1lcykge1xuICAgICAgICBcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkobmFtZXMpKSB7XG4gICAgICAgICAgICBuYW1lcy5mb3JFYWNoKHRvZ2dsZSk7XG4gICAgICAgICAgICByZXR1cm4gY29udHJvbHM7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0b2dnbGVNYW55KGNsYXNzU3RyaW5nVG9BcnJheShuYW1lcykpO1xuICAgIH1cbiAgICBcbi8vXG4vLyAqKi50b0FycmF5KCkqKlxuLy9cbi8vIENyZWF0ZXMgYW4gYXJyYXkgY29udGFpbmluZyBhbGwgb2YgdGhlIGxpc3QncyBjbGFzcyBuYW1lcy5cbi8vXG4vLyAgICAgdm9pZCAtPiBbc3RyaW5nXVxuLy9cbiAgICBcbiAgICBmdW5jdGlvbiB0b0FycmF5ICgpIHtcbiAgICAgICAgcmV0dXJuIGNsYXNzZXMuc2xpY2UoKTtcbiAgICB9XG4gICAgXG4vL1xuLy8gKioudG9TdHJpbmcoKSoqXG4vL1xuLy8gUmV0dXJucyBhIHN0cmluZyBjb250YWluaW5nIGFsbCB0aGUgY2xhc3NlcyBpbiB0aGUgbGlzdCBzZXBhcmF0ZWQgYnkgYSBzcGFjZSBjaGFyYWN0ZXIuXG4vL1xuICAgIFxuICAgIGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgICAgICAgcmV0dXJuIGNsYXNzZXMuam9pbihcIiBcIik7XG4gICAgfVxuICAgIFxuLy9cbi8vICoqLmNvcHlUbyhvdGhlckVsZW1lbnQpKipcbi8vXG4vLyBDcmVhdGVzIGEgbmV3IGVtcHR5IGxpc3QgZm9yIGFub3RoZXIgZWxlbWVudCBhbmQgY29waWVzIHRoZSBzb3VyY2UgZWxlbWVudCdzIGNsYXNzIGxpc3QgdG8gaXQuXG4vL1xuLy8gICAgIERPTSBFbGVtZW50IC0+IG9iamVjdFxuLy9cbiAgICBcbiAgICBmdW5jdGlvbiBjb3B5VG8gKG90aGVyRWxlbWVudCkge1xuICAgICAgICByZXR1cm4gbGlzdChvdGhlckVsZW1lbnQpLmNsZWFyKCkuYWRkTWFueShjbGFzc2VzKTtcbiAgICB9XG4gICAgXG4vL1xuLy8gKiouY2xlYXIoKSoqXG4vL1xuLy8gUmVtb3ZlcyBhbGwgY2xhc3NlcyBmcm9tIHRoZSBsaXN0LlxuLy9cbi8vICAgICB2b2lkIC0+IG9iamVjdFxuLy9cbiAgICBcbiAgICBmdW5jdGlvbiBjbGVhciAoKSB7XG4gICAgICAgIGNsYXNzZXMubGVuZ3RoID0gMDtcbiAgICAgICAgcmV0dXJuIGNvbnRyb2xzO1xuICAgIH1cbiAgICBcbi8vXG4vLyAqKi5maWx0ZXIoZm4pKipcbi8vXG4vLyBSZW1vdmVzIHRob3NlIGNsYXNzIG5hbWVzIGZyb20gdGhlIGxpc3QgdGhhdCBmYWlsIGEgcHJlZGljYXRlIHRlc3QgZnVuY3Rpb24uXG4vL1xuLy8gICAgIChzdHJpbmcgLT4gbnVtYmVyIC0+IG9iamVjdCAtPiBib29sZWFuKSAtPiBvYmplY3Rcbi8vXG4gICAgXG4gICAgZnVuY3Rpb24gZmlsdGVyIChmbikge1xuICAgICAgICBcbiAgICAgICAgY2xhc3Nlcy5mb3JFYWNoKGZ1bmN0aW9uIChuYW1lLCBpKSB7XG4gICAgICAgICAgICBpZiAoIWZuKG5hbWUsIGksIGNvbnRyb2xzKSkge1xuICAgICAgICAgICAgICAgIHJlbW92ZShuYW1lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gY29udHJvbHM7XG4gICAgfVxuICAgIFxuLy9cbi8vICoqLnNvcnQoW2ZuXSkqKlxuLy9cbi8vIFNvcnRzIHRoZSBuYW1lcyBpbiBwbGFjZS4gQSBjdXN0b20gc29ydCBmdW5jdGlvbiBjYW4gYmUgYXBwbGllZCBvcHRpb25hbGx5LiBJdCBtdXN0IGhhdmVcbi8vIHRoZSBzYW1lIHNpZ25hdHVyZSBhcyBKUyBBcnJheS5wcm90b3R5cGUuc29ydCgpIGNhbGxiYWNrcy5cbi8vXG4vLyAgICAgdm9pZHxmdW5jdGlvbiAtPiBvYmplY3Rcbi8vXG4gICAgXG4gICAgZnVuY3Rpb24gc29ydCAoZm4pIHtcbiAgICAgICAgY2xhc3Nlcy5zb3J0KGZuKTtcbiAgICAgICAgcmV0dXJuIGNvbnRyb2xzO1xuICAgIH1cbiAgICBcbi8vXG4vLyAqKi5zaXplKCkqKlxuLy9cbi8vIFJldHVybnMgdGhlIG51bWJlciBvZiBjbGFzc2VzIGluIHRoZSBsaXN0LlxuLy9cbi8vICAgICB2b2lkIC0+IG51bWJlclxuLy9cbiAgICBcbiAgICBmdW5jdGlvbiBzaXplICgpIHtcbiAgICAgICAgcmV0dXJuIGNsYXNzZXMubGVuZ3RoO1xuICAgIH1cbiAgICBcbiAgICBjb250cm9scyA9IHtcbiAgICAgICAgYWRkOiBhZGQsXG4gICAgICAgIGFkZE1hbnk6IGFkZE1hbnksXG4gICAgICAgIGhhczogaGFzLFxuICAgICAgICBoYXNTb21lOiBoYXNTb21lLFxuICAgICAgICBoYXNBbGw6IGhhc0FsbCxcbiAgICAgICAgcmVtb3ZlOiByZW1vdmUsXG4gICAgICAgIHJlbW92ZU1hbnk6IHJlbW92ZU1hbnksXG4gICAgICAgIHRvZ2dsZTogdG9nZ2xlLFxuICAgICAgICB0b2dnbGVNYW55OiB0b2dnbGVNYW55LFxuICAgICAgICBhcHBseTogYXBwbHksXG4gICAgICAgIGNsZWFyOiBjbGVhcixcbiAgICAgICAgY29weVRvOiBjb3B5VG8sXG4gICAgICAgIHRvQXJyYXk6IHRvQXJyYXksXG4gICAgICAgIHRvU3RyaW5nOiB0b1N0cmluZyxcbiAgICAgICAgZmlsdGVyOiBmaWx0ZXIsXG4gICAgICAgIHNvcnQ6IHNvcnQsXG4gICAgICAgIHNpemU6IHNpemVcbiAgICB9O1xuICAgIFxuICAgIHJldHVybiBjb250cm9scztcbn1cblxuLy9cbi8vICoqYWRkKGVsZW1lbnQsIG5hbWUpKipcbi8vXG4vLyBBZGRzIGEgY2xhc3MgdG8gYSBET00gRWxlbWVudC5cbi8vXG4vLyAgICBET00gRWxlbWVudCAtPiBzdHJpbmcgLT4gb2JqZWN0XG4vL1xuXG5mdW5jdGlvbiBhZGQgKGVsZW1lbnQsIG5hbWUpIHtcbiAgICByZXR1cm4gbGlzdChlbGVtZW50KS5hZGQobmFtZSkuYXBwbHkoKTtcbn1cblxuLy9cbi8vICoqcmVtb3ZlKGVsZW1lbnQsIG5hbWUpKipcbi8vXG4vLyBSZW1vdmVzIGEgY2xhc3MgZnJvbSBhIERPTSBFbGVtZW50LlxuLy9cbi8vICAgICBET00gRWxlbWVudCAtPiBzdHJpbmcgLT4gb2JqZWN0XG4vL1xuXG5mdW5jdGlvbiByZW1vdmUgKGVsZW1lbnQsIG5hbWUpIHtcbiAgICByZXR1cm4gbGlzdChlbGVtZW50KS5yZW1vdmUobmFtZSkuYXBwbHkoKTtcbn1cblxuLy9cbi8vICoqdG9nZ2xlKGVsZW1lbnQsIG5hbWUpKipcbi8vXG4vLyBSZW1vdmVzIGEgY2xhc3MgZnJvbSBhIERPTSBFbGVtZW50IHdoZW4gaXQgaGFzIHRoZSBjbGFzcyBvciBhZGRzIGl0IHdoZW4gdGhlIGVsZW1lbnQgZG9lc24ndFxuLy8gaGF2ZSBpdC5cbi8vXG4vLyAgICAgRE9NRWxlbWVudCAtPiBzdHJpbmcgLT4gb2JqZWN0XG4vL1xuXG5mdW5jdGlvbiB0b2dnbGUgKGVsZW1lbnQsIG5hbWUpIHtcbiAgICByZXR1cm4gbGlzdChlbGVtZW50KS50b2dnbGUobmFtZSkuYXBwbHkoKTtcbn1cblxuLy9cbi8vICoqaGFzKGVsZW1lbnQsIG5hbWUpKipcbi8vXG4vLyBDaGVja3Mgd2hldGhlciBhIERPTSBFbGVtZW50IGhhcyBhIGNsYXNzLlxuLy9cbi8vICAgICBET01FbGVtZW50IC0+IHN0cmluZyAtPiBib29sZWFuXG4vL1xuXG5mdW5jdGlvbiBoYXMgKGVsZW1lbnQsIG5hbWUpIHtcbiAgICByZXR1cm4gbGlzdChlbGVtZW50KS5oYXMobmFtZSk7XG59XG5cbi8vXG4vLyAjIyBFeHBvcnRlZCBmdW5jdGlvbnNcbi8vXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGFkZDogYWRkLFxuICAgIHJlbW92ZTogcmVtb3ZlLFxuICAgIHRvZ2dsZTogdG9nZ2xlLFxuICAgIGhhczogaGFzLFxuICAgIGxpc3Q6IGxpc3Rcbn07XG5cblxuLy9cbi8vICMjIFByaXZhdGUgZnVuY3Rpb25zXG4vL1xuXG4vL1xuLy8gRXh0cmFjdHMgdGhlIGNsYXNzIG5hbWVzIGZyb20gYSBET00gRWxlbWVudCBhbmQgcmV0dXJucyB0aGVtIGluIGFuIGFycmF5LlxuLy9cbi8vICAgICBET01FbGVtZW50IC0+IFtzdHJpbmddXG4vL1xuXG5mdW5jdGlvbiBwYXJzZSAoZWxlbWVudCkge1xuICAgIHJldHVybiBjbGFzc1N0cmluZ1RvQXJyYXkoZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSB8fCBcIlwiKTtcbn1cblxuLy9cbi8vICAgICBzdHJpbmcgLT4gW3N0cmluZ11cbi8vXG5cbmZ1bmN0aW9uIGNsYXNzU3RyaW5nVG9BcnJheSAoY2xhc3NTdHJpbmcpIHtcbiAgICByZXR1cm4gKFwiXCIgKyBjbGFzc1N0cmluZykucmVwbGFjZSgvXFxzKy8sIFwiIFwiKS50cmltKCkuc3BsaXQoXCIgXCIpLmZpbHRlcihzdHJpbmdOb3RFbXB0eSk7XG59XG5cbi8vXG4vLyAgICAgc3RyaW5nIC0+IGJvb2xlYW5cbi8vXG5cbmZ1bmN0aW9uIHN0cmluZ05vdEVtcHR5IChzdHIpIHtcbiAgICByZXR1cm4gc3RyICE9PSBcIlwiO1xufVxuXG4vL1xuLy8gICAgIHN0cmluZyAtPiBib29sZWFuXG4vL1xuXG5mdW5jdGlvbiBoYXNTcGFjZXMgKHN0cikge1xuICAgIHJldHVybiAhIXN0ci5tYXRjaCgvXFxzLyk7XG59XG5cbi8vXG4vLyBDcmVhdGVzIGEgZHVtbXkgRE9NRWxlbWVudCBmb3Igd2hlbiB3ZSBkb24ndCBoYXZlIGFuIGFjdHVhbCBvbmUgZm9yIGEgbGlzdC5cbi8vXG4vLyAgICAgc3RyaW5nIC0+IG9iamVjdFxuLy9cblxuZnVuY3Rpb24gZHVtbXkgKGNsYXNzTGlzdCkge1xuICAgIFxuICAgIGlmICh0eXBlb2YgY2xhc3NMaXN0ICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkZ1bmN0aW9uIGxpc3QoKSBleHBlY3RzIGFuIG9iamVjdCBvciBzdHJpbmcgYXMgaXRzIGFyZ3VtZW50LlwiKTtcbiAgICB9XG4gICAgXG4gICAgdmFyIGF0dHJpYnV0ZXMgPSB7XG4gICAgICAgIFwiY2xhc3NcIjogXCJcIiArIGNsYXNzU3RyaW5nVG9BcnJheShjbGFzc0xpc3QpLmpvaW4oXCIgXCIpXG4gICAgfTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBzZXRBdHRyaWJ1dGU6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkgeyBhdHRyaWJ1dGVzW25hbWVdID0gdmFsdWU7IH0sXG4gICAgICAgIGdldEF0dHJpYnV0ZTogZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIGF0dHJpYnV0ZXNbbmFtZV07IH1cbiAgICB9O1xufVxuIiwiLyogZ2xvYmFsIHJlcXVpcmUsIG1vZHVsZSAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL3NyYy9kYXRhYnVzXCIpO1xuIiwiLyogZ2xvYmFsIHVzaW5nLCBzZXRUaW1lb3V0LCBjb25zb2xlLCB3aW5kb3csIG1vZHVsZSAqL1xuXG4oZnVuY3Rpb24gRGF0YUJ1c0Jvb3RzdHJhcCAoKSB7XG4gICAgXG4gICAgaWYgKHR5cGVvZiByZXF1aXJlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBEYXRhQnVzTW9kdWxlKCk7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiB1c2luZyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHVzaW5nKCkuZGVmaW5lKFwiZGF0YWJ1c1wiLCBEYXRhQnVzTW9kdWxlKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHdpbmRvdy5EYXRhQnVzID0gRGF0YUJ1c01vZHVsZSgpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBEYXRhQnVzTW9kdWxlICgpIHtcbiAgICAgICAgXG4gICAgICAgIFwidXNlIHN0cmljdFwiO1xuICAgICAgICBcbiAgICAgICAgZnVuY3Rpb24gRGF0YUJ1cyAoYXJncykge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGFyZ3MgPSBhcmdzIHx8IHt9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmRlYnVnID0gYXJncy5kZWJ1ZyB8fCBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJjZXB0RXJyb3JzID0gYXJncy5pbnRlcmNlcHRFcnJvcnMgfHwgZmFsc2U7XG4gICAgICAgICAgICB0aGlzLmxvZyA9IGFyZ3MubG9nIHx8IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5sb2dEYXRhID0gYXJncy5sb2dEYXRhIHx8IGZhbHNlO1xuICAgICAgICAgICAgdGhpcy5kZWZhdWx0cyA9IGFyZ3MuZGVmYXVsdHMgfHwge307XG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRzLmZsb3dUeXBlID0gdGhpcy5kZWZhdWx0cy5mbG93VHlwZSB8fCBEYXRhQnVzLkZMT1dfVFlQRV9BU1lOQ0hST05PVVM7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuY2FsbGJhY2tzID0ge1xuICAgICAgICAgICAgICAgIFwiKlwiOiBbXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmUoZXJyb3JMaXN0ZW5lciwgXCJFdmVudEJ1cy5lcnJvclwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZnVuY3Rpb24gZXJyb3JMaXN0ZW5lciAoZGF0YSkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciBuYW1lO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmRlYnVnICE9PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgbmFtZSA9IGRhdGEuZXJyb3IubmFtZSB8fCBcIkVycm9yXCI7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cobmFtZSArIFwiIGluIGxpc3RlbmVyOyBFdmVudDogXCIgKyBkYXRhLmluZm8uZXZlbnQgKyBcIjsgTWVzc2FnZTogXCIgK1xuICAgICAgICAgICAgICAgICAgICBkYXRhLmVycm9yLm1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBEYXRhQnVzLkZMT1dfVFlQRV9BU1lOQ0hST05PVVMgPSAwO1xuICAgICAgICBEYXRhQnVzLkZMT1dfVFlQRV9TWU5DSFJPTk9VUyA9IDE7XG4gICAgICAgIFxuICAgICAgICBEYXRhQnVzLmNyZWF0ZSA9IGZ1bmN0aW9uKGFyZ3MpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYXJncyA9IGFyZ3MgfHwge307XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBuZXcgRGF0YUJ1cyhhcmdzKTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIERhdGFCdXMucHJvdG90eXBlLnN1YnNjcmliZSA9IGZ1bmN0aW9uKHBhcmFtZXRlcjEsIHBhcmFtZXRlcjIpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGxpc3RlbmVyLCBldmVudCwgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChwYXJhbWV0ZXIyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBldmVudCA9IFwiKlwiO1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyID0gcGFyYW1ldGVyMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBwYXJhbWV0ZXIxID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBwYXJhbWV0ZXIxID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQgPSBwYXJhbWV0ZXIxO1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyID0gcGFyYW1ldGVyMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiBwYXJhbWV0ZXIyID09PSBcInN0cmluZ1wiIHx8IHR5cGVvZiBwYXJhbWV0ZXIyID09PSBcIm51bWJlclwiKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQgPSBwYXJhbWV0ZXIyO1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyID0gcGFyYW1ldGVyMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHR5cGVvZiBldmVudCAhPT0gXCJzdHJpbmdcIiAmJiB0eXBlb2YgZXZlbnQgIT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFdmVudCBuYW1lcyBjYW4gb25seSBiZSBzdHJpbmdzIG9yIG51bWJlcnMhIGV2ZW50OiBcIiwgZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJPbmx5IGZ1bmN0aW9ucyBtYXkgYmUgdXNlZCBhcyBsaXN0ZW5lcnMhXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBldmVudCA9IGV2ZW50IHx8ICcqJztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5jYWxsYmFja3NbZXZlbnRdID0gdGhpcy5jYWxsYmFja3NbZXZlbnRdIHx8IFtdO1xuICAgICAgICAgICAgdGhpcy5jYWxsYmFja3NbZXZlbnRdLnB1c2gobGlzdGVuZXIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXIoXG4gICAgICAgICAgICAgICAgXCJFdmVudEJ1cy5zdWJzY3JpYmVcIiwgXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcjogbGlzdGVuZXIsXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50OiBldmVudCxcbiAgICAgICAgICAgICAgICAgICAgYnVzOiB0aGlzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIHVuc3Vic2NyaWJlciAoKSB7XG4gICAgICAgICAgICAgICAgc2VsZi51bnN1YnNjcmliZShsaXN0ZW5lciwgZXZlbnQpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIERhdGFCdXMucHJvdG90eXBlLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24ocGFyYW1ldGVyMSwgcGFyYW1ldGVyMikge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgY2JzLCBsZW4sIGksIGxpc3RlbmVyLCBldmVudDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHBhcmFtZXRlcjIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGV2ZW50ID0gXCIqXCI7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIgPSBwYXJhbWV0ZXIxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHBhcmFtZXRlcjEgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIHBhcmFtZXRlcjEgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICBldmVudCA9IHBhcmFtZXRlcjE7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIgPSBwYXJhbWV0ZXIyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAodHlwZW9mIHBhcmFtZXRlcjIgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIHBhcmFtZXRlcjIgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgICAgICBldmVudCA9IHBhcmFtZXRlcjI7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXIgPSBwYXJhbWV0ZXIxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodHlwZW9mIGV2ZW50ICE9PSBcInN0cmluZ1wiICYmIHR5cGVvZiBldmVudCAhPT0gXCJudW1iZXJcIikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkV2ZW50IG5hbWVzIGNhbiBvbmx5IGJlIHN0cmluZ3Mgb3IgbnVtYmVycyEgZXZlbnQ6IFwiLCBldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk9ubHkgZnVuY3Rpb25zIG1heSBiZSB1c2VkIGFzIGxpc3RlbmVycyFcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGV2ZW50ID0gZXZlbnQgfHwgJyonO1xuICAgICAgICAgICAgY2JzID0gdGhpcy5jYWxsYmFja3NbZXZlbnRdIHx8IFtdO1xuICAgICAgICAgICAgbGVuID0gY2JzLmxlbmd0aDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGNic1tpXSA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWxsYmFja3NbZXZlbnRdLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcihcbiAgICAgICAgICAgICAgICBcIkV2ZW50QnVzLnVuc3Vic2NyaWJlXCIsIFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXI6IGxpc3RlbmVyLFxuICAgICAgICAgICAgICAgICAgICBldmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgICAgIGJ1czogdGhpc1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBEYXRhQnVzLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gKGxpc3RlbmVyT3JFdmVudDEsIGxpc3RlbmVyT3JFdmVudDIpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGZuLCBzZWxmID0gdGhpcywgZXZlbnQsIGxpc3RlbmVyO1xuICAgICAgICAgICAgdmFyIGZpcnN0UGFyYW1Jc0Z1bmN0aW9uLCBzZWNvbmRQYXJhbUlzRnVuY3Rpb24sIGNhbGxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBmaXJzdFBhcmFtSXNGdW5jdGlvbiA9IHR5cGVvZiBsaXN0ZW5lck9yRXZlbnQxID09PSBcImZ1bmN0aW9uXCI7XG4gICAgICAgICAgICBzZWNvbmRQYXJhbUlzRnVuY3Rpb24gPSB0eXBlb2YgbGlzdGVuZXJPckV2ZW50MiA9PT0gXCJmdW5jdGlvblwiO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoKGZpcnN0UGFyYW1Jc0Z1bmN0aW9uICYmIHNlY29uZFBhcmFtSXNGdW5jdGlvbikgfHwgXG4gICAgICAgICAgICAgICAgICAgICghZmlyc3RQYXJhbUlzRnVuY3Rpb24gJiYgIXNlY29uZFBhcmFtSXNGdW5jdGlvbikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQYXJhbWV0ZXIgbWlzbWF0Y2g7IG9uZSBwYXJhbWV0ZXIgbmVlZHMgdG8gYmUgYSBmdW5jdGlvbiwgXCIgK1xuICAgICAgICAgICAgICAgICAgICBcInRoZSBvdGhlciBvbmUgbXVzdCBiZSBhIHN0cmluZy5cIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChmaXJzdFBhcmFtSXNGdW5jdGlvbikge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyID0gbGlzdGVuZXJPckV2ZW50MTtcbiAgICAgICAgICAgICAgICBldmVudCA9IGxpc3RlbmVyT3JFdmVudDI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsaXN0ZW5lciA9IGxpc3RlbmVyT3JFdmVudDI7XG4gICAgICAgICAgICAgICAgZXZlbnQgPSBsaXN0ZW5lck9yRXZlbnQxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBldmVudCA9IGV2ZW50IHx8IFwiKlwiO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBmbiA9IGZ1bmN0aW9uIChkYXRhLCBpbmZvKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGNhbGxlZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGNhbGxlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgc2VsZi51bnN1YnNjcmliZShmbiwgZXZlbnQpO1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyKGRhdGEsIGluZm8pO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5zdWJzY3JpYmUoZm4sIGV2ZW50KTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIERhdGFCdXMucHJvdG90eXBlLnRyaWdnZXIgPSBmdW5jdGlvbihldmVudCwgZGF0YSwgYXN5bmMpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGNicywgbGVuLCBpbmZvLCBqLCBmLCBjdXIsIHNlbGYsIGZsb3dUeXBlO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50ICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50ICE9PSBcInN0cmluZ1wiICYmXG4gICAgICAgICAgICAgICAgdHlwZW9mIGV2ZW50ICE9PSBcIm51bWJlclwiXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJFdmVudCBuYW1lcyBjYW4gb25seSBiZSBzdHJpbmdzIG9yIG51bWJlcnMhIGV2ZW50OiBcIiwgZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGV2ZW50ID0gYXJndW1lbnRzLmxlbmd0aCA/IGV2ZW50IDogXCIqXCI7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZsb3dUeXBlID0gKHR5cGVvZiBhc3luYyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBhc3luYyA9PT0gZmFsc2UpID9cbiAgICAgICAgICAgICAgICBEYXRhQnVzLkZMT1dfVFlQRV9TWU5DSFJPTk9VUyA6XG4gICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0cy5mbG93VHlwZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gZ2V0IHN1YnNjcmliZXJzIGluIGFsbCByZWxldmFudCBuYW1lc3BhY2VzXG4gICAgICAgICAgICBjYnMgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIG4sIHdvcmRzLCB3YywgbWF0Y2hlcywgaywga2MsIG9sZCA9IFwiXCIsIG91dCA9IFtdO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIHNwbGl0IGV2ZW50IG5hbWUgaW50byBuYW1lc3BhY2VzIGFuZCBnZXQgYWxsIHN1YnNjcmliZXJzXG4gICAgICAgICAgICAgICAgd29yZHMgPSBldmVudC5zcGxpdChcIi5cIik7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZm9yIChuID0gMCwgd2MgPSB3b3Jkcy5sZW5ndGggOyBuIDwgd2MgOyArK24pIHtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIG9sZCA9IG9sZCArIChuID4gMCA/IFwiLlwiIDogXCJcIikgKyB3b3Jkc1tuXTtcbiAgICAgICAgICAgICAgICAgICAgbWF0Y2hlcyA9IHNlbGYuY2FsbGJhY2tzW29sZF0gfHwgW107XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBmb3IgKGsgPSAwLCBrYyA9IG1hdGNoZXMubGVuZ3RoOyBrIDwga2M7ICsraykge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0LnB1c2gobWF0Y2hlc1trXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50ID09PSBcIipcIikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb3V0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBnZXQgc3Vic2NyaWJlcnMgZm9yIFwiKlwiIGFuZCBhZGQgdGhlbSwgdG9vXG4gICAgICAgICAgICAgICAgbWF0Y2hlcyA9IHNlbGYuY2FsbGJhY2tzW1wiKlwiXSB8fCBbXTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBmb3IgKGsgPSAwLCBrYyA9IG1hdGNoZXMubGVuZ3RoIDsgayA8IGtjIDsgKytrKSB7XG4gICAgICAgICAgICAgICAgICAgIG91dC5wdXNoKCBtYXRjaGVzWyBrIF0gKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgICAgIH0oKSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGxlbiA9IGNicy5sZW5ndGg7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGluZm8gPSB7XG4gICAgICAgICAgICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgICAgIHN1YnNjcmliZXJzOiBsZW4sXG4gICAgICAgICAgICAgICAgYXN5bmM6IGZsb3dUeXBlID09PSBEYXRhQnVzLkZMT1dfVFlQRV9BU1lOQ0hST05PVVMgPyB0cnVlIDogZmFsc2UsXG4gICAgICAgICAgICAgICAgZ2V0UXVldWVMZW5ndGg6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsZW4gLSAoaiArIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZ1bmN0aW9uIGFzeW5jVGhyb3cgKGUpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gZnVuY3Rpb24gZm9yIGl0ZXJhdGluZyB0aHJvdWdoIHRoZSBsaXN0IG9mIHJlbGV2YW50IGxpc3RlbmVyc1xuICAgICAgICAgICAgZiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmxvZyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkV2ZW50QnVzIGV2ZW50IHRyaWdnZXJlZDogXCIgKyBldmVudCArIFwiOyBTdWJzY3JpYmVyczogXCIgKyBsZW4sIFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2dEYXRhID09PSB0cnVlID8gXCI7IERhdGE6IFwiICsgZGF0YSA6IFwiXCIgXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBsZW47ICsraikge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgY3VyID0gY2JzW2pdO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cihkYXRhLCBpbmZvKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi50cmlnZ2VyKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiRXZlbnRCdXMuZXJyb3JcIiwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcjogZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mbzogaW5mb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmludGVyY2VwdEVycm9ycyAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzeW5jVGhyb3coZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoZmxvd1R5cGUgPT09IERhdGFCdXMuRkxPV19UWVBFX0FTWU5DSFJPTk9VUykge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZiwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBEYXRhQnVzLnByb3RvdHlwZS50cmlnZ2VyU3luYyA9IGZ1bmN0aW9uIChldmVudCwgZGF0YSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJpZ2dlcihldmVudCwgZGF0YSwgZmFsc2UpO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgRGF0YUJ1cy5wcm90b3R5cGUudHJpZ2dlckFzeW5jID0gZnVuY3Rpb24gKGV2ZW50LCBkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmlnZ2VyKGV2ZW50LCBkYXRhLCB0cnVlKTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIERhdGFCdXMuaW5qZWN0ID0gZnVuY3Rpb24gKG9iaiwgYXJncykge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBhcmdzID0gYXJncyB8fCB7fTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHNxdWlkID0gbmV3IERhdGFCdXMoYXJncyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG9iai5zdWJzY3JpYmUgPSBmdW5jdGlvbiAobGlzdGVuZXIsIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgc3F1aWQuc3Vic2NyaWJlKGxpc3RlbmVyLCBldmVudCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBvYmoudW5zdWJzY3JpYmUgPSBmdW5jdGlvbiAobGlzdGVuZXIsIGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgc3F1aWQudW5zdWJzY3JpYmUobGlzdGVuZXIsIGV2ZW50KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG9iai5vbmNlID0gZnVuY3Rpb24gKGxpc3RlbmVyLCBldmVudCkge1xuICAgICAgICAgICAgICAgIHNxdWlkLm9uY2UobGlzdGVuZXIsIGV2ZW50KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG9iai50cmlnZ2VyID0gZnVuY3Rpb24gKGV2ZW50LCBkYXRhLCBhc3luYykge1xuICAgICAgICAgICAgICAgIGFzeW5jID0gKHR5cGVvZiBhc3luYyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBhc3luYyA9PT0gZmFsc2UpID8gZmFsc2UgOiB0cnVlO1xuICAgICAgICAgICAgICAgIHNxdWlkLnRyaWdnZXIoZXZlbnQsIGRhdGEsIGFzeW5jKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG9iai50cmlnZ2VyU3luYyA9IHNxdWlkLnRyaWdnZXJTeW5jLmJpbmQoc3F1aWQpO1xuICAgICAgICAgICAgb2JqLnRyaWdnZXJBc3luYyA9IHNxdWlkLnRyaWdnZXJBc3luYy5iaW5kKHNxdWlkKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgb2JqLnN1YnNjcmliZShcImRlc3Ryb3llZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgc3F1aWQuY2FsbGJhY2tzID0gW107XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBEYXRhQnVzO1xuICAgICAgICBcbiAgICB9XG59KCkpO1xuIiwiZnVuY3Rpb24gYmFja0luT3V0KHQpIHtcbiAgdmFyIHMgPSAxLjcwMTU4ICogMS41MjVcbiAgaWYgKCh0ICo9IDIpIDwgMSlcbiAgICByZXR1cm4gMC41ICogKHQgKiB0ICogKChzICsgMSkgKiB0IC0gcykpXG4gIHJldHVybiAwLjUgKiAoKHQgLT0gMikgKiB0ICogKChzICsgMSkgKiB0ICsgcykgKyAyKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhY2tJbk91dCIsImZ1bmN0aW9uIGJhY2tJbih0KSB7XG4gIHZhciBzID0gMS43MDE1OFxuICByZXR1cm4gdCAqIHQgKiAoKHMgKyAxKSAqIHQgLSBzKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhY2tJbiIsImZ1bmN0aW9uIGJhY2tPdXQodCkge1xuICB2YXIgcyA9IDEuNzAxNThcbiAgcmV0dXJuIC0tdCAqIHQgKiAoKHMgKyAxKSAqIHQgKyBzKSArIDFcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYWNrT3V0IiwidmFyIGJvdW5jZU91dCA9IHJlcXVpcmUoJy4vYm91bmNlLW91dCcpXG5cbmZ1bmN0aW9uIGJvdW5jZUluT3V0KHQpIHtcbiAgcmV0dXJuIHQgPCAwLjVcbiAgICA/IDAuNSAqICgxLjAgLSBib3VuY2VPdXQoMS4wIC0gdCAqIDIuMCkpXG4gICAgOiAwLjUgKiBib3VuY2VPdXQodCAqIDIuMCAtIDEuMCkgKyAwLjVcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBib3VuY2VJbk91dCIsInZhciBib3VuY2VPdXQgPSByZXF1aXJlKCcuL2JvdW5jZS1vdXQnKVxuXG5mdW5jdGlvbiBib3VuY2VJbih0KSB7XG4gIHJldHVybiAxLjAgLSBib3VuY2VPdXQoMS4wIC0gdClcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBib3VuY2VJbiIsImZ1bmN0aW9uIGJvdW5jZU91dCh0KSB7XG4gIHZhciBhID0gNC4wIC8gMTEuMFxuICB2YXIgYiA9IDguMCAvIDExLjBcbiAgdmFyIGMgPSA5LjAgLyAxMC4wXG5cbiAgdmFyIGNhID0gNDM1Ni4wIC8gMzYxLjBcbiAgdmFyIGNiID0gMzU0NDIuMCAvIDE4MDUuMFxuICB2YXIgY2MgPSAxNjA2MS4wIC8gMTgwNS4wXG5cbiAgdmFyIHQyID0gdCAqIHRcblxuICByZXR1cm4gdCA8IGFcbiAgICA/IDcuNTYyNSAqIHQyXG4gICAgOiB0IDwgYlxuICAgICAgPyA5LjA3NSAqIHQyIC0gOS45ICogdCArIDMuNFxuICAgICAgOiB0IDwgY1xuICAgICAgICA/IGNhICogdDIgLSBjYiAqIHQgKyBjY1xuICAgICAgICA6IDEwLjggKiB0ICogdCAtIDIwLjUyICogdCArIDEwLjcyXG59XG5cbm1vZHVsZS5leHBvcnRzID0gYm91bmNlT3V0IiwiZnVuY3Rpb24gY2lyY0luT3V0KHQpIHtcbiAgaWYgKCh0ICo9IDIpIDwgMSkgcmV0dXJuIC0wLjUgKiAoTWF0aC5zcXJ0KDEgLSB0ICogdCkgLSAxKVxuICByZXR1cm4gMC41ICogKE1hdGguc3FydCgxIC0gKHQgLT0gMikgKiB0KSArIDEpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2lyY0luT3V0IiwiZnVuY3Rpb24gY2lyY0luKHQpIHtcbiAgcmV0dXJuIDEuMCAtIE1hdGguc3FydCgxLjAgLSB0ICogdClcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjaXJjSW4iLCJmdW5jdGlvbiBjaXJjT3V0KHQpIHtcbiAgcmV0dXJuIE1hdGguc3FydCgxIC0gKCAtLXQgKiB0ICkpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2lyY091dCIsImZ1bmN0aW9uIGN1YmljSW5PdXQodCkge1xuICByZXR1cm4gdCA8IDAuNVxuICAgID8gNC4wICogdCAqIHQgKiB0XG4gICAgOiAwLjUgKiBNYXRoLnBvdygyLjAgKiB0IC0gMi4wLCAzLjApICsgMS4wXG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3ViaWNJbk91dCIsImZ1bmN0aW9uIGN1YmljSW4odCkge1xuICByZXR1cm4gdCAqIHQgKiB0XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3ViaWNJbiIsImZ1bmN0aW9uIGN1YmljT3V0KHQpIHtcbiAgdmFyIGYgPSB0IC0gMS4wXG4gIHJldHVybiBmICogZiAqIGYgKyAxLjBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjdWJpY091dCIsImZ1bmN0aW9uIGVsYXN0aWNJbk91dCh0KSB7XG4gIHJldHVybiB0IDwgMC41XG4gICAgPyAwLjUgKiBNYXRoLnNpbigrMTMuMCAqIE1hdGguUEkvMiAqIDIuMCAqIHQpICogTWF0aC5wb3coMi4wLCAxMC4wICogKDIuMCAqIHQgLSAxLjApKVxuICAgIDogMC41ICogTWF0aC5zaW4oLTEzLjAgKiBNYXRoLlBJLzIgKiAoKDIuMCAqIHQgLSAxLjApICsgMS4wKSkgKiBNYXRoLnBvdygyLjAsIC0xMC4wICogKDIuMCAqIHQgLSAxLjApKSArIDEuMFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGVsYXN0aWNJbk91dCIsImZ1bmN0aW9uIGVsYXN0aWNJbih0KSB7XG4gIHJldHVybiBNYXRoLnNpbigxMy4wICogdCAqIE1hdGguUEkvMikgKiBNYXRoLnBvdygyLjAsIDEwLjAgKiAodCAtIDEuMCkpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZWxhc3RpY0luIiwiZnVuY3Rpb24gZWxhc3RpY091dCh0KSB7XG4gIHJldHVybiBNYXRoLnNpbigtMTMuMCAqICh0ICsgMS4wKSAqIE1hdGguUEkvMikgKiBNYXRoLnBvdygyLjAsIC0xMC4wICogdCkgKyAxLjBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlbGFzdGljT3V0IiwiZnVuY3Rpb24gZXhwb0luT3V0KHQpIHtcbiAgcmV0dXJuICh0ID09PSAwLjAgfHwgdCA9PT0gMS4wKVxuICAgID8gdFxuICAgIDogdCA8IDAuNVxuICAgICAgPyArMC41ICogTWF0aC5wb3coMi4wLCAoMjAuMCAqIHQpIC0gMTAuMClcbiAgICAgIDogLTAuNSAqIE1hdGgucG93KDIuMCwgMTAuMCAtICh0ICogMjAuMCkpICsgMS4wXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb0luT3V0IiwiZnVuY3Rpb24gZXhwb0luKHQpIHtcbiAgcmV0dXJuIHQgPT09IDAuMCA/IHQgOiBNYXRoLnBvdygyLjAsIDEwLjAgKiAodCAtIDEuMCkpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb0luIiwiZnVuY3Rpb24gZXhwb091dCh0KSB7XG4gIHJldHVybiB0ID09PSAxLjAgPyB0IDogMS4wIC0gTWF0aC5wb3coMi4wLCAtMTAuMCAqIHQpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb091dCIsIm1vZHVsZS5leHBvcnRzID0ge1xuXHQnYmFja0luT3V0JzogcmVxdWlyZSgnLi9iYWNrLWluLW91dCcpLFxuXHQnYmFja0luJzogcmVxdWlyZSgnLi9iYWNrLWluJyksXG5cdCdiYWNrT3V0JzogcmVxdWlyZSgnLi9iYWNrLW91dCcpLFxuXHQnYm91bmNlSW5PdXQnOiByZXF1aXJlKCcuL2JvdW5jZS1pbi1vdXQnKSxcblx0J2JvdW5jZUluJzogcmVxdWlyZSgnLi9ib3VuY2UtaW4nKSxcblx0J2JvdW5jZU91dCc6IHJlcXVpcmUoJy4vYm91bmNlLW91dCcpLFxuXHQnY2lyY0luT3V0JzogcmVxdWlyZSgnLi9jaXJjLWluLW91dCcpLFxuXHQnY2lyY0luJzogcmVxdWlyZSgnLi9jaXJjLWluJyksXG5cdCdjaXJjT3V0JzogcmVxdWlyZSgnLi9jaXJjLW91dCcpLFxuXHQnY3ViaWNJbk91dCc6IHJlcXVpcmUoJy4vY3ViaWMtaW4tb3V0JyksXG5cdCdjdWJpY0luJzogcmVxdWlyZSgnLi9jdWJpYy1pbicpLFxuXHQnY3ViaWNPdXQnOiByZXF1aXJlKCcuL2N1YmljLW91dCcpLFxuXHQnZWxhc3RpY0luT3V0JzogcmVxdWlyZSgnLi9lbGFzdGljLWluLW91dCcpLFxuXHQnZWxhc3RpY0luJzogcmVxdWlyZSgnLi9lbGFzdGljLWluJyksXG5cdCdlbGFzdGljT3V0JzogcmVxdWlyZSgnLi9lbGFzdGljLW91dCcpLFxuXHQnZXhwb0luT3V0JzogcmVxdWlyZSgnLi9leHBvLWluLW91dCcpLFxuXHQnZXhwb0luJzogcmVxdWlyZSgnLi9leHBvLWluJyksXG5cdCdleHBvT3V0JzogcmVxdWlyZSgnLi9leHBvLW91dCcpLFxuXHQnbGluZWFyJzogcmVxdWlyZSgnLi9saW5lYXInKSxcblx0J3F1YWRJbk91dCc6IHJlcXVpcmUoJy4vcXVhZC1pbi1vdXQnKSxcblx0J3F1YWRJbic6IHJlcXVpcmUoJy4vcXVhZC1pbicpLFxuXHQncXVhZE91dCc6IHJlcXVpcmUoJy4vcXVhZC1vdXQnKSxcblx0J3F1YXJ0SW5PdXQnOiByZXF1aXJlKCcuL3F1YXJ0LWluLW91dCcpLFxuXHQncXVhcnRJbic6IHJlcXVpcmUoJy4vcXVhcnQtaW4nKSxcblx0J3F1YXJ0T3V0JzogcmVxdWlyZSgnLi9xdWFydC1vdXQnKSxcblx0J3F1aW50SW5PdXQnOiByZXF1aXJlKCcuL3F1aW50LWluLW91dCcpLFxuXHQncXVpbnRJbic6IHJlcXVpcmUoJy4vcXVpbnQtaW4nKSxcblx0J3F1aW50T3V0JzogcmVxdWlyZSgnLi9xdWludC1vdXQnKSxcblx0J3NpbmVJbk91dCc6IHJlcXVpcmUoJy4vc2luZS1pbi1vdXQnKSxcblx0J3NpbmVJbic6IHJlcXVpcmUoJy4vc2luZS1pbicpLFxuXHQnc2luZU91dCc6IHJlcXVpcmUoJy4vc2luZS1vdXQnKVxufSIsImZ1bmN0aW9uIGxpbmVhcih0KSB7XG4gIHJldHVybiB0XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbGluZWFyIiwiZnVuY3Rpb24gcXVhZEluT3V0KHQpIHtcbiAgICB0IC89IDAuNVxuICAgIGlmICh0IDwgMSkgcmV0dXJuIDAuNSp0KnRcbiAgICB0LS1cbiAgICByZXR1cm4gLTAuNSAqICh0Kih0LTIpIC0gMSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBxdWFkSW5PdXQiLCJmdW5jdGlvbiBxdWFkSW4odCkge1xuICByZXR1cm4gdCAqIHRcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBxdWFkSW4iLCJmdW5jdGlvbiBxdWFkT3V0KHQpIHtcbiAgcmV0dXJuIC10ICogKHQgLSAyLjApXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcXVhZE91dCIsImZ1bmN0aW9uIHF1YXJ0aWNJbk91dCh0KSB7XG4gIHJldHVybiB0IDwgMC41XG4gICAgPyArOC4wICogTWF0aC5wb3codCwgNC4wKVxuICAgIDogLTguMCAqIE1hdGgucG93KHQgLSAxLjAsIDQuMCkgKyAxLjBcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBxdWFydGljSW5PdXQiLCJmdW5jdGlvbiBxdWFydGljSW4odCkge1xuICByZXR1cm4gTWF0aC5wb3codCwgNC4wKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHF1YXJ0aWNJbiIsImZ1bmN0aW9uIHF1YXJ0aWNPdXQodCkge1xuICByZXR1cm4gTWF0aC5wb3codCAtIDEuMCwgMy4wKSAqICgxLjAgLSB0KSArIDEuMFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHF1YXJ0aWNPdXQiLCJmdW5jdGlvbiBxaW50aWNJbk91dCh0KSB7XG4gICAgaWYgKCAoIHQgKj0gMiApIDwgMSApIHJldHVybiAwLjUgKiB0ICogdCAqIHQgKiB0ICogdFxuICAgIHJldHVybiAwLjUgKiAoICggdCAtPSAyICkgKiB0ICogdCAqIHQgKiB0ICsgMiApXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcWludGljSW5PdXQiLCJmdW5jdGlvbiBxaW50aWNJbih0KSB7XG4gIHJldHVybiB0ICogdCAqIHQgKiB0ICogdFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHFpbnRpY0luIiwiZnVuY3Rpb24gcWludGljT3V0KHQpIHtcbiAgcmV0dXJuIC0tdCAqIHQgKiB0ICogdCAqIHQgKyAxXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcWludGljT3V0IiwiZnVuY3Rpb24gc2luZUluT3V0KHQpIHtcbiAgcmV0dXJuIC0wLjUgKiAoTWF0aC5jb3MoTWF0aC5QSSp0KSAtIDEpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2luZUluT3V0IiwiZnVuY3Rpb24gc2luZUluICh0KSB7XG4gIHZhciB2ID0gTWF0aC5jb3ModCAqIE1hdGguUEkgKiAwLjUpXG4gIGlmIChNYXRoLmFicyh2KSA8IDFlLTE0KSByZXR1cm4gMVxuICBlbHNlIHJldHVybiAxIC0gdlxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNpbmVJblxuIiwiZnVuY3Rpb24gc2luZU91dCh0KSB7XG4gIHJldHVybiBNYXRoLnNpbih0ICogTWF0aC5QSS8yKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNpbmVPdXQiLCJcbihmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIEhUVFBfU1RBVFVTX09LID0gMjAwO1xuICAgIHZhciBSRUFEWV9TVEFURV9VTlNFTlQgPSAwO1xuICAgIHZhciBSRUFEWV9TVEFURV9PUEVORUQgPSAxO1xuICAgIHZhciBSRUFEWV9TVEFURV9IRUFERVJTX1JFQ0VJVkVEID0gMjtcbiAgICB2YXIgUkVBRFlfU1RBVEVfTE9BRElORyA9IDM7XG4gICAgdmFyIFJFQURZX1NUQVRFX0RPTkUgPSA0O1xuICAgIFxuICAgIGZ1bmN0aW9uIGFqYXggKG1ldGhvZCwgdXJsLCBvcHRpb25zLCB0aGVuKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgdGltZW91dCwgZGF0YTtcbiAgICAgICAgXG4gICAgICAgIHZhciByZXF1ZXN0T2JqZWN0ID0gWE1MSHR0cFJlcXVlc3QgP1xuICAgICAgICAgICAgbmV3IFhNTEh0dHBSZXF1ZXN0KCkgOlxuICAgICAgICAgICAgbmV3IEFjdGl2ZVhPYmplY3QoXCJNaWNyb3NvZnQuWE1MSFRUUFwiKTtcbiAgICAgICAgXG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICAgICAgICBcbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zID09PSBcImZ1bmN0aW9uXCIgJiYgIXRoZW4pIHtcbiAgICAgICAgICAgIHRoZW4gPSBvcHRpb25zO1xuICAgICAgICAgICAgb3B0aW9ucyA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGVuID0gdGhlbiB8fCBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgZGF0YSA9IChcImRhdGFcIiBpbiBvcHRpb25zKSA/IG9wdGlvbnMuZGF0YSA6IHVuZGVmaW5lZDtcbiAgICAgICAgdGltZW91dCA9IG9wdGlvbnMudGltZW91dDtcbiAgICAgICAgdXJsICs9IG9wdGlvbnMucmFuZG9taXplID8gXCI/cmFuZG9tPVwiICsgTWF0aC5yYW5kb20oKSA6IFwiXCI7XG4gICAgICAgIFxuICAgICAgICByZXF1ZXN0T2JqZWN0Lm9wZW4obWV0aG9kLCB1cmwsIHRydWUpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmVxdWVzdE9iamVjdC50aW1lb3V0ID0gdGltZW91dDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmVxdWVzdE9iamVjdC5vbnRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmVxdWVzdE9iamVjdC5hYm9ydCgpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoZW4obmV3IEVycm9yKFwiQ29ubmVjdGlvbiByZWFjaGVkIHRpbWVvdXQgb2YgXCIgKyB0aW1lb3V0ICsgXCIgbXMuXCIpLCByZXF1ZXN0T2JqZWN0KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJlcXVlc3RPYmplY3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBkb25lLCBzdGF0dXNPaztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZG9uZSA9IHJlcXVlc3RPYmplY3QucmVhZHlTdGF0ZSA9PT0gUkVBRFlfU1RBVEVfRE9ORTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGRvbmUpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXNPayA9IHJlcXVlc3RPYmplY3Quc3RhdHVzID09PSBIVFRQX1NUQVRVU19PSztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICBzdGF0dXNPayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoc3RhdHVzT2spIHtcbiAgICAgICAgICAgICAgICAgICAgdGhlbihudWxsLCByZXF1ZXN0T2JqZWN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoZW4obmV3IEVycm9yKFwiQUpBWCByZXF1ZXN0IHdhc24ndCBzdWNjZXNzZnVsLlwiKSwgcmVxdWVzdE9iamVjdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAgIHJlcXVlc3RPYmplY3Quc2VuZChkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlcXVlc3RPYmplY3Quc2VuZCgpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gcmVxdWVzdE9iamVjdDtcbiAgICB9XG4gICAgXG4gICAgYWpheC5IVFRQX1NUQVRVU19PSyA9IEhUVFBfU1RBVFVTX09LO1xuICAgIFxuICAgIGFqYXguUkVBRFlfU1RBVEVfVU5TRU5UID0gUkVBRFlfU1RBVEVfVU5TRU5UO1xuICAgIGFqYXguUkVBRFlfU1RBVEVfT1BFTkVEID0gUkVBRFlfU1RBVEVfT1BFTkVEO1xuICAgIGFqYXguUkVBRFlfU1RBVEVfSEVBREVSU19SRUNFSVZFRCA9IFJFQURZX1NUQVRFX0hFQURFUlNfUkVDRUlWRUQ7XG4gICAgYWpheC5SRUFEWV9TVEFURV9MT0FESU5HID0gUkVBRFlfU1RBVEVfTE9BRElORztcbiAgICBhamF4LlJFQURZX1NUQVRFX0RPTkUgPSBSRUFEWV9TVEFURV9ET05FO1xuICAgIFxuICAgIGFqYXguSFRUUF9NRVRIT0RfR0VUID0gXCJHRVRcIjtcbiAgICBhamF4LkhUVFBfTUVUSE9EX1BPU1QgPSBcIlBPU1RcIjtcbiAgICBhamF4LkhUVFBfTUVUSE9EX1BVVCA9IFwiUFVUXCI7XG4gICAgYWpheC5IVFRQX01FVEhPRF9ERUxFVEUgPSBcIkRFTEVURVwiO1xuICAgIGFqYXguSFRUUF9NRVRIT0RfSEVBRCA9IFwiSEVBRFwiO1xuICAgIFxuICAgIGFqYXguZ2V0ID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucywgdGhlbikge1xuICAgICAgICByZXR1cm4gYWpheChhamF4LkhUVFBfTUVUSE9EX0dFVCwgdXJsLCBvcHRpb25zLCB0aGVuKTtcbiAgICB9O1xuICAgIFxuICAgIGFqYXgucG9zdCA9IGZ1bmN0aW9uICh1cmwsIGRhdGEsIG9wdGlvbnMsIHRoZW4pIHtcbiAgICAgICAgXG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gXCJmdW5jdGlvblwiICYmICF0aGVuKSB7XG4gICAgICAgICAgICB0aGVuID0gb3B0aW9ucztcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgb3B0aW9ucy5kYXRhID0gZGF0YTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBhamF4KGFqYXguSFRUUF9NRVRIT0RfUE9TVCwgdXJsLCBvcHRpb25zLCB0aGVuKTtcbiAgICB9O1xuICAgIFxuICAgIGlmICh0eXBlb2YgcmVxdWlyZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gYWpheDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHdpbmRvdy5hamF4ID0gYWpheDtcbiAgICB9XG4gICAgXG59KCkpO1xuIiwiXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuL2Vhc3ktYWpheC5qc1wiKTtcbiIsIlxuZnVuY3Rpb24gYXBwbHkgKGZuLCBhcmdzKSB7XG4gICAgXG4gICAgaWYgKHR5cGVvZiBmbiAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJBcmd1bWVudCAnZm4nIG11c3QgYmUgYSBmdW5jdGlvbi5cIik7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBmbi5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFwcGx5O1xuIiwiXG52YXIgc2xpY2UgPSByZXF1aXJlKFwiLi9zbGljZVwiKTtcbnZhciBhcHBseSA9IHJlcXVpcmUoXCIuL2FwcGx5XCIpO1xuXG4vL1xuLy8gKiphdXRvKGZuWywgYXJpdHldKSoqXG4vL1xuLy8gV3JhcHMgYGZuYCBzbyB0aGF0IGlmIGl0IGlzIGNhbGxlZCB3aXRoIGxlc3MgYXJndW1lbnRzIHRoYW4gYGZuYCdzIGFyaXR5LFxuLy8gYSBwYXJ0aWFsIGFwcGxpY2F0aW9uIGlzIGRvbmUgaW5zdGVhZCBvZiBjYWxsaW5nIHRoZSBmdW5jdGlvbi4gVGhpcyBtZWFucyB0aGF0IHlvdSBjYW4gZG8gdGhpczpcbi8vXG4vLyAgICAgZWFjaChmbikoY29sbGVjdGlvbik7XG4vL1xuLy8gSW5zdGVhZCBvZiB0aGlzOlxuLy9cbi8vICAgICBlYWNoKGZuLCBjb2xsZWN0aW9uKTtcbi8vXG5cbmZ1bmN0aW9uIGF1dG8gKGZuLCBhcml0eSkge1xuICAgIFxuICAgIGFyaXR5ID0gYXJndW1lbnRzLmxlbmd0aCA+PSAyID8gYXJpdHkgOiBmbi5sZW5ndGg7XG4gICAgXG4gICAgZnVuY3Rpb24gd3JhcCAoKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgYXJncyA9IHNsaWNlKGFyZ3VtZW50cyk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgYXJncy5sZW5ndGggPj0gYXJpdHkgP1xuICAgICAgICAgICAgYXBwbHkoZm4sIGFyZ3MpIDpcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHsgcmV0dXJuIGFwcGx5KHdyYXAsIGFyZ3MuY29uY2F0KHNsaWNlKGFyZ3VtZW50cykpKTsgfVxuICAgICAgICApO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gd3JhcDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhdXRvO1xuIiwiXG52YXIgdHlwZXMgPSByZXF1aXJlKFwiZW5qb3ktdHlwZWNoZWNrc1wiKTtcbnZhciBhdXRvID0gcmVxdWlyZShcIi4vYXV0b1wiKTtcblxuZnVuY3Rpb24gZWFjaEluQXJyYXkgKGZuLCBjb2xsZWN0aW9uKSB7XG4gICAgW10uZm9yRWFjaC5jYWxsKGNvbGxlY3Rpb24sIGZuKTtcbn1cblxuZnVuY3Rpb24gZWFjaEluT2JqZWN0IChmbiwgY29sbGVjdGlvbikge1xuICAgIE9iamVjdC5rZXlzKGNvbGxlY3Rpb24pLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBmbihjb2xsZWN0aW9uW2tleV0sIGtleSwgY29sbGVjdGlvbik7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGVhY2ggKGZuLCBjb2xsZWN0aW9uKSB7XG4gICAgcmV0dXJuIHR5cGVzLmlzQXJyYXlMaWtlKGNvbGxlY3Rpb24pID9cbiAgICAgICAgZWFjaEluQXJyYXkoZm4sIGNvbGxlY3Rpb24pIDpcbiAgICAgICAgZWFjaEluT2JqZWN0KGZuLCBjb2xsZWN0aW9uKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhdXRvKGVhY2gpO1xuIiwiXG52YXIgc29tZSA9IHJlcXVpcmUoXCIuL3NvbWVcIik7XG52YXIgYXV0byA9IHJlcXVpcmUoXCIuL2F1dG9cIik7XG5cbmZ1bmN0aW9uIGZpbmQgKGZuLCBjb2xsZWN0aW9uKSB7XG4gICAgXG4gICAgdmFyIHZhbHVlO1xuICAgIFxuICAgIHNvbWUoZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuICAgICAgICBcbiAgICAgICAgaWYgKGZuKGl0ZW0sIGtleSwgY29sbGVjdGlvbikpIHtcbiAgICAgICAgICAgIHZhbHVlID0gaXRlbTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIFxuICAgIH0sIGNvbGxlY3Rpb24pO1xuICAgIFxuICAgIHJldHVybiB2YWx1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhdXRvKGZpbmQpO1xuIiwiXG5mdW5jdGlvbiBmcmVlIChtZXRob2QpIHtcbiAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmNhbGwuYmluZChtZXRob2QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZyZWU7XG4iLCJcbnZhciBmcmVlID0gcmVxdWlyZShcIi4vZnJlZVwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmcmVlKEFycmF5LnByb3RvdHlwZS5zbGljZSk7XG4iLCJcbnZhciBhdXRvID0gcmVxdWlyZShcIi4vYXV0b1wiKTtcbnZhciBmcmVlID0gcmVxdWlyZShcIi4vZnJlZVwiKTtcbnZhciB0eXBlcyA9IHJlcXVpcmUoXCJlbmpveS10eXBlY2hlY2tzXCIpO1xuXG52YXIgc29tZUFycmF5ID0gZnJlZShBcnJheS5wcm90b3R5cGUuc29tZSk7XG5cbmZ1bmN0aW9uIHNvbWUgKGZuLCBjb2xsZWN0aW9uKSB7XG4gICAgaWYgKHR5cGVzLmlzQXJyYXlMaWtlKGNvbGxlY3Rpb24pKSB7XG4gICAgICAgIHJldHVybiBzb21lQXJyYXkoY29sbGVjdGlvbiwgZm4pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNvbWVPYmplY3QoZm4sIGNvbGxlY3Rpb24pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gc29tZU9iamVjdCAoZm4sIGNvbGxlY3Rpb24pIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoY29sbGVjdGlvbikuc29tZShmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHJldHVybiBmbihjb2xsZWN0aW9uW2tleV0sIGtleSwgY29sbGVjdGlvbik7XG4gICAgfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXV0byhzb21lKTtcbiIsIi8qIGVzbGludCBuby1zZWxmLWNvbXBhcmU6IG9mZiAqL1xuXG5mdW5jdGlvbiBpc051bGwgKGEpIHtcbiAgICByZXR1cm4gYSA9PT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQgKGEpIHtcbiAgICByZXR1cm4gdHlwZW9mIGEgPT09IFwidW5kZWZpbmVkXCI7XG59XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbiAoYSkge1xuICAgIHJldHVybiB0eXBlb2YgYSA9PT0gXCJib29sZWFuXCI7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyIChhKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBhID09PSBcIm51bWJlclwiO1xufVxuXG5mdW5jdGlvbiBpc0Zpbml0ZU51bWJlciAoYSkge1xuICAgIHJldHVybiBpc051bWJlcihhKSAmJiBpc0Zpbml0ZShhKTtcbn1cblxuZnVuY3Rpb24gaXNJbmZpbml0ZU51bWJlciAoYSkge1xuICAgIHJldHVybiBpc051bWJlcihhKSAmJiAhaXNGaW5pdGUoYSk7XG59XG5cbmZ1bmN0aW9uIGlzSW5maW5pdHkgKGEpIHtcbiAgICByZXR1cm4gaXNQb3NpdGl2ZUluZmluaXR5KGEpIHx8IGlzTmVnYXRpdmVJbmZpbml0eShhKTtcbn1cblxuZnVuY3Rpb24gaXNQb3NpdGl2ZUluZmluaXR5IChhKSB7XG4gICAgcmV0dXJuIGEgPT09IE51bWJlci5QT1NJVElWRV9JTkZJTklUWTtcbn1cblxuZnVuY3Rpb24gaXNOZWdhdGl2ZUluZmluaXR5IChhKSB7XG4gICAgcmV0dXJuIGEgPT09IE51bWJlci5ORUdBVElWRV9JTkZJTklUWTtcbn1cblxuZnVuY3Rpb24gaXNOYU4gKGEpIHtcbiAgICByZXR1cm4gYSAhPT0gYTtcbn1cblxuLy9cbi8vIENoZWNrcyBpZiBhIG51bWJlciBpcyBhbiBpbnRlZ2VyLiBQbGVhc2Ugbm90ZSB0aGF0IHRoZXJlJ3MgY3VycmVudGx5IG5vIHdheVxuLy8gdG8gaWRlbnRpZnkgXCJ4LjAwMFwiIGFuZCBzaW1pbGFyIGFzIGVpdGhlciBpbnRlZ2VyIG9yIGZsb2F0IGluIEphdmFTY3JpcHQgYmVjYXVzZVxuLy8gdGhvc2UgYXJlIGF1dG9tYXRpY2FsbHkgdHJ1bmNhdGVkIHRvIFwieFwiLlxuLy9cbmZ1bmN0aW9uIGlzSW50ZWdlciAobikge1xuICAgIHJldHVybiBpc0Zpbml0ZU51bWJlcihuKSAmJiBuICUgMSA9PT0gMDtcbn1cblxuZnVuY3Rpb24gaXNGbG9hdCAobikge1xuICAgIHJldHVybiBpc0Zpbml0ZU51bWJlcihuKSAmJiBuICUgMSAhPT0gMDtcbn1cblxuZnVuY3Rpb24gaXNTdHJpbmcgKGEpIHtcbiAgICByZXR1cm4gdHlwZW9mIGEgPT09IFwic3RyaW5nXCI7XG59XG5cbmZ1bmN0aW9uIGlzQ2hhciAoYSkge1xuICAgIHJldHVybiBpc1N0cmluZyhhKSAmJiBhLmxlbmd0aCA9PT0gMTtcbn1cblxuZnVuY3Rpb24gaXNDb2xsZWN0aW9uIChhKSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGEpIHx8IGlzQXJyYXkoYSk7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0IChhKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBhID09PSBcIm9iamVjdFwiICYmIGEgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkgKGEpIHtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShhKTtcbn1cblxuZnVuY3Rpb24gaXNBcnJheUxpa2UgKGEpIHtcbiAgICByZXR1cm4gKGlzQXJyYXkoYSkgfHwgaXNTdHJpbmcoYSkgfHwgKFxuICAgICAgICBpc09iamVjdChhKSAmJiAoXCJsZW5ndGhcIiBpbiBhKSAmJiBpc0Zpbml0ZU51bWJlcihhLmxlbmd0aCkgJiYgKFxuICAgICAgICAgICAgKGEubGVuZ3RoID4gMCAmJiAoYS5sZW5ndGggLSAxKSBpbiBhKSB8fFxuICAgICAgICAgICAgKGEubGVuZ3RoID09PSAwKVxuICAgICAgICApXG4gICAgKSk7XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24gKGEpIHtcbiAgICByZXR1cm4gdHlwZW9mIGEgPT09IFwiZnVuY3Rpb25cIjtcbn1cblxuZnVuY3Rpb24gaXNQcmltaXRpdmUgKGEpIHtcbiAgICByZXR1cm4gaXNOdWxsKGEpIHx8IGlzVW5kZWZpbmVkKGEpIHx8IGlzTnVtYmVyKGEpIHx8IGlzU3RyaW5nKGEpIHx8IGlzQm9vbGVhbihhKTtcbn1cblxuZnVuY3Rpb24gaXNEYXRlIChhKSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGEpICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhKSA9PT0gXCJbb2JqZWN0IERhdGVdXCI7XG59XG5cbmZ1bmN0aW9uIGlzUmVnRXhwIChhKSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KGEpICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhKSA9PT0gXCJbb2JqZWN0IFJlZ0V4cF1cIjtcbn1cblxuZnVuY3Rpb24gaXNFcnJvciAoYSkge1xuICAgIHJldHVybiBpc09iamVjdChhKSAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYSkgPT09IFwiW29iamVjdCBFcnJvcl1cIjtcbn1cblxuZnVuY3Rpb24gaXNBcmd1bWVudHNPYmplY3QgKGEpIHtcbiAgICByZXR1cm4gaXNPYmplY3QoYSkgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGEpID09PSBcIltvYmplY3QgQXJndW1lbnRzXVwiO1xufVxuXG5mdW5jdGlvbiBpc01hdGhPYmplY3QgKGEpIHtcbiAgICByZXR1cm4gYSA9PT0gTWF0aDtcbn1cblxuZnVuY3Rpb24gaXNUeXBlIChhKSB7XG4gICAgcmV0dXJuIGlzRGVyaXZhYmxlKGEpICYmIGEuJF9fdHlwZV9fID09PSBcInR5cGVcIiAmJiBpc0Z1bmN0aW9uKGEuJF9fY2hlY2tlcl9fKTtcbn1cblxuZnVuY3Rpb24gaXNEZXJpdmFibGUgKGEpIHtcbiAgICByZXR1cm4gaXNPYmplY3QoYSkgJiYgXCIkX19jaGlsZHJlbl9fXCIgaW4gYSAmJiBBcnJheS5pc0FycmF5KGEuJF9fY2hpbGRyZW5fXyk7XG59XG5cbmZ1bmN0aW9uIGlzTWV0aG9kIChhKSB7XG4gICAgcmV0dXJuIGlzRnVuY3Rpb24oYSkgJiYgYS4kX190eXBlX18gPT09IFwibWV0aG9kXCIgJiYgaXNGdW5jdGlvbihhLiRfX2RlZmF1bHRfXykgJiZcbiAgICAgICAgaXNBcnJheShhLiRfX2ltcGxlbWVudGF0aW9uc19fKSAmJiBpc0FycmF5KGEuJF9fZGlzcGF0Y2hlcnNfXyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGlzQXJndW1lbnRzT2JqZWN0OiBpc0FyZ3VtZW50c09iamVjdCxcbiAgICBpc0FycmF5OiBpc0FycmF5LFxuICAgIGlzQXJyYXlMaWtlOiBpc0FycmF5TGlrZSxcbiAgICBpc0Jvb2xlYW46IGlzQm9vbGVhbixcbiAgICBpc0NoYXI6IGlzQ2hhcixcbiAgICBpc0NvbGxlY3Rpb246IGlzQ29sbGVjdGlvbixcbiAgICBpc0RhdGU6IGlzRGF0ZSxcbiAgICBpc0Rlcml2YWJsZTogaXNEZXJpdmFibGUsXG4gICAgaXNFcnJvcjogaXNFcnJvcixcbiAgICBpc0Zpbml0ZU51bWJlcjogaXNGaW5pdGVOdW1iZXIsXG4gICAgaXNGbG9hdDogaXNGbG9hdCxcbiAgICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxuICAgIGlzSW5maW5pdGVOdW1iZXI6IGlzSW5maW5pdGVOdW1iZXIsXG4gICAgaXNJbmZpbml0eTogaXNJbmZpbml0eSxcbiAgICBpc0ludGVnZXI6IGlzSW50ZWdlcixcbiAgICBpc01hdGhPYmplY3Q6IGlzTWF0aE9iamVjdCxcbiAgICBpc01ldGhvZDogaXNNZXRob2QsXG4gICAgaXNOYU46IGlzTmFOLFxuICAgIGlzTmVnYXRpdmVJbmZpbml0eTogaXNOZWdhdGl2ZUluZmluaXR5LFxuICAgIGlzTnVsbDogaXNOdWxsLFxuICAgIGlzTnVtYmVyOiBpc051bWJlcixcbiAgICBpc1Bvc2l0aXZlSW5maW5pdHk6IGlzUG9zaXRpdmVJbmZpbml0eSxcbiAgICBpc1ByaW1pdGl2ZTogaXNQcmltaXRpdmUsXG4gICAgaXNSZWdFeHA6IGlzUmVnRXhwLFxuICAgIGlzU3RyaW5nOiBpc1N0cmluZyxcbiAgICBpc1R5cGU6IGlzVHlwZSxcbiAgICBpc1VuZGVmaW5lZDogaXNVbmRlZmluZWRcbn07XG4iLCIvKiFcbiAqICBob3dsZXIuanMgdjEuMS4yOVxuICogIGhvd2xlcmpzLmNvbVxuICpcbiAqICAoYykgMjAxMy0yMDE2LCBKYW1lcyBTaW1wc29uIG9mIEdvbGRGaXJlIFN0dWRpb3NcbiAqICBnb2xkZmlyZXN0dWRpb3MuY29tXG4gKlxuICogIE1JVCBMaWNlbnNlXG4gKi9cblxuKGZ1bmN0aW9uKCkge1xuICAvLyBzZXR1cFxuICB2YXIgY2FjaGUgPSB7fTtcblxuICAvLyBzZXR1cCB0aGUgYXVkaW8gY29udGV4dFxuICB2YXIgY3R4ID0gbnVsbCxcbiAgICB1c2luZ1dlYkF1ZGlvID0gdHJ1ZSxcbiAgICBub0F1ZGlvID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgaWYgKHR5cGVvZiBBdWRpb0NvbnRleHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBjdHggPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygd2Via2l0QXVkaW9Db250ZXh0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgY3R4ID0gbmV3IHdlYmtpdEF1ZGlvQ29udGV4dCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB1c2luZ1dlYkF1ZGlvID0gZmFsc2U7XG4gICAgfVxuICB9IGNhdGNoKGUpIHtcbiAgICB1c2luZ1dlYkF1ZGlvID0gZmFsc2U7XG4gIH1cblxuICBpZiAoIXVzaW5nV2ViQXVkaW8pIHtcbiAgICBpZiAodHlwZW9mIEF1ZGlvICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbmV3IEF1ZGlvKCk7XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgbm9BdWRpbyA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vQXVkaW8gPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIC8vIGNyZWF0ZSBhIG1hc3RlciBnYWluIG5vZGVcbiAgaWYgKHVzaW5nV2ViQXVkaW8pIHtcbiAgICB2YXIgbWFzdGVyR2FpbiA9ICh0eXBlb2YgY3R4LmNyZWF0ZUdhaW4gPT09ICd1bmRlZmluZWQnKSA/IGN0eC5jcmVhdGVHYWluTm9kZSgpIDogY3R4LmNyZWF0ZUdhaW4oKTtcbiAgICBtYXN0ZXJHYWluLmdhaW4udmFsdWUgPSAxO1xuICAgIG1hc3RlckdhaW4uY29ubmVjdChjdHguZGVzdGluYXRpb24pO1xuICB9XG5cbiAgLy8gY3JlYXRlIGdsb2JhbCBjb250cm9sbGVyXG4gIHZhciBIb3dsZXJHbG9iYWwgPSBmdW5jdGlvbihjb2RlY3MpIHtcbiAgICB0aGlzLl92b2x1bWUgPSAxO1xuICAgIHRoaXMuX211dGVkID0gZmFsc2U7XG4gICAgdGhpcy51c2luZ1dlYkF1ZGlvID0gdXNpbmdXZWJBdWRpbztcbiAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICB0aGlzLm5vQXVkaW8gPSBub0F1ZGlvO1xuICAgIHRoaXMuX2hvd2xzID0gW107XG4gICAgdGhpcy5fY29kZWNzID0gY29kZWNzO1xuICAgIHRoaXMuaU9TQXV0b0VuYWJsZSA9IHRydWU7XG4gIH07XG4gIEhvd2xlckdsb2JhbC5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogR2V0L3NldCB0aGUgZ2xvYmFsIHZvbHVtZSBmb3IgYWxsIHNvdW5kcy5cbiAgICAgKiBAcGFyYW0gIHtGbG9hdH0gdm9sIFZvbHVtZSBmcm9tIDAuMCB0byAxLjAuXG4gICAgICogQHJldHVybiB7SG93bGVyL0Zsb2F0fSAgICAgUmV0dXJucyBzZWxmIG9yIGN1cnJlbnQgdm9sdW1lLlxuICAgICAqL1xuICAgIHZvbHVtZTogZnVuY3Rpb24odm9sKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIC8vIG1ha2Ugc3VyZSB2b2x1bWUgaXMgYSBudW1iZXJcbiAgICAgIHZvbCA9IHBhcnNlRmxvYXQodm9sKTtcblxuICAgICAgaWYgKHZvbCA+PSAwICYmIHZvbCA8PSAxKSB7XG4gICAgICAgIHNlbGYuX3ZvbHVtZSA9IHZvbDtcblxuICAgICAgICBpZiAodXNpbmdXZWJBdWRpbykge1xuICAgICAgICAgIG1hc3RlckdhaW4uZ2Fpbi52YWx1ZSA9IHZvbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCBjYWNoZSBhbmQgY2hhbmdlIHZvbHVtZSBvZiBhbGwgbm9kZXMgdGhhdCBhcmUgdXNpbmcgSFRNTDUgQXVkaW9cbiAgICAgICAgZm9yICh2YXIga2V5IGluIHNlbGYuX2hvd2xzKSB7XG4gICAgICAgICAgaWYgKHNlbGYuX2hvd2xzLmhhc093blByb3BlcnR5KGtleSkgJiYgc2VsZi5faG93bHNba2V5XS5fd2ViQXVkaW8gPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggdGhlIGF1ZGlvIG5vZGVzXG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8c2VsZi5faG93bHNba2V5XS5fYXVkaW9Ob2RlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIHNlbGYuX2hvd2xzW2tleV0uX2F1ZGlvTm9kZVtpXS52b2x1bWUgPSBzZWxmLl9ob3dsc1trZXldLl92b2x1bWUgKiBzZWxmLl92b2x1bWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICB9XG5cbiAgICAgIC8vIHJldHVybiB0aGUgY3VycmVudCBnbG9iYWwgdm9sdW1lXG4gICAgICByZXR1cm4gKHVzaW5nV2ViQXVkaW8pID8gbWFzdGVyR2Fpbi5nYWluLnZhbHVlIDogc2VsZi5fdm9sdW1lO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBNdXRlIGFsbCBzb3VuZHMuXG4gICAgICogQHJldHVybiB7SG93bGVyfVxuICAgICAqL1xuICAgIG11dGU6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fc2V0TXV0ZWQodHJ1ZSk7XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVbm11dGUgYWxsIHNvdW5kcy5cbiAgICAgKiBAcmV0dXJuIHtIb3dsZXJ9XG4gICAgICovXG4gICAgdW5tdXRlOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX3NldE11dGVkKGZhbHNlKTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSBtdXRpbmcgYW5kIHVubXV0aW5nIGdsb2JhbGx5LlxuICAgICAqIEBwYXJhbSAge0Jvb2xlYW59IG11dGVkIElzIG11dGVkIG9yIG5vdC5cbiAgICAgKi9cbiAgICBfc2V0TXV0ZWQ6IGZ1bmN0aW9uKG11dGVkKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIHNlbGYuX211dGVkID0gbXV0ZWQ7XG5cbiAgICAgIGlmICh1c2luZ1dlYkF1ZGlvKSB7XG4gICAgICAgIG1hc3RlckdhaW4uZ2Fpbi52YWx1ZSA9IG11dGVkID8gMCA6IHNlbGYuX3ZvbHVtZTtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIga2V5IGluIHNlbGYuX2hvd2xzKSB7XG4gICAgICAgIGlmIChzZWxmLl9ob3dscy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIHNlbGYuX2hvd2xzW2tleV0uX3dlYkF1ZGlvID09PSBmYWxzZSkge1xuICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCB0aGUgYXVkaW8gbm9kZXNcbiAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8c2VsZi5faG93bHNba2V5XS5fYXVkaW9Ob2RlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzZWxmLl9ob3dsc1trZXldLl9hdWRpb05vZGVbaV0ubXV0ZWQgPSBtdXRlZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgZm9yIGNvZGVjIHN1cHBvcnQuXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBleHQgQXVkaW8gZmlsZSBleHRlbnNpb24uXG4gICAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICBjb2RlY3M6IGZ1bmN0aW9uKGV4dCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2NvZGVjc1tleHRdO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBpT1Mgd2lsbCBvbmx5IGFsbG93IGF1ZGlvIHRvIGJlIHBsYXllZCBhZnRlciBhIHVzZXIgaW50ZXJhY3Rpb24uXG4gICAgICogQXR0ZW1wdCB0byBhdXRvbWF0aWNhbGx5IHVubG9jayBhdWRpbyBvbiB0aGUgZmlyc3QgdXNlciBpbnRlcmFjdGlvbi5cbiAgICAgKiBDb25jZXB0IGZyb206IGh0dHA6Ly9wYXVsYmFrYXVzLmNvbS90dXRvcmlhbHMvaHRtbDUvd2ViLWF1ZGlvLW9uLWlvcy9cbiAgICAgKiBAcmV0dXJuIHtIb3dsZXJ9XG4gICAgICovXG4gICAgX2VuYWJsZWlPU0F1ZGlvOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgLy8gb25seSBydW4gdGhpcyBvbiBpT1MgaWYgYXVkaW8gaXNuJ3QgYWxyZWFkeSBlYW5ibGVkXG4gICAgICBpZiAoY3R4ICYmIChzZWxmLl9pT1NFbmFibGVkIHx8ICEvaVBob25lfGlQYWR8aVBvZC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2VsZi5faU9TRW5hYmxlZCA9IGZhbHNlO1xuXG4gICAgICAvLyBjYWxsIHRoaXMgbWV0aG9kIG9uIHRvdWNoIHN0YXJ0IHRvIGNyZWF0ZSBhbmQgcGxheSBhIGJ1ZmZlcixcbiAgICAgIC8vIHRoZW4gY2hlY2sgaWYgdGhlIGF1ZGlvIGFjdHVhbGx5IHBsYXllZCB0byBkZXRlcm1pbmUgaWZcbiAgICAgIC8vIGF1ZGlvIGhhcyBub3cgYmVlbiB1bmxvY2tlZCBvbiBpT1NcbiAgICAgIHZhciB1bmxvY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gY3JlYXRlIGFuIGVtcHR5IGJ1ZmZlclxuICAgICAgICB2YXIgYnVmZmVyID0gY3R4LmNyZWF0ZUJ1ZmZlcigxLCAxLCAyMjA1MCk7XG4gICAgICAgIHZhciBzb3VyY2UgPSBjdHguY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgICAgIHNvdXJjZS5idWZmZXIgPSBidWZmZXI7XG4gICAgICAgIHNvdXJjZS5jb25uZWN0KGN0eC5kZXN0aW5hdGlvbik7XG5cbiAgICAgICAgLy8gcGxheSB0aGUgZW1wdHkgYnVmZmVyXG4gICAgICAgIGlmICh0eXBlb2Ygc291cmNlLnN0YXJ0ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgIHNvdXJjZS5ub3RlT24oMCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc291cmNlLnN0YXJ0KDApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc2V0dXAgYSB0aW1lb3V0IHRvIGNoZWNrIHRoYXQgd2UgYXJlIHVubG9ja2VkIG9uIHRoZSBuZXh0IGV2ZW50IGxvb3BcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICBpZiAoKHNvdXJjZS5wbGF5YmFja1N0YXRlID09PSBzb3VyY2UuUExBWUlOR19TVEFURSB8fCBzb3VyY2UucGxheWJhY2tTdGF0ZSA9PT0gc291cmNlLkZJTklTSEVEX1NUQVRFKSkge1xuICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSB1bmxvY2tlZCBzdGF0ZSBhbmQgcHJldmVudCB0aGlzIGNoZWNrIGZyb20gaGFwcGVuaW5nIGFnYWluXG4gICAgICAgICAgICBzZWxmLl9pT1NFbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlbGYuaU9TQXV0b0VuYWJsZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvLyByZW1vdmUgdGhlIHRvdWNoIHN0YXJ0IGxpc3RlbmVyXG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndG91Y2hlbmQnLCB1bmxvY2ssIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDApO1xuICAgICAgfTtcblxuICAgICAgLy8gc2V0dXAgYSB0b3VjaCBzdGFydCBsaXN0ZW5lciB0byBhdHRlbXB0IGFuIHVubG9jayBpblxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdW5sb2NrLCBmYWxzZSk7XG5cbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH1cbiAgfTtcblxuICAvLyBjaGVjayBmb3IgYnJvd3NlciBjb2RlYyBzdXBwb3J0XG4gIHZhciBhdWRpb1Rlc3QgPSBudWxsO1xuICB2YXIgY29kZWNzID0ge307XG4gIGlmICghbm9BdWRpbykge1xuICAgIGF1ZGlvVGVzdCA9IG5ldyBBdWRpbygpO1xuICAgIGNvZGVjcyA9IHtcbiAgICAgIG1wMzogISFhdWRpb1Rlc3QuY2FuUGxheVR5cGUoJ2F1ZGlvL21wZWc7JykucmVwbGFjZSgvXm5vJC8sICcnKSxcbiAgICAgIG9wdXM6ICEhYXVkaW9UZXN0LmNhblBsYXlUeXBlKCdhdWRpby9vZ2c7IGNvZGVjcz1cIm9wdXNcIicpLnJlcGxhY2UoL15ubyQvLCAnJyksXG4gICAgICBvZ2c6ICEhYXVkaW9UZXN0LmNhblBsYXlUeXBlKCdhdWRpby9vZ2c7IGNvZGVjcz1cInZvcmJpc1wiJykucmVwbGFjZSgvXm5vJC8sICcnKSxcbiAgICAgIHdhdjogISFhdWRpb1Rlc3QuY2FuUGxheVR5cGUoJ2F1ZGlvL3dhdjsgY29kZWNzPVwiMVwiJykucmVwbGFjZSgvXm5vJC8sICcnKSxcbiAgICAgIGFhYzogISFhdWRpb1Rlc3QuY2FuUGxheVR5cGUoJ2F1ZGlvL2FhYzsnKS5yZXBsYWNlKC9ebm8kLywgJycpLFxuICAgICAgbTRhOiAhIShhdWRpb1Rlc3QuY2FuUGxheVR5cGUoJ2F1ZGlvL3gtbTRhOycpIHx8IGF1ZGlvVGVzdC5jYW5QbGF5VHlwZSgnYXVkaW8vbTRhOycpIHx8IGF1ZGlvVGVzdC5jYW5QbGF5VHlwZSgnYXVkaW8vYWFjOycpKS5yZXBsYWNlKC9ebm8kLywgJycpLFxuICAgICAgbXA0OiAhIShhdWRpb1Rlc3QuY2FuUGxheVR5cGUoJ2F1ZGlvL3gtbXA0OycpIHx8IGF1ZGlvVGVzdC5jYW5QbGF5VHlwZSgnYXVkaW8vbXA0OycpIHx8IGF1ZGlvVGVzdC5jYW5QbGF5VHlwZSgnYXVkaW8vYWFjOycpKS5yZXBsYWNlKC9ebm8kLywgJycpLFxuICAgICAgd2ViYTogISFhdWRpb1Rlc3QuY2FuUGxheVR5cGUoJ2F1ZGlvL3dlYm07IGNvZGVjcz1cInZvcmJpc1wiJykucmVwbGFjZSgvXm5vJC8sICcnKVxuICAgIH07XG4gIH1cblxuICAvLyBhbGxvdyBhY2Nlc3MgdG8gdGhlIGdsb2JhbCBhdWRpbyBjb250cm9sc1xuICB2YXIgSG93bGVyID0gbmV3IEhvd2xlckdsb2JhbChjb2RlY3MpO1xuXG4gIC8vIHNldHVwIHRoZSBhdWRpbyBvYmplY3RcbiAgdmFyIEhvd2wgPSBmdW5jdGlvbihvKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgLy8gc2V0dXAgdGhlIGRlZmF1bHRzXG4gICAgc2VsZi5fYXV0b3BsYXkgPSBvLmF1dG9wbGF5IHx8IGZhbHNlO1xuICAgIHNlbGYuX2J1ZmZlciA9IG8uYnVmZmVyIHx8IGZhbHNlO1xuICAgIHNlbGYuX2R1cmF0aW9uID0gby5kdXJhdGlvbiB8fCAwO1xuICAgIHNlbGYuX2Zvcm1hdCA9IG8uZm9ybWF0IHx8IG51bGw7XG4gICAgc2VsZi5fbG9vcCA9IG8ubG9vcCB8fCBmYWxzZTtcbiAgICBzZWxmLl9sb2FkZWQgPSBmYWxzZTtcbiAgICBzZWxmLl9zcHJpdGUgPSBvLnNwcml0ZSB8fCB7fTtcbiAgICBzZWxmLl9zcmMgPSBvLnNyYyB8fCAnJztcbiAgICBzZWxmLl9wb3MzZCA9IG8ucG9zM2QgfHwgWzAsIDAsIC0wLjVdO1xuICAgIHNlbGYuX3ZvbHVtZSA9IG8udm9sdW1lICE9PSB1bmRlZmluZWQgPyBvLnZvbHVtZSA6IDE7XG4gICAgc2VsZi5fdXJscyA9IG8udXJscyB8fCBbXTtcbiAgICBzZWxmLl9yYXRlID0gby5yYXRlIHx8IDE7XG5cbiAgICAvLyBhbGxvdyBmb3JjaW5nIG9mIGEgc3BlY2lmaWMgcGFubmluZ01vZGVsICgnZXF1YWxwb3dlcicgb3IgJ0hSVEYnKSxcbiAgICAvLyBpZiBub25lIGlzIHNwZWNpZmllZCwgZGVmYXVsdHMgdG8gJ2VxdWFscG93ZXInIGFuZCBzd2l0Y2hlcyB0byAnSFJURidcbiAgICAvLyBpZiAzZCBzb3VuZCBpcyB1c2VkXG4gICAgc2VsZi5fbW9kZWwgPSBvLm1vZGVsIHx8IG51bGw7XG5cbiAgICAvLyBzZXR1cCBldmVudCBmdW5jdGlvbnNcbiAgICBzZWxmLl9vbmxvYWQgPSBbby5vbmxvYWQgfHwgZnVuY3Rpb24oKSB7fV07XG4gICAgc2VsZi5fb25sb2FkZXJyb3IgPSBbby5vbmxvYWRlcnJvciB8fCBmdW5jdGlvbigpIHt9XTtcbiAgICBzZWxmLl9vbmVuZCA9IFtvLm9uZW5kIHx8IGZ1bmN0aW9uKCkge31dO1xuICAgIHNlbGYuX29ucGF1c2UgPSBbby5vbnBhdXNlIHx8IGZ1bmN0aW9uKCkge31dO1xuICAgIHNlbGYuX29ucGxheSA9IFtvLm9ucGxheSB8fCBmdW5jdGlvbigpIHt9XTtcblxuICAgIHNlbGYuX29uZW5kVGltZXIgPSBbXTtcblxuICAgIC8vIFdlYiBBdWRpbyBvciBIVE1MNSBBdWRpbz9cbiAgICBzZWxmLl93ZWJBdWRpbyA9IHVzaW5nV2ViQXVkaW8gJiYgIXNlbGYuX2J1ZmZlcjtcblxuICAgIC8vIGNoZWNrIGlmIHdlIG5lZWQgdG8gZmFsbCBiYWNrIHRvIEhUTUw1IEF1ZGlvXG4gICAgc2VsZi5fYXVkaW9Ob2RlID0gW107XG4gICAgaWYgKHNlbGYuX3dlYkF1ZGlvKSB7XG4gICAgICBzZWxmLl9zZXR1cEF1ZGlvTm9kZSgpO1xuICAgIH1cblxuICAgIC8vIGF1dG9tYXRpY2FsbHkgdHJ5IHRvIGVuYWJsZSBhdWRpbyBvbiBpT1NcbiAgICBpZiAodHlwZW9mIGN0eCAhPT0gJ3VuZGVmaW5lZCcgJiYgY3R4ICYmIEhvd2xlci5pT1NBdXRvRW5hYmxlKSB7XG4gICAgICBIb3dsZXIuX2VuYWJsZWlPU0F1ZGlvKCk7XG4gICAgfVxuXG4gICAgLy8gYWRkIHRoaXMgdG8gYW4gYXJyYXkgb2YgSG93bCdzIHRvIGFsbG93IGdsb2JhbCBjb250cm9sXG4gICAgSG93bGVyLl9ob3dscy5wdXNoKHNlbGYpO1xuXG4gICAgLy8gbG9hZCB0aGUgdHJhY2tcbiAgICBzZWxmLmxvYWQoKTtcbiAgfTtcblxuICAvLyBzZXR1cCBhbGwgb2YgdGhlIG1ldGhvZHNcbiAgSG93bC5wcm90b3R5cGUgPSB7XG4gICAgLyoqXG4gICAgICogTG9hZCBhbiBhdWRpbyBmaWxlLlxuICAgICAqIEByZXR1cm4ge0hvd2x9XG4gICAgICovXG4gICAgbG9hZDogZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIHVybCA9IG51bGw7XG5cbiAgICAgIC8vIGlmIG5vIGF1ZGlvIGlzIGF2YWlsYWJsZSwgcXVpdCBpbW1lZGlhdGVseVxuICAgICAgaWYgKG5vQXVkaW8pIHtcbiAgICAgICAgc2VsZi5vbignbG9hZGVycm9yJywgbmV3IEVycm9yKCdObyBhdWRpbyBzdXBwb3J0LicpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBsb29wIHRocm91Z2ggc291cmNlIFVSTHMgYW5kIHBpY2sgdGhlIGZpcnN0IG9uZSB0aGF0IGlzIGNvbXBhdGlibGVcbiAgICAgIGZvciAodmFyIGk9MDsgaTxzZWxmLl91cmxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBleHQsIHVybEl0ZW07XG5cbiAgICAgICAgaWYgKHNlbGYuX2Zvcm1hdCkge1xuICAgICAgICAgIC8vIHVzZSBzcGVjaWZpZWQgYXVkaW8gZm9ybWF0IGlmIGF2YWlsYWJsZVxuICAgICAgICAgIGV4dCA9IHNlbGYuX2Zvcm1hdDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBmaWd1cmUgb3V0IHRoZSBmaWxldHlwZSAod2hldGhlciBhbiBleHRlbnNpb24gb3IgYmFzZTY0IGRhdGEpXG4gICAgICAgICAgdXJsSXRlbSA9IHNlbGYuX3VybHNbaV07XG4gICAgICAgICAgZXh0ID0gL15kYXRhOmF1ZGlvXFwvKFteOyxdKyk7L2kuZXhlYyh1cmxJdGVtKTtcbiAgICAgICAgICBpZiAoIWV4dCkge1xuICAgICAgICAgICAgZXh0ID0gL1xcLihbXi5dKykkLy5leGVjKHVybEl0ZW0uc3BsaXQoJz8nLCAxKVswXSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGV4dCkge1xuICAgICAgICAgICAgZXh0ID0gZXh0WzFdLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYub24oJ2xvYWRlcnJvcicsIG5ldyBFcnJvcignQ291bGQgbm90IGV4dHJhY3QgZm9ybWF0IGZyb20gcGFzc2VkIFVSTHMsIHBsZWFzZSBhZGQgZm9ybWF0IHBhcmFtZXRlci4nKSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvZGVjc1tleHRdKSB7XG4gICAgICAgICAgdXJsID0gc2VsZi5fdXJsc1tpXTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIXVybCkge1xuICAgICAgICBzZWxmLm9uKCdsb2FkZXJyb3InLCBuZXcgRXJyb3IoJ05vIGNvZGVjIHN1cHBvcnQgZm9yIHNlbGVjdGVkIGF1ZGlvIHNvdXJjZXMuJykpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHNlbGYuX3NyYyA9IHVybDtcblxuICAgICAgaWYgKHNlbGYuX3dlYkF1ZGlvKSB7XG4gICAgICAgIGxvYWRCdWZmZXIoc2VsZiwgdXJsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBuZXdOb2RlID0gbmV3IEF1ZGlvKCk7XG5cbiAgICAgICAgLy8gbGlzdGVuIGZvciBlcnJvcnMgd2l0aCBIVE1MNSBhdWRpbyAoaHR0cDovL2Rldi53My5vcmcvaHRtbDUvc3BlYy1hdXRob3Itdmlldy9zcGVjLmh0bWwjbWVkaWFlcnJvcilcbiAgICAgICAgbmV3Tm9kZS5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAobmV3Tm9kZS5lcnJvciAmJiBuZXdOb2RlLmVycm9yLmNvZGUgPT09IDQpIHtcbiAgICAgICAgICAgIEhvd2xlckdsb2JhbC5ub0F1ZGlvID0gdHJ1ZTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBzZWxmLm9uKCdsb2FkZXJyb3InLCB7dHlwZTogbmV3Tm9kZS5lcnJvciA/IG5ld05vZGUuZXJyb3IuY29kZSA6IDB9KTtcbiAgICAgICAgfSwgZmFsc2UpO1xuXG4gICAgICAgIHNlbGYuX2F1ZGlvTm9kZS5wdXNoKG5ld05vZGUpO1xuXG4gICAgICAgIC8vIHNldHVwIHRoZSBuZXcgYXVkaW8gbm9kZVxuICAgICAgICBuZXdOb2RlLnNyYyA9IHVybDtcbiAgICAgICAgbmV3Tm9kZS5fcG9zID0gMDtcbiAgICAgICAgbmV3Tm9kZS5wcmVsb2FkID0gJ2F1dG8nO1xuICAgICAgICBuZXdOb2RlLnZvbHVtZSA9IChIb3dsZXIuX211dGVkKSA/IDAgOiBzZWxmLl92b2x1bWUgKiBIb3dsZXIudm9sdW1lKCk7XG5cbiAgICAgICAgLy8gc2V0dXAgdGhlIGV2ZW50IGxpc3RlbmVyIHRvIHN0YXJ0IHBsYXlpbmcgdGhlIHNvdW5kXG4gICAgICAgIC8vIGFzIHNvb24gYXMgaXQgaGFzIGJ1ZmZlcmVkIGVub3VnaFxuICAgICAgICB2YXIgbGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAvLyByb3VuZCB1cCB0aGUgZHVyYXRpb24gd2hlbiB1c2luZyBIVE1MNSBBdWRpbyB0byBhY2NvdW50IGZvciB0aGUgbG93ZXIgcHJlY2lzaW9uXG4gICAgICAgICAgc2VsZi5fZHVyYXRpb24gPSBNYXRoLmNlaWwobmV3Tm9kZS5kdXJhdGlvbiAqIDEwKSAvIDEwO1xuXG4gICAgICAgICAgLy8gc2V0dXAgYSBzcHJpdGUgaWYgbm9uZSBpcyBkZWZpbmVkXG4gICAgICAgICAgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHNlbGYuX3Nwcml0ZSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBzZWxmLl9zcHJpdGUgPSB7X2RlZmF1bHQ6IFswLCBzZWxmLl9kdXJhdGlvbiAqIDEwMDBdfTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIXNlbGYuX2xvYWRlZCkge1xuICAgICAgICAgICAgc2VsZi5fbG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIHNlbGYub24oJ2xvYWQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoc2VsZi5fYXV0b3BsYXkpIHtcbiAgICAgICAgICAgIHNlbGYucGxheSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGNsZWFyIHRoZSBldmVudCBsaXN0ZW5lclxuICAgICAgICAgIG5ld05vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2FucGxheXRocm91Z2gnLCBsaXN0ZW5lciwgZmFsc2UpO1xuICAgICAgICB9O1xuICAgICAgICBuZXdOb2RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NhbnBsYXl0aHJvdWdoJywgbGlzdGVuZXIsIGZhbHNlKTtcbiAgICAgICAgbmV3Tm9kZS5sb2FkKCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQvc2V0IHRoZSBVUkxzIHRvIGJlIHB1bGxlZCBmcm9tIHRvIHBsYXkgaW4gdGhpcyBzb3VyY2UuXG4gICAgICogQHBhcmFtICB7QXJyYXl9IHVybHMgIEFycnkgb2YgVVJMcyB0byBsb2FkIGZyb21cbiAgICAgKiBAcmV0dXJuIHtIb3dsfSAgICAgICAgUmV0dXJucyBzZWxmIG9yIHRoZSBjdXJyZW50IFVSTHNcbiAgICAgKi9cbiAgICB1cmxzOiBmdW5jdGlvbih1cmxzKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIGlmICh1cmxzKSB7XG4gICAgICAgIHNlbGYuc3RvcCgpO1xuICAgICAgICBzZWxmLl91cmxzID0gKHR5cGVvZiB1cmxzID09PSAnc3RyaW5nJykgPyBbdXJsc10gOiB1cmxzO1xuICAgICAgICBzZWxmLl9sb2FkZWQgPSBmYWxzZTtcbiAgICAgICAgc2VsZi5sb2FkKCk7XG5cbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc2VsZi5fdXJscztcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUGxheSBhIHNvdW5kIGZyb20gdGhlIGN1cnJlbnQgdGltZSAoMCBieSBkZWZhdWx0KS5cbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgc3ByaXRlICAgKG9wdGlvbmFsKSBQbGF5cyBmcm9tIHRoZSBzcGVjaWZpZWQgcG9zaXRpb24gaW4gdGhlIHNvdW5kIHNwcml0ZSBkZWZpbml0aW9uLlxuICAgICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFjayAob3B0aW9uYWwpIFJldHVybnMgdGhlIHVuaXF1ZSBwbGF5YmFjayBpZCBmb3IgdGhpcyBzb3VuZCBpbnN0YW5jZS5cbiAgICAgKiBAcmV0dXJuIHtIb3dsfVxuICAgICAqL1xuICAgIHBsYXk6IGZ1bmN0aW9uKHNwcml0ZSwgY2FsbGJhY2spIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgLy8gaWYgbm8gc3ByaXRlIHdhcyBwYXNzZWQgYnV0IGEgY2FsbGJhY2sgd2FzLCB1cGRhdGUgdGhlIHZhcmlhYmxlc1xuICAgICAgaWYgKHR5cGVvZiBzcHJpdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY2FsbGJhY2sgPSBzcHJpdGU7XG4gICAgICB9XG5cbiAgICAgIC8vIHVzZSB0aGUgZGVmYXVsdCBzcHJpdGUgaWYgbm9uZSBpcyBwYXNzZWRcbiAgICAgIGlmICghc3ByaXRlIHx8IHR5cGVvZiBzcHJpdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgc3ByaXRlID0gJ19kZWZhdWx0JztcbiAgICAgIH1cblxuICAgICAgLy8gaWYgdGhlIHNvdW5kIGhhc24ndCBiZWVuIGxvYWRlZCwgYWRkIGl0IHRvIHRoZSBldmVudCBxdWV1ZVxuICAgICAgaWYgKCFzZWxmLl9sb2FkZWQpIHtcbiAgICAgICAgc2VsZi5vbignbG9hZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHNlbGYucGxheShzcHJpdGUsIGNhbGxiYWNrKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICB9XG5cbiAgICAgIC8vIGlmIHRoZSBzcHJpdGUgZG9lc24ndCBleGlzdCwgcGxheSBub3RoaW5nXG4gICAgICBpZiAoIXNlbGYuX3Nwcml0ZVtzcHJpdGVdKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKCk7XG4gICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgfVxuXG4gICAgICAvLyBnZXQgdGhlIG5vZGUgdG8gcGxheWJhY2tcbiAgICAgIHNlbGYuX2luYWN0aXZlTm9kZShmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIC8vIHBlcnNpc3QgdGhlIHNwcml0ZSBiZWluZyBwbGF5ZWRcbiAgICAgICAgbm9kZS5fc3ByaXRlID0gc3ByaXRlO1xuXG4gICAgICAgIC8vIGRldGVybWluZSB3aGVyZSB0byBzdGFydCBwbGF5aW5nIGZyb21cbiAgICAgICAgdmFyIHBvcyA9IChub2RlLl9wb3MgPiAwKSA/IG5vZGUuX3BvcyA6IHNlbGYuX3Nwcml0ZVtzcHJpdGVdWzBdIC8gMTAwMDtcblxuICAgICAgICAvLyBkZXRlcm1pbmUgaG93IGxvbmcgdG8gcGxheSBmb3JcbiAgICAgICAgdmFyIGR1cmF0aW9uID0gMDtcbiAgICAgICAgaWYgKHNlbGYuX3dlYkF1ZGlvKSB7XG4gICAgICAgICAgZHVyYXRpb24gPSBzZWxmLl9zcHJpdGVbc3ByaXRlXVsxXSAvIDEwMDAgLSBub2RlLl9wb3M7XG4gICAgICAgICAgaWYgKG5vZGUuX3BvcyA+IDApIHtcbiAgICAgICAgICAgIHBvcyA9IHNlbGYuX3Nwcml0ZVtzcHJpdGVdWzBdIC8gMTAwMCArIHBvcztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZHVyYXRpb24gPSBzZWxmLl9zcHJpdGVbc3ByaXRlXVsxXSAvIDEwMDAgLSAocG9zIC0gc2VsZi5fc3ByaXRlW3Nwcml0ZV1bMF0gLyAxMDAwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGRldGVybWluZSBpZiB0aGlzIHNvdW5kIHNob3VsZCBiZSBsb29wZWRcbiAgICAgICAgdmFyIGxvb3AgPSAhIShzZWxmLl9sb29wIHx8IHNlbGYuX3Nwcml0ZVtzcHJpdGVdWzJdKTtcblxuICAgICAgICAvLyBzZXQgdGltZXIgdG8gZmlyZSB0aGUgJ29uZW5kJyBldmVudFxuICAgICAgICB2YXIgc291bmRJZCA9ICh0eXBlb2YgY2FsbGJhY2sgPT09ICdzdHJpbmcnKSA/IGNhbGxiYWNrIDogTWF0aC5yb3VuZChEYXRlLm5vdygpICogTWF0aC5yYW5kb20oKSkgKyAnJyxcbiAgICAgICAgICB0aW1lcklkO1xuICAgICAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICBpZDogc291bmRJZCxcbiAgICAgICAgICAgIHNwcml0ZTogc3ByaXRlLFxuICAgICAgICAgICAgbG9vcDogbG9vcFxuICAgICAgICAgIH07XG4gICAgICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBpZiBsb29waW5nLCByZXN0YXJ0IHRoZSB0cmFja1xuICAgICAgICAgICAgaWYgKCFzZWxmLl93ZWJBdWRpbyAmJiBsb29wKSB7XG4gICAgICAgICAgICAgIHNlbGYuc3RvcChkYXRhLmlkKS5wbGF5KHNwcml0ZSwgZGF0YS5pZCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIHNldCB3ZWIgYXVkaW8gbm9kZSB0byBwYXVzZWQgYXQgZW5kXG4gICAgICAgICAgICBpZiAoc2VsZi5fd2ViQXVkaW8gJiYgIWxvb3ApIHtcbiAgICAgICAgICAgICAgc2VsZi5fbm9kZUJ5SWQoZGF0YS5pZCkucGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgc2VsZi5fbm9kZUJ5SWQoZGF0YS5pZCkuX3BvcyA9IDA7XG5cbiAgICAgICAgICAgICAgLy8gY2xlYXIgdGhlIGVuZCB0aW1lclxuICAgICAgICAgICAgICBzZWxmLl9jbGVhckVuZFRpbWVyKGRhdGEuaWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBlbmQgdGhlIHRyYWNrIGlmIGl0IGlzIEhUTUwgYXVkaW8gYW5kIGEgc3ByaXRlXG4gICAgICAgICAgICBpZiAoIXNlbGYuX3dlYkF1ZGlvICYmICFsb29wKSB7XG4gICAgICAgICAgICAgIHNlbGYuc3RvcChkYXRhLmlkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZmlyZSBlbmRlZCBldmVudFxuICAgICAgICAgICAgc2VsZi5vbignZW5kJywgc291bmRJZCk7XG4gICAgICAgICAgfSwgKGR1cmF0aW9uIC8gc2VsZi5fcmF0ZSkgKiAxMDAwKTtcblxuICAgICAgICAgIC8vIHN0b3JlIHRoZSByZWZlcmVuY2UgdG8gdGhlIHRpbWVyXG4gICAgICAgICAgc2VsZi5fb25lbmRUaW1lci5wdXNoKHt0aW1lcjogdGltZXJJZCwgaWQ6IGRhdGEuaWR9KTtcbiAgICAgICAgfSkoKTtcblxuICAgICAgICBpZiAoc2VsZi5fd2ViQXVkaW8pIHtcbiAgICAgICAgICB2YXIgbG9vcFN0YXJ0ID0gc2VsZi5fc3ByaXRlW3Nwcml0ZV1bMF0gLyAxMDAwLFxuICAgICAgICAgICAgbG9vcEVuZCA9IHNlbGYuX3Nwcml0ZVtzcHJpdGVdWzFdIC8gMTAwMDtcblxuICAgICAgICAgIC8vIHNldCB0aGUgcGxheSBpZCB0byB0aGlzIG5vZGUgYW5kIGxvYWQgaW50byBjb250ZXh0XG4gICAgICAgICAgbm9kZS5pZCA9IHNvdW5kSWQ7XG4gICAgICAgICAgbm9kZS5wYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgICByZWZyZXNoQnVmZmVyKHNlbGYsIFtsb29wLCBsb29wU3RhcnQsIGxvb3BFbmRdLCBzb3VuZElkKTtcbiAgICAgICAgICBzZWxmLl9wbGF5U3RhcnQgPSBjdHguY3VycmVudFRpbWU7XG4gICAgICAgICAgbm9kZS5nYWluLnZhbHVlID0gc2VsZi5fdm9sdW1lO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiBub2RlLmJ1ZmZlclNvdXJjZS5zdGFydCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGxvb3AgPyBub2RlLmJ1ZmZlclNvdXJjZS5ub3RlR3JhaW5PbigwLCBwb3MsIDg2NDAwKSA6IG5vZGUuYnVmZmVyU291cmNlLm5vdGVHcmFpbk9uKDAsIHBvcywgZHVyYXRpb24pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsb29wID8gbm9kZS5idWZmZXJTb3VyY2Uuc3RhcnQoMCwgcG9zLCA4NjQwMCkgOiBub2RlLmJ1ZmZlclNvdXJjZS5zdGFydCgwLCBwb3MsIGR1cmF0aW9uKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKG5vZGUucmVhZHlTdGF0ZSA9PT0gNCB8fCAhbm9kZS5yZWFkeVN0YXRlICYmIG5hdmlnYXRvci5pc0NvY29vbkpTKSB7XG4gICAgICAgICAgICBub2RlLnJlYWR5U3RhdGUgPSA0O1xuICAgICAgICAgICAgbm9kZS5pZCA9IHNvdW5kSWQ7XG4gICAgICAgICAgICBub2RlLmN1cnJlbnRUaW1lID0gcG9zO1xuICAgICAgICAgICAgbm9kZS5tdXRlZCA9IEhvd2xlci5fbXV0ZWQgfHwgbm9kZS5tdXRlZDtcbiAgICAgICAgICAgIG5vZGUudm9sdW1lID0gc2VsZi5fdm9sdW1lICogSG93bGVyLnZvbHVtZSgpO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHsgbm9kZS5wbGF5KCk7IH0sIDApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzZWxmLl9jbGVhckVuZFRpbWVyKHNvdW5kSWQpO1xuXG4gICAgICAgICAgICAoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgdmFyIHNvdW5kID0gc2VsZixcbiAgICAgICAgICAgICAgICBwbGF5U3ByaXRlID0gc3ByaXRlLFxuICAgICAgICAgICAgICAgIGZuID0gY2FsbGJhY2ssXG4gICAgICAgICAgICAgICAgbmV3Tm9kZSA9IG5vZGU7XG4gICAgICAgICAgICAgIHZhciBsaXN0ZW5lciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHNvdW5kLnBsYXkocGxheVNwcml0ZSwgZm4pO1xuXG4gICAgICAgICAgICAgICAgLy8gY2xlYXIgdGhlIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgICAgICAgbmV3Tm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKCdjYW5wbGF5dGhyb3VnaCcsIGxpc3RlbmVyLCBmYWxzZSk7XG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIG5ld05vZGUuYWRkRXZlbnRMaXN0ZW5lcignY2FucGxheXRocm91Z2gnLCBsaXN0ZW5lciwgZmFsc2UpO1xuICAgICAgICAgICAgfSkoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZmlyZSB0aGUgcGxheSBldmVudCBhbmQgc2VuZCB0aGUgc291bmRJZCBiYWNrIGluIHRoZSBjYWxsYmFja1xuICAgICAgICBzZWxmLm9uKCdwbGF5Jyk7XG4gICAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIGNhbGxiYWNrKHNvdW5kSWQpO1xuXG4gICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBQYXVzZSBwbGF5YmFjayBhbmQgc2F2ZSB0aGUgY3VycmVudCBwb3NpdGlvbi5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgKG9wdGlvbmFsKSBUaGUgcGxheSBpbnN0YW5jZSBJRC5cbiAgICAgKiBAcmV0dXJuIHtIb3dsfVxuICAgICAqL1xuICAgIHBhdXNlOiBmdW5jdGlvbihpZCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAvLyBpZiB0aGUgc291bmQgaGFzbid0IGJlZW4gbG9hZGVkLCBhZGQgaXQgdG8gdGhlIGV2ZW50IHF1ZXVlXG4gICAgICBpZiAoIXNlbGYuX2xvYWRlZCkge1xuICAgICAgICBzZWxmLm9uKCdwbGF5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc2VsZi5wYXVzZShpZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgfVxuXG4gICAgICAvLyBjbGVhciAnb25lbmQnIHRpbWVyXG4gICAgICBzZWxmLl9jbGVhckVuZFRpbWVyKGlkKTtcblxuICAgICAgdmFyIGFjdGl2ZU5vZGUgPSAoaWQpID8gc2VsZi5fbm9kZUJ5SWQoaWQpIDogc2VsZi5fYWN0aXZlTm9kZSgpO1xuICAgICAgaWYgKGFjdGl2ZU5vZGUpIHtcbiAgICAgICAgYWN0aXZlTm9kZS5fcG9zID0gc2VsZi5wb3MobnVsbCwgaWQpO1xuXG4gICAgICAgIGlmIChzZWxmLl93ZWJBdWRpbykge1xuICAgICAgICAgIC8vIG1ha2Ugc3VyZSB0aGUgc291bmQgaGFzIGJlZW4gY3JlYXRlZFxuICAgICAgICAgIGlmICghYWN0aXZlTm9kZS5idWZmZXJTb3VyY2UgfHwgYWN0aXZlTm9kZS5wYXVzZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGFjdGl2ZU5vZGUucGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgICBpZiAodHlwZW9mIGFjdGl2ZU5vZGUuYnVmZmVyU291cmNlLnN0b3AgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBhY3RpdmVOb2RlLmJ1ZmZlclNvdXJjZS5ub3RlT2ZmKDApO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhY3RpdmVOb2RlLmJ1ZmZlclNvdXJjZS5zdG9wKDApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhY3RpdmVOb2RlLnBhdXNlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc2VsZi5vbigncGF1c2UnKTtcblxuICAgICAgcmV0dXJuIHNlbGY7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFN0b3AgcGxheWJhY2sgYW5kIHJlc2V0IHRvIHN0YXJ0LlxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gaWQgIChvcHRpb25hbCkgVGhlIHBsYXkgaW5zdGFuY2UgSUQuXG4gICAgICogQHJldHVybiB7SG93bH1cbiAgICAgKi9cbiAgICBzdG9wOiBmdW5jdGlvbihpZCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAvLyBpZiB0aGUgc291bmQgaGFzbid0IGJlZW4gbG9hZGVkLCBhZGQgaXQgdG8gdGhlIGV2ZW50IHF1ZXVlXG4gICAgICBpZiAoIXNlbGYuX2xvYWRlZCkge1xuICAgICAgICBzZWxmLm9uKCdwbGF5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc2VsZi5zdG9wKGlkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICB9XG5cbiAgICAgIC8vIGNsZWFyICdvbmVuZCcgdGltZXJcbiAgICAgIHNlbGYuX2NsZWFyRW5kVGltZXIoaWQpO1xuXG4gICAgICB2YXIgYWN0aXZlTm9kZSA9IChpZCkgPyBzZWxmLl9ub2RlQnlJZChpZCkgOiBzZWxmLl9hY3RpdmVOb2RlKCk7XG4gICAgICBpZiAoYWN0aXZlTm9kZSkge1xuICAgICAgICBhY3RpdmVOb2RlLl9wb3MgPSAwO1xuXG4gICAgICAgIGlmIChzZWxmLl93ZWJBdWRpbykge1xuICAgICAgICAgIC8vIG1ha2Ugc3VyZSB0aGUgc291bmQgaGFzIGJlZW4gY3JlYXRlZFxuICAgICAgICAgIGlmICghYWN0aXZlTm9kZS5idWZmZXJTb3VyY2UgfHwgYWN0aXZlTm9kZS5wYXVzZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGFjdGl2ZU5vZGUucGF1c2VkID0gdHJ1ZTtcblxuICAgICAgICAgIGlmICh0eXBlb2YgYWN0aXZlTm9kZS5idWZmZXJTb3VyY2Uuc3RvcCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGFjdGl2ZU5vZGUuYnVmZmVyU291cmNlLm5vdGVPZmYoMCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFjdGl2ZU5vZGUuYnVmZmVyU291cmNlLnN0b3AoMCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKCFpc05hTihhY3RpdmVOb2RlLmR1cmF0aW9uKSkge1xuICAgICAgICAgIGFjdGl2ZU5vZGUucGF1c2UoKTtcbiAgICAgICAgICBhY3RpdmVOb2RlLmN1cnJlbnRUaW1lID0gMDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2VsZjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogTXV0ZSB0aGlzIHNvdW5kLlxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gaWQgKG9wdGlvbmFsKSBUaGUgcGxheSBpbnN0YW5jZSBJRC5cbiAgICAgKiBAcmV0dXJuIHtIb3dsfVxuICAgICAqL1xuICAgIG11dGU6IGZ1bmN0aW9uKGlkKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIC8vIGlmIHRoZSBzb3VuZCBoYXNuJ3QgYmVlbiBsb2FkZWQsIGFkZCBpdCB0byB0aGUgZXZlbnQgcXVldWVcbiAgICAgIGlmICghc2VsZi5fbG9hZGVkKSB7XG4gICAgICAgIHNlbGYub24oJ3BsYXknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBzZWxmLm11dGUoaWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICAgIH1cblxuICAgICAgdmFyIGFjdGl2ZU5vZGUgPSAoaWQpID8gc2VsZi5fbm9kZUJ5SWQoaWQpIDogc2VsZi5fYWN0aXZlTm9kZSgpO1xuICAgICAgaWYgKGFjdGl2ZU5vZGUpIHtcbiAgICAgICAgaWYgKHNlbGYuX3dlYkF1ZGlvKSB7XG4gICAgICAgICAgYWN0aXZlTm9kZS5nYWluLnZhbHVlID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhY3RpdmVOb2RlLm11dGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2VsZjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogVW5tdXRlIHRoaXMgc291bmQuXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBpZCAob3B0aW9uYWwpIFRoZSBwbGF5IGluc3RhbmNlIElELlxuICAgICAqIEByZXR1cm4ge0hvd2x9XG4gICAgICovXG4gICAgdW5tdXRlOiBmdW5jdGlvbihpZCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICAvLyBpZiB0aGUgc291bmQgaGFzbid0IGJlZW4gbG9hZGVkLCBhZGQgaXQgdG8gdGhlIGV2ZW50IHF1ZXVlXG4gICAgICBpZiAoIXNlbGYuX2xvYWRlZCkge1xuICAgICAgICBzZWxmLm9uKCdwbGF5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgc2VsZi51bm11dGUoaWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICAgIH1cblxuICAgICAgdmFyIGFjdGl2ZU5vZGUgPSAoaWQpID8gc2VsZi5fbm9kZUJ5SWQoaWQpIDogc2VsZi5fYWN0aXZlTm9kZSgpO1xuICAgICAgaWYgKGFjdGl2ZU5vZGUpIHtcbiAgICAgICAgaWYgKHNlbGYuX3dlYkF1ZGlvKSB7XG4gICAgICAgICAgYWN0aXZlTm9kZS5nYWluLnZhbHVlID0gc2VsZi5fdm9sdW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGFjdGl2ZU5vZGUubXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2VsZjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0L3NldCB2b2x1bWUgb2YgdGhpcyBzb3VuZC5cbiAgICAgKiBAcGFyYW0gIHtGbG9hdH0gIHZvbCBWb2x1bWUgZnJvbSAwLjAgdG8gMS4wLlxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gaWQgIChvcHRpb25hbCkgVGhlIHBsYXkgaW5zdGFuY2UgSUQuXG4gICAgICogQHJldHVybiB7SG93bC9GbG9hdH0gICAgIFJldHVybnMgc2VsZiBvciBjdXJyZW50IHZvbHVtZS5cbiAgICAgKi9cbiAgICB2b2x1bWU6IGZ1bmN0aW9uKHZvbCwgaWQpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgLy8gbWFrZSBzdXJlIHZvbHVtZSBpcyBhIG51bWJlclxuICAgICAgdm9sID0gcGFyc2VGbG9hdCh2b2wpO1xuXG4gICAgICBpZiAodm9sID49IDAgJiYgdm9sIDw9IDEpIHtcbiAgICAgICAgc2VsZi5fdm9sdW1lID0gdm9sO1xuXG4gICAgICAgIC8vIGlmIHRoZSBzb3VuZCBoYXNuJ3QgYmVlbiBsb2FkZWQsIGFkZCBpdCB0byB0aGUgZXZlbnQgcXVldWVcbiAgICAgICAgaWYgKCFzZWxmLl9sb2FkZWQpIHtcbiAgICAgICAgICBzZWxmLm9uKCdwbGF5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBzZWxmLnZvbHVtZSh2b2wsIGlkKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGFjdGl2ZU5vZGUgPSAoaWQpID8gc2VsZi5fbm9kZUJ5SWQoaWQpIDogc2VsZi5fYWN0aXZlTm9kZSgpO1xuICAgICAgICBpZiAoYWN0aXZlTm9kZSkge1xuICAgICAgICAgIGlmIChzZWxmLl93ZWJBdWRpbykge1xuICAgICAgICAgICAgYWN0aXZlTm9kZS5nYWluLnZhbHVlID0gdm9sO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhY3RpdmVOb2RlLnZvbHVtZSA9IHZvbCAqIEhvd2xlci52b2x1bWUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzZWxmLl92b2x1bWU7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEdldC9zZXQgd2hldGhlciB0byBsb29wIHRoZSBzb3VuZC5cbiAgICAgKiBAcGFyYW0gIHtCb29sZWFufSBsb29wIFRvIGxvb3Agb3Igbm90IHRvIGxvb3AsIHRoYXQgaXMgdGhlIHF1ZXN0aW9uLlxuICAgICAqIEByZXR1cm4ge0hvd2wvQm9vbGVhbn0gICAgICBSZXR1cm5zIHNlbGYgb3IgY3VycmVudCBsb29waW5nIHZhbHVlLlxuICAgICAqL1xuICAgIGxvb3A6IGZ1bmN0aW9uKGxvb3ApIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgaWYgKHR5cGVvZiBsb29wID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgc2VsZi5fbG9vcCA9IGxvb3A7XG5cbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc2VsZi5fbG9vcDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0L3NldCBzb3VuZCBzcHJpdGUgZGVmaW5pdGlvbi5cbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IHNwcml0ZSBFeGFtcGxlOiB7c3ByaXRlTmFtZTogW29mZnNldCwgZHVyYXRpb24sIGxvb3BdfVxuICAgICAqICAgICAgICAgICAgICAgIEBwYXJhbSB7SW50ZWdlcn0gb2Zmc2V0ICAgV2hlcmUgdG8gYmVnaW4gcGxheWJhY2sgaW4gbWlsbGlzZWNvbmRzXG4gICAgICogICAgICAgICAgICAgICAgQHBhcmFtIHtJbnRlZ2VyfSBkdXJhdGlvbiBIb3cgbG9uZyB0byBwbGF5IGluIG1pbGxpc2Vjb25kc1xuICAgICAqICAgICAgICAgICAgICAgIEBwYXJhbSB7Qm9vbGVhbn0gbG9vcCAgICAgKG9wdGlvbmFsKSBTZXQgdHJ1ZSB0byBsb29wIHRoaXMgc3ByaXRlXG4gICAgICogQHJldHVybiB7SG93bH0gICAgICAgIFJldHVybnMgY3VycmVudCBzcHJpdGUgc2hlZXQgb3Igc2VsZi5cbiAgICAgKi9cbiAgICBzcHJpdGU6IGZ1bmN0aW9uKHNwcml0ZSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgICBpZiAodHlwZW9mIHNwcml0ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgc2VsZi5fc3ByaXRlID0gc3ByaXRlO1xuXG4gICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNlbGYuX3Nwcml0ZTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0L3NldCB0aGUgcG9zaXRpb24gb2YgcGxheWJhY2suXG4gICAgICogQHBhcmFtICB7RmxvYXR9ICBwb3MgVGhlIHBvc2l0aW9uIHRvIG1vdmUgY3VycmVudCBwbGF5YmFjayB0by5cbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGlkICAob3B0aW9uYWwpIFRoZSBwbGF5IGluc3RhbmNlIElELlxuICAgICAqIEByZXR1cm4ge0hvd2wvRmxvYXR9ICAgICAgUmV0dXJucyBzZWxmIG9yIGN1cnJlbnQgcGxheWJhY2sgcG9zaXRpb24uXG4gICAgICovXG4gICAgcG9zOiBmdW5jdGlvbihwb3MsIGlkKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIC8vIGlmIHRoZSBzb3VuZCBoYXNuJ3QgYmVlbiBsb2FkZWQsIGFkZCBpdCB0byB0aGUgZXZlbnQgcXVldWVcbiAgICAgIGlmICghc2VsZi5fbG9hZGVkKSB7XG4gICAgICAgIHNlbGYub24oJ2xvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBzZWxmLnBvcyhwb3MpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdHlwZW9mIHBvcyA9PT0gJ251bWJlcicgPyBzZWxmIDogc2VsZi5fcG9zIHx8IDA7XG4gICAgICB9XG5cbiAgICAgIC8vIG1ha2Ugc3VyZSB3ZSBhcmUgZGVhbGluZyB3aXRoIGEgbnVtYmVyIGZvciBwb3NcbiAgICAgIHBvcyA9IHBhcnNlRmxvYXQocG9zKTtcblxuICAgICAgdmFyIGFjdGl2ZU5vZGUgPSAoaWQpID8gc2VsZi5fbm9kZUJ5SWQoaWQpIDogc2VsZi5fYWN0aXZlTm9kZSgpO1xuICAgICAgaWYgKGFjdGl2ZU5vZGUpIHtcbiAgICAgICAgaWYgKHBvcyA+PSAwKSB7XG4gICAgICAgICAgc2VsZi5wYXVzZShpZCk7XG4gICAgICAgICAgYWN0aXZlTm9kZS5fcG9zID0gcG9zO1xuICAgICAgICAgIHNlbGYucGxheShhY3RpdmVOb2RlLl9zcHJpdGUsIGlkKTtcblxuICAgICAgICAgIHJldHVybiBzZWxmO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBzZWxmLl93ZWJBdWRpbyA/IGFjdGl2ZU5vZGUuX3BvcyArIChjdHguY3VycmVudFRpbWUgLSBzZWxmLl9wbGF5U3RhcnQpIDogYWN0aXZlTm9kZS5jdXJyZW50VGltZTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChwb3MgPj0gMCkge1xuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGZpbmQgdGhlIGZpcnN0IGluYWN0aXZlIG5vZGUgdG8gcmV0dXJuIHRoZSBwb3MgZm9yXG4gICAgICAgIGZvciAodmFyIGk9MDsgaTxzZWxmLl9hdWRpb05vZGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoc2VsZi5fYXVkaW9Ob2RlW2ldLnBhdXNlZCAmJiBzZWxmLl9hdWRpb05vZGVbaV0ucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgICAgcmV0dXJuIChzZWxmLl93ZWJBdWRpbykgPyBzZWxmLl9hdWRpb05vZGVbaV0uX3BvcyA6IHNlbGYuX2F1ZGlvTm9kZVtpXS5jdXJyZW50VGltZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogR2V0L3NldCB0aGUgM0QgcG9zaXRpb24gb2YgdGhlIGF1ZGlvIHNvdXJjZS5cbiAgICAgKiBUaGUgbW9zdCBjb21tb24gdXNhZ2UgaXMgdG8gc2V0IHRoZSAneCcgcG9zaXRpb25cbiAgICAgKiB0byBhZmZlY3QgdGhlIGxlZnQvcmlnaHQgZWFyIHBhbm5pbmcuIFNldHRpbmcgYW55IHZhbHVlIGhpZ2hlciB0aGFuXG4gICAgICogMS4wIHdpbGwgYmVnaW4gdG8gZGVjcmVhc2UgdGhlIHZvbHVtZSBvZiB0aGUgc291bmQgYXMgaXQgbW92ZXMgZnVydGhlciBhd2F5LlxuICAgICAqIE5PVEU6IFRoaXMgb25seSB3b3JrcyB3aXRoIFdlYiBBdWRpbyBBUEksIEhUTUw1IEF1ZGlvIHBsYXliYWNrXG4gICAgICogd2lsbCBub3QgYmUgYWZmZWN0ZWQuXG4gICAgICogQHBhcmFtICB7RmxvYXR9ICB4ICBUaGUgeC1wb3NpdGlvbiBvZiB0aGUgcGxheWJhY2sgZnJvbSAtMTAwMC4wIHRvIDEwMDAuMFxuICAgICAqIEBwYXJhbSAge0Zsb2F0fSAgeSAgVGhlIHktcG9zaXRpb24gb2YgdGhlIHBsYXliYWNrIGZyb20gLTEwMDAuMCB0byAxMDAwLjBcbiAgICAgKiBAcGFyYW0gIHtGbG9hdH0gIHogIFRoZSB6LXBvc2l0aW9uIG9mIHRoZSBwbGF5YmFjayBmcm9tIC0xMDAwLjAgdG8gMTAwMC4wXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBpZCAob3B0aW9uYWwpIFRoZSBwbGF5IGluc3RhbmNlIElELlxuICAgICAqIEByZXR1cm4ge0hvd2wvQXJyYXl9ICAgUmV0dXJucyBzZWxmIG9yIHRoZSBjdXJyZW50IDNEIHBvc2l0aW9uOiBbeCwgeSwgel1cbiAgICAgKi9cbiAgICBwb3MzZDogZnVuY3Rpb24oeCwgeSwgeiwgaWQpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgLy8gc2V0IGEgZGVmYXVsdCBmb3IgdGhlIG9wdGlvbmFsICd5JyAmICd6J1xuICAgICAgeSA9ICh0eXBlb2YgeSA9PT0gJ3VuZGVmaW5lZCcgfHwgIXkpID8gMCA6IHk7XG4gICAgICB6ID0gKHR5cGVvZiB6ID09PSAndW5kZWZpbmVkJyB8fCAheikgPyAtMC41IDogejtcblxuICAgICAgLy8gaWYgdGhlIHNvdW5kIGhhc24ndCBiZWVuIGxvYWRlZCwgYWRkIGl0IHRvIHRoZSBldmVudCBxdWV1ZVxuICAgICAgaWYgKCFzZWxmLl9sb2FkZWQpIHtcbiAgICAgICAgc2VsZi5vbigncGxheScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHNlbGYucG9zM2QoeCwgeSwgeiwgaWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc2VsZjtcbiAgICAgIH1cblxuICAgICAgaWYgKHggPj0gMCB8fCB4IDwgMCkge1xuICAgICAgICBpZiAoc2VsZi5fd2ViQXVkaW8pIHtcbiAgICAgICAgICB2YXIgYWN0aXZlTm9kZSA9IChpZCkgPyBzZWxmLl9ub2RlQnlJZChpZCkgOiBzZWxmLl9hY3RpdmVOb2RlKCk7XG4gICAgICAgICAgaWYgKGFjdGl2ZU5vZGUpIHtcbiAgICAgICAgICAgIHNlbGYuX3BvczNkID0gW3gsIHksIHpdO1xuICAgICAgICAgICAgYWN0aXZlTm9kZS5wYW5uZXIuc2V0UG9zaXRpb24oeCwgeSwgeik7XG4gICAgICAgICAgICBhY3RpdmVOb2RlLnBhbm5lci5wYW5uaW5nTW9kZWwgPSBzZWxmLl9tb2RlbCB8fCAnSFJURic7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gc2VsZi5fcG9zM2Q7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBGYWRlIGEgY3VycmVudGx5IHBsYXlpbmcgc291bmQgYmV0d2VlbiB0d28gdm9sdW1lcy5cbiAgICAgKiBAcGFyYW0gIHtOdW1iZXJ9ICAgZnJvbSAgICAgVGhlIHZvbHVtZSB0byBmYWRlIGZyb20gKDAuMCB0byAxLjApLlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gICB0byAgICAgICBUaGUgdm9sdW1lIHRvIGZhZGUgdG8gKDAuMCB0byAxLjApLlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gICBsZW4gICAgICBUaW1lIGluIG1pbGxpc2Vjb25kcyB0byBmYWRlLlxuICAgICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFjayAob3B0aW9uYWwpIEZpcmVkIHdoZW4gdGhlIGZhZGUgaXMgY29tcGxldGUuXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSAgIGlkICAgICAgIChvcHRpb25hbCkgVGhlIHBsYXkgaW5zdGFuY2UgSUQuXG4gICAgICogQHJldHVybiB7SG93bH1cbiAgICAgKi9cbiAgICBmYWRlOiBmdW5jdGlvbihmcm9tLCB0bywgbGVuLCBjYWxsYmFjaywgaWQpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgZGlmZiA9IE1hdGguYWJzKGZyb20gLSB0byksXG4gICAgICAgIGRpciA9IGZyb20gPiB0byA/ICdkb3duJyA6ICd1cCcsXG4gICAgICAgIHN0ZXBzID0gZGlmZiAvIDAuMDEsXG4gICAgICAgIHN0ZXBUaW1lID0gbGVuIC8gc3RlcHM7XG5cbiAgICAgIC8vIGlmIHRoZSBzb3VuZCBoYXNuJ3QgYmVlbiBsb2FkZWQsIGFkZCBpdCB0byB0aGUgZXZlbnQgcXVldWVcbiAgICAgIGlmICghc2VsZi5fbG9hZGVkKSB7XG4gICAgICAgIHNlbGYub24oJ2xvYWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBzZWxmLmZhZGUoZnJvbSwgdG8sIGxlbiwgY2FsbGJhY2ssIGlkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICB9XG5cbiAgICAgIC8vIHNldCB0aGUgdm9sdW1lIHRvIHRoZSBzdGFydCBwb3NpdGlvblxuICAgICAgc2VsZi52b2x1bWUoZnJvbSwgaWQpO1xuXG4gICAgICBmb3IgKHZhciBpPTE7IGk8PXN0ZXBzOyBpKyspIHtcbiAgICAgICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHZhciBjaGFuZ2UgPSBzZWxmLl92b2x1bWUgKyAoZGlyID09PSAndXAnID8gMC4wMSA6IC0wLjAxKSAqIGksXG4gICAgICAgICAgICB2b2wgPSBNYXRoLnJvdW5kKDEwMDAgKiBjaGFuZ2UpIC8gMTAwMCxcbiAgICAgICAgICAgIHRvVm9sID0gdG87XG5cbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2VsZi52b2x1bWUodm9sLCBpZCk7XG5cbiAgICAgICAgICAgIGlmICh2b2wgPT09IHRvVm9sKSB7XG4gICAgICAgICAgICAgIGlmIChjYWxsYmFjaykgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LCBzdGVwVGltZSAqIGkpO1xuICAgICAgICB9KSgpO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBbREVQUkVDQVRFRF0gRmFkZSBpbiB0aGUgY3VycmVudCBzb3VuZC5cbiAgICAgKiBAcGFyYW0gIHtGbG9hdH0gICAgdG8gICAgICBWb2x1bWUgdG8gZmFkZSB0byAoMC4wIHRvIDEuMCkuXG4gICAgICogQHBhcmFtICB7TnVtYmVyfSAgIGxlbiAgICAgVGltZSBpbiBtaWxsaXNlY29uZHMgdG8gZmFkZS5cbiAgICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgKiBAcmV0dXJuIHtIb3dsfVxuICAgICAqL1xuICAgIGZhZGVJbjogZnVuY3Rpb24odG8sIGxlbiwgY2FsbGJhY2spIHtcbiAgICAgIHJldHVybiB0aGlzLnZvbHVtZSgwKS5wbGF5KCkuZmFkZSgwLCB0bywgbGVuLCBjYWxsYmFjayk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIFtERVBSRUNBVEVEXSBGYWRlIG91dCB0aGUgY3VycmVudCBzb3VuZCBhbmQgcGF1c2Ugd2hlbiBmaW5pc2hlZC5cbiAgICAgKiBAcGFyYW0gIHtGbG9hdH0gICAgdG8gICAgICAgVm9sdW1lIHRvIGZhZGUgdG8gKDAuMCB0byAxLjApLlxuICAgICAqIEBwYXJhbSAge051bWJlcn0gICBsZW4gICAgICBUaW1lIGluIG1pbGxpc2Vjb25kcyB0byBmYWRlLlxuICAgICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqIEBwYXJhbSAge1N0cmluZ30gICBpZCAgICAgICAob3B0aW9uYWwpIFRoZSBwbGF5IGluc3RhbmNlIElELlxuICAgICAqIEByZXR1cm4ge0hvd2x9XG4gICAgICovXG4gICAgZmFkZU91dDogZnVuY3Rpb24odG8sIGxlbiwgY2FsbGJhY2ssIGlkKSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICAgIHJldHVybiBzZWxmLmZhZGUoc2VsZi5fdm9sdW1lLCB0bywgbGVuLCBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xuICAgICAgICBzZWxmLnBhdXNlKGlkKTtcblxuICAgICAgICAvLyBmaXJlIGVuZGVkIGV2ZW50XG4gICAgICAgIHNlbGYub24oJ2VuZCcpO1xuICAgICAgfSwgaWQpO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgYW4gYXVkaW8gbm9kZSBieSBJRC5cbiAgICAgKiBAcmV0dXJuIHtIb3dsfSBBdWRpbyBub2RlLlxuICAgICAqL1xuICAgIF9ub2RlQnlJZDogZnVuY3Rpb24oaWQpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgbm9kZSA9IHNlbGYuX2F1ZGlvTm9kZVswXTtcblxuICAgICAgLy8gZmluZCB0aGUgbm9kZSB3aXRoIHRoaXMgSURcbiAgICAgIGZvciAodmFyIGk9MDsgaTxzZWxmLl9hdWRpb05vZGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHNlbGYuX2F1ZGlvTm9kZVtpXS5pZCA9PT0gaWQpIHtcbiAgICAgICAgICBub2RlID0gc2VsZi5fYXVkaW9Ob2RlW2ldO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBub2RlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGZpcnN0IGFjdGl2ZSBhdWRpbyBub2RlLlxuICAgICAqIEByZXR1cm4ge0hvd2x9IEF1ZGlvIG5vZGUuXG4gICAgICovXG4gICAgX2FjdGl2ZU5vZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBub2RlID0gbnVsbDtcblxuICAgICAgLy8gZmluZCB0aGUgZmlyc3QgcGxheWluZyBub2RlXG4gICAgICBmb3IgKHZhciBpPTA7IGk8c2VsZi5fYXVkaW9Ob2RlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICghc2VsZi5fYXVkaW9Ob2RlW2ldLnBhdXNlZCkge1xuICAgICAgICAgIG5vZGUgPSBzZWxmLl9hdWRpb05vZGVbaV07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gcmVtb3ZlIGV4Y2VzcyBpbmFjdGl2ZSBub2Rlc1xuICAgICAgc2VsZi5fZHJhaW5Qb29sKCk7XG5cbiAgICAgIHJldHVybiBub2RlO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGZpcnN0IGluYWN0aXZlIGF1ZGlvIG5vZGUuXG4gICAgICogSWYgdGhlcmUgaXMgbm9uZSwgY3JlYXRlIGEgbmV3IG9uZSBhbmQgYWRkIGl0IHRvIHRoZSBwb29sLlxuICAgICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFjayBGdW5jdGlvbiB0byBjYWxsIHdoZW4gdGhlIGF1ZGlvIG5vZGUgaXMgcmVhZHkuXG4gICAgICovXG4gICAgX2luYWN0aXZlTm9kZTogZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgbm9kZSA9IG51bGw7XG5cbiAgICAgIC8vIGZpbmQgZmlyc3QgaW5hY3RpdmUgbm9kZSB0byByZWN5Y2xlXG4gICAgICBmb3IgKHZhciBpPTA7IGk8c2VsZi5fYXVkaW9Ob2RlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChzZWxmLl9hdWRpb05vZGVbaV0ucGF1c2VkICYmIHNlbGYuX2F1ZGlvTm9kZVtpXS5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgLy8gc2VuZCB0aGUgbm9kZSBiYWNrIGZvciB1c2UgYnkgdGhlIG5ldyBwbGF5IGluc3RhbmNlXG4gICAgICAgICAgY2FsbGJhY2soc2VsZi5fYXVkaW9Ob2RlW2ldKTtcbiAgICAgICAgICBub2RlID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyByZW1vdmUgZXhjZXNzIGluYWN0aXZlIG5vZGVzXG4gICAgICBzZWxmLl9kcmFpblBvb2woKTtcblxuICAgICAgaWYgKG5vZGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBjcmVhdGUgbmV3IG5vZGUgaWYgdGhlcmUgYXJlIG5vIGluYWN0aXZlc1xuICAgICAgdmFyIG5ld05vZGU7XG4gICAgICBpZiAoc2VsZi5fd2ViQXVkaW8pIHtcbiAgICAgICAgbmV3Tm9kZSA9IHNlbGYuX3NldHVwQXVkaW9Ob2RlKCk7XG4gICAgICAgIGNhbGxiYWNrKG5ld05vZGUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2VsZi5sb2FkKCk7XG4gICAgICAgIG5ld05vZGUgPSBzZWxmLl9hdWRpb05vZGVbc2VsZi5fYXVkaW9Ob2RlLmxlbmd0aCAtIDFdO1xuXG4gICAgICAgIC8vIGxpc3RlbiBmb3IgdGhlIGNvcnJlY3QgbG9hZCBldmVudCBhbmQgZmlyZSB0aGUgY2FsbGJhY2tcbiAgICAgICAgdmFyIGxpc3RlbmVyRXZlbnQgPSBuYXZpZ2F0b3IuaXNDb2Nvb25KUyA/ICdjYW5wbGF5dGhyb3VnaCcgOiAnbG9hZGVkbWV0YWRhdGEnO1xuICAgICAgICB2YXIgbGlzdGVuZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBuZXdOb2RlLnJlbW92ZUV2ZW50TGlzdGVuZXIobGlzdGVuZXJFdmVudCwgbGlzdGVuZXIsIGZhbHNlKTtcbiAgICAgICAgICBjYWxsYmFjayhuZXdOb2RlKTtcbiAgICAgICAgfTtcbiAgICAgICAgbmV3Tm9kZS5hZGRFdmVudExpc3RlbmVyKGxpc3RlbmVyRXZlbnQsIGxpc3RlbmVyLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIElmIHRoZXJlIGFyZSBtb3JlIHRoYW4gNSBpbmFjdGl2ZSBhdWRpbyBub2RlcyBpbiB0aGUgcG9vbCwgY2xlYXIgb3V0IHRoZSByZXN0LlxuICAgICAqL1xuICAgIF9kcmFpblBvb2w6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBpbmFjdGl2ZSA9IDAsXG4gICAgICAgIGk7XG5cbiAgICAgIC8vIGNvdW50IHRoZSBudW1iZXIgb2YgaW5hY3RpdmUgbm9kZXNcbiAgICAgIGZvciAoaT0wOyBpPHNlbGYuX2F1ZGlvTm9kZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoc2VsZi5fYXVkaW9Ob2RlW2ldLnBhdXNlZCkge1xuICAgICAgICAgIGluYWN0aXZlKys7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gcmVtb3ZlIGV4Y2VzcyBpbmFjdGl2ZSBub2Rlc1xuICAgICAgZm9yIChpPXNlbGYuX2F1ZGlvTm9kZS5sZW5ndGgtMTsgaT49MDsgaS0tKSB7XG4gICAgICAgIGlmIChpbmFjdGl2ZSA8PSA1KSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2VsZi5fYXVkaW9Ob2RlW2ldLnBhdXNlZCkge1xuICAgICAgICAgIC8vIGRpc2Nvbm5lY3QgdGhlIGF1ZGlvIHNvdXJjZSBpZiB1c2luZyBXZWIgQXVkaW9cbiAgICAgICAgICBpZiAoc2VsZi5fd2ViQXVkaW8pIHtcbiAgICAgICAgICAgIHNlbGYuX2F1ZGlvTm9kZVtpXS5kaXNjb25uZWN0KDApO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGluYWN0aXZlLS07XG4gICAgICAgICAgc2VsZi5fYXVkaW9Ob2RlLnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBDbGVhciAnb25lbmQnIHRpbWVvdXQgYmVmb3JlIGl0IGVuZHMuXG4gICAgICogQHBhcmFtICB7U3RyaW5nfSBzb3VuZElkICBUaGUgcGxheSBpbnN0YW5jZSBJRC5cbiAgICAgKi9cbiAgICBfY2xlYXJFbmRUaW1lcjogZnVuY3Rpb24oc291bmRJZCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBpbmRleCA9IC0xO1xuXG4gICAgICAvLyBsb29wIHRocm91Z2ggdGhlIHRpbWVycyB0byBmaW5kIHRoZSBvbmUgYXNzb2NpYXRlZCB3aXRoIHRoaXMgc291bmRcbiAgICAgIGZvciAodmFyIGk9MDsgaTxzZWxmLl9vbmVuZFRpbWVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChzZWxmLl9vbmVuZFRpbWVyW2ldLmlkID09PSBzb3VuZElkKSB7XG4gICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciB0aW1lciA9IHNlbGYuX29uZW5kVGltZXJbaW5kZXhdO1xuICAgICAgaWYgKHRpbWVyKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lci50aW1lcik7XG4gICAgICAgIHNlbGYuX29uZW5kVGltZXIuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogU2V0dXAgdGhlIGdhaW4gbm9kZSBhbmQgcGFubmVyIGZvciBhIFdlYiBBdWRpbyBpbnN0YW5jZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBuZXcgYXVkaW8gbm9kZS5cbiAgICAgKi9cbiAgICBfc2V0dXBBdWRpb05vZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBub2RlID0gc2VsZi5fYXVkaW9Ob2RlLFxuICAgICAgICBpbmRleCA9IHNlbGYuX2F1ZGlvTm9kZS5sZW5ndGg7XG5cbiAgICAgIC8vIGNyZWF0ZSBnYWluIG5vZGVcbiAgICAgIG5vZGVbaW5kZXhdID0gKHR5cGVvZiBjdHguY3JlYXRlR2FpbiA9PT0gJ3VuZGVmaW5lZCcpID8gY3R4LmNyZWF0ZUdhaW5Ob2RlKCkgOiBjdHguY3JlYXRlR2FpbigpO1xuICAgICAgbm9kZVtpbmRleF0uZ2Fpbi52YWx1ZSA9IHNlbGYuX3ZvbHVtZTtcbiAgICAgIG5vZGVbaW5kZXhdLnBhdXNlZCA9IHRydWU7XG4gICAgICBub2RlW2luZGV4XS5fcG9zID0gMDtcbiAgICAgIG5vZGVbaW5kZXhdLnJlYWR5U3RhdGUgPSA0O1xuICAgICAgbm9kZVtpbmRleF0uY29ubmVjdChtYXN0ZXJHYWluKTtcblxuICAgICAgLy8gY3JlYXRlIHRoZSBwYW5uZXJcbiAgICAgIG5vZGVbaW5kZXhdLnBhbm5lciA9IGN0eC5jcmVhdGVQYW5uZXIoKTtcbiAgICAgIG5vZGVbaW5kZXhdLnBhbm5lci5wYW5uaW5nTW9kZWwgPSBzZWxmLl9tb2RlbCB8fCAnZXF1YWxwb3dlcic7XG4gICAgICBub2RlW2luZGV4XS5wYW5uZXIuc2V0UG9zaXRpb24oc2VsZi5fcG9zM2RbMF0sIHNlbGYuX3BvczNkWzFdLCBzZWxmLl9wb3MzZFsyXSk7XG4gICAgICBub2RlW2luZGV4XS5wYW5uZXIuY29ubmVjdChub2RlW2luZGV4XSk7XG5cbiAgICAgIHJldHVybiBub2RlW2luZGV4XTtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogQ2FsbC9zZXQgY3VzdG9tIGV2ZW50cy5cbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgZXZlbnQgRXZlbnQgdHlwZS5cbiAgICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm4gICAgRnVuY3Rpb24gdG8gY2FsbC5cbiAgICAgKiBAcmV0dXJuIHtIb3dsfVxuICAgICAqL1xuICAgIG9uOiBmdW5jdGlvbihldmVudCwgZm4pIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgZXZlbnRzID0gc2VsZlsnX29uJyArIGV2ZW50XTtcblxuICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBldmVudHMucHVzaChmbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8ZXZlbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGZuKSB7XG4gICAgICAgICAgICBldmVudHNbaV0uY2FsbChzZWxmLCBmbik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGV2ZW50c1tpXS5jYWxsKHNlbGYpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gc2VsZjtcbiAgICB9LFxuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlIGEgY3VzdG9tIGV2ZW50LlxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gICBldmVudCBFdmVudCB0eXBlLlxuICAgICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmbiAgICBMaXN0ZW5lciB0byByZW1vdmUuXG4gICAgICogQHJldHVybiB7SG93bH1cbiAgICAgKi9cbiAgICBvZmY6IGZ1bmN0aW9uKGV2ZW50LCBmbikge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzLFxuICAgICAgICBldmVudHMgPSBzZWxmWydfb24nICsgZXZlbnRdO1xuXG4gICAgICBpZiAoZm4pIHtcbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGZ1bmN0aW9ucyBpbiB0aGUgZXZlbnQgZm9yIGNvbXBhcmlzb25cbiAgICAgICAgZm9yICh2YXIgaT0wOyBpPGV2ZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChmbiA9PT0gZXZlbnRzW2ldKSB7XG4gICAgICAgICAgICBldmVudHMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZWxmWydfb24nICsgZXZlbnRdID0gW107XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBzZWxmO1xuICAgIH0sXG5cbiAgICAvKipcbiAgICAgKiBVbmxvYWQgYW5kIGRlc3Ryb3kgdGhlIGN1cnJlbnQgSG93bCBvYmplY3QuXG4gICAgICogVGhpcyB3aWxsIGltbWVkaWF0ZWx5IHN0b3AgYWxsIHBsYXkgaW5zdGFuY2VzIGF0dGFjaGVkIHRvIHRoaXMgc291bmQuXG4gICAgICovXG4gICAgdW5sb2FkOiBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgICAgLy8gc3RvcCBwbGF5aW5nIGFueSBhY3RpdmUgbm9kZXNcbiAgICAgIHZhciBub2RlcyA9IHNlbGYuX2F1ZGlvTm9kZTtcbiAgICAgIGZvciAodmFyIGk9MDsgaTxzZWxmLl9hdWRpb05vZGUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgLy8gc3RvcCB0aGUgc291bmQgaWYgaXQgaXMgY3VycmVudGx5IHBsYXlpbmdcbiAgICAgICAgaWYgKCFub2Rlc1tpXS5wYXVzZWQpIHtcbiAgICAgICAgICBzZWxmLnN0b3Aobm9kZXNbaV0uaWQpO1xuICAgICAgICAgIHNlbGYub24oJ2VuZCcsIG5vZGVzW2ldLmlkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghc2VsZi5fd2ViQXVkaW8pIHtcbiAgICAgICAgICAvLyByZW1vdmUgdGhlIHNvdXJjZSBpZiB1c2luZyBIVE1MNSBBdWRpb1xuICAgICAgICAgIG5vZGVzW2ldLnNyYyA9ICcnO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGRpc2Nvbm5lY3QgdGhlIG91dHB1dCBmcm9tIHRoZSBtYXN0ZXIgZ2FpblxuICAgICAgICAgIG5vZGVzW2ldLmRpc2Nvbm5lY3QoMCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gbWFrZSBzdXJlIGFsbCB0aW1lb3V0cyBhcmUgY2xlYXJlZFxuICAgICAgZm9yIChpPTA7IGk8c2VsZi5fb25lbmRUaW1lci5sZW5ndGg7IGkrKykge1xuICAgICAgICBjbGVhclRpbWVvdXQoc2VsZi5fb25lbmRUaW1lcltpXS50aW1lcik7XG4gICAgICB9XG5cbiAgICAgIC8vIHJlbW92ZSB0aGUgcmVmZXJlbmNlIGluIHRoZSBnbG9iYWwgSG93bGVyIG9iamVjdFxuICAgICAgdmFyIGluZGV4ID0gSG93bGVyLl9ob3dscy5pbmRleE9mKHNlbGYpO1xuICAgICAgaWYgKGluZGV4ICE9PSBudWxsICYmIGluZGV4ID49IDApIHtcbiAgICAgICAgSG93bGVyLl9ob3dscy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuXG4gICAgICAvLyBkZWxldGUgdGhpcyBzb3VuZCBmcm9tIHRoZSBjYWNoZVxuICAgICAgZGVsZXRlIGNhY2hlW3NlbGYuX3NyY107XG4gICAgICBzZWxmID0gbnVsbDtcbiAgICB9XG5cbiAgfTtcblxuICAvLyBvbmx5IGRlZmluZSB0aGVzZSBmdW5jdGlvbnMgd2hlbiB1c2luZyBXZWJBdWRpb1xuICBpZiAodXNpbmdXZWJBdWRpbykge1xuXG4gICAgLyoqXG4gICAgICogQnVmZmVyIGEgc291bmQgZnJvbSBVUkwgKG9yIGZyb20gY2FjaGUpIGFuZCBkZWNvZGUgdG8gYXVkaW8gc291cmNlIChXZWIgQXVkaW8gQVBJKS5cbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IG9iaiBUaGUgSG93bCBvYmplY3QgZm9yIHRoZSBzb3VuZCB0byBsb2FkLlxuICAgICAqIEBwYXJhbSAge1N0cmluZ30gdXJsIFRoZSBwYXRoIHRvIHRoZSBzb3VuZCBmaWxlLlxuICAgICAqL1xuICAgIHZhciBsb2FkQnVmZmVyID0gZnVuY3Rpb24ob2JqLCB1cmwpIHtcbiAgICAgIC8vIGNoZWNrIGlmIHRoZSBidWZmZXIgaGFzIGFscmVhZHkgYmVlbiBjYWNoZWRcbiAgICAgIGlmICh1cmwgaW4gY2FjaGUpIHtcbiAgICAgICAgLy8gc2V0IHRoZSBkdXJhdGlvbiBmcm9tIHRoZSBjYWNoZVxuICAgICAgICBvYmouX2R1cmF0aW9uID0gY2FjaGVbdXJsXS5kdXJhdGlvbjtcblxuICAgICAgICAvLyBsb2FkIHRoZSBzb3VuZCBpbnRvIHRoaXMgb2JqZWN0XG4gICAgICAgIGxvYWRTb3VuZChvYmopO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmICgvXmRhdGE6W147XSs7YmFzZTY0LC8udGVzdCh1cmwpKSB7XG4gICAgICAgIC8vIERlY29kZSBiYXNlNjQgZGF0YS1VUklzIGJlY2F1c2Ugc29tZSBicm93c2VycyBjYW5ub3QgbG9hZCBkYXRhLVVSSXMgd2l0aCBYTUxIdHRwUmVxdWVzdC5cbiAgICAgICAgdmFyIGRhdGEgPSBhdG9iKHVybC5zcGxpdCgnLCcpWzFdKTtcbiAgICAgICAgdmFyIGRhdGFWaWV3ID0gbmV3IFVpbnQ4QXJyYXkoZGF0YS5sZW5ndGgpO1xuICAgICAgICBmb3IgKHZhciBpPTA7IGk8ZGF0YS5sZW5ndGg7ICsraSkge1xuICAgICAgICAgIGRhdGFWaWV3W2ldID0gZGF0YS5jaGFyQ29kZUF0KGkpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBkZWNvZGVBdWRpb0RhdGEoZGF0YVZpZXcuYnVmZmVyLCBvYmosIHVybCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBsb2FkIHRoZSBidWZmZXIgZnJvbSB0aGUgVVJMXG4gICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHVybCwgdHJ1ZSk7XG4gICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgZGVjb2RlQXVkaW9EYXRhKHhoci5yZXNwb25zZSwgb2JqLCB1cmwpO1xuICAgICAgICB9O1xuICAgICAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIC8vIGlmIHRoZXJlIGlzIGFuIGVycm9yLCBzd2l0Y2ggdGhlIHNvdW5kIHRvIEhUTUwgQXVkaW9cbiAgICAgICAgICBpZiAob2JqLl93ZWJBdWRpbykge1xuICAgICAgICAgICAgb2JqLl9idWZmZXIgPSB0cnVlO1xuICAgICAgICAgICAgb2JqLl93ZWJBdWRpbyA9IGZhbHNlO1xuICAgICAgICAgICAgb2JqLl9hdWRpb05vZGUgPSBbXTtcbiAgICAgICAgICAgIGRlbGV0ZSBvYmouX2dhaW5Ob2RlO1xuICAgICAgICAgICAgZGVsZXRlIGNhY2hlW3VybF07XG4gICAgICAgICAgICBvYmoubG9hZCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB4aHIuc2VuZCgpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgeGhyLm9uZXJyb3IoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBEZWNvZGUgYXVkaW8gZGF0YSBmcm9tIGFuIGFycmF5IGJ1ZmZlci5cbiAgICAgKiBAcGFyYW0gIHtBcnJheUJ1ZmZlcn0gYXJyYXlidWZmZXIgVGhlIGF1ZGlvIGRhdGEuXG4gICAgICogQHBhcmFtICB7T2JqZWN0fSBvYmogVGhlIEhvd2wgb2JqZWN0IGZvciB0aGUgc291bmQgdG8gbG9hZC5cbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IHVybCBUaGUgcGF0aCB0byB0aGUgc291bmQgZmlsZS5cbiAgICAgKi9cbiAgICB2YXIgZGVjb2RlQXVkaW9EYXRhID0gZnVuY3Rpb24oYXJyYXlidWZmZXIsIG9iaiwgdXJsKSB7XG4gICAgICAvLyBkZWNvZGUgdGhlIGJ1ZmZlciBpbnRvIGFuIGF1ZGlvIHNvdXJjZVxuICAgICAgY3R4LmRlY29kZUF1ZGlvRGF0YShcbiAgICAgICAgYXJyYXlidWZmZXIsXG4gICAgICAgIGZ1bmN0aW9uKGJ1ZmZlcikge1xuICAgICAgICAgIGlmIChidWZmZXIpIHtcbiAgICAgICAgICAgIGNhY2hlW3VybF0gPSBidWZmZXI7XG4gICAgICAgICAgICBsb2FkU291bmQob2JqLCBidWZmZXIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgb2JqLm9uKCdsb2FkZXJyb3InLCBlcnIpO1xuICAgICAgICB9XG4gICAgICApO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGaW5pc2hlcyBsb2FkaW5nIHRoZSBXZWIgQXVkaW8gQVBJIHNvdW5kIGFuZCBmaXJlcyB0aGUgbG9hZGVkIGV2ZW50XG4gICAgICogQHBhcmFtICB7T2JqZWN0fSAgb2JqICAgIFRoZSBIb3dsIG9iamVjdCBmb3IgdGhlIHNvdW5kIHRvIGxvYWQuXG4gICAgICogQHBhcmFtICB7T2JqZWNjdH0gYnVmZmVyIFRoZSBkZWNvZGVkIGJ1ZmZlciBzb3VuZCBzb3VyY2UuXG4gICAgICovXG4gICAgdmFyIGxvYWRTb3VuZCA9IGZ1bmN0aW9uKG9iaiwgYnVmZmVyKSB7XG4gICAgICAvLyBzZXQgdGhlIGR1cmF0aW9uXG4gICAgICBvYmouX2R1cmF0aW9uID0gKGJ1ZmZlcikgPyBidWZmZXIuZHVyYXRpb24gOiBvYmouX2R1cmF0aW9uO1xuXG4gICAgICAvLyBzZXR1cCBhIHNwcml0ZSBpZiBub25lIGlzIGRlZmluZWRcbiAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhvYmouX3Nwcml0ZSkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIG9iai5fc3ByaXRlID0ge19kZWZhdWx0OiBbMCwgb2JqLl9kdXJhdGlvbiAqIDEwMDBdfTtcbiAgICAgIH1cblxuICAgICAgLy8gZmlyZSB0aGUgbG9hZGVkIGV2ZW50XG4gICAgICBpZiAoIW9iai5fbG9hZGVkKSB7XG4gICAgICAgIG9iai5fbG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgb2JqLm9uKCdsb2FkJyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmouX2F1dG9wbGF5KSB7XG4gICAgICAgIG9iai5wbGF5KCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIExvYWQgdGhlIHNvdW5kIGJhY2sgaW50byB0aGUgYnVmZmVyIHNvdXJjZS5cbiAgICAgKiBAcGFyYW0gIHtPYmplY3R9IG9iaiAgIFRoZSBzb3VuZCB0byBsb2FkLlxuICAgICAqIEBwYXJhbSAge0FycmF5fSAgbG9vcCAgTG9vcCBib29sZWFuLCBwb3MsIGFuZCBkdXJhdGlvbi5cbiAgICAgKiBAcGFyYW0gIHtTdHJpbmd9IGlkICAgIChvcHRpb25hbCkgVGhlIHBsYXkgaW5zdGFuY2UgSUQuXG4gICAgICovXG4gICAgdmFyIHJlZnJlc2hCdWZmZXIgPSBmdW5jdGlvbihvYmosIGxvb3AsIGlkKSB7XG4gICAgICAvLyBkZXRlcm1pbmUgd2hpY2ggbm9kZSB0byBjb25uZWN0IHRvXG4gICAgICB2YXIgbm9kZSA9IG9iai5fbm9kZUJ5SWQoaWQpO1xuXG4gICAgICAvLyBzZXR1cCB0aGUgYnVmZmVyIHNvdXJjZSBmb3IgcGxheWJhY2tcbiAgICAgIG5vZGUuYnVmZmVyU291cmNlID0gY3R4LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgICAgbm9kZS5idWZmZXJTb3VyY2UuYnVmZmVyID0gY2FjaGVbb2JqLl9zcmNdO1xuICAgICAgbm9kZS5idWZmZXJTb3VyY2UuY29ubmVjdChub2RlLnBhbm5lcik7XG4gICAgICBub2RlLmJ1ZmZlclNvdXJjZS5sb29wID0gbG9vcFswXTtcbiAgICAgIGlmIChsb29wWzBdKSB7XG4gICAgICAgIG5vZGUuYnVmZmVyU291cmNlLmxvb3BTdGFydCA9IGxvb3BbMV07XG4gICAgICAgIG5vZGUuYnVmZmVyU291cmNlLmxvb3BFbmQgPSBsb29wWzFdICsgbG9vcFsyXTtcbiAgICAgIH1cbiAgICAgIG5vZGUuYnVmZmVyU291cmNlLnBsYXliYWNrUmF0ZS52YWx1ZSA9IG9iai5fcmF0ZTtcbiAgICB9O1xuXG4gIH1cblxuICAvKipcbiAgICogQWRkIHN1cHBvcnQgZm9yIEFNRCAoQXN5bmNocm9ub3VzIE1vZHVsZSBEZWZpbml0aW9uKSBsaWJyYXJpZXMgc3VjaCBhcyByZXF1aXJlLmpzLlxuICAgKi9cbiAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgIGRlZmluZShmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIEhvd2xlcjogSG93bGVyLFxuICAgICAgICBIb3dsOiBIb3dsXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBzdXBwb3J0IGZvciBDb21tb25KUyBsaWJyYXJpZXMgc3VjaCBhcyBicm93c2VyaWZ5LlxuICAgKi9cbiAgaWYgKHR5cGVvZiBleHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIGV4cG9ydHMuSG93bGVyID0gSG93bGVyO1xuICAgIGV4cG9ydHMuSG93bCA9IEhvd2w7XG4gIH1cblxuICAvLyBkZWZpbmUgZ2xvYmFsbHkgaW4gY2FzZSBBTUQgaXMgbm90IGF2YWlsYWJsZSBvciBhdmFpbGFibGUgYnV0IG5vdCB1c2VkXG5cbiAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgd2luZG93Lkhvd2xlciA9IEhvd2xlcjtcbiAgICB3aW5kb3cuSG93bCA9IEhvd2w7XG4gIH1cblxufSkoKTtcbiIsIi8vXG4vLyBBIHNpbXBsZSBkaWN0aW9uYXJ5IHByb3RvdHlwZSBmb3IgSmF2YVNjcmlwdCwgYXZvaWRpbmcgY29tbW9uIG9iamVjdCBwaXRmYWxsc1xuLy8gYW5kIG9mZmVyaW5nIHNvbWUgaGFuZHkgY29udmVuaWVuY2UgbWV0aG9kcy5cbi8vXG5cbi8qIGdsb2JhbCBtb2R1bGUsIHJlcXVpcmUsIHdpbmRvdyAqL1xuXG52YXIgcHJlZml4ID0gXCJzdHJpbmctZGljdF9cIjtcblxuZnVuY3Rpb24gbWFrZUtleSAoaykge1xuICAgIHJldHVybiBwcmVmaXggKyBrO1xufVxuXG5mdW5jdGlvbiByZXZva2VLZXkgKGspIHtcbiAgICByZXR1cm4gay5yZXBsYWNlKG5ldyBSZWdFeHAocHJlZml4KSwgXCJcIik7XG59XG5cbmZ1bmN0aW9uIERpY3QgKGNvbnRlbnQpIHtcbiAgICBcbiAgICB2YXIga2V5O1xuICAgIFxuICAgIHRoaXMuY2xlYXIoKTtcbiAgICBcbiAgICBpZiAoY29udGVudCkge1xuICAgICAgICBmb3IgKGtleSBpbiBjb250ZW50KSB7XG4gICAgICAgICAgICB0aGlzLnNldChrZXksIGNvbnRlbnRba2V5XSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkRpY3QucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuaXRlbXMgPSB7fTtcbiAgICB0aGlzLmNvdW50ID0gMDtcbn07XG5cbkRpY3QucHJvdG90eXBlLmxlbmd0aCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5jb3VudDtcbn07XG5cbkRpY3QucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChrLCB2YWx1ZSkge1xuICAgIFxuICAgIHZhciBrZXkgPSBtYWtlS2V5KGspO1xuICAgIFxuICAgIGlmICghaykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJEaWN0aW9uYXJ5IGtleXMgY2Fubm90IGJlIGZhbHN5LlwiKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMuaGFzKGtleSkpIHtcbiAgICAgICAgdGhpcy5yZW1vdmUoa2V5KTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5pdGVtc1trZXldID0gdmFsdWU7XG4gICAgdGhpcy5jb3VudCArPSAxO1xuICAgIFxuICAgIHJldHVybiB0aGlzO1xufTtcblxuRGljdC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGspIHtcbiAgICBcbiAgICB2YXIga2V5ID0gbWFrZUtleShrKTtcbiAgICBcbiAgICBpZiAoIXRoaXMuaXRlbXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gdGhpcy5pdGVtc1trZXldO1xufTtcblxuLy9cbi8vIFRoZSBzYW1lIGFzIC5nZXQoKSwgYnV0IHRocm93cyB3aGVuIHRoZSBrZXkgZG9lc24ndCBleGlzdC5cbi8vIFRoaXMgY2FuIGJlIHVzZWZ1bCBpZiB5b3Ugd2FudCB0byB1c2UgYSBkaWN0IGFzIHNvbWUgc29ydCBvZiByZWdpc3RyeS5cbi8vXG5EaWN0LnByb3RvdHlwZS5yZXF1aXJlID0gZnVuY3Rpb24gKGtleSkge1xuICAgIFxuICAgIGlmICghdGhpcy5oYXMoa2V5KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJSZXF1aXJlZCBrZXkgJ1wiICsga2V5ICsgXCInIGRvZXMgbm90IGV4aXN0LlwiKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHRoaXMuZ2V0KGtleSk7XG59O1xuXG5EaWN0LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiAoaykge1xuICAgIFxuICAgIHZhciBrZXkgPSBtYWtlS2V5KGspO1xuICAgIFxuICAgIGlmICh0aGlzLmhhcyhrKSkge1xuICAgICAgICBkZWxldGUgdGhpcy5pdGVtc1trZXldO1xuICAgICAgICB0aGlzLmNvdW50IC09IDE7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB0aGlzO1xufTtcblxuRGljdC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gKGspIHtcbiAgICBcbiAgICB2YXIga2V5ID0gbWFrZUtleShrKTtcbiAgICBcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5oYXNPd25Qcm9wZXJ0eShrZXkpO1xufTtcblxuRGljdC5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uIChmbikge1xuICAgIFxuICAgIGlmICghZm4gfHwgdHlwZW9mIGZuICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQXJndW1lbnQgMSBpcyBleHBlY3RlZCB0byBiZSBvZiB0eXBlIGZ1bmN0aW9uLlwiKTtcbiAgICB9XG4gICAgXG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMuaXRlbXMpIHtcbiAgICAgICAgZm4odGhpcy5pdGVtc1trZXldLCByZXZva2VLZXkoa2V5KSwgdGhpcyk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB0aGlzO1xufTtcblxuRGljdC5wcm90b3R5cGUuZmlsdGVyID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgXG4gICAgdmFyIG1hdGNoZXMgPSBuZXcgRGljdCgpO1xuICAgIFxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwga2V5LCBhbGwpIHtcbiAgICAgICAgaWYgKGZuKGl0ZW0sIGtleSwgYWxsKSkge1xuICAgICAgICAgICAgbWF0Y2hlcy5zZXQoa2V5LCBpdGVtKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiBtYXRjaGVzO1xufTtcblxuRGljdC5wcm90b3R5cGUuZmluZCA9IGZ1bmN0aW9uIChmbikge1xuICAgIFxuICAgIHZhciB2YWx1ZTtcbiAgICBcbiAgICB0aGlzLnNvbWUoZnVuY3Rpb24gKGl0ZW0sIGtleSwgYWxsKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAoZm4oaXRlbSwga2V5LCBhbGwpKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGl0ZW07XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiB2YWx1ZTtcbn07XG5cbkRpY3QucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uIChmbikge1xuICAgIFxuICAgIHZhciBtYXBwZWQgPSBuZXcgRGljdCgpO1xuICAgIFxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwga2V5LCBhbGwpIHtcbiAgICAgICAgbWFwcGVkLnNldChrZXksIGZuKGl0ZW0sIGtleSwgYWxsKSk7XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIG1hcHBlZDtcbn07XG5cbkRpY3QucHJvdG90eXBlLnJlZHVjZSA9IGZ1bmN0aW9uIChmbiwgaW5pdGlhbFZhbHVlKSB7XG4gICAgXG4gICAgdmFyIHJlc3VsdCA9IGluaXRpYWxWYWx1ZTtcbiAgICBcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGtleSwgYWxsKSB7XG4gICAgICAgIHJlc3VsdCA9IGZuKHJlc3VsdCwgaXRlbSwga2V5LCBhbGwpO1xuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiByZXN1bHQ7XG59O1xuXG5EaWN0LnByb3RvdHlwZS5ldmVyeSA9IGZ1bmN0aW9uIChmbikge1xuICAgIHJldHVybiB0aGlzLnJlZHVjZShmdW5jdGlvbiAobGFzdCwgaXRlbSwga2V5LCBhbGwpIHtcbiAgICAgICAgcmV0dXJuIGxhc3QgJiYgZm4oaXRlbSwga2V5LCBhbGwpO1xuICAgIH0sIHRydWUpO1xufTtcblxuRGljdC5wcm90b3R5cGUuc29tZSA9IGZ1bmN0aW9uIChmbikge1xuICAgIFxuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLml0ZW1zKSB7XG4gICAgICAgIGlmIChmbih0aGlzLml0ZW1zW2tleV0sIHJldm9rZUtleShrZXkpLCB0aGlzKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIGZhbHNlO1xufTtcblxuLy9cbi8vIFJldHVybnMgYW4gYXJyYXkgY29udGFpbmluZyB0aGUgZGljdGlvbmFyeSdzIGtleXMuXG4vL1xuRGljdC5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIga2V5cyA9IFtdO1xuICAgIFxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG4gICAgICAgIGtleXMucHVzaChrZXkpO1xuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiBrZXlzO1xufTtcblxuLy9cbi8vIFJldHVybnMgdGhlIGRpY3Rpb25hcnkncyB2YWx1ZXMgaW4gYW4gYXJyYXkuXG4vL1xuRGljdC5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIHZhbHVlcyA9IFtdO1xuICAgIFxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICB2YWx1ZXMucHVzaChpdGVtKTtcbiAgICB9KTtcbiAgICBcbiAgICByZXR1cm4gdmFsdWVzO1xufTtcblxuLy9cbi8vIENyZWF0ZXMgYSBub3JtYWwgSlMgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGNvbnRlbnRzIG9mIHRoZSBkaWN0aW9uYXJ5LlxuLy9cbkRpY3QucHJvdG90eXBlLnRvT2JqZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciBqc09iamVjdCA9IHt9O1xuICAgIFxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSwga2V5KSB7XG4gICAgICAgIGpzT2JqZWN0W2tleV0gPSBpdGVtO1xuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiBqc09iamVjdDtcbn07XG5cbi8vXG4vLyBDcmVhdGVzIGFub3RoZXIgZGljdGlvbmFyeSB3aXRoIHRoZSBzYW1lIGNvbnRlbnRzIGFzIHRoaXMgb25lLlxuLy9cbkRpY3QucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciBjbG9uZSA9IG5ldyBEaWN0KCk7XG4gICAgXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtLCBrZXkpIHtcbiAgICAgICAgY2xvbmUuc2V0KGtleSwgaXRlbSk7XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIGNsb25lO1xufTtcblxuLy9cbi8vIEFkZHMgdGhlIGNvbnRlbnQgb2YgYW5vdGhlciBkaWN0aW9uYXJ5IHRvIHRoaXMgZGljdGlvbmFyeSdzIGNvbnRlbnQuXG4vL1xuRGljdC5wcm90b3R5cGUuYWRkTWFwID0gZnVuY3Rpb24gKG90aGVyTWFwKSB7XG4gICAgXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIFxuICAgIG90aGVyTWFwLmZvckVhY2goZnVuY3Rpb24gKGl0ZW0sIGtleSkge1xuICAgICAgICBzZWxmLnNldChrZXksIGl0ZW0pO1xuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiB0aGlzO1xufTtcblxuLy9cbi8vIFJldHVybnMgYSBuZXcgbWFwIHdoaWNoIGlzIHRoZSByZXN1bHQgb2Ygam9pbmluZyB0aGlzIG1hcFxuLy8gd2l0aCBhbm90aGVyIG1hcC4gVGhpcyBtYXAgaXNuJ3QgY2hhbmdlZCBpbiB0aGUgcHJvY2Vzcy5cbi8vIFRoZSBrZXlzIGZyb20gb3RoZXJNYXAgd2lsbCByZXBsYWNlIGFueSBrZXlzIGZyb20gdGhpcyBtYXAgdGhhdFxuLy8gYXJlIHRoZSBzYW1lLlxuLy9cbkRpY3QucHJvdG90eXBlLmpvaW4gPSBmdW5jdGlvbiAob3RoZXJNYXApIHtcbiAgICByZXR1cm4gdGhpcy5jbG9uZSgpLmFkZE1hcChvdGhlck1hcCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IERpY3Q7XG4iLCIvKiBnbG9iYWwgcmVxdWVzdEFuaW1hdGlvbkZyYW1lICovXG5cbnZhciBlYXNlcyA9IHJlcXVpcmUoXCJlYXNlc1wiKTtcblxuaWYgKHR5cGVvZiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDEwMDAgLyA2MCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiB0cmFuc2Zvcm1hdGlvbiAoZnJvbSwgdG8sIGNhbGxiYWNrLCBhcmdzLCBhZnRlcikge1xuICAgIFxuICAgIHZhciBkdXIsIGVhc2luZywgY3YsIGRpZmYsIGMsIGxhc3RFeGVjdXRpb24sIGZwcztcbiAgICB2YXIgY2FuY2VsZWQsIHBhdXNlZCwgcnVubmluZywgc3RvcHBlZDtcbiAgICB2YXIgdGltZUVsYXBzZWQsIHN0YXJ0VGltZSwgcGF1c2VUaW1lRWxhcHNlZCwgcGF1c2VTdGFydFRpbWU7XG4gICAgXG4gICAgYXJncyA9IGFyZ3MgfHwge307XG4gICAgXG4gICAgaWYgKHR5cGVvZiBhcmdzID09PSBcImZ1bmN0aW9uXCIgJiYgIWFmdGVyKSB7XG4gICAgICAgIGFmdGVyID0gYXJncztcbiAgICAgICAgYXJncyA9IHt9O1xuICAgIH1cbiAgICBcbiAgICBhZnRlciA9IHR5cGVvZiBhZnRlciA9PT0gXCJmdW5jdGlvblwiID8gYWZ0ZXIgOiBmdW5jdGlvbiAoKSB7fTtcbiAgICBcbiAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSBcInVuZGVmaW5lZFwiIHx8ICFjYWxsYmFjaykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJBcmd1bWVudCBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb24uXCIpO1xuICAgIH1cbiAgICBcbiAgICBpbml0KCk7XG4gICAgXG4gICAgZnVuY3Rpb24gaW5pdCAoKSB7XG4gICAgICAgIFxuICAgICAgICBkdXIgPSB0eXBlb2YgYXJncy5kdXJhdGlvbiAhPT0gXCJ1bmRlZmluZWRcIiAmJiBhcmdzLmR1cmF0aW9uID49IDAgPyBhcmdzLmR1cmF0aW9uIDogNTAwO1xuICAgICAgICBjdiA9IGZyb207XG4gICAgICAgIGRpZmYgPSB0byAtIGZyb207XG4gICAgICAgIGMgPSAwLCAvLyBudW1iZXIgb2YgdGltZXMgbG9vcCBnZXQncyBleGVjdXRlZFxuICAgICAgICBsYXN0RXhlY3V0aW9uID0gMDtcbiAgICAgICAgZnBzID0gYXJncy5mcHMgfHwgNjA7XG4gICAgICAgIGNhbmNlbGVkID0gZmFsc2U7XG4gICAgICAgIHBhdXNlZCA9IGZhbHNlO1xuICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHN0b3BwZWQgPSBmYWxzZTtcbiAgICAgICAgdGltZUVsYXBzZWQgPSAwO1xuICAgICAgICBzdGFydFRpbWUgPSAwO1xuICAgICAgICBwYXVzZVRpbWVFbGFwc2VkID0gMDtcbiAgICAgICAgcGF1c2VTdGFydFRpbWUgPSAwO1xuICAgICAgICBlYXNpbmcgPSBlYXNlcy5saW5lYXI7XG4gICAgICAgIFxuICAgICAgICBpZiAoYXJncy5lYXNpbmcpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgYXJncy5lYXNpbmcgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIGVhc2luZyA9IGFyZ3MuZWFzaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZWFzaW5nID0gZWFzZXNbYXJncy5lYXNpbmddO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGZ1bmN0aW9uIGxvb3AgKCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIGR0LCB0RWxhcHNlZDtcbiAgICAgICAgXG4gICAgICAgIGlmICghcnVubmluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoKERhdGUubm93KCkgLSBsYXN0RXhlY3V0aW9uKSA+ICgxMDAwIC8gZnBzKSkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoY2FuY2VsZWQgfHwgcGF1c2VkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjICs9IDE7XG4gICAgICAgICAgICB0RWxhcHNlZCA9IGVsYXBzZWQoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHRFbGFwc2VkID4gZHVyIHx8IHN0b3BwZWQpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjdiA9IGZyb20gKyBkaWZmO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICghc3RvcHBlZCkge1xuICAgICAgICAgICAgICAgICAgICBzdG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY3YgPSBlYXNpbmcodEVsYXBzZWQgLyBkdXIpICogZGlmZiArIGZyb207XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNhbGxiYWNrKGN2KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZHQgPSBlbGFwc2VkKCkgLSB0RWxhcHNlZDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGFzdEV4ZWN1dGlvbiA9IERhdGUubm93KCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICB9O1xuICAgIFxuICAgIGZ1bmN0aW9uIGVsYXBzZWQgKCkge1xuICAgICAgICBcbiAgICAgICAgaWYgKHJ1bm5pbmcgJiYgIXBhdXNlZCkge1xuICAgICAgICAgICAgdGltZUVsYXBzZWQgPSAoKCsobmV3IERhdGUoKSkgLSBzdGFydFRpbWUpIC0gcGF1c2VUaW1lRWxhcHNlZCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0aW1lRWxhcHNlZDtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gc3RhcnQgKCkge1xuICAgICAgICBcbiAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgXG4gICAgICAgIHN0YXJ0VGltZSA9ICsobmV3IERhdGUoKSk7XG4gICAgICAgIHBhdXNlU3RhcnRUaW1lID0gc3RhcnRUaW1lO1xuICAgICAgICBydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gc3RvcCAoKSB7XG4gICAgICAgIFxuICAgICAgICBydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHBhdXNlZCA9IGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgY2FsbGJhY2sodG8pO1xuICAgICAgICBhZnRlcigpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiByZXN1bWUgKCkge1xuICAgICAgICBcbiAgICAgICAgaWYgKCFwYXVzZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcGF1c2VkID0gZmFsc2U7XG4gICAgICAgIHBhdXNlVGltZUVsYXBzZWQgKz0gKyhuZXcgRGF0ZSgpKSAtIHBhdXNlU3RhcnRUaW1lO1xuICAgICAgICBcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBwYXVzZSAoKSB7XG4gICAgICAgIHBhdXNlZCA9IHRydWU7XG4gICAgICAgIHBhdXNlU3RhcnRUaW1lID0gKyhuZXcgRGF0ZSgpKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gY2FuY2VsICgpIHtcbiAgICAgICAgXG4gICAgICAgIGlmICghcnVubmluZykge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBlbGFwc2VkKCk7XG4gICAgICAgIFxuICAgICAgICBjYW5jZWxlZCA9IHRydWU7XG4gICAgICAgIHJ1bm5pbmcgPSBmYWxzZTtcbiAgICAgICAgcGF1c2VkID0gZmFsc2U7XG4gICAgICAgIFxuICAgICAgICBhZnRlcigpO1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiByZXNldCAoKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAocnVubmluZykge1xuICAgICAgICAgICAgY2FuY2VsKCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGluaXQoKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgc3RhcnQ6IHN0YXJ0LFxuICAgICAgICBzdG9wOiBzdG9wLFxuICAgICAgICBwYXVzZTogcGF1c2UsXG4gICAgICAgIHJlc3VtZTogcmVzdW1lLFxuICAgICAgICBjYW5jZWw6IGNhbmNlbCxcbiAgICAgICAgZWxhcHNlZDogZWxhcHNlZCxcbiAgICAgICAgcmVzZXQ6IHJlc2V0XG4gICAgfTtcbn1cblxuZnVuY3Rpb24gdHJhbnNmb3JtICgpIHtcbiAgICBcbiAgICB2YXIgdCA9IHRyYW5zZm9ybWF0aW9uLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcbiAgICBcbiAgICB0LnN0YXJ0KCk7XG4gICAgXG4gICAgcmV0dXJuIHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIHRyYW5zZm9ybWF0aW9uOiB0cmFuc2Zvcm1hdGlvbixcbiAgICB0cmFuc2Zvcm06IHRyYW5zZm9ybVxufTtcbiIsIi8qIGdsb2JhbCBtb2R1bGUsIHJlcXVpcmUgKi9cblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi9zcmMveG11Z2x5LmpzXCIpO1xuIiwiLyogZ2xvYmFsIG1vZHVsZSAqL1xuXG4oZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIC8vXG4gICAgLy8gQ29tcGlsZXNcbiAgICAvLyAgICAgLiBzb21lX2VsZW1lbnQgYXR0cjEgdmFsMSwgYXR0cjIgdmFsMlxuICAgIC8vIHRvOlxuICAgIC8vICAgICA8c29tZV9lbGVtZW50IGF0dHIxPVwidmFsMVwiLCBhdHRyMj1cInZhbDJcIiAvPlxuICAgIC8vIGFuZFxuICAgIC8vICAgICAuIHNvbWVfZWxlbWVudCBhdHRyMSB2YWwxIDpcbiAgICAvLyAgICAgLi4uXG4gICAgLy8gICAgIC0tXG4gICAgLy8gdG9cbiAgICAvLyAgICAgPHNvbWVfZWxlbWVudCBhdHRyMT1cInZhbDFcIj5cbiAgICAvLyAgICAgLi4uXG4gICAgLy8gICAgIDwvc29tZV9lbGVtZW50PlxuICAgIC8vXG4gICAgZnVuY3Rpb24gY29tcGlsZSAodGV4dCwgZGVmYXVsdE1hY3Jvcykge1xuICAgICAgICBcbiAgICAvL1xuICAgIC8vIEEgc3RhY2sgb2YgZWxlbWVudCBuYW1lcywgc28gdGhhdCBrbm93IHdoaWNoIFwiLS1cIiBjbG9zZXMgd2hpY2ggZWxlbWVudC5cbiAgICAvL1xuICAgICAgICB2YXIgc3RhY2sgPSBbXTtcbiAgICAgICAgdmFyIGxpbmVzID0gdG9MaW5lcyh0ZXh0KTtcbiAgICAgICAgdmFyIG1hY3JvcyA9IHByb2Nlc3NNYWNyb3MobGluZXMpO1xuICAgICAgICBcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZGVmYXVsdE1hY3JvcykpIHtcbiAgICAgICAgICAgIGRlZmF1bHRNYWNyb3MuZm9yRWFjaChmdW5jdGlvbiAobWFjcm8pIHtcbiAgICAgICAgICAgICAgICBtYWNyb3MucHVzaChtYWNybyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgbGluZXMgPSByZW1vdmVNYWNyb0RlZmluaXRpb25zKGxpbmVzKTtcbiAgICAgICAgXG4gICAgICAgIGxpbmVzID0gbGluZXMubWFwKGZ1bmN0aW9uIChsaW5lLCBpKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBuYW1lLCBhdHRyaWJ1dGVzLCBwYXJ0cywgdHJpbW1lZCwgaGVhZCwgd2hpdGVzcGFjZSwgc3RyaW5ncywgcmVzdWx0LCBoYXNDb250ZW50O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0cmltbWVkID0gbGluZS50cmltKCk7XG4gICAgICAgICAgICBzdHJpbmdzID0gW107XG4gICAgICAgICAgICB3aGl0ZXNwYWNlID0gbGluZS5yZXBsYWNlKC9eKFtcXHNdKikuKiQvLCBcIiQxXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodHJpbW1lZCA9PT0gXCItLVwiKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKCFzdGFjay5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFN5bnRheEVycm9yKFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDbG9zaW5nICctLScgd2l0aG91dCBtYXRjaGluZyBvcGVuaW5nIHRhZyBvbiBsaW5lIFwiICsgKGkgKyAxKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXR1cm4gd2hpdGVzcGFjZSArICc8LycgKyBzdGFjay5wb3AoKSArICc+JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHRyaW1tZWRbMF0gIT09IFwiLlwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRyaW1tZWQgPSB0cmltbWVkLnJlcGxhY2UoL1wiKFteXCJdKylcIi9nLCBmdW5jdGlvbiAobWF0Y2gsIHAxKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgc3RyaW5ncy5wdXNoKHAxKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJ7e1wiICsgc3RyaW5ncy5sZW5ndGggKyBcIn19XCI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHRyaW1tZWRbdHJpbW1lZC5sZW5ndGggLSAxXSA9PT0gXCI6XCIpIHtcbiAgICAgICAgICAgICAgICBoYXNDb250ZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0cmltbWVkID0gdHJpbW1lZC5yZXBsYWNlKC86JC8sIFwiXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBwYXJ0cyA9IHRyaW1tZWQuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgaGVhZCA9IHBhcnRzWzBdLnNwbGl0KFwiIFwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaGVhZC5zaGlmdCgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBuYW1lID0gaGVhZFswXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGhhc0NvbnRlbnQpIHtcbiAgICAgICAgICAgICAgICBzdGFjay5wdXNoKG5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBoZWFkLnNoaWZ0KCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHBhcnRzWzBdID0gaGVhZC5qb2luKFwiIFwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYXR0cmlidXRlcyA9IFtdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBwYXJ0cy5mb3JFYWNoKGZ1bmN0aW9uIChjdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIHNwbGl0LCBuYW1lLCB2YWx1ZSwgZW5sYXJnZWQ7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgc3BsaXQgPSBub3JtYWxpemVXaGl0ZXNwYWNlKGN1cnJlbnQpLnNwbGl0KFwiIFwiKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBuYW1lID0gc3BsaXRbMF0udHJpbSgpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICghbmFtZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGVubGFyZ2VkID0gYXBwbHlNYWNyb3MobmFtZSwgbWFjcm9zKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoZW5sYXJnZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBlbmxhcmdlZC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgbmFtZSA9IGVubGFyZ2VkLm5hbWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgc3BsaXQuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gc3BsaXQuam9pbihcIiBcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXMucHVzaChuYW1lICsgJz1cIicgKyB2YWx1ZSArICdcIicpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJlc3VsdCA9IHdoaXRlc3BhY2UgKyAnPCcgKyBuYW1lICsgKGF0dHJpYnV0ZXMubGVuZ3RoID8gJyAnIDogJycpICtcbiAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzLmpvaW4oXCIgXCIpICsgKGhhc0NvbnRlbnQgPyAnPicgOiAnIC8+Jyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHN0cmluZ3MuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGkpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZShcInt7XCIgKyAoaSArIDEpICsgXCJ9fVwiLCB2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgIFxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0b1RleHQobGluZXMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHRvTGluZXMgKHRleHQpIHtcbiAgICAgICAgcmV0dXJuIHRleHQuc3BsaXQoXCJcXG5cIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdG9UZXh0IChsaW5lcykge1xuICAgICAgICByZXR1cm4gbGluZXMuam9pbihcIlxcblwiKTtcbiAgICB9XG5cbiAgICAvL1xuICAgIC8vIENyZWF0ZXMgYSByZXBsYWNlbWVudCBydWxlIGZyb20gYW4gYXR0cmlidXRlIG1hY3JvIGxpbmUuXG4gICAgLy8gQXR0cmlidXRlIG1hY3JvcyBsb29rIGxpa2UgdGhpczpcbiAgICAvL1xuICAgIC8vIH4gQCBhc3NldCBfXG4gICAgLy9cbiAgICAvLyBUaGUgfiBhdCB0aGUgc3RhcnQgb2YgYSBsaW5lIHNpZ25hbGl6ZXMgdGhhdCB0aGlzIGlzIGFuIGF0dHJpYnV0ZSBtYWNyby5cbiAgICAvLyBUaGUgZmlyc3Qgbm9uLXdoaXRlc3BhY2UgcGFydCAoQCBpbiB0aGlzIGNhc2UpIGlzIHRoZSBjaGFyYWN0ZXIgb3IgdGV4dCBwYXJ0XG4gICAgLy8gd2hpY2ggd2lsbCBiZSB1c2VkIGFzIHRoZSBtYWNybyBpZGVudGlmaWVyLlxuICAgIC8vIFRoZSBzZWNvbmQgcGFydCAoYXNzZXQgaW4gdGhpcyBjYXNlKSBpcyB0aGUgYXR0cmlidXRlIG5hbWUuXG4gICAgLy8gVGhlIHRoaXJkIGFuZCBsYXN0IHBhcnQgKF8gaGVyZSkgaXMgdGhlIGF0dHJpYnV0ZSB2YWx1ZS5cbiAgICAvLyBUaGUgXCJfXCIgY2hhcmFjdGVyIHdpbGwgYmUgcmVwbGFjZWQgYnkgd2hhdGV2ZXIgZm9sbG93cyB0aGUgbWFjcm8gaWRlbnRpZmllci5cbiAgICAvLyBcbiAgICAvLyBUaGUgZXhhbXBsZSBhYm92ZSB3aWxsIHJlc3VsdCBpbiB0aGlzIHRyYW5zZm9ybWF0aW9uOlxuICAgIC8vXG4gICAgLy8gLiBtb3ZlIEBmcm9kbyA9PiA8bW92ZSBhc3NldD1cImZyb2RvXCIgLz5cbiAgICAvL1xuICAgIC8vIFNvbWUgbW9yZSBleGFtcGxlczpcbiAgICAvL1xuICAgIC8vIE1hY3JvOiB+IDogZHVyYXRpb24gX1xuICAgIC8vIFRyYW5zZm9ybWF0aW9uOiAuIHdhaXQgOjIwMCA9PiA8d2FpdCBkdXJhdGlvbj1cIjIwMFwiIC8+XG4gICAgLy9cbiAgICAvLyBNYWNybzogfiArIF8gdHJ1ZVxuICAgIC8vIE1hY3JvOiB+IC0gXyBmYWxzZVxuICAgIC8vIFRyYW5zZm9ybWF0aW9uOiAuIHN0YWdlIC1yZXNpemUsICtjZW50ZXIgPT4gPHN0YWdlIHJlc2l6ZT1cImZhbHNlXCIgY2VudGVyPVwidHJ1ZVwiIC8+XG4gICAgLy9cbiAgICBmdW5jdGlvbiBwcm9jZXNzQXR0cmlidXRlTWFjcm8gKGxpbmUpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBwYXJ0cyA9IG5vcm1hbGl6ZVdoaXRlc3BhY2UobGluZSkuc3BsaXQoXCIgXCIpO1xuICAgICAgICBcbiAgICAgICAgcGFydHMuc2hpZnQoKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpZGVudGlmaWVyOiBwYXJ0c1swXSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZTogcGFydHNbMV0sXG4gICAgICAgICAgICB2YWx1ZTogcGFydHNbMl1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwcm9jZXNzTWFjcm9zIChsaW5lcykge1xuICAgICAgICBcbiAgICAgICAgdmFyIG1hY3JvcyA9IFtdO1xuICAgICAgICBcbiAgICAgICAgbGluZXMuZm9yRWFjaChmdW5jdGlvbiAobGluZSkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAobGluZS50cmltKClbMF0gIT09IFwiflwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBtYWNyb3MucHVzaChwcm9jZXNzQXR0cmlidXRlTWFjcm8obGluZSkpO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBtYWNyb3M7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYXBwbHlNYWNyb3MgKHJhdywgbWFjcm9zKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgbmFtZSwgdmFsdWU7XG4gICAgICAgIFxuICAgICAgICBtYWNyb3Muc29tZShmdW5jdGlvbiAobWFjcm8pIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIG1hY3JvVmFsdWU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChyYXdbMF0gIT09IG1hY3JvLmlkZW50aWZpZXIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG1hY3JvVmFsdWUgPSByYXcucmVwbGFjZShtYWNyby5pZGVudGlmaWVyLCBcIlwiKTtcbiAgICAgICAgICAgIG5hbWUgPSAobWFjcm8uYXR0cmlidXRlID09PSBcIl9cIiA/IG1hY3JvVmFsdWUgOiBtYWNyby5hdHRyaWJ1dGUpO1xuICAgICAgICAgICAgdmFsdWUgPSAobWFjcm8udmFsdWUgPT09IFwiX1wiID8gbWFjcm9WYWx1ZSA6IG1hY3JvLnZhbHVlKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gcmVtb3ZlTWFjcm9EZWZpbml0aW9ucyAobGluZXMpIHtcbiAgICAgICAgcmV0dXJuIGxpbmVzLmZpbHRlcihmdW5jdGlvbiAobGluZSkge1xuICAgICAgICAgICAgcmV0dXJuIGxpbmUudHJpbSgpWzBdICE9PSBcIn5cIjtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIC8vXG4gICAgLy8gUmVwbGFjZXMgYWxsIHdoaXRlc3BhY2Ugd2l0aCBhIHNpbmdsZSBzcGFjZSBjaGFyYWN0ZXIuXG4gICAgLy9cbiAgICBmdW5jdGlvbiBub3JtYWxpemVXaGl0ZXNwYWNlICh0ZXh0KSB7XG4gICAgICAgIHJldHVybiB0ZXh0LnRyaW0oKS5yZXBsYWNlKC9bXFxzXSsvZywgXCIgXCIpO1xuICAgIH1cbiAgICBcbiAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgICAgIGNvbXBpbGU6IGNvbXBpbGVcbiAgICAgICAgfTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHdpbmRvdy54bXVnbHkgPSB7XG4gICAgICAgICAgICBjb21waWxlOiBjb21waWxlXG4gICAgICAgIH07XG4gICAgfVxuICAgIFxufSgpKTtcbiIsIlxudmFyIGVhc2luZyA9IHJlcXVpcmUoXCJlYXNlc1wiKTtcbnZhciB0cmFuc2Zvcm0gPSByZXF1aXJlKFwidHJhbnNmb3JtLWpzXCIpLnRyYW5zZm9ybTtcblxudmFyIHRvb2xzID0gcmVxdWlyZShcIi4vdG9vbHMvdG9vbHNcIik7XG5cbnZhciB3YXJuID0gdG9vbHMud2FybjtcbnZhciBleHRyYWN0VW5pdCA9IHRvb2xzLmV4dHJhY3RVbml0O1xudmFyIGFwcGx5VW5pdHMgPSB0b29scy5hcHBseUFzc2V0VW5pdHM7XG52YXIgYW5jaG9yZWRWYWx1ZSA9IHRvb2xzLmNhbGN1bGF0ZVZhbHVlV2l0aEFuY2hvcjtcblxuLy9cbi8vIFRoZSBwcm90b3R5cGUgZm9yIGFsbCBkaXNwbGF5YWJsZSBhc3NldHMuXG4vL1xuLy8gU2V0IC5fYm94U2l6ZVNlbGVjdG9ycyB0byBhbiBhcnJheSBjb250YWluaW5nIENTUyBzZWxlY3RvcnMgaW4geW91clxuLy8gYXNzZXQgaWYgeW91IHdhbnQgdGhlIGluaXRpYWwgcG9zaXRpb24gb2YgdGhlIGFzc2V0IHRvIGJlIGNhbGN1bGF0ZWRcbi8vIGRlcGVuZGluZyBvbiBzb21lIG9mIGl0cyBlbGVtZW50J3MgY2hpbGRyZW4gaW5zdGVhZCBvZiB0aGUgZWxlbWVudCdzXG4vLyAub2Zmc2V0V2lkdGggYW5kIC5vZmZzZXRIZWlnaHQuIFRoaXMgY2FuIGJlIG5lY2Vzc2FyeSBmb3IgYXNzZXRzIHN1Y2hcbi8vIGFzIEltYWdlUGFja3MgYmVjYXVzZSB0aGUgYXNzZXQncyBlbGVtZW50IHdpbGwgbm90IGhhdmUgYSBzaXplIHVudGlsXG4vLyBhdCBsZWFzdCBzb21lIG9mIGl0cyBjaGlsZHJlbiBhcmUgc2hvd24uXG4vL1xuZnVuY3Rpb24gRGlzcGxheU9iamVjdCAoYXNzZXQsIGludGVycHJldGVyKSB7XG4gICAgXG4gICAgdGhpcy5zdGFnZSA9IGludGVycHJldGVyLnN0YWdlO1xuICAgIHRoaXMuYnVzID0gaW50ZXJwcmV0ZXIuYnVzO1xuICAgIHRoaXMubmFtZSA9IGFzc2V0LmdldEF0dHJpYnV0ZShcIm5hbWVcIik7XG4gICAgdGhpcy5jc3NpZCA9IGFzc2V0LmdldEF0dHJpYnV0ZShcImNzc2lkXCIpIHx8IFwid3NlX2ltYWdlcGFja19cIiArIHRoaXMubmFtZTtcbiAgICB0aGlzLmludGVycHJldGVyID0gaW50ZXJwcmV0ZXI7XG4gICAgdGhpcy54ID0gYXNzZXQuZ2V0QXR0cmlidXRlKFwieFwiKSB8fCAwO1xuICAgIHRoaXMueSA9IGFzc2V0LmdldEF0dHJpYnV0ZShcInlcIikgfHwgMDtcbiAgICB0aGlzLnogPSBhc3NldC5nZXRBdHRyaWJ1dGUoXCJ6XCIpIHx8IHRoaXMueiB8fCAwO1xuICAgIHRoaXMueEFuY2hvciA9IGFzc2V0LmdldEF0dHJpYnV0ZShcInhBbmNob3JcIik7XG4gICAgdGhpcy55QW5jaG9yID0gYXNzZXQuZ2V0QXR0cmlidXRlKFwieUFuY2hvclwiKTtcbiAgICB0aGlzLndpZHRoID0gYXNzZXQuZ2V0QXR0cmlidXRlKFwid2lkdGhcIikgfHwgdGhpcy53aWR0aDtcbiAgICB0aGlzLmhlaWdodCA9IGFzc2V0LmdldEF0dHJpYnV0ZShcImhlaWdodFwiKSB8fCB0aGlzLmhlaWdodDtcbiAgICBcbiAgICB0aGlzLl9jcmVhdGVFbGVtZW50KCk7XG4gICAgXG4gICAgYXBwbHlVbml0cyh0aGlzLCBhc3NldCk7XG4gICAgXG59XG5cbkRpc3BsYXlPYmplY3QucHJvdG90eXBlLm9uTG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLl9jYWxjdWxhdGVCb3hTaXplKCk7XG4gICAgdGhpcy5fbW92ZVRvUG9zaXRpb24oKTtcbn07XG5cbkRpc3BsYXlPYmplY3QucHJvdG90eXBlLmZsYXNoID0gZnVuY3Rpb24gZmxhc2ggKGNvbW1hbmQsIGFyZ3MpIHtcbiAgICBcbiAgICB2YXIgc2VsZiwgZHVyYXRpb24sIGVsZW1lbnQsIGlzQW5pbWF0aW9uLCBtYXhPcGFjaXR5O1xuICAgIHZhciB2aXNpYmxlLCBwYXJzZSA9IHRvb2xzLmdldFBhcnNlZEF0dHJpYnV0ZTtcbiAgICBcbiAgICBhcmdzID0gYXJncyB8fCB7fTtcbiAgICBzZWxmID0gdGhpcztcbiAgICBkdXJhdGlvbiA9ICtwYXJzZShjb21tYW5kLCBcImR1cmF0aW9uXCIsIHRoaXMuaW50ZXJwcmV0ZXIsIDUwMCk7XG4gICAgbWF4T3BhY2l0eSA9ICtwYXJzZShjb21tYW5kLCBcIm9wYWNpdHlcIiwgdGhpcy5pbnRlcnByZXRlciwgMSk7XG4gICAgZWxlbWVudCA9IGFyZ3MuZWxlbWVudCB8fCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNzc2lkKTtcbiAgICBcbiAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgd2Fybih0aGlzLmJ1cywgXCJET00gRWxlbWVudCBmb3IgYXNzZXQgaXMgbWlzc2luZyFcIiwgY29tbWFuZCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaXNBbmltYXRpb24gPSBhcmdzLmFuaW1hdGlvbiA9PT0gdHJ1ZSA/IHRydWUgOiBmYWxzZTtcbiAgICB2aXNpYmxlID0gKCsoZWxlbWVudC5zdHlsZS5vcGFjaXR5LnJlcGxhY2UoL1teMC05XFwuXS8sIFwiXCIpKSkgPiAwID8gdHJ1ZSA6IGZhbHNlO1xuICAgIFxuICAgIGlmICghaXNBbmltYXRpb24pIHtcbiAgICAgICAgc2VsZi5pbnRlcnByZXRlci53YWl0Q291bnRlciArPSAxO1xuICAgIH1cbiAgICBcbiAgICB0cmFuc2Zvcm0oXG4gICAgICAgIHZpc2libGUgPyBtYXhPcGFjaXR5IDogMCxcbiAgICAgICAgdmlzaWJsZSA/IDAgOiBtYXhPcGFjaXR5LFxuICAgICAgICBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gdjtcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uIC8gMyxcbiAgICAgICAgICAgIGVhc2luZzogZWFzaW5nLmN1YmljSW5cbiAgICAgICAgfSxcbiAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgYXJnc09iajtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZnVuY3Rpb24gdHJhbmZvcm1GbiAodikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IHY7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZ1bmN0aW9uIGZpbmlzaEZuICgpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNBbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBzZWxmLmludGVycHJldGVyLndhaXRDb3VudGVyIC09IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGFyZ3NPYmogPSB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246IChkdXJhdGlvbiAvIDMpICogMixcbiAgICAgICAgICAgICAgICBlYXNpbmc6IGVhc2luZy5jdWJpY091dFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdHJhbnNmb3JtKFxuICAgICAgICAgICAgICAgIHZpc2libGUgPyAwIDogbWF4T3BhY2l0eSxcbiAgICAgICAgICAgICAgICB2aXNpYmxlID8gbWF4T3BhY2l0eSA6IDAsXG4gICAgICAgICAgICAgICAgdHJhbmZvcm1GbixcbiAgICAgICAgICAgICAgICBhcmdzT2JqLFxuICAgICAgICAgICAgICAgIGZpbmlzaEZuXG4gICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBkb05leHQ6IHRydWVcbiAgICB9O1xufTtcblxuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuZmxpY2tlciA9IGZ1bmN0aW9uIChjb21tYW5kLCBhcmdzKSB7XG4gICAgXG4gICAgdmFyIHNlbGYsIGR1cmF0aW9uLCB0aW1lcywgc3RlcCwgZWxlbWVudDtcbiAgICB2YXIgaXNBbmltYXRpb24sIGZuLCBpdGVyYXRpb24sIG1heE9wYWNpdHksIHZhbDEsIHZhbDIsIGR1cjEsIGR1cjI7XG4gICAgXG4gICAgYXJncyA9IGFyZ3MgfHwge307XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgZHVyYXRpb24gPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcImR1cmF0aW9uXCIpIHx8IDUwMDtcbiAgICB0aW1lcyA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwidGltZXNcIikgfHwgMTA7XG4gICAgbWF4T3BhY2l0eSA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwib3BhY2l0eVwiKSB8fCAxO1xuICAgIGVsZW1lbnQgPSBhcmdzLmVsZW1lbnQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jc3NpZCk7XG4gICAgc3RlcCA9IGR1cmF0aW9uIC8gdGltZXM7XG4gICAgaXRlcmF0aW9uID0gMDtcbiAgICBcbiAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgd2Fybih0aGlzLmJ1cywgXCJET00gRWxlbWVudCBmb3IgYXNzZXQgaXMgbWlzc2luZyFcIiwgY29tbWFuZCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaWYgKCEocGFyc2VJbnQoZWxlbWVudC5zdHlsZS5vcGFjaXR5LCAxMCkpKSB7XG4gICAgICAgIHZhbDEgPSAwO1xuICAgICAgICB2YWwyID0gbWF4T3BhY2l0eTtcbiAgICAgICAgZHVyMSA9IHN0ZXAgLyAzO1xuICAgICAgICBkdXIyID0gZHVyMSAqIDI7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YWwyID0gMDtcbiAgICAgICAgdmFsMSA9IG1heE9wYWNpdHk7XG4gICAgICAgIGR1cjIgPSBzdGVwIC8gMztcbiAgICAgICAgZHVyMSA9IGR1cjIgKiAyO1xuICAgIH1cbiAgICBcbiAgICBpc0FuaW1hdGlvbiA9IGFyZ3MuYW5pbWF0aW9uID09PSB0cnVlID8gdHJ1ZSA6IGZhbHNlO1xuICAgIFxuICAgIGlmICghaXNBbmltYXRpb24pIHtcbiAgICAgICAgc2VsZi5pbnRlcnByZXRlci53YWl0Q291bnRlciArPSAxO1xuICAgIH1cbiAgICBcbiAgICBmbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXG4gICAgICAgIGl0ZXJhdGlvbiArPSAxO1xuICAgICAgICBcbiAgICAgICAgdHJhbnNmb3JtKFxuICAgICAgICAgICAgdmFsMSxcbiAgICAgICAgICAgIHZhbDIsXG4gICAgICAgICAgICBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IHY7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXIxLFxuICAgICAgICAgICAgICAgIGVhc2luZzogZWFzaW5nLnF1YWRJblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm0oXG4gICAgICAgICAgICAgICAgICAgIHZhbDIsXG4gICAgICAgICAgICAgICAgICAgIHZhbDEsXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSB2O1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbjogZHVyMixcbiAgICAgICAgICAgICAgICAgICAgICAgIGVhc2luZzogZWFzaW5nLnF1YWRJblxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdGVyYXRpb24gPD0gdGltZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNBbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmludGVycHJldGVyLndhaXRDb3VudGVyIC09IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH07XG4gICAgXG4gICAgZm4oKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBkb05leHQ6IHRydWVcbiAgICB9O1xufTtcblxuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uIChjb21tYW5kLCBhcmdzKSB7XG4gICAgXG4gICAgdmFyIHNlbGYsIGR1cmF0aW9uLCBlZmZlY3QsIGRpcmVjdGlvbiwgb2Zmc2V0V2lkdGgsIG9mZnNldEhlaWdodDtcbiAgICB2YXIgb3gsIG95LCB0bywgcHJvcCwgaXNBbmltYXRpb24sIGVsZW1lbnQsIGVhc2luZ1R5cGUsIGVhc2luZ0ZuLCBzdGFnZTtcbiAgICB2YXIgeFVuaXQsIHlVbml0O1xuICAgIHZhciBwYXJzZSA9IHRvb2xzLmdldFBhcnNlZEF0dHJpYnV0ZTtcbiAgICBcbiAgICBhcmdzID0gYXJncyB8fCB7fTtcbiAgICBzZWxmID0gdGhpcztcbiAgICBkdXJhdGlvbiA9IHBhcnNlKGNvbW1hbmQsIFwiZHVyYXRpb25cIiwgdGhpcy5pbnRlcnByZXRlciwgNTAwKTtcbiAgICBlZmZlY3QgPSBwYXJzZShjb21tYW5kLCBcImVmZmVjdFwiLCB0aGlzLmludGVycHJldGVyLCBcImZhZGVcIik7XG4gICAgZGlyZWN0aW9uID0gcGFyc2UoY29tbWFuZCwgXCJkaXJlY3Rpb25cIiwgdGhpcy5pbnRlcnByZXRlciwgXCJsZWZ0XCIpO1xuICAgIGlzQW5pbWF0aW9uID0gYXJncy5hbmltYXRpb24gPT09IHRydWUgPyB0cnVlIDogZmFsc2U7XG4gICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY3NzaWQpO1xuICAgIGVhc2luZ1R5cGUgPSBwYXJzZShjb21tYW5kLCBcImVhc2luZ1wiLCB0aGlzLmludGVycHJldGVyLCBcInNpbmVFYXNlT3V0XCIpO1xuICAgIGVhc2luZ0ZuID0gKGVhc2luZ1tlYXNpbmdUeXBlXSkgPyBcbiAgICAgICAgZWFzaW5nW2Vhc2luZ1R5cGVdIDogXG4gICAgICAgIGVhc2luZy5zaW5lT3V0O1xuICAgIHN0YWdlID0gdGhpcy5zdGFnZTtcbiAgICB4VW5pdCA9IHRoaXMueFVuaXQgfHwgJ3B4JztcbiAgICB5VW5pdCA9IHRoaXMueVVuaXQgfHwgJ3B4JztcbiAgICBcbiAgICBpZiAoZWZmZWN0ID09PSBcInNsaWRlXCIpIHtcbiAgICAgICAgXG4gICAgICAgIGVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgICAgIFxuICAgICAgICBpZiAoeFVuaXQgPT09ICclJykge1xuICAgICAgICAgICAgb3ggPSBlbGVtZW50Lm9mZnNldExlZnQgLyAoc3RhZ2Uub2Zmc2V0V2lkdGggLyAxMDApO1xuICAgICAgICAgICAgb2Zmc2V0V2lkdGggPSAxMDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBveCA9IGVsZW1lbnQub2Zmc2V0TGVmdDtcbiAgICAgICAgICAgIG9mZnNldFdpZHRoID0gc3RhZ2Uub2Zmc2V0V2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmICh5VW5pdCA9PT0gJyUnKSB7XG4gICAgICAgICAgICBveSA9IGVsZW1lbnQub2Zmc2V0VG9wIC8gKHN0YWdlLm9mZnNldEhlaWdodCAvIDEwMCk7XG4gICAgICAgICAgICBvZmZzZXRIZWlnaHQgPSAxMDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBveSA9IGVsZW1lbnQub2Zmc2V0VG9wO1xuICAgICAgICAgICAgb2Zmc2V0SGVpZ2h0ID0gc3RhZ2Uub2Zmc2V0SGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xuICAgICAgICAgICAgY2FzZSBcImxlZnRcIjpcbiAgICAgICAgICAgICAgICB0byA9IG94IC0gb2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICAgICAgcHJvcCA9IFwibGVmdFwiO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInJpZ2h0XCI6XG4gICAgICAgICAgICAgICAgdG8gPSBveCArIG9mZnNldFdpZHRoO1xuICAgICAgICAgICAgICAgIHByb3AgPSBcImxlZnRcIjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJ0b3BcIjpcbiAgICAgICAgICAgICAgICB0byA9IG95IC0gb2Zmc2V0SGVpZ2h0O1xuICAgICAgICAgICAgICAgIHByb3AgPSBcInRvcFwiO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImJvdHRvbVwiOlxuICAgICAgICAgICAgICAgIHRvID0gb3kgKyBvZmZzZXRIZWlnaHQ7XG4gICAgICAgICAgICAgICAgcHJvcCA9IFwidG9wXCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRvID0gb3ggLSBvZmZzZXRXaWR0aDtcbiAgICAgICAgICAgICAgICBwcm9wID0gXCJsZWZ0XCI7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmICghaXNBbmltYXRpb24pIHtcbiAgICAgICAgICAgIHNlbGYuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHZhbEZuLCBmcm9tLCBmaW5pc2hGbiwgb3B0aW9ucztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFsRm4gPSBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGVbcHJvcF0gPSB2ICsgKHByb3AgPT09ICdsZWZ0JyA/IHhVbml0IDogeVVuaXQpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZnJvbSA9IChwcm9wID09PSBcImxlZnRcIiA/IG94IDogb3kpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBmaW5pc2hGbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIWlzQW5pbWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGRpcmVjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBjYXNlIFwibGVmdFwiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwicmlnaHRcIjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9IG94ICsgeFVuaXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wID0gXCJsZWZ0XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBcInRvcFwiOlxuICAgICAgICAgICAgICAgICAgICBjYXNlIFwiYm90dG9tXCI6XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRvcCA9IG95ICsgeVVuaXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBwcm9wID0gXCJ0b3BcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5sZWZ0ID0gb3ggKyB4VW5pdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3AgPSBcImxlZnRcIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgICAgICBlYXNpbmc6IGVhc2luZ0ZuXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0cmFuc2Zvcm0oZnJvbSwgdG8sIHZhbEZuLCBvcHRpb25zLCBmaW5pc2hGbik7XG4gICAgICAgIH0oKSk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBcbiAgICAgICAgaWYgKCFpc0FuaW1hdGlvbikge1xuICAgICAgICAgICAgc2VsZi5pbnRlcnByZXRlci53YWl0Q291bnRlciArPSAxO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgdmFsRm4sIG9wdGlvbnMsIGZpbmlzaEZuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YWxGbiA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gdjtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZpbmlzaEZuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICghaXNBbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnRlcnByZXRlci53YWl0Q291bnRlciAtPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgICAgICAgICAgZWFzaW5nOiBlYXNpbmdGblxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdHJhbnNmb3JtKDEsIDAsIHZhbEZuLCBvcHRpb25zLCBmaW5pc2hGbik7XG4gICAgICAgIH0oKSk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIGRvTmV4dDogdHJ1ZVxuICAgIH07XG59O1xuXG5EaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24gKGNvbW1hbmQsIGFyZ3MpIHtcbiAgICBcbiAgICB2YXIgeCwgeSwgeiwgZWxlbWVudCwgc2VsZiwgeFVuaXQsIHlVbml0LCBkdXJhdGlvbiwgZWFzaW5nVHlwZTtcbiAgICB2YXIgZWFzaW5nRm4sIGlzQW5pbWF0aW9uLCBveCwgb3ksIHN0YWdlO1xuICAgIHZhciB4QW5jaG9yLCB5QW5jaG9yLCBpbnRlcnByZXRlciA9IHRoaXMuaW50ZXJwcmV0ZXI7XG4gICAgdmFyIG9mZnNldExlZnQsIG9mZnNldFRvcCwgb2xkRWxlbWVudERpc3BsYXlTdHlsZTtcbiAgICBcbiAgICBhcmdzID0gYXJncyB8fCB7fTtcbiAgICBzZWxmID0gdGhpcztcbiAgICBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jc3NpZCk7XG4gICAgXG4gICAgeCA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwieFwiKTtcbiAgICB5ID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJ5XCIpO1xuICAgIHogPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcInpcIik7XG4gICAgXG4gICAgeEFuY2hvciA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwieEFuY2hvclwiKSB8fCBcIjBcIjtcbiAgICB5QW5jaG9yID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJ5QW5jaG9yXCIpIHx8IFwiMFwiO1xuICAgIFxuICAgIGlmICh4QW5jaG9yID09PSBudWxsICYmIHRoaXMueEFuY2hvciAhPT0gbnVsbCkge1xuICAgICAgICB4QW5jaG9yID0gdGhpcy54QW5jaG9yO1xuICAgIH1cbiAgICBcbiAgICBpZiAoeUFuY2hvciA9PT0gbnVsbCAgJiYgdGhpcy55QW5jaG9yICE9PSBudWxsKSB7XG4gICAgICAgIHlBbmNob3IgPSB0aGlzLnlBbmNob3I7XG4gICAgfVxuICAgIFxuICAgIHggPSB0b29scy5yZXBsYWNlVmFyaWFibGVzKHgsIHRoaXMuaW50ZXJwcmV0ZXIpO1xuICAgIHkgPSB0b29scy5yZXBsYWNlVmFyaWFibGVzKHksIHRoaXMuaW50ZXJwcmV0ZXIpO1xuICAgIHogPSB0b29scy5yZXBsYWNlVmFyaWFibGVzKHosIHRoaXMuaW50ZXJwcmV0ZXIpO1xuICAgIHhBbmNob3IgPSB0b29scy5yZXBsYWNlVmFyaWFibGVzKHhBbmNob3IsIHRoaXMuaW50ZXJwcmV0ZXIpO1xuICAgIHlBbmNob3IgPSB0b29scy5yZXBsYWNlVmFyaWFibGVzKHlBbmNob3IsIHRoaXMuaW50ZXJwcmV0ZXIpO1xuICAgIFxuICAgIGR1cmF0aW9uID0gdG9vbHMuZ2V0UGFyc2VkQXR0cmlidXRlKGNvbW1hbmQsIFwiZHVyYXRpb25cIiwgaW50ZXJwcmV0ZXIsIDUwMCk7XG4gICAgZWFzaW5nVHlwZSA9IHRvb2xzLmdldFBhcnNlZEF0dHJpYnV0ZShjb21tYW5kLCBcImVhc2luZ1wiLCBpbnRlcnByZXRlciwgXCJzaW5lRWFzZU91dFwiKTtcbiAgICBcbiAgICBlYXNpbmdGbiA9IChlYXNpbmdbZWFzaW5nVHlwZV0pID8gXG4gICAgICAgIGVhc2luZ1tlYXNpbmdUeXBlXSA6IFxuICAgICAgICBlYXNpbmcuc2luZU91dDtcbiAgICBcbiAgICBpc0FuaW1hdGlvbiA9IGFyZ3MuYW5pbWF0aW9uID09PSB0cnVlID8gdHJ1ZSA6IGZhbHNlO1xuICAgIHN0YWdlID0gdGhpcy5pbnRlcnByZXRlci5zdGFnZTtcbiAgICBcbiAgICBvZmZzZXRMZWZ0ID0gZWxlbWVudC5vZmZzZXRMZWZ0O1xuICAgIG9mZnNldFRvcCA9IGVsZW1lbnQub2Zmc2V0VG9wO1xuICAgIFxuICAgIGlmICh4ICE9PSBudWxsKSB7XG4gICAgICAgIHhVbml0ID0gdG9vbHMuZXh0cmFjdFVuaXQoeCkgfHwgXCJweFwiO1xuICAgICAgICB4ID0gcGFyc2VJbnQoeCwgMTApO1xuICAgIH1cbiAgICBcbiAgICBpZiAoeSAhPT0gbnVsbCkge1xuICAgICAgICB5VW5pdCA9IHRvb2xzLmV4dHJhY3RVbml0KHkpIHx8IFwicHhcIjtcbiAgICAgICAgeSA9IHBhcnNlSW50KHksIDEwKTtcbiAgICB9XG4gICAgXG4gICAgb2xkRWxlbWVudERpc3BsYXlTdHlsZSA9IGVsZW1lbnQuc3R5bGUuZGlzcGxheTtcbiAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBcIlwiO1xuICAgIFxuICAgIGlmICh4VW5pdCA9PT0gXCIlXCIpIHtcbiAgICAgICAgeCA9IChzdGFnZS5vZmZzZXRXaWR0aCAvIDEwMCkgKiB4O1xuICAgICAgICB4VW5pdCA9IFwicHhcIjtcbiAgICB9XG4gICAgXG4gICAgaWYgKHlVbml0ID09PSBcIiVcIikge1xuICAgICAgICB5ID0gKHN0YWdlLm9mZnNldEhlaWdodCAvIDEwMCkgKiB5O1xuICAgICAgICB5VW5pdCA9IFwicHhcIjtcbiAgICB9XG4gICAgXG4gICAgeCA9IHRvb2xzLmNhbGN1bGF0ZVZhbHVlV2l0aEFuY2hvcih4LCB4QW5jaG9yLCBlbGVtZW50Lm9mZnNldFdpZHRoKTtcbiAgICB5ID0gdG9vbHMuY2FsY3VsYXRlVmFsdWVXaXRoQW5jaG9yKHksIHlBbmNob3IsIGVsZW1lbnQub2Zmc2V0SGVpZ2h0KTtcbiAgICBcbiAgICBlbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBvbGRFbGVtZW50RGlzcGxheVN0eWxlO1xuICAgIFxuICAgIGlmICh4ID09PSBudWxsICYmIHkgPT09IG51bGwgJiYgeiA9PT0gbnVsbCkge1xuICAgICAgICB3YXJuKHRoaXMuYnVzLCBcIkNhbid0IGFwcGx5IGNvbW1hbmQgJ21vdmUnIHRvIGFzc2V0ICdcIiArIFxuICAgICAgICAgICAgdGhpcy5uYW1lICsgXCInIGJlY2F1c2Ugbm8geCwgeSBvciB6IHBvc2l0aW9uIFwiICtcbiAgICAgICAgICAgIFwiaGFzIGJlZW4gc3VwcGxpZWQuXCIsIGNvbW1hbmQpO1xuICAgIH1cbiAgICBcbiAgICBpZiAoeCAhPT0gbnVsbCkge1xuICAgICAgICBcbiAgICAgICAgaWYgKHhVbml0ID09PSAnJScpIHtcbiAgICAgICAgICAgIG94ID0gb2Zmc2V0TGVmdCAvIChzdGFnZS5vZmZzZXRXaWR0aCAvIDEwMCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBveCA9IG9mZnNldExlZnQ7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmICghaXNBbmltYXRpb24pIHtcbiAgICAgICAgICAgIHNlbGYuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdHJhbnNmb3JtKFxuICAgICAgICAgICAgb3gsXG4gICAgICAgICAgICB4LFxuICAgICAgICAgICAgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSB2ICsgeFVuaXQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgICAgICBlYXNpbmc6IGVhc2luZ0ZuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghaXNBbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnRlcnByZXRlci53YWl0Q291bnRlciAtPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHkgIT09IG51bGwpIHtcbiAgICAgICAgXG4gICAgICAgIGlmICh5VW5pdCA9PT0gJyUnKSB7XG4gICAgICAgICAgICBveSA9IG9mZnNldFRvcCAvIChzdGFnZS5vZmZzZXRIZWlnaHQgLyAxMDApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb3kgPSBvZmZzZXRUb3A7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmICghaXNBbmltYXRpb24pIHtcbiAgICAgICAgICAgIHNlbGYuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdHJhbnNmb3JtKFxuICAgICAgICAgICAgb3ksXG4gICAgICAgICAgICB5LFxuICAgICAgICAgICAgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnRvcCA9IHYgKyB5VW5pdDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICAgICAgICAgIGVhc2luZzogZWFzaW5nRm5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc0FuaW1hdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmludGVycHJldGVyLndhaXRDb3VudGVyIC09IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbiAgICBcbiAgICBpZiAoeiAhPT0gbnVsbCkge1xuICAgICAgICBcbiAgICAgICAgaWYgKCFpc0FuaW1hdGlvbikge1xuICAgICAgICAgICAgc2VsZi5pbnRlcnByZXRlci53YWl0Q291bnRlciArPSAxO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0cmFuc2Zvcm0oXG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnpJbmRleCB8fCAwLFxuICAgICAgICAgICAgcGFyc2VJbnQoeiwgMTApLFxuICAgICAgICAgICAgZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLnpJbmRleCA9IHY7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgICAgICBlYXNpbmc6IGVhc2luZ0ZuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghaXNBbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnRlcnByZXRlci53YWl0Q291bnRlciAtPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5idXMudHJpZ2dlcihcIndzZS5hc3NldHMubWl4aW5zLm1vdmVcIiwgdGhpcyk7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZG9OZXh0OiB0cnVlXG4gICAgfTtcbn07XG5cbkRpc3BsYXlPYmplY3QucHJvdG90eXBlLnNoYWtlID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcbiAgICBcbiAgICB2YXIgZHgsIGR5LCBlbGVtZW50LCBzZWxmLCB4VW5pdCwgeVVuaXQsIGR1cmF0aW9uLCB0aW1lcztcbiAgICB2YXIgb3gsIG95LCBzdGFnZTtcbiAgICBcbiAgICBzZWxmID0gdGhpcztcbiAgICBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jc3NpZCk7XG4gICAgZHggPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcImR4XCIpO1xuICAgIGR5ID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJkeVwiKTtcbiAgICB0aW1lcyA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwidGltZXNcIikgfHwgMjtcbiAgICBkdXJhdGlvbiA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwiZHVyYXRpb25cIikgfHwgMjc1O1xuICAgIHN0YWdlID0gdGhpcy5pbnRlcnByZXRlci5zdGFnZTtcbiAgICBcbiAgICBpZiAoZHggPT09IG51bGwgJiYgZHkgPT09IG51bGwpIHtcbiAgICAgICAgZHkgPSBcIi0xMHB4XCI7XG4gICAgfVxuICAgIFxuICAgIGlmIChkeCAhPT0gbnVsbCkge1xuICAgICAgICB4VW5pdCA9IHRvb2xzLmV4dHJhY3RVbml0KGR4KTtcbiAgICAgICAgZHggPSBwYXJzZUludChkeCwgMTApO1xuICAgIH1cbiAgICBcbiAgICBpZiAoZHkgIT09IG51bGwpIHtcbiAgICAgICAgeVVuaXQgPSB0b29scy5leHRyYWN0VW5pdChkeSk7XG4gICAgICAgIGR5ID0gcGFyc2VJbnQoZHksIDEwKTtcbiAgICB9XG4gICAgXG4gICAgZnVuY3Rpb24gZWFzaW5nIChkaXN0YW5jZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgICAgIHJldHVybiBkaXN0YW5jZSAqIE1hdGguc2luKHggKiAodGltZXMgKiAyKSAqIE1hdGguUEkpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBcbiAgICBpZiAoZHggIT09IG51bGwpIHtcbiAgICAgICAgXG4gICAgICAgIGlmICh4VW5pdCA9PT0gJyUnKSB7XG4gICAgICAgICAgICBveCA9IGVsZW1lbnQub2Zmc2V0TGVmdCAvIChzdGFnZS5vZmZzZXRXaWR0aCAvIDEwMCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBveCA9IGVsZW1lbnQub2Zmc2V0TGVmdDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgc2VsZi5pbnRlcnByZXRlci53YWl0Q291bnRlciArPSAxO1xuICAgICAgICBcbiAgICAgICAgdHJhbnNmb3JtKFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDEsXG4gICAgICAgICAgICBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9IHYgKyB4VW5pdDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICAgICAgICAgIGVhc2luZzogZWFzaW5nKGR4KVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSBveCArIHhVbml0O1xuICAgICAgICAgICAgICAgIHNlbGYuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgLT0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKGR5ICE9PSBudWxsKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAoeVVuaXQgPT09ICclJykge1xuICAgICAgICAgICAgb3kgPSBlbGVtZW50Lm9mZnNldFRvcCAvIChzdGFnZS5vZmZzZXRIZWlnaHQgLyAxMDApO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb3kgPSBlbGVtZW50Lm9mZnNldFRvcDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgc2VsZi5pbnRlcnByZXRlci53YWl0Q291bnRlciArPSAxO1xuICAgICAgICBcbiAgICAgICAgdHJhbnNmb3JtKFxuICAgICAgICAgICAgMCxcbiAgICAgICAgICAgIDEsXG4gICAgICAgICAgICBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudG9wID0gdiArIHlVbml0O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgICAgICAgICAgZWFzaW5nOiBlYXNpbmcoZHkpXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudG9wID0gb3kgKyB5VW5pdDtcbiAgICAgICAgICAgICAgICBzZWxmLmludGVycHJldGVyLndhaXRDb3VudGVyIC09IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuICAgIFxuICAgIHRoaXMuYnVzLnRyaWdnZXIoXCJ3c2UuYXNzZXRzLm1peGlucy5zaGFrZVwiLCB0aGlzKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBkb05leHQ6IHRydWVcbiAgICB9O1xufTtcblxuRGlzcGxheU9iamVjdC5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uIChjb21tYW5kLCBhcmdzKSB7XG4gICAgXG4gICAgdmFyIGR1cmF0aW9uLCBlZmZlY3QsIGRpcmVjdGlvbiwgb3gsIG95LCBwcm9wLCB4VW5pdCwgeVVuaXQ7XG4gICAgdmFyIHN0YWdlLCBlbGVtZW50LCBpc0FuaW1hdGlvbiwgZWFzaW5nRm4sIGVhc2luZ1R5cGUsIGludGVycHJldGVyO1xuICAgIHZhciBvZmZzZXRXaWR0aCwgb2Zmc2V0SGVpZ2h0LCBzdGFydFgsIHN0YXJ0WTtcbiAgICB2YXIgcGFyc2UgPSB0b29scy5nZXRQYXJzZWRBdHRyaWJ1dGU7XG4gICAgXG4gICAgYXJncyA9IGFyZ3MgfHwge307XG4gICAgZHVyYXRpb24gPSBwYXJzZShjb21tYW5kLCBcImR1cmF0aW9uXCIsIHRoaXMuaW50ZXJwcmV0ZXIsIDUwMCk7XG4gICAgZWZmZWN0ID0gcGFyc2UoY29tbWFuZCwgXCJlZmZlY3RcIiwgdGhpcy5pbnRlcnByZXRlciwgXCJmYWRlXCIpO1xuICAgIGRpcmVjdGlvbiA9IHBhcnNlKGNvbW1hbmQsIFwiZGlyZWN0aW9uXCIsIHRoaXMuaW50ZXJwcmV0ZXIsIFwicmlnaHRcIik7XG4gICAgZWxlbWVudCA9IGFyZ3MuZWxlbWVudCB8fCBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNzc2lkKTtcbiAgICB4VW5pdCA9IHRoaXMueFVuaXQgfHwgJ3B4JztcbiAgICB5VW5pdCA9IHRoaXMueVVuaXQgfHwgJ3B4JztcbiAgICBcbiAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgd2Fybih0aGlzLmJ1cywgXCJET00gRWxlbWVudCBmb3IgYXNzZXQgaXMgbWlzc2luZyFcIiwgY29tbWFuZCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaW50ZXJwcmV0ZXIgPSBhcmdzLmludGVycHJldGVyIHx8IHRoaXMuaW50ZXJwcmV0ZXI7XG4gICAgc3RhZ2UgPSBhcmdzLnN0YWdlIHx8IHRoaXMuc3RhZ2U7XG4gICAgZWFzaW5nVHlwZSA9IHBhcnNlKGNvbW1hbmQsIFwiZWFzaW5nXCIsIHRoaXMuaW50ZXJwcmV0ZXIsIFwic2luZU91dFwiKTtcbiAgICBlYXNpbmdGbiA9IChlYXNpbmdbZWFzaW5nVHlwZV0pID8gXG4gICAgICAgIGVhc2luZ1tlYXNpbmdUeXBlXSA6IFxuICAgICAgICBlYXNpbmcuc2luZU91dDtcbiAgICBpc0FuaW1hdGlvbiA9IGFyZ3MuYW5pbWF0aW9uID09PSB0cnVlID8gdHJ1ZSA6IGZhbHNlO1xuICAgIFxuICAgIGlmIChlZmZlY3QgPT09IFwic2xpZGVcIikge1xuICAgICAgICBcbiAgICAgICAgaWYgKHhVbml0ID09PSAnJScpIHtcbiAgICAgICAgICAgIG94ID0gZWxlbWVudC5vZmZzZXRMZWZ0IC8gKHN0YWdlLm9mZnNldFdpZHRoIC8gMTAwKTtcbiAgICAgICAgICAgIG9mZnNldFdpZHRoID0gMTAwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb3ggPSBlbGVtZW50Lm9mZnNldExlZnQ7XG4gICAgICAgICAgICBvZmZzZXRXaWR0aCA9IHN0YWdlLm9mZnNldFdpZHRoO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoeVVuaXQgPT09ICclJykge1xuICAgICAgICAgICAgb3kgPSBlbGVtZW50Lm9mZnNldFRvcCAvIChzdGFnZS5vZmZzZXRIZWlnaHQgLyAxMDApO1xuICAgICAgICAgICAgb2Zmc2V0SGVpZ2h0ID0gMTAwO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb3kgPSBlbGVtZW50Lm9mZnNldFRvcDtcbiAgICAgICAgICAgIG9mZnNldEhlaWdodCA9IHN0YWdlLm9mZnNldEhlaWdodDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgc3dpdGNoIChkaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIGNhc2UgXCJsZWZ0XCI6XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5sZWZ0ID0gb3ggKyBvZmZzZXRXaWR0aCArIHhVbml0O1xuICAgICAgICAgICAgICAgIHByb3AgPSBcImxlZnRcIjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJyaWdodFwiOlxuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9IG94IC0gb2Zmc2V0V2lkdGggKyB4VW5pdDtcbiAgICAgICAgICAgICAgICBwcm9wID0gXCJsZWZ0XCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFwidG9wXCI6XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS50b3AgPSBveSArIG9mZnNldEhlaWdodCArIHlVbml0O1xuICAgICAgICAgICAgICAgIHByb3AgPSBcInRvcFwiO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcImJvdHRvbVwiOlxuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGUudG9wID0gb3kgLSBvZmZzZXRIZWlnaHQgKyB5VW5pdDtcbiAgICAgICAgICAgICAgICBwcm9wID0gXCJ0b3BcIjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5sZWZ0ID0gb3ggLSBvZmZzZXRXaWR0aCArIHhVbml0O1xuICAgICAgICAgICAgICAgIHByb3AgPSBcImxlZnRcIjtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgXG4gICAgICAgIGlmICghaXNBbmltYXRpb24pIHtcbiAgICAgICAgICAgIGludGVycHJldGVyLndhaXRDb3VudGVyICs9IDE7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmICh4VW5pdCA9PT0gJyUnKSB7XG4gICAgICAgICAgICBzdGFydFggPSBlbGVtZW50Lm9mZnNldExlZnQgLyAoc3RhZ2Uub2Zmc2V0V2lkdGggLyAxMDApO1xuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHN0YXJ0WCA9IGVsZW1lbnQub2Zmc2V0TGVmdDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKHlVbml0ID09PSAnJScpIHtcbiAgICAgICAgICAgIHN0YXJ0WSA9IGVsZW1lbnQub2Zmc2V0VG9wIC8gKHN0YWdlLm9mZnNldEhlaWdodCAvIDEwMCk7XG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc3RhcnRZID0gZWxlbWVudC5vZmZzZXRUb3A7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRyYW5zZm9ybShcbiAgICAgICAgICAgIChwcm9wID09PSBcImxlZnRcIiA/IHN0YXJ0WCA6IHN0YXJ0WSksIFxuICAgICAgICAgICAgKHByb3AgPT09IFwibGVmdFwiID8gb3ggOiBveSksXG4gICAgICAgICAgICBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQuc3R5bGVbcHJvcF0gPSB2ICsgKHByb3AgPT09ICdsZWZ0JyA/IHhVbml0IDogeVVuaXQpO1xuICAgICAgICAgICAgfSwgXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICAgICAgICAgIGVhc2luZzogZWFzaW5nRm5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc0FuaW1hdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnByZXRlci53YWl0Q291bnRlciAtPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIFxuICAgICAgICBpZiAoIWlzQW5pbWF0aW9uKSB7XG4gICAgICAgICAgICBpbnRlcnByZXRlci53YWl0Q291bnRlciArPSAxO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0cmFuc2Zvcm0oXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgMSxcbiAgICAgICAgICAgIGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gdjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICAgICAgICAgIGVhc2luZzogZWFzaW5nRm5cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFpc0FuaW1hdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnByZXRlci53YWl0Q291bnRlciAtPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZG9OZXh0OiB0cnVlXG4gICAgfTtcbn07XG5cbkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGhpcy5lbGVtZW50VHlwZSB8fCBcImRpdlwiKTtcbiAgICBcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgdGhpcy5lbGVtZW50LmRyYWdnYWJsZSA9IGZhbHNlO1xuICAgIFxuICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImFzc2V0XCIpO1xuICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0aGlzLmNzc2lkKTtcbiAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS13c2UtYXNzZXQtbmFtZVwiLCB0aGlzLm5hbWUpO1xuICAgIFxuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuekluZGV4ID0gdGhpcy56O1xuICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IHRoaXMuaGVpZ2h0O1xuICAgIFxuICAgIHRoaXMuc3RhZ2UuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50KTtcbn07XG5cbkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9tb3ZlVG9Qb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgeCwgeSwgeFVuaXQsIHlVbml0O1xuICAgIHZhciBlbGVtZW50ID0gdGhpcy5lbGVtZW50O1xuICAgIFxuICAgIHggPSBwYXJzZUludCh0aGlzLngsIDEwKTtcbiAgICB5ID0gcGFyc2VJbnQodGhpcy55LCAxMCk7XG4gICAgeFVuaXQgPSBleHRyYWN0VW5pdCh0aGlzLngpIHx8IFwicHhcIjtcbiAgICB5VW5pdCA9IGV4dHJhY3RVbml0KHRoaXMueSkgfHwgXCJweFwiO1xuICAgIFxuICAgIGlmICh4VW5pdCA9PT0gXCIlXCIpIHtcbiAgICAgICAgeCA9ICh0aGlzLnN0YWdlLm9mZnNldFdpZHRoIC8gMTAwKSAqIHg7XG4gICAgfVxuICAgIFxuICAgIGlmICh5VW5pdCA9PT0gXCIlXCIpIHtcbiAgICAgICAgeSA9ICh0aGlzLnN0YWdlLm9mZnNldEhlaWdodCAvIDEwMCkgKiB5O1xuICAgIH1cbiAgICBcbiAgICB4ID0gYW5jaG9yZWRWYWx1ZSh4LCB0aGlzLnhBbmNob3IsIHRoaXMuYm94V2lkdGggfHwgdGhpcy5lbGVtZW50Lm9mZnNldFdpZHRoKTtcbiAgICB5ID0gYW5jaG9yZWRWYWx1ZSh5LCB0aGlzLnlBbmNob3IsIHRoaXMuYm94SGVpZ2h0IHx8IHRoaXMuZWxlbWVudC5vZmZzZXRIZWlnaHQpO1xuICAgIFxuICAgIGlmICh4VW5pdCA9PT0gXCIlXCIpIHtcbiAgICAgICAgeCA9IHggLyAodGhpcy5zdGFnZS5vZmZzZXRXaWR0aCAvIDEwMCk7XG4gICAgfVxuICAgIFxuICAgIGlmICh5VW5pdCA9PT0gXCIlXCIpIHtcbiAgICAgICAgeSA9IHkgLyAodGhpcy5zdGFnZS5vZmZzZXRIZWlnaHQgLyAxMDApO1xuICAgIH1cbiAgICBcbiAgICBlbGVtZW50LnN0eWxlLmxlZnQgPSBcIlwiICsgeCArIHhVbml0O1xuICAgIGVsZW1lbnQuc3R5bGUudG9wID0gXCJcIiArIHkgKyB5VW5pdDtcbn07XG5cbi8vXG4vLyBDYWxjdWxhdGVzIC5ib3hXaWR0aCBhbmQgLmJveEhlaWdodCBieSBmaW5kaW5nIHRoZSBoaWdoZXN0IHdpZHRoIGFuZCBoZWlnaHRcbi8vIG9mIHRoZSBlbGVtZW50J3MgY2hpbGRyZW4gZGVwZW5kaW5nIG9uIHRoZSBzZWxlY3RvcnMgaW4gLl9ib3hTaXplU2VsZWN0b3JzLlxuLy9cbkRpc3BsYXlPYmplY3QucHJvdG90eXBlLl9jYWxjdWxhdGVCb3hTaXplID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciB3aWR0aCA9IDA7XG4gICAgdmFyIGhlaWdodCA9IDA7XG4gICAgdmFyIGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQ7XG4gICAgXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KHRoaXMuX2JveFNpemVTZWxlY3RvcnMpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5fYm94U2l6ZVNlbGVjdG9ycy5mb3JFYWNoKGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuICAgICAgICBcbiAgICAgICAgW10uZm9yRWFjaC5jYWxsKGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvciksIGZ1bmN0aW9uIChpbWcpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGltZy5vZmZzZXRXaWR0aCA+IHdpZHRoKSB7XG4gICAgICAgICAgICAgICAgd2lkdGggPSBpbWcub2Zmc2V0V2lkdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChpbWcub2Zmc2V0SGVpZ2h0ID4gaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgaGVpZ2h0ID0gaW1nLm9mZnNldEhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgIH0pO1xuICAgIFxuICAgIHRoaXMuYm94V2lkdGggPSB3aWR0aDtcbiAgICB0aGlzLmJveEhlaWdodCA9IGhlaWdodDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRGlzcGxheU9iamVjdDtcbiIsIi8qIGVzbGludCBuby1jb25zb2xlOiBvZmYgKi9cblxudmFyIGFqYXggPSByZXF1aXJlKFwiZWFzeS1hamF4XCIpO1xudmFyIERhdGFCdXMgPSByZXF1aXJlKFwiZGF0YWJ1c1wiKTtcblxudmFyIHRvb2xzID0gcmVxdWlyZShcIi4vdG9vbHMvdG9vbHNcIik7XG52YXIgbG9hZGVyID0gcmVxdWlyZShcIi4vbG9hZGVyXCIpO1xudmFyIEtleXMgPSByZXF1aXJlKFwiLi9LZXlzXCIpO1xudmFyIEludGVycHJldGVyID0gcmVxdWlyZShcIi4vSW50ZXJwcmV0ZXJcIik7XG52YXIgYnVzID0gcmVxdWlyZShcIi4vYnVzXCIpO1xuXG52YXIgdHJ1dGh5ID0gdG9vbHMudHJ1dGh5O1xuXG4vKipcbiAqIENvbnN0cnVjdG9yIHVzZWQgdG8gY3JlYXRlIGluc3RhbmNlcyBvZiBnYW1lcy5cbiAqIFxuICogWW91IGNhbiBjb25maWd1cmUgdGhlIGdhbWUgaW5zdGFuY2UgdXNpbmcgdGhlIGNvbmZpZyBvYmplY3RcbiAqIHRoYXQgY2FuIGJlIHN1cHBsaWVkIGFzIGEgcGFyYW1ldGVyIHRvIHRoZSBjb25zdHJ1Y3RvciBmdW5jdGlvbi5cbiAqIFxuICogVGhlIG9wdGlvbnMgYXJlOlxuICogIC0gdXJsOiBbc3RyaW5nXSBUaGUgVVJMIG9mIHRoZSBXZWJTdG9yeSBmaWxlLlxuICogIC0gZGVidWc6IFtib29sXSBTaG91bGQgdGhlIGdhbWUgYmUgcnVuIGluIGRlYnVnIG1vZGU/IChub3QgdXNlZCB5ZXQpXG4gKiAgLSBob3N0OiBbb2JqZWN0XSBUaGUgSE9TVCBvYmplY3QgZm9yIHRoZSBMb2NhbENvbnRhaW5lciBcbiAqICAgICAgdmVyc2lvbi4gT3B0aW9uYWwuXG4gKiBcbiAqIEBldmVudCB3c2UuZ2FtZS5jb25zdHJ1Y3RvckBXU0UuYnVzXG4gKiBAcGFyYW0gYXJncyBBIGNvbmZpZyBvYmplY3QuIFNlZSBhYm92ZSBmb3IgZGV0YWlscy5cbiAqL1xuZnVuY3Rpb24gR2FtZSAoYXJncykge1xuICAgIFxuICAgIHZhciBob3N0O1xuICAgIFxuICAgIGJ1cy50cmlnZ2VyKFwid3NlLmdhbWUuY29uc3RydWN0b3JcIiwge2FyZ3M6IGFyZ3MsIGdhbWU6IHRoaXN9KTtcbiAgICBcbiAgICBhcmdzID0gYXJncyB8fCB7fTtcbiAgICB0aGlzLmJ1cyA9IG5ldyBEYXRhQnVzKCk7XG4gICAgdGhpcy51cmwgPSBhcmdzLnVybCB8fCBcImdhbWUueG1sXCI7XG4gICAgdGhpcy5nYW1lSWQgPSBhcmdzLmdhbWVJZCB8fCBudWxsO1xuICAgIHRoaXMud3MgPSBudWxsO1xuICAgIHRoaXMuZGVidWcgPSBhcmdzLmRlYnVnID09PSB0cnVlID8gdHJ1ZSA6IGZhbHNlO1xuICAgIFxuICAgIGhvc3QgPSBhcmdzLmhvc3QgfHwgZmFsc2U7XG4gICAgdGhpcy5ob3N0ID0gaG9zdDtcbiAgICBcbiAgICBpZiAodGhpcy5nYW1lSWQpIHtcbiAgICAgICAgbG9hZGVyLmdlbmVyYXRlRnJvbVN0cmluZyhcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZ2FtZUlkKS5pbm5lckhUTUwsXG4gICAgICAgICAgICB0aGlzLmxvYWQuYmluZCh0aGlzKVxuICAgICAgICApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKGhvc3QpIHtcbiAgICAgICAgICAgIGxvYWRlci5nZW5lcmF0ZUZyb21TdHJpbmcoaG9zdC5nZXQodGhpcy51cmwpLCB0aGlzLmxvYWQuYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsb2FkZXIuZ2VuZXJhdGVHYW1lRmlsZSh0aGlzLnVybCwgdGhpcy5sb2FkLmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHRoaXMuaW50ZXJwcmV0ZXIgPSBuZXcgSW50ZXJwcmV0ZXIodGhpcywge1xuICAgICAgICBkYXRhc291cmNlOiBhcmdzLmRhdGFzb3VyY2VcbiAgICB9KTtcbiAgICBcbiAgICB0aGlzLmtleXMgPSBuZXcgS2V5cygpO1xuICAgIHRoaXMubGlzdGVuZXJzU3Vic2NyaWJlZCA9IGZhbHNlO1xuICAgIC8vY29uc29sZS5sb2coXCJ0aGlzLmludGVycHJldGVyOiBcIiwgdGhpcy5pbnRlcnByZXRlcik7XG4gICAgXG4gICAgdGhpcy5idXMuc3Vic2NyaWJlKFxuICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJNZXNzYWdlOiBcIiArIGRhdGEpO1xuICAgICAgICB9LCBcbiAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIubWVzc2FnZVwiXG4gICAgKTtcbiAgICBcbiAgICB0aGlzLmJ1cy5zdWJzY3JpYmUoXG4gICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBcIiArIGRhdGEubWVzc2FnZSk7XG4gICAgICAgIH0sIFxuICAgICAgICBcIndzZS5pbnRlcnByZXRlci5lcnJvclwiXG4gICAgKTtcbiAgICBcbiAgICB0aGlzLmJ1cy5zdWJzY3JpYmUoXG4gICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIldhcm5pbmc6IFwiICsgZGF0YS5tZXNzYWdlLCBkYXRhLmVsZW1lbnQpO1xuICAgICAgICB9LCBcbiAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIud2FybmluZ1wiXG4gICAgKTtcbn1cblxuLyoqXG4gKiBMb2FkcyB0aGUgV2ViU3RvcnkgZmlsZSB1c2luZyB0aGUgQUpBWCBmdW5jdGlvbiBhbmQgdHJpZ2dlcnNcbiAqIHRoZSBnYW1lIGluaXRpYWxpemF0aW9uLlxuICovXG5HYW1lLnByb3RvdHlwZS5sb2FkID0gZnVuY3Rpb24gKGdhbWVEb2N1bWVudCkge1xuICAgIHRoaXMud3MgPSBnYW1lRG9jdW1lbnQ7XG4gICAgdGhpcy5pbml0KCk7XG59O1xuXG5HYW1lLnByb3RvdHlwZS5sb2FkRnJvbVVybCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgICBcbiAgICAvL2NvbnNvbGUubG9nKFwiTG9hZGluZyBnYW1lIGZpbGUuLi5cIik7XG4gICAgdmFyIGZuLCBzZWxmO1xuICAgIFxuICAgIHRoaXMudXJsID0gdXJsIHx8IHRoaXMudXJsO1xuICAgIFxuICAgIHNlbGYgPSB0aGlzO1xuICAgIFxuICAgIGZuID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICBzZWxmLndzID0gb2JqLnJlc3BvbnNlWE1MO1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiUmVzcG9uc2UgWE1MOiBcIiArIG9iai5yZXNwb25zZVhNTCk7XG4gICAgICAgIHNlbGYuaW5pdCgpO1xuICAgIH07XG4gICAgXG4gICAgYWpheC5nZXQodGhpcy51cmwsIG51bGwsIGZuKTtcbiAgICBcbn07XG5cbi8qKlxuICogSW5pdGlhbGl6ZXMgdGhlIGdhbWUgaW5zdGFuY2UuXG4gKi9cbkdhbWUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIHdzLCBzdGFnZSwgc3RhZ2VFbGVtZW50cywgc3RhZ2VJbmZvLCB3aWR0aCwgaGVpZ2h0LCBpZCwgYWxpZ25GbiwgcmVzaXplRm47XG4gICAgXG4gICAgd3MgPSB0aGlzLndzO1xuICAgIFxuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgcGFyc2VFcnJvcnMgPSB3cy5nZXRFbGVtZW50c0J5VGFnTmFtZShcInBhcnNlcmVycm9yXCIpO1xuICAgICAgICBcbiAgICAgICAgY29uc29sZS5sb2coXCJwYXJzZXJlcnJvcjpcIiwgcGFyc2VFcnJvcnMpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHBhcnNlRXJyb3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5pbm5lckhUTUwgPSBcIlwiICtcbiAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInBhcnNlRXJyb3JcIj4nK1xuICAgICAgICAgICAgICAgICAgICBcIjxoMT5DYW5ub3QgcGFyc2UgV2ViU3RvcnkgZmlsZSE8L2gzPlwiICtcbiAgICAgICAgICAgICAgICAgICAgXCI8cD5Zb3VyIFdlYlN0b3J5IGZpbGUgaXMgbWFsLWZvcm1lZCBYTUwgYW5kIGNvbnRhaW5zIHRoZXNlIGVycm9yczo8L3A+XCIgK1xuICAgICAgICAgICAgICAgICAgICAnPHByZSBjbGFzcz1cImVycm9yc1wiPicgKyBwYXJzZUVycm9yc1swXS5pbm5lckhUTUwgKyAnPC9wcmU+JyArXG4gICAgICAgICAgICAgICAgJzwvZGl2Pic7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBwYXJzZSBnYW1lIGZpbGUsIG5vdCB3ZWxsLWZvcm1lZCBYTUw6XCIsIHBhcnNlRXJyb3JzWzBdKTtcbiAgICAgICAgfVxuICAgIH0oKSk7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgICAgc3RhZ2VFbGVtZW50cyA9IHdzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic3RhZ2VcIik7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgIH1cbiAgICBcbiAgICB3aWR0aCA9IFwiODAwcHhcIjtcbiAgICBoZWlnaHQgPSBcIjQ4MHB4XCI7XG4gICAgaWQgPSBcIlN0YWdlXCI7XG4gICAgXG4gICAgaWYgKCFzdGFnZUVsZW1lbnRzIHx8IHN0YWdlRWxlbWVudHMubGVuZ3RoIDwgMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBzdGFnZSBkZWZpbml0aW9uIGZvdW5kIVwiKTtcbiAgICB9XG4gICAgXG4gICAgc3RhZ2VJbmZvID0gc3RhZ2VFbGVtZW50c1swXTtcbiAgICB3aWR0aCA9IHN0YWdlSW5mby5nZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiKSB8fCB3aWR0aDtcbiAgICBoZWlnaHQgPSBzdGFnZUluZm8uZ2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIpIHx8IGhlaWdodDtcbiAgICBpZCA9IHN0YWdlSW5mby5nZXRBdHRyaWJ1dGUoXCJpZFwiKSB8fCBpZDtcbiAgICBcbiAgICAvLyBDcmVhdGUgdGhlIHN0YWdlIGVsZW1lbnQgb3IgaW5qZWN0IGludG8gZXhpc3Rpbmcgb25lP1xuICAgIGlmIChzdGFnZUluZm8uZ2V0QXR0cmlidXRlKFwiY3JlYXRlXCIpID09PSBcInllc1wiKSB7XG4gICAgICAgIHN0YWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgc3RhZ2Uuc2V0QXR0cmlidXRlKFwiaWRcIiwgaWQpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHN0YWdlKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHN0YWdlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpO1xuICAgIH1cbiAgICBcbiAgICBzdGFnZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIldTRVN0YWdlXCIpO1xuICAgIFxuICAgIHN0YWdlLnN0eWxlLndpZHRoID0gd2lkdGg7XG4gICAgc3RhZ2Uuc3R5bGUuaGVpZ2h0ID0gaGVpZ2h0O1xuICAgIFxuICAgIC8vIEFsaWducyB0aGUgc3RhZ2UgdG8gYmUgYWx3YXlzIGluIHRoZSBjZW50ZXIgb2YgdGhlIGJyb3dzZXIgd2luZG93LlxuICAgIC8vIE11c3QgYmUgc3BlY2lmaWVkIGluIHRoZSBnYW1lIGZpbGUuXG4gICAgYWxpZ25GbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBkaW0gPSB0b29scy5nZXRXaW5kb3dEaW1lbnNpb25zKCk7XG4gICAgICAgIFxuICAgICAgICBzdGFnZS5zdHlsZS5sZWZ0ID0gKGRpbS53aWR0aCAvIDIpIC0gKHBhcnNlSW50KHdpZHRoLCAxMCkgLyAyKSArICdweCc7XG4gICAgICAgIHN0YWdlLnN0eWxlLnRvcCA9IChkaW0uaGVpZ2h0IC8gMikgLSAocGFyc2VJbnQoaGVpZ2h0LCAxMCkgLyAyKSArICdweCc7XG4gICAgfTtcbiAgICBcbiAgICBpZiAoc3RhZ2VJbmZvLmdldEF0dHJpYnV0ZShcImNlbnRlclwiKSA9PT0gXCJ5ZXNcIikge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgYWxpZ25Gbik7XG4gICAgICAgIGFsaWduRm4oKTtcbiAgICB9XG4gICAgXG4gICAgLy8gUmVzaXplcyB0aGUgc3RhZ2UgdG8gZml0IHRoZSBicm93c2VyIHdpbmRvdyBkaW1lbnNpb25zLiBNdXN0IGJlXG4gICAgLy8gc3BlY2lmaWVkIGluIHRoZSBnYW1lIGZpbGUuXG4gICAgcmVzaXplRm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiUmVzaXppbmcuLi5cIik7XG4gICAgICAgIHRvb2xzLmZpdFRvV2luZG93KHN0YWdlLCBwYXJzZUludCh3aWR0aCwgMTApLCBwYXJzZUludChoZWlnaHQsIDEwKSk7XG4gICAgfTtcbiAgICBcbiAgICBpZiAoc3RhZ2VJbmZvLmdldEF0dHJpYnV0ZShcInJlc2l6ZVwiKSA9PT0gXCJ5ZXNcIikge1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgcmVzaXplRm4pO1xuICAgICAgICByZXNpemVGbigpO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLnN0YWdlID0gc3RhZ2U7XG4gICAgLy8gICAgIHN0YWdlLm9uY2xpY2sgPSBmdW5jdGlvbigpIHsgc2VsZi5pbnRlcnByZXRlci5uZXh0KCk7IH07XG4gICAgXG4gICAgdGhpcy5hcHBseVNldHRpbmdzKCk7XG4gICAgXG4gICAgLy8gVGhpcyBzZWN0aW9uIG9ubHkgYXBwbGllcyB3aGVuIHRoZSBlbmdpbmUgaXMgdXNlZCBpbnNpZGVcbiAgICAvLyB0aGUgbG9jYWwgY29udGFpbmVyIGFwcC5cbiAgICBpZiAodGhpcy5ob3N0KSB7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmhvc3Qud2luZG93LndpZHRoID0gcGFyc2VJbnQod2lkdGgsIDEwKTtcbiAgICAgICAgdGhpcy5ob3N0LndpbmRvdy5oZWlnaHQgPSBwYXJzZUludChoZWlnaHQsIDEwKTtcbiAgICAgICAgXG4gICAgICAgIChmdW5jdGlvbiAoc2VsZikge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgZG9SZXNpemUgPSB0cnV0aHkoc2VsZi5nZXRTZXR0aW5nKFwiaG9zdC5zdGFnZS5yZXNpemVcIikpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIWRvUmVzaXplKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXNpemluZy4uLlwiKTtcbiAgICAgICAgICAgICAgICB0b29scy5maXRUb1dpbmRvdyhzdGFnZSwgcGFyc2VJbnQod2lkdGgsIDEwKSwgcGFyc2VJbnQoaGVpZ2h0LCAxMCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0odGhpcykpO1xuICAgIH1cbn07XG5cbi8qKlxuICogUmV0dXJucyB0aGUgdmFsdWUgb2YgYSBzZXR0aW5nIGFzIHNwZWNpZmllZCBpbiB0aGUgV2ViU3RvcnkgZmlsZS5cbiAqIEBwYXJhbSBuYW1lIFtzdHJpbmddIFRoZSBuYW1lIG9mIHRoZSBzZXR0aW5nLlxuICogQHJldHVybiBbbWl4ZWRdIFRoZSB2YWx1ZSBvZiB0aGUgc2V0dGluZyBvciBudWxsLlxuICovXG5HYW1lLnByb3RvdHlwZS5nZXRTZXR0aW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBcbiAgICB2YXIgcmV0LCBzZXR0aW5ncywgaSwgbGVuLCBjdXIsIGN1ck5hbWU7XG4gICAgXG4gICAgc2V0dGluZ3MgPSB0aGlzLndzLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2V0dGluZ1wiKTtcbiAgICBcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBzZXR0aW5ncy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICBcbiAgICAgICAgY3VyID0gc2V0dGluZ3NbaV07XG4gICAgICAgIGN1ck5hbWUgPSBjdXIuZ2V0QXR0cmlidXRlKFwibmFtZVwiKSB8fCBudWxsO1xuICAgICAgICBcbiAgICAgICAgaWYgKGN1ck5hbWUgIT09IG51bGwgJiYgY3VyTmFtZSA9PT0gbmFtZSkge1xuICAgICAgICAgICAgcmV0ID0gY3VyLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpIHx8IG51bGw7XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBudWxsO1xufTtcblxuLy8gRklYTUU6IGltcGxlbWVudC4uLlxuR2FtZS5wcm90b3R5cGUuYXBwbHlTZXR0aW5ncyA9IGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB0aGlzLndlYkluc3BlY3RvckVuYWJsZWQgPSB0cnV0aHkodGhpcy5nZXRTZXR0aW5nKFwiaG9zdC5pbnNwZWN0b3IuZW5hYmxlXCIpKTtcbiAgICBcbiAgICBpZiAodGhpcy5ob3N0KSB7XG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy53ZWJJbnNwZWN0b3JFbmFibGVkID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmhvc3QuaW5zcGVjdG9yLnNob3coKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKlxuICogVXNlIHRoaXMgbWV0aG9kIHRvIHN0YXJ0IHRoZSBnYW1lLiBUaGUgV2ViU3RvcnkgZmlsZSBtdXN0IGhhdmVcbiAqIGJlZW4gc3VjY2Vzc2Z1bGx5IGxvYWRlZCBmb3IgdGhpcyB0byB3b3JrLlxuICovXG5HYW1lLnByb3RvdHlwZS5zdGFydCA9IGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgZm4sIGNvbnRleHRtZW51X3Byb3h5LCBzZWxmO1xuICAgIFxuICAgIHNlbGYgPSB0aGlzO1xuICAgIFxuICAgIGlmICh0aGlzLndzID09PSBudWxsKSB7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gc2V0VGltZW91dChcbiAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnN0YXJ0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuICAgIFxuICAgIC8vIExpc3RlbmVyIHRoYXQgc2V0cyB0aGUgaW50ZXJwcmV0ZXIncyBzdGF0ZSBtYWNoaW5lIHRvIHRoZSBuZXh0IHN0YXRlXG4gICAgLy8gaWYgdGhlIGN1cnJlbnQgc3RhdGUgaXMgbm90IHBhdXNlIG9yIHdhaXQgbW9kZS5cbiAgICAvLyBUaGlzIGZ1bmN0aW9uIGdldHMgZXhlY3V0ZWQgd2hlbiBhIHVzZXIgY2xpY2tzIG9uIHRoZSBzdGFnZS5cbiAgICBmbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXG4gICAgICAgIGlmIChzZWxmLmludGVycHJldGVyLnN0YXRlID09PSBcInBhdXNlXCIgfHwgc2VsZi5pbnRlcnByZXRlci53YWl0Q291bnRlciA+IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIk5leHQgdHJpZ2dlcmVkIGJ5IHVzZXIuLi5cIik7XG4gICAgICAgIHNlbGYuaW50ZXJwcmV0ZXIubmV4dCh0cnVlKTtcbiAgICB9O1xuICAgIFxuICAgIGNvbnRleHRtZW51X3Byb3h5ID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgXG4gICAgICAgIHNlbGYuYnVzLnRyaWdnZXIoXCJjb250ZXh0bWVudVwiLCB7fSk7XG4gICAgICAgIFxuICAgICAgICAvLyBsZXQncyB0cnkgdG8gcHJldmVudCByZWFsIGNvbnRleHQgbWVudSBzaG93aW5nXG4gICAgICAgIGlmIChlICYmIHR5cGVvZiBlLnByZXZlbnREZWZhdWx0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgXG4gICAgdGhpcy5zdWJzY3JpYmVMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnN0YWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgY29udGV4dG1lbnVfcHJveHkpO1xuICAgICAgICB0aGlzLnN0YWdlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZm4pO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5saXN0ZW5lcnNTdWJzY3JpYmVkID0gdHJ1ZTtcbiAgICB9O1xuICAgIFxuICAgIHRoaXMudW5zdWJzY3JpYmVMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnN0YWdlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NvbnRleHRtZW51JywgY29udGV4dG1lbnVfcHJveHkpO1xuICAgICAgICB0aGlzLnN0YWdlLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZm4pO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5saXN0ZW5lcnNTdWJzY3JpYmVkID0gZmFsc2U7XG4gICAgfTtcbiAgICBcbiAgICB0aGlzLmludGVycHJldGVyLnN0YXJ0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XG4iLCIvKiBlc2xpbnQgbm8tY29uc29sZTogb2ZmICovXG5cbnZhciBlYWNoID0gcmVxdWlyZShcImVuam95LWNvcmUvZWFjaFwiKTtcbnZhciBmaW5kID0gcmVxdWlyZShcImVuam95LWNvcmUvZmluZFwiKTtcbnZhciB0eXBlY2hlY2tzID0gcmVxdWlyZShcImVuam95LXR5cGVjaGVja3NcIik7XG5cbnZhciB1aSA9IHJlcXVpcmUoXCIuL3Rvb2xzL3VpXCIpO1xudmFyIGJ1cyA9IHJlcXVpcmUoXCIuL2J1c1wiKTtcbnZhciB0b29scyA9IHJlcXVpcmUoXCIuL3Rvb2xzL3Rvb2xzXCIpO1xudmFyIGFzc2V0cyA9IHJlcXVpcmUoXCIuL2Fzc2V0c1wiKTtcbnZhciBUcmlnZ2VyID0gcmVxdWlyZShcIi4vVHJpZ2dlclwiKTtcbnZhciBjb21tYW5kcyA9IHJlcXVpcmUoXCIuL2NvbW1hbmRzXCIpO1xudmFyIHNhdmVnYW1lcyA9IHJlcXVpcmUoXCIuL3NhdmVnYW1lc1wiKTtcbnZhciBMb2FkaW5nU2NyZWVuID0gcmVxdWlyZShcIi4vTG9hZGluZ1NjcmVlblwiKTtcbnZhciBMb2NhbFN0b3JhZ2VTb3VyY2UgPSByZXF1aXJlKFwiLi9kYXRhU291cmNlcy9Mb2NhbFN0b3JhZ2VcIik7XG5cbnZhciBpc051bGwgPSB0eXBlY2hlY2tzLmlzTnVsbDtcbnZhciBpc1VuZGVmaW5lZCA9IHR5cGVjaGVja3MuaXNVbmRlZmluZWQ7XG5cbnZhciB3YXJuID0gdG9vbHMud2FybjtcbnZhciB0cnV0aHkgPSB0b29scy50cnV0aHk7XG52YXIgbG9nRXJyb3IgPSB0b29scy5sb2dFcnJvcjtcbnZhciBnZXRTZXJpYWxpemVkTm9kZXMgPSB0b29scy5nZXRTZXJpYWxpemVkTm9kZXM7XG5cbi8qKlxuICogQ29uc3RydWN0b3IgdG8gY3JlYXRlIGFuIGluc3RhbmNlIG9mIHRoZSBlbmdpbmUncyBpbnRlcnByZXRlci5cbiAqIEVhY2ggZ2FtZSBoYXMgaXQncyBvd24gaW50ZXJwcmV0ZXIgaW5zdGFuY2UuIFRoZSBpbnRlcnByZXRlclxuICogcmVhZHMgdGhlIGluZm9ybWF0aW9uIGluIHRoZSBXZWJTdG9yeSBmaWxlIGFuZCB0cmlnZ2VycyB0aGUgZXhlY3V0aW9uXG4gKiBvZiB0aGUgYXBwcm9wcmlhdGUgY29tbWFuZHMuXG4gKiBcbiAqIEBldmVudFxuICogQHBhcmFtIGdhbWUgW29iamVjdF0gVGhlIFdTRS5HYW1lIGluc3RhbmNlIHRoZSBpbnRlcnByZXRlciBiZWxvbmdzIHRvLlxuICovXG5mdW5jdGlvbiBJbnRlcnByZXRlciAoZ2FtZSwgb3B0aW9ucykge1xuICAgIFxuICAgIHZhciBkYXRhc291cmNlLCBrZXk7XG4gICAgXG4gICAgYnVzLnRyaWdnZXIoXCJ3c2UuaW50ZXJwcmV0ZXIuY29uc3RydWN0b3JcIiwge2dhbWU6IGdhbWUsIGludGVycHJldGVyOiB0aGlzfSk7XG4gICAgXG4gICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgICB0aGlzLmFzc2V0cyA9IHt9O1xuICAgIFxuICAgIC8qKiBAdmFyIEluZGV4IG9mIHRoZSBjdXJyZW50bHkgZXhhbWluZWQgZWxlbWVudCBpbnNpZGUgdGhlIGFjdGl2ZSBzY2VuZS4gKi9cbiAgICB0aGlzLmluZGV4ID0gMDtcbiAgICB0aGlzLnZpc2l0ZWRTY2VuZXMgPSBbXTtcbiAgICBcbiAgICAvKiogQHZhciBBIHRleHQgbG9nIG9mIGV2ZXJ5dGhpbmcgdGhhdCBoYXMgYmVlbiBzaG93biBvbiB0ZXh0IGJveGVzLiAqL1xuICAgIHRoaXMubG9nID0gW107XG4gICAgdGhpcy53YWl0Rm9yVGltZXIgPSBmYWxzZTtcbiAgICBcbiAgICAvKiogQHZhciBOdW1iZXIgb2YgYXNzZXRzIHRoYXQgYXJlIGN1cnJlbnRseSBiZWluZyBmZXRjaGVkIGZyb20gdGhlIHNlcnZlci4gKi9cbiAgICB0aGlzLmFzc2V0c0xvYWRpbmcgPSAwO1xuICAgIFxuICAgIC8qKiBAdmFyIFRvdGFsIG51bWJlciBvZiBhc3NldHMgdG8gbG9hZC4gKi9cbiAgICB0aGlzLmFzc2V0c0xvYWRpbmdNYXggPSAwO1xuICAgIFxuICAgIC8qKiBAdmFyIE51bWJlciBvZiBhc3NldHMgYWxyZWFkeSBmZXRjaGVkIGZyb20gdGhlIHNlcnZlci4gKi9cbiAgICB0aGlzLmFzc2V0c0xvYWRlZCA9IDA7XG4gICAgXG4gICAgLyoqIEB2YXIgVGhlIHRpbWVzdGFtcCBmcm9tIHdoZW4gdGhlIGdhbWUgc3RhcnRzLiBVc2VkIGZvciBzYXZlZ2FtZXMuICovXG4gICAgdGhpcy5zdGFydFRpbWUgPSAwO1xuICAgIFxuICAgIC8qKiBAdmFyIEhvbGRzICdub3JtYWwnIHZhcmlhYmxlcy4gVGhlc2UgYXJlIG9ubHkgcmVtZW1iZXJlZCBmb3IgdGhlIGN1cnJlbnQgcm91dGUuICovXG4gICAgdGhpcy5ydW5WYXJzID0ge307XG4gICAgXG4gICAgLyoqIEB2YXIgVGhlIGNhbGwgc3RhY2sgZm9yIHN1YiBzY2VuZXMuICovXG4gICAgdGhpcy5jYWxsU3RhY2sgPSBbXTtcbiAgICB0aGlzLmtleXNEaXNhYmxlZCA9IDA7IC8vIGlmIHRoaXMgaXMgPiAwLCBrZXkgdHJpZ2dlcnMgc2hvdWxkIGJlIGRpc2FibGVkXG4gICAgXG4gICAgLyoqIEB2YXIgVGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIGludGVycHJldGVyJ3Mgc3RhdGUgbWFjaGluZS4gXG4gICAgICogICAnbGlzdGVuJyBtZWFucyB0aGF0IGNsaWNraW5nIG9uIHRoZSBzdGFnZSBvciBnb2luZyB0byB0aGUgbmV4dCBsaW5lXG4gICAgICogICBpcyBwb3NzaWJsZS4gXG4gICAgICovXG4gICAgdGhpcy5zdGF0ZSA9IFwibGlzdGVuXCI7XG4gICAgXG4gICAgLyoqIEB2YXIgQWxsIGZ1bmN0aW9ucyB0aGF0IHJlcXVpcmUgdGhlIGludGVycHJldGVyJ3Mgc3RhdGUgbWFjaGluZVxuICAgICAqICAgdG8gd2FpdC4gVGhlIGdhbWUgd2lsbCBvbmx5IGNvbnRpbnVlIHdoZW4gdGhpcyBpcyBzZXQgdG8gMC5cbiAgICAgKiAgIFRoaXMgY2FuIGJlIHVzZWQgdG8gcHJldmVudCBlLmcuIHRoYXQgdGhlIHN0b3J5IGNvbnRpbnVlcyBpblxuICAgICAqICAgdGhlIGJhY2tncm91bmQgd2hpbGUgYSBkaWFsb2cgaXMgZGlzcGxheWVkIGluIHRoZSBmb3JlZ3JvdW5kLlxuICAgICAqL1xuICAgIHRoaXMud2FpdENvdW50ZXIgPSAwO1xuICAgIFxuICAgIC8qKiBAdmFyIFNob3VsZCB0aGUgZ2FtZSBiZSBydW4gaW4gZGVidWcgbW9kZT8gKi9cbiAgICB0aGlzLmRlYnVnID0gZ2FtZS5kZWJ1ZyA9PT0gdHJ1ZSA/IHRydWUgOiBmYWxzZTtcblxuICAgIC8vIFRoZSBkYXRhc291cmNlIHRvIHVzZSBmb3Igc2F2aW5nIGdhbWVzIGFuZCBnbG9iYWwgdmFyaWFibGVzLlxuICAgIC8vIEhhcmRjb2RlZCB0byBsb2NhbFN0b3JhZ2UgZm9yIG5vdy5cbiAgICBkYXRhc291cmNlID0gb3B0aW9ucy5kYXRhc291cmNlIHx8IG5ldyBMb2NhbFN0b3JhZ2VTb3VyY2UoKTtcbiAgICB0aGlzLmRhdGFzb3VyY2UgPSBkYXRhc291cmNlO1xuICAgIFxuICAgIC8vIEVhY2ggZ2FtZSBtdXN0IGhhdmUgaXQncyBvd24gdW5pcXVlIHN0b3JhZ2Uga2V5IHNvIHRoYXQgbXVsdGlwbGVcbiAgICAvLyBnYW1lcyBjYW4gYmUgcnVuIG9uIHRoZSBzYW1lIHdlYiBwYWdlLlxuICAgIGtleSA9IFwid3NlX2dsb2JhbHNfXCIgKyBsb2NhdGlvbi5wYXRobmFtZSArIFwiX1wiICsgdGhpcy5nYW1lLnVybCArIFwiX1wiO1xuICAgIFxuICAgIC8qKiBAdmFyIFN0b3JlcyBnbG9iYWwgdmFyaWFibGVzLiBUaGF0IGlzLCB2YXJpYWJsZXMgdGhhdCB3aWxsXG4gICAgICogICBiZSByZW1lbWJlcmVkIGluZGVwZW5kZW50bHkgb2YgdGhlIGN1cnJlbnQgc3RhdGUgb2YgdGhlIGdhbWUuXG4gICAgICogICBDYW4gYmUgdXNlZCBmb3IgdW5sb2NraW5nIGhpZGRlbiBmZWF0dXJlcyBhZnRlciB0aGUgZmlyc3RcbiAgICAgKiAgIHBsYXl0aHJvdWdoIGV0Yy5cbiAgICAgKi9cbiAgICB0aGlzLmdsb2JhbFZhcnMgPSB7XG4gICAgICAgIFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uIChuYW1lLCB2YWx1ZSkge1xuICAgICAgICAgICAgZGF0YXNvdXJjZS5zZXQoa2V5ICsgbmFtZSwgdmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIGRhdGFzb3VyY2UuZ2V0KGtleSArIG5hbWUpO1xuICAgICAgICB9LFxuICAgICAgICBcbiAgICAgICAgaGFzOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoaXNOdWxsKGRhdGFzb3VyY2UuZ2V0KGtleSArIG5hbWUpKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFxuICAgIHRoaXMuX2xvYWRpbmdTY3JlZW4gPSBuZXcgTG9hZGluZ1NjcmVlbigpO1xuICAgIFxuICAgIGlmICh0aGlzLmRlYnVnID09PSB0cnVlKSB7XG4gICAgICAgIHRoaXMuZ2FtZS5idXMuZGVidWcgPSB0cnVlO1xuICAgIH1cbn1cblxuSW50ZXJwcmV0ZXIucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciBzZWxmLCBmbiwgbWFrZUtleUZuLCBidXMsIHN0YXJ0VGltZSA9IERhdGUubm93KCk7XG4gICAgXG4gICAgdGhpcy5zdG9yeSA9IHRoaXMuZ2FtZS53cztcbiAgICB0aGlzLnN0YWdlID0gdGhpcy5nYW1lLnN0YWdlO1xuICAgIHRoaXMuYnVzID0gdGhpcy5nYW1lLmJ1cztcbiAgICB0aGlzLmluZGV4ID0gMDtcbiAgICB0aGlzLmN1cnJlbnRFbGVtZW50ID0gMDtcbiAgICB0aGlzLnNjZW5lSWQgPSBudWxsO1xuICAgIHRoaXMuc2NlbmVQYXRoID0gW107XG4gICAgdGhpcy5jdXJyZW50Q29tbWFuZHMgPSBbXTtcbiAgICB0aGlzLndhaXQgPSBmYWxzZTtcbiAgICB0aGlzLnN0YXJ0VGltZSA9IE1hdGgucm91bmQoK25ldyBEYXRlKCkgLyAxMDAwKTtcbiAgICB0aGlzLnN0b3BwZWQgPSBmYWxzZTtcbiAgICBcbiAgICBzZWxmID0gdGhpcztcbiAgICBidXMgPSB0aGlzLmJ1cztcbiAgICBcbiAgICB0aGlzLl9zdGFydExvYWRpbmdTY3JlZW4oKTtcbiAgICBcbiAgICAvLyBBZGRzIGxvY2F0aW9uIGluZm8gdG8gd2FybmluZ3MgYW5kIGVycm9ycy5cbiAgICBmbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgc2VjdGlvbiwgZWxlbWVudCwgbXNnO1xuICAgICAgICBcbiAgICAgICAgZGF0YSA9IGRhdGEgfHwge307XG4gICAgICAgIGVsZW1lbnQgPSBkYXRhLmVsZW1lbnQgfHwgbnVsbDtcbiAgICAgICAgc2VjdGlvbiA9IG51bGw7XG4gICAgICAgIFxuICAgICAgICBpZiAoZWxlbWVudCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHNlY3Rpb24gPSBkYXRhLmVsZW1lbnQudGFnTmFtZSA9PT0gXCJhc3NldFwiID8gXCJhc3NldHNcIiA6IG51bGw7XG4gICAgICAgICAgICAgICAgc2VjdGlvbiA9IGRhdGEuZWxlbWVudC5wYXJlbnQudGFnTmFtZSA9PT0gXCJzZXR0aW5nc1wiID8gXCJzZXR0aW5nc1wiIDogbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgLy8gZG8gbm90aGluZ1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBzZWN0aW9uID0gc2VjdGlvbiB8fCBcInNjZW5lc1wiO1xuICAgICAgICBcbiAgICAgICAgc3dpdGNoIChzZWN0aW9uKSB7XG4gICAgICAgICAgICBjYXNlIFwiYXNzZXRzXCI6XG4gICAgICAgICAgICAgICAgbXNnID0gXCIgICAgICAgICBFbmNvdW50ZXJlZCBpbiBzZWN0aW9uICdhc3NldHMnLlwiO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBcInNldHRpbmdzXCI6XG4gICAgICAgICAgICAgICAgbXNnID0gXCIgICAgICAgICBFbmNvdW50ZXJlZCBpbiBzZWN0aW9uICdzZXR0aW5ncycuXCI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIG1zZyA9IFwiICAgICAgICAgRW5jb3VudGVyZWQgaW4gc2NlbmUgJ1wiICsgc2VsZi5zY2VuZUlkICsgXCInLCBlbGVtZW50IFwiICsgc2VsZi5jdXJyZW50RWxlbWVudCArIFwiLlwiO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgIH07XG4gICAgXG4gICAgYnVzLnN1YnNjcmliZShmbiwgXCJ3c2UuaW50ZXJwcmV0ZXIuZXJyb3JcIik7XG4gICAgYnVzLnN1YnNjcmliZShmbiwgXCJ3c2UuaW50ZXJwcmV0ZXIud2FybmluZ1wiKTtcbiAgICBidXMuc3Vic2NyaWJlKGZuLCBcIndzZS5pbnRlcnByZXRlci5tZXNzYWdlXCIpO1xuICAgIFxuICAgIGJ1cy5zdWJzY3JpYmUoXG4gICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR2FtZSBvdmVyLlwiKTtcbiAgICAgICAgfSwgXG4gICAgICAgIFwid3NlLmludGVycHJldGVyLmVuZFwiXG4gICAgKTtcbiAgICBcbiAgICBidXMuc3Vic2NyaWJlKFxuICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLm51bWJlck9mRnVuY3Rpb25zVG9XYWl0Rm9yICs9IDE7XG4gICAgICAgIH0sIFxuICAgICAgICBcIndzZS5pbnRlcnByZXRlci5udW1iZXJPZkZ1bmN0aW9uc1RvV2FpdEZvci5pbmNyZWFzZVwiXG4gICAgKTtcbiAgICBcbiAgICBidXMuc3Vic2NyaWJlKFxuICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZWxmLm51bWJlck9mRnVuY3Rpb25zVG9XYWl0Rm9yIC09IDE7XG4gICAgICAgIH0sXG4gICAgICAgIFwid3NlLmludGVycHJldGVyLm51bWJlck9mRnVuY3Rpb25zVG9XYWl0Rm9yLmRlY3JlYXNlXCJcbiAgICApO1xuICAgIFxuICAgIGJ1cy5zdWJzY3JpYmUoXG4gICAgICAgIHRoaXMuX2xvYWRpbmdTY3JlZW4uYWRkSXRlbS5iaW5kKHRoaXMuX2xvYWRpbmdTY3JlZW4pLCBcbiAgICAgICAgXCJ3c2UuYXNzZXRzLmxvYWRpbmcuaW5jcmVhc2VcIlxuICAgICk7XG4gICAgXG4gICAgYnVzLnN1YnNjcmliZShcbiAgICAgICAgdGhpcy5fbG9hZGluZ1NjcmVlbi5pdGVtTG9hZGVkLmJpbmQodGhpcy5fbG9hZGluZ1NjcmVlbiksIFxuICAgICAgICBcIndzZS5hc3NldHMubG9hZGluZy5kZWNyZWFzZVwiXG4gICAgKTtcbiAgICBcbiAgICB0aGlzLmJ1aWxkQXNzZXRzKCk7XG4gICAgdGhpcy5jcmVhdGVUcmlnZ2VycygpO1xuICAgIFxuICAgIG1ha2VLZXlGbiA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBidXMudHJpZ2dlcihcbiAgICAgICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQ6IGV2LFxuICAgICAgICAgICAgICAgICAgICBrZXlzOiBzZWxmLmdhbWUua2V5cy5rZXlzXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIFxuICAgIHRoaXMuZ2FtZS5rZXlzLmZvckFsbChtYWtlS2V5Rm4oXCJrZXl1cFwiKSwgXCJ1cFwiKTtcbiAgICB0aGlzLmdhbWUua2V5cy5mb3JBbGwobWFrZUtleUZuKFwia2V5ZG93blwiKSwgXCJkb3duXCIpO1xuICAgIHRoaXMuZ2FtZS5rZXlzLmZvckFsbChtYWtlS2V5Rm4oXCJrZXlwcmVzc1wiKSwgXCJwcmVzc1wiKTtcbiAgICBcbiAgICB0aGlzLmdhbWUuc3Vic2NyaWJlTGlzdGVuZXJzKCk7XG4gICAgXG4gICAgdGhpcy5fYXNzZXRzTG9hZGVkID0gZmFsc2U7XG4gICAgXG4gICAgdGhpcy5fbG9hZGluZ1NjcmVlbi5zdWJzY3JpYmUoXCJmaW5pc2hlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgdGltZSA9IERhdGUubm93KCkgLSBzdGFydFRpbWU7XG4gICAgICAgIFxuICAgICAgICBpZiAoc2VsZi5fYXNzZXRzTG9hZGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHNlbGYuX2Fzc2V0c0xvYWRlZCA9IHRydWU7XG4gICAgICAgIFxuICAgICAgICBzZWxmLmNhbGxPbkxvYWQoKTtcbiAgICAgICAgXG4gICAgICAgIGlmICh0aW1lIDwgMTAwMCkge1xuICAgICAgICAgICAgc2V0VGltZW91dChzZWxmLnJ1blN0b3J5LmJpbmQoc2VsZiksIDEwMDAgLSB0aW1lKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYucnVuU3RvcnkoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIGlmICh0aGlzLl9sb2FkaW5nU2NyZWVuLmNvdW50KCkgPCAxKSB7XG4gICAgICAgIHRoaXMuX2Fzc2V0c0xvYWRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMucnVuU3RvcnkoKTtcbiAgICB9XG59O1xuXG5JbnRlcnByZXRlci5wcm90b3R5cGUuY2FsbE9uTG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICBlYWNoKGZ1bmN0aW9uIChhc3NldCkge1xuICAgICAgICBpZiAodHlwZW9mIGFzc2V0Lm9uTG9hZCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBhc3NldC5vbkxvYWQoKTtcbiAgICAgICAgfVxuICAgIH0sIHRoaXMuYXNzZXRzKTtcbn07XG5cbkludGVycHJldGVyLnByb3RvdHlwZS5ydW5TdG9yeSA9IGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICBpZiAodGhpcy5hc3NldHNMb2FkaW5nID4gMCkge1xuICAgICAgICBzZXRUaW1lb3V0KHRoaXMucnVuU3RvcnkuYmluZCh0aGlzKSwgMTAwKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLmJ1cy50cmlnZ2VyKFwid3NlLmFzc2V0cy5sb2FkaW5nLmZpbmlzaGVkXCIpO1xuICAgIHRoaXMuX2xvYWRpbmdTY3JlZW4uaGlkZSgpO1xuICAgIHRoaXMuc3RhcnRUaW1lID0gTWF0aC5yb3VuZCgrbmV3IERhdGUoKSAvIDEwMDApO1xuICAgIHRoaXMuY2hhbmdlU2NlbmUodGhpcy5nZXRGaXJzdFNjZW5lKCkpO1xufTtcblxuSW50ZXJwcmV0ZXIucHJvdG90eXBlLmdldEZpcnN0U2NlbmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIHNjZW5lcywgbGVuLCBzdGFydFNjZW5lO1xuICAgIFxuICAgIHNjZW5lcyA9IHRoaXMuc3RvcnkuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY2VuZVwiKTtcbiAgICB0aGlzLnNjZW5lcyA9IHNjZW5lcztcbiAgICBsZW4gPSBzY2VuZXMubGVuZ3RoO1xuICAgIFxuICAgIHN0YXJ0U2NlbmUgPSB0aGlzLmdldFNjZW5lQnlJZChcInN0YXJ0XCIpO1xuICAgIFxuICAgIGlmIChzdGFydFNjZW5lICE9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBzdGFydFNjZW5lO1xuICAgIH1cbiAgICBcbiAgICBpZiAobGVuIDwgMSkge1xuICAgICAgICBsb2dFcnJvcih0aGlzLmJ1cywgXCJObyBzY2VuZXMgZm91bmQhXCIpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHNjZW5lc1swXTtcbn07XG5cbkludGVycHJldGVyLnByb3RvdHlwZS5jaGFuZ2VTY2VuZSA9IGZ1bmN0aW9uIChzY2VuZSkge1xuICAgIHRoaXMuY2hhbmdlU2NlbmVOb05leHQoc2NlbmUpO1xuICAgIHRoaXMubmV4dCgpO1xufTtcblxuSW50ZXJwcmV0ZXIucHJvdG90eXBlLmNoYW5nZVNjZW5lTm9OZXh0ID0gZnVuY3Rpb24gKHNjZW5lKSB7XG4gICAgXG4gICAgdmFyIGxlbiwgaWQsIGJ1cyA9IHRoaXMuYnVzO1xuICAgIFxuICAgIGJ1cy50cmlnZ2VyKFxuICAgICAgICBcIndzZS5pbnRlcnByZXRlci5jaGFuZ2VzY2VuZS5iZWZvcmVcIixcbiAgICAgICAge1xuICAgICAgICAgICAgc2NlbmU6IHNjZW5lLFxuICAgICAgICAgICAgaW50ZXJwcmV0ZXI6IHRoaXNcbiAgICAgICAgfSxcbiAgICAgICAgZmFsc2VcbiAgICApO1xuICAgIFxuICAgIGlmIChpc1VuZGVmaW5lZChzY2VuZSkgfHwgaXNOdWxsKHNjZW5lKSkge1xuICAgICAgICBsb2dFcnJvcihidXMsIFwiU2NlbmUgZG9lcyBub3QgZXhpc3QuXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGlkID0gc2NlbmUuZ2V0QXR0cmlidXRlKFwiaWRcIik7XG4gICAgdGhpcy52aXNpdGVkU2NlbmVzLnB1c2goaWQpO1xuICAgIFxuICAgIGlmIChpc051bGwoaWQpKSB7XG4gICAgICAgIGxvZ0Vycm9yKGJ1cywgXCJFbmNvdW50ZXJlZCBzY2VuZSB3aXRob3V0IGlkIGF0dHJpYnV0ZS5cIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgYnVzLnRyaWdnZXIoXCJ3c2UuaW50ZXJwcmV0ZXIubWVzc2FnZVwiLCBcIkVudGVyaW5nIHNjZW5lICdcIiArIGlkICsgXCInLlwiKTtcbiAgICBcbiAgICB3aGlsZSAodGhpcy5zY2VuZVBhdGgubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLnBvcEZyb21DYWxsU3RhY2soKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5jdXJyZW50Q29tbWFuZHMgPSBzY2VuZS5jaGlsZE5vZGVzO1xuICAgIGxlbiA9IHRoaXMuY3VycmVudENvbW1hbmRzLmxlbmd0aDtcbiAgICB0aGlzLmluZGV4ID0gMDtcbiAgICB0aGlzLnNjZW5lSWQgPSBpZDtcbiAgICB0aGlzLnNjZW5lUGF0aCA9IFtdO1xuICAgIHRoaXMuY3VycmVudEVsZW1lbnQgPSAwO1xuICAgIFxuICAgIGlmIChsZW4gPCAxKSB7XG4gICAgICAgIHdhcm4oYnVzLCBcIlNjZW5lICdcIiArIGlkICsgXCInIGlzIGVtcHR5LlwiLCBzY2VuZSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5udW1iZXJPZkZ1bmN0aW9uc1RvV2FpdEZvciA9IDA7XG4gICAgXG4gICAgYnVzLnRyaWdnZXIoXG4gICAgICAgIFwid3NlLmludGVycHJldGVyLmNoYW5nZXNjZW5lLmFmdGVyXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIHNjZW5lOiBzY2VuZSxcbiAgICAgICAgICAgIGludGVycHJldGVyOiB0aGlzXG4gICAgICAgIH0sXG4gICAgICAgIGZhbHNlXG4gICAgKTtcbn07XG5cbkludGVycHJldGVyLnByb3RvdHlwZS5wdXNoVG9DYWxsU3RhY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIG9iaiA9IHt9O1xuICAgIFxuICAgIG9iai5pbmRleCA9IHRoaXMuaW5kZXg7XG4gICAgb2JqLnNjZW5lSWQgPSB0aGlzLnNjZW5lSWQ7XG4gICAgb2JqLnNjZW5lUGF0aCA9IHRoaXMuc2NlbmVQYXRoLnNsaWNlKCk7XG4gICAgb2JqLmN1cnJlbnRFbGVtZW50ID0gdGhpcy5jdXJyZW50RWxlbWVudDtcbiAgICBcbiAgICB0aGlzLmNhbGxTdGFjay5wdXNoKG9iaik7XG59O1xuXG5JbnRlcnByZXRlci5wcm90b3R5cGUucG9wRnJvbUNhbGxTdGFjayA9IGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgdG9wID0gdGhpcy5jYWxsU3RhY2sucG9wKCksIHNjZW5lUGF0aCA9IHRvcC5zY2VuZVBhdGguc2xpY2UoKTtcbiAgICBcbiAgICB0aGlzLmJ1cy50cmlnZ2VyKFxuICAgICAgICBcIndzZS5pbnRlcnByZXRlci5tZXNzYWdlXCIsIFxuICAgICAgICBcIlJldHVybmluZyBmcm9tIHN1YiBzY2VuZSAnXCIgKyB0aGlzLnNjZW5lSWQgKyBcIicgdG8gc2NlbmUgJ1wiICsgdG9wLnNjZW5lSWQgKyBcIicuLi5cIixcbiAgICAgICAgZmFsc2VcbiAgICApO1xuICAgIFxuICAgIHRoaXMuaW5kZXggPSB0b3AuaW5kZXggKyAxO1xuICAgIHRoaXMuc2NlbmVJZCA9IHRvcC5zY2VuZUlkO1xuICAgIHRoaXMuc2NlbmVQYXRoID0gdG9wLnNjZW5lUGF0aDtcbiAgICB0aGlzLmN1cnJlbnRTY2VuZSA9IHRoaXMuZ2V0U2NlbmVCeUlkKHRvcC5zY2VuZUlkKTtcbiAgICB0aGlzLmN1cnJlbnRFbGVtZW50ID0gdG9wLmN1cnJlbnRFbGVtZW50O1xuICAgIFxuICAgIHRoaXMuY3VycmVudENvbW1hbmRzID0gdGhpcy5jdXJyZW50U2NlbmUuY2hpbGROb2RlcztcbiAgICBcbiAgICB3aGlsZSAoc2NlbmVQYXRoLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5jdXJyZW50Q29tbWFuZHMgPSB0aGlzLmN1cnJlbnRDb21tYW5kc1tzY2VuZVBhdGguc2hpZnQoKV0uY2hpbGROb2RlcztcbiAgICB9XG59O1xuXG5JbnRlcnByZXRlci5wcm90b3R5cGUuZ2V0U2NlbmVCeUlkID0gZnVuY3Rpb24gKHNjZW5lTmFtZSkge1xuICAgIFxuICAgIHZhciBzY2VuZSA9IGZpbmQoZnVuY3Rpb24gKGN1cnJlbnQpIHtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnQuZ2V0QXR0cmlidXRlKFwiaWRcIikgPT09IHNjZW5lTmFtZTtcbiAgICB9LCB0aGlzLnNjZW5lcyk7XG4gICAgXG4gICAgaWYgKGlzTnVsbChzY2VuZSkpIHtcbiAgICAgICAgd2Fybih0aGlzLmJ1cywgXCJTY2VuZSAnXCIgKyBzY2VuZU5hbWUgKyBcIicgbm90IGZvdW5kIVwiKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHNjZW5lO1xufTtcblxuSW50ZXJwcmV0ZXIucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbiAodHJpZ2dlcmVkQnlVc2VyKSB7XG4gICAgXG4gICAgdmFyIG5vZGVOYW1lLCBjb21tYW5kLCBjaGVjaywgc2VsZiwgc3RvcE9iaiwgYnVzID0gdGhpcy5idXM7XG4gICAgXG4gICAgc3RvcE9iaiA9IHtcbiAgICAgICAgc3RvcDogZmFsc2VcbiAgICB9O1xuICAgIFxuICAgIHRyaWdnZXJlZEJ5VXNlciA9IHRyaWdnZXJlZEJ5VXNlciA9PT0gdHJ1ZSA/IHRydWUgOiBmYWxzZTtcbiAgICBcbiAgICBidXMudHJpZ2dlcihcIndzZS5pbnRlcnByZXRlci5uZXh0LmJlZm9yZVwiLCB0aGlzLCBmYWxzZSk7XG4gICAgXG4gICAgaWYgKHRyaWdnZXJlZEJ5VXNlciA9PT0gdHJ1ZSkge1xuICAgICAgICBidXMudHJpZ2dlcihcIndzZS5pbnRlcnByZXRlci5uZXh0LnVzZXJcIiwgc3RvcE9iaiwgZmFsc2UpO1xuICAgIH1cbiAgICBcbiAgICBpZiAoc3RvcE9iai5zdG9wID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgc2VsZiA9IHRoaXM7XG4gICAgXG4gICAgaWYgKHRoaXMuc3RhdGUgPT09IFwicGF1c2VcIikge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGlmICh0aGlzLndhaXRGb3JUaW1lciA9PT0gdHJ1ZSB8fCAodGhpcy53YWl0ID09PSB0cnVlICYmIHRoaXMud2FpdENvdW50ZXIgPiAwKSkge1xuICAgICAgICBcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHNlbGYubmV4dCgpOyB9LCAwKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMud2FpdCA9PT0gdHJ1ZSAmJiB0aGlzLm51bWJlck9mRnVuY3Rpb25zVG9XYWl0Rm9yIDwgMSkge1xuICAgICAgICB0aGlzLndhaXQgPSBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5zdG9wcGVkID0gZmFsc2U7XG4gICAgXG4gICAgaWYgKHRoaXMuY2FuY2VsQ2hhckFuaW1hdGlvbikge1xuICAgICAgICB0aGlzLmNhbmNlbENoYXJBbmltYXRpb24oKTtcbiAgICAgICAgdGhpcy5jYW5jZWxDaGFyQW5pbWF0aW9uID0gbnVsbDtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICBpZiAodGhpcy5pbmRleCA+PSB0aGlzLmN1cnJlbnRDb21tYW5kcy5sZW5ndGgpIHtcbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLmNhbGxTdGFjay5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMucG9wRnJvbUNhbGxTdGFjaygpO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHNlbGYubmV4dCgpOyB9LCAwKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBidXMudHJpZ2dlcihcIndzZS5pbnRlcnByZXRlci5uZXh0LmFmdGVyLmVuZFwiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIGJ1cy50cmlnZ2VyKFwid3NlLmludGVycHJldGVyLmVuZFwiLCB0aGlzKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgY29tbWFuZCA9IHRoaXMuY3VycmVudENvbW1hbmRzW3RoaXMuaW5kZXhdO1xuICAgIG5vZGVOYW1lID0gY29tbWFuZC5ub2RlTmFtZTtcbiAgICBcbiAgICAvLyBpZ25vcmUgdGV4dCBhbmQgY29tbWVudCBub2RlczpcbiAgICBpZiAobm9kZU5hbWUgPT09IFwiI3RleHRcIiB8fCBub2RlTmFtZSA9PT0gXCIjY29tbWVudFwiKSB7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluZGV4ICs9IDE7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBzZWxmLm5leHQoKTsgfSwgMCk7XG4gICAgICAgIGJ1cy50cmlnZ2VyKFwid3NlLmludGVycHJldGVyLm5leHQuaWdub3JlXCIsIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgYnVzLnRyaWdnZXIoXCJ3c2UuaW50ZXJwcmV0ZXIubmV4dC5jb21tYW5kXCIsIGNvbW1hbmQpO1xuICAgIHRoaXMuY3VycmVudEVsZW1lbnQgKz0gMTtcbiAgICBjaGVjayA9IHRoaXMucnVuQ29tbWFuZCh0aGlzLmN1cnJlbnRDb21tYW5kc1t0aGlzLmluZGV4XSk7XG4gICAgXG4gICAgY2hlY2sgPSBjaGVjayB8fCB7fTtcbiAgICBjaGVjay5kb05leHQgPSBjaGVjay5kb05leHQgPT09IGZhbHNlID8gZmFsc2UgOiB0cnVlO1xuICAgIGNoZWNrLndhaXQgPSBjaGVjay53YWl0ID09PSB0cnVlID8gdHJ1ZSA6IGZhbHNlO1xuICAgIGNoZWNrLmNoYW5nZVNjZW5lID0gY2hlY2suY2hhbmdlU2NlbmUgfHwgbnVsbDtcbiAgICBcbiAgICBpZiAoY2hlY2sud2FpdCA9PT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLndhaXQgPSB0cnVlO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLmluZGV4ICs9IDE7XG4gICAgXG4gICAgaWYgKGNoZWNrLmNoYW5nZVNjZW5lICE9PSBudWxsKSB7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmNoYW5nZVNjZW5lKGNoZWNrLmNoYW5nZVNjZW5lKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaWYgKGNoZWNrLmRvTmV4dCA9PT0gdHJ1ZSkge1xuICAgICAgICBcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHNlbGYubmV4dCgpOyB9LCAwKTtcbiAgICAgICAgYnVzLnRyaWdnZXIoXCJ3c2UuaW50ZXJwcmV0ZXIubmV4dC5hZnRlci5kb25leHRcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLnN0b3BwZWQgPSB0cnVlO1xuICAgIFxuICAgIGJ1cy50cmlnZ2VyKFwid3NlLmludGVycHJldGVyLm5leHQuYWZ0ZXIubm9uZXh0XCIsIHRoaXMsIGZhbHNlKTtcbn07XG5cbkludGVycHJldGVyLnByb3RvdHlwZS5jaGVja0lmdmFyID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcbiAgICBcbiAgICB2YXIgaWZ2YXIsIGlmdmFsLCBpZm5vdCwgdmFyQ29udGFpbmVyLCBidXMgPSB0aGlzLmJ1cztcbiAgICBcbiAgICBpZnZhciA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwiaWZ2YXJcIikgfHwgbnVsbDtcbiAgICBpZnZhbCA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwiaWZ2YWx1ZVwiKTtcbiAgICBpZm5vdCA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwiaWZub3RcIik7XG4gICAgXG4gICAgaWYgKGlmdmFyICE9PSBudWxsIHx8IGlmdmFsICE9PSBudWxsIHx8IGlmbm90ICE9PSBudWxsKSB7XG4gICAgICAgIFxuICAgICAgICB2YXJDb250YWluZXIgPSB0aGlzLnJ1blZhcnM7XG4gICAgICAgIFxuICAgICAgICBpZiAoIShpZnZhciBpbiB2YXJDb250YWluZXIpKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHdhcm4oYnVzLCBcIlVua25vd24gdmFyaWFibGUgJ1wiICsgaWZ2YXIgK1xuICAgICAgICAgICAgICAgIFwiJyB1c2VkIGluIGNvbmRpdGlvbi4gSWdub3JpbmcgY29tbWFuZC5cIiwgY29tbWFuZCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGJ1cy50cmlnZ2VyKFxuICAgICAgICAgICAgICAgIFwid3NlLmludGVycHJldGVyLnJ1bmNvbW1hbmQuYWZ0ZXIuY29uZGl0aW9uLmVycm9yLmtleVwiLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXI6IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6IGNvbW1hbmRcbiAgICAgICAgICAgICAgICB9LCBcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoaWZub3QgIT09IG51bGwgJiYgKFwiXCIgKyB2YXJDb250YWluZXJbaWZ2YXJdID09PSBcIlwiICsgaWZub3QpKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGJ1cy50cmlnZ2VyKFxuICAgICAgICAgICAgICAgIFwid3NlLmludGVycHJldGVyLm1lc3NhZ2VcIiwgXCJDb25pZGl0aW9uIG5vdCBtZXQuIFwiICsgaWZ2YXIgKyBcIj09XCIgKyBpZm5vdCk7XG4gICAgICAgICAgICBidXMudHJpZ2dlcihcbiAgICAgICAgICAgICAgICBcIndzZS5pbnRlcnByZXRlci5ydW5jb21tYW5kLmFmdGVyLmNvbmRpdGlvbi5mYWxzZVwiLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXI6IHRoaXMsXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQ6IGNvbW1hbmRcbiAgICAgICAgICAgICAgICB9LCBcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlmdmFsICE9PSBudWxsICYmIChcIlwiICsgdmFyQ29udGFpbmVyW2lmdmFyXSkgIT09IFwiXCIgKyBpZnZhbCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBidXMudHJpZ2dlcihcIndzZS5pbnRlcnByZXRlci5tZXNzYWdlXCIsIFwiQ29uaWRpdGlvbiBub3QgbWV0LlwiKTtcbiAgICAgICAgICAgIGJ1cy50cmlnZ2VyKFxuICAgICAgICAgICAgICAgIFwid3NlLmludGVycHJldGVyLnJ1bmNvbW1hbmQuYWZ0ZXIuY29uZGl0aW9uLmZhbHNlXCIsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnByZXRlcjogdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZDogY29tbWFuZFxuICAgICAgICAgICAgICAgIH0sIFxuICAgICAgICAgICAgICAgIGZhbHNlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGJ1cy50cmlnZ2VyKFxuICAgICAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIucnVuY29tbWFuZC5jb25kaXRpb24ubWV0XCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXI6IHRoaXMsXG4gICAgICAgICAgICAgICAgY29tbWFuZDogY29tbWFuZFxuICAgICAgICAgICAgfSwgXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuICAgICAgICBcbiAgICAgICAgYnVzLnRyaWdnZXIoXCJ3c2UuaW50ZXJwcmV0ZXIubWVzc2FnZVwiLCBcIkNvbmlkaXRpb24gbWV0LlwiKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHRydWU7XG59O1xuXG5JbnRlcnByZXRlci5wcm90b3R5cGUucnVuQ29tbWFuZCA9IGZ1bmN0aW9uIChjb21tYW5kKSB7XG4gICAgXG4gICAgdmFyIHRhZ05hbWUsIGFzc2V0TmFtZSwgYnVzID0gdGhpcy5idXM7XG4gICAgXG4gICAgdGhpcy5idXMudHJpZ2dlcihcbiAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIucnVuY29tbWFuZC5iZWZvcmVcIiwgXG4gICAgICAgIHtcbiAgICAgICAgICAgIGludGVycHJldGVyOiB0aGlzLFxuICAgICAgICAgICAgY29tbWFuZDogY29tbWFuZFxuICAgICAgICB9LCBcbiAgICAgICAgZmFsc2VcbiAgICApO1xuICAgIFxuICAgIHRhZ05hbWUgPSBjb21tYW5kLnRhZ05hbWU7XG4gICAgYXNzZXROYW1lID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJhc3NldFwiKSB8fCBudWxsO1xuICAgIFxuICAgIGlmICghdGhpcy5jaGVja0lmdmFyKGNvbW1hbmQpKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkb05leHQ6IHRydWVcbiAgICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHRhZ05hbWUgaW4gY29tbWFuZHMpIHtcbiAgICAgICAgXG4gICAgICAgIGJ1cy50cmlnZ2VyKFxuICAgICAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIucnVuY29tbWFuZC5hZnRlci5jb21tYW5kXCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXI6IHRoaXMsXG4gICAgICAgICAgICAgICAgY29tbWFuZDogY29tbWFuZFxuICAgICAgICAgICAgfSwgXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuICAgICAgICBcbiAgICAgICAgYnVzLnRyaWdnZXIoJ2dhbWUuY29tbWFuZHMuJyArIHRhZ05hbWUpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGNvbW1hbmRzW3RhZ05hbWVdKGNvbW1hbmQsIHRoaXMpO1xuICAgIH1cbiAgICBlbHNlIGlmIChcbiAgICAgICAgYXNzZXROYW1lICE9PSBudWxsICYmXG4gICAgICAgIGFzc2V0TmFtZSBpbiB0aGlzLmFzc2V0cyAmJlxuICAgICAgICB0eXBlb2YgdGhpcy5hc3NldHNbYXNzZXROYW1lXVt0YWdOYW1lXSA9PT0gXCJmdW5jdGlvblwiICYmXG4gICAgICAgIHRhZ05hbWUubWF0Y2goLyhzaG93fGhpZGV8Y2xlYXJ8ZmxpY2tlcnxmbGFzaHxwbGF5fHN0YXJ0fHN0b3B8cGF1c2V8bW92ZXxzaGFrZXxzZXR8dGFnKS8pXG4gICAgKSB7XG4gICAgICAgIFxuICAgICAgICBidXMudHJpZ2dlcignZ2FtZS5hc3NldHMuJyArIGFzc2V0TmFtZSArICcuJyArIHRhZ05hbWUpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXMuYXNzZXRzW2Fzc2V0TmFtZV1bdGFnTmFtZV0oY29tbWFuZCwgdGhpcyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBcbiAgICAgICAgd2FybihidXMsIFwiVW5rbm93biBlbGVtZW50ICdcIiArIHRhZ05hbWUgKyBcIicuXCIsIGNvbW1hbmQpO1xuICAgICAgICBcbiAgICAgICAgYnVzLnRyaWdnZXIoXG4gICAgICAgICAgICBcIndzZS5pbnRlcnByZXRlci5ydW5jb21tYW5kLmFmdGVyLmVycm9yXCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXI6IHRoaXMsXG4gICAgICAgICAgICAgICAgY29tbWFuZDogY29tbWFuZFxuICAgICAgICAgICAgfSwgXG4gICAgICAgICAgICBmYWxzZVxuICAgICAgICApO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRvTmV4dDogdHJ1ZVxuICAgICAgICB9O1xuICAgIH1cbn07XG5cbkludGVycHJldGVyLnByb3RvdHlwZS5jcmVhdGVUcmlnZ2VycyA9IGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgdHJpZ2dlcnMsIGN1ck5hbWUsIGN1clRyaWdnZXIsIGJ1cyA9IHRoaXMuYnVzO1xuICAgIHZhciBpbnRlcnByZXRlciA9IHRoaXM7XG4gICAgXG4gICAgYnVzLnRyaWdnZXIoXCJ3c2UuaW50ZXJwcmV0ZXIudHJpZ2dlcnMuY3JlYXRlXCIsIHRoaXMsIGZhbHNlKTtcbiAgICBcbiAgICB0aGlzLnRyaWdnZXJzID0ge307XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgICAgdHJpZ2dlcnMgPSB0aGlzLmdhbWUud3MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0cmlnZ2Vyc1wiKVswXS5cbiAgICAgICAgICAgIGdldEVsZW1lbnRzQnlUYWdOYW1lKFwidHJpZ2dlclwiKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgZWFjaChmdW5jdGlvbiAoY3VyKSB7XG4gICAgICAgIFxuICAgICAgICBjdXJOYW1lID0gY3VyLmdldEF0dHJpYnV0ZShcIm5hbWVcIikgfHwgbnVsbDtcbiAgICAgICAgXG4gICAgICAgIGlmIChjdXJOYW1lID09PSBudWxsKSB7XG4gICAgICAgICAgICB3YXJuKGJ1cywgXCJObyBuYW1lIHNwZWNpZmllZCBmb3IgdHJpZ2dlci5cIiwgY3VyKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKHR5cGVvZiBpbnRlcnByZXRlci50cmlnZ2Vyc1tjdXJOYW1lXSAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgICAgICAgICAgICAgIGludGVycHJldGVyLnRyaWdnZXJzW2N1ck5hbWVdICE9PSBudWxsKSB7XG4gICAgICAgICAgICB3YXJuKGJ1cywgXCJBIHRyaWdnZXIgd2l0aCB0aGUgbmFtZSAnXCIgKyBjdXJOYW1lICtcbiAgICAgICAgICAgICAgICBcIicgYWxyZWFkeSBleGlzdHMuXCIsIGN1cik7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGN1clRyaWdnZXIgPSBuZXcgVHJpZ2dlcihjdXIsIGludGVycHJldGVyKTtcbiAgICAgICAgXG4gICAgICAgIGlmICh0eXBlb2YgY3VyVHJpZ2dlci5mbiA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBpbnRlcnByZXRlci50cmlnZ2Vyc1tjdXJOYW1lXSA9IGN1clRyaWdnZXI7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfSwgdHJpZ2dlcnMpO1xuICAgIFxufTtcblxuSW50ZXJwcmV0ZXIucHJvdG90eXBlLmJ1aWxkQXNzZXRzID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciBhc3NldHMsIGJ1cyA9IHRoaXMuYnVzO1xuICAgIFxuICAgIGJ1cy50cmlnZ2VyKFwid3NlLmFzc2V0cy5sb2FkaW5nLnN0YXJ0ZWRcIik7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgICAgYXNzZXRzID0gdGhpcy5zdG9yeS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFzc2V0c1wiKVswXS5jaGlsZE5vZGVzO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICBsb2dFcnJvcihidXMsIFwiRXJyb3Igd2hpbGUgY3JlYXRpbmcgYXNzZXRzOiBcIiArIGUuZ2V0TWVzc2FnZSgpKTtcbiAgICB9XG4gICAgXG4gICAgZWFjaChmdW5jdGlvbiAoYXNzZXQpIHtcbiAgICAgICAgXG4gICAgICAgIGlmIChhc3NldC5ub2RlVHlwZSAhPT0gMSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLmNyZWF0ZUFzc2V0KGFzc2V0KTtcbiAgICAgICAgXG4gICAgfS5iaW5kKHRoaXMpLCBhc3NldHMpO1xuICAgIFxufTtcblxuSW50ZXJwcmV0ZXIucHJvdG90eXBlLmNyZWF0ZUFzc2V0ID0gZnVuY3Rpb24gKGFzc2V0KSB7XG4gICAgXG4gICAgdmFyIG5hbWUsIGFzc2V0VHlwZSwgYnVzID0gdGhpcy5idXM7XG4gICAgXG4gICAgYnVzLnRyaWdnZXIoXG4gICAgICAgIFwid3NlLmludGVycHJldGVyLmNyZWF0ZWFzc2V0XCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGludGVycHJldGVyOiB0aGlzLFxuICAgICAgICAgICAgYXNzZXQ6IGFzc2V0XG4gICAgICAgIH0sIFxuICAgICAgICBmYWxzZVxuICAgICk7XG4gICAgXG4gICAgbmFtZSA9IGFzc2V0LmdldEF0dHJpYnV0ZShcIm5hbWVcIik7XG4gICAgYXNzZXRUeXBlID0gYXNzZXQudGFnTmFtZTtcbiAgICBcbiAgICBpZiAobmFtZSA9PT0gbnVsbCkge1xuICAgICAgICBsb2dFcnJvcihidXMsIFwiRXhwZWN0ZWQgYXR0cmlidXRlICduYW1lJy5cIiwgYXNzZXQpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGlmIChhc3NldFR5cGUgPT09IG51bGwpIHtcbiAgICAgICAgd2FybihidXMsIFwiRXhwZWN0ZWQgYXR0cmlidXRlICd0eXBlJyBvbiBhc3NldCAnXCIgKyBuYW1lICsgXCInLlwiLCBhc3NldCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaWYgKHR5cGVvZiB0aGlzLmFzc2V0c1tuYW1lXSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICB3YXJuKGJ1cywgXCJUcnlpbmcgdG8gb3ZlcnJpZGUgZXhpc3RpbmcgYXNzZXQgJ1wiICsgbmFtZSArIFwiJy5cIiwgYXNzZXQpO1xuICAgIH1cbiAgICBcbiAgICBhc3NldFR5cGUgPSB0b29scy5maXJzdExldHRlclVwcGVyY2FzZShhc3NldFR5cGUpO1xuICAgIFxuICAgIGlmIChhc3NldFR5cGUgaW4gYXNzZXRzKSB7XG4gICAgICAgIHRoaXMuYXNzZXRzW25hbWVdID0gbmV3IGFzc2V0c1thc3NldFR5cGVdKGFzc2V0LCB0aGlzKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgd2FybihidXMsIFwiVW5rbm93biBhc3NldCB0eXBlICdcIiArIGFzc2V0VHlwZSArIFwiJy5cIiwgYXNzZXQpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxufTtcblxuSW50ZXJwcmV0ZXIucHJvdG90eXBlLnRvZ2dsZVNhdmVnYW1lTWVudSA9IGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgbWVudSwgZGVsZXRlQnV0dG9uLCBsb2FkQnV0dG9uLCBzYXZlQnV0dG9uLCBzZWxmO1xuICAgIHZhciBzYXZlcywgYnV0dG9uUGFuZWwsIHJlc3VtZUJ1dHRvbiwgaWQsIHNnTGlzdDtcbiAgICB2YXIgY3VyRWwsIGxpc3RlbmVyU3RhdHVzLCBjdXJFbGFwc2VkLCBvbGRTdGF0ZTtcbiAgICBcbiAgICBzZWxmID0gdGhpcztcbiAgICBpZCA9IFwiV1NFU2F2ZUdhbWVNZW51X1wiICsgdGhpcy5nYW1lLnVybDtcbiAgICBsaXN0ZW5lclN0YXR1cyA9IHRoaXMuZ2FtZS5saXN0ZW5lcnNTdWJzY3JpYmVkO1xuICAgIFxuICAgIG1lbnUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkgfHwgbnVsbDtcbiAgICBcbiAgICBpZiAobWVudSAhPT0gbnVsbCkge1xuICAgICAgICBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxpc3RlbmVyU3RhdHVzID0gdHJ1dGh5KG1lbnUuZ2V0QXR0cmlidXRlKFwiZGF0YS13c2UtbGlzdGVuZXItc3RhdHVzXCIpKTtcbiAgICAgICAgICAgIHRoaXMuc3RhZ2UucmVtb3ZlQ2hpbGQobWVudSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAobGlzdGVuZXJTdGF0dXMgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuc2F2ZWdhbWVNZW51VmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLnN0YXRlID0gdGhpcy5vbGRTdGF0ZUluU2F2ZWdhbWVNZW51O1xuICAgICAgICB0aGlzLndhaXRDb3VudGVyIC09IDE7XG4gICAgICAgIFxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGlmICh0aGlzLnN0b3BwZWQgIT09IHRydWUpIHtcbiAgICAgICAgXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkgeyBzZWxmLnRvZ2dsZVNhdmVnYW1lTWVudSgpOyB9LCAyMCk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIG9sZFN0YXRlID0gdGhpcy5zdGF0ZTtcbiAgICB0aGlzLm9sZFN0YXRlSW5TYXZlZ2FtZU1lbnUgPSBvbGRTdGF0ZTtcbiAgICB0aGlzLnN0YXRlID0gXCJwYXVzZVwiO1xuICAgIHRoaXMud2FpdENvdW50ZXIgKz0gMTtcbiAgICB0aGlzLnNhdmVnYW1lTWVudVZpc2libGUgPSB0cnVlO1xuICAgIFxuICAgIG1lbnUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIG1lbnUuaW5uZXJIVE1MID0gXCJcIjtcbiAgICBtZW51LnNldEF0dHJpYnV0ZShcImlkXCIsIGlkKTtcbiAgICBtZW51LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiV1NFU2F2ZWdhbWVNZW51XCIpO1xuICAgIG1lbnUuc2V0QXR0cmlidXRlKFwiZGF0YS13c2UtcmVtb3ZlXCIsIFwidHJ1ZVwiKTtcbiAgICBtZW51LnNldEF0dHJpYnV0ZShcImRhdGEtd3NlLWxpc3RlbmVyLXN0YXR1c1wiLCBsaXN0ZW5lclN0YXR1cyk7XG4gICAgbWVudS5zdHlsZS56SW5kZXggPSAxMDAwMDA7XG4gICAgbWVudS5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICBcbiAgICBzYXZlcyA9IHNhdmVnYW1lcy5nZXRTYXZlZ2FtZUxpc3QodGhpcywgdHJ1ZSk7XG4gICAgXG4gICAgZGVsZXRlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgIGRlbGV0ZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImJ1dHRvbiBkZWxldGVcIik7XG4gICAgZGVsZXRlQnV0dG9uLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJidXR0b25cIik7XG4gICAgZGVsZXRlQnV0dG9uLnZhbHVlID0gXCJEZWxldGVcIjtcbiAgICBcbiAgICBkZWxldGVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGFjdGl2ZSwgc2F2ZWdhbWVOYW1lO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIFxuICAgICAgICAgICAgYWN0aXZlID0gbWVudS5xdWVyeVNlbGVjdG9yKFwiLmFjdGl2ZVwiKSB8fCBudWxsO1xuICAgICAgICBcbiAgICAgICAgICAgIGlmIChhY3RpdmUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNhdmVnYW1lTmFtZSA9IGFjdGl2ZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXdzZS1zYXZlZ2FtZS1uYW1lXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBmdW5jdGlvbiBmbiAoZGVjaXNpb24pIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoZGVjaXNpb24gPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgc2F2ZWdhbWVzLnJlbW92ZShzZWxmLCBzYXZlZ2FtZU5hbWUpO1xuICAgICAgICAgICAgICAgIHNlbGYudG9nZ2xlU2F2ZWdhbWVNZW51KCk7XG4gICAgICAgICAgICAgICAgc2VsZi50b2dnbGVTYXZlZ2FtZU1lbnUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdWkuY29uZmlybShcbiAgICAgICAgICAgICAgICBzZWxmLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRGVsZXRlIGdhbWU/XCIsXG4gICAgICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiRG8geW91IHJlYWxseSB3YW50IHRvIGRlbGV0ZSBzYXZlZ2FtZSAnXCIgKyBzYXZlZ2FtZU5hbWUgKyBcIic/XCIsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0sXG4gICAgICAgIGZhbHNlXG4gICAgKTtcbiAgICBcbiAgICBzYXZlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgIHNhdmVCdXR0b24uc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJidXR0b24gc2F2ZVwiKTtcbiAgICBzYXZlQnV0dG9uLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJidXR0b25cIik7XG4gICAgc2F2ZUJ1dHRvbi52YWx1ZSA9IFwiU2F2ZVwiO1xuICAgIFxuICAgIHNhdmVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGFjdGl2ZSwgc2F2ZWdhbWVOYW1lO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGFjdGl2ZSA9IG1lbnUucXVlcnlTZWxlY3RvcihcIi5hY3RpdmVcIikgfHwgbnVsbDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGFjdGl2ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHVpLnByb21wdChcbiAgICAgICAgICAgICAgICAgICAgc2VsZixcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiTmV3IHNhdmVnYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlBsZWFzZSBlbnRlciBhIG5hbWUgZm9yIHRoZSBzYXZlZ2FtZTpcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1aS5hbGVydChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRXJyb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIlRoZSBzYXZlZ2FtZSBuYW1lIGNhbm5vdCBiZSBlbXB0eSFcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnRvZ2dsZVNhdmVnYW1lTWVudSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZ2FtZS5saXN0ZW5lcnNTdWJzY3JpYmVkID0gbGlzdGVuZXJTdGF0dXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZWdhbWVzLnNhdmUoc2VsZiwgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi50b2dnbGVTYXZlZ2FtZU1lbnUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmdhbWUubGlzdGVuZXJzU3Vic2NyaWJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVpLmFsZXJ0KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJHYW1lIHNhdmVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIllvdXIgZ2FtZSBoYXMgYmVlbiBzYXZlZC5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBzYXZlZ2FtZU5hbWUgPSBhY3RpdmUuZ2V0QXR0cmlidXRlKFwiZGF0YS13c2Utc2F2ZWdhbWUtbmFtZVwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdWkuY29uZmlybShcbiAgICAgICAgICAgICAgICBzZWxmLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiT3ZlcndyaXRlIHNhdmVnYW1lP1wiLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIllvdSBhcmUgYWJvdXQgdG8gb3ZlcndyaXRlIGFuIG9sZCBzYXZlZ2FtZS4gQXJlIHlvdSBzdXJlP1wiLFxuICAgICAgICAgICAgICAgICAgICB0cnVlVGV4dDogXCJZZXNcIixcbiAgICAgICAgICAgICAgICAgICAgZmFsc2VUZXh0OiBcIk5vXCIsXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiAoZGVjaXNpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlY2lzaW9uID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi50b2dnbGVTYXZlZ2FtZU1lbnUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVnYW1lcy5zYXZlKHNlbGYsIHNhdmVnYW1lTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnRvZ2dsZVNhdmVnYW1lTWVudSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB1aS5hbGVydChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiR2FtZSBzYXZlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIllvdXIgZ2FtZSBoYXMgYmVlbiBzYXZlZC5cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgICAgICBmYWxzZVxuICAgICk7XG4gICAgXG4gICAgbG9hZEJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICBsb2FkQnV0dG9uLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYnV0dG9uIGxvYWRcIik7XG4gICAgbG9hZEJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYnV0dG9uXCIpO1xuICAgIGxvYWRCdXR0b24uc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgMSk7XG4gICAgbG9hZEJ1dHRvbi52YWx1ZSA9IFwiTG9hZFwiO1xuICAgIFxuICAgIGxvYWRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGFjdGl2ZSwgc2F2ZWdhbWVOYW1lLCBmbjtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBhY3RpdmUgPSBtZW51LnF1ZXJ5U2VsZWN0b3IoXCIuYWN0aXZlXCIpIHx8IG51bGw7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChhY3RpdmUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNhdmVnYW1lTmFtZSA9IGFjdGl2ZS5nZXRBdHRyaWJ1dGUoXCJkYXRhLXdzZS1zYXZlZ2FtZS1uYW1lXCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBmbiA9IGZ1bmN0aW9uIChkZWNpc2lvbikge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChkZWNpc2lvbiA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBzZWxmLnN0YWdlLnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSk7XG4gICAgICAgICAgICAgICAgc2VsZi5zYXZlZ2FtZU1lbnVWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgc2VsZi53YWl0Q291bnRlciAtPSAxO1xuICAgICAgICAgICAgICAgIHNlbGYuc3RhdGUgPSBvbGRTdGF0ZTtcbiAgICAgICAgICAgICAgICBzYXZlZ2FtZXMubG9hZChzZWxmLCBzYXZlZ2FtZU5hbWUpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdWkuY29uZmlybShcbiAgICAgICAgICAgICAgICBzZWxmLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiTG9hZCBnYW1lP1wiLFxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkxvYWRpbmcgYSBzYXZlZ2FtZSB3aWxsIGRpc2NhcmQgYWxsIHVuc2F2ZWQgcHJvZ3Jlc3MuIENvbnRpbnVlP1wiLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogZm5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9LFxuICAgICAgICBmYWxzZVxuICAgICk7XG4gICAgXG4gICAgYnV0dG9uUGFuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGJ1dHRvblBhbmVsLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwicGFuZWxcIik7XG4gICAgcmVzdW1lQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgIHJlc3VtZUJ1dHRvbi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImJ1dHRvbiByZXN1bWVcIik7XG4gICAgcmVzdW1lQnV0dG9uLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJidXR0b25cIik7XG4gICAgcmVzdW1lQnV0dG9uLnZhbHVlID0gXCJSZXN1bWVcIjtcbiAgICBcbiAgICByZXN1bWVCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgXCJjbGlja1wiLFxuICAgICAgICBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgc2VsZi5zdGFnZS5yZW1vdmVDaGlsZChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZWxmLmJ1cy50cmlnZ2VyKFxuICAgICAgICAgICAgICAgIFwid3NlLmludGVycHJldGVyLm51bWJlck9mRnVuY3Rpb25zVG9XYWl0Rm9yLmRlY3JlYXNlXCIsXG4gICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICBmYWxzZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2VsZi5zYXZlZ2FtZU1lbnVWaXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICBzZWxmLndhaXRDb3VudGVyIC09IDE7XG4gICAgICAgICAgICBzZWxmLnN0YXRlID0gb2xkU3RhdGU7XG4gICAgICAgIH0sXG4gICAgICAgIGZhbHNlXG4gICAgKTtcbiAgICBcbiAgICBzZ0xpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHNnTGlzdC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImxpc3RcIik7XG4gICAgXG4gICAgYnV0dG9uUGFuZWwuYXBwZW5kQ2hpbGQobG9hZEJ1dHRvbik7XG4gICAgYnV0dG9uUGFuZWwuYXBwZW5kQ2hpbGQoc2F2ZUJ1dHRvbik7XG4gICAgYnV0dG9uUGFuZWwuYXBwZW5kQ2hpbGQoZGVsZXRlQnV0dG9uKTtcbiAgICBidXR0b25QYW5lbC5hcHBlbmRDaGlsZChyZXN1bWVCdXR0b24pO1xuICAgIG1lbnUuYXBwZW5kQ2hpbGQoYnV0dG9uUGFuZWwpO1xuICAgIFxuICAgIGZ1bmN0aW9uIG1ha2VDbGlja0ZuIChjdXJFbCkge1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgb2xkO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgb2xkID0gc2dMaXN0LnF1ZXJ5U2VsZWN0b3IoXCIuYWN0aXZlXCIpIHx8IG51bGw7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKG9sZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBvbGQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgb2xkLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpLnJlcGxhY2UoL2FjdGl2ZS8sIFwiXCIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjdXJFbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBjdXJFbC5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKSArIFwiIGFjdGl2ZVwiKTtcbiAgICAgICAgICAgIGxvYWRCdXR0b24uZm9jdXMoKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgY3VyRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGN1ckVsLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYnV0dG9uXCIpO1xuICAgIFxuICAgIGVhY2goZnVuY3Rpb24gKGN1cikge1xuICAgICAgICBcbiAgICAgICAgY3VyRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBjdXJFbGFwc2VkID0gY3VyLnNhdmVUaW1lIC0gY3VyLnN0YXJ0VGltZTtcbiAgICAgICAgY3VyRWwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJidXR0b25cIik7XG4gICAgICAgIGN1ckVsLnNldEF0dHJpYnV0ZShcImRhdGEtd3NlLXNhdmVnYW1lLW5hbWVcIiwgY3VyLm5hbWUpO1xuICAgICAgICBcbiAgICAgICAgY3VyRWwuaW5uZXJIVE1MID0gJycgKyBcbiAgICAgICAgICAgICc8cCBjbGFzcz1cIm5hbWVcIj4nICsgXG4gICAgICAgICAgICAgICAgY3VyLm5hbWUgKyBcbiAgICAgICAgICAgICc8L3A+JyArIFxuICAgICAgICAgICAgJzxwIGNsYXNzPVwiZGVzY3JpcHRpb25cIj4nICsgXG4gICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiZWxhcHNlZFwiPicgKyBcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQoKGN1ckVsYXBzZWQgLyA2MCkgLyA2MCwgMTApICsgJ2ggJyArIFxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludCgoY3VyRWxhcHNlZCAvIDYwKSAlIDYwLCAxMCkgKyAnbSAnICsgXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KGN1ckVsYXBzZWQgJSA2MCwgMTApICsgJ3MnICsgXG4gICAgICAgICAgICAgICAgJzwvc3Bhbj4nICsgXG4gICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiZGF0ZVwiPicgKyBcbiAgICAgICAgICAgICAgICAgICAgbmV3IERhdGUoY3VyLnNhdmVUaW1lICogMTAwMCkudG9VVENTdHJpbmcoKSArIFxuICAgICAgICAgICAgICAgICc8L3NwYW4+JyArIFxuICAgICAgICAgICAgJzwvcD4nO1xuICAgICAgICBcbiAgICAgICAgY3VyRWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIG1ha2VDbGlja0ZuKGN1ckVsLCBjdXIpLCBmYWxzZSk7XG4gICAgICAgIHNnTGlzdC5hcHBlbmRDaGlsZChjdXJFbCk7XG4gICAgICAgIFxuICAgIH0sIHNhdmVzKTtcbiAgICBcbiAgICBtZW51LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgIFwiY2xpY2tcIixcbiAgICAgICAgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBhY3RpdmU7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGFjdGl2ZSA9IG1lbnUucXVlcnlTZWxlY3RvcihcIi5hY3RpdmVcIikgfHwgbnVsbDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGFjdGl2ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYWN0aXZlLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIGFjdGl2ZS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKS5yZXBsYWNlKC9hY3RpdmUvLCBcIlwiKSk7XG4gICAgICAgIH0sXG4gICAgICAgIGZhbHNlXG4gICAgKTtcbiAgICBcbiAgICBtZW51LmFwcGVuZENoaWxkKHNnTGlzdCk7XG4gICAgXG4gICAgdGhpcy5zdGFnZS5hcHBlbmRDaGlsZChtZW51KTtcbn07XG5cbkludGVycHJldGVyLnByb3RvdHlwZS5fc3RhcnRMb2FkaW5nU2NyZWVuID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciB0ZW1wbGF0ZSA9IHRoaXMuc3RvcnkucXVlcnlTZWxlY3RvcihcImxvYWRpbmdTY3JlZW5cIik7XG4gICAgXG4gICAgaWYgKHRlbXBsYXRlKSB7XG4gICAgICAgIHRoaXMuX2xvYWRpbmdTY3JlZW4uc2V0VGVtcGxhdGUoZ2V0U2VyaWFsaXplZE5vZGVzKHRlbXBsYXRlKSk7XG4gICAgfVxuICAgIFxuICAgIHRoaXMuX2xvYWRpbmdTY3JlZW4uc2hvdyh0aGlzLnN0YWdlKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJwcmV0ZXI7XG4iLCIvKipcbiAgICBcbiAgICBAbW9kdWxlIFdTRS5LZXlzXG4gICAgXG4gICAgW0NvbnN0cnVjdG9yXSBXU0UuS2V5c1xuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBcbiAgICAgICAgQSBzaW1wbGUgb2JqZWN0IHRvIGhhbmRsZSBrZXkgcHJlc3MgZXZlbnRzLlxuICAgICAgICBIYXMgYSBudW1iZXIgb2YgaGFuZHkgcHNldWRvIGNvbnN0YW50cyB3aGljaCBjYW5cbiAgICAgICAgYmUgdXNlZCB0byBpZGVudGlmeSBrZXlzLlxuICAgICAgICBcbiAgICAgICAgSWYgdGhlcmUncyBhIGtleSBpZGVudGlmaWVyIG1pc3NpbmcsIHlvdSBjYW4gYWRkIHlvdXIgb3duIGJ5IGRlZmluaW5nXG4gICAgICAgIGEgcGxhaW4gb2JqZWN0IGxpdGVyYWwgd2l0aCBhIGtjIHByb3BlcnR5IGZvciB0aGUga2V5Y29kZVxuICAgICAgICBhbmQgYW4gb3B0aW9uYWwgd2hpY2ggcHJvcGVydHkgZm9yIHRoZSBldmVudCB0eXBlLlxuICAgICAgICBcbiAgICAgICAgXG4gICAgUGFyYW1ldGVyc1xuICAgIC0tLS0tLS0tLS1cbiAgICAgICAgXG4gICAgICAgIDEuIGFyZ3M6XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFtPYmplY3RdIEFuIG9iamVjdCB0byBjb25maWd1cmUgdGhlIGluc3RhbmNlJ3MgYmVoYXZpb3VyLlxuICAgICAgICAgICAgXG4gICAgICAgICAgICBIYXMgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgKiBlbGVtZW50OiBcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIFtET01FbGVtZW50XSBUaGUgSFRNTCBlbGVtZW50IHRvIGJpbmQgdGhlIGxpc3RlbmVycyB0by4gXG4gICAgICAgICAgICAgICAgICAgIERlZmF1bHQ6IHdpbmRvd1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICogbG9nOlxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBbQm9vbGVhbl0gTG9nIHRoZSBjYXB0dXJlZCBldmVudHMgdG8gdGhlIGNvbnNvbGU/XG4gICAgICAgICAgICAgICAgICAgIERlZmF1bHQ6IGZhbHNlLlxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgUHJvcGVydGllc1xuICAgIC0tLS0tLS0tLS1cbiAgICAgICAgXG4gICAgICAgICoga2V5czpcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgW09iamVjdF0gQW4gb2JqZWN0IHdpdGggJ2NvbnN0YW50cycgZm9yIGVhc2llciBrZXkgaWRlbnRpZmljYXRpb24uXG4gICAgICAgICAgICBUaGUgcHJvcGVydHkgbmFtZXMgYXJlIHRoZSBuYW1lcyBvZiB0aGUga2V5cyBhbmQgdGhlIHZhbHVlc1xuICAgICAgICAgICAgYXJlIG9iamVjdHMgd2l0aCBhIFwia2NcIiBwcm9wZXJ0eSBmb3IgdGhlIEtleUNvZGUgYW5kIG9wdGlvbmFsbHlcbiAgICAgICAgICAgIGEgXCJ3aGljaFwiIHByb3BlcnR5IGZvciB0aGUgZXZlbnQgdHlwZS5cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgVGhlIHByb3BlcnR5IG5hbWVzIGFyZSBhbGwgVVBQRVJDQVNFLlxuICAgICAgICAgICAgXG4gICAgICAgICAgICBFeGFtcGxlczpcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAqIFNQQUNFXG4gICAgICAgICAgICAgICAgKiBFTlRFUlxuICAgICAgICAgICAgICAgICogVEFCXG4gICAgICAgICAgICAgICAgKiBDVFJMXG4gICAgICAgICAgICAgICAgKiBBTFRcbiAgICAgICAgICAgICAgICAqIFNISUZUXG4gICAgICAgICAgICAgICAgKiBMRUZUX0FSUk9XLCBSSUdIVF9BUlJPVywgVVBfQVJST1csIERPV05fQVJST1dcbiAgICAgICAgICAgICAgICAqIEEgdG8gWlxuICAgICAgICAgICAgICAgICogTlVNXzAgdG8gTlVNXzlcbiAgICAgICAgICAgICAgICAqIE5VTVBBRF8wIHRvIE5VTVBBRF85XG4gICAgICAgICAgICAgICAgKiBGMSB0byBGMTJcbiAgICAgICAgICAgICAgICAqIEFERCwgU1VCU1RSQUNULCBNVUxUSVBMWSwgRElWSURFLCBFUVVBTFNcbiAgICAgICAgICAgICAgICAqIFBFUklPRFxuICAgICAgICAgICAgICAgICogQ09NTUFcbiAgICAgICAgICAgICAgICBcbiovXG5mdW5jdGlvbiBLZXlzIChhcmdzKSB7XG4gICAgXG4gICAgYXJncyA9IGFyZ3MgfHwge307XG4gICAgXG4gICAgdGhpcy5rZXlzID0ge307XG4gICAgdGhpcy5rZXlzLkJBQ0tTUEFDRSAgICAgPSB7a2M6ICAgOH07XG4gICAgdGhpcy5rZXlzLlRBQiAgICAgICAgICAgPSB7a2M6ICAgOX07XG4gICAgdGhpcy5rZXlzLkVOVEVSICAgICAgICAgPSB7a2M6ICAxMywgd2hpY2g6IDEzfTtcbiAgICB0aGlzLmtleXMuU0hJRlQgICAgICAgICA9IHtrYzogIDE2fTtcbiAgICB0aGlzLmtleXMuQ1RSTCAgICAgICAgICA9IHtrYzogIDE3fTtcbiAgICB0aGlzLmtleXMuQUxUICAgICAgICAgICA9IHtrYzogIDE4fTtcbiAgICB0aGlzLmtleXMuUEFVU0UgICAgICAgICA9IHtrYzogIDE5fTtcbiAgICB0aGlzLmtleXMuQ0FQU19MT0NLICAgICA9IHtrYzogIDIwfTtcbiAgICB0aGlzLmtleXMuRVNDQVBFICAgICAgICA9IHtrYzogIDI3fTtcbiAgICB0aGlzLmtleXMuU1BBQ0UgICAgICAgICA9IHtrYzogIDMyfTtcbiAgICB0aGlzLmtleXMuUEFHRV9VUCAgICAgICA9IHtrYzogIDMzfTtcbiAgICB0aGlzLmtleXMuUEFHRV9ET1dOICAgICA9IHtrYzogIDIwfTtcbiAgICB0aGlzLmtleXMuRU5EICAgICAgICAgICA9IHtrYzogIDIwfTtcbiAgICB0aGlzLmtleXMuSE9NRSAgICAgICAgICA9IHtrYzogIDIwfTtcbiAgICB0aGlzLmtleXMuTEVGVF9BUlJPVyAgICA9IHtrYzogIDM3fTtcbiAgICB0aGlzLmtleXMuVVBfQVJST1cgICAgICA9IHtrYzogIDM4fTtcbiAgICB0aGlzLmtleXMuUklHSFRfQVJST1cgICA9IHtrYzogIDM5fTtcbiAgICB0aGlzLmtleXMuRE9XTl9BUlJPVyAgICA9IHtrYzogIDQwfTtcbiAgICB0aGlzLmtleXMuSU5TRVJUICAgICAgICA9IHtrYzogIDQ1fTtcbiAgICB0aGlzLmtleXMuREVMRVRFICAgICAgICA9IHtrYzogIDQ2fTtcbiAgICB0aGlzLmtleXMuTlVNXzAgICAgICAgICA9IHtrYzogIDQ4fTtcbiAgICB0aGlzLmtleXMuTlVNXzEgICAgICAgICA9IHtrYzogIDQ5fTtcbiAgICB0aGlzLmtleXMuTlVNXzIgICAgICAgICA9IHtrYzogIDUwfTtcbiAgICB0aGlzLmtleXMuTlVNXzMgICAgICAgICA9IHtrYzogIDUxfTtcbiAgICB0aGlzLmtleXMuTlVNXzQgICAgICAgICA9IHtrYzogIDUyfTtcbiAgICB0aGlzLmtleXMuTlVNXzUgICAgICAgICA9IHtrYzogIDUzfTtcbiAgICB0aGlzLmtleXMuTlVNXzYgICAgICAgICA9IHtrYzogIDU0fTtcbiAgICB0aGlzLmtleXMuTlVNXzcgICAgICAgICA9IHtrYzogIDU1fTtcbiAgICB0aGlzLmtleXMuTlVNXzggICAgICAgICA9IHtrYzogIDU2fTtcbiAgICB0aGlzLmtleXMuTlVNXzkgICAgICAgICA9IHtrYzogIDU3fTtcbiAgICB0aGlzLmtleXMuQSAgICAgICAgICAgICA9IHtrYzogIDY1fTtcbiAgICB0aGlzLmtleXMuQiAgICAgICAgICAgICA9IHtrYzogIDY2fTtcbiAgICB0aGlzLmtleXMuQyAgICAgICAgICAgICA9IHtrYzogIDY3fTtcbiAgICB0aGlzLmtleXMuRCAgICAgICAgICAgICA9IHtrYzogIDY4fTtcbiAgICB0aGlzLmtleXMuRSAgICAgICAgICAgICA9IHtrYzogIDY5fTtcbiAgICB0aGlzLmtleXMuRiAgICAgICAgICAgICA9IHtrYzogIDcwfTtcbiAgICB0aGlzLmtleXMuRyAgICAgICAgICAgICA9IHtrYzogIDcxfTtcbiAgICB0aGlzLmtleXMuSCAgICAgICAgICAgICA9IHtrYzogIDcyfTtcbiAgICB0aGlzLmtleXMuSSAgICAgICAgICAgICA9IHtrYzogIDczfTtcbiAgICB0aGlzLmtleXMuSiAgICAgICAgICAgICA9IHtrYzogIDc0fTtcbiAgICB0aGlzLmtleXMuSyAgICAgICAgICAgICA9IHtrYzogIDc1fTtcbiAgICB0aGlzLmtleXMuTCAgICAgICAgICAgICA9IHtrYzogIDc2fTtcbiAgICB0aGlzLmtleXMuTSAgICAgICAgICAgICA9IHtrYzogIDc3fTtcbiAgICB0aGlzLmtleXMuTiAgICAgICAgICAgICA9IHtrYzogIDc4fTtcbiAgICB0aGlzLmtleXMuTyAgICAgICAgICAgICA9IHtrYzogIDc5fTtcbiAgICB0aGlzLmtleXMuUCAgICAgICAgICAgICA9IHtrYzogIDgwfTtcbiAgICB0aGlzLmtleXMuUSAgICAgICAgICAgICA9IHtrYzogIDgxfTtcbiAgICB0aGlzLmtleXMuUiAgICAgICAgICAgICA9IHtrYzogIDgyfTtcbiAgICB0aGlzLmtleXMuUyAgICAgICAgICAgICA9IHtrYzogIDgzfTtcbiAgICB0aGlzLmtleXMuVCAgICAgICAgICAgICA9IHtrYzogIDg0fTtcbiAgICB0aGlzLmtleXMuVSAgICAgICAgICAgICA9IHtrYzogIDg1fTtcbiAgICB0aGlzLmtleXMuViAgICAgICAgICAgICA9IHtrYzogIDg2fTtcbiAgICB0aGlzLmtleXMuVyAgICAgICAgICAgICA9IHtrYzogIDg3fTtcbiAgICB0aGlzLmtleXMuWCAgICAgICAgICAgICA9IHtrYzogIDg4fTtcbiAgICB0aGlzLmtleXMuWSAgICAgICAgICAgICA9IHtrYzogIDg5fTtcbiAgICB0aGlzLmtleXMuWiAgICAgICAgICAgICA9IHtrYzogIDkwfTtcbiAgICB0aGlzLmtleXMuTEVGVF9XSU4gICAgICA9IHtrYzogIDkxfTtcbiAgICB0aGlzLmtleXMuUklHSFRfV0lOICAgICA9IHtrYzogIDkyfTtcbiAgICB0aGlzLmtleXMuU0VMRUNUICAgICAgICA9IHtrYzogIDkzfTtcbiAgICB0aGlzLmtleXMuTlVNUEFEXzAgICAgICA9IHtrYzogIDk2fTtcbiAgICB0aGlzLmtleXMuTlVNUEFEXzEgICAgICA9IHtrYzogIDk3fTtcbiAgICB0aGlzLmtleXMuTlVNUEFEXzIgICAgICA9IHtrYzogIDk4fTtcbiAgICB0aGlzLmtleXMuTlVNUEFEXzMgICAgICA9IHtrYzogIDk5fTtcbiAgICB0aGlzLmtleXMuTlVNUEFEXzQgICAgICA9IHtrYzogMTAwfTtcbiAgICB0aGlzLmtleXMuTlVNUEFEXzUgICAgICA9IHtrYzogMTAxfTtcbiAgICB0aGlzLmtleXMuTlVNUEFEXzYgICAgICA9IHtrYzogMTAyfTtcbiAgICB0aGlzLmtleXMuTlVNUEFEXzcgICAgICA9IHtrYzogMTAzfTtcbiAgICB0aGlzLmtleXMuTlVNUEFEXzggICAgICA9IHtrYzogMTA0fTtcbiAgICB0aGlzLmtleXMuTlVNUEFEXzkgICAgICA9IHtrYzogMTA1fTtcbiAgICB0aGlzLmtleXMuTVVMVElQTFkgICAgICA9IHtrYzogMTA2fTtcbiAgICB0aGlzLmtleXMuQUREICAgICAgICAgICA9IHtrYzogMTA3fTtcbiAgICB0aGlzLmtleXMuU1VCU1RSQUNUICAgICA9IHtrYzogMTA5fTtcbiAgICB0aGlzLmtleXMuREVDSU1BTF9QT0lOVCA9IHtrYzogMTEwfTtcbiAgICB0aGlzLmtleXMuRElWSURFICAgICAgICA9IHtrYzogMTExfTtcbiAgICB0aGlzLmtleXMuRjEgICAgICAgICAgICA9IHtrYzogMTEyfTtcbiAgICB0aGlzLmtleXMuRjIgICAgICAgICAgICA9IHtrYzogMTEzfTtcbiAgICB0aGlzLmtleXMuRjMgICAgICAgICAgICA9IHtrYzogMTE0fTtcbiAgICB0aGlzLmtleXMuRjQgICAgICAgICAgICA9IHtrYzogMTE1fTtcbiAgICB0aGlzLmtleXMuRjUgICAgICAgICAgICA9IHtrYzogMTE2fTtcbiAgICB0aGlzLmtleXMuRjYgICAgICAgICAgICA9IHtrYzogMTE3fTtcbiAgICB0aGlzLmtleXMuRjcgICAgICAgICAgICA9IHtrYzogMTE4fTtcbiAgICB0aGlzLmtleXMuRjggICAgICAgICAgICA9IHtrYzogMTE5fTtcbiAgICB0aGlzLmtleXMuRjkgICAgICAgICAgICA9IHtrYzogMTIwfTtcbiAgICB0aGlzLmtleXMuRjEwICAgICAgICAgICA9IHtrYzogMTIxfTtcbiAgICB0aGlzLmtleXMuRjExICAgICAgICAgICA9IHtrYzogMTIyfTtcbiAgICB0aGlzLmtleXMuRjEyICAgICAgICAgICA9IHtrYzogMTIzfTtcbiAgICB0aGlzLmtleXMuTlVNX0xPQ0sgICAgICA9IHtrYzogMTQ0fTtcbiAgICB0aGlzLmtleXMuU0NST0xMX0xPQ0sgICA9IHtrYzogMTQ1fTtcbiAgICB0aGlzLmtleXMuU0VNSV9DT0xPTiAgICA9IHtrYzogMTg2fTtcbiAgICB0aGlzLmtleXMuRVFVQUxTICAgICAgICA9IHtrYzogMTg3fTtcbiAgICB0aGlzLmtleXMuQ09NTUEgICAgICAgICA9IHtrYzogMTg4fTtcbiAgICB0aGlzLmtleXMuREFTSCAgICAgICAgICA9IHtrYzogMTg5fTtcbiAgICB0aGlzLmtleXMuUEVSSU9EICAgICAgICA9IHtrYzogMTkwfTtcbiAgICB0aGlzLmtleXMuU0xBU0ggICAgICAgICA9IHtrYzogMTkxfTtcbiAgICB0aGlzLmtleXMuR1JBVkUgICAgICAgICA9IHtrYzogMTkyfTtcbiAgICB0aGlzLmtleXMuT1BFTl9CUkFDS0VUICA9IHtrYzogMjE5fTtcbiAgICB0aGlzLmtleXMuQkFDS19TTEFTSCAgICA9IHtrYzogMjIwfTtcbiAgICB0aGlzLmtleXMuQ0xPU0VfQlJBQ0tFVCA9IHtrYzogMjIxfTtcbiAgICB0aGlzLmtleXMuU0lOR0xFX1FVT1RFICA9IHtrYzogMjIyfTtcbiAgICBcbiAgICB0aGlzLmxpc3RlbmVycyA9IFtdO1xuICAgIFxuICAgIHZhciBhdHRhY2gsIFxuICAgICAgICBjYXB0dXJlLFxuICAgICAgICBjYXB0dXJlVXAsXG4gICAgICAgIGNhcHR1cmVEb3duLFxuICAgICAgICBjYXB0dXJlUHJlc3MsXG4gICAgICAgIGV4YW1pbmVFdmVudCxcbiAgICAgICAgbG9nRXZlbnRzID0gYXJncy5sb2cgfHwgZmFsc2UsXG4gICAgICAgIGVsZW1lbnQgPSBhcmdzLmVsZW1lbnQgfHwgd2luZG93LFxuICAgICAgICBzZWxmID0gdGhpcztcbiAgICBcbiAgICBhdHRhY2ggPSBmdW5jdGlvbihlbGVtKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAoZWxlbSA9PSBudWxsIHx8IHR5cGVvZiBlbGVtID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChlbGVtLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgY2FwdHVyZVVwLCBmYWxzZSk7XG4gICAgICAgICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsIGNhcHR1cmVEb3duLCBmYWxzZSk7XG4gICAgICAgICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlwcmVzc1wiLCBjYXB0dXJlUHJlc3MsIGZhbHNlKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGxvZ0V2ZW50cyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihcImtleXVwXCIsIGV4YW1pbmVFdmVudCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIiwgZXhhbWluZUV2ZW50LCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKFwia2V5cHJlc3NcIiwgZXhhbWluZUV2ZW50LCBmYWxzZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gXG4gICAgICAgIGVsc2UgaWYgKGVsZW0uYXR0YWNoRXZlbnQpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZWxlbS5hdHRhY2hFdmVudChcIm9ua2V5dXBcIiwgY2FwdHVyZVVwKTtcbiAgICAgICAgICAgIGVsZW0uYXR0YWNoRXZlbnQoXCJvbmtleWRvd25cIiwgY2FwdHVyZURvd24pO1xuICAgICAgICAgICAgZWxlbS5hdHRhY2hFdmVudChcIm9ua2V5cHJlc3NcIiwgY2FwdHVyZVByZXNzKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGxvZ0V2ZW50cyA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGVsZW0uYXR0YWNoRXZlbnQoXCJvbmtleXVwXCIsIGV4YW1pbmVFdmVudCk7XG4gICAgICAgICAgICAgICAgZWxlbS5hdHRhY2hFdmVudChcIm9ua2V5ZG93blwiLCBleGFtaW5lRXZlbnQpO1xuICAgICAgICAgICAgICAgIGVsZW0uYXR0YWNoRXZlbnQoXCJvbmtleXByZXNzXCIsIGV4YW1pbmVFdmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFxuICAgIGNhcHR1cmUgPSBmdW5jdGlvbiAoZXZlbnQsIHR5cGUpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBsZW4gPSBzZWxmLmxpc3RlbmVycy5sZW5ndGgsIGN1ciwgaSwga2MsIHdoaWNoO1xuICAgICAgICBcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGN1ciA9IHNlbGYubGlzdGVuZXJzW2ldO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAodHlwZW9mIGN1ciA9PSAndW5kZWZpbmVkJyB8fCBjdXIudHlwZSAhPSB0eXBlKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGN1ci5rZXkgPSBjdXIua2V5IHx8IHt9O1xuICAgICAgICAgICAga2MgPSBjdXIua2V5LmtjIHx8IG51bGw7XG4gICAgICAgICAgICB3aGljaCA9IGN1ci5rZXkud2hpY2ggfHwgbnVsbDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGV2ZW50LndoaWNoID09IHdoaWNoIHx8IGV2ZW50LmtleUNvZGUgPT0ga2MpIHtcbiAgICAgICAgICAgICAgICBjdXIuY2FsbGJhY2soZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBcbiAgICBjYXB0dXJlVXAgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgY2FwdHVyZShldmVudCwgXCJ1cFwiKTtcbiAgICB9O1xuICAgIFxuICAgIGNhcHR1cmVEb3duID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGNhcHR1cmUoZXZlbnQsIFwiZG93blwiKTtcbiAgICB9O1xuICAgIFxuICAgIGNhcHR1cmVQcmVzcyA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBjYXB0dXJlKGV2ZW50LCBcInByZXNzXCIpO1xuICAgIH07XG4gICAgXG4gICAgZXhhbWluZUV2ZW50ID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWNvbnNvbGUgKi9cbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQpO1xuICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWNvbnNvbGUgKi9cbiAgICB9O1xuICAgIFxuICAgIGF0dGFjaChlbGVtZW50KTtcbn1cblxuLyoqXG4gICAgXG4gICAgQG1vZHVsZSBXU0UuS2V5c1xuICAgIFxuICAgIFtGdW5jdGlvbl0gV1NFLktleXMuYWRkTGlzdGVuZXJcbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgXG4gICAgICAgIEJpbmRzIGEgbmV3IGNhbGxiYWNrIHRvIGEga2V5LlxuICAgIFxuICAgIFBhcmFtZXRlcnNcbiAgICAtLS0tLS0tLS0tXG4gICAgICAgIFxuICAgICAgICAxLiBrZXk6XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFtPYmplY3RdIE9uZSBvZiB0aGUgV1NFLktleXMgcHNldWRvIGNvbnN0YW50cy5cbiAgICAgICAgICAgIFxuICAgICAgICAyLiBjYWxsYmFjazpcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgW0Z1bmN0aW9uXSBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSBvbmNlIHRoZSBrZXkgaGFzIGJlZW4gcHJlc3NlZC5cbiAgICAgICAgICAgIFxuICAgICAgICAzLiB0eXBlOiBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgW1N0cmluZ10gVGhlIGV2ZW50IHR5cGUgdG8gdXNlLiBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgT25lIG9mOlxuICAgICAgICBcbiAgICAgICAgICAgICAgICAqIFwidXBcIiAgICBmb3IgXCJrZXl1cFwiLFxuICAgICAgICAgICAgICAgICogXCJkb3duXCIgIGZvciBcImtleWRvd25cIixcbiAgICAgICAgICAgICAgICAqIFwicHJlc3NcIiBmb3IgXCJrZXlwcmVzc1wiXG4gICAgICAgIFxuICAgICAgICAgICAgRGVmYXVsdDogXCJ1cFwiXG4gICAgICAgICAgICBcbiAgICBFcnJvcnNcbiAgICAtLS0tLS1cbiAgICAgICAgICAgIFxuICAgICAgICBUaHJvd3MgYW4gRXJyb3Igd2hlbiB0aGUgdHlwZSBwYXJhbWV0ZXIgaXMgbm90IHJlY29nbml6ZWQuXG4gICAgICAgICAgICBcbiovXG5LZXlzLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKGtleSwgY2FsbGJhY2ssIHR5cGUpIHtcbiAgICBcbiAgICB0eXBlID0gdHlwZSB8fCBcInVwXCI7XG4gICAgXG4gICAgaWYgKHR5cGUgIT09IFwidXBcIiAmJiB0eXBlICE9PSBcImRvd25cIiAmJiB0eXBlICE9PSBcInByZXNzXCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXZlbnQgdHlwZSBub3QgcmVjb2duaXplZC5cIik7XG4gICAgfVxuICAgIFxuICAgIHRoaXMubGlzdGVuZXJzLnB1c2goe1xuICAgICAgICBrZXk6IGtleSxcbiAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgICAgICB0eXBlOiB0eXBlXG4gICAgfSk7XG59O1xuXG4vKipcblxuICAgIEBtb2R1bGUgV1NFLktleXNcblxuICAgIFtGdW5jdGlvbl0gV1NFLktleXMucmVtb3ZlTGlzdGVuZXJcbiAgICA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAgICAgUmVtb3ZlcyB0aGUgZXZlbnQgbGlzdGVuZXJzIGZvciBhIGtleS5cbiAgICAgICAgXG5cbiAgICBQYXJhbWV0ZXJzXG4gICAgLS0tLS0tLS0tLVxuICAgIFxuICAgICAgICAxLiBrZXk6XG4gICAgICAgIFxuICAgICAgICAgICAgW09iamVjdF0gT25lIG9mIFdTRS5LZXlzIHBzZXVkbyBjb25zdGFudHMuXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFxuKi9cbktleXMucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24gKGtleSwgY2FsbGJhY2ssIHR5cGUpIHtcbiAgICBcbiAgICB2YXIgbGVuID0gdGhpcy5saXN0ZW5lcnMubGVuZ3RoO1xuICAgIHZhciBjdXI7XG4gICAgXG4gICAgdHlwZSA9IHR5cGUgfHwgbnVsbDtcbiAgICBcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIFxuICAgICAgICBjdXIgPSB0aGlzLmxpc3RlbmVyc1tpXTtcbiAgICAgICAgXG4gICAgICAgIGlmICh0eXBlICE9PSBudWxsICYmIGN1ci50eXBlICE9IHR5cGUpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAodHlwZW9mIGN1ciAhPT0gJ3VuZGVmaW5lZCcgJiYgY3VyLmtleSA9PT0ga2V5ICYmIGN1ci5jYWxsYmFjayA9PT0gY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmxpc3RlbmVyc1tpXTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbi8qKiBcbiBcbiAgICBAbW9kdWxlIFdTRS5LZXlzXG5cbiAgICBbRnVuY3Rpb25dIFdTRS5LZXlzLmZvckFsbFxuICAgID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgXG4gICAgICAgIEV4ZWN1dGVzIGEgY2FsbGJhY2sgZm9yIGFueSBrZXkgZXZlbnQgdGhhdCBvY2N1cnMuXG4gICAgXG4gICAgXG4gICAgUGFyYW1ldGVyc1xuICAgIC0tLS0tLS0tLS1cbiAgICBcbiAgICAgICAgMS4gY2FsbGJhY2s6XG4gICAgICAgIFxuICAgICAgICAgICAgW0Z1bmN0aW9uXSBBIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGV4ZWN1dGVkIHdoZW4gYSBrZXlib2FyZFxuICAgICAgICAgICAgZXZlbnQgb2NjdXJzLlxuICAgICAgICAgICAgXG4gICAgICAgIDIuIHR5cGU6IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBbU3RyaW5nXSBUaGUga2V5Ym9hcmQgZXZlbnQgdHlwZSB0byB1c2UuIFxuICAgICAgICAgICAgXG4gICAgICAgICAgICBPbmUgb2Y6XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAqIFwidXBcIiAgICBmb3IgXCJrZXl1cFwiLFxuICAgICAgICAgICAgICAgICogXCJkb3duXCIgIGZvciBcImtleWRvd25cIixcbiAgICAgICAgICAgICAgICAqIFwicHJlc3NcIiBmb3IgXCJrZXlwcmVzc1wiXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIERlZmF1bHQ6IFwidXBcIlxuXG4gICAgRXJyb3JzXG4gICAgLS0tLS0tXG4gICAgXG4gICAgICAgIFRocm93cyBhbiBFcnJvciB3aGVuIHRoZSB0eXBlIHBhcmFtZXRlciBpcyBub3QgcmVjb2duaXplZC5cbiAgICAgICAgXG5cbiovXG5LZXlzLnByb3RvdHlwZS5mb3JBbGwgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIHR5cGUpIHtcbiAgICBcbiAgICB0eXBlID0gdHlwZSB8fCBcInVwXCI7XG4gICAgXG4gICAgaWYgKHR5cGUgIT09IFwidXBcIiAmJiB0eXBlICE9PSBcImRvd25cIiAmJiB0eXBlICE9PSBcInByZXNzXCIpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXZlbnQgdHlwZSBub3QgcmVjb2duaXplZC5cIik7XG4gICAgfVxuICAgIFxuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLmtleXMpIHtcbiAgICAgICAgXG4gICAgICAgIGlmICghdGhpcy5rZXlzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLmFkZExpc3RlbmVyKHRoaXMua2V5c1trZXldLCBjYWxsYmFjaywgdHlwZSk7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBLZXlzO1xuIiwiXG52YXIgRGF0YUJ1cyA9IHJlcXVpcmUoXCJkYXRhYnVzXCIpO1xudmFyIHRyYW5zZm9ybSA9IHJlcXVpcmUoXCJ0cmFuc2Zvcm0tanNcIikudHJhbnNmb3JtO1xuXG5mdW5jdGlvbiBMb2FkaW5nU2NyZWVuICgpIHtcbiAgICBcbiAgICBEYXRhQnVzLmluamVjdCh0aGlzKTtcbiAgICBcbiAgICB0aGlzLl9sb2FkaW5nID0gMDtcbiAgICB0aGlzLl9sb2FkZWQgPSAwO1xuICAgIHRoaXMuX21heCA9IDA7XG4gICAgdGhpcy5fZmluaXNoZWQgPSBmYWxzZTtcbiAgICBcbiAgICB0aGlzLl90ZW1wbGF0ZSA9ICcnICsgXG4gICAgICAgICc8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+JyArIFxuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJsb2dvXCI+JyArXG4gICAgICAgICAgICAgICAgJzxpbWcgc3JjPVwiYXNzZXRzL2ltYWdlcy9sb2dvLnBuZ1wiJyArXG4gICAgICAgICAgICAgICAgICAgICdvbmVycm9yPVwidGhpcy5zdHlsZS5kaXNwbGF5PVxcJ25vbmVcXCdcIi8+JyArXG4gICAgICAgICAgICAnPC9kaXY+JyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImhlYWRpbmdcIj4nICsgXG4gICAgICAgICAgICAgICAgJzxzcGFuIGlkPVwiV1NFTG9hZGluZ1NjcmVlblBlcmNlbnRhZ2VcIj57JHByb2dyZXNzfSU8L3NwYW4+JyArIFxuICAgICAgICAgICAgICAgICdMb2FkaW5nLi4uJyArIFxuICAgICAgICAgICAgJzwvZGl2PicgKyBcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicHJvZ3Jlc3NCYXJcIj4nICsgXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJwcm9ncmVzc1wiIGlkPVwiV1NFTG9hZGluZ1NjcmVlblByb2dyZXNzXCIgJyArXG4gICAgICAgICAgICAgICAgICAgICdzdHlsZT1cIndpZHRoOiB7JHByb2dyZXNzfSU7XCI+JyArIFxuICAgICAgICAgICAgICAgICc8L2Rpdj4nICsgXG4gICAgICAgICAgICAnPC9kaXY+JyArIFxuICAgICAgICAnPC9kaXY+JztcbiAgICBcbiAgICB0aGlzLl9jb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHRoaXMuX2NvbnRhaW5lci5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBcIldTRUxvYWRpbmdTY3JlZW5cIik7XG4gICAgdGhpcy5fY29udGFpbmVyLnN0eWxlLnpJbmRleCA9IDEwMDAwO1xuICAgIHRoaXMuX2NvbnRhaW5lci5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgIHRoaXMuX2NvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSBcIjEwMCVcIjtcbiAgICBcbn1cblxuTG9hZGluZ1NjcmVlbi5wcm90b3R5cGUuc2V0VGVtcGxhdGUgPSBmdW5jdGlvbiAodGVtcGxhdGUpIHtcbiAgICB0aGlzLl90ZW1wbGF0ZSA9IHRlbXBsYXRlO1xufTtcblxuTG9hZGluZ1NjcmVlbi5wcm90b3R5cGUuYWRkSXRlbSA9IGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICBpZiAodGhpcy5fZmluaXNoZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLl9sb2FkaW5nICs9IDE7XG4gICAgdGhpcy5fbWF4ICs9IDE7XG4gICAgXG4gICAgdGhpcy51cGRhdGUoKTtcbn07XG5cbkxvYWRpbmdTY3JlZW4ucHJvdG90eXBlLmNvdW50ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXg7XG59O1xuXG5Mb2FkaW5nU2NyZWVuLnByb3RvdHlwZS5pdGVtTG9hZGVkID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIGlmICh0aGlzLl9maW5pc2hlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGlmICh0aGlzLl9sb2FkZWQgPT09IHRoaXMuX21heCkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIHRoaXMuX2xvYWRpbmcgLT0gMTtcbiAgICB0aGlzLl9sb2FkZWQgKz0gMTtcbiAgICBcbiAgICBpZiAodGhpcy5fbG9hZGVkID09PSB0aGlzLl9tYXgpIHtcbiAgICAgICAgdGhpcy5fZmluaXNoZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLnRyaWdnZXIoXCJmaW5pc2hlZFwiKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy51cGRhdGUoKTtcbn07XG5cbkxvYWRpbmdTY3JlZW4ucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgcHJvZ3Jlc3M7XG4gICAgXG4gICAgaWYgKHRoaXMuX2xvYWRlZCA+IHRoaXMuX21heCkge1xuICAgICAgICB0aGlzLl9sb2FkZWQgPSB0aGlzLl9tYXg7XG4gICAgfVxuICAgIFxuICAgIHByb2dyZXNzID0gcGFyc2VJbnQoKHRoaXMuX2xvYWRlZCAvIHRoaXMuX21heCkgKiAxMDAsIDEwKTtcbiAgICBcbiAgICBpZiAodGhpcy5fbWF4IDwgMSkge1xuICAgICAgICBwcm9ncmVzcyA9IDA7XG4gICAgfVxuICAgIFxuICAgIHRoaXMuX2NvbnRhaW5lci5pbm5lckhUTUwgPSByZW5kZXIodGhpcy5fdGVtcGxhdGUsIHtcbiAgICAgICAgYWxsOiB0aGlzLl9tYXgsXG4gICAgICAgIHJlbWFpbmluZzogdGhpcy5fbWF4IC0gdGhpcy5fbG9hZGVkLFxuICAgICAgICBsb2FkZWQ6IHRoaXMuX2xvYWRlZCxcbiAgICAgICAgcHJvZ3Jlc3M6IHByb2dyZXNzXG4gICAgfSk7XG4gICAgXG59O1xuXG5Mb2FkaW5nU2NyZWVuLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24gKHBhcmVudCkge1xuICAgIHRoaXMuX2NvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJcIjtcbiAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5fY29udGFpbmVyKTtcbiAgICB0aGlzLnVwZGF0ZSgpO1xufTtcblxuTG9hZGluZ1NjcmVlbi5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgXG4gICAgZnVuY3Rpb24gdmFsRm4gKHYpIHtcbiAgICAgICAgc2VsZi5fY29udGFpbmVyLnN0eWxlLm9wYWNpdHkgPSB2O1xuICAgIH1cbiAgICBcbiAgICBmdW5jdGlvbiBmaW5pc2hGbiAoKSB7XG4gICAgICAgIHNlbGYuX2NvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIHNlbGYuX2NvbnRhaW5lci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNlbGYuX2NvbnRhaW5lcik7XG4gICAgfVxuICAgIFxuICAgIHRyYW5zZm9ybSgxLCAwLCB2YWxGbiwge1xuICAgICAgICBkdXJhdGlvbjogNTAwLFxuICAgICAgICBvbkZpbmlzaDogZmluaXNoRm5cbiAgICB9KTtcbiAgICBcbiAgICB0aGlzLl9jb250YWluZXIuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xufTtcblxuZnVuY3Rpb24gcmVuZGVyICh0ZW1wbGF0ZSwgdmFycykge1xuICAgIFxuICAgIGZvciAodmFyIGtleSBpbiB2YXJzKSB7XG4gICAgICAgIHRlbXBsYXRlID0gaW5zZXJ0VmFyKHRlbXBsYXRlLCBrZXksIHZhcnNba2V5XSk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB0ZW1wbGF0ZTtcbn1cblxuZnVuY3Rpb24gaW5zZXJ0VmFyICh0ZW1wbGF0ZSwgbmFtZSwgdmFsdWUpIHtcbiAgICByZXR1cm4gKFwiXCIgKyB0ZW1wbGF0ZSkuc3BsaXQoXCJ7JFwiICsgbmFtZSArIFwifVwiKS5qb2luKFwiXCIgKyB2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gTG9hZGluZ1NjcmVlbjtcbiIsIlxudmFyIHdhcm4gPSByZXF1aXJlKFwiLi90b29scy90b29sc1wiKS53YXJuO1xudmFyIGNvbW1hbmRzID0gcmVxdWlyZShcIi4vY29tbWFuZHNcIik7XG52YXIgZnVuY3Rpb25zID0gcmVxdWlyZShcIi4vZnVuY3Rpb25zXCIpO1xuXG5mdW5jdGlvbiBUcmlnZ2VyICh0cmlnZ2VyLCBpbnRlcnByZXRlcikge1xuICAgIFxuICAgIHZhciBzZWxmID0gdGhpcywgZm47XG4gICAgXG4gICAgdGhpcy5uYW1lID0gdHJpZ2dlci5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpIHx8IG51bGw7XG4gICAgdGhpcy5ldmVudCA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKFwiZXZlbnRcIikgfHwgbnVsbDtcbiAgICB0aGlzLnNwZWNpYWwgPSB0cmlnZ2VyLmdldEF0dHJpYnV0ZShcInNwZWNpYWxcIikgfHwgbnVsbDtcbiAgICB0aGlzLmZuTmFtZSA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKFwiZnVuY3Rpb25cIikgfHwgbnVsbDtcbiAgICB0aGlzLnNjZW5lID0gdHJpZ2dlci5nZXRBdHRyaWJ1dGUoXCJzY2VuZVwiKSB8fCBudWxsO1xuICAgIHRoaXMuaW50ZXJwcmV0ZXIgPSBpbnRlcnByZXRlcjtcbiAgICB0aGlzLmlzU3Vic2NyaWJlZCA9IGZhbHNlO1xuICAgIFxuICAgIGlmICh0aGlzLm5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgd2FybihpbnRlcnByZXRlci5idXMsIFwiTm8gJ25hbWUnIGF0dHJpYnV0ZSBzcGVjaWZpZWQgb24gJ3RyaWdnZXInIGVsZW1lbnQuXCIsIHRyaWdnZXIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGlmICh0aGlzLmV2ZW50ID09PSBudWxsKSB7XG4gICAgICAgIFxuICAgICAgICB3YXJuKGludGVycHJldGVyLmJ1cywgXCJObyAnZXZlbnQnIGF0dHJpYnV0ZSBzcGVjaWZpZWQgb24gJ3RyaWdnZXInIGVsZW1lbnQgJ1wiICtcbiAgICAgICAgICAgIHRoaXMubmFtZSArIFwiJy5cIiwgdHJpZ2dlcik7XG4gICAgICAgIFxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGlmICh0aGlzLnNwZWNpYWwgPT09IG51bGwgJiYgdGhpcy5mbk5hbWUgPT09IG51bGwgJiYgdGhpcy5zY2VuZSA9PT0gbnVsbCkge1xuICAgICAgICBcbiAgICAgICAgd2FybihpbnRlcnByZXRlci5idXMsIFwiTm8gc3VpdGFibGUgYWN0aW9uIG9yIGZ1bmN0aW9uIGZvdW5kIGZvciB0cmlnZ2VyIGVsZW1lbnQgJ1wiICtcbiAgICAgICAgICAgIHRoaXMubmFtZSArIFwiJy5cIiwgdHJpZ2dlcik7XG4gICAgICAgIFxuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIGlmICh0aGlzLnNjZW5lKSB7XG4gICAgICAgIFxuICAgICAgICBmbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbW1hbmRzLnN1Yih0cmlnZ2VyLCBpbnRlcnByZXRlcik7XG4gICAgICAgICAgICBpbnRlcnByZXRlci5pbmRleCA9IDA7XG4gICAgICAgICAgICBpbnRlcnByZXRlci5jdXJyZW50RWxlbWVudCA9IDA7XG4gICAgICAgICAgICBpbnRlcnByZXRlci5uZXh0KCk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIHRoaXMuaXNLZXlFdmVudCA9IGZhbHNlO1xuICAgIHRoaXMua2V5ID0gbnVsbDtcbiAgICBcbiAgICBpZiAodGhpcy5zcGVjaWFsICE9PSBudWxsICYmIHRoaXMuc3BlY2lhbCAhPT0gXCJuZXh0XCIpIHtcbiAgICAgICAgXG4gICAgICAgIHdhcm4oaW50ZXJwcmV0ZXIuYnVzLCBcIlVua25vd24gc3BlY2lhbCBzcGVjaWZpZWQgb24gdHJpZ2dlciBlbGVtZW50ICdcIiArXG4gICAgICAgICAgICB0aGlzLm5hbWUgKyBcIicuXCIsIHRyaWdnZXIpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICBpZiAodGhpcy5zcGVjaWFsID09PSBcIm5leHRcIikge1xuICAgICAgICBcbiAgICAgICAgZm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChzZWxmLmludGVycHJldGVyLnN0YXRlID09PSBcInBhdXNlXCIgfHwgc2VsZi5pbnRlcnByZXRlci53YWl0Q291bnRlciA+IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNlbGYuaW50ZXJwcmV0ZXIubmV4dCgpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBcbiAgICBpZiAodGhpcy5mbk5hbWUgIT09IG51bGwpIHtcbiAgICAgICAgXG4gICAgICAgIGlmICh0eXBlb2YgZnVuY3Rpb25zW3RoaXMuZm5OYW1lXSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHdhcm4oaW50ZXJwcmV0ZXIuYnVzLCBcIlVua25vd24gZnVuY3Rpb24gc3BlY2lmaWVkIG9uIHRyaWdnZXIgZWxlbWVudCAnXCIgK1xuICAgICAgICAgICAgICAgIHRoaXMubmFtZSArIFwiJy5cIiwgdHJpZ2dlcik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBmdW5jdGlvbnNbc2VsZi5mbk5hbWVdKHNlbGYuaW50ZXJwcmV0ZXIsIHRyaWdnZXIpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBcbiAgICBzd2l0Y2ggKHRoaXMuZXZlbnQpIHtcbiAgICAgICAgXG4gICAgICAgIGNhc2UgXCJrZXl1cFwiOlxuICAgICAgICBjYXNlIFwia2V5ZG93blwiOlxuICAgICAgICBjYXNlIFwia2V5cHJlc3NcIjpcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5pc0tleUV2ZW50ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMua2V5ID0gdHJpZ2dlci5nZXRBdHRyaWJ1dGUoXCJrZXlcIikgfHwgbnVsbDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHRoaXMua2V5ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgd2FybihpbnRlcnByZXRlci5idXMsIFwiTm8gJ2tleScgYXR0cmlidXRlIHNwZWNpZmllZCBvbiB0cmlnZ2VyIGVsZW1lbnQgJ1wiICtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uYW1lICsgXCInLlwiLCB0cmlnZ2VyKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0eXBlb2YgaW50ZXJwcmV0ZXIuZ2FtZS5rZXlzLmtleXNbdGhpcy5rZXldID09PSBcInVuZGVmaW5lZFwiIHx8XG4gICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXIuZ2FtZS5rZXlzLmtleXNbdGhpcy5rZXldID09PSBudWxsXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB3YXJuKGludGVycHJldGVyLmJ1cywgXCJVbmtub3duIGtleSAnXCIgKyB0aGlzLmtleSArIFwiJyBzcGVjaWZpZWQgb24gdHJpZ2dlciBcIiArXG4gICAgICAgICAgICAgICAgICAgIFwiZWxlbWVudCAnXCIgKyB0aGlzLm5hbWUgKyBcIicuXCIsIHRyaWdnZXIpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5mbiA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEua2V5c1tzZWxmLmtleV0ua2MgIT09IGRhdGEuZXZlbnQua2V5Q29kZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChpbnRlcnByZXRlci5rZXlzRGlzYWJsZWQgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIFxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhpcy5mbiA9IGZuO1xuICAgIH1cbn1cblxuVHJpZ2dlci5wcm90b3R5cGUuYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgaWYgKHRoaXMuaXNTdWJzY3JpYmVkID09PSB0cnVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5pbnRlcnByZXRlci5idXMuc3Vic2NyaWJlKHRoaXMuZm4sIHRoaXMuZXZlbnQpO1xuICAgIHRoaXMuaXNTdWJzY3JpYmVkID0gdHJ1ZTtcbn07XG5cblRyaWdnZXIucHJvdG90eXBlLmRlYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgaWYgKHRoaXMuaXNTdWJzY3JpYmVkID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIFxuICAgIHRoaXMuaW50ZXJwcmV0ZXIuYnVzLnVuc3Vic2NyaWJlKHRoaXMuZm4sIHRoaXMuZXZlbnQpO1xuICAgIHRoaXMuaXNTdWJzY3JpYmVkID0gZmFsc2U7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyaWdnZXI7XG4iLCJcbnZhciBBdWRpbyA9IHJlcXVpcmUoXCIuL2Fzc2V0cy9BdWRpb1wiKTtcbnZhciBCYWNrZ3JvdW5kID0gcmVxdWlyZShcIi4vYXNzZXRzL0JhY2tncm91bmRcIik7XG52YXIgQ2hhcmFjdGVyID0gcmVxdWlyZShcIi4vYXNzZXRzL0NoYXJhY3RlclwiKTtcbnZhciBDb21wb3NpdGUgPSByZXF1aXJlKFwiLi9hc3NldHMvQ29tcG9zaXRlXCIpO1xudmFyIEN1cnRhaW4gPSByZXF1aXJlKFwiLi9hc3NldHMvQ3VydGFpblwiKTtcbnZhciBJbWFnZXBhY2sgPSByZXF1aXJlKFwiLi9hc3NldHMvSW1hZ2VwYWNrXCIpO1xudmFyIFRleHRib3ggPSByZXF1aXJlKFwiLi9hc3NldHMvVGV4dGJveFwiKTtcblxudmFyIGFzc2V0cyA9IHtcbiAgICBBdWRpbzogQXVkaW8sXG4gICAgQmFja2dyb3VuZDogQmFja2dyb3VuZCxcbiAgICBDaGFyYWN0ZXI6IENoYXJhY3RlcixcbiAgICBDdXJ0YWluOiBDdXJ0YWluLFxuICAgIEltYWdlcGFjazogSW1hZ2VwYWNrLFxuICAgIFRleHRib3g6IFRleHRib3gsXG4gICAgQ29tcG9zaXRlOiBDb21wb3NpdGVcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYXNzZXRzO1xuIiwiLyogZ2xvYmFsIHVzaW5nICovXG5cbnZhciB0b29scyA9IHJlcXVpcmUoXCIuLi90b29scy90b29sc1wiKTtcbnZhciBIb3dsID0gcmVxdWlyZShcImhvd2xlclwiKS5Ib3dsO1xuXG52YXIgd2FybiA9IHRvb2xzLndhcm47XG52YXIgdHJ1dGh5ID0gdG9vbHMudHJ1dGh5O1xuXG4vKipcbiAqIENvbnN0cnVjdG9yIGZvciB0aGUgPGF1ZGlvPiBhc3NldC5cbiAqIFxuICogQHBhcmFtIGFzc2V0IFtYTUwgRE9NIEVsZW1lbnRdIFRoZSBhc3NldCBkZWZpbml0aW9uLlxuICogQHBhcmFtIGludGVycHJldGVyIFtvYmplY3RdIFRoZSBpbnRlcnByZXRlciBpbnN0YW5jZS5cbiAqIEB0cmlnZ2VyIHdzZS5pbnRlcnByZXRlci53YXJuaW5nQGludGVycHJldGVyXG4gKiBAdHJpZ2dlciB3c2UuYXNzZXRzLmF1ZGlvLmNvbnN0cnVjdG9yQGludGVycHJldGVyXG4gKi9cbmZ1bmN0aW9uIEF1ZGlvIChhc3NldCwgaW50ZXJwcmV0ZXIpIHtcbiAgICBcbiAgICB2YXIgc291cmNlcywgaSwgbGVuLCBqLCBqbGVuLCBjdXJyZW50LCB0cmFjaywgdHJhY2tOYW1lO1xuICAgIHZhciB0cmFja0ZpbGVzLCBocmVmLCB0eXBlLCBzb3VyY2UsIHRyYWNrcywgYnVzLCB0cmFja1NldHRpbmdzO1xuICAgIFxuICAgIGJ1cyA9IGludGVycHJldGVyLmJ1cztcbiAgICBcbiAgICB0aGlzLmludGVycHJldGVyID0gaW50ZXJwcmV0ZXI7XG4gICAgdGhpcy5idXMgPSBidXM7XG4gICAgdGhpcy5uYW1lID0gYXNzZXQuZ2V0QXR0cmlidXRlKFwibmFtZVwiKTtcbiAgICB0aGlzLnRyYWNrcyA9IHt9O1xuICAgIHRoaXMuYXV0b3BhdXNlID0gdHJ1dGh5KGFzc2V0LmdldEF0dHJpYnV0ZShcImF1dG9wYXVzZVwiKSk7XG4gICAgdGhpcy5sb29wID0gdHJ1dGh5KGFzc2V0LmdldEF0dHJpYnV0ZShcImxvb3BcIikpO1xuICAgIHRoaXMuZmFkZSA9IHRydXRoeShhc3NldC5nZXRBdHRyaWJ1dGUoXCJmYWRlXCIpKTtcbiAgICB0aGlzLmZhZGVpbkR1cmF0aW9uID0gcGFyc2VJbnQoYXNzZXQuZ2V0QXR0cmlidXRlKFwiZmFkZWluXCIpKSB8fCAxMDAwO1xuICAgIHRoaXMuZmFkZW91dER1cmF0aW9uID0gcGFyc2VJbnQoYXNzZXQuZ2V0QXR0cmlidXRlKFwiZmFkZW91dFwiKSkgfHwgMTAwMDtcbiAgICB0aGlzLl9wbGF5aW5nID0gZmFsc2U7XG4gICAgXG4gICAgdHJhY2tzID0gYXNzZXQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJ0cmFja1wiKTtcbiAgICBsZW4gPSB0cmFja3MubGVuZ3RoO1xuICAgIFxuICAgIGlmIChsZW4gPCAxKSB7XG4gICAgICAgIFxuICAgICAgICB3YXJuKHRoaXMuYnVzLCBcIk5vIHRyYWNrcyBkZWZpbmVkIGZvciBhdWRpbyBlbGVtZW50ICdcIiArIHRoaXMubmFtZSArIFwiJy5cIiwgYXNzZXQpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRvTmV4dDogdHJ1ZVxuICAgICAgICB9O1xuICAgIH1cbiAgICBcbiAgICAvLyBjaGVjayBhbGwgc291cmNlcyBhbmQgY3JlYXRlIEhvd2wgaW5zdGFuY2VzOlxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICBcbiAgICAgICAgY3VycmVudCA9IHRyYWNrc1tpXTtcbiAgICAgICAgXG4gICAgICAgIHRyYWNrTmFtZSA9IGN1cnJlbnQuZ2V0QXR0cmlidXRlKFwidGl0bGVcIik7XG4gICAgICAgIFxuICAgICAgICBpZiAodHJhY2tOYW1lID09PSBudWxsKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHdhcm4odGhpcy5idXMsIFwiTm8gdGl0bGUgZGVmaW5lZCBmb3IgdHJhY2sgJ1wiICsgdHJhY2tOYW1lICsgXG4gICAgICAgICAgICAgICAgXCInIGluIGF1ZGlvIGVsZW1lbnQgJ1wiICsgdGhpcy5uYW1lICsgXCInLlwiLCBhc3NldCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBzb3VyY2VzID0gY3VycmVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNvdXJjZVwiKTtcbiAgICAgICAgamxlbiA9IHNvdXJjZXMubGVuZ3RoO1xuICAgICAgICBcbiAgICAgICAgaWYgKGpsZW4gPCAxKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHdhcm4odGhpcy5idXMsIFwiTm8gc291cmNlcyBkZWZpbmVkIGZvciB0cmFjayAnXCIgKyB0cmFja05hbWUgK1xuICAgICAgICAgICAgICAgIFwiJyBpbiBhdWRpbyBlbGVtZW50ICdcIiArIHRoaXMubmFtZSArIFwiJy5cIiwgYXNzZXQpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdHJhY2tTZXR0aW5ncyA9IHtcbiAgICAgICAgICAgIHVybHM6IFtdLFxuICAgICAgICAgICAgYXV0b3BsYXk6IGZhbHNlLFxuICAgICAgICAgICAgbG9vcDogdGhpcy5sb29wIHx8IGZhbHNlLFxuICAgICAgICAgICAgb25sb2FkOiB0aGlzLmJ1cy50cmlnZ2VyLmJpbmQodGhpcy5idXMsIFwid3NlLmFzc2V0cy5sb2FkaW5nLmRlY3JlYXNlXCIpXG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICB0cmFja0ZpbGVzID0ge307XG4gICAgICAgIFxuICAgICAgICBmb3IgKGogPSAwOyBqIDwgamxlbjsgaiArPSAxKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNvdXJjZSA9IHNvdXJjZXNbal07XG4gICAgICAgICAgICBocmVmID0gc291cmNlLmdldEF0dHJpYnV0ZShcImhyZWZcIik7XG4gICAgICAgICAgICB0eXBlID0gc291cmNlLmdldEF0dHJpYnV0ZShcInR5cGVcIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChocmVmID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgd2Fybih0aGlzLmJ1cywgXCJObyBocmVmIGRlZmluZWQgZm9yIHNvdXJjZSBpbiB0cmFjayAnXCIgK1xuICAgICAgICAgICAgICAgICAgICB0cmFja05hbWUgKyBcIicgaW4gYXVkaW8gZWxlbWVudCAnXCIgKyB0aGlzLm5hbWUgKyBcIicuXCIsIGFzc2V0KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHR5cGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB3YXJuKHRoaXMuYnVzLCBcIk5vIHR5cGUgZGVmaW5lZCBmb3Igc291cmNlIGluIHRyYWNrICdcIiArIFxuICAgICAgICAgICAgICAgICAgICB0cmFja05hbWUgKyBcIicgaW4gYXVkaW8gZWxlbWVudCAnXCIgKyB0aGlzLm5hbWUgKyBcIicuXCIsIGFzc2V0KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdHJhY2tGaWxlc1t0eXBlXSA9IGhyZWY7XG4gICAgICAgICAgICB0cmFja1NldHRpbmdzLnVybHMucHVzaChocmVmKTtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLmJ1cy50cmlnZ2VyKFwid3NlLmFzc2V0cy5sb2FkaW5nLmluY3JlYXNlXCIpO1xuICAgICAgICBcbiAgICAgICAgdHJhY2sgPSBuZXcgSG93bCh0cmFja1NldHRpbmdzKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMudHJhY2tzW3RyYWNrTmFtZV0gPSB0cmFjaztcbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogU3RhcnRzIHBsYXlpbmcgdGhlIGN1cnJlbnQgdHJhY2suXG4gICAgICogXG4gICAgICogQHBhcmFtIGNvbW1hbmQgW1hNTCBET00gRWxlbWVudF0gVGhlIGNvbW1hbmQgYXMgd3JpdHRlbiBpbiB0aGUgV2ViU3RvcnkuXG4gICAgICogQHJldHVybiBbb2JqZWN0XSBPYmplY3QgdGhhdCBkZXRlcm1pbmVzIHRoZSBuZXh0IHN0YXRlIG9mIHRoZSBpbnRlcnByZXRlci5cbiAgICAgKi9cbiAgICB0aGlzLnBsYXkgPSBmdW5jdGlvbiAoY29tbWFuZCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIGZhZGVEdXJhdGlvbjtcbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLl9wbGF5aW5nKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGRvTmV4dDogdHJ1ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5fcGxheWluZyA9IHRydWU7XG4gICAgICAgIHRoaXMuX3BhdXNlZCA9IGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgaWYgKGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwiZmFkZWluXCIpKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgKz0gMTtcbiAgICAgICAgICAgIGZhZGVEdXJhdGlvbiA9ICtjb21tYW5kLmdldEF0dHJpYnV0ZShcImZhZGVpblwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy50cmFja3NbdGhpcy5fY3VycmVudFRyYWNrXS52b2x1bWUoMCk7XG4gICAgICAgICAgICB0aGlzLnRyYWNrc1t0aGlzLl9jdXJyZW50VHJhY2tdLnBsYXkoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy50cmFja3NbdGhpcy5fY3VycmVudFRyYWNrXS5mYWRlKDAsIDEsIGZhZGVEdXJhdGlvbiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgLT0gMTtcbiAgICAgICAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRyYWNrc1t0aGlzLl9jdXJyZW50VHJhY2tdLnBsYXkoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRvTmV4dDogdHJ1ZVxuICAgICAgICB9O1xuICAgIH07XG4gICAgXG4gICAgLyoqXG4gICAgICogU3RvcHMgcGxheWluZyB0aGUgY3VycmVudCB0cmFjay5cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gY29tbWFuZCBbWE1MIERPTSBFbGVtZW50XSBUaGUgY29tbWFuZCBhcyB3cml0dGVuIGluIHRoZSBXZWJTdG9yeS5cbiAgICAgKiBAcmV0dXJuIFtvYmplY3RdIE9iamVjdCB0aGF0IGRldGVybWluZXMgdGhlIG5leHQgc3RhdGUgb2YgdGhlIGludGVycHJldGVyLlxuICAgICAqL1xuICAgIHRoaXMuc3RvcCA9IGZ1bmN0aW9uIChjb21tYW5kKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgZmFkZUR1cmF0aW9uO1xuICAgICAgICBcbiAgICAgICAgaWYgKCF0aGlzLl9jdXJyZW50VHJhY2spIHtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZG9OZXh0OiB0cnVlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICB0aGlzLl9wbGF5aW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3BhdXNlZCA9IGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgaWYgKGNvbW1hbmQgJiYgY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJmYWRlb3V0XCIpKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgKz0gMTtcbiAgICAgICAgICAgIGZhZGVEdXJhdGlvbiA9ICtjb21tYW5kLmdldEF0dHJpYnV0ZShcImZhZGVvdXRcIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMudHJhY2tzW3RoaXMuX2N1cnJlbnRUcmFja10uZmFkZSgxLCAwLCBmYWRlRHVyYXRpb24sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyYWNrc1t0aGlzLl9jdXJyZW50VHJhY2tdLnN0b3AoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmludGVycHJldGVyLndhaXRDb3VudGVyIC09IDE7XG4gICAgICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50cmFja3NbdGhpcy5fY3VycmVudFRyYWNrXS5zdG9wKCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRoaXMuYnVzLnRyaWdnZXIoXCJ3c2UuYXNzZXRzLmF1ZGlvLnN0b3BcIiwgdGhpcyk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZG9OZXh0OiB0cnVlXG4gICAgICAgIH07XG4gICAgfTtcbiAgICBcbiAgICAvKipcbiAgICAgKiBQYXVzZXMgcGxheWluZyB0aGUgY3VycmVuIHRyYWNrLlxuICAgICAqIFxuICAgICAqIEByZXR1cm4gW29iamVjdF0gT2JqZWN0IHRoYXQgZGV0ZXJtaW5lcyB0aGUgbmV4dCBzdGF0ZSBvZiB0aGUgaW50ZXJwcmV0ZXIuXG4gICAgICovXG4gICAgdGhpcy5wYXVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXG4gICAgICAgIGlmICghdGhpcy5fY3VycmVudFRyYWNrIHx8ICF0aGlzLl9wbGF5aW5nKSB7XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIGRvTmV4dDogdHJ1ZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhpcy5fcGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMudHJhY2tzW3RoaXMuX2N1cnJlbnRUcmFja10ucGF1c2UoKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkb05leHQ6IHRydWVcbiAgICAgICAgfTtcbiAgICB9O1xuICAgIFxuICAgIHRoaXMuYnVzLnRyaWdnZXIoXCJ3c2UuYXNzZXRzLmF1ZGlvLmNvbnN0cnVjdG9yXCIsIHRoaXMpO1xuICAgIFxuICAgIHRoaXMuYnVzLnN1YnNjcmliZShcIndzZS5pbnRlcnByZXRlci5yZXN0YXJ0XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgfS5iaW5kKHRoaXMpKTtcbiAgICBcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fcGxheWluZykge1xuICAgICAgICAgICAgdGhpcy50cmFja3NbdGhpcy5fY3VycmVudFRyYWNrXS5mYWRlKDEsIDAsIDIwMCk7XG4gICAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpO1xuICAgIFxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5fcGxheWluZykge1xuICAgICAgICAgICAgdGhpcy50cmFja3NbdGhpcy5fY3VycmVudFRyYWNrXS5mYWRlKDAsIDEsIDIwMCk7XG4gICAgICAgIH1cbiAgICB9LmJpbmQodGhpcykpO1xufVxuXG4vKipcbiAqIENoYW5nZXMgdGhlIGN1cnJlbnRseSBhY3RpdmUgdHJhY2suXG4gKiBcbiAqIEBwYXJhbSBjb21tYW5kIFtET00gRWxlbWVudF0gVGhlIGNvbW1hbmQgYXMgc3BlY2lmaWVkIGluIHRoZSBXZWJTdG9yeS5cbiAqIEB0cmlnZ2VyIHdzZS5pbnRlcnByZXRlci53YXJuaW5nQGludGVycHJldGVyXG4gKiBAdHJpZ2dlciB3c2UuYXNzZXRzLmF1ZGlvLnNldEBpbnRlcnByZXRlclxuICovXG5BdWRpby5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGNvbW1hbmQpIHtcbiAgICBcbiAgICB2YXIgd2FzUGxheWluZyA9IGZhbHNlO1xuICAgIFxuICAgIGlmICh0aGlzLl9wbGF5aW5nKSB7XG4gICAgICAgIHdhc1BsYXlpbmcgPSB0cnVlO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLnN0b3AoKTtcbiAgICBcbiAgICB0aGlzLl9jdXJyZW50VHJhY2sgPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcInRyYWNrXCIpO1xuICAgIFxuICAgIGlmICh3YXNQbGF5aW5nKSB7XG4gICAgICAgIHRoaXMucGxheShjb21tYW5kKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZG9OZXh0OiB0cnVlXG4gICAgfTtcbn07XG5cbi8qKlxuICogR2F0aGVycyB0aGUgZGF0YSB0byBwdXQgaW50byBhIHNhdmVnYW1lLlxuICogXG4gKiBAcGFyYW0gb2JqIFtvYmplY3RdIFRoZSBzYXZlZ2FtZSBvYmplY3QuXG4gKi9cbkF1ZGlvLnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciBvYmogPSB7XG4gICAgICAgIGN1cnJlbnRUcmFjazogdGhpcy5fY3VycmVudFRyYWNrLFxuICAgICAgICBwbGF5aW5nOiB0aGlzLl9wbGF5aW5nLFxuICAgICAgICBwYXVzZWQ6IHRoaXMuX3BhdXNlZFxuICAgIH07XG4gICAgXG4gICAgdGhpcy5idXMudHJpZ2dlcihcIndzZS5hc3NldHMuYXVkaW8uc2F2ZVwiLCB0aGlzKTtcbiAgICBcbiAgICByZXR1cm4gb2JqO1xufTtcblxuLyoqXG4gKiBSZXN0b3JlIGZ1bmN0aW9uIGZvciBsb2FkaW5nIHRoZSBzdGF0ZSBmcm9tIGEgc2F2ZWdhbWUuXG4gKiBcbiAqIEBwYXJhbSBvYmogW29iamVjdF0gVGhlIHNhdmVnYW1lIGRhdGEuXG4gKiBAdHJpZ2dlciB3c2UuYXNzZXRzLmF1ZGlvLnJlc3RvcmVAaW50ZXJwcmV0ZXJcbiAqL1xuQXVkaW8ucHJvdG90eXBlLnJlc3RvcmUgPSBmdW5jdGlvbiAodmFscykge1xuICAgIFxuICAgIHZhciBrZXk7XG4gICAgXG4gICAgdGhpcy5fcGxheWluZyA9IHZhbHMucGxheWluZztcbiAgICB0aGlzLl9wYXVzZWQgPSB2YWxzLnBhdXNlZDtcbiAgICB0aGlzLl9jdXJyZW50VHJhY2sgPSB2YWxzLmN1cnJlbnRUcmFjaztcbiAgICBcbiAgICBmb3IgKGtleSBpbiB0aGlzLnRyYWNrcykge1xuICAgICAgICB0aGlzLnRyYWNrc1trZXldLnN0b3AoKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMuX3BsYXlpbmcgJiYgIXRoaXMuX3BhdXNlZCkge1xuICAgICAgICB0aGlzLnRyYWNrc1t0aGlzLl9jdXJyZW50VHJhY2tdLnBsYXkoKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5idXMudHJpZ2dlcihcIndzZS5hc3NldHMuYXVkaW8ucmVzdG9yZVwiLCB0aGlzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQXVkaW87XG4iLCJcbnZhciB3YXJuID0gcmVxdWlyZShcIi4uL3Rvb2xzL3Rvb2xzXCIpLndhcm47XG52YXIgRGlzcGxheU9iamVjdCA9IHJlcXVpcmUoXCIuLi9EaXNwbGF5T2JqZWN0XCIpO1xuXG5mdW5jdGlvbiByZXNpemUgKHNlbGYpIHtcbiAgICBzZWxmLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwid2lkdGhcIiwgc2VsZi5zdGFnZS5vZmZzZXRXaWR0aCk7XG4gICAgc2VsZi5lbGVtZW50LnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBzZWxmLnN0YWdlLm9mZnNldEhlaWdodCk7XG59XG5cbmZ1bmN0aW9uIHN0eWxlRWxlbWVudCAoc2VsZikge1xuICAgIFxuICAgIHZhciBzID0gc2VsZi5lbGVtZW50LnN0eWxlO1xuICAgIFxuICAgIHNlbGYuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBzZWxmLmNzc2lkKTtcbiAgICBzZWxmLmVsZW1lbnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJXU0VCYWNrZ3JvdW5kXCIpO1xuICAgIHNlbGYuZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICBzZWxmLmVsZW1lbnQuZHJhZ2dhYmxlID0gZmFsc2U7XG4gICAgcy5sZWZ0ID0gMDtcbiAgICBzLnRvcCA9IDA7XG4gICAgcy5vcGFjaXR5ID0gMDtcbiAgICBzLnpJbmRleCA9IHNlbGYuejtcbn1cblxuZnVuY3Rpb24gQmFja2dyb3VuZCAoYXNzZXQpIHtcbiAgICBcbiAgICB0aGlzLmVsZW1lbnRUeXBlID0gXCJpbWdcIjtcbiAgICBcbiAgICBEaXNwbGF5T2JqZWN0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIFxuICAgIHRoaXMuYXNzZXQgPSBhc3NldDtcbiAgICB0aGlzLmNzc2lkID0gdGhpcy5jc3NpZCB8fCBcIldTRUJhY2tncm91bmRfXCIgKyB0aGlzLmlkO1xuICAgIHRoaXMuc3JjID0gYXNzZXQuZ2V0QXR0cmlidXRlKCdzcmMnKTtcbiAgICBcbiAgICBpZiAoIXRoaXMuc3JjKSB7XG4gICAgICAgIHdhcm4odGhpcy5idXMsICdObyBzb3VyY2UgZGVmaW5lZCBvbiBiYWNrZ3JvdW5kIGFzc2V0LicsIGFzc2V0KTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLmVsZW1lbnQuc2V0QXR0cmlidXRlKCdzcmMnLCB0aGlzLnNyYyk7XG4gICAgXG4gICAgc3R5bGVFbGVtZW50KHRoaXMpO1xuICAgIHJlc2l6ZSh0aGlzKTtcbiAgICBcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24gKCkgeyByZXNpemUoc2VsZik7IH0pO1xufVxuXG5CYWNrZ3JvdW5kLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRGlzcGxheU9iamVjdC5wcm90b3R5cGUpO1xuXG5CYWNrZ3JvdW5kLnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIGNzc2lkOiB0aGlzLmNzc2lkLFxuICAgICAgICB6OiB0aGlzLnpcbiAgICB9O1xufTtcblxuQmFja2dyb3VuZC5wcm90b3R5cGUucmVzdG9yZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICBcbiAgICB0aGlzLmNzc2lkID0gb2JqLmNzc2lkO1xuICAgIHRoaXMueiA9IG9iai56O1xuICAgIFxuICAgIHRyeSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY3NzaWQpO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgICB3YXJuKHRoaXMuYnVzLCBcIkVsZW1lbnQgd2l0aCBDU1MgSUQgJ1wiICsgdGhpcy5jc3NpZCArIFwiJyBjb3VsZCBub3QgYmUgZm91bmQuXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCYWNrZ3JvdW5kO1xuIiwiXG5mdW5jdGlvbiBDaGFyYWN0ZXIgKGFzc2V0LCBpbnRlcnByZXRlcikge1xuICAgIFxuICAgIHRoaXMuYXNzZXQgPSBhc3NldDtcbiAgICB0aGlzLnN0YWdlID0gaW50ZXJwcmV0ZXIuc3RhZ2U7XG4gICAgdGhpcy5idXMgPSBpbnRlcnByZXRlci5idXM7XG4gICAgdGhpcy5uYW1lID0gYXNzZXQuZ2V0QXR0cmlidXRlKCduYW1lJyk7XG4gICAgdGhpcy5idXMudHJpZ2dlcihcIndzZS5hc3NldHMuY2hhcmFjdGVyLmNvbnN0cnVjdG9yXCIsIHRoaXMpO1xufVxuXG5DaGFyYWN0ZXIucHJvdG90eXBlLnNldFRleHRib3ggPSBmdW5jdGlvbiAoY29tbWFuZCkge1xuICAgIHRoaXMuYXNzZXQuc2V0QXR0cmlidXRlKFwidGV4dGJveFwiLCBjb21tYW5kLmdldEF0dHJpYnV0ZShcInRleHRib3hcIikpO1xuICAgIHRoaXMuYnVzLnRyaWdnZXIoXCJ3c2UuYXNzZXRzLmNoYXJhY3Rlci5zZXR0ZXh0Ym94XCIsIHRoaXMpO1xufTtcblxuQ2hhcmFjdGVyLnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciBvYmogPSB7XG4gICAgICAgIGFzc2V0VHlwZTogXCJDaGFyYWN0ZXJcIixcbiAgICAgICAgdGV4dGJveE5hbWU6IHRoaXMuYXNzZXQuZ2V0QXR0cmlidXRlKFwidGV4dGJveFwiKVxuICAgIH07XG4gICAgXG4gICAgdGhpcy5idXMudHJpZ2dlcihcbiAgICAgICAgXCJ3c2UuYXNzZXRzLmNoYXJhY3Rlci5zYXZlXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIHN1YmplY3Q6IHRoaXMsXG4gICAgICAgICAgICBzYXZlczogb2JqXG4gICAgICAgIH1cbiAgICApO1xuICAgIFxuICAgIHJldHVybiBvYmo7XG59O1xuXG5DaGFyYWN0ZXIucHJvdG90eXBlLnJlc3RvcmUgPSBmdW5jdGlvbiAob2JqKSB7XG4gICAgXG4gICAgdGhpcy5hc3NldC5zZXRBdHRyaWJ1dGUoXCJ0ZXh0Ym94XCIsIG9iai50ZXh0Ym94TmFtZSk7XG4gICAgXG4gICAgdGhpcy5idXMudHJpZ2dlcihcbiAgICAgICAgXCJ3c2UuYXNzZXRzLmNoYXJhY3Rlci5yZXN0b3JlXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIHN1YmplY3Q6IHRoaXMsXG4gICAgICAgICAgICBzYXZlczogb2JqXG4gICAgICAgIH1cbiAgICApO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDaGFyYWN0ZXI7XG4iLCJcbnZhciBlYXNpbmcgPSByZXF1aXJlKFwiZWFzZXNcIik7XG52YXIgdHJhbnNmb3JtID0gcmVxdWlyZShcInRyYW5zZm9ybS1qc1wiKS50cmFuc2Zvcm07XG5cbnZhciB3YXJuID0gcmVxdWlyZShcIi4uL3Rvb2xzL3Rvb2xzXCIpLndhcm47XG52YXIgRGlzcGxheU9iamVjdCA9IHJlcXVpcmUoXCIuLi9EaXNwbGF5T2JqZWN0XCIpO1xuXG4vKipcbiAqIENvbnN0cnVjdG9yIGZ1bmN0aW9uIGZvciBDb21wb3NpdGVzLlxuICogXG4gKiBAcGFyYW0gYXNzZXQgW0RPTSBFbGVtZW50XSBUaGUgYXNzZXQgZGVmaW5pdGlvbi5cbiAqIEBwYXJhbSBpbnRlcnByZXRlciBbV1NFLkludGVycHJldGVyXSBUaGUgaW50ZXJwcmV0ZXIgb2JqZWN0LlxuICovXG5mdW5jdGlvbiBDb21wb3NpdGUgKGFzc2V0KSB7XG4gICAgXG4gICAgdmFyIGVsZW1lbnQsIGNoaWxkcmVuO1xuICAgIHZhciBzZWxmLCB0cmlnZ2VyRGVjcmVhc2VGbiwgd2lkdGgsIGhlaWdodDtcbiAgICBcbiAgICB0aGlzLl9ib3hTaXplU2VsZWN0b3JzID0gW1wiaW1nXCJdO1xuICAgIFxuICAgIERpc3BsYXlPYmplY3QuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBcbiAgICB0aGlzLmNzc2lkID0gdGhpcy5jc3NpZCB8fCBcIndzZV9jb21wb3NpdGVfXCIgKyB0aGlzLm5hbWU7XG4gICAgXG4gICAgc2VsZiA9IHRoaXM7XG4gICAgZWxlbWVudCA9IHRoaXMuZWxlbWVudDtcbiAgICB3aWR0aCA9IHRoaXMud2lkdGg7XG4gICAgaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgXG4gICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImFzc2V0IGNvbXBvc2l0ZVwiKTtcbiAgICBcbiAgICBjaGlsZHJlbiA9IGFzc2V0LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW1hZ2VcIik7XG4gICAgdHJpZ2dlckRlY3JlYXNlRm4gPVxuICAgICAgICBzZWxmLmJ1cy50cmlnZ2VyLmJpbmQoc2VsZi5idXMsIFwid3NlLmFzc2V0cy5sb2FkaW5nLmRlY3JlYXNlXCIsIG51bGwsIGZhbHNlKTtcbiAgICBcbiAgICBbXS5mb3JFYWNoLmNhbGwoY2hpbGRyZW4sIGZ1bmN0aW9uIChjdXJyZW50KSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgdGFncywgc3JjLCBpbWFnZTtcbiAgICAgICAgXG4gICAgICAgIHRhZ3MgPSBjdXJyZW50LmdldEF0dHJpYnV0ZShcInRhZ3NcIik7XG4gICAgICAgIHNyYyA9IGN1cnJlbnQuZ2V0QXR0cmlidXRlKFwic3JjXCIpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHRhZ3MgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHdhcm4oc2VsZi5idXMsIFwiSW1hZ2Ugd2l0aG91dCB0YWdzIGluIGNvbXBvc2l0ZSAnXCIgKyBzZWxmLm5hbWUgKyBcIicuXCIsIGFzc2V0KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKHNyYyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgd2FybihzZWxmLmJ1cywgXCJJbWFnZSB3aXRob3V0IHNyYyBpbiBjb21wb3NpdGUgJ1wiICsgc2VsZi5uYW1lICsgXCInLlwiLCBhc3NldCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgICAgIFxuICAgICAgICBzZWxmLmJ1cy50cmlnZ2VyKFwid3NlLmFzc2V0cy5sb2FkaW5nLmluY3JlYXNlXCIsIG51bGwsIGZhbHNlKTtcbiAgICAgICAgaW1hZ2UuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIHRyaWdnZXJEZWNyZWFzZUZuKTtcbiAgICAgICAgXG4gICAgICAgIGltYWdlLnNyYyA9IHNyYztcbiAgICAgICAgaW1hZ2Uuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICAgIGltYWdlLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICBpbWFnZS5kcmFnZ2FibGUgPSBmYWxzZTtcbiAgICAgICAgXG4gICAgICAgIGltYWdlLnNldEF0dHJpYnV0ZShcImRhdGEtd3NlLXRhZ3NcIiwgdGFncyk7XG4gICAgICAgIFxuICAgICAgICBpZiAod2lkdGggIT09IG51bGwpIHtcbiAgICAgICAgICAgIGltYWdlLnNldEF0dHJpYnV0ZSgnd2lkdGgnLCB3aWR0aCk7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChoZWlnaHQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGltYWdlLnNldEF0dHJpYnV0ZSgnaGVpZ2h0JywgaGVpZ2h0KTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZWxlbWVudC5hcHBlbmRDaGlsZChpbWFnZSk7XG4gICAgICAgIFxuICAgIH0pO1xuICAgIFxuICAgIHRoaXMuY3VycmVudCA9IFtdO1xufVxuXG5Db21wb3NpdGUucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShEaXNwbGF5T2JqZWN0LnByb3RvdHlwZSk7XG5cbkNvbXBvc2l0ZS5wcm90b3R5cGUudGFnID0gZnVuY3Rpb24gKGNvbW1hbmQsIGFyZ3MpIHtcbiAgICBcbiAgICB2YXIgc2VsZiwgb2xkLCBkdXJhdGlvbiwgaXNBbmltYXRpb24sIGJ1cyA9IHRoaXMuYnVzLCBlbGVtZW50O1xuICAgIHZhciB0b0FkZCwgdG9SZW1vdmUsIGltYWdlc0J5VGFncywgb2xkSW1hZ2VzLCBuZXdJbWFnZXM7XG4gICAgXG4gICAgYXJncyA9IGFyZ3MgfHwge307XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgdG9BZGQgPSBleHRyYWN0VGFncyhjb21tYW5kLmdldEF0dHJpYnV0ZShcImFkZFwiKSB8fCBcIlwiKTtcbiAgICB0b1JlbW92ZSA9IGV4dHJhY3RUYWdzKGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwicmVtb3ZlXCIpIHx8IFwiXCIpO1xuICAgIGR1cmF0aW9uID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJkdXJhdGlvblwiKSB8fCA0MDA7XG4gICAgaXNBbmltYXRpb24gPSBhcmdzLmFuaW1hdGlvbiA9PT0gdHJ1ZSA/IHRydWUgOiBmYWxzZTtcbiAgICBcbiAgICBpZiAoIXRvQWRkLmxlbmd0aCAmJiAhdG9SZW1vdmUubGVuZ3RoKSB7XG4gICAgICAgIFxuICAgICAgICB3YXJuKGJ1cywgXCJObyBhdHRyaWJ1dGUgJ2FkZCcgb3IgJ3JlbW92ZScgb24gZWxlbWVudCBcIiArXG4gICAgICAgICAgICBcInJlZmVyZW5jaW5nIGNvbXBvc2l0ZSAnXCIgKyB0aGlzLm5hbWUgKyBcIicuIEV4cGVjdGVkIGF0IGxlYXN0IG9uZS5cIiwgY29tbWFuZCk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZG9OZXh0OiB0cnVlXG4gICAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIG9sZCA9IHRoaXMuY3VycmVudDtcbiAgICBcbiAgICBpZiAodG9SZW1vdmUubGVuZ3RoICYmIHRvUmVtb3ZlWzBdID09PSBcIipcIikge1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSB0b0FkZC5zbGljZSgpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuY3VycmVudCA9IG9sZC5maWx0ZXIoZnVuY3Rpb24gKHRhZykge1xuICAgICAgICAgICAgcmV0dXJuIHRvUmVtb3ZlLmluZGV4T2YodGFnKSA8IDA7XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgdG9BZGQuZm9yRWFjaChmdW5jdGlvbiAodGFnKSB7XG4gICAgICAgICAgICBpZiAoc2VsZi5jdXJyZW50LmluZGV4T2YodGFnKSA8IDApIHtcbiAgICAgICAgICAgICAgICBzZWxmLmN1cnJlbnQucHVzaCh0YWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgXG4gICAgaW1hZ2VzQnlUYWdzID0gZ2V0SW1hZ2VzQnlUYWdzKHRoaXMpO1xuICAgIG9sZEltYWdlcyA9IFtdO1xuICAgIG5ld0ltYWdlcyA9IFtdO1xuICAgIFxuICAgIG9sZC5mb3JFYWNoKGZ1bmN0aW9uICh0YWcpIHtcbiAgICAgICAgaWYgKGltYWdlc0J5VGFnc1t0YWddKSB7XG4gICAgICAgICAgICBpbWFnZXNCeVRhZ3NbdGFnXS5mb3JFYWNoKGZ1bmN0aW9uIChpbWFnZSkge1xuICAgICAgICAgICAgICAgIGlmIChvbGRJbWFnZXMuaW5kZXhPZihpbWFnZSkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG9sZEltYWdlcy5wdXNoKGltYWdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIHRoaXMuY3VycmVudC5mb3JFYWNoKGZ1bmN0aW9uICh0YWcpIHtcbiAgICAgICAgaWYgKGltYWdlc0J5VGFnc1t0YWddKSB7XG4gICAgICAgICAgICBpbWFnZXNCeVRhZ3NbdGFnXS5mb3JFYWNoKGZ1bmN0aW9uIChpbWFnZSkge1xuICAgICAgICAgICAgICAgIGlmIChuZXdJbWFnZXMuaW5kZXhPZihpbWFnZSkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld0ltYWdlcy5wdXNoKGltYWdlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIG5ld0ltYWdlcyA9IG5ld0ltYWdlcy5maWx0ZXIoZnVuY3Rpb24gKGltYWdlKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAob2xkSW1hZ2VzLmluZGV4T2YoaW1hZ2UpID49IDApIHtcbiAgICAgICAgICAgIG9sZEltYWdlcy5zcGxpY2Uob2xkSW1hZ2VzLmluZGV4T2YoaW1hZ2UpLCAxKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSk7XG4gICAgXG4gICAgaWYgKCFpc0FuaW1hdGlvbikge1xuICAgICAgICBzZWxmLmludGVycHJldGVyLndhaXRDb3VudGVyICs9IDE7XG4gICAgfVxuICAgIFxuICAgIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNzc2lkKTtcbiAgICBlbGVtZW50LnN0eWxlLndpZHRoID0gaGlnaGVzdChuZXdJbWFnZXMsIFwib2Zmc2V0V2lkdGhcIikgKyBcInB4XCI7XG4gICAgZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBoaWdoZXN0KG5ld0ltYWdlcywgXCJvZmZzZXRIZWlnaHRcIikgKyBcInB4XCI7XG4gICAgXG4gICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciB2YWxGbiwgZmluaXNoRm4sIG9wdGlvbnM7XG4gICAgICAgIFxuICAgICAgICB2YWxGbiA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICBuZXdJbWFnZXMuZm9yRWFjaChmdW5jdGlvbiAoaW1hZ2UpIHtcbiAgICAgICAgICAgICAgICBpbWFnZS5zdHlsZS5vcGFjaXR5ID0gdjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgZmluaXNoRm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghaXNBbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICBzZWxmLmludGVycHJldGVyLndhaXRDb3VudGVyIC09IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICAgICAgZWFzaW5nOiBlYXNpbmcuY3ViaWNPdXRcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIHRyYW5zZm9ybSgwLCAxLCB2YWxGbiwgb3B0aW9ucywgZmluaXNoRm4pO1xuICAgIH0oKSk7XG4gICAgXG4gICAgaWYgKHRoaXMuY3VycmVudCAhPT0gbnVsbCkge1xuICAgICAgICBcbiAgICAgICAgaWYgKCFpc0FuaW1hdGlvbikge1xuICAgICAgICAgICAgc2VsZi5pbnRlcnByZXRlci53YWl0Q291bnRlciArPSAxO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBmdW5jdGlvbiB0aW1lb3V0Rm4gKCkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciBvcHRpb25zOyBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiB2YWxGbiAodikge1xuICAgICAgICAgICAgICAgICAgICBvbGRJbWFnZXMuZm9yRWFjaChmdW5jdGlvbiAoaW1hZ2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlLnN0eWxlLm9wYWNpdHkgPSB2O1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gZmluaXNoRm4gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzQW5pbWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmludGVycHJldGVyLndhaXRDb3VudGVyIC09IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICAgICAgICAgICAgICBlYXNpbmc6IGVhc2luZy5jdWJpY0luXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0cmFuc2Zvcm0oMSwgMCwgdmFsRm4sIG9wdGlvbnMsIGZpbmlzaEZuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGltZW91dEZuKCk7XG4gICAgICAgIH0oKSk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIGRvTmV4dDogdHJ1ZVxuICAgIH07XG59O1xuXG5Db21wb3NpdGUucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIGN1ciwgb2JqO1xuICAgIFxuICAgIGN1ciA9IHRoaXMuY3VycmVudCB8fCBbXTtcbiAgICBcbiAgICBvYmogPSB7XG4gICAgICAgIGFzc2V0VHlwZTogXCJDb21wb3NpdGVcIixcbiAgICAgICAgY3VycmVudDogY3VyLFxuICAgICAgICBjc3NpZDogdGhpcy5jc3NpZCxcbiAgICAgICAgeEFuY2hvcjogdGhpcy54QW5jaG9yLFxuICAgICAgICB5QW5jaG9yOiB0aGlzLnlBbmNob3IsXG4gICAgICAgIHo6IHRoaXMuelxuICAgIH07XG4gICAgXG4gICAgdGhpcy5idXMudHJpZ2dlcihcbiAgICAgICAgXCJ3c2UuYXNzZXRzLmNvbXBvc2l0ZS5zYXZlXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIHN1YmplY3Q6IHRoaXMsXG4gICAgICAgICAgICBzYXZlczogb2JqXG4gICAgICAgIH1cbiAgICApO1xuICAgIFxuICAgIHJldHVybiBvYmo7XG59O1xuXG5Db21wb3NpdGUucHJvdG90eXBlLnJlc3RvcmUgPSBmdW5jdGlvbiAoc2F2ZSkge1xuICAgIFxuICAgIHRoaXMuY3NzaWQgPSBzYXZlLmNzc2lkO1xuICAgIHRoaXMueiA9IHNhdmUuejtcbiAgICB0aGlzLmN1cnJlbnQgPSBzYXZlLmN1cnJlbnQuc2xpY2UoKTtcbiAgICB0aGlzLnhBbmNob3IgPSBzYXZlLnhBbmNob3I7XG4gICAgdGhpcy55QW5jaG9yID0gc2F2ZS55QW5jaG9yO1xuICAgIFxuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY3NzaWQpO1xuICAgIHRoaXMuZWxlbWVudC5zdHlsZS56SW5kZXggPSB0aGlzLno7XG4gICAgXG4gICAgdGhpcy5idXMudHJpZ2dlcihcbiAgICAgICAgXCJ3c2UuYXNzZXRzLmNvbXBvc2l0ZS5yZXN0b3JlXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIHN1YmplY3Q6IHRoaXMsXG4gICAgICAgICAgICBzYXZlczogc2F2ZVxuICAgICAgICB9XG4gICAgKTtcbn07XG5cbmZ1bmN0aW9uIGdldEltYWdlc0J5VGFncyAoc2VsZikge1xuICAgIFxuICAgIHZhciBpbWFnZXMsIGltYWdlc0J5VGFnO1xuICAgIFxuICAgIGltYWdlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNlbGYuY3NzaWQpLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW1nXCIpO1xuICAgIGltYWdlc0J5VGFnID0ge307XG4gICAgXG4gICAgW10uZm9yRWFjaC5jYWxsKGltYWdlcywgZnVuY3Rpb24gKGltYWdlKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgdGFncyA9IGV4dHJhY3RUYWdzKGltYWdlLmdldEF0dHJpYnV0ZShcImRhdGEtd3NlLXRhZ3NcIikgfHwgXCJcIik7XG4gICAgICAgIFxuICAgICAgICB0YWdzLmZvckVhY2goZnVuY3Rpb24gKHRhZykge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoaW1hZ2VzQnlUYWdbdGFnXSkpIHtcbiAgICAgICAgICAgICAgICBpbWFnZXNCeVRhZ1t0YWddID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGltYWdlc0J5VGFnW3RhZ10ucHVzaChpbWFnZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiBpbWFnZXNCeVRhZztcbn1cblxuZnVuY3Rpb24gZXh0cmFjdFRhZ3MgKHJhdykge1xuICAgIHJldHVybiByYXcuc3BsaXQoXCIsXCIpLm1hcChmdW5jdGlvbiAocmF3VGFnKSB7XG4gICAgICAgIHJldHVybiByYXdUYWcudHJpbSgpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBoaWdoZXN0IChhbGwsIGtleSkge1xuICAgIFxuICAgIHZhciBiaWdnZXN0ID0gMDtcbiAgICBcbiAgICBhbGwuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICBpZiAoaXRlbVtrZXldID4gYmlnZ2VzdCkge1xuICAgICAgICAgICAgYmlnZ2VzdCA9IGl0ZW1ba2V5XTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiBiaWdnZXN0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvc2l0ZTtcbiIsIi8qIGdsb2JhbCB1c2luZyAqL1xuXG52YXIgd2FybiA9IHJlcXVpcmUoXCIuLi90b29scy90b29sc1wiKS53YXJuO1xudmFyIERpc3BsYXlPYmplY3QgPSByZXF1aXJlKFwiLi4vRGlzcGxheU9iamVjdFwiKTtcblxuZnVuY3Rpb24gQ3VydGFpbiAoYXNzZXQpIHtcbiAgICBcbiAgICBEaXNwbGF5T2JqZWN0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgXG4gICAgdGhpcy5hc3NldCA9IGFzc2V0O1xuICAgIHRoaXMuY29sb3IgPSBhc3NldC5nZXRBdHRyaWJ1dGUoXCJjb2xvclwiKSB8fCBcImJsYWNrXCI7XG4gICAgdGhpcy56ID0gYXNzZXQuZ2V0QXR0cmlidXRlKFwielwiKSB8fCAyMDAwMDtcbiAgICB0aGlzLmNzc2lkID0gdGhpcy5jc3NpZCB8fCBcIldTRUN1cnRhaW5fXCIgKyB0aGlzLmlkO1xuICAgIFxuICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImFzc2V0IFdTRUN1cnRhaW5cIik7XG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSAwO1xuICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSAwO1xuICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IHRoaXMuc3RhZ2Uub2Zmc2V0V2lkdGggKyBcInB4XCI7XG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IHRoaXMuc3RhZ2Uub2Zmc2V0SGVpZ2h0ICsgXCJweFwiO1xuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5jb2xvcjtcbn1cblxuQ3VydGFpbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKERpc3BsYXlPYmplY3QucHJvdG90eXBlKTtcblxuQ3VydGFpbi5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGFzc2V0KSB7XG4gICAgdGhpcy5jb2xvciA9IGFzc2V0LmdldEF0dHJpYnV0ZShcImNvbG9yXCIpIHx8IFwiYmxhY2tcIjtcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gdGhpcy5jb2xvcjtcbn07XG5cbkN1cnRhaW4ucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgY29sb3I6IHRoaXMuY29sb3IsXG4gICAgICAgIGNzc2lkOiB0aGlzLmNzc2lkLFxuICAgICAgICB6OiB0aGlzLnpcbiAgICB9O1xufTtcblxuQ3VydGFpbi5wcm90b3R5cGUucmVzdG9yZSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICBcbiAgICB0aGlzLmNvbG9yID0gb2JqLmNvbG9yO1xuICAgIHRoaXMuY3NzaWQgPSBvYmouY3NzaWQ7XG4gICAgdGhpcy56ID0gb2JqLno7XG4gICAgXG4gICAgdHJ5IHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jc3NpZCk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIHdhcm4odGhpcy5idXMsIFwiRWxlbWVudCB3aXRoIENTUyBJRCAnXCIgKyB0aGlzLmNzc2lkICsgXCInIGNvdWxkIG5vdCBiZSBmb3VuZC5cIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IHRoaXMuY29sb3I7XG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLnpJbmRleCA9IHRoaXMuejtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQ3VydGFpbjtcbiIsIi8qIGdsb2JhbCB1c2luZywgY29uc29sZSAqL1xuXG52YXIgZWFzaW5nID0gcmVxdWlyZShcImVhc2VzXCIpO1xudmFyIHRyYW5zZm9ybSA9IHJlcXVpcmUoXCJ0cmFuc2Zvcm0tanNcIikudHJhbnNmb3JtO1xuXG52YXIgd2FybiA9IHJlcXVpcmUoXCIuLi90b29scy90b29sc1wiKS53YXJuO1xudmFyIERpc3BsYXlPYmplY3QgPSByZXF1aXJlKFwiLi4vRGlzcGxheU9iamVjdFwiKTtcblxuLyoqXG4gKiBDb25zdHJ1Y3RvciBmdW5jdGlvbiBmb3IgSW1hZ2VQYWNrcy5cbiAqIFxuICogQHBhcmFtIGFzc2V0IFtET00gRWxlbWVudF0gVGhlIGFzc2V0IGRlZmluaXRpb24uXG4gKiBAcGFyYW0gaW50ZXJwcmV0ZXIgW1dTRS5JbnRlcnByZXRlcl0gVGhlIGludGVycHJldGVyIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gSW1hZ2VwYWNrIChhc3NldCkge1xuICAgIFxuICAgIHZhciBpbWFnZXMsIGNoaWxkcmVuLCBpLCBsZW4sIGN1cnJlbnQsIG5hbWU7XG4gICAgdmFyIHNyYywgaW1hZ2UsIHNlbGYsIHRyaWdnZXJEZWNyZWFzZUZuLCB3aWR0aCwgaGVpZ2h0O1xuICAgIFxuICAgIHRoaXMuX2JveFNpemVTZWxlY3RvcnMgPSBbXCJpbWdcIl07XG4gICAgXG4gICAgRGlzcGxheU9iamVjdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIFxuICAgIHRoaXMuY3NzaWQgPSB0aGlzLmNzc2lkIHx8IFwid3NlX2ltYWdlcGFja19cIiArIHRoaXMubmFtZTtcbiAgICBcbiAgICBzZWxmID0gdGhpcztcbiAgICBpbWFnZXMgPSB7fTtcbiAgICB3aWR0aCA9IGFzc2V0LmdldEF0dHJpYnV0ZSgnd2lkdGgnKTtcbiAgICBoZWlnaHQgPSBhc3NldC5nZXRBdHRyaWJ1dGUoJ2hlaWdodCcpO1xuICAgIFxuICAgIHRoaXMuZWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcImFzc2V0IGltYWdlcGFja1wiKTtcbiAgICBcbiAgICBjaGlsZHJlbiA9IGFzc2V0LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaW1hZ2VcIik7XG4gICAgdHJpZ2dlckRlY3JlYXNlRm4gPVxuICAgICAgICBzZWxmLmJ1cy50cmlnZ2VyLmJpbmQoc2VsZi5idXMsIFwid3NlLmFzc2V0cy5sb2FkaW5nLmRlY3JlYXNlXCIsIG51bGwsIGZhbHNlKTtcbiAgICBcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBjaGlsZHJlbi5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICBcbiAgICAgICAgY3VycmVudCA9IGNoaWxkcmVuW2ldO1xuICAgICAgICBuYW1lID0gY3VycmVudC5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpO1xuICAgICAgICBzcmMgPSBjdXJyZW50LmdldEF0dHJpYnV0ZShcInNyY1wiKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChuYW1lID09PSBudWxsKSB7XG4gICAgICAgICAgICB3YXJuKHRoaXMuYnVzLCBcIkltYWdlIHdpdGhvdXQgbmFtZSBpbiBpbWFnZXBhY2sgJ1wiICsgdGhpcy5uYW1lICsgXCInLlwiLCBhc3NldCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKHNyYyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgd2Fybih0aGlzLmJ1cywgXCJJbWFnZSB3aXRob3V0IHNyYyBpbiBpbWFnZXBhY2sgJ1wiICsgdGhpcy5uYW1lICsgXCInLlwiLCBhc3NldCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuYnVzLnRyaWdnZXIoXCJ3c2UuYXNzZXRzLmxvYWRpbmcuaW5jcmVhc2VcIiwgbnVsbCwgZmFsc2UpO1xuICAgICAgICBpbWFnZS5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgdHJpZ2dlckRlY3JlYXNlRm4pO1xuICAgICAgICBcbiAgICAgICAgaW1hZ2Uuc3JjID0gc3JjO1xuICAgICAgICBpbWFnZS5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgaW1hZ2Uuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICAgIGltYWdlLmRyYWdnYWJsZSA9IGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKFwiZGF0YS13c2UtYXNzZXQtaW1hZ2UtbmFtZVwiLCBuYW1lKTtcbiAgICAgICAgXG4gICAgICAgIGlmICh3aWR0aCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCd3aWR0aCcsIHdpZHRoKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKGhlaWdodCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdoZWlnaHQnLCBoZWlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpbWFnZXNbbmFtZV0gPSB0aGlzLmNzc2lkICsgXCJfXCIgKyBuYW1lO1xuICAgICAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBpbWFnZXNbbmFtZV0pO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKGltYWdlKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5pbWFnZXMgPSBpbWFnZXM7XG4gICAgdGhpcy5jdXJyZW50ID0gbnVsbDtcbiAgICBcbn1cblxuSW1hZ2VwYWNrLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRGlzcGxheU9iamVjdC5wcm90b3R5cGUpO1xuXG5JbWFnZXBhY2sucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChjb21tYW5kLCBhcmdzKSB7XG4gICAgXG4gICAgdmFyIGltYWdlLCBuYW1lLCBzZWxmLCBvbGQsIGR1cmF0aW9uLCBpc0FuaW1hdGlvbiwgYnVzID0gdGhpcy5idXMsIGVsZW1lbnQ7XG4gICAgXG4gICAgYXJncyA9IGFyZ3MgfHwge307XG4gICAgc2VsZiA9IHRoaXM7XG4gICAgbmFtZSA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwiaW1hZ2VcIik7XG4gICAgZHVyYXRpb24gPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcImR1cmF0aW9uXCIpIHx8IDQwMDtcbiAgICBpc0FuaW1hdGlvbiA9IGFyZ3MuYW5pbWF0aW9uID09PSB0cnVlID8gdHJ1ZSA6IGZhbHNlO1xuICAgIFxuICAgIGlmIChuYW1lID09PSBudWxsKSB7XG4gICAgICAgIFxuICAgICAgICB3YXJuKGJ1cywgXCJNaXNzaW5nIGF0dHJpYnV0ZSAnaW1hZ2UnIG9uICdkbycgZWxlbWVudCBcIiArXG4gICAgICAgICAgICBcInJlZmVyZW5jaW5nIGltYWdlcGFjayAnXCIgKyB0aGlzLm5hbWUgKyBcIicuXCIsIGNvbW1hbmQpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRvTmV4dDogdHJ1ZVxuICAgICAgICB9O1xuICAgIH1cbiAgICBcbiAgICB0cnkge1xuICAgICAgICBpbWFnZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaW1hZ2VzW25hbWVdKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkRPTSBFbGVtZW50IGZvciBJbWFnZSBcIiArIG5hbWUgKyBcIiBvbiBJbWFnZXBhY2sgXCIgK1xuICAgICAgICAgICAgdGhpcy5uYW1lICsgXCIgbm90IGZvdW5kIVwiLCBlKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHR5cGVvZiBpbWFnZSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBpbWFnZSA9PT0gbnVsbCkge1xuICAgICAgICBcbiAgICAgICAgd2FybihidXMsIFwiVW5rbm93biBpbWFnZSBuYW1lIG9uICdkbycgZWxlbWVudCByZWZlcmVuY2luZyBcIiArXG4gICAgICAgICAgICBcImltYWdlcGFjayAnXCIgKyB0aGlzLm5hbWUgKyBcIicuXCIsIGNvbW1hbmQpO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRvTmV4dDogdHJ1ZVxuICAgICAgICB9O1xuICAgIH1cbiAgICBcbiAgICBvbGQgPSB0aGlzLmN1cnJlbnQ7XG4gICAgXG4gICAgZm9yICh2YXIga2V5IGluIHRoaXMuaW1hZ2VzKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAodGhpcy5pbWFnZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoa2V5ICE9PSBuYW1lKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChrZXkgPT09IG9sZCkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHdhcm4oYnVzLCBcIlRyeWluZyB0byBzZXQgdGhlIGltYWdlIHRoYXQgaXMgYWxyZWFkeSBzZXQgb24gaW1hZ2VwYWNrICdcIiArXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmFtZSArIFwiJy5cIiwgY29tbWFuZCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgZG9OZXh0OiB0cnVlXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBcbiAgICBpZiAoIWlzQW5pbWF0aW9uKSB7XG4gICAgICAgIHNlbGYuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgKz0gMTtcbiAgICB9XG4gICAgXG4gICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY3NzaWQpO1xuICAgIGVsZW1lbnQuc3R5bGUud2lkdGggPSBpbWFnZS5vZmZzZXRXaWR0aCArIFwicHhcIjtcbiAgICBlbGVtZW50LnN0eWxlLmhlaWdodCA9IGltYWdlLm9mZnNldEhlaWdodCArIFwicHhcIjtcbiAgICBcbiAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIHZhbEZuLCBmaW5pc2hGbiwgb3B0aW9ucztcbiAgICAgICAgXG4gICAgICAgIHZhbEZuID0gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgIGltYWdlLnN0eWxlLm9wYWNpdHkgPSB2O1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgZmluaXNoRm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghaXNBbmltYXRpb24pIHtcbiAgICAgICAgICAgICAgICBzZWxmLmludGVycHJldGVyLndhaXRDb3VudGVyIC09IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIFxuICAgICAgICBvcHRpb25zID0ge1xuICAgICAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxuICAgICAgICAgICAgZWFzaW5nOiBlYXNpbmcuY3ViaWNPdXRcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIHRyYW5zZm9ybSgwLCAxLCB2YWxGbiwgb3B0aW9ucywgZmluaXNoRm4pO1xuICAgIH0oKSk7XG4gICAgXG4gICAgaWYgKHRoaXMuY3VycmVudCAhPT0gbnVsbCkge1xuICAgICAgICBcbiAgICAgICAgaWYgKCFpc0FuaW1hdGlvbikge1xuICAgICAgICAgICAgc2VsZi5pbnRlcnByZXRlci53YWl0Q291bnRlciArPSAxO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgdGltZW91dEZuO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aW1lb3V0Rm4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgb2xkRWwsIHZhbEZuLCBmaW5pc2hGbiwgb3B0aW9uczsgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgb2xkRWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzZWxmLmltYWdlc1tvbGRdKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YWxGbiA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgICAgIG9sZEVsLnN0eWxlLm9wYWNpdHkgPSB2O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZmluaXNoRm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzQW5pbWF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmludGVycHJldGVyLndhaXRDb3VudGVyIC09IDE7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgZWFzaW5nOiBlYXNpbmcuY3ViaWNJblxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtKDEsIDAsIHZhbEZuLCBvcHRpb25zLCBmaW5pc2hGbik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aW1lb3V0Rm4oKTtcbiAgICAgICAgfSgpKTtcbiAgICB9XG4gICAgXG4gICAgdGhpcy5jdXJyZW50ID0gbmFtZTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBkb05leHQ6IHRydWVcbiAgICB9O1xufTtcblxuSW1hZ2VwYWNrLnByb3RvdHlwZS5zYXZlID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciBjdXIsIGltYWdlcywgb2JqO1xuICAgIFxuICAgIGltYWdlcyA9IHRoaXMuaW1hZ2VzO1xuICAgIGN1ciA9IHRoaXMuY3VycmVudCB8fCBudWxsO1xuICAgIFxuICAgIG9iaiA9IHtcbiAgICAgICAgYXNzZXRUeXBlOiBcIkltYWdlcGFja1wiLFxuICAgICAgICBjdXJyZW50OiBjdXIsXG4gICAgICAgIGNzc2lkOiB0aGlzLmNzc2lkLFxuICAgICAgICBpbWFnZXM6IGltYWdlcyxcbiAgICAgICAgeEFuY2hvcjogdGhpcy54QW5jaG9yLFxuICAgICAgICB5QW5jaG9yOiB0aGlzLnlBbmNob3IsXG4gICAgICAgIHo6IHRoaXMuelxuICAgIH07XG4gICAgXG4gICAgdGhpcy5idXMudHJpZ2dlcihcbiAgICAgICAgXCJ3c2UuYXNzZXRzLmltYWdlcGFjay5zYXZlXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIHN1YmplY3Q6IHRoaXMsXG4gICAgICAgICAgICBzYXZlczogb2JqXG4gICAgICAgIH1cbiAgICApO1xuICAgIFxuICAgIHJldHVybiBvYmo7XG59O1xuXG5JbWFnZXBhY2sucHJvdG90eXBlLnJlc3RvcmUgPSBmdW5jdGlvbiAoc2F2ZSkge1xuICAgIFxuICAgIHZhciBuYW1lO1xuICAgIFxuICAgIG5hbWUgPSBzYXZlLmN1cnJlbnQ7XG4gICAgdGhpcy5jc3NpZCA9IHNhdmUuY3NzaWQ7XG4gICAgdGhpcy56ID0gc2F2ZS56O1xuICAgIHRoaXMuY3VycmVudCA9IG5hbWU7XG4gICAgdGhpcy54QW5jaG9yID0gc2F2ZS54QW5jaG9yO1xuICAgIHRoaXMueUFuY2hvciA9IHNhdmUueUFuY2hvcjtcbiAgICBcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmNzc2lkKS5zdHlsZS56SW5kZXggPSB0aGlzLno7XG4gICAgXG4gICAgdGhpcy5idXMudHJpZ2dlcihcbiAgICAgICAgXCJ3c2UuYXNzZXRzLmltYWdlcGFjay5yZXN0b3JlXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIHN1YmplY3Q6IHRoaXMsXG4gICAgICAgICAgICBzYXZlczogc2F2ZVxuICAgICAgICB9XG4gICAgKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSW1hZ2VwYWNrO1xuIiwiXG52YXIgdHJhbnNmb3JtID0gcmVxdWlyZShcInRyYW5zZm9ybS1qc1wiKS50cmFuc2Zvcm07XG52YXIgY2xhc3NlcyA9IHJlcXVpcmUoXCJjbGFzcy1tYW5pcHVsYXRvclwiKS5saXN0O1xuXG52YXIgdG9vbHMgPSByZXF1aXJlKFwiLi4vdG9vbHMvdG9vbHNcIik7XG52YXIgcmV2ZWFsID0gcmVxdWlyZShcIi4uL3Rvb2xzL3JldmVhbFwiKTtcbnZhciBEaXNwbGF5T2JqZWN0ID0gcmVxdWlyZShcIi4uL0Rpc3BsYXlPYmplY3RcIik7XG5cbnZhciB0cnV0aHkgPSB0b29scy50cnV0aHk7XG52YXIgcmVwbGFjZVZhcnMgPSB0b29scy5yZXBsYWNlVmFyaWFibGVzO1xuXG5mdW5jdGlvbiBUZXh0Ym94IChhc3NldCkge1xuICAgIFxuICAgIHRoaXMueiA9IDEwMDA7XG4gICAgXG4gICAgRGlzcGxheU9iamVjdC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIFxuICAgIHZhciBlbGVtZW50LCBuYW1lRWxlbWVudCwgdGV4dEVsZW1lbnQ7XG4gICAgXG4gICAgdGhpcy50eXBlID0gYXNzZXQuZ2V0QXR0cmlidXRlKFwiYmVoYXZpb3VyXCIpIHx8IFwiYWR2XCI7XG4gICAgdGhpcy5zaG93TmFtZXMgPSB0cnV0aHkoYXNzZXQuZ2V0QXR0cmlidXRlKFwibmFtZWJveFwiKSk7XG4gICAgdGhpcy5ubHRvYnIgPSB0cnV0aHkoYXNzZXQuZ2V0QXR0cmlidXRlKFwibmx0b2JyXCIpKTtcbiAgICB0aGlzLmNzc2lkID0gdGhpcy5jc3NpZCB8fCBcIndzZV90ZXh0Ym94X1wiICsgdGhpcy5uYW1lO1xuICAgIHRoaXMuZWZmZWN0VHlwZSA9IGFzc2V0LmdldEF0dHJpYnV0ZShcImVmZmVjdFwiKSB8fCBcInR5cGV3cml0ZXJcIjtcbiAgICB0aGlzLnNwZWVkID0gYXNzZXQuZ2V0QXR0cmlidXRlKFwic3BlZWRcIikgfHwgMDtcbiAgICB0aGlzLnNwZWVkID0gcGFyc2VJbnQodGhpcy5zcGVlZCwgMTApO1xuICAgIHRoaXMuZmFkZUR1cmF0aW9uID0gYXNzZXQuZ2V0QXR0cmlidXRlKFwiZmFkZUR1cmF0aW9uXCIpIHx8IDA7XG4gICAgXG4gICAgKGZ1bmN0aW9uIChjdHgpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBlbCwgaSwgbGVuLCBlbG1zO1xuICAgICAgICBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZWxtcyA9IGFzc2V0LmNoaWxkTm9kZXM7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGVsbXMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoZWxtc1tpXS5ub2RlVHlwZSA9PT0gMSAmJiBlbG1zW2ldLnRhZ05hbWUgPT09ICduYW1lVGVtcGxhdGUnKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsID0gZWxtc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoIWVsKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBuYW1lVGVtcGxhdGUgZm91bmQuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGN0eC5uYW1lVGVtcGxhdGUgPSBuZXcgWE1MU2VyaWFsaXplcigpLnNlcmlhbGl6ZVRvU3RyaW5nKGVsKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgY3R4Lm5hbWVUZW1wbGF0ZSA9ICd7bmFtZX06ICc7XG4gICAgICAgIH1cbiAgICB9KHRoaXMpKTtcbiAgICBcbiAgICBpZiAodGhpcy50eXBlID09PSBcIm52bFwiKSB7XG4gICAgICAgIHRoaXMuc2hvd05hbWVzID0gZmFsc2U7XG4gICAgfVxuICAgIFxuICAgIGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQ7XG4gICAgbmFtZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHRleHRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBcbiAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYXNzZXQgdGV4dGJveFwiKTtcbiAgICB0ZXh0RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInRleHRcIik7XG4gICAgbmFtZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJuYW1lXCIpO1xuICAgIFxuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQobmFtZUVsZW1lbnQpO1xuICAgIGVsZW1lbnQuYXBwZW5kQ2hpbGQodGV4dEVsZW1lbnQpO1xuICAgIFxuICAgIGlmICh0aGlzLnNob3dOYW1lcyA9PT0gZmFsc2UpIHtcbiAgICAgICAgbmFtZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgIH1cbiAgICBcbiAgICBuYW1lRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0aGlzLmNzc2lkICsgXCJfbmFtZVwiKTtcbiAgICB0ZXh0RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0aGlzLmNzc2lkICsgXCJfdGV4dFwiKTtcbiAgICBcbiAgICB0aGlzLm5hbWVFbGVtZW50ID0gdGhpcy5jc3NpZCArIFwiX25hbWVcIjtcbiAgICB0aGlzLnRleHRFbGVtZW50ID0gdGhpcy5jc3NpZCArIFwiX3RleHRcIjtcbiAgICBcbiAgICBlbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgIFxuICAgIHRoaXMuYnVzLnRyaWdnZXIoXCJ3c2UuYXNzZXRzLnRleHRib3guY29uc3RydWN0b3JcIiwgdGhpcyk7XG59XG5cblRleHRib3gucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShEaXNwbGF5T2JqZWN0LnByb3RvdHlwZSk7XG5cblRleHRib3gucHJvdG90eXBlLnB1dCA9IGZ1bmN0aW9uICh0ZXh0LCBuYW1lLCBzcGVha2VySWQpIHtcbiAgICBcbiAgICB2YXIgdGV4dEVsZW1lbnQsIG5hbWVFbGVtZW50LCBuYW1lUGFydCwgc2VsZiwgY3NzQ2xhc3MgPSBcIndzZV9ub19jaGFyYWN0ZXJcIiwgZWxlbWVudDtcbiAgICBcbiAgICBuYW1lID0gbmFtZSB8fCBudWxsO1xuICAgIHNwZWFrZXJJZCA9IHNwZWFrZXJJZCB8fCBcIl9ub19vbmVcIjtcbiAgICBcbiAgICBzZWxmID0gdGhpcztcbiAgICB0ZXh0RWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMudGV4dEVsZW1lbnQpO1xuICAgIG5hbWVFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5uYW1lRWxlbWVudCk7XG4gICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY3NzaWQpO1xuICAgIFxuICAgIHRleHQgPSByZXBsYWNlVmFycyh0ZXh0LCB0aGlzLmludGVycHJldGVyKTtcbiAgICBcbiAgICBzZWxmLmludGVycHJldGVyLndhaXRDb3VudGVyICs9IDE7XG4gICAgXG4gICAgbmFtZVBhcnQgPSBcIlwiO1xuICAgIFxuICAgIGlmICh0aGlzLnNob3dOYW1lcyA9PT0gZmFsc2UgJiYgISghbmFtZSkpIHtcbiAgICAgICAgbmFtZVBhcnQgPSB0aGlzLm5hbWVUZW1wbGF0ZS5yZXBsYWNlKC9cXHtuYW1lXFx9L2csIG5hbWUpO1xuICAgIH1cbiAgICBcbiAgICBpZiAobmFtZSA9PT0gbnVsbCkge1xuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuc2hvd05hbWVzKSB7XG4gICAgICAgICAgICBuYW1lRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIG5hbWUgPSBcIlwiO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgXG4gICAgICAgIGlmICh0aGlzLnNob3dOYW1lcykge1xuICAgICAgICAgICAgbmFtZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNzc0NsYXNzID0gXCJ3c2VfY2hhcmFjdGVyX1wiICsgc3BlYWtlcklkLnNwbGl0KFwiIFwiKS5qb2luKFwiX1wiKTtcbiAgICB9XG4gICAgXG4gICAgaWYgKHRoaXMuX2xhc3RDc3NDbGFzcykge1xuICAgICAgICBjbGFzc2VzKGVsZW1lbnQpLnJlbW92ZSh0aGlzLl9sYXN0Q3NzQ2xhc3MpLmFwcGx5KCk7XG4gICAgfVxuICAgIFxuICAgIHRoaXMuX2xhc3RDc3NDbGFzcyA9IGNzc0NsYXNzO1xuICAgIFxuICAgIGNsYXNzZXMoZWxlbWVudCkuYWRkKGNzc0NsYXNzKS5hcHBseSgpO1xuICAgIFxuICAgIGlmICh0aGlzLnNwZWVkIDwgMSkge1xuICAgICAgICBcbiAgICAgICAgaWYgKHRoaXMuZmFkZUR1cmF0aW9uID4gMCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZWxmLmludGVycHJldGVyLndhaXRDb3VudGVyICs9IDE7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIHZhbEZuLCBmaW5pc2hGbiwgb3B0aW9ucztcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YWxGbiA9IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICAgICAgICAgIHRleHRFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSB2O1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgZmluaXNoRm4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgLT0gMTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBzZWxmLmZhZGVEdXJhdGlvblxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtKDEsIDAsIHZhbEZuLCBvcHRpb25zLCBmaW5pc2hGbik7XG4gICAgICAgICAgICB9KCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcHV0VGV4dCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGlmICh0aGlzLnNwZWVkID4gMCkge1xuICAgICAgICBcbiAgICAgICAgaWYgKHNlbGYudHlwZSA9PT0gJ2FkdicpIHtcbiAgICAgICAgICAgIHRleHRFbGVtZW50LmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBjb250YWluZXI7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnbGluZScpO1xuICAgICAgICAgICAgdGV4dEVsZW1lbnQuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcbiAgICAgICAgICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBuYW1lUGFydCArIHRleHQ7XG4gICAgICAgICAgICBuYW1lRWxlbWVudC5pbm5lckhUTUwgPSBzZWxmLm5hbWVUZW1wbGF0ZS5yZXBsYWNlKC9cXHtuYW1lXFx9L2csIG5hbWUpO1xuICAgICAgICAgICAgLy9zZWxmLmludGVycHJldGVyLndhaXRDb3VudGVyICs9IDE7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNlbGYuaW50ZXJwcmV0ZXIuY2FuY2VsQ2hhckFuaW1hdGlvbiA9IHJldmVhbChcbiAgICAgICAgICAgICAgICBjb250YWluZXIsIFxuICAgICAgICAgICAgICAgIHsgXG4gICAgICAgICAgICAgICAgICAgIHNwZWVkOiBzZWxmLnNwZWVkLFxuICAgICAgICAgICAgICAgICAgICBvbkZpbmlzaDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9zZWxmLmludGVycHJldGVyLndhaXRDb3VudGVyIC09IDE7IFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnRlcnByZXRlci5jYW5jZWxDaGFyQW5pbWF0aW9uID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICkuY2FuY2VsO1xuICAgICAgICB9KCkpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0aGlzLmZhZGVEdXJhdGlvbiA+IDApIHtcbiAgICAgICAgXG4gICAgICAgIHNlbGYuaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgKz0gMTtcbiAgICAgICAgXG4gICAgICAgIHNldFRpbWVvdXQoXG4gICAgICAgICAgICBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcHV0VGV4dCgpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChzZWxmLnR5cGUgPT09ICdudmwnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRleHRFbGVtZW50LmlubmVySFRNTCA9ICc8ZGl2PicgKyB0ZXh0RWxlbWVudC5pbm5lckhUTUwgKyAnPC9kaXY+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdHJhbnNmb3JtKFxuICAgICAgICAgICAgICAgICAgICAwLFxuICAgICAgICAgICAgICAgICAgICAxLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodikge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dEVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IHY7XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uOiBzZWxmLmZhZGVEdXJhdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uRmluaXNoOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pbnRlcnByZXRlci53YWl0Q291bnRlciAtPSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZWxmLmZhZGVEdXJhdGlvblxuICAgICAgICApO1xuICAgIH1cbiAgICBcbiAgICB0aGlzLmJ1cy50cmlnZ2VyKFwid3NlLmFzc2V0cy50ZXh0Ym94LnB1dFwiLCB0aGlzLCBmYWxzZSk7XG4gICAgc2VsZi5pbnRlcnByZXRlci53YWl0Q291bnRlciAtPSAxO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIGRvTmV4dDogZmFsc2VcbiAgICB9O1xuICAgIFxuICAgIGZ1bmN0aW9uIHB1dFRleHQgKCkge1xuICAgICAgICBcbiAgICAgICAgaWYgKHNlbGYudHlwZSA9PT0gJ2FkdicpIHtcbiAgICAgICAgICAgIHRleHRFbGVtZW50LmlubmVySFRNTCA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHRleHRFbGVtZW50LmlubmVySFRNTCArPSBuYW1lUGFydCArIHRleHQ7XG4gICAgICAgIG5hbWVFbGVtZW50LmlubmVySFRNTCA9IHNlbGYubmFtZVRlbXBsYXRlLnJlcGxhY2UoL1xce25hbWVcXH0vZywgbmFtZSk7XG4gICAgfVxufTtcblxuVGV4dGJveC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy50ZXh0RWxlbWVudCkuaW5uZXJIVE1MID0gXCJcIjtcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLm5hbWVFbGVtZW50KS5pbm5lckhUTUwgPSBcIlwiO1xuICAgIHRoaXMuYnVzLnRyaWdnZXIoXCJ3c2UuYXNzZXRzLnRleHRib3guY2xlYXJcIiwgdGhpcyk7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZG9OZXh0OiB0cnVlXG4gICAgfTtcbn07XG5cblRleHRib3gucHJvdG90eXBlLnNhdmUgPSBmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgYXNzZXRUeXBlOiBcIlRleHRib3hcIixcbiAgICAgICAgdHlwZTogdGhpcy50eXBlLFxuICAgICAgICBzaG93TmFtZXM6IHRoaXMuc2hvd05hbWVzLFxuICAgICAgICBubHRvYnI6IHRoaXMubmx0b2JyLFxuICAgICAgICBjc3NpZDogdGhpcy5jc3NpZCxcbiAgICAgICAgbmFtZUVsZW1lbnQ6IHRoaXMubmFtZUVsZW1lbnQsXG4gICAgICAgIHRleHRFbGVtZW50OiB0aGlzLnRleHRFbGVtZW50LFxuICAgICAgICB6OiB0aGlzLnpcbiAgICB9O1xufTtcblxuVGV4dGJveC5wcm90b3R5cGUucmVzdG9yZSA9IGZ1bmN0aW9uIChzYXZlKSB7XG4gICAgXG4gICAgdGhpcy50eXBlID0gc2F2ZS50eXBlO1xuICAgIHRoaXMuc2hvd05hbWVzID0gc2F2ZS5zaG93TmFtZXM7XG4gICAgdGhpcy5ubHRvYnIgPSBzYXZlLm5sdG9icjtcbiAgICB0aGlzLmNzc2lkID0gc2F2ZS5jc3NpZDtcbiAgICB0aGlzLm5hbWVFbGVtZW50ID0gc2F2ZS5uYW1lRWxlbWVudDtcbiAgICB0aGlzLnRleHRFbGVtZW50ID0gc2F2ZS50ZXh0RWxlbWVudDtcbiAgICB0aGlzLnogPSBzYXZlLno7XG4gICAgXG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5jc3NpZCkuc3R5bGUuekluZGV4ID0gdGhpcy56O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUZXh0Ym94O1xuIiwiXG52YXIgRGF0YUJ1cyA9IHJlcXVpcmUoXCJkYXRhYnVzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBEYXRhQnVzKCk7XG4iLCJcbnZhciBhbGVydENvbW1hbmQgPSByZXF1aXJlKFwiLi9jb21tYW5kcy9hbGVydFwiKTtcbnZhciBicmVha0NvbW1hbmQgPSByZXF1aXJlKFwiLi9jb21tYW5kcy9icmVha1wiKTtcbnZhciBjaG9pY2VDb21tYW5kID0gcmVxdWlyZShcIi4vY29tbWFuZHMvY2hvaWNlXCIpO1xudmFyIGNvbmZpcm1Db21tYW5kID0gcmVxdWlyZShcIi4vY29tbWFuZHMvY29uZmlybVwiKTtcbnZhciBkb0NvbW1hbmQgPSByZXF1aXJlKFwiLi9jb21tYW5kcy9kb1wiKTtcbnZhciBmbkNvbW1hbmQgPSByZXF1aXJlKFwiLi9jb21tYW5kcy9mblwiKTtcbnZhciBnbG9iYWxDb21tYW5kID0gcmVxdWlyZShcIi4vY29tbWFuZHMvZ2xvYmFsXCIpO1xudmFyIGdsb2JhbGl6ZUNvbW1hbmQgPSByZXF1aXJlKFwiLi9jb21tYW5kcy9nbG9iYWxpemVcIik7XG52YXIgZ290b0NvbW1hbmQgPSByZXF1aXJlKFwiLi9jb21tYW5kcy9nb3RvXCIpO1xudmFyIGxpbmVDb21tYW5kID0gcmVxdWlyZShcIi4vY29tbWFuZHMvbGluZVwiKTtcbnZhciBsb2NhbGl6ZUNvbW1hbmQgPSByZXF1aXJlKFwiLi9jb21tYW5kcy9sb2NhbGl6ZVwiKTtcbnZhciBwcm9tcHRDb21tYW5kID0gcmVxdWlyZShcIi4vY29tbWFuZHMvcHJvbXB0XCIpO1xudmFyIHJlc3RhcnRDb21tYW5kID0gcmVxdWlyZShcIi4vY29tbWFuZHMvcmVzdGFydFwiKTtcbnZhciBzZXRWYXJzQ29tbWFuZCA9IHJlcXVpcmUoXCIuL2NvbW1hbmRzL3NldF92YXJzXCIpO1xudmFyIHN1YkNvbW1hbmQgPSByZXF1aXJlKFwiLi9jb21tYW5kcy9zdWJcIik7XG52YXIgdHJpZ2dlckNvbW1hbmQgPSByZXF1aXJlKFwiLi9jb21tYW5kcy90cmlnZ2VyXCIpO1xudmFyIHZhckNvbW1hbmQgPSByZXF1aXJlKFwiLi9jb21tYW5kcy92YXJcIik7XG52YXIgd2FpdENvbW1hbmQgPSByZXF1aXJlKFwiLi9jb21tYW5kcy93YWl0XCIpO1xudmFyIHdoaWxlQ29tbWFuZCA9IHJlcXVpcmUoXCIuL2NvbW1hbmRzL3doaWxlXCIpO1xudmFyIHdpdGhDb21tYW5kID0gcmVxdWlyZShcIi4vY29tbWFuZHMvd2l0aFwiKTtcblxudmFyIGNvbW1hbmRzID0ge1xuICAgIFwiYWxlcnRcIjogYWxlcnRDb21tYW5kLFxuICAgIFwiYnJlYWtcIjogYnJlYWtDb21tYW5kLFxuICAgIFwiY2hvaWNlXCI6IGNob2ljZUNvbW1hbmQsXG4gICAgXCJjb25maXJtXCI6IGNvbmZpcm1Db21tYW5kLFxuICAgIFwiZG9cIjogZG9Db21tYW5kLFxuICAgIFwiZm5cIjogZm5Db21tYW5kLFxuICAgIFwiZ2xvYmFsXCI6IGdsb2JhbENvbW1hbmQsXG4gICAgXCJnbG9iYWxpemVcIjogZ2xvYmFsaXplQ29tbWFuZCxcbiAgICBcImdvdG9cIjogZ290b0NvbW1hbmQsXG4gICAgXCJsaW5lXCI6IGxpbmVDb21tYW5kLFxuICAgIFwibG9jYWxpemVcIjogbG9jYWxpemVDb21tYW5kLFxuICAgIFwicHJvbXB0XCI6IHByb21wdENvbW1hbmQsXG4gICAgXCJyZXN0YXJ0XCI6IHJlc3RhcnRDb21tYW5kLFxuICAgIFwic2V0X3ZhcnNcIjogc2V0VmFyc0NvbW1hbmQsXG4gICAgXCJzdWJcIjogc3ViQ29tbWFuZCxcbiAgICBcInRyaWdnZXJcIjogdHJpZ2dlckNvbW1hbmQsXG4gICAgXCJ2YXJcIjogdmFyQ29tbWFuZCxcbiAgICBcIndhaXRcIjogd2FpdENvbW1hbmQsXG4gICAgXCJ3aGlsZVwiOiB3aGlsZUNvbW1hbmQsXG4gICAgXCJ3aXRoXCI6IHdpdGhDb21tYW5kXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbW1hbmRzO1xuIiwiXG52YXIgdWkgPSByZXF1aXJlKFwiLi4vdG9vbHMvdWlcIik7XG52YXIgdG9vbHMgPSByZXF1aXJlKFwiLi4vdG9vbHMvdG9vbHNcIik7XG5cbnZhciByZXBsYWNlVmFycyA9IHRvb2xzLnJlcGxhY2VWYXJpYWJsZXM7XG5cbmZ1bmN0aW9uIGFsZXJ0IChjb21tYW5kLCBpbnRlcnByZXRlcikge1xuICAgIFxuICAgIHZhciB0aXRsZSwgbWVzc2FnZSwgZG9OZXh0O1xuICAgIFxuICAgIHRpdGxlID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiKSB8fCBcIkFsZXJ0IVwiO1xuICAgIG1lc3NhZ2UgPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcIm1lc3NhZ2VcIikgfHwgXCJBbGVydCFcIjtcbiAgICBcbiAgICBkb05leHQgPSByZXBsYWNlVmFycyhjb21tYW5kLmdldEF0dHJpYnV0ZShcIm5leHRcIikgfHwgXCJcIiwgaW50ZXJwcmV0ZXIpID09PSBcImZhbHNlXCIgP1xuICAgICAgICBmYWxzZSA6XG4gICAgICAgIHRydWU7XG4gICAgXG4gICAgbWVzc2FnZSA9IHJlcGxhY2VWYXJzKG1lc3NhZ2UsIGludGVycHJldGVyKTtcbiAgICB0aXRsZSA9IHJlcGxhY2VWYXJzKHRpdGxlLCBpbnRlcnByZXRlcik7XG4gICAgXG4gICAgbWVzc2FnZSA9IHRvb2xzLnRleHRUb0h0bWwobWVzc2FnZSk7XG4gICAgXG4gICAgaW50ZXJwcmV0ZXIuYnVzLnRyaWdnZXIoXCJ3c2UuaW50ZXJwcmV0ZXIuY29tbWFuZHMuYWxlcnRcIiwgY29tbWFuZCk7XG4gICAgXG4gICAgdWkuYWxlcnQoXG4gICAgICAgIGludGVycHJldGVyLFxuICAgICAgICB7XG4gICAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgICAgICAgICAgcGF1c2U6IHRydWUsXG4gICAgICAgICAgICBkb05leHQ6IGRvTmV4dFxuICAgICAgICB9XG4gICAgKTtcbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBkb05leHQ6IHRydWVcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFsZXJ0O1xuIiwiXG5mdW5jdGlvbiBicmVha0ZuIChjb21tYW5kLCBpbnRlcnByZXRlcikge1xuICAgIFxuICAgIGludGVycHJldGVyLmJ1cy50cmlnZ2VyKFxuICAgICAgICBcIndzZS5pbnRlcnByZXRlci5jb21tYW5kcy5icmVha1wiLFxuICAgICAgICB7XG4gICAgICAgICAgICBpbnRlcnByZXRlcjogaW50ZXJwcmV0ZXIsXG4gICAgICAgICAgICBjb21tYW5kOiBjb21tYW5kXG4gICAgICAgIH0sIFxuICAgICAgICBmYWxzZVxuICAgICk7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZG9OZXh0OiBmYWxzZSxcbiAgICAgICAgd2FpdDogdHJ1ZVxuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYnJlYWtGbjtcbiIsIlxudmFyIHRvb2xzID0gcmVxdWlyZShcIi4uL3Rvb2xzL3Rvb2xzXCIpO1xudmFyIERpc3BsYXlPYmplY3QgPSByZXF1aXJlKFwiLi4vRGlzcGxheU9iamVjdFwiKTtcblxuZnVuY3Rpb24gY2hvaWNlIChjb21tYW5kLCBpbnRlcnByZXRlcikge1xuICAgIFxuICAgIHZhciBtZW51RWxlbWVudCwgYnV0dG9ucywgY2hpbGRyZW4sIGxlbiwgaSwgY3VycmVudDtcbiAgICB2YXIgY3VycmVudEJ1dHRvbiwgc2NlbmVzLCBzZWxmLCBzY2VuZU5hbWU7XG4gICAgdmFyIG1ha2VCdXR0b25DbGlja0ZuLCBvbGRTdGF0ZSwgY3NzaWQ7XG4gICAgXG4gICAgaW50ZXJwcmV0ZXIuYnVzLnRyaWdnZXIoXG4gICAgICAgIFwid3NlLmludGVycHJldGVyLmNvbW1hbmRzLmNob2ljZVwiLFxuICAgICAgICB7XG4gICAgICAgICAgICBpbnRlcnByZXRlcjogaW50ZXJwcmV0ZXIsXG4gICAgICAgICAgICBjb21tYW5kOiBjb21tYW5kXG4gICAgICAgIH0sIFxuICAgICAgICBmYWxzZVxuICAgICk7XG4gICAgXG4gICAgb2xkU3RhdGUgPSBpbnRlcnByZXRlci5zdGF0ZTtcbiAgICBpbnRlcnByZXRlci5zdGF0ZSA9IFwicGF1c2VcIjtcbiAgICBcbiAgICBidXR0b25zID0gW107XG4gICAgc2NlbmVzID0gW107XG4gICAgc2VsZiA9IGludGVycHJldGVyO1xuICAgIGNoaWxkcmVuID0gY29tbWFuZC5jaGlsZE5vZGVzO1xuICAgIGxlbiA9IGNoaWxkcmVuLmxlbmd0aDtcbiAgICBjc3NpZCA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwiY3NzaWRcIikgfHwgXCJXU0VDaG9pY2VNZW51XCI7XG4gICAgXG4gICAgbWFrZUJ1dHRvbkNsaWNrRm4gPSBmdW5jdGlvbiAoY3VyLCBtZSwgc2MsIGlkeCkge1xuICAgICAgICBcbiAgICAgICAgc2MgPSBzYyB8fCBudWxsO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHNldFRpbWVvdXQoXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNoaWxkcmVuTGVuID0gY3VyLmNoaWxkTm9kZXMgPyBjdXIuY2hpbGROb2Rlcy5sZW5ndGggOiAwO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9sZEluZGV4ID0gaW50ZXJwcmV0ZXIuaW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvbGRTY2VuZUlkID0gaW50ZXJwcmV0ZXIuc2NlbmVJZDtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG9sZFNjZW5lUGF0aCA9IGludGVycHJldGVyLnNjZW5lUGF0aC5zbGljZSgpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgb2xkQ3VycmVudFNjZW5lID0gaW50ZXJwcmV0ZXIuY3VycmVudFNjZW5lO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNjICE9PSBudWxsKSB7ICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY2hhbmdlU2NlbmVOb05leHQoc2MpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZiAoY2hpbGRyZW5MZW4gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVycHJldGVyLnB1c2hUb0NhbGxTdGFjaygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXIuY3VycmVudENvbW1hbmRzID0gY3VyLmNoaWxkTm9kZXM7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbnRlcnByZXRlci5zY2VuZUlkID0gb2xkU2NlbmVJZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVycHJldGVyLnNjZW5lUGF0aCA9IG9sZFNjZW5lUGF0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVycHJldGVyLnNjZW5lUGF0aC5wdXNoKG9sZEluZGV4LTEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXIuc2NlbmVQYXRoLnB1c2goaWR4KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVycHJldGVyLmluZGV4ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVycHJldGVyLmN1cnJlbnRTY2VuZSA9IG9sZEN1cnJlbnRTY2VuZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGludGVycHJldGVyLmN1cnJlbnRFbGVtZW50ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5uZXh0KCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZWxmLnN0YWdlLnJlbW92ZUNoaWxkKG1lKTtcbiAgICAgICAgICAgIGludGVycHJldGVyLndhaXRDb3VudGVyIC09IDE7XG4gICAgICAgICAgICBpbnRlcnByZXRlci5zdGF0ZSA9IG9sZFN0YXRlO1xuICAgICAgICB9O1xuICAgIH07XG4gICAgXG4gICAgaWYgKGxlbiA8IDEpIHtcbiAgICAgICAgXG4gICAgICAgIGludGVycHJldGVyLmJ1cy50cmlnZ2VyKFxuICAgICAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIud2FybmluZ1wiLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQ6IGNvbW1hbmQsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJFbGVtZW50ICdjaG9pY2UnIGlzIGVtcHR5LiBFeHBlY3RlZCBhdCBcIiArXG4gICAgICAgICAgICAgICAgICAgIFwibGVhc3Qgb25lICdvcHRpb24nIGVsZW1lbnQuXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG4gICAgXG4gICAgbWVudUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIG1lbnVFbGVtZW50LnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwibWVudVwiKTtcbiAgICBtZW51RWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBjc3NpZCk7XG4gICAgXG4gICAgLy8gYXNzb2NpYXRlIEhUTUwgZWxlbWVudCB3aXRoIFhNTCBlbGVtZW50OyB1c2VkIHdoZW4gbG9hZGluZyBzYXZlZ2FtZXM6XG4gICAgbWVudUVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS13c2UtaW5kZXhcIiwgaW50ZXJwcmV0ZXIuaW5kZXgpO1xuICAgIG1lbnVFbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtd3NlLXNjZW5lLWlkXCIsIGludGVycHJldGVyLnNjZW5lSWQpO1xuICAgIG1lbnVFbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtd3NlLWdhbWVcIiwgaW50ZXJwcmV0ZXIuZ2FtZS51cmwpO1xuICAgIG1lbnVFbGVtZW50LnNldEF0dHJpYnV0ZShcImRhdGEtd3NlLXR5cGVcIiwgXCJjaG9pY2VcIik7XG4gICAgXG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgIFxuICAgICAgICBjdXJyZW50ID0gY2hpbGRyZW5baV07XG4gICAgICAgIFxuICAgICAgICBpZiAoIWN1cnJlbnQudGFnTmFtZSB8fFxuICAgICAgICAgICAgICAgIGN1cnJlbnQudGFnTmFtZSAhPT0gXCJvcHRpb25cIiB8fFxuICAgICAgICAgICAgICAgICFpbnRlcnByZXRlci5jaGVja0lmdmFyKGN1cnJlbnQpKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjdXJyZW50QnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICBjdXJyZW50QnV0dG9uLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiYnV0dG9uXCIpO1xuICAgICAgICBjdXJyZW50QnV0dG9uLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJidXR0b25cIik7XG4gICAgICAgIGN1cnJlbnRCdXR0b24uc2V0QXR0cmlidXRlKFwidGFiaW5kZXhcIiwgaSArIDEpO1xuICAgICAgICBjdXJyZW50QnV0dG9uLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIGN1cnJlbnQuZ2V0QXR0cmlidXRlKFwibGFiZWxcIikpO1xuICAgICAgICBcbiAgICAgICAgY3VycmVudEJ1dHRvbi52YWx1ZSA9IHRvb2xzLnJlcGxhY2VWYXJpYWJsZXMoXG4gICAgICAgICAgICBjdXJyZW50LmdldEF0dHJpYnV0ZShcImxhYmVsXCIpLFxuICAgICAgICAgICAgaW50ZXJwcmV0ZXJcbiAgICAgICAgKTtcbiAgICAgICAgXG4gICAgICAgIHNjZW5lTmFtZSA9IGN1cnJlbnQuZ2V0QXR0cmlidXRlKFwic2NlbmVcIikgfHwgbnVsbDtcbiAgICAgICAgXG4gICAgICAgIHNjZW5lc1tpXSA9IHNjZW5lTmFtZSA/IGludGVycHJldGVyLmdldFNjZW5lQnlJZChzY2VuZU5hbWUpIDogbnVsbDtcbiAgICAgICAgXG4gICAgICAgIGN1cnJlbnRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lciggXG4gICAgICAgICAgICAnY2xpY2snLFxuICAgICAgICAgICAgbWFrZUJ1dHRvbkNsaWNrRm4oY3VycmVudCwgbWVudUVsZW1lbnQsIHNjZW5lc1tpXSwgaSlcbiAgICAgICAgKTtcbiAgICAgICAgXG4gICAgICAgIGJ1dHRvbnMucHVzaChjdXJyZW50QnV0dG9uKTtcbiAgICAgICAgbWVudUVsZW1lbnQuYXBwZW5kQ2hpbGQoY3VycmVudEJ1dHRvbik7XG4gICAgfVxuICAgIFxuICAgIG1lbnVFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgIGludGVycHJldGVyLnN0YWdlLmFwcGVuZENoaWxkKG1lbnVFbGVtZW50KTtcbiAgICBcbiAgICBEaXNwbGF5T2JqZWN0LnByb3RvdHlwZS5zaG93LmNhbGwoXG4gICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgY29tbWFuZCxcbiAgICAgICAge1xuICAgICAgICAgICAgZWxlbWVudDogbWVudUVsZW1lbnQsXG4gICAgICAgICAgICBidXM6IGludGVycHJldGVyLmJ1cyxcbiAgICAgICAgICAgIHN0YWdlOiBpbnRlcnByZXRlci5zdGFnZSxcbiAgICAgICAgICAgIGludGVycHJldGVyOiBpbnRlcnByZXRlclxuICAgICAgICB9XG4gICAgKTtcbiAgICBcbiAgICBpbnRlcnByZXRlci53YWl0Q291bnRlciArPSAxO1xuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIGRvTmV4dDogZmFsc2UsXG4gICAgICAgIHdhaXQ6IHRydWVcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNob2ljZTtcbiIsIlxudmFyIHVpID0gcmVxdWlyZShcIi4uL3Rvb2xzL3VpXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHVpLm1ha2VJbnB1dEZuKFwiY29uZmlybVwiKTtcbiIsIlxudmFyIHdhcm4gPSByZXF1aXJlKFwiLi4vdG9vbHMvdG9vbHNcIikud2FybjtcblxuZnVuY3Rpb24gZG9Db21tYW5kIChjb21tYW5kLCBpbnRlcnByZXRlciwgYXJncykge1xuICAgIFxuICAgIHZhciBhc3NldE5hbWUsIGFjdGlvbiwgYnVzID0gaW50ZXJwcmV0ZXIuYnVzLCBhc3NldHMgPSBpbnRlcnByZXRlci5hc3NldHM7XG4gICAgXG4gICAgYXJncyA9IGFyZ3MgfHwge307XG4gICAgXG4gICAgYnVzLnRyaWdnZXIoXG4gICAgICAgIFwid3NlLmludGVycHJldGVyLmNvbW1hbmRzLmRvXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGludGVycHJldGVyOiBpbnRlcnByZXRlcixcbiAgICAgICAgICAgIGNvbW1hbmQ6IGNvbW1hbmRcbiAgICAgICAgfSwgXG4gICAgICAgIGZhbHNlXG4gICAgKTtcbiAgICBcbiAgICBhc3NldE5hbWUgPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcImFzc2V0XCIpO1xuICAgIGFjdGlvbiA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwiYWN0aW9uXCIpO1xuICAgIFxuICAgIGlmIChhc3NldE5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgd2FybihidXMsIFwiRWxlbWVudCBvZiB0eXBlICdkbycgbXVzdCBoYXZlIGFuIGF0dHJpYnV0ZSAnYXNzZXQnLiBcIiArXG4gICAgICAgICAgICBcIkVsZW1lbnQgaWdub3JlZC5cIiwgY29tbWFuZCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaWYgKGFjdGlvbiA9PT0gbnVsbCkge1xuICAgICAgICB3YXJuKGJ1cywgXCJFbGVtZW50IG9mIHR5cGUgJ2RvJyBtdXN0IGhhdmUgYW4gYXR0cmlidXRlICdhY3Rpb24nLlwiICtcbiAgICAgICAgICAgIFwiIEVsZW1lbnQgaWdub3JlZC5cIiwgY29tbWFuZCk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgaWYgKHR5cGVvZiBhc3NldHNbYXNzZXROYW1lXSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBhc3NldHNbYXNzZXROYW1lXSA9PT0gbnVsbCkge1xuICAgICAgICB3YXJuKGJ1cywgXCJSZWZlcmVuY2UgdG8gdW5rbm93biBhc3NldCAnXCIgKyBhc3NldE5hbWUgKyBcIicuXCIsIGNvbW1hbmQpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZG9OZXh0OiB0cnVlXG4gICAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIGlmICh0eXBlb2YgYXNzZXRzW2Fzc2V0TmFtZV1bYWN0aW9uXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICB3YXJuKGJ1cywgXCJBY3Rpb24gJ1wiICsgYWN0aW9uICsgXCInIGlzIG5vdCBkZWZpbmVkIGZvciBhc3NldCAnXCIgK1xuICAgICAgICAgICAgYXNzZXROYW1lICsgXCInLlwiLCBjb21tYW5kKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRvTmV4dDogdHJ1ZVxuICAgICAgICB9O1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gYXNzZXRzW2Fzc2V0TmFtZV1bYWN0aW9uXShjb21tYW5kLCBhcmdzKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkb0NvbW1hbmQ7XG4iLCJcbnZhciB3YXJuID0gcmVxdWlyZShcIi4uL3Rvb2xzL3Rvb2xzXCIpLndhcm47XG52YXIgZnVuY3Rpb25zID0gcmVxdWlyZShcIi4uL2Z1bmN0aW9uc1wiKTtcblxuZnVuY3Rpb24gZm4gKGNvbW1hbmQsIGludGVycHJldGVyKSB7XG4gICAgXG4gICAgdmFyIG5hbWUsIHZhck5hbWUsIHJldDtcbiAgICBcbiAgICBuYW1lID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpIHx8IG51bGw7XG4gICAgdmFyTmFtZSA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwidG92YXJcIikgfHwgbnVsbDtcbiAgICBcbiAgICBpZiAodHlwZW9mIG5hbWUgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgd2FybihpbnRlcnByZXRlci5idXMsIFwiTm8gbmFtZSBzdXBwbGllZCBvbiBmbiBlbGVtZW50LlwiLCBjb21tYW5kKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRvTmV4dDogdHJ1ZVxuICAgICAgICB9O1xuICAgIH1cbiAgICBcbiAgICBpZiAodHlwZW9mIGZ1bmN0aW9uc1tuYW1lXSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHdhcm4oaW50ZXJwcmV0ZXIuYnVzLCBcIlVua25vd24gZnVuY3Rpb24gJ1wiICsgbmFtZSArIFwiJy5cIiwgY29tbWFuZCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBkb05leHQ6IHRydWVcbiAgICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgcmV0ID0gZnVuY3Rpb25zW25hbWVdKGludGVycHJldGVyKTtcbiAgICBcbiAgICBpZiAodmFyTmFtZSAhPT0gbnVsbCl7XG4gICAgICAgIGludGVycHJldGVyLnJ1blZhcnNbdmFyTmFtZV0gPSBcIlwiICsgcmV0O1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4ge1xuICAgICAgICBkb05leHQ6IHRydWVcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZuO1xuIiwiXG52YXIgd2FybiA9IHJlcXVpcmUoXCIuLi90b29scy90b29sc1wiKS53YXJuO1xuXG5mdW5jdGlvbiBnbG9iYWxDb21tYW5kIChjb21tYW5kLCBpbnRlcnByZXRlcikge1xuICAgIFxuICAgIHZhciBuYW1lLCB2YWx1ZSwgbmV4dDtcbiAgICBcbiAgICBuYW1lID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpIHx8IG51bGw7XG4gICAgdmFsdWUgPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpIHx8IG51bGw7XG4gICAgbmV4dCA9IHtkb05leHQ6IHRydWV9O1xuICAgIFxuICAgIGlmIChuYW1lID09PSBudWxsKSB7XG4gICAgICAgIHdhcm4oaW50ZXJwcmV0ZXIuYnVzLCBcIk5vIG5hbWUgZGVmaW5lZCBvbiBlbGVtZW50ICdnbG9iYWwnLlwiLCBjb21tYW5kKTtcbiAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfVxuICAgIFxuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgICB3YXJuKGludGVycHJldGVyLmJ1cywgXCJObyB2YWx1ZSBkZWZpbmVkIG9uIGVsZW1lbnQgJ2dsb2JhbCcuXCIsIGNvbW1hbmQpO1xuICAgICAgICByZXR1cm4gbmV4dDtcbiAgICB9XG4gICAgXG4gICAgaW50ZXJwcmV0ZXIuZ2xvYmFsVmFycy5zZXQobmFtZSwgdmFsdWUpO1xuICAgIFxuICAgIHJldHVybiBuZXh0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdsb2JhbENvbW1hbmQ7XG4iLCJcbnZhciB3YXJuID0gcmVxdWlyZShcIi4uL3Rvb2xzL3Rvb2xzXCIpLndhcm47XG5cbmZ1bmN0aW9uIGdsb2JhbGl6ZSAoY29tbWFuZCwgaW50ZXJwcmV0ZXIpIHtcbiAgICBcbiAgICB2YXIga2V5LCBuZXh0O1xuICAgIFxuICAgIGtleSA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwibmFtZVwiKSB8fCBudWxsO1xuICAgIG5leHQgPSB7ZG9OZXh0OiB0cnVlfTtcbiAgICBcbiAgICBpZiAoa2V5ID09PSBudWxsKSB7XG4gICAgICAgIHdhcm4oaW50ZXJwcmV0ZXIuYnVzLCBcIk5vIHZhcmlhYmxlIG5hbWUgZGVmaW5lZCBvbiBnbG9iYWxpemUgZWxlbWVudC5cIiwgY29tbWFuZCk7XG4gICAgICAgIHJldHVybiBuZXh0O1xuICAgIH1cbiAgICBcbiAgICBpZiAodHlwZW9mIGludGVycHJldGVyLnJ1blZhcnNba2V5XSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBpbnRlcnByZXRlci5ydW5WYXJzW2tleV0gPT09IG51bGwpIHtcbiAgICAgICAgd2FybihpbnRlcnByZXRlci5idXMsIFwiVW5kZWZpbmVkIGxvY2FsIHZhcmlhYmxlLlwiLCBjb21tYW5kKTtcbiAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfVxuICAgIFxuICAgIGludGVycHJldGVyLmdsb2JhbFZhcnMuc2V0KGtleSwgaW50ZXJwcmV0ZXIucnVuVmFyc1trZXldKTtcbiAgICBcbiAgICByZXR1cm4gbmV4dDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnbG9iYWxpemU7XG4iLCJcbnZhciB0b29scyA9IHJlcXVpcmUoXCIuLi90b29scy90b29sc1wiKTtcblxudmFyIGxvZ0Vycm9yID0gdG9vbHMubG9nRXJyb3I7XG52YXIgcmVwbGFjZVZhcnMgPSB0b29scy5yZXBsYWNlVmFyaWFibGVzO1xuXG5mdW5jdGlvbiBnb3RvQ29tbWFuZCAoY29tbWFuZCwgaW50ZXJwcmV0ZXIpIHtcbiAgICBcbiAgICB2YXIgc2NlbmUsIHNjZW5lTmFtZSwgYnVzID0gaW50ZXJwcmV0ZXIuYnVzO1xuICAgIFxuICAgIGJ1cy50cmlnZ2VyKFxuICAgICAgICBcIndzZS5pbnRlcnByZXRlci5jb21tYW5kcy5nb3RvXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGludGVycHJldGVyOiBpbnRlcnByZXRlcixcbiAgICAgICAgICAgIGNvbW1hbmQ6IGNvbW1hbmRcbiAgICAgICAgfSwgXG4gICAgICAgIGZhbHNlXG4gICAgKTtcbiAgICBcbiAgICBzY2VuZU5hbWUgPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcInNjZW5lXCIpO1xuICAgIFxuICAgIGlmIChzY2VuZU5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgbG9nRXJyb3IoYnVzLCBcIkVsZW1lbnQgJ2dvdG8nIG1pc3NlcyBhdHRyaWJ1dGUgJ3NjZW5lJy5cIik7XG4gICAgfVxuICAgIFxuICAgIHNjZW5lTmFtZSA9IHJlcGxhY2VWYXJzKHNjZW5lTmFtZSwgaW50ZXJwcmV0ZXIpO1xuICAgIFxuICAgIHNjZW5lID0gaW50ZXJwcmV0ZXIuZ2V0U2NlbmVCeUlkKHNjZW5lTmFtZSk7XG4gICAgXG4gICAgaWYgKHNjZW5lID09PSBudWxsKSB7XG4gICAgICAgIGxvZ0Vycm9yKGJ1cywgXCJVbmtub3duIHNjZW5lICdcIiArIHNjZW5lTmFtZSArIFwiJy5cIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY2hhbmdlU2NlbmU6IHNjZW5lXG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBnb3RvQ29tbWFuZDtcbiIsIlxudmFyIHRvb2xzID0gcmVxdWlyZShcIi4uL3Rvb2xzL3Rvb2xzXCIpO1xuXG52YXIgd2FybiA9IHRvb2xzLndhcm47XG52YXIgZ2V0U2VyaWFsaXplZE5vZGVzID0gdG9vbHMuZ2V0U2VyaWFsaXplZE5vZGVzO1xuXG5mdW5jdGlvbiBsaW5lIChjb21tYW5kLCBpbnRlcnByZXRlcikge1xuICAgIFxuICAgIHZhciBzcGVha2VySWQsIHNwZWFrZXJOYW1lLCB0ZXh0Ym94TmFtZSwgaSwgbGVuLCBjdXJyZW50O1xuICAgIHZhciBhc3NldEVsZW1lbnRzLCB0ZXh0LCBkb05leHQsIGJ1cyA9IGludGVycHJldGVyLmJ1cywgbmV4dDtcbiAgICBcbiAgICBuZXh0ID0ge2RvTmV4dDogdHJ1ZX07XG4gICAgXG4gICAgYnVzLnRyaWdnZXIoXG4gICAgICAgIFwid3NlLmludGVycHJldGVyLmNvbW1hbmRzLmxpbmVcIixcbiAgICAgICAge1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXI6IGludGVycHJldGVyLFxuICAgICAgICAgICAgY29tbWFuZDogY29tbWFuZFxuICAgICAgICB9LCBcbiAgICAgICAgZmFsc2VcbiAgICApO1xuICAgIFxuICAgIHNwZWFrZXJJZCA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwic1wiKTtcbiAgICBkb05leHQgPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcInN0b3BcIikgPT09IFwiZmFsc2VcIiA/IHRydWUgOiBmYWxzZTtcbiAgICBcbiAgICBpZiAoc3BlYWtlcklkID09PSBudWxsKSB7XG4gICAgICAgIHdhcm4oYnVzLCBcIkVsZW1lbnQgJ2xpbmUnIHJlcXVpcmVzIGF0dHJpYnV0ZSAncycuXCIsIGNvbW1hbmQpO1xuICAgICAgICByZXR1cm4gbmV4dDtcbiAgICB9XG4gICAgXG4gICAgYXNzZXRFbGVtZW50cyA9IGludGVycHJldGVyLnN0b3J5LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiY2hhcmFjdGVyXCIpO1xuICAgIGxlbiA9IGFzc2V0RWxlbWVudHMubGVuZ3RoO1xuICAgIFxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkgKz0gMSkge1xuICAgICAgICBcbiAgICAgICAgY3VycmVudCA9IGFzc2V0RWxlbWVudHNbaV07XG4gICAgICAgIFxuICAgICAgICBpZiAoY3VycmVudC5nZXRBdHRyaWJ1dGUoXCJuYW1lXCIpID09PSBzcGVha2VySWQpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGV4dGJveE5hbWUgPSBjdXJyZW50LmdldEF0dHJpYnV0ZShcInRleHRib3hcIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGV4dGJveE5hbWUgPT09IFwidW5kZWZpbmVkXCIgfHwgdGV4dGJveE5hbWUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB3YXJuKGJ1cywgXCJObyB0ZXh0Ym94IGRlZmluZWQgZm9yIGNoYXJhY3RlciAnXCIgKyBzcGVha2VySWQgKyBcIicuXCIsIGNvbW1hbmQpO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHNwZWFrZXJOYW1lID1cbiAgICAgICAgICAgICAgICAgICAgZ2V0U2VyaWFsaXplZE5vZGVzKGN1cnJlbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJkaXNwbGF5bmFtZVwiKVswXSkudHJpbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGUpIHt9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIGlmICh0eXBlb2YgaW50ZXJwcmV0ZXIuYXNzZXRzW3RleHRib3hOYW1lXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICB3YXJuKGJ1cywgXCJUcnlpbmcgdG8gdXNlIGFuIHVua25vd24gdGV4dGJveCBvciBjaGFyYWN0ZXIuXCIsIGNvbW1hbmQpO1xuICAgICAgICByZXR1cm4gbmV4dDtcbiAgICB9XG4gICAgXG4gICAgdGV4dCA9IGdldFNlcmlhbGl6ZWROb2Rlcyhjb21tYW5kKTtcbiAgICBcbiAgICBpbnRlcnByZXRlci5sb2cucHVzaCh7c3BlYWtlcjogc3BlYWtlcklkLCB0ZXh0OiB0ZXh0fSk7XG4gICAgaW50ZXJwcmV0ZXIuYXNzZXRzW3RleHRib3hOYW1lXS5wdXQodGV4dCwgc3BlYWtlck5hbWUsIHNwZWFrZXJJZCk7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZG9OZXh0OiBkb05leHQsXG4gICAgICAgIHdhaXQ6IHRydWVcbiAgICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxpbmU7XG4iLCJcbnZhciB3YXJuID0gcmVxdWlyZShcIi4uL3Rvb2xzL3Rvb2xzXCIpLndhcm47XG5cbmZ1bmN0aW9uIGxvY2FsaXplIChjb21tYW5kLCBpbnRlcnByZXRlcikge1xuICAgIFxuICAgIHZhciBrZXksIG5leHQ7XG4gICAgXG4gICAgbmV4dCA9IHtkb05leHQ6IHRydWV9O1xuICAgIGtleSA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwibmFtZVwiKSB8fCBudWxsO1xuICAgIFxuICAgIGlmIChrZXkgPT09IG51bGwpIHtcbiAgICAgICAgd2FybihpbnRlcnByZXRlci5idXMsIFwiTm8gdmFyaWFibGUgbmFtZSBkZWZpbmVkIG9uIGxvY2FsaXplIGVsZW1lbnQuXCIsIGNvbW1hbmQpO1xuICAgICAgICByZXR1cm4gbmV4dDtcbiAgICB9XG4gICAgXG4gICAgaWYgKCFpbnRlcnByZXRlci5nbG9iYWxWYXJzLmhhcyhrZXkpKSB7XG4gICAgICAgIHdhcm4oaW50ZXJwcmV0ZXIuYnVzLCBcIlVuZGVmaW5lZCBnbG9iYWwgdmFyaWFibGUuXCIsIGNvbW1hbmQpO1xuICAgICAgICByZXR1cm4gbmV4dDtcbiAgICB9XG4gICAgXG4gICAgaW50ZXJwcmV0ZXIucnVuVmFyc1trZXldID0gaW50ZXJwcmV0ZXIuZ2xvYmFsVmFycy5nZXQoa2V5KTtcbiAgICBcbiAgICByZXR1cm4gbmV4dDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBsb2NhbGl6ZTtcbiIsIlxudmFyIHVpID0gcmVxdWlyZShcIi4uL3Rvb2xzL3VpXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHVpLm1ha2VJbnB1dEZuKFwicHJvbXB0XCIpO1xuIiwiXG5mdW5jdGlvbiByZXN0YXJ0IChjb21tYW5kLCBpbnRlcnByZXRlcikge1xuICAgIFxuICAgIGludGVycHJldGVyLmJ1cy50cmlnZ2VyKFxuICAgICAgICBcIndzZS5pbnRlcnByZXRlci5jb21tYW5kcy5yZXN0YXJ0XCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGludGVycHJldGVyOiBpbnRlcnByZXRlcixcbiAgICAgICAgICAgIGNvbW1hbmQ6IGNvbW1hbmRcbiAgICAgICAgfSwgXG4gICAgICAgIGZhbHNlXG4gICAgKTtcbiAgICBcbiAgICBpbnRlcnByZXRlci5idXMudHJpZ2dlcihcIndzZS5pbnRlcnByZXRlci5tZXNzYWdlXCIsIFwiUmVzdGFydGluZyBnYW1lLi4uXCIsIGZhbHNlKTtcbiAgICBpbnRlcnByZXRlci5idXMudHJpZ2dlcihcIndzZS5pbnRlcnByZXRlci5yZXN0YXJ0XCIsIGludGVycHJldGVyLCBmYWxzZSk7XG4gICAgXG4gICAgaW50ZXJwcmV0ZXIucnVuVmFycyA9IHt9O1xuICAgIGludGVycHJldGVyLmxvZyA9IFtdO1xuICAgIGludGVycHJldGVyLnZpc2l0ZWRTY2VuZXMgPSBbXTtcbiAgICBpbnRlcnByZXRlci5zdGFydFRpbWUgPSBNYXRoLnJvdW5kKCtuZXcgRGF0ZSgpIC8gMTAwMCk7XG4gICAgaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgPSAwO1xuICAgIGludGVycHJldGVyLnN0YXRlID0gXCJsaXN0ZW5cIjtcbiAgICBpbnRlcnByZXRlci5zdGFnZS5pbm5lckhUTUwgPSBcIlwiO1xuICAgIFxuICAgIGludGVycHJldGVyLmFzc2V0cyA9IHt9O1xuICAgIGludGVycHJldGVyLmJ1aWxkQXNzZXRzKCk7XG4gICAgaW50ZXJwcmV0ZXIuY2FsbE9uTG9hZCgpO1xuICAgIFxuICAgIHdoaWxlIChpbnRlcnByZXRlci5jYWxsU3RhY2subGVuZ3RoID4gMCkge1xuICAgICAgICBpbnRlcnByZXRlci5jYWxsU3RhY2suc2hpZnQoKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZG9OZXh0OiB0cnVlLFxuICAgICAgICBjaGFuZ2VTY2VuZTogaW50ZXJwcmV0ZXIuZ2V0Rmlyc3RTY2VuZSgpXG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZXN0YXJ0O1xuIiwiXG52YXIgbG9nRXJyb3IgPSByZXF1aXJlKFwiLi4vdG9vbHMvdG9vbHNcIikubG9nRXJyb3I7XG5cbmZ1bmN0aW9uIHNldFZhcnMgKGNvbW1hbmQsIGludGVycHJldGVyKSB7XG4gICAgXG4gICAgdmFyIGNvbnRhaW5lciA9IGludGVycHJldGVyLnJ1blZhcnMsIGtleXMsIHZhbHVlcywgbmV4dDtcbiAgICBcbiAgICBuZXh0ID0ge2RvTmV4dDogdHJ1ZX07XG4gICAga2V5cyA9IChjb21tYW5kLmdldEF0dHJpYnV0ZShcIm5hbWVzXCIpIHx8IFwiXCIpLnNwbGl0KFwiLFwiKTtcbiAgICB2YWx1ZXMgPSAoY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJ2YWx1ZXNcIikgfHwgXCJcIikuc3BsaXQoXCIsXCIpO1xuICAgIFxuICAgIGlmIChrZXlzLmxlbmd0aCAhPT0gdmFsdWVzLmxlbmd0aCkge1xuICAgICAgICBsb2dFcnJvcihpbnRlcnByZXRlci5idXMsIFwiTnVtYmVyIG9mIG5hbWVzIGRvZXMgbm90IG1hdGNoIG51bWJlciBvZiB2YWx1ZXMgXCIgK1xuICAgICAgICAgICAgXCJpbiA8c2V0X3ZhcnM+IGNvbW1hbmQuXCIpO1xuICAgICAgICByZXR1cm4gbmV4dDtcbiAgICB9XG4gICAgXG4gICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXksIGkpIHtcbiAgICAgICAgY29udGFpbmVyW2tleS50cmltKCldID0gXCJcIiArIHZhbHVlc1tpXS50cmltKCk7XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuIG5leHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0VmFycztcbiIsIlxudmFyIHRvb2xzID0gcmVxdWlyZShcIi4uL3Rvb2xzL3Rvb2xzXCIpO1xudmFyIHNldFZhcnMgPSByZXF1aXJlKFwiLi9zZXRfdmFyc1wiKTtcblxudmFyIGxvZyA9IHRvb2xzLmxvZztcbnZhciB3YXJuID0gdG9vbHMud2FybjtcbnZhciBsb2dFcnJvciA9IHRvb2xzLmxvZ0Vycm9yO1xudmFyIHJlcGxhY2VWYXJzID0gdG9vbHMucmVwbGFjZVZhcmlhYmxlcztcblxuZnVuY3Rpb24gc3ViIChjb21tYW5kLCBpbnRlcnByZXRlcikge1xuICAgIFxuICAgIHZhciBzY2VuZUlkLCBzY2VuZSwgZG9OZXh0LCBuZXh0O1xuICAgIFxuICAgIGludGVycHJldGVyLmJ1cy50cmlnZ2VyKFxuICAgICAgICBcIndzZS5pbnRlcnByZXRlci5jb21tYW5kcy5zdWJcIixcbiAgICAgICAge1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXI6IGludGVycHJldGVyLFxuICAgICAgICAgICAgY29tbWFuZDogY29tbWFuZFxuICAgICAgICB9LCBcbiAgICAgICAgZmFsc2VcbiAgICApO1xuICAgIFxuICAgIG5leHQgPSB7ZG9OZXh0OiB0cnVlfTtcbiAgICBzY2VuZUlkID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJzY2VuZVwiKSB8fCBudWxsO1xuICAgIGRvTmV4dCA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwibmV4dFwiKSA9PT0gZmFsc2UgPyBmYWxzZSA6IHRydWU7XG4gICAgXG4gICAgaWYgKHNjZW5lSWQgPT09IG51bGwpIHtcbiAgICAgICAgd2FybihpbnRlcnByZXRlci5idXMsIFwiTWlzc2luZyAnc2NlbmUnIGF0dHJpYnV0ZSBvbiAnc3ViJyBjb21tYW5kIVwiLCBjb21tYW5kKTtcbiAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfVxuICAgIFxuICAgIHNjZW5lSWQgPSByZXBsYWNlVmFycyhzY2VuZUlkLCBpbnRlcnByZXRlcik7XG4gICAgc2NlbmUgPSBpbnRlcnByZXRlci5nZXRTY2VuZUJ5SWQoc2NlbmVJZCk7XG4gICAgXG4gICAgaWYgKCFzY2VuZSkge1xuICAgICAgICBsb2dFcnJvcihpbnRlcnByZXRlci5idXMsIFwiTm8gc3VjaCBzY2VuZSAnXCIgKyBzY2VuZUlkICsgXCInIVwiLCBjb21tYW5kKTtcbiAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfVxuICAgIFxuICAgIGxvZyhpbnRlcnByZXRlci5idXMsIFwiRW50ZXJpbmcgc3ViIHNjZW5lICdcIiArIHNjZW5lSWQgKyBcIicuLi5cIik7XG4gICAgXG4gICAgaW50ZXJwcmV0ZXIucHVzaFRvQ2FsbFN0YWNrKCk7XG4gICAgXG4gICAgaW50ZXJwcmV0ZXIuY3VycmVudENvbW1hbmRzID0gc2NlbmUuY2hpbGROb2RlcztcbiAgICBpbnRlcnByZXRlci5pbmRleCA9IC0xO1xuICAgIGludGVycHJldGVyLnNjZW5lSWQgPSBzY2VuZUlkO1xuICAgIGludGVycHJldGVyLnNjZW5lUGF0aCA9IFtdO1xuICAgIGludGVycHJldGVyLmN1cnJlbnRFbGVtZW50ID0gLTE7XG4gICAgXG4gICAgaWYgKGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwibmFtZXNcIikpIHtcbiAgICAgICAgc2V0VmFycyhjb21tYW5kLCBpbnRlcnByZXRlcik7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIGRvTmV4dDogZG9OZXh0XG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdWI7XG4iLCJcbnZhciB3YXJuID0gcmVxdWlyZShcIi4uL3Rvb2xzL3Rvb2xzXCIpLndhcm47XG5cbmZ1bmN0aW9uIHRyaWdnZXIgKGNvbW1hbmQsIGludGVycHJldGVyKSB7XG4gICAgXG4gICAgdmFyIHRyaWdnZXJOYW1lLCBhY3Rpb24sIG5leHQ7XG4gICAgXG4gICAgbmV4dCA9IHtkb05leHQ6IHRydWV9O1xuICAgIFxuICAgIGludGVycHJldGVyLmJ1cy50cmlnZ2VyKFxuICAgICAgICBcIndzZS5pbnRlcnByZXRlci5jb21tYW5kcy50cmlnZ2VyXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGludGVycHJldGVyOiBpbnRlcnByZXRlcixcbiAgICAgICAgICAgIGNvbW1hbmQ6IGNvbW1hbmRcbiAgICAgICAgfSwgXG4gICAgICAgIGZhbHNlXG4gICAgKTtcbiAgICBcbiAgICB0cmlnZ2VyTmFtZSA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwibmFtZVwiKSB8fCBudWxsO1xuICAgIGFjdGlvbiA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwiYWN0aW9uXCIpIHx8IG51bGw7XG4gICAgXG4gICAgaWYgKHRyaWdnZXJOYW1lID09PSBudWxsKSB7XG4gICAgICAgIHdhcm4oaW50ZXJwcmV0ZXIuYnVzLCBcIk5vIG5hbWUgc3BlY2lmaWVkIG9uIHRyaWdnZXIgY29tbWFuZC5cIiwgY29tbWFuZCk7XG4gICAgICAgIHJldHVybiBuZXh0O1xuICAgIH1cbiAgICBcbiAgICBpZiAoYWN0aW9uID09PSBudWxsKSB7XG4gICAgICAgIHdhcm4oaW50ZXJwcmV0ZXIuYnVzLCBcIk5vIGFjdGlvbiBzcGVjaWZpZWQgb24gdHJpZ2dlciBjb21tYW5kIFwiICtcbiAgICAgICAgICAgIFwicmVmZXJlbmNpbmcgdHJpZ2dlciAnXCIgKyB0cmlnZ2VyTmFtZSArIFwiJy5cIiwgY29tbWFuZCk7XG4gICAgICAgIHJldHVybiBuZXh0O1xuICAgIH1cbiAgICBcbiAgICBpZiAoXG4gICAgICAgIHR5cGVvZiBpbnRlcnByZXRlci50cmlnZ2Vyc1t0cmlnZ2VyTmFtZV0gPT09IFwidW5kZWZpbmVkXCIgfHxcbiAgICAgICAgaW50ZXJwcmV0ZXIudHJpZ2dlcnNbdHJpZ2dlck5hbWVdID09PSBudWxsXG4gICAgKSB7XG4gICAgICAgIHdhcm4oaW50ZXJwcmV0ZXIuYnVzLCBcIlJlZmVyZW5jZSB0byB1bmtub3duIHRyaWdnZXIgJ1wiICsgdHJpZ2dlck5hbWUgKyBcIicuXCIsIGNvbW1hbmQpO1xuICAgICAgICByZXR1cm4gbmV4dDtcbiAgICB9XG4gICAgXG4gICAgaWYgKHR5cGVvZiBpbnRlcnByZXRlci50cmlnZ2Vyc1t0cmlnZ2VyTmFtZV1bYWN0aW9uXSAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHdhcm4oaW50ZXJwcmV0ZXIuYnVzLCBcIlVua25vd24gYWN0aW9uICdcIiArIGFjdGlvbiArXG4gICAgICAgICAgICBcIicgb24gdHJpZ2dlciBjb21tYW5kIHJlZmVyZW5jaW5nIHRyaWdnZXIgJ1wiICsgdHJpZ2dlck5hbWUgKyBcIicuXCIsIGNvbW1hbmQpO1xuICAgICAgICByZXR1cm4gbmV4dDtcbiAgICB9XG4gICAgXG4gICAgaW50ZXJwcmV0ZXIudHJpZ2dlcnNbdHJpZ2dlck5hbWVdW2FjdGlvbl0oY29tbWFuZCk7XG4gICAgXG4gICAgcmV0dXJuIG5leHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHJpZ2dlcjtcbiIsIlxudmFyIHRvb2xzID0gcmVxdWlyZShcIi4uL3Rvb2xzL3Rvb2xzXCIpO1xuXG52YXIgbG9nID0gdG9vbHMubG9nO1xudmFyIHdhcm4gPSB0b29scy53YXJuO1xudmFyIHJlcGxhY2VWYXJzID0gdG9vbHMucmVwbGFjZVZhcmlhYmxlcztcblxuZnVuY3Rpb24gdmFyQ29tbWFuZCAoY29tbWFuZCwgaW50ZXJwcmV0ZXIpIHtcbiAgICBcbiAgICB2YXIga2V5LCB2YWwsIGx2YWwsIGFjdGlvbiwgY29udGFpbmVyLCBuZXh0O1xuICAgIFxuICAgIG5leHQgPSB7ZG9OZXh0OiB0cnVlfTtcbiAgICBcbiAgICBpbnRlcnByZXRlci5idXMudHJpZ2dlcihcbiAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIuY29tbWFuZHMudmFyXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGludGVycHJldGVyOiBpbnRlcnByZXRlcixcbiAgICAgICAgICAgIGNvbW1hbmQ6IGNvbW1hbmRcbiAgICAgICAgfSwgXG4gICAgICAgIGZhbHNlXG4gICAgKTtcbiAgICBcbiAgICBrZXkgPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcIm5hbWVcIikgfHwgbnVsbDtcbiAgICB2YWwgPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcInZhbHVlXCIpIHx8IFwiMVwiO1xuICAgIGFjdGlvbiA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwiYWN0aW9uXCIpIHx8IFwic2V0XCI7XG4gICAgXG4gICAgaWYgKGtleSA9PT0gbnVsbCkge1xuICAgICAgICB3YXJuKGludGVycHJldGVyLmJ1cywgXCJDb21tYW5kICd2YXInIG11c3QgaGF2ZSBhICduYW1lJyBhdHRyaWJ1dGUuXCIsIGNvbW1hbmQpO1xuICAgICAgICByZXR1cm4gbmV4dDtcbiAgICB9XG4gICAgXG4gICAgY29udGFpbmVyID0gaW50ZXJwcmV0ZXIucnVuVmFycztcbiAgICBcbiAgICBpZiAoYWN0aW9uICE9PSBcInNldFwiICYmICEoa2V5IGluIGNvbnRhaW5lciB8fCBjb21tYW5kLmdldEF0dHJpYnV0ZShcImx2YWx1ZVwiKSkpIHtcbiAgICAgICAgd2FybihpbnRlcnByZXRlci5idXMsIFwiVW5kZWZpbmVkIHZhcmlhYmxlLlwiLCBjb21tYW5kKTtcbiAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfVxuICAgIFxuICAgIHZhbCAgPSByZXBsYWNlVmFycyh2YWwsICBpbnRlcnByZXRlcik7XG4gICAgXG4gICAgaWYgKGFjdGlvbiA9PT0gXCJzZXRcIikge1xuICAgICAgICBjb250YWluZXJba2V5XSA9IFwiXCIgKyB2YWw7XG4gICAgICAgIHJldHVybiBuZXh0O1xuICAgIH1cbiAgICBcbiAgICBsdmFsID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJsdmFsdWVcIikgfHwgY29udGFpbmVyW2tleV07XG4gICAgbHZhbCA9IHJlcGxhY2VWYXJzKGx2YWwsIGludGVycHJldGVyKTtcbiAgICBcbiAgICBzd2l0Y2ggKGFjdGlvbikge1xuICAgICAgICBcbiAgICAgICAgY2FzZSBcImRlbGV0ZVwiOlxuICAgICAgICAgICAgZGVsZXRlIGNvbnRhaW5lcltrZXldO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIFxuICAgICAgICBjYXNlIFwiaW5jcmVhc2VcIjpcbiAgICAgICAgICAgIGNvbnRhaW5lcltrZXldID0gXCJcIiArIChwYXJzZUZsb2F0KGx2YWwpICsgcGFyc2VGbG9hdCh2YWwpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZGVjcmVhc2VcIjpcbiAgICAgICAgICAgIGNvbnRhaW5lcltrZXldID0gXCJcIiArIChwYXJzZUZsb2F0KGx2YWwpIC0gcGFyc2VGbG9hdCh2YWwpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibXVsdGlwbHlcIjpcbiAgICAgICAgICAgIGNvbnRhaW5lcltrZXldID0gXCJcIiArIChwYXJzZUZsb2F0KGx2YWwpICogcGFyc2VGbG9hdCh2YWwpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZGl2aWRlXCI6XG4gICAgICAgICAgICBjb250YWluZXJba2V5XSA9IFwiXCIgKyAocGFyc2VGbG9hdChsdmFsKSAvIHBhcnNlRmxvYXQodmFsKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm1vZHVsdXNcIjpcbiAgICAgICAgICAgIGNvbnRhaW5lcltrZXldID0gXCJcIiArIChwYXJzZUZsb2F0KGx2YWwpICUgcGFyc2VGbG9hdCh2YWwpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgXCJhbmRcIjpcbiAgICAgICAgICAgIGNvbnRhaW5lcltrZXldID0gXCJcIiArIChwYXJzZUZsb2F0KGx2YWwpICYmIHBhcnNlRmxvYXQodmFsKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm9yXCI6XG4gICAgICAgICAgICBjb250YWluZXJba2V5XSA9IFwiXCIgKyAocGFyc2VGbG9hdChsdmFsKSB8fCBwYXJzZUZsb2F0KHZhbCkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJub3RcIjpcbiAgICAgICAgICAgIGNvbnRhaW5lcltrZXldID0gcGFyc2VGbG9hdChsdmFsKSA/IFwiMFwiIDogXCIxXCI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgXG4gICAgICAgIGNhc2UgXCJpc19ncmVhdGVyXCI6XG4gICAgICAgICAgICBjb250YWluZXJba2V5XSA9IHBhcnNlRmxvYXQobHZhbCkgPiBwYXJzZUZsb2F0KHZhbCkgPyBcIjFcIiA6IFwiMFwiO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJpc19sZXNzXCI6XG4gICAgICAgICAgICBjb250YWluZXJba2V5XSA9IHBhcnNlRmxvYXQobHZhbCkgPCBwYXJzZUZsb2F0KHZhbCkgPyBcIjFcIiA6IFwiMFwiO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJpc19lcXVhbFwiOlxuICAgICAgICAgICAgY29udGFpbmVyW2tleV0gPSBwYXJzZUZsb2F0KGx2YWwpID09PSBwYXJzZUZsb2F0KHZhbCkgPyBcIjFcIiA6IFwiMFwiO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJub3RfZ3JlYXRlclwiOlxuICAgICAgICAgICAgY29udGFpbmVyW2tleV0gPSBwYXJzZUZsb2F0KGx2YWwpIDw9IHBhcnNlRmxvYXQodmFsKSA/IFwiMVwiIDogXCIwXCI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm5vdF9sZXNzXCI6XG4gICAgICAgICAgICBjb250YWluZXJba2V5XSA9IHBhcnNlRmxvYXQobHZhbCkgPj0gcGFyc2VGbG9hdCh2YWwpID8gXCIxXCIgOiBcIjBcIjtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibm90X2VxdWFsXCI6XG4gICAgICAgICAgICBjb250YWluZXJba2V5XSA9IHBhcnNlRmxvYXQobHZhbCkgIT09IHBhcnNlRmxvYXQodmFsKSA/IFwiMVwiIDogXCIwXCI7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgXG4gICAgICAgIGNhc2UgXCJwcmludFwiOlxuICAgICAgICAgICAgbG9nKGludGVycHJldGVyLmJ1cywgXCJWYXJpYWJsZSAnXCIgKyBrZXkgKyBcIicgaXM6IFwiICsgY29udGFpbmVyW2tleV0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIFxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgd2FybihpbnRlcnByZXRlci5idXMsIFwiVW5rbm93biBhY3Rpb24gJ1wiICsgYWN0aW9uICtcbiAgICAgICAgICAgICAgICBcIicgZGVmaW5lZCBvbiAndmFyJyBjb21tYW5kLlwiLCBjb21tYW5kKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIG5leHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdmFyQ29tbWFuZDtcbiIsIlxuZnVuY3Rpb24gd2FpdCAoY29tbWFuZCwgaW50ZXJwcmV0ZXIpIHtcbiAgICBcbiAgICB2YXIgZHVyYXRpb24sIHNlbGY7XG4gICAgXG4gICAgaW50ZXJwcmV0ZXIuYnVzLnRyaWdnZXIoXG4gICAgICAgIFwid3NlLmludGVycHJldGVyLmNvbW1hbmRzLndhaXRcIixcbiAgICAgICAge1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXI6IGludGVycHJldGVyLFxuICAgICAgICAgICAgY29tbWFuZDogY29tbWFuZFxuICAgICAgICB9LCBcbiAgICAgICAgZmFsc2VcbiAgICApO1xuICAgIFxuICAgIHNlbGYgPSBpbnRlcnByZXRlcjtcbiAgICBkdXJhdGlvbiA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwiZHVyYXRpb25cIik7XG4gICAgXG4gICAgaWYgKGR1cmF0aW9uICE9PSBudWxsKSB7XG4gICAgICAgIFxuICAgICAgICBkdXJhdGlvbiA9IHBhcnNlSW50KGR1cmF0aW9uLCAxMCk7XG4gICAgICAgIGludGVycHJldGVyLndhaXRGb3JUaW1lciA9IHRydWU7XG4gICAgICAgIFxuICAgICAgICBzZXRUaW1lb3V0KFxuICAgICAgICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHNlbGYud2FpdEZvclRpbWVyID0gZmFsc2U7XG4gICAgICAgICAgICB9LCBcbiAgICAgICAgICAgIGR1cmF0aW9uXG4gICAgICAgICk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZG9OZXh0OiB0cnVlLFxuICAgICAgICAgICAgd2FpdDogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZG9OZXh0OiB0cnVlLFxuICAgICAgICB3YWl0OiB0cnVlXG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3YWl0O1xuIiwiXG5mdW5jdGlvbiB3aGlsZUNvbW1hbmQgKGNvbW1hbmQsIGludGVycHJldGVyKSB7XG4gICAgXG4gICAgaW50ZXJwcmV0ZXIuaW5kZXggLT0gMTtcbiAgICBpbnRlcnByZXRlci5jdXJyZW50RWxlbWVudCAtPSAxO1xuICAgIGludGVycHJldGVyLnB1c2hUb0NhbGxTdGFjaygpO1xuICAgIGludGVycHJldGVyLmN1cnJlbnRDb21tYW5kcyA9IGNvbW1hbmQuY2hpbGROb2RlcztcbiAgICBpbnRlcnByZXRlci5zY2VuZVBhdGgucHVzaChpbnRlcnByZXRlci5pbmRleCsxKTtcbiAgICBpbnRlcnByZXRlci5pbmRleCA9IC0xO1xuICAgIGludGVycHJldGVyLmN1cnJlbnRFbGVtZW50ID0gLTE7XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgZG9OZXh0OiB0cnVlXG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3aGlsZUNvbW1hbmQ7XG4iLCJcbnZhciB0b29scyA9IHJlcXVpcmUoXCIuLi90b29scy90b29sc1wiKTtcblxudmFyIHdhcm4gPSB0b29scy53YXJuO1xudmFyIGdldFBhcnNlZEF0dHJpYnV0ZSA9IHRvb2xzLmdldFBhcnNlZEF0dHJpYnV0ZTtcblxuZnVuY3Rpb24gd2l0aENvbW1hbmQgKGNvbW1hbmQsIGludGVycHJldGVyKSB7XG4gICAgXG4gICAgdmFyIGNvbnRhaW5lciA9IGludGVycHJldGVyLnJ1blZhcnM7XG4gICAgdmFyIGNoaWxkcmVuID0gY29tbWFuZC5jaGlsZE5vZGVzO1xuICAgIHZhciB2YXJpYWJsZU5hbWUgPSBnZXRQYXJzZWRBdHRyaWJ1dGUoY29tbWFuZCwgXCJ2YXJcIiwgaW50ZXJwcmV0ZXIpO1xuICAgIHZhciBpLCBudW1iZXJPZkNoaWxkcmVuID0gY2hpbGRyZW4ubGVuZ3RoLCBjdXJyZW50O1xuICAgIFxuICAgIGZvciAoaSA9IDA7IGkgPCBudW1iZXJPZkNoaWxkcmVuOyBpICs9IDEpIHtcbiAgICAgICAgXG4gICAgICAgIGN1cnJlbnQgPSBjaGlsZHJlbltpXTtcbiAgICAgICAgXG4gICAgICAgIGlmIChzaG91bGRCZVNraXBwZWQoY3VycmVudCwgaW50ZXJwcmV0ZXIpKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKGlzV2hlbihjdXJyZW50KSAmJiAhaGFzQ29uZGl0aW9uKGN1cnJlbnQpKSB7XG4gICAgICAgICAgICB3YXJuKGludGVycHJldGVyLmJ1cywgXCJFbGVtZW50ICd3aGVuJyB3aXRob3V0IGEgY29uZGl0aW9uLiBJZ25vcmVkLlwiLCBjb21tYW5kKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKGlzRWxzZShjdXJyZW50KSAmJiBoYXNDb25kaXRpb24oY3VycmVudCkpIHtcbiAgICAgICAgICAgIHdhcm4oaW50ZXJwcmV0ZXIuYnVzLCBcIkVsZW1lbnQgJ2Vsc2UnIHdpdGggYSBjb25kaXRpb24uIElnbm9yZWQuXCIsIGNvbW1hbmQpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoaXNFbHNlKGN1cnJlbnQpIHx8XG4gICAgICAgICAgICAgICAgaXNXaGVuKGN1cnJlbnQpICYmIGhhc0NvbmRpdGlvbihjdXJyZW50KSAmJlxuICAgICAgICAgICAgICAgIGdldFBhcnNlZEF0dHJpYnV0ZShjdXJyZW50LCBcImlzXCIpID09PSBjb250YWluZXJbdmFyaWFibGVOYW1lXSkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpbnRlcnByZXRlci5wdXNoVG9DYWxsU3RhY2soKTtcbiAgICAgICAgICAgIGludGVycHJldGVyLmN1cnJlbnRDb21tYW5kcyA9IGN1cnJlbnQuY2hpbGROb2RlcztcbiAgICAgICAgICAgIGludGVycHJldGVyLnNjZW5lUGF0aC5wdXNoKGludGVycHJldGVyLmluZGV4KTtcbiAgICAgICAgICAgIGludGVycHJldGVyLnNjZW5lUGF0aC5wdXNoKGkpO1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXIuaW5kZXggPSAtMTtcbiAgICAgICAgICAgIGludGVycHJldGVyLmN1cnJlbnRFbGVtZW50ID0gLTE7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIGRvTmV4dDogdHJ1ZVxuICAgIH07XG59XG5cbmZ1bmN0aW9uIHNob3VsZEJlU2tpcHBlZCAoZWxlbWVudCwgaW50ZXJwcmV0ZXIpIHtcbiAgICByZXR1cm4gIWVsZW1lbnQudGFnTmFtZSB8fCAhaW50ZXJwcmV0ZXIuY2hlY2tJZnZhcihlbGVtZW50KSB8fFxuICAgICAgICAoZWxlbWVudC50YWdOYW1lICE9PSBcIndoZW5cIiAmJiBlbGVtZW50LnRhZ05hbWUgIT09IFwiZWxzZVwiKTtcbn1cblxuZnVuY3Rpb24gaXNXaGVuIChlbGVtZW50KSB7XG4gICAgcmV0dXJuIHRhZ05hbWVJcyhlbGVtZW50LCBcIndoZW5cIik7XG59XG5cbmZ1bmN0aW9uIGlzRWxzZSAoZWxlbWVudCkge1xuICAgIHJldHVybiB0YWdOYW1lSXMoZWxlbWVudCwgXCJlbHNlXCIpO1xufVxuXG5mdW5jdGlvbiB0YWdOYW1lSXMgKGVsZW1lbnQsIG5hbWUpIHtcbiAgICByZXR1cm4gZWxlbWVudC50YWdOYW1lID09PSBuYW1lO1xufVxuXG5mdW5jdGlvbiBoYXNDb25kaXRpb24gKGVsZW1lbnQpIHtcbiAgICByZXR1cm4gZWxlbWVudC5oYXNBdHRyaWJ1dGUoXCJpc1wiKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB3aXRoQ29tbWFuZDtcbiIsIlxudmFyIExvY2FsU3RvcmFnZURhdGFTb3VyY2UgPSByZXF1aXJlKFwiLi9kYXRhU291cmNlcy9Mb2NhbFN0b3JhZ2VcIik7XG5cbnZhciBkYXRhU291cmNlcyA9IHtcbiAgICBMb2NhbFN0b3JhZ2U6IExvY2FsU3RvcmFnZURhdGFTb3VyY2Vcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZGF0YVNvdXJjZXM7XG4iLCJcbnZhciBEaWN0ID0gcmVxdWlyZShcInN0cmluZy1kaWN0XCIpO1xuXG52YXIgdGVzdEtleSA9IFwiX19fd3NlX3N0b3JhZ2VfdGVzdFwiO1xudmFyIGxvY2FsU3RvcmFnZUVuYWJsZWQgPSBmYWxzZTtcbnZhciBkYXRhO1xuXG50cnkge1xuICAgIFxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKHRlc3RLZXksIFwid29ya3NcIik7XG4gICAgXG4gICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRlc3RLZXkpID09PSBcIndvcmtzXCIpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlRW5hYmxlZCA9IHRydWU7XG4gICAgfVxufVxuY2F0Y2ggKGVycm9yKSB7XG4gICAgXG4gICAgY29uc29sZS5lcnJvcihcIkxvY2FsU3RvcmFnZSBub3QgYXZhaWxhYmxlLCB1c2luZyBKUyBvYmplY3QgYXMgZmFsbGJhY2suXCIpO1xuICAgIFxuICAgIGRhdGEgPSBuZXcgRGljdCgpO1xufVxuXG5mdW5jdGlvbiBMb2NhbFN0b3JhZ2VEYXRhU291cmNlICgpIHt9XG5cbkxvY2FsU3RvcmFnZURhdGFTb3VyY2UucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgXG4gICAgaWYgKCFsb2NhbFN0b3JhZ2VFbmFibGVkKSB7XG4gICAgICAgIGRhdGEuc2V0KGtleSwgdmFsdWUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XG4gICAgfVxufTtcblxuTG9jYWxTdG9yYWdlRGF0YVNvdXJjZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKGtleSkge1xuICAgIFxuICAgIGlmICghbG9jYWxTdG9yYWdlRW5hYmxlZCkge1xuICAgICAgICBcbiAgICAgICAgaWYgKCFkYXRhLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIGRhdGEuZ2V0KGtleSk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShrZXkpO1xufTtcblxuTG9jYWxTdG9yYWdlRGF0YVNvdXJjZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKGtleSkge1xuICAgIFxuICAgIGlmICghbG9jYWxTdG9yYWdlRW5hYmxlZCkge1xuICAgICAgICBcbiAgICAgICAgaWYgKCFkYXRhLmhhcyhrZXkpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBkYXRhLnJlbW92ZShrZXkpO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTG9jYWxTdG9yYWdlRGF0YVNvdXJjZTtcbiIsIlxudmFyIGJ1cyA9IHJlcXVpcmUoXCIuL2J1c1wiKTtcbnZhciBhc3NldHMgPSByZXF1aXJlKFwiLi9hc3NldHNcIik7XG52YXIgY29tbWFuZHMgPSByZXF1aXJlKFwiLi9jb21tYW5kc1wiKTtcbnZhciBmdW5jdGlvbnMgPSByZXF1aXJlKFwiLi9mdW5jdGlvbnNcIik7XG52YXIgZGF0YVNvdXJjZXMgPSByZXF1aXJlKFwiLi9kYXRhU291cmNlc1wiKTtcblxudmFyIEdhbWUgPSByZXF1aXJlKFwiLi9HYW1lXCIpO1xuXG52YXIgV1NFID0ge30sIHZlcnNpb24gPSBcIiUlJXZlcnNpb24lJSVcIjtcblxuV1NFLmluc3RhbmNlcyA9IFtdO1xuXG5XU0UuZGF0YVNvdXJjZXMgPSBkYXRhU291cmNlcztcbldTRS5hc3NldHMgPSBhc3NldHM7XG5XU0UuY29tbWFuZHMgPSBjb21tYW5kcztcbldTRS5mdW5jdGlvbnMgPSBmdW5jdGlvbnM7XG5cbmJ1cy5zdWJzY3JpYmUoXCJ3c2UuZ2FtZS5jb25zdHJ1Y3RvclwiLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgIFdTRS5pbnN0YW5jZXMucHVzaChkYXRhLmdhbWUpO1xufSk7XG5cbldTRS5nZXRWZXJzaW9uID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB2ZXJzaW9uO1xufTtcblxuV1NFLmJ1cyA9IGJ1cztcbldTRS5HYW1lID0gR2FtZTtcblxubW9kdWxlLmV4cG9ydHMgPSBXU0U7XG4iLCJcbnZhciBmdW5jdGlvbnMgPSB7XG4gICAgXG4gICAgc2F2ZWdhbWVzOiBmdW5jdGlvbiAoaW50ZXJwcmV0ZXIpIHtcbiAgICAgICAgaW50ZXJwcmV0ZXIudG9nZ2xlU2F2ZWdhbWVNZW51KCk7XG4gICAgfSxcbiAgICBcbiAgICBzdGFnZWNsaWNrX2Rpc2FibGU6IGZ1bmN0aW9uIChpbnRlcnByZXRlcikge1xuICAgICAgICBpbnRlcnByZXRlci5nYW1lLnVuc3Vic2NyaWJlTGlzdGVuZXJzKCk7XG4gICAgfSxcbiAgICBcbiAgICBzdGFnZWNsaWNrX2VuYWJsZTogZnVuY3Rpb24gKGludGVycHJldGVyKSB7XG4gICAgICAgIGludGVycHJldGVyLmdhbWUuc3Vic2NyaWJlTGlzdGVuZXJzKCk7XG4gICAgfVxuICAgIFxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbnM7XG4iLCJcbnZhciBhamF4ID0gcmVxdWlyZShcImVhc3ktYWpheFwiKTtcbnZhciBjb21waWxlID0gcmVxdWlyZShcIi4vdG9vbHMvY29tcGlsZVwiKS5jb21waWxlO1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUdhbWVGaWxlIChtYWluRmlsZVBhdGgsIHRoZW4pIHtcbiAgICBjb21waWxlRmlsZShtYWluRmlsZVBhdGgsIGZ1bmN0aW9uIChtYWluRmlsZSkge1xuICAgICAgICBnZW5lcmF0ZUdhbWVGaWxlRnJvbVN0cmluZyhtYWluRmlsZSwgdGhlbik7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlR2FtZUZpbGVGcm9tU3RyaW5nICh0ZXh0LCB0aGVuKSB7XG4gICAgXG4gICAgdmFyIGdhbWVEb2N1bWVudCA9IHBhcnNlWG1sKHRleHQpO1xuICAgIHZhciBmaWxlRGVmaW5pdGlvbnMgPSBnZXRGaWxlRGVmaW5pdGlvbnMoZ2FtZURvY3VtZW50KTtcbiAgICBcbiAgICBjb21waWxlRmlsZXMoZmlsZURlZmluaXRpb25zLCBmdW5jdGlvbiAoZmlsZXMpIHtcbiAgICAgICAgZmlsZXMuZm9yRWFjaChmdW5jdGlvbiAoZmlsZSwgaSkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgdHlwZSA9IGZpbGVEZWZpbml0aW9uc1tpXS50eXBlO1xuICAgICAgICAgICAgdmFyIHBhcmVudCA9IGdhbWVEb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSh0eXBlKVswXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFwYXJlbnQpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnQgPSBnYW1lRG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0eXBlKTtcbiAgICAgICAgICAgICAgICBnYW1lRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmFwcGVuZENoaWxkKHBhcmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHBhcmVudC5pbm5lckhUTUwgKz0gXCJcXG5cIiArIGZpbGUgKyBcIlxcblwiO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIHRoZW4oZ2FtZURvY3VtZW50KTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZ2VuZXJhdGVGcm9tU3RyaW5nICh0ZXh0LCB0aGVuKSB7XG4gICAgZ2VuZXJhdGVHYW1lRmlsZUZyb21TdHJpbmcoY29tcGlsZSh0ZXh0KSwgdGhlbik7XG59XG5cbmZ1bmN0aW9uIGNvbXBpbGVGaWxlcyAoZmlsZURlZmluaXRpb25zLCB0aGVuKSB7XG4gICAgXG4gICAgdmFyIGxvYWRlZCA9IDA7XG4gICAgdmFyIGNvdW50ID0gZmlsZURlZmluaXRpb25zLmxlbmd0aDtcbiAgICB2YXIgZmlsZXMgPSBbXTtcbiAgICBcbiAgICBmaWxlRGVmaW5pdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAoZGVmaW5pdGlvbiwgaSkge1xuICAgICAgICBcbiAgICAgICAgY29tcGlsZUZpbGUoZGVmaW5pdGlvbi51cmwsIGZ1bmN0aW9uIChmaWxlKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZpbGVzW2ldID0gZmlsZTtcbiAgICAgICAgICAgIGxvYWRlZCArPSAxO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAobG9hZGVkID49IGNvdW50KSB7XG4gICAgICAgICAgICAgICAgdGhlbihmaWxlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIFxuICAgIGlmIChjb3VudCA8IDEpIHtcbiAgICAgICAgdGhlbihmaWxlcyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjb21waWxlRmlsZSAocGF0aCwgdGhlbikge1xuICAgIGFqYXguZ2V0KHBhdGggKyBcIj9yYW5kb209XCIgKyBNYXRoLnJhbmRvbSgpLCBmdW5jdGlvbiAoZXJyb3IsIG9iaikge1xuICAgICAgICBcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGhlbihjb21waWxlKG9iai5yZXNwb25zZVRleHQpKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gcGFyc2VYbWwgKHRleHQpIHtcbiAgICByZXR1cm4gbmV3IERPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyh0ZXh0LCBcImFwcGxpY2F0aW9uL3htbFwiKTtcbn1cblxuZnVuY3Rpb24gZ2V0RmlsZURlZmluaXRpb25zICh4bWwpIHtcbiAgICBcbiAgICB2YXIgZWxlbWVudHMgPSB4bWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJmaWxlXCIpO1xuICAgIFxuICAgIHJldHVybiBbXS5tYXAuY2FsbChlbGVtZW50cywgZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHR5cGU6IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwidHlwZVwiKSxcbiAgICAgICAgICAgIHVybDogZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJ1cmxcIilcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgZ2VuZXJhdGVHYW1lRmlsZTogZ2VuZXJhdGVHYW1lRmlsZSxcbiAgICBnZW5lcmF0ZUZyb21TdHJpbmc6IGdlbmVyYXRlRnJvbVN0cmluZ1xufTtcbiIsIlxudmFyIGVhY2ggPSByZXF1aXJlKFwiZW5qb3ktY29yZS9lYWNoXCIpO1xudmFyIHR5cGVjaGVja3MgPSByZXF1aXJlKFwiZW5qb3ktdHlwZWNoZWNrc1wiKTtcblxudmFyIGVuZ2luZSA9IHJlcXVpcmUoXCIuL2VuZ2luZVwiKTtcbnZhciB0b29scyA9IHJlcXVpcmUoXCIuL3Rvb2xzL3Rvb2xzXCIpO1xuXG52YXIgaXNOdWxsID0gdHlwZWNoZWNrcy5pc051bGw7XG52YXIgaXNVbmRlZmluZWQgPSB0eXBlY2hlY2tzLmlzVW5kZWZpbmVkO1xuXG52YXIgd2FybiA9IHRvb2xzLndhcm47XG52YXIgdHJ1dGh5ID0gdG9vbHMudHJ1dGh5O1xuXG5mdW5jdGlvbiBsb2FkIChpbnRlcnByZXRlciwgbmFtZSkge1xuICAgIFxuICAgIHZhciBkcywgc2F2ZWdhbWUsIHNjZW5lLCBzY2VuZUlkLCBzY2VuZVBhdGgsIHNjZW5lcztcbiAgICB2YXIgc2F2ZWdhbWVJZCwgYnVzID0gaW50ZXJwcmV0ZXIuYnVzO1xuICAgIFxuICAgIHNhdmVnYW1lSWQgPSBidWlsZFNhdmVnYW1lSWQoaW50ZXJwcmV0ZXIsIG5hbWUpO1xuICAgIGRzID0gaW50ZXJwcmV0ZXIuZGF0YXNvdXJjZTtcbiAgICBzYXZlZ2FtZSA9IGRzLmdldChzYXZlZ2FtZUlkKTtcbiAgICBcbiAgICBidXMudHJpZ2dlcihcbiAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIubG9hZC5iZWZvcmVcIixcbiAgICAgICAge1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXI6IGludGVycHJldGVyLFxuICAgICAgICAgICAgc2F2ZWdhbWU6IHNhdmVnYW1lXG4gICAgICAgIH0sIFxuICAgICAgICBmYWxzZVxuICAgICk7XG4gICAgXG4gICAgaWYgKCFzYXZlZ2FtZSkge1xuICAgICAgICB3YXJuKGJ1cywgXCJDb3VsZCBub3QgbG9hZCBzYXZlZ2FtZSAnXCIgKyBzYXZlZ2FtZUlkICsgXCInIVwiKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBcbiAgICBzYXZlZ2FtZSA9IEpTT04ucGFyc2Uoc2F2ZWdhbWUpO1xuICAgIGludGVycHJldGVyLnN0YWdlLmlubmVySFRNTCA9IHNhdmVnYW1lLnNjcmVlbkNvbnRlbnRzO1xuICAgIFxuICAgIHJlc3RvcmVTYXZlZ2FtZShpbnRlcnByZXRlciwgc2F2ZWdhbWUuc2F2ZXMpO1xuICAgIFxuICAgIGludGVycHJldGVyLnN0YXJ0VGltZSA9IHNhdmVnYW1lLnN0YXJ0VGltZTtcbiAgICBpbnRlcnByZXRlci5ydW5WYXJzID0gc2F2ZWdhbWUucnVuVmFycztcbiAgICBpbnRlcnByZXRlci5sb2cgPSBzYXZlZ2FtZS5sb2c7XG4gICAgaW50ZXJwcmV0ZXIudmlzaXRlZFNjZW5lcyA9IHNhdmVnYW1lLnZpc2l0ZWRTY2VuZXM7XG4gICAgaW50ZXJwcmV0ZXIuaW5kZXggPSBzYXZlZ2FtZS5pbmRleDtcbiAgICBpbnRlcnByZXRlci53YWl0ID0gc2F2ZWdhbWUud2FpdDtcbiAgICBpbnRlcnByZXRlci53YWl0Rm9yVGltZXIgPSBzYXZlZ2FtZS53YWl0Rm9yVGltZXI7XG4gICAgaW50ZXJwcmV0ZXIuY3VycmVudEVsZW1lbnQgPSBzYXZlZ2FtZS5jdXJyZW50RWxlbWVudDtcbiAgICBpbnRlcnByZXRlci5jYWxsU3RhY2sgPSBzYXZlZ2FtZS5jYWxsU3RhY2s7XG4gICAgaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgPSBzYXZlZ2FtZS53YWl0Q291bnRlcjtcbiAgICBpbnRlcnByZXRlci5zdGF0ZSA9IFwibGlzdGVuXCI7XG4gICAgXG4gICAgc2NlbmVJZCA9IHNhdmVnYW1lLnNjZW5lSWQ7XG4gICAgaW50ZXJwcmV0ZXIuc2NlbmVJZCA9IHNjZW5lSWQ7XG4gICAgXG4gICAgc2NlbmVzID0gaW50ZXJwcmV0ZXIuc3RvcnkuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY2VuZVwiKTtcbiAgICBpbnRlcnByZXRlci5zY2VuZXMgPSBzY2VuZXM7XG4gICAgXG4gICAgc2NlbmUgPSBmaW5kKGZ1bmN0aW9uIChzY2VuZSkge1xuICAgICAgICByZXR1cm4gc2NlbmUuZ2V0QXR0cmlidXRlKFwiaWRcIikgPT09IHNjZW5lSWQ7XG4gICAgfSwgaW50ZXJwcmV0ZXIuc2NlbmVzKTtcbiAgICBcbiAgICBpZiAoIXNjZW5lKSB7XG4gICAgICAgIFxuICAgICAgICBidXMudHJpZ2dlcihcbiAgICAgICAgICAgIFwid3NlLmludGVycHJldGVyLmVycm9yXCIsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJMb2FkaW5nIHNhdmVnYW1lICdcIiArIHNhdmVnYW1lSWQgKyBcIicgZmFpbGVkOiBTY2VuZSBub3QgZm91bmQhXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgc2NlbmVQYXRoID0gc2F2ZWdhbWUuc2NlbmVQYXRoO1xuICAgIGludGVycHJldGVyLnNjZW5lUGF0aCA9IHNjZW5lUGF0aC5zbGljZSgpO1xuICAgIFxuICAgIGludGVycHJldGVyLmN1cnJlbnRDb21tYW5kcyA9IHNjZW5lLmNoaWxkTm9kZXM7XG4gICAgXG4gICAgd2hpbGUgKHNjZW5lUGF0aC5sZW5ndGggPiAwKSB7XG4gICAgICAgIGludGVycHJldGVyLmN1cnJlbnRDb21tYW5kcyA9IGludGVycHJldGVyLmN1cnJlbnRDb21tYW5kc1tzY2VuZVBhdGguc2hpZnQoKV0uY2hpbGROb2RlcztcbiAgICB9XG4gICAgXG4gICAgLy8gUmUtaW5zZXJ0IGNob2ljZSBtZW51IHRvIGdldCBiYWNrIHRoZSBET00gZXZlbnRzIGFzc29jaWF0ZWQgd2l0aCBpdDpcbiAgICAvLyBSZW1vdmUgc2F2ZWdhbWUgbWVudSBvbiBsb2FkOlxuICAgIChmdW5jdGlvbiAoaW50ZXJwcmV0ZXIpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBpbmRleCwgd3NlVHlwZSwgY29tLCByZW07XG4gICAgICAgIFxuICAgICAgICBlYWNoKGZ1bmN0aW9uIChjdXIpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGlzVW5kZWZpbmVkKGN1cikgfHwgaXNOdWxsKGN1cikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHdzZVR5cGUgPSBjdXIuZ2V0QXR0cmlidXRlKFwiZGF0YS13c2UtdHlwZVwiKSB8fCBcIlwiO1xuICAgICAgICAgICAgcmVtID0gdHJ1dGh5KGN1ci5nZXRBdHRyaWJ1dGUoXCJkYXRhLXdzZS1yZW1vdmVcIikpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAocmVtID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXIuc3RhZ2UucmVtb3ZlQ2hpbGQoY3VyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHdzZVR5cGUgIT09IFwiY2hvaWNlXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGluZGV4ID0gcGFyc2VJbnQoY3VyLmdldEF0dHJpYnV0ZShcImRhdGEtd3NlLWluZGV4XCIpLCAxMCkgfHwgbnVsbDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGluZGV4ID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgd2FybihpbnRlcnByZXRlci5idXMsIFwiTm8gZGF0YS13c2UtaW5kZXggZm91bmQgb24gZWxlbWVudC5cIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb20gPSBpbnRlcnByZXRlci5jdXJyZW50Q29tbWFuZHNbaW5kZXhdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoY29tLm5vZGVOYW1lID09PSBcIiN0ZXh0XCIgfHwgY29tLm5vZGVOYW1lID09PSBcIiNjb21tZW50XCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGludGVycHJldGVyLnN0YWdlLnJlbW92ZUNoaWxkKGN1cik7XG4gICAgICAgICAgICBlbmdpbmUuY29tbWFuZHMuY2hvaWNlKGNvbSwgaW50ZXJwcmV0ZXIpO1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgLT0gMTtcbiAgICAgICAgICAgIFxuICAgICAgICB9LCBpbnRlcnByZXRlci5zdGFnZS5nZXRFbGVtZW50c0J5VGFnTmFtZShcIipcIikpO1xuICAgICAgICBcbiAgICB9KGludGVycHJldGVyKSk7XG4gICAgXG4gICAgYnVzLnRyaWdnZXIoXG4gICAgICAgIFwid3NlLmludGVycHJldGVyLmxvYWQuYWZ0ZXJcIixcbiAgICAgICAge1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXI6IGludGVycHJldGVyLFxuICAgICAgICAgICAgc2F2ZWdhbWU6IHNhdmVnYW1lXG4gICAgICAgIH0sIFxuICAgICAgICBmYWxzZVxuICAgICk7XG4gICAgXG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIHNhdmUgKGludGVycHJldGVyLCBuYW1lKSB7XG4gICAgXG4gICAgbmFtZSA9IG5hbWUgfHwgXCJubyBuYW1lXCI7XG4gICAgXG4gICAgdmFyIHNhdmVnYW1lLCBqc29uLCBrZXksIHNhdmVnYW1lTGlzdCwgbGlzdEtleSwgbGFzdEtleSwgYnVzID0gaW50ZXJwcmV0ZXIuYnVzO1xuICAgIFxuICAgIHNhdmVnYW1lID0ge307XG4gICAgXG4gICAgYnVzLnRyaWdnZXIoXG4gICAgICAgIFwid3NlLmludGVycHJldGVyLnNhdmUuYmVmb3JlXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGludGVycHJldGVyOiBpbnRlcnByZXRlcixcbiAgICAgICAgICAgIHNhdmVnYW1lOiBzYXZlZ2FtZVxuICAgICAgICB9LCBcbiAgICAgICAgZmFsc2VcbiAgICApO1xuICAgIFxuICAgIHNhdmVnYW1lLnNhdmVzID0gY3JlYXRlU2F2ZWdhbWUoaW50ZXJwcmV0ZXIpO1xuICAgIHNhdmVnYW1lLnN0YXJ0VGltZSA9IGludGVycHJldGVyLnN0YXJ0VGltZTtcbiAgICBzYXZlZ2FtZS5zYXZlVGltZSA9IE1hdGgucm91bmQoRGF0ZS5ub3coKSAvIDEwMDApO1xuICAgIHNhdmVnYW1lLnNjcmVlbkNvbnRlbnRzID0gaW50ZXJwcmV0ZXIuc3RhZ2UuaW5uZXJIVE1MO1xuICAgIHNhdmVnYW1lLnJ1blZhcnMgPSBpbnRlcnByZXRlci5ydW5WYXJzO1xuICAgIHNhdmVnYW1lLm5hbWUgPSBuYW1lO1xuICAgIHNhdmVnYW1lLmxvZyA9IGludGVycHJldGVyLmxvZztcbiAgICBzYXZlZ2FtZS52aXNpdGVkU2NlbmVzID0gaW50ZXJwcmV0ZXIudmlzaXRlZFNjZW5lcztcbiAgICBzYXZlZ2FtZS5nYW1lVXJsID0gaW50ZXJwcmV0ZXIuZ2FtZS51cmw7XG4gICAgc2F2ZWdhbWUuaW5kZXggPSBpbnRlcnByZXRlci5pbmRleDtcbiAgICBzYXZlZ2FtZS53YWl0ID0gaW50ZXJwcmV0ZXIud2FpdDtcbiAgICBzYXZlZ2FtZS53YWl0Rm9yVGltZXIgPSBpbnRlcnByZXRlci53YWl0Rm9yVGltZXI7XG4gICAgc2F2ZWdhbWUuY3VycmVudEVsZW1lbnQgPSBpbnRlcnByZXRlci5jdXJyZW50RWxlbWVudDtcbiAgICBzYXZlZ2FtZS5zY2VuZUlkID0gaW50ZXJwcmV0ZXIuc2NlbmVJZDtcbiAgICBzYXZlZ2FtZS5zY2VuZVBhdGggPSBpbnRlcnByZXRlci5zY2VuZVBhdGg7XG4gICAgc2F2ZWdhbWUubGlzdGVuZXJzU3Vic2NyaWJlZCA9IGludGVycHJldGVyLmdhbWUubGlzdGVuZXJzU3Vic2NyaWJlZDtcbiAgICBzYXZlZ2FtZS5jYWxsU3RhY2sgPSBpbnRlcnByZXRlci5jYWxsU3RhY2s7XG4gICAgc2F2ZWdhbWUud2FpdENvdW50ZXIgPSBpbnRlcnByZXRlci53YWl0Q291bnRlcjtcbiAgICBzYXZlZ2FtZS5wYXRobmFtZSA9IGxvY2F0aW9uLnBhdGhuYW1lO1xuICAgIFxuICAgIGtleSA9IGJ1aWxkU2F2ZWdhbWVJZChpbnRlcnByZXRlciwgbmFtZSk7XG4gICAgXG4gICAganNvbiA9IEpTT04uc3RyaW5naWZ5KHNhdmVnYW1lKTtcbiAgICBcbiAgICBsaXN0S2V5ID0gXCJ3c2VfXCIgKyBzYXZlZ2FtZS5wYXRobmFtZSArIFwiX1wiICsgc2F2ZWdhbWUuZ2FtZVVybCArIFwiX3NhdmVnYW1lc19saXN0XCI7XG4gICAgXG4gICAgc2F2ZWdhbWVMaXN0ID0gSlNPTi5wYXJzZShpbnRlcnByZXRlci5kYXRhc291cmNlLmdldChsaXN0S2V5KSk7XG4gICAgc2F2ZWdhbWVMaXN0ID0gc2F2ZWdhbWVMaXN0IHx8IFtdO1xuICAgIGxhc3RLZXkgPSBzYXZlZ2FtZUxpc3QuaW5kZXhPZihrZXkpO1xuICAgIFxuICAgIGlmIChsYXN0S2V5ID49IDApIHtcbiAgICAgICAgc2F2ZWdhbWVMaXN0LnNwbGljZShsYXN0S2V5LCAxKTtcbiAgICB9XG4gICAgXG4gICAgc2F2ZWdhbWVMaXN0LnB1c2goa2V5KTtcbiAgICBcbiAgICB0cnkge1xuICAgICAgICBpbnRlcnByZXRlci5kYXRhc291cmNlLnNldChrZXksIGpzb24pO1xuICAgICAgICBpbnRlcnByZXRlci5kYXRhc291cmNlLnNldChsaXN0S2V5LCBKU09OLnN0cmluZ2lmeShzYXZlZ2FtZUxpc3QpKTtcbiAgICB9XG4gICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgXG4gICAgICAgIHdhcm4oYnVzLCBcIlNhdmVnYW1lIGNvdWxkIG5vdCBiZSBjcmVhdGVkIVwiKTtcbiAgICAgICAgXG4gICAgICAgIGJ1cy50cmlnZ2VyKFxuICAgICAgICAgICAgXCJ3c2UuaW50ZXJwcmV0ZXIuc2F2ZS5hZnRlci5lcnJvclwiLFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGludGVycHJldGVyOiBpbnRlcnByZXRlcixcbiAgICAgICAgICAgICAgICBzYXZlZ2FtZTogc2F2ZWdhbWVcbiAgICAgICAgICAgIH0sIFxuICAgICAgICAgICAgZmFsc2VcbiAgICAgICAgKTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgYnVzLnRyaWdnZXIoXG4gICAgICAgIFwid3NlLmludGVycHJldGVyLnNhdmUuYWZ0ZXIuc3VjY2Vzc1wiLFxuICAgICAgICB7XG4gICAgICAgICAgICBpbnRlcnByZXRlcjogaW50ZXJwcmV0ZXIsXG4gICAgICAgICAgICBzYXZlZ2FtZTogc2F2ZWdhbWVcbiAgICAgICAgfVxuICAgICk7XG4gICAgXG4gICAgcmV0dXJuIHRydWU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNhdmVnYW1lIChpbnRlcnByZXRlcikge1xuICAgIFxuICAgIHZhciBzYXZlcyA9IHt9O1xuICAgIFxuICAgIGVhY2goZnVuY3Rpb24gKGFzc2V0LCBrZXkpIHtcbiAgICAgICAgXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzYXZlc1trZXldID0gYXNzZXQuc2F2ZSgpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiV1NFIEludGVybmFsIEVycm9yOiBBc3NldCAnXCIgKyBrZXkgKyBcbiAgICAgICAgICAgICAgICBcIicgZG9lcyBub3QgaGF2ZSBhICdzYXZlJyBtZXRob2QhXCIpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH0sIGludGVycHJldGVyLmFzc2V0cyk7XG4gICAgXG4gICAgcmV0dXJuIHNhdmVzO1xufVxuXG5mdW5jdGlvbiByZXN0b3JlU2F2ZWdhbWUgKGludGVycHJldGVyLCBzYXZlcykge1xuICAgIFxuICAgIGVhY2goZnVuY3Rpb24gKGFzc2V0LCBrZXkpIHtcbiAgICAgICAgXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBhc3NldC5yZXN0b3JlKHNhdmVzW2tleV0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgd2FybihpbnRlcnByZXRlci5idXMsIFwiQ291bGQgbm90IHJlc3RvcmUgYXNzZXQgc3RhdGUgZm9yIGFzc2V0ICdcIiArIGtleSArIFwiJyFcIik7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfSwgaW50ZXJwcmV0ZXIuYXNzZXRzKTtcbiAgICBcbn1cblxuZnVuY3Rpb24gYnVpbGRTYXZlZ2FtZUlkIChpbnRlcnByZXRlciwgbmFtZSkge1xuICAgIFxuICAgIHZhciB2YXJzID0ge307XG4gICAgXG4gICAgdmFycy5uYW1lID0gbmFtZTtcbiAgICB2YXJzLmlkID0gXCJ3c2VfXCIgKyBsb2NhdGlvbi5wYXRobmFtZSArIFwiX1wiICsgaW50ZXJwcmV0ZXIuZ2FtZS51cmwgKyBcIl9zYXZlZ2FtZV9cIiArIG5hbWU7XG4gICAgXG4gICAgaW50ZXJwcmV0ZXIuYnVzLnRyaWdnZXIoXG4gICAgICAgIFwid3NlLmludGVycHJldGVyLnNhdmUuYmVmb3JlXCIsXG4gICAgICAgIHtcbiAgICAgICAgICAgIGludGVycHJldGVyOiBpbnRlcnByZXRlcixcbiAgICAgICAgICAgIHZhcnM6IHZhcnNcbiAgICAgICAgfSwgXG4gICAgICAgIGZhbHNlXG4gICAgKTtcbiAgICBcbiAgICByZXR1cm4gdmFycy5pZDtcbn1cblxuZnVuY3Rpb24gZ2V0U2F2ZWdhbWVMaXN0IChpbnRlcnByZXRlciwgcmV2ZXJzZWQpIHtcbiAgICBcbiAgICB2YXIgbmFtZXM7XG4gICAgdmFyIG91dCA9IFtdO1xuICAgIHZhciBrZXkgPSBcIndzZV9cIiArIGxvY2F0aW9uLnBhdGhuYW1lICsgXCJfXCIgKyBpbnRlcnByZXRlci5nYW1lLnVybCArIFwiX3NhdmVnYW1lc19saXN0XCI7XG4gICAgdmFyIGpzb24gPSBpbnRlcnByZXRlci5kYXRhc291cmNlLmdldChrZXkpO1xuICAgIFxuICAgIGlmIChqc29uID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuICAgIFxuICAgIG5hbWVzID0gSlNPTi5wYXJzZShqc29uKTtcbiAgICBvdXQgPSBbXTtcbiAgICBcbiAgICBlYWNoKGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAocmV2ZXJzZWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIG91dC51bnNoaWZ0KEpTT04ucGFyc2UoaW50ZXJwcmV0ZXIuZGF0YXNvdXJjZS5nZXQobmFtZSkpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG91dC5wdXNoKEpTT04ucGFyc2UoaW50ZXJwcmV0ZXIuZGF0YXNvdXJjZS5nZXQobmFtZSkpKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9LCBuYW1lcyk7XG4gICAgXG4gICAgaW50ZXJwcmV0ZXIuYnVzLnRyaWdnZXIoXG4gICAgICAgIFwid3NlLmludGVycHJldGVyLmdldHNhdmVnYW1lbGlzdFwiLFxuICAgICAgICB7XG4gICAgICAgICAgICBpbnRlcnByZXRlcjogaW50ZXJwcmV0ZXIsXG4gICAgICAgICAgICBsaXN0OiBvdXQsXG4gICAgICAgICAgICBuYW1lczogbmFtZXNcbiAgICAgICAgfSwgXG4gICAgICAgIGZhbHNlXG4gICAgKTtcbiAgICBcbiAgICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiByZW1vdmUgKGludGVycHJldGVyLCBuYW1lKSB7XG4gICAgXG4gICAgdmFyIHNncywga2V5LCBpbmRleCwganNvbiwgaWQ7XG4gICAgXG4gICAga2V5ID0gXCJ3c2VfXCIgKyBsb2NhdGlvbi5wYXRobmFtZSArIFwiX1wiICsgaW50ZXJwcmV0ZXIuZ2FtZS51cmwgKyBcIl9zYXZlZ2FtZXNfbGlzdFwiO1xuICAgIGpzb24gPSBpbnRlcnByZXRlci5kYXRhc291cmNlLmdldChrZXkpO1xuICAgIFxuICAgIGlmIChqc29uID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgXG4gICAgc2dzID0gSlNPTi5wYXJzZShqc29uKTtcbiAgICBpZCA9IGJ1aWxkU2F2ZWdhbWVJZChpbnRlcnByZXRlciwgbmFtZSk7XG4gICAgaW5kZXggPSBzZ3MuaW5kZXhPZihpZCk7XG4gICAgXG4gICAgaWYgKGluZGV4ID49IDApIHtcbiAgICAgICAgXG4gICAgICAgIHNncy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICBcbiAgICAgICAgaW50ZXJwcmV0ZXIuZGF0YXNvdXJjZS5zZXQoXG4gICAgICAgICAgICBcIndzZV9cIiArIGxvY2F0aW9uLnBhdGhuYW1lICsgXCJfXCIgKyBpbnRlcnByZXRlci5nYW1lLnVybCArIFwiX3NhdmVnYW1lc19saXN0XCIsXG4gICAgICAgICAgICBKU09OLnN0cmluZ2lmeShzZ3MpXG4gICAgICAgICk7XG4gICAgICAgIFxuICAgICAgICBpbnRlcnByZXRlci5kYXRhc291cmNlLnJlbW92ZShpZCk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBzYXZlOiBzYXZlLFxuICAgIGxvYWQ6IGxvYWQsXG4gICAgcmVtb3ZlOiByZW1vdmUsXG4gICAgZ2V0U2F2ZWdhbWVMaXN0OiBnZXRTYXZlZ2FtZUxpc3Rcbn07XG4iLCIvL1xuLy8gQSBtb2R1bGUgY29udGFpbmluZyBmdW5jdGlvbnMgZm9yIGNvbXBpbGluZyBhIHNpbXBsZSBjb21tYW5kIGxhbmd1YWdlIHRvIHRoZSBvbGRcbi8vIFdTRSBjb21tYW5kIGVsZW1lbnRzLlxuLy9cblxudmFyIHhtdWdseSA9IHJlcXVpcmUoXCJ4bXVnbHlcIik7XG5cbi8vXG4vLyBDb21waWxlcyB0aGUgbmV3IFdTRSBjb21tYW5kIGxhbmd1YWdlIHRvIFhNTCBlbGVtZW50cy5cbi8vXG5mdW5jdGlvbiAgY29tcGlsZSAodGV4dCkge1xuICAgIFxuICAgIHRleHQgPSB4bXVnbHkuY29tcGlsZSh0ZXh0LCBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlkZW50aWZpZXI6IFwiQFwiLFxuICAgICAgICAgICAgYXR0cmlidXRlOiBcImFzc2V0XCIsXG4gICAgICAgICAgICB2YWx1ZTogXCJfXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgaWRlbnRpZmllcjogXCI6XCIsXG4gICAgICAgICAgICBhdHRyaWJ1dGU6IFwiZHVyYXRpb25cIixcbiAgICAgICAgICAgIHZhbHVlOiBcIl9cIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBpZGVudGlmaWVyOiBcIitcIixcbiAgICAgICAgICAgIGF0dHJpYnV0ZTogXCJfXCIsXG4gICAgICAgICAgICB2YWx1ZTogXCJ5ZXNcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgICBpZGVudGlmaWVyOiBcIi1cIixcbiAgICAgICAgICAgIGF0dHJpYnV0ZTogXCJfXCIsXG4gICAgICAgICAgICB2YWx1ZTogXCJub1wiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICAgIGlkZW50aWZpZXI6IFwiI1wiLFxuICAgICAgICAgICAgYXR0cmlidXRlOiBcImlkXCIsXG4gICAgICAgICAgICB2YWx1ZTogXCJfXCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgICAgaWRlbnRpZmllcjogXCJ+XCIsXG4gICAgICAgICAgICBhdHRyaWJ1dGU6IFwibmFtZVwiLFxuICAgICAgICAgICAgdmFsdWU6IFwiX1wiXG4gICAgICAgIH1cbiAgICBdKTtcbiAgICBcbiAgICB0ZXh0ID0gY29tcGlsZVNwZWVjaCh0ZXh0KTtcbiAgICBcbiAgICByZXR1cm4gdGV4dDtcbn1cblxuXG4vL1xuLy8gQ29tcGlsZXMgXCIoKCBjOiBJIHNheSBzb21ldGhpbmcgKSlcIiB0byA8bGluZSBzPVwiY1wiPkkgc2F5IHNvbWV0aGluZzwvbGluZT4nJy5cbi8vXG5mdW5jdGlvbiBjb21waWxlU3BlZWNoICh0ZXh0KSB7XG4gICAgcmV0dXJuIHRleHQucmVwbGFjZShcbiAgICAgICAgLyhbXFxzXSopXFwoXFwoW1xcc10qKFthLXpBLVowLTlfLV0rKTpbXFxzXSooKC58W1xcc10pKj8pKFtcXHNdKilcXClcXCkvZyxcbiAgICAgICAgJyQxPGxpbmUgcz1cIiQyXCI+JDM8L2xpbmU+JDUnXG4gICAgKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgY29tcGlsZTogY29tcGlsZVxufTtcbiIsIlxudmFyIHRyYW5zZm9ybSA9IHJlcXVpcmUoXCJ0cmFuc2Zvcm0tanNcIikudHJhbnNmb3JtO1xuXG5mdW5jdGlvbiByZXZlYWwgKGVsZW1lbnQsIGFyZ3MpIHtcbiAgICBcbiAgICBhcmdzID0gYXJncyB8fCB7fTtcbiAgICBcbiAgICBtYXJrQ2hhcmFjdGVycyhlbGVtZW50KTtcbiAgICBoaWRlQ2hhcmFjdGVycyhlbGVtZW50KTtcbiAgICByZXR1cm4gcmV2ZWFsQ2hhcmFjdGVycyhlbGVtZW50LCBhcmdzLnNwZWVkIHx8IDUwLCBhcmdzLm9uRmluaXNoIHx8IG51bGwpO1xufVxuXG5mdW5jdGlvbiByZXZlYWxDaGFyYWN0ZXJzIChlbGVtZW50LCBzcGVlZCwgdGhlbikge1xuICAgIFxuICAgIHZhciBjaGFycyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5DaGFyXCIpO1xuICAgIHZhciBvZmZzZXQgPSAxMDAwIC8gKHNwZWVkIHx8IDQwKTtcbiAgICB2YXIgc3RvcCA9IGZhbHNlO1xuICAgIHZhciB0aW1lb3V0cyA9IFtdO1xuICAgIHZhciBsZWZ0ID0gY2hhcnMubGVuZ3RoO1xuICAgIFxuICAgIHRoZW4gPSB0aGVuIHx8IGZ1bmN0aW9uICgpIHt9O1xuICAgIFxuICAgIFtdLmZvckVhY2guY2FsbChjaGFycywgZnVuY3Rpb24gKGNoYXIsIGkpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBpZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBXb3JrYXJvdW5kIGZvciBzdHJhbmdlIG1vdmUuanMgYmVoYXZpb3VyOlxuICAgICAgICAgICAgLy8gU29tZXRpbWVzIHRoZSBsYXN0IC5lbmQoKSBjYWxsYmFjayBkb2Vzbid0IGdldCBjYWxsZWQsIHNvXG4gICAgICAgICAgICAvLyB3ZSBzZXQgYW5vdGhlciB0aW1lb3V0IHRvIGNvcnJlY3QgdGhpcyBtaXN0YWtlIGlmIGl0IGhhcHBlbnMuXG4gICAgICAgICAgICB2YXIgY2FsbGVkID0gZmFsc2U7XG4gICAgICAgICAgICB2YXIgZHVyYXRpb24gPSAxMCAqIG9mZnNldDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHN0b3ApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRyYW5zZm9ybSgwLCAxLCBzZXRPcGFjaXR5LCB7ZHVyYXRpb246IGR1cmF0aW9ufSwgZW5kKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2V0VGltZW91dChlbmQsIGR1cmF0aW9uICsgMjAwMCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNldE9wYWNpdHkgKHYpIHtcbiAgICAgICAgICAgICAgICBjaGFyLnN0eWxlLm9wYWNpdHkgPSB2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBmdW5jdGlvbiBlbmQgKCkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChjYWxsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGxlZnQgLT0gMTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoc3RvcCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmIChsZWZ0IDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhlbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICB9LCBpICogb2Zmc2V0KTtcbiAgICAgICAgXG4gICAgICAgIHRpbWVvdXRzLnB1c2goaWQpO1xuICAgIH0pO1xuICAgIFxuICAgIGZ1bmN0aW9uIGNhbmNlbCAoKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAoc3RvcCB8fCBsZWZ0IDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgc3RvcCA9IHRydWU7XG4gICAgICAgIFxuICAgICAgICB0aW1lb3V0cy5mb3JFYWNoKGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KGlkKTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBbXS5mb3JFYWNoLmNhbGwoY2hhcnMsIGZ1bmN0aW9uIChjaGFyKSB7XG4gICAgICAgICAgICBjaGFyLnN0eWxlLm9wYWNpdHkgPSBcIjFcIjtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICB0aGVuKCk7XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHtcbiAgICAgICAgY2FuY2VsOiBjYW5jZWxcbiAgICB9O1xufVxuXG5mdW5jdGlvbiBoaWRlQ2hhcmFjdGVycyAoZWxlbWVudCkge1xuICAgIFxuICAgIHZhciBjaGFycyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5DaGFyXCIpO1xuICAgIFxuICAgIFtdLmZvckVhY2guY2FsbChjaGFycywgZnVuY3Rpb24gKGNoYXIpIHtcbiAgICAgICAgY2hhci5zdHlsZS5vcGFjaXR5ID0gMDtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gbWFya0NoYXJhY3RlcnMgKGVsZW1lbnQsIG9mZnNldCkge1xuICAgIFxuICAgIHZhciBURVhUX05PREUgPSAzO1xuICAgIHZhciBFTEVNRU5UID0gMTtcbiAgICBcbiAgICBvZmZzZXQgPSBvZmZzZXQgfHwgMDtcbiAgICBcbiAgICBbXS5mb3JFYWNoLmNhbGwoZWxlbWVudC5jaGlsZE5vZGVzLCBmdW5jdGlvbiAoY2hpbGQpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciB0ZXh0ID0gXCJcIiwgbmV3Tm9kZTtcbiAgICAgICAgXG4gICAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSA9PT0gVEVYVF9OT0RFKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIFtdLmZvckVhY2guY2FsbChjaGlsZC50ZXh0Q29udGVudCwgZnVuY3Rpb24gKGNoYXIpIHtcbiAgICAgICAgICAgICAgICB0ZXh0ICs9ICc8c3BhbiBjbGFzcz1cIkNoYXJcIiBkYXRhLWNoYXI9XCInICsgb2Zmc2V0ICsgJ1wiPicgKyBjaGFyICsgJzwvc3Bhbj4nO1xuICAgICAgICAgICAgICAgIG9mZnNldCArPSAxO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG5ld05vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbmV3Tm9kZS5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIkNoYXJDb250YWluZXJcIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIG5ld05vZGUuaW5uZXJIVE1MID0gdGV4dDtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY2hpbGQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobmV3Tm9kZSwgY2hpbGQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNoaWxkLm5vZGVUeXBlID09PSBFTEVNRU5UKSB7XG4gICAgICAgICAgICBvZmZzZXQgPSBtYXJrQ2hhcmFjdGVycyhjaGlsZCwgb2Zmc2V0KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIFxuICAgIHJldHVybiBvZmZzZXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmV2ZWFsO1xuIiwiXG52YXIgdG9vbHMgPSB7fTtcblxuLyoqXG4gKiBTZXRzIHRoZSB4IGFuZCB5IHVuaXRzIG9uIGFuIGFzc2V0IG9iamVjdCBhY2NvcmRpbmdcbiAqIHRvIGl0J3MgZGVmaW5pdGlvbiBpbiB0aGUgV2ViU3RvcnkuXG4gKiBAcGFyYW0gb2JqIFRoZSBKYXZhU2NyaXB0IG9iamVjdCBhc3NldC5cbiAqIEBwYXJhbSBhc3NldCBUaGUgWE1MIEVsZW1lbnQgd2l0aCB0aGUgYXNzZXQncyBpbmZvcm1hdGlvbi5cbiAqL1xudG9vbHMuYXBwbHlBc3NldFVuaXRzID0gZnVuY3Rpb24gKG9iaiwgYXNzZXQpIHtcbiAgICBcbiAgICB2YXIgeCwgeTtcbiAgICBcbiAgICB4ID0gYXNzZXQuZ2V0QXR0cmlidXRlKCd4JykgfHwgXCJcIjtcbiAgICB5ID0gYXNzZXQuZ2V0QXR0cmlidXRlKCd5JykgfHwgXCJcIjtcbiAgICBvYmoueFVuaXQgPSB4LnJlcGxhY2UoL14uKihweHwlKSQvLCAnJDEnKTtcbiAgICBvYmoueFVuaXQgPSBvYmoueFVuaXQgfHwgJ3B4JztcbiAgICBvYmoueVVuaXQgPSB5LnJlcGxhY2UoL14uKihweHwlKSQvLCAnJDEnKTtcbiAgICBvYmoueVVuaXQgPSBvYmoueVVuaXQgfHwgJ3B4JztcbiAgICBcbiAgICBpZiAob2JqLnhVbml0ICE9PSBcInB4XCIgJiYgb2JqLnhVbml0ICE9PSBcIiVcIikge1xuICAgICAgICBvYmoueFVuaXQgPSBcInB4XCI7XG4gICAgfVxuICAgIFxuICAgIGlmIChvYmoueVVuaXQgIT09IFwicHhcIiAmJiBvYmoueVVuaXQgIT09IFwiJVwiKSB7XG4gICAgICAgIG9iai55VW5pdCA9IFwicHhcIjtcbiAgICB9XG59O1xuXG4vKipcbiAqIFJlbW92ZXMgYSBET00gRXZlbnQgZnJvbSBhIERPTSBFbGVtZW50LlxuICovXG50b29scy5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24gKGVsZW0sIHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgXG4gICAgaWYgKHR5cGVvZiBlbGVtID09PSBcInVuZGVmaW5lZFwiIHx8IGVsZW0gPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBcbiAgICBlbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIGZhbHNlKTtcbn07XG5cbi8qKlxuICogRnVuY3Rpb24gdGhhdCByZXBsYWNlcyB0aGUgbmFtZXMgb2YgdmFyaWFibGVzIGluIGEgc3RyaW5nXG4gKiB3aXRoIHRoZWlyIHJlc3BlY3RpdmUgdmFsdWVzLlxuICogXG4gKiBAcGFyYW0gdGV4dCBbc3RyaW5nXSBUaGUgdGV4dCB0aGF0IGNvbnRhaW5zIHZhcmlhYmxlcy5cbiAqIEBwYXJhbSBpbnRlcnByZXRlciBbV1NFLkludGVycHJldGVyXSBUaGUgaW50ZXJwcmV0ZXIgaW5zdGFuY2UuXG4gKiBAcmV0dXJuIFtzdHJpbmddIFRoZSB0ZXh0IHdpdGggdGhlIGluc2VydGVkIHZhcmlhYmxlIHZhbHVlcy5cbiAqL1xudG9vbHMucmVwbGFjZVZhcmlhYmxlcyA9IGZ1bmN0aW9uICh0ZXh0LCBpbnRlcnByZXRlcikge1xuICAgIFxuICAgIHZhciBmMSwgZjI7XG4gICAgXG4gICAgaWYgKHRleHQgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHRleHQ7XG4gICAgfVxuICAgIFxuICAgIGlmICh0eXBlb2YgdGV4dCAhPT0gXCJzdHJpbmdcIikge1xuICAgICAgICBpbnRlcnByZXRlci5idXMudHJpZ2dlcihcIndzZS5pbnRlcnByZXRlci5lcnJvclwiLCB7XG4gICAgICAgICAgICBtZXNzYWdlOiBcIkFyZ3VtZW50IHN1cHBsaWVkIHRvIHRoZSByZXBsYWNlVmFyaWFibGVzIGZ1bmN0aW9uIG11c3QgYmUgYSBzdHJpbmcuXCJcbiAgICAgICAgfSk7XG4gICAgICAgIHRleHQgPSBcIlwiO1xuICAgIH1cbiAgICBcbiAgICBmMSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBuYW1lID0gYXJndW1lbnRzWzFdO1xuICAgICAgICBcbiAgICAgICAgaWYgKGludGVycHJldGVyLmdsb2JhbFZhcnMuaGFzKG5hbWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIiArIGludGVycHJldGVyLmdsb2JhbFZhcnMuZ2V0KG5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9O1xuICAgIFxuICAgIGYyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIG5hbWUgPSBhcmd1bWVudHNbMV07XG4gICAgICAgIFxuICAgICAgICBpZiAobmFtZSBpbiBpbnRlcnByZXRlci5ydW5WYXJzKSB7XG4gICAgICAgICAgICByZXR1cm4gXCJcIiArIGludGVycHJldGVyLnJ1blZhcnNbbmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgIH07XG4gICAgXG4gICAgLy8gaW5zZXJ0IHZhbHVlcyBvZiBnbG9iYWwgdmFyaWFibGVzICgkJHZhcik6XG4gICAgdGV4dCA9IHRleHQucmVwbGFjZSgvXFx7XFwkXFwkKFthLXpBLVowLTlfXSspXFx9L2csIGYxKTtcbiAgICBcbiAgICAvLyBpbnNlcnQgdmFsdWVzIG9mIGxvY2FsIHZhcmlhYmxlcyAoJHZhcik6XG4gICAgdGV4dCA9IHRleHQucmVwbGFjZSgvXFx7XFwkKFthLXpBLVowLTlfXSspXFx9L2csIGYyKTtcbiAgICBcbiAgICByZXR1cm4gdGV4dDtcbn07XG5cbnRvb2xzLmdldFNlcmlhbGl6ZWROb2RlcyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgXG4gICAgdmFyIHNlciA9IG5ldyBYTUxTZXJpYWxpemVyKCksIG5vZGVzID0gZWxlbWVudC5jaGlsZE5vZGVzLCBpLCBsZW47ICAgICAgICBcbiAgICB2YXIgdGV4dCA9ICcnO1xuICAgIFxuICAgIGZvciAoaSA9IDAsIGxlbiA9IG5vZGVzLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKSB7XG4gICAgICAgIHRleHQgKz0gc2VyLnNlcmlhbGl6ZVRvU3RyaW5nKG5vZGVzW2ldKTtcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIHRleHQ7XG59O1xuXG50b29scy5nZXRQYXJzZWRBdHRyaWJ1dGUgPSBmdW5jdGlvbiAoZWxlbWVudCwgYXR0cmlidXRlTmFtZSwgaW50ZXJwcmV0ZXIsIGRlZmF1bHRWYWx1ZSkge1xuICAgIFxuICAgIHZhciB2YWx1ZTtcbiAgICBcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgZGVmYXVsdFZhbHVlID0gXCJcIjtcbiAgICB9XG4gICAgXG4gICAgdmFsdWUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKSB8fCAoXCJcIiArIGRlZmF1bHRWYWx1ZSk7XG4gICAgXG4gICAgcmV0dXJuIHRvb2xzLnJlcGxhY2VWYXJpYWJsZXModmFsdWUsIGludGVycHJldGVyKTtcbn07XG5cbi8qKlxuICogUmVwbGFjZXMgeyBhbmQgfSB0byA8IGFuZCA+IGZvciBtYWtpbmcgaXQgSFRNTC5cbiAqIE9wdGlvbmFsbHkgcmVwbGFjZXMgbmV3bGluZXMgd2l0aCA8YnJlYWs+IGVsZW1lbnRzLlxuICogXG4gKiBAcGFyYW0gdGV4dCBbc3RyaW5nXSBUaGUgdGV4dCB0byBjb252ZXJ0IHRvIEhUTUwuXG4gKiBAcGFyYW0gbmx0b2JyIFtib29sXSBTaG91bGQgbmV3bGluZXMgYmUgY29udmVydGVkIHRvIGJyZWFrcz8gRGVmYXVsdDogZmFsc2UuXG4gKi9cbnRvb2xzLnRleHRUb0h0bWwgPSBmdW5jdGlvbiAodGV4dCwgbmx0b2JyKSB7XG4gICAgXG4gICAgbmx0b2JyID0gbmx0b2JyIHx8IGZhbHNlO1xuICAgIFxuICAgIGlmICghKFN0cmluZy5wcm90b3R5cGUudHJpbSkpIHtcbiAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZSgvXlxcbi8sIFwiXCIpO1xuICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cXG4kLywgXCJcIik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0ZXh0ID0gdGV4dC50cmltKCk7XG4gICAgfVxuICAgIFxuICAgIHRleHQgPSBubHRvYnIgPT09IHRydWUgPyB0ZXh0LnJlcGxhY2UoL1xcbi9nLCBcIjxiciAvPlwiKSA6IHRleHQ7XG4gICAgdGV4dCA9IHRleHQucmVwbGFjZSgvXFx7L2csIFwiPFwiKTtcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9cXH0vZywgXCI+XCIpO1xuICAgIFxuICAgIHJldHVybiB0ZXh0O1xufTtcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYSB1bmlxdWUgSUQuIFVzZWQgYnkgYXNzZXRzIHRvIGlkZW50aWZ5IHRoZWlyIG93biBzdHVmZlxuICogaW4gc2F2ZWdhbWVzIGFuZCB0aGUgRE9NIG9mIHRoZSBzdGFnZS5cbiAqIFxuICogQHJldHVybiBbbnVtYmVyXSBUaGUgdW5pcXVlIElELlxuICovXG50b29scy5nZXRVbmlxdWVJZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgXG4gICAgdmFyIHVuaXF1ZUlkQ291bnQgPSAwO1xuICAgIFxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHVuaXF1ZUlkQ291bnQgKz0gMTtcbiAgICAgICAgcmV0dXJuIHVuaXF1ZUlkQ291bnQ7XG4gICAgfTtcbn0oKSk7XG5cbi8qKlxuICogQ29udmVydHMgdGhlIGZpcnN0IGNoYXJhY3RlciBpbiBhIHN0cmluZyB0byB1cHBlciBjYXNlLlxuICogXG4gKiBAcGFyYW0gaW5wdXQgW3N0cmluZ10gVGhlIHN0cmluZyB0byB0cmFuc2Zvcm0uXG4gKiBAcmV0dXJuIFtzdHJpbmddIFRoZSB0cmFuc2Zvcm1lZCBzdHJpbmcuXG4gKi9cbnRvb2xzLmZpcnN0TGV0dGVyVXBwZXJjYXNlID0gZnVuY3Rpb24gKGlucHV0KSB7XG4gICAgXG4gICAgaWYgKGlucHV0Lmxlbmd0aCA8IDEpIHtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBcIlwiICsgaW5wdXQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBpbnB1dC5yZXBsYWNlKC9eLnsxfS8sIFwiXCIpO1xufTtcblxudG9vbHMubWl4aW4gPSBmdW5jdGlvbiAoc291cmNlLCB0YXJnZXQpIHtcbiAgICBcbiAgICB2YXIga2V5O1xuICAgIFxuICAgIGZvciAoa2V5IGluIHNvdXJjZSkge1xuICAgICAgICBcbiAgICAgICAgaWYgKHNvdXJjZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICB9XG4gICAgfVxufTtcblxudG9vbHMuZXh0cmFjdFVuaXQgPSBmdW5jdGlvbiAobnVtYmVyU3RyaW5nKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBudW1iZXJTdHJpbmcgIT09IFwic3RyaW5nXCIgPyBcIlwiIDogbnVtYmVyU3RyaW5nLnJlcGxhY2UoL14oLSl7MCwxfVswLTldKi8sIFwiXCIpO1xufTtcblxudG9vbHMuY2FsY3VsYXRlVmFsdWVXaXRoQW5jaG9yID0gZnVuY3Rpb24gKG9sZFZhbHVlLCBhbmNob3IsIG1heFZhbHVlKSB7XG5cbiAgICB2YXIgdmFsdWUgPSAwLCBhbmNob3JVbml0ID0gXCJweFwiO1xuICAgIFxuICAgIGlmICghYW5jaG9yKSB7XG4gICAgICAgIHJldHVybiBvbGRWYWx1ZTtcbiAgICB9XG4gICAgXG4gICAgYW5jaG9yVW5pdCA9IHRvb2xzLmV4dHJhY3RVbml0KGFuY2hvcik7XG4gICAgYW5jaG9yID0gcGFyc2VJbnQoYW5jaG9yLCAxMCk7XG4gICAgXG4gICAgaWYgKGFuY2hvclVuaXQgPT09IFwiJVwiKSB7XG4gICAgICAgIHZhbHVlID0gb2xkVmFsdWUgLSAoKG1heFZhbHVlIC8gMTAwKSAqIGFuY2hvcik7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IG9sZFZhbHVlIC0gYW5jaG9yO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gdmFsdWU7XG59O1xuXG50b29scy5nZXRXaW5kb3dEaW1lbnNpb25zID0gZnVuY3Rpb24gKCkge1xuICAgIFxuICAgIHZhciBlID0gd2luZG93LFxuICAgICAgICBhID0gJ2lubmVyJztcbiAgICBcbiAgICBpZiAoISgnaW5uZXJXaWR0aCcgaW4gZSkpIHtcbiAgICAgICAgYSA9ICdjbGllbnQnO1xuICAgICAgICBlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IHx8IGRvY3VtZW50LmJvZHk7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiB7XG4gICAgICAgIHdpZHRoOiBlW2EgKyAnV2lkdGgnXSxcbiAgICAgICAgaGVpZ2h0OiBlW2EgKyAnSGVpZ2h0J11cbiAgICB9O1xufTtcblxudG9vbHMuZml0VG9XaW5kb3cgPSBmdW5jdGlvbiAoZWwsIHcsIGgpIHtcbiAgICBcbiAgICB2YXIgZGltLCByYXRpbywgc3csIHNoLCByYXRpb1csIHJhdGlvSDtcbiAgICBcbiAgICBkaW0gPSB0b29scy5nZXRXaW5kb3dEaW1lbnNpb25zKCk7XG4gICAgXG4gICAgc3cgPSBkaW0ud2lkdGg7IC8vIC0gKGRpbS53aWR0aCAqIDAuMDEpO1xuICAgIHNoID0gZGltLmhlaWdodDsgLy8gLSAoZGltLmhlaWdodCAqIDAuMDEpO1xuICAgIFxuICAgIHJhdGlvVyA9IHN3IC8gdztcbiAgICByYXRpb0ggPSBzaCAvIGg7XG4gICAgXG4gICAgcmF0aW8gPSByYXRpb1cgPiByYXRpb0ggPyByYXRpb0ggOiByYXRpb1c7XG4gICAgXG4gICAgLy9yYXRpbyA9IHBhcnNlSW50KHJhdGlvICogMTAwKSAvIDEwMDtcbiAgICBcbiAgICBlbC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJyxcbiAgICBlbC5nZXRBdHRyaWJ1dGUoJ3N0eWxlJykgKyAnIC1tb3otdHJhbnNmb3JtOiBzY2FsZSgnICsgcmF0aW8gKyAnLCcgKyByYXRpbyArXG4gICAgICAgICcpIHJvdGF0ZSgwLjAxZGVnKTsnICsgJyAtbXMtdHJhbnNmb3JtOiBzY2FsZSgnICsgcmF0aW8gKyAnLCcgKyByYXRpbyArXG4gICAgICAgICcpOycgKyAnIC1vLXRyYW5zZm9ybTogc2NhbGUoJyArIHJhdGlvICsgJywnICsgcmF0aW8gK1xuICAgICAgICAnKTsnICsgJyAtd2Via2l0LXRyYW5zZm9ybTogc2NhbGUoJyArIHJhdGlvICsgJywnICsgcmF0aW8gKyAnKTsnICtcbiAgICAgICAgJyB0cmFuc2Zvcm06IHNjYWxlKCcgKyByYXRpbyArICcsJyArIHJhdGlvICsgJyk7Jyk7XG59O1xuXG50b29scy5sb2cgPSBmdW5jdGlvbiAoYnVzLCBtZXNzYWdlKSB7XG4gICAgdG9vbHMudHJpZ2dlcihidXMsIFwid3NlLmludGVycHJldGVyLm1lc3NhZ2VcIiwgbWVzc2FnZSk7XG59O1xuXG50b29scy53YXJuID0gZnVuY3Rpb24gKGJ1cywgbWVzc2FnZSwgZWxlbWVudCkge1xuICAgIHRvb2xzLnRyaWdnZXIoYnVzLCBcIndzZS5pbnRlcnByZXRlci53YXJuaW5nXCIsIG1lc3NhZ2UsIGVsZW1lbnQpO1xufTtcblxudG9vbHMubG9nRXJyb3IgPSBmdW5jdGlvbiAoYnVzLCBtZXNzYWdlLCBlbGVtZW50KSB7XG4gICAgdG9vbHMudHJpZ2dlcihidXMsIFwid3NlLmludGVycHJldGVyLmVycm9yXCIsIG1lc3NhZ2UsIGVsZW1lbnQpO1xufTtcblxudG9vbHMudHJpZ2dlciA9IGZ1bmN0aW9uIChidXMsIGNoYW5uZWwsIG1lc3NhZ2UsIGVsZW1lbnQpIHtcbiAgICBidXMudHJpZ2dlcihjaGFubmVsLCB7XG4gICAgICAgIGVsZW1lbnQ6IGVsZW1lbnQgfHwgbnVsbCxcbiAgICAgICAgbWVzc2FnZTogbWVzc2FnZVxuICAgIH0pO1xufTtcblxuLy9cbi8vICMjIFtmdW5jdGlvbl0gdHJ1dGh5XG4vL1xuLy8gQSBmdW5jdGlvbiB0aGF0IGNoZWNrcyB3aGV0aGVyIGFuIGF0dHJpYnV0ZSB2YWx1ZSBpcyBjb25zaWRlcmVkIHRydXRoeSBieVxuLy8gdGhlIGVuZ2luZS4gVHJ1dGh5IHZhbHVlcyBhcmUgYHRydWVgIGFuZCBgeWVzYC5cbi8vXG4vLyAgICAgdHJ1dGh5IDo6IGFueSAtPiBib29sZWFuXG4vL1xudG9vbHMudHJ1dGh5ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIFtcInRydWVcIiwgXCJ5ZXNcIl0uaW5kZXhPZih2YWx1ZSkgPj0gMDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gdG9vbHM7XG4iLCJcbnZhciB0b29scyA9IHJlcXVpcmUoXCIuLi90b29scy90b29sc1wiKTtcblxudmFyIHdhcm4gPSB0b29scy53YXJuO1xudmFyIHJlcGxhY2VWYXJzID0gdG9vbHMucmVwbGFjZVZhcmlhYmxlcztcblxudmFyIEtFWUNPREVfRU5URVIgPSAxMztcbnZhciBLRVlDT0RFX0VTQ0FQRSA9IDI3O1xuXG52YXIgdWkgPSB7XG4gICAgXG4gICAgY29uZmlybTogZnVuY3Rpb24gKGludGVycHJldGVyLCBhcmdzKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgdGl0bGUsIG1lc3NhZ2UsIHRydWVUZXh0LCBmYWxzZVRleHQsIGNhbGxiYWNrLCByb290LCBkaWFsb2c7XG4gICAgICAgIHZhciB0RWwsIG1FbCwgeWVzRWwsIG5vRWwsIGNvbnRhaW5lciwgcGF1c2UsIG9sZFN0YXRlLCBkb05leHQ7XG4gICAgICAgIFxuICAgICAgICBpbnRlcnByZXRlci53YWl0Q291bnRlciArPSAxO1xuICAgICAgICBcbiAgICAgICAgYXJncyA9IGFyZ3MgfHwge307XG4gICAgICAgIHRpdGxlID0gYXJncy50aXRsZSB8fCBcIkNvbmZpcm0/XCI7XG4gICAgICAgIG1lc3NhZ2UgPSBhcmdzLm1lc3NhZ2UgfHwgXCJEbyB5b3Ugd2FudCB0byBwcm9jZWVkP1wiO1xuICAgICAgICB0cnVlVGV4dCA9IGFyZ3MudHJ1ZVRleHQgfHwgXCJZZXNcIjtcbiAgICAgICAgZmFsc2VUZXh0ID0gYXJncy5mYWxzZVRleHQgfHwgXCJOb1wiO1xuICAgICAgICBjYWxsYmFjayA9IHR5cGVvZiBhcmdzLmNhbGxiYWNrID09PSBcImZ1bmN0aW9uXCIgPyBhcmdzLmNhbGxiYWNrIDogZnVuY3Rpb24gKCkge307XG4gICAgICAgIHJvb3QgPSBhcmdzLnBhcmVudCB8fCBpbnRlcnByZXRlci5zdGFnZTtcbiAgICAgICAgcGF1c2UgPSBhcmdzLnBhdXNlID09PSB0cnVlID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICBvbGRTdGF0ZSA9IGludGVycHJldGVyLnN0YXRlO1xuICAgICAgICBkb05leHQgPSBhcmdzLmRvTmV4dCA9PT0gdHJ1ZSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgXG4gICAgICAgIGlmIChwYXVzZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXIuc3RhdGUgPSBcInBhdXNlXCI7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIldTRVVJQ29udGFpbmVyXCIpO1xuICAgICAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKFwiZGF0YS13c2UtcmVtb3ZlXCIsIFwidHJ1ZVwiKTtcbiAgICAgICAgZGlhbG9nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgZGlhbG9nLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiV1NFVUlEaWFsb2cgV1NFVUlDb25maXJtXCIpO1xuICAgICAgICBcbiAgICAgICAgdEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdEVsLmlubmVySFRNTCA9IHRpdGxlO1xuICAgICAgICB0RWwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJ0aXRsZVwiKTtcbiAgICAgICAgXG4gICAgICAgIG1FbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIG1FbC5pbm5lckhUTUwgPSBtZXNzYWdlO1xuICAgICAgICBtRWwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJtZXNzYWdlXCIpO1xuICAgICAgICBcbiAgICAgICAgeWVzRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgIHllc0VsLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIHRydWVUZXh0KTtcbiAgICAgICAgeWVzRWwudmFsdWUgPSB0cnVlVGV4dDtcbiAgICAgICAgeWVzRWwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJ0cnVlIGJ1dHRvblwiKTtcbiAgICAgICAgeWVzRWwuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcbiAgICAgICAgeWVzRWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsXG4gICAgICAgIFxuICAgICAgICBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcm9vdC5yZW1vdmVDaGlsZChjb250YWluZXIpO1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgLT0gMTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXIua2V5c0Rpc2FibGVkIC09IDE7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChwYXVzZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGludGVycHJldGVyLnN0YXRlID0gb2xkU3RhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNhbGxiYWNrKHRydWUpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoZG9OZXh0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGludGVycHJldGVyLm5leHQoKTtcbiAgICAgICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBub0VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgICAgICBub0VsLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIGZhbHNlVGV4dCk7XG4gICAgICAgIG5vRWwudmFsdWUgPSBmYWxzZVRleHQ7XG4gICAgICAgIG5vRWwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJmYWxzZSBidXR0b25cIik7XG4gICAgICAgIG5vRWwuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcbiAgICAgICAgbm9FbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixcbiAgICAgICAgXG4gICAgICAgIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIGV2LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByb290LnJlbW92ZUNoaWxkKGNvbnRhaW5lcik7XG4gICAgICAgICAgICBpbnRlcnByZXRlci53YWl0Q291bnRlciAtPSAxO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAocGF1c2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBpbnRlcnByZXRlci5zdGF0ZSA9IG9sZFN0YXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBjYWxsYmFjayhmYWxzZSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChkb05leHQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXIubmV4dCgpO1xuICAgICAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGRpYWxvZy5hcHBlbmRDaGlsZCh0RWwpO1xuICAgICAgICBkaWFsb2cuYXBwZW5kQ2hpbGQobUVsKTtcbiAgICAgICAgZGlhbG9nLmFwcGVuZENoaWxkKHllc0VsKTtcbiAgICAgICAgZGlhbG9nLmFwcGVuZENoaWxkKG5vRWwpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGlhbG9nKTtcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICAgICAgICBcbiAgICAgICAgeWVzRWwuZm9jdXMoKTtcbiAgICB9LFxuICAgIFxuICAgIGFsZXJ0OiBmdW5jdGlvbiAoaW50ZXJwcmV0ZXIsIGFyZ3MpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciB0aXRsZSwgbWVzc2FnZSwgb2tUZXh0LCBjYWxsYmFjaywgcm9vdCwgZGlhbG9nO1xuICAgICAgICB2YXIgdEVsLCBtRWwsIGJ1dHRvbkVsLCBjb250YWluZXIsIHBhdXNlLCBvbGRTdGF0ZSwgZG9OZXh0O1xuICAgICAgICBcbiAgICAgICAgaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgKz0gMTtcbiAgICAgICAgXG4gICAgICAgIGFyZ3MgPSBhcmdzIHx8IHt9O1xuICAgICAgICB0aXRsZSA9IGFyZ3MudGl0bGUgfHwgXCJBbGVydCFcIjtcbiAgICAgICAgbWVzc2FnZSA9IGFyZ3MubWVzc2FnZSB8fCBcIlBsZWFzZSB0YWtlIG5vdGljZSBvZiB0aGlzIVwiO1xuICAgICAgICBva1RleHQgPSBhcmdzLm9rVGV4dCB8fCBcIk9LXCI7XG4gICAgICAgIGNhbGxiYWNrID0gdHlwZW9mIGFyZ3MuY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIiA/IGFyZ3MuY2FsbGJhY2sgOiBmdW5jdGlvbiAoKSB7fTtcbiAgICAgICAgcm9vdCA9IGFyZ3MucGFyZW50IHx8IGludGVycHJldGVyLnN0YWdlO1xuICAgICAgICBwYXVzZSA9IGFyZ3MucGF1c2UgPT09IHRydWUgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIG9sZFN0YXRlID0gaW50ZXJwcmV0ZXIuc3RhdGU7XG4gICAgICAgIGRvTmV4dCA9IGFyZ3MuZG9OZXh0ID09PSB0cnVlID8gdHJ1ZSA6IGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgaWYgKHBhdXNlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBpbnRlcnByZXRlci5zdGF0ZSA9IFwicGF1c2VcIjtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiV1NFVUlDb250YWluZXJcIik7XG4gICAgICAgIGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoXCJkYXRhLXdzZS1yZW1vdmVcIiwgXCJ0cnVlXCIpO1xuICAgICAgICBkaWFsb2cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBkaWFsb2cuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJXU0VVSURpYWxvZyBXU0VVSUNvbmZpcm1cIik7XG4gICAgICAgIFxuICAgICAgICB0RWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0RWwuaW5uZXJIVE1MID0gdGl0bGU7XG4gICAgICAgIHRFbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcInRpdGxlXCIpO1xuICAgICAgICBcbiAgICAgICAgbUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgbUVsLmlubmVySFRNTCA9IG1lc3NhZ2U7XG4gICAgICAgIG1FbC5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIm1lc3NhZ2VcIik7XG4gICAgICAgIFxuICAgICAgICBidXR0b25FbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgYnV0dG9uRWwuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgb2tUZXh0KTtcbiAgICAgICAgYnV0dG9uRWwudmFsdWUgPSBva1RleHQ7XG4gICAgICAgIGJ1dHRvbkVsLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwidHJ1ZSBidXR0b25cIik7XG4gICAgICAgIGJ1dHRvbkVsLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJidXR0b25cIik7XG4gICAgICAgIGJ1dHRvbkVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLFxuICAgICAgICBcbiAgICAgICAgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgZXYucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJvb3QucmVtb3ZlQ2hpbGQoY29udGFpbmVyKTtcbiAgICAgICAgICAgIGludGVycHJldGVyLndhaXRDb3VudGVyIC09IDE7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChwYXVzZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGludGVycHJldGVyLnN0YXRlID0gb2xkU3RhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNhbGxiYWNrKHRydWUpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoZG9OZXh0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGludGVycHJldGVyLm5leHQoKTtcbiAgICAgICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBkaWFsb2cuYXBwZW5kQ2hpbGQodEVsKTtcbiAgICAgICAgZGlhbG9nLmFwcGVuZENoaWxkKG1FbCk7XG4gICAgICAgIGRpYWxvZy5hcHBlbmRDaGlsZChidXR0b25FbCk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChkaWFsb2cpO1xuICAgICAgICByb290LmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG4gICAgICAgIFxuICAgICAgICBidXR0b25FbC5mb2N1cygpO1xuICAgIH0sXG4gICAgXG4gICAgcHJvbXB0OiBmdW5jdGlvbiAoaW50ZXJwcmV0ZXIsIGFyZ3MpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciB0aXRsZSwgbWVzc2FnZSwgc3VibWl0VGV4dCwgY2FuY2VsVGV4dCwgY2FsbGJhY2ssIHJvb3QsIGRpYWxvZywgb2xkU3RhdGU7XG4gICAgICAgIHZhciB0RWwsIG1FbCwgYnV0dG9uRWwsIGNhbmNlbEVsLCBpbnB1dEVsLCBjb250YWluZXIsIHBhdXNlLCBkb05leHQ7XG4gICAgICAgIHZhciBhbGxvd0VtcHR5SW5wdXQsIGhpZGVDYW5jZWxCdXR0b24sIHByZWZpbGw7XG4gICAgICAgIFxuICAgICAgICBpbnRlcnByZXRlci53YWl0Q291bnRlciArPSAxO1xuICAgICAgICBcbiAgICAgICAgYXJncyA9IGFyZ3MgfHwge307XG4gICAgICAgIHRpdGxlID0gYXJncy50aXRsZSB8fCBcIklucHV0IHJlcXVpcmVkXCI7XG4gICAgICAgIG1lc3NhZ2UgPSBhcmdzLm1lc3NhZ2UgfHwgXCJQbGVhc2UgZW50ZXIgc29tZXRoaW5nOlwiO1xuICAgICAgICBzdWJtaXRUZXh0ID0gYXJncy5zdWJtaXRUZXh0IHx8IFwiU3VibWl0XCI7XG4gICAgICAgIGNhbmNlbFRleHQgPSBhcmdzLmNhbmNlbFRleHQgfHwgXCJDYW5jZWxcIjtcbiAgICAgICAgY2FsbGJhY2sgPSB0eXBlb2YgYXJncy5jYWxsYmFjayA9PT0gXCJmdW5jdGlvblwiID8gYXJncy5jYWxsYmFjayA6IGZ1bmN0aW9uICgpIHt9O1xuICAgICAgICByb290ID0gYXJncy5wYXJlbnQgfHwgaW50ZXJwcmV0ZXIuc3RhZ2U7XG4gICAgICAgIHBhdXNlID0gYXJncy5wYXVzZSA9PT0gdHJ1ZSA/IHRydWUgOiBmYWxzZTtcbiAgICAgICAgb2xkU3RhdGUgPSBpbnRlcnByZXRlci5zdGF0ZTtcbiAgICAgICAgZG9OZXh0ID0gYXJncy5kb05leHQgPT09IHRydWUgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIGFsbG93RW1wdHlJbnB1dCA9IGFyZ3MuYWxsb3dFbXB0eUlucHV0O1xuICAgICAgICBoaWRlQ2FuY2VsQnV0dG9uID0gYXJncy5oaWRlQ2FuY2VsQnV0dG9uO1xuICAgICAgICBwcmVmaWxsID0gYXJncy5wcmVmaWxsIHx8IFwiXCI7XG4gICAgICAgIFxuICAgICAgICBpZiAocGF1c2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGludGVycHJldGVyLnN0YXRlID0gXCJwYXVzZVwiO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBjb250YWluZXIuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJXU0VVSUNvbnRhaW5lclwiKTtcbiAgICAgICAgY29udGFpbmVyLnNldEF0dHJpYnV0ZShcImRhdGEtd3NlLXJlbW92ZVwiLCBcInRydWVcIik7XG4gICAgICAgIGRpYWxvZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGRpYWxvZy5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBcIldTRVVJRGlhbG9nIFdTRVVJUHJvbXB0XCIpO1xuICAgICAgICBcbiAgICAgICAgdEVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdEVsLmlubmVySFRNTCA9IHRpdGxlO1xuICAgICAgICB0RWwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJ0aXRsZVwiKTtcbiAgICAgICAgXG4gICAgICAgIG1FbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIG1FbC5pbm5lckhUTUwgPSBtZXNzYWdlO1xuICAgICAgICBtRWwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJtZXNzYWdlXCIpO1xuICAgICAgICBcbiAgICAgICAgaW5wdXRFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgaW5wdXRFbC5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCBwcmVmaWxsKTtcbiAgICAgICAgaW5wdXRFbC52YWx1ZSA9IHByZWZpbGw7XG4gICAgICAgIGlucHV0RWwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJpbnB1dCB0ZXh0XCIpO1xuICAgICAgICBpbnB1dEVsLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJ0ZXh0XCIpO1xuICAgICAgICBcbiAgICAgICAgaW5wdXRFbC5hZGRFdmVudExpc3RlbmVyKFwia2V5dXBcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChjYW5jZWxPbkVzY2FwZSgpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoYWxsb3dFbXB0eUlucHV0KSB7XG4gICAgICAgICAgICAgICAgc3VibWl0T25FbnRlcigpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGlucHV0RWwudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBidXR0b25FbC5kaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHN1Ym1pdE9uRW50ZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGJ1dHRvbkVsLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZnVuY3Rpb24gc3VibWl0T25FbnRlciAoKSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IEtFWUNPREVfRU5URVIpIHtcbiAgICAgICAgICAgICAgICAgICAgYnV0dG9uRWwuY2xpY2soKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNhbmNlbE9uRXNjYXBlICgpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gS0VZQ09ERV9FU0NBUEUgJiYgIWhpZGVDYW5jZWxCdXR0b24pIHtcbiAgICAgICAgICAgICAgICAgICAgY2FuY2VsRWwuY2xpY2soKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBidXR0b25FbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgYnV0dG9uRWwuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgc3VibWl0VGV4dCk7XG4gICAgICAgIGJ1dHRvbkVsLnZhbHVlID0gc3VibWl0VGV4dDtcbiAgICAgICAgYnV0dG9uRWwuc2V0QXR0cmlidXRlKFwiY2xhc3NcIiwgXCJzdWJtaXQgYnV0dG9uXCIpO1xuICAgICAgICBidXR0b25FbC5zZXRBdHRyaWJ1dGUoXCJ0eXBlXCIsIFwiYnV0dG9uXCIpO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFhbGxvd0VtcHR5SW5wdXQgJiYgIXByZWZpbGwpIHtcbiAgICAgICAgICAgIGJ1dHRvbkVsLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgYnV0dG9uRWwuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgdmFsID0gaW5wdXRFbC52YWx1ZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCFhbGxvd0VtcHR5SW5wdXQgJiYgIXZhbCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcm9vdC5yZW1vdmVDaGlsZChjb250YWluZXIpO1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgLT0gMTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHBhdXNlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXIuc3RhdGUgPSBvbGRTdGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY2FsbGJhY2sodmFsKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKGRvTmV4dCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpbnRlcnByZXRlci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgY2FuY2VsRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgIGNhbmNlbEVsLnNldEF0dHJpYnV0ZShcInZhbHVlXCIsIGNhbmNlbFRleHQpO1xuICAgICAgICBjYW5jZWxFbC52YWx1ZSA9IGNhbmNlbFRleHQ7XG4gICAgICAgIGNhbmNlbEVsLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsIFwiY2FuY2VsIGJ1dHRvblwiKTtcbiAgICAgICAgY2FuY2VsRWwuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcbiAgICAgICAgXG4gICAgICAgIGNhbmNlbEVsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgcm9vdC5yZW1vdmVDaGlsZChjb250YWluZXIpO1xuICAgICAgICAgICAgaW50ZXJwcmV0ZXIud2FpdENvdW50ZXIgLT0gMTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKHBhdXNlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXIuc3RhdGUgPSBvbGRTdGF0ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY2FsbGJhY2sobnVsbCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmIChkb05leHQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJwcmV0ZXIubmV4dCgpO1xuICAgICAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIGRpYWxvZy5hcHBlbmRDaGlsZCh0RWwpO1xuICAgICAgICBkaWFsb2cuYXBwZW5kQ2hpbGQobUVsKTtcbiAgICAgICAgZGlhbG9nLmFwcGVuZENoaWxkKGlucHV0RWwpO1xuICAgICAgICBkaWFsb2cuYXBwZW5kQ2hpbGQoYnV0dG9uRWwpO1xuICAgICAgICBcbiAgICAgICAgaWYgKCFoaWRlQ2FuY2VsQnV0dG9uKSB7XG4gICAgICAgICAgICBkaWFsb2cuYXBwZW5kQ2hpbGQoY2FuY2VsRWwpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoZGlhbG9nKTtcbiAgICAgICAgcm9vdC5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICAgICAgICBcbiAgICAgICAgaW5wdXRFbC5mb2N1cygpO1xuICAgIH1cbiAgICBcbn07XG5cbnVpLm1ha2VJbnB1dEZuID0gZnVuY3Rpb24gKHR5cGUpIHtcbiAgICBcbiAgICByZXR1cm4gZnVuY3Rpb24gKGNvbW1hbmQsIGludGVycHJldGVyKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgdGl0bGUsIG1lc3NhZ2UsIGNvbnRhaW5lciwga2V5LCBkb05leHQsIGhpZGVDYW5jZWxCdXR0b24sIGFsbG93RW1wdHlJbnB1dDtcbiAgICAgICAgdmFyIHN1Ym1pdFRleHQsIGNhbmNlbFRleHQsIHByZWZpbGw7XG4gICAgICAgIFxuICAgICAgICB0aXRsZSA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwidGl0bGVcIikgfHwgXCJJbnB1dCByZXF1aXJlZC4uLlwiO1xuICAgICAgICBtZXNzYWdlID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJtZXNzYWdlXCIpIHx8IFwiWW91ciBpbnB1dCBpcyByZXF1aXJlZDpcIjtcbiAgICAgICAga2V5ID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJ2YXJcIikgfHwgbnVsbDtcbiAgICAgICAgc3VibWl0VGV4dCA9IGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwic3VibWl0VGV4dFwiKSB8fCBcIlwiO1xuICAgICAgICBjYW5jZWxUZXh0ID0gY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJjYW5jZWxUZXh0XCIpIHx8IFwiXCI7XG4gICAgICAgIHByZWZpbGwgPSBjb21tYW5kLmdldEF0dHJpYnV0ZShcInByZWZpbGxcIikgfHwgXCJcIjtcbiAgICAgICAgXG4gICAgICAgIGFsbG93RW1wdHlJbnB1dCA9XG4gICAgICAgICAgICByZXBsYWNlVmFycyhjb21tYW5kLmdldEF0dHJpYnV0ZShcImFsbG93RW1wdHlJbnB1dFwiKSB8fCBcIlwiLCBpbnRlcnByZXRlcikgPT09IFwibm9cIiA/XG4gICAgICAgICAgICAgICAgZmFsc2UgOlxuICAgICAgICAgICAgICAgIHRydWU7XG4gICAgICAgIFxuICAgICAgICBoaWRlQ2FuY2VsQnV0dG9uID1cbiAgICAgICAgICAgIHJlcGxhY2VWYXJzKGNvbW1hbmQuZ2V0QXR0cmlidXRlKFwiaGlkZUNhbmNlbEJ1dHRvblwiKSB8fCBcIlwiLCBpbnRlcnByZXRlcikgPT09IFwieWVzXCIgP1xuICAgICAgICAgICAgICAgIHRydWUgOlxuICAgICAgICAgICAgICAgIGZhbHNlO1xuICAgICAgICBcbiAgICAgICAgZG9OZXh0ID0gcmVwbGFjZVZhcnMoY29tbWFuZC5nZXRBdHRyaWJ1dGUoXCJuZXh0XCIpIHx8IFwiXCIsIGludGVycHJldGVyKSA9PT0gXCJmYWxzZVwiID9cbiAgICAgICAgICAgIGZhbHNlIDpcbiAgICAgICAgICAgIHRydWU7XG4gICAgICAgIFxuICAgICAgICBpZiAoa2V5ICE9PSBudWxsKSB7XG4gICAgICAgICAgICBrZXkgPSByZXBsYWNlVmFycyhrZXksIGludGVycHJldGVyKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgdGl0bGUgPSByZXBsYWNlVmFycyh0aXRsZSwgaW50ZXJwcmV0ZXIpO1xuICAgICAgICBtZXNzYWdlID0gcmVwbGFjZVZhcnMobWVzc2FnZSwgaW50ZXJwcmV0ZXIpO1xuICAgICAgICBjYW5jZWxUZXh0ID0gcmVwbGFjZVZhcnMoY2FuY2VsVGV4dCwgaW50ZXJwcmV0ZXIpO1xuICAgICAgICBzdWJtaXRUZXh0ID0gcmVwbGFjZVZhcnMoc3VibWl0VGV4dCwgaW50ZXJwcmV0ZXIpO1xuICAgICAgICBwcmVmaWxsID0gcmVwbGFjZVZhcnMocHJlZmlsbCwgaW50ZXJwcmV0ZXIpO1xuICAgICAgICBcbiAgICAgICAgaW50ZXJwcmV0ZXIuYnVzLnRyaWdnZXIoXCJ3c2UuaW50ZXJwcmV0ZXIuY29tbWFuZHMuXCIgKyB0eXBlLCBjb21tYW5kKTtcbiAgICAgICAgXG4gICAgICAgIGlmIChrZXkgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHdhcm4oaW50ZXJwcmV0ZXIuYnVzLCBcIk5vICd2YXInIGF0dHJpYnV0ZSBkZWZpbmVkIG9uIFwiICsgdHlwZSArXG4gICAgICAgICAgICAgICAgXCIgY29tbWFuZC4gQ29tbWFuZCBpZ25vcmVkLlwiLCBjb21tYW5kKTtcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgZG9OZXh0OiB0cnVlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb250YWluZXIgPSBpbnRlcnByZXRlci5ydW5WYXJzO1xuICAgICAgICBcbiAgICAgICAgdWlbdHlwZV0oXG4gICAgICAgICAgICBpbnRlcnByZXRlcixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICAgICAgICAgICAgICBwYXVzZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBkb05leHQ6IGRvTmV4dCxcbiAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24gKGRlY2lzaW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lcltrZXldID0gXCJcIiArIGRlY2lzaW9uO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgYWxsb3dFbXB0eUlucHV0OiBhbGxvd0VtcHR5SW5wdXQsXG4gICAgICAgICAgICAgICAgaGlkZUNhbmNlbEJ1dHRvbjogaGlkZUNhbmNlbEJ1dHRvbixcbiAgICAgICAgICAgICAgICBzdWJtaXRUZXh0OiBzdWJtaXRUZXh0LFxuICAgICAgICAgICAgICAgIGNhbmNlbFRleHQ6IGNhbmNlbFRleHQsXG4gICAgICAgICAgICAgICAgcHJlZmlsbDogcHJlZmlsbFxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRvTmV4dDogdHJ1ZVxuICAgICAgICB9O1xuICAgIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHVpO1xuIl19
