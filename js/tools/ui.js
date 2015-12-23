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
                //                     interpreter.keysDisabled -= 1;
                
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
            //             interpreter.keysDisabled += 1;
            
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