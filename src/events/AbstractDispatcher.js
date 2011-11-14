(function(window) {
	
	var _dispatcher = new EventDispatcher();
	
	// Singleton constructor
	var AbstractDispatcher = function() {}
	
	AbstractDispatcher.addEventListener = function( type, listener ) {
		return _dispatcher.addEventListener( type, listener );
	}
	
	AbstractDispatcher.hasEventListener = function( type ) {
		return _dispatcher.hasEventListener( type );
	}
	
	AbstractDispatcher.removeEventListener = function( type, listener ) {
		return _dispatcher.removeEventListener( type, listener );
	}
	
	AbstractDispatcher.dispatchEvent = function( type, args ) {
		return _dispatcher.dispatchEvent( type, args );
	}
	
	AbstractDispatcher.toString = function( type, args ) {
		return '[AbstractDispatcher]';
	}
	
	window.AbstractDispatcher = AbstractDispatcher;
}(window));