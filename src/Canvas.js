var Raven = Raven || {};

Raven.Canvas = function(context) {
  
  this.context = context;
  
  var _scale = 1;
  
  var _font;
  var _fillColor = Raven.Color.white();
  var _strokeColor = Raven.Color.white();
  var _lineWidth = 1;
  
  // Getters
  this.getLineWidth  = function() { return _lineWidth; }
  this.getScale = function() { return _scale; }
  this.fillColor = function() { return _fillColor; }
  
  // Setters
  this.setLineWidth  = function(value) {
    _lineWidth  = value;
    this.context.lineWidth = value;
  }
  
  this.setScale = function(value) {
    _scale = value;
    this.context.scale(_scale, _scale);
  }
  
  this.setFillColor = function(c) {
    _fillColor = c.copy();
    this.context.fillStyle = _fillColor.css();
  }

  this.setFillHex = function(hex) {
    _fillColor = Raven.Color.hexToRGB(hex);
    this.context.fillStyle = _fillColor.css();
  }
  
  this.setFillRGBA = function(r, g, b, a) {
    _fillColor = new Raven.Color(r, g, b, a);
    this.context.fillStyle = _fillColor.css();
  }
  
  this.setFillRGB = function(r, g, b) {
    this.setFillRGBA(r, g, b, 255);
  }
  
  this.setStrokeColor = function(c) {
    _strokeColor = c.copy();
    this.context.strokeStyle = _strokeColor.css();
  }

  this.setStrokeHex = function(hex) {
    _strokeColor = Raven.Color.hexToRGB(hex);
    this.context.strokeStyle = _strokeColor.css();
  }
  
  this.setStrokeRGBA = function(r, g, b, a) {
    _strokeColor = new Raven.Color(r, g, b, a);
    this.context.strokeStyle = _strokeColor.css();
  }
  
  this.setStrokeRGB = function(r, g, b) {
    this.setStrokeRGBA(r, g, b, 255);
  }
  
  this.drawCircle = function(x, y, radius, fill, stroke) {
    var hr = radius * 0.5;
    this.context.beginPath();
    this.context.arc(x + hr, y + hr, hr, 0, Math.PI * 2, false);
    this.context.closePath();
    if(stroke) this.context.stroke();
    if(fill) this.context.fill();
  }
  
  // Drawing
  this.drawFont = function(message, x, y) {
    this.context.fillText(message, x, y);
  }

  this.drawLine = function(x1, y1, x2, y2) {
    this.begin();
    this.moveTo(x1, y1);
    this.lineTo(x2, y2);
    this.end(true, false);
  }
  
  this.drawCurve = function(start, control, end, stroke, fill) {
    this.begin();
    this.moveTo(start.x, start.y);
    this.context.quadraticCurveTo(control.x, control.y, end.x, end.y);
    this.end(stroke, fill);
  }

  this.drawRect = function(x, y, wid, hei, fill, stroke) {
    if(stroke) this.context.strokeRect(x, y, wid, hei);
    if(fill) this.context.fillRect(x, y, wid, hei);
  }
  
  this.clear = function(width, height, backgroundColor) {
    this.context.fillStyle = backgroundColor.css();
    this.drawRect(0, 0, width, height, true, false);
  }
  
  this.begin = function() {
    this.context.beginPath();
  }
  
  this.moveTo = function(x, y) {
    this.context.moveTo(x, y);
  }
  
  this.lineTo = function(x, y) {
    this.context.lineTo(x, y);
  }
  
  this.end = function(stroke, fill) {
    //this.context.closePath();
    if(stroke) this.context.stroke();
    if(fill)   this.context.fill();
  }
  
}