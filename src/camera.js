import * as THREE from 'three';

export function createFollowCamera() {
  const offset = new THREE.Vector3(0, 5.5, 9);
  const lookAhead = new THREE.Vector3();
  const targetPosition = new THREE.Vector3();
  const targetLookAt = new THREE.Vector3();

  return {
    update(camera, vehicle, delta) {
      targetLookAt.copy(vehicle.position).add(
        new THREE.Vector3(0, 0, -3).applyQuaternion(vehicle.quaternion),
      );
      targetPosition.copy(offset).applyQuaternion(vehicle.quaternion).add(vehicle.position);

      const smoothing = 1 - Math.pow(0.001, delta);
      camera.position.lerp(targetPosition, smoothing);
      lookAhead.lerp(targetLookAt, smoothing);
      camera.lookAt(lookAhead);
    },
  };
}
