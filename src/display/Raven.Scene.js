var Raven = Raven || {};

Raven.SceneState = {
	'Scene_In':		0,
	'Scene_Idle':	1,
	'Scene_Out':	2,
	'Scene_Hidden':	3
};

Raven.Scene = function(params) {
	Raven.DisplayObject.apply(this, arguments);
	this.name			= "Raven.Scene_" + Raven.Scene.count.toString();
	this.showing		= false;
	this.state			= Raven.SceneState.Scene_Hidden;
	this.timer          = new Raven.Timer();
	this.timeline		= new Raven.TweenController();
	this.visible		= false;
	++Raven.Scene.count;
	return this;
};

Raven.Scene.extends( Raven.DisplayObject, Raven.Scene );
Raven.Scene.count = 0;

Raven.Scene.prototype.show = function() {
	if( this.showing ) return false; // already showing
	this.state = Raven.SceneState.Scene_In;
	this.showing = true;
	this.visible = true;
	this.animateIn();
	return true;
};

Raven.Scene.prototype.hide = function() {
	if( !this.showing ) return false; // not showing
	this.state = Raven.SceneState.Scene_Out;
	this.animateOut();
	return true;
};

Raven.Scene.prototype.update = function() {
	this.timeline.update();
	this.timer.update();
	Raven.DisplayObject.prototype.update.call(this);
	return this;
};

// Animation

Raven.Scene.prototype.animateIn = function() {
	// Replace with your code...
	this.animateInComplete();
	return this;
};

Raven.Scene.prototype.animateInComplete = function() {
	this.state = Raven.SceneState.Scene_Idle;
	this.dispatchEvent( new Raven.Event(Raven.Scene.SCENE_IN, this) );
	return this;
};

Raven.Scene.prototype.animateOut = function() {
	// Replace with your code...
	this.animateOutComplete();
	return this;
};

Raven.Scene.prototype.animateOutComplete = function() {
	this.state = Raven.SceneState.Scene_Hidden;
	this.showing = false;
	this.visible = false;
	this.dispatchEvent( new Raven.Event(Raven.Scene.SCENE_OUT, this) );
	return this;
};

Raven.Scene.prototype.__defineGetter__("frameNum", function(){
	return this.timer.frameNum;
});

Raven.Scene.prototype.__defineGetter__("elapsedTime", function(){
	return this.timer.elapsedMS;
});

Raven.Scene.SCENE_IN	= "Scene::sceneIn";
Raven.Scene.SCENE_OUT	= "Scene::sceneOut";
