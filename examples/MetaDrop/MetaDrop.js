/**
 * This app demos basic canvas drawing / mobile support.
 */

var wid = 1024;
var hei = 1024;
var widH = wid * 0.5;
var heiH = hei * 0.5;

var app = Raven.makeInstance(Raven.App);

app.setup(wid, hei, Raven.View.VIEW_CANVAS);

app.init = function() {
  this.super.init();
  createPoints(30, 100, widH, heiH);
}

app.keyDown = function(evt) {
  switch(evt.keyCode) {
    case Key.V:
      
    break;
    
    case Key.B:
      
    break;
    
    case Key.N:
      
    break;
    
    case Key.m:
      
    break;
  }
}

app.render = function() {
  var g = this.view.renderer;
  g.setFillRGB(255, 0, 0);
  
  var total = pts.length;
  for(var i = 0; i < total; ++i) {
    
  }
}

app.init(app.view.canvas);
app.view.backgroundColor.set(32, 32, 32);
app.autoRender();
