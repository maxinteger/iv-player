'use strict';
/* global describe, it, beforeEach */
const {is} = require('ramda');
const assert = require('assert');
const Interval = require('../../src/utils/interval').Interval;

describe('Interval', ()=> {
	it('initialization should not fail', ()=> {
		assert.strictEqual(typeof Interval(0, 1), "object");
		assert.strictEqual(Interval(0, 1).start, 0);
		assert.strictEqual(Interval(0, 1).end, 1);
	});

	describe('contains method', () => {
		let interval = null;

		beforeEach( () => {
			interval = Interval(0,1);
		});

		it('should return true for 0.5', () =>
			assert.strictEqual(interval.contains(0.5), true)
		);

		it('should return true for 0', () =>
			assert.strictEqual(interval.contains(0), true)
		);

		it('should return false for 1', () =>
			assert.strictEqual(interval.contains(1), false)
		)
	})

});
