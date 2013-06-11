"use strict";

var Raven = Raven || {};

// Extends functionality of the Base Class to the newly created instance
Raven.makeInstance = function(baseClass, params) {
  var instance = new baseClass();
  instance.super = baseClass.prototype;
  for(var obj in params) instance[obj] = params[obj];
  return instance;
}

Raven.extend = function(newClass, baseClass) {
  var prototype = new baseClass();
  baseClass.apply(newClass);
  newClass.prototype = newClass.super = prototype;
}

Raven.includeJS = function(src) {
  document.write('<script type="text/javascript" src="../../src/' + src + '"></script>');
}

Raven.checkMobile = function() {
  return navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/) != null;
}

Raven.element = function(domID) {
  return document.getElementById(domID);
}

Raven.includeJS("../libs/requestanimationframe.js");
Raven.includeJS("Utils.js");
Raven.includeJS("Geom.js");
Raven.includeJS("View.js");
Raven.includeJS("Canvas.js");
Raven.includeJS("GL.js");
Raven.includeJS("Date.js");
Raven.includeJS("Timer.js");
Raven.includeJS("Animation.js");
Raven.includeJS("EventDispatcher.js");
Raven.includeJS("Physics.js");
Raven.includeJS("App.js");
