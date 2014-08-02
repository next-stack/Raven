"use strict";

window.Raven = {
  'isMobile': navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/) != null,
  
  'include': function(src) {
    document.write('<script type="text/javascript" src="../../' + src + '"></script>');
  },

  'instance': function(baseClass) {
    var instance = new baseClass();
    instance.proto = Object.create( baseClass.prototype );
    return instance;
  },

  'element': function(domID) {
    return document.getElementById(domID);
  }
};

// Function helpers

Function.prototype.extends = function(parent) {
    this.prototype = Object.create(parent.prototype);
};

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

// Remove before minification
/*
// Geometry
Raven.include("src/geom/Raven.Vec.js");
Raven.include("src/geom/Raven.Rect.js");

// Utilities
Raven.include("src/utils/Raven.KeyUtils.js");
Raven.include("src/utils/Raven.MathUtils.js");

// DOM
Raven.include("src/dom/Raven.DOM.js");
Raven.include("src/dom/Raven.CSS.js");

// Animation
Raven.include("src/animation/Raven.Springs.js");
Raven.include("src/animation/Raven.Spritesheet.js");
Raven.include("src/animation/Raven.StopWatch.js");
Raven.include("src/animation/Raven.Tween.js");

// Events
Raven.include("src/events/Raven.Event.js");
Raven.include("src/events/Raven.EventDispatcher.js");

// View
Raven.include("src/view/Raven.View.js");
Raven.include("src/view/Raven.GL.js");
Raven.include("src/view/Raven.Canvas.js");
Raven.include("src/view/Raven.App.js");
*/