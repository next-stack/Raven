(function (window) {

  // Singleton
  var View = View || {};
  View.canvas = null;
  View.context = null;
  View.x = 0;
  View.y = 0;
  View.width = 0;
  View.height = 0;
  View.halfWidth = 0;
  View.halfHeight = 0;
	View.pixelRatio = window.devicePixelRatio;
  View.rotationX = 0;
  View.rotationY = 0;
  View.rotationZ = 0;
	View.accelerationX = 0;
	View.accelerationY = 0;
	View.accelerationZ = 0;

  View.size = function (wid, hei) {
    View.width = wid;
    View.height = hei;
    View.halfWidth = wid * 0.5;
    View.halfHeight = hei * 0.5;
    if (View.canvas) {
      View.canvas.width = wid;
      View.canvas.height = hei;
    }
  }

  View.clearBackground = function (BACKGROUND_COLOR) {
    if (!View.context) return;
    View.context.fillStyle = BACKGROUND_COLOR;
    View.context.fillRect(View.x, View.y, View.width, View.height);
  }
	
  window.View = View;
} (window));