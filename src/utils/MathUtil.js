(function(window) {
	
	var MathUtil = MathUtil || {};
	
	// Constants
	MathUtil.DEGREES = 180/Math.PI;
	MathUtil.RADIANS = Math.PI/180;
	
	/**
	 * A number in between 2 numbers at a specific percent.
	 * @param - Number - n1 - First number.
	 * @param - Number - n2 - Second number.
	 * @param - Number - percent - A number ranging from 0 to 1.
	 * @returns Number
	 */
	MathUtil.range = function( n1, n2, percent ) {
		var min  = Math.min( n1, n2 );
		var max  = Math.max( n1, n2 );
		var diff = max - min;
		diff *= percent;
		return diff + min;
	}

	/**
	 * A random number in between 2 numbers.
	 * @param - Number - n1 - First number.
	 * @param - Number - n2 - Second number.
	 * @returns Number
	 */
	MathUtil.randRange = function( min, max ) {
		return MathUtil.range( min, max, Math.round( MathUtil.roundTo( MathUtil.HUNDREDTHS ) ) );
	}

	/**
	 * Limits your floating variable to tenths, hundredths, thousandths, etc.
	 * @param - Number - value - Number - The number you want to round.
	 * @param - Number - type - The delimiter type to return. 10 for tenths, 100 for hundredths, etc.
	 * @returns Number
	 */
	MathUtil.roundTo = function( value, type ) {
		return Math.round( type * value ) * ( 1 / type );
	}

	// Trigonometry methods
	/**
	 * An angle between 0 - 360.
	 * @param - Number - angle - The angle you want to resolve.
	 * @returns Number
	 */
	MathUtil.resolveAngle = function( angle ) {
		var mod = angle % 360;
		return mod < 0 ? 360 + mod : mod;
	}

	/**
	 * Converts angle to radian
	 * @param - Number - degrees - The degrees you want to resolve.
	 * @returns Number
	 */
	MathUtil.degreesToRadians = function( degrees ) {
		return MathUtil.resolveAngle( degrees ) * MathUtil.RADIANS;
	}

	/**
	 * Converts radians to degrees
	 * @param - Number - radians - Number - The radians you want as degrees.
	 * @returns Number
	 */
	MathUtil.radiansToDegrees = function( radians ) {
		return MathUtil.resolveAngle( radians * MathUtil.DEGREES );
  }
  
  /**
   * The angle from two points.
   * @param p1 - Object - An object with "x" and "y" variables.
   * @param p2 - Object - An object with "x" and "y" variables.
   * @returns Number
  */
  MathUtil.getAngleRad = function (p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
  }

	/**
	 * The angle from two points.
	 * @param p1 - Object - An object with "x" and "y" variables.
	 * @param p2 - Object - An object with "x" and "y" variables.
	 * @returns Number
	 */
	MathUtil.getAngleDeg = function( p1, p2 ) {
		return MathUtil.radiansToDegrees(MathUtil.getAngleRad( p1, p2 ));
  }

	/**
	 * The radians from two points.
	 * @param p1 - Object - An object with "x" and "y" variables.
	 * @param p2 - Object - An object with "x" and "y" variables.
	 * @returns Number
	 */
	MathUtil.getRadian = function( p1, p2 ) {
		return MathUtil.degreesToRadians( MathUtil.getAngle( p1, p2 ) );
	}

	/**
	 * The distance between two numbers.
	 * @param - Number - n1 - First number.
	 * @param - Number - n2 - Second number.
	 * @returns Number
	 */
	MathUtil.distance = function( n1, n2 ) {
		var dist = n1 - n2;
		return Math.sqrt( dist * dist );
	}

	/**
	 * The distance between two points.
	 * @param p1 - Object - An object with "x" and "y" variables.
	 * @param p2 - Object - An object with "x" and "y" variables.
	 * @returns Number
	 */
	MathUtil.distance2D = function( p1, p2 ) {
		return MathUtil.distance( p1.x, p2.x ) + MathUtil.distance( p1.y, p2.y );
	}

	/**
	 * The distance between two 3D points.
	 * @param p1 - Object - An object with "x", "y", and "z" variables.
	 * @param p2 - Object - An object with "x", "y", and "z" variables.
	 * @returns Number
	 */
	MathUtil.distance3D = function( p1, p2 ) {
		return MathUtil.distance( p1.x, p2.x ) + MathUtil.distance( p1.y, p2.y ) + MathUtil.distance( p1.z, p2.z );
	}
	
	/**
	 * Rotates an object cylindrically around it's current X-orietnation point.
	 * @param point - Object - An object with "x", "y", and "z" variables.
	 * @param rotation - Number - The angle to rotate around. Ranges from 0 to 360.
	 * @returns Object
	 */
	MathUtil.rotateX = function( point, rotation ){
		var ang = MathUtil.degreesToRadians( rotation );
		var rotated = { x: point.x, y: point.y, z: point.z };
		var cosRY = Math.cos(ang);
		var sinRY = Math.sin(ang);
		point.y = MathUtil.roundTo( (rotated.y*cosRY)-(rotated.z*sinRY), 100 );
		point.z = MathUtil.roundTo( (rotated.y*sinRY)+(rotated.z*cosRY), 100 );
		delete rotated;
		return point;
	}
	
	/**
	 * Rotates an object cylindrically around it's current Y-orietnation point.
	 * @param point - Object - An object with "x", "y", and "z" variables.
	 * @param rotation - Number - The angle to rotate around. Ranges from 0 to 360.
	 * @returns Object
	 */
	MathUtil.rotateY = function( point, rotation ) {
		var ang = MathUtil.degreesToRadians( rotation );
		var rotated = { x: point.x, y: point.y, z: point.z };
		var cosRY = Math.cos(ang);
		var sinRY = Math.sin(ang);
		point.x = MathUtil.roundTo( (rotated.x*cosRY)-(rotated.z*sinRY), 100 );
		point.z = MathUtil.roundTo( (rotated.x*sinRY)+(rotated.z*cosRY), 100 );
		delete rotated;
		return point;
	}
	
	/**
	 * Rotates an object cylindrically around it's current Z-orietnation point.
	 * @param point - Object - An object with "x", "y", and "z" variables.
	 * @param rotation - Number - The angle to rotate around. Ranges from 0 to 360.
	 * @returns Object
	 */
	MathUtil.rotateZ = function( point, rotation ){
		var ang = MathUtil.degreesToRadians( rotation );
		var rotated = { x: point.x, y: point.y, z: point.z };
		var cosRY = Math.cos(ang);
		var sinRY = Math.sin(ang);
		point.x = MathUtil.roundTo( (rotated.x*cosRY)-(rotated.y*sinRY), 100 );
		point.z = MathUtil.roundTo( (rotated.x*sinRY)+(rotated.y*cosRY), 100 );
		delete rotated;
		return point;
	}
	
	/**
	 * Creates a new 2D point based on the specified point's position relative to the stage's size.
	 * @param point3D - Object - An object with "x", "y", and "z" variables.
	 * @returns Object
	 */
	MathUtil.obj3Dto2D = function( point3D ) {
		var point2D = {};
		point2D.x = point3D.x + View.width  * 0.5;
		point2D.y = point3D.y + View.height * 0.5;
		return point2D;
	}
	
	window.MathUtil = MathUtil;
}(window));