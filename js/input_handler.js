var g_keyDown = [];
var g_keyHit = [];
var g_mouseHit = [false, false];
var g_mouseDown = [false, false];
var g_mouseX = [0, 0];
var g_mouseY = [0, 0];
var g_mousePrevX = [0, 0];
var g_mousePrevY = [0, 0];
var g_mouseOldX = [[0], [0]];
var g_mouseOldY = [[0], [0]];
var g_mouseStartX = [0, 0];
var g_mouseStartY = [0, 0];

document.addEventListener("touchstart", function(e){TouchHandler(e);}, false);
document.addEventListener("touchcancel", function(e){TouchHandler(e);}, false);
document.addEventListener("touchmove", function(e){TouchHandler(e);}, false);
document.addEventListener("touchend", function(e){TouchHandler(e);}, false);

window.addEventListener("keydown", KeyInput, false);
window.addEventListener("keyup", KeyInput, false);

function InputSetup()
{
	canvas.addEventListener("mousedown", MouseHandler, false);
	canvas.addEventListener("mousemove", MouseHandler, false);
	document.body.addEventListener("mouseup", MouseHandler, false);
	document.body.addEventListener("mousewheel", MouseHandler, false);
	document.body.addEventListener("DOMMouseScroll", MouseHandler, false);
}

function HandleInput( event, pTouch, touchIndex )
{
	var x = 0;
	var y = 0;
	
	g_lastInputTime = g_now;
	
	if( event.type!='touchmove' && event.type!='mousemove' )
	{
		//log("HandleInput( "+event.type+", "+pTouch+", "+touchIndex+" )");
	}
	
	// Get click position.
	if( pTouch )
	{
		
		x = pTouch.pageX;
		y = pTouch.pageY;
		
		var styleDetected = false;
		
		var gameArea = document.getElementById('gameArea');
		
		x -= gameArea.offsetLeft;
		y -= gameArea.offsetTop;
		
	}
	else
	{
		if( event.x == undefined )
		{
			x = event.clientX;
			y = event.clientY;
		}
		else
		{
			x = event.x;
			y = event.y;
		}
		
		var gameArea = document.getElementById('gameArea');
		
		x -= gameArea.offsetLeft;
		y -= gameArea.offsetTop;
	}
	
	if (event.type == "touchstart" || event.type == "mousedown" )
	{
		PassInput( "mousedown", touchIndex, x, y );
	}
	else if (event.type == "touchmove" || event.type == "mousemove" )
	{
		PassInput( "mousemove", touchIndex, x, y );
	}
	else if( ( event.type == "touchend" ) || ( event.type == "mouseup" ) )
	{
		PassInput( "mouseup", touchIndex, x, y );
	}
	else if( event.type == "touchcancel" )
	{
		PassInput( "mouseup", touchIndex, x, y );
	}
	else if( ( event.type == "mousewheel" ) || ( event.type == "DOMMouseScroll" ) )
	{
	}
	
}

function KeyInput( event )
{
	var c = event.keyCode;
	
	var x = 0, y = 0;
	
	PassInput( event.type, c, x, y );
}

// Returns true if the key was just pressed this loop.
function KeyHit( key )
{
	if( g_keyHit[key] )
	{
		g_keyHit[key] = 0;
		return true;
	}
	else
	{
		return false;
	}
}

function MouseHandler( event )
{
	HandleInput( event );
}


