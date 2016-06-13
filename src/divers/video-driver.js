import most from 'most'
import {createElement} from '../utils/dom';
import {mapObjIndexed, map, values} from 'ramda';
import {multiFromEvent} from "../utils/most";

export const PLAY = 'play';
export const PAUSE = 'pause';
export const SWITCH = 'switch';
export const TICK = 1000 / 60;

export const makeVideoDriver = (sources) =>{
	const videos = map( (videoData) =>
		createElement('video', {muted: true, preload: 'metadata'},
			map( source => createElement('source', source), videoData.sources )
		)
	)(sources);

	let activeVideo = null;

	const metadata_ = multiFromEvent('loadedmetadata', values(videos));
	const pause_ = multiFromEvent('pause', values(videos));
	const play_ = multiFromEvent('play', values(videos))
		.flatMap( ({target}) => most
			.periodic(TICK, {type: 'render', target})
			.until(pause_)
		);

	return sink_ =>
		Object.assign(sink_.observe( (action) => {
		console.log(action);
			switch (action.type){
				case PLAY: return activeVideo.play(action.position);
				case PAUSE: return activeVideo.pause();
				case SWITCH:
					console.log(action);
					if (activeVideo) activeVideo.pause();
					activeVideo = videos[action.vref];
					if (action.time){
						activeVideo.currentTime = action.time;
					}
			}
		}), {play_});
};
