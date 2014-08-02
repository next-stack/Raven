var Raven = Raven || {};

Raven.Mesh = function(verts, texCoords, colors) {
	this.mode = Raven.Mesh.PRIM_TRIANGLE_STRIP;
	var hasVerts  = verts     !== undefined && verts.length > 0,
		hasUVs    = texCoords !== undefined && texCoords.length > 0,
		hasColors = colors    !== undefined && colors.length > 0;
	// Vertex
	if(hasVerts) {
		this.bufferVertex = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertex);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
	}
	// UV
	if(hasUVs) {
		this.bufferUV = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferUV);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
	}
	// Colors
	if(hasColors) {
		this.bufferColor = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferColor);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
	}
	//
	this.draw = function(program) {
		if(hasVerts) {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferVertex);
			gl.vertexAttribPointer(program.aPosition, 3, gl.FLOAT, false, 0, 0);
		}
		if(hasUVs) {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferUV);
			gl.vertexAttribPointer(program.aTexCoord, 2, gl.FLOAT, false, 0, 0);
		}
		if(hasColors) {
			gl.bindBuffer(gl.ARRAY_BUFFER, this.bufferColor);
			gl.vertexAttribPointer(program.aColor, 4, gl.FLOAT, false, 0, 0);
		}
		gl.drawArrays(this.mode, 0, verts.length / 3);
	};
	return this;
};

// Draw mode
Raven.Mesh.PRIM_POINTS			= 0;
Raven.Mesh.PRIM_LINES			= 1;
Raven.Mesh.PRIM_LINE_LOOP		= 2;
Raven.Mesh.PRIM_LINE_STRIP		= 3;
Raven.Mesh.PRIM_TRIANGLES		= 4;
Raven.Mesh.PRIM_TRIANGLE_STRIP	= 5;
Raven.Mesh.PRIM_TRIANGLE_FAN	= 6;

Raven.Mesh.Plane = function(x, y, z, wid, hei, rows, columns) {
	var verts  = [
		x,		y,		z,
		x+wid,	y,		z,
		x,		y+hei,	z,
		x+wid,	y+hei,	z
	];
	var UVs    = [
		0,	0,
		1,	0,
		0,	1,
		1,	1
	];
	var colors = [
		1.0,	1.0,	1.0,	1.0,
		1.0,	1.0,	1.0,	1.0,
		1.0,	1.0,	1.0,	1.0,
		1.0,	1.0,	1.0,	1.0
	];
	return new Raven.Mesh(verts, UVs, colors);
};

Raven.Shader = function(type, src) {
	this.shader = gl.createShader(type);
	gl.shaderSource(this.shader, src);
	gl.compileShader(this.shader);
	if(!gl.getShaderParameter(this.shader, gl.COMPILE_STATUS)) {
		console.warn("Could not compile Shader:\n", src);
		return null;
	}
	this.begin = function() {};
	this.end   = function() {};
	return this;
};
