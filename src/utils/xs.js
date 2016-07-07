import {map, curry, pipe, apply, identity} from 'ramda';
import xs from 'xstream';
import fromEvent from 'xstream/extra/fromEvent';

export const SimpleListener = (next=identity, complete=identity, error=identity) => ({next, complete, error});

export const multiFromEvent = curry((event, elements) =>
	pipe(
		map((node) => fromEvent(node, event)),
		apply(xs.merge)
	)(elements)
);
