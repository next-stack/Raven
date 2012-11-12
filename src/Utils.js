var Raven = Raven || {};

Raven.roundTo = function( value, ordinal ) {
  return Math.round( ordinal * value ) * ( 1 / ordinal );
}

Raven.DEGREES = 180/Math.PI;
Raven.RADIANS = Math.PI/180;

Raven.resolveAngle = function( angle ) {
  var mod = angle % 360;
  return mod < 0 ? 360 + mod : mod;
}

Raven.degreesToRadians = function( degrees ) {
  return Raven.resolveAngle(degrees) * Raven.RADIANS;
}

Raven.radiansToDegrees = function( radians ) {
  return Raven.resolveAngle(radians * Raven.DEGREES);
}

Raven.getAngleRad = function (p1, p2) {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

Raven.getAngleDeg = function(p1, p2) {
  return Raven.radiansToDegrees(Raven.getAngleRad(p1, p2));
}

Raven.distance = function(n1, n2) {
  var dist = n1 - n2;
  return Math.sqrt(dist * dist);
}

Raven.distance2D = function(p1, p2) {
  return Raven.distance(p1.x, p2.x) + Raven.distance(p1.y, p2.y);
}

Raven.distance3D = function(p1, p2) {
  return Raven.distance2D(p1, p2) + Raven.distance(p1.z, p2.z);
}

Raven.difference = function(n1, n2) {
  return n1 - n2;
}

Raven.range = function(n1, n2, percent) {
  var min  = Math.min(n1, n2);
  var max  = Math.max(n1, n2);
  var diff = max - min;
  diff *= percent;
  return diff + min;
}

Raven.randRange = function(min, max) {
  return Raven.range(min, max, Math.random());
}

Raven.cosRange = function(degrees, range, min) {
  return (((1 + Math.cos(Raven.degreesToRadians(degrees))) * 0.5) * range) + min;
}

Raven.constrain = function(value, min, max) {
	return Math.min(min, Math.max(max, value));
}

Raven.constrain2 = function(value, min, max) {
  if(value.x < min.x) {
    value.x = min.x;
  } else if(value.x > max.x) {
    value.x = max.x;
  }
  
  if(value.y < min.y) {
    value.y = min.y;
  } else if(value.y > max.y) {
    value.y = max.y;
  }
}

Raven.constrain3 = function(value, min, max) {
  Raven.constrain2(value, min, max);
  
  if(value.z < min.z) {
    value.z = min.z;
  } else if(value.z > max.z) {
    value.z = max.z;
  }
}

Raven.wrap = function(value, min, max) {
  if(value < min) {
    var range = max - min;
    value = max - (Raven.distance(value, min) % range);
  } else if(value > max) {
    value = value % max + min;
  }
  return value;
}

Raven.wrap2 = function(value, min, max) {
  value.x = Raven.wrap(value.x, min.x, max.x);
  value.y = Raven.wrap(value.y, min.y, max.y);
  return value;
}

Raven.wrap3 = function(value, min, max) {
  value.x = Raven.wrap(value.x, min.x, max.x);
  value.y = Raven.wrap(value.y, min.y, max.y);
  value.z = Raven.wrap(value.z, min.z, max.z);
  return value;
}

// DOM

Raven.DOM = function() {
}

// DOM Events
Raven.DOM.RESIZE = "resize";
Raven.DOM.SCROLL = "onscroll";

Raven.DOM.CLICK = "onclick";
Raven.DOM.DBL_CLICK = "ondblclick";

Raven.DOM.MOUSE_MOVE = "mousemove";
Raven.DOM.MOUSE_DOWN = "mousedown";
Raven.DOM.MOUSE_UP = "mouseup";
Raven.DOM.MOUSE_OVER = "onmouseover";
Raven.DOM.MOUSE_OUT = "onmouseout";

Raven.DOM.KEY_DOWN = "onkeydown";
Raven.DOM.KEY_PRESS = "onkeypress";
Raven.DOM.KEY_UP = "onkeyup";

Raven.DOM.TOUCH_DOWN = "touchstart";
Raven.DOM.TOUCH_MOVE = "touchmove";
Raven.DOM.TOUCH_UP = "touchend";

Raven.DOM.GYRO_UPDATE = "deviceorientation";
Raven.DOM.ACCELERATION_UPDATE = "devicemotion";

Raven.DOM.getElemID = function(domID) {
  return document.getElementById(domID);
}

Raven.DOM.watch = function(target, event, handler) {
  target.addEventListener(event, function(evt){
    if(handler) handler(evt);
  }, false);
}

Raven.DOM.unwatch = function(target, event, handler) {
  target.removeEventListener(event, function(evt){
    if(handler) handler(evt);
  });
}

Raven.DOM.watchID = function(domID, event, handler) {
  var target = Raven.DOM.getElemID(domID);
  if(!target) return;
  target[event] = function(){ handler(domID); return false; };
}

Raven.DOM.unwatchID = function(domID, event) {
  var target = Raven.DOM.getElemID(domID);
  if(!target) return;
  target[event] = null;
}

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller
// fixes from Paul Irish and Tino Zijdel

(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
    || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) window.requestAnimationFrame = function(callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
    timeToCall);
    lastTime = currTime + timeToCall;
    return id;
  };

  if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function(id) {
    clearTimeout(id);
  };
}());