import * as PIXI from 'pixi.js';
import { Sprite } from 'pixi.js';

const config = {
  width: 1080,
  height:720 ,
  backgroundColor: 0xD3D3D3
}
const app = new PIXI.Application<HTMLCanvasElement>(config);

const canvasContainer = document.querySelector("#canvas-container");
canvasContainer.appendChild(app.view);

interface ITextures {
  [textureName: string]: {
    [stateName: string]: {
      still: PIXI.Texture;
      moveLeft: PIXI.Texture;
      moveRight: PIXI.Texture;
    };
  };
}

const TEXTURES: ITextures = {
  bitman: {
    default: {
      still: await PIXI.Assets.load("./src/game_assets/bitman/default/still.png"),
      moveLeft: await PIXI.Assets.load("./src/game_assets/bitman/default/moving_left.png"),
      moveRight: await PIXI.Assets.load("./src/game_assets/bitman/default/moving_right.png"),
    },
    shielded: {
      still: await PIXI.Assets.load("./src/game_assets/bitman/shielded/still.png"),
      moveLeft: await PIXI.Assets.load("./src/game_assets/bitman/shielded/moving_left.png"),
      moveRight: await PIXI.Assets.load("./src/game_assets/bitman/shielded/moving_right.png"),
    }
  }
}

console.log(TEXTURES.bitman.default)

const bitman = new Sprite(TEXTURES.bitman.default.still);

// position
bitman.x = app.renderer.width / 2;
bitman.y = app.renderer.height;

// rotate
bitman.anchor.x = 0.5;
bitman.anchor.y = 1.0;

// add to scene
app.stage.addChild(bitman);

const INPUT_STATES = {
  none: 'none',
  left: 'left',
  right: 'right',
  up: 'up',
  down: 'down',
}

class InputState {
  static #instance: InputState | null = null;

  #currentState;

  static getInstance(): InputState {
    if (!InputState.#instance) InputState.#instance = new InputState();

    return InputState.#instance;
  }
  constructor() {
    if (InputState.#instance) throw TypeError("Can only create one instance");

    this.#currentState = INPUT_STATES.none;
  }

  getState() {
    return this.#currentState;
  }

  setState(state: string) {
    this.#currentState = state;
  }
}

document.addEventListener("keydown", function(event) {
  switch(event.keyCode) {
    case 37:
      console.log("Left arrow key was pressed");
      InputState.getInstance().setState(INPUT_STATES.left);

      break;
    case 38:
      console.log("Up arrow key was pressed");
      InputState.getInstance().setState(INPUT_STATES.up);

      break;
    case 39:
      console.log("Right arrow key was pressed");
      InputState.getInstance().setState(INPUT_STATES.right);

      break;
    case 40:
      console.log("Down arrow key was pressed");
      InputState.getInstance().setState(INPUT_STATES.down);

      break;
  }
});


document.addEventListener("keyup", function(event) {
  InputState.getInstance().setState(INPUT_STATES.none);
});

app.ticker.add(() => {
  switch(InputState.getInstance().getState()) {
    case INPUT_STATES.left:
      bitman.x -= 5
      bitman.texture = TEXTURES.bitman.default.moveLeft;

      break;
    case INPUT_STATES.right:
      bitman.x += 5
      bitman.texture = TEXTURES.bitman.default.moveRight;

      break;
    case INPUT_STATES.none:
      bitman.texture = TEXTURES.bitman.default.still;

      break

  }
})



