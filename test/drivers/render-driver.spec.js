'use strict';
/* global describe, it, beforeEach */
const assert = require('assert');
const {is} = require('ramda');
const xs = require('xstream');
const delay = require('xstream/extra/delay').default;
const sinon = require('sinon');
const {makeRenderDriver} = require('../../src/drivers/render-driver');

const createDummyCanvas = () => ({
    getContext () { return this.context },
    context: {
        canvas: {width: 100, height: 100},
        drawImage: () => null
    }
});

describe('Render driver', () => {

    describe('makeRenderDriver', ()=> {
        it('should be a function', ()=>
            assert.strictEqual(is(Function, makeRenderDriver), true)
        );

        it('should fail without render mode parameter', () =>{
            try{
                makeRenderDriver()
            } catch (e) {
                assert.strictEqual(e.message, 'You mast provide render mode (2d or 3d)');
            }
        });

        it('should return with a function', ()=>
            assert.strictEqual(is(Function, makeRenderDriver('2d')), true)
        );

    });

    describe('after init with empty stream', ()=> {
        let renderDriver = null;
        let dummyCanvas = null;

        beforeEach(()=> {
            renderDriver = makeRenderDriver('2d')(xs.Stream.of());
            dummyCanvas = createDummyCanvas();
        });

        it('should return with 2 methods', ()=> {
            assert.strictEqual(is(Function, renderDriver.setCanvas), true);
            assert.strictEqual(is(Function, renderDriver.unsetCanvas), true);
        });

        it('setCanvas should call getContext on canvas', () => {
            const spy = sinon.spy(dummyCanvas, 'getContext');
            renderDriver.setCanvas(dummyCanvas);
            assert.strictEqual(spy.calledOnce, true);
            assert.strictEqual(spy.calledWith('2d'), true);
        });

    });

    describe('after init with not empty stream and canvas', ()=> {
        let renderDriver = null;
        let dummyCanvas = null;
        let source = null;

        beforeEach(()=> {
            source = {};
            dummyCanvas = createDummyCanvas();
            renderDriver = makeRenderDriver('2d')(
                xs.Stream
                    .of({source, width: 100, height: 100})
                    .compose(delay(1))
            );
        });


        it('should call the canvas drawImage method', (done) => {
            const spy = sinon.spy(dummyCanvas.context, 'drawImage');
            renderDriver.setCanvas(dummyCanvas);
            setTimeout(() => {
                assert.strictEqual(spy.calledOnce, true);
                assert.strictEqual(spy.calledWith(source, 0, 0, 100, 100, 0, 0, 100, 100), true, 'drawImage called with');
                done();
            }, Math.ceil(1000/60) + 10)
        });

        it('should call not the canvas drawImage method if we unset the canvas', (done) => {
            const spy = sinon.spy(dummyCanvas.context, 'drawImage');
            renderDriver.setCanvas(dummyCanvas);
            renderDriver.unsetCanvas();
            setTimeout(() => {
                assert.strictEqual(spy.called, false);
                done();
            }, Math.ceil(1000/60 ))
        });

    });
});