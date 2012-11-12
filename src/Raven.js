"use strict";

var Raven = Raven || {};

// Extends functionality of the Base Class to the newly created instance
Raven.makeInstance = function(baseClass) {
  var instance = new baseClass();
  instance.super = baseClass.prototype;
  return instance;
}

Raven.includeJS = function(src) {
  document.write('<script type="text/javascript" src="../../src/' + src + '"></script>');
}

Raven.includeJS("Utils.js");
Raven.includeJS("Geom.js");
Raven.includeJS("Canvas.js");
Raven.includeJS("Date.js");
Raven.includeJS("Timer.js");
Raven.includeJS("Animation.js");
Raven.includeJS("EventDispatcher.js");
Raven.includeJS("Physics.js");
Raven.includeJS("App.js");
