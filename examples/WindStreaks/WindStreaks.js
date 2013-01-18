/**
 * Overlapping particles.
 */

function Particle(x, y) {
  this.pos  = new Raven.Vec2(x, y);
  this.pPos = this.pos.copy();
  this.vel  = Raven.Vec2.randomRange(1, 1, 3, 5);
  this.yStart = this.pos.y;
  this.radius = Math.round( Raven.randRange(5, 30) );
  
  this.update = function(frameNum) {
    this.pPos = this.pos.copy();
    this.pos.x += this.vel.x;
    this.pos.y = this.yStart + Raven.cosRange(frameNum * this.vel.y, -25, 50);
  }
  
  this.render = function(renderer) {
    renderer.setStrokeRGB(0, 0, 0);
    renderer.drawLine(this.pPos.x, this.pPos.y-2, this.pos.x, this.pos.y-2);
    renderer.drawLine(this.pPos.x, this.pPos.y+2, this.pos.x, this.pos.y+2);
    
    renderer.setStrokeRGB(255, 255, 255);
    renderer.drawLine(this.pPos.x, this.pPos.y, this.pos.x, this.pos.y);
  }
  
  this.dead = function() {
    return this.pos.x > Raven.View.width + this.radius;
  }
}

var TOTAL_PARTICLES = 500;
var DISPERSE_OFFSET = 5;
var particles = [];

var app = Raven.makeInstance(Raven.App);
app.fullsize = true;
app.supportMobile = true;
app.autoClear = false;

app.addParticle = function() {
  particles.push(new Particle(-20, Raven.randRange(-40, this.view.height)));
}

app.init = function() {
  this.super.init();
  console.log(this.isMobile);
  var total = 50;
  if(this.isMobile) {
    total = 10;
    DISPERSE_OFFSET = 25;
    TOTAL_PARTICLES = 150;
  }
  
  for(var i = 0; i< total; ++i) this.addParticle();
}

app.update = function() {
  var num = this.frameNum;
  for(var i = 0; i < particles.length; ++i) {
    p = particles[i];
    p.update(num);
    
    if(p.dead()) {
      particles.splice(i, 1);
      delete p;
    }
  }
  
  if(particles.length < TOTAL_PARTICLES && Raven.frameNum % DISPERSE_OFFSET == 0) this.addParticle();
}

app.render = function() {
  var renderer = this.view.renderer;
  renderer.setFillRGBA(0, 0, 0, 4);
  renderer.drawRect(0, 0, this.view.width, this.view.height, true, false);
  
  renderer.setFillRGBA(0, 0, 0, 32);
  renderer.setStrokeRGBA(255, 255, 255, 102);
  var total = particles.length;
  for(var i = 0; i < total; ++i) particles[i].render(renderer);
}

app.setup(1024, 768, Raven.View.VIEW_CANVAS);
app.init(app.view.canvas);
app.view.backgroundColor.set(16, 16, 16);
app.autoRender();