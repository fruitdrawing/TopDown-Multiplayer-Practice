import { io, Socket } from "socket.io-client";
import { ClientCharacter } from "./ClientCharacter";
import { ClientGameManager } from "./ClientGameManager";
import { Vector2 } from "../../server/Vector2";
import { characterType, Direction, ItemType } from "../../server/shared/Enums";
import { ClientMapInfo } from "./ClientMapInfo";
import { ServerMapInfo } from "../../server/ServerMapInfo";
import { ServerCharacter } from "../../server/ServerCharacter";

export class ClientSocketManager {
    //"http://localhost:3001"
    // "http://172.30.1.56:3001/"
    //"http://192.168.123.107:3001/",
    // /

    clientIO: Socket = io(import.meta.env.VITE_SOCKETURL, { transports: ['websocket'], upgrade: false });


    connectionStatusHtml: HTMLDivElement | undefined = undefined;
    pingHtml: HTMLParagraphElement | undefined = undefined;
    latency: number = 0;
    startTime: number = 0;

    // myCharacter: ClientCharacter | undefined = undefined;
    constructor() {
        console.log('cccc', import.meta.env.VITE_SOCKETURL);
        console.log('dddd', import.meta.env.VITE_AUTOLOGIN);
        this.Init();


        // localStorage.setItem("asdd", "123123");
        // console.log(localStorage.getItem("asdd"));

        // wasm

        this.connectionStatusHtml = document.createElement('div');
        this.connectionStatusHtml.classList.add('connectionStatus');
        document.body.append(this.connectionStatusHtml);

        this.pingHtml = document.createElement('p');
        this.pingHtml.classList.add('pingPong');
        document.body.append(this.pingHtml);
        setInterval(() => {
            if (this.clientIO.connected) {
                this.connectionStatusHtml!.setAttribute("connected", "true");
            }
            else {
                this.connectionStatusHtml!.setAttribute("connected", "false");

            }
        }, 1000);
    }
    // setupPlayerCharacter(ch) {
    // this.myCharacter = ClientGameManager.playerCharacter;
    // }
    Init() {


        // * receive current server status first
        this.clientIO.emit('current-serverinfo');

        this.clientIO.on('current-serverinfo', (mapInfo: ServerMapInfo, serverCharacterList: ServerCharacter[]) => {
            console.log('received current-serverinfo:', mapInfo, serverCharacterList);
            //* MAP INFO SETUP
            ClientGameManager.currentMap = new ClientMapInfo(mapInfo.minX, mapInfo.minY, mapInfo.maxX, mapInfo.maxY, {});
            for (let i = 0; i < mapInfo.cellList.length; i++) {
                ClientGameManager.currentMap.cellList[i].isOccupied = mapInfo.cellList[i].isOccupied;

                // * Setup Item Status Info

                let foundItem = mapInfo.cellList[i].hasFirstLayerItem;
                if (foundItem) {
                    ClientGameManager.spawnItemOnWorld(foundItem.id, mapInfo.cellList[i].position, foundItem.itemType, foundItem.isLightStatus);
                }
                // if (s) {
                // ClientGameManager.currentMap.cellList[i].hasSecondaryLayerItem = new ClientItem(s.id, mapInfo.cellList[i].position, s.itemType, 1)
                // ClientGameManager.currentItemList.push(ClientGameManager.currentMap.cellList[i].hasSecondaryLayerItem!);

                // }

            }

            // * Setup Other Client's Characters
            for (let i = 0; i < serverCharacterList.length; i++) {
                if (serverCharacterList[i].id != this.clientIO.id) {
                    let spanwedOtherCharacter =
                        new ClientCharacter(serverCharacterList[i].id,
                            serverCharacterList[i].displayName, serverCharacterList[i].currentPosition, false, serverCharacterList[i].characterType, serverCharacterList[i].isNPC);
                    spanwedOtherCharacter.SetDirection(serverCharacterList[i].currentDirection);
                    //* picking item state
                    let pickingItem = serverCharacterList[i].currentPickingItem;
                    if (pickingItem != null) {
                        ClientGameManager.setItemToCharacter(spanwedOtherCharacter, pickingItem.itemType);
                    }
                    ClientGameManager.currentCharacterList.push(spanwedOtherCharacter);
                    console.log("!!!! span", spanwedOtherCharacter);

                }
            }
            //* SETUP DARK SHADOW STATUS
            if (mapInfo.currentDarkShadowStatue == true) {
                ClientGameManager.changeDarkShadowStatus(true);
            }
            else {
                ClientGameManager.changeDarkShadowStatus(false);
            }

        });



        // (setTimeout(() => {
        //     // * Try Character Spawn after 1 sec
        //     this.clientIO.emit('player-TrySpawn', this.clientIO.id)
        // }, 300));





        this.clientIO.on('player-directionChanged', (direction: Direction, id: string) => {
            let otherCH = ClientGameManager.currentCharacterList.find(ch => ch.id == id);
            if (otherCH != null) {
                otherCH.SetDirection(direction);
            }
        });


        this.clientIO.on('player-tryEmotion', (id: string) => {
            let character = ClientGameManager.getCharacterBySocketId(id);
            if (character) {
                character.tryEmotionAnimation();
            }
        });

        this.clientIO.on('player-offEmotion', (id: string) => {
            let character = ClientGameManager.getCharacterBySocketId(id);
            if (character) {
                character.offEmotionAnimation();
            }
        });
        this.clientIO.on('player-TryMoveAnimation', (to: Vector2, id: string) => {
            let otherCH = ClientGameManager.currentCharacterList.find(ch => ch.id == id);
            if (otherCH != null) {
                otherCH.TryMoveAnimation(to);
            }
            // if (this.clientIO.id == id) {
            //     console.log('received trymove info:', to, id);
            //     ClientGameManager.playerCharacter!.TryMoveAnimation(to);
            // }
            // else {
            //     //* find other characer by id
            //     let otherCH = ClientGameManager.currentCharacterList.find(ch => ch.id == id);
            //     if (otherCH != null) {
            //         otherCH.TryMoveAnimation(to);
            //     }
            // }
        });


        this.clientIO.on('player-nameChanged', (socketid: string, displayName: string) => {
            let found = ClientGameManager.currentCharacterList.find(c => c.id == socketid);
            if (found) {

                found.SetClientName(displayName);
            }
        });


        this.clientIO.on('shadow-toggle', (bool: boolean) => {
            ClientGameManager.changeDarkShadowStatus(bool);
        });

        this.clientIO.on('player-TrySpawn', (to: Vector2, socketid: string, displayName: string, characterType: characterType, isNpc: boolean) => {
            console.log('spawn position from server', to)
            if (socketid == null) return;
            console.log(`this.clientIO.id :${this.clientIO.id},     socketid:${socketid}`)
            if (this.clientIO.id == socketid) {
                ClientGameManager.spawnCharacter(socketid, displayName, to, true, characterType, isNpc);
            }
            else {
                ClientGameManager.spawnCharacter(socketid, displayName, to, false, characterType, isNpc);
            }
        });


        this.clientIO.on('player-TryAttack', (whoId: string, direction: Direction) => {
            let who = ClientGameManager.getCharacterBySocketId(whoId);
            if (who) {
                if (who.isAttacking == false)
                    who.attackAnimation();
            }
        });

        this.clientIO.on('player-tryPickItemForward', (to: Vector2, whoId: string, itemid: string) => {
            console.log('received ', to);
            console.log(whoId);
            console.log(itemid);
            let who = ClientGameManager.getCharacterBySocketId(whoId);
            // let clientItem = ClientGameManager.getClientItemByItemId(itemid);
            console.log(444);
            if (who) {
                ClientGameManager.deleteItemFromWorld(itemid);
                who.tryPickAnimation(to);
            }
        });

        this.clientIO.on('player-setPickingItemState', (whoId: string, itemType: ItemType) => {
            let who = ClientGameManager.getCharacterBySocketId(whoId);
            if (who) {
                ClientGameManager.setItemToCharacter(who, itemType)
                // who.setPickingItemState(itemType);
            }
        });
        this.clientIO.on('player-offPickingItemState', (whoId: string) => {
            let who = ClientGameManager.getCharacterBySocketId(whoId);
            if (who) {
                ClientGameManager.offItemFromCharacter(who);
                // who.setPickingItemState(itemType);
            }
        });




        this.clientIO.on('player-dropItemForward', (to: Vector2, whoId: string, itemType: ItemType) => {
            console.log('is going to drop item ', to);
            let who = ClientGameManager.getCharacterBySocketId(whoId);
            // let clientItem = ClientGameManager.getClientItemByItemId(itemid);

            if (who) {
                // if (clientItem) {
                // ClientGameManager.offItemFromCharacter(who);
                who.tryDropItemAnimation(to, itemType);
                // }
            }
        });



        this.clientIO.on('player-eatItemForward', (to: Vector2, whoId: string, itemid: string) => {
            console.log('is going to EAT item ', to);
            console.log(whoId);
            console.log(itemid);
            let who = ClientGameManager.getCharacterBySocketId(whoId);
            // let clientItem = ClientGameManager.getClientItemByItemId(itemid);
            if (who) {
                who.tryEatItemAnimation(to, itemid);
            }
        });


        this.clientIO.on('light-toggle', (id: string, onoff: boolean) => {
            console.log('light-toggle id:', id);
            //get item

            let item = ClientGameManager.currentItemList.find(i => i.id == id)
            console.log('item', item);
            item?.toggleLight(onoff);
        });
        this.clientIO.on('try-spawn-item', (id: string, to: Vector2, itemType: ItemType, currentLightStatue: boolean) => {

            ClientGameManager.spawnItemOnWorld(id, to, itemType, currentLightStatue);
            // console.log('to:', to);
            // console.log('itemType:', itemType);
            // let c = ClientGameManager.currentMap?.getCellByVector2(to);
            // if (c) {
            //     new ClientItem("", to, itemType);
            // }
        });
        this.clientIO.on('remove-item', (id: string, to: Vector2) => {
            // let item = ClientGameManager.getClientItemByItemId(itemid);
            // if (item) {
            // item.tryRemoveItemFromWorld();
            // ClientGameManager.currentItemList = ClientGameManager.currentItemList.filter(i => i.id != itemid);
            // }
            console.log('remove-item');
            console.log('remove-item');
            let i = ClientGameManager.currentItemList.find(i => i.id == id);
            if (i) {
                i.tryRemoveItemFromWorld();
            }
        });



        this.clientIO.on('DamageCharacter', (DamageCharacterId: string) => {
            let found = ClientGameManager.getCharacterBySocketId(DamageCharacterId);
            if (found) {
                found.damageAnimation();
            }
        });
        this.clientIO.on('deadCharacter', (DeadCharacterId: string) => {
            let found = ClientGameManager.getCharacterBySocketId(DeadCharacterId);
            if (found) {
                found.die();
            }
        });


        this.pingPong();

        this.clientIO.on('disconnect-fromserver', (otherClientSocket: string) => {
            console.log("!!!!!Some on just DISCONNECTED !!!!!");

            // * if ClientGameManager contains id, delete html element.
            let foundOtherCharacter = ClientGameManager.currentCharacterList.find(c => c.id == otherClientSocket)
            if (foundOtherCharacter) {
                foundOtherCharacter.disconnect();
                ClientGameManager.currentCharacterList = ClientGameManager.currentCharacterList.filter(c => c.id != otherClientSocket);
            }
        });
    }

    sendNameChanged(name: string) {
        this.clientIO.emit("player-nameChanged", name);
    }

    pingPong() {
        setInterval(() => {
            this.startTime = Date.now();
            this.clientIO.emit('ping');
        }, 2000);

        this.clientIO.on('pong', () => {
            this.latency = Date.now() - this.startTime;
            let pinghtml = this.pingHtml;
            if (pinghtml) {
                pinghtml.innerText = this.latency.toString() + "ms";
            }
        });
    }
}