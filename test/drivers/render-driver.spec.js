'use strict';
/* global describe, it, beforeEach */
const assert = require('assert');
const {is} = require('ramda');
const xs = require('xstream');
const delay = require('xstream/extra/delay').default;
const sinon = require('sinon');
const {makeRenderDriver} = require('../../src/drivers/render');

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

        it('should fail without render adapter parameter', () =>{
            try{
                makeRenderDriver()
            } catch (e) {
                assert.strictEqual(e.message, 'renderAdapter must be a function');
            }
        });

        it('should return with a function', ()=>
            assert.strictEqual(is(Function, makeRenderDriver(() => null)), true)
        );

    });

    describe('after init with empty stream', ()=> {
        let renderDriver = null;
        let dummyCanvas = null;
        let renderFn = null;
        let adapter = null;

        beforeEach(()=> {
            renderFn = sinon.spy();
            adapter = sinon.spy(() => renderFn);
            dummyCanvas = {};
            renderDriver = makeRenderDriver(adapter)(xs.Stream.of());
        });

        it('should return with 2 methods', ()=> {
            assert.strictEqual(is(Function, renderDriver.setCanvas), true);
            assert.strictEqual(is(Function, renderDriver.unsetCanvas), true);
        });

        it('setCanvas should call getContext on canvas', () => {
            renderDriver.setCanvas(dummyCanvas);
            assert.strictEqual(adapter.calledOnce, true);
            assert.strictEqual(adapter.calledWith(dummyCanvas), true);
        });

    });

    describe('after init with not empty stream and canvas', ()=> {
        let renderDriver = null;
        let dummyCanvas = null;
        let source = null;
        let renderFn = null;
        let adapter = null;

        beforeEach(()=> {
            source = {};
            dummyCanvas = createDummyCanvas();
            renderFn = sinon.spy();
            adapter = sinon.spy(() => renderFn);
            renderDriver = makeRenderDriver(adapter)(
                xs.Stream
                    .of({source, width: 100, height: 100})
                    .compose(delay(1))
            );
        });


        it('should call the canvas drawImage method', (done) => {
            const spy = sinon.spy(dummyCanvas.context, 'drawImage');
            renderDriver.setCanvas(dummyCanvas);
            setTimeout(() => {
                assert.strictEqual(renderFn.calledOnce, true);
                assert.strictEqual(renderFn.calledWith(source, 100, 100), true, 'renderFn called with');
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