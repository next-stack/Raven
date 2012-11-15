/**
 * Overlapping particles.
 */

Raven.Canvas.setBackgroundColorRGB(0, 0, 0);

function Particle() {
  this.pos  = new Raven.Vec2(-20, Raven.randRange(-40, Raven.View.height));
  this.pPos = this.pos.copy();
  this.vel  = Raven.Vec2.randomRange(1, 1, 3, 5);
  this.yStart = this.pos.y;
  this.radius = Math.round( Raven.randRange(5, 30) );
  
  this.update = function(frameNum) {
    this.pPos = this.pos.copy();
    this.pos.x += this.vel.x;
    this.pos.y = this.yStart + Raven.cosRange(Raven.frameNum * this.vel.y, -25, 50);
  }
  
  this.render = function() {
    //Raven.Canvas.drawCircle(this.pos.x, this.pos.y, this.radius-2, true, false);
    //Raven.Canvas.drawCircle(this.pos.x, this.pos.y, this.radius, false, true);
    //Raven.Canvas.setStrokeWidth(1);
    Raven.Canvas.setStrokeColorRGB(0, 0, 0);
    Raven.Canvas.drawLine(this.pPos.x, this.pPos.y-2, this.pos.x, this.pos.y-2);
    Raven.Canvas.drawLine(this.pPos.x, this.pPos.y+2, this.pos.x, this.pos.y+2);
    
    Raven.Canvas.setStrokeColorRGB(255, 255, 255);
    Raven.Canvas.drawLine(this.pPos.x, this.pPos.y, this.pos.x, this.pos.y);
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
  particles.push(new Particle());
}

app.init = function() {
  this.super.init();
  var total = 50;
  if(this.isMobile) {
    total = 10;
    DISPERSE_OFFSET = 25;
    TOTAL_PARTICLES = 150;
  }
  for(var i = 0; i< total; ++i) this.addParticle();
}

app.update = function() {
  var num = Raven.frameNum;
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
  Raven.Canvas.setFillColorRGBA(0, 0, 0, 4);
  Raven.Canvas.drawRect(0, 0, Raven.View.width, Raven.View.height, true, false);
  
  Raven.Canvas.setStrokeWidth(1.5);
  Raven.Canvas.setFillColorRGBA(0, 0, 0, 32);
  Raven.Canvas.setStrokeColorRGBA(255, 255, 255, 102);
  var total = particles.length;
  for(var i = 0; i < total; ++i) particles[i].render();
}

app.setup(800, 600); // initial size
app.init();
app.autoRender();