export const Interval = (start, end) =>
	Object.assign(Object.create(null), { start, end	});

export const contains = (value, interval) =>
	value >= interval.start && value < interval.end;
