var Raven = Raven || {};
Raven.Date = function() {}
Raven.Date.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
Raven.Date.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
Raven.Date.MS_PER_MINUTE = 60000;
Raven.Date.MS_PER_HOUR = 3600000;
Raven.Date.MS_PER_DAY = 86400000;

Raven.DateObject = function(time) {
  this.seconds = -1;
  this.minutes = -1;
  this.hours = -1;
  this.date = -1;
  this.day = -1;
  this.month = -1;
  this.year = -1;
  this.milliseconds = -1;
  this.update(time);
}

Raven.DateObject.prototype.update = function(dateInstance) {
  var d = new Date();
  if(dateInstance != undefined) d = dateInstance;
  this.seconds = d.getSeconds();
  this.minutes = d.getMinutes();
  this.hours = d.getHours();
  this.day = d.getDay();
  this.date = d.getDate();
  this.month = d.getMonth();
  this.year = d.getFullYear();
  this.milliseconds = d.getMilliseconds();
  return this;
}

Raven.DateObject.prototype.totalTime = function() {
  return this.milliseconds;
}

Raven.DateObject.prototype.monthName = function() {
  return (this.month >= 0) ? String(Raven.Date.months[this.month]) : "";
}

Raven.DateObject.prototype.dayName = function() {
  return (this.day >= 0) ? String(Raven.Date.days[this.day]) : "";
}

Raven.DateObject.prototype.dayNumber = function() {
  return this.date;
}

Raven.DateObject.prototype.am = function() {
  return this.hours < 12;
}

Raven.DateObject.prototype.pm = function() {
  return !this.am;
}

Raven.Date.dateInstance = new Raven.DateObject(new Date());

/**
@param value = Date instance to update to.
*/
Raven.Date.update = function() {
  Raven.Date.dateInstance.update();
}

Raven.Date.timeDifference = function(timeA, timeB) {
  var newTime = Math.abs(timeA.totalTime - timeB.totalTime);
  var newDate = new Date();
  newDate.milliseconds = newTime;
  return new Raven.DateObject(newDate);
}

Raven.Date.weeksToMS = function(weeks) {
  return weeks * daysToMS(7);
}

Raven.Date.daysToMS = function(days) {
  return days * hoursToMS(24);
}

Raven.Date.hoursToMS = function(hours) {
  return hours * minutesToMS( 60 );
}

Raven.Date.minutesToMS = function(minutes) {
  return minutes * secondsToMS( 60 );
}

Raven.Date.secondsToMS = function(seconds) {
  return seconds * 0.001;
}

Raven.Date.msToWeeks = function(ms) {
  return ms / daysToMS(7);
}

Raven.Date.msToDays = function(ms) {
  return ms / hoursToMS(24);
}

Raven.Date.msToHours = function(ms) {
  return ms / minutesToMS(60);
}

Raven.Date.msToMinutes = function(ms) {
  return ms / secondsToMS(60);
}

Raven.Date.msToSeconds = function(ms) {
  return ms * 1000;
}

Raven.Date.getCurrentYear = function() {
  return Raven.Date.dateInstance.year;
}

Raven.Date.getCurrentMonth = function() {
  return Raven.Date.dateInstance.month;
}

Raven.Date.getCurrentDay = function() {
  return Raven.Date.dateInstance.day;
}

Raven.Date.getCurrentDate = function() {
  return Raven.Date.dateInstance.date;
}

Raven.Date.getCurrentHour = function() {
  return Raven.Date.dateInstance.hours;
}

Raven.Date.getCurrentMinute = function() {
  return Raven.Date.dateInstance.minutes;
}

Raven.Date.getCurrentSecond = function() {
  return Raven.Date.dateInstance.seconds;
}

Raven.Date.getCurrentMS = function() {
  return Raven.Date.dateInstance.milliseconds;
}
