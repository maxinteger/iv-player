import THREE from 'three';
import {VideoTexture} from "./VideoTexture";
const StereoEffect = require('three-stereo-effect')(THREE);
const OrbitControls = require('three-orbit-controls')(THREE);
window.THREE = THREE;
const DeviceOrientationControls = require('device-orientation-controls');

export const threeDom = {
    box: 1,
    sphere: 1,
    group: 1
};

export const VideoRender3d = (canvas, devicePixelRatio) => {
    let effect = null;

    const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true});
    const camera = new THREE.PerspectiveCamera(95, 1, 0.001, 700);
    const scene = new THREE.Scene();

    const videoTexture = new VideoTexture(null);
    videoTexture.minFilter = THREE.LinearFilter;


    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(canvas.width, canvas.height);

    camera.position.set(100, 100, 100);

    const sphere = new THREE.SphereGeometry(500, 60, 40);
    sphere.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
    effect = new StereoEffect(renderer);

    var loader = new THREE.FontLoader();

    loader.load('fonts/helvetiker_regular.typeface.json', function (font) {

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

		// TODO
		// Picking stuff

		var raycaster = new THREE.Raycaster(); // create once
		var mouse = new THREE.Vector2();

		// User interaction
		window.addEventListener( 'mousemove', onMouseMove, false );

		function onMouseMove( e ) {

			mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
			mouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;

			raycaster.setFromCamera( mouse, camera );
			var intersects = raycaster.intersectObjects( scene, true );
			console.log(raycaster);
			//scene.children.forEach(function( scene ) {
			//	console.log(scene);
			//	//scene.material.color.setRGB( scene.grayness, scene.grayness, scene.grayness );
			//});


			//for( var i = 0; i < intersects.length; i++ ) {
			//	var intersection = intersects[ i ],
			//		obj = intersection.object;
			//
			//	console.log(obj)
			//}
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

    var videoMaterial = new THREE.MeshBasicMaterial({
        map: videoTexture
    });
    var videoMesh = new THREE.Mesh(sphere, videoMaterial);
    scene.add(videoMesh);


    return {
        render: (source, width, height) =>{
            videoTexture.updateImage(source);
            renderer.render(scene, camera);
        }
    }
};
