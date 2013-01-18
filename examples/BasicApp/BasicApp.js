/**
 * This app demos basic canvas drawing / mobile support.
 */

var app = Raven.makeInstance(Raven.App);

app.fullsize = true;
app.supportMobile = true;
app.setup(1024, 768, Raven.View.VIEW_CANVAS);

app.init = function() {
  this.super.init();
}

app.update = function() {
}

app.render = function() {
  this.view.renderer.setFillRGB(255, 0, 0);
  this.view.renderer.drawRect(50, 50, 100, 100);
}

app.init(app.view.canvas);
app.view.backgroundColor.set(32, 32, 32);
app.autoRender();
