'use strict';
/* global describe, it, beforeEach */
const assert = require('assert');
const {is, identity} = require('ramda');
const {Stream} = require('xstream');
const {EventEmitter} = require('../../src/utils/event-emitter');
const xsUtils = require('../../src/utils/xs');
const SL = require('../../src/utils/xs').SimpleListener;

const createElement = () => {
	return new EventEmitter();
};

describe('XStream utils', ()=> {

	describe('SimpleListener', () => {
		it('should return with object that contains "identity" function callbacks', () =>
			assert.deepEqual(SL(), {next: identity, complete: identity, error: identity})
		)
	});

	describe('multiFromEvent', () => {
		it('should be a function', () =>
			assert.strictEqual(typeof xsUtils.multiFromEvent, 'function')
		);

		it('should return with Stream', () =>
			assert.strictEqual(is(Stream, xsUtils.multiFromEvent('eventX', [])), true)
		);

		describe('call with multiple event target', () => {
			let eventTarget1 = null;
			let eventTarget2 = null;
			let mergedStream = null;

			beforeEach( ()=>{
				eventTarget1 = createElement();
				eventTarget2 = createElement();
				mergedStream = xsUtils.multiFromEvent('eventX', [eventTarget1, eventTarget2]);
			});

			it('should merge into one stream and catch event from target 1', (done) => {
				mergedStream.addListener( SL((e) => {
					assert.strictEqual(e.data.a, 1);
					done()
				}));
				eventTarget1.triggerEvent('eventX', {a:1})
			});

			it('should merge into one stream and catch event from target 2', (done) => {
				mergedStream.addListener( SL((e) => {
					assert.strictEqual(e.data.a, 2);
					done()
				}));
				eventTarget2.triggerEvent('eventX', {a:2})
			})
		});
	});
});
