import { Assets, Texture, Rectangle } from "pixi.js"

import bitman_default_still from "./assets/bitman/default/still.png"
import bitman_default_moveLeft from "./assets/bitman/default/moving_left.png"
import bitman_default_moveRight from "./assets/bitman/default/moving_right.png"

import bitman_shielded_still from    "./assets/bitman/shielded/still.png"
import bitman_shielded_moveLeft from "./assets/bitman/shielded/moving_left.png"
import bitman_shielded_moveRight from "./assets/bitman/shielded/moving_right.png"

import dead from "./assets/bitman/default/dead.png"

import platform from "./assets/platform.png"
import building from "./assets/building.png"
import moon from "./assets/moon.png"
import star from "./assets/star.png"

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

// Load star sprite sheet and parse into frames
const starSheetTexture = await Assets.load(star);
const starFrames: Texture[] = [];
// Sprite sheet: 16x24px per frame, 2 columns, 3 rows
// Get actual texture dimensions
const sheetWidth = starSheetTexture.width;
const sheetHeight = starSheetTexture.height;
// Calculate frame dimensions from sheet size
const frameWidth = sheetWidth / 2; // 2 columns
const frameHeight = sheetHeight / 3; // 3 rows
// Extract frames in order: (0,0), (frameWidth,0), (0,frameHeight), (frameWidth,frameHeight), (0,2*frameHeight), (frameWidth,2*frameHeight)
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 2; col++) {
    const frame = new Texture(
      starSheetTexture.baseTexture,
      new Rectangle(col * frameWidth, row * frameHeight, frameWidth, frameHeight)
    );
    starFrames.push(frame);
  }
}

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
  moon: await Assets.load(moon),
  star: starFrames,
}
