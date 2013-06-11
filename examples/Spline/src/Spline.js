var Raven = Raven || {};

Spline = function(s1, s2, s3, s4) {
    var that = this;

    this.rawPoints = [];
    this.controlPoints = [];

    var numSegments = 0;
    var numRawPoints = 0;
    var closed = false;
    
    var findMidpoint = function(a, b) {
      return Raven.Vec2.range(a, b, 0.5);
    }

    var interpolate = function(t, func) {
        var s, st;
        var cs = that.controlPoints;

        s = Math.floor(t * numSegments)
        st = (t * numSegments) - s;

        if (s == cs.length / 4) {
            s = Math.max(0, s - 1);
            st = 1;
        }

        s *= 4;

        var v = Raven.Vec2.zero();
        v.x = func(st, cs[s + 0].x, cs[s + 1].x, cs[s + 2].x, cs[s + 3].x);
        v.y = func(st, cs[s + 0].y, cs[s + 1].y, cs[s + 2].y, cs[s + 3].y);
        return v;
    }

    this.valueAt = function(t) {
        return interpolate(t, Raven.bezierPosition);
    }

    this.velocityAt = function(t) {
        return interpolate(t, Raven.bezierVelocity);
    }
    
    this.addP = function(p) {
      this.rawPoints.push(p);
      this.controlPoints.push(p);
      numRawPoints = this.rawPoints.length;
    }

    this.add = function(p1, p2) {
        this.addP(p1);
        this.addP(p2);
        this.calculateControlPoints();
    }

    this.closePath = function() {
        closed = true;
        this.calculateControlPoints();
    }

    this.calculate = function() {
        if (numRawPoints < 4 || numRawPoints % 2 == 1) {
            throw "Spline is corrupt - illegal number of points (should be an even number and >= 4)";
        }

        this.controlPoints = [];
        numSegments = 1;

        for (var i = 0; i < numRawPoints; i++) {

            var r = this.rawPoints[i];

            if (i < 3) {

                if (closed && i == 0) {
                    var l = this.rawPoints[i + 1];
                    var m = findMidpoint(l, r);
                    this.controlPoints.push(m);
                } else {
                    this.controlPoints.push(r);
                }

                continue;
            }

            if (i >= 3 && i % 2 == 0) {
                this.controlPoints.push(r);
                continue;
            }

            if (i >= 3 && i % 2 == 1 && i == numRawPoints - 1 && !closed) {
                this.controlPoints.push(r);
                continue;
            }

            if (i >= 3 && i % 2 == 1 && i < numRawPoints - 1) {
                var l = this.rawPoints[i - 1];
                var m = findMidpoint(r, l);
                this.controlPoints.push(m, m, r);
                numSegments++;
                continue;
            }
        }

        if (closed) {
            var beflast = this.rawPoints[this.rawPoints.length-2];
            var last = this.rawPoints[this.rawPoints.length-1];

            var first = this.rawPoints[0];
            var second = this.rawPoints[1];

            var m1 = findMidpoint(last, beflast);
            var m2 = findMidpoint(first, second);

            this.controlPoints.push(m1, m1, last, first, m2);

            numSegments++;
        }
    }
}