import {div} from '@cycle/dom';


export const videoLinkPlugin = (desc) => ({DOM}) =>
	div('.plugin.vlink', {
		style: {
			display: 'block',
			position: 'absolute',
			top: `${desc.params.x * 100}%`,
			left: `${desc.params.y * 100}%`,
			width: '100px',
			height: '100px',
			background: desc.settings.color
		},
		props: {vref: desc.settings.vref, play: true, time: 0}
	});