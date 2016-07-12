const fps60 = 1000/60;

const win = typeof window !== 'undefined' ? window : {};

export const rAF = win.requestAnimationFrame
	|| win.webkitRequestAnimationFrame
	|| win.mozRequestAnimationFrame
	|| win.msRequestAnimationFrame
	|| ( cb => setTimeout(cb, fps60) );

export const cAF = win.cancelAnimationFrame
	|| win.webkitCancelAnimationFrame
	|| win.mozCancelAnimationFrame
	|| win.msCancelAnimationFrame
	|| clearTimeout;
