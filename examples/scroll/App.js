// App

function bound(value, _min, _max) {
    return Math.min(_max, Math.max(_min, value));
}

function AppController(params) {
    Raven.App.apply(this, arguments);

    var itemContainer = Raven.element("items");
    var scroll = {
        "change":    0,
        "previous":  window.scrollY,
        "value":     window.scrollY
    };

    var params = {
        "perspective": 1000,
        "maxRotation": 60,
        "restraint": 0.045
    };
    var animation = new Interpolation();
    animation.speed  = 0.1;
    animation.spring = 0;

    function updateScroll() {
        scroll.change   = scroll.value - scroll.previous;
        scroll.previous = scroll.value;
    }

    function updateItems() {
        var turn  = animation.value.toFixed(2);
        var style = "rotateX(" + turn + "deg)";
        var items = itemContainer.getElementsByTagName("li");
        var i, total = items.length;
        for(i = 0; i < total; ++i) {
            Raven.CSS.transform(items[i], style);
        }
        //
        style = params.perspective.toFixed(1) + "px";
        itemContainer.style[Raven.DOM.TRANSFORM_PREFIX + "perspective"] = style;
    }

    this.setup = function(viewElement, width, height, renderer) {
        Raven.App.prototype.setup.call(this, viewElement, width, height, renderer);
        //
        gui = new dat.GUI();
        gui.add(animation, 'speed',  0, 1);
        gui.add(animation, 'spring', 0, 1);
        gui.add(params, 'perspective', 100, 5000);
        gui.add(params, 'restraint', 0, 0.1);
        gui.add(params, 'maxRotation', 0, 90);
        //
        return this;
    };

    this.update = function() {
        Raven.App.prototype.update.call(this);
        animation.update();
        Ani.update();
        updateScroll();
        updateItems();
        return this;
    };

    this.onScroll = function(evt, x, y) {
        var height      = document.documentElement.offsetHeight;
        var scrollY     = height - document.documentElement.clientHeight;
        var perspective = ( (y/scrollY) * 100 );
        var style       = "50% " + perspective.toFixed(1) + "%";
        itemContainer.style[Raven.DOM.TRANSFORM_PREFIX + "perspective-origin"] = style;
        scroll.value = y;
        updateScroll();
        //
        animation.value -= scroll.change * params.restraint;
        animation.value  = bound(animation.value, -params.maxRotation, params.maxRotation);
        return this;
    };

    return this;
};

AppController.extends( Raven.App );

var app, gui;

window.onload = function() {
    app = new AppController();
    app.setup();
    app.play();
}
