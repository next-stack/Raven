var Raven = Raven || {};

Raven.Physics = function() {}

Raven.Physics.Particle = function(px, py, pz) {
  this.alive = true;
  this.acc  = Raven.Vec3.zero();  // acceleration
  this.vel  = Raven.Vec3.zero();  // velocity
  this.pos  = new Raven.Vec3(px ? px : 0, py ? py : 0, pz ? pz : 0); // position
  this.prev = this.pos.copy();  // previous position
}

Raven.Physics.Particle.prototype.reset = function() {
  this.acc = Raven.Vec3.zero();
  return this;
}

Raven.Physics.Particle.prototype.constrain = function(min, max) {
  Raven.lerp3(this.pos, min, max);
  return this;
}

Raven.Physics.Particle.prototype.inBounds = function(min, max) {
  this.alive = Raven.inBounds(this.pos.x, this.pos.y, min.x, min.y, max.x, max.y);
  return this;
}

Raven.Physics.Particle.prototype.wrap = function(min, max) {
  Raven.wrap3(this.pos, min, max);
  return this;
}

Raven.Physics.Particle.prototype.movement = function() {
  return this.acc.length() + this.vel.length();
}

Raven.Physics.Particle.prototype.update = function(time) {
  this.prev = this.pos;
  this.vel = this.vel.add(this.acc.multiply(time));
  this.acc = Raven.Vec3.zero();
  this.pos = this.pos.add(this.vel.multiply(time));
  return this;
}

Raven.Physics.Particle.prototype.difference = function(p) {
  return new Raven.Vec3(Raven.difference(this.pos.x, p.pos.x), Raven.difference(this.pos.y, p.pos.y), Raven.difference(this.pos.z, p.pos.z));
}

Raven.Physics.Particle.prototype.dampen = function(vecAmt) {
  this.acc = this.acc.subtract(this.vel.multiply(vecAmt));
  return this;
}

////////// Forces
// Force types
Raven.Physics.F_GRAVITY = 0;
Raven.Physics.F_LINEAR = 1;
Raven.Physics.F_ROTATIONAL = 2;

// Basic Force
Raven.Physics.Force = function() {
  this.pos = new Raven.Vec3.zero();
  this.size = 100;
  this.strength =0.1;
  this.type = Raven.Physics.F_GRAVITY;
  return this;
}

// Linear Force
Raven.Physics.LinearForce = function() {
  this.pos = new Raven.Vec3.zero();
  this.size = 100;
  this.strength = 0.1;
  this.type = Raven.Physics.F_LINEAR;
  this.direction = 0;
  this.directionStrength = 1;
  return this;
}

// Rotational Force
Raven.Physics.RotationalForce = function() {
  this.pos = new Raven.Vec3.zero();
  this.size = 100;
  this.strength = 0.1;
  this.type = Raven.Physics.F_ROTATIONAL;
  this.rotationStrength = -45;
  return this;
}

//////////

Raven.Physics.Force.applyForce = function(particle, dist, length, effect) {
  dist = dist.divideN(length);
  particle.acc = particle.acc.subtract(dist.multiplyN(effect));
  return particle;
}

Raven.Physics.LinearForce.applyForce = function(particle, dist, length, effect, direction, directionStrength) {
  var phi = Raven.degToRad(direction);
  particle.vel.x += Math.cos(phi) * effect * directionStrength;
  particle.vel.y += Math.sin(phi) * effect * directionStrength;
  return particle;
}

Raven.Physics.RotationalForce.applyForce = function(particle, dist, length, effect, rotationStrength) {
  var phi = Raven.getAngleRad(dist, new Raven.Vec2.zero()) + Raven.degToRad(rotationStrength);
  particle.vel.x += Math.cos(phi) * effect;
  particle.vel.y += Math.sin(phi) * effect;
  return particle;
}

//////////

Raven.Physics.Force.prototype.applyForce = function(particle, dist, length, effect) {
  Raven.Physics.Force.applyForce(particle, dist, length, effect);
  return this;
}

Raven.Physics.LinearForce.prototype.applyForce = function(particle, dist, length, effect) {
  Raven.Physics.LinearForce.applyForce(particle, dist, length, effect, this.direction, this.directionStrength);
  return this;
}

Raven.Physics.RotationalForce.prototype.applyForce = function(particle, dist, length, effect) {
  Raven.Physics.RotationalForce.applyForce(particle, dist, length, effect, this.rotationStrength);
  return this;
}

//////////

// Each array item requires a vec3 "pos" instance (Particle.pos / Force.pos as examples)
Raven.Physics.Force.prototype.update =
Raven.Physics.LinearForce.prototype.update = function(arrList) {
  var total = arrList.length;
  if(total < 1) return;
  
  var eff; // vec3
  var len; // num
  var p; // Particle iterator
  var dist;
  for(var i = 0; i < total; ++i) {
    p = arrList[i];
    dist = p.difference(this);
    len = dist.length();
    
    if(len < this.size) {
      len = Math.sqrt(len);
      eff = this.strength * (1.0 - (len / this.size));
      this.applyForce(p, dist, len, eff);
      
      if(len < 1 && p.movement() < 0.5) p.alive = false; // kill particle if dormant
    }
  }
}

Raven.Physics.RotationalForce.prototype.update = function(arrList) {
  var total = arrList.length;
  if(total < 1) return;
  
  var eff; // vec3
  var len; // num
  var p; // Particle iterator
  for(var i = 0; i < total; ++i) {
    p = arrList[i];
    len = Raven.distance3D(p.pos.x, p.pos.y, p.pos.z, this.pos.x, this.pos.y, this.pos.z);
    if(len < this.size) {
      len = Math.sqrt(len);
      eff = this.strength * (1.0 - (len / this.size));
      this.applyForce(p, p.difference(this), len, eff);
      if(len < 1 && p.movement() < 0.5) p.alive = false; // kill particle if dormant
    }
  }
}

//

Raven.Physics.ParticleController = function() {
  this.dampen = Raven.Vec3.zero();
  this.forces = [];
  this.particles = [];
  this.time = Raven.Vec3.one();
  this.minBounds = Raven.Vec3.zero();
  this.maxBounds = Raven.Vec3.one();
  this.wrap = true;
}

Raven.Physics.ParticleController.prototype.addParticle = function(p) {
  this.particles.push(p);
}

Raven.Physics.ParticleController.prototype.addParticlePos = function(x, y, z) {
  this.addParticle(new Raven.Physics.Particle(x, y, z));
}

Raven.Physics.ParticleController.prototype.removeParticle = function(index) {
  this.particles.splice(index, 1);
}

Raven.Physics.ParticleController.prototype.removeDeadParticles = function() {
  for(var i = 0; i < this.totalParticles(); ++i) {
    // || Raven.roundTo(this.particles[i].movement(), 100) == 0
    if(!this.particles[i].alive) this.removeParticle(i);
  }
}

Raven.Physics.ParticleController.prototype.totalParticles = function() {
  return this.particles.length;
}

Raven.Physics.ParticleController.prototype.addForce = function(f) {
  this.forces.push(f);
}

Raven.Physics.ParticleController.prototype.removeForce = function(index) {
  this.forces.splice(index, 1);
}

Raven.Physics.ParticleController.prototype.totalForces = function() {
  return this.forces.length;
}

Raven.Physics.ParticleController.prototype.update = function() {
  var total = this.totalForces();
  for(var i = 0; i < total; ++i) {
    this.forces[i].update(this.particles);
  }
  
  for(i = 0; i < this.totalParticles(); ++i) {
    this.particles[i].update(this.time);
    this.particles[i].dampen(this.dampen);
    if(this.wrap) {
      this.particles[i].wrap(this.minBounds, this.maxBounds);
    } else {
      this.particles[i].inBounds(this.minBounds, this.maxBounds);
    }
  }
}
