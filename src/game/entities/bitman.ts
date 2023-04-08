import { Application, Sprite } from 'pixi.js';
import { TEXTURES } from '../TEXTURES';

export default class Bitman {
  sprite: Sprite;
  app: Application;

  shield = false;

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
    const newX = this.sprite.x - 5 * deltaTime;

    if (!this.#isValidX(newX)) {
      this.idle();
      return;
    }

    this.sprite.texture = this.#textures().moveLeft;
    this.sprite.x = newX;
  }

  moveRight(deltaTime: number) {
    const newX = this.sprite.x + 5 * deltaTime;

    if (!this.#isValidX(newX)) {
      this.idle();
      return;
    }

    this.sprite.texture = this.#textures().moveRight;
    this.sprite.x = newX;
  }

  #isValidX(newX: number) {
    if (newX > this.maxX - this.sprite.width/2) return false;
    if (newX < this.sprite.width/2) return false;

    return true;
  }

  idle() {
    this.sprite.texture = this.#textures().still;
  }

  die() {
    this.sprite.texture = TEXTURES.bitman.dead;
  }
}

