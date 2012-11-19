/**
 * This app demos basic canvas drawing / mobile support.
 */

Raven.Canvas.setBackgroundColorRGB(32, 32, 32);

function DragManager() {
  
  this.points = {};
  
  this.beginDrag = function(index, startX, startY) {
    var scale = new Raven.Interpolation();
    scale.spring = 0.2;
    scale.speed  = 0.7;
    scale.target = 0;
    scale.value  = 0;
    var drag = {
      angle: 0,
      distance: new Raven.Vec2.zero(),
      startX: startX,
      startY: startY,
      x: startX,
      y: startY,
      scale: scale
    };
    this.points['pt' + index] = drag;
  }
  
  this.updateDrag = function(index, x, y) {
    var start = new Raven.Vec2( this.points['pt' + index].startX, this.points['pt' + index].startY );
    var end = new Raven.Vec2( this.points['pt' + index].x, this.points['pt' + index].y );
    this.points['pt' + index].x = x;
    this.points['pt' + index].y = y;
    this.points['pt' + index].angle = Raven.getAngleDeg(start, end);
    this.points['pt' + index].distance.x = Raven.distance(start.x, end.x);
    this.points['pt' + index].distance.y = Raven.distance(start.y, end.y);
  }
  
  this.endDrag = function(index) {
    delete this.points['pt' + index];
  }
  
}

var app = Raven.makeInstance(Raven.App);
app.fullsize = true;
app.supportMobile = true;

var drags = new DragManager();

app.mouseDown = function(mx, my) {
  drags.beginDrag(0, mx, my);
}
app.mouseMove = function(mx, my) { if(this.isMousePressed) drags.updateDrag(0, mx, my); }
app.mouseUp = function(mx, my) {
  drags.endDrag(0);
}

app.touchDown = function(id, mx, my) {
  drags.beginDrag(id, mx, my);
}
app.touchMove = function(id, mx, my) {
  drags.updateDrag(id, mx, my);
}
app.touchUp = function(id, mx, my) {
  drags.endDrag(id);
}

function renderDrag(drag) {
  /*
  Raven.Canvas.setStrokeColorRGBA(255, 255, 255, 16);
  Raven.Canvas.drawLine(drag.startX, drag.y, drag.x, drag.y);
  Raven.Canvas.drawLine(drag.x, drag.startY, drag.x, drag.y);
  
  Raven.Canvas.setStrokeColorRGBA(255, 255, 255, 102);
  Raven.Canvas.drawLine(drag.startX, drag.startY, drag.x, drag.startY);
  Raven.Canvas.drawLine(drag.startX, drag.startY, drag.startX, drag.y);
  
  Raven.Canvas.drawLine(drag.startX, drag.startY, drag.x, drag.y);
  Raven.Canvas.drawCircle(drag.x, drag.startY, 15, true);
  Raven.Canvas.drawCircle(drag.startX, drag.y, 15, true);
  Raven.Canvas.drawCircle(drag.x, drag.y, 10, true);
  
  Raven.Canvas.drawFont("Angle: " + Math.round(drag.angle) + "°", drag.x + 20, drag.y - 46);
  Raven.Canvas.drawFont("Distance X: " + Math.round(drag.distance.x), drag.x + 20, drag.y - 34);
  Raven.Canvas.drawFont("Distance Y: " + Math.round(drag.distance.y), drag.x + 20, drag.y - 22);
  Raven.Canvas.drawLine(drag.x + 20, drag.y - 16, drag.x + 125, drag.y - 16);
  Raven.Canvas.drawFont("Distance: " + Math.round(drag.distance.x + drag.distance.y), drag.x + 20, drag.y - 4);
  */
  
  if(drag.startX > 50 || drag.x < 50) return;
  
  /////
  var size = 100;
  var height = 100;
  var halfHeight = height * 0.5;
  
  var xOffset = 50;
  var yOffset = drag.startY - height;
  
  
  var range = (drag.x - xOffset) / size;
  range = Math.max(0, Math.min(1, range)); // limit
  var scale = size * range;
  
  Raven.Canvas.setFillColorRGB(255, 0, 0);
  Raven.Canvas.begin();
  
  Raven.View.context.moveTo(xOffset, yOffset);
  Raven.View.context.bezierCurveTo( xOffset, yOffset + halfHeight,
                                    xOffset + scale, yOffset + halfHeight,
                                    xOffset + scale, yOffset + height);
  
  Raven.View.context.bezierCurveTo( xOffset + scale, yOffset + height + halfHeight,
                                    xOffset, yOffset + height + halfHeight,
                                    xOffset, yOffset + height + height);
  
  Raven.Canvas.end(true, false, true);
  
  Raven.Canvas.setFillColorRGB(255, 255, 255);
  Raven.Canvas.drawFont("Angle: " + Math.round(drag.angle) + "°", drag.x + 20, drag.y);
  Raven.Canvas.drawFont("Distance: " + Math.round(drag.distance.x + drag.distance.y), drag.x + 20, drag.y + 12);
  Raven.Canvas.drawFont("Scale: " + range, drag.x + 20, drag.y + 24);
}

app.render = function() {
  Raven.Canvas.setFillColorRGB(255, 0, 0);
  Raven.Canvas.drawRect(0, 0, 50, Raven.View.height);
  
  var total = 0;
  for(var drag in drags.points) {
    renderDrag(drags.points[drag]);
    ++total;
  }
  
  Raven.Canvas.setFillColorRGB(255, 255, 255);
  Raven.Canvas.drawFont("Total: " + total, 20, 30);
}

app.setup(1024, 674); // initial size
app.init();
app.autoRender();