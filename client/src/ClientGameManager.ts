import { Vector2 } from '../../server/Vector2';
import { Camera } from './Camera';
import { ClientCharacter } from './ClientCharacter';
import { ClientSocketManager } from './ClientSocket';
import { InputManager } from './InputManager';
import { ClientMapInfo } from './ClientMapInfo';
import { ClientItem } from './ClientItem';
import { characterType } from './Enums';
import { ClientPlayerLogin } from './ClientPlayerLogin';

export class ClientGameManager {
    // public static camera: Camera = new Camera();
    public static playerCharacter: ClientCharacter | undefined = undefined;
    public static clientSocket: ClientSocketManager = new ClientSocketManager();
    public static inputManager: InputManager = new InputManager();


    public static clientLoginManager: ClientPlayerLogin = new ClientPlayerLogin();
    public static pixelSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-size'));
    public static girdCellSize = 120;
    public static CellDistanceOffset: number = 90;
    public static currentMap: ClientMapInfo | undefined = undefined
    public static currentCharacterList: ClientCharacter[] = [];
    public static currentItemList: ClientItem[] = [];
    debugText: HTMLDivElement = document.getElementById('debugText') as HTMLDivElement;
    constructor() {
        this.setupForPreventZoomAndPinchZoom();
        // this.updateLoop();

        // ClientGameManager.currentMap = new MapInfo(0, 0, 10, 10, {});
    }

    static updateLoop() {

        ClientGameManager.inputManager.checkKeyInput();
        if (ClientGameManager.playerCharacter != null) {
            // if (this.debugText != null) {
            // debugText.innerText = `${myCharacter.currentPosition.x},${myCharacter.currentPosition.y}`;
            // }
        }

        window.requestAnimationFrame(() => {

            this.updateLoop();
        })
    }
    public static getClientItemByItemId(id: string) {
        return this.currentItemList.find(i => i.id == id);
    }
    public static spawnCharacter(id: string, displayName: string, to: Vector2, authorization: boolean, characterType: characterType) {
        console.log('Spawn New Character !!!! to:', to, authorization);


        if (this.clientSocket.clientIO.id == id) {
            // * this client's character is spawning
            console.log("player character spawned");
            ClientGameManager.playerCharacter = new ClientCharacter(id, displayName, to, authorization, characterType);
            ClientGameManager.currentCharacterList.push(ClientGameManager.playerCharacter);

            // * Enable Input
            this.updateLoop();
            // this.inputManager.setupPlayerCharacter(ClientGameManager.playerCharacter);
            // this.clientSocket.setupPlayerCharacter(ClientGameManager.playerCharacter);
        }
        else {
            // * other client's character
            console.log("!!! new other character spawned");
            ClientGameManager.currentCharacterList.push(new ClientCharacter(id, displayName, to, authorization, characterType))
        }
        // this.camera.setPlayerCharacter(ClientGameManager.playerCharacter);
    }





    public static getCharacterBySocketId(id: string) {
        return ClientGameManager.currentCharacterList.find(c => c.id == id);
    }
    private setupForPreventZoomAndPinchZoom() {

        // * prevent double tap zoom
        var lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            var now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // ! prevent pin zoom
        // document.addEventListener('touchmove', function (event: TouchEvent) {
        //   if (event.scale !== 1) { event.preventDefault(); }
        // }, false);
        (function () {

            var browser = window,
                doc = browser.document;

            // If there's a hash, or addEventListener is undefined, stop here
            if (!location.hash || !browser.addEventListener) {

                //set to 1
                window.scrollTo(0, 1);
                var scrollTop = 1,

                    //reset to 0 if needed
                    checkWindowBody = setInterval(function () {
                        if (doc.body) {
                            clearInterval(checkWindowBody);
                            scrollTop = "scrollTop" in doc.body ? doc.body.scrollTop : 1;
                            browser.scrollTo(0, scrollTop === 1 ? 0 : 1);
                        }
                    }, 15);

                if (browser.addEventListener) {
                    browser.addEventListener("load", function () {
                        setTimeout(function () {
                            //reset to hide address
                            browser.scrollTo(0, scrollTop === 1 ? 0 : 1);
                        }, 0);
                    }, false);
                }
            }

        })();
    }
    public static changeMap(bool: boolean) {
        console.log('change MAP()');
        if (bool == true) {
            this.currentMap?.mapHTML.setAttribute('light', 'true');

        }
        else {
            this.currentMap?.mapHTML.setAttribute('light', 'false');

        }
    }
}