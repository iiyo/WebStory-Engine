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
     * Sets the x and y units on an asset object according
     * to it's definition in the WebStory.
     * @param obj The JavaScript object asset.
     * @param asset The XML Element with the asset's information.
     */
    out.tools.applyAssetUnits = function (obj, asset)
    {
        var x, y;
        
        x = asset.x || "";
        y = asset.y || "";
        obj.xUnit = x.replace(/^.*(px|%)$/, '$1');
        obj.xUnit = obj.xUnit || 'px';
        obj.yUnit = y.replace(/^.*(px|%)$/, '$1');
        obj.yUnit = obj.yUnit || 'px';
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
    
    out.tools.mixin = function (source, target)
    {
        var key;
        
        for (key in source)
        {
            if (source.hasOwnProperty(key))
            {
                target[key] = source[key];
            }
        }
    };
    
    out.tools.xmlToJs = function (xml)
    {
        return (function toJs(node)
        {
            var js = {};
            
            [].forEach.call(node.attributes, function (attr)
            {
                js[attr.nodeName] = attr.nodeValue;
            });
            
            if (node.childNodes)
            {
                js.content = (function ()
                {
                    var ser = new XMLSerializer(), nodes = node.childNodes, i, len, text = '';
                    
                    for (i = 0, len = nodes.length; i < len; i += 1)
                    {
                        text += ser.serializeToString(nodes[i]);
                    }
                    
                    return text;
                }());
            }
            
            return js;
        }(xml));
    };

    // Converts strings into XML objects, needed to handle the nested elements within XML tags
    out.tools.stringToXml = function (string)	
    {
		return (function toXml(str)
		{
			var parser, xmlDoc;
			
			// correctly handle multiple tags by enclosing them in a single tag
			str = "<wse>" + str + "</wse>";
			
			if (window.DOMParser)
			{
				  xmlDoc = new DOMParser().parseFromString(str,"text/xml");
			}
			
			else // Internet Explorer
			{
				  xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
				  xmlDoc.async = false;
				  xmlDoc.loadXML(str);
			}

			return xmlDoc;
		}(string));
	};
    
}(WSE));
