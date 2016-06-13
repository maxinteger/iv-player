const fps60 = 1000/60;

export const rAF = window.requestAnimationFrame
	|| window.webkitRequestAnimationFrame
	|| window.mozRequestAnimationFrame
	|| window.msRequestAnimationFrame
	|| ( cb => setTimeout(cb, fps60) );

export const cAF = window.cancelAnimationFrame
	|| window.webkitCancelAnimationFrame
	|| window.mozCancelAnimationFrame
	|| window.msCancelAnimationFrame
	|| clearTimeout;
