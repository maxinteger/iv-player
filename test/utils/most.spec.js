'use strict';
/* global describe, it, beforeEach */
const assert = require('assert');
const mostUtils = require('../../src/utils/most');
const {EventEmitter} = require('events');
const {Stream} = require('most');
const {is} = require('ramda');

describe('Most utils', ()=> {

	describe('multiFromEvent', () => {
		it('should be a function', () =>
			assert.strictEqual(typeof mostUtils.multiFromEvent, 'function')
		);

		it('should return with Stream', () =>
			assert.strictEqual(is(Stream, mostUtils.multiFromEvent('eventX', [])), true)
		);

		describe('call with multiple event target', () => {
			let eventTarget1 = null;
			let eventTarget2 = null;
			let mergedStream = null;

			beforeEach( ()=>{
				eventTarget1 = new EventEmitter();
				eventTarget2 = new EventEmitter();
				mergedStream = mostUtils.multiFromEvent('eventX', [eventTarget1, eventTarget2]);
			});

			it('should merge into one stream and catch event from target 1', (done) => {
				mergedStream.observe( (e) => {
					assert.strictEqual(e.a, 1);
					done()
				});
				eventTarget1.emit('eventX', {a:1})
			});

			it('should merge into one stream and catch event from target 2', (done) => {
				mergedStream.observe( (e) => {
					assert.strictEqual(e.a, 2);
					done()
				});
				eventTarget2.emit('eventX', {a:2})
			})

		});
	});
});
