import { ItemOccupyType, ItemType } from "./Enums";
// import { GameManager } from "./GameManager";
import { Vector2 } from "../../server/Vector2";


export class ClientItem {
    position: Vector2;
    imgElement: HTMLDivElement;
    itemType: ItemType = ItemType.chess;
    constructor(position: Vector2, itemType: ItemType) {
        this.position = position;
        this.imgElement = document.createElement('div') as HTMLDivElement;
        this.imgElement.classList.add('GameObject');

        let parentDiv = document.getElementById('map');
        if (parentDiv) {
            parentDiv.append(this.imgElement);
        }

        // let found = GameManager.currentMap.getCellByVector2(position);
        // if (found) {
        // found.hasItem = this;
        // }

        // //* Set visual position
        // this.imgElement.style.transform = `translate3d(${position.x * GameManager.CellDistanceOffset}px,${position.y * GameManager.CellDistanceOffset}px,0)`;

    }
    setImage(src: string) {
        // this.imgElement.style.backgroundImage = `url("${src}")`;
    }

    tryRemoveItemFromWorld(): boolean {
        // let foundCell = GameManager.currentMap.getCellByVector2(this.position);
        // if (foundCell != null) {
        //     foundCell.hasItem = undefined;
        //     this.removeImageElementFromWorld();
        //     return true;
        // }
        return false;
    }

    beEaten() {

    }

    bePicked() {

    }


    private removeImageElementFromWorld() {
        this.imgElement.remove();
    }
}