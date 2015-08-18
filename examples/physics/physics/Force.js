/*************************************************
 * Linear Force
 * strength > 0 = attract
 * strength < 0 = repel
 ************************************************/

function Force() {
    this.angle    = 0;
    this.strength = 1;
    return this;
};

Force.prototype.update = function(particles) {
    var i, total = particles.length;
    var p, diff, len, effect;
    for(i = 0; i < total; ++i) {
        p = particles[i];
        Force.applyForce(p, this.angle, this.strength);
    }
    return this;
};

Force.applyForce = function(particle, ang, effect) {
    var angle = Raven.degToRad(ang);
    particle.force(angle, effect);
};

Force.prototype.constructor = Force;

/*************************************************
 * Radial Force
 ************************************************/

function RadialForce() {
    this.pos      = new Raven.Vec(0, 0, 0);
    this.radius   = 100;
    this.strength = 1;
    return this;
};

RadialForce.prototype.constructor = RadialForce;

RadialForce.prototype.update = function(particles) {
    var i, total = particles.length;
    var p, diff, len, effect;
    for(i = 0; i < total; ++i) {
        p = particles[i];
        diff = p.pos.difference(this.pos);
        len = diff.length();
        if(len > 0 && len < this.radius) {
            len = Math.sqrt(len);
            effect = (1 - (len / this.radius)) * this.strength;
            RadialForce.applyForce(p, this.pos, effect);
        }
    }
    return this;
};

RadialForce.applyForce = function(particle, pos, effect) {
    var angle = pos.angleRad(particle.pos);
    particle.force(angle, effect);
};
