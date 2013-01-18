/**
 * This app demos basic canvas drawing / mobile support.
 */

function DragManager() {
  
  this.points = {};
  this.totalPoints = 0;
  
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
    ++this.totalPoints;
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
    --this.totalPoints;
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
  if(drag.startX > 50 || drag.x < 50) return;
  
  var renderer = app.view.renderer;
  /////
  var size = 100;
  var height = 100;
  var halfHeight = height * 0.5;
  
  var xOffset = 50;
  var yOffset = drag.y - height;
  
  
  var range = (drag.x - xOffset) / size;
  range = Math.max(0, Math.min(1, range)); // limit
  var scale = size * range;
  
  renderer.setFillRGB(255, 0, 0);
  renderer.begin();
  renderer.context.moveTo(xOffset, yOffset);
  renderer.context.bezierCurveTo( xOffset, yOffset + halfHeight,
                                    xOffset + scale, yOffset + halfHeight,
                                    xOffset + scale, yOffset + height);
  
  renderer.context.bezierCurveTo( xOffset + scale, yOffset + height + halfHeight,
                                    xOffset, yOffset + height + halfHeight,
                                    xOffset, yOffset + height + height);
  
  renderer.end(false, true);
  
  var furthestX = drag.x;
  var furthestY = drag.y;
  if(drag.distance.x + drag.distance.y > size) {
    var rad = Raven.degreesToRadians(drag.angle);
    furthestX = Math.cos(rad) * size + drag.startX;
    furthestY = Math.sin(rad) * size + drag.startY;
  }
  
  renderer.setStrokeRGB(0, 0, 0);
  renderer.drawLine(drag.startX, drag.startY, furthestX, furthestY);
  renderer.setFillRGB(0, 0, 0);
  renderer.drawCircle(drag.startX, drag.startY, 5, true, false);
  renderer.drawCircle(furthestX, furthestY, 5, true, false);
  
  renderer.setFillRGB(255, 255, 255);
  renderer.drawFont("From drag start position:", furthestX + 20, furthestY);
  renderer.drawFont(" Angle: " + Math.round(drag.angle) + "°", furthestX + 20, furthestY + 12);
  renderer.drawFont(" Distance: " + Math.round(drag.distance.x + drag.distance.y), furthestX + 20, furthestY + 24);
  renderer.drawFont(" Scale: " + range, furthestX + 20, furthestY + 36);
}

app.render = function() {
  var renderer = this.view.renderer;
  renderer.setFillRGB(255, 0, 0);
  renderer.drawRect(0, 0, 50, this.view.height);
  
  var total = 0;
  for(var drag in drags.points) {
    renderDrag(drags.points[drag]);
    ++total;
  }
  
  renderer.setFillRGB(255, 255, 255);
  renderer.drawFont("Drag the red box outward.", 75, 25);
  renderer.drawFont("Total: " + total, 75, 40);
}

app.setup(1024, 674, Raven.View.VIEW_CANVAS); // initial size
app.view.backgroundColor.set(32, 32, 32);
app.init();
app.autoRender();