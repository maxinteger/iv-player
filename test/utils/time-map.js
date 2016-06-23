'use strict';
/* global describe, it, beforeEach */
const assert = require('assert');
const TimeMap = require('../../src/utils/time-map').TimeMap;

describe('TimeMap', ()=> {
	describe('initialization', ()=>
		it('should not fail', ()=> {
			assert.strictEqual(typeof TimeMap().add, "function");
			assert.strictEqual(typeof TimeMap().get, "function");
		})
	);

	describe('after add items', () => {
		let tm = null;
		beforeEach(() => {
			tm = TimeMap();
			tm.add(0, 'A');
			tm.add(0.5, 'B');
			tm.add(0.99, 'C');
			tm.add(1, 'D');
			tm.add(2, 'E');
		});

		it('get time less then 0 should return 0 element', () =>
			assert.deepEqual(tm.get(-1), []));

		it('get time 0 should return 3 elements', () =>
			assert.deepEqual(tm.get(0), ['A', 'B', 'C']));

		it('get time 0.5 should return 3 elements', () =>
			assert.deepEqual(tm.get(0.5), ['A', 'B', 'C']));

		it('get time 0.99 should return 3 elements', () =>
			assert.deepEqual(tm.get(0.99), ['A', 'B', 'C']));

		it('get time 1 should return 1 element', () =>
			assert.deepEqual(tm.get(1), ['D']));

		it('get time 2 should return 1 element', () =>
			assert.deepEqual(tm.get(2), ['E']));

		it('get time 100 should return 0 element', () =>
			assert.deepEqual(tm.get(100), []));

	});
});
