/**
 * This app demos basic canvas drawing / mobile support.
 */

function Box() {
  Raven.extend(this, MovieClip);
  
  this.size.set(50, 50, 0);
  
  this.renderItem = function(g) {
    g.setFillRGB(255, 0, 0);
    g.drawRect(0, 0, this.size.x, this.size.y, true);
  }
  
}

var app = Raven.makeInstance(Raven.App);

//app.fullsize = true;
//app.supportMobile = true;
app.setup(800, 600, Raven.View.VIEW_CANVAS);

var timeline = new Timeline();
//timeline.playing = false;
timeline.loadAnimation("animation.js", "json");

var mc = new Box();

app.init = function() {
  this.super.init();
}

app.mouseDown = function(mx, my) {
//  timeline.playing = !timeline.playing;
}

app.keyDown = function(evt) {
  switch(evt.keyCode) {
    case Key.LEFT:
    timeline.prevFrame();
    break;
    
    case Key.SPACE:
      timeline.playing = !timeline.playing;
    break;
    
    case Key.RIGHT:
      timeline.nextFrame();
    break;
  }
}

app.update = function() {
  timeline.update();
  if(!timeline.loading) {
    mc.setFromAni(timeline.layers[1].props);
    mc.update();
  }
}

function drawHud(g, props) {
  g.setFillRGB(255, 255, 255);
  if(timeline.loading) {
    g.drawFont("Loading Animation file...", 25, 25);
  } else {
    if(props) {
      var msg = [
        "Current Frame: " + timeline.currentFrame.toString(),
        "X: " + Math.round(props.x),
        "Y: " + Math.round(props.y),
        "Rotation: " + Math.round(props.rotationX)
      ];
      for(var i = 0; i < msg.length; ++i) g.drawFont(msg[i], 25, i * 15 + 25);
    }
  }
}

function drawCirc(renderer, x, y, wid, hei, rotation) {
  renderer.begin();
  
  var pts = 4;
  var xPos, yPos, ang;
  var div = 360 / pts;
  var halfD = div * 0.5;
  for(var i = 0; i < pts; ++i) {
    ang = Raven.degToRad(i * div + rotation + halfD);
    xPos = Math.cos(ang) * wid + x;
    yPos = Math.sin(ang) * hei + y;
    if(i == 0) {
      renderer.moveTo(xPos, yPos);
    } else {
      renderer.lineTo(xPos, yPos);
    }
  }
  
  renderer.end(true, true);
}

app.render = function() {
  var g = this.view.renderer;
  var props;
  if(!timeline.loading) {
    
    g.setLineWidth(2.5);
    g.setStrokeRGB(255, 255, 255);
    g.setFillRGB(255, 0, 0);
    var layer, keyframe, f, totalFrames = 0;
    var totalLayers = timeline.totalLayers;
    var props;
    for(var l = 0; l < totalLayers; ++l) {
      layer = timeline.layers[l];
      
      totalFrames = layer.keyframes.length;
      for(f = 0; f < totalFrames; ++f) {
        keyframe = layer.keyframes[f];
        props = keyframe.aniProps;
        if(props != null) {
          g.drawCircle(props.x, props.y, 10, false, true);
        }
      }
      
    }
    
    props = timeline.layers[1].props;
    mc.render(g);
  }
  
  drawHud(g, props);
}

app.init(app.view.canvas);
app.view.backgroundColor.set(32, 32, 32);
app.autoRender();
