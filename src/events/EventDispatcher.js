(function(window) {
	
	// Constructor
	var EventDispatcher = function() {}
	
	EventDispatcher.prototype.buildListenerChain = function() {
		if( !this.listenerChain ) this.listenerChain = {};
	}
	
	EventDispatcher.prototype.addEventListener = function( type, listener ) {
		if( !listener instanceof Function ) throw { message: "Listener isn't a function" };
		this.buildListenerChain();
		if( !this.listenerChain[type] ) {
			this.listenerChain[type] = [listener];
		} else {
			this.listenerChain[type].push( listener );
		}
	}
	
	EventDispatcher.prototype.hasEventListener = function( type ) {
		return (typeof this.listenerChain[type] != "undefined" );
	}
	
	EventDispatcher.prototype.removeEventListener = function( type, listener ) {
		if( !this.hasEventListener( type ) ) return false;
		var totalListeners = this.listenerChain[type].length;
		for( var i = 0; i < totalListeners; i++ ) {
			if( this.listenerChain[type][i] == listener ) this.listenerChain.splice( i, 1 );
		}
	}
	
	EventDispatcher.prototype.dispatchEvent = function( type, args ) {
		this.buildListenerChain();
		if( !this.hasEventListener( type ) ) {
			console.log("no event listener found with type");
			return false;
		}
		var total = this.listenerChain[type].length;
		for( var i = 0; i < total; ++i )this.listenerChain[type][i]();
		return true;
	}
	
	EventDispatcher.prototype.toString = function() { 
		return '[EventDispatcher]';
	}
	
	window.EventDispatcher = EventDispatcher;
}(window));