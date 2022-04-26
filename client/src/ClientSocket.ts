import { io, Socket } from "socket.io-client";
import { ClientCharacter } from "./ClientCharacter";
import { ClientGameManager } from "./ClientGameManager";
import { Vector2 } from "../../server/Vector2";
import { Direction } from "./Enums";
import { MapInfo } from "./MapInfo";
import { ServerMapInfo } from "../../server/ServerMapInfo";
import { ServerCharacter } from "../../server/ServerCharacter";


export class ClientSocketManager {
    clientIO: Socket = io("http://localhost:3001");

    pingHtml: HTMLParagraphElement | undefined = undefined;
    latency: number = 0;
    startTime: number = 0;

    // myCharacter: ClientCharacter | undefined = undefined;
    constructor() {
        console.log('ClientSocketManager', this.clientIO);
        this.Init();
        this.pingHtml = document.createElement('p');
        this.pingHtml.classList.add('pingPong');
        document.body.append(this.pingHtml);

    }
    // setupPlayerCharacter(ch) {
    // this.myCharacter = ClientGameManager.playerCharacter;
    // }
    Init() {


        // * receive current server status first
        this.clientIO.emit('current-serverinfo');

        this.clientIO.on('current-serverinfo', (mapInfo: ServerMapInfo, characterList: ServerCharacter[]) => {
            console.log('received current-serverinfo:', mapInfo, characterList);
            //* MAP INFO SETUP
            ClientGameManager.currentMap = new MapInfo(mapInfo.minX, mapInfo.minY, mapInfo.maxX, mapInfo.maxY, {});

            for (let i = 0; i < mapInfo.cellList.length; i++) {
                ClientGameManager.currentMap.cellList[i].isOccupied = mapInfo.cellList[i].isOccupied;
            }

            // * Setup Other Client's Characters
            for (let i = 0; i < characterList.length; i++) {
                if (characterList[i].id != this.clientIO.id) {
                    let spanwedOtherCharacter = new ClientCharacter(characterList[i].id, characterList[i].displayName, characterList[i].currentPosition, false);
                    spanwedOtherCharacter.SetDirection(characterList[i].currentDirection);
                    ClientGameManager.currentCharacterList.push(spanwedOtherCharacter);
                }
            }
        });



        (setTimeout(() => {
            // * Try Character Spawn after 1 sec
            this.clientIO.emit('player-TrySpawn', this.clientIO.id)
        }, 300));







        this.clientIO.on('player-TryMove', (to: Vector2, id: string) => {
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


        this.clientIO.on('player-TrySpawn', (to: Vector2, socketid: string, displayName: string) => {
            console.log('spawn position from server', to)
            console.log(`this.clientIO.id :${this.clientIO.id},     socketid:${socketid}`)
            if (this.clientIO.id == socketid) {
                ClientGameManager.spawnCharacter(socketid, displayName, to, true);
            }
            else {
                ClientGameManager.spawnCharacter(socketid, displayName, to, false);
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
            console.log(this.latency.toString());
            let pinghtml = this.pingHtml;
            if (pinghtml) {
                pinghtml.innerText = this.latency.toString() + "ms";
            }
        });
    }
}