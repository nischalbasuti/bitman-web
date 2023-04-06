import { Assets } from "pixi.js"

export const TEXTURES = {
  bitman: {
    default: {
      still: await Assets.load("./src/game_assets/bitman/default/still.png"),
      moveLeft: await Assets.load("./src/game_assets/bitman/default/moving_left.png"),
      moveRight: await Assets.load("./src/game_assets/bitman/default/moving_right.png"),
    },
    shielded: {
      still: await Assets.load("./src/game_assets/bitman/shielded/still.png"),
      moveLeft: await Assets.load("./src/game_assets/bitman/shielded/moving_left.png"),
      moveRight: await Assets.load("./src/game_assets/bitman/shielded/moving_right.png"),
    },
    dead: await Assets.load("./src/game_assets/bitman/default/dead.png"),
  },
  bomb: {
    idle: await Assets.load("./src/game_assets/bomb/explosion_frames/0.png"),
    explosion: [
      await Assets.load("./src/game_assets/bomb/explosion_frames/0.png"),
      await Assets.load("./src/game_assets/bomb/explosion_frames/1.png"),
      await Assets.load("./src/game_assets/bomb/explosion_frames/2.png"),
      await Assets.load("./src/game_assets/bomb/explosion_frames/3.png"),
      await Assets.load("./src/game_assets/bomb/explosion_frames/4.png"),
      await Assets.load("./src/game_assets/bomb/explosion_frames/5.png"),
    ]
  },
  platform: await Assets.load("./src/game_assets/platform.png"),
  building: await Assets.load("./src/game_assets/building.png"),
  background: await Assets.load("./src/game_assets/background.png"),
}


