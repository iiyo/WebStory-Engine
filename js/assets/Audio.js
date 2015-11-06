/* global using, Howl */

using("MO5.CoreObject", "WSE.tools::warn").
define("WSE.assets.Audio", function (CoreObject, warn) {
    
    "use strict";
    
    /**
     * Constructor for the <audio> asset.
     * 
     * @param asset [XML DOM Element] The asset definition.
     * @param interpreter [object] The interpreter instance.
     * @trigger wse.interpreter.warning@interpreter
     * @trigger wse.assets.audio.constructor@interpreter
     */
    function Audio (asset, interpreter) {
        
        var self, sources, i, len, j, jlen, current, track, trackName;
        var trackFiles, href, type, source, tracks, bus, trackSettings;
        
        CoreObject.call(this);
        
        bus = interpreter.bus;
        self = this;
        
        this.interpreter = interpreter;
        this.bus = bus;
        this.name = asset.getAttribute("name");
        this.tracks = {};
        this.autopause = asset.getAttribute("autopause") === "true" ? true : false;
        this.loop = asset.getAttribute("loop") === "true" ? true : false;
        this.fade = asset.getAttribute("fade") === "true" ? true : false;
        this.fadeinDuration = parseInt(asset.getAttribute("fadein")) || 1000;
        this.fadeoutDuration = parseInt(asset.getAttribute("fadeout")) || 1000;
        this._playing = false;
        
        tracks = asset.getElementsByTagName("track");
        len = tracks.length;
        
        if (len < 1) {
            
            warn(this.bus, "No tracks defined for audio element '" + this.name + "'.", asset);
            
            return {
                doNext: true
            };
        }
        
        // check all sources and create Howl instances:
        for (i = 0; i < len; i += 1) {
            
            current = tracks[i];
            
            trackName = current.getAttribute("title");
            
            if (trackName === null) {
                
                warn(this.bus, "No title defined for track '" + trackName + 
                    "' in audio element '" + this.name + "'.", asset);
                
                continue;
            }
            
            sources = current.getElementsByTagName("source");
            jlen = sources.length;
            
            if (jlen < 1) {
                
                warn(this.bus, "No sources defined for track '" + trackName +
                    "' in audio element '" + this.name + "'.", asset);
                
                continue;
            }
            
            trackSettings = {
                urls: [],
                autoplay: false,
                loop: this.loop || false,
                onload: this.bus.trigger.bind(this.bus, "wse.assets.loading.decrease")
            };
            
            trackFiles = {};
            
            for (j = 0; j < jlen; j += 1) {
                
                source = sources[j];
                href = source.getAttribute("href");
                type = source.getAttribute("type");
                
                if (href === null) {
                    
                    warn(this.bus, "No href defined for source in track '" +
                        trackName + "' in audio element '" + this.name + "'.", asset);
                    
                    continue;
                }
                
                if (type === null) {
                    
                    warn(this.bus, "No type defined for source in track '" + 
                        trackName + "' in audio element '" + this.name + "'.", asset);
                    
                    continue;
                }
                
                trackFiles[type] = href;
                trackSettings.urls.push(href);
                
            }
            
            this.bus.trigger("wse.assets.loading.increase");
            
            track = new Howl(trackSettings);
            
            this.tracks[trackName] = track;
        }
        
        /**
         * Starts playing the current track.
         * 
         * @param command [XML DOM Element] The command as written in the WebStory.
         * @return [object] Object that determines the next state of the interpreter.
         */
        this.play = function (command) {
            
            var fadeDuration;
            
            if (this._playing) {
                return {
                    doNext: true
                };
            }
            
            this._playing = true;
            this._paused = false;
            
            if (command.getAttribute("fadein")) {
                
                this.interpreter.waitCounter += 1;
                fadeDuration = +command.getAttribute("fadein");
                
                this.tracks[this._currentTrack].volume(0);
                this.tracks[this._currentTrack].play();
                
                this.tracks[this._currentTrack].fade(0, 1, fadeDuration, function () {
                    this.interpreter.waitCounter -= 1;
                }.bind(this));
            }
            else {
                this.tracks[this._currentTrack].play();
            }
            
            return {
                doNext: true
            };
        };
        
        /**
         * Stops playing the current track.
         * 
         * @param command [XML DOM Element] The command as written in the WebStory.
         * @return [object] Object that determines the next state of the interpreter.
         */
        this.stop = function (command) {
            
            var fadeDuration;
            
            if (!this._currentTrack) {
                return {
                    doNext: true
                };
            }
            
            this._playing = false;
            this._paused = false;
            
            if (command && command.getAttribute("fadeout")) {
                
                this.interpreter.waitCounter += 1;
                fadeDuration = +command.getAttribute("fadeout");
                
                this.tracks[this._currentTrack].fade(1, 0, fadeDuration, function () {
                    this.tracks[this._currentTrack].stop();
                    this.interpreter.waitCounter -= 1;
                }.bind(this));
            }
            else {
                this.tracks[this._currentTrack].stop();
            }
            
            this.bus.trigger("wse.assets.audio.stop", this);
            
            return {
                doNext: true
            };
        };
        
        /**
         * Pauses playing the curren track.
         * 
         * @return [object] Object that determines the next state of the interpreter.
         */
        this.pause = function () {
            
            if (!this._currentTrack || !this._playing) {
                return {
                    doNext: true
                };
            }
            
            this._paused = true;
            
            this.tracks[this._currentTrack].pause();
            
            return {
                doNext: true
            };
        };
        
        this.bus.trigger("wse.assets.audio.constructor", this);
        
        this.bus.subscribe("wse.interpreter.restart", function () {
            this.stop();
        }.bind(this));
        
        window.addEventListener("blur", function () {
            if (this._playing) {
                this.tracks[this._currentTrack].fade(1, 0, 200);
            }
        }.bind(this));
        
        window.addEventListener("focus", function () {
            if (this._playing) {
                this.tracks[this._currentTrack].fade(0, 1, 200);
            }
        }.bind(this));
    };
    
    Audio.prototype = new CoreObject();
    
    /**
     * Changes the currently active track.
     * 
     * @param command [DOM Element] The command as specified in the WebStory.
     * @trigger wse.interpreter.warning@interpreter
     * @trigger wse.assets.audio.set@interpreter
     */
    Audio.prototype.set = function (command) {
        
        var wasPlaying = false;
        
        if (this._playing) {
            wasPlaying = true;
        }
        
        this.stop();
        
        this._currentTrack = command.getAttribute("track");
        
        if (wasPlaying) {
            this.play(command);
        }
        
        return {
            doNext: true
        };
    };

    /**
     * Gathers the data to put into a savegame.
     * 
     * @param obj [object] The savegame object.
     */
    Audio.prototype.save = function () {
        
        var obj = {
            currentTrack: this._currentTrack,
            playing: this._playing,
            paused: this._paused
        };
        
        this.bus.trigger("wse.assets.audio.save", this);
        
        return obj;
    };

    /**
     * Restore function for loading the state from a savegame.
     * 
     * @param obj [object] The savegame data.
     * @trigger wse.assets.audio.restore@interpreter
     */
    Audio.prototype.restore = function (vals) {
        
        this._playing = vals.playing;
        this._paused = vals.paused;
        this._currentTrack = vals.currentTrack;
        
        if (this._playing && !this._paused) {
            this.tracks[this._currentTrack].play();
        }
        
        this.bus.trigger("wse.assets.audio.restore", this);
    };
    
    return Audio;
    
});