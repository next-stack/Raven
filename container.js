function includeJS(src) {
    document.write('<script type="text/javascript" src="src/' + src + '"></script>');
}

includeJS("core/Model.js");
includeJS("core/View.js");
includeJS("time/Time.js");

includeJS("utils/ClassUtil.js");
includeJS("utils/MathUtil.js");
includeJS("utils/CanvasUtil.js");

includeJS("events/EventDispatcher.js");
includeJS("events/AbstractDispatcher.js");

includeJS("easing/Interpolation.js");
includeJS("time/DateObject.js");
includeJS("utils/DateUtil.js");
includeJS("organizers/Paginator.js");
includeJS("geom/Point3D.js");
includeJS("geom/Sphere.js");
includeJS("physics/Particle.js");
includeJS("physics/ParticleController.js");

includeJS("core/App.js");

includeJS("DemoApp.js");