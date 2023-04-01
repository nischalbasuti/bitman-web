import * as PIXI from 'pixi.js';
import { Sprite } from 'pixi.js';
import still from "./game_assets/bitman/default/still.png"

const config = {
  width: 1080,
  height:720 ,
}
const app = new PIXI.Application<HTMLCanvasElement>(config);

const canvasContainer = document.querySelector("#canvas-container");
canvasContainer.appendChild(app.view);


const texture = await PIXI.Assets.load("./src/game_assets/bitman/default/still.png");

const bitman = new Sprite(texture);

// position
bitman.x = app.renderer.width / 2;
bitman.y = app.renderer.height / 2;

// rotate
bitman.anchor.x = 0.5;
bitman.anchor.y = 0.5;

// add to scene
app.stage.addChild(bitman);

app.ticker.add(() => {
  bitman.rotation += 0.01;
})



