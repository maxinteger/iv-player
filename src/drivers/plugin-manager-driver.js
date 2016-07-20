import {identity, memoize, map, reduce, filter, pipe, groupBy, toPairs, fromPairs, uniq, mapObjIndexed} from "ramda";
import {videoLinkPlugin} from '../plugins/video-link/index';
import {Interval} from "../utils/interval";
import * as it from "../utils/interval-tree";
import {log, logError} from '../utils/log';


const pluginResolver = p => videoLinkPlugin(p);

const insertPluginIntoTree = (intervalTree, plugin) =>
	it.insert(Interval(plugin.params.timeStart, plugin.params.timeEnd), plugin, intervalTree);

const scopeType = scope => x => x.params.scope === scope;

const preparePlayerPlugins = filter(scopeType('player'));

const prepareVideoPlugins = pipe(
	filter(scopeType('video')),
	groupBy(x => x.params.video),
	mapObjIndexed(group => ({
		timeTrack: reduce(insertPluginIntoTree, it.IntervalTree(), group)
	}))
);

export const makePluginManagerDriver = (plugins) => {
	let activeVideo = null;
	const activePlugins = {};

	const pluginsRes = map(p => ({
		params: p.params,
		view: pluginResolver(p)
	}), plugins);

	const playerPlugins = preparePlayerPlugins(pluginsRes);

	const videoPlugins = prepareVideoPlugins(pluginsRes);

	const render = (drivers) => map(
		p => p.view(drivers),
		activePlugins[activeVideo] || []
	);

	const nextHandler = (action) => {
		switch (action.type) {
			case 'switch':
				activeVideo = action.vref;
				break;
			case 'update':
				if (videoPlugins[activeVideo]) {
					activePlugins[activeVideo] = map(
						p => p.data,
						it.search(action.time, videoPlugins[activeVideo].timeTrack)
					);
				}
				break;
		}
	};

	return sink_ => {
		sink_.addListener({
			next: nextHandler,
			complete: () => log('PMD completed!'),
			error: logError('PMD Error :: ')
		});

		return {render};
	}
};
