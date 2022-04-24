"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerManager = void 0;
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const Vector2_1 = require("../client/src/TopDown/Vector2");
class ServerManager {
    constructor() {
        this.app = (0, express_1.default)();
        this.server = new http_1.default.Server(this.app);
        this.serverio = new socket_io_1.Server(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        this.port = process.env.PORT || 3001;
        this.app.use(express_1.default.static('client/dist'));
        this.app.listen(this.port, () => {
            console.log(`listening to ${this.port}`);
            // console.log("11?");
            // console.log(path.join(__dirname, 'client/dist'));
        });
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
            clientSocket.on('player-move', (data) => {
                console.log(data);
                this.serverio.emit('player-move', (data));
            });
            clientSocket.on('player-spawn', (data) => {
                this.serverio.emit('player-spawn', new Vector2_1.Vector2(3, 4));
            });
            console.log('user connected');
            clientSocket.on('disconnet', () => {
                console.log('user disconnected');
            });
        });
    }
}
exports.ServerManager = ServerManager;
