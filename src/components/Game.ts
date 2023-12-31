import * as PIXI from 'pixi.js';
import Field from './field';
import Player from './Player';
import Bttn from './Bttn';

export default class Game extends PIXI.Container {
    player: Player;
    isGameEnded: boolean;
    AI: Player;

    constructor(app: PIXI.Application) {
        super();

        this.isGameEnded = false;

        let player = new Player('');
        let AI = new Player('');
        this.addChooseSideBttns(player, AI);

    }


    addChooseSideBttns(player?: Player, AI?: Player){
        this.player = player;
        this.AI = AI;

        let wrapper = new PIXI.Container();
        const cross = new Bttn({width: 250, height: 50, fontSize: 30, alpha: 1, hexColor: "0xffffff",  func: this.chooseSide, content: 'Play as cross', fontName: 'darkFont'}, this.AI, this.player, this)
        const circle = new Bttn({width: 250, height: 50, fontSize: 30, alpha: 1, hexColor: "0xffffff",  func: this.chooseSide, content: 'Play as circle', fontName: 'darkFont'}, this.AI, this.player, this)

        circle.x = 300; 

        wrapper.addChild(cross);
        wrapper.addChild(circle);
        wrapper.x = 150;
        wrapper.y = 400;

        this.addChild(wrapper);
    }

    chooseSide() {
        if(this instanceof Bttn) {
            let playerFig = '';
            let AIFig = '';            
            
            this.Game.player = new Player(playerFig);
            this.Game.AI = new Player(AIFig)

            if (this.options.content.includes('cross') ) {                
                this.Game.player.figure = 'cross';
                this.Game.player.isMyMove = true;
                this.Game.AI.figure = 'circle';
            } else  {
                this.Game.player.figure = 'circle';
                this.Game.AI.figure = 'cross';
                this.Game.AI.isMyMove = true;
            }

            const field = new Field(this.Game);
            field.x = 80;
            field.y = 100;
                        
            const resetBttn = new Bttn({width: 250, height: 50, fontSize: 30, alpha: 1, hexColor: "0xffffff",  func: ()=>{if(this instanceof Bttn) {
                this.Game.isGameEnded = false;
                this.Game.removeChildren();                
                this.Game.addChooseSideBttns();
            }}, content: 'Reset game', fontName: 'darkFont'}, this.AI, this.player, this);
            resetBttn.x = 195;
            resetBttn.y = 700;
            field.addChild(resetBttn);

            this.parent.parent.addChild(field);
            this.Game.removeChild(this.parent);
            
        }
    }
}

