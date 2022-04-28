import express from 'express';
import { Server, Socket } from 'socket.io';
import http from 'http';


import { Vector2 } from './Vector2'
import { Direction } from '../client/src/Enums'
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

    constructor() {
        this.app.use(express.static('client/dist'));

        this.app.get('/c', (req, res) => {
            res.send(`currentPlayerCharacterList: ${JSON.stringify(ServerGameManager.currentPlayerCharacterList.map(c => c.id))} \n
           
             currentItemInWorld : ${JSON.stringify(ServerGameManager.currentItemList.map(i => i.itemType))}\n
           
                currentCellInfo isoccupied true only: ${JSON.stringify(ServerGameManager.currentMapInfo.cellList.filter(c => c.checkOccupied()).map(c => c.position))}
                currentCellInfo firstItem only: ${JSON.stringify(ServerGameManager.currentMapInfo.cellList.filter(c => c.hasPickableItem() != undefined).map(c => c.position))}
                
                `)

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



            clientSocket.on('player-TrySpawn', (socketid: string) => {
                console.log('player-spawned : ', socketid);
                let randomCell = ServerGameManager.currentMapInfo.cellList[Math.floor(Math.random() * ServerGameManager.currentMapInfo.cellList.length)];
                // let randomCellTwo;
                console.log(randomCell);
                let createdChara = new ServerCharacter(socketid, socketid, randomCell.position, false);
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
                let displayName = createdChara.displayName;
                this.serverio.emit('player-TrySpawn', randomCell.position, socketid, displayName);
            });

            clientSocket.on('player-TryMove', (direction: Direction) => {
                // console.log(direction, clientSocket.id);
                console.log('tried move!');

                let requestedPlayer = ServerGameManager.getCharacterById(clientSocket.id);
                if (requestedPlayer == null) return;
                let cellByDirection = requestedPlayer?.getCellByDirection(direction);
                // console.log(cellByDirection);
                if (cellByDirection != null) {
                    requestedPlayer.setDirectionByPosition(cellByDirection.position);
                    if (cellByDirection.checkOccupied() == false) {
                        if (requestedPlayer) {
                            if (requestedPlayer.canMoveTo(cellByDirection.position)) {
                                ServerGameManager.getCharacterById(clientSocket.id)?.TryMove(cellByDirection.position);
                                console.log('who : ', clientSocket.id)
                                console.log('try move to :', cellByDirection.position)

                                this.serverio.emit('player-TryMoveAnimation', cellByDirection.position, clientSocket.id);
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


            clientSocket.on('player-tryEatItemForward', () => {

                let playerCharacter = ServerGameManager.getCharacterById(clientSocket.id);
                if (playerCharacter) {

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



}