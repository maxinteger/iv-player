import most from 'most'
import {createElement} from '../utils/dom';
import {mapObjIndexed, map, values, merge} from 'ramda';
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
	const play_ = multiFromEvent('play', values(videos));
	const render_ = play_
		.flatMap( ({target}) => most
			.periodic(TICK, {type: 'render', source: target, width: target.videoWidth, height: target.videoHeight})
			.until(pause_)
		);

	const events_ = most.mergeArray([
		render_
	]);

	return sink_ =>{

		const state_ = sink_.scan((state, action) => {
			switch (action.type){
				case PLAY: return merge(state, {play: true, paused: false});
				case PAUSE: return merge(state, {play: false, paused: true});
				default: return state;
			}
		}, {});

		const sinkObs = sink_.observe( (action) => {
			console.log(action);
			switch (action.type){
				case PLAY: return activeVideo && activeVideo.play(action.position);
				case PAUSE: return activeVideo && activeVideo.pause();
				case SWITCH:
					console.log(action);
					if (activeVideo) activeVideo.pause();
					activeVideo = videos[action.vref];
					if (action.time){
						activeVideo.currentTime = action.time;
					}
			}
		});
		return Object.assign(sinkObs, {events_, state_});
	}
};
