import {max, pathOr, curry} from 'ramda';
import {contains} from './interval';

/**
 * Based on
 * https://en.wikipedia.org/wiki/Interval_tree
 * https://en.wikipedia.org/wiki/Binarysearch_tree
 */

const TNode = (left, right, interval, data, maxEnd) =>
	Object.assign(Object.create(null), {
		left: left,
		right: right,
		interval: interval,
		maxEnd: maxEnd,
		data: data,
	});

export const EmptyTree = null;

export const IntervalTree = () => EmptyTree;

export const isEmpty = tree => tree === EmptyTree;

export const size = tree =>
	tree === EmptyTree ? 0 : 1 + size(tree.left) + size(tree.right);


export const insert = curry((itv, data, tree) =>{
	if (tree === EmptyTree) {
		return TNode(EmptyTree, EmptyTree, itv, data, itv.end);
	} else if (itv.start < tree.interval.start) {
		return TNode(insert(itv, data, tree.left), tree.right, tree.interval, tree.data, maxNodeEnd(tree, itv));
	} else {
		return TNode(tree.left, insert(itv, data, tree.right), tree.interval, tree.data, maxNodeEnd(tree, itv));
	}
});


export const search = curry((value, tree) => {
	let result = [];

	if ((tree === EmptyTree) || (value > tree.maxEnd))
		return result;

	result = result.concat(search(value, tree.left));

	if(contains(value, tree.interval))
		result = result.concat(tree);

	if(value < tree.interval.start)
		return result;

	return result.concat(search(value, tree.right));
});

///////////////////////////////////////

const intervalEndProp = pathOr(-Infinity, ['interval', 'end']);

const maxNodeEnd = (node, interval) =>
	Math.max(...[intervalEndProp(node.left), intervalEndProp(node.right), interval.end]);

