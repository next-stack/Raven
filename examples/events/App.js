var Events = {
    'NEW_BOX': 0
};

AppController.extends( Raven.App );
function AppController(params) {
    Raven.App.apply(this, arguments);

    var _this  = this;
    this.items = [];

    this.setup = function(viewElement, width, height, renderer) {
        Raven.App.prototype.setup.call(this, viewElement, width, height, renderer);
        this.view.align = Raven.Align.CENTER;
        this.view.background.set(32, 32, 32);
        //
        Raven.addListener(Events.NEW_BOX, this.eventHandler);
        return this;
    };

    this.draw = function() {
        Raven.App.prototype.draw.call(this);
        var g = this.view;
        for(var i in this.items) {
            var item = this.items[i];
            g.drawCircle( item.x, item.y, 20, true );
        }
        return this;
    };

    this.onTouchDown = function(id, x, y) {
        var evt = new Raven.Event(Events.NEW_BOX, {
            'x': x,
            'y': y
        });
        Raven.dispatchEvent(evt);
        return this;
    };

    this.eventHandler = function(evt) {
        _this.items.push( evt.params );
    }

    return this;
};

var app = new AppController({
    'fullscreen': true,
    'mobile': true
});
app.setup("world", 800, 600, Raven.VIEW_CANVAS);
app.autoRender();
