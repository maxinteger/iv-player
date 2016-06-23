const IntervalI = Object.assign(Object.create(null), {
	init(start, end){
		this.start = start;
		this.end = end;
		return this;
	},
	contains (value){
		return value >= this.start && value < this.end;
	}
});

export const Interval = (start, end) => Object.create(IntervalI).init(start, end);
