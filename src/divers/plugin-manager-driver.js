import {memoize, map, reduce, filter, pipe, groupBy, toPairs, fromPairs, uniq} from "ramda";
import {div} from '@motorcycle/dom';
import {TimeMap} from "../utils/time-map";

export const videolinkPlugin = (settings) => ({DOM}) =>
	div('.plugin', {style: {display: 'block', position: 'absolute', top: '10px', left: '10px', width: '100px', height: '100px', background: 'red'}});

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
				timeTrack: reduce( (tm, x)=> tm
						.add(x.params.timeStart, x),
					TimeMap(), value),
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
					console.log(activePlugins[activeVideo], activeVideo);
					break;
			}
		});

		return Object.assign(sinkRet, {render})
	}
};
