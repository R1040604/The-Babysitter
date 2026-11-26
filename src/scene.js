import * as THREE from 'three';

const floorHeight = -0.9;

export function createScene(container) {
  const scene = new THREE.Scene();
  const horizonColor = new THREE.Color('#343434');
  scene.background = horizonColor;
  scene.fog = new THREE.FogExp2(horizonColor, 0.03);

  const camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    0.1,
    100,
  );
  camera.position.set(4, 3, 5);

  const cameraTarget = new THREE.Vector3();
  const desiredCameraTarget = new THREE.Vector3();
  const cameraOffset = camera.position.clone();
  camera.lookAt(cameraTarget);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.domElement.tabIndex = 0;
  container.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight('#c7f5d2', 1.5));

  const keyLight = new THREE.DirectionalLight('#ffffff', 3);
  keyLight.position.set(3, 5, 4);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight('#57ff91', 1.5);
  fillLight.position.set(-4, 1, -3);
  scene.add(fillLight);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshStandardMaterial({
      color: '#1f4d2b',
      roughness: 0.95,
      metalness: 0,
    }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = floorHeight;
  floor.receiveShadow = true;
  scene.add(floor);

  function followCamera(position, delta) {
    desiredCameraTarget.set(position.x, 0, position.z);
    cameraTarget.lerp(
      desiredCameraTarget,
      1 - Math.exp(-5 * delta),
    );
    camera.position.copy(cameraTarget).add(cameraOffset);
    camera.lookAt(cameraTarget);
  }

  renderer.domElement.addEventListener(
    'wheel',
    (event) => {
      cameraOffset.multiplyScalar(event.deltaY > 0 ? 1.08 : 0.92);
      cameraOffset.clampLength(3, 10);
      camera.position.copy(cameraTarget).add(cameraOffset);
      camera.lookAt(cameraTarget);
    },
    { passive: true },
  );

  function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', resize);

  return { scene, camera, renderer, followCamera };
}
