import Cycle from '@cycle/xstream-run';
import xs from 'xstream';
import {map, merge} from 'ramda';
import {div, canvas, button, makeDOMDriver} from '@cycle/dom';

import {makeVideoDriver, PLAY, PAUSE} from './drivers/video/video-driver';
import {makeRenderDriver} from './drivers/render';
import {VideoRender2d} from "./drivers/render/render-2d";
import {makeNavigatorDriver} from "./drivers/navigator-driver";
import {makePluginManagerDriver} from "./drivers/plugin-manager-driver";
import {html5Player} from './drivers/video/adapters/html5-player-adapter';
import config from './config';
import * as s from './style.css';

function main({DOM, Video, Render, Navigator, Plugin}) {
	const play_ = DOM.select('#play').events('click').map( () => ({type: PLAY}) );
	const pause_ = DOM.select('#pause').events('click').map( () => ({type: PAUSE}) );
	const videoLinks_ = DOM.select('.vlink').events('click').map( x => ({type: 'videolink', vref: x.target.vref, play: x.target.play, time: x.target.time}) );
	const video_ = Video.events_;
	const videoUpdate_ = xs.merge(
		Navigator.events_,
		play_,
		pause_
	);

	return {
		Navigator: videoLinks_,
		Render: Video.events_
			.filter( x => x.type == 'update')
			.map( ({source}) => ({source, width: source.videoWidth, height: source.videoHeight})),
		Video: videoUpdate_,
		Plugin: xs.merge(
			Video.events_
				.filter( x => x.type == 'update')
				.map( ({type, source}) => ({type, time: source.currentTime, length: source.duration})),
			Navigator.events_
		),
		DOM: xs
			.combine(video_.startWith({}), videoUpdate_.startWith(0))
			.map( ([{source}]) =>
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
						div(`#plugins.${s.plugins}`, Plugin.render({DOM}) ),
						canvas(`#render-canvas.${s.renderCanvas}`, {
							props: {width: 640 },
							hook:{
								insert: (vnode) => Render.setCanvas(vnode.elm),
								remove: () => Render.unsetCanvas()
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
		config.renderMode === '2d' ? VideoRender2d :
				null
	),
	Video: makeVideoDriver(config.videos, html5Player),
	Navigator: makeNavigatorDriver({
		startLink: config.startLink,
		autoplay: true
	}),
	Plugin: makePluginManagerDriver(config.plugins)
});
