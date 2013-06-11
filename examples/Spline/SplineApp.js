/**
 * This app demos basic canvas drawing / mobile support.
 */


var app = Raven.makeInstance(Raven.App);
app.supportMobile = true;
app.setup(1200, 600, Raven.View.VIEW_CANVAS);

var offset = new Raven.Vec2(50, 250);
var spline = new Raven.Spline();

// Original
spline.addP( new Raven.Vec2(0, 0).add(offset));
spline.addP( new Raven.Vec2(100, 0).add(offset));
spline.addP( new Raven.Vec2(176, 30).add(offset));
spline.addP( new Raven.Vec2(336, 30).add(offset));
spline.addP(new Raven.Vec2(412, 0).add(offset));
spline.addP(new Raven.Vec2(512, 0).add(offset));

// 001
spline.addP( new Raven.Vec2(0, 0).add(offset));
spline.addP( new Raven.Vec2(54, 0).add(offset));

spline.addP( new Raven.Vec2(79, -31).add(offset));
spline.addP( new Raven.Vec2(108, -55).add(offset));

// 002
spline.addP( new Raven.Vec2(0, 0).add(offset));
spline.addP( new Raven.Vec2(216 * 0.33, -162 * 0.33).add(offset));
spline.addP( new Raven.Vec2(216 * 0.67, -162 * 0.67).add(offset));
spline.addP( new Raven.Vec2(216, -162).add(offset));

// 003
spline.addP( new Raven.Vec2(0, 0).add(offset));
spline.addP( new Raven.Vec2(0, 0).add(offset));
spline.addP( new Raven.Vec2(108, -108).add(offset));
spline.addP( new Raven.Vec2(325, -108).add(offset));
spline.addP( new Raven.Vec2(432, 0).add(offset));
spline.addP( new Raven.Vec2(432, 0).add(offset));

// 004
spline.addP( new Raven.Vec2(0, 0).add(offset));
spline.addP( new Raven.Vec2(0, 0).add(offset));
spline.addP( new Raven.Vec2(54, 54).add(offset));
spline.addP( new Raven.Vec2(162, 54).add(offset));
spline.addP( new Raven.Vec2(216, 0).add(offset));
spline.addP( new Raven.Vec2(216, 0).add(offset));

// 005
spline.addP( new Raven.Vec2(0, 0).add(offset));
spline.addP( new Raven.Vec2(0, 0).add(offset));
spline.addP( new Raven.Vec2(216, -216).add(offset));
spline.addP( new Raven.Vec2(649, -216).add(offset));
spline.addP( new Raven.Vec2(865, 0).add(offset));
spline.addP( new Raven.Vec2(865, 0).add(offset));

// 006
spline.addP( new Raven.Vec2(0, 0).add(offset));
spline.addP( new Raven.Vec2(54, 0).add(offset));
spline.addP( new Raven.Vec2(108, 54).add(offset));
spline.addP( new Raven.Vec2(108, 54).add(offset));

// 007
spline.addP( new Raven.Vec2(0, 0).add(offset));
spline.addP( new Raven.Vec2(108 * 0.33, -162 * 0.33).add(offset));
spline.addP( new Raven.Vec2(108 * 0.67, -162 * 0.67).add(offset));
spline.addP( new Raven.Vec2(108, -162).add(offset));

// 008
spline.addP( new Raven.Vec2(0, 0).add(offset));
spline.addP( new Raven.Vec2(27, -54).add(offset));
spline.addP( new Raven.Vec2(81, -54).add(offset));
spline.addP( new Raven.Vec2(108, 0).add(offset));

// 009
spline.addP( new Raven.Vec2(0, 0).add(offset));
spline.addP( new Raven.Vec2(0, 0).add(offset));
spline.addP( new Raven.Vec2(27, 54).add(offset));
spline.addP( new Raven.Vec2(54, 54).add(offset));

// 010
spline.addP( new Raven.Vec2(0, 0).add(offset));
spline.addP( new Raven.Vec2(27, 0).add(offset));
spline.addP( new Raven.Vec2(54, -54).add(offset));
spline.addP( new Raven.Vec2(54, -54).add(offset));

// 011
spline.addP( new Raven.Vec2(0, 0).add(offset));
spline.addP( new Raven.Vec2(109 * 0.33, -163 * 0.33).add(offset));
spline.addP( new Raven.Vec2(109 * 0.67, -163 * 0.67).add(offset));
spline.addP( new Raven.Vec2(109, -163).add(offset));

// 012
spline.addP( new Raven.Vec2(0, 0).add(offset));
spline.addP( new Raven.Vec2(54, -108).add(offset));
spline.addP( new Raven.Vec2(162, -108).add(offset));
spline.addP( new Raven.Vec2(216, 0).add(offset));

// 013
spline.addP( new Raven.Vec2(0, 0).add(offset));
spline.addP( new Raven.Vec2(108, -216).add(offset));
spline.addP( new Raven.Vec2(324, -216).add(offset));
spline.addP( new Raven.Vec2(432, 0).add(offset));

// 014
spline.addP( new Raven.Vec2(0, 0).add(offset));
spline.addP( new Raven.Vec2(108, -216).add(offset));
spline.addP( new Raven.Vec2(324, -216).add(offset));
spline.addP( new Raven.Vec2(432, 0).add(offset))

spline.calculate();

function renderSplinePoints(g, sp) {
  g.begin();
  
  var total = sp.controlPoints.length * 2;
  var cv = sp.valueAt(0);
  g.moveTo(cv.x, cv.y);
  var i, t;
  for (i = 1; i <= total; i++) {
    t = i / total;
    cv = sp.valueAt(t);
    g.lineTo(cv.x, cv.y);
  }
  g.end(true);
  
  for (i = 0; i <= total; i++) {
    t = i / total;
    cv = sp.valueAt(t);
    g.drawCircle(cv.x, cv.y, 5, true);
  }
}

function renderSpline(g, sp) {
  g.begin();
  
  var total = sp.controlPoints.length * 4;
  var cv = sp.valueAt(0);
  g.moveTo(cv.x, cv.y);
  for (var i = 1; i <= total; i++) {
    var t = i / total;
    cv = sp.valueAt(t);
    g.lineTo(cv.x, cv.y);
  }
  g.end(true);
}

app.init = function() {
  this.super.init();
}

app.mouseDown = function(mx, my) {
}

app.keyDown = function(evt) {
}

app.update = function() {
  
}

app.render = function() {
  var time = 10 * 60;
  var g = this.view.renderer;
  var pos = spline.valueAt((this.frameNum % time) / time);
  
  var wid = spline.controlPoints[spline.controlPoints.length-1].x - offset.x;
  var scaleX = wid * ((pos.x-offset.x) / wid);
  
  g.setStrokeRGBA(0, 0, 255, 96);
  g.setLineWidth(5);
  renderSpline(g, spline);
  
  g.setLineWidth(1);
  g.setFillRGBA(255, 255, 255, 128);
  g.setStrokeRGBA(102, 102, 102, 128);
  renderSplinePoints(g, spline);
  
  g.setLineWidth(2);
  g.setFillRGBA(255, 0, 0, 32);
  g.setStrokeRGB(255, 0, 0);
  g.drawCircle(scaleX+offset.x, pos.y, 20, true, true);
}

app.init(app.view.canvas);
app.view.backgroundColor.set(32, 32, 32);
app.autoRender();
