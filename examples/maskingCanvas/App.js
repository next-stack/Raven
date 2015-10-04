AppController.extends( Raven.App );
function AppController(params) {
    Raven.App.apply(this, arguments);

    this.setup = function(viewElement, width, height, renderer) {
        Raven.App.prototype.setup.call(this, viewElement, width, height, renderer);
        this.view.align = Raven.Align.TOP_LEFT;
        this.view.background.set(32, 32, 32);
        return this;
    };

    this.draw = function() {
        var g = this.view;
        g.context.font = "10px Arial";
        Raven.App.prototype.draw.call(this);

        // Declare vars
        var time = this.elapsedTime * 0.075;
        var radius = Raven.cosRange(time, 200, 100);
        var halfR  = radius * 0.5;
        var rotate = time * 1.5,
        x = Raven.cosRange(time*(Math.PI * 0.5), 450, 50),
        y = Raven.cosRange(time*1, 200, 200);
        x = 200;
        y = 200;
        // rotate = 0;
        // radius = 200;
        // halfR  = radius / 2;
        g.context.font = "48px Helvetica";

        g.setFillB(102);
        g.setStrokeB(102);

        // Begin Masking
        g.beginMask();

        // Mask shape
        g.drawPoly(x-halfR, y-halfR, radius, 6, 0, true);

        // Mask complete
        g.endMask();

        // Draw masked content
        // g.drawCircle(200, 200, 400, true);
        g.drawRect(100, 100, 400, 300, true);

        // Stop masking
        g.stopMask();

        // After mask
        g.drawPoly(x-halfR, y-halfR, radius, 6, 0, false, true);

        return this;
    };

    return this;
};

var app = new AppController({
    'fullscreen': true,
    'mobile': true
});
app.setup("world", 800, 600, Raven.VIEW_CANVAS);
app.play();
