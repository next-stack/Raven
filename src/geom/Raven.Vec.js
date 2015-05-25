var Raven = Raven || {};

Raven.Vec = function(px, py, pz) {
    this.x = px !== undefined ? px : 0;
    this.y = py !== undefined ? py : 0;
    this.z = pz !== undefined ? pz : 0;

    this.set = function(vx, vy, vz) {
        if(vx !== undefined) this.x = vx;
        if(vy !== undefined) this.y = vy;
        if(vz !== undefined) this.z = vz;
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
        if( isNaN(value) ) {
            v.x += value.x;
            v.y += value.y;
            v.z += value.z;
        } else {
            v.x += value;
            v.y += value;
            v.z += value;
        }
        return v;
    };

    this.divide = function(value) {
        var v = this.copy();
        if( isNaN(value) ) {
            v.x /= value.x;
            v.y /= value.y;
            v.z /= value.z;
        } else {
            v.x /= value;
            v.y /= value;
            v.z /= value;
        }
        return v;
    };

    this.multiply = function(value) {
        var v = this.copy();
        if( isNaN(value) ) {
            v.x *= value.x;
            v.y *= value.y;
            v.z *= value.z;
        } else {
            v.x *= value;
            v.y *= value;
            v.z *= value;
        }
        return v;
    };

    this.subtract = function(value) {
        var v = this.copy();
        if( isNaN(value) ) {
            v.x -= value.x;
            v.y -= value.y;
            v.z -= value.z;
        } else {
            v.x -= value;
            v.y -= value;
            v.z -= value;
        }
        return v;
    };

    this.equals = function(vec) {
        return this.x == vec.x && this.y == vec.y && this.z == vec.z;
    };

    this.length = function() {
        return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
    };

    this.normalize = function(length) {
        var delimiter = length !== undefined ? length : 1.0;
        var scale = delimiter / this.length();
        this.x *= scale;
        this.y *= scale;
        this.z *= scale;
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

    this.lerp = function(value, min, max) {
        if(min.x !== undefined && max.x !== undefined) {
            this.x = Raven.lerp(value, min.x, max.x);
        }
        if(min.y !== undefined && max.y !== undefined) {
            this.y = Raven.lerp(value, min.y, max.y);
        }
        if(min.z !== undefined && max.z !== undefined) {
            this.z = Raven.lerp(value, min.z, max.z);
        }
        return this;
    };

    return this;
}

Raven.Vec.prototype.constructor = Raven.Vec;

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

Raven.Vec.lerp = function(value, min, max) {
    return new Raven.Vec().lerp(value, min, max);
};
