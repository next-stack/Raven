var Raven = Raven || {};

// A linear counter
Raven.FrameCounter = function(totalFrames) {
  this.currentFrame = 0;
  this.totalFrames = totalFrames ? totalFrames : 0;
  
  this.restart = function() {
    this.currentFrame = this.totalFrames;
  }
  
  this.update = function() {
    if(this.currentFrame > 0) --this.currentFrame;
  }
  
  this.active = function() {
    return this.currentFrame > 0;
  }
}

// Penner easing types available for Cubic easing
var Penner = {
  "Linear": 0,
  "CircIn": 1,
  "CircInOut": 2,
  "CircOut": 3,
  "CubicIn": 4,
  "CubicInOut": 5,
  "CubicOut": 6,
  "ExpoIn": 7,
  "ExpoInOut": 8,
  "ExpoOut": 9,
  "QuadIn": 10,
  "QuadInOut": 11,
  "QuadOut": 12,
  "QuartIn": 13,
  "QuartInOut": 14,
  "QuartOut": 15,
  "QuintIn": 16,
  "QuintInOut": 17,
  "QuintOut": 18,
  "SineIn": 19,
  "SineInOut": 20,
  "SineOut": 21
};

// Penner easing functions
Raven.Ease = {
  
  "_2PI": 6.283185307179586,
  "_HALF_PI": 1.5707963267948966,
  
  // Back
  "backIn": function(t, b, c, d, s) {
  	if( s == undefined ) s = 1.70158;
  	return c*(t/=d)*t*((s+1)*t - s) + b;
  },
  "backOut": function(t, b, c, d, s) {
  	if( s == undefined ) s = 1.70158;
  	return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
  },
  "backInOut": function(t, b, c, d, s) {
  	if( s == undefined ) s = 1.70158;
  	if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
  	return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
  },
  
  // Bounce
  "bounceIn": function(t, b, c, d) {
  	return c - easeOut(d-t, 0, c, d) + b;
  },
  "bounceOut": function(t, b, c, d) {
  	if ((t/=d) < (1/2.75)) {
  		return c*(7.5625*t*t) + b;
  	} else if (t < (2/2.75)) {
  		return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
  	} else if (t < (2.5/2.75)) {
  		return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
  	} else {
  		return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
  	}
  },
  "bounceInOut": function(t, b, c, d) {
  	if (t < d/2) return easeIn (t*2, 0, c, d) * .5 + b;
  	return easeOut (t*2-d, 0, c, d) * .5 + c*.5 + b;
  },
  
  // Circ
  "circIn": function(t, b, c, d) {
  	return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
  },
  "circOut": function(t, b, c, d) {
  	return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
  },
  "circInOut": function(t, b, c, d) {
  	if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
  	return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
  },
  
  // Cubic
  "cubicIn": function(t, b, c, d) {
  	return c*(t/=d)*t*t + b;
  },
  "cubicOut": function(t, b, c, d) {
  	return c*((t=t/d-1)*t*t + 1) + b;
  },
  "cubicInOut": function(t, b, c, d) {
  	if ((t/=d/2) < 1) return c/2*t*t*t + b;
  	return c/2*((t-=2)*t*t + 2) + b;
  },
  
  // Elastic
  "elasticIn": function(t, b, c, d, a, p) {
  	if( a == undefined ) a = 0;
  	if( p == undefined ) p = 0;
  	var s;
  	if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  	if (!a || a < Math.abs(c)) { a=c; s = p/4; }
  	else s = p/Raven.Ease._2PI * Math.asin (c/a);
  	return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*Raven.Ease._2PI/p )) + b;
  },
  "elasticOut": function(t, b, c, d, a, p) {
  	var s;
  	if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  	if (!a || a < Math.abs(c)) { a=c; s = p/4; }
  	else s = p/Raven.Ease._2PI * Math.asin (c/a);
  	return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*Raven.Ease._2PI/p ) + c + b);
  },
  "elasticInOut": function(t, b, c, d, a, p) {
  	var s;
  	if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
  	if (!a || a < Math.abs(c)) { a=c; s = p/4; }
  	else s = p/Raven.Ease._2PI * Math.asin (c/a);
  	if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*Raven.Ease._2PI/p )) + b;
  	return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*Raven.Ease._2PI/p )*.5 + c + b;
  },
  
  // Expo
  "expoIn": function(t, b, c, d) {
  	return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b - c * 0.001;
  },
  "expoOut": function(t, b, c, d) {
  	return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
  },
  "expoInOut": function(t, b, c, d) {
  	if (t==0) return b;
  	if (t==d) return b+c;
  	if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
  	return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
  },
  
  // Linear
  "linear": function(t, b, c, d) {
  	return c*t/d + b;
  },
  
  // Quad
  "quadIn": function(t, b, c, d) {
  	return c*(t/=d)*t + b;
  },
  "quadOut": function(t, b, c, d) {
  	return -c *(t/=d)*(t-2) + b;
  },
  "quadInOut": function(t, b, c, d) {
  	if ((t/=d/2) < 1) return c/2*t*t + b;
  	return -c/2 * ((--t)*(t-2) - 1) + b;
  },
  
  // Quart
  "quartIn": function(t, b, c, d) {
  	return c*(t/=d)*t*t*t + b;
  },
  "quartOut": function(t, b, c, d) {
  	return -c * ((t=t/d-1)*t*t*t - 1) + b;
  },
  "quartInOut": function(t, b, c, d) {
  	if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
  	return -c/2 * ((t-=2)*t*t*t - 2) + b;
  },
  
  // Quint
  "quintIn": function(t, b, c, d) {
  	return c*(t/=d)*t*t*t*t + b;
  },
  "quintOut": function(t, b, c, d) {
  	return c*((t=t/d-1)*t*t*t*t + 1) + b;
  },
  "quintInOut": function(t, b, c, d) {
  	if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
  	return c/2*((t-=2)*t*t*t*t + 2) + b;
  },
  
  // Sine
  "sineIn": function(t, b, c, d) {
  	return -c * Math.cos(t/d * Raven.Ease._HALF_PI) + c + b;
  },
  "sineOut": function(t, b, c, d) {
  	return c * Math.sin(t/d * Raven.Ease._HALF_PI) + b;
  },
  "sineInOut": function(t, b, c, d) {
  	return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
  },
  
  // Strong
  "strongIn": function(t, b, c, d) {
  	return c*(t/=d)*t*t*t*t + b;
  },
  "strongOut": function(t, b, c, d) {
  	return c*((t=t/d-1)*t*t*t*t + 1) + b;
  },
  "strongInOut": function(t, b, c, d) {
  	if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
  	return c/2*((t-=2)*t*t*t*t + 2) + b;
  }
  
};

// Basic speed/spring
Raven.Interpolation = function() {
  this.speed = 0.5;
  this.spring = 0;
  this.target = 0;
  this.value = 0;
  this.velocity = 0;
  
  this.update = function() {
    this.velocity = ((this.target - this.value) * this.speed) + (this.velocity * this.spring);
    this.value += this.velocity;
    if(Raven.distance( this.value, this.target ) < 0.1) {
      this.velocity = 0;
      this.value = this.target;
    }
    return this;
  }
  
  return this;
};

Raven.Spritesheet = function(src, totalFrames, frameRate, loop) {
  var _this = this;
  
  this.frameRate = frameRate != null ? frameRate : 60;
  this.currentFrame = 0;
  this.totalFrames = totalFrames;
  this.loop = loop == null ? true : loop;
  this.columns = totalFrames < 6 ? totalFrames : 6;
  this.loaded = false;
  this.onLoad = null;
  
  this.viewWidth = 0;
  this.viewHeight = 0;
  this.scaleX = 1;
  this.scaleY = 1;
  
  this.img = new Image();
  this.img.onload = function() {
    _this.loaded = true;
    
    var rows = Math.ceil(_this.totalFrames / _this.columns);
    _this.viewWidth = Math.floor(this.width / _this.columns);
    _this.viewHeight = Math.floor(this.height / rows);
    if(this.onLoad != null) this.onLoad(this);
  }
  
  this.img.src = src;
  
  this.update = function(appCurrentFrame, appFrameRate) {
    if(appCurrentFrame % Math.floor(appFrameRate / this.frameRate) == 0) {
      var next = this.currentFrame + 1;
      if(this.loop) {
        this.currentFrame = next;
      } else {
        if(next < this.totalFrames) ++this.currentFrame;
      }
    }
  }
  
  this.render = function(renderer, pos) {
    if(!this.loaded) return this;
    
    var cur = this.currentFrame % this.totalFrames;
    var xOffset = (cur % this.columns) * this.viewWidth;
    var yOffset = Math.floor(cur / this.columns) * this.viewHeight;
    renderer.context.drawImage(this.img, xOffset, yOffset, this.viewWidth, this.viewHeight, pos.x, pos.y, this.viewWidth, this.viewHeight);
  }
  return this;
}

// Cubic easing
function CubicEase() {
  var _this = this;
  var BEZIER_SEGMENTS = 12;
  var curves = [0, 0, 0, 0, 0, 0];
  
  this.set = function(x0, y0, x1, y1) {
    var subdiv_step = 1. / BEZIER_SEGMENTS;
    var subdiv_step2 = subdiv_step  * subdiv_step;
    var subdiv_step3 = subdiv_step2 * subdiv_step;
    var pre1 = 3 * subdiv_step;
    var pre2 = 3 * subdiv_step2;
    var pre4 = 6 * subdiv_step2;
    var pre5 = 6 * subdiv_step3;
    var tmp1x = -x0 * 2 + x1;
    var tmp1y = -y0 * 2 + y1;
    var tmp2x = (x0 - x1) * 3 + 1;
    var tmp2y = (y0 - y1) * 3 + 1;

    curves[0] = x0 * pre1 + tmp1x * pre2 + tmp2x * subdiv_step3;
    curves[1] = y0 * pre1 + tmp1y * pre2 + tmp2y * subdiv_step3;
    curves[2] = tmp1x * pre4 + tmp2x * pre5;
    curves[3] = tmp1y * pre4 + tmp2y * pre5;
    curves[4] = tmp2x * pre5;
    curves[5] = tmp2y * pre5;
    return this;
  }
  
  this.setLinear = function() { curves[0] = 0; return this; }
  this.setStepped = function() { curves[0] = -1; return this; }
  this.setPenner = function(ease) {
    var cEase = CubicEase.getPenner(ease);
    this.set(cEase.x0, cEase.y0, cEase.x1, cEase.y1);
    return this;
  }
  
  this.getCurvePercent = function(percent) {
    percent = percent < 0 ? 0 : (percent > 1 ? 1 : percent);
    var dfx = curves[0];
    if (!dfx) return percent;
    if (dfx == -1) return 0;
    var dfy = curves[1];
    var ddfx = curves[2];
    var ddfy = curves[3];
    var dddfx = curves[4];
    var dddfy = curves[5];
    var x = dfx, y = dfy;
    var i = 10 - 2;
    while (true) {
    	if (x >= percent) {
    		var lastX = x - dfx;
    		var lastY = y - dfy;
    		return lastY + (y - lastY) * (percent - lastX) / (x - lastX);
    	}
    	if (i == 0) break;
    	i--;
    	dfx += ddfx;
    	dfy += ddfy;
    	ddfx += dddfx;
    	ddfy += dddfy;
    	x += dfx;
    	y += dfy;
    }
    return y + (1 - y) * (percent - x) / (1 - x);
  }
  
  return this;
}

CubicEase.getPenner = function(ease) {
  var cEase = new CubicEase();
  switch(ease) {
    case Penner.CircIn:
      cEase.set(0.600, 0.040, 0.980, 0.335);		break;
    case Penner.CircInOut:
      cEase.set(0.785, 0.135, 0.150, 0.860);		break;
    case Penner.CircOut:
      cEase.set(0.075, 0.820, 0.165, 1.000);		break;

    // Cubic
    case Penner.CubicIn:
      cEase.set(0.550, 0.055, 0.675, 0.190);		break;
    case Penner.CubicInOut:
      cEase.set(0.645, 0.045, 0.355, 1.000);		break;
    case Penner.CubicOut:
      cEase.set(0.215, 0.610, 0.355, 1.000);		break;

    // Expo
    case Penner.ExpoIn:
      cEase.set(0.950, 0.050, 0.795, 0.035);		break;
    case Penner.ExpoInOut:
      cEase.set(1.000, 0.000, 0.000, 1.000);		break;
    case Penner.ExpoOut:
      cEase.set(0.190, 1.000, 0.220, 1.000);		break;

    // Quad
    case Penner.QuadIn:
      cEase.set(0.550, 0.085, 0.680, 0.530);		break;
    case Penner.QuadInOut:
      cEase.set(0.455, 0.030, 0.515, 0.955);		break;
    case Penner.QuadOut:
      cEase.set(0.250, 0.460, 0.450, 0.940);		break;

    // Quart
    case Penner.QuartIn:
      cEase.set(0.895, 0.030, 0.685, 0.220);		break;
    case Penner.QuartInOut:
      cEase.set(0.860, 0.000, 0.070, 1.000);		break;
    case Penner.QuartOut:
      cEase.set(0.230, 1.000, 0.320, 1.000);		break;

    // Quint
    case Penner.QuintIn:
      cEase.set(0.755, 0.050, 0.855, 0.060);		break;
    case Penner.QuintInOut:
      cEase.set(0.770, 0.000, 0.175, 1.000);		break;
    case Penner.QuintOut:
      cEase.set(0.165, 0.840, 0.440, 1.000);		break;

    // Sine
    case Penner.SineIn:
      cEase.set(0.470, 0.000, 0.745, 0.715);		break;
    case Penner.SineInOut:
      cEase.set(0.445, 0.050, 0.550, 0.950);		break;
    case Penner.SineOut:
      cEase.set(0.390, 0.575, 0.565, 1.000);		break;

    // Linear
    case Penner.Linear:
    default:
      cEase.set(0.333, 0.333, 0.667, 0.667);	break;
  }
  return cEase;
}

function Tween(target, key, to, duration, ease, delay, updateHandler, completeHandler) {
  var _this = this,
  active = false;
  
  this.obj = target;
	this.to = to;
  this.from = 0;
	this.duration = duration * 1000;
	this.timestamp = new Date().getTime() + (delay ? delay * 1000 : 0);
  this.updateHandler = updateHandler;
  this.completeHandler = completeHandler;
	
	this.start = function() {
    this.from = target[key];
    return this;
  }

	this.complete = function() {
    target[key] = to;
    if(this.completeHandler) this.completeHandler();
    return this;
  }
	
	this.update = function(percent) {
	  if(!active) {
	    active = true;
      this.from = target[key];
      return this;
	  }

    var newValue = ease.getCurvePercent(percent) * this.range() + this.from;
    target[key]  = newValue;

    if(this.updateHandler) this.updateHandler();
	  return this;
	}
	
	// Getters
	this.range = function() { return this.to - this.from; }
	// Tween start time
	this.startTime = function() { return this.timestamp; }
	// Tween end time
	this.endTime = function() { return this.timestamp + this.duration; }
	// If date is during the tween
	this.betweenTime = function(ms) { return Raven.between(this.timestamp, this.endTime(), ms); }
	
	// Setters
	this.setLinear = function() { ease.setLinear(); return this; }
	this.setEase = function(x0, y0, x1, y1) { ease.set(x0, y0, x1, y1); return this; }
	this.setPenner = function(ease) { ease.setPenner( CubicEase.getPenner(ease) ); return this; }
	this.setStepped = function() { ease.setStepped(); return this; }
	
	return this.start();
}

function TweenCSS(target, key, to, duration, ease, delay, updateHandler, completeHandler) {
  var _this = this,
  active = false;
  
  this.obj = target;
  this.to = to;
  this.from = 0;
  this.duration = duration * 1000;
  this.timestamp = new Date().getTime() + (delay ? delay * 1000 : 0);
  this.updateHandler = updateHandler;
  this.completeHandler = completeHandler;
  
  this.start = function() {
    this.from = Number( target['style'][key].split('px')[0] );
    return this;
  }

  this.complete = function() {
    target['style'][key] = to.toString() + 'px';
    if(this.completeHandler) this.completeHandler();
    return this;
  }
  
  this.update = function(percent) {
    if(!active) {
      active = true;
      this.from = Number( target['style'][key].split('px')[0] );
      return this;
    }

    var newValue = ease.getCurvePercent(percent) * this.range() + this.from;
    target['style'][key]  = newValue.toString() + 'px';

    if(this.updateHandler) this.updateHandler();
    return this;
  }
  
  // Getters
  this.range = function() { return this.to - this.from; }
  // Tween start time
  this.startTime = function() { return this.timestamp; }
  // Tween end time
  this.endTime = function() { return this.timestamp + this.duration; }
  // If date is during the tween
  this.betweenTime = function(ms) { return Raven.between(this.timestamp, this.endTime(), ms); }
  
  // Setters
  this.setLinear = function() { ease.setLinear(); return this; }
  this.setEase = function(x0, y0, x1, y1) { ease.set(x0, y0, x1, y1); return this; }
  this.setPenner = function(ease) { ease.setPenner( CubicEase.getPenner(ease) ); return this; }
  this.setStepped = function() { ease.setStepped(); return this; }
  
  return this;
}

function TweenController() {
  var _this = this;
  var tweens = [];
  this.active = 0;
  
  this.totalTweens = function() { return tweens.length; }
  
  this.addTween = function(target, key, to, duration, x0, y0, x1, y1, delay, updateHandler, completeHandler) {
    var ease = new CubicEase().set(x0, y0, x1, y1);
    tweens.push( new Tween(target, key, to, duration, ease, delay, updateHandler, completeHandler) );
    return this;
  }
  
  this.addPenner = function(target, key, to, duration, penner, delay, updateHandler, completeHandler) {
    tweens.push( new Tween(target, key, to, duration, CubicEase.getPenner(penner), delay, updateHandler, completeHandler) );
    return this;
  }

  this.addTweenCSS = function(target, key, to, duration, x0, y0, x1, y1, delay, updateHandler, completeHandler) {
    var ease = new CubicEase().set(x0, y0, x1, y1);
    tweens.push( new TweenCSS(target, key, to, duration, ease, delay, updateHandler, completeHandler) );
    return this;
  }

  this.addPennerCSS = function(target, key, to, duration, penner, delay, updateHandler, completeHandler) {
    tweens.push( new TweenCSS(target, key, to, duration, CubicEase.getPenner(penner), delay, updateHandler, completeHandler) );
    return this;
  }
  
  this.removeTween = function(index) {
    tweens.splice(index, 1);
    return this;
  }
  
  this.update = function() {
    var i, percent, now = new Date().getTime();
    this.active = 0;
    for(i = 0; i < this.totalTweens(); i) {
      percent = (now - tweens[i].timestamp) / tweens[i].duration;
      // Tweens will overlap one another if not properly timed out with delay
      if(percent >= 0 && percent < 1) {
        tweens[i].update(percent);
        ++this.active;
        ++i;
      } else if(percent >= 1) {
        tweens[i].complete();
        this.removeTween(i);
      } else {
        ++i;
      }
    }
    return this;
  }
  
  return this;
}

var Ani = new TweenController(); // Global tweener


