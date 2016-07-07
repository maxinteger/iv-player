'use strict';
/* global describe, it, beforeEach */
const {is} = require('ramda');
const xs = require('xstream');
const {mockPlayer} = require('../../../src/drivers/video/adapters/mock-player-adapter');
const {makeVideoDriver} = require('../../../src/drivers/video/video-driver');
const assert = require('assert');

describe('Video Driver', ()=> {
    describe('init', () => {
        it('should fail without sources', () => {
            try {
                makeVideoDriver();
            } catch (e) {
                assert.strictEqual(e.message, 'You mast provide at least one video source')
            }
        });

        it('should fail with empty array of sources', () => {
            try {
                makeVideoDriver();
            } catch (e) {
                assert.strictEqual(e.message, 'You mast provide at least one video source')
            }
        });

        it('should fail without player adapter', () => {
            try {
                makeVideoDriver([{}]);
            } catch (e) {
                assert.strictEqual(e.message, '"playerAdapter" is not a function')
            }
        });

        it('should run with proper parameters', () => {
            assert.strictEqual(is(Function, makeVideoDriver([{}], mockPlayer)), true)
        });

        describe('instance', () => {
            let videoDriver = null;

            beforeEach(() => {
                videoDriver = makeVideoDriver([{}], mockPlayer)((xs.Stream.of({})));
            });


            it('should return with "event_" and "state_" streams', ()=> {
                assert.strictEqual(is(xs.Stream, videoDriver.events_), true);
                assert.strictEqual(is(xs.Stream, videoDriver.state_), true);
            });
        })
    })
});
