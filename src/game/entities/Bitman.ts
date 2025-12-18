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

  reset() {
    this.idle();

    this.sprite.x = this.maxX / 2;
  }

  #textures() {
    return this.shield ? TEXTURES.bitman.shielded : TEXTURES.bitman.default;
  }

  moveLeft(deltaTime: number, speedMultiplier: number = 1.0) {
    // Base speed of 5, multiplied by speedMultiplier (0 to 1) for acceleration
    // Minimum speed is 2 (40% of base) when at threshold, max is 5 (100%) at max tilt
    const minSpeed = 2;
    const maxSpeed = 5;
    const speed = minSpeed + (maxSpeed - minSpeed) * speedMultiplier;
    const newX = this.sprite.x - speed * deltaTime;

    if (!this.#isValidX(newX)) {
      this.idle();
      return;
    }

    this.sprite.texture = this.#textures().moveLeft;
    this.sprite.x = newX;
  }

  moveRight(deltaTime: number, speedMultiplier: number = 1.0) {
    // Base speed of 5, multiplied by speedMultiplier (0 to 1) for acceleration
    // Minimum speed is 2 (40% of base) when at threshold, max is 5 (100%) at max tilt
    const minSpeed = 2;
    const maxSpeed = 5;
    const speed = minSpeed + (maxSpeed - minSpeed) * speedMultiplier;
    const newX = this.sprite.x + speed * deltaTime;

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

