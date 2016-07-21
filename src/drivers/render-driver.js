import {memoize, identity} from "ramda";
import {cAF, rAF} from "../utils/polyfill";
import THREE from 'three';
window.THREE = THREE;
const StereoEffect = require('three-stereo-effect')(THREE);
const OrbitControls = require('three-orbit-controls')(THREE);
const DeviceOrientationControls = require('device-orientation-controls');

export const makeRenderDriver = (renderMode) => {
	renderMode = (renderMode || '').toLowerCase();

	if (!(renderMode === '2d' || renderMode === '3d')) {
		throw new Error('You mast provide render mode (2d or 3d)');
	}

	let lastRFAId = 0;
	let canvasCtx = null;
	let scene = null;
	let activeSource = null;
	let sphere = null;
	let effect = null;
	let renderer = null;
	let camera = null;

	const render = (ctx, source, width, height) => {
		if(renderMode === '2d'){
			ctx.canvas.height = height * (ctx.canvas.width / width);
			ctx.drawImage(source, 0, 0, width, height, 0, 0, ctx.canvas.width, ctx.canvas.height);
		} else if (renderMode === '3d'){
			/*camera.aspect = width / height;
			camera.updateProjectionMatrix();
			renderer.setSize(width, height);
			effect.setSize(width, height);
			 */
		}
	};

	const createVideoTexture = (video, sphere) => {
		var videoTexture = new THREE.VideoTexture(video);
		videoTexture.minFilter = THREE.LinearFilter;
		var videoMaterial = new THREE.MeshBasicMaterial({
			map: videoTexture
		});
		var videoMesh = new THREE.Mesh(sphere, videoMaterial);
		scene.add(videoMesh);
	};

	const setCanvas = (elm) => {
		if(renderMode === '2d'){
			canvasCtx = elm.getContext('2d');
		} else {
			canvasCtx = elm;

			renderer = new THREE.WebGLRenderer({canvas: elm, antialias: true, alpha: true});
			renderer.setPixelRatio(window.devicePixelRatio);
			renderer.setSize(640, 400);
			renderer.setClearColor(0x0000ff, 0);

			camera = new THREE.PerspectiveCamera(95, 1, 0.001, 700);
			camera.position.set(100, 100, 100);

			scene = new THREE.Scene();
			sphere = new THREE.SphereGeometry(500, 60, 40);
			sphere.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

			effect = new StereoEffect(renderer);

			var loader = new THREE.FontLoader();
			loader.load('helvetiker_regular.typeface.json', function (font) {
				var theText = "Hello three.js! :)";

				var hash = document.location.hash.substr(1);

				if (hash.length !== 0) {
					theText = hash;
				}

				var geometry = new THREE.TextGeometry(theText, {
					font: font,
					size: 80,
					height: 20,
					curveSegments: 2
				});

				geometry.computeBoundingBox();

				var centerOffset = -0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );

				var material = new THREE.MultiMaterial([
					new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff, overdraw: 0.5}),
					new THREE.MeshBasicMaterial({color: 0x000000, overdraw: 0.5})
				]);

				var mesh = new THREE.Mesh(geometry, material);

				mesh.position.x = centerOffset;
				mesh.position.y = 100;
				mesh.position.z = 0;

				mesh.rotation.x = 0;
				//mesh.rotation.y = Math.PI * 2;

				var group = new THREE.Group();
				group.add(mesh);

				scene.add(group);
			});


			let controls = new OrbitControls(camera);
			//controls.rotateUp(Math.PI / 4);
			controls.target.set(
				camera.position.x + 0.1,
				camera.position.y,
				camera.position.z
			);
			controls.noZoom = true;
			controls.noPan = true;
			/*controls = new DeviceOrientationControls(camera, elm, true);
			controls.connect();
			controls.update();*/
		}
	};

	const unsetCanvas = () => canvasCtx = null;

	const videoTextureMap = new WeakMap();

	return sink_ =>{
		sink_.addListener({
			next: ({source, width, height}) => {
				if (canvasCtx) {
					if (renderMode === '3d'){
						if (source !== activeSource) {
							activeSource = source;
							createVideoTexture(source, sphere);
							console.log(scene);
						}
						//effect.render(scene, camera);
						renderer.render(scene, camera);
					} else if (renderMode === '2d'){
						cAF(lastRFAId);
						lastRFAId = rAF(() => render(canvasCtx, source, width, height));
					}
				}
			},
			complete: identity,
			error: identity
		});

		return {setCanvas, unsetCanvas}
	}
};
