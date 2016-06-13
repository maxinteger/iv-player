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
	const videoLinks_ = DOM.select('.vlink').events('click').map( x => ({type: 'videolink', vref: x.target.vref}) );
	const control_ = most
		.mergeArray([play_, pause_, Navigator.events_])
		.startWith({});

	const video_ = Video.play_;

	return {
		Navigator: videoLinks_,
		Render: video_,
		Video: most.merge(control_, Navigator.events_),
		DOM: most
			.combine( (video, playback) =>
	//		console.log(playback)||
				div(`.${s.player}`, [
					div('.canvas-container', [
						canvas(`#render-canvas.${s.renderCanvas}`, {props: {width: 640 }})
					]),
					div('.controls', [
						playback.type == PLAY
							? button('#pause', 'Pause')
							: button('#play', 'Play'),
						button('.vlink', { props: {vref: 'video_0001'}}, 'Video #1'),
						button('.vlink', { props: {vref: 'video_0002'}}, 'Video #2'),
						div(`.${s.timeBar}`, [
							div(`.${s.progress}`, {style: {width: `${video.target ? (video.target.currentTime / video.target.duration) * 100 : 0}%`}})
						])
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
