var Raven = Raven || {};

Raven.fix = function(value, hundredth) {
  return Number(value.toFixed(hundredth));
}

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
  return degrees * Raven.RADIANS;
}

Raven.radToDeg = function( radians ) {
  return radians * Raven.DEGREES;
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
 * @param n1 The minimum value.
 * @param n2 The maximum value.
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

Raven.sinRange = function(degrees, range, min) {
  return (((1 + Math.sin(Raven.degToRad(degrees))) * 0.5) * range) + min;
}

Raven.between = function(min, max, value) {
  return value >= min && value <= max;
}

Raven.inBounds = function(x, y, xMin, yMin, xMax, yMax) {
  return Raven.between(xMin, xMax, x) && Raven.between(yMin, yMax, y);
}

Raven.betweenVec = function(min, max, value) {
  var x = Raven.between(min.x, max.x, value.x),
      y = Raven.between(min.y, max.y, value.y),
      z = Raven.between(min.z, max.z, value.z);
  return x && y && z;
}

Raven.bezierPosition = function(t, p0, c0, c1, p1) {
  return p0*(1-t)*(1-t)*(1-t)+c0*3*t*(1-t)*(1-t)+c1*3*t*t*(1-t)+p1*t*t*t;
}

Raven.bezierVelocity = function(t, p0, c0, c1, p1) {
  return (3*c0-3*p0)+2*(3*p0-6*c0+3*c1)*t+3*(-p0+3*c0-3*c1+p1)*t*t;
}

Raven.lerp = function(value, min, max) {
  return (max - min) * value + min;
}

Raven.normalize = function(value, min, max) {
  return (value - min) / (max - min);
}

Raven.map = function(value, min1, max1, min2, max2) {
  return Raven.lerp( Raven.normalize(value, min1, max1) , min2, max2);
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
