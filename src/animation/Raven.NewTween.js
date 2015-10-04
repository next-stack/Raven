var Raven = Raven || {};

/**
 * Cheers to Gaëtan Renaudeau for the awesome bezier-easing code!
 * https://github.com/gre/bezier-easing
 */
Raven.Bezier = function(p0, c0, c1, p1) {
    this.p0 = p0 !== undefined ? p0 : 0.25;
    this.c0 = c0 !== undefined ? c0 : 0.25;
    this.c1 = c1 !== undefined ? c1 : 0.75;
    this.p1 = p1 !== undefined ? p1 : 0.75;
    //////////////////////////////////////////////////
    //
    // These values are established by empiricism with tests (tradeoff: performance VS precision)
    var NEWTON_ITERATIONS = 4;
    var NEWTON_MIN_SLOPE = 0.001;
    var SUBDIVISION_PRECISION = 0.0000001;
    var SUBDIVISION_MAX_ITERATIONS = 10;

    var kSplineTableSize = 11;
    var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

    var float32ArraySupported = typeof Float32Array === "function";
    var _this = this;
    //
    var mSampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);

    function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
    function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
    function C (aA1)      { return 3.0 * aA1; }

    // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
    function calcBezier (aT, aA1, aA2) {
      return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
    }

    // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
    function getSlope (aT, aA1, aA2) {
      return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
    }

    function binarySubdivide (aX, aA, aB, mX1, mX2) {
      var currentX, currentT, i = 0;
      do {
        currentT = aA + (aB - aA) / 2.0;
        currentX = calcBezier(currentT, mX1, mX2) - aX;
        if (currentX > 0.0) {
          aB = currentT;
        } else {
          aA = currentT;
        }
      } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
      return currentT;
    }

    function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
      for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
        var currentSlope = getSlope(aGuessT, mX1, mX2);
        if (currentSlope === 0.0) return aGuessT;
        var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
        aGuessT -= currentX / currentSlope;
      }
      return aGuessT;
    }
    //////////////////////////////////////////////////
    //
    function precompute() {
        for(var i = 0; i < kSplineTableSize; ++i) {
            mSampleValues[i] = calcBezier(i * kSampleStepSize, _this.p0, _this.c1);
        }
    }
    function getTForX(aX) {
        var mX1 = _this.p0,
        mX2 = _this.c1;

        var intervalStart = 0.0;
        var currentSample = 1;
        var lastSample = kSplineTableSize - 1;

        for (; currentSample !== lastSample && mSampleValues[currentSample] <= aX; ++currentSample) {
          intervalStart += kSampleStepSize;
        }
        --currentSample;

        // Interpolate to provide an initial guess for t
        var dist = (aX - mSampleValues[currentSample]) / (mSampleValues[currentSample+1] - mSampleValues[currentSample]);
        var guessForT = intervalStart + dist * kSampleStepSize;

        var initialSlope = getSlope(guessForT, mX1, mX2);
        if (initialSlope >= NEWTON_MIN_SLOPE) {
          return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
        } else if (initialSlope === 0.0) {
          return guessForT;
        } else {
          return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
        }
    }
    //////////////////////////////////////////////////
    //
    this.at = function(x) {
        if(x <= 0) return 0;
        if(x >= 1) return 1;
        if(this.p0 === this.c0 && this.c1 === this.p1) return x; // linear
        return calcBezier( getTForX(x), this.c0, this.p1 ); // bezier
    };
    //
    this.set = function(p0, c0, c1, p1) {
        this.p0 = p0;
        this.c0 = c0;
        this.c1 = c1;
        this.p1 = p1;
        precompute();
        return this;
    };
    precompute();
    return this;
};

//////////////////////////////
// Static

Raven.Bezier.getEase = function (ease) {
    var curve = new Raven.Bezier();
    switch(ease) {
        case "circIn":
            curve.set( 0.600, 0.040, 0.980, 0.335 );
            break;
        case "circInOut":
            curve.set( 0.785, 0.135, 0.150, 0.860 );
            break;
        case "circOut":
            curve.set( 0.075, 0.820, 0.165, 1.000 );
            break;

        case "cubicIn":
            curve.set( 0.550, 0.055, 0.675, 0.190 );
            break;
        case "cubicInOut":
            curve.set( 0.645, 0.045, 0.355, 1.000 );
            break;
        case "cubicOut":
            curve.set( 0.215, 0.610, 0.355, 1.000 );
            break;

        case "expoIn":
            curve.set( 0.950, 0.050, 0.795, 0.035 );
            break;
        case "expoInOut":
            curve.set( 1.000, 0.000, 0.000, 1.000 );
            break;
        case "expoOut":
            curve.set( 0.190, 1.000, 0.220, 1.000 );
            break;

        case "quadIn":
            curve.set( 0.550, 0.085, 0.680, 0.530 );
            break;
        case "quadInOut":
            curve.set( 0.455, 0.030, 0.515, 0.955 );
            break;
        case "quadOut":
            curve.set( 0.250, 0.460, 0.450, 0.940 );
            break;

        case "quartIn":
            curve.set( 0.895, 0.030, 0.685, 0.220 );
            break;
        case "quartInOut":
            curve.set( 0.860, 0.000, 0.070, 1.000 );
            break;
        case "quartOut":
            curve.set( 0.230, 1.000, 0.320, 1.000 );
            break;

        case "quintIn":
            curve.set( 0.755, 0.050, 0.855, 0.060 );
            break;
        case "quintInOut":
            curve.set( 0.770, 0.000, 0.175, 1.000 );
            break;
        case "quintOut":
            curve.set( 0.165, 0.840, 0.440, 1.000 );
            break;

        case "sineIn":
            curve.set( 0.470, 0.000, 0.745, 0.715 );
            break;
        case "sineInOut":
            curve.set( 0.445, 0.050, 0.550, 0.950 );
            break;
        case "sineOut":
            curve.set( 0.390, 0.575, 0.565, 1.000 );
            break;

        case "linear":
        default:
            curve.set( 0.250, 0.250, 0.750, 0.750 );
            break;
    }
    return curve;
};

//////////////////////////////////////////////////
// Tween

Raven.Tween = function (target, keys, to, duration, ease, delay, updateHandler, completeHandler) {
    this.target     = target;
    this.keys       = Raven.isArray(keys) ? keys : [ keys ];
    this.to         = Raven.isArray( to ) ?  to  : [  to  ];
    this.from       = [];
    this.duration   = duration * 1000;
    this.timestamp  = new Date().getTime() + (delay !== undefined ? delay * 1000 : 0);
    this.ease       = Raven.isString(ease) ? Raven.Bezier.getEase(ease) : ease;
    this.onUpdate   = undefined;
    this.onComplete = undefined;
    //
    for(var i = 0; i < this.keys.length; ++i) {
        this.from.push( target[ this.keys[i] ] );
    }
    //
    if(updateHandler !== undefined) {
        this.onUpdate = updateHandler;
    }

    if(completeHandler !== undefined) {
        this.onComplete = completeHandler;
    }
};

Raven.Tween.prototype.update = function (progress) {
    var percent   = this.ease.at( progress );
    var i, total  = this.keys.length;
    for(i = 0; i  < total; ++i) {
        var key   = this.keys[i];
        var to    = this.to[i];
        var from  = this.from[i];
        var range = to - from;
        this.target[key] = percent * range + from;
    }
    if(this.onUpdate !== undefined) this.onUpdate();
};

Raven.Tween.prototype.complete = function (progress) {
    for(var i = 0; i < this.keys.length; ++i) {
        var key = this.keys[i];
        this.target[key] = this.to[i];
    }
    if(this.onComplete !== undefined) this.onComplete();
};

Raven.Tween.prototype.isActive = function (time) {
    return Raven.between(this.startTime, this.endTime, time);
};

//////////////////////////////
// Getters

Raven.Tween.prototype.__defineGetter__("startTime", function(){
    return this.timestamp;
});

Raven.Tween.prototype.__defineGetter__("endTime", function(){
    return this.timestamp + this.duration;
});

//////////////////////////////////////////////////
// Tween Controller

Raven.TweenController = function () {
    this.active = 0;
    this.tweens = [];
};

Raven.TweenController.prototype.addTween = function (target, keys, to, duration, ease, delay, updateHandler, completeHandler) {
    this.tweens.push( new Raven.Tween( target, keys, to, duration, ease, delay, updateHandler, completeHandler ) );
};

Raven.TweenController.prototype.add = function (target, keys, to, duration, p0, c0, c1, p1, delay, updateHandler, completeHandler) {
    this.addTween( target, keys, to, duration, new Raven.Bezier(p0, c0, c1, p1), delay, updateHandler, completeHandler );
};

Raven.TweenController.prototype.remove = function (index) {
    this.tweens.splice(index, 1);
};

Raven.TweenController.prototype.update = function () {
    this.active = 0;
    var now = new Date().getTime();
    for(var i = 0; i < this.tweens.length; i) {
        var percent = (now - this.tweens[i].timestamp) / this.tweens[i].duration;
        // Tweens will overlap one another if not properly timed out with delay
        if(percent >= 0 && percent < 1) {
            this.tweens[i].update( percent );
            ++this.active;
            ++i;
        } else if(percent >= 1) {
            this.tweens[i].complete();
            this.remove( i );
        } else {
            ++i;
        }
    }
};

//////////////////////////////////////////////////
// Global Tweener

Raven.Ani = new Raven.TweenController();
