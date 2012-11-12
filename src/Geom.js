var Raven = Raven || {};

// Vec2
Raven.Vec2 = function(px, py) {
  this.x = px;
  this.y = py;
  return this;
}

Raven.Vec2.prototype.copy = function() {
  return new Raven.Vec2(this.x, this.y);
}

Raven.Vec2.prototype.add = function(vec) {
  var v = this.copy();
  v.x += vec.x;
  v.y += vec.y;
  return v;
}

Raven.Vec2.prototype.addN = function(value) {
  var v = this.copy();
  v.x += value;
  v.y += value;
  return v;
}

Raven.Vec2.prototype.subtract = function(vec) {
  var v = this.copy();
  this.x -= vec.x;
  this.y -= vec.y;
  return v;
}

Raven.Vec2.prototype.subtractN = function(value) {
  var v = this.copy();
  v.x -= value;
  v.y -= value;
  return v;
}

Raven.Vec2.prototype.multiply = function(vec) {
  var v = this.copy();
  v.x *= vec.x;
  v.y *= vec.y;
  return v;
}

Raven.Vec2.prototype.multiplyN = function(value) {
  var v = this.copy();
  v.x *= value;
  v.y *= value;
  return v;
}

Raven.Vec2.prototype.divide = function(vec) {
  var v = this.copy();
  v.x /= vec.x;
  v.y /= vec.y;
  return v;
}

Raven.Vec2.prototype.divideN = function(value) {
  var v = this.copy();
  v.x /= value;
  v.y /= value;
  return v;
}

Raven.Vec2.prototype.equals = function(vec) {
  return this.x == vec.x && this.y == vec.y;
}

Raven.Vec2.prototype.length = function() {
  return Math.sqrt(this.x*this.x + this.y*this.y);
}

Raven.Vec2.prototype.normalize = function() {
  var delimiter = 1.0 / this.length();
  this.x *= delimiter;
  this.y *= delimiter;
  return this;
}

Raven.Vec2.prototype.distance = function(vec) {
  return Raven.distance2D(this, vec);
}

Raven.Vec2.zero = function() {
  return new Raven.Vec2(0, 0);
}

Raven.Vec2.one = function() {
  return new Raven.Vec2(1, 1);
}

Raven.Vec2.random = function(px, py) {
  return new Raven.Vec2(Math.random() * px, Math.random() * py);
}

Raven.Vec2.randomRange = function(minX, minY, maxX, maxY) {
  return new Raven.Vec2(Raven.randRange(minX, maxX), Raven.randRange(minY, maxY));
}

// Vec3
Raven.Vec3 = function(px, py, pz) {
  this.x = px;
  this.y = py;
  this.z = pz;
  return this;
}

Raven.Vec3.prototype.copy = function() {
  return new Raven.Vec3(this.x, this.y, this.z);
}

Raven.Vec3.prototype.add = function(vec) {
  var v = this.copy();
  v.x += vec.x;
  v.y += vec.y;
  v.z += vec.z;
  return v;
}

Raven.Vec3.prototype.addN = function(value) {
  var v = this.copy();
  v.x += value;
  v.y += value;
  v.z += value;
  return v;
}

Raven.Vec3.prototype.subtract = function(vec) {
  var v = this.copy();
  v.x -= vec.x;
  v.y -= vec.y;
  v.z -= vec.z;
  return v;
}

Raven.Vec3.prototype.subtractN = function(value) {
  var v = this.copy();
  v.x -= value;
  v.y -= value;
  v.z -= value;
  return v;
}

Raven.Vec3.prototype.multiply = function(vec) {
  var v = this.copy();
  v.x *= vec.x;
  v.y *= vec.y;
  v.z *= vec.z;
  return v;
}

Raven.Vec3.prototype.multiplyN = function(value) {
  var v = this.copy();
  v.x *= value;
  v.y *= value;
  v.z *= value;
  return v;
}

Raven.Vec3.prototype.divide = function(vec) {
  var v = this.copy();
  v.x /= vec.x;
  v.y /= vec.y;
  v.z /= vec.z;
  return v;
}

Raven.Vec3.prototype.divideN = function(value) {
  var v = this.copy();
  v.x /= value;
  v.y /= value;
  v.z /= value;
  return v;
}

Raven.Vec2.prototype.equals = function(vec) {
  return this.x == vec.x && this.y == vec.y && this.z == vec.z;
}

Raven.Vec3.prototype.length = function() {
  return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
}

Raven.Vec3.prototype.normalize = function() {
  var delimiter = 1.0 / this.length();
  this.x *= delimiter;
  this.y *= delimiter;
  this.z *= delimiter;
  return this;
}

Raven.Vec3.prototype.distance = function(vec) {
  return Raven.distance3D(this, vec);
}

Raven.Vec3.zero = function() {
  return new Raven.Vec3(0, 0, 0);
}

Raven.Vec3.one = function() {
  return new Raven.Vec3(1, 1, 1);
}

Raven.Vec3.random = function(px, py, pz) {
  return new Raven.Vec3(Math.random() * px, Math.random() * py, Math.random() * pz);
}

Raven.Vec3.randomRange = function(minX, minY, minZ, maxX, maxY, maxZ) {
  return new Raven.Vec3(Raven.randRange(minX, maxX), Raven.randRange(minY, maxY), Raven.randRange(minZ, maxZ));
}
