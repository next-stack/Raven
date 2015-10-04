var Raven = Raven || {};

Raven.Particle = function(x, y, z) {
    this.pos  = new Raven.Vec(0, 0, 0);
    this.prev = this.pos.copy();
    // Physics
    this.acc      = new Raven.Vec(0, 0, 0);
    this.vel      = new Raven.Vec(0, 0, 0);
    this.friction = 0.7;
    this.mass     = 8.0;
    this.bounce   = 0.8;
    this._target  = {
        'hasTarget': false,
        'value': new Raven.Vec(0, 0, 0)
    };
    return this;
};

Raven.Particle.PRECISION = 0.01;

Raven.Particle.prototype.update = function(time) {
    var t = time !== undefined ? time : 1;
    // //
    this.prev = this.pos.copy();
    // this.vel  = this.vel.add( this.acc.multiply( t ) );
    // this.pos  = this.pos.add( this.vel.multiply( t ) );
    // this.acc.set(0, 0, 0);
    if(this._target.hasTarget) {
        var force = this.pos.subtract( this._target.value ).multiply(-this.bounce);
        this.acc  = force.divide( this.mass );
    }
    this.vel  = this.vel.add( this.acc ).multiply( this.friction ).multiply( t );
    this.pos  = this.pos.add( this.vel ).multiply( t );
    this.acc.set(0, 0, 0);
    return this;
};

//////////////////////////////////////////////////
// Getters

Raven.Particle.prototype.__defineGetter__("complete", function() {
    return this.vel.length() < Raven.Particle.PRECISION;
});

Raven.Particle.prototype.__defineGetter__("target", function() {
    if(!this._target.hasTarget) return undefined;
    return this._target.value;
});

//////////////////////////////////////////////////
// Setters

Raven.Particle.prototype.__defineSetter__("target", function(val) {
    this._target.hasTarget = true;
    this._target.value = val;
});
