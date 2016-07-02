'use strict';
/* global describe, it, beforeEach */
const assert = require('assert');
const {is} = require('ramda');
const {Stream} = require('xstream');
const {EventEmitter} = require('../../src/utils/event-emitter');
const xsUtils = require('../../src/utils/xs');
const SL = require('../../src/utils/xs').SimpleListener;

const createElement = () => {
	return new EventEmitter();
};

describe('Most utils', ()=> {

	describe('fromEvent', () => {
		it('should be a function', () =>
			assert.strictEqual(typeof xsUtils.fromEvent, 'function')
		);

		it('should return with Stream', () =>
			assert.strictEqual(is(Stream, xsUtils.fromEvent('eventX', [])), true)
		);

		describe('call with event target', () => {
			let eventTarget = null;
			let stream = null;

			beforeEach(()=> {
				eventTarget = createElement();
				stream = xsUtils.fromEvent('eventX', eventTarget);
			});

			it('should merge into one stream and catch event from target 1', (done) => {
				stream.addListener(SL((e) => {
					console.log(e);
					assert.strictEqual(e.data.a, 1);
					done()
				}));
				eventTarget.triggerEvent('eventX', {a: 1})
			});
		});
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
