AppController.extends( Raven.App );
function AppController(params) {
    Raven.App.apply(this, arguments);

    this.setup = function(viewElement, width, height, renderer) {
        Raven.App.prototype.setup.call(this, viewElement, width, height, renderer);
        this.view.align = Raven.Align.LEFT;
        this.view.background.set(32, 32, 32);
        //
        var btn;

        btn = new Raven.Button();
        btn.name = "Hello";
        btn.setup(25, 100, 100, 30);
        this.stage.addChild(btn);
        btn.addListener(Raven.Button.CLICK, btnHandler);

        btn = new Raven.Button();
        btn.name = "World";
        btn.setup(135, 100, 100, 30);
        this.stage.addChild(btn);
        btn.addListener(Raven.Button.CLICK, btnHandler);
        //
        return this;
    };

    function btnHandler(evt) {
        console.log(evt.type, evt.params.name);
    }

    return this;
};

var app = new AppController({
    'fullscreen': true,
    'mobile': true
});
app.setup("world", 800, 600, Raven.VIEW_CANVAS);
app.autoRender();
