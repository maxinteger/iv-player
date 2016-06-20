import Cycle from '@cycle/most-run';
import most from 'most';
import {map, merge} from 'ramda';
import {div, canvas, button, makeDOMDriver} from '@motorcycle/dom';

import {makeVideoDriver, PLAY, PAUSE} from './divers/video-driver';
import {makeRenderDriver} from './divers/render-driver';
import {makeNavigatorDriver} from "./divers/navigator-driver";
import {makePluginManagerDriver} from "./divers/plugin-manager-driver";
import config from './config';
import * as s from './style.css';

function main({DOM, Video, Render, Navigator, Plugin}) {
	const play_ = DOM.select('#play').events('click').map( () => ({type: PLAY}) );
	const pause_ = DOM.select('#pause').events('click').map( () => ({type: PAUSE}) );
	const videoLinks_ = DOM.select('.vlink').events('click').map( x => ({type: 'videolink', vref: x.target.vref, play: x.target.play, time: x.target.time}) );
	const control_ = Video.state_;
	const video_ = Video.events_;

	return {
		Navigator: videoLinks_,
		Render: Video.events_
			.filter( x => x.type == 'update')
			.map( ({source}) => ({source, width: source.videoWidth, height: source.videoHeight})),
		Video: most.mergeArray([
			Navigator.events_,
			play_,
			pause_
		]),
		Plugin: most.mergeArray([
			Video.events_
				.filter( x => x.type == 'update')
				.map( ({type, source}) => ({type, time: source.currentTime, length: source.duration})),
			Navigator.events_
		]),
		DOM: most
			.combine( ({source}, playback) =>
				div(`.${s.player}`, [
					div('.controls', [
						playback.play
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
						canvas(`#render-canvas.${s.renderCanvas}`, {props: {width: 640 }})
					])
				])
			,video_.startWith({}), control_)
	};
}


Cycle.run(main, {
	DOM: makeDOMDriver('#app-container'),
	Render: makeRenderDriver('#render-canvas'),
	Video: makeVideoDriver(config.videos),
	Navigator: makeNavigatorDriver({
		startLink: config.startLink,
		autoplay: true
	}),
	Plugin: makePluginManagerDriver(config.plugins)
});
