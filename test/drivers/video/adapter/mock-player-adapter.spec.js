'use strict';
/* global describe, it, beforeEach */
const {is} = require('ramda');
const assert = require('assert');
const {MockPlayer} = require('../../../../src/drivers/video/adapters/mock-player-adapter');

describe('Mock player', ()=> {
	it('initialization should not fail', ()=> {
		assert.strictEqual(typeof new MockPlayer(), "object");
	});

});
