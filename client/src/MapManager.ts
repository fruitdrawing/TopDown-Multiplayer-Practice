import { GameObject } from "./GameObject";

export class MapManager {

    mapImage: HTMLImageElement;
    gameObjects: GameObject[]
    constructor(mapConfig: MapConfig) {
        this.mapImage = new Image();
        this.mapImage.src = mapConfig.src;
        this.gameObjects = mapConfig.gameObjects;
    }

    drawMap(ctx: CanvasRenderingContext2D) {
        ctx.drawImage(this.mapImage, 0, 0, 300, 300);
    }

}

export interface MapConfig {
    src: string;
    gameObjects: GameObject[]

}

