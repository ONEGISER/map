import * as THREE from 'three';
export class InitThree {
    three: any = {

    }
    el: any
    constructor(el:any) {
        this.el = el
        this.init()
    }

    init() {
        this.three.scene = new THREE.Scene();
        this.three.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.three.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.three.renderer.setSize(window.innerWidth, window.innerHeight);
        this.el.appendChild(this.three.renderer.domElement);
    }

}