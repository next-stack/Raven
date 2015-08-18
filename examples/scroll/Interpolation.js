//////////////////////////////////////////////////
// Interpolation

function Interpolation(obj, pointer, onUpdate, onComplete) {
    this.speed      = 0.1;
    this.spring     = 0;
    this.velocity   = 0;
    this.change     = 0;
    this.previous   = 0;
    this.target     = 0;
    this.value      = 0;
    // Targets
    this.obj        = obj;
    this.pointer    = pointer;
    this.onUpdate   = onUpdate;
    this.onComplete = onComplete;
    if(obj !== undefined && pointer !== undefined) {
        this.value = this.target = this.previous = obj[pointer];
    }
    return this;
};

Interpolation.INTERPOLATION_PRECISION = 0.002;

Interpolation.prototype.update = function() {
    this.previous = this.value;
    this.velocity = ((this.target - this.value) * this.speed) + (this.velocity * this.spring);
    this.value   += this.velocity;
    this.change   = this.value - this.previous;
    //
    if(this.onUpdate !== undefined) this.onUpdate( this.value );
    // Complete?
    var complete = false;
    var MAX = Interpolation.INTERPOLATION_PRECISION;
    if( Math.abs(this.velocity) < MAX && Raven.distance(this.value, this.target) < MAX ) {
        complete = true;
        this.target = this.value;
        this.velocity = 0;
        if(this.onComplete !== undefined) this.onComplete( this.value );
    }

    // Update object
    if(this.obj !== undefined && this.pointer !== undefined) {
        this.obj[this.pointer] = this.value;
    }
    return complete;
};

//////////////////////////////////////////////////
// Interpolation

function InterpolationController() {
    this.items = [];
    return this;
};

//function(vObj, vTarget, target, update, complete, spring, mass, friction)
InterpolationController.prototype.to = function(obj, pointer, target, update, complete, speed, spring, velocity) {
    var iAni = new Interpolation(obj, pointer, update, complete);
    iAni.target = target;
    if(speed    !== undefined) iAni.speed    = speed;
    if(spring   !== undefined) iAni.spring   = spring;
    if(velocity !== undefined) iAni.velocity = velocity;
    this.items.push( iAni );
    return iAni;
};

InterpolationController.prototype.update = function() {
    var total = this.items.length;
    for(var i = 0; i < total; ++i) {
        if( this.items[i].update() ) {
            this.items.splice(i, i+1);
        }
    }
    return this;
};

//////////////////////////////////////////////////
// Global instance

var Ani = new InterpolationController();
