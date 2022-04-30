import { Direction, itemDB, ItemOccupyType, ItemType } from "./Enums";
// import { GameManager } from "./GameManager";
import { Vector2 } from "../../server/Vector2";
import { ClientGameManager } from "./ClientGameManager";
import { ClientCharacter } from "./ClientCharacter";
import { Client } from "socket.io/dist/client";


export class ClientItem {
    position: Vector2;
    imgElement: HTMLDivElement;
    itemType: ItemType = ItemType.chess;
    id: string;
    // occupiedLayer: 0 | 1
    constructor(id: string, position: Vector2, itemType: ItemType) {
        this.position = position;
        this.id = id;
        // this.occupiedLayer = layer;
        this.imgElement = document.createElement('div') as HTMLDivElement;
        this.imgElement.classList.add('GameObject');

        let parentDiv = document.getElementById('map');
        if (parentDiv) {
            parentDiv.append(this.imgElement);
        }

        let found = ClientGameManager.currentMap?.getCellByVector2(position);
        if (found) {
            // found.hasItem = this;
        }

        // //* Set visual position
        let i = itemDB.find(i => i.itemType == itemType);
        if (i) {
            this.setImage(i.src);
        }
        this.imgElement.style.transform = `translate3d(${position.x * ClientGameManager.CellDistanceOffset}px,${position.y * ClientGameManager.CellDistanceOffset}px,0)`;

    }
    setImage(src: string) {
        // this.imgElement.setAttribute('background-image', `url("${src}")`);
        this.imgElement.classList.add(src);
        // this.imgElement.style.backgroundImage = `url("${src}")`;
    }

    tryRemoveItemFromWorld() {
        let c = ClientGameManager.currentMap?.getCellByVector2(this.position);
        if (c) {
            c.hasFirstLayerItem = undefined;
        }
        this.imgElement.remove();
    }

    async pickedBy(character: ClientCharacter) {
        //get cell by direction
        // todo create new html 로 
        let to = character.currentPosition;
        this.imgElement.style.transform =
            `translate3d(${to.x * ClientGameManager.CellDistanceOffset}px,${to.y * ClientGameManager.CellDistanceOffset}px,0px`;

        await new Promise(resolve => setTimeout(resolve, 400))
        // append to

        // this.imgElement.removeAttribute('style');
        // this.imgElement.classList.remove('GameObject');
        this.imgElement.classList.add('itemPickedStatus');
        character.wrapperHtmlElement.append(this.imgElement);
        this.imgElement.style.transform = 'translate3d(0,0,0)';


    }

    async dropBy(character: ClientCharacter) {

    }



    setFirstLayer() {

    }
}
