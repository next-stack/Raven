var Raven = Raven || {};

Raven.Stage = function(params) {
	Raven.DisplayObject.apply(this, arguments);
	this.name			= "Raven.Stage";
	this.sceneIndex		= -1;
	this.activeScene	= null;
	this.nextScene		= null;
	return this;
};

Raven.Stage.extends( Raven.DisplayObject, Raven.Stage );

//////////////////////////////////////////////////
// Management
//////////////////////////////////////////////////

Raven.Stage.prototype.addChild = function(displayObject) {
	if( !Raven.DisplayObject.prototype.addChild.call(this, displayObject) ) {
		return false;
	}
	if(displayObject.constructor == Raven.Scene) {
		displayObject.visible = false;
	}
	return true;
};

Raven.Stage.prototype.showChild = function(displayName) {
	var index = this.getChildIndexByName(displayName);
	if(index < 0) {
		return false;
	}
	this.children[index].visible = true;
	return true;
};

Raven.Stage.prototype.hideChild = function(displayName) {
	var index = this.getChildIndexByName(displayName);
	if(index < 0) return false;
	this.children[index].visible = false;
	return true;
};

Raven.Stage.prototype.showScene = function(sceneName) {
	this.showSceneAt( this.getChildIndexByName(sceneName) );
	return this;
};

Raven.Stage.prototype.showSceneAt = function(displayIndex) {
	if(displayIndex < 0 || displayIndex >= this.numChildren) {
		return false;
	}
	this.nextScene  = this.children[displayIndex];
	this.sceneIndex = displayIndex;
	if(this.activeScene !== null) {
		this.hideCurrentScene();
	} else {
		this.showNextScene();
	}
	return this;
};

Raven.Stage.prototype.hideScene = function() {
	if(this.activeScene !== null) this.hideCurrentScene();
	return this;
};

// Protected

/**
 * Updates just the children, and also auto-extends the Display Object's size
 * if children's position+size exceed it.
 * @return {Raven.Stage} this
 */
Raven.Stage.prototype.updateChildren = function() {
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
	if(this.activeScene !== null) this.activeScene.updateTime();
	return this;
};

Raven.Stage.prototype.showNextScene = function() {
	this.activeScene = this.nextScene;
	this.activeScene.show();
	this.nextScene = null;
	return this;
};

Raven.Stage.prototype.hideCurrentScene = function() {
	var _this = this;
	var currentSceneHidden = function() {
		_this.activeScene.removeListener(Raven.Scene.SCENE_OUT, currentSceneHidden);
		_this.activeScene = null;
		if(_this.nextScene !== null) {
			_this.showNextScene();
		}
	}
	this.activeScene.addListener(Raven.Scene.SCENE_OUT, currentSceneHidden);
	this.activeScene.hide();
	return this;
};

