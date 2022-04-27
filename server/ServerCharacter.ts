import { Direction } from "../client/src/Enums";
import { ServerCell } from "./ServerCell";
import { ServerGameManager } from "./ServerGameManager";
import { ServerItem } from "./ServerItem";
import { Vector2 } from "./Vector2";

export class ServerCharacter {
    id: string;
    displayName: string;
    isClient: boolean;
    currentPosition: Vector2 = new Vector2(0, 0);
    currentDirection: Direction = Direction.South;
    isMoving: boolean = false;
    isAttacking: boolean = false;
    isPicking: boolean = false;

    currentPickingItem: ServerItem | undefined = undefined;
    //status
    currentFunc: any = undefined;
    hp: number = 3;
    died: boolean = false;
    // camera: Camera = GameManager.camera;
    bag: ServerItem[] = [];
    constructor(id: string, displayName: string, initialPosition: Vector2, authorization: boolean) {

        // if(createdMap.checkOccupiedByVector2(initialPosition)) return;
        this.id = id;
        this.displayName = displayName;
        this.isClient = authorization;
        // if (authorization == true) {
        //     this.camera.characterToFocus = this;
        // // }
        // this.characterHtmlElement = document.createElement('div');
        // this.characterHtmlElement.classList.add('character');

        // this.characterSpriteHtmlElement = document.createElement('div');
        // this.characterSpriteHtmlElement.classList.add('character_spritesheet');
        // this.characterHtmlElement.append(this.characterSpriteHtmlElement);
        // document.getElementById('map')?.append(this.characterHtmlElement);
        this.TryMove(initialPosition);

    }
    canDoSomething(): boolean {
        if (this.isAttacking === true || this.isMoving === true || this.isPicking === true) return false;
        return true;
    }
    canMoveTo(to: Vector2): boolean {
        if (this.canDoSomething() == false) return false;

        // set direction even movement fails.

        if (to.x > this.currentPosition.x) {

            // this.characterSpriteHtmlElement.setAttribute("facing", "right");

            this.currentDirection = Direction.East;
        }
        else if (to.x < this.currentPosition.x) {
            // this.characterSpriteHtmlElement.setAttribute("facing", "left");
            this.currentDirection = Direction.West;
        }
        else if (to.y < this.currentPosition.y) {
            // this.characterSpriteHtmlElement.setAttribute("facing", "up");
            this.currentDirection = Direction.North;
        }
        else if (to.y > this.currentPosition.y) {
            // this.characterSpriteHtmlElement.setAttribute("facing", "down");
            this.currentDirection = Direction.South;
        }
        if (ServerGameManager.currentMapInfo.checkOccupiedByVector2(to) === true) return false;
        return true;
    }


    async TryMove(to: Vector2) {


        // ! Check if to position is occupied by something
        // if (createdMap.checkOccupiedByVector2(to) === true) return;
        if (this.canMoveTo(to) == false) return;

        // * set previous cell empty
        // let previousCell = createdMap.getCellByVector2(this.currentPosition);
        // let nextCell = createdMap.getCellByVector2(to);
        ServerGameManager.currentMapInfo.setOccupiedCell(this.currentPosition, false);
        ServerGameManager.currentMapInfo.getCellByVector2(this.currentPosition)!.setStandingCharacter(undefined);
        // ^ set next cell to this character and occupied

        ServerGameManager.currentMapInfo.getCellByVector2(to)!.setStandingCharacter(this);
        ServerGameManager.currentMapInfo.setOccupiedCell(to, true);

        // this.isMoving = true;
        this.currentPosition = to;

        // await new Promise(resolve => setTimeout(resolve, 400));

        //* item check and pick up
        // let item = ServerGameManager.currentMapInfo.tryGetItemOnCellByVector2(to);

        // if (item != null) {
        // this.tryAddItemToInventory(item);
        // }
        // this.isMoving = false;
        // console.log('reatedMap.getCellByVector2(to))', createdMap.getCellByVector2(to));

    }

    public async tryAttack() {
        if (this.canDoSomething() == false) return;
        this.isAttacking = true;



        let targetCell = this.getForwardCell();
        // this.characterSpriteHtmlElement.classList.remove('character_spritesheet');
        // void this.characterSpriteHtmlElement.offsetWidth;
        // this.characterSpriteHtmlElement.classList.add('character_spritesheet');

        // this.characterSpriteHtmlElement.setAttribute("attack", "true");

        await new Promise(resolve => setTimeout(resolve, 200));
        console.log(targetCell);
        console.log(targetCell?.standingCharacter);
        if (targetCell != null) {
            if (targetCell.isOccupied == true) {
                if (targetCell.standingCharacter) {
                    if (targetCell.standingCharacter.died == false) {
                        console.log(`damge character : ${targetCell.standingCharacter}`);
                        targetCell.standingCharacter.damage();
                    }
                }
            }
        }
        await new Promise(resolve => setTimeout(resolve, 500));
        // this.characterSpriteHtmlElement.setAttribute("attack", "false");
        this.isAttacking = false;
        // this.characterSpriteHtmlElement.style.setProperty('animation-iteration-count', 'infinite')

    }


    async damage() {
        if (this.died == true) return;
        // ^ damage effect
        // this.characterSpriteHtmlElement.setAttribute('damage', 'true');

        // this.characterSpriteHtmlElement.classList.
        this.hp -= 1;
        ServerGameManager.serverSocketManager.serverio.emit('DamageCharacter', this.id);

        await new Promise(resolve => setTimeout(resolve, 1000));
        // this.characterSpriteHtmlElement.setAttribute('damage', 'false');

        console.log('damaged', this);
        if (this.hp == 0) {
            // stun for 3 seconds
            this.die();

        }
    }

    async die() {
        // this.characterSpriteHtmlElement.setAttribute('died', 'true');

        // this.characterHtmlElement.remove();
        this.died = true;
        ServerGameManager.serverSocketManager.serverio.emit('deadCharacter', this.id);

        await new Promise(resolve => setTimeout(resolve, 5000));

        this.died = false;
        this.hp = 3;
        // this.characterSpriteHtmlElement.setAttribute('died', 'false');

    }


    // ! PICK
    async tryPickItemForward() {
        this.isPicking = true;
        await new Promise(resolve => setTimeout(resolve, 1000));
        let forwardCell = this.getForwardCell();
        if (forwardCell) {
            if (forwardCell.hasPickableItem() == true) {

            }
        }
        this.isPicking = false;
    }


    getCellByDirection(direction: Direction) {

        let currentPos: ServerCell | undefined = ServerGameManager.currentMapInfo.getCellByVector2(this.currentPosition);
        if (currentPos != null) {
            switch (direction) {

                case Direction.West:
                    return ServerGameManager.currentMapInfo.getCellByVector2(new Vector2(currentPos?.position.x - 1, currentPos.position.y));
                    break;
                case Direction.North:
                    return ServerGameManager.currentMapInfo.getCellByVector2(new Vector2(currentPos?.position.x, currentPos.position.y - 1));

                    break;
                case Direction.East:
                    return ServerGameManager.currentMapInfo.getCellByVector2(new Vector2(currentPos?.position.x + 1, currentPos.position.y));

                    break;
                case Direction.South:
                    return ServerGameManager.currentMapInfo.getCellByVector2(new Vector2(currentPos?.position.x, currentPos.position.y + 1));

                    break;

            }
        }
        return undefined;
    }
    getForwardCell(): ServerCell | undefined {
        let output;
        switch (this.currentDirection) {
            case Direction.East:
                output = ServerGameManager.currentMapInfo.getCellByVector2(new Vector2(this.currentPosition.x + 1, this.currentPosition.y));
                break;
            case Direction.North:
                output = ServerGameManager.currentMapInfo.getCellByVector2(new Vector2(this.currentPosition.x, this.currentPosition.y - 1));

                break;
            case Direction.South:
                output = ServerGameManager.currentMapInfo.getCellByVector2(new Vector2(this.currentPosition.x, this.currentPosition.y + 1));
                break;
            case Direction.West:
                output = ServerGameManager.currentMapInfo.getCellByVector2(new Vector2(this.currentPosition.x - 1, this.currentPosition.y));
                break;
            default:
                output = undefined;
                break;

        }
        return output;
    }
    disconnect() {

    }
}