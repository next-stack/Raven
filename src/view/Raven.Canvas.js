var Raven = Raven || {};

//////////////////////////////////////////////////
// Canvas
//////////////////////////////////////////////////

Raven.CanvasView = function() {
    Raven.View.call(this);
    this.type = Raven.VIEW_CANVAS;
    return this;
};

Raven.CanvasView.prototype = new Raven.View();
Raven.CanvasView.prototype.constructor = Raven.CanvasView;

Raven.CanvasView.prototype.setup         = function(cElement) {
    this.align      = Raven.Align.TOP_LEFT;
    this.element    = Raven.element(cElement);
    this.context    = this.element.getContext('2d');
    this.width      = this.element.width;
    this.height     = this.element.height;
    this.context.scale(this.pixelRatio, this.pixelRatio); // auto-enable retina
    return this;
};
Raven.CanvasView.prototype.clear         = function() {
    var _align = this.align;
    this.align = Raven.Align.TOP_LEFT;
    this.setFill(this.background);
    this.drawRect(0, 0, this.width, this.height, true, false);
    this.align = _align;
    return this;
};
Raven.CanvasView.prototype.resize        = function(w, h) {
    this.element.width  = w * this.pixelRatio;
    this.element.height = h * this.pixelRatio;
    this.width  = w;
    this.height = h;
    return this;
};
Raven.CanvasView.prototype.begin         = function() {
    this.context.beginPath();
    return this;
};
Raven.CanvasView.prototype.end           = function(fill, stroke) {
    if(stroke)  this.context.stroke();
    if(fill)    this.context.fill();
    return this;
};
Raven.CanvasView.prototype.moveTo        = function(x, y) {
    this.context.moveTo(x, y);
    return this;
};
Raven.CanvasView.prototype.lineTo        = function(x, y) {
    this.context.lineTo(x, y);
    return this;
};
Raven.CanvasView.prototype.beginMask     = function() {
    this.context.save();
    this.masking = true;
    return this;
};
Raven.CanvasView.prototype.endMask       = function() {
    this.masking = false;
    this.context.clip();
    return this;
};
Raven.CanvasView.prototype.stopMask      = function() {
    this.context.restore();
    return this;
};
Raven.CanvasView.prototype.drawLine      = function(x1, y1, x2, y2) {
    this.begin();
    this.moveTo(x1, y1);
    this.lineTo(x2, y2);
    this.end(false, true);
    return this;
};
Raven.CanvasView.prototype.drawRect      = function(x, y, wid, hei, fill, stroke) {
    var o = Raven.Align.getOffset(x, y, wid, hei, this);
    if(this.masking) {
        this.begin();
        this.moveTo(o.x, o.y);
        this.lineTo(o.x, o.y+hei);
        this.lineTo(o.x+wid, o.y+hei);
        this.lineTo(o.x+wid, o.y);
    } else {
        if(stroke)  this.context.strokeRect(o.x, o.y, wid, hei);
        if(fill)    this.context.fillRect(o.x, o.y, wid, hei);
    }
    return this;
};
Raven.CanvasView.prototype.drawCircle    = function(x, y, radius, fill, stroke) {
    var hRad = radius * 0.5,
    o = Raven.Align.getOffset(x+hRad, y+hRad, radius, radius, this);
    this.begin();
    this.context.arc(o.x, o.y, hRad, 0, Math.PI*2, false);
    this.end(fill, stroke);
    return this;
};
Raven.CanvasView.prototype.drawCurve     = function(sx, sy, cx, cy, ex, ey, fill, stroke) {
    this.begin();
    this.moveTo(sx, sy);
    this.context.quadraticCurveTo(cx, cy, ex, ey);
    this.end(fill, stroke);
    return this;
};
Raven.CanvasView.prototype.drawFont      = function(msg, x, y) {
    this.context.fillText(msg, x, y);
    return this;
};
Raven.CanvasView.prototype.drawImage     = function(img, x, y, width, height, xOffset, yOffset) {
    var o = Raven.Align.getOffset(x, y, width, height, this);
    if(xOffset !== undefined && yOffset !== undefined) {
        this.context.drawImage(img, xOffset, yOffset, width, height, o.x, o.y, width, height);
    } else {
        this.context.drawImage(img, 0, 0, width, height, o.x, o.y, width, height);
    }
    return this;
};
// Getters
Raven.CanvasView.prototype.getLineWidth  = function() {
    return this.context.lineWidth;
};
// Setters
Raven.CanvasView.prototype.setLineWidth  = function(w) {
    this.context.lineWidth = w;
};
Raven.CanvasView.prototype.setFill       = function(color) {
    this.context.fillStyle = color.css();
};
Raven.CanvasView.prototype.setFillB      = function(brightness) {
    this.setFillRGB(brightness, brightness, brightness);
};
Raven.CanvasView.prototype.setFillHex    = function(hex) {
    this.setFill( Raven.Color.hexToRGB(hex) );
};
Raven.CanvasView.prototype.setFillRGB    = function(r, g, b) {
    this.setFillRGBA(r, g, b, 255);
};
Raven.CanvasView.prototype.setFillRGBA   = function(r, g, b, a) {
    this.setFill( new Raven.Color(r, g, b, a) );
};
Raven.CanvasView.prototype.setStroke     = function(color) {
    this.context.strokeStyle = color.css();
};
Raven.CanvasView.prototype.setStrokeB    = function(brightness) {
    this.setStrokeRGB(brightness, brightness, brightness);
};
Raven.CanvasView.prototype.setStrokeHex  = function(hex) {
    this.setStroke( Raven.Color.hexToRGB(hex) );
};
Raven.CanvasView.prototype.setStrokeRGB  = function(r, g, b) {
    this.setStrokeRGBA(r, g, b, 255);
};
Raven.CanvasView.prototype.setStrokeRGBA = function(r, g, b, a) {
    this.setStroke( new Raven.Color(r, g, b, a) );
};
