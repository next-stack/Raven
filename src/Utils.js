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

Raven.degToRad = function( degrees ) {
  return Raven.resolveAngle(degrees) * Raven.RADIANS;
}

Raven.radToDeg = function( radians ) {
  return Raven.resolveAngle(radians * Raven.DEGREES);
}

Raven.getAngleRad = function (p1, p2) {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

Raven.getAngleDeg = function(p1, p2) {
  return Raven.radToDeg(Raven.getAngleRad(p1, p2));
}

Raven.distance = function(n1, n2) {
  var dist = n1 - n2;
  return Math.sqrt(dist * dist);
}

Raven.distance2D = function(x1, y1, x2, y2) {
  var xd = (x1-x2) * (x1-x2);
  var yd = (y1-y2) * (y1-y2);
  return Math.sqrt( xd + yd );
}

Raven.distance3D = function(x1, y1, z1, x2, y2, z2) {
  var xd = (x1-x2) * (x1-x2);
  var yd = (y1-y2) * (y1-y2);
  var zd = (z1-z2) * (z1-z2);
  return Math.sqrt( xd + yd + zd );
}

Raven.difference = function(n1, n2) {
  return n1 - n2;
}

/**
 * @param n1 Preferrably the minimum value.
 * @param n2 Preferrably the maximum value.
 * @param percent A number ranging from 0-1.
 * @return Number The range designated.
 */
Raven.range = function(n1, n2, percent) {
  var diff = n2 - n1;
  diff *= percent;
  return diff + n1;
}

Raven.randRange = function(min, max) {
  return Raven.range(min, max, Math.random());
}

Raven.cosRange = function(degrees, range, min) {
  return (((1 + Math.cos(Raven.degToRad(degrees))) * 0.5) * range) + min;
}

Raven.between = function(min, max, value) {
  return value >= min && value <= max;
}

Raven.inBounds = function(x, y, xMin, yMin, xMax, yMax) {
  return Raven.between(xMin, xMax, x) && Raven.between(yMin, yMax, y);
}

Raven.bezierPosition = function(t, p0, c0, c1, p1) {
  return p0*(1-t)*(1-t)*(1-t)+c0*3*t*(1-t)*(1-t)+c1*3*t*t*(1-t)+p1*t*t*t;
}

Raven.bezierVelocity = function(t, p0, c0, c1, p1) {
  return (3*c0-3*p0)+2*(3*p0-6*c0+3*c1)*t+3*(-p0+3*c0-3*c1+p1)*t*t;
}

Raven.lerp = function(value, min, max) {
  if(value < min) {
    value = min;
  } else if(value > max) {
    value = max;
  }
  return value;
}

Raven.lerp2 = function(value, min, max) {
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

Raven.lerp3 = function(value, min, max) {
  Raven.lerp2(value, min, max);
  
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

Raven.bezierPosition = function(t, p0, c0, c1, p1) {
  return p0*(1-t)*(1-t)*(1-t)+c0*3*t*(1-t)*(1-t)+c1*3*t*t*(1-t)+p1*t*t*t;
}

Raven.bezierVelocity = function(t, p0, c0, c1, p1) {
  return (3*c0-3*p0)+2*(3*p0-6*c0+3*c1)*t+3*(-p0+3*c0-3*c1+p1)*t*t;
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

Raven.DOM.KEY_DOWN = "keydown";
Raven.DOM.KEY_PRESS = "keypress";
Raven.DOM.KEY_UP = "keyup";

Raven.DOM.DRAG_START = "dragstart";
Raven.DOM.DRAG = "drag";
Raven.DOM.DRAG_END = "dragend";
Raven.DOM.DROP = "drop";

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
  if(target != null) Raven.DOM.watch(target, event, handler);
}

Raven.DOM.unwatchID = function(domID, event) {
  var target = Raven.DOM.getElemID(domID);
  if(target != null) Raven.DOM.unwatch(target, event, handler);
}

Raven.DOM.setStyle = function(target, style) {
  target.style["transform"] = style;
          target.style["transform"] = style;
       target.style["-o-transform"] = style;
      target.style["-ms-transform"] = style;
     target.style["-moz-transform"] = style;
  target.style["-webkit-transform"] = style;
}

Raven.transform = function(elem, x, y) {
  Raven.DOM.setStyle(elem, 'translate(' + x + 'px, ' + y + 'px)');
}

// Key map
var Key = {
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  
  CTRL: 17,
  SHIFT: 16,
  CAPS: 20,
  TAB: 9,
  ENTER: 13,
  SPACE: 32,
  DELETE: 46,
  BACKQUOTE: 192,
  MINUS: 189,
  EQUAL: 187,
  LEFTBRACKET: 219,
  RIGHTBRACKET: 221,
  BACKSLASH: 220,
  SEMICOLON: 186,
  QUOTE: 222,
  COMMA: 188,
  PERIOD: 190,
  SLASH: 191,
  
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  
  NUMBER_0: 48,
  NUMBER_1: 49,
  NUMBER_2: 50,
  NUMBER_3: 51,
  NUMBER_4: 52,
  NUMBER_5: 53,
  NUMBER_6: 54,
  NUMBER_7: 55,
  NUMBER_8: 56,
  NUMBER_9: 57,
  
  getKey: function(keyCode) {
    for(var obj in this) {
      if(this[obj] == keyCode) return obj;
    }
    return null;
  }
};
