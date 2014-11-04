var Raven = Raven || {};

Raven.Timer = function(params) {
    this.startMS        = 0;
    this.elapsedMS      = 0;
    this.running        = true;
    this.pauseStart     = 0;
    this.pauseElapsed   = 0;
    //
    this.restart = function() {
        this.startMS = Date.now();
        this.elapsedMS = 0;
        this.running = true;
        this.pauseStart = 0;
        this.pauseElapsed = 0;
        return this;
    };
    this.restart();
    return this;
};

Raven.Timer.prototype.pause = function() {
    if(!this.running) return this; // already paused
    this.running = false;
    this.pauseStart = Date.now();
    this.pauseElapsed = 0;
    return this;
};

Raven.Timer.prototype.play = function() {
    if(this.running) return this; // already playing
    this.pauseElapsed = Date.now() - this.pauseStart; // backup
    this.startMS += this.pauseElapsed; // offset start to account for multiple pauses
    this.elapsedMS = Date.now() - this.startMS; // update
    this.pauseElapsed = 0; // clear
    this.running = true;
    return this;
};

Raven.Timer.prototype.update = function() {
    if(this.running) {
    	this.elapsedMS = Date.now() - this.startMS + this.pauseElapsed;
    } else {
    	this.pauseElapsed = Date.now() - this.pauseStart;
    }
    return this;
};

Raven.Timer.prototype.__defineGetter__("seconds", function(){
    return this.elapsedMS / 1000;
});

Raven.Timer.prototype.__defineGetter__("frameNum", function(){
    var appFPS = 60;
    return Math.round( this.seconds * appFPS );
});
