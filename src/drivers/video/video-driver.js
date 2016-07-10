import xs from 'xstream'
import delay from "xstream/extra/delay";
import flattenConcurrently  from "xstream/extra/flattenConcurrently";
import {__, isArrayLike, is, map, values, identity, assocPath, keys} from 'ramda';
import {multiFromEvent} from "../../utils/xs";

export const PLAY = 'play';
export const PAUSE = 'pause';
export const SWITCH = 'switch';
export const TICK = 1000 / 60;

export const makeVideoDriver = (sources, playerAdapter) =>{
	if(isArrayLike(sources) || !keys(sources).length){
		throw new Error('You mast provide at least one video source');
	}

	if(!is(Function, playerAdapter)){
		throw new Error('"playerAdapter" is not a function');
	}

	const videos = map(playerAdapter)(sources);

	let state = {
		activeVideo: null,
		playing: false
	};

	const updateState = assocPath(__, __, state);

	const updateAction = (target) => ({type: 'update', source: target});

	const pause_ = multiFromEvent('pause', values(videos));
	const play_ = multiFromEvent('play', values(videos));

	const metadata_ = multiFromEvent('loadedmetadata', values(videos))
		.filter( ({target}) => target === state.activeVideo )
		.map( ({target}) => updateAction(target) );

	const update_ = play_
		.map( ({target}) => xs
			.periodic(TICK)
			.mapTo(updateAction(target))
			.endWhen(pause_)
		)
		.compose(flattenConcurrently);

	const getState = () => state;

	return sink_ =>{
		const events_ = xs.merge(
			update_,
			metadata_,
			sink_
				.map( (action) => {
					switch (action.type){
						case PAUSE:  return state.activeVideo
							? xs.of(updateAction(state.activeVideo)).compose(delay(1))
							: xs.empty();
						default: 	 return xs.empty();
					}
				})
				.compose( flattenConcurrently )
		);

		sink_.addListener({
			next: (action) => {
				console.log('VIDEO ::', action);
				switch (action.type){
					case PLAY:
						state.playing = true;
						return state.activeVideo && state.activeVideo.play(action.time);

					case PAUSE:
						state.playing = false;
						return state.activeVideo && state.activeVideo.pause();

					case SWITCH:
						if (!videos[action.vref]) throw new Error(`Invalid video reference: "${action.vref}"`);

						if (state.activeVideo) state.activeVideo.pause();

						state.activeVideo = videos[action.vref];
						if (action.time){
							state.activeVideo.currentTime = action.time;
						}
				}
			},
			complete: identity,
			error: identity
		});
		return {events_, getState};
	}
};
