function Particle(x, y, z) {
    this.pos      = new Raven.Vec(x, y, z);
    this.history  = [];
    // Physics
    this.acc      = new Raven.Vec(0, 0, 0);
    this.vel      = new Raven.Vec(0, 0, 0);
    this.friction = 0.95;
    this.mass     = 10.0;
    this.bounce   = 0.3;
    this._target  = {
        'hasTarget': false,
        'value': new Raven.Vec(0, 0, 0)
    };
    return this;
};

Particle.PRECISION = 0.02;
Particle.HISTORY   = 1;

Particle.prototype.update = function(time) {
    if(this.history.length >= Particle.HISTORY) {
        this.history = this.history.splice(this.history.length-Particle.HISTORY);
    }
    this.history.push( this.pos.copy() );
    //
    if(this._target.hasTarget) {
        var force = this.pos.subtract( this._target.value ).multiply( -this.bounce );
        this.acc  = force.divide( this.mass );
    }

    this.vel = this.vel.add( this.acc.multiply(time) ).multiply( this.friction ); // add acceleration
    this.pos = this.pos.add( this.vel.multiply(time) ); // add velocity
    // this.pos = this.pos.add( this.vel ); // add velocity
    this.acc.set(0, 0, 0);
    return this;
};

Particle.prototype.drawHistory = function(g) {
    var i, a, b, total = this.history.length-1;
    //g.drawLine( p.pos.x, p.pos.y, p.pos.x-p.vel.x, p.pos.y-p.vel.y );
    for(i = 0; i < total; ++i) {
        a = this.history[i+0];
        b = this.history[i+1];
        g.drawLine(a.x, a.y, b.x, b.y);
    }
    return this;
};

Particle.prototype.force = function(angleRadians, effect) {
    this.vel.x += Math.cos(angleRadians) * effect;
    this.vel.y += Math.sin(angleRadians) * effect;
    return this;
};

//////////////////////////////////////////////////
// Getters

Particle.prototype.__defineGetter__("complete", function() {
    return this.vel.length() < Particle.PRECISION;
});

Particle.prototype.__defineGetter__("target", function() {
    if(!this._target.hasTarget) return undefined;
    return this._target.value;
});

//////////////////////////////////////////////////
// Setters

Particle.prototype.__defineSetter__("target", function(val) {
    if(val === undefined) {
        this._target.hasTarget = false;
    } else {
        this._target.hasTarget = true;
        this._target.value = val;
    }
});
