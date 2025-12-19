import { Application, Sprite } from 'pixi.js';
import { getRandomNumber } from '../utils';
import { TEXTURES } from '../TEXTURES';

export default class Teeth {
  sprite: Sprite;
  app: Application;

  #maxX: number;
  #maxY: number;

  #acceleration = 0;

  #biting = false;
  #bitingFrame = 0;
  #bitingStartTime: Date = new Date();

  #exploding = false;
  #explodingFrame = 0;
  #explodingStartTime: Date = new Date();
  #onRespawn: (() => void) | null = null;

  constructor(app: Application, maxX: number, maxY: number, onRespawn?: () => void) {
    this.sprite = new Sprite(TEXTURES.teeth.biting[0]);

    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;

    this.#maxX = maxX;
    this.#maxY = maxY;
    this.#onRespawn = onRespawn || null;

    this.app = app;

    // Start biting immediately
    this.#biting = true;
    this.#bitingStartTime = new Date();

    this.respawn();
  }

  #texture() {
    if (this.#exploding) {
      const currentTime = new Date();
      if (currentTime.getTime() - this.#explodingStartTime.getTime() > 50) {
        this.#explodingFrame++;
        this.#explodingStartTime = new Date();
      }
      if (this.#explodingFrame > TEXTURES.teeth.explosion.length) {
        if (this.#onRespawn) {
          this.#onRespawn();
        } else {
          this.respawn();
        }
      }
      return TEXTURES.teeth.explosion[this.#explodingFrame];
    } else {
      // Always biting - loop through animation frames
      const currentTime = new Date();
      if (currentTime.getTime() - this.#bitingStartTime.getTime() > 50) {
        this.#bitingFrame++;
        this.#bitingStartTime = new Date();
      }
      // Loop animation frames
      if (this.#bitingFrame >= TEXTURES.teeth.biting.length) {
        this.#bitingFrame = 0;
      }
      return TEXTURES.teeth.biting[this.#bitingFrame];
    }
  }

  bite() {
    // Teeth are always biting, but this can be called on collision
    // Reset animation frame for visual feedback
    this.#bitingFrame = 0;
    this.#bitingStartTime = new Date();
  }

  explode(increamentScore: (() => number) | null = null) {
    if (this.#exploding) return;
    this.#explodingStartTime = new Date();
    this.#exploding = true;
    this.sprite.texture = this.#texture();

    if (increamentScore) increamentScore();
  }

  setOnRespawn(callback: (() => void) | null) {
    this.#onRespawn = callback;
  }

  update(deltaTime: number) {
    this.sprite.texture = this.#texture();

    if (!this.#exploding) this.sprite.y += this.#acceleration * deltaTime;
    this.#acceleration += 0.05;
  }

  respawn() {
    this.#bitingFrame = 0;
    this.#explodingFrame = 0;
    this.#biting = true;
    this.#exploding = false;
    this.#bitingStartTime = new Date();
    this.#acceleration = 0;
    this.sprite.texture = TEXTURES.teeth.biting[0];
    this.sprite.x = getRandomNumber(0, this.#maxX)
    this.sprite.y = getRandomNumber(this.#maxY, this.#maxY - 100)
  }
}

