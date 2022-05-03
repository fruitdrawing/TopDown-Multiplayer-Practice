import { ItemOccupyType, ItemType } from "./shared/Enums";
import { ServerGameManager } from "./ServerGameManager";
import { Vector2 } from "./Vector2";
import { v1 } from 'uuid';
export class ServerItem {

    id: string = v1();
    itemType: ItemType = ItemType.beer;
    position: Vector2;

    isLightStatus : boolean = false;
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

            c.tryPutItem(this);

        }
    }
    toggleLight() {
        let cell = ServerGameManager.currentMapInfo.getCellByVector2(this.position);

        if (this.isLightStatus == true) {
            this.isLightStatus = false;
            console.log('light off ');
            ServerGameManager.serverSocketManager.serverio.emit('light-toggle', this.id, this.isLightStatus);
        }
        else {
            this.isLightStatus = true;
            console.log('light on ');
            ServerGameManager.serverSocketManager.serverio.emit('light-toggle', this.id, this.isLightStatus);
        }
    }




}