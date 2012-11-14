var Raven = Raven || {};
Raven.AppHandler = this;
Raven.App = function() {
  this.frameRate = 60;
  this.autoClear = true;
  this.fullsize = true;
  this.supportMobile = false;
  this.mouseX = -1;
  this.mouseY = -1;
  this.touchPoints = [];
  this.isMobile = false;
  
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
Raven.App.prototype.touchDown = function(id, mx, my) {}
Raven.App.prototype.touchMove = function(id, mx, my) {}
Raven.App.prototype.touchUp = function(id, mx, my) {}
Raven.App.prototype.touchHandler = function(evt) {
  this.touchPoints = [];
  
  var touches = evt.targetTouches;
  var total = touches.length;
  for(var i = 0; i < total; ++i) {
    this.touchPoints[i] = { id: touches[i].identifier, x: touches[i].clientX, y: touches[i].clientY };
  }
  touches = null;
  
  var changes = evt.changedTouches;
  total = changes.length;
  
  switch(evt.type) {
    case Raven.DOM.TOUCH_DOWN:
      for(i = 0; i < total; ++i) this.touchDown(changes[i].identifier, changes[i].clientX, changes[i].clientY);
    break;
    
    case Raven.DOM.TOUCH_MOVE:
      for(i = 0; i < total; ++i) this.touchMove(changes[i].identifier, changes[i].clientX, changes[i].clientY);
    break;
    
    case Raven.DOM.TOUCH_UP:
      for(i = 0; i < total; ++i) this.touchUp(changes[i].identifier, changes[i].clientX, changes[i].clientY);
    break;
  }
  touches = null;
}
Raven.App.prototype.acceleration = function(vecAmt) {}
Raven.App.prototype.gyro = function(vecAmt) {}

Raven.App.updateHandler = function() {
  Raven.AppHandler.update();
  Raven.App.renderHandler();
  ++Raven.frameNum;
}

Raven.App.renderHandler = function() {
  if(Raven.AppHandler.autoClear) Raven.Canvas.clear();
  Raven.AppHandler.render();
}

Raven.App.prototype.mobileHandler = function(evt) {
  evt.preventDefault();
  
  if(evt.type == Raven.DOM.TOUCH_DOWN || evt.type == Raven.DOM.TOUCH_MOVE || evt.type == Raven.DOM.TOUCH_UP) {
    total = evt.changedTouches.length;
  }
  
  switch(evt.type) {
    case Raven.DOM.TOUCH_DOWN:
    case Raven.DOM.TOUCH_MOVE:
    case Raven.DOM.TOUCH_UP:
      Raven.AppHandler.touchHandler(evt);
    break;
    
    case Raven.DOM.GYRO_UPDATE:
      Raven.View.rotation.x = Raven.roundTo(evt.beta,  100);
      Raven.View.rotation.y = Raven.roundTo(evt.alpha, 100);
      Raven.View.rotation.z = Raven.roundTo(evt.gamma, 100);
      Raven.AppHandler.gyro(Raven.View.rotation);
    break;
    
    case Raven.DOM.ACCELERATION_UPDATE:
      Raven.View.acceleration.x = Raven.roundTo(evt.accelerationIncludingGravity.x / 9.81, 100);
      Raven.View.acceleration.y = Raven.roundTo(evt.accelerationIncludingGravity.y / 9.81, 100);
      Raven.View.acceleration.z = Raven.roundTo(evt.accelerationIncludingGravity.z / 9.81, 100);
      Raven.AppHandler.acceleration(Raven.View.acceleration);
    break;
  }
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
      if(evt.clientX < Raven.View.width && evt.clientY < Raven.View.height) {
        Raven.AppHandler.mouseX = evt.clientX;
        Raven.AppHandler.mouseY = evt.clientY;
        Raven.AppHandler.mouseDown(evt.clientX, evt.clientY);
      }
    break;
    
    case Raven.DOM.MOUSE_MOVE:
      if(evt.clientX < Raven.View.width && evt.clientY < Raven.View.height) {
        Raven.AppHandler.mouseX = evt.clientX;
        Raven.AppHandler.mouseY = evt.clientY;
        Raven.AppHandler.mouseMove(evt.clientX, evt.clientY);
      }
    break;
    
    case Raven.DOM.MOUSE_UP:
      if(evt.clientX < Raven.View.width && evt.clientY < Raven.View.height) {
        Raven.AppHandler.mouseUp(evt.clientX, evt.clientY);
        // Reset pos
        Raven.AppHandler.mouseX = -1;
        Raven.AppHandler.mouseY = -1;
      }
    break;
  }
}

Raven.App.prototype.init = function() {
  Raven.DOM.watch(window, Raven.DOM.RESIZE, this.evtHandler);
  Raven.DOM.watch(document, Raven.DOM.MOUSE_DOWN, this.evtHandler);
  Raven.DOM.watch(document, Raven.DOM.MOUSE_MOVE, this.evtHandler);
  Raven.DOM.watch(document, Raven.DOM.MOUSE_UP, this.evtHandler);
  if(Raven.AppHandler.supportMobile) {
    Raven.DOM.watch(Raven.View.canvas, Raven.DOM.TOUCH_DOWN, this.mobileHandler);
    Raven.DOM.watch(Raven.View.canvas, Raven.DOM.TOUCH_MOVE, this.mobileHandler);
    Raven.DOM.watch(Raven.View.canvas, Raven.DOM.TOUCH_UP, this.mobileHandler);
    
    if(window.DeviceOrientationEvent) {
      this.isMobile = true;
      Raven.DOM.watch(window, Raven.DOM.GYRO_UPDATE, this.mobileHandler);
    }
    if(window.DeviceMotionEvent) {
      this.isMobile = true;
      Raven.DOM.watch(window, Raven.DOM.ACCELERATION_UPDATE, this.mobileHandler);
    }
  }
  
  if(Raven.AppHandler.fullsize) Raven.AppHandler.resize(window.innerWidth, window.innerHeight);
}

Raven.App.prototype.dispose = function() {
  Raven.DOM.unwatch(window, Raven.DOM.RESIZE, this.evtHandler);
  Raven.DOM.unwatch(document, Raven.DOM.MOUSE_DOWN, this.evtHandler);
  Raven.DOM.unwatch(document, Raven.DOM.MOUSE_MOVE, this.evtHandler);
  Raven.DOM.unwatch(document, Raven.DOM.MOUSE_UP, this.evtHandler);
  Raven.DOM.unwatch(Raven.View.canvas, Raven.DOM.TOUCH_DOWN, this.mobileHandler);
  Raven.DOM.unwatch(Raven.View.canvas, Raven.DOM.TOUCH_MOVE, this.mobileHandler);
  Raven.DOM.unwatch(Raven.View.canvas, Raven.DOM.TOUCH_UP, this.mobileHandler);
  Raven.DOM.unwatch(window, Raven.DOM.GYRO_UPDATE, this.mobileHandler);
  Raven.DOM.unwatch(window, Raven.DOM.ACCELERATION_UPDATE, this.mobileHandler);
}

Raven.App.prototype.autoRender = function() {
  window.requestAnimationFrame(Raven.AppHandler.autoRender);
  Raven.App.updateHandler();
}