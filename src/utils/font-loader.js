import THREE from 'three';
const Promise = require('es6-promise').Promise;


if (window && !window.THREE ) {
	window.THREE = THREE;
}

const loader = new THREE.FontLoader();



export default fontPath => {
	return new Promise((resolve, reject) => {

		if(!fontPath) {
			reject('no font-font_path specified');
			return;
		}
		loader.load(fontPath,
			font =>{
				resolve(font);
			}, progress => {

			}, error => {
				reject(error);
			})
	});
}

