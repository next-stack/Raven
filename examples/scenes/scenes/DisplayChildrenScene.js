// Scene

DisplayChildrenScene.extends( Raven.Scene );
function DisplayChildrenScene(params) {
	Raven.Scene.apply(this, arguments);
	//
	this.name = "DisplayChildren";
	//
	var mBox, sBox;
	mBox = new MainBox();
    mBox.setup(100, 100, 100, 100);
    mBox.name = "Main Kid";
    this.addChild(mBox);

    sBox = new SubBox();
    sBox.setup(300, 300, 50, 50);
    sBox.name = "Sub Kid";
    mBox.addChild( sBox );
	//
	return this;
};

// Display classes

MainBox.extends( Raven.DisplayObject );
function MainBox(params) {
    Raven.DisplayObject.apply(this, arguments);

    this.update = function() {
        Raven.DisplayObject.prototype.update.call(this);
        // this.rotation.z += 1;
        return this;
    };

    this.render = function(view) {
        view.setFillRGB(204, 204, 255);
        view.drawRect(0, 0, 100, 100, true);
        //
        view.setStrokeRGB(204, 0, 0);
        view.drawRect(0, 0, this.size.x, this.size.y, false, true);
        return this;
    };
};

SubBox.extends( Raven.DisplayObject );
function SubBox(params) {
    Raven.DisplayObject.apply(this, arguments);

    this.update = function() {
        Raven.DisplayObject.prototype.update.call(this);
        this.rotation.z -= 1;
        return this;
    };

    this.render = function(view) {
        view.align = Raven.Align.CENTER;
        view.setFillB(102);
        view.drawRect(0, 0, this.size.x, this.size.y, true);
        view.align = Raven.Align.TOP_LEFT;
        return this;
    };
};
