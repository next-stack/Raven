var App = function () {

  // Public vars
  App.prototype.backgroundColor = "#000";
  App.prototype.frameNum = 0;
  App.prototype.frameRate = 60;
	App.prototype.mouseDown = false;
	App.prototype.mouseX = 0;
	App.prototype.mouseY = 0;

  // Navigator props
  App.prototype.browserName = navigator.appName;
  App.prototype.browserCodeName = navigator.appCodeName;
  App.prototype.browserVersion = navigator.appVersion;
  App.prototype.cookieEnabled = navigator.cookieEnabled;
  App.prototype.platform = navigator.platform;

  // Screen props
  App.prototype.screenHeight = screen.height;
  App.prototype.screenWidth = screen.width;
	
	// Touch props
	App.prototype.touches = [];
	App.prototype.totalTouches = 0;

  // Window props
  App.prototype.windowWidth = window.innerWidth;
  App.prototype.windowHeight = window.innerHeight;
  App.prototype.windowX = window.screenX;
  App.prototype.windowY = window.screenY;

  // Referenced so the sub class receives the event first, then the super class (this)
  var sender;
  var timer = 0;
  function beginTimer() {
    timer = setInterval(onTick, 1000 / this.frameRate);
  }

  function endTimer() {
    clearInterval(timer);
  }

  function onTick() {
    sender.update();
    sender.draw();
		++App.prototype.frameNum;
  }

  /**************************************************
  * Core methods
  **************************************************/

  App.prototype.setup = function () {
    sender = this;
    View.canvas = document.getElementById('world');
    if (View.canvas && View.canvas.getContext) {
      // Set up View
      View.context = View.canvas.getContext('2d');
      View.size(window.innerWidth, window.innerHeight);
			
      // Mouse Events
			document.addEventListener('mousedown', function(event) {
				sender.onMouseDown(event);
			}, false);
			document.addEventListener('mouseup', function(event) {
				sender.onMouseUp(event);
			}, false);
			document.addEventListener('mousemove', function(event) {
				sender.onMouseMove(event);
			}, false);
			
      // Touch Begin
      View.canvas.addEventListener('touchstart', function (event) {
        event.preventDefault();
        sender.onTouchDown(event);
      }, false);
			
      // Touch Move
      View.canvas.addEventListener('touchmove', function (event) {
        event.preventDefault();
        sender.onTouchDrag(event);
      }, false);
			
      // Touch End
      View.canvas.addEventListener('touchend', function (event) {
        event.preventDefault();
        sender.onTouchUp(event);
      }, false);
			
      // Window resize
      window.addEventListener('resize', function () {
        sender.onResize();
      }, false);
			
			// Window rotation
			if( window.DeviceOrientationEvent ) {
				window.addEventListener('deviceorientation', function(event) {
					sender.onGyro(event);
				}, false);
			}
			
			// Window acceleration
			if( window.DeviceMotionEvent ) {
				window.addEventListener('devicemotion', function(event) {
					sender.onAcceleration(event);
				}, false);
			}
			
    }

    sender.onResize();
    return this;
  }

  App.prototype.update = function () {
    DateUtil.update();
    return this;
  }

  App.prototype.draw = function () {
    View.clearBackground(this.backgroundColor);
    return this;
  }

  App.prototype.start = function () {
    beginTimer.call(this);
    return this;
  }

  App.prototype.stop = function () {
    endTimer.call(this);
    return this;
  }

  /**************************************************
  * Event handlers
  **************************************************/

  App.prototype.onResize = function () {
    View.size(window.innerWidth, window.innerHeight);
    App.prototype.windowWidth = View.width;
    App.prototype.windowHeight = View.height;
    View.clearBackground(this.backgroundColor);
    return this;
  }

	App.prototype.onMouseDown = function(event) {
		App.prototype.mouseDown = true;
		return this;
	}
	
	App.prototype.onMouseUp = function(event) {
		App.prototype.mouseDown = false;
		return this;
	}
	
	App.prototype.onMouseMove = function(event) {
		App.prototype.mouseX = event.clientX;
		App.prototype.mouseY = event.clientY;
		return this;
	}

  /**************************************************
  * Touch events
  **************************************************/

  App.prototype.onTouchDown = function (event) {
		addTouchPoints(event);
    return this;
  }

  App.prototype.onTouchUp = function (event) {
    addTouchPoints(event);
    return this;
  }

  App.prototype.onTouchDrag = function (event) {
		addTouchPoints(event);
    return this;
  }
	
	function addTouchPoints(event) {
		var newPoint;
		App.prototype.touches = [];
		App.prototype.totalTouches = event.targetTouches.length;
		for( var i = 0; i < App.prototype.totalTouches; ++i ) {
			newPoint = {};
			newPoint.id = event.targetTouches[i].identifier;
			newPoint.x = event.targetTouches[i].clientX;
			newPoint.y = event.targetTouches[i].clientY;
			App.prototype.touches[i] = newPoint;
		}
	}
	
	App.prototype.onAcceleration = function(event) {
		var acceleration = event.accelerationIncludingGravity;
		if( acceleration.x ) {
			// 9.81 = force of gravity
			View.accelerationX = MathUtil.roundTo( acceleration.x / 9.81, 100 );
			View.accelerationY = MathUtil.roundTo( acceleration.y / 9.81, 100 );
			View.accelerationZ = MathUtil.roundTo( acceleration.z / 9.81, 100 );
		}
	}
	
	App.prototype.onGyro = function(event) {
		View.rotationX = MathUtil.roundTo( event.beta,  100 );
		View.rotationY = MathUtil.roundTo( event.alpha, 100 );
		View.rotationZ = MathUtil.roundTo( event.gamma, 100 );
	}

  return this;
}
