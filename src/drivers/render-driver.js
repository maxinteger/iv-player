import {memoize, identity} from "ramda";
import {cAF, rAF} from "../utils/polyfill";

const getCanvasContext = (selector) => document.querySelector(selector);

export const makeRenderDriver = (canvasSelector) => {
	let lastRFAId = 0;

	const render = (ctx, source, width, height) => {
		ctx.drawImage(source, 0, 0, width, height, 0, 0, ctx.canvas.width, ctx.canvas.height);
	};

	return sink_ =>
		sink_.addListener({
			next: ({source, width, height}) => {
				const canvas = getCanvasContext(canvasSelector);
				if (canvas) {
					const ctx = canvas.getContext('2d');
					ctx.canvas.height  = height * (ctx.canvas.width / width);
					cAF(lastRFAId);
					lastRFAId = rAF(() => render(ctx, source, width, height))
				}
			},
			complete: identity,
			error: identity
		});
};
