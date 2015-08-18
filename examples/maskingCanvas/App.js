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
        g.context.font = "48px Helvetica";

        // Begin Masking
        g.beginMask();

        // Draw mask
        g.pushMatrix();
        g.translate(x, y);
        g.rotate(0, 0, rotate);
        g.drawPoly(-halfR, -halfR, radius, 6);
        g.popMatrix();

        // Mask complete
        g.endMask();

        // Draw masked content
        g.setFillB(102);
        g.drawCircle(100, 100, 400, true);
        g.setFillB(255);
        g.drawFont("Hello world", 180, 318);

        // Stop content from being masked
        g.stopMask();

        // Now let's redraw the same content, out of mask but outlined,
        // so we can still watch over the masked animation

        // Content
        g.setLineWidth(2);
        g.setStrokeB(128);
        g.drawCircle(100, 100, 400, false, true);
        g.setLineWidth(1);

        // Mask
        // g.setLineWidth(4);
        // g.setStrokeRGB(255, 0, 0);
        // g.pushMatrix();
        // g.translate(x, y);
        // g.rotate(0, 0, rotate);
        // g.drawPoly(-halfR, -halfR, radius, 6, false, true);
        // g.popMatrix();

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
