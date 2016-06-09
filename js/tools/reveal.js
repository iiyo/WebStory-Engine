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

using().define("WSE.tools.reveal", function () {
    
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
        
        console.log("Total:", left);
        
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
                
                move(char).set("opacity", 1).duration(duration).end(end);
                
                setTimeout(end, duration + 2000);
                
                function end () {
                    
                    if (called) {
                        return;
                    }
                    
                    called = true;
                    
                    left -= 1;
                    
                    console.log("Left:", left, chars.length);
                    
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