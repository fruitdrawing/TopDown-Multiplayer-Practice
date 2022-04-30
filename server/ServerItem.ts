import { ItemOccupyType, ItemType } from "../client/src/Enums";
import { ServerGameManager } from "./ServerGameManager";
import { Vector2 } from "./Vector2";
import { v1 } from 'uuid';
export class ServerItem {

    id: string = v1();
    itemType: ItemType = ItemType.apple;
    position: Vector2;

    constructor(position: Vector2, itemType: ItemType) {
        this.position = position;
        this.itemType = itemType;
        this.setPosition(position);

        ServerGameManager.currentItemList.push(this);

    }
    setPosition(to: Vector2) {
        // Todo 
        let c = ServerGameManager.currentMapInfo.getCellByVector2(to);
        if (c != null) {
            let b = c.tryPutItem(this);
            console.log(b);
        }
    }


}