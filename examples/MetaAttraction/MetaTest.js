Raven.Canvas.setBackgroundColorRGB(255, 255, 255);

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
  
  var total = 30;
  var spacing = Math.ceil(Raven.View.width / (total-1));
  minH = Raven.View.height - 50;
  for(var i = 0; i < total; ++i) {
    points.push(new Point(i * spacing, minH));
  }
}

app.renderPoints = function() {
  var total = points.length-1;
  
  Raven.Canvas.setFillColorRGB(0, 0, 0);
  for(var i = 0; i < total; ++i) this.renderPoint(i);
}

app.renderPoint = function(index) {
  Raven.Canvas.begin();
  Raven.View.context.moveTo(points[index].x, Raven.View.height);
  Raven.View.context.lineTo(points[index].x,   points[index].y.value);
  Raven.View.context.lineTo(points[index+1].x, points[index+1].y.value);
  Raven.View.context.lineTo(points[index+1].x, Raven.View.height);
  Raven.Canvas.end(true, false, true);
}

app.update = function() {
  var min = Raven.View.height - 50;
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
  this.renderPoints();
}

app.setup(800, 600); // initial size
app.init();
app.autoRender();