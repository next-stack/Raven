// App

function AppController(params) {
    Raven.App.apply(this, arguments);

    var txt = "abcdefghijklmnopqrstuvwxyz";
    txt += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    txt += "0123456789`-=[];',./~_+{}|:<>?\"\\";

    this.setup = function(viewElement, width, height, renderer) {
        Raven.App.prototype.setup.call(this, viewElement, width, height, renderer);
        this.view.autoClear = false;
        return this;
    };

    this.draw = function() {
        var g = this.view;
        // g.context.font = "10px sans-serif";
        // Raven.App.prototype.draw.call(this);
        //
        g.context.font = 'bold 72px "Helvetica Neue"';
        //
        var t = txt.split("");
        g.setFillB(255);
        var i, total = t.length;
        for(i = 0; i < total; ++i) {
            var c = i % 13;
            var r = Math.floor(i / 13);
            var x = c * 90 + 100;
            var y = r * 90 + 100;
            g.drawFont(t[i], x, y);
        }
        // g.drawFont(txt, )
        // Draw code here
        return this;
    };

    this.onTouchDown = function(id, x, y) {
        console.log(this.view.element, this.view.context);
        var dataURL = this.view.element.toDataURL();
        document.getElementById('world').src = dataURL;
        return this;
    };

    return this;
};

AppController.extends( Raven.App );

var app = new AppController({
    'fullscreen': true
    // 'mobile': true
});
app.setup("world", 800, 600, Raven.VIEW_CANVAS);
app.updateHandler();
// app.autoRender();
