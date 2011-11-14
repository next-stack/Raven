function includeJS(src) {
    document.write('<script type="text/javascript" src="' + src + '"></script>');
}

includeJS("src/core/View.js");
includeJS("src/events/EventDispatcher.js");
includeJS("src/events/AbstractDispatcher.js");
includeJS("src/utils/MathUtil.js");
includeJS("src/easing/Interpolation.js");
includeJS("src/time/DateObject.js");
includeJS("src/utils/DateUtil.js");
includeJS("src/organizers/Paginator.js");
includeJS("main.js");