import './style.css';
import { Clock, Vector3 } from 'three';
import { createScene } from './scene.js';
import { createVehicle } from './vehicle.js';
import { createControls } from './controls.js';
import { createFollowCamera } from './camera.js';
import { VEHICLE_SPEED, VEHICLE_TURN_SPEED } from './config.js';

const container = document.querySelector('#scene');
const { scene, camera, renderer } = createScene(container);
const vehicle = createVehicle();
const controls = createControls();
const followCamera = createFollowCamera();
const clock = new Clock();

scene.add(vehicle);

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

window.addEventListener('resize', resize);

function animate() {
  const delta = Math.min(clock.getDelta(), 0.05);

  if (controls.throttle !== 0) {
    vehicle.rotation.y += controls.steering * VEHICLE_TURN_SPEED * controls.throttle * delta;
  }

  if (controls.throttle !== 0) {
    const forward = new Vector3(0, 0, -1).applyQuaternion(vehicle.quaternion);
    vehicle.position.addScaledVector(forward, controls.throttle * VEHICLE_SPEED * delta);
  }

  followCamera.update(camera, vehicle, delta);

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
