var Raven = Raven || {};

// Vec2
Raven.Vec2 = function(px, py) {
  this.x = px;
  this.y = py;
  
  this.set = function(px, py) {
    this.x = px;
    this.y = py;
    return this;
  }

  this.copy = function() {
    return new Raven.Vec2(this.x, this.y);
  }

  this.round = function() {
    return new Raven.Vec2(Math.round(this.x), Math.round(this.y));
  }

  this.add = function(vec) {
    var v = this.copy();
    v.x += vec.x;
    v.y += vec.y;
    return v;
  }

  this.addN = function(value) {
    var v = this.copy();
    v.x += value;
    v.y += value;
    return v;
  }

  this.subtract = function(vec) {
    var v = this.copy();
    v.x -= vec.x;
    v.y -= vec.y;
    return v;
  }

  this.subtractN = function(value) {
    var v = this.copy();
    v.x -= value;
    v.y -= value;
    return v;
  }

  this.multiply = function(vec) {
    var v = this.copy();
    v.x *= vec.x;
    v.y *= vec.y;
    return v;
  }

  this.multiplyN = function(value) {
    var v = this.copy();
    v.x *= value;
    v.y *= value;
    return v;
  }

  this.divide = function(vec) {
    var v = this.copy();
    v.x /= vec.x;
    v.y /= vec.y;
    return v;
  }

  this.divideN = function(value) {
    var v = this.copy();
    v.x /= value;
    v.y /= value;
    return v;
  }

  this.equals = function(vec) {
    return this.x == vec.x && this.y == vec.y;
  }

  this.length = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }

  this.normalize = function() {
    var delimiter = 1.0 / this.length();
    this.x *= delimiter;
    this.y *= delimiter;
    return this;
  }

  this.distance = function(vec) {
    return Raven.distance2D(this.x, this.y, vec.x, vec.y);
  }
  
  return this;
}

Raven.Vec2.zero = function() {
  return new Raven.Vec2(0, 0);
}

Raven.Vec2.one = function() {
  return new Raven.Vec2(1, 1);
}

Raven.Vec2.random = function(px, py) {
  return new Raven.Vec2(Math.random() * px, Math.random() * py);
}

Raven.Vec2.randomRange = function(minX, minY, maxX, maxY) {
  return new Raven.Vec2(Raven.randRange(minX, maxX), Raven.randRange(minY, maxY));
}

// Vec3
Raven.Vec3 = function(px, py, pz) {
  this.x = px;
  this.y = py;
  this.z = pz;
  
  this.set = function(px, py, pz) {
    this.x = px;
    this.y = py;
    this.z = pz;
    return this;
  }

  this.copy = function() {
    return new Raven.Vec3(this.x, this.y, this.z);
  }

  this.round = function() {
    return new Raven.Vec3(Math.round(this.x), Math.round(this.y), Math.round(this.z));
  }

  this.add = function(vec) {
    var v = this.copy();
    v.x += vec.x;
    v.y += vec.y;
    v.z += vec.z;
    return v;
  }

  this.addN = function(value) {
    var v = this.copy();
    v.x += value;
    v.y += value;
    v.z += value;
    return v;
  }

  this.subtract = function(vec) {
    var v = this.copy();
    v.x -= vec.x;
    v.y -= vec.y;
    v.z -= vec.z;
    return v;
  }

  this.subtractN = function(value) {
    var v = this.copy();
    v.x -= value;
    v.y -= value;
    v.z -= value;
    return v;
  }

  this.multiply = function(vec) {
    var v = this.copy();
    v.x *= vec.x;
    v.y *= vec.y;
    v.z *= vec.z;
    return v;
  }

  this.multiplyN = function(value) {
    var v = this.copy();
    v.x *= value;
    v.y *= value;
    v.z *= value;
    return v;
  }

  this.divide = function(vec) {
    var v = this.copy();
    v.x /= vec.x;
    v.y /= vec.y;
    v.z /= vec.z;
    return v;
  }

  this.divideN = function(value) {
    var v = this.copy();
    v.x /= value;
    v.y /= value;
    v.z /= value;
    return v;
  }

  this.equals = function(vec) {
    return this.x == vec.x && this.y == vec.y && this.z == vec.z;
  }

  this.length = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
  }

  this.normalize = function() {
    var delimiter = 1.0 / this.length();
    this.x *= delimiter;
    this.y *= delimiter;
    this.z *= delimiter;
    return this;
  }

  this.distance = function(vec) {
    return Raven.distance3D(this.x, this.y, this.z, vec.x, vec.y, vec.z);
  }
  
  return this;
}



Raven.Vec3.zero = function() {
  return new Raven.Vec3(0, 0, 0);
}

Raven.Vec3.one = function() {
  return new Raven.Vec3(1, 1, 1);
}

Raven.Vec3.random = function(px, py, pz) {
  return new Raven.Vec3(Math.random() * px, Math.random() * py, Math.random() * pz);
}

Raven.Vec3.randomRange = function(minX, minY, minZ, maxX, maxY, maxZ) {
  return new Raven.Vec3(Raven.randRange(minX, maxX), Raven.randRange(minY, maxY), Raven.randRange(minZ, maxZ));
}

Raven.Matrix = function() {
  this.m = new Array(4);
  for(var i = 0; i < 4; ++i) this.m[i] = new Array(4);
  
  this.toFloat32 = function() {
    var arr = new Float32Array(16);
    var i, n;
    for(i = 0; i < 4; ++i) {
      for(n = 0; n < 4; ++n) {
        arr[i * 4 + n] = this.m[i][n];
      }
    }
    return arr;
  }
  
  this.multiply = function(srcA, srcB) {
      var tmp = new ESMatrix();
      var i;
      for (i=0; i<4; i++) {
          tmp.m[i][0] =	(srcA.m[i][0] * srcB.m[0][0]) +
                          (srcA.m[i][1] * srcB.m[1][0]) +
                          (srcA.m[i][2] * srcB.m[2][0]) +
                          (srcA.m[i][3] * srcB.m[3][0]) ;

          tmp.m[i][1] =	(srcA.m[i][0] * srcB.m[0][1]) +
                          (srcA.m[i][1] * srcB.m[1][1]) +
                          (srcA.m[i][2] * srcB.m[2][1]) +
                          (srcA.m[i][3] * srcB.m[3][1]) ;

          tmp.m[i][2] =	(srcA.m[i][0] * srcB.m[0][2]) +
                          (srcA.m[i][1] * srcB.m[1][2]) +
                          (srcA.m[i][2] * srcB.m[2][2]) +
                          (srcA.m[i][3] * srcB.m[3][2]) ;

          tmp.m[i][3] =	(srcA.m[i][0] * srcB.m[0][3]) +
                          (srcA.m[i][1] * srcB.m[1][3]) +
                          (srcA.m[i][2] * srcB.m[2][3]) +
                          (srcA.m[i][3] * srcB.m[3][3]) ;
      }

      for (i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
          this.m[i][j] = tmp.m[i][j];
        }
      }
  }
  
  this.loadIdentity = function() {
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        this.m[i][j] = i == j ? 1.0 : 0.0;
      }
    }
  }
  
  this.frustum = function(left, right, bottom, top, nearZ, farZ) {
      var deltaX = right - left;
      var deltaY = top - bottom;
      var deltaZ = farZ - nearZ;
      var frust = new Raven.Matrix();

      if( (nearZ <= 0.0) || (farZ <= 0.0) ||
          (deltaX <= 0.0) || (deltaY <= 0.0) || (deltaZ <= 0.0) )
           return;

      frust.m[0][0] = 2.0 * nearZ / deltaX;
      frust.m[0][1] = frust.m[0][2] = frust.m[0][3] = 0.0;

      frust.m[1][1] = 2.0 * nearZ / deltaY;
      frust.m[1][0] = frust.m[1][2] = frust.m[1][3] = 0.0;

      frust.m[2][0] = (right + left) / deltaX;
      frust.m[2][1] = (top + bottom) / deltaY;
      frust.m[2][2] = -(nearZ + farZ) / deltaZ;
      frust.m[2][3] = -1.0;

      frust.m[3][2] = -2.0 * nearZ * farZ / deltaZ;
      frust.m[3][0] = frust.m[3][1] = frust.m[3][3] = 0.0;

      this.multiply(frust, this);
  }

  this.ortho = function(left, right, bottom, top, nearZ, farZ) {
      var deltaX = right - left;
      var deltaY = top - bottom;
      var deltaZ = farZ - nearZ;
      var ortho;

      if ( (deltaX == 0.0) || (deltaY == 0.0) || (deltaZ == 0.0) )
          return;

      ortho.loadIdentity();
      ortho.m[0][0] = 2.0 / deltaX;
      ortho.m[3][0] = -(right + left) / deltaX;
      ortho.m[1][1] = 2.0 / deltaY;
      ortho.m[3][1] = -(top + bottom) / deltaY;
      ortho.m[2][2] = -2.0 / deltaZ;
      ortho.m[3][2] = -(nearZ + farZ) / deltaZ;

      this.multiply(ortho, this);
  }

  this.perspective = function(fovy, aspect, nearZ, farZ) {
     var frustumW, frustumH;

     frustumH = Math.tan( fovy / 360.0 * Math.PI ) * nearZ;
     frustumW = frustumH * aspect;

     this.frustum(-frustumW, frustumW, -frustumH, frustumH, nearZ, farZ);
  }

  this.rotate = function(angle, x, y, z) {
    var len = Math.sqrt(x*x + y*y + z*z);
    if(len > 0) {
      var rad = Raven.toRadians(angle);
      var sinA, cosA;
      cosA = Math.cos(rad);
      sinA = Math.sin(rad);

      var xx, yy, zz, xy, yz, zx, xs, ys, zs;
      var rotMat = new Raven.Matrix();
      x /= len;
      y /= len;
      z /= len;

      xx = x * x;
      yy = y * y;
      zz = z * z;
      xy = x * y;
      yz = y * z;
      zx = z * x;
      xs = x * sinA;
      ys = y * sinA;
      zs = z * sinA;

      var oneMinusCos = 1.0 - cosA;
      rotMat.m[0][0] = (oneMinusCos * xx) + cosA;
      rotMat.m[0][1] = (oneMinusCos * xy) - zs;
      rotMat.m[0][2] = (oneMinusCos * zx) + ys;
      rotMat.m[0][3] = 0.0;

      rotMat.m[1][0] = (oneMinusCos * xy) + zs;
      rotMat.m[1][1] = (oneMinusCos * yy) + cosA;
      rotMat.m[1][2] = (oneMinusCos * yz) - xs;
      rotMat.m[1][3] = 0.0;

      rotMat.m[2][0] = (oneMinusCos * zx) - ys;
      rotMat.m[2][1] = (oneMinusCos * yz) + xs;
      rotMat.m[2][2] = (oneMinusCos * zz) + cosA;
      rotMat.m[2][3] = 0.0;

      rotMat.m[3][0] = 0.0;
      rotMat.m[3][1] = 0.0;
      rotMat.m[3][2] = 0.0;
      rotMat.m[3][3] = 1.0;

      this.multiply(rotMat, this);
    }
  }

  this.scale = function(sx, sy, sz) {
    this.m[0][0] *= sx;
    this.m[0][1] *= sx;
    this.m[0][2] *= sx;
    this.m[0][3] *= sx;

    this.m[1][0] *= sy;
    this.m[1][1] *= sy;
    this.m[1][2] *= sy;
    this.m[1][3] *= sy;

    this.m[2][0] *= sz;
    this.m[2][1] *= sz;
    this.m[2][2] *= sz;
    this.m[2][3] *= sz;
  }

  this.translate = function(tx, ty, tz) {
    this.m[3][0] += this.m[0][0] * tx + this.m[1][0] * ty + this.m[2][0] * tz;
    this.m[3][1] += this.m[0][1] * tx + this.m[1][1] * ty + this.m[2][1] * tz;
    this.m[3][2] += this.m[0][2] * tx + this.m[1][2] * ty + this.m[2][2] * tz;
    this.m[3][3] += this.m[0][3] * tx + this.m[1][3] * ty + this.m[2][3] * tz;
  }
  
}



Raven.Rect = function(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width  = width;
  this.height = height;
  
  this.left = function() {
    return this.x;
  }
  
  this.top = function() {
    return this.y;
  }
  
  this.right = function() {
    return this.x + this.width;
  }
  
  this.bottom = function() {
    return this.y + this.height;
  }
  
  this.collision = function(x, y) {
    return Raven.inBounds(x, y, this.x, this.y, this.right(), this.bottom());
  }

  this.overlap = function(x, y, width, height) {
    return this.collision(x, y) || this.collision(x+width, y+height);
  }
  
}

