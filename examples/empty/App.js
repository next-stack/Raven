AppController.extends( Raven.App );
function AppController(params) {
    Raven.App.apply(this, arguments);

    this.setup = function(viewElement, width, height, renderer) {
        Raven.App.prototype.setup.call(this, viewElement, width, height, renderer);
        this.view.background.set(32, 32, 32);
        return this;
    };

    this.draw = function() {
        Raven.App.prototype.draw.call(this);
        return this;
    };

    return this;
};

var app = new AppController({
    'fullscreen': true,
    'mobile': true
});
app.setup("world", 800, 600, Raven.VIEW_CANVAS);
app.autoRender();
