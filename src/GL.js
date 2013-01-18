var Raven = Raven || {};

var gl = null;

/**

NOT FOR PRODUCTION USE YET

*/

Raven.GL = function() {}
Raven.GL.program = 0;

// Load a shader
Raven.GL.Shader = function(name, type) {
  
  this.name = name;
  this.type = type;
  
  this.shader = gl.createShader(type);
  if(this.shader == 0) {
    console.log("Raven.GL.Shader:: Error creating shader.");
    return 0;
  }
  
  this.load = function(src) {
    // load
    gl.shaderSource(this.shader, src);
    
    // compile
    gl.compileShader(this.shader);

    var compiled = gl.getShaderParameter(this.shader, gl.COMPILE_STATUS);
    if(!compiled) {
      console.log("Raven.GL.loadShader:: Error compiling shader.");
      console.log(gl.getShaderInfoLog(this.shader));
      gl.deleteShader(this.shader);
      return 0;
    }
    
    return this;
  }
  return this;
}

Raven.GL.Shape = function() {
  this.vertices = null;
  this.normals = null;
  this.texCoords = null;
  this.indices = null;
  this.numIndices = 0;
}

Raven.GL.Engine = function(context) {
  
  var that = this;
  
  gl = context;
  
  // Check for GL, if none, jump ship sucka
  if(!gl) {
    alert("WebGL failed, make sure your browser is up-to-date, broself.");
    return;
  }
  
  // Init GL
  this.init = function() {
    var program = gl.createProgram();
    if(!program) return 0;
    
    // Create  default shaders
    var defaultVertex = "";
    defaultVertex += "attribute vec4 vPosition;       \n";
    defaultVertex += "uniform float scaleX;           \n";
    defaultVertex += "uniform float scaleY;           \n";
    defaultVertex += "void main() {                   \n\t";
    defaultVertex += "gl_Position = vPosition;        \n";
    defaultVertex += "}";

    var defaultFragment = "";
    defaultFragment += "precision mediump float;                  \n";
    defaultFragment += "void main() {                             \n\t";
    defaultFragment += "gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0 ); \n";
    defaultFragment += "}";

    this.defaultVertexShader    = new Raven.GL.Shader("defaultVertex",    gl.VERTEX_SHADER);
    this.defaultFragmentShader  = new Raven.GL.Shader("defaultFragment",  gl.FRAGMENT_SHADER);
    
    this.defaultVertexShader.load(defaultVertex);
    this.defaultFragmentShader.load(defaultFragment);
    
    // Attach shaders
    gl.attachShader(program, this.defaultVertexShader.shader);
    gl.attachShader(program, this.defaultFragmentShader.shader);
    
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.log("Raven.GL.init:: Error linking program.");
      alert(gl.getProgramInfoLog(program));
    }
    
    Raven.GL.program = program;
    gl.clearColor(0.0, 0.0, 1.0, 1.0); // clear to blue for test purposes
    return true;
  }
  
  // Render
  this.render = function(width, height) {
    gl.viewport(0, 0, width, height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(Raven.GL.program);
  }
  
  // Clear GL
  this.clear = function(width, height, backgroundColor) {
    var bg = backgroundColor.gl();
    gl.clearColor(bg.r, bg.g, bg.b, bg.a);
    return this;
  }
  
  this.drawRect = function(x, y, wid, hei) {
    var vVertices = new Float32Array([ x, y, 0.0,
                                       x+wid, y, 0.0,
                                       x+wid, y+hei, 0.0,
                                       x, y+hei, 0 ]);

    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 0, vVertices);
    gl.enableVertexAttribArray(0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  }
  
}


