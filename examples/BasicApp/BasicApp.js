/**
 * This app demos basic canvas drawing / mobile support.
 */

Raven.Canvas.setBackgroundColorRGB(32, 32, 32);

var app = Raven.makeInstance(Raven.App);
app.fullsize = true;
app.supportMobile = true;
app.isDown = false;

app.mouseDown = function(mx, my) { this.isDown = true; }
app.mouseUp = function(mx, my) { this.isDown = false; }

app.render = function() {
  Raven.Canvas.setFillColorRGB(255, 255, 255);
  Raven.Canvas.setStrokeColorRGB(255, 255, 255);
  Raven.Canvas.drawFont("Raven: Basic App example", 25, 40);
  Raven.Canvas.drawFont("Acceleration: " + Raven.View.acceleration.x + ", " + Raven.View.acceleration.y + ", " + Raven.View.acceleration.z, 25, 60);
  Raven.Canvas.drawFont("Gyro: " + Raven.View.rotation.x + ", " + Raven.View.rotation.y + ", " + Raven.View.rotation.z, 25, 80);
  Raven.Canvas.drawFont("Stage Size: " + Raven.View.width + ", " + Raven.View.height, 25, 120);
  
  if(this.isDown) Raven.Canvas.drawCircle(this.mouseX, this.mouseY, 50, true);
  
  var total = this.touchPoints.length;
  for(var i = 0; i < total; ++i) Raven.Canvas.drawCircle(this.touchPoints[i].x, this.touchPoints[i].y, 100, false, true);
}

app.setup(1024, 674); // initial size
app.init();
app.autoRender();