var Raven = Raven || {};

/**
 * Any events
 * @param {string} type Event type
 * @param {object} params Event object parameters
 */
Raven.Event = function(type, params) {
    this.type = type;
    this.params = params;
    this.target = undefined;
    return this;
};

Raven.Event.prototype.constructor = Raven.Event;

Raven.Event.ADDED       = "ravenAdded";
Raven.Event.REMOVED     = "ravenRemoved";
Raven.Event.ENABLE      = "ravenEnable";
Raven.Event.DISABLE     = "ravenDisable";
Raven.Event.UPDATE      = "ravenUpdate";
Raven.Event.DRAW        = "ravenDraw";
Raven.Event.RESIZE      = "ravenResize";

/**
 * All mouse & touch events
 * @param {string} type Event type
 * @param {float} x X position
 * @param {float} y Y position
 * @param {int} index Touch index
 * @param {float} pressure Touch pressure
 */
Raven.ActionEvent = function(type, x, y, index, pressure) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.index = index;
    this.pressure = pressure;
    this.target = undefined;
    return this;
};

Raven.ActionEvent.prototype = new Raven.Event();
Raven.ActionEvent.prototype.constructor = Raven.ActionEvent;

Raven.ActionEvent.DOWN      = "ravenDown";
Raven.ActionEvent.MOVE      = "ravenMove";
Raven.ActionEvent.UP        = "ravenUp";
Raven.ActionEvent.OVER      = "ravenOver";
Raven.ActionEvent.OUT       = "ravenOut";
Raven.ActionEvent.SCROLLED  = "ravenScrolled";
