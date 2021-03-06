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
     this.r = r !== undefined ? r : 0;
     this.g = g !== undefined ? g : 0;
     this.b = b !== undefined ? b : 0;
     this.a = a !== undefined ? a : 255;
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

     this.gl  = function() {
        return [
            this.r / 255,
            this.g / 255,
            this.b / 255,
            this.a / 255
        ];
     };

     // Setters
     this.set = function(r, g, b, a) {
         if(r !== undefined) this.r = r;
         if(g !== undefined) this.g = g;
         if(b !== undefined) this.b = b;
         if(a !== undefined) this.a = a;
         return this;
     };
     this.setColor = function(rColor) {
        this.r = rColor.r;
        this.g = rColor.g;
        this.b = rColor.b;
        this.a = rColor.a;
        return this;
     };
     /**
      * hex - number - HEX
      */
     this.fromHex = function(hex) {
        var c = Raven.Color.fromHex(hex);
        this.setColor(c);
        return this;
     }
     /**
      * hex - string - HEX
      */
     this.setHex = function(hex) {
        var c = Raven.Color.hexToRGB(hex);
        this.setColor(c);
        return this;
     };
     return this;
};

/**
 * hex - number - Example: 0xFFFFFF
 */
Raven.Color.fromHex = function(hex) {
    var col = new Raven.Color();
    col.r = hex >> 16 & 255;
    col.g = hex >>  8 & 255;
    col.b = hex & 255;
    return col;
};

/**
 * hexCode - string - Example: "FF"
 */
Raven.Color.getHex = function(hexCode) {
	var n = parseInt(hexCode, 10);
	if(isNaN(n)) return "00";
	n = Math.max(0,Math.min(n,255));
	return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
};

/**
 * hex - string - Example: "#FFFFFF" or "FFFFFF"
 */
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

// View Matrix

Raven.ViewMatrix = function() {
    this.rotate    = new Raven.Vec(0, 0, 0);
    this.scale     = new Raven.Vec(1, 1, 1);
    this.translate = new Raven.Vec(0, 0, 0);
    this.transform = {
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        e: 0,
        f: 0
    };
    return this;
};

Raven.ViewMatrix.prototype.reset = function() {
    this.rotate    = new Raven.Vec(0, 0, 0);
    this.scale     = new Raven.Vec(1, 1, 1);
    this.translate = new Raven.Vec(0, 0, 0);
    this.transform = {
        a: 1,
        b: 0,
        c: 0,
        d: 1,
        e: 0,
        f: 0
    };
    return this;
};

// View

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
    setup: function(cElement) {
        var el          = (typeof cElement === "string") ? Raven.element(cElement) : cElement;
        this.align      = Raven.Align.TOP_LEFT;
        this.element    = el;
        this.width      = this.element.width;
        this.height     = this.element.height;
    },
    clear: function() {},
    resize: function(w, h) {
        this.element.width  = w * this.pixelRatio;
        this.element.height = h * this.pixelRatio;
        this.width  = w;
        this.height = h;
    },
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
    drawBezier: function(sx, sy, h0x, h0y, h1x, h1y, ex, ey, fill, stroke) {},
    drawCircle: function(x, y, radius, fill, stroke) {},
    drawPoly: function(x, y, radius, sides, rotation, fill, stroke) {},
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
