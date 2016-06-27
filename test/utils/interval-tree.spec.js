'use strict';
/* global describe, it, beforeEach */
const {is, pipe} = require('ramda');
const assert = require('assert');
const Interval = require('../../src/utils/interval').Interval;
const {IntervalTree, isEmpty, size, insert, search, EmptyTree} = require('../../src/utils/interval-tree');

describe('Interval tree', ()=> {
	it('initialization should not fail', ()=> {
		assert.strictEqual(IntervalTree(), EmptyTree);
	});

	describe('after initialization ', ()=> {
		it('the new tree should be empty', ()=> {
			assert.strictEqual( isEmpty(IntervalTree()), true);
		});

		it('the size method should be 0', () => {
			assert.strictEqual( size(IntervalTree()), 0);
		});

		it('any search should return with empty array', () => {
			assert.strictEqual( is(Array, search(0, IntervalTree())), true);
			assert.strictEqual( search(0, IntervalTree()).length, 0);
		});
	});

	describe('insert one item then', () => {
		let itree = null;
		let data = null;

		beforeEach(() => {
			data = 'data';
			itree = insert(Interval(0, 1), data, IntervalTree());
		});

		it('should not be empty', () =>
			assert.strictEqual( isEmpty(itree), false)
		);

		it('the size should be 1', () =>
			assert.strictEqual( size(itree), 1)
		);

		it('the search with 0.5 should return with one element list', () =>{
			assert.strictEqual( is(Array, search(.5, itree)), true);
			assert.strictEqual( search(.5, itree).length, 1)
		})
	});

	describe('insert 5 items then', () => {
		let itree = null;
		let data = null;

		beforeEach(() => {
			data = 'data';
			itree = pipe(
				insert(Interval(20, 36), data),
				insert(Interval(3, 41), data),
				insert(Interval(0, 1), data),
				insert(Interval(10, 15), data),
				insert(Interval(29, 99), data)
			)(IntervalTree())
		});

		it('the size method should be 5', () => {
			assert.strictEqual( size(itree), 5);
		});

		it('the head node maxEnd should be 11', () => {
			assert.strictEqual( itree.maxEnd, 99);
		});

		it('search with -1 should return with 0 item', () => {
			assert.strictEqual( search(-1, itree).length, 0);
		});

		it('search with .5 should return with 1 item', () => {
			assert.strictEqual( search(.5, itree).length, 1);
			assert.strictEqual( search(.5, itree)[0].interval.start, 0);
		});

		it('search with 12 should return with 2 item', () => {
			assert.strictEqual( search(12, itree).length, 2);
		});

		it('search with 30 should return with 2 item', () => {
			assert.strictEqual( search(30, itree).length, 2);
		});
	})
});
