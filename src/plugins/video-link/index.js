import {div} from '@motorcycle/dom';

export const videolinkPlugin = (settings) => ({DOM}) =>
	div('.plugin', {style: {display: 'block', position: 'absolute', top: '10px', left: '10px', width: '100px', height: '100px', background: 'red'}});
