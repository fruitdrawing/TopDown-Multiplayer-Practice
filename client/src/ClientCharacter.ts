import { Camera } from "./Camera";
import { Cell } from "./Cell";
import { characterType, Direction } from "./Enums";
import { ClientGameManager } from "./ClientGameManager";
import { ClientItem } from "./ClientItem";
import { Vector2 } from "../../server/Vector2";
// import { ServerCharacter } from "../../server/ServerCharacter";

export class ClientCharacter {
    id: string;
    characterType: characterType;
    displayName: string;
    currentPosition: Vector2 = new Vector2(0, 0);
    private currentDirection: Direction = Direction.South;
    wrapperHtmlElement: HTMLDivElement;
    characterHtmlElement: HTMLDivElement;
    characterSpriteHtmlElement: HTMLDivElement;
    shadowHtmlElement: HTMLDivElement;
    isMoving: boolean = false;

    isAttacking: boolean = false;
    displayNameWrapperHTML: HTMLDivElement;
    displayNameHTML: HTMLParagraphElement;

    camera: Camera | undefined = undefined;
    constructor(id: string, displayName: string, initialPosition: Vector2, authorization: boolean, characterType: characterType) {
        this.id = id;

        this.characterType = characterType;


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

        this.displayNameWrapperHTML = document.createElement('div');
        this.displayNameWrapperHTML.classList.add('displayNameWrapper');


        this.displayNameHTML = document.createElement('p');
        this.displayNameHTML.classList.add('displayName');

        this.displayNameWrapperHTML.append(this.displayNameHTML)


        this.wrapperHtmlElement.append(this.displayNameWrapperHTML);

        // this.wrapperHtmlElement.append(this.displayNameHTML);


        this.displayName = displayName;
        this.SetClientName(displayName)

        this.TryMoveAnimation(this.currentPosition);


        // * shadow
        this.shadowHtmlElement = document.createElement('div');
        this.shadowHtmlElement.classList.add("characterShadow");
        this.characterHtmlElement.prepend(this.shadowHtmlElement);


        this.setupSpriteSheetByCharacterType(characterType);
        
    }

    ChangeNameEvent(name: string) {
        ClientGameManager.clientSocket.sendNameChanged(name);
    }


    SetClientName(name: string) {
        this.displayName = name;
        this.displayNameHTML.innerText = name;
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






    async tryPickAnimation(to: Vector2, itemid: string) {
        this.characterSpriteHtmlElement.classList.remove('character_spritesheet');
        void this.characterSpriteHtmlElement.offsetWidth;
        this.characterSpriteHtmlElement.classList.add('character_spritesheet');
        console.log(888888);
        switch (this.getCurrentDirection()) {
            case Direction.West:
                this.characterHtmlElement.setAttribute("action", "west");
                break;
            case Direction.North:
                this.characterHtmlElement.setAttribute("action", "north");

                break;
            case Direction.East:
                this.characterHtmlElement.setAttribute("action", "east");

                break;
            case Direction.South:
                this.characterHtmlElement.setAttribute("action", "south");

                break;
        }

        this.characterSpriteHtmlElement.setAttribute("pick", "true");

        await new Promise(resolve => setTimeout(resolve, 400));
        this.characterSpriteHtmlElement.setAttribute("pick", "false");
        let cell = ClientGameManager.currentMap?.getCellByVector2(to);
        if (cell) {
            let i = ClientGameManager.getClientItemByItemId(itemid)
            console.log(i);
            i?.pickedBy(this);
        }
    }

    async tryEatItemAnimation(to: Vector2, itemid: string) {

        let clientItem = ClientGameManager.getClientItemByItemId(itemid);
        clientItem?.tryRemoveItemFromWorld();

        switch (this.getCurrentDirection()) {
            case Direction.West:
                this.characterHtmlElement.setAttribute("action", "west");
                break;
            case Direction.North:
                this.characterHtmlElement.setAttribute("action", "north");
                break;
            case Direction.East:
                this.characterHtmlElement.setAttribute("action", "east");
                break;
            case Direction.South:
                this.characterHtmlElement.setAttribute("action", "south");
                break;
        }
        this.characterSpriteHtmlElement.setAttribute("pick", "true");
        await new Promise(resolve => setTimeout(resolve, 400));
        this.characterSpriteHtmlElement.setAttribute("pick", "false");
        console.log("client eat animation start");

        this.characterSpriteHtmlElement.setAttribute("eat", "true");
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.characterSpriteHtmlElement.setAttribute("eat", "false");
        console.log("client eat finish");


    }
    async tryDropItemAnimation(to: Vector2, itemid: string) {
        //
        // append html to world
        // create new html

        let itemHTML: HTMLDivElement | null = this.wrapperHtmlElement.querySelector('.itemPickedStatus');
        let mapHTML = document.getElementById('map');
        if (itemHTML != null) {
            mapHTML?.append(itemHTML);
            itemHTML.style.transform = `translate3d(${this.currentPosition.x *
                ClientGameManager.CellDistanceOffset}px,
                 ${this.currentPosition.y * ClientGameManager.CellDistanceOffset}px,0px`;
            itemHTML.classList.remove('itemPickedStatus');
            itemHTML.style.transform = `translate3d(${to.x *
                ClientGameManager.CellDistanceOffset}px,${to.y *
                ClientGameManager.CellDistanceOffset}px,0px`;
            console.log(5);
        }

        let cell = ClientGameManager.currentMap?.getCellByVector2(to);
        if (cell) {
            console.log(777777);
            console.log(777777);
            console.log(777777);
            console.log(777777);
            console.log(ClientGameManager.getClientItemByItemId(itemid));

        }

        switch (this.getCurrentDirection()) {
            case Direction.West:
                this.characterHtmlElement.setAttribute("action", "west");
                break;
            case Direction.North:
                this.characterHtmlElement.setAttribute("action", "north");

                break;
            case Direction.East:
                this.characterHtmlElement.setAttribute("action", "east");

                break;
            case Direction.South:
                this.characterHtmlElement.setAttribute("action", "south");

                break;
        }


        this.characterSpriteHtmlElement.setAttribute("pick", "true");
        await new Promise(resolve => setTimeout(resolve, 400));
        this.characterSpriteHtmlElement.setAttribute("pick", "false");
        // set starting point first
        // set end point

    }







    async TryMoveAnimation(to: Vector2) {

        this.isMoving = true;

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
        if (this.isAttacking == true) return;
        this.isAttacking = true;


        // let targetCell = this.getForwardCell();
        this.characterSpriteHtmlElement.classList.remove('character_spritesheet');
        void this.characterSpriteHtmlElement.offsetWidth;
        this.characterSpriteHtmlElement.classList.add('character_spritesheet');

        this.characterSpriteHtmlElement.setAttribute("attack", "true");


        console.log("tryAttack");
        switch (this.getCurrentDirection()) {
            case Direction.West:
                this.characterHtmlElement.setAttribute("action", "west");
                break;
            case Direction.North:
                this.characterHtmlElement.setAttribute("action", "north");

                break;
            case Direction.East:
                this.characterHtmlElement.setAttribute("action", "east");

                break;
            case Direction.South:
                this.characterHtmlElement.setAttribute("action", "south");

                break;
        }

        await new Promise(resolve => setTimeout(resolve, 200));

        // if (targetCell != null) {
        //     if (targetCell.isOccupied == true) {
        //         if (targetCell.standingCharacter?.died == false)
        //             targetCell.standingCharacter?.damage();
        //     }
        // }
        await new Promise(resolve => setTimeout(resolve, 500));
        this.characterHtmlElement.setAttribute("action", "false");

        this.characterSpriteHtmlElement.setAttribute("attack", "false");
        this.isAttacking = false;
        this.characterSpriteHtmlElement.style.setProperty('animation-iteration-count', 'infinite')

    }

    async attackAnimation() {
        if (this.isAttacking == true) return;
        this.isAttacking = true;


        // let targetCell = this.getForwardCell();
        this.characterSpriteHtmlElement.classList.remove('character_spritesheet');
        void this.characterSpriteHtmlElement.offsetWidth;
        this.characterSpriteHtmlElement.classList.add('character_spritesheet');


        this.characterSpriteHtmlElement.setAttribute("attack", "true");

        console.log("tryAttack");
        switch (this.getCurrentDirection()) {
            case Direction.West:
                this.characterHtmlElement.setAttribute("action", "west");
                break;
            case Direction.North:
                this.characterHtmlElement.setAttribute("action", "north");

                break;
            case Direction.East:
                this.characterHtmlElement.setAttribute("action", "east");

                break;
            case Direction.South:
                this.characterHtmlElement.setAttribute("action", "south");

                break;
        }
        await new Promise(resolve => setTimeout(resolve, 200));

        // if (targetCell != null) {
        //     if (targetCell.isOccupied == true) {
        //         if (targetCell.standingCharacter?.died == false)
        //             targetCell.standingCharacter?.damage();
        //     }
        // }
        await new Promise(resolve => setTimeout(resolve, 500));
        this.characterHtmlElement.setAttribute("action", "false");

        this.characterSpriteHtmlElement.setAttribute("attack", "false");
        this.characterSpriteHtmlElement.style.setProperty('animation-iteration-count', 'infinite')
        this.isAttacking = false;

    }

    async damageAnimation() {
        // if (this.died == true) return;
        // ^ damage effect
        this.characterSpriteHtmlElement.setAttribute('damage', 'true');

        // this.characterSpriteHtmlElement.classList.
        // this.hp -= 1;
        await new Promise(resolve => setTimeout(resolve, 300));
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
    //             output = ClientGameManager.currentMap.getCellByVector2(new Vector2(this.currentPosition.x + 1, this.currentPosition.y));
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
    setPlayerDisplayName(name: string) {
        // this.SetName
    }

    getCurrentDirection() {
        return this.currentDirection;
    }
    getOppositeDirection() {
        switch (this.currentDirection) {
            case Direction.West:
                return Direction.East;
            case Direction.North:
                return Direction.South;
            case Direction.East:
                return Direction.West;
            case Direction.West:
                return Direction.East;
        }
        return Direction.South;
    }
    setupSpriteSheetByCharacterType(haracterType: characterType) {
        switch (haracterType) {
            case characterType.female01:
                this.characterSpriteHtmlElement.classList.add('character_female01')
                break;

            case characterType.female02:
                this.characterSpriteHtmlElement.classList.add('character_female02')

                break;
            case characterType.male01:
                this.characterSpriteHtmlElement.classList.add('character_male01')

                break;
            case characterType.male02:
                this.characterSpriteHtmlElement.classList.add('character_male02')

                break;

        }
    }
}
