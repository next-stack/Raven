function Character() {
  
  var _this = this;
  
  // Public
  this.direction = new Raven.Interpolation(); // -1 = left, 0 = stand, 1 = right
  this.direction.target = this.direction.value = 0;
  this.direction.autoDispose = false;
  this.direction.speed = 0.5;
  this.direction.spring = 0;
  
  var maxWidth = 40;
  var maxHeight = 68;
  
  this.bounds = new Raven.Rect(0, 0, maxWidth, maxHeight);
  this.size = new Raven.Vec2(maxWidth, maxHeight);
  this.pos = Raven.Vec2.zero();
  this.vel = Raven.Vec2.zero();
  this.prev = this.pos.copy();
  this.walkSpeed = 4;
  this.runSpeed = 10;
  
  this.animations = {};
  
  this.states = {
    STAND: 0,
    DUCK: 1,
    WALK: 2,
    RUN: 3,
    JUMP: 4
  };
  
  this.state = this.states.STAND;
  
  // Private
  var MAX_JUMP = 2;
  var jumpsLeft = MAX_JUMP;
  
  var state_jumping = new Raven.FrameCounter(15); // delay the jump to secure the velocity doesn't go NUTS
  
  this.getStatus = function() {
    var _stateNames = ["STAND", "DUCK", "WALK", "RUN", "JUMP"];
    return _stateNames[this.state];
  }
  
  this.stand = function() {
    this.state = this.states.STAND;
    this.bounds.y = 0;
    this.direction.target = 0;
  }
  
  this.jump = function(amount) {
    if(jumpsLeft == 0) return;
    if(state_jumping.active()) return;
    this.state = this.states.JUMP;
    this.vel.y -= amount;
    --jumpsLeft;
    state_jumping.restart();
  }
  
  this.duck = function() {
    this.state = this.states.DUCK;
    this.bounds.y = (maxHeight/2);
  }
  
  this.turnLeft = function() {
    this.direction.target = -90;
  }
  
  this.turnRight = function() {
    this.direction.target = 90;
  }
  
  this.turnAround = function() {
    this.direction.target = 180;
  }
  
  this.walk = function() {
    this.state = this.states.WALK;
    this.bounds.y = 0;
  }
  
  this.run = function() {
    this.state = this.states.RUN;
    this.bounds.y = 0;
  }
  
  this.init = function(x, y) {
    this.pos.set(x, y);
    setupAnimations();
  }
  
  this.update = function(gravity, floor, stageSize, frameNum, frameRate, isRunning) {
    // states
    this.direction.update();
    
    // Reposition
    this.prev = this.pos.copy();
    var dir = this.direction.target == 90 ? 1 : -1;
    if(this.state == this.states.WALK) {
      this.vel.x = this.walkSpeed * (this.direction.value / this.direction.target) * dir;
    } if(this.state == this.states.RUN) {
      this.vel.x = this.runSpeed * (this.direction.value / this.direction.target) * dir;
    } else if(this.state == this.states.JUMP) {
      if(this.direction.target != 0) {
        this.vel.x = (isRunning ? this.runSpeed : this.walkSpeed) * (this.direction.value / this.direction.target) * dir;
      }
    }
    
    this.vel.x *= 0.8; // dampen
    this.vel.y += gravity;
    this.pos = this.pos.add(this.vel);
    
    // Check position
    if(this.pos.y + this.size.y > floor) {
      this.pos.y = floor - this.size.y; // restrict
      this.vel.y = 0; // reset velocity
      jumpsLeft = MAX_JUMP;
      if(this.state == this.states.JUMP) {
        if(this.direction.target == 0) {
          this.stand();
        } else {
          this.walk();
        }
      }
    }
    
    var dirName = this.directionName();
    var startName = "";
    switch(this.state) {
      case this.states.STAND:
        startName = "stand_";
      break;
      
      case this.states.DUCK:
        startName = "duck_";
      break;
      
      case this.states.WALK:
        startName = "walk_";
      break;
      
      case this.states.RUN:
        startName = "run_";
      break;
      
      case this.states.JUMP:
        startName = "jump_";
        if(this.vel.x > 0) {
          dirName = "right";
        } else {
          dirName = "left";
        }
      break;
    }
    
    if(startName.length > 0) {
      if(this.animations[startName + dirName] != null) {
        this.animations[startName + dirName].update(frameNum, frameRate);
      } else {
        console.log("Start doesn't exist: ", startName, dirName, this.direction.target);
      }
    }
    
    state_jumping.update();
  }
  
  this.render = function(renderer, camera) {
    var camOffset = this.pos.copy();
    camOffset.x -= camera.x;
    camOffset.y += camera.y;
    
    var dirName = this.directionName();
    var startName = "";
    switch(this.state) {
      case this.states.STAND:
        startName = "stand_";
      break;
      
      case this.states.DUCK:
        startName = "duck_";
      break;
      
      case this.states.WALK:
        startName = "walk_";
      break;
      
      case this.states.RUN:
        startName = "run_";
      break;
      
      case this.states.JUMP:
        startName = "jump_";
        if(this.vel.x > 0) {
          dirName = "right";
        } else {
          dirName = "left";
        }
      break;
    }
    
    if(startName.length > 0) {
      this.animations[startName + dirName].render(renderer, camOffset);
    }
    
  }
  
  this.directionName = function() {
    if(this.direction.target == 0)   return "forward";
    if(this.direction.target == 90)  return "right";
    if(this.direction.target == -90) return "left";
    if(this.direction.target == 180) return "back";
    return "";
  }
  
  // Private
  /** This should be get replaced by a MovieClip class. */
  function setupAnimations() {
    var fps = 18;
    _this.animations = {
      "stand_forward": new Raven.Spritesheet("images/standing_forward.png", 1, fps),
      "stand_left":   new Raven.Spritesheet("images/standing_left.png",   1, fps),
      "stand_right":   new Raven.Spritesheet("images/standing_right.png",   1, fps),
      
      "duck_forward": new Raven.Spritesheet("images/ducking_right.png", 1, fps),
      "duck_right": new Raven.Spritesheet("images/ducking_right.png", 1, fps),
      "duck_left":  new Raven.Spritesheet("images/ducking_left.png",  1, fps),

      "walk_right": new Raven.Spritesheet("images/walking_right.png", 2, fps),
      "walk_left" : new Raven.Spritesheet("images/walking_left.png",  2, fps),

      "run_right": new Raven.Spritesheet("images/running_right.png", 4,  fps),
      "run_left":  new Raven.Spritesheet("images/running_left.png",  4,  fps),
      
      "jump_right": new Raven.Spritesheet("images/jumping_right.png", 2,  fps, false),
      "jump_left":  new Raven.Spritesheet("images/jumping_left.png",  2,  fps, false)
    };
  }
  
  
}