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
                console.log('Triggering event "' + self.event + '"...');
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
    };
    
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