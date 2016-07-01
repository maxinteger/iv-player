import {map} from 'ramda';

export class EventEmitter{
	constructor(){
		this._events = {};
	}

	addEventListener(event, callback){
		if (!this._events[event]){
			this._events[event] = [];
		}
		this._events[event].push(callback);
	}

	triggerEvent(event, data){
		map( fn => fn.call(this, {type: event, target: this, data}), this._events[event]);
	}

	removeEventListener(){

	}

	removeAllListener(){

	}
}
