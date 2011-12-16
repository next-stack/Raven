(function(window) {
	
	// Singleton constructor
	var CanvasUtil = function() {}
	var backgroundColor = '#000';
	var fillColor = '#FFF';
	var strokeColor = '#FFF';
	var lineWidth = 1;
	var font;
	
	CanvasUtil.update = function() {
		// Clear background
	  View.context.fillColor = fillColor;
	  View.context.strokeColor = strokeColor;
	  View.context.lineWidth = lineWidth;
	  View.context.font = font;
	}
	
	CanvasUtil.setContext = function( newContext ) {
	  View.context = newContext;
		View.width = window.innerWidth;
		View.height = window.innerHeight;
	}
	
	CanvasUtil.setFillColor = function( col ) {
		fillColor = col;
		View.context.fillStyle = fillColor;
	}
	
	CanvasUtil.setFillColorRGB = function( red, green, blue ) {
		fillColor = 'rgb(' + red + ',' + green + ',' + blue + ')';
		View.context.fillStyle = fillColor;
	}
	
	CanvasUtil.setFillColorRGBA = function( red, green, blue, alpha ) {
		fillColor = 'rgba(' + red + ',' + green + ',' + blue + ',' + ( alpha / 255 ) + ')';
		View.context.fillStyle = fillColor;
	}
	
	CanvasUtil.setFont = function( newFont ) {
		font = newFont;
		View.context.font = font;
	}
	
	CanvasUtil.setStrokeColor = function( col ) {
		strokeColor = col;
		View.context.strokeStyle = strokeColor;
	}
	
	CanvasUtil.setStrokeColorRGB = function( red, green, blue ) {
		strokeColor = 'rgb(' + red + ',' + green + ',' + blue + ')';
		View.context.strokeStyle = strokeColor;
	}
	
	CanvasUtil.setStrokeColorRGBA = function( red, green, blue, alpha ) {
		strokeColor = 'rgba(' + red + ',' + green + ',' + blue + ',' + ( alpha / 255 ) + ')';
		View.context.strokeStyle = strokeColor;
	}
	
	CanvasUtil.setStrokeWidth = function( wid ) {
		lineWidth = wid;
		View.context.lineWidth = wid;
	}
	
	CanvasUtil.drawCircle = function( x, y, radius, fill, stroke ) {
	  View.context.beginPath();
	  View.context.arc(x, y, radius * 0.5, 0, Math.PI * 2, true);
	  View.context.closePath();
	  if (stroke) View.context.stroke();
		if (fill) View.context.fill();
	}
	
	CanvasUtil.drawFont = function( message, x, y ) {
	  View.context.fillText(message, x, y);
	}
	
	CanvasUtil.drawLine = function( x1, y1, x2, y2 ) {
	  View.context.beginPath();
	  View.context.moveTo(x1, y1);
		View.context.lineTo(x2, y2);
		View.context.closePath();
	}
	
	CanvasUtil.drawRect = function( x, y, wid, hei, fill, stroke ) {
	  View.context.fillRect(x, y, wid, hei);
	  if (stroke) View.context.stroke();
	  if (fill) View.context.fill();
	}
	
	window.CanvasUtil = CanvasUtil;
}(window));
