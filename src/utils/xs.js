import {map, curry, pipe, apply, identity} from 'ramda';
import xs from 'xstream';
import fromEvent from 'xstream/extra/fromEvent';

export const SimpleListener = (next=identity, complete=identity, error=identity) => ({next, complete, error});

const EmitProducerImp = Object.assign(Object.create(null), {
	emit(data){
        this.listener ? this.listener.next(data) : null;
    },

	start(listener) {
        this.listener = listener
    },

	stop(){
        this.listener = null
    }
});

export const EmitProducer = () => Object.create(EmitProducerImp);

export const multiFromEvent = curry((event, elements) =>
	pipe(
		map((node) => fromEvent(node, event)),
		apply(xs.merge)
	)(elements)
);
