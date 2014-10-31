AppController.extends( Raven.App );
function AppController(params) {
    Raven.App.apply(this, arguments);
    this.stage;

    this.setup = function(viewElement, width, height, renderer) {
        Raven.App.prototype.setup.call(this, viewElement, width, height, renderer);
        this.view.background.set(32, 32, 32);

        this.stage = new Raven.Stage();
        this.stage.addChild( new DisplayChildrenScene() );
        this.stage.showChild("DisplayChildren");
        return this;
    };

    this.update = function() {
        Raven.App.prototype.update.call(this);
        this.stage.update();
        return this;
    }

    this.draw = function() {
        Raven.App.prototype.draw.call(this);
        this.stage.draw(this.view);
        return this;
    };

    return this;
};

var mBox, sBox;
var app = new AppController({
    'fullscreen': true,
    'mobile': true
});
app.setup("world", 800, 600, Raven.VIEW_CANVAS);
app.autoRender();
