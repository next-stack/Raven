var Raven = Raven || {};

// Color
Raven.Color = function(r, g, b, a) {
  this.r = r != null ? r : 255;
  this.g = g != null ? g : 255;
  this.b = b != null ? b : 255;
  this.a = a != null ? a : 255;
  return this;
}

Raven.Color.prototype.set = function(r, g, b, a) {
  this.r = r != null ? r : 255;
  this.g = g != null ? g : 255;
  this.b = b != null ? b : 255;
  this.a = a != null ? a : 255;
  return this;
}

Raven.Color.prototype.copy = function() {
  return new Raven.Color(this.r, this.g, this.b, this.a);
}

Raven.Color.prototype.gl = function() {
  var c = this.copy();
  c.r = this.r / 255.0;
  c.g = this.g / 255.0;
  c.b = this.b / 255.0;
  c.a = this.a / 255.0;
  return c;
}

Raven.Color.prototype.css = function() {
  return 'rgba(' + Math.round(this.r) + ',' + Math.round(this.g) + ',' + Math.round(this.b) + ',' + ( this.a / 255 ) + ')';
}

Raven.Color.black = function() {
  return new Raven.Color(0, 0, 0, 255);
}

Raven.Color.white = function() {
  return new Raven.Color(255, 255, 255, 255);
}

Raven.Color.red = function() {
  return new Raven.Color(255, 0, 0, 255);
}

Raven.Color.green = function() {
  return new Raven.Color(0, 255, 0, 255);
}

Raven.Color.blue = function() {
  return new Raven.Color(0, 0, 255, 255);
}

Raven.Color.getHex = function(val) {
  var n = parseInt(val, 10);
  if(isNaN(n)) return "00";
  n = Math.max(0,Math.min(n,255));
  return "0123456789ABCDEF".charAt((n-n%16)/16) + "0123456789ABCDEF".charAt(n%16);
}

Raven.Color.rgbToHex = function(r, g, b) {
  return Raven.Color.getHex(r) + Raven.Color.getHex(g) + Raven.Color.getHex(b);
}

Raven.Color.hexToRGB = function(hex) {
  var h = (hex.charAt(0) == "#") ? hex.substring(1,7) : hex;
  var r = parseInt(h.substring(0,2),16);
  var g = parseInt(h.substring(2,4),16);
  var b = parseInt(h.substring(4,6),16);
  
  return new Raven.Color(r, g, b);
}

Raven.View = function() {
  
  this.width = 0;
  this.height = 0;
  this.canvas = null;
  this.autoClear = true;
  this.type = null;
  this.pixelRatio = 1;
  this.renderer = null;
  this.backgroundColor = Raven.Color.black();
  
  this.clear = function() {
    this.renderer.clear(this.width, this.height, this.backgroundColor);
  }
  
  this.render = function(autoClear) {
    if(autoClear) this.clear();
    if(this.type == Raven.View.VIEW_GL) this.renderer.render(this.width, this.height);
  }
  
  this.resize = function(width, height, enableRetina) {
    this.width  = width;
    this.height = height;
    
    var scale = enableRetina ? this.pixelRatio : 1;
    this.canvas.width  = width  * scale;
    this.canvas.height = height * scale;
  }
  
  this.init = function(canvas, renderType, settings, enableRetina) {
    
    var ratio = window.devicePixelRatio;
    this.pixelRatio = ratio;
    this.type = renderType;
    this.canvas = canvas;

    if(this.canvas && this.canvas.getContext) {
      switch(renderType) {
        case Raven.View.VIEW_CANVAS:
          this.renderer = new Raven.Canvas(this.canvas.getContext('2d'));
          if(enableRetina) {
            this.renderer.context.scale(ratio, ratio);
          }
        break;

        case Raven.View.VIEW_GL:
          this.renderer = new Raven.GL.Engine(this.canvas.getContext('experimental-webgl'), settings);
          // Retina not available for WebGL yet, no scale available
          this.renderer.init();
        break;
      }
    } else {
      console.log("Error establishing canvas", this.type);
    }
  }
  
};

Raven.View.VIEW_CANVAS = "Raven::viewCanvas";
Raven.View.VIEW_GL = "Raven::viewGL";
