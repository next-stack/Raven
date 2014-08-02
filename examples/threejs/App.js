AppController.extends( Raven.App );

function AppController(params) {
    Raven.App.apply(this, arguments);

    this.camera = undefined;
    this.scene = undefined;
    this.renderer = undefined;
    this.cameraTarget = new THREE.Vector3(0, 0.5, 0);

    this.setup = function(viewElement, width, height, renderer) {
        Raven.App.prototype.setup.call(this, viewElement, width, height, renderer);
        this.setupScene();
        return this;
    };

    this.draw = function() {
        // Update camera position
        var radius = 3;
        var time = this.frameNum * 0.005;
        var x = Math.cos(time) * radius,
            z = Math.sin(time) * radius;
        this.camera.position.set(x, this.camera.position.y, z);
        this.camera.lookAt( this.cameraTarget );

        // Render scene
        this.renderer.render( this.scene, this.camera );
        return this;
    };

    this.setupScene = function() {
        // Scene
        this.scene  = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.camera.position.set(0, 1.5, 10);

        // Renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );

        // Lights
        var light = new THREE.PointLight( 0xf1ffd7, 0.75, 0 );
        light.position.set( 1, 2, 1 );
        this.scene.add( light );

        // Floorground
        var geometry = new THREE.PlaneGeometry( 200, 200 );
        var material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
        var mesh = new THREE.Mesh( geometry, material );
        mesh.rotation.x = Raven.degToRad(-90);
        this.scene.add( mesh );

        // Placeholder mesh
        var geometry = new THREE.BoxGeometry(1,1,1);
        var material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.set(0, 0.5, 0);
        this.scene.add( mesh );
    };

    return this;
};

var app = new AppController();
app.setup();
app.autoRender();
