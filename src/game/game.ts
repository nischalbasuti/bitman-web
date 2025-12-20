import { Application, Container, Sprite } from 'pixi.js';
import Bitman from './entities/Bitman';
import Bomb from './entities/Bomb';
import Teeth from './entities/Teeth';
import Shield from './entities/Shield';
import { setupInput } from './inputHandler';
import InputState, { InputStateType } from './inputState';
import { TEXTURES } from './TEXTURES';
import { getRandomNumber } from './utils';

export function initGame (
  increamentScore: () => number, 
  clearScore: () => number, 
  canvasContainer: Element,
  bombCount: number,
  onGameOver: () => void,
  onPauseChange?: (isPaused: boolean) => void
) {
  setupInput();

  // ...........Add canvas DOM.........................
  // const screenWidth = window.innerWidth <= 1080 ? window.innerWidth : 1080;
  // const aspectRatio = 16 / 9;
  // const screenHeight = screenWidth / aspectRatio;
  const screenWidth = 720;
  const screenHeight = 720;

  const app = new Application<HTMLCanvasElement>({
    width: screenWidth,
    height: screenHeight,
    resolution: window.devicePixelRatio,
    backgroundColor: 0x191970, // Midnight blue
  });

  canvasContainer.appendChild(app.view);
  //\ ...........Add canvas DOM.........................

  const container = new Container();
  container.x = screenWidth/2;
  container.y = screenHeight;

  // Sky container for moon and stars parallax (slower than buildings)
  const skyContainer = new Container();
  skyContainer.x = 0;
  skyContainer.y = 0;
  app.stage.addChild(skyContainer);

  // Background container for parallax effect (buildings only)
  const backgroundContainer = new Container();
  backgroundContainer.x = screenWidth/2;
  backgroundContainer.y = screenHeight;
  app.stage.addChild(backgroundContainer);

  app.stage.addChild(container);

  container.height = screenHeight;
  container.width = screenWidth;

  const platform = new Sprite(TEXTURES.platform);

  const scaleFactor = screenWidth / platform.width;

  container.scale.x = scaleFactor * .95;
  container.scale.y = scaleFactor * .95;

  container.pivot.set(screenWidth/2, 0);

  platform.anchor.set(0, 1)

  platform.x = 0;
  platform.y = container.height + platform.height / 3;

  const bitman = new Bitman(app, platform.width / 2, platform.y - platform.height, platform.width);
  bitman.sprite.y += bitman.sprite.height / 3

  // Track score for shield spawning
  let currentScore = 0;
  let lastShieldScore = 0;
  let shield: Shield | null = null;

  // Create unified array that can hold both bombs and teeth
  type FallingEntity = Bomb | Teeth;
  const entities: FallingEntity[] = [];
  
  // Randomly split total count between bombs and teeth
  const teethCount = Math.floor(Math.random() * (bombCount + 1));
  const actualBombCount = bombCount - teethCount;

  for (let i = 0; i < actualBombCount; i++) {
    entities.push(new Bomb(app, platform.width, -screenHeight));
  }

  for (let i = 0; i < teethCount; i++) {
    entities.push(new Teeth(app, platform.width, -screenHeight));
  }

  //----------------sky elements (moon and stars)------------------------
  const skyParallaxFactor = 0.15; // Slower than buildings

  // Add moon and stars to sky container
  const starCount = getRandomNumber(20, 30);
  const stars: Array<{ sprite: Sprite; frameIndex: number; lastFrameTime: Date }> = [];
  
  for (let i = 0; i < starCount; i++) {
    const starSprite = new Sprite(TEXTURES.star[0]);
    starSprite.anchor.set(0.5, 0.5);
    // Random position across screen
    starSprite.x = getRandomNumber(-screenWidth/2, screenWidth + screenWidth/2);
    starSprite.y = getRandomNumber(0, screenHeight * 0.8); // Upper 80% of screen
    // Random initial frame
    const initialFrame = getRandomNumber(0, TEXTURES.star.length - 1);
    starSprite.texture = TEXTURES.star[initialFrame];
    
    stars.push({
      sprite: starSprite,
      frameIndex: initialFrame,
      lastFrameTime: new Date(),
    });
    
    skyContainer.addChild(starSprite);
  }

  const moon = new Sprite(TEXTURES.moon);
  moon.scale.set(2, 2);
  moon.anchor.set(0.5, 0.5);
  moon.x = screenWidth * 0.75; // Position in top-right area
  moon.y = screenHeight * 0.2; // Near top
  skyContainer.addChild(moon);


  // Scale sky container to match main container
  skyContainer.scale.x = scaleFactor * .95;
  skyContainer.scale.y = scaleFactor * .95;
  skyContainer.pivot.set(screenWidth/2, 0);

  //----------------background------------------------
  // Parallax factor: lower = slower movement (0.3 = moves 30% of bitman's movement)
  const parallaxFactor = 0.3;

  const building0 = new Sprite(TEXTURES.building);
  building0.anchor.set(0, 1)
  building0.x = -screenWidth / 3;
  building0.y = container.height;
  building0.scale.set(1, 0.8)

  const building1 = new Sprite(TEXTURES.building);
  building1.anchor.set(0, 1)
  building1.x = building0.x + building0.width * 2;
  building1.y = container.height;
  building1.scale.set(0.8, 0.8)

  const building2 = new Sprite(TEXTURES.building);
  building2.anchor.set(0, 1)
  building2.x = building1.x + building1.width * 2;
  building2.y = container.height;
  building2.scale.set(0.8, 1)

  // Add background first (behind buildings), then buildings
  // Background is already added above, now add buildings
  backgroundContainer.addChild(building0);
  backgroundContainer.addChild(building1);
  backgroundContainer.addChild(building2);

  // Scale background container to match main container
  backgroundContainer.scale.x = scaleFactor * .95;
  backgroundContainer.scale.y = scaleFactor * .95;
  backgroundContainer.pivot.set(screenWidth/2, 0);

  //\----------------background------------------------

  container.addChild(platform);
  container.addChild(bitman.sprite);

  for (const entity of entities) container.addChild(entity.sprite);

  function bitmanTicker(deltaTime: number) {
    const bitmanX = bitman.sprite.position.x;
    container.pivot.x = bitmanX;
    
    // Parallax scrolling: sky moves slowest, buildings move faster
    skyContainer.pivot.x = bitmanX * skyParallaxFactor;
    backgroundContainer.pivot.x = bitmanX * parallaxFactor;
    
    const inputState = InputState.getInstance();
    const tiltAmount = inputState.getTiltAmount();
    
    switch(inputState.getState()) {
      case InputStateType.Left:
        bitman.moveLeft(deltaTime, tiltAmount);

        break;
      case InputStateType.Right:
        bitman.moveRight(deltaTime, tiltAmount);

        break;
      case InputStateType.None:
        bitman.idle();

        break
    }
  }

  app.ticker.add(bitmanTicker);

  app.ticker.add((deltaTime) => {
    // Animate stars (50ms per frame, same as other animations)
    const currentTime = new Date();
    for (const star of stars) {
      if (currentTime.getTime() - star.lastFrameTime.getTime() > 50) {
        star.frameIndex = (star.frameIndex + 1) % TEXTURES.star.length;
        star.sprite.texture = TEXTURES.star[star.frameIndex];
        star.lastFrameTime = new Date();
      }
    }

    // Spawn shield every 20 points
    if (currentScore > 0 && currentScore % 20 === 0 && currentScore !== lastShieldScore && shield === null) {
      shield = new Shield(app, platform.width, -screenHeight);
      container.addChild(shield.sprite);
      lastShieldScore = currentScore;
    }

    // Update shield if it exists
    if (shield !== null) {
      shield.update(deltaTime);
      
      // Check if shield hit platform - remove it
      if (shield.sprite.y >= platform.y - platform.height - bitman.sprite.height/3) {
        container.removeChild(shield.sprite);
        shield = null;
      } else {
        // Check collision with Bitman
        if (shield.sprite.getBounds().intersects(bitman.sprite.getBounds())) {
          bitman.shield = true;
          bitman.idle(); // Update texture to shielded version
          container.removeChild(shield.sprite);
          shield = null;
        }
      }
    }
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const isBomb = entity instanceof Bomb;
      
      entity.update(deltaTime);
      
      if (entity.sprite.y >= platform.y - platform.height - bitman.sprite.height/3) {
        if (isBomb) {
          const bomb = entity as Bomb;
          // Set up respawn callback to potentially switch type
          bomb.setOnRespawn(() => {
            const shouldSwitch = Math.random() < 0.5;
            if (shouldSwitch) {
              // Switch to teeth
              container.removeChild(bomb.sprite);
              const newTeeth = new Teeth(app, platform.width, -screenHeight);
              entities[i] = newTeeth;
              container.addChild(newTeeth.sprite);
            } else {
              // Stay as bomb
              bomb.setOnRespawn(null);
              bomb.respawn();
            }
          });
          bomb.explode(() => {
            currentScore = increamentScore();
            return currentScore;
          });
        } else {
          // Teeth hit platform - play explosion animation
          const teeth = entity as Teeth;
          // Set up respawn callback to potentially switch type
          teeth.setOnRespawn(() => {
            const shouldSwitch = Math.random() < 0.5;
            if (shouldSwitch) {
              // Switch to bomb
              container.removeChild(teeth.sprite);
              const newBomb = new Bomb(app, platform.width, -screenHeight);
              entities[i] = newBomb;
              container.addChild(newBomb.sprite);
            } else {
              // Stay as teeth
              teeth.setOnRespawn(null);
              teeth.respawn();
            }
          });
          teeth.explode(() => {
            currentScore = increamentScore();
            return currentScore;
          });
        }
      }
      
      if (entity.sprite.getBounds().intersects(bitman.sprite.getBounds())) {
        // Skip if already exploding and not fatal (hit shielded Bitman)
        const isFatal = isBomb ? (entity as Bomb).isFatal() : (entity as Teeth).isFatal();
        
        if (!isFatal) {
          // Already hit shielded Bitman, skip collision
          continue;
        }

        if (bitman.shield) {
          // Bitman is shielded - trigger explosion/bite animation with isFatal=false
          if (isBomb) {
            (entity as Bomb).explode(null, false);
          } else {
            (entity as Teeth).explode(null, false);
          }
          
          // Remove shield after animation starts
          bitman.shield = false;
          bitman.idle(); // Update texture back to normal
        } else {
          // No shield - game over (isFatal defaults to true)
          if (isBomb) {
            (entity as Bomb).explode(null, true);
          } else {
            (entity as Teeth).explode(null, true);
          }
          bitman.die()

          app.ticker.stop();

          onGameOver();

          break;
        }
      }
    }
  });

  // Pause/resume functions
  const pause = () => {
    app.ticker.stop();
    if (onPauseChange) onPauseChange(true);
  };

  const resume = () => {
    app.ticker.start();
    if (onPauseChange) onPauseChange(false);
  };

  // Return cleanup function and pause/resume controls
  return {
    cleanup: () => {
      app.ticker.stop();
      const view = app.view;
      if (view && canvasContainer && view.parentNode) {
        canvasContainer.removeChild(view);
      }
      app.destroy(true, { children: true, texture: false, baseTexture: false });
    },
    pause,
    resume,
  };
}
