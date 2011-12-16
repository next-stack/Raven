(function(window) {
	
	var Time = Time || {};
	
	// Time
	Time.initTime = new Date();
	Time.getTimer = function() {
		return new Date() - Time.initTime;
	}
	
	Time.toString = function() {
		return '[Time]';
	}
	
	window.Time = Time;
}(window));