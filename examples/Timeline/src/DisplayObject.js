DisplayObject = function() {
  
  this.alpha = 1;
  this.anchor = Raven.Vec3.zero(); // center anchor
  this.pos = Raven.Vec3.zero();
  this.rotation = Raven.Vec3.zero();
  this.size = Raven.Vec3.zero();
  this.matrix = new Raven.Matrix();
  
  this.name = "";
  this.parent = null;
  this.children = [];
  this.numChildren = 0;
  this.super = null;
  
  var _this = this;
  
  // Set the display object's properties from this instance's properties.
  this.setFromAni = function(animatable) {
    if(animatable) animatable.extendTo(this);
    return this;
  }
  
  this.addChildAt = function(displayObject, i) {
    if(displayObject instanceof DisplayObject) {
      console.warn("Can not add a non-DisplayObject class to DisplayObject");
      return null;
    }

    displayObject.parent = this;
    this.children.splice(i, 1, displayObject);
    ++this.numChildren;

    return displayObject;
  }

  this.addChild = function(displayObject) {
    this.addChildAt(displayObject, this.numChildren);
  }

  this.removeChildAt = function(index) {
    if(index > this.numChildren) return this;

    this.children[index].parent = null;
    this.children.splice(index, 1);
    --this.numChildren;
    return this;
  }

  this.removeChild = function(displayObject) {
    for(var i = 0; i < this.numChildren; ++i) {
      if(this.children[i] == displayObject) return this.removeChildAt(i);
    }
    return this;
  }

  this.update = function() {
    // Update children
    for(var i = 0; i < this.numChildren; ++i) {
      this.children[i].update();
    }
  }
  
  function getOffset(vOffset) {
    var oPos = _this.pos;
    if(vOffset != null) oPos = _this.pos.add(vOffset);
    return oPos;
  }
  
  function renderChildren(g, vOffset) {
    // Render children
    for(var i = 0; i < _this.numChildren; ++i) {
      _this.children[i].render(g, vOffset);
    }
  }
  
  function createOffset(g, vOffset) {
    var offset = vOffset ? vOffset : Raven.Vec2.zero();
    offset = offset.add(_this.anchor);
    g.context.setTransform(_this.matrix.a, _this.matrix.b, _this.matrix.c, _this.matrix.d, _this.matrix.tx + offset.x, _this.matrix.ty + offset.y); // matrix + anchor point
    g.context.rotate(Raven.degToRad(_this.rotation.x)); // rotation
    g.context.translate(-_this.anchor.x * (1/_this.matrix.a), -_this.anchor.y * (1/_this.matrix.d)); // account for anchor point
    return offset;
  }
  
  this.renderItem = function(g) {}
  
  function clearGraphics(graphics) {
    graphics.context.setTransform(1, 0, 0, 1, 0, 0); // clear
    graphics.context.rotate(0);
  }
  
  this.render = function(graphics, vOffset) {
    clearGraphics(graphics);
    createOffset(graphics, vOffset);
    
    this.renderItem(graphics);
    clearGraphics(graphics);

    var offset = getOffset(vOffset);
    renderChildren(graphics, offset);
  }
  
  // Interpolate between 2 animatable keyframe props
  this.interpolate = function(currentElement, nextElement, percent) {
    this.matrix.a  = range(currentElement.matrix.a,  nextElement.matrix.a,  percent);
    this.matrix.b  = range(currentElement.matrix.b,  nextElement.matrix.b,  percent);
    this.matrix.c  = range(currentElement.matrix.c,  nextElement.matrix.c,  percent);
    this.matrix.d  = range(currentElement.matrix.d,  nextElement.matrix.d,  percent);
    this.matrix.tx = range(currentElement.matrix.tx, nextElement.matrix.tx, percent);
    this.matrix.ty = range(currentElement.matrix.ty, nextElement.matrix.ty, percent);
    
    this.rotation.x = range(currentElement.rotationX, nextElement.rotationX, percent);
    this.rotation.y = range(currentElement.rotationY, nextElement.rotationY, percent);
    this.rotation.z = range(currentElement.rotationZ, nextElement.rotationZ, percent);
    this.pos.x      = range(currentElement.x, nextElement.x, percent);
    this.pos.y      = range(currentElement.y, nextElement.y, percent);
    this.pos.z      = range(currentElement.z, nextElement.z, percent);
    this.anchor.x   = range(currentElement.transformX, nextElement.transformX, percent);
    this.anchor.y   = range(currentElement.transformY, nextElement.transformY, percent);
    this.anchor.z   = range(currentElement.transformZ, nextElement.transformZ, percent);
    return animation;
  }
  
};

function MovieClip() {
  
  Raven.extend(this, DisplayObject);
  
  this.timeline = new Timeline();
  
  this.loadTimeline = function(src, type) { this.timeline.loadAnimation(src, type); }
  this.play = function() { this.timeline.playing = true; }
  this.stop = function() { this.timeline.playing = false; }
  this.goto = function(frameNum) { this.timeline.goto(frameNum); }
  this.update = function() {
    // Update the display list to the current frame content
    this.timeline.update();
    // Now update the display list
    this.super.update();
  }
  
}