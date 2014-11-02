var Raven = Raven || {};

/*************************************************
 * Spring
 * A physical object with mass, bounce, and
 * friction.
 ************************************************/

Raven.Spring = function(obj, pointer, onUpdate, onComplete) {
    var start    = 0;
    if(obj && pointer) start = obj[pointer];

    this.value   = start;
    this.target  = this.value;
    this.acc     = 0;
    this.vel     = 0;
    this.history = [];

    // Targets
    this.obj        = obj;
    this.pointer    = pointer;
    this.onUpdate   = onUpdate;
    this.onComplete = onComplete;

    // Physics
    this.friction  = 0.7;
    this.mass      = 8.0;
    this.bounce    = 0.9;
    return this;
};

//////////////////////////////////////////////////
// Prototype

Raven.Spring.prototype.update = function() {
    this.history.push( this.value );
    if(this.history.length > Raven.Spring.historyLength) this.history.shift();

    var force   = (this.value - this.target) * -this.bounce;
    this.acc    = force / this.mass;
    this.vel    = (this.acc + this.vel) * this.friction;
    this.value += this.vel;

    // Update object
    if(this.obj !== undefined && this.pointer !== undefined) {
        this.obj[this.pointer] = this.value;
    }

    // Callbacks
    if(this.onUpdate !== undefined) this.onUpdate(this.value);
    return this;
};

Raven.Spring.prototype.onCompletion = function() {
    this.value = this.target;
    this.acc = 0;
    this.vel = 0;
    // Update object
    if(this.obj !== undefined && this.pointer !== undefined) {
        this.obj[this.pointer] = this.value;
    }
    if(this.onComplete !== undefined) this.onComplete(this.value);
    return this;
};

// Getters

Raven.Spring.prototype.isComplete = function() {
    var vel = Math.abs(this.acc) + Math.abs(this.vel);
    var isClose = vel < Raven.Spring.INTERPOLATION_PRECISION;
    if(isClose) {
        return Raven.distance(this.value, this.target) < Raven.Spring.INTERPOLATION_PRECISION;
    }
    return false;
};

// Static
Raven.Spring.historyLength = 10;
Raven.Spring.INTERPOLATION_PRECISION = 0.002;

/*************************************************
 * SpringVec
 * A physical vector with mass, bounce, and
 * friction.
 ************************************************/

Raven.SpringVec = function(obj, pointer, onUpdate, onComplete) {
    var start    = new Raven.Vec(0, 0, 0);
    if(obj && pointer) start = obj[pointer];

    this.value   = start;
    this.target  = this.value.copy();
    this.acc     = new Raven.Vec(0, 0);
    this.vel     = new Raven.Vec(0, 0);
    this.history = [];

    // Targets
    this.obj        = obj;
    this.pointer    = pointer;
    this.onUpdate   = onUpdate;
    this.onComplete = onComplete;

    // Physics
    this.friction  = 0.7;
    this.mass      = 8.0;
    this.bounce    = 0.9;
    return this;
};

//////////////////////////////////////////////////
// Prototype

Raven.SpringVec.prototype.update = function() {
    this.history.push( this.value.copy() );
    if(this.history.length > Raven.Spring.historyLength) this.history.shift();

    var force  = this.value.subtractV(this.target).multiply(-this.bounce);
    this.acc   = force.divide(this.mass);
    this.vel   = this.acc.addV(this.vel).multiply(this.friction);
    this.value = this.value.addV(this.vel);

    // Update object
    if(this.obj !== undefined && this.pointer !== undefined) {
        var obj = this.obj[this.pointer];
        obj.x = this.value.x;
        obj.y = this.value.y;
        obj.z = this.value.z;
    }

    // Callbacks
    if(this.onUpdate !== undefined) this.onUpdate(this.value);
    return this;
};

Raven.SpringVec.prototype.draw = function(g) {
    g.setFillRGB(255, 255, 255);
    var total  = this.history.length-1;
    var alpha  = 255 / total;

    for(var i = 0; i < total; ++i) {
        var _alpha = alpha * (i+1);
        g.setStrokeRGBA(255, 255, 255, _alpha);
        var a = this.history[i],
            b = this.history[i+1];
        g.drawLine(a.x, a.y, b.x, b.y);
        g.drawCircle(this.value.x, this.value.y, 20, true);
    }
};

Raven.SpringVec.prototype.onCompletion = function() {
    this.value = this.target;
    this.acc.set(0, 0, 0);
    this.vel.set(0, 0, 0);
    // Update object
    if(this.obj !== undefined && this.pointer !== undefined) {
        var obj = this.obj[this.pointer];
        obj.x = this.value.x;
        obj.y = this.value.y;
        obj.z = this.value.z;
    }
    if(this.onComplete !== undefined) this.onComplete(this.value);
    return this;
};

// Getters

Raven.SpringVec.prototype.isComplete = function() {
    var vel = Math.abs(this.acc.length()) + Math.abs(this.vel.length());
    var isClose = vel < Raven.Spring.INTERPOLATION_PRECISION;
    if(isClose) {
        return this.value.distance(this.target) < Raven.Spring.INTERPOLATION_PRECISION;
    }
    return vel < Raven.Spring.INTERPOLATION_PRECISION;
};


/*************************************************
 * SpringController
 * An animation controller for Springs.
 ************************************************/

Raven.SpringController = function() {
    this.springs = [];
    this.springVecs = [];
    return this;
};

// Global
Raven.Springy = new Raven.SpringController();

//////////////////////////////////////////////////
// Prototype

Raven.SpringController.prototype.clear = function() {
    this.springs = [];
    this.springVecs = [];
};

Raven.SpringController.prototype.update = function() {
    var i, sp, vel;
    for(i = 0; i < this.springs.length; ++i) {
        sp  = this.springs[i];
        sp.update();
        // Remove dead springs
        if(sp.isComplete()) {
            sp.onCompletion();
            this.springs.splice(i, 1);
            --i;
        }
    }

    // Vectors
    for(i = 0; i < this.springVecs.length; ++i) {
        sp  = this.springVecs[i];
        sp.update();
        // Remove dead springs
        if(sp.isComplete()) {
            sp.onCompletion();
            this.springVecs.splice(i, 1);
            --i;
        }
    }
};

Raven.SpringController.prototype.draw = function(g) {
    if(g === undefined) return;
    for(var i in this.springVecs) {
        this.springVecs[i].draw(g);
    }
    g.setFillRGB(255, 255, 255);
    g.drawFont("Total springs: " + (this.springs.length + this.springVecs.length).toString(), 25, 50);
};

Raven.SpringController.prototype.to = function(vObj, vTarget, target, update, complete, spring, mass, friction) {
    var sp;
    if(!isNaN(target)) {
        // Single spring
        sp = this.hasSpring(vObj, vTarget);
        if(sp === null) {
            sp = new Raven.Spring(vObj, vTarget, update, complete);
            this.springs.push( sp );
        }
    } else {
        // Object
        sp = this.hasSpringVec(vObj, vTarget);
        if(sp === null) {
            sp = new Raven.SpringVec(vObj, vTarget, update, complete);
            this.springVecs.push( sp );
        }
    }

    if(target)   sp.target = target;
    if(spring)   sp.bounce = spring;
    if(mass)     sp.mass = mass;
    if(friction) sp.friction = friction;

    sp.onUpdate   = update;
    sp.onComplete = complete;
};

Raven.SpringController.prototype.override = function(spring, mass, friction) {
    var i, total;
    total = this.springs.length;
    for(i = 0; i < total; ++i) {
        this.springs[i].friction = friction;
        this.springs[i].mass = mass;
        this.springs[i].bounce = spring;
    }

    // Vectors
    total = this.springVecs.length;
    for(i = 0; i < total; ++i) {
        this.springVecs[i].friction = friction;
        this.springVecs[i].mass = mass;
        this.springVecs[i].bounce = spring;
    }
};

//////////////////////////////////////////////////
// Getters

Raven.SpringController.prototype.hasSpring = function(fObj) {
    for(var i in this.springs) {
        var sp = this.springs[i];
        if(sp.obj == fObj) {
            return sp;
        }
    }
    return null;
};

Raven.SpringController.prototype.hasSpringVec = function(vObj, vTarget) {
    for(var i in this.springVecs) {
        var sp = this.springVecs[i];
        if(sp.obj == vObj && sp.pointer == vTarget) {
            return sp;
        }
    }
    return null;
};

