import express from 'express';
import { Server, Socket } from 'socket.io';
import http from 'http';
import { Vector2 } from '../topdowncamera/src/TopDown/Vector2'

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
    constructor() {

        this.app.listen(this.port, () => {
            console.log(`listening to ${this.port}`);
        })

        this.app.get('/', ((req, res) => {
            console.log('some one?');
            res.send('hello');
        }));

        this.socketIOSetup();
    }
    socketIOSetup() {
        this.serverio.on("connection", (clientSocket) => {


            clientSocket.on('test', (data) => {
                console.log(data);
            });

            clientSocket.on('player-move', (data: Vector2) => {
                console.log(data);
                this.serverio.emit('player-move', (data));
            });
            clientSocket.on('player-spawn', (data) => {
                this.serverio.emit('player-spawn', new Vector2(3, 4));

            });
            console.log('user connected');
            clientSocket.on('disconnet', () => {
                console.log('user disconnected');
            });
        });
    }
}