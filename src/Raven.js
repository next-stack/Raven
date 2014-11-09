"use strict";

window.Raven = {
  'isMobile': navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/) != null,
  
  'include': function(src) {
    var base = "../../src/";
    document.write('<script type="text/javascript" src="' + base + src + '"></script>');
  },

  'instance': function(baseClass) {
    var instance = new baseClass();
    instance.proto = Object.create( baseClass.prototype );
    return instance;
  },

  'element': function(domID) {
    return document.getElementById(domID);
  },

  /**
   * To accuractely retrieve the elapsed frames in an app.
   * @param  {int} startMS Application's start time, in milliseconds.
   * @return {int}         The elapsed frames
   */
  'getFrame': function(startMS) {
    var appFPS = 60;
    return Math.round( (Date.now() - startMS) / appFPS );
  }
};

// Function helpers

/**
 * Allows Inheritance for OOP
 * @param  {[type]} parent   Super-class
 * @param  {[type]} newClass Optional - overwrites the constructor for frameworks
 */
Function.prototype.extends = function(parent, newClass) {
    this.prototype = Object.create(parent.prototype);
    this.prototype = new parent();
    if(newClass !== undefined) this.prototype.constructor = newClass;
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

/* Remove before minification

// Geometry
Raven.include("geom/Raven.Vec.js");
Raven.include("geom/Raven.Rect.js");

// Utilities
Raven.include("utils/Raven.KeyUtils.js");
Raven.include("utils/Raven.MathUtils.js");
Raven.include("utils/Raven.TimeUtils.js");

// DOM
Raven.include("dom/Raven.DOM.js");
Raven.include("dom/Raven.CSS.js");

// Animation
Raven.include("animation/Raven.Springs.js");
Raven.include("animation/Raven.Spritesheet.js");
Raven.include("animation/Raven.StopWatch.js");
Raven.include("animation/Raven.Tween.js");

// Events
Raven.include("events/Raven.Event.js");
Raven.include("events/Raven.EventDispatcher.js");

// Display
Raven.include("display/Raven.DisplayObject.js");
Raven.include("display/Raven.Button.js");
Raven.include("display/Raven.Scene.js");
Raven.include("display/Raven.Stage.js");

// View
Raven.include("view/Raven.View.js");
Raven.include("view/Raven.GL.js");
Raven.include("view/Raven.Canvas.js");
Raven.include("view/Raven.App.js");
*/