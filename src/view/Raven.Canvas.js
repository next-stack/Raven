var Raven = Raven || {};

//////////////////////////////////////////////////
// Canvas
//////////////////////////////////////////////////

Raven.CanvasView = function() {
    Raven.View.call(this);
    this.type = Raven.VIEW_CANVAS;
    this.matrices = [
        new Raven.ViewMatrix()
    ];
    return this;
};

Raven.CanvasView.prototype = new Raven.View();
Raven.CanvasView.prototype.constructor = Raven.CanvasView;

Raven.CanvasView.prototype.__defineGetter__("matrix", function(){
    if(this.matrices.length > 0) {
        return this.matrices[ this.matrices.length-1 ];
    }
    return null;
});

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
Raven.CanvasView.prototype.beginMask = function() {
    this.context.save();
    this.masking = true;
    return this;
};
Raven.CanvasView.prototype.endMask = function() {
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
Raven.CanvasView.prototype.drawArc       = function(x, y, radius, degrees, angleOffset, fill, stroke) {
    if(degrees - angleOffset >= 360) {
        return this.drawCircle(x, y, radius, fill, stroke);
    }
    var hRad = radius * 0.5,
    o = Raven.Align.getOffset(x+hRad, y+hRad, radius, radius, this);
    var rArc = Raven.degToRad(degrees),
        rOff = Raven.degToRad(angleOffset);
    if(this.masking) {
        this.context.beginPath();
        this.context.arc(o.x, o.y, hRad, rOff, rArc, false);
    } else {
        this.begin();
        this.context.arc(o.x, o.y, hRad, rOff, rArc, false);
        this.end(fill, stroke);
    }
    return this;
};
Raven.CanvasView.prototype.drawCircle    = function(x, y, radius, fill, stroke) {
    var hRad = radius * 0.5,
    o = Raven.Align.getOffset(x+hRad, y+hRad, radius, radius, this);
    if(this.masking) {
        this.context.beginPath();
        this.context.arc(o.x, o.y, hRad, 0, Math.PI*2, false);
    } else {
        this.begin();
        this.context.arc(o.x, o.y, hRad, 0, Math.PI*2, false);
        this.end(fill, stroke);
    }
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
Raven.CanvasView.prototype.drawPoly    = function(x, y, radius, sides, fill, stroke) {
    if(sides < 2) return this;
    //
    var hRad = radius * 0.5,
    o = Raven.Align.getOffset(x+hRad, y+hRad, radius, radius, this);
    var i, x0, y0, deg, total = sides+1, iTotal = sides;
    
    if(this.masking) {
        this.context.beginPath();
        this.context.arc(o.x, o.y, hRad, 0, Math.PI*2, false);
    } else {
        this.begin();
    }

    var degOffset = (360 / sides) * 0.5;
    for(i = 0; i < total; ++i) {
        deg = Raven.degToRad( (i / iTotal) * 360 - degOffset );
        x0 = Math.cos(deg) * radius + o.x;
        y0 = Math.sin(deg) * radius + o.y;
        if(i > 0) {
            this.lineTo(x0, y0);
        } else {
            this.moveTo(x0, y0);
        }
    }
    if(!this.masking) this.end(fill, stroke);
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

Raven.CanvasView.prototype.rotate = function(x, y, z) {
    if(x !== undefined) this.matrix.rotate.x = x;
    if(y !== undefined) this.matrix.rotate.y = y;
    if(z !== undefined) this.matrix.rotate.z = z;
    this.context.rotate( Raven.degToRad(this.matrix.rotate.z) );
};

Raven.CanvasView.prototype.scale = function(x, y, z) {
    if(x !== undefined) this.matrix.scale.x = x;
    if(y !== undefined) this.matrix.scale.y = y;
    if(z !== undefined) this.matrix.scale.z = z;
    this.context.scale( x, y );
};

Raven.CanvasView.prototype.transform = function(a, b, c, d, e, f) {
    this.matrix.transform.a = a;
    this.matrix.transform.b = b;
    this.matrix.transform.c = c;
    this.matrix.transform.d = d;
    this.matrix.transform.e = e;
    this.matrix.transform.f = f;
    this.context.transform( a, b, c, d, e, f );
};

Raven.CanvasView.prototype.translate = function(x, y, z) {
    if(x !== undefined) this.matrix.translate.x = x;
    if(y !== undefined) this.matrix.translate.y = y;
    if(z !== undefined) this.matrix.translate.z = z;
    this.context.translate( x, y );
};

Raven.CanvasView.prototype.pushMatrix = function() {
    this.matrices.push( new Raven.ViewMatrix() );
};

Raven.CanvasView.prototype.popMatrix = function() {
    // Reverse any changes
    this.rotate( -this.matrix.rotate.x, -this.matrix.rotate.y, -this.matrix.rotate.z );
    this.scale(  -this.matrix.scale.x,  -this.matrix.scale.y,  -this.matrix.scale.z );
    this.transform(
        -this.matrix.transform.a,
        -this.matrix.transform.b,
        -this.matrix.transform.c,
        -this.matrix.transform.d,
        -this.matrix.transform.e,
        -this.matrix.transform.f
    );
    this.translate( -this.matrix.translate.x, -this.matrix.translate.y, -this.matrix.translate.z );
    this.matrices.pop();
};
