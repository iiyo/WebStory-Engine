
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
