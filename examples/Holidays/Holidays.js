var app = Raven.makeInstance(Raven.App);
app.fullsize = false;

var gravity = 8;
var particles = [];

function addParticle() {
  var particle = {
    decay: Raven.randRange(0, 0.15),
    movement: Raven.randRange(0.5, 3),
    offset: Math.round( Raven.randRange( 0, 45 ) ),
    pos: Raven.Vec2.randomRange(-50, -50, app.view.width+50, app.view.height),
    size: Raven.randRange(2, 8),
    
    "update": function(maxBounds) {
      this.pos.x = Raven.cosRange(app.frameNum + this.offset, this.movement, this.pos.x - (this.movement * 0.5));
      this.pos.y += gravity * this.decay;
      if(this.pos.y > maxBounds) {
        this.pos = Raven.Vec2.randomRange(-50, -50, app.view.width+50, -20);
      }
    }
  };
  particles.push( particle );
}

function addParticles(amount) {
  for(var i = 0; i < amount; ++i) addParticle();
}

app.init = function(canvas) {
  this.super.init(canvas);
  addParticles(150); // amount of snow
}

app.render = function() {
  var i, total;
  var graphics = this.view.renderer;
  
  this.resize(window.innerWidth-20, 940);
  
  total = particles.length;
  graphics.setFillRGB(255, 255, 255);
  for(i = 0; i < total; ++i) {
    particles[i].update(this.view.height);
    graphics.drawCircle(particles[i].pos.x, particles[i].pos.y, particles[i].size, true);
  }
  
  graphics.drawFont("Happy Holidays!", 50, 50);
}

app.setup(window.innerWidth, 940, Raven.element("world"), Raven.View.VIEW_CANVAS);
app.init(app.view.canvas);
app.autoRender();


