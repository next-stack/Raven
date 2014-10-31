AppController.extends( Raven.App );
function AppController(params) {
    Raven.App.apply(this, arguments);

    var s0 = Raven.element("hello");
    var s1 = Raven.element("lorem");

    this.setup = function(viewElement, width, height, renderer) {
        Raven.App.prototype.setup.call(this, viewElement, width, height, renderer);
        Raven.Ani.addPennerCSS(s0, "left", 300, 1, "QuadInOut", 1, null, function() {
            console.log("Tween complete");
        });
        return this;
    };

    this.update = function() {
        return this;
    };

    return this;
};

var app = new AppController();
app.setup("world");
app.autoRender();
