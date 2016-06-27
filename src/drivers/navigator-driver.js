import hold from '@most/hold';
import most from 'most';
import {tap, omit, merge} from 'ramda';

const omitType = omit(['type']);

export const makeNavigatorDriver = ({startLink}) => {
	if (!startLink){
		throw new Error('"startLink" options is required');
	}

	return sink_ => {

		const events_ = sink_
			.startWith({type: 'videolink', vref: startLink})
			.flatMap((action) => {
				console.log('NAV ::', action);
				switch (action.type){
					case 'videolink':
						return most.from([
							{type: 'switch', vref: action.vref, time: action.time || null},
							{type: action.play ? 'play' : 'pause'}
						]);
					default: return most.empty()
				}
			})
			.thru(hold);

		const state_ = sink_.scan((state, action) => merge(state, {[action.type]: omitType(action) }), {});

		const sinkObs_ = sink_.observe((action) => { /* noop */ });

		return Object.assign(sinkObs_, { events_, state_ });
	}
};
