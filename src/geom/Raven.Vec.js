var Raven = Raven || {};

Raven.Vec = function(px, py, pz) {
    this.constructor.name = "Raven.Vec";
    this.x = px !== undefined ? px : 0;
    this.y = py !== undefined ? py : 0;
    this.z = pz !== undefined ? pz : 0;

    this.set = function(px, py, pz) {
        this.x = px;
        this.y = py;
        this.z = pz;
        return this;
    }

    this.copy = function() {
        return new Raven.Vec(this.x, this.y, this.z);
    };

    this.round = function() {
        return new Raven.Vec(Math.round(this.x), Math.round(this.y), Math.round(this.z));
    };

    this.add = function(value) {
        var v = this.copy();
        v.x += value;
        v.y += value;
        v.z += value;
        return v;
    };

    this.addV = function(vec) {
        var v = this.copy();
        v.x += vec.x;
        v.y += vec.y;
        v.z += vec.z;
        return v;
    };

    this.divide = function(value) {
        var v = this.copy();
        v.x /= value;
        v.y /= value;
        v.z /= value;
        return v;
    };

    this.divideV = function(vec) {
        var v = this.copy();
        v.x /= vec.x;
        v.y /= vec.y;
        v.z /= vec.z;
        return v;
    };

    this.multiplyV = function(vec) {
        var v = this.copy();
        v.x *= vec.x;
        v.y *= vec.y;
        v.z *= vec.z;
        return v;
    };

    this.multiply = function(value) {
        var v = this.copy();
        v.x *= value;
        v.y *= value;
        v.z *= value;
        return v;
    };

    this.subtract = function(value) {
        var v = this.copy();
        v.x -= value;
        v.y -= value;
        v.z -= value;
        return v;
    };

    this.subtractV = function(vec) {
        var v = this.copy();
        v.x -= vec.x;
        v.y -= vec.y;
        v.z -= vec.z;
        return v;
    };

    this.equals = function(vec) {
        return this.x == vec.x && this.y == vec.y && this.z == vec.z;
    };

    this.length = function() {
        return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    };

    this.normalize = function() {
        var delimiter = 1.0 / this.length();
        this.x *= delimiter;
        this.y *= delimiter;
        this.z *= delimiter;
        return this;
    };

    this.leftNormal = function() {
        return new Raven.Vec(-this.y, this.x, 0);
    };

    this.rightNormal = function() {
        return new Raven.Vec(this.y, -this.x, 0);
    };
    
    /**
     * The product of the magnitudes of the two vectors
     * and the cosine of the angle between them.
     * @param  {[Raven.Vec]} vec [The combined vector.]
     * @return {[Number]}     [The total length of the angle.]
     */
    this.dot = function(vec) {
        return (this.x*vec.x) + (this.y*vec.y) + (this.z*vec.z);
    };

    this.difference = function(vec) {
        return new Raven.Vec(this.x - vec.x, this.y - vec.y, this.z - vec.z);
    }

    this.distance = function(vec) {
        return Raven.distance3D(this.x, this.y, this.z, vec.x, vec.y, vec.z);
    }

    this.angleRad = function(vec) {
        return Raven.getAngleRad(this, vec);
    };
    
    this.angleDeg = function(vec) {
        return Raven.getAngleDeg(this, vec);
    };

    return this;
}

Raven.Vec.zero = function() {
    return new Raven.Vec(0, 0, 0);
}

Raven.Vec.one = function() {
    return new Raven.Vec(1, 1, 1);
}

Raven.Vec.random = function(px, py, pz) {
    return new Raven.Vec(Math.random() * px, Math.random() * py, Math.random() * pz);
}

Raven.Vec.range = function(minV, maxV, value) {
    return new Raven.Vec(Raven.range(minV.x, maxV.x, value), Raven.range(minV.y, maxV.y, value), Raven.range(minV.z, maxV.z, value));
}

Raven.Vec.randomRange = function(minX, minY, minZ, maxX, maxY, maxZ) {
    return new Raven.Vec(Raven.randRange(minX, maxX), Raven.randRange(minY, maxY), Raven.randRange(minZ, maxZ));
}
