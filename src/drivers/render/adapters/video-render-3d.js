import THREE from 'three';
import {EventEmitter} from "../../../utils/event-emitter";
import {VideoTexture} from "./VideoTexture";
const StereoEffect = require('three-stereo-effect')(THREE);
window.THREE = THREE;
const orientation = require('three.orientation');

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
	const eventEmitter = new EventEmitter();
    videoTexture.minFilter = THREE.LinearFilter;


    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(canvas.width, canvas.height);

    camera.position.set(100, 100, 100);

    const sphere = new THREE.SphereGeometry(500, 60, 40);
    sphere.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));
    effect = new StereoEffect(renderer);

    var loader = new THREE.FontLoader();

    loader.load('fonts/helvetiker_regular.typeface.json', function (font) {

        var theText = "3D Videolink";

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
            new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff, overdraw: 0.5})
        ]);

        var mesh = new THREE.Mesh(geometry, material);

        mesh.position.x = centerOffset;
        mesh.position.y = 100;
        mesh.position.z = 0;

        mesh.rotation.x = 0;
        //mesh.rotation.y = Math.PI * 2;
        // console.log('MESH', mesh);

        var group = new THREE.Group();
        group.add(mesh);
        scene.add(group);
        // console.log('GROUP', group);

        var raycaster = new THREE.Raycaster(); // create once
        var mouse = new THREE.Vector2();

        // User interaction
        window.addEventListener( 'mousemove', onMouseMove, false );
        window.addEventListener( 'click', onClick, false );

        function onMouseMove( e ) {

            e.preventDefault();
            if (!setMouseNDC( event )) {
                return;
            }

            raycaster.intersectObjects( group.children )
                .filter(crossed => crossed.object.geometry.type !== 'SphereGeometry')
                .forEach(el => {
                    // console.log('First three.js object crossed: ', el.object);
                    el.object.material.materials[0] = new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff, overdraw: 0.5});
					eventEmitter.triggerEvent({type: 'intersect', target: el.obj});
                });
        }

        function onClick( e ) {

            e.preventDefault();
            if (!setMouseNDC( event )) {
                return;
            }

            raycaster.intersectObjects( group.children )
                .filter(crossed => crossed.object.geometry.type !== 'SphereGeometry')
                .forEach(el => {
                    // console.log('Closest object clicked: ', el.object);
                    window.alert('Object clicked, this fn should switch to next video!');
					eventEmitter.triggerEvent({type: 'intersect', target: el.obj});
                });
        }

        function setMouseNDC( event ) {
            // Calculates Normalized Device Coordinates for the canvas, sets them
            //   returns boolen if cursor is on the canvas
            // http://stackoverflow.com/questions/7328472/how-webgl-works
            // these are Normalized Device Coordinates for the canvas
            // this will probably break when componentizing the player, or scrolling, etc...!!!

            const leftPadding = event.clientX - ( window.innerWidth - renderer.domElement.width)/2;
            const topPadding = event.clientY - renderer.domElement.getBoundingClientRect().top;

            mouse.x = ( leftPadding / renderer.domElement.width ) * 2 - 1;
            mouse.y = - ( topPadding / renderer.domElement.height ) * 2 + 1;
            raycaster.setFromCamera( mouse, camera );

            const cursorOnCanvas = mouse.x >= -1 && mouse.x <= 1 && mouse.y >= -1 && mouse.y <= 1;

            return cursorOnCanvas;
        }
    });

    var orientationControl = orientation(camera);

    function connect() {

        onScreenOrientationChangeEvent(); // run once on load

        window.addEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
        window.addEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

    };
    connect();

    // function disconnect() {

    //     window.removeEventListener( 'orientationchange', onScreenOrientationChangeEvent, false );
    //     window.removeEventListener( 'deviceorientation', onDeviceOrientationChangeEvent, false );

    // };

    function onDeviceOrientationChangeEvent( event ) {
        orientationControl.update();
    }

    function onScreenOrientationChangeEvent() {
        orientationControl.update();
    }

    var videoMaterial = new THREE.MeshBasicMaterial({
        map: videoTexture
    });
    var videoMesh = new THREE.Mesh(sphere, videoMaterial);
    scene.add(videoMesh);


    return {
        render: (source, width, height) => {
            videoTexture.updateImage(source);
            renderer.render(scene, camera);
        },
		events: eventEmitter
    }
};
