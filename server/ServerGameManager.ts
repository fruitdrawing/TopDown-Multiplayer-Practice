import { ServerCharacter } from "./ServerCharacter";
import { ServerManager } from "./ServerManager";
import { ServerMapInfo } from "./ServerMapInfo";

export class ServerGameManager {
    public static currentPlayerCharacterList: ServerCharacter[] = [];
    public static serverSocketManager: ServerManager = new ServerManager();

    public static currentUserList: string[] = [];

    public static currentMapInfo: ServerMapInfo = new ServerMapInfo(0, 0, 10, 10, {});

    // debugText: HTMLDivElement = document.getElementById('debugText') as HTMLDivElement;
    constructor() {
        // this.setupForPreventZoomAndPinchZoom();
        // this.updateLoop();
    }
    static getCharacterById(id: string) {
        if (ServerGameManager.currentPlayerCharacterList.length > 0)
            return ServerGameManager.currentPlayerCharacterList.find(c => c.id == id);
        return undefined;
    }
}