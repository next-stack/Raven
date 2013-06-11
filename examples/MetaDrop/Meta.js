function MetaPoint(px, py) {
  Raven.extend(this, Raven.Vec2);
  this.x = px;
  this.y = py;
  
  var targetX = new Raven.Interpolation();
  var targetY = new Raven.Interpolation();
  targetX.autoDispose = false;
  targetY.autoDispose = false;
  targetX.start();
  targetY.start();
  
  this.target = function(tx, ty) {
    targetX.target = tx;
    targetY.target = ty;
  }
  
  this.update = function() {
    targetX.update();
    targetY.update();
  }
  
}

function createPoints(total, radius, offsetX, offsetY) {
  pts = [];
  var i, p, px, py;
  var delim = total / 360;
  for(i = 0; i < total; ++i) {
    p = i * delim;
    px = Math.cos(p) * radius + offsetX;
    py = Math.sin(p) * radius + offsetY;
    pts[i] = new MetaPoint(px, py);
  }
}

var pts = [];
