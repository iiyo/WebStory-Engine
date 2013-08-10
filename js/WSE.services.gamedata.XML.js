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
    
    out.services = { gamedata: {} };
       
    out.services.gamedata.XML = function (args, callback)
    {
        args = args || null;
        if (typeof args !== 'null')
        {
            this.load(args, callback);
        }
    };
    
    out.services.gamedata.XML.prototype.load = function (args, callback)
    {
        var self;
        
        args = args || {};
        this.url = args.url || "game.xml";
        this.data = null;
        this.scenes = null;
        
        this.host = args.host || false;
        
        if (this.host)
        {
            this.data = (function (url)
            {
                var xml, parser;
                
                parser = new DOMParser();
                xml = this.host.get(url);
                       
                return parser.parseFromString(xml, "application/xml");
            } (this.url));
        }
        else
        {
            self = this;
            out.ajax.get(
                this.url,
                function (obj)
                {
                    var x, y, scenes, setting, settings, outSettings, items, data = obj.responseXML;
                    scenes = data.getElementsByTagName("scene");
                    settings = data.getElementsByTagName("settings");
                    settings = settings[0].childNodes;
                    
                    self.scenes = [];
                    self.settings = { stages: [], options: {}, triggers: [] };
                    outSettings = [];

                    for (x = 0; x < scenes.length; x += 1)
                    {
                        self.scenes[x] = { id: scenes[x].getAttribute("id"), commands: [] };
                        
                        for (y = 0; y < scenes[x].childNodes.length; y += 1)
                        {
                            if (scenes[x].childNodes[y].nodeName !== "#text" && scenes[x].childNodes[y].nodeName !== "#comment")
                            {
                                self.scenes[x].commands.push(self.xmlToJs(scenes[x].childNodes[y]));
                            }
                        }
                    }

                    for (x = 0; x < settings.length; x += 1) 
                    {
                        if (settings[x].nodeName !== "#text" && settings[x].nodeName !== "#comment")
                        {
                            setting = self.xmlToJs(settings[x]);
                            setting.type = settings[x].nodeName;
                            
                            items = [];
                            
                            for (y = 0; y < settings[x].childNodes.length; y += 1)
                            {
                                if (settings[x].childNodes[y].nodeName !== "#text" && settings[x].childNodes[y].nodeName !== "#comment")
                                {
                                    items.push(self.xmlToJs(settings[x].childNodes[y]));
                                }
                            }
                            
                            if (items.length > 0) 
                            {
                                setting.items = items;
                            }
                            
                            if  (settings[x].nodeName === 'stage' && typeof self.stage === 'undefined')
                            {
                                self.settings.stages.push(setting);
                            }
                            
                            if  (settings[x].nodeName === 'triggers' && typeof self.stage === 'undefined')
                            {
                                self.settings.triggers = setting.items;
                            }

                            if  (settings[x].nodeName === 'setting')
                            {
                                self.settings.options[setting.name] = setting.value;
                            }
                        }
                    }

                    if (callback && typeof(callback) === "function") 
                    {
                        callback(self.settings);
                    }
                }
            );
        }    
    };

    out.services.gamedata.XML.prototype.getTriggers = function ()
    {
        return this.settings.triggers;
    };

    out.services.gamedata.XML.prototype.getScene = function (id, input, callback)
    {
        var i, input = input || {};
        for (i = 0; i < this.scenes.length; i += 1)
        {
            if (this.scenes[i].id === id) 
            {
                callback(this.scenes[i]);
            }
        }
    };

    out.services.gamedata.XML.prototype.xmlToJs = function (xml)
    {
        return (function toJs(node)
        {
            var js = { "type" : node.nodeName }, getInnerHTML;

            getInnerHTML = function (node)
            {
                var ser = new XMLSerializer(), innerHTML = "", children = node.childNodes, child; 
                for (child in children) {
                    if (typeof children[child] === 'object') {
                        innerHTML += ser.serializeToString(children[child]);
                    }
                }
                return innerHTML;
            };

            [].forEach.call(node.attributes, function (attr)
            {
                js[attr.nodeName] = attr.nodeValue;
            });
            
            switch(node.nodeName) {
                case "line":
                    js.text = getInnerHTML(node);
                    break;
                case "ops":
                    js.items = [];
                    (function ()
                    {
                        var nodes = node.childNodes, i, len;
                        
                        for (i = 0, len = nodes.length; i < len; i += 1)
                        {
                            if (nodes[i].nodeName === "op") 
                            {
                                js.items.push({ "text" : getInnerHTML(nodes[i]), "to" : toJs(nodes[i]).to });
                            }
                            if (nodes[i].nodeName === "text")
                            {
                                js.text = getInnerHTML(nodes[i]);
                            }
                        }
                    }());
                    break;
                default:
                    js.items = (function ()
                    {
                        var nodes = node.childNodes, i, len, items = [];
                        
                        for (i = 0, len = nodes.length; i < len; i += 1)
                        {
                            if (nodes[i].nodeName !== "#text" && nodes[i].nodeName !== "#comment") 
                            {
                                items.push(toJs(nodes[i]));
                            }
                        }
                        return items;
                    }());
                    break;
            }
            
            return js;
        }(xml));
    };

}(WSE));
