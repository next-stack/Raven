Raven.Spritesheet = function(src, totalFrames, frameRate, loop) {
  this.constructor.name = "Raven.Spritesheet";
  
  var _this = this;
  
  this.frameRate = frameRate != null ? frameRate : 60;
  this.currentFrame = 0;
  this.totalFrames = totalFrames;
  this.loop = loop == null ? true : loop;
  this.columns = totalFrames < 6 ? totalFrames : 6;
  this.loaded = false;
  this.onLoad = null;
  
  this.viewWidth = 0;
  this.viewHeight = 0;
  this.scaleX = 1;
  this.scaleY = 1;
  
  this.img = new Image();
  this.img.onload = function() {
    _this.loaded = true;
    
    var rows = Math.ceil(_this.totalFrames / _this.columns);
    _this.viewWidth  = Math.floor(this.width / _this.columns);
    _this.viewHeight = Math.floor(this.height / rows);
    if(this.onLoad != null) this.onLoad(this);
  }
  
  this.img.src = src;
  
  this.update = function(appCurrentFrame, appFrameRate) {
    if(appCurrentFrame % Math.floor(appFrameRate / this.frameRate) == 0) {
      var next = this.currentFrame + 1;
      if(this.loop) {
        this.currentFrame = next;
      } else {
        if(next < this.totalFrames) ++this.currentFrame;
      }
    }
  }
  
  this.render = function(renderer, pos) {
    if(!this.loaded) return this;
    
    var cur = this.currentFrame % this.totalFrames;
    var xOffset = (cur % this.columns) * this.viewWidth;
    var yOffset = Math.floor(cur / this.columns) * this.viewHeight;
    renderer.context.drawImage(this.img, xOffset, yOffset, this.viewWidth, this.viewHeight, pos.x, pos.y, this.viewWidth, this.viewHeight);
  }
  return this;
}
