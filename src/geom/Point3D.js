(function(window) {

	// Constructor
	var Point3D = function( px, py, pz ) {
		this.x = px ? px : 0;
		this.y = py ? py : 0;
		this.z = pz ? pz : 0;
	}

	// Public
	Point3D.prototype = {
		"distanceTo": function( point3D ) {
			return MathUtil.distance3D( this, point3D );
		},
		
		"update": function( px, py, pz ) {
			this.x = px;
			this.y = py;
			this.z = pz;
			return this;
		}
	};

	window.Point3D = Point3D;

}(window));