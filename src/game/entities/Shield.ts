import { Application, Sprite } from 'pixi.js';
import { getRandomNumber } from '../utils';
import { TEXTURES } from '../TEXTURES';

export default class Shield {
  sprite: Sprite;
  app: Application;

  #maxX: number;
  #maxY: number;

  #acceleration = 0;

  constructor(app: Application, maxX: number, maxY: number) {
    this.sprite = new Sprite(TEXTURES.shield);

    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;

    this.#maxX = maxX;
    this.#maxY = maxY;

    this.app = app;

    this.respawn();
  }

  update(deltaTime: number) {
    this.sprite.y += this.#acceleration * deltaTime;
    this.#acceleration += 0.05;
  }

  respawn() {
    this.#acceleration = 0;
    this.sprite.x = getRandomNumber(0, this.#maxX)
    this.sprite.y = getRandomNumber(this.#maxY, this.#maxY - 100)
  }
}

