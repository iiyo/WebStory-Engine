/*<ON_DEPLOY_REMOVE>*/
/* global document, setTimeout, WSE */
/*
    Copyright (c) 2012 - 2014 The WebStory Engine Contributors
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:
    
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.

    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.

    * Neither the name WebStory Engine nor the names of its contributors 
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
*/
/*</ON_DEPLOY_REMOVE>*/
(function (out)
{
    "use strict";
    
    out.tools.ui = {

        confirm: function (interpreter, args)
        {
            var title, message, trueText, falseText, callback, root, dialog;
            var tEl, mEl, yesEl, noEl, container, pause, oldState, doNext;

            interpreter.waitCounter += 1;
            //             interpreter.keysDisabled += 1;

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

            if (pause === true)
            {
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

            function (ev)
            {
                ev.stopPropagation();
                ev.preventDefault();
                root.removeChild(container);
                interpreter.waitCounter -= 1;
                //                     interpreter.keysDisabled -= 1;
                
                if (pause === true)
                {
                    interpreter.state = oldState;
                }
                
                callback(true);
                
                if (doNext === true)
                {
                    setTimeout(function ()
                    {
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

            function (ev)
            {
                ev.stopPropagation();
                ev.preventDefault();
                root.removeChild(container);
                interpreter.waitCounter -= 1;
                //                     interpreter.keysDisabled -= 1;
                
                if (pause === true)
                {
                    interpreter.state = oldState;
                }
                
                callback(false);
                
                if (doNext === true)
                {
                    setTimeout(function ()
                    {
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

        alert: function (interpreter, args)
        {
            var title, message, okText, callback, root, dialog;
            var tEl, mEl, buttonEl, container, pause, oldState, doNext;

            interpreter.waitCounter += 1;
            //             interpreter.keysDisabled += 1;

            args = args || {};
            title = args.title || "Alert!";
            message = args.message || "Please take notice of this!";
            okText = args.okText || "OK";
            callback = typeof args.callback === "function" ? args.callback : function () {};
            root = args.parent || interpreter.stage;
            pause = args.pause === true ? true : false;
            oldState = interpreter.state;
            doNext = args.doNext === true ? true : false;

            if (pause === true)
            {
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

            function (ev)
            {
                ev.stopPropagation();
                ev.preventDefault();
                root.removeChild(container);
                interpreter.waitCounter -= 1;
                //                     interpreter.keysDisabled -= 1;
                
                if (pause === true)
                {
                    interpreter.state = oldState;
                }
                
                callback(true);
                
                if (doNext === true)
                {
                    setTimeout(function ()
                    {
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

        prompt: function (interpreter, args)
        {
            var title, message, submitText, cancelText, callback, root, dialog, oldState;
            var tEl, mEl, buttonEl, cancelEl, inputEl, container, defaultValue, pause, doNext;
            var allowEmptyInput, hideCancelButton;
            
            interpreter.waitCounter += 1;
            //             interpreter.keysDisabled += 1;
            
            args = args || {};
            title = args.title || "Input required";
            message = args.message || "Please enter something:";
            submitText = args.submitText || "Submit";
            cancelText = args.cancelText || "Cancel";
            defaultValue = args.defaultValue || "";
            callback = typeof args.callback === "function" ? args.callback : function () {};
            root = args.parent || interpreter.stage;
            pause = args.pause === true ? true : false;
            oldState = interpreter.state;
            doNext = args.doNext === true ? true : false;
            allowEmptyInput = args.allowEmptyInput === "no" ? false : true;
            hideCancelButton = args.hideCancelButton === "yes" ? true : false;
            
            if (pause === true)
            {
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
            inputEl.setAttribute("value", defaultValue);
            inputEl.value = defaultValue;
            inputEl.setAttribute("class", "input text");
            inputEl.setAttribute("type", "text");
            
            inputEl.addEventListener("keyup", function ()
            {
                if (allowEmptyInput)
                {
                    return;
                }
                
                if (inputEl.value)
                {
                    buttonEl.disabled = false;
                }
                else
                {
                    buttonEl.disabled = true;
                }
            });
            
            buttonEl = document.createElement("input");
            buttonEl.setAttribute("value", submitText);
            buttonEl.value = submitText;
            buttonEl.setAttribute("class", "submit button");
            buttonEl.setAttribute("type", "button");
            
            buttonEl.addEventListener("click", function (ev)
            {
                var val = inputEl.value;
                
                if (!allowEmptyInput && !val)
                {
                    return;
                }
                
                ev.stopPropagation();
                ev.preventDefault();
                root.removeChild(container);
                interpreter.waitCounter -= 1;
                
                if (pause === true)
                {
                    interpreter.state = oldState;
                }
                
                callback(val);
                
                if (doNext === true)
                {
                    setTimeout(function ()
                    {
                        interpreter.next();
                    }, 0);
                }
            });
            
            cancelEl = document.createElement("input");
            cancelEl.setAttribute("value", cancelText);
            cancelEl.value = cancelText;
            cancelEl.setAttribute("class", "cancel button");
            cancelEl.setAttribute("type", "button");
            
            cancelEl.addEventListener("click", function (ev)
            {
                ev.stopPropagation();
                ev.preventDefault();
                root.removeChild(container);
                interpreter.waitCounter -= 1;
                
                if (pause === true)
                {
                    interpreter.state = oldState;
                }
                
                callback(null);
                
                if (doNext === true)
                {
                    setTimeout(function ()
                    {
                        interpreter.next();
                    }, 0);
                }
            });
            
            dialog.appendChild(tEl);
            dialog.appendChild(mEl);
            dialog.appendChild(inputEl);
            dialog.appendChild(buttonEl);
            
            if (!hideCancelButton)
            {
                dialog.appendChild(cancelEl);
            }
            
            container.appendChild(dialog);
            root.appendChild(container);
            
            inputEl.focus();
        }
        
    };
    
}(WSE));

(function (module)
{
    "use strict";
    
    var makeInputFn = function (type)
    {
        return function (command, interpreter)
        {
            var title, message, container, key, doNext;
            title = command.getAttribute("title") || "Input required...";
            message = command.getAttribute("message") || "Your input is required:";
            key = command.getAttribute("var") || null;
            doNext = command.getAttribute("next") === "false" ? false : true;
            
            if (key === null)
            {
                interpreter.bus.trigger("wse.interpreter.warning",
                                        {
                                            element: command,
                                        message: "No 'var' attribute defined on " + type + " command. Command ignored."
                                        });
                return {
                    doNext: true
                };
            }
            
            container = interpreter.runVars;
            
            module.tools.ui[type](
                interpreter,
                {
                    title: title,
                    message: message,
                    pause: true,
                    doNext: doNext,
                    callback: function (decision)
                    {
                        container[key] = "" + decision;
                    }
                });
            return {
                doNext: true
            };
        };
    };
    
    module.commands.alert = function (command, interpreter)
    {
        var title, message, doNext;
        title = command.getAttribute("title") || "Alert!";
        message = command.getAttribute("message") || "Alert!";
        message = module.tools.textToHtml(message);
        doNext = command.getAttribute("next") === "false" ? false : true;
        module.tools.ui.alert(
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
    };
    
    module.commands.confirm = makeInputFn("confirm");
    module.commands.prompt = makeInputFn("prompt");
}(WSE));