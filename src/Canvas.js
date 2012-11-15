var Raven = Raven || {};

Raven.View = function() {}
Raven.View.canvas = 0;
Raven.View.context = 0;
Raven.View.width = 0;
Raven.View.height = 0;
Raven.View.enableRetina = false;
Raven.View.pixelRatio = 1;
Raven.View.acceleration = new Raven.Vec3.zero();
Raven.View.rotation = new Raven.Vec3.zero();

Raven.Canvas = function() {}
Raven.Canvas.backgroundColor = '#000';
Raven.Canvas.fillColor = '#FFF';
Raven.Canvas.strokeColor = '#FFF';
Raven.Canvas.lineWidth = 1;
Raven.Canvas.font;

Raven.Canvas.size = function(width, height) {
  var scale = Raven.View.enableRetina ? Raven.View.pixelRatio : 1;
  Raven.View.width = width * scale;
  Raven.View.height = height * scale;
  Raven.View.canvas.width = width * scale;
  Raven.View.canvas.height = height * scale;
}

Raven.Canvas.init = function(canvas) {
  Raven.View.canvas = canvas;
  if(Raven.View.canvas && Raven.View.canvas.getContext) {
    Raven.View.context = canvas.getContext('2d');
    var ratio = window.devicePixelRatio;
    Raven.View.pixelRatio = ratio;
    if(Raven.View.enableRetina) Raven.View.context.scale(ratio, ratio);
    Raven.Canvas.size(Raven.View.canvas.width, Raven.View.canvas.height);
  } else {
    console.log("Error establishing canvas (Raven.Canvas.init)");
  }
}

Raven.Canvas.update = function() {
  Raven.View.context.fillColor = this.fillColor;
  Raven.View.context.strokeColor = this.strokeColor;
  Raven.View.context.lineWidth = this.lineWidth;
  Raven.View.context.font = this.font;
}

Raven.Canvas.setContext = function(newContext) {
  Raven.View.context = newContext;
}

Raven.Canvas.clear = function() {
  var fill = Raven.Canvas.fillColor;
  Raven.Canvas.setFillColor(Raven.Canvas.backgroundColor);
  Raven.Canvas.drawRect(0, 0, Raven.View.width, Raven.View.height);
  Raven.Canvas.setFillColor(fill);
}

Raven.Canvas.setFillColor = function(col) {
  Raven.Canvas.fillColor = col;
  Raven.View.context.fillStyle = Raven.Canvas.fillColor;
}

Raven.Canvas.setFillColorRGB = function(red, green, blue) {
  Raven.Canvas.fillColor = 'rgb(' + red + ',' + green + ',' + blue + ')';
  Raven.View.context.fillStyle = Raven.Canvas.fillColor;
}

Raven.Canvas.setFillColorRGBA = function(red, green, blue, alpha) {
  Raven.Canvas.fillColor = 'rgba(' + red + ',' + green + ',' + blue + ',' + ( alpha / 255 ) + ')';
  Raven.View.context.fillStyle = Raven.Canvas.fillColor;
}

Raven.Canvas.setBackgroundColorRGB = function(red, green, blue) {
  Raven.Canvas.backgroundColor = 'rgb(' + red + ',' + green + ',' + blue + ')';
}

Raven.Canvas.setBackgroundColorRGBA = function(red, green, blue, alpha) {
  Raven.Canvas.backgroundColor = 'rgba(' + red + ',' + green + ',' + blue + ',' + ( alpha / 255 ) + ')';
}

Raven.Canvas.setFont = function(newFont) {
  Raven.Canvas.font = newFont;
  Raven.View.context.font = Raven.Canvas.font;
}

Raven.Canvas.setStrokeColor = function(col) {
  Raven.Canvas.strokeColor = col;
  Raven.View.context.strokeStyle = Raven.Canvas.strokeColor;
}

Raven.Canvas.setStrokeColorRGB = function(red, green, blue) {
  Raven.Canvas.strokeColor = 'rgb(' + red + ',' + green + ',' + blue + ')';
  Raven.View.context.strokeStyle = Raven.Canvas.strokeColor;
}

Raven.Canvas.setStrokeColorRGBA = function(red, green, blue, alpha) {
  Raven.Canvas.strokeColor = 'rgba(' + red + ',' + green + ',' + blue + ',' + ( alpha / 255 ) + ')';
  Raven.View.context.strokeStyle = Raven.Canvas.strokeColor;
}

Raven.Canvas.setStrokeWidth = function(wid) {
  Raven.Canvas.lineWidth = wid;
  Raven.View.context.lineWidth = wid;
}

Raven.Canvas.drawCircle = function(x, y, radius, fill, stroke) {
  Raven.View.context.beginPath();
  Raven.View.context.arc(x, y, radius * 0.5, 0, Math.PI * 2, false);
  Raven.View.context.closePath();
  if(stroke) Raven.View.context.stroke();
  if(fill) Raven.View.context.fill();
}

Raven.Canvas.drawFont = function(message, x, y) {
  Raven.View.context.fillText(message, x, y);
}

Raven.Canvas.drawLine = function(x1, y1, x2, y2) {
  Raven.View.context.beginPath();
  Raven.View.context.moveTo(x1, y1);
  Raven.View.context.lineTo(x2, y2);
  Raven.View.context.closePath();
  Raven.View.context.stroke();
}

Raven.Canvas.drawRect = function(x, y, wid, hei, fill, stroke) {
  Raven.View.context.fillRect(x, y, wid, hei);
  if(stroke) Raven.View.context.stroke();
  if(fill) Raven.View.context.fill();
}

Raven.Canvas.begin = function() {
  Raven.View.context.beginPath();
}

Raven.Canvas.end = function(close, stroke, fill) {
  if(close)  Raven.View.context.closePath();
  if(stroke) Raven.View.context.stroke();
  if(fill)   Raven.View.context.fill();
}

Raven.Canvas.bezierCurve = function(startX, startY, controlX1, controlY1, controlX2, controlY2, endX, endY) {
  Raven.View.context.moveTo(startX, startY);
  Raven.View.context.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, endX, endY);
}
