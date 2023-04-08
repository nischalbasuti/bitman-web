import InputState, { INPUT_STATES } from "./inputState";

export function setupInput() {
  document.addEventListener("keydown", function(event) {
    switch(event.key) {
      case 'h':
      case 'ArrowLeft':
        console.log("Left arrow key was pressed");
        InputState.getInstance().setState(INPUT_STATES.left);

        break;
      case 'k':
      case 'ArrowUp':
        console.log("Up arrow key was pressed");
        InputState.getInstance().setState(INPUT_STATES.up);

        break;
      case 'l':
      case 'ArrowRight':
        console.log("Right arrow key was pressed");
        InputState.getInstance().setState(INPUT_STATES.right);

        break;
      case 'j':
      case 'ArrowDown':
        console.log("Down arrow key was pressed");
        InputState.getInstance().setState(INPUT_STATES.down);

        break;
      case 's': // only for debugging!
        console.log("s")
        InputState.getInstance().setState(INPUT_STATES.none);

        break;
    }
  });

  document.addEventListener("keyup", function() {
    InputState.getInstance().setState(INPUT_STATES.none);
  });

  if (window.DeviceOrientationEvent) {

    // Add an event listener to the window object to listen for device orientation changes
    window.addEventListener('deviceorientation', (event: DeviceOrientationEvent) => {

      // Get the gamma value of the device orientation (represents the tilt left or right)
      const gamma = event.gamma;

      // Check if gamma is null or undefined before comparing its value
      if (gamma == null) {
        console.log('Gamma value is null or undefined');
        return;
      }

      if (gamma > 0) {
        InputState.getInstance().setState(INPUT_STATES.right);
      } else if (gamma < 0) {
        InputState.getInstance().setState(INPUT_STATES.left);
      } else {
        InputState.getInstance().setState(INPUT_STATES.none);
        console.log('Device not tilted');
      }
    });
  } else {
    console.log('Device orientation not supported');
  }
}
