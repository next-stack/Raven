/**
 * This app demos basic canvas drawing / mobile support.
 */

Raven.Canvas.setBackgroundColorRGB(32, 32, 32);

function DragManager() {
  
  this.points = {};
  
  this.beginDrag = function(index, startX, startY) {
    var drag = {
      startX: startX,
      startY: startY,
      x: startX,
      y: startY
    };
    this.points['pt' + index] = drag;
    console.log("Add drag point", 'pt' + index, startX, startY);
  }
  
  this.updateDrag = function(index, x, y) {
    this.points['pt' + index].x = x;
    this.points['pt' + index].y = y;
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
  console.log("APP TOUCH", id, mx, my);
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
  Raven.Canvas.setStrokeColorRGB(255, 255, 255);
  
  var total = 0;
  for(var drag in drags.points) {
    Raven.Canvas.drawLine(drags.points[drag].startX, drags.points[drag].startY, drags.points[drag].x, drags.points[drag].y);
    ++total;
  }
  Raven.Canvas.drawFont("Total: " + total, 20, 30);
}

app.setup(1024, 674); // initial size
app.init();
app.autoRender();