/* global using */

using("MO5.transform").define("WSE.LoadingScreen", function (transform) {
    
    function LoadingScreen () {
        
        var self;
        
        self = this;
        
        this._loading = 0;
        this._loaded = 0;
        this._max = 0;
        
        this._container = document.createElement("div");
        this._container.setAttribute("id", "WSELoadingScreen");
        this._container.style.zIndex = 10000;
        this._container.style.width = "100%";
        this._container.style.height = "100%";
        
        this._container.innerHTML = '' + 
            '<div class="container">' + 
                '<div class="heading">' + 
                    '<span id="WSELoadingScreenPercentage"></span>' + 
                    'Loading assets...' + 
                '</div>' + 
                '<div class="progressBar">' + 
                    '<div class="progress" id="WSELoadingScreenProgress" style="width: 100%;">' + 
                    '</div>' + 
                '</div>' + 
            '</div>';
        
    }
    
    LoadingScreen.prototype.addItem = function () {
        
        this._loading += 1;
        this._max += 1;
        
        this.update();
    };
    
    LoadingScreen.prototype.itemLoaded = function () {
        
        if (this._loaded === this._max) {
            return;
        }
        
        this._loading -= 1;
        this._loaded += 1;
        
        this.update();
    };
    
    LoadingScreen.prototype.update = function () {
        
        var el, el2, perc;
        
        try {
            
            if (this._loaded > this._max) {
                this._loaded = this._max;
            }
            
            el = document.getElementById("WSELoadingScreenProgress");
            el2 = document.getElementById("WSELoadingScreenPercentage");
            perc = parseInt((this._loaded / this._max) * 100, 10);
            
            if (this._max < 1) {
                perc = 0;
            }
            
            el.style.width = perc + "%";
            el2.innerHTML =
                "" + this._loaded + "/" + this._max + " (" + perc + "%)";
        }
        catch (e) {
            console.log("Element missing.");
        }
    };
    
    LoadingScreen.prototype.show = function (parent) {
        this._container.style.display = "";
        parent.appendChild(this._container);
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
        
        document.getElementById("WSELoadingScreenProgress").style.width = "100%";
        
        transform(valFn, 1, 0, {
            duration: 500,
            onFinish: finishFn
        });
        
        this._container.style.display = "none";
    };
    
    return LoadingScreen;
    
});
