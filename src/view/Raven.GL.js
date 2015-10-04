var Raven = Raven || {};
var gl;

//////////////////////////////////////////////////
// WebGL
//////////////////////////////////////////////////

Raven.GLView = function() {
    Raven.View.apply(this, arguments);
    this.type = Raven.VIEW_WEBGL;
    return this;
};

Raven.GLView.extends( Raven.View, Raven.GLView );

Raven.GLView.prototype.setup = function(cElement) {
	Raven.View.prototype.setup.call(this, cElement);

    try {
        if( this.element.getContext("webgl") !== undefined ) {
            gl = this.element.getContext("webgl");
        } else {
            gl = this.element.getContext("experimental-webgl");
        }
        gl.viewportWidth  = this.width;
        gl.viewportHeight = this.height;
        this.context      = gl;
    } catch(err) {
        console.error("Error initing WebGL", err);
        return false;
    }

	return this;
};

Raven.GLView.prototype.resize        = function(w, h) {
    this.element.width  = w * this.pixelRatio;
    this.element.height = h * this.pixelRatio;
    this.width  = w;
    this.height = h;
    gl.viewportWidth  = w;
    gl.viewportHeight = h;
    this.context      = gl;
    return this;
};

/*
Raven.View = function() {
    var _this = this;
    this.align      = Raven.Align.TOP_LEFT;
    this.autoClear	= true;
    this.background	= Raven.Color.black();
    this.element	= null;
    this.context	= null;
    this.pixelRatio	= window.devicePixelRatio;
    this.width		= 0;
    this.height		= 0;
    this.type       = -1;
    this.masking    = false;
    return this;
};

Raven.View.prototype = {
    available: function() { return this.context != null; },
    retinaAvailable: function() { return this.pixelRatio > 1; },
    //
    setup: function(cElement) {},
    clear: function() {},
    resize: function(w, h) {},
    begin: function() {},
    end: function(fill, stroke) {},
    moveTo: function(x, y) {},
    lineTo: function(x, y) {},
    beginMask: function() {},
    endMask: function() {},
    stopMask: function() {},
    drawLine: function(x1, y1, x2, y2) {},
    drawRect: function(x, y, wid, hei, fill, stroke) {},
    drawArc: function(x, y, radius, degrees, angleOffset, fill, stroke) {},
    drawCircle: function(x, y, radius, fill, stroke) {},
    drawPoly: function(x, y, radius, sides, fill, stroke) {},
    drawFont: function(msg, x, y) {},
    drawImage: function(img, x, y, width, height, xOffset, yOffset) {},
    getLineWidth: function() { return 0; },
    setLineWidth: function(w) {},
    setFill: function(color) {},
    setFillB: function(brightness) {},
    setFillHex: function(hex) {},
    setFillRGB: function(r, g, b) {},
    setFillRGBA: function(r, g, b, a) {},
    setStroke: function(color) {},
    setStrokeB: function(brightness) {},
    setStrokeHex: function(hex) {},
    setStrokeRGB: function(r, g, b) {},
    setStrokeRGBA: function(r, g, b, a) {},
    //
    pushMatrix: function() {},
    popMatrix: function() {},
    rotate: function(x, y, z) {},
    scale: function(x, y, z) {},
    transform: function(a, b, c, d, e, f) {},
    translate: function(x, y, z) {}
};
*/
