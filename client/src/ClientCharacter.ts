import { Camera } from "./Camera";
import { Cell } from "./Cell";
import { Direction } from "./Enums";
import { ClientGameManager } from "./ClientGameManager";
import { Item } from "./Item";
import { Vector2 } from "../../server/Vector2";
// import { ServerCharacter } from "../../server/ServerCharacter";

export class ClientCharacter {
    id: string;
    currentPosition: Vector2 = new Vector2(0, 0);
    private currentDirection: Direction = Direction.South;
    wrapperHtmlElement: HTMLDivElement;
    characterHtmlElement: HTMLDivElement;
    characterSpriteHtmlElement: HTMLDivElement;
    isMoving: boolean = false;

    playerName: HTMLDivElement;

    camera: Camera | undefined = undefined;
    constructor(id: string, initialPosition: Vector2, authorization: boolean) {
        this.id = id;





        if (authorization == true) {
            this.camera = new Camera(this);
            this.camera.characterToFocus = this;
        }
        this.currentPosition = initialPosition;


        this.wrapperHtmlElement = document.createElement('div');

        this.wrapperHtmlElement.classList.add('wrapper-character');


        this.characterHtmlElement = document.createElement('div');
        this.characterHtmlElement.classList.add('character');
        this.wrapperHtmlElement.append(this.characterHtmlElement);
        this.characterSpriteHtmlElement = document.createElement('div');
        this.characterSpriteHtmlElement.classList.add('character_spritesheet');
        this.characterHtmlElement.append(this.characterSpriteHtmlElement);
        document.getElementById('map')?.append(this.wrapperHtmlElement);


        this.playerName = document.createElement('div');
        this.playerName.classList.add('displayName');
        this.wrapperHtmlElement.append(this.playerName);
        this.SetName(id);


        this.TryMoveAnimation(this.currentPosition);



    }

    SetName(name: string) {
        this.playerName.innerText = name;
    }

    SetDirection(direction: Direction) {
        this.currentDirection = direction;
        switch (direction) {
            case Direction.West:
                this.characterSpriteHtmlElement.setAttribute("facing", "left");
                break;
            case Direction.North:
                this.characterSpriteHtmlElement.setAttribute("facing", "up");

                break;
            case Direction.East:
                this.characterSpriteHtmlElement.setAttribute("facing", "right");

                break;
            case Direction.South:
                this.characterSpriteHtmlElement.setAttribute("facing", "down");

                break;
        }
    }
    async moveByServer(to: Vector2) {

    }

    async TryMoveAnimation(to: Vector2) {

        if (to.x > this.currentPosition.x && to.y == this.currentPosition.y) {
            this.SetDirection(Direction.East)
        }
        if (to.x < this.currentPosition.x && to.y == this.currentPosition.y) {
            this.SetDirection(Direction.West)
        }
        if (to.y > this.currentPosition.y && to.x == this.currentPosition.x) {
            this.SetDirection(Direction.South)
        }
        if (to.y < this.currentPosition.y && to.x == this.currentPosition.x) {
            this.SetDirection(Direction.North)
        }
        // console.log('TryMoveAnimation', to);
        // console.log('who is moving', this.id);

        // ! Check if to position is occupied by something
        // if (createdMap.checkOccupiedByVector2(to) === true) return;
        // if (this.canMoveTo(to) == false) return;

        // * set previous cell empty
        // let previousCell = createdMap.getCellByVector2(this.currentPosition);
        // let nextCell = createdMap.getCellByVector2(to);
        // GameManager.currentMap.setOccupiedCell(this.currentPosition, false);
        // GameManager.currentMap.getCellByVector2(this.currentPosition)!.setStandingCharacter(undefined);
        // ^ set next cell to this character and occupied

        // GameManager.currentMap.getCellByVector2(to)!.setStandingCharacter(this);
        // GameManager.currentMap.setOccupiedCell(to, true);

        this.isMoving = true;
        this.currentPosition = to;
        //^ Camera
        // this.camera.setCameraPosition(-to.x, -to.y);
        if (this.camera != null)
            this.camera.setCameraPosition(-to.x, -to.y);

        //* animation
        this.wrapperHtmlElement.style.transform =
            `translate3d(${to.x * ClientGameManager.CellDistanceOffset}px,${to.y * ClientGameManager.CellDistanceOffset}px,0px`;
        await new Promise(resolve => setTimeout(resolve, 400));

        //* item check and pick up
        // let item = ClientGameManager.currentMap.tryGetItemOnCellByVector2(to);

        // if (item != null) {
        // this.tryAddItemToInventory(item);
        // }
        this.isMoving = false;
        // console.log('reatedMap.getCellByVector2(to))', createdMap.getCellByVector2(to));

    }

    public async tryAttack() {
        // if (this.isAttacking == true) return;
        // this.isAttacking = true;


        // let targetCell = this.getForwardCell();
        this.characterSpriteHtmlElement.classList.remove('character_spritesheet');
        void this.characterSpriteHtmlElement.offsetWidth;
        this.characterSpriteHtmlElement.classList.add('character_spritesheet');

        this.characterSpriteHtmlElement.setAttribute("attack", "true");

        await new Promise(resolve => setTimeout(resolve, 200));

        // if (targetCell != null) {
        //     if (targetCell.isOccupied == true) {
        //         if (targetCell.standingCharacter?.died == false)
        //             targetCell.standingCharacter?.damage();
        //     }
        // }
        await new Promise(resolve => setTimeout(resolve, 500));
        this.characterSpriteHtmlElement.setAttribute("attack", "false");
        // this.isAttacking = false;
        this.characterSpriteHtmlElement.style.setProperty('animation-iteration-count', 'infinite')

    }

    async attackAnimation() {

    }

    async damage() {
        // if (this.died == true) return;
        // ^ damage effect
        this.characterSpriteHtmlElement.setAttribute('damage', 'true');

        // this.characterSpriteHtmlElement.classList.
        // this.hp -= 1;
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.characterSpriteHtmlElement.setAttribute('damage', 'false');

        // console.log('damaged', this);
        // if (this.hp == 0) {
        //     // stun for 3 seconds
        //     this.die();
        // }
    }

    async die() {
        this.characterSpriteHtmlElement.setAttribute('died', 'true');
        await new Promise(resolve => setTimeout(resolve, 5000));
        this.alive();

    }

    async alive() {
        this.characterSpriteHtmlElement.setAttribute('died', 'false');

    }

    disconnect() {
        this.wrapperHtmlElement.remove();
    }

    // getForwardCell(): Cell | undefined {
    //     let output;
    //     switch (this.currentDirection) {
    //         case Direction.East:
    //             output = GameManager.currentMap.getCellByVector2(new Vector2(this.currentPosition.x + 1, this.currentPosition.y));
    //             break;
    //         case Direction.North:
    //             output = GameManager.currentMap.getCellByVector2(new Vector2(this.currentPosition.x, this.currentPosition.y - 1));

    //             break;
    //         case Direction.South:
    //             output = GameManager.currentMap.getCellByVector2(new Vector2(this.currentPosition.x, this.currentPosition.y + 1));

    //             break;
    //         case Direction.West:
    //             output = GameManager.currentMap.getCellByVector2(new Vector2(this.currentPosition.x - 1, this.currentPosition.y));
    //             break;
    //         default:
    //             output = undefined;
    //             break;

    //     }
    //     return output;
    // }
}