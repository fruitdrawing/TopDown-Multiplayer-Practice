import { ItemGeneralType, itemDB, ItemType, ItemOccupyType, characterType } from "./shared/Enums";
import { ServerCharacter } from "./ServerCharacter";
import { ServerItem } from "./ServerItem";
import { ServerManager } from "./ServerManager";
import { ServerMapInfo } from "./ServerMapInfo";
import { RandomMoveNPC } from "./ServerNpcCharacter";
import { Vector2 } from "./Vector2";
import { MapInfoReader } from "./shared/MapInfoReader";
import { v4 } from 'uuid'
export class ServerGameManager {
    public static currentPlayerCharacterList: ServerCharacter[] = [];
    public static serverSocketManager: ServerManager = new ServerManager();
    public static currentItemList: ServerItem[] = [];
    mapInfoReader: MapInfoReader;
    public static readonly itemDB: ItemGeneralType[] = itemDB;


    // public static currentUserSocketIdList: string[] = [];

    public static currentMapInfo: ServerMapInfo;

    // debugText: HTMLDivElement = document.getElementById('debugText') as HTMLDivElement;
    constructor() {
        // this.setupForPreventZoomAndPinchZoom();
        this.mapInfoReader = new MapInfoReader();
        ServerGameManager.currentMapInfo = new ServerMapInfo(0, 0, 32, 32, {}, this.mapInfoReader.collision2darray);
        // this.mapInfoReader.collision2darray
        new ServerItem(new Vector2(9, 14), ItemType.beer);
        new ServerItem(new Vector2(12, 12), ItemType.lightswitch);
        new ServerItem(new Vector2(7, 8), ItemType.lightlamp);
        new ServerItem(new Vector2(11, 11), ItemType.lightlamp);
        new ServerItem(new Vector2(7, 18), ItemType.lightpinklamp);
        new ServerItem(new Vector2(17, 18), ItemType.lightpinklamp);
        new ServerItem(new Vector2(20, 13), ItemType.lightlamp);

        // this.updateLoop();
        new ServerItem(new Vector2(9, 24), ItemType.beer);
        new ServerItem(new Vector2(16, 28), ItemType.beer);
        new ServerItem(new Vector2(10, 24), ItemType.beer);
        ServerGameManager.spawnEnemy(new Vector2(10, 27));
        ServerGameManager.spawnEnemy(new Vector2(12, 27));
        ServerGameManager.spawnEnemy(new Vector2(14, 27));
        ServerGameManager.spawnEnemy(new Vector2(16, 27));
        ServerGameManager.spawnEnemy(new Vector2(15, 29));
        ServerGameManager.spawnEnemy(new Vector2(13, 29));
        ServerGameManager.spawnEnemy(new Vector2(10, 29));
        ServerGameManager.spawnEnemy(new Vector2(11, 31));
        ServerGameManager.spawnEnemy(new Vector2(14, 31));
    }

    static spawnEnemy(to: Vector2) {
        let createdNpc = new RandomMoveNPC(v4().toString(), "나쁜넘", to, false, characterType.skeleton, true);
        ServerGameManager.currentPlayerCharacterList.push(createdNpc);
    }

    static spawnEnemyRandomPlace() {
        let tempEmptyCellList = ServerGameManager.currentMapInfo.cellList.filter(m => m.checkOccupied() == false);
        let randomNotOccupiedCell = tempEmptyCellList[Math.floor(Math.random() * tempEmptyCellList.length)];
        let createdNpc = new RandomMoveNPC(v4.toString(), "나쁜넘", randomNotOccupiedCell.position, false, characterType.skeleton, true);
        ServerGameManager.currentPlayerCharacterList.push(createdNpc);

    }
    static getEatableRandomItemFromItemDb(): ItemGeneralType {
        let eatableList = ServerGameManager.itemDB.filter(i => i.eatable == true);
        return eatableList[Math.floor(Math.random() * eatableList.length)];
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