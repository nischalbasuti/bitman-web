import { Assets } from "pixi.js"

import bitman_default_still from "./game_assets/bitman/default/still.png"
import bitman_default_moveLeft from "./game_assets/bitman/default/moving_left.png"
import bitman_default_moveRight from "./game_assets/bitman/default/moving_right.png"

import bitman_shielded_still from    "./game_assets/bitman/shielded/still.png"
import bitman_shielded_moveLeft from "./game_assets/bitman/shielded/moving_left.png"
import bitman_shielded_moveRight from "./game_assets/bitman/shielded/moving_right.png"

import dead from "./game_assets/bitman/default/dead.png"

import platform from "./game_assets/platform.png"
import building from "./game_assets/building.png"
import background from "./game_assets/background.png"

import bomb_expload_0 from "./game_assets/bomb/explosion_frames/0.png"
import bomb_expload_1 from "./game_assets/bomb/explosion_frames/1.png"
import bomb_expload_2 from "./game_assets/bomb/explosion_frames/2.png"
import bomb_expload_3 from "./game_assets/bomb/explosion_frames/3.png"
import bomb_expload_4 from "./game_assets/bomb/explosion_frames/4.png"
import bomb_expload_5 from "./game_assets/bomb/explosion_frames/5.png"

export const TEXTURES = {
  bitman: {
    default: {
      still: await Assets.load(bitman_default_still),
      moveLeft: await Assets.load(bitman_default_moveLeft),
      moveRight: await Assets.load(bitman_default_moveRight),
    },
    shielded: {
      still: await Assets.load(bitman_shielded_still),
      moveLeft: await Assets.load(bitman_shielded_moveLeft),
      moveRight: await Assets.load(bitman_default_moveRight),
    },
    dead: await Assets.load(dead),
  },
  bomb: {
    idle: await Assets.load(bomb_expload_0),
    explosion: [
      await Assets.load(bomb_expload_0),
      await Assets.load(bomb_expload_1),
      await Assets.load(bomb_expload_2),
      await Assets.load(bomb_expload_3),
      await Assets.load(bomb_expload_4),
      await Assets.load(bomb_expload_5),
    ]
  },
  platform: await Assets.load(platform),
  building: await Assets.load(building),
  background: await Assets.load(background),
}
