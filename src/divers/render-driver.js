import {memoize} from 'ramda';

const getCanvasContext = memoize((selector) => document.querySelector(selector).getContext('2d'));

export const makeRenderDriver = (canvasSelector) => {
	return sink_ =>
		sink_.observe(({target}) => {
			const ctx = getCanvasContext(canvasSelector);
			ctx.canvas.height  = target.videoHeight * (ctx.canvas.width / target.videoWidth);
			ctx.drawImage(target, 0, 0, target.videoWidth, target.videoHeight, 0, 0, ctx.canvas.width, ctx.canvas.height);
		})
};
