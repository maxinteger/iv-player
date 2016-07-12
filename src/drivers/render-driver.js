import {memoize, identity} from "ramda";
import {cAF, rAF} from "../utils/polyfill";

export const makeRenderDriver = (renderMode) => {
	renderMode = (renderMode || '').toLowerCase();

	if (!(renderMode === '2d' || renderMode === '3d')) {
		throw new Error('You mast provide render mode (2d or 3d)');
	}

	let lastRFAId = 0;
	let canvasCtx = null;

	const render = (ctx, source, width, height) => {
		ctx.canvas.height = height * (ctx.canvas.width / width);
		ctx.drawImage(source, 0, 0, width, height, 0, 0, ctx.canvas.width, ctx.canvas.height);
	};

	const setCanvas = (elm) => canvasCtx = elm.getContext('2d');

	const unsetCanvas = () => canvasCtx = null;

	return sink_ =>{
		sink_.addListener({
			next: ({source, width, height}) => {
				if (canvasCtx) {
					cAF(lastRFAId);
					lastRFAId = rAF(() => render(canvasCtx, source, width, height));
				}
			},
			complete: identity,
			error: identity
		});

		return {setCanvas, unsetCanvas}
	}
};
