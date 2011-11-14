(function(window) {
	
	// Event types
	var NavEvent = function() {}
	NavEvent.UPDATE = "NavEvent.update";
	NavEvent.ENABLE = "NavEvent.enable";
	NavEvent.DISABLE = "NavEvent.disable";
	
	window.NavEvent = NavEvent;
}(window));