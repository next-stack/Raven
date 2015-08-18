// App

function AppController(params) {
    Raven.App.apply(this, arguments);

    var absolute = false,
    accel   = new Raven.Vec(0, 0, 0),
    orient  = new Raven.Vec(0, 0, 0),
    rotated = 0,
    lastRot = 0,
    start   = undefined,
    spin    = false;

    this.setup = function(viewElement, width, height, renderer) {
        Raven.App.prototype.setup.call(this, viewElement, width, height, renderer);
        this.view.background.set(32, 32, 32);
        //
        window.addEventListener("deviceorientation", evtHandler, true);
        window.addEventListener("devicemotion", evtHandler, true);
        //
        return this;
    };

    this.draw = function() {
        var g = this.view,
        x = 25,
        y = 25,
        spacing = 30;
        g.context.font = "26px Arial";

        if(spin === true) {
            g.setFillRGB(32, 102, 32);
            g.drawRect(0, 0, g.width, g.height, true);
        }

        // Draw code here
        g.setFillRGB(255, 255, 255);
        // g.drawFont( "Absolute: " + absolute.toString(), 25, y );
        g.drawFont( "Rotated: "  + rotated.toFixed(3),  x, y );

        // g.drawFont( "Acceleration", 25, spacing * 1 + y );
        // g.drawFont( "X: " + accel.x.toFixed(4), 25, spacing * 2 + y );
        // g.drawFont( "Y: " + accel.y.toFixed(4), 25, spacing * 3 + y );
        // g.drawFont( "Z: " + accel.z.toFixed(4), 25, spacing * 4 + y );

        g.drawFont( "Gyro: " + (start !== undefined ? start.toFixed(2) : "-"), x, spacing * 1 + y );
        g.drawFont( "X: " + orient.x.toFixed(2), x, spacing * 2 + y );
        g.drawFont( "Y: " + orient.y.toFixed(2), x, spacing * 3 + y );
        g.drawFont( "Z: " + orient.z.toFixed(2), x, spacing * 4 + y );
        return this;
    };

    function evtHandler(evt) {
        // absolute = evt.absolute;
        var r = Math.round;
        if(evt.type === "deviceorientation") {
            if(evt.beta  !== null) orient.x = r(evt.beta);
            if(evt.gamma !== null) orient.y = r(evt.gamma);
            if(evt.alpha !== null) {
                var z = r( evt.alpha - 180 );
                orient.z = z;
                //
                if(start === undefined) {
                    start = z;
                }
                rotated = z - start;
                if(!spin) {
                    if( Math.abs(rotated) >= 180 ) {
                        spin = true;
                    }
                }
            }
        } else if(evt.type === "devicemotion") {
            var vec = evt.accelerationIncludingGravity;
            accel.set( r(vec.x), r(vec.y), r(vec.z) );
        }
    }

    this.pause = function() {
        Raven.App.prototype.pause.call(this);
        window.removeEventListener("deviceorientation", evtHandler);
        window.removeEventListener("devicemotion", evtHandler);
        return this;
    };

    this.play  = function() {
        Raven.App.prototype.play.call(this);
        window.addEventListener("deviceorientation", evtHandler, true);
        window.addEventListener("devicemotion", evtHandler, true);
        return this;
    };

    return this;
};

AppController.extends( Raven.App );

var app = new AppController({
    'fullscreen': true,
    'mobile': true
});
app.setup("world", 800, 600, Raven.VIEW_CANVAS);
app.play();
