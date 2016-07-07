'use strict';
/* global describe, it, beforeEach */
const assert = require('assert');
const {is} = require('ramda');
const xs = require('xstream');
const delay = require('xstream/extra/delay').default;
const SL = require('../../src/utils/xs').SimpleListener;
const {makeNavigatorDriver} = require('../../src/drivers/navigator-driver');

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
			navDriver = makeNavigatorDriver({startLink: '0001'})(xs.Stream.of({}));
		});

		it('should return with "event_" and "state_" streams', ()=>{
			assert.strictEqual(is(xs.Stream, navDriver.events_), true);
		});

		it(`should emit a switch action trough the event_ stream`, (done)=>
			navDriver.events_.addListener(SL((data) => {
				assert.deepEqual(data, {type: 'switch', vref: '0001', time: null});
				done();
			}))
		);

		it(`should pause action after the switch action trough the event_ stream`, (done)=>
			navDriver.events_.drop(1).addListener(SL((data) => {
				assert.deepEqual(data, {type: 'pause'	});
				done();
			}))
		)
	});

	describe('after init with videoLink action ', ()=>{
		let navDriver = null;

		beforeEach(()=>{
			navDriver = makeNavigatorDriver({startLink: '0001'})
				(xs.Stream.of({type: 'videolink', vref: '0002', time: 10, play: true}).compose(delay(1)));
		});

		it('should emit a switch action trough the _event stream', (done)=>{
			navDriver.events_.drop(2).addListener(SL((data) => {
				assert.deepEqual(data, {type: 'switch', vref: '0002', time: 10});
				done();
			}))
		});

		it('after the switch action should emit a play action trough the _event stream', (done)=>{
			navDriver.events_.drop(3).addListener(SL((data) => {
				assert.deepEqual(data, {type: 'play'});
				done();
			}))
		});
	});
});
