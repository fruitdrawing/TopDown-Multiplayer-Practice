import { GameObject } from "./GameObject";
import { Vector2 } from "./Vector2";
import { MapConfig, MapManager } from "./MapManager";
export class GameManager {
    ctx: CanvasRenderingContext2D
    canvas: HTMLCanvasElement
    currentMap: MapConfig;
    mapManager: MapManager;
    constructor(initialMap: MapConfig) {
        this.canvas = document.getElementById('game-container') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

        this.setCanvasSize();
        this.currentMap = initialMap;
        this.mapManager = new MapManager(this.currentMap);

        this.init();
    }

    setCanvasSize() {
        // Todo
        console.log('height', window.screen.height);
        console.log('width', window.screen.width);
    }

    gameLoop() {
        const step = () => {
            console.log('stepping...!');

            // * Clean
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // * draw map
            this.mapManager.drawMap(this.ctx);
            // * draw characters
            this.mapManager.gameObjects.forEach((go) => {
                // go.
                go.position.x += 0.3;
                go.sprite.draw(this.ctx);
            });
            requestAnimationFrame(() => {
                step();
            });
        }

        step();


    }
    init() {

        this.gameLoop();
        // var bg = new Image();
        // console.log(bg);
        // bg.onload = (() => {
        //     this.ctx.drawImage(
        //         bg, 0, 0,
        //         1137 / 2, 979 / 2,
        //     )
        //     console.log('bg onload');
        // });
        // bg.src = "./src/images/dw615.jpg"
        // setTimeout(() => {
        //     let gameObject: GameObject = new GameObject(new Vector2(1, 2), "./src/images/dw615.jpg");
        //     gameObject.sprite.draw(this.ctx);
        //     var character1 = new Image();
        //     character1.onload = (() => {
        //         this.ctx.drawImage(
        //             character1,
        //             0, 0,//top left cut
        //             30, 30, //width hegith of cut
        //             100, 100,// position?
        //             30, 30 //size of image?
        //         )
        //         console.log('character1 onload');

        //     });
        //     character1.src = './src/images/character1.png';

        // }, 200);

    }
}