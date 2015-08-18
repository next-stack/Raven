// App

function AppController(params) {
    Raven.App.apply(this, arguments);

    this.setup = function(viewElement, width, height, renderer) {
        Raven.App.prototype.setup.call(this, viewElement, width, height, renderer);
        this.view.background.set(32, 32, 32);
        this.view.align = Raven.Align.CENTER;

        // Setup stage
        shape = new Raven.Shape();
        shape.position.set(150, 150);
        shape.setSVG( svg );
        this.stage.addChild( shape );
        
        return this;
    };

    this.update = function() {
        shape.alpha = Raven.cosRange( this.elapsedTime * 0.2, 1, 0.1 );
        shape.rotation.z += 0.2;
        return this;
    };

    return this;
};

AppController.extends( Raven.App );

var shape;
var svg   = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 200 200" enable-background="new 0 0 200 200" xml:space="preserve"><path fill="#7281BF" stroke="#E91B55" stroke-width="2" stroke-miterlimit="10" d="M58.1,22.2c-39.7,2.5-60.9,27-45.6,64.1 s36.5,56.9,20.5,74.6s64.2,43.5,82.4,15.3s9.5-68.5,34.1-67.7c24.6,0.8,56-21.4,22.2-45s27.6-42.5-21-51.4s-22.2,42.7-31.2,45.4 c-8.9,2.8-44.8-6.3-37.7-30C89,3.9,67.6,21.6,58.1,22.2z"/></svg>';
var app = new AppController({
    'fullscreen': true,
    'mobile': true
});
app.setup("world", 800, 600, Raven.VIEW_CANVAS);
app.play();


