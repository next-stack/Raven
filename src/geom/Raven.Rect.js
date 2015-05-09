var Raven = Raven || {};

Raven.Rect = function(x, y, w, h) {
    this.x = x ? x : 0;
    this.y = y ? y : 0;
    this.width  = w ? w : 0;
    this.height = h ? h : 0;
    this.left   = function() { return this.x; };
    this.top    = function() { return this.y; };
    this.right  = function() { return this.x + this.width;  };
    this.bottom = function() { return this.y + this.height; };
    this.hitTest = function(hx, hy) {
        return Raven.inBounds(hx, hy, this.x, this.y, this.right(), this.bottom());
    };
    this.clone = function() {
        return new Raven.Rect(
            this.x,
            this.y,
            this.width,
            this.height
        );
    };
    this.overlap = function(rect) {
        var l = rect.left(),
        t = rect.top(),
        r = rect.right(),
        b = rect.bottom(),
        resultX = Raven.between(this.x, this.right(),  l) || Raven.between(this.x, this.right(),  r),
        resultY = Raven.between(this.y, this.bottom(), t) || Raven.between(this.y, this.bottom(), b);
        return resultX && resultY;
    };
    this.mapToDiv = function(div) {
        this.x = div.offsetLeft;
        this.y = div.offsetTop;
        this.width  = div.offsetWidth;
        this.height = div.offsetHeight;
        return this;
    };
    this.set = function(x, y, w, h) {
        if(x !== undefined) this.x = x;
        if(y !== undefined) this.y = y;
        if(w !== undefined) this.width  = w;
        if(h !== undefined) this.height = h;
    };
    return this;
};

Raven.Rect.prototype.constructor = Raven.Rect;
