var Raven = Raven || {};

Raven.StopWatch = function() {
  this.initTime = 0;
  this.endTime = 0;
  this.lastLap = 0;
  this.ms = 0;
}

Raven.StopWatch.prototype.start = function() {
  this.initTime = getTimer();
  this.lastLap = this.initTime;
  this.read();
  return this;
}

Raven.StopWatch.prototype.stop = function() {
  this.endTime = getTimer();
  this.ms = this.endTime - this.initTime;
  return this;
}

Raven.StopWatch.prototype.read = function() {
  var now = getTimer();
  return now - this.initTime;
}

Raven.StopWatch.prototype.lap = function() {
  var now = getTimer();
  this.ms = now - this.lastLap;
  this.lastLap = this.now;
  return this.ms;
}

Raven.Timer = function() {
  this.timer = 0;
}

Raven.Timer.prototype.start = function(ms, handler) {
  this.timer = setInterval(handler, ms);
}

Raven.Timer.prototype.startFPS = function(FPS, handler) {
  this.start(1000 / FPS, handler);
}

Raven.Timer.prototype.stop = function() {
  clearInterval(this.timer);
}
