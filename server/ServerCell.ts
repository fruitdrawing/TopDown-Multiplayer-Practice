import { ServerCharacter } from "./ServerCharacter";
import { ServerItem } from "./ServerItem";
import { Vector2 } from "./Vector2";

export class ServerCell {
    position: Vector2;
    // htmlElement: HTMLDivElement;
    isOccupied: boolean = false;
    hasItem: ServerItem | undefined = undefined;
    standingCharacter: ServerCharacter | undefined = undefined;
    constructor(vector2: Vector2) {
        this.position = vector2;
        // this.htmlElement = document.createElement("div") as HTMLDivElement;
        // this.htmlElement.classList.add('cell');

        // //* set parent
        // let parentDiv = document.getElementById('map');
        // if (parentDiv) {
        //     parentDiv.append(this.htmlElement);
        // }
        // //* Set visual position
        // this.htmlElement.style.transform = `translate3d(${vector2.x * GameManager.CellDistanceOffset}px,${vector2.y * GameManager.CellDistanceOffset}px,0)`;
        // console.log(this.htmlElement.style.transform)
        // this.htmlElement.style.transform = `translate3d(${vector2.x},${vector2.y},0)`;
        // this.htmlElement.classList.add('cell');
    }
    setStandingCharacter(character: ServerCharacter | undefined) {
        this.standingCharacter = character;
    }
}