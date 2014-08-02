var Raven = Raven || {};

Raven.Align = {
    TOP_LEFT:       0,
    TOP_CENTER:     1,
    TOP_RIGHT:      2,
    CENTER_LEFT:    3,
    CENTER:         4,
    CENTER_RIGHT:   5,
    BOTTOM_LEFT:    6,
    BOTTOM_CENTER:  7,
    BOTTOM_RIGHT:   8,
    getOffset: function(x, y, width, height, view) {
        var offset = new Raven.Vec(x, y);
        switch(view.align) {
            default:
            case Raven.Align.TOP_LEFT:
                break;
            case Raven.Align.TOP_CENTER:
                offset.x -= width * 0.5;
                break;
            case Raven.Align.TOP_RIGHT:
                offset.x -= width;
                break;
            case Raven.Align.CENTER_LEFT:
                offset.y -= height * 0.5;
                break;
            case Raven.Align.CENTER:
                offset.x -= width * 0.5;
                offset.y -= height * 0.5;
                break;
            case Raven.Align.CENTER_RIGHT:
                offset.x -= width;
                offset.y -= height * 0.5;
                break;
            case Raven.Align.BOTTOM_LEFT:
                offset.y -= height;
                break;
            case Raven.Align.BOTTOM_CENTER:
                offset.x -= width * 0.5;
                offset.y -= height;
                break;
            case Raven.Align.BOTTOM_RIGHT:
                offset.x -= width;
                offset.y -= height;
                break;
        }
        return offset;
    }
};

Raven.Color = function(r, g, b, a) {
     this.r = r ? r : 0;
     this.g = g ? g : 0;
     this.b = b ? b : 0;
     this.a = a ? a : 255;
     // Getters
     this.copy = function() {
         return new Raven.Color(this.r, this.g, this.b, this.a);
     };
     this.css = function() {
         return 'rgba(' +	Math.round(this.r) + ',' +
                            Math.round(this.g) + ',' +
                            Math.round(this.b) + ',' +
                            ( this.a / 255 ) + ')';
     };
     // Setters
     this.set = function(r, g, b, a) {
         if(r)	this.r = r;
         if(g)	this.g = g;
         if(b)	this.b = b;
         if(a)	this.a = a;
         return this;
     };
     this.setColor = function(rColor) {
        this.r = rColor.r;
        this.g = rColor.g;
        this.b = rColor.b;
        this.a = rColor.a;
        return this;
     };
     this.setHex = function(hex) {
        var c = Raven.Color.hexToRGB(hex);
        this.r = c.r;
        this.g = c.g;
        this.b = c.b;
        this.a = c.a;
        return this;
     };
     return this;
};

Raven.Color.getHex = function(hexCode) {
	var n = parseInt(hexCode, 10);
	if(isNaN(n)) return "00";
	n = Math.max(0,Math.min(n,255));
	return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
};

Raven.Color.hexToRGB = function(hex) {
	var h = (hex.charAt(0) == "#") ? hex.substring(1, 7) : hex;
	var r = parseInt(h.substring(0,2), 16);
	var g = parseInt(h.substring(2,4), 16);
	var b = parseInt(h.substring(4,6), 16);
    var a = h.length > 6 ? parseInt(h.substring(6,8), 16) : 255;
	return new Raven.Color(r, g, b, a);
};

Raven.Color.rgbToHex = function(r, g, b) {
	return Raven.Color.getHex(r) + Raven.Color.getHex(g) + Raven.Color.getHex(b);
};

Raven.Color.black	= function() { return new Raven.Color(  0,   0,   0); };
Raven.Color.white	= function() { return new Raven.Color(255, 255, 255); };
Raven.Color.red		= function() { return new Raven.Color(255,   0,   0); };
Raven.Color.green	= function() { return new Raven.Color(  0, 255,   0); };
Raven.Color.blue	= function() { return new Raven.Color(  0,   0, 255); };

Raven.VIEW_CANVAS = "canvas";
Raven.VIEW_WEBGL  = "webgl";

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
    drawCircle: function(x, y, radius, fill, stroke) {},
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
    setStrokeRGBA: function(r, g, b, a) {}
};
