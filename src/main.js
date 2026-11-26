import * as THREE from 'three';
import './style.css';
import { createScene } from './scene.js';
import { createVehicle } from './vehicle.js';

const { scene, camera, renderer, followCamera } = createScene(
  document.querySelector('#scene'),
);
const updateVehicle = await createVehicle(
  scene,
  renderer.domElement,
  followCamera,
);
const clock = new THREE.Clock();

renderer.setAnimationLoop(() => {
  updateVehicle(Math.min(clock.getDelta(), 0.05));
  renderer.render(scene, camera);
});
