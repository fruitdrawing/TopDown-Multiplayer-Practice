import { Direction } from "../../server/shared/Enums";
import { ClientGameManager } from "./ClientGameManager";

export class InputManager {

    // * Input Related
    leftPressed: boolean = false;
    rightPressed: boolean = false;
    upPressed: boolean = false;
    downPressed: boolean = false;
    attackPressed: boolean = false;
    eatPressed: boolean = false;
    pickPressed: boolean = false;
    emotionPressed: boolean = false;

    delay: number = 400;
    bottomui: HTMLDivElement = document.getElementById("bottomUI") as HTMLDivElement;

    menuButtonUI: HTMLButtonElement = document.getElementById("rightTopMenuButton") as HTMLButtonElement;
    nameSubmitButton: HTMLButtonElement = document.getElementById("nameSubmitButton") as HTMLButtonElement;
    nameInput: HTMLInputElement = document.getElementById("nameInput") as HTMLInputElement;
    sideMenuWrapper: HTMLDivElement = document.getElementById("sideMenuWrapper") as HTMLDivElement;

    modalWindowWrapper: HTMLDivElement = document.getElementById("modalWindowWrapper") as HTMLDivElement;
    modalWindow: HTMLDivElement = document.getElementById("modalWindow") as HTMLDivElement;
    modalWindowText: HTMLDivElement = document.getElementById("modalWindowText") as HTMLDivElement;
    modalWindowOkButton: HTMLDivElement = document.getElementById("modalWindowOkButton") as HTMLDivElement;

    modalWindowNoticeIcon: HTMLDivElement = document.getElementById("modalWindowNoticeIcon") as HTMLDivElement;


    warningMessageWrapper: HTMLDivElement = document.getElementById("WarningMessageWrapper") as HTMLDivElement;
    // warnningMessage : HTMLDivElement = document.getElementById("WarningMessage") as HTMLDivElement;



    modalWindowBool: boolean = false;;
    sideMenuBool: boolean = false;


    canSendInput: boolean = true;
    // myCharacter: ClientCharacter | undefined = undefined;

    // clientSocketManager: ClientSocketManager | undefined = undefined;
    constructor() {



        this.setupKeyDownEvent();
        this.onTouchStartEventSetup();
        this.onTouchEndEventSetup();
        this.setKeyUpEventSetup();
        this.onTouchMoveEventSetup();


        this.nameButtonBehaviorSetup();

        this.sideMenuWrapper.setAttribute('showSideMenu', 'false');

        this.menuButtonUI.addEventListener('click', () => {
            this.showSideMenu();
        });

        this.modalWindowWrapper.setAttribute("showModalWindow", "false")

        // * Closing Modal window
        this.modalWindowOkButton.addEventListener('click', () => {
            this.showModal(" ", false);
        });

    }

    public async checkKeyInput() {

        if (this.canSendInputFunc() == false) return;
        if (ClientGameManager.playerCharacter != undefined) {
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
                }
                this.canSendInput = false;
                await new Promise(resolve => setTimeout(resolve, this.delay));
                this.canSendInput = true;
                // map.style.transform = `translate3d(${-playerCharacter.currentPosition.x * CellDistance}px,${-playerCharacter.currentPosition.y * CellDistance}px,0)`;
            }

        }
        else if (this.upPressed) {
            if (ClientGameManager.playerCharacter.isMoving == false) {
                if (ClientGameManager.clientSocket != null) {
                    ClientGameManager.clientSocket.clientIO.emit('player-TryMove', Direction.North);
                }
                // this.myCharacter.TryMoveAnimation(new Vector2(this.myCharacter.currentPosition.x, this.myCharacter.currentPosition.y - 1));
                // mainCamera.setCameraPosition(-playerCharacter.currentPosition.x, -playerCharacter.currentPosition.y);
                this.canSendInput = false;
                await new Promise(resolve => setTimeout(resolve, this.delay));
                this.canSendInput = true;
            }
        }
        else if (this.rightPressed) {
            if (ClientGameManager.playerCharacter.isMoving == false) {
                if (ClientGameManager.clientSocket != null) {
                    ClientGameManager.clientSocket.clientIO.emit('player-TryMove', Direction.East);
                    this.canSendInput = true;
                }
                // this.myCharacter.TryMoveAnimation(new Vector2(this.myCharacter.currentPosition.x + 1, this.myCharacter.currentPosition.y));
                // mainCamera.setCameraPosition(-playerCharacter.currentPosition.x, -playerCharacter.currentPosition.y);
                this.canSendInput = false;
                await new Promise(resolve => setTimeout(resolve, this.delay));
                this.canSendInput = true;
            }
        }
        else if (this.downPressed) {
            if (ClientGameManager.playerCharacter.isMoving == false) {
                if (ClientGameManager.clientSocket != null) {
                    ClientGameManager.clientSocket.clientIO.emit('player-TryMove', Direction.South);
                }
                // this.myCharacter.TryMoveAnimation(new Vector2(this.myCharacter.currentPosition.x + 1, this.myCharacter.currentPosition.y));
                // mainCamera.setCameraPosition(-playerCharacter.currentPosition.x, -playerCharacter.currentPosition.y);
                this.canSendInput = false;
                await new Promise(resolve => setTimeout(resolve, this.delay));
                this.canSendInput = true;
            }
        }

        else if (this.attackPressed) {
            if (ClientGameManager.playerCharacter.isMoving == false) {
                // ClientGameManager.playerCharacter.tryAttack();
                ClientGameManager.clientSocket.clientIO.emit('player-TryAttack', ClientGameManager.playerCharacter.getCurrentDirection());
                this.canSendInput = false;
                await new Promise(resolve => setTimeout(resolve, this.delay));
                this.canSendInput = true;
            }
        }
        else if (this.pickPressed) {
            if (ClientGameManager.playerCharacter.isMoving == false) {
                // ClientGameManager.playerCharacter.tryAttack();
                console.log('client try pick');
                ClientGameManager.clientSocket.clientIO.emit('player-tryPickItemForward');
                this.canSendInput = false;
                await new Promise(resolve => setTimeout(resolve, this.delay));
                this.canSendInput = true;
            }
        }
        else if (this.eatPressed) {
            if (ClientGameManager.playerCharacter.isMoving == false) {
                // ClientGameManager.playerCharacter.tryAttack();
                console.log('client EAT pick');
                ClientGameManager.clientSocket.clientIO.emit('player-eatItemForward');
                this.canSendInput = false;
                await new Promise(resolve => setTimeout(resolve, this.delay));
                this.canSendInput = true;
            }
        }
        else if (this.emotionPressed){
            if (ClientGameManager.playerCharacter.isMoving == false) {
                // ClientGameManager.playerCharacter.tryAttack();
                console.log('client EAT pick');
                ClientGameManager.clientSocket.clientIO.emit('player-tryEmotion');
                this.canSendInput = false;
                await new Promise(resolve => setTimeout(resolve, this.delay));
                this.canSendInput = true;
            }
        }

    }

    canSendInputFunc(): boolean {
        if (this.canSendInput == false) return false;

        if (ClientGameManager.playerCharacter == undefined) return false;
        if (ClientGameManager.playerCharacter) {
            if (ClientGameManager.playerCharacter.isAttacking || ClientGameManager.playerCharacter.isMoving) {
                return false;
            }
        }

        return true;
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
                // let i = document.createElement('div');
                // i.classList.add('displayNameWrapper');
                // i.classList.add('itemPickedStatus');
                // i.classList.add('GameObject');
                // ClientGameManager.playerCharacter!.wrapperHtmlElement.append(i);
                this.showErrorMessage("asdad asd asd asd a");
            }
            if (e.key === 'p') {
                this.pickPressed = true;
            }
            if (e.key === 'e') {
                this.eatPressed = true;
            }
            if(e.key === 'c')
            {
                this.emotionPressed = true;
            }
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
                console.log(ClientGameManager.currentCharacterList);
            }
            if (e.key === 'i') {

            }
            if (e.key === 'p') {
                this.pickPressed = false;
            }
            if (e.key === 'e') {
                this.eatPressed = false;
            }
            if(e.key === 'c') {
                this.emotionPressed = false;
            }

        });

    }

    onTouchMoveEventSetup() {
        this.bottomui.ontouchmove = ((ev: TouchEvent) => {
            console.log("ontouchMove");
            console.log("MOVE", ev);
        });


    }


    onTouchStartEventSetup() {
        this.bottomui.ontouchstart = ((ev: TouchEvent) => {
            console.log("ontouchstart");
            console.log(ev);
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
                    case "pickButton":
                        this.pickPressed = true;
                        break;
                    case "eatButton":
                        this.eatPressed = true;
                        break;
                    case "emotionButton":
                        this.emotionPressed = true;
                        break;


                }
            }
        });
    }



    onTouchEndEventSetup() {

        this.bottomui.ontouchend = ((ev: TouchEvent) => {
            console.log("ontouchEND");
            console.log('END', ev);

            this.upPressed = false;
            this.leftPressed = false;
            this.rightPressed = false;
            this.downPressed = false;
            this.attackPressed = false;
            this.eatPressed = false;
            this.pickPressed = false;
            this.emotionPressed = false;
        });

    }


    showSideMenu() {
        if (this.sideMenuBool == false) {
            this.sideMenuWrapper.setAttribute('showSideMenu', 'true');
            this.sideMenuBool = true;
        }
        else {
            this.sideMenuWrapper.setAttribute('showSideMenu', 'false');
            this.sideMenuBool = false;
        }
    }

    nameButtonBehaviorSetup() {
        this.nameSubmitButton.addEventListener('click', () => {
            if (this.nameInput.value.length < 3) {
                this.showModal("Too short!", true);
            }
            else {
                console.log('clicked name changed');
                ClientGameManager.playerCharacter?.ChangeNameEvent(this.nameInput.value);
                this.showModal("You've just changed your name to : " + this.nameInput.value, false);
                this.nameInput.value = "";
            }

        });
    }

    showModal(text: string, error: boolean) {
        console.log("show mOdlaw");
        if (this.modalWindowBool == true) {
            this.modalWindowWrapper.setAttribute("showModalWindow", "false")
            this.modalWindowBool = false;
        }
        else {
            this.modalWindowWrapper.setAttribute("showModalWindow", "true");
            if (error == true) {
                this.modalWindowNoticeIcon.setAttribute("error", "true");
            }
            else {
                this.modalWindowNoticeIcon.setAttribute("error", "false");
            }
            this.modalWindowText.innerText = text;
            this.modalWindowBool = true;
        }
    }

    showErrorMessage(message: string) {
        console.log(message);
        let newMessage = document.createElement('p');
        newMessage.classList.add('WarningMessage');
        newMessage.innerText = message;
        this.warningMessageWrapper.append(newMessage);
        setTimeout(() => newMessage.remove(), 3000);
    }


}