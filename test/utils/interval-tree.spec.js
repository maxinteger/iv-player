'use strict';
/* global describe, it, beforeEach */
const {is} = require('ramda');
const assert = require('assert');
const Interval = require('../../src/utils/interval').Interval;
const IntervalTree = require('../../src/utils/interval-tree').IntervalTree;

describe('Interval tree', ()=> {
	it('initialization should not fail', ()=> {
		assert.strictEqual(typeof IntervalTree(), "object");
	});

	describe('after initialization ', ()=> {
		it('the new tree should be empty', ()=> {
			assert.strictEqual( IntervalTree().isEmpty(), true);
		});

		it('the size method should be 0', () => {
			assert.strictEqual( IntervalTree().size(), 0);
		});

		it('any search should return with empty array', () => {
			assert.strictEqual( is(Array, IntervalTree().search()), true);
			assert.strictEqual( IntervalTree().search().length, 0);
		});
	});

	describe('insert one item then', () => {
		let itree = null;
		let data = null;

		beforeEach(() => {
			itree = IntervalTree();
			data = 'data';
			itree.insert(Interval(0, 1), data);
		});

		it('should not be empty', () =>
			assert.strictEqual( itree.isEmpty(), false)
		);

		it('the size should be 1', () =>
			assert.strictEqual( itree.size(), 1)
		);

		it('the search with 0.5 should return with one element list', () =>{
			assert.strictEqual( is(Array, itree.search(.5)), true);
			assert.strictEqual( itree.search(.5).length, 1)
		})
	});

	describe('insert 5 items then', () => {
		let itree = null;
		let data = null;

		beforeEach(() => {
			itree = IntervalTree();
			data = 'data';
			itree
				.insert(Interval(20, 36), data)
				.insert(Interval(3, 41), data)
				.insert(Interval(0, 1), data)
				.insert(Interval(10, 15), data)
				.insert(Interval(29, 99), data);
		});

		it('the size method should be 3', () => {
			assert.strictEqual( itree.size(), 5);
		});

		it('the head node maxEnd should be 11', () => {
			assert.strictEqual( itree.root.maxEnd, 99);
		});

		it('search with -1 should return with 0 item', () => {
			assert.strictEqual( itree.search(-1).length, 0);
		});

		it('search with .5 should return with 1 item', () => {
			assert.strictEqual( itree.search(.5).length, 1);
			assert.strictEqual( itree.search(.5)[0].interval.start, 0);
		});

		it('search with 12 should return with 2 item', () => {
			assert.strictEqual( itree.search(12).length, 2);
		});

		it('search with 30 should return with 2 item', () => {
			assert.strictEqual( itree.search(30).length, 2);
		});
	})
});
