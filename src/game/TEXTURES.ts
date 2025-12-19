import { Assets } from "pixi.js"

import bitman_default_still from "./assets/bitman/default/still.png"
import bitman_default_moveLeft from "./assets/bitman/default/moving_left.png"
import bitman_default_moveRight from "./assets/bitman/default/moving_right.png"

import bitman_shielded_still from    "./assets/bitman/shielded/still.png"
import bitman_shielded_moveLeft from "./assets/bitman/shielded/moving_left.png"
import bitman_shielded_moveRight from "./assets/bitman/shielded/moving_right.png"

import dead from "./assets/bitman/default/dead.png"

import platform from "./assets/platform.png"
import building from "./assets/building.png"
import background from "./assets/background.png"

import bomb_expload_0 from "./assets/bomb/explosion_frames/0.png"
import bomb_expload_1 from "./assets/bomb/explosion_frames/1.png"
import bomb_expload_2 from "./assets/bomb/explosion_frames/2.png"
import bomb_expload_3 from "./assets/bomb/explosion_frames/3.png"
import bomb_expload_4 from "./assets/bomb/explosion_frames/4.png"
import bomb_expload_5 from "./assets/bomb/explosion_frames/5.png"

import teeth_biting_0 from "./assets/teeth/biting_frames/0.png"
import teeth_biting_1 from "./assets/teeth/biting_frames/1.png"
import teeth_biting_2 from "./assets/teeth/biting_frames/2.png"

import teeth_explode_0 from "./assets/teeth/explosion_frames/0.png"
import teeth_explode_1 from "./assets/teeth/explosion_frames/1.png"
import teeth_explode_2 from "./assets/teeth/explosion_frames/2.png"
import teeth_explode_3 from "./assets/teeth/explosion_frames/3.png"
import teeth_explode_4 from "./assets/teeth/explosion_frames/4.png"
import teeth_explode_5 from "./assets/teeth/explosion_frames/5.png"

import shield from "./assets/shield.png"

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
      moveRight: await Assets.load(bitman_shielded_moveRight),
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
  teeth: {
    idle: await Assets.load(teeth_biting_0),
    biting: [
      await Assets.load(teeth_biting_0),
      await Assets.load(teeth_biting_1),
      await Assets.load(teeth_biting_2),
    ],
    explosion: [
      await Assets.load(teeth_explode_0),
      await Assets.load(teeth_explode_1),
      await Assets.load(teeth_explode_2),
      await Assets.load(teeth_explode_3),
      await Assets.load(teeth_explode_4),
      await Assets.load(teeth_explode_5),
    ]
  },
  shield: await Assets.load(shield),
  platform: await Assets.load(platform),
  building: await Assets.load(building),
  background: await Assets.load(background),
}
