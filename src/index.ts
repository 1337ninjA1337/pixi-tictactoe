import * as PIXI from "pixi.js";
import Game from "./components/Game";

const app = new PIXI.Application<HTMLCanvasElement>({
  antialias: true,
});
globalThis.__PIXI_APP__ = app;

app.renderer.resize(window.innerWidth, window.innerHeight);
app.renderer.view.style.position = "absolute";

document.body.appendChild(app.view);

const bg = new PIXI.TilingSprite(
  PIXI.Texture.from("assets/images/bg.png"),
  app.renderer.width,
  app.renderer.height
);
app.stage.addChild(bg);

const game = new Game(app);
app.stage.addChild(game);

