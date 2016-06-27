import {memoize} from "ramda";
import {cAF, rAF} from "../utils/polyfill";

const getCanvasContext = memoize((selector) => document.querySelector(selector).getContext('2d'));

export const makeRenderDriver = (canvasSelector) => {
	let lastRFAId = 0;

	const render = (ctx, source, width, height) => {
		ctx.drawImage(source, 0, 0, width, height, 0, 0, ctx.canvas.width, ctx.canvas.height);
	};

	return sink_ =>
		sink_.observe(({source, width, height}) => {
			const ctx = getCanvasContext(canvasSelector);
			ctx.canvas.height  = height * (ctx.canvas.width / width);
			cAF(lastRFAId);
			lastRFAId = rAF(() => render(ctx, source, width, height))
		})
};
