/*
    Copyright (c) 2012, 2013 The WebStory Engine Contributors
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
(function (out)
{
    "use strict";
    
    out.commands["var"] = function (command, interpreter)
    {
        var key, val, action, container;

        interpreter.bus.trigger(
            "wse.interpreter.commands.var",
            {
                interpreter: interpreter,
                command: command
            },
            false
        );

        command = command || {};
        key = command.name || null;
        val = command.value || null;
        action = command.action || "set";

        if (key === null)
        {
            interpreter.bus.trigger("wse.interpreter.warning",
            {
                element: command,
                message: "Command 'var' must have a 'name' attribute."
            });
            return {
                doNext: true
            };
        }

        if (action !== "set" && action !== "delete" && action !== "increase" && action !== "decrease" && action !== "print")
        {
            interpreter.bus.trigger("wse.interpreter.warning",
            {
                element: command,
                message: "Unknown action '" + action + "' defined on 'var' command."
            });
            return {
                doNext: true
            };
        }

        container = interpreter.runVars;

        if (action !== "set" && !(key in container))
        {
            interpreter.bus.trigger("wse.interpreter.warning",
            {
                element: command,
                message: "Undefined variable."
            });
            return {
                doNext: true
            };
        }

        switch (action)
        {
        case "delete":
            delete container[key];
            break;
        case "increase":
            container[key]++;
            break;
        case "decrease":
            container[key]--;
            break;
        case "print":
            interpreter.bus.trigger("wse.interpreter.message", "Variable '" + key + "' is: " + container[key]);
            break;
        default:
            container[key] = "" + val;
        }

        return {
            doNext: true
        };
    };    
}(WSE));
