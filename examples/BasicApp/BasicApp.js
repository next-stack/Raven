/**
 * This app demos basic canvas drawing / mobile support.
 */

var app = Raven.makeInstance(Raven.App);

app.enableRetina = true;
app.fullsize = true;
app.supportMobile = true;

app.init = function() {
  this.super.init();
}

app.update = function() {}

app.render = function() {
  this.view.renderer.setFillRGB(255, 255, 255);
  this.view.renderer.drawFont("Hello world!", 50, 50);
}

app.setup(1024, 768, Raven.element("world"), Raven.View.VIEW_CANVAS);
app.init(app.view.canvas);
app.view.backgroundColor = Raven.Color.hexToRGB("#0d0e0e");
app.autoRender();
