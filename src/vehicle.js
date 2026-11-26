import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GLB_PATH } from './config.js';

export function createVehicle() {
  const vehicle = new THREE.Group();
  vehicle.position.set(0, 0, 0);
  vehicle.add(createFireTruckPlaceholder());

  new GLTFLoader().load(
    GLB_PATH,
    (gltf) => replaceWithGlb(vehicle, gltf.scene),
    undefined,
    () => {
      // The placeholder remains visible until firetruck.glb is available.
    },
  );

  return vehicle;
}

function replaceWithGlb(vehicle, model) {
  vehicle.clear();
  model.rotation.y = -Math.PI / 2;
  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  vehicle.add(model);
}

function createFireTruckPlaceholder() {
  const truck = new THREE.Group();

  const red = new THREE.MeshStandardMaterial({
    color: '#d72b2b',
    roughness: 0.42,
    metalness: 0.12,
  });
  const dark = new THREE.MeshStandardMaterial({
    color: '#242a2a',
    roughness: 0.7,
  });
  const glass = new THREE.MeshStandardMaterial({
    color: '#9bd0dd',
    roughness: 0.15,
    metalness: 0.25,
  });

  const chassis = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.45, 1.8), red);
  chassis.position.y = 0.55;
  chassis.castShadow = true;
  truck.add(chassis);

  const cab = new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.35, 1.72), red);
  cab.position.set(-1.15, 1.38, 0);
  cab.castShadow = true;
  truck.add(cab);

  const windshield = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.72, 1.38), glass);
  windshield.position.set(-1.87, 1.48, 0);
  truck.add(windshield);

  const tank = new THREE.Mesh(new THREE.BoxGeometry(1.95, 1.55, 1.65), red);
  tank.position.set(0.85, 1.45, 0);
  tank.castShadow = true;
  truck.add(tank);

  const wheelGeometry = new THREE.CylinderGeometry(0.46, 0.46, 0.32, 18);
  [-1.25, 1.15].forEach((x) => {
    [-0.94, 0.94].forEach((z) => {
      const wheel = new THREE.Mesh(wheelGeometry, dark);
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(x, 0.48, z);
      wheel.castShadow = true;
      truck.add(wheel);
    });
  });

  const beacon = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.18, 0.78),
    new THREE.MeshStandardMaterial({
      color: '#ff6b35',
      emissive: '#ff3510',
      emissiveIntensity: 2.5,
    }),
  );
  beacon.position.set(-0.95, 2.2, 0);
  truck.add(beacon);

  truck.rotation.y = -Math.PI / 2;
  return truck;
}
