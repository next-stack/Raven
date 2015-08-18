var Raven = Raven || {};

Raven.Shape = function(params) {
    Raven.DisplayObject.apply(this, arguments);
    this.name   = "Raven.Shape_" + Raven.Shape.count.toString();
    this.image  = undefined;
    this.loaded = false;
    ++Raven.Shape.count;
    return this;
};

Raven.Shape.extends( Raven.DisplayObject, Raven.Shape );
Raven.Shape.count = 0;

Raven.Shape.prototype.render = function(view) {
    if(!this.loaded || this.image === undefined) return this; // no image
    //
    var img = this.image;
    var x   = this.position.x;
    var y   = this.position.y;
    var w   = img.width;
    var h   = img.height;
    //
    view.setFillB(102);
    view.drawRect(x, y, w, h, true);
    //
    view.setFillB(255);
    view.drawImage( img, x, y, w, h, 0, 0 );
    return this;
};

Raven.Shape.prototype.setSVG = function(svgString, onComplete) {
    var _this  = this;
    var DOMURL = window.URL || window.webkitURL || window;
    this.image = new Image();
    var svg    = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
    var url    = DOMURL.createObjectURL(svg);
    this.image.onload = function () {
      DOMURL.revokeObjectURL(url);
      _this.size.x = _this.image.width;
      _this.size.y = _this.image.height;
      _this.loaded = true;
      if(onComplete !== undefined) onComplete(_this);
    }
    this.image.src = url;
    return this;
};
