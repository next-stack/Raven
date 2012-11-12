Raven.Canvas.setBackgroundColorRGB(32, 32, 32);

var app = Raven.makeInstance(Raven.App);
app.fullsize = false;
app.supportMobile = false;

app.isDown = false;

var engine = new Raven.Physics.ParticleController();

app.init = function() {
  this.super.init();
  
  var cStrength = 0.01;
  // Left force
  var aForce = new Raven.Physics.Force();
  aForce.pos.x = 150;
  aForce.pos.y = Raven.View.height / 2;
  aForce.strength = new Raven.Vec3(-cStrength, -cStrength, -cStrength);
  engine.addForce(aForce);
  
  // Center force
  var rForce = new Raven.Physics.Force();
  rForce.pos.x = 400;
  rForce.pos.y = Raven.View.height / 2;
  rForce.direction = 180;
  rForce.directionStrength = 2;
  rForce.strength = new Raven.Vec3(cStrength, cStrength, cStrength);
  engine.addForce(rForce);
  
  // Right force
  var lForce = new Raven.Physics.LinearForce();
  lForce.pos.x = 650;
  lForce.pos.y = Raven.View.height / 2;
  lForce.direction = 180;
  lForce.directionStrength = 2;
  lForce.strength = new Raven.Vec3(cStrength, cStrength, cStrength);
  engine.addForce(lForce);
  
  // Disperse initial particles
  for(var i = 0; i < 100; ++i) {
    this.addParticle(Math.random() * Raven.View.width, Math.random() * Raven.View.height);
  }
}

app.update = function() {
  engine.update();
   // Creates the wipe animation for the linear force
  engine.forces[2].direction = Raven.cosRange(Raven.frameNum, 240, -120);
}

app.addParticle = function(px, py) {
  // Velocity
  var minV = -1.0;
  var maxV =  1.0;
  
  var p = new Raven.Physics.Particle(px, py, 0);
  p.vel = Raven.Vec3.randomRange(minV, minV, 0, maxV, maxV, 0);
  engine.addParticle(p);
}

app.mouseDown = function(mx, my) {
  this.isDown = true;
  this.addParticle(mx, my);
}

app.mouseUp = function(mx, my) {
  this.isDown = false;
}

app.mouseMove = function(mx, my) {
  if(this.isDown) this.addParticle(mx, my);
}

app.render = function() {
  // Show forces
  var totalF = engine.totalForces();
  for(var n = 0; n < totalF; ++n) {
    switch(engine.forces[n].type) {
      case Raven.Physics.F_GRAVITY: Raven.Canvas.setStrokeColorRGBA(255, 0, 0, 102); break;
      case Raven.Physics.F_LINEAR:  Raven.Canvas.setStrokeColorRGBA(0, 0, 255, 102); break;
    }
    Raven.Canvas.drawCircle(engine.forces[n].pos.x, engine.forces[n].pos.y, engine.forces[n].size*2, false, true);
  }
  
  // Show which direction the of the linear force instance
  var lForce = engine.forces[2];
  var phi = Raven.degreesToRadians(lForce.direction);
  var ox = Math.cos(phi) * lForce.size;
  var oy = Math.sin(phi) * lForce.size;
  Raven.Canvas.drawLine(lForce.pos.x, lForce.pos.y, lForce.pos.x + ox, lForce.pos.y + oy);
  
  // Show particles
  Raven.Canvas.setFillColorRGB(255, 255, 255);
  var totalP = engine.totalParticles();
  for(var i = 0; i < totalP; ++i) {
    Raven.Canvas.drawCircle(engine.particles[i].pos.x, engine.particles[i].pos.y, 3, true);
  }
  
  Raven.Canvas.setFillColorRGB(255, 255, 255);
  Raven.Canvas.drawFont("Total Particles: " + engine.totalParticles(), 10, 20);
  Raven.Canvas.drawFont("Attraction force", 110, 425);
  Raven.Canvas.drawFont("Repulsion force", 360, 425);
  Raven.Canvas.drawFont("Linear force: " + Math.round(lForce.direction), 620, 425);
}

app.setup(800, 600); // initial size
app.init();
app.autoRender();