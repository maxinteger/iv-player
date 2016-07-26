'use strict';
import THREE from 'three';

export const VideoTexture = function (video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy) {
    THREE.Texture.call(this, video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy);
    this.generateMipmaps = false;
};

VideoTexture.prototype = Object.create(THREE.Texture.prototype);
VideoTexture.prototype.updateImage = function (img) {
    if(img) this.image = img;
    this.needsUpdate = true;
};

VideoTexture.prototype.constructor = THREE.VideoTexture;
