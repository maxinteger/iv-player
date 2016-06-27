import {memoize, map, reduce, filter, pipe, groupBy, toPairs, fromPairs, uniq, mapObjIndexed} from "ramda";
import {div} from '@motorcycle/dom';
import {Interval} from "../utils/interval";
import {IntervalTree} from "../utils/interval-tree";

export const videolinkPlugin = (desc) => ({DOM}) =>
	div('.plugin.vlink', {
		style: {display: 'block', position: 'absolute', top: `${desc.params.x*100}%`, left: `${desc.params.y*100}%`, width: '100px', height: '100px', background: desc.settings.color},
		props: {vref: desc.settings.vref, play: true, time: 0}
	});

const pluginResolver = p => videolinkPlugin(p);


const insertPluginIntoTree = (intTree, plugin) =>
	intTree.insert(Interval(plugin.params.timeStart, plugin.params.timeEnd), plugin);

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
		mapObjIndexed( group => ({
			timeTrack: reduce( insertPluginIntoTree, IntervalTree(), group)
		}))
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
					activePlugins[activeVideo] = map(
						p => p.data, videoPlugins[activeVideo].timeTrack.search(action.time));
					break;
			}
		});

		return Object.assign(sinkRet, {render})
	}
};
