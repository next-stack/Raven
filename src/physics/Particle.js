(function (window) {

  // Constructor
  var Particle = function () {
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.alive = true;
    this.life = 1.0;
    this.decay = 0.98;
    this.gravity = 0.8;
    this.target = { x: 0, y: 0, z: 0 };
    this.gravityV = { x: 0, y: 0, z: 0 };
    this.velocityX = 0;
    this.velocityY = 0;
    this.velocityZ = 0;
  }

  function applyField() {

  }

  function applyGravity() {

  }

  // Public
  Particle.prototype = {

    "update": function () {
      this.life -= 0.01;
      if (this.life <= 0) {
        this.alive = false;
        return this;
      }

      var gAngle = MathUtil.getAngleRad(this.x, this.y, this.target.x, this.target.y);
      // Gravity velocity
      this.gravityV.x = Math.cos(gAngle) * this.gravity;
      this.gravityV.y = Math.sin(gAngle) * this.gravity;
      // Affect velocity
      this.velocityX += this.gravityV.x;
      this.velocityY += this.gravityV.y;

      this.velocityX *= this.decay;
      this.velocityY *= this.decay;
      this.velocityZ *= this.decay;

      this.x += Number(this.velocityX);
      this.y += Number(this.velocityY);
      this.z += Number(this.velocityZ);
      return this;
    },

    "render": function () {
      return this;
    }
  };

  window.Particle = Particle;
} (window));