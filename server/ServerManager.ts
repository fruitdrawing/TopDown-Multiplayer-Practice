import express from 'express';
import { Server, Socket } from 'socket.io';
import http from 'http';

import { Direction, characterType } from './shared/Enums'
import { ServerGameManager } from './ServerGameManager';
import { ServerCharacter } from './ServerCharacter';


export class ServerManager {

    app = express();
    server = new http.Server(this.app);
    serverio = new Server(this.server, {
        cors:
        {
            origin: "*",
            methods: ["GET", "POST"]
        }
    })

    port = process.env.PORT || 3001;
    // public currentUserList: string[] = [];

    shadowStatus: boolean = false;
    constructor() {
        this.app.use(express.static('client/dist'));

        this.app.get('/c', (req, res) => {
            res.send(`
                <h1>character List</h1>
            <h4>currentPlayerCharacterList: <ul>${JSON.stringify(ServerGameManager.currentPlayerCharacterList.map(c => c.displayName))
                }</ul></h4>
            <h1>currentItem</h1>
             <h4>currentItemID InWorld : ${JSON.stringify(ServerGameManager.currentItemList.map(i => i.id))}\</h4>
             <h4>currentItemTYPE InWorld : ${JSON.stringify(ServerGameManager.currentItemList.map(i => i.itemType))}\n</h4>
             <h4>currentItem POSITION InWorld : ${JSON.stringify(ServerGameManager.currentItemList.map(i => i.position))}\n</h4>
            <h1>ITEM<h1>
                <h4>currentCellInfo hasPickableItem List: ${JSON.stringify(ServerGameManager.currentMapInfo.cellList.filter(c => c.hasPickableItem() != undefined).map(c => c.position))}</h4>
                <h4>currentCellInfo position which has item List: ${JSON.stringify(ServerGameManager.currentMapInfo.cellList.filter(c => c.hasFirstLayerItem != undefined).map(c => c.position))}</h4>
                
                `)

        });

        this.app.get('/e', (req, res) => {
            this.toggleShadow();
        });


        this.app.get('/t', (req, res) => {
            this.toggleShadow();
        });
        this.server.listen(this.port, () => {
            console.log(`listening to ${this.port}`);
        })

        this.app.get('/', ((req, res) => {
            console.log('some one?');
            res.send('hello');
        }));

        // * Create Server Map 

        this.socketIOSetup();

    }

    private removeArray(array: any, value: any) {
        array.filter(function (element: any) {
            return element != value;
        });
    }


    async tryAttack(character: ServerCharacter, direction: Direction) {
        await character.tryAttack();

    }



    socketIOSetup() {
        this.serverio.on("connection", (clientSocket) => {



            console.log('user connected');


            // ServerGameManager.currentUserSocketIdList.push(clientSocket.id);
            console.log("current users:", ServerGameManager.currentPlayerCharacterList);


            clientSocket.on('current-serverinfo', () => {
                this.serverio.to(clientSocket.id).emit('current-serverinfo', ServerGameManager.currentMapInfo, ServerGameManager.currentPlayerCharacterList);
            });

            clientSocket.on('player-tryEmotion',() => {
                let requestedPlayer = ServerGameManager.getCharacterById(clientSocket.id);
                if (requestedPlayer == null) return;

                requestedPlayer.tryEmotion();
            })

            clientSocket.on('player-TrySpawn', (socketid: string, receivedDisplayName: string, receivedCharacterType: characterType) => {
                console.log('player-spawned : ', socketid);
                let tempList = ServerGameManager.currentMapInfo.cellList.filter(m => m.checkOccupied() == false).filter(c => c.position.y < 19);
                let randomNotOccupiedCell = tempList[Math.floor(Math.random() * tempList.length)];
                console.log(randomNotOccupiedCell);
                let createdChara = new ServerCharacter(socketid, receivedDisplayName, randomNotOccupiedCell.position, false, receivedCharacterType, false);
                // while (randomCell.isOccupied != true) {
                //     randomCellTwo = ServerGameManager.currentMap.cellList[Math.floor(Math.random() * ServerGameManager.currentMap.cellList.length)];
                //     if (randomCellTwo != null) {
                //         break;
                //     }
                // }
                // let spawnPosition = randomCellTwo?.position;
                // if (spawnPosition != null) {
                ServerGameManager.currentPlayerCharacterList.push(createdChara);
                // console.log("current users:", ServerGameManager.currentPlayerCharacterList);
                // let displayName = createdChara.displayName;
                // let serverCharacterType = createdChara.characterType;

                this.serverio.emit('player-TrySpawn', randomNotOccupiedCell.position, socketid, receivedDisplayName, receivedCharacterType);
            });

            clientSocket.on('player-TryMove', (direction: Direction) => {
                // console.log(direction, clientSocket.id);

                let requestedPlayer = ServerGameManager.getCharacterById(clientSocket.id);
                if (requestedPlayer == null) return;
                let cellByDirection = requestedPlayer?.getCellByDirection(direction);
                if (cellByDirection != null) {
                    requestedPlayer.setDirectionByPosition(cellByDirection.position);
                    if (cellByDirection.checkOccupied() == false) {
                        if (requestedPlayer) {
                            if (requestedPlayer.canMoveTo(cellByDirection.position)) {
                                ServerGameManager.getCharacterById(clientSocket.id)?.TryMove(cellByDirection.position);
                                console.log('who : ', clientSocket.id)
                                console.log('try move to :', cellByDirection.position)

                                // this.serverio.emit('player-TryMoveAnimation', cellByDirection.position, clientSocket.id);
                                return;
                            }
                            else {
                                // * fail
                            }
                        }

                    }
                }
                else {
                    //! todo
                }

                //* Check if character availbe to move
            });



            clientSocket.on('player-TryAttack', (direction: Direction) => {

                if (ServerGameManager.getCharacterById(clientSocket.id)?.canDoSomething() == true) {
                    this.serverio.emit('player-TryAttack', clientSocket.id, direction);
                    console.log('player-TryAttack emited from client');
                    // * Check if the character can attack
                    let goingToAttackCharacter = ServerGameManager.getCharacterById(clientSocket.id);
                    // if can, attack,

                    // if succes, damage the target
                    if (goingToAttackCharacter) {
                        goingToAttackCharacter.tryAttack();
                    }
                }
            });

            clientSocket.on('player-tryPickItemForward', () => {

                let playerCharacter = ServerGameManager.getCharacterById(clientSocket.id);
                if (playerCharacter) {
                    if (playerCharacter.currentPickingItem != undefined) {
                        console.log('player tried DROP something!')

                        playerCharacter.dropItemForward();

                    }
                    else {
                        console.log('player tried PICK! something!')

                        playerCharacter.tryPickItemForward();

                    }
                }
            });


            clientSocket.on('player-eatItemForward', () => {

                let playerCharacter = ServerGameManager.getCharacterById(clientSocket.id);
                if (playerCharacter) {
                    playerCharacter.eatForward();
                }
            });


            clientSocket.on('player-nameChanged', (displayName) => {
                let character = ServerGameManager.getCharacterById(clientSocket.id);
                if (character) {
                    character.displayName = displayName;
                    this.serverio.emit('player-nameChanged', character.id, displayName);
                }
            });


            clientSocket.on('ping', () => {
                clientSocket.emit('pong');
            });


            clientSocket.on('disconnect', (socket) => {
                console.log("\x1b[41m$%s\x1b[0m", `${clientSocket.id} user disconnected`);
                console.log('socket : ', socket)
                console.log('clientSocket', clientSocket.id)
                // ! remove user from list
                let willBeDeleteCharacter = ServerGameManager.currentPlayerCharacterList.find(ch => ch.id == clientSocket.id);
                if (willBeDeleteCharacter) {
                    let wasStandingCell = ServerGameManager.currentMapInfo.getCellByVector2(willBeDeleteCharacter.currentPosition);
                    if (wasStandingCell) {
                        // * empty the cell someone was standing

                        wasStandingCell.setStandingCharacter(undefined);
                        // wasStandingCell.isOccupied = false;
                    }

                    // ! null can be occupied by ghost
                    // this.removeArray(ServerGameManager.currentPlayerCharacterList, foundCharacter);
                    // ^ elemenate ghost null
                    ServerGameManager.currentPlayerCharacterList.filter(c => c == null).map(c => ServerGameManager.currentMapInfo.setOccupiedCell(c.currentPosition, false));

                    ServerGameManager.currentPlayerCharacterList = ServerGameManager.currentPlayerCharacterList.filter(c => c.id != clientSocket.id && c.id != null);
                    this.serverio.emit('disconnect-fromserver', clientSocket.id);
                }
                // console.log("current users:", ServerGameManager.currentPlayerCharacterList);
            })

        });


    }

    removeCharacter(id: string) {
        // ! remove user from list
        let willBeDeleteCharacter = ServerGameManager.currentPlayerCharacterList.find(ch => ch.id == id);
        if (willBeDeleteCharacter) {
            let wasStandingCell = ServerGameManager.currentMapInfo.getCellByVector2(willBeDeleteCharacter.currentPosition);
            if (wasStandingCell) {
                // * empty the cell someone was standing
                wasStandingCell.setStandingCharacter(undefined);
                // wasStandingCell.isOccupied = false;
            }

            // ! null can be occupied by ghost
            // this.removeArray(ServerGameManager.currentPlayerCharacterList, foundCharacter);
            // ^ elemenate ghost null
            ServerGameManager.currentPlayerCharacterList.filter(c => c == null).map(c => ServerGameManager.currentMapInfo.setOccupiedCell(c.currentPosition, false))
            ServerGameManager.currentPlayerCharacterList.filter(c => c == null).map(c => ServerGameManager.currentMapInfo.setCharacterStanding(c.currentPosition, undefined))

            ServerGameManager.currentPlayerCharacterList = ServerGameManager.currentPlayerCharacterList.filter(c => c.id != id && c.id != null);
            this.serverio.emit('disconnect-fromserver', willBeDeleteCharacter.id);
        }
    }

    toggleShadow() {
        if (ServerGameManager.currentMapInfo.currentDarkShadowStatue == true) {
            ServerGameManager.currentMapInfo.currentDarkShadowStatue = false;

            this.serverio.emit('shadow-toggle', ServerGameManager.currentMapInfo.currentDarkShadowStatue);
        }
        else {
            ServerGameManager.currentMapInfo.currentDarkShadowStatue = true;
            this.serverio.emit('shadow-toggle', ServerGameManager.currentMapInfo.currentDarkShadowStatue);


        }

        console.log("toggle light");
    }



}