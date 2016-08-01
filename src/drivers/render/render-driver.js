import xs from 'xstream'
import flattenConcurrently from "xstream/extra/flattenConcurrently";
import {cAF, rAF} from "../../utils/polyfill";
import {log, logError} from "../../utils/log";
import {fromEvent} from "../../utils/xs";

export const makeRenderDriver = (videoRender) => {

	if (typeof videoRender != 'function') {
		throw new Error('videoRender must be a function');
	}

	let videoRenderInstance = null;
	let lastRFAId = 0;

	const setCanvas = (elm) => videoRenderInstance = videoRender(elm);

	const unsetCanvas = () => videoRenderInstance = null;

	const click_ = fromEvent('intersect', videoRender.events);

	return sink_ => {
		const events_ = xs.merge(
			click_,
			sink_
				.map(/* TODO */)
				.compose( flattenConcurrently )
		);

		sink_.addListener({
			next: ({source, width, height}) => {
				if (videoRenderInstance) {
					cAF(lastRFAId);
					lastRFAId = rAF(() => videoRenderInstance.render(source, width, height));
				}
			},
			complete: () => log('Render driver completed'),
			error: logError('Render driver has fallen')
		});

		return {events_, setCanvas, unsetCanvas}
	}
};
