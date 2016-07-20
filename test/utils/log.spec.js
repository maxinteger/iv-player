'use strict';
/* global describe, it, beforeEach */
const assert = require('assert');
const sinon = require('sinon');
const {is} = require('ramda');
const {log, logError} = require('../../src/utils/log');

describe('logger', () => {
    describe('log', () => {
        it('should be a function', () => {
            assert(is(Function, log))
        });
    });

    describe('logError', () => {
        it('should be a function', () => {
            assert(is(Function, logError))
        });
    });
});
