/* global using */

using("MO5.transform", "MO5.CoreObject").
define("WSE.LoadingScreen", function (transform, CoreObject) {
    
    function LoadingScreen () {
        
        CoreObject.call(this);
        
        this._loading = 0;
        this._loaded = 0;
        this._max = 0;
        this._finished = false;
        
        this._template = '' + 
            '<div class="container">' + 
                '<div class="logo">' +
                    '<img src="assets/images/logo.png"' +
                        'onerror="this.style.display=\'none\'"/>' +
                '</div>' +
                '<div class="heading">' + 
                    '<span id="WSELoadingScreenPercentage">{$progress}%</span>' + 
                    'Loading...' + 
                '</div>' + 
                '<div class="progressBar">' + 
                    '<div class="progress" id="WSELoadingScreenProgress" ' +
                        'style="width: {$progress}%;">' + 
                    '</div>' + 
                '</div>' + 
            '</div>';
        
        this._container = document.createElement("div");
        this._container.setAttribute("id", "WSELoadingScreen");
        this._container.style.zIndex = 10000;
        this._container.style.width = "100%";
        this._container.style.height = "100%";
        
    }
    
    LoadingScreen.prototype = new CoreObject();
    
    LoadingScreen.prototype.setTemplate = function (template) {
        this._template = template;
    };
    
    LoadingScreen.prototype.addItem = function () {
        
        if (this._finished) {
            return;
        }
        
        console.log("LoadingScreen: new item loading...");
        
        this._loading += 1;
        this._max += 1;
        
        this.update();
    };
    
    LoadingScreen.prototype.count = function () {
        return this._max;
    };
    
    LoadingScreen.prototype.itemLoaded = function () {
        
        if (this._finished) {
            return;
        }
        
        console.log("LoadingScreen: item loaded.");
        
        if (this._loaded === this._max) {
            return;
        }
        
        this._loading -= 1;
        this._loaded += 1;
        
        if (this._loaded === this._max) {
            this._finished = true;
            this.trigger("finished");
        }
        
        this.update();
    };
    
    LoadingScreen.prototype.update = function () {
        
        var progress;
        
        if (this._loaded > this._max) {
            this._loaded = this._max;
        }
        
        progress = parseInt((this._loaded / this._max) * 100, 10);
        
        if (this._max < 1) {
            progress = 0;
        }
        
        this._container.innerHTML = render(this._template, {
            all: this._max,
            remaining: this._max - this._loaded,
            loaded: this._loaded,
            progress: progress
        });
        
    };
    
    LoadingScreen.prototype.show = function (parent) {
        this._container.style.display = "";
        parent.appendChild(this._container);
        this.update();
    };
    
    LoadingScreen.prototype.hide = function () {
        
        var self = this;
        
        function valFn (v) {
            self._container.style.opacity = v;
        }
        
        function finishFn () {
            self._container.style.display = "none";
            self._container.parentNode.removeChild(self._container);
        }
        
        transform(valFn, 1, 0, {
            duration: 500,
            onFinish: finishFn
        });
        
        this._container.style.display = "none";
    };
    
    return LoadingScreen;
    
    function render (template, vars) {
        
        for (var key in vars) {
            template = insertVar(template, key, vars[key]);
        }
        
        return template;
    }
    
    function insertVar (template, name, value) {
        return ("" + template).split("{$" + name + "}").join("" + value);
    }
    
});
