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



    socketIOSetup() {
        this.serverio.on("connection", (clientSocket) => {



            console.log('user connected');


            ServerGameManager.currentUserList.push(clientSocket.id);
            console.log("current users:", ServerGameManager.currentUserList);


            clientSocket.on('current-serverinfo', () => {
                this.serverio.to(clientSocket.id).emit('current-serverinfo', ServerGameManager.currentMapInfo, ServerGameManager.currentPlayerCharacterList);
            });



            clientSocket.on('player-TrySpawn', (socketid: string) => {
                console.log('player-spawned : ', socketid);
                let randomCell = ServerGameManager.currentMapInfo.cellList[Math.floor(Math.random() * ServerGameManager.currentMapInfo.cellList.length)];
                // let randomCellTwo;
                console.log(randomCell);
                let createdChara = new ServerCharacter(socketid, randomCell.position, false);
                // while (randomCell.isOccupied != true) {
                //     randomCellTwo = ServerGameManager.currentMap.cellList[Math.floor(Math.random() * ServerGameManager.currentMap.cellList.length)];
                //     if (randomCellTwo != null) {
                //         break;
                //     }
                // }
                // let spawnPosition = randomCellTwo?.position;
                // if (spawnPosition != null) {
                ServerGameManager.currentPlayerCharacterList.push(createdChara);
                console.log("current users:", ServerGameManager.currentUserList);

                this.serverio.emit('player-TrySpawn', randomCell.position, socketid);
            });

            clientSocket.on('player-TryMove', (direction: Direction) => {
                console.log(direction, clientSocket.id);

                let requestedPlayer = ServerGameManager.getCharacterById(clientSocket.id);
                console.log(requestedPlayer);
                let cellByDirection = requestedPlayer?.getCellByDirection(direction);
                console.log(cellByDirection);
                if (cellByDirection != null) {
                    if (cellByDirection.isOccupied == false) {
                        if (requestedPlayer) {
                            if (requestedPlayer.canMoveTo(cellByDirection.position)) {
                                ServerGameManager.getCharacterById(clientSocket.id)?.TryMove(cellByDirection.position);
                                console.log('try move to :',)
                                this.serverio.emit('player-TryMove', cellByDirection.position, clientSocket.id);
                            }
                            else {
                                // * fail
                            }
                        }

                    }
                }
                //* Check if character availbe to move

            });



            clientSocket.on('disconnect', (socket) => {
                console.log("\x1b[41m$%s\x1b[0m", `${clientSocket.id} user disconnected`);
                console.log('socket : ', socket)
                console.log('clientSocket', clientSocket.id)
                // ! remove user from list
                let willDeleteCharacter = ServerGameManager.currentPlayerCharacterList.find(ch => ch.id == clientSocket.id);
                if (willDeleteCharacter) {
                    let wasStandingCell = ServerGameManager.currentMapInfo.getCellByVector2(willDeleteCharacter.currentPosition);
                    if (wasStandingCell) {
                        // * empty the cell someone was standing

                        wasStandingCell.setStandingCharacter(undefined);
                        wasStandingCell.isOccupied = false;
                    }

                    // this.removeArray(ServerGameManager.currentPlayerCharacterList, foundCharacter);
                    ServerGameManager.currentPlayerCharacterList = ServerGameManager.currentPlayerCharacterList.filter(c => c.id != clientSocket.id);
                    this.serverio.emit('disconnect-fromserver', clientSocket.id);
                }
                console.log("current users:", ServerGameManager.currentPlayerCharacterList);
            })

        });


    }



}