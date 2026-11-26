import * as THREE from 'three';
import './style.css';

const container = document.querySelector('#scene');

const scene = new THREE.Scene();
scene.background = new THREE.Color('#101812');

const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.set(4, 3, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;
container.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight('#c7f5d2', 1.5));

const keyLight = new THREE.DirectionalLight('#ffffff', 3);
keyLight.position.set(3, 5, 4);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight('#57ff91', 1.5);
fillLight.position.set(-4, 1, -3);
scene.add(fillLight);

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1.8, 1.8, 1.8),
  new THREE.MeshStandardMaterial({
    color: '#43e879',
    roughness: 0.32,
    metalness: 0.08,
  }),
);
scene.add(cube);

const floor = new THREE.Mesh(
  new THREE.CircleGeometry(5, 64),
  new THREE.MeshBasicMaterial({ color: '#17251b' }),
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1.35;
scene.add(floor);

let pointerDown = false;
let previousX = 0;
let previousY = 0;

renderer.domElement.addEventListener('pointerdown', (event) => {
  pointerDown = true;
  previousX = event.clientX;
  previousY = event.clientY;
  renderer.domElement.setPointerCapture(event.pointerId);
});

renderer.domElement.addEventListener('pointermove', (event) => {
  if (!pointerDown) return;
  cube.rotation.y += (event.clientX - previousX) * 0.01;
  cube.rotation.x += (event.clientY - previousY) * 0.01;
  previousX = event.clientX;
  previousY = event.clientY;
});

renderer.domElement.addEventListener('pointerup', () => {
  pointerDown = false;
});

renderer.domElement.addEventListener(
  'wheel',
  (event) => {
    camera.position.multiplyScalar(event.deltaY > 0 ? 1.08 : 0.92);
    camera.position.clampLength(3, 10);
  },
  { passive: true },
);

function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

window.addEventListener('resize', resize);

function animate() {
  if (!pointerDown) {
    cube.rotation.y += 0.003;
  }
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
