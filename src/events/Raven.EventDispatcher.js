var Raven = Raven || {};

Raven.EventDispatcher = function() {
  this.listenerChain = {};
}

Raven.EventDispatcher.prototype.constructor = Raven.EventDispatcher;

Raven.EventDispatcher.prototype.buildListenerChain = function() {
  if( !this.listenerChain ) this.listenerChain = {};
}

Raven.EventDispatcher.prototype.addListener = function( type, listener ) {
  if( !listener instanceof Function ) throw { message: "Listener isn't a function" };
  this.buildListenerChain();
  if( !this.listenerChain[type] ) {
    this.listenerChain[type] = [listener];
  } else {
    this.listenerChain[type].push( listener );
  }
}

Raven.EventDispatcher.prototype.hasListener = function( type ) {
  return (typeof this.listenerChain[type] != "undefined" );
}

Raven.EventDispatcher.prototype.removeListener = function( type, listener ) {
  if( !this.hasListener( type ) ) return false;
  var totalListeners = this.listenerChain[type].length;
  for( var i = 0; i < totalListeners; i++ ) {
    if( this.listenerChain[type][i] == listener ) {
      this.listenerChain[type].splice( i, 1 );
    }
  }
}

Raven.EventDispatcher.prototype.dispatchEvent = function( evtObj ) {
  this.buildListenerChain();
  if( !this.hasListener( evtObj.type ) ) {
    return false;
  }
  var types = this.listenerChain[evtObj.type];
  var total = types.length;
  evtObj.target = this;
  for( var i = 0; i < total; ++i ) types[i](evtObj);
  return true;
}

Raven.EventDispatcher.prototype.dispatch = function( type, params ) {
  return this.dispatchEvent( new Raven.Event(type, params) );
}

//

Raven._dispatcher = new Raven.EventDispatcher(); // Singleton instance
  
Raven.addListener = function( type, listener ) {
  return Raven._dispatcher.addListener( type, listener );
}

Raven.hasListener = function( type ) {
  return Raven._dispatcher.hasListener( type );
}

Raven.removeListener = function( type, listener ) {
  return Raven._dispatcher.removeListener( type, listener );
}

Raven.dispatchEvent = function( evt ) {
  return Raven._dispatcher.dispatchEvent( evt );
}

Raven.dispatch = function( type, params ) {
  return Raven._dispatcher.dispatch( type, params );
}