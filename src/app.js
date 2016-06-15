import Cycle from '@cycle/most-run';
import most from 'most';
import {map, merge} from 'ramda';
import {div, canvas, button, makeDOMDriver} from '@motorcycle/dom';

import {makeRenderDriver} from './divers/render-driver';
import {makeVideoDriver, PLAY, PAUSE} from './divers/video-driver';
import {makeNavigatorDriver} from "./divers/navigator-driver";
import config from './config';
import s from './style.css';

function main({DOM, Video, Render, Navigator}) {
	const play_ = DOM.select('#play').events('click').map( () => ({type: PLAY}) );
	const pause_ = DOM.select('#pause').events('click').map( () => ({type: PAUSE}) );
	const videoLinks_ = DOM.select('.vlink').events('click').map( x => ({type: 'videolink', vref: x.target.vref, play: x.target.play}) );
	const control_ = Video.state_;
	const video_ = Video.events_;

	return {
		Navigator: videoLinks_,
		Render: Video.events_.filter( x => x.type == 'render'),
		Video: most.mergeArray([Navigator.events_, play_, pause_]),
		DOM: most
			.combine( (video, playback) =>
	//		console.log(playback)||
				div(`.${s.player}`, [
					div('.controls', [
						playback.play
							? button('#pause', 'Pause')
							: button('#play', 'Play'),
						button('.vlink', { props: {vref: 'video_0001', play: false}}, 'Video #1 and pause'),
						button('.vlink', { props: {vref: 'video_0002', play: true}}, 'Video #2 and play'),
						div(`.${s.timeBar}`, [
							div(`.${s.progress}`, {style: {transform: `scaleX(${video.source ? (video.source.currentTime / video.source.duration) : 0})`}})
						])
					]),
					div('.canvas-container', [
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
	})
});
