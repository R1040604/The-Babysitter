export function createControls() {
  const pressedKeys = new Set();

  window.addEventListener('keydown', (event) => {
    if (event.key.startsWith('Arrow')) {
      event.preventDefault();
      pressedKeys.add(event.key);
    }
  });

  window.addEventListener('keyup', (event) => {
    pressedKeys.delete(event.key);
  });

  return {
    get steering() {
      return (pressedKeys.has('ArrowLeft') ? 1 : 0)
        - (pressedKeys.has('ArrowRight') ? 1 : 0);
    },
    get throttle() {
      return (pressedKeys.has('ArrowUp') ? 1 : 0)
        - (pressedKeys.has('ArrowDown') ? 1 : 0);
    },
  };
}
