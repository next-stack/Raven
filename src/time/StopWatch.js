(function(window) {
	
	// Constructor
	var StopWatch = function() {
	}
	
	// Public
	StopWatch.prototype.initTime = 0;
	StopWatch.prototype.endTime = 0;
	StopWatch.prototype.lastLap = 0;
	StopWatch.prototype.ms = 0;
	
	StopWatch.prototype.start = function() {
		initTime = getTimer();
		lastLap = initTime;
		read();
		return this;
	}
	
	StopWatch.prototype.stop = function() {
		endTime = getTimer();
		ms = endTime - initTime;
		return this;
	}
	
	StopWatch.prototype.read = function() {
		var now:Number = getTimer();
		return now - initTime;
	}
	
	StopWatch.prototype.lap = function() {
		var now = getTimer();
		ms = now - lastLap;
		lastLap = now;
		return ms;
	}
	
	window.StopWatch = StopWatch;
}(window));