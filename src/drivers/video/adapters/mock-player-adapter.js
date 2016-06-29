'use strict';

const NETWORK_EMPTY		= 0;	//	There is no data yet. Also, readyState is HAVE_NOTHING.
const NETWORK_IDLE		= 1;	//
const NETWORK_LOADING	= 2;	//	The media is loading.
const NETWORK_NO_SOURCE	= 3;	//

const HAVE_NOTHING		= 0;	// No information is available about the media resource.
const HAVE_METADATA		= 1;	// Enough of the media resource has been retrieved that the metadata attributes are initialized. Seeking will no longer raise an exception.
const HAVE_CURRENT_DATA	= 2;	// Data is available for the current playback position, but not enough to actually play more than one frame.
const HAVE_FUTURE_DATA	= 3;	// Data for the current playback position as well as for at least a little bit of time into the future is available (in other words, at least two frames of video, for example).
const HAVE_ENOUGH_DATA	= 4;	// Enough data is available—and the download rate is high enough—that the media can be played through to the end without interruption.

const CAN_PLAY_PROBABLY = 'probably'; 	// The specified media type appears to be playable.
const CAN_PLAY_MAYBE 	= 'maybe';		// Cannot tell if the media type is playable without playing it.
const CAN_PLAY_NO 		= '';			//  (empty string)The specified media type definitely cannot be played.

class MockPlayer{
	buffered = null;
	played = null;
	controller = null;
	networkState = NETWORK_EMPTY;
	readyState = HAVE_NOTHING;

	autoplay = false;
	muted = true;
	loop = false;
	controls = false;
	duration = 10;

	width = 320;
	videoWidth = 320;

	height = 200;
	videoHeight = 200;

	volume = 0;
	playbackRate = 1;

	constructor(){

	}

	get currentSrc (){ return '' }

	get currentTime (){ return 0; }
	set currentTime (time){ this._time = time; }

	get ended (){ return this._time === this.duration; }

	get paused (){ return true; }

	get seekable (){ return true; }

	canPlayType() { return CAN_PLAY_PROBABLY; }
	load(){}
	pause(){}
	play(){}
}

export const mockPlayer = videoData => {

};
