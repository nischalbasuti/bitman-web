import { Application, Sprite } from 'pixi.js';
import { TEXTURES } from '../TEXTURES';

export default class Bitman {
  sprite: Sprite;
  app: Application;

  shield: boolean = false;

  maxX: number;

  constructor(app: Application, x: number, y: number, maxX: number) {
    this.sprite = new Sprite(TEXTURES.bitman.default.still);

    this.sprite.x = x;
    this.sprite.y = y;

    this.maxX = maxX;

    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 1.0;

    this.app = app;
  }

  #textures() {
    return this.shield ? TEXTURES.bitman.shielded : TEXTURES.bitman.default;
  }

  moveLeft(deltaTime: number) {
    this.sprite.x -= 5 * deltaTime;
    if (this.sprite.x > this.sprite.width) {
      this.sprite.texture = this.#textures().moveLeft;
    } else {
      this.sprite.x = this.maxX;
    }
  }

  moveRight(deltaTime: number) {
    this.sprite.x += 5 * deltaTime;
    console.log(deltaTime)
    if (this.sprite.x < this.maxX - this.sprite.width) {
      this.sprite.texture = this.#textures().moveRight;
    } else {
      this.sprite.x = 0;
    }
  }

  idle() {
    this.sprite.texture = this.#textures().still;
  }

  die() {
    this.sprite.texture = TEXTURES.bitman.dead;
  }
}
