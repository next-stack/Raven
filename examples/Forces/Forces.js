Raven.Canvas.setBackgroundColorRGB(17, 16, 18);

var gui;
var guiParams = {
  fadeSpeed: 0.15,
  lineWidth: 2,
  connectionOpacity: 0.05,
  showForces: true,
  
  attrackScene: false,
  rotateScene: true,
  sceneAttraction: 0.01,
  sceneRotation: 90,
  sceneStrength: 0.25,
  
  attractParticles: false,
  rotateParticles: false,
  particleAttraction: 0.005,
  particleDistance: 100,
  particleRepulsion: 1,
  particleRotation: 5,
  
  dampening: 0.075
};

var app = Raven.makeInstance(Raven.App);
app.fullsize = true;
app.autoClear = false;
app.supportMobile = false;

// Physics
var engine = Raven.makeInstance(Raven.Physics.ParticleController);
var centerGravityForce = new Raven.Physics.Force();
var centerRotationalForce = new Raven.Physics.RotationalForce();

app.addParticle = function(pos) {
  var p = new Raven.Physics.Particle(pos.x, pos.y, pos.z);
  p.vel = Raven.Vec3.randomRange(-1, -1, 0, 1, 1, 0);
  p.col = Raven.Vec3.randomRange(102, 102, 102, 255, 255, 255).round();
  engine.addParticle(p);
}

app.addParticles = function(num) {
  for(var i = 0; i < num; ++i) this.addParticle( Raven.Vec3.randomRange(0, 0, 0, Raven.View.width, Raven.View.height, 0).round() );
}

app.removeParticles = function(num) {
  for(var i = 0; i < num; ++i) engine.removeParticle(i);
}

app.mouseDown = function(mx, my) {
  this.addParticle(new Raven.Vec3(mx, my, 0));
}

app.mouseMove = function(mx, my) {
  if(this.isMousePressed) this.addParticle(new Raven.Vec3(mx, my, 0));
}

app.init = function() {
  this.super.init();
  this.addParticles(20);
  engine.addForce(centerGravityForce);
  engine.addForce(centerRotationalForce);
}

app.update = function() {
  var centerInfluence = guiParams.attrackScene ? guiParams.sceneAttraction : 0;
  centerGravityForce.pos.set(Raven.View.width / 2, Raven.View.height / 2, 0);
  centerGravityForce.size = Raven.View.width / 2;
  centerGravityForce.strength = centerInfluence;
  
  var rotationInfluence = guiParams.rotateScene ? guiParams.sceneStrength : 0;
  centerRotationalForce.pos.set(Raven.View.width / 2, Raven.View.height / 2, 0);
  centerRotationalForce.rotationStrength = guiParams.sceneRotation;
  centerRotationalForce.size = Raven.View.width / 2;
  centerRotationalForce.strength = rotationInfluence;
  
  var total = engine.totalParticles();
  var connectionAlpha = Math.round(guiParams.connectionOpacity * 255);
  Raven.Canvas.setStrokeWidth(1);
  Raven.Canvas.setStrokeColorRGBA(255, 255, 255, connectionAlpha);
  
  // Each particle can act as it's own Attraction/Rotational Force
  var attS = guiParams.attractParticles ? guiParams.particleAttraction : 0;
  var rotS = guiParams.rotateParticles  ? guiParams.particleRepulsion : 0;
  var n = 0;
  var p, f, dist, eff, len;
  for(var i = 0; i < total; ++i) {
    for(n = 0; n < total; ++n) {
      if(i != n) {
        p = engine.particles[n];
        
        // Attraction
        dist = p.difference(engine.particles[i]);
        len = dist.length();
        if(len < guiParams.particleDistance) {
          len = Math.sqrt(len);
          eff = attS * (1.0 - (len / guiParams.particleDistance));
          Raven.Physics.Force.applyForce(p, dist, len, eff);
          Raven.Canvas.drawLine(p.pos.x, p.pos.y, engine.particles[i].pos.x, engine.particles[i].pos.y); // draw a line between the particle & force
        }
        
        // Rotation
        len = Raven.distance3D(p.pos.x, p.pos.y, 0, engine.particles[i].pos.x, engine.particles[i].pos.y, 0);
        if(len < guiParams.particleDistance) {
          len = Math.sqrt(len);
          eff = rotS * (1.0 - (len / guiParams.particleDistance));
          Raven.Physics.RotationalForce.applyForce(p, dist, len, eff, guiParams.particleRotation);
        }
      }
    }
  }
  
  engine.dampen.set(guiParams.dampening, guiParams.dampening, guiParams.dampening);
  engine.update();
}

app.render = function() {
  Raven.Canvas.setFillColorRGBA(17, 16, 18, Math.round(guiParams.fadeSpeed * 255));
  Raven.Canvas.drawRect(0, 0, Raven.View.width, Raven.View.height, true, false);
  
  var connectionAlpha = Math.round(guiParams.connectionOpacity * 255);
  Raven.Canvas.setStrokeWidth(1);
  Raven.Canvas.setStrokeColorRGBA(255, 255, 255, connectionAlpha);
  if(guiParams.showForces) {
    Raven.Canvas.drawCircle(centerGravityForce.pos.x, centerGravityForce.pos.y, centerGravityForce.size * 2, false, true);
    Raven.Canvas.drawCircle(centerRotationalForce.pos.x, centerRotationalForce.pos.y, centerRotationalForce.size * 2, false, true);
  }
  
  Raven.Canvas.setFillColorRGB(255, 255, 255);
  
  total = engine.totalParticles();
  var p;
  
  for(i = 0; i < total; ++i) {
    p = engine.particles[i];
    if(p.pos.distance(p.prev) < 300) { // limit render due to particle wrapping
      
      if(guiParams.showForces) {
        Raven.Canvas.setStrokeWidth(1);
        Raven.Canvas.setStrokeColorRGBA(255, 255, 255, connectionAlpha);
        Raven.Canvas.drawCircle(engine.particles[i].pos.x, engine.particles[i].pos.y, guiParams.particleDistance * 2, false, true);
      }
      
      Raven.Canvas.setStrokeWidth(guiParams.lineWidth);
      Raven.Canvas.setStrokeColorRGB(p.col.x, p.col.y, p.col.z);
      Raven.Canvas.drawLine(p.prev.x, p.prev.y, p.pos.x, p.pos.y);
    }
  }
  
  Raven.Canvas.setFillColorRGB(0, 0, 0);
  Raven.Canvas.drawRect(20, 20, 100, 30, true, false);
  Raven.Canvas.setFillColorRGB(255, 255, 255);
  Raven.Canvas.drawFont("Total Particles: " + total, 25, 35);
}

app.setup(800, 600); // initial size
app.autoRender();

window.onload = function() {
  app.init();
  
  gui = new dat.GUI();
  
  // Scene params
  gui.add(guiParams, "fadeSpeed",         0, 1);
  gui.add(guiParams, "lineWidth",         1,  5);
  gui.add(guiParams, "connectionOpacity", 0,  1);
  gui.add(guiParams, "showForces",        guiParams.showForces);
  gui.add(guiParams, "dampening",         0, 0.2);
  gui.add(guiParams, "attrackScene",      guiParams.attrackScene);
  gui.add(guiParams, "rotateScene",       guiParams.rotateScene);
  gui.add(guiParams, "sceneAttraction",   -0.25, 0.25);
  gui.add(guiParams, "sceneRotation",     -180, 180);
  gui.add(guiParams, "sceneStrength",     0, 0.25);
  
  // Particle params
  gui.add(guiParams, "attractParticles",      guiParams.attractParticles);
  gui.add(guiParams, "rotateParticles",       guiParams.rotateParticles);
  gui.add(guiParams, "particleAttraction",    -0.25, 0.25);
  gui.add(guiParams, "particleDistance",      0, 100);
  gui.add(guiParams, "particleRepulsion",     0, 1);
  gui.add(guiParams, "particleRotation",      0, 90);
}