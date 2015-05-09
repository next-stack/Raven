AppController.extends( Raven.App );
function AppController(params) {
    Raven.App.apply(this, arguments);

    var s0 = Raven.element("hello");
    var s1 = Raven.element("lorem");

    this.setup = function(viewElement, width, height, renderer) {
        Raven.App.prototype.setup.call(this, viewElement, width, height, renderer);
        Raven.Ani.addPennerCSS(s0, "left", 300, 1, "QuadInOut", 1, undefined, function() {
            console.log("Tween complete");
        });
        Raven.Ani.addTweenCSS(s1, "left", 300, 0.75, 0.545, 0.000, 0.265, 0.985, 1.25);
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
