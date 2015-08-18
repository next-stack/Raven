function ParticleController() {
    this.particles = [];
    this.forces    = [];
    this.time      = 1;
    return this;
};

ParticleController.prototype.update = function() {
    this.updateForces();
    this.updateParticles();
    return this;
};

ParticleController.prototype.updateForces = function() {
    var i, f, total = this.forces.length;
    for(i = 0; i < total; ++i) {
        f = this.forces[i];
        f.update(this.particles);
    }
    return this;
};

ParticleController.prototype.updateParticles = function() {
    var i, p, total = this.particles.length;
    for(i = 0; i < total; ++i) {
        p = this.particles[i];
        p.update(this.time);
    }
    return this;
};

ParticleController.prototype.draw = function(g) {
    this.drawForces(g);
    this.drawParticles(g);
    return this;
};

ParticleController.prototype.drawParticles = function(g) {
    g.setStrokeB(102);
    var i, p, total = this.particles.length;
    for(i = 0; i < total; ++i) {
        p = this.particles[i];
        p.drawHistory(g);
        g.drawLine( p.pos.x, p.pos.y, p.pos.x-p.vel.x, p.pos.y-p.vel.y );
    }

    g.setFillRGBA(255, 255, 255, 128);
    g.setStrokeRGBA(255, 255, 255, 128);
    for(i = 0; i < total; ++i) {
        p = this.particles[i];
        g.drawCircle( p.pos.x, p.pos.y, 20, true, true );
        g.drawCircle( p.pos.x, p.pos.y, 8, true );
    }
    return this;
};

ParticleController.prototype.drawForces = function(g) {
    var i, f, a, grad, total = this.forces.length;
    for(i = 0; i < total; ++i) {
        f = this.forces[i];
        grad = g.context.createRadialGradient(f.pos.x, f.pos.y, 0, f.pos.x, f.pos.y, f.radius);
        a = Math.abs(f.strength * 0.5).toString();
        if(f.strength > 0) {
            grad.addColorStop(0, 'rgba(0, 255, 0, ' + a + ')');
            grad.addColorStop(1, 'rgba(0, 255, 0, 0.01)');
        } else {
            grad.addColorStop(0, 'rgba(255, 0, 0, ' + a + ')');
            grad.addColorStop(1, 'rgba(255, 0, 0, 0.01)');
        }
        if(f.constructor === RadialForce) {
            g.context.fillStyle = grad;
            g.setStrokeRGBA(255, 255, 255, 102);
            g.drawCircle( f.pos.x, f.pos.y, f.radius*2, true, true );
        }
    }
    return this;
};

//

ParticleController.prototype.addParticle = function(p) {
    this.particles.push( p );
    return this;
};

ParticleController.prototype.addForce = function(f) {
    this.forces.push( f );
    return this;
};
