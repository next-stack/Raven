var Raven = Raven || {};
Raven.Event = function(type, params) {
  this.type = type;
  this.params = params;
}

Raven.EventDispatcher = function() {
  this.listenerChain = {};
}

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
  if( !this.hasEventListener( type ) ) return false;
  var totalListeners = this.listenerChain[type].length;
  for( var i = 0; i < totalListeners; i++ ) {
    if( this.listenerChain[type][i] == listener ) this.listenerChain.splice( i, 1 );
  }
}

Raven.EventDispatcher.prototype.dispatchEvent = function( evtObj ) {
  this.buildListenerChain();
  if( !this.hasListener( evtObj.type ) ) {
    return false;
  }
  var total = this.listenerChain[evtObj.type].length;
  for( var i = 0; i < total; ++i )this.listenerChain[evtObj.type][i](evtObj);
  return true;
}

//

Raven.dispatcher = function() {}
Raven.dispatcher._instance = new Raven.EventDispatcher(); // Singleton instance
  
Raven.dispatcher.addListener = function( type, listener ) {
  return Raven.dispatcher._instance.addListener( type, listener );
}

Raven.dispatcher.hasListener = function( type ) {
  return Raven.dispatcher._instance.hasListener( type );
}

Raven.dispatcher.removeListener = function( type, listener ) {
  return Raven.dispatcher._instance.removeListener( type, listener );
}

Raven.dispatcher.dispatchEvent = function( type, args ) {
  return Raven.dispatcher._instance.dispatchEvent( type, args );
}