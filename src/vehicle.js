import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const floorHeight = -0.9;
const driveKeys = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']);

export async function createVehicle(scene, domElement, followCamera) {
  let gltf;
  try {
    gltf = await new GLTFLoader().loadAsync('/models/firetruck.glb');
  } catch (error) {
    console.error('Failed to load /models/firetruck.glb.', error);
    throw error;
  }

  const bounds = new THREE.Box3().setFromObject(gltf.scene);
  const size = bounds.getSize(new THREE.Vector3());
  const maxSize = Math.max(size.x, size.y, size.z);

  if (!Number.isFinite(maxSize) || maxSize <= 0) {
    throw new Error('Cannot fit firetruck.glb: the model has invalid bounds.');
  }

  const center = bounds.getCenter(new THREE.Vector3());
  const scale = 2.4 / maxSize;
  const vehicle = new THREE.Group();
  vehicle.add(gltf.scene);
  vehicle.scale.setScalar(scale);
  vehicle.position.set(
    -center.x * scale,
    floorHeight - bounds.min.y * scale,
    -center.z * scale,
  );
  scene.add(vehicle);

  const pressedKeys = new Set();
  let pointerDown = false;
  let previousX = 0;
  let previousY = 0;

  window.addEventListener('keydown', (event) => {
    if (!driveKeys.has(event.code)) return;
    event.preventDefault();
    pressedKeys.add(event.code);
  });

  window.addEventListener('keyup', (event) => {
    pressedKeys.delete(event.code);
  });

  window.addEventListener('blur', () => {
    pressedKeys.clear();
  });

  domElement.addEventListener('pointerdown', (event) => {
    pointerDown = true;
    previousX = event.clientX;
    previousY = event.clientY;
    domElement.focus();
    domElement.setPointerCapture(event.pointerId);
  });

  domElement.addEventListener('pointermove', (event) => {
    if (!pointerDown) return;
    vehicle.rotation.y += (event.clientX - previousX) * 0.01;
    vehicle.rotation.x += (event.clientY - previousY) * 0.01;
    previousX = event.clientX;
    previousY = event.clientY;
  });

  domElement.addEventListener('pointerup', () => {
    pointerDown = false;
  });

  domElement.addEventListener('pointercancel', () => {
    pointerDown = false;
  });

  return function updateVehicle(delta) {
    const driveInput =
      Number(pressedKeys.has('ArrowUp')) - Number(pressedKeys.has('ArrowDown'));
    const steeringInput =
      Number(pressedKeys.has('ArrowLeft')) -
      Number(pressedKeys.has('ArrowRight'));

    if (driveInput === 0 && steeringInput === 0) return;

    if (steeringInput !== 0) {
      vehicle.rotation.y += steeringInput * 1.6 * delta * (driveInput || 1);
    }

    if (driveInput !== 0) {
      vehicle.translateZ(-driveInput * 2.2 * delta);
    }

    followCamera(vehicle.position, delta);
  };
}
