var Raven = Raven || {};

/*************************************************
 * StopWatch
 * A stop watch.
 ************************************************/

Raven.StopWatch = function() {
  this.constructor.name = "Raven.StopWatch";
  this.initTime = 0;
  this.endTime  = 0;
  this.lastLap  = 0;
  this.ms       = 0;
  this.time     = 0;
  return this;
};

Raven.StopWatch.prototype = {
  'getTimer': function() {
    return new Date().getTime();
  },
  'start': function() {
    this.initTime = this.getTimer();
    this.lastLap  = this.initTime;
    this.time     = 0;
    return this.read();
  },
  'stop': function() {
    this.endTime = this.getTimer();
    this.ms = this.endTime - this.initTime;
    this.time = this.ms;
    return this.ms;
  },
  'lap': function() {
    var now = this.getTimer();
    this.ms = now - this.lastLap;
    this.lastLap = now;
    this.time = now - this.initTime;
    return this.ms;
  },
  'read': function() {
    return this.getTimer() - this.initTime;
  }
};
