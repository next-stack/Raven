(function(window) {

	// Constructor
	var Sphere = function( px, py, pz ) {
		this.x = px ? px : 0;
		this.y = py ? py : 0;
		this.z = pz ? pz : 0;
		this.rotationX = 0;
		this.rotationY = 0;
		this.rotationZ = 0;
		this.radius = 100;
		this.totalPoints = 0;
		this.points = [];
		this.name = "noName";
	}

	// Public
	Sphere.prototype = {
		"init": function() {
			for( var i = 0; i < this.totalPoints; ++i ) this.points[i] = new Point3D();
			return this.update();
		},
		
		"update": function() {
			if( this.totalPoints == 0 ) return this;
			var inc = Math.PI * ( 3 - Math.sqrt( 5 ) );
			var off = 2 / this.totalPoints;
			var y, r, phi;
			var px, py, pz;
			
			for( var i = 0; i < this.totalPoints; ++i ) {
				y = ((i * off) - 1) + (off * 0.5);
				r = Math.sqrt( 1 - y * y );
				phi = i * inc;

				py = this.y + y * this.radius;
				px = this.x + Math.cos( phi ) * r * this.radius;
				pz = this.z + Math.sin( phi ) * r * this.radius;

				this.points[i].x = px;
				this.points[i].y = py;
				this.points[i].z = pz;
				//MathUtil.rotateX( this.points[i], this.rotationX );
				//MathUtil.rotateY( this.points[i], this.rotationY );
				//MathUtil.rotateZ( this.points[i], this.rotationZ );
				CanvasUtil.drawRect( px, py, 5, 5, true, false );
			}
			return this;
		},
		
		"dispose": function() {
			for( var i = 0; i < this.totalPoints; ++i ) {
				delete this.points[i];
				this.points.slice( i, 1 );
			}
			this.points = null;
		}
	};

	window.Sphere = Sphere;

}(window));