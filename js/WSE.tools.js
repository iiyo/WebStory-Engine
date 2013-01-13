(function (out)
{
    out.tools = out.tools || {};
    
    /**
     * Attaches a DOM Event to a DOM Element.
     * 
     * FIXME: Is this even needed? Supported browsers should all 
     * have .addEventListener()...
     */
    out.tools.attachEventListener = function (elem, type, listener)
    {
        if (elem === null || typeof elem === "undefined")
        {
            return;
        }
        if (elem.addEventListener)
        {
            elem.addEventListener(type, listener, false);
        }
        else if (elem.attachEvent)
        {
            elem.attachEvent("on" + type, listener);
        }
    };
    
    /**
     * Removes a DOM Event from a DOM Element.
     */
    out.tools.removeEventListener = function (elem, type, listener)
    {
        if (typeof elem === "undefined" || elem === null)
        {
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
    out.tools.replaceVariables = function (text, interpreter)
    {
        var f1, f2;
        
        f1 = function ()
        {
            var name = arguments[1];
            
            if (interpreter.globalVars.has(name))
            {
                return "" + interpreter.globalVars.get(name);
            }
            
            return "";
        };
        
        f2 = function ()
        {
            var name = arguments[1];
            
            if (name in interpreter.runVars)
            {
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
    
    /**
     * Replaces { and } to < and > for making it HTML.
     * Optionally replaces newlines with <break> elements.
     * 
     * @param text [string] The text to convert to HTML.
     * @param nltobr [bool] Should newlines be converted to breaks? Default: false.
     */
    out.tools.textToHtml = function (text, nltobr)
    {
        nltobr = nltobr || false;
        
        if (!(String.prototype.trim))
        {
            text = text.replace(/^\n/, "");
            text = text.replace(/\n$/, "");
        }
        else
        {
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
    out.tools.getUniqueId = (function ()
    {
        var uniqueIdCount = 0;
        
        return function ()
        {
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
    out.tools.firstLetterUppercase = function (input)
    {
        if (input.length < 1)
        {
            return "";
        }
        
        return "" + input.charAt(0).toUpperCase() + input.replace(/^.{1}/, "");
    };
    
}(WSE));