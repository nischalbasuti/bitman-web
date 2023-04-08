import { Application, Sprite } from 'pixi.js';
import { getRandomNumber } from '../scene';
import { TEXTURES } from '../TEXTURES';

export default class Bomb {
  sprite: Sprite;
  app: Application;

  maxX: number;
  maxY: number;

  constructor(app: Application, maxX: number, maxY: number) {
    this.sprite = new Sprite(TEXTURES.bomb.idle);

    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;

    this.maxX = maxX;
    this.maxY = maxY;

    this.app = app;

    this.respawn();
  }

  #exploading: boolean = false;
  #exploadingFrame: number = 0;
  #exploadStartTime: Date = new Date();

  #texture() {
    if (this.#exploading) {
      const currentTime = new Date();
      if (currentTime.getTime() - this.#exploadStartTime.getTime() > 50) {
        this.#exploadingFrame++;
        this.#exploadStartTime = new Date();
      }
      if (this.#exploadingFrame > TEXTURES.bomb.explosion.length) {
        this.respawn();
      }
      return TEXTURES.bomb.explosion[this.#exploadingFrame];
    } else {
      return TEXTURES.bomb.idle;
    }
  }

  explode(increamentScore: Function | null) {
    if (this.#exploading) return;
    this.#exploadStartTime = new Date();
    this.#exploading = true;
    this.sprite.texture = this.#texture();

    if (increamentScore) increamentScore();
  }

  #acceleration = 0;
  update(deltaTime: number) {
    this.sprite.texture = this.#texture();

    if (!this.#exploading) this.sprite.y += this.#acceleration * deltaTime;
    this.#acceleration += 0.05;
  }

  respawn() {
    this.#exploadingFrame = 0;
    this.#exploading = false;
    this.#acceleration = 0;
    this.sprite.texture = TEXTURES.bomb.idle;
    this.sprite.x = getRandomNumber(0, this.maxX)
    this.sprite.y = getRandomNumber(this.maxY, this.maxY - 100)
  }
}

