import {memoize} from "ramda";
import {cAF, rAF} from "../utils/polyfill";

const getCanvasContext = memoize((selector) => document.querySelector(selector).getContext('2d'));

export const makeRenderDriver = (canvasSelector) => {
	let lastRFAId = 0;

	const render = (ctx, source) => {
		ctx.drawImage(source, 0, 0, source.videoWidth, source.videoHeight, 0, 0, ctx.canvas.width, ctx.canvas.height);
	};

	return sink_ =>
		sink_.observe(({target}) => {
			const ctx = getCanvasContext(canvasSelector);
			ctx.canvas.height  = target.videoHeight * (ctx.canvas.width / target.videoWidth);
			cAF(lastRFAId);
			lastRFAId = rAF(() => render(ctx, target))
		})
};
