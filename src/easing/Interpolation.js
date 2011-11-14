(function(window) {
	
	// Constructor
	var Interpolation = function() {
	}
	
	// Public
	Interpolation.prototype.speed		= 0.5;
	Interpolation.prototype.spring		= 0.5;
	Interpolation.prototype.target		= 1;
	Interpolation.prototype.value		= 0;
	Interpolation.prototype.velocity	= 0;
	Interpolation.prototype.running		= false;
	
	Interpolation.prototype.start = function() {
		this.running = true;
		return this;
	}
	
	Interpolation.prototype.stop = function() {
		this.running = false;
		return this;
	}
	
	Interpolation.prototype.update = function() {
		if( !this.running ) return this;
		this.velocity = ((this.target - this.value) * this.speed) + (this.velocity * this.spring);
		this.value += this.velocity;
		if( MathUtil.distance( this.value, this.target ) < 0.1 && MathUtil.roundTo( this.velocity, 10 ) < 0.1) {
			this.velocity = 0;
			this.value = this.target;
			this.stop();
		}
		return this;
	}
	
	window.Interpolation = Interpolation;
}(window));