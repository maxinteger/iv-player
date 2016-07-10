'use strict';
/* global describe, it, beforeEach */
const {is, identity} = require('ramda');
const xs = require('xstream');
const sinon = require('sinon');
const {mockPlayer, MockPlayer} = require('../../../src/drivers/video/adapters/mock-player-adapter');
const {makeVideoDriver} = require('../../../src/drivers/video/video-driver');
const SL = require('../../../src/utils/xs').SimpleListener;
const assert = require('assert');

const wrapPlayer = (store) =>
    (...args) => {
        const mp = mockPlayer(...args);
        store.push(mp);
        return mp;
    };

describe('Video Driver', ()=> {
    describe('init', () => {
        it('should fail without sources', () => {
            try {
                makeVideoDriver();
            } catch (e) {
                assert.strictEqual(e.message, 'You mast provide at least one video source')
            }
        });

        it('should fail with empty object of sources', () => {
            try {
                makeVideoDriver();
            } catch (e) {
                assert.strictEqual(e.message, 'You mast provide at least one video source')
            }
        });

        it('should fail without player adapter', () => {
            try {
                makeVideoDriver({video1: {}});
            } catch (e) {
                assert.strictEqual(e.message, '"playerAdapter" is not a function')
            }
        });

        it('should run with proper parameters', () => {
            const players = [];
            assert.strictEqual(is(Function, makeVideoDriver({video1: {}}, wrapPlayer(players))), true);
            assert.strictEqual(players.length, 1)
        });

        describe('instance', () => {
            let videoDriver = null;
            let players = null;

            beforeEach(() => {
                players = [];
                videoDriver = makeVideoDriver({video1: {}}, wrapPlayer(players))((xs.Stream.of({})));
            });

            it('should return with "event_" and "state_" streams', ()=> {
                assert.strictEqual(is(xs.Stream, videoDriver.events_), true);
                assert.strictEqual(is(Function, videoDriver.getState), true);
            });

            it('should be in a proper init state', () => {
                assert.deepEqual(videoDriver.getState(), {
                    activeVideo: null,
                    playing: false
                })
            })
        });


        describe('send', () => {
            let videoDriver = null;
            let players = null;

            beforeEach(() => {
                players = [];
                videoDriver = makeVideoDriver({ video1: {}, video2: {} }, wrapPlayer(players));
            });

            it('unknown action should emit empty stream from event_', (done) => {
                videoDriver(xs.Stream.of({type: 'unknown'}))
                    .events_.addListener(SL(() => assert(false)));
                setTimeout(done, 10);
            });

            it('switch action should throw error if the vref is invalid', () => {
                assert.throws(() => videoDriver(xs.Stream.of({type: 'switch', vref: 'invalidVref'})) );
            });

            it('switch action should change active video state', () => {
                const vd = videoDriver(xs.Stream.of({type: 'switch', vref: 'video1'}));
                assert.strictEqual(is(MockPlayer, vd.getState().activeVideo), true)
            });


            it('switch action should change active video state', (done) => {
                const pauseSpy = sinon.spy(players[0], 'pause');
                const vd = videoDriver(xs.Stream.of(
                    {type: 'switch', vref: 'video1'},
                    {type: 'switch', vref: 'video2'}
                ));
                setTimeout(() => {
                    assert.strictEqual(pauseSpy.calledOnce, true);
                    done();
                }, 1)
            });


            it('switch action with time should change player currentTime', () => {
                assert.strictEqual(players[0].currentTime, 0);
                videoDriver(xs.Stream.of({type: 'switch', vref: 'video1', time: 1}));
                assert.strictEqual(players[0].currentTime, 1);
            });

            it('pause action should not emit update action from event_ if activeVideo is empty', (done) => {
                const callback = sinon.spy();
                const vd = videoDriver(xs.Stream.of(
                    {type: 'pause'}
                ));

                vd.events_.addListener(SL(console.log.bind(console)));

                setTimeout(() => {
                    assert.strictEqual(callback.called, false);
                    assert.strictEqual(vd.getState().playing, false);
                    done();
                },2)
            });

            it('pause action should emit update action from event_ and change state', (done) => {
                const vd = videoDriver(xs.Stream.of(
                    {type: 'switch', vref: 'video1'},
                    {type: 'pause'}
                ));
                const listener = SL((action) => {
                    assert.strictEqual(vd.getState().activeVideo !== null, true);
                    assert.strictEqual(action.type, 'update');
                    assert.strictEqual(vd.getState().playing, false);
                    vd.events_.removeListener(listener);
                    done();
                });
                vd.events_.addListener(listener);
            });

            it('play action should start playing the video and update the state', (done) => {
                const playSpy = sinon.spy(players[0], 'play');
                const vd = videoDriver(xs.Stream.of(
                    {type: 'switch', vref: 'video1'},
                    {type: 'play', time: 1}
                ));
                setTimeout(() => {
                    assert.strictEqual(playSpy.calledOnce, true);
                    assert.strictEqual(playSpy.calledWith(1), true);
                    assert.strictEqual(vd.getState().playing, true);
                    done();
                }, 1)
            });

            xit('play action should emit update action until pause', (done) => {
                videoDriver(xs.Stream.of({type: 'play'}))
                    .events_.addListener(SL((action) => {
                    assert.strictEqual(action.type, 'update');
                    done()
                }))
            });
        } );

    })
});
