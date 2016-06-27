'use strict';
/* global describe, it, beforeEach */
const assert = require('assert');
const {is} = require('ramda');
const most = require('most');
const {makeNavigatorDriver} = require('../../src/drivers/navigator-driver');
const hold = require('@most/hold');

describe('Navigator driver', ()=> {
	describe ('makeNavigatorDriver', ()=> {
		it('should be a function', ()=>
			assert.strictEqual(typeof makeNavigatorDriver, 'function')
		);


		it('should fail if you call without parameters', ()=>
			assert.throws(makeNavigatorDriver, TypeError)
		);

		it('should fail if you call without "startLink" parameter', ()=>{
			try{
				makeNavigatorDriver({});
			} catch (e){
				assert.strictEqual(e.message, '"startLink" options is required')
			}
		});


		it('should return with function', ()=>
			assert.strictEqual(typeof makeNavigatorDriver({startLink: '0001'}), 'function')
		);
	});

	describe('after init with empty stream', ()=> {
		let navDriver = null;

		beforeEach(()=>{
			navDriver = makeNavigatorDriver({startLink: '0001'})(most.just({}));
		});

		it('should return with "event_" and "state_" streams', ()=>{
			assert.strictEqual(is(most.Stream, navDriver.events_), true);
			assert.strictEqual(is(most.Stream, navDriver.state_), true);
		});

		it(`should emit a switch action trough the event_ stream`, (done)=>
			navDriver.events_.observe( (data) => {
				assert.deepEqual(data, {type: 'switch', vref: '0001', time: null});
				done();
			})
		);

		it(`should pause action after the switch action trough the event_ stream`, (done)=>
			navDriver.events_.skip(1).observe( (data) => {
				assert.deepEqual(data, {type: 'pause'	});
				done();
			})
		)
	});

	describe('after init with videoLink action ', ()=>{
		let navDriver = null;

		beforeEach(()=>{
			navDriver = makeNavigatorDriver({startLink: '0001'})
				(most.just({type: 'videolink', vref: '0002', time: 10, play: true}).delay(1));
		});

		it('should emit a switch action trough the _event stream', (done)=>{
			navDriver.events_.skip(2).observe( (data) => {
				assert.deepEqual(data, {type: 'switch', vref: '0002', time: 10});
				done();
			})
		});

		it('after the switch action should emit a play action trough the _event stream', (done)=>{
			navDriver.events_.skip(3).observe( (data) => {
				assert.deepEqual(data, {type: 'play'});
				done();
			})
		});
	});
});
