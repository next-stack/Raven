var Raven = Raven || {};

Raven.Shape = function(params) {
    Raven.DisplayObject.apply(this, arguments);
    this.name   = "Raven.Shape_" + Raven.Shape.count.toString();
    this.image  = undefined;
    this.loaded = false;
    this.svg    = "";
    ++Raven.Shape.count;
    return this;
};

Raven.Shape.extends( Raven.DisplayObject, Raven.Shape );
Raven.Shape.count = 0;

Raven.Shape.prototype.render = function(view) {
    if(!this.loaded || this.image === undefined) return this; // no image
    //
    var img = this.image;
    var w   = img.width;
    var h   = img.height;
    var a   = view.context.globalAlpha;
    view.context.globalAlpha = this.alpha;
    view.drawImage(img, 0, 0, w, h, 0, 0);
    view.context.globalAlpha = a;
    return this;
};

Raven.Shape.prototype.rerender = function(onComplete) {
    if(this.svg.length < 1) return this; // needs svg
    //
    var _this  = this;
    var DOMURL = window.URL || window.webkitURL || window;
    var svg    = new Blob([this.svg], {type: 'image/svg+xml;charset=utf-8'});
    var url    = DOMURL.createObjectURL(svg);
    var image  = new Image();
    image.onload = function () {
      DOMURL.revokeObjectURL(url);
      _this.size.x = image.width;
      _this.size.y = image.height;
      _this.image  = image;
      _this.loaded = true;
      if(onComplete !== undefined) onComplete(_this);
    }
    image.src = url;
    return this;
};

Raven.Shape.prototype.setSVG = function(svgString, onComplete) {
    this.svg = svgString;
    this.rerender( onComplete );
    return this;
};
