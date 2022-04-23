import { GameObject } from "./GameObject";

export class Sprite {
    image: HTMLImageElement;
    isLoaded: boolean = false;
    animation: string;
    gameObjectRef: GameObject;
    constructor(src: string, go: GameObject) {
        this.gameObjectRef = go;
        this.image = new Image();
        this.image.onload = () => {
            this.isLoaded = true;
        };
        this.image.src = src;
        this.animation = "";

    }
    draw(ctx: CanvasRenderingContext2D) {
        if (this.isLoaded) {
            ctx.drawImage(this.image, 0, 0, 30, 30, this.gameObjectRef.position.x, this.gameObjectRef.position.y, 30, 30
            );
        }

    }

}