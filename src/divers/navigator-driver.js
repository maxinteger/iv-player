
export const makeNavigatorDriver = ({startLink}) => {
	const navigator_ = most.from([
		{type: 'switch', vref: startLink, time: 0},
		{type: 'play'}
	]);
	return sink_ =>
		Object.assign(sink_.observe((vid) => {
			// nop
		}), {navigator_});
};
