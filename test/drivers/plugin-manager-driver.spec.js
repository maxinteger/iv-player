'use strict';
/* global describe, it, beforeEach */
const assert = require('assert');
const {is} = require('ramda');
const xs = require('xstream');
const delay = require('xstream/extra/delay').default;
const SL = require('../../src/utils/xs').SimpleListener;
const {makePluginManagerDriver} = require('../../src/lib/plugin-manager-driver');

describe('Plugin manager driver', () => {
    describe('makePluginManagerDriver', () => {
        it('should be a function', () => {
            assert.strictEqual(is(Function, makePluginManagerDriver), true);
        });
    })
});