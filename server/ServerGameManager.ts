import { ItemGeneralType, itemDB, ItemType, ItemOccupyType } from "../client/src/Enums";
import { ServerCharacter } from "./ServerCharacter";
import { ServerItem } from "./ServerItem";
import { ServerManager } from "./ServerManager";
import { ServerMapInfo } from "./ServerMapInfo";
import { Vector2 } from "./Vector2";

export class ServerGameManager {
    public static currentPlayerCharacterList: ServerCharacter[] = [];
    public static serverSocketManager: ServerManager = new ServerManager();
    public static currentItemList: ServerItem[] = [];

    public static readonly itemDB: ItemGeneralType[] = itemDB;

    // public static currentUserSocketIdList: string[] = [];

    public static currentMapInfo: ServerMapInfo = new ServerMapInfo(0, 0, 32, 32, {});

    // debugText: HTMLDivElement = document.getElementById('debugText') as HTMLDivElement;
    constructor() {
        // this.setupForPreventZoomAndPinchZoom();
        // this.updateLoop();
        new ServerItem(new Vector2(9, 24), ItemType.chess);
        new ServerItem(new Vector2(16, 28), ItemType.beer);
    }
    static getCharacterById(id: string) {
        if (ServerGameManager.currentPlayerCharacterList.length > 0)
            return ServerGameManager.currentPlayerCharacterList.find(c => c.id == id);
        return undefined;
    }

    static getItemInfoByItemTypeFromDB(itemType: ItemType) {
        return itemDB.find(i => i.itemType == itemType);
    }
    static getItemByItemId(itemid: string) {
        return ServerGameManager.currentItemList.find(i => i.id);
    }

    // tryPutItem(itemType: ItemType, to: Vector2) {
    //     let item = ServerGameManager.getItemInfoByItemTypeFromDB(itemType);
    //     if (item == null) return;
    //     let toCell = ServerGameManager.currentMapInfo.getCellByVector2(to);
    //     if (toCell == null) return;


    //     switch (item.itemOccupyType) {
    //         case ItemOccupyType.firstLayer:
    //             if (toCell.hasFirstLayerItem == null) {
    //             }


    //             break;

    //     }
    // }

}