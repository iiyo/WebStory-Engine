(function (out)
{
    out.assets.Audio = function (asset, interpreter)
    {
        var self, sources, i, len, j, jlen, current, track, trackName;
        var trackFiles, href, type, source, tracks, bus;

        bus = interpreter.bus;
        self = this;
        this.au = new Audio();
        this.au.setAttribute("preload", "auto");
        this.bus = bus;
        this.name = asset.getAttribute("name");
        this.tracks = {};
        this.current = null;
        this.currentIndex = null;
        this.autopause = asset.getAttribute("autopause") === "true" ? true : false;
        this.loop = asset.getAttribute("loop") === "true" ? true : false;
        this.fade = asset.getAttribute("fade") === "true" ? true : false;
        this.id = out.tools.getUniqueId();

        tracks = asset.getElementsByTagName("track");
        len = tracks.length;

        if (len < 1)
        {
            this.bus.trigger("wse.interpreter.warning",
            {
                element: asset,
                message: "No tracks defined for audio element '" + this.name + "'."
            });
            
            return {
                doNext: true
            };
        }

        for (i = 0; i < len; i += 1)
        {
            current = tracks[i];
            sources = current.getElementsByTagName("source");
            jlen = sources.length;

            if (jlen < 1)
            {
                this.bus.trigger("wse.interpreter.warning",
                {
                    element: asset,
                    message: "No sources defined for track '" + trackName + "' in audio element '" + this.name + "'."
                });
                continue;
            }

            track = new Audio();
            track.setAttribute("preload", "auto");
            trackFiles = {};
            trackName = current.getAttribute("title");

            if (trackName === null)
            {
                this.bus.trigger("wse.interpreter.warning",
                {
                    element: asset,
                    message: "No title defined for track '" + trackName + "' in audio element '" + this.name + "'."
                });
                continue;
            }

            for (j = 0; j < jlen; j += 1)
            {
                source = sources[j];
                href = source.getAttribute("href");
                type = source.getAttribute("type");

                if (href === null)
                {
                    this.bus.trigger("wse.interpreter.warning",
                    {
                        element: asset,
                        message: "No href defined for source in track '" + trackName + "' in audio element '" + this.name + "'."
                    });
                    continue;
                }

                if (type === null)
                {
                    this.bus.trigger("wse.interpreter.warning",
                    {
                        element: asset,
                        message: "No type defined for source in track '" + trackName + "' in audio element '" + this.name + "'."
                    });
                    continue;
                }

                trackFiles[type] = href;
            }

            // Progress bar doesn't work... because audio/video get streamed?
            /*
             * this.bus.trigger("wse.assets.loading.increase");
             * out.tools.attachEventListener(track, 'load', function() { self.bus.trigger("wse.assets.loading.decrease"); });*/

            if (track.canPlayType("audio/mpeg") && typeof trackFiles.mp3 !== "undefined")
            {
                track.src = trackFiles.mp3;
            }
            else
            {
                if (typeof trackFiles.ogg === "undefined")
                {
                    this.bus.trigger("wse.interpreter.warning",
                    {
                        element: asset,
                        message: "No usable source found for track '" + trackName + "' in audio element '" + this.name + "'."
                    });
                    continue;
                }
                track.src = trackFiles.ogg;
            }
            
            document.body.appendChild(track);

            this.tracks[trackName] = track;
        }

        this.isPlaying = false;

        // We need to reload the audio element because stupid Chrome is too dumb to loop.
        this.renewCurrent = function ()
        {
            var dupl, src;
            
            dupl = new Audio();
            dupl.setAttribute("preload", "auto");
            src = self.current.src;
            
            try
            {
                document.body.removeChild(self.current);
            }
            catch (e)
            {
                console.log(e);
            }
            
            dupl.src = src;
            self.current = dupl;
            self.tracks[self.currentIndex] = dupl;
            document.body.appendChild(dupl);
        };

        this.play = function (command)
        {
            command = command || document.createElement("div");
            var fade = command.getAttribute("fade") === "true" ? true : this.fade;

            if (self.current === null)
            {
                this.bus.trigger("wse.interpreter.warning",
                {
                    element: asset,
                    message: "No usable source found for track '" + trackName + "' in audio element '" + this.name + "'."
                });
                return;
            }

            if (self.isPlaying === true)
            {
                self.stop(command);
            }

            self.isPlaying = true;

            if (self.loop === true)
            {
                out.tools.attachEventListener(
                self.current, 'ended', function ()
                {
                    self.renewCurrent();
                    setTimeout(function ()
                    {
                        self.play();
                    }, 0);
                });
            }
            else
            {
                out.tools.attachEventListener(
                self.current, 'ended', function ()
                {
                    self.isPlaying = false;
                });
            }

            if (fade === true)
            {
                self.current.volume = 0.0001;
                self.current.play();
                self.fadeIn();
            }
            else
            {
                self.current.play();
            }

            this.bus.trigger("wse.assets.audio.play", this);

            return {
                doNext: true
            };
        };

        this.stop = function ()
        {
            if (self.current === null)
            {
                this.bus.trigger("wse.interpreter.warning",
                {
                    element: asset,
                    message: "No track set for audio element '" + this.name + "'."
                });
                
                return {
                    doNext: true
                };
            }
            
            if (self.fade === true)
            {
                self.fadeOut(
                    function ()
                    {
                        self.current.pause();
                        self.currentTime = 0.1;
                        self.renewCurrent();
                        self.isPlaying = false;
                    }
                );
            }
            else
            {
                self.current.pause();
                self.currentTime = 0.1;
                self.renewCurrent();
                self.isPlaying = false;
            }
            
            this.bus.trigger("wse.assets.audio.play", this);
            
            return {
                doNext: true
            };
        };

        this.pause = function ()
        {
            this.current.pause();
            
            return {
                doNext: true
            };
        };

        this.fadeIn = function ()
        {
            var fn;
            
            fn = function ()
            {
                if (self.current.volume > 0.99)
                {
                    self.current.volume = 1;
                    return;
                }
                
                self.current.volume += 0.01;
                setTimeout(fn, 10);
            };
            
            setTimeout(fn, 10);
            
            return {
                doNext: true
            };
        };

        this.fadeOut = function (cb)
        {
            var fn;
            cb = typeof cb === "function" ? cb : function () {};

            fn = function ()
            {
                if (self.current.volume < 0.01)
                {
                    self.current.volume = 0;
                    cb();
                    return;
                }
                
                self.current.volume -= 0.01;
                setTimeout(fn, 10);
            };

            setTimeout(fn, 10);
            
            return {
                doNext: true
            };
        };

        if (this.autopause === false)
        {
            //console.log("autopause is false");
            return;
        }

        out.tools.attachEventListener(
        window, 'blur', function ()
        {
            //console.log("onblur function for audio called");
            if (self.isPlaying === true)
            {
                self.fadeOut(function ()
                {
                    self.current.pause();
                });
            }
        });

        out.tools.attachEventListener(
        window, 'focus', function ()
        {
            //console.log("onfocus function for audio called");
            if (self.isPlaying === true)
            {
                self.current.play();
                self.fadeIn();
            }
        });

        this.bus.trigger("wse.assets.audio.constructor", this);
    };

    out.assets.Audio.prototype.set = function (command)
    {
        var name, isPlaying, self;

        self = this;
        name = command.getAttribute("track");
        isPlaying = this.isPlaying === true && this.loop === true ? true : false;

        if (typeof this.tracks[name] === "undefined" || this.tracks[name] === null)
        {
            this.bus.trigger("wse.interpreter.warning",
            {
                element: command,
                message: "Unknown track '" + name + "' in audio element '" + this.name + "'."
            });
            
            return {
                doNext: true
            };
        }

        if (this.isPlaying === true)
        {
            this.stop();
        }

        this.currentIndex = name;
        this.current = this.tracks[name];

        if (isPlaying === true)
        {
            if (this.fade === true)
            {
                setTimeout(function ()
                {
                    self.play();
                }, 1010);
            }
            else
            {
                this.play();
            }
        }
        
        this.bus.trigger("wse.assets.audio.set", this);
        
        return {
            doNext: true
        };
    };

    out.assets.Audio.prototype.save = function (obj)
    {
        obj[this.id] = {
            assetType: "Audio",
            isPlaying: this.isPlaying,
            fade: this.fade,
            currentIndex: this.currentIndex,
            currentTime: 0
        };
        
        if (this.isPlaying)
        {
            obj[this.id].currentTime = this.current.currentTime;
        }
        
        this.bus.trigger("wse.assets.audio.save", this);
    };

    out.assets.Audio.prototype.restore = function (obj)
    {
        var vals;
        
        vals = obj[this.id];
        this.isPlaying = vals.isPlaying;
        this.fade = vals.fade;
        this.currentIndex = vals.currentIndex;
        this.current.currentTime = vals.currentTime;
        
        if (this.isPlaying)
        {
            this.play();
        }
        else
        {
            this.stop();
        }
        
        this.bus.trigger("wse.assets.audio.restore", this);
    };

}(WSE));