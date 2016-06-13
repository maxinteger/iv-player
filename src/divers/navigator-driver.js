import hold from '@most/hold';
import most from 'most';
import {tap, omit, merge} from 'ramda';

const omitType = omit(['type']);

export const makeNavigatorDriver = ({startLink}) => {
	return sink_ => {

		const events_ = sink_
			.startWith({type: 'switch', vhref: startLink})
			.flatMap((action) => {
				switch (action.type){
					case 'videolink':
						return most.from([
							{type: 'switch', vref: action.vref, time: action.time || null},
							{type: 'play'}
						]);
					default: return most.empty()
				}
			})
			.thru(hold);

		const state_ = sink_.scan((state, action) => merge(state, {[action.type]: omitType(action) }), {});

		const sinkObs_ = sink_.observe((action) => { /* nop */ });

		return Object.assign(sinkObs_, { events_, state_ });
	}
};
