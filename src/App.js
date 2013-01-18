var Raven = Raven || {};
Raven.AppHandler = this;
Raven.App = function() {
  this.frameNum  = 0;
  this.frameRate = 60;
  this.autoClear = true;
  this.fullsize = true;
  this.supportMobile = false;
  this.mouseX = -1;
  this.mouseY = -1;
  this.isMousePressed = false;
  this.touchPoints = [];
  this.isMobile = false;
  this.view = null;
  this.autoClear = true;
  this.type = null;
  this.canvas = null;
  this.keysDown = {};
  
  this.pixelRatio = 1;
  this.enableRetina = false;

  this.acceleration = Raven.Vec3.zero();
  this.gyro = Raven.Vec3.zero();

  // Navigator props
  this.browserName = navigator.appName,
  this.browserCodeName = navigator.appCodeName;
  this.browserVersion = navigator.appVersion;
  this.cookieEnabled = navigator.cookieEnabled;
  this.platform = navigator.platform;
  Raven.AppHandler = this;
};

Raven.App.prototype.autoRender = function() {
  window.requestAnimationFrame(Raven.AppHandler.autoRender);
  Raven.AppHandler.updateHandler();
}

// Event handlers
Raven.App.prototype.touchHandler = function(evt) {
  var handler = Raven.AppHandler;
  handler.touchPoints = [];

  var touches = evt.targetTouches;
  var total = touches.length;
  for(var i = 0; i < total; ++i) {
    handler.touchPoints[i] = { id: touches[i].identifier, x: touches[i].clientX, y: touches[i].clientY };
  }
  touches = null;

  var changes = evt.changedTouches;
  total = changes.length;

  switch(evt.type) {
    case Raven.DOM.TOUCH_DOWN:
      for(i = 0; i < total; ++i) handler.touchDown(changes[i].identifier, changes[i].clientX, changes[i].clientY);
    break;

    case Raven.DOM.TOUCH_MOVE:
      for(i = 0; i < total; ++i) handler.touchMove(changes[i].identifier, changes[i].clientX, changes[i].clientY);
    break;

    case Raven.DOM.TOUCH_UP:
      for(i = 0; i < total; ++i) handler.touchUp(changes[i].identifier, changes[i].clientX, changes[i].clientY);
    break;
  }
  touches = null;
}

Raven.App.prototype.mobileHandler = function(evt) {
  var handler = Raven.AppHandler;
  evt.preventDefault();

  if(evt.type == Raven.DOM.TOUCH_DOWN || evt.type == Raven.DOM.TOUCH_MOVE || evt.type == Raven.DOM.TOUCH_UP) {
    total = evt.changedTouches.length;
  }

  switch(evt.type) {
    case Raven.DOM.TOUCH_DOWN:
    case Raven.DOM.TOUCH_MOVE:
    case Raven.DOM.TOUCH_UP:
      handler.touchHandler(evt);
    break;

    case Raven.DOM.GYRO_UPDATE:
      handler.gyro.x = Raven.roundTo(evt.beta,  100);
      handler.gyro.y = Raven.roundTo(evt.alpha, 100);
      handler.gyro.z = Raven.roundTo(evt.gamma, 100);
    break;

    case Raven.DOM.ACCELERATION_UPDATE:
      handler.acceleration.x = Raven.roundTo(evt.accelerationIncludingGravity.x / 9.81, 100);
      handler.acceleration.y = Raven.roundTo(evt.accelerationIncludingGravity.y / 9.81, 100);
      handler.acceleration.z = Raven.roundTo(evt.accelerationIncludingGravity.z / 9.81, 100);
    break;
  }
}

Raven.App.prototype.evtHandler = function(evt) {
  var handler = Raven.AppHandler;
  switch(evt.type) {
    case Raven.DOM.RESIZE:
      if(handler.fullsize) {
        handler.resize(window.innerWidth, window.innerHeight, this.enableRetina);
        handler.renderHandler();
      }
    break;
    
    case Raven.DOM.KEY_DOWN:
      handler.keysDown[evt.keyCode] = true;
      handler.keyDown(evt);
    break;
    
    case Raven.DOM.KEY_PRESS:
      handler.keyPress(evt);
    break;
    
    case Raven.DOM.KEY_UP:
      delete handler.keysDown[evt.keyCode];
      handler.keyUp(evt);
    break;

    case Raven.DOM.MOUSE_DOWN:
      handler.mouseX = evt.clientX;
      handler.mouseY = evt.clientY;
      handler.isMousePressed = true;
      handler.mouseDown(evt.clientX, evt.clientY);
    break;

    case Raven.DOM.MOUSE_MOVE:
      handler.mouseX = evt.clientX;
      handler.mouseY = evt.clientY;
      handler.mouseMove(evt.clientX, evt.clientY);
      //if(evt.clientX < handler.view.width && evt.clientY < handler.view.height) {
    break;

    case Raven.DOM.MOUSE_UP:
      handler.mouseUp(evt.clientX, evt.clientY);
      handler.mouseX = -1;
      handler.mouseY = -1;
      handler.isMousePressed = false;
    break;
  }
}

Raven.App.prototype.updateHandler = function() {
  Raven.AppHandler.update();
  Raven.AppHandler.renderHandler();
  ++Raven.AppHandler.frameNum;
}

Raven.App.prototype.renderHandler = function() {
  if(Raven.AppHandler.autoClear) {
    Raven.AppHandler.view.clear();
  }
  if(Raven.AppHandler.view.type == Raven.View.VIEW_GL) {
    Raven.AppHandler.view.render(Raven.AppHandler.view.width, Raven.AppHandler.view.height);
  }
  Raven.AppHandler.render();
}

Raven.App.prototype.update = function() {}
Raven.App.prototype.render = function() {}
Raven.App.prototype.mouseDown = function(mx, my) {}
Raven.App.prototype.mouseMove = function(mx, my) {}
Raven.App.prototype.mouseUp = function(mx, my) {}

Raven.App.prototype.keyDown = function(evt) {}
Raven.App.prototype.keyPress = function(evt) {}
Raven.App.prototype.keyUp = function(evt) {}

// Mobile
Raven.App.prototype.touchDown = function(id, mx, my) {}
Raven.App.prototype.touchMove = function(id, mx, my) {}
Raven.App.prototype.touchUp = function(id, mx, my) {}

Raven.App.prototype.resize = function(wid, hei) {
  Raven.AppHandler.view.resize(wid, hei);
}

Raven.App.prototype.setup = function(wid, hei, rendererType, settings) {
  Raven.AppHandler.canvas = Raven.DOM.getElemID('world');
  Raven.AppHandler.view = new Raven.View();
  Raven.AppHandler.view.init(Raven.AppHandler.canvas, rendererType, settings ? settings : {}, this.enableRetina);
  Raven.AppHandler.view.resize(wid, hei);
}

Raven.App.prototype.init = function() {
  Raven.DOM.watch(window, Raven.DOM.RESIZE, Raven.AppHandler.evtHandler);
  Raven.DOM.watch(Raven.AppHandler.view.canvas, Raven.DOM.MOUSE_DOWN, Raven.AppHandler.evtHandler);
  Raven.DOM.watch(Raven.AppHandler.view.canvas, Raven.DOM.MOUSE_MOVE, Raven.AppHandler.evtHandler);
  Raven.DOM.watch(Raven.AppHandler.view.canvas, Raven.DOM.MOUSE_UP, Raven.AppHandler.evtHandler);
  
  Raven.DOM.watch(window, Raven.DOM.KEY_DOWN, Raven.AppHandler.evtHandler);
  Raven.DOM.watch(window, Raven.DOM.KEY_PRESS, Raven.AppHandler.evtHandler);
  Raven.DOM.watch(window, Raven.DOM.KEY_UP, Raven.AppHandler.evtHandler);
  
  if(Raven.AppHandler.supportMobile) {
    Raven.DOM.watch(Raven.AppHandler.view.canvas, Raven.DOM.TOUCH_DOWN, Raven.AppHandler.mobileHandler);
    Raven.DOM.watch(Raven.AppHandler.view.canvas, Raven.DOM.TOUCH_MOVE, Raven.AppHandler.mobileHandler);
    Raven.DOM.watch(Raven.AppHandler.view.canvas, Raven.DOM.TOUCH_UP, Raven.AppHandler.mobileHandler);

    if(window.DeviceOrientationEvent) {
      Raven.DOM.watch(window, Raven.DOM.GYRO_UPDATE, Raven.AppHandler.mobileHandler);
    }
    if(window.DeviceMotionEvent) {
      Raven.AppHandler.isMobile = true;
      Raven.DOM.watch(window, Raven.DOM.ACCELERATION_UPDATE, Raven.AppHandler.mobileHandler);
    }
  }

  if(Raven.AppHandler.fullsize) Raven.AppHandler.resize(window.innerWidth, window.innerHeight);
}

Raven.App.prototype.dispose = function() {
  Raven.DOM.unwatch(window, Raven.DOM.RESIZE, Raven.AppHandler.evtHandler);
  Raven.DOM.unwatch(Raven.AppHandler.view.canvas, Raven.DOM.MOUSE_DOWN, Raven.AppHandler.evtHandler);
  Raven.DOM.unwatch(Raven.AppHandler.view.canvas, Raven.DOM.MOUSE_MOVE, Raven.AppHandler.evtHandler);
  Raven.DOM.unwatch(Raven.AppHandler.view.canvas, Raven.DOM.MOUSE_UP, Raven.AppHandler.evtHandler);
  Raven.DOM.unwatch(Raven.AppHandler.view.canvas, Raven.DOM.TOUCH_DOWN, Raven.AppHandler.mobileHandler);
  Raven.DOM.unwatch(Raven.AppHandler.view.canvas, Raven.DOM.TOUCH_MOVE, Raven.AppHandler.mobileHandler);
  Raven.DOM.unwatch(Raven.AppHandler.view.canvas, Raven.DOM.TOUCH_UP, Raven.AppHandler.mobileHandler);
  Raven.DOM.unwatch(window, Raven.DOM.GYRO_UPDATE, Raven.AppHandler.mobileHandler);
  Raven.DOM.unwatch(window, Raven.DOM.ACCELERATION_UPDATE, Raven.AppHandler.mobileHandler);
}

