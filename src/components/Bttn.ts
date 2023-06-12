import * as PIXI from 'pixi.js';
import { Loader } from "resource-loader";
import Player from './Player';
import Game from './Game';
import { Spine } from 'pixi-spine';

export default class Bttn extends PIXI.Sprite {
    callback: ()=>void;
    options: { 
        width?: number, 
        height?: number, 
        alpha?:number, 
        hexColor?: string,
        fontSize?: number,
        func?: ()=>void, 
        content?: string,
        fontName?: string
    }
    isMoveAvailable: boolean;
    player: Player;
    AI: Player;
    Game: Game;

    constructor(options?: { width?: number, height?: number, fontSize?: number, hexColor?: string, alpha?:number, func?: ()=>void, content?: string, fontName?: string},AI?: Player, player?: Player, Game?: Game) {
        super();

        this.Game = Game;        
        this.player = player;
        this.AI = AI;
        this.options = options;
        this.isMoveAvailable = true;

        let width: number = options.width ? options.width : 250;
        let height: number = options.height ? options.height : width;
        let alpha: number = options.alpha ? options.alpha : 1;
        this.callback = options.func !== null && options.func !== undefined ? options.func : ()=>console.log(options.func);

        const bttn = new PIXI.Graphics();
        bttn.beginFill(options.hexColor, alpha);
        bttn.drawRect(0, 0, options.width, height);


        if(options.content !== undefined && options.content !== null) {
            if(!options.content.startsWith('./') && !options.content.startsWith('../')){                
                const loader = new Loader();
            
                loader.add('darkFont', '../assets/fonts/darkFont.fnt')
                      .add('darkFontpng', '../assets/fonts/lightFont.fnt')
                      .add('lightFont', '../assets/fonts/lightFont.fnt').load((loader, resources)=>{
                    
                    let font =  PIXI.XMLFormat.parse(new DOMParser().parseFromString(resources.darkFont.data, 'text/xml'));
                       
                    PIXI.BitmapFont.install(font, PIXI.Texture.from('../assets/fonts/darkFont.png'))
    
                    let content = new PIXI.BitmapText(options.content, {
                        fontName: options.fontName,
                        fontSize: options.fontSize,
                        align: 'center'
                    })
    
                    content.x = 10;

                    this.addChild(content);
                })    
            } else {
                const img = PIXI.Sprite.from(options.content);

                this.addChild(img);
            }
        }

        this.addChild(bttn);

        
        
        this.eventMode = "static";
        this.cursor = 'pointer';
        this.on('click', this.callback)
    }
   
    makeMove(player: Player){                        
        if(player.isMyMove) {
            player.isMyMove = false;
            this.isMoveAvailable = false;
            for (let index in this.parent.children) {            
                if(this.parent.children[index] === this) {
                    player.curCombanation.push(parseInt(index));
                }             
             }
            player.update();
            
            PIXI.Assets.load(`./assets/export_spine/${player.newTexture}.json`).then(res=>{
                console.log(res);
                let anim = new Spine(res.spineData);
                anim.x = Math.abs(res.spineData.x) + 35;
                anim.y = Math.abs(res.spineData.y) + 35;

                this.addChild(anim)
              
                if (anim.state.hasAnimation('draw')) {
                  anim.state.setAnimation(0, 'draw', false);
                  anim.state.timeScale = 3;
                  anim.autoUpdate = true;
              }
              })
            
            this.checkWin(player);
        }
    }

    checkWin(player: Player){
        
        const winCombinations: Array<Array<number>> = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6],
        ];
        
        const compareArrays = (allCombinations, curCombination) => {
            for (let winComb of allCombinations) {
                if (winComb.every( el => curCombination.includes(el) )) {
                    return winComb;
                }
            }
        }        
        let winComb = compareArrays(winCombinations, player.curCombanation);

        if (winComb) {
            this.Game.isGameEnded = true;

            let winText = new PIXI.BitmapText(`${player.figure} wins`, {
                fontName: this.options.fontName,
                fontSize: this.options.fontSize,
                align: 'center'
            });

            winText.y = -120;

            this.parent.children.forEach((el, index) => {
                if(winComb.includes(index) && el instanceof Bttn) {
                    el.addChildAt(PIXI.Sprite.from('../assets/images/win_highlight.png'), 0)
                }
            })
            
            this.parent.parent.addChild(winText);
        } else {
            this.player === player ? this.AI.isMyMove = true : this.player.isMyMove = true;
            this.aiMove();
        }
        
    }

    aiMove(){
        if (this.AI.isMyMove) {
            let availableBttns = this.parent.children.map(el => {
                if (el instanceof Bttn && el.isMoveAvailable) {
                return el;
                }
            }).filter((el) => el);  

            availableBttns[Math.floor(Math.random()*availableBttns.length)].makeMove(this.AI);
        }
    }
}