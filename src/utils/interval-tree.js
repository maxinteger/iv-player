import {max, pathOr, curry} from 'ramda';

const TNodeI = Object.assign(Object.create(null), {
	init(left, right, interval, data, maxEnd){
		this.left = left;
		this.right = right;
		this.interval = interval;
		this.maxEnd = maxEnd || interval.end;
		this.data = data;
		return this;
	}
});

const TNode = (left, right, interval, data, maxEnd) => Object.create(TNodeI).init(left, right, interval, data, maxEnd);

const EmptyTNode = null;


const _size = (node) =>
	node === EmptyTNode ? 0 : 1 + _size(node.left) + _size(node.right);

const intervalEndProp = pathOr(-Infinity, ['interval', 'end']);

const maxNodeEnd = (node, interval) =>
	Math.max(...[intervalEndProp(node.left), intervalEndProp(node.right), interval.end]);

const _insert = (node, itv, data) =>{
	if (node === EmptyTNode) {
		return TNode(EmptyTNode, EmptyTNode, itv, data, itv.end);
	} else if (itv.start === node.interval.start) {
		return TNode(node.left, node.right, itv, data, maxNodeEnd(node, itv));
	} else if (itv.start < node.interval.start) {
		return TNode(_insert(node.left, itv, data), node.right, node.interval, node.data, maxNodeEnd(node, itv));
	} else {
		return TNode(node.left, _insert(node.right, itv, data), node.interval, node.data, maxNodeEnd(node, itv));
	}
};

const _search = (node, value) => {
	let result = [];

	if ((node === EmptyTNode) || (value > node.maxEnd))
		return result;

	result = result.concat(_search(node.left, value));

	if(node.interval.contains(value))
		result = result.concat(node);

	if(value < node.interval.start)
		return result;

	return result.concat(_search(node.right, value));
};

const _reduce = curry((fn, start, node) =>
	node !== EmptyTNode ? _reduce(fn, _reduce(fn, fn(start, node), node.left), node.right): start
);




const Tree = Object.assign(Object.create(null), {
	init(){
		this.root = EmptyTNode;
		return this;
	},

	isEmpty(){
		return this.root === EmptyTNode;
	},

	size(){
		return _size(this.root);
	},

	insert(interval, data){
		this.root = _insert(this.root, interval, data);
		return this;
	},

	search(value){
		return _search(this.root, value);
	},
	toString(){
		return _reduce( (acc, node) => acc + `[${node.interval.start}-${node.interval.end}|${node.maxEnd}]`, '', this.root)
	}
});

export const IntervalTree = () => Object.create(Tree).init();
