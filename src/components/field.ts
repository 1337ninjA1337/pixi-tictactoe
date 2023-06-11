import * as PIXI from "pixi.js";
import Bttn from "./Bttn";
import Player from "./Player";
import Game from "./Game";

export default class Field extends PIXI.Container {
  player: Player;
  Game: Game;
  AI: Player;

  constructor(player: Player, Game: Game, AI: Player) {
    super();

    this.player = player;
    this.Game = Game;

    const field = new PIXI.Container();
    const bg = PIXI.Sprite.from("../assets/images/playfield.png");
    this.addChild(bg);

    for (let y = 0; y < 3; y += 1) {
      for (let x = 0; x < 3; x += 1) {
        let bttn = new Bttn({width: 218, height: 218, alpha:0.01, content: '', func: this.checkMove, fontName: 'darkFont'}, AI, player, this.Game);
        bttn.x = x * 218;
        bttn.y = y*218;
        
        field.addChild(bttn);
      }
    }
    this.addChild(field);
  }
 
  checkMove() {
    
    if(this instanceof Bttn && this.isMoveAvailable && !this.Game.isGameEnded) {
      this.player.isMyMove = false;
      this.AI.isMyMove = true;
      this.makeMove(this.player);
      
    }
  }
}
