
function SetupSound()
{
	if( localStorage.volume == undefined )
	{
		localStorage.volume = 100;
	}

	
	m_audioContext = null;
	if( window.AudioContext )
	{
		m_audioContext = new AudioContext();
	}
	LoadSounds();
}

var m_audioContext = null;
var m_audioBufferList = [];
var m_audioLoadCount = 0;
var m_ppAudioQueue = [];
var m_soundStartTime = 0;
var m_levelChangeTIme = 0;

var g_muteSounds = false;

function LoadSounds()
{
}

var m_ppSounds = [];
LoadGameSound = function( index, pFileNames )
{
	log( "LoadGameSound( "+index+", "+pFileNames+" )" );
	
	var callback = function( index, fileName, buffer )
	{
		log( "LoadSound() " + fileName + " callback("+index+")" );
		if( !m_ppSounds[index] )
		{
			m_ppSounds[index] = [];
		}
		m_ppSounds[index].push( buffer );
	}
	
	for( var i = 0; i < pFileNames.length; i++ )
	{
		var fileName = pFileNames[i];
		LoadSound( fileName, index, null, callback );
	}
}

function LoadSound( url, index, callback, callbackForOneSound )
{
	
	log("LoadSound("+url+", "+index+")");
	
	var successFunction = function()
	{
		log("Loaded a sound "+m_audioLoadCount);
		if( ++m_audioLoadCount == m_audioBufferList.length )
		{
			callback( m_audioBufferList );
		}
		if( callbackForOneSound )
		{
			callbackForOneSound( index, url, m_audioBufferList[index] );
		}
	};
	var failFunction = function()
	{
		log("Failed to load a sound "+m_audioLoadCount);
		if( ++m_audioLoadCount == m_audioBufferList.length )
		{
			callback( m_audioBufferList );
		}
		if( callbackForOneSound )
		{
			callbackForOneSound( index, url,  m_audioBufferList[index] );
		}
	};
	
	// If our current dir (browser url) is in a folder (/game/) then the relative path to sound files is ../
	var prefix = '';
	if( !IsPhoneGap() )
	{
		if( window.location.hostname != '' && window.location.pathname.length > 1 )
		{
			prefix = '../../';
			//prefix = window.location.pathname;
		}
	}
	
	if( window.plugins && window.plugins.LowLatencyAudio )
	{
		//window.plugins.LowLatencyAudio.preloadFX( url, prefix + url, successFunction, failFunction );
		window.plugins.LowLatencyAudio.preloadAudio( url, prefix + url, parseInt( localStorage.volume ) / 100, 1, successFunction, failFunction );
		//preloadFX: function ( id, assetPath, success, fail)
		//preloadAudio: function ( id, assetPath, volume, voices, success, fail)
		return;
	}
	
	
	// Load buffer asynchronously
	var request = new XMLHttpRequest();
	request.open( "GET", prefix + url, true );
	request.responseType = "arraybuffer";
	request.onload = function()
	{
		log("sound onload url="+url+" index=" + index + " callbackForOneSound="+callbackForOneSound);
		if( !m_audioContext )
		{
			return;
		}
		
		// Asynchronously decode the audio file data in request.response
		m_audioContext.decodeAudioData(
									   request.response,
									   function( buffer )
									   {
									   if( !buffer )
									   {
									   Alert('error decoding file data: ' + url);
									   return;
									   }
									   
									   m_audioBufferList[index] = buffer;
									   
									   if( ++m_audioLoadCount == m_audioBufferList.length )
									   {
									   if( callback )
									   {
									   callback( m_audioBufferList );
									   }
									   }
									   if( callbackForOneSound )
									   {
									   callbackForOneSound( index, url, m_audioBufferList[index] );
									   }
									   },
									   function( error )
									   {
									   console.error('decodeAudioData error', error);
									   }
									   );
	};
	
	request.onerror = function() {
		Alert('BufferLoader: XHR error ' + url);
	};
	
	request.send();
};

function PlaySound( buffer )
{
	//log('PlaySound('+buffer+')');
	
	if( g_muteSounds )
	{
		return false;
	}
	
	if( !buffer )
	{
		return false;
	}
	
	if( window.plugins && window.plugins.LowLatencyAudio )
	{
		var successFunction = function()
		{
			log("Play success");
		};
		var failFunction = function()
		{
			log("Failed to play a sound " + buffer);
		};
		
		return window.plugins.LowLatencyAudio.play( buffer, successFunction, failFunction );
	}
	
	var source = m_audioContext.createBufferSource();
	if( source && source != undefined )
	{
		source.buffer = buffer;
		if( 0 )
		{
			source.connect( m_audioContext.destination );
			if( source.start )
			{
				source.start(0);
			}
		}
		else
		{
			if( !source.start )
			{
				source.start = source.noteOn;
			}
			
			if( source.start )
			{
				// Create a gain node.
				var gainNode = m_audioContext.createGain();
				
				// Connect the source to the gain node.
				source.connect( gainNode );
				
				// Connect the gain node to the destination.
				gainNode.connect( m_audioContext.destination );
				
				gainNode.gain.value = parseInt( localStorage.volume ) / 100;
				
				
				source.start(0);
				
				gainNode.gain.value = parseInt( localStorage.volume ) / 100;
				//log("sound gain value="+gainNode.gain.value);
			}
		}
	}
	return source;
}

function AnimateSounds()
{
	if( g_now >= m_soundStartTime )
	{
		m_soundStartTime = 0;
		
		if( m_ppAudioQueue.length > 0 && m_ppSounds.length > 0 )
		{
			var nextSFX = m_ppAudioQueue.shift();
			if( m_ppSounds[nextSFX] )
			{
				var numVariations = m_ppSounds[nextSFX].length;
				var variationIndex = Math.floor( numVariations * Random() );
				PlaySound( m_ppSounds[nextSFX][variationIndex] );
				m_soundStartTime = m_ppSounds[nextSFX][variationIndex].duration * 1000 + new Date().getTime();
				log( "m_ppSounds["+nextSFX+"]["+variationIndex+"].duration " + m_ppSounds[nextSFX][variationIndex].duration );
			}
			else
			{
				m_ppAudioQueue.push( nextSFX ); // add it back in
			}
		}
		
	}

}
