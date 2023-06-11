import * as PIXI from 'pixi.js';
import { Spine } from 'pixi-spine';
import { Loader } from "resource-loader";

export default class Player extends PIXI.Container {
    figure: string;
    newTexture: PIXI.Texture;
    curCombanation: Array<number>;
    isMyMove: boolean

    constructor(figure: string, isMyMove?: boolean) {
        super();
        

        this.figure = figure;
        this.newTexture = PIXI.Texture.EMPTY;
        this.curCombanation = [];
        
    }

    update() {
        let fig = this.figure === 'cross' ? '../assets/images/line1.png' : '../assets/images/circle.png';
        this.newTexture = PIXI.Texture.from(fig);

        this.curCombanation.sort();

    }
}