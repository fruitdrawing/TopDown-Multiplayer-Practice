import { ClientCharacter } from "./ClientCharacter";
// import { ClientSocketManager } from "./ClientSocket";
import { Direction } from "./Enums";

import { ClientGameManager } from "./ClientGameManager";
import { Vector2 } from "../../server/Vector2";

export class InputManager {

    // * Input Related
    leftPressed: boolean = false;
    rightPressed: boolean = false;
    upPressed: boolean = false;
    downPressed: boolean = false;
    attackPressed: boolean = false;
    bottomui: HTMLDivElement = document.getElementById("bottomUI") as HTMLDivElement;


    canSendInput: boolean = true;
    // myCharacter: ClientCharacter | undefined = undefined;

    // clientSocketManager: ClientSocketManager | undefined = undefined;
    constructor() {
        this.checkKeyInput();
        this.setupKeyDownEvent();
        this.onTouchStartEventSetup();
        this.onTouchEndEventSetup();
        this.setKeyUpEventSetup();
    }

    setupPlayerCharacter(character: ClientCharacter) {
        // ClientGameManager.playerCharacter = character;
        // ClientGameManager.clientSocket = ClientGameManager.clientSocket;
    }
    public async checkKeyInput() {
        if (this.canSendInput == false) return;
        if (ClientGameManager.playerCharacter) {
            if (ClientGameManager.playerCharacter.isMoving == true) return;
        }
        console.log('checkKeyInput')

        if (ClientGameManager.playerCharacter == null) return;
        if (this.leftPressed) {
            if (ClientGameManager.playerCharacter.isMoving == false) {
                // playerCharacter.TryMove(new Vector2(playerCharacter.currentPosition.x - 1, playerCharacter.currentPosition.y));
                // map.style.transform = `translate3d(${-x * CellDistance}px,${-y * CellDistance}px,0px)`;
                if (ClientGameManager.clientSocket != null) {
                    ClientGameManager.clientSocket.clientIO.emit('player-TryMove', Direction.West);
                    this.canSendInput = false;
                    await new Promise(resolve => setTimeout(resolve, 300));
                    this.canSendInput = true;
                }

                // map.style.transform = `translate3d(${-playerCharacter.currentPosition.x * CellDistance}px,${-playerCharacter.currentPosition.y * CellDistance}px,0)`;
            }

        }
        else if (this.upPressed) {
            if (ClientGameManager.playerCharacter.isMoving == false) {
                if (ClientGameManager.clientSocket != null) {
                    ClientGameManager.clientSocket.clientIO.emit('player-TryMove', Direction.North);
                    this.canSendInput = false;
                    await new Promise(resolve => setTimeout(resolve, 300));
                    this.canSendInput = true;
                }
                // this.myCharacter.TryMoveAnimation(new Vector2(this.myCharacter.currentPosition.x, this.myCharacter.currentPosition.y - 1));
                // mainCamera.setCameraPosition(-playerCharacter.currentPosition.x, -playerCharacter.currentPosition.y);

            }
        }
        else if (this.rightPressed) {
            if (ClientGameManager.playerCharacter.isMoving == false) {
                if (ClientGameManager.clientSocket != null) {
                    ClientGameManager.clientSocket.clientIO.emit('player-TryMove', Direction.East);
                    this.canSendInput = false;
                    await new Promise(resolve => setTimeout(resolve, 300));
                    this.canSendInput = true;
                }
                // this.myCharacter.TryMoveAnimation(new Vector2(this.myCharacter.currentPosition.x + 1, this.myCharacter.currentPosition.y));
                // mainCamera.setCameraPosition(-playerCharacter.currentPosition.x, -playerCharacter.currentPosition.y);

            }
        }
        else if (this.downPressed) {
            if (ClientGameManager.playerCharacter.isMoving == false) {
                if (ClientGameManager.clientSocket != null) {
                    ClientGameManager.clientSocket.clientIO.emit('player-TryMove', Direction.South);
                    this.canSendInput = false;
                    await new Promise(resolve => setTimeout(resolve, 300));
                    this.canSendInput = true;
                }
                // this.myCharacter.TryMoveAnimation(new Vector2(this.myCharacter.currentPosition.x + 1, this.myCharacter.currentPosition.y));
                // mainCamera.setCameraPosition(-playerCharacter.currentPosition.x, -playerCharacter.currentPosition.y);

            }
        }

        else if (this.attackPressed) {
            if (ClientGameManager.playerCharacter.isMoving == false) {
                ClientGameManager.playerCharacter.tryAttack();

            }
        }

    }

    setupKeyDownEvent() {


        document.addEventListener("keydown", (e) => {
            if (e.keyCode == 37) {
                this.leftPressed = true;
            }
            if (e.keyCode == 39) {
                this.rightPressed = true;
            }
            if (e.keyCode == 38) {
                this.upPressed = true;
            }
            if (e.keyCode == 40) {
                this.downPressed = true;
            }
            if (e.key === 'a') {
                console.log("ATTTACCk");
                this.attackPressed = true;
            }
            if (e.key === 'i') {
                if (ClientGameManager.clientSocket) {
                    console.log(ClientGameManager.clientSocket.clientIO.id);
                }
            }
        });


    }


    onTouchStartEventSetup() {
        this.bottomui.ontouchstart = ((ev: TouchEvent) => {
            let target: HTMLButtonElement = ev.target as HTMLButtonElement;
            if (target) {
                let clickedDpadId: string | null = target.getAttribute('id');
                switch (clickedDpadId) {
                    case "dpadUp":
                        this.upPressed = true;
                        break;
                    case "dpadLeft":
                        this.leftPressed = true;

                        break;
                    case "dpadRight":
                        this.rightPressed = true;
                        break;
                    case "dpadDown":
                        this.downPressed = true;
                        break;
                    case "attackButton":
                        this.attackPressed = true;
                        break;

                }
            }
        });
    }
    onTouchEndEventSetup() {

        this.bottomui.ontouchend = ((ev: TouchEvent) => {
            this.upPressed = false;
            this.leftPressed = false;
            this.rightPressed = false;
            this.downPressed = false;
            this.attackPressed = false;
        });

    }


    setKeyUpEventSetup() {

        document.addEventListener("keyup", (e) => {
            if (e.keyCode == 37) {
                this.leftPressed = false;
            }
            if (e.keyCode == 39) {
                this.rightPressed = false;
            }
            if (e.keyCode == 38) {
                this.upPressed = false;
            }
            if (e.keyCode == 40) {
                this.downPressed = false;
            }
            if (e.key === 'a') {
                this.attackPressed = false;
            }
            if (e.key === 't') {
            }

        });

    }



}