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
	this.frameNum		= 0;
	this.elapsedTime	= 0;
	this.showStart		= 0;
	this.timeline		= new Raven.TweenController();
	this.visible		= false;
	++Raven.Scene.count;
	return this;
};

Raven.Scene.extends( Raven.DisplayObject );
Raven.Scene.count = 0;

Raven.Scene.prototype.show = function() {
	if( this.showing ) return this; // already showing
	this.state = Raven.SceneState.Scene_In;
	this.showing = true;
	this.visible = true;
	this.animateIn();
	return this;
};

Raven.Scene.prototype.hide = function() {
	if( !this.showing ) return this; // not showing
	this.state = Raven.SceneState.Scene_Out;
	return this;
};

Raven.Scene.prototype.update = function() {
	this.timeline.update();
	Raven.DisplayObject.prototype.update.call(this);
	return this;
};

Raven.Scene.prototype.updateTime = function() {
	++this.frameNum;
	this.elapsedTime = Date.now() - this.showStart;
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

Raven.Scene.SCENE_IN	= "Scene::sceneIn";
Raven.Scene.SCENE_OUT	= "Scene::sceneOut";
