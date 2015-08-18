// App

function AppController(params) {
    Raven.App.apply(this, arguments);

    this.setup = function(viewElement, width, height, renderer) {
        Raven.App.prototype.setup.call(this, viewElement, width, height, renderer);
        this.view.background.set(32, 32, 32);
        this.view.align = Raven.Align.CENTER;

        physics = new ParticleController();
        var vel = 50;
        var i, p;
        var padding = 100;
        for(i = 0; i < 30; ++i) {
            p = new Particle(
                Raven.randRange(padding, width -padding),
                Raven.randRange(padding, height-padding)
            );
            p.vel.set(
                Raven.randRange(-vel, vel),
                Raven.randRange(-vel, vel)
            );
            physics.addParticle( p );
        }

        //
        force = new RadialForce();
        force.pos.set(width/2, height/2);
        force.radius = 200;
        force.strength = -0.2;
        physics.addForce(force);

        var gui = new dat.GUI();
        gui.add(physics, "time", 0, 3);
        gui.add(force, "radius", 0, 300).listen();
        gui.add(force, "strength", -1.0, 1.0).listen();
        gui.add(Particle, "HISTORY", 1, 50);
        //Particle.HISTORY

        return this;
    };

    this.update = function() {
        force.pos.set(this.view.width/2, this.view.height/2);
        force.radius   = Raven.cosRange( -this.frameNum, 300, 10 );
        force.strength = Raven.cosRange(  this.frameNum, 2, -1 );
        physics.update();
        return this;
    }

    this.draw = function() {
        Raven.App.prototype.draw.call(this);
        // Draw code here
        physics.draw(this.view);
        return this;
    };

    var _isDown = false;

    this.onTouchDown = function(id, x, y) {
        _isDown = true;
        redirectParticles(x, y);
    };

    this.onTouchMove = function(id, x, y) {
        if(_isDown) redirectParticles(x, y);
    };

    this.onTouchUp = function(id, x, y) {
        _isDown = false;
        freeflowParticles();
    };

    function redirectParticles(x, y) {
        var tPoint = new Raven.Vec(x, y);
        var i, p, ang,
        total = physics.particles.length,
        vel   = 5;
        for(i = 0; i < physics.particles.length; ++i) {
            p = physics.particles[i];
            p.target = tPoint;
            // Explode a bit
            ang = Raven.degToRad( Math.random() * 360 );
            p.vel.x += Math.cos(ang) * Raven.randRange(0, vel);
            p.vel.y += Math.sin(ang) * Raven.randRange(0, vel);
        }
    }

    function freeflowParticles() {
        var i, p,
        total = physics.particles.length;
        for(i = 0; i < physics.particles.length; ++i) {
            p = physics.particles[i];
            p.vel = p.vel.multiply( 0.5 );
            p.target = undefined;
        }
    }

    return this;
};

AppController.extends( Raven.App );

var physics, gui, force;
var app = new AppController({
    'fullscreen': true,
    'mobile': true
});
app.setup("world", window.innerWidth, window.innerHeight, Raven.VIEW_CANVAS);
app.play();
