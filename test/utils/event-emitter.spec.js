'use strict';
/* global describe, it, beforeEach */
const assert = require('assert');
const {EventEmitter} = require('../../src/utils/event-emitter');

describe('Event emitter', ()=> {
	it('initialization should not fail', ()=> {
		assert.strictEqual(typeof new EventEmitter(), "object");
	});

	describe('instance', ()=> {
		let ee = null;

		beforeEach(() => {
			ee = new EventEmitter();
		});

		it('has 3 methods', () => {
			assert.strictEqual(typeof ee.addEventListener, 'function');
			assert.strictEqual(typeof ee.removeEventListener, 'function');
			assert.strictEqual(typeof ee.removeAllListener, 'function');
			assert.strictEqual(typeof ee.triggerEvent, 'function');
		});

		it('triggerEvent should call handler and pass the event type and target', (done)=>{
			ee.addEventListener('eventx', (event) => {
				assert.strictEqual(event.type, 'eventx');
				assert.strictEqual(event.target, ee);
				done();
			});
			ee.triggerEvent('eventx');
		});

		it('triggerEvent should call multiple handler', ()=>{
			let count = 0;
			ee.addEventListener('eventx', () => count++ );
			ee.addEventListener('eventx', () => count++ );
			ee.triggerEvent('eventx');

			assert.strictEqual(count, 2)
		});

		it('triggerEvent should pass event data', (done)=>{
			ee.addEventListener('eventx', (event) => {
				assert.strictEqual(event.data, 'data');
				done();
			});
			ee.triggerEvent('eventx', 'data');
		});

		it('after removeEventListener, triggerEvent should call 1 handler', ()=>{
			let count = 0;
			const handler1 = () => count++;
			const handler2 = () => count++;
			ee.addEventListener('eventx', handler1);
			ee.addEventListener('eventx', handler2);
			ee.removeEventListener('eventx', handler1);
			ee.triggerEvent('eventx');

			assert.strictEqual(count, 1)
		});

		it('after removeAllListener, triggerEvent should call 0 handler', ()=>{
			let count = 0;
			const handler1 = () => count++;
			const handler2 = () => count++;
			ee.addEventListener('eventx', handler1);
			ee.addEventListener('eventx', handler2);
			ee.removeAllListener('eventx');
			ee.triggerEvent('eventx');

			assert.strictEqual(count, 0)
		})
	})
});
