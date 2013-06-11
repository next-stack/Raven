/**
 * Helper for returning Bezier point info.
 */
function Cubic() {
  
  var c0X = 0;
  var c1X = 0;
  var c2X = 0;
  var c3X = 0;
  var c0Y = 0;
  var c1Y = 0;
  var c2Y = 0;
  var c3Y = 0;
  var count = 0;
  
  this.reset = function() {
    c0X = 0;
    c1X = 0;
    c2X = 0;
    c3X = 0;
    c0Y = 0;
    c1Y = 0;
    c2Y = 0;
    c3Y = 0;
    count = 0;
  }
  
  this.addCoef = function(cx, cy) {
    if(count == 4) return this;
    
    switch(count) {
      case 0:
        c0X = cx;
        c0Y = cy;
      break;
      
      case 1:
        c1X = cx;
        c1Y = cy;
      break;
      
      case 2:
        c2X = cx;
        c2Y = cy;
      break;
      
      case 3:
        c3X = cx;
        c3Y = cy;
      break;
    }
    
    ++count;
    return this;
  }
  
  this.getCoef = function(index) {
    var coef = new Raven.Vec2(0, 0);
    switch(index) {
      case 0:
        coef.x = c0X;
        coef.y = c0Y;
      break;
      
      case 1:
        coef.x = c1X;
        coef.y = c1Y;
      break;
      
      case 2:
        coef.x = c2X;
        coef.y = c2Y;
      break;
      
      case 3:
        coef.x = c3X;
        coef.y = c3Y;
      break;
    }
    return coef;
  }
  
  this.getX = function(percent) {
    return c0X + percent*(c1X + percent*(c2X + percent*(c3X)));
  }
  
  this.getY = function(percent) {
    return c0Y + percent*(c1Y + percent*(c2Y + percent*(c3Y)));
  }
  
  return this;
}

/**
 * Bezier math stuff
 */
function Bezier() {
  var _this = this;
  
  // The bezier control points, set to a linear ease by default
  this.control0 = new Raven.Vec2(0.00, 0.00);
  this.control1 = new Raven.Vec2(0.33, 0.33);
  this.control2 = new Raven.Vec2(0.67, 0.67);
  this.control3 = new Raven.Vec2(1.00, 1.00);
  
  var coef = new Raven.Cubic();
  var invalidate = true;
  
  this.setControlPoint = function(num, cx, cy) {
    switch(num) {
      case 0:
        this.control0.set(cx, cy);
      break;
      case 1:
        this.control1.set(cx, cy);
      break;
      case 2:
        this.control2.set(cx, cy);
      break;
      case 3:
        this.control3.set(cx, cy);
      break;
    }
  }
  
  /**
   * Resets the control points to a linear ease.
   */
  this.reset = function() {
    this.control0 = new Raven.Vec2(0.00, 0.00);
    this.control1 = new Raven.Vec2(0.33, 0.33);
    this.control2 = new Raven.Vec2(0.67, 0.67);
    this.control3 = new Raven.Vec2(1.00, 1.00);
    invalidate = true;
    return this;
  }
  
  this.computeCoef = function() {
    coef.reset();
    coef.addCoef(this.control0.x, this.control0.y);
    
    var a0 = this.control1.subtract(this.control0).multiplyN(3);
    coef.addCoef(a0.x, a0.y);
    
    var b0 = this.control2.subtract(this.control1).multiplyN(3).subtract(a0);
    coef.addCoef(b0.x, b0.y);
    
    var c0 = this.control3.subtract(this.control0).subtract(a0).subtract(b0);
    coef.addCoef(c0.x, c0.y);
    
    invalidate = false;
  }
  
  this.getX = function(percent) {
    if(invalidate) this.computeCoef();
    return coef.getX(percent);
  }
  
  this.getY = function(percent) {
    if(invalidate) this.computeCoef();
    return coef.getY(percent);
  }
  
  /**
  * Returns the scaled bezier value at the desired percent of time.
  */
  this.getValue = function(percent) {
    if(invalidate) this.computeCoef();
    
    // this is written out in individual steps for clarity
    var c0  = coef.getCoef(0);
    var c1  = coef.getCoef(1);
    var c2  = coef.getCoef(2);
    var c3  = coef.getCoef(3);
    var c0X = c0.x;
    var c1X = c1.x;
    var c2X = c2.x;
    var c3X = c3.x;

    // Find one root - any root - then factor out (t-r) to get a quadratic poly. for the remaining roots
    var f = function(t) { return t*(c1X + t*(c2X + t*(c3X))) + c0X-percent; }
    var root = findRoot(0, 1, f, 50, 0.0000001);
    // t = root
    // y = getY(t0)
    return this.getY(root);
  }
  
  function findRoot(_x0, _x2, _f, _imax, _eps) {
    if(_imax == null) _imax = 50;
    if(_eps  == null) _eps  = 0.0000001;
    var x0 = 0;
    var x1 = 0;
    var x2 = 0;
    var y0 = 0;
    var y1 = 0;
    var y2 = 0;
    var b = 0;
    var c = 0;
    var y10 = 0;
    var y20 = 0;
    var y21 = 0;
    var xm = 0;
    var ym = 0;
    var temp = 0;

    var xmlast = _x0;
    y0         = _f(_x0);

    if(y0 == 0.0) return _x0;

    y2 = _f(_x2);
    if(y2 == 0.0) return _x2;

    if(y2*y0 > 0.0) return _x0;

    x0     = _x0;
    x2     = _x2;
    for(var i = 0; i < _imax; ++i) {

      x1 = 0.5 * (x2 + x0);
      y1 = _f(x1);
      if(y1 == 0.0) return x1;

      if(Math.abs(x1 - x0) < _eps) return x1;

      if(y1*y0 > 0.0) {
        temp = x0;
        x0   = x2;
        x2   = temp;
        temp = y0;
        y0   = y2;
        y2   = temp;
      }

      y10 = y1 - y0;
      y21 = y2 - y1;
      y20 = y2 - y0;

      if(y2 * y20 < 2.0 * y1 * y10) {
        x2 = x1;
        y2 = y1;
      } else {

        b  = (x1  - x0 ) / y10;
        c  = (y10 - y21) / (y21 * y20);
        xm = x0 - b*y0*(1.0 - c*y1);
        ym = _f(xm);

        if( ym == 0.0 ) return xm;

        if( Math.abs(xm - xmlast) < _eps ) return xm;

        xmlast = xm;
        if( ym*y0 < 0.0 ) {
          x2 = xm;
          y2 = ym;
        } else {
          x0 = xm;
          y0 = ym;
          x2 = x1;
          y2 = y1;
        }
      }
    }
    return x1;
  }
  
  return this;
}

/**
 * An instance that receives bezier points to return it's value by time.
 */
function BezierTween() {
  
  var bezier = new Bezier();
  bezier.reset(); // Linear
  
  /**
   * Resets the tween to be linear.
   * @return (Raven.KeyframeTween)
   */
  this.reset = function() {
    bezier.reset();
    return this;
  }
  
  /**
   * The bezier control points of the tween.
   * @param c0x (Number) The first control point X position.
   * @param c0y (Number) The first control point Y position.
   * @param c1x (Number) The second control point X position.
   * @param c1y (Number) The second control point Y position.
   * @param c2x (Number) The third control point X position.
   * @param c2y (Number) The third control point Y position.
   * @param c3x (Number) The fourth control point X position.
   * @param c3y (Number) The fourth control point Y position.
   * @return (Raven.KeyframeTween)
   */
  this.setEase = function(c0x, c0y, c1x, c1y, c2x, c2y, c3x, c3y) {
    bezier.setControlPoint(0, c0x, c0y);
    bezier.setControlPoint(1, c1x, c1y);
    bezier.setControlPoint(2, c2x, c2y);
    bezier.setControlPoint(3, c3x, c3y);
    return this;
  }
  
  this.setProps = function(points) {
    bezier.setControlPoint(0, Number(points[0]["-x"]), Number(points[0]["-y"]));
    bezier.setControlPoint(1, Number(points[1]["-x"]), Number(points[1]["-y"]));
    bezier.setControlPoint(2, Number(points[2]["-x"]), Number(points[2]["-y"]));
    bezier.setControlPoint(3, Number(points[3]["-x"]), Number(points[3]["-y"]));
  }
  
  /**
   * The tween-ease value designated by the offset ratio.
   * @param time (Number) Frame offset ratio ranging from 0-1.
   * @return (Number)
   */
  this.getValue = function(time) {
    return bezier.getValue(time);
  }
}

/**
 * A Display Object that occupies visible space.
 */
function Animatable() {
  
  this.matrix = {
    a:  1,
    b:  0,
    c:  0,
    d:  0,
    tx: 0,
    ty: 0
  };
  
  this.rotationX = 0;
  this.rotationY = 0;
  this.rotationZ = 0;
  this.x = 0;
  this.y = 0;
  this.z = 0;
  
  this.width  = 0;
  this.height = 0;
  this.depth  = 0;
  
  // allow for the parameters min/max to be out of order
  function range(n1, n2, percent) {
    var diff = n2 - n1;
    diff *= percent;
    return diff + n1;
  }
  
  // Set the display object's properties from this instance's properties.
  this.extendTo = function(displayObject) {
    // Matrix
    displayObject.matrix.a  = this.matrix.a;
    displayObject.matrix.b  = this.matrix.b;
    displayObject.matrix.c  = this.matrix.c;
    displayObject.matrix.d  = this.matrix.d;
    displayObject.matrix.tx = this.matrix.tx;
    displayObject.matrix.ty = this.matrix.ty;
    
    // Position
    displayObject.pos.x = this.x;
    displayObject.pos.y = this.y;
    displayObject.pos.z = this.z;
    
    // Rotation
    displayObject.rotation.x = this.rotationX;
    displayObject.rotation.y = this.rotationY;
    displayObject.rotation.z = this.rotationZ;
    
    // Size
    displayObject.size.x = this.width;
    displayObject.size.y = this.height;
    displayObject.size.z = this.depth;
    
    // Transform
    displayObject.anchor.x = this.transformX;
    displayObject.anchor.y = this.transformY;
    displayObject.anchor.z = this.transformZ;
    
    return displayObject;
  }
  
  // 
  this.interpolate = function(currentElement, nextElement, percent) {
    var animation = new Animatable();
    animation.matrix.a  = range(currentElement.matrix.a,  nextElement.matrix.a,  percent);
    animation.matrix.b  = range(currentElement.matrix.b,  nextElement.matrix.b,  percent);
    animation.matrix.c  = range(currentElement.matrix.c,  nextElement.matrix.c,  percent);
    animation.matrix.d  = range(currentElement.matrix.d,  nextElement.matrix.d,  percent);
    animation.matrix.tx = range(currentElement.matrix.tx, nextElement.matrix.tx, percent);
    animation.matrix.ty = range(currentElement.matrix.ty, nextElement.matrix.ty, percent);
    
    animation.rotationX  = range(currentElement.rotationX, nextElement.rotationX, percent);
    animation.rotationY  = range(currentElement.rotationY, nextElement.rotationY, percent);
    animation.rotationZ  = range(currentElement.rotationZ, nextElement.rotationZ, percent);
    animation.x          = range(currentElement.x, nextElement.x, percent);
    animation.y          = range(currentElement.y, nextElement.y, percent);
    animation.z          = range(currentElement.z, nextElement.z, percent);
    animation.width      = range(currentElement.width,  nextElement.width,  percent);
    animation.height     = range(currentElement.height, nextElement.height, percent);
    animation.depth      = range(currentElement.depth,  nextElement.depth,  percent);
    animation.transformX = range(currentElement.transformX, nextElement.transformX, percent);
    animation.transformY = range(currentElement.transformY, nextElement.transformY, percent);
    animation.transformZ = range(currentElement.transformZ, nextElement.transformZ, percent);
    return animation;
  }
  
}

/**
 * A keyframe instance that can handle controlling a Display Object.
 */
function Keyframe(num, duration) {
	
	this.aniProps = null; // instance to store the tweening interpolation between frames
	this.tween = null;   // bezier curve to extract the value to use as a time offset
	this.type = 0; // 0 = none, 1 = bezier
	this.name = "";
	this.script = "";
	
	this.index = num ? num : 0; // start frame
	this.duration = duration ? duration : 0; // end frame
	
	this.addProps = function(props) {
	  this.aniProps = new Animatable();
	  this.aniProps.matrix.a  = Number(props.matrix.a);
	  this.aniProps.matrix.b  = Number(props.matrix.b);
	  this.aniProps.matrix.c  = Number(props.matrix.c);
	  this.aniProps.matrix.d  = Number(props.matrix.d);
	  this.aniProps.matrix.tx = Number(props.matrix.tx);
	  this.aniProps.matrix.ty = Number(props.matrix.ty);
	  
	  this.aniProps.rotationX = Number(props.rotationX);
	  this.aniProps.rotationY = Number(props.rotationY);
	  this.aniProps.rotationZ = Number(props.rotationZ);
	  this.aniProps.transformX = Number(props.transformX);
	  this.aniProps.transformY = Number(props.transformY);
	  this.aniProps.transformZ = Number(props.transformZ);
	  this.aniProps.x = Number(props.x);
	  this.aniProps.y = Number(props.y);
	  this.aniProps.z = Number(props.z);
	}
	
	this.addEase = function(eases) {
  	this.tween = new BezierTween();
  	this.tween.setProps(eases.point);
  	this.type = 1;
	}
	
	this.getTweenValue = function(time) {
	  if(this.tween == null) return 0;
	  return this.tween.getValue(time);
	}
	
	this.endFrame = function() {
	  return this.index + this.duration;
	}
	
	this.between = function(currentFrame) {
	  return currentFrame >= this.index && currentFrame < this.endFrame();
	}
	
	this.currentTime = function(currentFrame) {
	  return (currentFrame - this.index) / this.duration;
	}
	
	this.interpolate = function(currentElement, nextElement, percent) {
	  if(percent == 0) return currentElement;
	  if(percent == 1) return nextElement;
	  var props = new Animatable();
	  return props.interpolate(currentElement, nextElement, this.getTweenValue(percent));
  }
	
}

function Layer() {
  
  var _this = this;
  
  this.index = 0;
  this.name = "";
  this.props = null;
  this.displayObject = null;
  //this.props = new Animatable();
  this.keyframes = [];
  
  function currentKeyframe(currentFrame) {
    var totalFrames = _this.keyframes.length;
    for(var i = 0; i < totalFrames; ++i) {
      if(_this.keyframes[i].between(currentFrame)) return i;
    }
    return -1;
  }
  
  function nextKeyframe(currentFrame) {
    var totalFrames = _this.keyframes.length;
    for(var i = 0; i < totalFrames; ++i) {
      if(_this.keyframes[i].between(currentFrame) && i < totalFrames-1) return i+1;
    }
    return -1;
  }
  
  this.addDisplay = function(displayObject) {
    this.displayObject = displayObject;
  }
  
  this.updateDisplay = function() {
    if(!this.displayObject) return;
    this.displayObject.setFromAni(this.props);
  }
  
  this.addLayerByProps = function(layerProps) {
    this.name = layerProps['-name'];
    if(layerProps.frame.length) {
      var totalFrames = layerProps.frame.length;
      for(var n = 0; n < totalFrames; ++n) {
        this.addKeyframe(layerProps.frame[n]);
      }
    } else {
      this.addKeyframe(layerProps.frame);
    }
  }
  
  this.addKeyframe = function(frameObj) {
    var num = Number(frameObj['-num']);
    var duration = Number(frameObj['-duration']);
    
    var newFrame = new Keyframe(num, duration);
    if(frameObj["-name"] != undefined) newFrame.name = frameObj["-name"];
    if(frameObj["script"] != undefined) newFrame.script = frameObj["script"];
    if(frameObj["element"] != undefined) {
      newFrame.addProps(frameObj.element);
      if(frameObj["timeline"]) {
        this.displayObject = new MovieClip();
        this.displayObject.timeline.setTimeline(frameObj["timeline"]);
      } else {
        this.displayObject = new DisplayObject();
      }
    }
    if(frameObj["ease"] != undefined) newFrame.addEase(frameObj.ease);
    this.keyframes.push(newFrame);
  }
  
  this.update = function(currentFrame) {
    var currentProps = currentKeyframe(currentFrame);
    var nextProps = nextKeyframe(currentFrame);
    
    if(currentProps > -1 && nextProps > -1) {
      var curProps = this.keyframes[currentProps];
      var nxtProps = this.keyframes[nextProps];
      
      if(curProps.aniProps != undefined && nxtProps.aniProps != undefined) {
        
        this.curFrame = currentFrame;
        this.curTime = curProps.currentTime(currentFrame);
        this.focus0 = curProps;
        this.focus1 = nxtProps;
        
        if(curProps.type == 0) {
          this.props = curProps.aniProps;
        } else {
          var time = curProps.currentTime(currentFrame);
          this.props = curProps.interpolate(curProps.aniProps, nxtProps.aniProps, curProps.getTweenValue(time));
        }
        
        this.updateDisplay();
      }
    }
  }
  
}

function Timeline() {
  
  var _this = this;
  
  this.loading = false;
  this.playing = true;
  this.currentFrame = 0;
  this.totalFrames  = 0;
  this.frameRate = 60;
  this.name = "Timeline 1";
  this.layers = [];
  this.totalLayers = 0;
  
  this.addLayer = function(layer) {
    layer.index = this.layers.length;
    this.layers.push(layer);
    ++this.totalLayers;
    return layer;
  }
  
  this.addLayerByProps = function(layerProps) {
    var layer = new Layer();
    layer.addLayerByProps(layerProps);
    return this.addLayer(layer);
  }
  
  this.prevFrame = function() {
    var wasPlaying = this.playing;
    this.playing = true;
    this.currentFrame -= 2;
    if(this.currentFrame < -1) this.currentFrame = this.totalFrames-2;
    this.update();
    this.playing = wasPlaying;
  }
  
  this.nextFrame = function() {
    var wasPlaying = this.playing;
    this.playing = true;
    this.update();
    this.playing = wasPlaying;
  }
  
  this.goto = function(frame) {
    var wasPlaying = this.playing;
    this.playing = true;
    this.currentFrame = frame-1;
    if(this.currentFrame < -1) this.currentFrame = this.totalFrames-2;
    if(this.currentFrame >= this.totalFrames) this.currentFrame = 0;
    this.update();
    this.playing = wasPlaying;
  }
  
  this.setPosition = function(ratio) {
    this.goto(Math.round(this.totalFrames * ratio));
  }
  
  function updateLayers(frame) {
    for(var i = 0; i < _this.totalLayers; ++i) {
      _this.layers[i].update(frame);
    }
  }
  
  this.update = function() {
    if(!this.playing) return;
    
    ++this.currentFrame;
    if(this.currentFrame >= this.totalFrames) this.currentFrame = 0;
    
    updateLayers(this.currentFrame);
  }
  
  this.setTimeline = function(tlNode) {
    this.name = tlNode["-name"]
    this.totalFrames = tlNode["-totalFrames"];
    
    if(tlNode.layer.length) {
      // Add layers
      var totalLayers = tlNode.layer.length;
      var i, n, totalFrames;
      var newFrame, currentFrame, currentLayer;
      for(i = 0; i < totalLayers; ++i) {
        this.addLayerByProps(tlNode.layer[i]);
      }
    } else {
      this.addLayerByProps(tlNode.layer);
    }
  }
  
  this.loadAnimation = function(src, type, onLoadHandler) {
    var _timeline = this;
    this.loading = true;
    $.ajax({
      url: src,
      dataType: type
    }).done(function(res){
      
      _timeline.setTimeline(res.animation.timeline);
      updateLayers(_timeline.currentFrame);
      _timeline.loading = false;
      if(onLoadHandler != null) onLoadHandler();
      
    }).fail(function(jqXHR, textStatus, errorThrown){
      console.error("Error loading animation", src, type, errorThrown);
    });
  }
  
}