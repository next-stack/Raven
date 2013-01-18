var Raven = Raven || {};

Raven.FrameCountdown = function(totalFrames) {
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

Raven.Timeline = function() {
  
  this.loop = true;
  this.currentFrame = 0;
  this.totalFrames = 0;
  this.frames = {};
  this.onUpdate = null;
  
  this.addFrame = function(frameName, frameNum, frameAction) {
    if(frameNum > this.totalFrames) this.totalFrames = frameNum;
    this.frames[frameNum] = {
      name: frameName,
      action: frameAction
    };
  }
  
  this.goto = function(frameNum) {
    this.currentFrame = frameNum % this.totalFrames;
    return this.currentFrame;
  }
  
  this.gotoFrame = function(frameName) {
    for(var i = 0; i < this.totalFrames; ++i) {
      if(this.frames[i].name == frameName) {
        this.currentFrame = i;
        return this.currentFrame;
      }
    }
  }
  
  this.update = function(time) {
    time = time == null ? 1 : time;
    var newFrame = this.loop ? (this.currentFrame+1+time) % this.totalFrames+1 : Math.min(this.totalFrames, Math.max(0, this.currentFrame + 1));
    if(newFrame != this.currentFrame) {
      this.currentFrame = newFrame;
      if(this.onUpdate) this.onUpdate();
    }
  }
}

Raven.Interpolation = function() {
  this.speed = 0.5;
  this.spring = 0.5;
  this.target = 1;
  this.value = 0;
  this.velocity = 0;
  this.running = false;
  this.autoDispose = true;
}

Raven.Interpolation.prototype = {
  "start": function() {
    this.running = true;
    return this;
  },

  "stop": function() {
    this.running = false;
    return this;
  },

  "update": function() {
    if( !this.running ) return this;
    this.velocity = ((this.target - this.value) * this.speed) + (this.velocity * this.spring);
    this.value += this.velocity;
    if( Raven.distance( this.value, this.target ) < 0.1 && Raven.roundTo( this.velocity, 10 ) < 0.1) {
      this.velocity = 0;
      this.value = this.target;
      if(this.autoDispose) this.stop();
    }
    return this;
  }
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
  
}

// Easing

Raven.Ease = function() {
  
}

Raven.Ease._2PI = 6.283185307179586;
Raven.Ease._HALF_PI = 1.5707963267948966;

/************************************
 * BACK
 ***********************************/

Raven.Ease.backIn = function(t, b, c, d, s) {
	if( s == undefined ) s = 1.70158;
	return c*(t/=d)*t*((s+1)*t - s) + b;
}

Raven.Ease.backOut = function(t, b, c, d, s) {
	if( s == undefined ) s = 1.70158;
	return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
}

Raven.Ease.backInOut = function(t, b, c, d, s) {
	if( s == undefined ) s = 1.70158;
	if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
	return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
}

/************************************
 * BOUNCE
 ***********************************/

Raven.Ease.bounceIn = function(t, b, c, d) {
	return c - easeOut(d-t, 0, c, d) + b;
}

Raven.Ease.bounceOut = function(t, b, c, d) {
	if ((t/=d) < (1/2.75)) {
		return c*(7.5625*t*t) + b;
	} else if (t < (2/2.75)) {
		return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
	} else if (t < (2.5/2.75)) {
		return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
	} else {
		return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
	}
}

Raven.Ease.bounceInOut = function(t, b, c, d) {
	if (t < d/2) return easeIn (t*2, 0, c, d) * .5 + b;
	return easeOut (t*2-d, 0, c, d) * .5 + c*.5 + b;
}

/************************************
 * CIRC
 ***********************************/

Raven.Ease.circIn = function(t, b, c, d) {
	return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
}

Raven.Ease.circOut = function(t, b, c, d) {
	return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
}

Raven.Ease.circInOut = function(t, b, c, d) {
	if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
	return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
}

/************************************
 * CUBIC
 ***********************************/

Raven.Ease.cubicIn = function(t, b, c, d) {
	return c*(t/=d)*t*t + b;
}

Raven.Ease.cubicOut = function(t, b, c, d) {
	return c*((t=t/d-1)*t*t + 1) + b;
}

Raven.Ease.cubicInOut = function(t, b, c, d) {
	if ((t/=d/2) < 1) return c/2*t*t*t + b;
	return c/2*((t-=2)*t*t + 2) + b;
}

/************************************
 * ELASTIC
 ***********************************/

Raven.Ease.elasticIn = function(t, b, c, d, a, p) {
	if( a == undefined ) a = 0;
	if( p == undefined ) p = 0;
	var s;
	if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
	if (!a || a < Math.abs(c)) { a=c; s = p/4; }
	else s = p/Raven.Ease._2PI * Math.asin (c/a);
	return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*Raven.Ease._2PI/p )) + b;
}

Raven.Ease.elasticOut = function(t, b, c, d, a, p) {
	var s;
	if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
	if (!a || a < Math.abs(c)) { a=c; s = p/4; }
	else s = p/Raven.Ease._2PI * Math.asin (c/a);
	return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*Raven.Ease._2PI/p ) + c + b);
}

Raven.Ease.elasticInOut = function(t, b, c, d, a, p) {
	var s;
	if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
	if (!a || a < Math.abs(c)) { a=c; s = p/4; }
	else s = p/Raven.Ease._2PI * Math.asin (c/a);
	if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*Raven.Ease._2PI/p )) + b;
	return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*Raven.Ease._2PI/p )*.5 + c + b;
}

/************************************
 * EXPO
 ***********************************/

Raven.Ease.expoIn = function(t, b, c, d) {
	return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b - c * 0.001;
}

Raven.Ease.expoOut = function(t, b, c, d) {
	return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
}

Raven.Ease.expoInOut = function(t, b, c, d) {
	if (t==0) return b;
	if (t==d) return b+c;
	if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
	return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
}

/************************************
 * LINEAR
 ***********************************/

Raven.Ease.linear = function(t, b, c, d) {
	return c*t/d + b;
}

/************************************
 * QUAD
 ***********************************/

Raven.Ease.quadIn = function(t, b, c, d) {
	return c*(t/=d)*t + b;
}

Raven.Ease.quadOut = function(t, b, c, d) {
	return -c *(t/=d)*(t-2) + b;
}

Raven.Ease.quadInOut = function(t, b, c, d) {
	if ((t/=d/2) < 1) return c/2*t*t + b;
	return -c/2 * ((--t)*(t-2) - 1) + b;
}

/************************************
 * QUART
 ***********************************/

Raven.Ease.quartIn = function(t, b, c, d) {
	return c*(t/=d)*t*t*t + b;
}

Raven.Ease.quartOut = function(t, b, c, d) {
	return -c * ((t=t/d-1)*t*t*t - 1) + b;
}

Raven.Ease.quartInOut = function(t, b, c, d) {
	if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
	return -c/2 * ((t-=2)*t*t*t - 2) + b;
}

/************************************
 * QUINT
 ***********************************/

Raven.Ease.quintIn = function(t, b, c, d) {
	return c*(t/=d)*t*t*t*t + b;
}

Raven.Ease.quintOut = function(t, b, c, d) {
	return c*((t=t/d-1)*t*t*t*t + 1) + b;
}

Raven.Ease.quintInOut = function(t, b, c, d) {
	if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
	return c/2*((t-=2)*t*t*t*t + 2) + b;
}

/************************************
 * SINE
 ***********************************/

Raven.Ease.sineIn = function(t, b, c, d) {
	return -c * Math.cos(t/d * Raven.Ease._HALF_PI) + c + b;
}

Raven.Ease.sineOut = function(t, b, c, d) {
	return c * Math.sin(t/d * Raven.Ease._HALF_PI) + b;
}

Raven.Ease.sineInOut = function(t, b, c, d) {
	return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
}

/************************************
 * STRONG
 ***********************************/

Raven.Ease.strongIn = function(t, b, c, d) {
	return c*(t/=d)*t*t*t*t + b;
}

Raven.Ease.strongOut = function(t, b, c, d) {
	return c*((t=t/d-1)*t*t*t*t + 1) + b;
}

Raven.Ease.strongInOut = function(t, b, c, d) {
	if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
	return c/2*((t-=2)*t*t*t*t + 2) + b;
}
