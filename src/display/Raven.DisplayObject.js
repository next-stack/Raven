var Raven = Raven || {};

Raven.DisplayObject = function(params) {
    Raven.EventDispatcher.apply(this, arguments);
    this.name           = "Raven.DisplayObject_" + Raven.DisplayObject.count.toString();
    this.alpha          = 1.0;
    this.visible        = true;
    this.anchor         = new Raven.Vec(0, 0, 0);
    this.position       = new Raven.Vec(0, 0, 0);
    this.rotation       = new Raven.Vec(0, 0, 0);
    this.scale          = new Raven.Vec(1, 1, 1);
    this.size           = new Raven.Vec(0, 0, 0);
    this.parent         = null;
    this.children       = [];
    ++Raven.DisplayObject.count;
    return this;
};

Raven.DisplayObject.extends( Raven.EventDispatcher, Raven.DisplayObject );
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
    var i, total = this.numChildren-1;
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
    if(!this.visible) return this;
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
        if(this.children[i].visible) {
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
    }
    return this;
};

/**
 * Updates just the children, and also auto-extends the Display Object's size
 * if children's position+size exceed it.
 * @return {Raven.DisplayObject} this
 */
Raven.DisplayObject.prototype.updateChildrenBounds = function() {
    var i, total = this.numChildren;
    for(i = 0; i < total; ++i) {
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
    if(!this.visible) return this;

    var alpha = view.context.globalAlpha;
    view.context.globalAlpha = this.opacity;

    this.pushMatrix(view);
    this.render(view);
    this.drawChildren(view);
    this.popMatrix(view);
    this.drawAfter(view);

    view.context.globalAlpha = alpha;

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
    //view.setStrokeRGBA(255, 0, 0, 255 * this.opacity);
    view.setStrokeRGB(255, 0, 0);
    view.drawRect(0, 0, this.width, this.height, false, true);
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
        if(this.children[i].visible) this.children[i].draw(view);
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
    var x = this.position.x - this.anchor.x;
    var y = this.position.y - this.anchor.y;
    var z = this.position.z - this.anchor.z;
    view.translate(x, y, z);
    view.rotate(this.rotation.x, this.rotation.y, this.rotation.z);
    view.scale(this.scale.x, this.scale.y, this.scale.z);
    view.setFillB(255);
    //view.setFillRGBA(255, 255, 255, this.opacity * 255);
    return this;
};

/**
 * Pops the view's matrix
 * @param  {Raven.View} view The Raven.View instance
 * @return {Raven.DisplayObject} this
 */
Raven.DisplayObject.prototype.popMatrix = function(view) {
    view.scale(  1/view.matrix.scale.x, 1/view.matrix.scale.y, 1/view.matrix.scale.z );
    view.rotate( -view.matrix.rotate.x, -view.matrix.rotate.y, -view.matrix.rotate.z );
    view.translate( -view.matrix.translate.x, -view.matrix.translate.y, -view.matrix.translate.z );
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
        this.children[index].dispose();
        this.children.splice(index, 1);
    }
    return this;
};

Raven.DisplayObject.prototype.removeAllChildren = function() {
    var i;
    for(i = this.numChildren-1; i > -1; --i) {
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
    if(this.parent !== null) return this.size.x * this.scale.x * this.parent.scale.x;
    return this.size.x * this.scale.x;
});

Raven.DisplayObject.prototype.__defineGetter__("height", function(){
    if(this.parent !== null) return this.size.y * this.scale.y * this.parent.scale.y;
    return this.size.y * this.scale.y;
});

Raven.DisplayObject.prototype.__defineGetter__("depth", function(){
    if(this.parent !== null) return this.size.z * this.scale.z * this.parent.scale.z;
    return this.size.z * this.scale.z;
});

// Position

Raven.DisplayObject.prototype.__defineGetter__("left", function(){
    if(this.parent !== null) return this.parent.scale.x * this.position.x;
    return this.position.x;
});

Raven.DisplayObject.prototype.__defineGetter__("top", function(){
    if(this.parent !== null) return this.parent.scale.y * this.position.y;
    return this.position.y;
});

Raven.DisplayObject.prototype.__defineGetter__("front", function(){
    if(this.parent !== null) return this.parent.scale.z * this.position.z;
    return this.position.z;
});

Raven.DisplayObject.prototype.__defineGetter__("right", function(){
    return this.left + this.width;
});

Raven.DisplayObject.prototype.__defineGetter__("bottom", function(){
    return this.top  + this.height;
});

Raven.DisplayObject.prototype.__defineGetter__("back", function(){
    return this.front + this.depth;
});

Raven.DisplayObject.prototype.__defineGetter__("centerX", function(){
    return this.width / 2 + this.left;
});

Raven.DisplayObject.prototype.__defineGetter__("centerY", function(){
    return this.height / 2 + this.top;
});

Raven.DisplayObject.prototype.__defineGetter__("centerZ", function(){
    return this.depth / 2 + this.front;
});

Raven.DisplayObject.prototype.__defineGetter__("center", function(){
    return new Raven.Vec( this.centerX, this.centerY, this.centerZ );
});

// Absolute Position

Raven.DisplayObject.prototype.__defineGetter__("absoluteLeft", function(){
    return this.left + (this.parent !== null ? this.parent.absoluteLeft : 0);
});

Raven.DisplayObject.prototype.__defineGetter__("absoluteTop", function(){
    return this.top + (this.parent !== null ? this.parent.absoluteTop : 0);
});

Raven.DisplayObject.prototype.__defineGetter__("absoluteFront", function(){
    return this.front + (this.parent !== null ? this.parent.absoluteFront : 0);;
});

Raven.DisplayObject.prototype.__defineGetter__("absolutePos", function(){
    return new Raven.Vec( this.absoluteLeft, this.absoluteTop, this.absoluteFront );
});

Raven.DisplayObject.prototype.__defineGetter__("absoluteRight", function(){
    return this.right + (this.parent !== null ? this.parent.absoluteLeft : 0);
});

Raven.DisplayObject.prototype.__defineGetter__("absoluteBottom", function(){
    return this.bottom + (this.parent !== null ? this.parent.absoluteTop : 0);
});

Raven.DisplayObject.prototype.__defineGetter__("absoluteBack", function(){
    return this.back + (this.parent !== null ? this.parent.absoluteFront : 0);
});

Raven.DisplayObject.prototype.__defineGetter__("absoluteCenterX", function(){
    return this.width * 0.5 + this.absoluteLeft;
});

Raven.DisplayObject.prototype.__defineGetter__("absoluteCenterY", function(){
    return this.height * 0.5 + this.absoluteTop;
});

Raven.DisplayObject.prototype.__defineGetter__("absoluteCenterZ", function(){
    return this.depth * 0.5 + this.absoluteFront;
});
