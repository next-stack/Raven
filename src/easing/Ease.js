(function(window) {
	
	// Constructor
	var Ease = function() {
	}

	Ease._2PI = 6.283185307179586;
	Ease._HALF_PI = 1.5707963267948966;

	/************************************
	 * BACK
	 ***********************************/

	Ease.backIn = function(t, b, c, d, s) {
		if( s == undefined ) s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	}

	Ease.backOut = function(t, b, c, d, s) {
		if( s == undefined ) s = 1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	}

	Ease.backInOut = function(t, b, c, d, s) {
		if( s == undefined ) s = 1.70158;
		if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
		return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
	}

	/************************************
	 * BOUNCE
	 ***********************************/

	Ease.bounceIn = function(t, b, c, d) {
		return c - easeOut(d-t, 0, c, d) + b;
	}

	Ease.bounceOut = function(t, b, c, d) {
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

	Ease.bounceInOut = function(t, b, c, d) {
		if (t < d/2) return easeIn (t*2, 0, c, d) * .5 + b;
		return easeOut (t*2-d, 0, c, d) * .5 + c*.5 + b;
	}

	/************************************
	 * CIRC
	 ***********************************/

	Ease.circIn = function(t, b, c, d) {
		return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
	}

	Ease.circOut = function(t, b, c, d) {
		return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
	}

	Ease.circInOut = function(t, b, c, d) {
		if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
		return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
	}

	/************************************
	 * CUBIC
	 ***********************************/

	Ease.cubicIn = function(t, b, c, d) {
		return c*(t/=d)*t*t + b;
	}

	Ease.cubicOut = function(t, b, c, d) {
		return c*((t=t/d-1)*t*t + 1) + b;
	}

	Ease.cubicInOut = function(t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t + b;
		return c/2*((t-=2)*t*t + 2) + b;
	}

	/************************************
	 * ELASTIC
	 ***********************************/

	Ease.elasticIn = function(t, b, c, d, a, p) {
		if( a == undefined ) a = 0;
		if( p == undefined ) p = 0;
		var s;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (!a || a < Math.abs(c)) { a=c; s = p/4; }
		else s = p/_2PI * Math.asin (c/a);
		return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*_2PI/p )) + b;
	}

	Ease.elasticOut = function(t, b, c, d, a, p) {
		var s;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (!a || a < Math.abs(c)) { a=c; s = p/4; }
		else s = p/_2PI * Math.asin (c/a);
		return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*_2PI/p ) + c + b);
	}

	Ease.elasticInOut = function(t, b, c, d, a, p) {
		var s;
		if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
		if (!a || a < Math.abs(c)) { a=c; s = p/4; }
		else s = p/_2PI * Math.asin (c/a);
		if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*_2PI/p )) + b;
		return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*_2PI/p )*.5 + c + b;
	}

	/************************************
	 * EXPO
	 ***********************************/

	Ease.expoIn = function(t, b, c, d) {
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b - c * 0.001;
	}

	Ease.expoOut = function(t, b, c, d) {
		return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
	}

	Ease.expoInOut = function(t, b, c, d) {
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
		return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
	}

	/************************************
	 * LINEAR
	 ***********************************/

	Ease.linear = function(t, b, c, d) {
		return c*t/d + b;
	}

	/************************************
	 * QUAD
	 ***********************************/

	Ease.quadIn = function(t, b, c, d) {
		return c*(t/=d)*t + b;
	}

	Ease.quadOut = function(t, b, c, d) {
		return -c *(t/=d)*(t-2) + b;
	}

	Ease.quadInOut = function(t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	}

	/************************************
	 * QUART
	 ***********************************/

	Ease.quartIn = function(t, b, c, d) {
		return c*(t/=d)*t*t*t + b;
	}

	Ease.quartOut = function(t, b, c, d) {
		return -c * ((t=t/d-1)*t*t*t - 1) + b;
	}

	Ease.quartInOut = function(t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
		return -c/2 * ((t-=2)*t*t*t - 2) + b;
	}

	/************************************
	 * QUINT
	 ***********************************/

	Ease.quintIn = function(t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	}

	Ease.quintOut = function(t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	}

	Ease.quintInOut = function(t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	}

	/************************************
	 * SINE
	 ***********************************/

	Ease.sineIn = function(t, b, c, d) {
		return -c * Math.cos(t/d * _HALF_PI) + c + b;
	}

	Ease.sineOut = function(t, b, c, d) {
		return c * Math.sin(t/d * _HALF_PI) + b;
	}

	Ease.sineInOut = function(t, b, c, d) {
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	}

	/************************************
	 * STRONG
	 ***********************************/

	Ease.strongIn = function(t, b, c, d) {
		return c*(t/=d)*t*t*t*t + b;
	}

	Ease.strongOut = function(t, b, c, d) {
		return c*((t=t/d-1)*t*t*t*t + 1) + b;
	}

	Ease.strongInOut = function(t, b, c, d) {
		if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
		return c/2*((t-=2)*t*t*t*t + 2) + b;
	}
	
	window.Ease = Ease;
}(window));