AppController.extends( Raven.App );
function AppController(params) {
    Raven.App.apply(this, arguments);

    var _this = this;
    var imgWid = 0;
    var imgHei = 0;
    var ssWid  = 0;
    var ssHei  = 0;

    var maxW = 1024;
    var fileName = "spritesheet";

    // HTML
    
    var oFrames  = Raven.element("oFrames");
    var oColumns = Raven.element("oColumns");
    var oWidth   = Raven.element("oWidth");
    var oHeight  = Raven.element("oHeight");
    //
    this.images  = [];
    this.spacing = 1;

    this.setup = function(viewElement, width, height, renderer) {
        if(viewElement && renderer !== undefined) {
            // Setup the view
            if(renderer == Raven.VIEW_WEBGL) {
                // Raven.GLView temporarily disabled
                this.fullscreen ? this.onResize(window.innerWidth, window.innerHeight) : this.onResize(width, height);
                this.enable();
                return;
                // this.view = new Raven.GLView();
            } else
                this.view = new Raven.CanvasView();
            this.view.setup(viewElement);
            this.viewable = Raven.viewable(this.view.element);
            // Resize view
            this.fullscreen ? this.onResize(window.innerWidth, window.innerHeight) : this.onResize(width, height);
            // Clear stage
            // this.view.clear();
            // Draw base
            //this.draw();
        }
        // Enable events
        this.enable();
        //
        this.view.context.canvas.ondragover = evtHandler;
        this.view.context.canvas.ondragend  = evtHandler;
        this.view.context.canvas.ondrop     = evtHandler;
        //
        var target = Raven.element("download");
        Raven.watch( target, "click", function(evt) {
            _this.saveImage();
        });
        //
        return this;
    };

    this.clearScene = function() {
        var ctx = this.view.context;
        // get the image data object
        var image = ctx.getImageData(0, 0, ssWid, ssHei);
        // get the image data values 
        var imageData = image.data,
        length = imageData.length;
        // set every fourth value to 50
        for(var i=3; i < length; i+=4){  
            imageData[i] = 0;
        }
        // after the manipulation, reset the data
        image.data = imageData;
        // and put the imagedata back to the canvas
        ctx.putImageData(image, 0, 0);
    };

    this.draw = function() {
        this.clearScene();
        //Raven.App.prototype.draw.call(this);
        var total = this.images.length;
        if(total > 0) {
            var columns = Math.min( total, Math.floor( maxW / imgWid ) );
            var rows = Math.ceil(total / columns);
            for(var i = 0; i < total; ++i) {
                var x = (i % columns) * imgWid;
                var y = Math.floor(i / columns) * imgHei;
                var img = this.images[i];
                this.view.context.drawImage(img, x, y);
            }
        }
        this.saveImage();
        return this;
    };

    //
    
    function setupScene(img, total) {
        imgWid = img.width  + _this.spacing;
        imgHei = img.height + _this.spacing;
        var columns = Math.min( total, Math.floor( maxW / imgWid ) );
        var rows = Math.ceil(total / columns);
        ssWid = columns * imgWid;
        ssHei = rows    * imgHei;
        _this.onResize( ssWid, ssHei );
        //
        oFrames.innerHTML  = "Frames:  " + total.toString();
        oColumns.innerHTML = "Columns: " + columns.toString();
        oWidth.innerHTML   = "Width:   " + imgWid.toString();
        oHeight.innerHTML  = "Height:  " + imgHei.toString();
    };
    
    function evtHandler(evt) {
        if(evt.type == "dragover" || evt.type == "dragend") {
            return false;
        } else {
            evt.preventDefault();
            _this.images = [];
            var files = evt.dataTransfer.files,
            total = files.length,
            totalLoaded = 0;
            fileName  = files[0].name.split("_")[0];
            for(var i = 0; i < total; ++i) {
                var fRr = new FileReader();
                fRr.onload = function(event) {
                    var img = new Image();
                    img.src = event.target.result;
                    _this.images.push( img );
                    if(totalLoaded == 0) setupScene(img, total);
                    ++totalLoaded;
                    if(totalLoaded == total) {
                        _this.draw();
                    }
                }
                fRr.readAsDataURL( files[i] );
            }
        }
    };

    //

    this.saveImage  = function() {
        var target  = Raven.element("download");
        target.download = fileName + ".png";
        var canvas  = Raven.element("world");
        var dataURL = canvas.toDataURL('image/png');
        target.href = dataURL;
        return this;
    };

    return this;
};

var app = new AppController({
    'fullscreen': false,
    'mobile': false
});
app.setup("world", 800, 600, Raven.VIEW_CANVAS);
//app.autoRender();
