var Raven = Raven || {};

Raven.CSS = {
	/**
	 * Applies a new value to an object's key.
	 * Example:
	 * Raven.CSS.apply( Raven.element('ui'), 'left', 0 )
	 * Raven.CSS.apply( Raven.element('ui'), 'top',  0 )
	 * Raven.CSS.translate( Raven.element('ui'), 200, 200 )
	 */

	'apply': function(target, key, value) {
		var prefix = '',
			suffix = '';
		if(key == 'rotate') {
			prefix = 'rotate(';
			suffix = 'deg)';
			Raven.CSS.transform(target, prefix + value.toString() + suffix);
			return target;
		} else if(key == 'scale') {
			prefix = 'scale(';
			suffix = ')';
			Raven.CSS.transform(target, prefix + value.toString() + suffix);
			return target;
		} else if(value.constructor == Number) {
			suffix = 'px';
		}
		target['style'][key] = prefix + value.toString() + suffix;
		return target;
	},
	'transform': function(target, style) {
		target.style[Raven.DOM.TRANSFORM_PREFIX + "transform"] = style;
	},
	'translate': function(target, x, y) {
		Raven.CSS.transform(target, 'translate(' + x + 'px, ' + y + 'px)');
	}
};

