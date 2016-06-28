import xs from 'xstream'
import delay from "xstream/extra/delay";
import flattenConcurrently  from "xstream/extra/flattenConcurrently";
import {mapObjIndexed, map, values, merge, identity} from 'ramda';
import {createElement} from '../utils/dom';
import {multiFromEvent} from "../utils/xs";

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

	const updateAction = (target) => ({type: 'update', source: target});

	const pause_ = multiFromEvent('pause', values(videos));
	const play_ = multiFromEvent('play', values(videos));

	const metadata_ = multiFromEvent('loadedmetadata', values(videos))
		.filter( ({target}) => target === activeVideo )
		.map( ({target}) => updateAction(target) );

	const update_ = play_
		.map( ({target}) => xs
			.periodic(TICK)
			.mapTo(updateAction(target))
			.endWhen(pause_)
		)
		.compose(flattenConcurrently);


	return sink_ =>{

		const events_ = xs.merge(
			update_,
			metadata_,
			sink_
				.map( (action) => {
					switch (action.type){
						case PAUSE:  return xs.of(updateAction(activeVideo)).compose(delay(1));
						default: 	 return xs.empty();
					}
				})
				.compose( flattenConcurrently )
		);

		const state_ = sink_.fold((state, action) => {
			switch (action.type){
				case PLAY: return merge(state, {play: true, paused: false});
				case PAUSE: return merge(state, {play: false, paused: true});
				default: return state;
			}
		}, {});

		const sinkObs = sink_.addListener({
				next: (action) => {
					console.log('VIDEO ::', action);
					switch (action.type){
						case PLAY: return activeVideo && activeVideo.play(action.position);
						case PAUSE: return activeVideo && activeVideo.pause();
						case SWITCH:
							if (activeVideo) activeVideo.pause();
							activeVideo = videos[action.vref];
							if (action.time){
								activeVideo.currentTime = action.time;
							}
					}
			},
			complete: identity,
			error: identity
		});
		return {events_, state_};
	}
};
