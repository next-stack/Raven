Box.extends( Raven.DisplayObject );
function Box(params) {
    Raven.DisplayObject.apply(this, arguments);

    this.position.set(200, 200, 0);
    this.size.set(200, 200, 0);

    this.update = function() {
        this.rotation.z += 1;
        return this;
    };

    this.render = function(g) {
        var offset = this.size.multiply(-0.5);
        g.setFillB(0);
        g.setLineWidth(4);
        g.setStrokeB(204);
        g.drawRect(offset.x, offset.y, this.size.x, this.size.y, true, true);

        g.setFillB(255);
        g.drawFont("Hello world", offset.x+10, offset.y+15);
    };

    return this;
};

// App

function AppController(params) {
    Raven.App.apply(this, arguments);

    this.setup = function(viewElement, width, height, renderer) {
        Raven.App.prototype.setup.call(this, viewElement, width, height, renderer);
        this.view.background.set(32, 32, 32);

        // Setup stage
        this.item = new Box();
        this.stage.addChild( this.item );
        
        return this;
    };

    this.draw = function() {
        Raven.App.prototype.draw.call(this);
        // Draw code here
        return this;
    };

    return this;
};

AppController.extends( Raven.App );

var app = new AppController({
    'fullscreen': true,
    'mobile': true
});
app.setup("world", 800, 600, Raven.VIEW_CANVAS);
app.play();
