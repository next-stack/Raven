var Raven = Raven || {};

Raven.Button = function(params) {
    Raven.DisplayObject.apply(this, arguments);
    
    this.name           = "Raven.Button_" + Raven.Button.count.toString();

    // Booleans
    this.isEnabled      = false;
    this.isDown         = false;
    this.isOver         = false;

    // Vectors
    this.touchOffset    = new Raven.Vec(0, 0);

    // Makes it extendable
    var _this = this;
    function evtHandler(evt) { _this.handleEvent(evt); }

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

    this.enable(); // auto-enable

    ++Raven.Button.count;

    return this;
};

Raven.Button.extends( Raven.DisplayObject, Raven.Button );
Raven.Button.count = 0;

// Events

Raven.Button.CLICK          = "ravenClick";

Raven.Button.prototype.handleEvent = function(evt) {
    var  wasOver = this.isOver;
    this.isOver  = this.hitTest(evt.x, evt.y);
    
    switch(evt.type) {
        case Raven.ActionEvent.DOWN:
            if(this.isOver) {
                this.isDown = true;
                this.onPress();
                this.dispatchEvent(new Raven.Event(Raven.Button.CLICK, this));
            }
        break;
        case Raven.ActionEvent.MOVE:
            if(this.isOver) {
                if(!wasOver) this.onRollOver();
                this.onMove();
            } else {
                if(wasOver) this.onRollOut();
            }
        break;
        case Raven.ActionEvent.UP:
            this.isDown = false;
            this.isOver ? this.onReleased() : this.onReleasedOutside();
        break;
    }
    return this;
};

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
