import InputState, { InputStateType } from "./inputState";

export function setupInput() {
  document.addEventListener("keydown", function(event) {
    switch(event.key) {
      case 'h':
      case 'ArrowLeft':
        console.log("Left arrow key was pressed");
        InputState.getInstance().setState(InputStateType.Left);

        break;
      case 'k':
      case 'ArrowUp':
        console.log("Up arrow key was pressed");
        InputState.getInstance().setState(InputStateType.Up);

        break;
      case 'l':
      case 'ArrowRight':
        console.log("Right arrow key was pressed");
        InputState.getInstance().setState(InputStateType.Right);

        break;
      case 'j':
      case 'ArrowDown':
        console.log("Down arrow key was pressed");
        InputState.getInstance().setState(InputStateType.Down);

        break;
      case 's': // only for debugging!
        console.log("s")
        InputState.getInstance().setState(InputStateType.None);

        break;
    }
  });

  document.addEventListener("keyup", function() {
    InputState.getInstance().setState(InputStateType.None);
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
        InputState.getInstance().setState(InputStateType.Right);
      } else if (gamma < 0) {
        InputState.getInstance().setState(InputStateType.Left);
      } else {
        InputState.getInstance().setState(InputStateType.None);
        console.log('Device not tilted');
      }
    });
  } else {
    console.log('Device orientation not supported');
  }
}
