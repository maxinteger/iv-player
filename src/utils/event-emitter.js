import {map, reject, equals} from 'ramda';

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
		map( fn => fn.call(this, {type: event, target: this, data}), this._events[event] || []);
	}

	removeEventListener(event, handler){
		this._events[event] = reject(equals(handler), this._events[event] || []);
	}

	removeAllListener(event){
		this._events[event] = [];
	}
}
