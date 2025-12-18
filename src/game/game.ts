import { Application, Container, Sprite } from 'pixi.js';
import Bitman from './entities/Bitman';
import Bomb from './entities/Bomb';
import { setupInput } from './inputHandler';
import InputState, { InputStateType } from './inputState';
import { TEXTURES } from './TEXTURES';

export function initGame (
  increamentScore: () => number, 
  clearScore: () => number, 
  canvasContainer: Element,
  bombCount: number,
  onGameOver: () => void
) {
  setupInput();

  // ...........Add canvas DOM.........................
  // const screenWidth = window.innerWidth <= 1080 ? window.innerWidth : 1080;
  // const aspectRatio = 16 / 9;
  // const screenHeight = screenWidth / aspectRatio;
  const screenWidth = 720;
  const screenHeight = 720;

  const app = new Application<HTMLCanvasElement>({
    width: screenWidth,
    height: screenHeight,
    resolution: window.devicePixelRatio,
    backgroundColor: 0xD3D3D3,
  });

  canvasContainer.appendChild(app.view);
  //\ ...........Add canvas DOM.........................

  const container = new Container();
  container.x = screenWidth/2;
  container.y = screenHeight;

  app.stage.addChild(container);


  container.height = screenHeight;
  container.width = screenWidth;

  const platform = new Sprite(TEXTURES.platform);

  const scaleFactor = screenWidth / platform.width;

  container.scale.x = scaleFactor * .95;
  container.scale.y = scaleFactor * .95;

  container.pivot.set(screenWidth/2, 0);

  platform.anchor.set(0, 1)

  platform.x = 0;
  platform.y = container.height + platform.height / 3;

  const bitman = new Bitman(app, platform.width / 2, platform.y - platform.height, platform.width);
  bitman.sprite.y += bitman.sprite.height / 3

  const bombs: Bomb[] = [];
  for (let i = 0; i < bombCount; i++) {
    bombs.push(new Bomb(app, platform.width, -screenHeight));
  }

  //----------------background------------------------

  const building0 = new Sprite(TEXTURES.building);
  building0.anchor.set(0, 1)
  building0.x = building0.width / 3;
  building0.y = container.height;
  building0.scale.set(1, 0.8)


  const building1 = new Sprite(TEXTURES.building);
  building1.anchor.set(0, 1)
  building1.x = building0.x + building0.width * 2;
  building1.y = container.height;
  building1.scale.set(0.8, 0.8)

  const building2 = new Sprite(TEXTURES.building);
  building2.anchor.set(0, 1)
  building2.x = building1.x + building1.width * 2;
  building2.y = container.height;
  building2.scale.set(0.8, 1)

  container.addChild(building0);
  container.addChild(building1);
  container.addChild(building2);

  //\----------------background------------------------

  container.addChild(platform);
  container.addChild(bitman.sprite);

  for (const bomb of bombs) container.addChild(bomb.sprite);

  function bitmanTicker(deltaTime: number) {
    container.pivot.x = bitman.sprite.position.x;
    switch(InputState.getInstance().getState()) {
      case InputStateType.Left:
        bitman.moveLeft(deltaTime);

        break;
      case InputStateType.Right:
        bitman.moveRight(deltaTime);

        break;
      case InputStateType.None:
        bitman.idle();

        break
    }
  }

  app.ticker.add(bitmanTicker);

  app.ticker.add((deltaTime) => {
    for (const bomb of bombs) {
      bomb.update(deltaTime);
      if (bomb.sprite.y >= platform.y - platform.height - bitman.sprite.height/3) bomb.explode(increamentScore);
      if (bomb.sprite.getBounds().intersects(bitman.sprite.getBounds())) {
        bomb.explode(null);
        bitman.die()

        app.ticker.stop();

        onGameOver();

        break;
      }
    }
  });

  // Return cleanup function
  return () => {
    app.ticker.stop();
    const view = app.view;
    if (view && canvasContainer && view.parentNode) {
      canvasContainer.removeChild(view);
    }
    app.destroy(true, { children: true, texture: false, baseTexture: false });
  };
}
