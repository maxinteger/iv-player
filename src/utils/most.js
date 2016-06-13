import {map} from 'ramda';
import most from "most";

export const multiFromEvent = (event, elements) =>
	most.mergeArray(map( x => most.fromEvent(event, x), elements ) );
