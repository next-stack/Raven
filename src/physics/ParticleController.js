(function (window) {

  // Constructor
  var ParticleController = function () {
    this.totalParticles = 0;
    this.totalTargets = 0;
    this.particles = [];
    this.targets = [];
  }

  function findClosest(pos, targets) {
    // Particle
    var closest = targets[0];
    // Float
    var closestDist = MathUtil.distance3D(pos, closest);
    var newDist = 0;
    var total = targets.length;
    if (total > 1) {
      for (var i = 1; i < total; ++i) {
        newDist = MathUtil.distance3D(pos, targets[i]);
        if (newDist < closestDist) {
          closestDist = newDist;
          closest = targets[i];
        }
      }
    }
    return closest;
  }

  // Public
  ParticleController.prototype = {

    "addParticle": function (posX, posY, posZ) {
      var p = new Particle();
      p.x = posX;
      p.y = posY;
      p.z = posZ;
      this.particles[this.totalParticles] = p;
      ++this.totalParticles;
      return this;
    },

    "removeParticle": function (particleNum) {
      delete this.particles[this.totalParticles];
      this.particles.slice(particleNum, 1);
      --this.totalParticles;
      return this;
    },

    "test": function () {
      findClosest(this.particles[0], this.targets);
    },

    "addTarget": function (posX, posY, posZ) {
      var t = { x: posX, y: posY, z: posZ };
      this.targets[this.totalTargets] = t;
      ++this.totalTargets;
      return this;
    },

    "removeTarget": function (targetNum) {
      delete this.targets[this.totalTargets];
      this.targets.slice(targetNum, 1);
      --this.totalTargets;
      return this;
    },

    "update": function () {
      if (this.totalParticles > 0) {
        var iterator;
        for (var i = 0; i < this.totalParticles; ++i) {
          iterator = this.particles[i];
          iterator.target = findClosest(iterator, this.targets);
          iterator.update();
        }
      }
      return this;
    },

    "render": function () {

      var i, iterator;
      CanvasUtil.setFillColor("#F00");
      for (i = 0; i < this.totalTargets; ++i) {
        iterator = this.targets[i];
        iterator.render();
      }

      for (i = 0; i < this.totalParticles; ++i) {
        iterator = this.particles[i];
        iterator.render();
      }

      return this;
    }
  };

  window.ParticleController = ParticleController;
} (window));