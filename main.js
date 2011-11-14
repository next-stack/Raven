//____________________________________________________________________________________________________________
//------------------------------------------------------------------------------------------------------- INFO
/**
 * Testing zone for Raven.
 * Method names based off openFrameworks frameworks.
 * @author Colin Duffy
 * @date November 13, 2011
 */

//____________________________________________________________________________________________________________
//-------------------------------------------------------------------------------------------------- VARIABLES
var FRAME_RATE = 60;
var BACKGROUND_COLOR = "#000";

// HTML5 canvas stuff
var canvas;
var context;

// Mouse position
var mouseX = -1;
var mouseY = -1;

// Paginator
var pages;
// Interpolation
var ease;

//____________________________________________________________________________________________________________
//------------------------------------------------------------------------------------------------ CONSTRUCTOR

function setup()
{
	canvas = document.getElementById( 'world' );
	if (canvas && canvas.getContext) {
		// Set Styles
		context = canvas.getContext('2d');
		context.textBaseline = 'top';
		context.font         = '85% Arial';
		
		ease = new Interpolation();
		ease.speed = 0.05;
		ease.spring = 0.9;
		ease.target = 100;
		ease.start();
		
		pages = new Paginator();
		pages.items = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19 ];
		AbstractDispatcher.addEventListener(PaginationEvent.PAGE_UPDATE, onPageUpdate);
		AbstractDispatcher.addEventListener(PaginationEvent.PAGE_UNAVAILABLE, onPageUnavailable);
		
		
		// Event listeners
		document.addEventListener( 'mousemove', touchMoved, false );
		//document.addEventListener('mousedown', touchDown, false);
		//document.addEventListener('mouseup', touchUp, false);
		window.addEventListener( 'resize', windowResizeHandler, false );
		windowResizeHandler();
		
		// Begin updates
		setInterval("tick()", 1000 / FRAME_RATE);
		tick();
	} else {
		console.log( "ERROR: NO CANVAS FOUND" );
	}
}

setup();

//____________________________________________________________________________________________________________
//--------------------------------------------------------------------------------------------------- HANDLERS

function tick() {
	draw();
}

function draw()
{
	// Clear the previous frame
	context.fillStyle = BACKGROUND_COLOR;
	context.fillRect( 0, 0, canvas.width, canvas.height );
	
	//
	ease.update();
	context.fillStyle = '#333';
	context.fillRect( 100, 100, ease.target, 25 );
	context.fillStyle = '#FFF';
	context.fillRect( 100, 100, ease.value, 25 );
	context.fillStyle = '#000';
	context.fillText( 'Ease: ' + ease.value.toString(), 110, 115 );
	
}

function onPageUpdate() {
	console.log( "Items paginated", pages.currentPage );
}
function onPageUnavailable() {
	console.log( "New page unavailable!", pages.currentPage );
}

/** Receives the mouse position. */
function touchMoved( event ) {
	mouseX = event.clientX;
	mouseY = event.clientY;
}

function touchDown( event ) {
	
}

function touchUp( event ) {
	
}

//____________________________________________________________________________________________________________
//---------------------------------------------------------------------------------------------------- METHODS

/** Make sure the canvas size is 100% */
function windowResizeHandler()
{
	View.width = window.innerWidth;
	View.height = window.innerHeight;
	canvas.width  = View.width;
	canvas.height = View.height;
	tick();
}