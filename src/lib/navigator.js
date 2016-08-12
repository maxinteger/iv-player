import xs from 'xstream';
import {tap, omit, merge, identity} from 'ramda';

export default ({startLink}) => {
	if (!startLink){
		throw new Error('"startLink" options is required');
	}

	return str_ =>
		str_
			.startWith({type: 'videolink', vref: startLink})
			.map((action) => {
				switch (action.type) {
					case 'videolink':
						return xs.fromArray([
							{type: 'switch', vref: action.vref, time: action.time || null},
							{type: action.play ? 'play' : 'pause'}
						]);
					default:
						return xs.empty()
				}
			})
			.flatten();
};
