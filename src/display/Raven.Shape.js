var Raven = Raven || {};

Raven.Shape = function(params) {
    Raven.DisplayObject.apply(this, arguments);
    this.name   = "Raven.Shape_" + Raven.Shape.count.toString();
    this.image  = undefined;
    this.loaded = false;
    this.svg    = "";
    this.offset = new Raven.Vec();
    ++Raven.Shape.count;
    return this;
};

Raven.Shape.extends( Raven.DisplayObject, Raven.Shape );
Raven.Shape.count = 0;

Raven.Shape.prototype.render = function(view) {
    if(!this.loaded) return this; // no image

    var padding = 2, p2 = padding * 2;
    //
    view.setFillB(255);
    view.drawImage(this.image, 0, 0, this.size.x, this.size.y);
    //
    view.setFillRGBA(255, 255, 255, (1 - this.alpha) * 255);
    view.drawRect(-padding, -padding, this.size.x+p2, this.size.y+p2, true);
    // Bounds
    // view.setStrokeRGBA(255, 0, 0, 255 * this.opacity);
    // view.drawRect(0, 0, this.width, this.height, false, true);

    return this;
};

Raven.Shape.prototype.rerender = function(onComplete) {
    if(this.svg.length < 1) return this; // needs svg
    //
    var url = "data:image/svg+xml;base64,";
    url += window.btoa(unescape(encodeURIComponent( this.svg )));

    var _this   = this;
    var img     = new Image();
    this.loaded = false;
    img.addEventListener("error", function() {
        console.log("Error setting image...", _this.svg);
    }, false);
    img.addEventListener("load", function() {
        _this.size.set(img.width, img.height);
        _this.image  = img;
        _this.loaded = true;
        if(onComplete !== undefined) onComplete(_this);
    }, false);

    img.src = url;
    return this;
};

Raven.Shape.prototype.setSVG = function(svgString, onComplete) {
    this.svg = svgString;
    this.rerender( onComplete );
    return this;
};

Object.defineProperty(SVGElement.prototype, 'outerHTML', {
    get: function () {
        var $node, $temp;
        $temp = document.createElement('div');
        $node = this.cloneNode(true);
        $temp.appendChild($node);
        return $temp.innerHTML;
    },
    enumerable: false,
    configurable: true
});
