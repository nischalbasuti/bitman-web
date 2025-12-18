import InputState, { InputStateType } from "./inputState";

// Threshold for device tilt in degrees - tilts below this value won't trigger movement
const TILT_THRESHOLD = 5;
// Maximum tilt angle for full speed (degrees)
const MAX_TILT = 45;

export function setupInput() {
  document.addEventListener("keydown", function(event) {
    switch(event.key) {
      case 'h':
      case 'ArrowLeft':
        console.log("Left arrow key was pressed");
        InputState.getInstance().setState(InputStateType.Left, 1.0);

        break;
      case 'k':
      case 'ArrowUp':
        console.log("Up arrow key was pressed");
        InputState.getInstance().setState(InputStateType.Up);

        break;
      case 'l':
      case 'ArrowRight':
        console.log("Right arrow key was pressed");
        InputState.getInstance().setState(InputStateType.Right, 1.0);

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
    InputState.getInstance().setState(InputStateType.None, 0);
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

      // Only trigger movement if tilt exceeds threshold (dead zone)
      if (Math.abs(gamma) > TILT_THRESHOLD) {
        // Calculate normalized tilt amount (0 to 1) for acceleration
        // Subtract threshold to account for dead zone, then normalize to max tilt
        const tiltMagnitude = Math.abs(gamma) - TILT_THRESHOLD;
        const normalizedTilt = Math.min(tiltMagnitude / (MAX_TILT - TILT_THRESHOLD), 1);
        
        if (gamma > 0) {
          InputState.getInstance().setState(InputStateType.Right, normalizedTilt);
        } else {
          InputState.getInstance().setState(InputStateType.Left, normalizedTilt);
        }
      } else {
        // Within threshold range - no movement (dead zone)
        InputState.getInstance().setState(InputStateType.None, 0);
      }
    });
  } else {
    console.log('Device orientation not supported');
  }
}
