'use strict';

import {map} from 'ramda';
import {createElement} from '../../../utils/dom';

export const html5Player = videoData =>
	createElement('video', {muted: true, preload: 'metadata'},
		map(source => createElement('source', source), videoData.sources)
	);
