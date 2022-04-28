import { ClientCharacter } from "./ClientCharacter";
import { ClientGameManager } from "./ClientGameManager";
import { Vector2 } from "../../server/Vector2";
import { ClientItem } from "./ClientItem";
import { ItemType } from "./Enums";

export class Cell {
    position: Vector2;
    htmlElement: HTMLDivElement;
    isOccupied: boolean = false;
    hasFirstLayerItem: ClientItem | undefined = undefined;
    // hasSecondaryLayerItem: ClientItem | undefined = undefined;
    standingCharacter: ClientCharacter | undefined = undefined;
    constructor(vector2: Vector2) {
        this.position = vector2;
        this.htmlElement = document.createElement("div") as HTMLDivElement;
        this.htmlElement.classList.add('cell');

        //* set parent
        let parentDiv = document.getElementById('map');
        if (parentDiv) {
            parentDiv.append(this.htmlElement);
        }
        // //* Set visual position
        this.htmlElement.style.transform = `translate3d(${vector2.x * ClientGameManager.CellDistanceOffset}px,${vector2.y * ClientGameManager.CellDistanceOffset}px,0)`;
        // console.log(this.htmlElement.style.transform)
        // this.htmlElement.style.transform = `translate3d(${vector2.x},${vector2.y},0)`;
        // this.htmlElement.classList.add('cell');
    }
    setStandingCharacter(character: ClientCharacter | undefined) {
        this.standingCharacter = character;
    }

    checkOccupied() {
        if (this.standingCharacter) return true;
        if (this.hasFirstLayerItem) {
            // this.hasFirstLayerItem.itemType == 
        }
        return false;
    }
}