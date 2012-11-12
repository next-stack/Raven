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
  Raven.constrain3(this.pos, min, max);
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
  this.strength = new Raven.Vec3(0.1, 0.1, 0.1);
  this.type = Raven.Physics.F_GRAVITY;
  return this;
}

// Linear Force
Raven.Physics.LinearForce = function() {
  this.pos = new Raven.Vec3.zero();
  this.size = 100;
  this.strength = new Raven.Vec3(0.1, 0.1, 0.1);
  this.type = Raven.Physics.F_LINEAR;
  this.direction = 0;
  this.directionStrength = 1;
  return this;
}

// Rotational Force
Raven.Physics.RotationalForce = function() {
  this.pos = new Raven.Vec3.zero();
  this.size = 100;
  this.strength = new Raven.Vec3(0.1, 0.1, 0.1);
  this.type = Raven.Physics.F_ROTATIONAL;
  this.rotationStrength = -45;
  return this;
}

Raven.Physics.Force.prototype.applyForce = function(particle, dist, length, effect) {
  dist = dist.divideN(length);
  particle.acc = particle.acc.add(dist.multiply(effect));
  if(length < 1 && particle.movement() < 0.5) particle.alive = false; // kill particle if dormant
  return this;
}

Raven.Physics.LinearForce.prototype.applyForce = function(particle, dist, length, effect) {
  var phi = Raven.degreesToRadians(this.direction);
  particle.vel.x += Math.cos(phi) * effect.x * this.directionStrength;
  particle.vel.y += Math.sin(phi) * effect.y * this.directionStrength;
  return this;
}

Raven.Physics.RotationalForce.prototype.applyForce = function(particle, dist, length, effect) {
  var phi = Raven.getAngleRad(dist, dist, new Raven.Vec2.zero()) + Raven.degreesToRadians(this.rotationStrength);
  particle.vel.x += Math.cos(phi) * effect.x;
  particle.vel.y += Math.sin(phi) * effect.y;
  return this;
}

Raven.Physics.Force.prototype.update =
Raven.Physics.LinearForce.prototype.update =
Raven.Physics.RotationalForce.prototype.update = function(particleList) {
  var total = particleList.length;
  if(total < 1) return;
  
  var eff; // vec3
  var len; // num
  var p; // Particle iterator
  for(var i = 0; i < total; ++i) {
    p = particleList[i];
    var dist = p.difference(this);
    len = dist.length();
    if(len < this.size) {
      len = Math.sqrt(len);
      eff = this.strength.multiplyN((1.0 - (len / this.size)));
      this.applyForce(p, dist, len, eff);
    }
  }
}

//

Raven.Physics.ParticleController = function() {
  this.forces = [];
  this.particles = [];
  this.time = Raven.Vec3.one();
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
  
  var minBounds = Raven.Vec2.zero();
  var maxBounds = new Raven.Vec2(Raven.View.width, Raven.View.height);
  var d = 0.01;
  var dampen = new Raven.Vec3(d,d,d);
  
  for(i = 0; i < this.totalParticles(); ++i) {
    this.particles[i].update(this.time);
    this.particles[i].dampen(dampen);
    this.particles[i].wrap(minBounds, maxBounds);
    if(!this.particles[i].alive || Raven.roundTo(this.particles[i].movement(), 100) == 0) this.removeParticle(i);
  }
}
