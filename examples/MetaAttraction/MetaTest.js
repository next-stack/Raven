var app = Raven.makeInstance(Raven.App);
app.fullsize = true;
app.supportMobile = true;

function Point(px, py) {
  this.x = px;
  
  this.y = new Raven.Interpolation();
  this.y.target = this.y.value = py;
  this.y.speed = 0.25;
  this.y.spring = 0.65;
  this.y.autoDispose = false;
  this.y.start();
  
  this.update = function() {
    this.y.update();
  }
  
}

var maxRange = 100;
var minH = 0;
var points = [];
var engine = new Raven.Physics.ParticleController();

app.init = function() {
  this.super.init();
  
  var total = 100;
  var spacing = Math.ceil(this.view.width / (total-1));
  minH = this.view.height - 50;
  for(var i = 0; i < total; ++i) {
    points.push(new Point(i * spacing, minH));
  }
}

app.renderPoints = function(renderer) {
  var total = points.length-1;
  renderer.setFillRGB(0, 0, 0);
  for(var i = 0; i < total; ++i) this.renderPoint(i);
}

app.renderPoint = function(index) {
  var renderer = this.view.renderer;
  renderer.begin();
  renderer.context.moveTo(points[index].x,   this.view.height);
  renderer.context.lineTo(points[index].x,   points[index].y.value);
  renderer.context.lineTo(points[index+1].x, points[index+1].y.value);
  renderer.context.lineTo(points[index+1].x, this.view.height);
  renderer.end(false, true);
}

app.update = function() {
  var min = this.view.height - 50;
  var d = 0;
  var per = 0;
  var total = points.length;
  var maxDist =  maxRange;
  if(this.isMousePressed) maxDist += 50;
  for(var i = 0; i < total; ++i) {
    d = Raven.distance2D(points[i].x, min, this.mouseX, this.mouseY);
    if(d < maxDist) {
      if(this.mouseY >= min) d = Raven.distance(points[i].x, this.mouseX);
      per = (d / maxDist);
      points[i].y.target = Raven.Ease.cubicInOut(per, min - maxDist, maxDist, 1);
    } else {
      points[i].y.target = min;
    }
    points[i].update();
  }
}

app.render = function() {
  var renderer = this.view.renderer;
  this.renderPoints(renderer);
  
  renderer.setFillRGB(0, 0, 0);
  renderer.drawFont("Move your mouse over the floorground.", 25, 25);
  renderer.drawFont("Press down to increase buldge height.", 25, 40);
}

app.setup(800, 600, Raven.View.VIEW_CANVAS); // initial size
app.view.backgroundColor = Raven.Color.white();
app.init();
app.autoRender();