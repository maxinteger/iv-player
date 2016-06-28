import {map, curry, pipe, apply, identity} from 'ramda';
import xs from 'xstream';


export const SimpleListener = (next=identity, complete=identity, error=identity) => ({next, complete, error});


export const fromEvent = curry((event, element) =>
	xs.create({
		start(listener) {
			this.handler = event => listener.next(event);
			element.addEventListener(event, this.handler);
		},
		stop() {
			element.removeEventListener(event, this.handler);
		}
	}));

export const multiFromEvent = curry((event, elements) =>
	pipe(
		map(fromEvent(event)),
		apply(xs.merge)
	)(elements)
);
