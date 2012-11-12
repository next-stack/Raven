var Raven = Raven || {};
Raven.AppHandler = this;
Raven.App = function() {
  this.frameRate = 60;
  this.autoClear = true;
  this.fullsize = true;
  this.supportMobile = false;
  
  // Navigator props
  this.browserName = navigator.appName,
  this.browserCodeName = navigator.appCodeName;
  this.browserVersion = navigator.appVersion;
  this.cookieEnabled = navigator.cookieEnabled;
  this.platform = navigator.platform;
  Raven.AppHandler = this;
}

Raven.App.prototype.resize = function(wid, hei) {
  Raven.Canvas.size(wid, hei);
}

Raven.App.prototype.setup = function(wid, hei) {
  Raven.Canvas.init( Raven.DOM.getElemID('world') );
  this.resize(wid, hei);
}

Raven.App.prototype.update = function() {}
Raven.App.prototype.render = function() {}
Raven.App.prototype.mouseDown = function(mx, my) {}
Raven.App.prototype.mouseMove = function(mx, my) {}
Raven.App.prototype.mouseUp = function(mx, my) {}
// Mobile
Raven.App.prototype.touchDown = function(mx, my) {}
Raven.App.prototype.touchMove = function(mx, my) {}
Raven.App.prototype.touchUp = function(mx, my) {}
Raven.App.prototype.acceleration = function(vecAmt) {
  Raven.View.acceleration = vecAmt;
}
Raven.App.prototype.gyro = function(vecAmt) {
  Raven.View.rotation = vecAmt;
}

Raven.App.updateHandler = function() {
  Raven.AppHandler.update();
  Raven.App.renderHandler();
  ++Raven.frameNum;
}

Raven.App.renderHandler = function() {
  if(Raven.AppHandler.autoClear) Raven.Canvas.clear();
  Raven.AppHandler.render();
}

Raven.App.prototype.evtHandler = function(evt) {
  switch(evt.type) {
    case Raven.DOM.RESIZE:
      if(Raven.AppHandler.fullsize) {
        Raven.AppHandler.resize(window.innerWidth, window.innerHeight);
      }
      Raven.App.renderHandler();
    break;
    
    case Raven.DOM.MOUSE_DOWN:
      if(evt.clientX < Raven.View.width && evt.clientY < Raven.View.height)
        Raven.AppHandler.mouseDown(evt.clientX, evt.clientY);
    break;
    
    case Raven.DOM.MOUSE_MOVE:
      if(evt.clientX < Raven.View.width && evt.clientY < Raven.View.height)
        Raven.AppHandler.mouseMove(evt.clientX, evt.clientY);
    break;
    
    case Raven.DOM.MOUSE_UP:
      if(evt.clientX < Raven.View.width && evt.clientY < Raven.View.height)
        Raven.AppHandler.mouseUp(evt.clientX, evt.clientY);
    break;
    
    case Raven.DOM.TOUCH_DOWN:
      if(evt.clientX < Raven.View.width && evt.clientY < Raven.View.height)
        Raven.AppHandler.touchDown(evt.clientX, evt.clientY);
    break;
    
    case Raven.DOM.TOUCH_MOVE:
      if(evt.clientX < Raven.View.width && evt.clientY < Raven.View.height)
        Raven.AppHandler.touchMove(evt.clientX, evt.clientY);
    break;
    
    case Raven.DOM.TOUCH_UP:
      if(evt.clientX < Raven.View.width && evt.clientY < Raven.View.height)
        Raven.AppHandler.touchUp(evt.clientX, evt.clientY);
    break;
  }
}

Raven.App.prototype.init = function() {
  Raven.DOM.watch(window, Raven.DOM.RESIZE, this.evtHandler);
  Raven.DOM.watch(document, Raven.DOM.MOUSE_DOWN, this.evtHandler);
  Raven.DOM.watch(document, Raven.DOM.MOUSE_MOVE, this.evtHandler);
  Raven.DOM.watch(document, Raven.DOM.MOUSE_UP, this.evtHandler);
  if(Raven.AppHandler.supportMobile) {
    Raven.DOM.watch(document, Raven.DOM.TOUCH_DOWN, this.evtHandler);
    Raven.DOM.watch(document, Raven.DOM.TOUCH_MOVE, this.evtHandler);
    Raven.DOM.watch(document, Raven.DOM.TOUCH_UP, this.evtHandler);
  }
  
  if(Raven.AppHandler.fullsize) Raven.AppHandler.resize(window.innerWidth, window.innerHeight);
}

Raven.App.prototype.dispose = function() {
  Raven.DOM.unwatch(window, Raven.DOM.RESIZE, this.evtHandler);
  Raven.DOM.unwatch(document, Raven.DOM.MOUSE_DOWN, this.evtHandler);
  Raven.DOM.unwatch(document, Raven.DOM.MOUSE_MOVE, this.evtHandler);
  Raven.DOM.unwatch(document, Raven.DOM.MOUSE_UP, this.evtHandler);
  Raven.DOM.unwatch(document, Raven.DOM.TOUCH_DOWN, this.evtHandler);
  Raven.DOM.unwatch(document, Raven.DOM.TOUCH_MOVE, this.evtHandler);
  Raven.DOM.unwatch(document, Raven.DOM.TOUCH_UP, this.evtHandler);
}

Raven.App.prototype.autoRender = function() {
  window.requestAnimationFrame(Raven.AppHandler.autoRender);
  Raven.App.updateHandler();
}