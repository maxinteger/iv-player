import Cycle from '@cycle/xstream-run';
import xs from 'xstream';
import {map, merge, prop, pipe} from 'ramda';
import {div, canvas, button, makeDOMDriver} from '@cycle/dom';

import {makeVideoDriver, PLAY, PAUSE} from './drivers/video/video-driver';
import {makeRenderDriver} from './drivers/render';
import {VideoRender2d} from "./drivers/render/render-2d";
import navigator from "./lib/navigator";
import pluginManager from "./lib/plugin-manager";
import {html5Player} from './drivers/video/adapters/html5-player-adapter';
import config from './config';
import * as s from './style.css';

function main({DOM, Video, Render, Plugin}) {
	const play_ = DOM.select('#play').events('click').map( () => ({type: PLAY}) );
	const pause_ = DOM.select('#pause').events('click').map( () => ({type: PAUSE}) );
	const videoLinks_ = DOM.select('.vlink').events('click').map( x => ({type: 'videolink', vref: x.target.vref, play: x.target.play, time: x.target.time}) );
	const video_ = Video.events_;
	const nav_ = videoLinks_
		.compose(navigator({ startLink: config.startLink, autoplay: true }));

	const videoUpdate_ = xs.merge(
		nav_,
		play_,
		pause_
	);

	const plugins_ = xs
		.merge(
			Video.events_
				.filter( x => x.type == 'update' )
				.map( ({type, source}) => ({type, time: source.currentTime, length: source.duration}) ),
			nav_
		)
		.compose(pluginManager(config.plugins));

	return {
		Navigator: videoLinks_,
		Render: Video.events_
			.filter( x => x.type == 'update')
			.map( ({source}) => ({source, width: source.videoWidth, height: source.videoHeight})),
		Video: videoUpdate_,
		DOM: xs
			.combine(
				video_.startWith({}),
				videoUpdate_.startWith(0),
				plugins_.map(prop('currentPlugins'))
			)
			.map( ([{source}, x, plugins]) =>
				div(`.${s.player}`, [
					div('.controls', [
						Video.getState().playing
							? button('#pause', 'Pause')
							: button('#play', 'Play'),
						button('.vlink', { props: {vref: 'video_0001', play: false}}, 'Video #1 and pause'),
						button('.vlink', { props: {vref: 'video_0002', play: true}}, 'Video #2 and play'),
						div(`.${s.timeBar}`, [
							div(`.${s.progress}`, {style: {transform: `scaleX(${source ? (source.currentTime / source.duration) : 0})`}})
						])
					]),
					div(`.${s.canvasContainer}`, [
						div(`#plugins.${s.plugins}`,
							map( p => p.view({DOM}), plugins)
						),
						canvas(`#render-canvas.${s.renderCanvas}`, {
							props: {width: 640 },
							hook:{
								insert: pipe(prop('elm'), Render.setCanvas),
								remove: Render.unsetCanvas
							}
						})
					])
				])
			)
	};
}


Cycle.run(main, {
	DOM: makeDOMDriver('#app-container'),
	Render: makeRenderDriver(
		config.renderMode === '2d' ? VideoRender2d : null
	),
	Video: makeVideoDriver(config.videos, html5Player)
});
