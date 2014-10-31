var Raven = Raven || {};

Raven.Button = function(params) {
    Raven.DisplayObject.apply(this, arguments);

    // Booleans
    this.isEnabled      = false;
    this.isDown         = false;
    this.isOver         = false;

    // Vectors
    this.touchOffset    = new Raven.Vec(0, 0);

    // Public
    
    this.enable = function() {
        if( this.isEnabled ) return this;
        this.isEnabled = true;
        Raven.addListener(Raven.ActionEvent.DOWN, evtHandler);
        Raven.addListener(Raven.ActionEvent.MOVE, evtHandler);
        Raven.addListener(Raven.ActionEvent.UP,   evtHandler);
        return this;
    };

    this.disable = function() {
        if( !this.isEnabled ) return this;
        this.isEnabled = false;
        Raven.removeListener(Raven.ActionEvent.DOWN, evtHandler);
        Raven.removeListener(Raven.ActionEvent.MOVE, evtHandler);
        Raven.removeListener(Raven.ActionEvent.UP,   evtHandler);
        return this;
    };

    // Private
    
    var _this = this;
    
    function evtHandler(evt) {
        var inBounds = _this.hitTest(evt.x, evt.y);
        var  wasOver = _this.isOver;
        _this.isOver = inBounds;
        
        switch(evt.type) {
            case Raven.ActionEvent.DOWN:
                if(inBounds) {
                    _this.isDown = true;
                    _this.onPress();
                    _this.dispatchEvent(new Raven.Event(Raven.Button.CLICK, _this));
                }
            break;
            case Raven.ActionEvent.MOVE:
                if(inBounds) {
                    if(!wasOver) _this.onRollOver();
                    _this.onMove();
                } else {
                    if(wasOver) _this.onRollOut();
                }
            break;
            case Raven.ActionEvent.UP:
                _this.isDown = false;
                inBounds ? _this.onReleased() : _this.onReleasedOutside();
            break;
        }
    }

    this.enable(); // auto-enable

    return this;
};

Raven.Button.extends( Raven.DisplayObject );
Raven.Button.count = 0;

// Events

Raven.Button.CLICK          = "ravenClick";

Raven.Button.prototype.render = function(view) {
    var a = this.isEnabled ? 255 : 102;
    if(this.isDown)         view.setFillRGBA(255, 0, 0, a);
    else if(this.isOver)    view.setFillRGBA(204, 204, 204, a);
    else                    view.setFillRGBA(64, 64, 64, a);
    view.drawRect(0, 0, this.width, this.height, true);
    view.setFillB(255);
    view.drawFont(this.name, 10, 18);
    return this;
};

Raven.Button.prototype.hitTest = function(x, y) {
    return Raven.inBounds(x, y, this.absoluteLeft,
                                this.absoluteTop,
                                this.absoluteRight,
                                this.absoluteBottom);
};

// Handlers

Raven.Button.prototype.onMove               = function() { return this; };
Raven.Button.prototype.onPress              = function() { return this; };
Raven.Button.prototype.onRollOver           = function() { return this; };
Raven.Button.prototype.onRollOut            = function() { return this; };
Raven.Button.prototype.onReleased           = function() { return this; };
Raven.Button.prototype.onReleasedOutside    = function() { return this; };

// Getters

Raven.Button.prototype.__defineGetter__("enabled", function(){
    return this.children.length;
});
