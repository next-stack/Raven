(function(window) {

	// Constructor
	var Interpolation = function() {
		this.speed = 0.5;
		this.spring = 0.5;
		this.target = 1;
		this.value = 0;
		this.velocity = 0;
		this.running = false;
	}

	// Public
	Interpolation.prototype = {

		"start": function() {
			this.running = true;
			return this;
		},

		"stop": function() {
			this.running = false;
			return this;
		},

		"update": function() {
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
	};

	window.Interpolation = Interpolation;

}(window));