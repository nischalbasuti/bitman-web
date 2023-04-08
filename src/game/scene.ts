import { Application, Container, Sprite } from 'pixi.js';
import Bitman from './entities/bitman';
import Bomb from './entities/bomb';
import { setupInput } from './inputHandler';
import InputState, { INPUT_STATES } from './inputState';
import { TEXTURES } from './TEXTURES';

export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function initGame (increamentScore: Function, clearScore: Function, canvasContainer: Element) {
  setupInput();

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

  const container = new Container();
  container.y = screenHeight;
  app.stage.addChild(container);

  const platform = new Sprite(TEXTURES.platform);

  const scaleFactor = screenWidth / platform.width;

  container.scale.x = scaleFactor;
  container.scale.y = scaleFactor;

  platform.anchor.set(0, 1)

  platform.x = 0;
  platform.y = container.height + platform.height / 3;

  const bitman = new Bitman(app, platform.width / 2, platform.y - platform.height, platform.width);
  bitman.sprite.y += bitman.sprite.height / 3

  const bombs = [
    new Bomb(app, platform.width, -screenHeight),
    new Bomb(app, platform.width, -screenHeight),
    new Bomb(app, platform.width, -screenHeight),
    new Bomb(app, platform.width, -screenHeight),
    new Bomb(app, platform.width, -screenHeight),
  ];

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
    switch(InputState.getInstance().getState()) {
      case INPUT_STATES.left:
        bitman.moveLeft(deltaTime);

        break;
      case INPUT_STATES.right:
        bitman.moveRight(deltaTime);

        break;
      case INPUT_STATES.none:
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

        for (let b of bombs) b.respawn();
        window.setTimeout(() => {
          app.ticker.start();
          clearScore();
        }, 3_000)

        break;
      }
    }
  });

}
