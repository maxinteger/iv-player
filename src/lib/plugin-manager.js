import {prop, identity, memoize, map, reduce, filter, pipe, groupBy, toPairs, fromPairs, uniq, mapObjIndexed} from "ramda";
import {videoLinkPlugin} from '../plugins/video-link/index';
import {Interval} from "../utils/data/interval";
import * as it from "../utils/data/interval-tree";


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

const process = ({videoPlugins}) => ({activeVideo, activePlugins}, {type, vref, time}) => {
	switch (type) {
		case 'switch':
			activeVideo = vref;
			break;
		case 'update':
			if (videoPlugins[activeVideo]) {
				activePlugins[activeVideo] = map(prop('data'), it.search(time, videoPlugins[activeVideo].timeTrack));
			}
			break;
	}

	return ({
		activeVideo,
		activePlugins,
		currentPlugins: activePlugins[activeVideo] || []
	})
};


export default plugins => stream => {
	const pluginsRes = map(p => ({
		params: p.params,
		view: pluginResolver(p)
	}), plugins);

	const playerPlugins = preparePlayerPlugins(pluginsRes);

	const videoPlugins = prepareVideoPlugins(pluginsRes);

	return stream
		.fold(process({videoPlugins, playerPlugins}), {activeVideo: null, activePlugins: [], currentPlugins: []});

};
