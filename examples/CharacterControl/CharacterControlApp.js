/**
 * This app demos basic canvas drawing / mobile support.
 */

var params = {
 jumpHeight: 15,
 floorHeight: 28,
 gravity: 0.75,
 gameSpeed: 1
}

var app = Raven.makeInstance(Raven.App);
app.fullsize = true;
app.setup(480, 320, Raven.element("world"), Raven.View.VIEW_CANVAS);
app.floor = 768 - params.floorHeight;
app.camera = Raven.Vec2.zero();

var hero = new Character();

app.init = function() {
  this.super.init();
  hero.init(25, 0);
}

app.touchDown = function(id, mx, my) {
  var touches = this.touchPoints.length;
  if(touches == 1) {
    hero.jump(params.jumpHeight);
  }
}

app.keyDown = function(evt) {
  switch(evt.keyCode) {
    
    case Key.SHIFT:
      if(hero.state == hero.states.WALK) hero.run();
    break;
    
    case Key.LEFT:
      hero.turnLeft();
      evt.shiftKey ? hero.run() : hero.walk();
    break;
    
    case Key.RIGHT:
      hero.turnRight();
      evt.shiftKey ? hero.run() : hero.walk();
    break;
    
    case Key.UP:
      hero.jump(params.jumpHeight);
    break;
    
    case Key.DOWN:
      hero.duck();
    break;
  }
}

app.keyUp = function(evt) {
  switch(evt.keyCode) {
    case Key.SHIFT:
      if(hero.state == hero.states.RUN) hero.walk();
    break;
    
    case Key.DOWN:
    case Key.LEFT:
    case Key.RIGHT:
      hero.stand();
    break;
  }
}

app.charRunning = function() {
  return this.keysDown[Key.SHIFT] != null && hero.direction.target != 0;
}

app.update = function() {
  var size = new Raven.Vec2(this.view.width, this.view.height);
  //this.camera.x = (this.camera.x + params.gameSpeed) % (size.x * 4);
  this.floor = size.y - params.floorHeight;
  hero.update(params.gravity, this.floor, size, this.frameNum, this.frameRate, this.charRunning());
  if(hero.pos.y < -30) hero.pos.y = -30;
}

app.render = function() {
  var graphics = this.view.renderer;
  
  this.renderBackground(graphics);
  this.renderMiddleGround(graphics);
  this.renderHUD(graphics);
}

app.renderBackground = function(graphics) {
  graphics.setFillRGB(102, 102, 102);
  graphics.drawRect(-this.camera.x, this.floor+this.camera.y, this.view.width, this.view.height - this.floor);
  graphics.setFillHex("#40B27E");
  graphics.drawRect(0, this.floor, this.view.width, this.view.height-params.floorHeight, true);
}

app.renderMiddleGround = function(graphics) {
  // Draw character
  hero.render(graphics, this.camera);
}

app.renderHUD = function(graphics) {
  graphics.setFillRGB(255, 255, 255);
  graphics.drawFont("Current State: " + hero.getStatus(), 25, 25);
  graphics.drawFont("Direction: " + hero.directionName(), 25, 40);
  
  var instructionsOffset = 65;
  var instructions = [
    "Press Left to walk left",
    "Press Right to walk right",
    "Press Up to jump",
    "Press Down to duck",
    "Hold Shift to accelerate"
  ];
  for(var i = 0; i < instructions.length; ++i) {
    graphics.drawFont( instructions[i], 25, i * 15 + instructionsOffset );
  }
}

app.init(app.view.canvas);
app.view.backgroundColor = Raven.Color.hexToRGB("#aac0fa");
app.autoRender();
