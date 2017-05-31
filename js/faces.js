var GameState = {
	"MAIN_MENU": 0,
};

document.ontouchstart = function(e){
	e.preventDefault();
}

window.requestAnimFrame = (function(){
						   return  window.requestAnimationFrame       ||
						   window.webkitRequestAnimationFrame ||
						   window.mozRequestAnimationFrame    ||
						   function( callback ){
						   window.setTimeout(callback, 1000 / 60);
						   };
						   })();

var m_mobile = false;


function Init()
{
	FillRandomTable();
	
	var canvas = document.getElementById("canvas");
	
	if( !IsPhoneGap() )
	{
		InputSetup();
	}
	
	m_canvasWidth = canvas.width;
	m_canvasHeight = canvas.height;
	
	m_touchEvents = false;
	
	ResizeGame();
	
	RandomizeHairPlacement();
	
	m_gameState = GameState.MAIN_MENU;
	
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	
	SetupSound();
	
	ResizeElements();
	
	//	setInterval('draw()', 33);
	//	setInterval('drawTest()', 33 );
	
	(function animloop(){
	 requestAnimFrame(animloop);
	 Animate();
	 Draw();
	 })();
}

var m_pMainButtons = [];
var m_sliderStartIndex = 0;
function InitButtons()
{
	var midX = m_canvasWidth / 2;
	var midY = m_canvasHeight / 2;
	var buttonWidth = 6;
	var buttonHeight = 3;
	
	var buttonY = 1;
	var buttonX = 1;
	
	var buttonIndex = 0;
	
	m_pMainButtons.length = 0;
	
	AddButton( m_pMainButtons,
			  1,
			  buttonY,
			  buttonWidth,
			  buttonHeight,
			  "Randomize", RandomizeFace );
	
	AddButton( m_pMainButtons,
			  2 + buttonWidth,
			  buttonY,
			  ( m_numBlocksWide - 4 ) - ( 2 * buttonWidth ),
			  buttonHeight,
			  "Face maker", null );
	
	buttonX = 2;
	buttonY += 14;
	var leftButtonWidth = 5;
	var rightButtonWidth = ( m_numBlocksWide - ( leftButtonWidth + (buttonX * 3 ) ) );
	buttonWidth = Math.floor( ( m_numBlocksWide - ( buttonX * 3 ) ) / 2 );
	buttonHeight = 2;
	
	m_sliderStartIndex = m_pMainButtons.length + 1;
	AddButton( m_pMainButtons,
			  buttonX,
			  buttonY,
			  leftButtonWidth,
			  buttonHeight,
			  "Face", null );
	
	AddSlider( m_pMainButtons,
			  m_numBlocksWide - ( rightButtonWidth + buttonX ),
			  buttonY,
			  rightButtonWidth,
			  buttonHeight,
			  MorphFace );
	
	buttonY += 3;
	AddButton( m_pMainButtons,
			  buttonX,
			  buttonY,
			  leftButtonWidth,
			  buttonHeight,
			  "Nose", null );
	
	AddSlider( m_pMainButtons,
			  m_numBlocksWide - ( rightButtonWidth + buttonX ),
			  buttonY,
			  rightButtonWidth,
			  buttonHeight,
			  MorphNose );
	
	buttonY += 3;
	AddButton( m_pMainButtons,
			  buttonX,
			  buttonY,
			  leftButtonWidth,
			  buttonHeight,
			  "Eyes", null );
	
	AddSlider( m_pMainButtons,
			  m_numBlocksWide - ( rightButtonWidth + buttonX ),
			  buttonY,
			  rightButtonWidth,
			  buttonHeight,
			  MorphEyes );
	
	buttonY += 3;
	AddButton( m_pMainButtons,
			  buttonX,
			  buttonY,
			  leftButtonWidth,
			  buttonHeight,
			  "Ears", null );
	
	AddSlider( m_pMainButtons,
			  m_numBlocksWide - ( rightButtonWidth + buttonX ),
			  buttonY,
			  rightButtonWidth,
			  buttonHeight,
			  MorphEars );
	
	buttonY += 3;
	AddButton( m_pMainButtons,
			  buttonX,
			  buttonY,
			  leftButtonWidth,
			  buttonHeight,
			  "Beard", null );
	
	AddSlider( m_pMainButtons,
			  m_numBlocksWide - ( rightButtonWidth + buttonX ),
			  buttonY,
			  rightButtonWidth,
			  buttonHeight,
			  ChangeBeard );
	
	buttonY += 3;
	AddButton( m_pMainButtons,
			  buttonX,
			  buttonY,
			  leftButtonWidth,
			  buttonHeight,
			  "Stubble", null );
	
	AddSlider( m_pMainButtons,
			  m_numBlocksWide - ( rightButtonWidth + buttonX ),
			  buttonY,
			  rightButtonWidth,
			  buttonHeight,
			  ChangeBeardStubble );
	
	buttonY += 3;
	AddButton( m_pMainButtons,
			  buttonX,
			  buttonY,
			  leftButtonWidth,
			  buttonHeight,
			  "Hair", null );
	
	AddSlider( m_pMainButtons,
			  m_numBlocksWide - ( rightButtonWidth + buttonX ),
			  buttonY,
			  rightButtonWidth,
			  buttonHeight,
			  ChangeHair );
	
}

function AddButton( pButtonArray, x, y, w, h, pText, pFunction )
{
	var arrayLength = pButtonArray.length;
	pButtonArray[arrayLength] = new ButtonClass();
	pButtonArray[arrayLength].Init( x, y, w, h, pText, pFunction );
}

function AddSlider( pButtonArray, x, y, w, h, pFunction )
{
	var arrayLength = pButtonArray.length;
	pButtonArray[arrayLength] = new SliderClass();
	pButtonArray[arrayLength].Init( x, y, w, h, pFunction );
}

var m_pHairX = [];
var m_pHairY = [];
function RandomizeHairPlacement()
{
	var variability = m_blockSize / 50;
	
	for( var i = 0; i < 20; i++ )
	{
		var randX = Random() * variability - ( variability / 2 );
		var randY = Random() * variability - ( variability / 2 );
		
		randX -= 0.1;
		
		m_pHairX[i] = randX;
		m_pHairY[i] = randY;
	}
}

function RandomizeFace()
{
	RandomizeHairPlacement();
	
	m_pMainButtons[m_sliderStartIndex+0].SetValue( Random() );
	m_pMainButtons[m_sliderStartIndex+2].SetValue( Random() );
	m_pMainButtons[m_sliderStartIndex+4].SetValue( Random() );
	m_pMainButtons[m_sliderStartIndex+6].SetValue( Random() );
	m_pMainButtons[m_sliderStartIndex+8].SetValue( Random() );
	m_pMainButtons[m_sliderStartIndex+10].SetValue( Random() );
}

var m_hairValue = 0.5;
var HairType = {
	"NONE":		0,
	"SHORT":	1,
	"SHORT2":	2,
	"LONG":		3,
	"LONG2":	4,
	"LONG3":	5,
	"MOHAWK":	6,
	"LAST":		7
};
function ChangeHair( value )
{
	var hairSliderValueDiff = 1 / ( HairType.LAST );
	m_hairValue = Math.floor( value / hairSliderValueDiff );
	if( m_hairValue == HairType.LAST )
	{
		m_hairValue = HairType.LAST - 1;
	}
	log( "m_hairValue " + m_hairValue );
}

var m_minBeardStubble = 6;
var m_maxBeardStubble = 1;
var m_currentBeardStubble = 4;
function ChangeBeardStubble( value )
{
	m_currentBeardStubble = Math.floor( ( m_maxBeardStubble - m_minBeardStubble ) * value ) + m_minBeardStubble;
}

var m_beardValue = 0.5;
var BeardType = {
	"NONE": 0,
	"GOATEE": 1,
	"BEARD": 2,
	"FULL": 3,
	"LAST": 4
};
var m_beardMin = [10.75, 12, .5, 1, 0.16];
var m_beardMax = [9, 11.75, 2, 0.75, 0.1];
var m_beardCurrent = [9.5, 11.75, 1.25, 0.75, 0.16];
function ChangeBeard( value )
{
	var beardSliderValueDiff = 1 / ( BeardType.LAST );
	m_beardValue = Math.floor( value / beardSliderValueDiff );
	if( m_beardValue == BeardType.LAST )
	{
		m_beardValue = BeardType.LAST - 1;
	}

	//log( "m_beardValue " + m_beardValue );
}

var m_faceMin = [ 10, 10, 1, 3 ];
var m_faceMax = [ 10, 10, 3, 3 ];
var m_faceCurrent = [ 10, 10, 2, 3 ];
var m_faceFeaturesMin = -0.5;
var m_faceFeaturesMax = 0.75;
var m_faceFeaturesCurrent = 0;
function MorphFace( value )
{
	for( var i = 0; i < 4; i++ )
	{
		m_faceCurrent[i] = ( ( m_faceMax[i] - m_faceMin[i] ) * value ) + m_faceMin[i];
	}
	
	for( var i = 0; i < 5; i++ )
	{
		m_beardCurrent[i] = ( ( m_beardMax[i] - m_beardMin[i] ) * value ) + m_beardMin[i];
	}
	
	m_faceFeaturesCurrent = ( ( m_faceFeaturesMax - m_faceFeaturesMin ) * value ) + m_faceFeaturesMin;
}

var m_noseMin = [11.75, 9.5, 0.75, 0.5];//[ 11.75, 10, 0.75, 1 ];
var m_noseMax = [13, 10.25, 2.5, 1.25];//[ 13, 10, 2.5, 2 ];
var m_noseCurrent = [ 12.25, 10, 1.5, 1 ];
function MorphNose( value )
{
	for( var i = 0; i < 4; i++ )
	{
		m_noseCurrent[i] = ( ( m_noseMax[i] - m_noseMin[i] ) * value ) + m_noseMin[i];
	}
}

var m_eyeMin = [ 11.85, 9, 0.75, 0.35 ];
var m_eyeMax = [ 11.85, 8.5, 1, 1 ];
var m_eyeCurrent = [ 11.85, 8.6, 0.75, 0.85 ];
function MorphEyes( value )
{
	for( var i = 0; i < 4; i++ )
	{
		m_eyeCurrent[i] = ( ( m_eyeMax[i] - m_eyeMin[i] ) * value ) + m_eyeMin[i];
	}
}

var m_earMin = [ 8.25, 9.75, 0.35, 0.5 ];
var m_earMax = [ 8.25, 9.75, 1, 2 ];
var m_earCurrent = [ 8.25, 9.75, .5, 1 ];
function MorphEars( value )
{
	for( var i = 0; i < 4; i++ )
	{
		m_earCurrent[i] = ( ( m_earMax[i] - m_earMin[i] ) * value ) + m_earMin[i];
	}
}

function Alert( string )
{
	alert( string );
}


var m_phoneGap = false;
function IsPhoneGap()
{
	return m_phoneGap;
}


function ResizeGame() {
	log( "ResizeGame() started! " + m_canvasWidth + ", " + m_canvasHeight );
	
	var gameArea = document.getElementById('gameArea');
	var newWidth = window.innerWidth;
	var newHeight = window.innerHeight;
	
	
	m_blockSize = Math.floor( newWidth / m_minBlocksWide );
	var blocksHigh = Math.floor( newHeight / m_blockSize );
	if( blocksHigh < m_minBlocksHigh )
	{
		m_blockSize = Math.floor( newHeight / m_minBlocksHigh );
	}
	
	m_numBlocksWide = Math.floor( newWidth / m_blockSize );
	m_numBlocksHigh = Math.floor( newHeight / m_blockSize );
	
	var boardWidth = m_numBlocksWide * m_blockSize;
	var boardHeight = m_numBlocksHigh * m_blockSize;
	
	m_gameOffsetX = ( newWidth - boardWidth ) / 2;
	m_gameOffsetY = ( newHeight - boardHeight ) / 2;
	
	newWidth = boardWidth;
	newHeight = boardHeight;
	
	gameArea.style.width = newWidth + 'px';
	gameArea.style.height = newHeight + 'px';
	
	gameArea.style.marginTop = (-newHeight / 2) + 'px';
	gameArea.style.marginLeft = (-newWidth / 2) + 'px';
 
	var gameCanvas = document.getElementById('canvas');
	gameCanvas.width = newWidth;
	gameCanvas.height = newHeight;
	
	m_canvasWidth = gameCanvas.width;
	m_canvasHeight = gameCanvas.height;
	
	//  * window.devicePixelRatio
	m_fpsFontSize = Math.round( m_blockSize * 0.25 );
	m_gameFontSize1 = Math.round( m_blockSize * 0.75 ) + "px Arial";
	m_gameFontSize2 = Math.round( m_blockSize * 2 ) + "px Arial";
	
	// shouldn't get called the first time?
	ResizeElements();
	
	InitButtons();

	log( "ResizeGame() finished! " + m_canvasWidth + ", " + m_canvasHeight );
}

function ResizeElements()
{
	log( "ResizeElements started! " + m_canvasWidth + ", " + m_canvasHeight );
	
	var canvas = document.getElementById("canvas");
	
	var ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;
	ctx.webkitImageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled = false;
	
	for( var i = 0; i < m_pMainButtons.length; i++ )
	{
		m_pMainButtons[i].ResizeElements();
	}
	
	log( "ResizeElements finished! " + m_canvasWidth + ", " + m_canvasHeight );
}

var m_nextLevelTimer = 0;
var m_nextLevelTimerCount = 2; // 2 sesconds
var g_now = new Date().getTime();
var m_lastDrawTime = g_now;

function Animate()
{
	var dt = 1/60.0;
	var now = new Date().getTime();
	dt = ((now-g_now) / 1000);
	g_now = Date.now();
	
	m_tickTime += dt;
	if( m_tickTime > TICK_TIME )
	{
		m_tickTime -= TICK_TIME;
		
		m_gameTicks++;
		if( m_gameTicks > MAX_TICKS )
		{
			m_gameTicks = 0;
		}
	}
	
	AnimateSounds();
}

var m_addNewWordTimer = 0;
var NEW_WORD_TIMER = 2; // 2 seconds

var counter = 0;
function Draw()
{
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	
	if( m_textureLoadCount != m_prevTextureLoadCount )
	{
		ResizeElements();
		m_prevTextureLoadCount = m_textureLoadCount;
	}
	
	ctx.save();
	{
		if(window.devicePixelRatio == 2)
		{
			canvas.setAttribute('width', m_canvasWidth * 2);
			canvas.setAttribute('height', m_canvasHeight * 2);
			ctx.scale(2, 2);
		}
		
		ctx.clearRect(0, 0, m_canvasWidth, m_canvasHeight ); // clear canvas
		
		ctx.fillStyle = m_backgroundColor;
		ctx.fillRect( 0, 0, m_canvasWidth, m_canvasHeight );
		
		if( m_gameState == GameState.MAIN_MENU )
		{
			ctx.fillStyle = m_darkBlue;
			
			ctx.font = m_gameFontSize1;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			
			for( var i = 0; i < m_pMainButtons.length; i++ )
			{
				m_pMainButtons[i].Draw( ctx );
			}
			
			ctx.fillStyle = m_backgroundColor;
			ctx.lineWidth = window.devicePixelRatio * 1.0;
			
			ctx.save();
			{
				ctx.translate( ( m_numBlocksWide - m_minBlocksWide ) / 2 * m_blockSize, ( m_numBlocksHigh - m_minBlocksHigh ) / 2 * m_blockSize );
				
				ctx.translate( 0, -m_blockSize * 2 );
				
				if( m_hairValue == HairType.MOHAWK )
				{
					DrawHair( ctx, 10, 8.75, 1.7 );
				}
				
				// face
				DrawArcPath( ctx, m_faceCurrent[0], m_faceCurrent[1], m_faceCurrent[2], m_faceCurrent[3], 0, 2, true );
				
				ctx.save()
				{
					if( m_hairValue == HairType.LONG ||
					   m_hairValue == HairType.LONG2 ||
					   m_hairValue == HairType.LONG3 ||
					   m_hairValue == HairType.NONE )
					{
						DrawHair( ctx, 10, 8.75, 1.7 );
					}
					
					ctx.translate( m_blockSize * -m_faceFeaturesCurrent, 0 );
					
					// hair
					if( m_hairValue == HairType.SHORT ||
						m_hairValue == HairType.SHORT2 )
					{
						DrawHair( ctx, 10, 8.75, 1.7 );
					}
					
					// ear
					DrawEar( ctx, m_earCurrent[0], m_earCurrent[1], m_earCurrent[2], m_earCurrent[3] );
				}
				ctx.restore();
				
				ctx.save()
				{
					DrawArcPath( ctx, m_faceCurrent[0], m_faceCurrent[1], m_faceCurrent[2], m_faceCurrent[3], 0, 2, false, 0, true );
					ctx.translate( m_blockSize * m_faceFeaturesCurrent, 0 );
					
					ctx.save();
					{
						ctx.clip();
						DrawBeard( ctx );
					}
					ctx.restore();
					
					
					// right eye
					DrawEye( ctx, m_eyeCurrent[0], m_eyeCurrent[1], m_eyeCurrent[2], m_eyeCurrent[3] );
					
					// nose
					DrawArcPath( ctx, m_noseCurrent[0], m_noseCurrent[1], m_noseCurrent[2], m_noseCurrent[3], 1.25, 2.75, true ); // medium
					
					// left eye
					DrawEye( ctx, m_eyeCurrent[0] - 0.85, m_eyeCurrent[1], m_eyeCurrent[2], m_eyeCurrent[3] );
					
					// smile
					DrawArcPath( ctx, 12, 11, 2, 1, 2.6, 2.75, false );
					
				}
				ctx.restore();
				
			}
			ctx.restore();
		}
		
		var d2 = new Date();
		frameTimer.EndTimer(d2.getTime());
		
		ctx.textAlign = 'left';
		ctx.textBaseline = 'bottom';
		//frameTimer.DrawFPS( ctx );
		
		var d1 = new Date();
		frameTimer.StartTimer(d1.getTime());
		
	}
	ctx.restore();
	
	counter++;
	if( counter > 3000 )
	{
		counter = 0;
	}
	
	//	m_lastDrawTime = g_now;
	
	// this line below unlocks super fast framrate on browsers, but not on mobile which is why its commented out
	//window.requestAnimationFrame(draw, canvas); //???
}

function DrawBeard( ctx )
{
	
	ctx.setLineDash([1,m_currentBeardStubble]);
	
	if( m_beardValue == BeardType.NONE )
	{
		// do nothing
	}
	if( m_beardValue == BeardType.FULL || m_beardValue == BeardType.GOATEE )
	{
		ctx.lineWidth = window.devicePixelRatio * 4.0;
		DrawArcPath( ctx, 11.3, 12, 1.2, 0.5, 0.0, 2.0, false, 0.16 );
	}
	if( m_beardValue == BeardType.FULL || m_beardValue == BeardType.BEARD )
	{
		ctx.lineWidth = window.devicePixelRatio * 12.0;
		DrawArcPath( ctx, m_beardCurrent[0], m_beardCurrent[1], m_beardCurrent[2], m_beardCurrent[3], 0.0, 1.0, false, m_beardCurrent[4] );
		//DrawArcPath( ctx, 9.5, 11.75, 1.25, 0.75, 0.0, 1.0, false, 0.16 );
		//DrawArcPath( ctx, 10.75, 12, .5, 1, 0.0, 1.0, false, 0.16 );
		//DrawArcPath( ctx, 9, 11.75, 2, 0.75, 0.0, 1.0, false, 0.1 );
	}
	
	ctx.lineWidth = window.devicePixelRatio * 1.0;
	ctx.setLineDash([]);
}

function DrawEar( ctx, x, y, w, h )
{
	DrawArcPath( ctx, x, y, w, h, 0.15, 1.85, true );
	DrawArcPath( ctx, x, y, w / 2, h / 2, 1.25, 1.75, true );
	DrawArcPath( ctx, x + w / 2, y - h / 3, w / 2, h / 2, 2.65, 1, true );
}

function DrawEye( ctx, x, y, w, h )
{
	DrawArcPath( ctx, x, y, w, h, 0, 2, true );
	
	// right eyeball
	ctx.fillStyle = m_darkBlue;
	ctx.beginPath();
	ctx.arc(m_blockSize * ( x + 0.35 ), m_blockSize * y,m_blockSize*0.1,0,2*Math.PI);
	ctx.fill();
	ctx.closePath();
	ctx.fillStyle = m_backgroundColor;
	
}

function DrawHair( ctx, x, y, size )
{
	var originalX = x;
	var originalY = y;
	
	if( m_hairValue == HairType.NONE )
	{
		DrawArcPath( ctx, 10.25, 9.35, 0.5, 3, 1.25, 1.5, false );
		DrawArcPath( ctx, 10.75, 10, 0.75, 4, 1.25, 1.5, false );
		DrawArcPath( ctx, 9.15, 7.35, 0.5, 1.25, 1.5, 2, false );
	}
	if( m_hairValue == HairType.SHORT )
	{
		for( var i = 0; i < 10; i++ )
		{
			x = originalX + m_pHairX[i];
			y = originalY + m_pHairY[i];;
			
			ctx.save();
			ctx.beginPath();
			
			ctx.arc( x * m_blockSize, y * m_blockSize, size * m_blockSize, 1*Math.PI, 1.5*Math.PI);
			ctx.arc( x * m_blockSize, y * m_blockSize - (size * ( m_blockSize * 2 ) ), size * m_blockSize, 0.5*Math.PI, 0.15*Math.PI, true);
			
			ctx.stroke();
			ctx.closePath();
			
			ctx.restore();
		}
	}
	if( m_hairValue == HairType.SHORT2 )
	{
		for( var i = 0; i < 10; i++ )
		{
			x = originalX + m_pHairX[i];
			y = originalY + m_pHairY[i];;
			
			ctx.save();
			ctx.beginPath();
			
			ctx.arc( x * m_blockSize, y * m_blockSize, size * m_blockSize, 1*Math.PI, 1.8*Math.PI);
			
			ctx.stroke();
			ctx.closePath();
			
			ctx.restore();
		}
	}
	if( m_hairValue == HairType.LONG )
	{
		for( var i = 0; i < 20; i++ )
		{
			x = originalX + m_pHairX[i] * 2;
			y = originalY + m_pHairY[i];;
			
			ctx.save();
			ctx.beginPath();
			
			DrawArc( ctx, m_faceCurrent[0] + m_pHairX[i] * 2, m_faceCurrent[1] + m_pHairY[i], m_faceCurrent[2], m_faceCurrent[3], -0.25, 1, 0, true );
			//ctx.lineTo( 0, 0 );
			
			DrawArc( ctx, ( m_faceCurrent[0] + m_pHairX[i] * 1.75 ) - ( m_faceCurrent[2] * 2 ), m_faceCurrent[1] - m_pHairY[i] + 0.25, m_faceCurrent[2], m_faceCurrent[3] * 2, 2, .25, 0, false );
			
			ctx.stroke();
			ctx.closePath();
			
			ctx.restore();
			
		}
	}
	if( m_hairValue == HairType.LONG2 )
	{
		for( var i = 0; i < 20; i++ )
		{
			x = originalX + m_pHairX[i] * 2;
			y = originalY + m_pHairY[i];;
			
			ctx.save();
			ctx.beginPath();
			
			DrawArc( ctx, m_faceCurrent[0] + m_pHairX[i] * 2, m_faceCurrent[1] + m_pHairY[i], m_faceCurrent[2], m_faceCurrent[3], -0.25, 1, 0, true );
			//ctx.lineTo( 0, 0 );
			
			DrawArc( ctx, m_faceCurrent[0] + m_pHairX[i] * 2, m_faceCurrent[1] + m_pHairY[i], m_faceCurrent[2], m_faceCurrent[3] * 1.5, 1, .65, 0, true );
			
			ctx.stroke();
			ctx.closePath();
			
			ctx.restore();
			
		}
	}
	if( m_hairValue == HairType.LONG3 )
	{
		for( var i = 0; i < 20; i++ )
		{
			x = originalX + m_pHairX[i] * 2;
			y = originalY + m_pHairY[i];
			
			ctx.save();
			ctx.beginPath();
			
			DrawArc( ctx, m_faceCurrent[0] + m_pHairX[i] * 2, m_faceCurrent[1] + m_pHairY[i], m_faceCurrent[2], m_faceCurrent[3], -0.25, 1, 0, true );
			//ctx.arc( x * m_blockSize, y * m_blockSize, size * m_blockSize, 0*Math.PI, 1*Math.PI, true);
			ctx.lineTo( ( m_faceCurrent[0] + m_pHairX[i] * 2 ) * m_blockSize - ( m_faceCurrent[2] * m_blockSize ), y * m_blockSize * 1.5 );
			
			ctx.stroke();
			ctx.closePath();
			
			ctx.restore();
			
		}
	}
	if( m_hairValue == HairType.MOHAWK )
	{
		ctx.save();
		
		ctx.setLineDash([1,4]);
		ctx.lineWidth = window.devicePixelRatio * 16;
		
		ctx.beginPath();
		
		DrawArcPath( ctx, m_faceCurrent[0], m_faceCurrent[1], m_faceCurrent[2], m_faceCurrent[3], 1.25, 1.75, false );
		
		ctx.setLineDash([]);
		ctx.lineWidth = window.devicePixelRatio;
		
		ctx.restore();
	}
}

function DrawArc( ctx, x, y, w, h, startAngle, endAngle, angle, clockWise )
{
	var rotation = 0.0;
	if( angle != undefined )
	{
		rotation = angle;
	}
	if( clockWise == undefined )
	{
		clockWise = false;
	}
	ctx.ellipse(Math.floor( x * m_blockSize ),
				Math.floor( y * m_blockSize ),
				Math.floor( w * m_blockSize ),
				Math.floor( h * m_blockSize ),
				rotation*Math.PI,
				( startAngle * Math.PI ),
				( endAngle * Math.PI ), clockWise);
}

function DrawArcPath( ctx, x, y, w, h, startAngle, endAngle, fill, angle, nostroke )
{
	var rotation = 0.0;
	if( angle )
	{
		rotation = angle;
	}
	if( nostroke == undefined )
	{
		nostroke = false;
	}
	
	ctx.beginPath();
	
	DrawArc( ctx, x, y, w, h, startAngle, endAngle, angle );
	
	if( fill )
	{
		ctx.fill();
	}
	if( !nostroke )
	{
		ctx.stroke();
	}
	ctx.closePath();
}

// Call ReSize() when the screen size changes or the phone orientation changes:
window.addEventListener('resize', ResizeGame, false);
window.addEventListener('orientationchange', ResizeGame, false);

function PassInput( event, key, x, y )
{
	// check how long is has been since this menu first showed up on the screen
	// if its less than 250ms, then ignore the input because the user hasn't had time to look
	// at what they are pressing
	if( g_now - m_lastDrawTime < 250 ) // number in milliseconds
	{
		return;
	}
	
	if( m_gameState == GameState.MAIN_MENU )
	{
		for( var i = 0; i < m_pMainButtons.length; i++ )
		{
			m_pMainButtons[i].PassInput( event, x, y );
		}
	}
	
	if( m_gameState == GameState.IN_GAME || m_gameState == GameState.PAUSE_MENU )
	{
		// Track input
		if( event == "keydown" )
		{
			if( !g_keyDown[key] )
			{
				g_keyDown[key] = true;
				if( g_keyHit[key] === false || g_keyHit[key] === undefined )
				{
					g_keyHit[key] = true;
				}
				else
				{
					g_keyHit[key] = 0;
				}
			}
		}
		else if( event == "keyup" )
		{
			g_keyDown[key] = false;
			g_keyHit[key] = false;
		}
		else if( event == "mousedown" )
		{
			g_mouseDown[key] = true;
			g_mouseStartX[key] = x;
			g_mouseStartY[key] = y;
			if( g_mouseHit[key] === false || g_mouseHit[key] === undefined )
			{
				g_mouseHit[key] = true;
			}
			else
			{
				g_mouseHit[key] = 0;
			}
		}
		else if( event == "mouseup" )
		{
			g_mouseDown[key] = false;
			g_mouseHit[key] = false;
		}
		else if( event == "mousemove" )
		{
			var stop=0;
		}
		
		if( event == "mouseup" || event == "mousemove" || event == "mousedown" )
		{
			g_mousePrevX[key] = g_mouseX[key];
			g_mousePrevY[key] = g_mouseY[key];
			g_mouseX[key] = x;
			g_mouseY[key] = y;
		}
	}
}




var m_canvasWidth;
var m_canvasHeight;

var frameTimer = new TimerClass();

// it takes time for our textures to load. We use m_textureLoadCount and m_prevTextureLoadCount to determine if a new texture has been loaded.
var m_textureLoadCount = 0;
var m_prevTextureLoadCount = 0;

// variable to determine whether we are using touch events or mouse clicks
var m_touchEvents;

var m_gameState;

var m_drag; // mouse/finger drag


////////

if( 0 )
{
	window.log = function(){};
}
else
{
	if (Function.prototype.bind) {
		window.log = Function.prototype.bind.call(console.log, console);
	}
	else {
		window.log = function() {
			Function.prototype.apply.call(console.log, console, arguments);
		};
	}
}

