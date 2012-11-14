/**
 * This app demos basic canvas drawing / mobile support.
 */

Raven.Canvas.setBackgroundColorRGB(32, 32, 32);

function DragManager() {
  
  this.points = {};
  
  this.beginDrag = function(index, startX, startY) {
    var drag = {
      angle: 0,
      distance: new Raven.Vec2.zero(),
      startX: startX,
      startY: startY,
      x: startX,
      y: startY
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

var mousePressed = false;

var drags = new DragManager();

app.mouseDown = function(mx, my) {
  drags.beginDrag(0, mx, my);
  mousePressed = true;
}
app.mouseMove = function(mx, my) { if(mousePressed) drags.updateDrag(0, mx, my); }
app.mouseUp = function(mx, my) {
  drags.endDrag(0);
  mousePressed = false;
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

app.render = function() {
  Raven.Canvas.setFillColorRGB(255, 255, 255);
  
  var total = 0;
  for(var drag in drags.points) {
    Raven.Canvas.setStrokeColorRGBA(255, 255, 255, 16);
    Raven.Canvas.drawLine(drags.points[drag].startX, drags.points[drag].y, drags.points[drag].x, drags.points[drag].y);
    Raven.Canvas.drawLine(drags.points[drag].x, drags.points[drag].startY, drags.points[drag].x, drags.points[drag].y);
    
    Raven.Canvas.setStrokeColorRGBA(255, 255, 255, 102);
    Raven.Canvas.drawLine(drags.points[drag].startX, drags.points[drag].startY, drags.points[drag].x, drags.points[drag].startY);
    Raven.Canvas.drawLine(drags.points[drag].startX, drags.points[drag].startY, drags.points[drag].startX, drags.points[drag].y);
    
    Raven.Canvas.drawLine(drags.points[drag].startX, drags.points[drag].startY, drags.points[drag].x, drags.points[drag].y);
    Raven.Canvas.drawCircle(drags.points[drag].x, drags.points[drag].startY, 15, true);
    Raven.Canvas.drawCircle(drags.points[drag].startX, drags.points[drag].y, 15, true);
    Raven.Canvas.drawCircle(drags.points[drag].x, drags.points[drag].y, 10, true);
    
    Raven.Canvas.drawFont("Angle: " + Math.round(drags.points[drag].angle) + "°", drags.points[drag].x + 20, drags.points[drag].y - 46);
    Raven.Canvas.drawFont("Distance X: " + Math.round(drags.points[drag].distance.x), drags.points[drag].x + 20, drags.points[drag].y - 34);
    Raven.Canvas.drawFont("Distance Y: " + Math.round(drags.points[drag].distance.y), drags.points[drag].x + 20, drags.points[drag].y - 22);
    Raven.Canvas.drawLine(drags.points[drag].x + 20, drags.points[drag].y - 16, drags.points[drag].x + 125, drags.points[drag].y - 16);
    Raven.Canvas.drawFont("Distance: " + Math.round(drags.points[drag].distance.x + drags.points[drag].distance.y), drags.points[drag].x + 20, drags.points[drag].y - 4);
    ++total;
  }
  Raven.Canvas.drawFont("Total: " + total, 20, 30);
}

app.setup(1024, 674); // initial size
app.init();
app.autoRender();