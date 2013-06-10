/**
 * This app demos basic canvas drawing / mobile support.
 */

var app = Raven.makeInstance(Raven.App);

app.enableRetina = true;
app.fullsize = true;
app.supportMobile = true;

app.setup(1024, 768, Raven.element("world"), Raven.View.VIEW_CANVAS);

var obj = {
  x: 100,
  y: 100,
  width:  100,
  height: 100
};

app.init = function() {
  this.super.init();
  Ani.addPenner(obj, "x", 200, 1, Penner.ExpoOut, 1);
  Ani.addPenner(obj, "x", 100, 1, Penner.QuintInOut, 2);
}

app.update = function() {
  Ani.update();
}

app.render = function() {
  var g = this.view.renderer;
  g.setFillRGB(255, 0, 0);
  g.drawRect(obj.x, obj.y, obj.width, obj.height, true, false);
  g.setFillRGB(255, 255, 255);
  g.drawFont("Active: " + Ani.active, 25, 25);
  g.drawFont("Total: " + Ani.totalTweens(), 25, 40);
}

app.init(app.view.canvas);
app.view.backgroundColor = Raven.Color.hexToRGB("#333333");
app.autoRender();
