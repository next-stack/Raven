var Raven = Raven || {};

Raven.DOM = {
    "iPad":           /iPad/i.test(  navigator.userAgent),
    "iPhone":         /iPhone/i.test(navigator.userAgent),
    "isChrome":       /chrome/i.test(navigator.userAgent),
    "isSafari":       /^((?!chrome).)*safari/i.test(navigator.userAgent),
    "isFirefox":      navigator.userAgent.indexOf('Firefox') > -1,
    "isOpera":        navigator.userAgent.toLowerCase().indexOf("op") > -1,
    "TRANSFORM_PREFIX": "",
	// Events
	// Window
	"RESIZE":		"resize",
	"SCROLL":		window.addEventListener ? "scroll" : "onscroll",
	"CLICK":		"onclick",
	"DBL_CLICK":	"ondblclick",
	// Mouse
	"MOUSE_MOVE":	"mousemove",
	"MOUSE_DOWN":	"mousedown",
	"MOUSE_UP":		"mouseup",
	"MOUSE_OVER":	"onmouseover",
	"MOUSE_OUT":	"onmouseout",
	// Key
	"KEY_DOWN":		"keydown",
	"KEY_PRESS":	"keypress",
	"KEY_UP":		"keyup",
	// Touch
	"TOUCH_DOWN":	"touchstart",
	"TOUCH_MOVE":	"touchmove",
	"TOUCH_UP":		"touchend",
	// Device
	"GYRO":			"deviceorientation",
	"ACCELERATION":	"devicemotion"
};

(function() {
    var ua = navigator.userAgent.toLowerCase();
    if(/chrome/.test(ua) || /webkit/.test(ua)) {
        Raven.DOM.TRANSFORM_PREFIX = "-webkit-";
    } else if(/opera/.test(ua)) {
        Raven.DOM.TRANSFORM_PREFIX = "-o-";
    } else if(/msie/.test(ua)) {
        Raven.DOM.TRANSFORM_PREFIX = "-ms-";
    }
    if( Raven.DOM.isChrome && Raven.DOM.isSafari ) Raven.DOM.isSafari = false;
    if( Raven.DOM.isChrome && Raven.DOM.isOpera )  Raven.DOM.isChrome = false;
})()

// Event handling
Raven.bind = function(target, event, handler) {
    target[event] = handler;
};

Raven.unbind = function(target, event) {
    target[event] = null;
};

Raven.watch = function(target, event, handler) {
    if(window.addEventListener) {
        target.addEventListener(event, function(evt){
            handler(evt);
        }, false);
    } else if(window.attachEvent) {
        target.attachEvent(event, function(evt){
            handler(evt);
        });
    }
};

Raven.unwatch = function(target, event, handler) {
    target.removeEventListener(event, function(evt){
        handler(evt);
    });
};

// Getters
Raven.viewable = function(target) {
    var tb = {
            t:	target.offsetTop,
            l:	target.offsetLeft,
            b:	target.offsetTop  + target.offsetHeight,
            r:	target.offsetLeft + target.offsetWidth
        },
        wb = {
            t:	window.scrollY,
            l:	window.scrollX,
            b:	window.scrollY + window.innerHeight,
            r:	window.scrollX + window.innerWidth
        },
        top = Raven.inBounds(tb.t, tb.l, wb.t, wb.l, wb.b, wb.r),
        bot = Raven.inBounds(tb.b, tb.r, wb.t, wb.l, wb.b, wb.r);
    return top || bot;
};

