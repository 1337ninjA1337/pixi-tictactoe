import * as PIXI from 'pixi.js';
import { Spine } from 'pixi-spine';
import { Loader } from "resource-loader";

export default class Player extends PIXI.Container {
    figure: string;
    newTexture: string;
    curCombanation: Array<number>;
    isMyMove: boolean

    constructor(figure: string) {
        super();
        
        this.figure = figure;
        this.isMyMove = false;
        this.newTexture = '';
        this.curCombanation = [];
    }

    update() {
        this.newTexture = this.figure === 'cross' ? 'cross' : 'circle';

        this.curCombanation.sort();
    }
}