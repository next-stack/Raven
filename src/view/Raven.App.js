var Raven = Raven || {};

/**
 * A basic app-runner for Canvas experiments.
 *
 *
 * @returns {Raven.App}
 * @constructor
 */

Raven.App = function(params) {
	var _this = this;

	// keeps the frame index
	this.frameNum		= 0;
	// fullscreens the canvas element
	this.fullscreen		= false;
	// in case you need to pause the auto-runner
	this.playing		= true;
	// start time, in millseconds
	this.startTime		= 0;
	// elapsed time, in millseconds
	this.elapsedTime    = 0;
	// for event handling
	this.supportMobile	= false;
	// View instance
	this.view			= null;
	// if the dom element is visible within the page
	this.viewable		= this.checkViewable();

	if(params !== undefined) {
		var p = params;
		this.fullscreen    = p['fullscreen'] !== undefined ? p['fullscreen'] : this.fullscreen;
		this.supportMobile = p['mobile'] !== undefined ? p['mobile'] : this.supportMobile;
	}

	// Non-extendable functions

	/**
	 * Starts requestAnimationFrame
	 */
	this.autoRender = function() {
		if(_this.playing) window.requestAnimationFrame(_this.autoRender);
		if(Raven.Ani !== undefined) Raven.Ani.update();
		if(Raven.Springy !== undefined) Raven.Springy.update();
		_this.updateHandler();
	};

	/**
	 * Updates the application settings, calls 'update', then renders the frame.
	 */
	this.updateHandler = function() {
		if(_this.view && _this.viewable) {
            _this.update();
            if(_this.checkViewable()) {
                if(_this.view.autoClear) _this.view.clear();
                _this.draw();
            }
            _this.frameNum = Raven.getFrame(_this.startTime);
            _this.elapsedTime = Date.now() - _this.startTime;
        } else if(_this.view === null) {
            _this.update();
            _this.draw();
            _this.frameNum = Raven.getFrame(_this.startTime);
            _this.elapsedTime = Date.now() - _this.startTime;
        }
	};

	/**
	 * Forward the event handler to our app
	 */
	this.domHandler = function(evt) {
		_this.evtHandler(evt);
	};

	this.startTime = Date.now();
	return this;
};

Raven.App.prototype = {
	checkViewable: function() {
		if(this.view !== null && this.view.available()) {
			var wRect = Raven.Rect(window.scrollX, window.scrollY, window.innerWidth, window.innerHeight),
			aRect = Raven.Rect().mapToDiv(this.view.element),
			result = aRect.overlap(wRect);
			return result;
		}
		return false;
	},
    pause: function() {
        this.playing = false;
    },
    play: function() {
        this.playing = true;
        this.autoRender();
    },
	enable:  function() {
		var stage = this.checkViewable();
        if(stage) {
            this.enableElement(this.view.element);
        }
		if(!Raven.isMobile) {
            Raven.watch(window, Raven.DOM.KEY_DOWN, this.domHandler);
            Raven.watch(window, Raven.DOM.KEY_UP,   this.domHandler);
		}
		Raven.watch(window, Raven.DOM.SCROLL, this.domHandler);
		if(this.fullscreen) Raven.watch(window, Raven.DOM.RESIZE, this.domHandler);
	},
	disable: function() {
		if( this.checkViewable() ) {
            this.disableElement( this.view.element );
		}
		Raven.unwatch(window, Raven.DOM.KEY_DOWN, this.domHandler);
		Raven.unwatch(window, Raven.DOM.KEY_UP,   this.domHandler);
		Raven.unwatch(window, Raven.DOM.RESIZE,   this.domHandler);
		Raven.unwatch(window, Raven.DOM.SCROLL,   this.domHandler);
	},
    enableElement: function(element) {
        if(Raven.isMobile) {
            Raven.watch(element, Raven.DOM.TOUCH_DOWN, this.domHandler);
            Raven.watch(element, Raven.DOM.TOUCH_MOVE, this.domHandler);
            Raven.watch(element, Raven.DOM.TOUCH_UP,   this.domHandler);
        } else {
            Raven.watch(element, Raven.DOM.MOUSE_DOWN, this.domHandler);
            Raven.watch(element, Raven.DOM.MOUSE_MOVE, this.domHandler);
            Raven.watch(element, Raven.DOM.MOUSE_UP,   this.domHandler);
        }
    },
    disableElement: function(element) {
        Raven.unwatch(element, Raven.DOM.TOUCH_DOWN, this.domHandler);
        Raven.unwatch(element, Raven.DOM.TOUCH_MOVE, this.domHandler);
        Raven.unwatch(element, Raven.DOM.TOUCH_UP,   this.domHandler);
        Raven.unwatch(element, Raven.DOM.MOUSE_DOWN, this.domHandler);
        Raven.unwatch(element, Raven.DOM.MOUSE_MOVE, this.domHandler);
        Raven.unwatch(element, Raven.DOM.MOUSE_UP,   this.domHandler);
    },
	setup:   function(viewElement, width, height, renderer) {
		if(viewElement && renderer !== undefined) {
			// Setup the view
            if(renderer == Raven.VIEW_WEBGL) {
                // Raven.GLView temporarily disabled
                this.fullscreen ? this.onResize(window.innerWidth, window.innerHeight) : this.onResize(width, height);
                this.enable();
                return;
                // this.view = new Raven.GLView();
            } else
                this.view = new Raven.CanvasView();
            this.view.setup(viewElement);
            this.viewable = Raven.viewable(this.view.element);
			// Resize view
			this.fullscreen ? this.onResize(window.innerWidth, window.innerHeight) : this.onResize(width, height);
			// Clear stage
			this.view.clear();
			// Draw base
			//this.draw();
		}
        // Enable events
        this.enable();
	},
	update:  function() {},
	draw:    function() {
		if(!this.viewable) return;
		var _align = this.view.align;
		this.view.align = Raven.Align.TOP_LEFT;
		this.view.setFillB(0);
        this.view.drawRect(20, 10, 140, 25, true);
		this.view.setFillB(255);
		var appTime = this.elapsedTime / 1000;
		var output = "Frame #" + this.frameNum.toString();
		output += ", Time " + appTime.toFixed(1);
		this.view.drawFont(output, 25, 25);
		this.view.drawFont(output, 25, this.view.height-25);
		this.view.align = _align;
	},
	// Handled
	onKeyDown:   function(key) {},
	onKeyUp:     function(key) {},
	onTouchDown: function(id, x, y) {},
	onTouchMove: function(id, x, y) {},
	onTouchUp:   function(id, x, y) {},
	// Handlers
	onResize:    function(w, h) {
		if(this.view && this.view.available()) this.view.resize(w, h);
	},
	onScroll:    function(evt, x, y) {},
	evtHandler:  function(evt) {
		switch(evt.type) {
			case Raven.DOM.RESIZE:
                if(this.view) this.viewable = Raven.viewable( this.view.element );
				this.onResize( window.innerWidth, window.innerHeight );
				Raven.dispatchEvent( new Raven.Event(Raven.Event.RESIZE) );
			break;
			case Raven.DOM.KEY_DOWN:
				this.onKeyDown( Key.getKey(evt.keyCode) );
			break;
			case Raven.DOM.KEY_UP:
				this.onKeyUp( Key.getKey(evt.keyCode) );
			break;
			case Raven.DOM.MOUSE_DOWN:
				this.onTouchDown( 0, evt.x, evt.y );
				Raven.dispatchEvent( new Raven.ActionEvent(Raven.ActionEvent.DOWN, evt.x, evt.y) );
			break;
			case Raven.DOM.MOUSE_MOVE:
				this.onTouchMove( 0, evt.x, evt.y );
				Raven.dispatchEvent( new Raven.ActionEvent(Raven.ActionEvent.MOVE, evt.x, evt.y) );
			break;
			case Raven.DOM.MOUSE_UP:
				this.onTouchUp( 0, evt.x, evt.y );
				Raven.dispatchEvent( new Raven.ActionEvent(Raven.ActionEvent.UP, evt.x, evt.y) );
			break;
            case Raven.DOM.SCROLL:
                this.viewable = this.viewable ? Raven.viewable( this.view.element ) : false;
                var x = 0, y = 0;
                if(this.viewable) {
                	x = this.view.element.offsetLeft;
                	y = this.view.element.offsetTop;
                } else {
                	x = window.scrollX;
                	y = window.scrollY;
                }
                this.onScroll( evt, x, y );
                Raven.dispatchEvent( new Raven.ActionEvent(Raven.ActionEvent.SCROLLED, x, y) );
            break;
            case Raven.DOM.TOUCH_DOWN:
            	var i, x, y, touches = evt.targetTouches, total = touches.length;
				for(i = 0; i < total; ++i) {
					x = touches[i].clientX;
					y = touches[i].clientY;
					this.onTouchDown( touches[i].identifier, x, y );
					Raven.dispatchEvent( new Raven.ActionEvent(Raven.ActionEvent.DOWN, x, y, touches[i].identifier) );
				}
				touches = null;
            break;
            case Raven.DOM.TOUCH_MOVE:
            	var i, x, y, touches = evt.targetTouches, total = touches.length;
				for(i = 0; i < total; ++i) {
					x = touches[i].clientX;
					y = touches[i].clientY;
					this.onTouchMove( touches[i].identifier, touches[i].clientX, touches[i].clientY );
					Raven.dispatchEvent( new Raven.ActionEvent(Raven.ActionEvent.MOVE, x, y, touches[i].identifier) );
				}
				touches = null;
            break;
            case Raven.DOM.TOUCH_UP:
            	var i, x, y, touches = evt.targetTouches, total = touches.length;
				for(i = 0; i < total; ++i) {
					x = touches[i].clientX;
					y = touches[i].clientY;
					this.onTouchUp( touches[i].identifier, touches[i].clientX, touches[i].clientY );
					Raven.dispatchEvent( new Raven.ActionEvent(Raven.ActionEvent.UP, x, y, touches[i].identifier) );
				}
				touches = null;
            break;
		}
	}
};
