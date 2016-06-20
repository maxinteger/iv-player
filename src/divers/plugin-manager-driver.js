import {memoize, map, reduce, filter, pipe, groupBy, toPairs, fromPairs, uniq} from "ramda";
import {div} from '@motorcycle/dom';
import {TimeMap} from "../utils/time-map";

export const videolinkPlugin = (desc) => ({DOM}) =>
	div('.plugin.vlink', {
		style: {display: 'block', position: 'absolute', top: `${desc.params.x*100}%`, left: `${desc.params.y*100}%`, width: '100px', height: '100px', background: desc.settings.color},
		props: {vref: desc.settings.vref, play: true, time: 0}
	});

const pluginResolver = p => videolinkPlugin(p);


export const makePluginManagerDriver = (plugins) => {
	const pluginsRes = map(p => ({
		params: p.params,
		view: pluginResolver(p)
	}), plugins);

	const scopeIs = scope => x => x.params.scope === scope;
	const playerPlugins = filter( scopeIs('player') )(pluginsRes);
	const videoPlugins = pipe(
		filter( scopeIs('video') ),
		groupBy( x => x.params.video ),
		toPairs,
		map( ([key, value]) => [ key, {
				timeTrack: reduce( (tm, x)=> tm.add(x.params.timeStart, x), TimeMap(), value),
			}]),
		fromPairs
	)(pluginsRes);

	const activePlugins = {};

	const render = (drivers) => map( p => p.view(drivers), activePlugins[activeVideo] || []);

	let activeVideo = null;

	return sink_ => {
		const sinkRet = sink_.observe( (action) => {
			switch (action.type) {
				case 'switch':
					activeVideo = action.vref; break;
				case 'update':
					const active = videoPlugins[activeVideo];
					activePlugins[activeVideo] = uniq([
						...filter(x => x.params.timeStart <= action.time, active.timeTrack.get(action.time)),
						...filter(x => x.params.timeEnd > action.time, activePlugins[activeVideo] || [])
					]);
					break;
			}
		});

		return Object.assign(sinkRet, {render})
	}
};
