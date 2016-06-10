import most from 'most'
import {createElement} from '../utils/dom';
import {mapObjIndexed, map, values} from 'ramda';

export const PLAY = 'play';
export const PAUSE = 'pause';
export const SWITCH = 'switch';
export const TICK = 1000 / 60;

const multiFromEvent = (event, elements) =>
	most.mergeArray(map( x => most.fromEvent(event, x), elements ) );

export const makeVideoDriver = (sources) =>{
	const videos = map( (videoData) =>
		createElement('video', {muted: true, preload: 'metadata'},
			map( source => createElement('source', source), videoData.sources )
		)
	)(sources);

	let activeVideo = null;

	const videoPause_ = multiFromEvent('pause', values(videos));
	const videoPlay_ = multiFromEvent('play', values(videos))
		.flatMap( (event) => most
			.periodic(TICK, {type: 'render', target: event.target})
			.until(videoPause_)
		);

	return sink_ =>
		Object.assign(sink_.observe( (action) => {
			switch (action.type){
				case PLAY: return activeVideo.play(action.position);
				case PAUSE: return activeVideo.pause();
				case SWITCH:
					if (activeVideo) activeVideo.pause();
					activeVideo = videos[action.vref];
					activeVideo.currentTime = action.time || 0;
			}
		}), {videoPlay_});
};
