function DemoApp() {
	
}

ClassUtil.extend(DemoApp, App);

DemoApp.prototype.setup = function () {
  this.super.setup.call(this);
}

DemoApp.prototype.draw = function () {
  this.super.draw.call(this);
	
	CanvasUtil.setFillColor( "#FFF" );
	CanvasUtil.setStrokeColor( "#FFF" );
	
	CanvasUtil.drawFont( this.mouseX.toString() + " :: " +  this.mouseY.toString(), 20, 20 );
	
	if( this.mouseDown ) drawTouch( this.mouseX, this.mouseY );
	for( var i = 0; i < this.totalTouches; ++i ) {
		drawTouch( this.touches[i].x, this.touches[i].y );
	}
}

function drawTouch( px, py ) {
	CanvasUtil.drawCircle( px, py, 100, true );
}

var app = new DemoApp();
app.backgroundColor = "#0D0D0D";
app.setup();
app.start();
