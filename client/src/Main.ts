import './style.css'
import { GameManager } from './GameManager'
import { MapConfig } from './MapManager';
import { Vector2 } from './Vector2';
import { GameObject } from './GameObject';
const app = document.querySelector<HTMLDivElement>('#app')!


const tempMapInfo: MapConfig = {
  src: "./src/images/dw615.jpg",
  gameObjects: [new GameObject(new Vector2(1, 2), "./src/images/character1.png")]
};


const gm = new GameManager(tempMapInfo);



// [new GameObject(new Vector2(1,2),"./src/images/character1.png")]

