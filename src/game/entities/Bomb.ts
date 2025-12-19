import { Application, Sprite } from 'pixi.js';
import { getRandomNumber } from '../utils';
import { TEXTURES } from '../TEXTURES';

export default class Bomb {
  sprite: Sprite;
  app: Application;

  #maxX: number;
  #maxY: number;

  #acceleration = 0;

  #exploading = false;
  #exploadingFrame = 0;
  #exploadStartTime: Date = new Date();
  #onRespawn: (() => void) | null = null;
  #isFatal = true;

  constructor(app: Application, maxX: number, maxY: number, onRespawn?: () => void) {
    this.sprite = new Sprite(TEXTURES.bomb.idle);

    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;

    this.#maxX = maxX;
    this.#maxY = maxY;
    this.#onRespawn = onRespawn || null;

    this.app = app;

    this.respawn();
  }

  #texture() {
    if (this.#exploading) {
      const currentTime = new Date();
      if (currentTime.getTime() - this.#exploadStartTime.getTime() > 50) {
        this.#exploadingFrame++;
        this.#exploadStartTime = new Date();
      }
      if (this.#exploadingFrame > TEXTURES.bomb.explosion.length) {
        if (this.#onRespawn) {
          this.#onRespawn();
        } else {
          this.respawn();
        }
      }
      return TEXTURES.bomb.explosion[this.#exploadingFrame];
    } else {
      return TEXTURES.bomb.idle;
    }
  }

  explode(increamentScore: (() => number) | null, isFatal: boolean = true) {
    if (this.#exploading) {
      // Already exploding - just update fatal flag if making it non-fatal
      if (!isFatal) {
        this.#isFatal = false;
      }
      return;
    }
    this.#exploadStartTime = new Date();
    this.#exploading = true;
    this.#isFatal = isFatal;
    this.sprite.texture = this.#texture();

    if (increamentScore) increamentScore();
  }

  update(deltaTime: number) {
    this.sprite.texture = this.#texture();

    if (!this.#exploading) this.sprite.y += this.#acceleration * deltaTime;
    this.#acceleration += 0.05;
  }

  setOnRespawn(callback: (() => void) | null) {
    this.#onRespawn = callback;
  }

  isExploding(): boolean {
    return this.#exploading;
  }

  isFatal(): boolean {
    return this.#isFatal;
  }

  respawn() {
    this.#exploadingFrame = 0;
    this.#exploading = false;
    this.#isFatal = true;
    this.#acceleration = 0;
    this.sprite.texture = TEXTURES.bomb.idle;
    this.sprite.x = getRandomNumber(0, this.#maxX)
    this.sprite.y = getRandomNumber(this.#maxY, this.#maxY - 100)
  }
}

