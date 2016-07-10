'use strict';
/* global describe, it, beforeEach */
const assert = require('assert');
const {MockPlayer} = require('../../../../src/drivers/video/adapters/mock-player-adapter');

describe('Mock player', ()=> {
	it('initialization should not fail', ()=> {
		const mp = new MockPlayer();
		assert.strictEqual(typeof mp, "object");
		assert.strictEqual(typeof mp.addEventListener, "function");
		assert.strictEqual(typeof mp.removeEventListener, "function");
	});

	describe('instance', () => {
		let mp = null;
		beforeEach(()=>{
			mp = new MockPlayer();
		});

		it('should emit "loadedmetadata" event after initialization', (done)=>{
			mp.addEventListener('loadedmetadata', (e) => {
				assert.strictEqual(e.type, 'loadedmetadata');
				assert.strictEqual(e.target, mp);
				done();
			})
		});

		it('should has a play method', () =>
			assert.strictEqual(typeof mp.play, 'function')
		);

		it('should emit "play" event after you call the play method', (done)=>{
			mp.addEventListener('play', (e) => {
				assert.strictEqual(e.type, 'play');
				assert.strictEqual(e.target, mp);
				done();
			});
			mp.play();
		});

		it('should has a pause method', () =>
			assert.strictEqual(typeof mp.pause, 'function')
		);

		it('should emit "pause" event after you call the pause method', (done)=>{
			mp.addEventListener('pause', (e) => {
				assert.strictEqual(e.type, 'pause');
				assert.strictEqual(e.target, mp);
				done();
			});
			mp.pause();
		});

		it('set currentTime should change currentTime', () =>{
			assert.strictEqual(mp.currentTime, 0);
			mp.currentTime = 1;
			assert.strictEqual(mp.currentTime, 1);
		});

	});
});
