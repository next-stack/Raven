function Interpolation() {
    this.speed    = 0.1;
    this.target   = 0;
    this.value    = 0;
    this.velocity = 0;
    this.object   = undefined;
    this.aniVar   = undefined;
    //
    this.update = function() {
        this.velocity = (this.target - this.value) * this.speed;
        this.value   += this.velocity;
        this.object[this.aniVar] = this.value;
        return this;
    };
    return this;
};

Interpolation.prototype.__defineGetter__("complete", function(){
    return Math.round( this.target ) == Math.round( this.value ) && this.velocity < 0.01;
});

function InterpolationVec() {
    this.speed    = 0.1;
    this.target   = new Raven.Vec(0, 0, 0);
    this.value    = new Raven.Vec(0, 0, 0);
    this.velocity = new Raven.Vec(0, 0, 0);
    this.object   = undefined;
    this.aniVar   = undefined;
    //
    this.update = function() {
        this.velocity.x = (this.target.x - this.value.x) * this.speed;
        this.velocity.y = (this.target.y - this.value.y) * this.speed;
        this.velocity.z = (this.target.z - this.value.z) * this.speed;
        this.value.x   += this.velocity.x;
        this.value.y   += this.velocity.y;
        this.value.z   += this.velocity.z;
        this.object[this.aniVar].x = this.value.x;
        this.object[this.aniVar].y = this.value.y;
        this.object[this.aniVar].z = this.value.z;
        return this;
    };
    return this;
};

InterpolationVec.prototype.__defineGetter__("complete", function(){
    return  Math.round( this.target.x ) == Math.round( this.value.x ) &&
            Math.round( this.target.y ) == Math.round( this.value.y ) &&
            Math.round( this.target.z ) == Math.round( this.value.z ) &&
            this.velocity.length() < 0.01;
});

function InterpolationController() {
    this.anis = [];

    this.update = function() {
        for(var i = 0; i < this.anis.length; ++i) {
            this.anis[i].update();
            if(this.anis[i].complete) {
                this.anis.splice(i, 1);
            }
        }
        return this;
    };

    this.to = function(obj, target, destination, speed) {
        var ani;
        var index  = this.getTween(obj, target);
        var start  = obj[target];
        if( index > -1 ) {
            ani = this.anis[index];
        } else {
            if(typeof start === "number") {
                ani = new Interpolation();
            } else {
                ani = new InterpolationVec();
            }
            this.anis.push( ani );
        }

        ani.speed  = speed !== undefined ? speed : 0.1;
        ani.target = destination;
        ani.value  = start;
        ani.object = obj;
        ani.aniVar = target;
        
        return this;
    };

    this.getTween = function(obj, target) {
        var i, total = this.anis.length;
        for(i = 0; i < total; ++i) {
            if(this.anis[i].object === obj && this.anis[i].aniVar === target) {
                return i;
            }
        }
        return -1;
    };

    this.hasTween = function(obj, target) {
        return this.getTween(obj, target) > -1;
    };

    return this;
};

Box.extends( Raven.DisplayObject );
function Box(params) {
    Raven.DisplayObject.apply(this, arguments);

    this.position.set(200, 200, 0);
    this.size.set(200, 200, 0);

    this.update = function() {
        // this.rotation.z += 1;
        return this;
    };

    this.render = function(g) {
        // var offset = this.size.multiply(-0.5);
        g.setFillB(0);
        g.setLineWidth(4);
        g.setStrokeB(204);
        g.drawRect(0, 0, this.size.x, this.size.y, true, true);

        g.setFillB(255);
        g.drawFont("Hello world", 10, 15);
    };

    return this;
};

// App

function AppController(params) {
    Raven.App.apply(this, arguments);

    var box;

    this.setup = function(viewElement, width, height, renderer) {
        Raven.App.prototype.setup.call(this, viewElement, width, height, renderer);
        this.view.background.set(32, 32, 32);

        ease = new InterpolationController();

        // Setup stage
        box = new Box();
        this.stage.addChild( box );
        
        return this;
    };

    this.update = function() {
        Raven.App.prototype.update.call(this);
        ease.update();
        return this;
    };

    this.draw = function() {
        Raven.App.prototype.draw.call(this);
        // Draw code here
        return this;
    };

    this.onTouchDown = function(id, x, y) {
        var destination = new Raven.Vec(x, y, 0);
        ease.to(box, 'position', destination, 0.1);
        // ease.to( box.position, 'x', x, 0.1 );
        // ease.to( box.position, 'y', y, 0.1 );
    }

    return this;
};

AppController.extends( Raven.App );

var ease;
var app = new AppController({
    'fullscreen': true,
    'mobile': true
});
app.setup("world", 800, 600, Raven.VIEW_CANVAS);
app.autoRender();
