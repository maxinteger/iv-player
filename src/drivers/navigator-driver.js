import xs from 'xstream';
import {tap, omit, merge, identity} from 'ramda';

const omitType = omit(['type']);

export const makeNavigatorDriver = ({startLink}) => {
	if (!startLink){
		throw new Error('"startLink" options is required');
	}

	return sink_ => {

		const events_ = sink_
			.startWith({type: 'videolink', vref: startLink})
			.map((action) => {
				switch (action.type){
					case 'videolink':
						return xs.fromArray([
							{type: 'switch', vref: action.vref, time: action.time || null},
							{type: action.play ? 'play' : 'pause'}
						]);
					default: return xs.empty()
				}
			})
			.flatten();

		const sinkObs_ = sink_.addListener( {
			next: action => { /* noop */ },
			complete: identity,
			error: identity
		});

		return { events_};
	}
};
