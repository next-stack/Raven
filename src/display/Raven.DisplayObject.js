var Raven = Raven || {};

Raven.DisplayObject = function(params) {
    Raven.EventDispatcher.apply(this, arguments);
    this.constructor.name = "Raven.DisplayObject";
	this.name			= "Raven.DisplayObject_" + Raven.DisplayObject.count.toString();
	this.alpha			= 1.0;
	this.visible		= true;
	this.position		= new Raven.Vec(0, 0, 0);
	this.rotation		= new Raven.Vec(0, 0, 0);
	this.scale			= new Raven.Vec(1, 1, 1);
	this.size			= new Raven.Vec(0, 0, 0);
	this.parent			= null;
	this.children		= [];
	++Raven.DisplayObject.count;
	return this;
};

Raven.DisplayObject.extends( Raven.EventDispatcher );
Raven.DisplayObject.count = 0;

/**
 * Sets the position & size
 * @param  {Number} x      X position
 * @param  {Number} y      Y position
 * @param  {Number} width  X size
 * @param  {Number} height Y size
 * @return {Raven.DisplayObject} this
 */
Raven.DisplayObject.prototype.setup = function(x, y, width, height) {
	this.position.x = x;
	this.position.y = y;
	this.size.x = width;
	this.size.y = height;
	return this;
};

/**
 * Disposes of instances and clears memory
 * @return {Raven.DisplayObject} this
 */
Raven.DisplayObject.prototype.dispose = function() {
	this.parent  = null;
	var i, total = this.numChildren;
	for(i = total; i > -1; --i) {
		this.children[i].dispose();
	}
	delete this.children;
	return this;
};

/**
 * Updates the display object and its children
 * @return {Raven.DisplayObject} this
 */
Raven.DisplayObject.prototype.update = function() {
	this.updateChildren();
	return this;
};

/**
 * Updates just the children, and also auto-extends the Display Object's size
 * if children's position+size exceed it.
 * @return {Raven.DisplayObject} this
 */
Raven.DisplayObject.prototype.updateChildren = function() {
	var i, total = this.numChildren;
	for(i = 0; i < total; ++i) {
		this.children[i].update();
		if(this.children[i].right  > this.size.x) {
			this.size.x = this.children[i].right;
		}
		if(this.children[i].bottom > this.size.y) {
			this.size.y = this.children[i].bottom;
		}
		if(this.children[i].back   > this.size.z) {
			this.size.z = this.children[i].back;
		}
	}
	return this;
};

/**
 * Draws the Display Object and its children.
 * @param  {Raven.View} view The Raven.View instance
 * @return {Raven.DisplayObject} this
 */
Raven.DisplayObject.prototype.draw = function(view) {
	this.pushMatrix(view);
	this.render(view);
	this.drawChildren(view);
	this.popMatrix(view);
	this.drawAfter(view);
	return this;
};

/**
 * Draws outside the matrix, usually used for debugging / UI
 * @param  {Raven.View} view The Raven.View instance
 * @return {[type]} [description]
 */
Raven.DisplayObject.prototype.drawAfter = function(view) {
	// Your code here
	return this;
};

/**
 * Draws the objects boundaries, for debugging purposes
 * @param  {Raven.View} view The Raven.View instance
 * @return {Raven.DisplayObject} this
 */
Raven.DisplayObject.prototype.drawBounds = function(view) {
	this.pushMatrix(view);
	view.setStrokeRGBA(255, 0, 0, 255 * this.opacity);
	view.drawRect(0, 0, this.size.x, this.size.y, false, true);
	this.popMatrix(view);
	return this;
};

/**
 * Draws the children
 * @param  {Raven.View} view The Raven.View instance
 * @return {Raven.DisplayObject} this
 */
Raven.DisplayObject.prototype.drawChildren = function(view) {
	var i, total = this.numChildren;
	for(i = 0; i < total; ++i) {
		this.children[i].draw(view);
	}
	return this;
};

/**
 * Your drawing code, applied within the matrix
 * @param  {Raven.View} view The Raven.View instance
 * @return {Raven.DisplayObject} this
 */
Raven.DisplayObject.prototype.render = function(view) {
	// Your code here
	return this;
};

/**
 * For collisions
 * @param  {[type]} x [description]
 * @param  {[type]} y [description]
 * @return {[type]}   [description]
 */
Raven.DisplayObject.prototype.hitTest = function(x, y) {
    return Raven.inBounds(x, y, this.absoluteLeft,
                                this.absoluteTop,
                                this.absoluteRight,
                                this.absoluteBottom);
};

//////////////////////////////////////////////////
// GL
//////////////////////////////////////////////////

/**
 * Pushes the translation, rotation, scale, and opacity of the matrix to the view
 * @param  {Raven.View} view The Raven.View instance
 * @return {Raven.DisplayObject} this
 */
Raven.DisplayObject.prototype.pushMatrix = function(view) {
	view.pushMatrix();
	view.translate(this.position.x, this.position.y, this.position.z);
	view.rotate(this.rotation.x, this.rotation.y, this.rotation.z);
	view.scale(this.scale.x, this.scale.y, this.scale.z);
	view.setFillRGBA(255, 255, 255, this.opacity * 255);
	return this;
};

/**
 * Pops the view's matrix
 * @param  {Raven.View} view The Raven.View instance
 * @return {Raven.DisplayObject} this
 */
Raven.DisplayObject.prototype.popMatrix = function(view) {
	view.popMatrix();
	return this;
};

//////////////////////////////////////////////////
// Management
//////////////////////////////////////////////////

Raven.DisplayObject.prototype.addChild = function(displayObject) {
	if(displayObject.parent == this) return false;
	if(displayObject.parent != null) {
		displayObject.parent.removeChild( displayObject );
	}

	displayObject.parent = this;
	this.children.push( displayObject );
	return true;
};

Raven.DisplayObject.prototype.hasChild = function(displayObject) {
	return this.getChildIndex(displayObject) > -1;
};

Raven.DisplayObject.prototype.getChildAt = function(index) {
	if(index > -1 && index < this.numChildren) {
		return this.children[index];
	}
	return null;
};

Raven.DisplayObject.prototype.getChildByName = function(displayName) {
	var total = this.numChildren;
	for(var i = 0; i < total; ++i) {
		if(this.children[i].name == displayName) {
			return this.children[i];
		}
	}
	return null;
};

Raven.DisplayObject.prototype.getChildIndex = function(displayObject) {
	var total = this.numChildren;
	for(var i = 0; i < total; ++i) {
		if(this.children[i] == displayObject) {
			return i;
		}
	}
	return -1;
};

Raven.DisplayObject.prototype.getChildIndexByName = function(displayName) {
	var total = this.numChildren;
	for(var i = 0; i < total; ++i) {
		if(this.children[i].name == displayName) {
			return i;
		}
	}
	return -1;
};

Raven.DisplayObject.prototype.removeChild = function(displayObject) {
	var index = this.getChildIndex(displayObject);
	return this.removeChildAt( index );
};

Raven.DisplayObject.prototype.removeChildAt = function(index) {
	if(index > -1 && index < this.numChildren) {
		this.children[i].dispose();
		this.children.splice(index, 1);
	}
	return this;
};

Raven.DisplayObject.prototype.removeAllChildren = function() {
	var i = this.numChildren-1;
	for(i; i > -1; --i) {
		this.removeChildAt(i);
	}
	this.children = [];
	return this;
};

//////////////////////////////////////////////////
// Getters
//////////////////////////////////////////////////

Raven.DisplayObject.prototype.__defineGetter__("numChildren", function(){
	return this.children.length;
});

Raven.DisplayObject.prototype.__defineGetter__("opacity", function(){
	if(this.parent != null) return this.alpha * this.parent.alpha;
	return this.alpha;
});

// Size

Raven.DisplayObject.prototype.__defineGetter__("width", function(){
	return this.size.x;
});

Raven.DisplayObject.prototype.__defineGetter__("height", function(){
	return this.size.y;
});

Raven.DisplayObject.prototype.__defineGetter__("depth", function(){
	return this.size.z;
});

// Position

Raven.DisplayObject.prototype.__defineGetter__("left", function(){
	return this.position.x;
});

Raven.DisplayObject.prototype.__defineGetter__("top", function(){
	return this.position.y;
});

Raven.DisplayObject.prototype.__defineGetter__("front", function(){
	return this.position.z;
});

Raven.DisplayObject.prototype.__defineGetter__("right", function(){
	return this.size.x + this.position.x;
});

Raven.DisplayObject.prototype.__defineGetter__("bottom", function(){
	return this.size.y + this.position.y;
});

Raven.DisplayObject.prototype.__defineGetter__("back", function(){
	return this.size.z + this.position.z;
});

Raven.DisplayObject.prototype.__defineGetter__("centerX", function(){
	return this.size.x * 0.5 + this.position.x;
});

Raven.DisplayObject.prototype.__defineGetter__("centerY", function(){
	return this.size.y * 0.5 + this.position.y;
});

Raven.DisplayObject.prototype.__defineGetter__("centerZ", function(){
	return this.size.z * 0.5 + this.position.z;
});

// Absolute Position

Raven.DisplayObject.prototype.__defineGetter__("absoluteLeft", function(){
	return this.position.x;
});

Raven.DisplayObject.prototype.__defineGetter__("absoluteTop", function(){
	return this.position.y;
});

Raven.DisplayObject.prototype.__defineGetter__("absoluteFront", function(){
	return this.position.z;
});

Raven.DisplayObject.prototype.__defineGetter__("absoluteRight", function(){
	return this.size.x + this.position.x;
});

Raven.DisplayObject.prototype.__defineGetter__("absoluteBottom", function(){
	return this.size.y + this.position.y;
});

Raven.DisplayObject.prototype.__defineGetter__("absoluteBack", function(){
	return this.size.z + this.position.z;
});

Raven.DisplayObject.prototype.__defineGetter__("absoluteCenterX", function(){
	return this.size.x * 0.5 + this.position.x;
});

Raven.DisplayObject.prototype.__defineGetter__("absoluteCenterY", function(){
	return this.size.x * 0.5 + this.position.y;
});

Raven.DisplayObject.prototype.__defineGetter__("absoluteCenterZ", function(){
	return this.size.x * 0.5 + this.position.z;
});
