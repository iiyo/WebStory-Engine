(function (engine)
{
    "use strict";

    console.log('Loading extension particles...');
    
    engine.assets.Particles = function (asset, interpreter)
    {
        this.id = engine.tools.getUniqueId();

        this.interpreter = interpreter;
        this.stage = interpreter.stage;
        this.bus = interpreter.bus;
        this.asset = asset;
        this.cssid = asset.getAttribute("name");
        this.isAnimation = true;

        var element = document.createElement("div");

        element.style.opacity = 0;
        element.style.position = "absolute";
        element.style.left = "0px";
        element.style.top = "0px";
        element.style.width = this.stage.offsetWidth + "px"
        element.style.height = this.stage.offsetHeight + "px"
        element.style.zIndex = "1000";
        element.draggable = false; 
        element.id = asset.getAttribute("name");

        this.text = asset.getAttribute("text") || "*";
        this.img = asset.getAttribute("src") || null;
        this.nParticles = asset.getAttribute("n") || 50;
        this.dx = asset.getAttribute("wind") || 100;
        this.dy = asset.getAttribute("speed") || 150;

        this.isRunning = false;

        this.stage.appendChild(element); 
        this.bus.trigger("wse.assets.particles.constructor", this);
    };

    engine.assets.Particles.prototype.ParticleSnow=function(
            xmingen,  xmaxgen,  ymingen,  ymaxgen,
            xminlive, xmaxlive, yminlive, ymaxlive,
            dxmax, dymax, depthmax
        )
    {
        this.xmingen = xmingen;
        this.xmaxgen = xmaxgen;
        this.ymingen = ymingen;
        this.ymaxgen = ymaxgen;
        this.xminlive = xminlive;
        this.xmaxlive = xmaxlive;
        this.yminlive = yminlive;
        this.ymaxlive = ymaxlive;
        this.dxmax = dxmax;
        this.dymax = dymax;
        this.depthmax = depthmax;

        this.create=function()
        {
            var depth = Math.floor(Math.random() * (10)) + 1;
            var depth_speed = 1.5-depth/(this.depthmax+0.0)
            this.dx = ( Math.random()*(2.0) - 1.0 ) * depth_speed * this.dxmax;
            this.dy = depth_speed * this.dymax;
            this.x = Math.floor(Math.random() * (this.xmaxgen - this.xmingen + 1)) + this.xmingen;
            this.y = Math.floor(Math.random() * (this.ymaxgen - this.ymingen + 1)) + this.ymingen;
            this.time = +new Date();
            this.a = 1.1 - depth/(this.depthmax+0.0);
            if (this.a > 1.0)
                this.a = 1.0;
        }
        this.update=function() 
        {   
            if ( this.x === undefined )
                return this.create();

            var dt = +new Date() - this.time;
            this.x += this.dx*(dt/1000);
            this.y += this.dy*(dt/1000);
            this.time += dt;
            if ( this.x < this.xminlive || this.x > this.xmaxlive || this.y < this.yminlive || this.y > this.ymaxlive )
                this.create();
        }
    };


    engine.assets.Particles.prototype.start = function ()
    {
        if ( this.isRunning )
            return;

        var node = document.getElementById(this.cssid);

        this.particles = [];
        for(var i=0; i<this.nParticles; i++)
        {
            this.particles[i] = new this.ParticleSnow(0,this.stage.offsetWidth, 0,0, 0,this.stage.offsetWidth, 0,this.stage.offsetHeight, this.dx,this.dy, 10);
            var div = document.createElement("div");
            div.style.position = "absolute";
            div.style.left = this.particles[i].x + "px";
            div.style.top = this.particles[i].y + "px";
            div.style.opacity = 0.0;
            div.draggable = false;
            if ( this.img === null )
                div.innerText = "*";
            else
                div.innerHTML = "<img src='" + this.img + "'/>";
            node.appendChild(div);
        }

        node.style.opacity = 1;

        this.cbs = [];

        var self = this;
        self.cbs.push(function ()
        {
            var children, i;
            children = node.getElementsByTagName("div");
            console.log(children.length);
            for (i = 0; i < children.length; i++)
            {
                self.particles[i].update();
                children[i].style.opacity = self.particles[i].a;
                children[i].style.left = Math.floor(self.particles[i].x / self.particles[i].a ) + "px";
                children[i].style.top = Math.floor(self.particles[i].y / self.particles[i].a ) + "px";
                children[i].style.zoom = Math.floor(self.particles[i].a * 100) + "%";
            }
            return [];
        });

        this.anim = new engine.fx.Animation(this.cbs);

        this.anim.start();
        this.isRunning = true;
        console.log("start");
        this.bus.trigger("wse.assets.particles.started", this);
    };

    engine.assets.Particles.prototype.stop = function ()
    {
        if ( !this.isRunning )
            return;

        var node = document.getElementById(this.cssid);
        while (node.hasChildNodes()) {
            node.removeChild(node.lastChild);
        }
        node.style.opacity = 0;

        this.anim.stop();
        this.isRunning = false;
        console.log("stop");
        this.bus.trigger("wse.assets.particles.stopped", this);
    };

    engine.assets.Particles.prototype.save = function ()
    {
        var obj = {
            assetType: "Particles",
            isRunning: this.isRunning,
            cssid: this.cssid,

            text: this.txt,
            img: this.img,
            dx: this.dx,
            dy: this.dy,
            nParticles: this.nParticles,
            name: this.name,
        };
        
        return obj;
    };

    engine.assets.Particles.prototype.restore = function (obj)
    {
        this.isRunning = obj.isRunning;
        this.cssid = obj.cssid;

        this.text = obj.txt;
        this.img = obj.img;
        this.dx = obj.dx;
        this.dy = obj.dy;
        this.nParticles = obj.nParticles;
        this.name = obj.name;

        if (this.isRunning === true)
            this.start();
    };
    
    engine.tools.mixin(engine.assets.mixins.displayable, engine.assets.Particles.prototype);
}(WSE));