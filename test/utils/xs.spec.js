'use strict';
/* global describe, it, beforeEach */
const assert = require('assert');
const {is} = require('ramda');
const {Stream} = require('xstream');
const {EventEmitter} = require('events');
const xsUtils = require('../../src/utils/xs');
const SL = require('../../src/utils/xs').SimpleListener;

const createElement = () => {
	const e = new EventEmitter();
	e.addEventListener = e.addListener.bind(e);
	e.removeEventListener = e.removeListener.bind(e);
	return e;
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
					assert.strictEqual(e.a, 1);
					done()
				}));
				eventTarget.emit('eventX', {a: 1})
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
					assert.strictEqual(e.a, 1);
					done()
				}));
				eventTarget1.emit('eventX', {a:1})
			});

			it('should merge into one stream and catch event from target 2', (done) => {
				mergedStream.addListener( SL((e) => {
					assert.strictEqual(e.a, 2);
					done()
				}));
				eventTarget2.emit('eventX', {a:2})
			})
		});
	});
});
