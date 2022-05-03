import { characterType, Direction, ItemType } from "./shared/Enums";
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


    isNPC: boolean = false;

    isMoving: boolean = false;
    isAttacking: boolean = false;
    isPicking: boolean = false;
    isDamaging: boolean = false;
    isDropping: boolean = false;
    isEating: boolean = false;
    isEmotioning : boolean = false;

    tempLightSwitch: boolean = false;
    currentPickingItem: ServerItem | undefined = undefined;
    //status
    currentFunc: any = undefined;
    hp: number = 3;
    died: boolean = false;
    // camera: Camera = GameManager.camera;
    bag: ServerItem[] = [];

    characterType: characterType;
    constructor(id: string, displayName: string, initialPosition: Vector2, authorization: boolean, characterType: characterType, isthisNpc: boolean) {
        this.characterType = characterType;
        this.isNPC = isthisNpc;
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
        if (this.isAttacking === true || this.isMoving === true
            || this.isPicking === true || this.isDamaging === true ||
            this.died === true || this.isDropping === true || this.isEating === true ||
            this.isEmotioning === true) return false;
        return true;
    }

    setDirectionByPosition(to: Vector2) {
        if (to.x > this.currentPosition.x) {

            this.currentDirection = Direction.East;
        }
        else if (to.x < this.currentPosition.x) {
            this.currentDirection = Direction.West;
        }
        else if (to.y < this.currentPosition.y) {
            this.currentDirection = Direction.North;
        }
        else if (to.y > this.currentPosition.y) {
            this.currentDirection = Direction.South;
        }
        ServerGameManager.serverSocketManager.serverio.emit('player-directionChanged', this.currentDirection, this.id);
    }

    canMoveTo(to: Vector2): boolean {
        if (this.canDoSomething() == false) return false;

        if (ServerGameManager.currentMapInfo.checkOccupiedByVector2(to) === true) return false;
        return true;
    }


    async TryMove(to: Vector2) {

        if (this.canDoSomething() == false) return;
        this.setDirectionByPosition(to);

        // ! Check if to position is occupied by something
        // if (createdMap.checkOccupiedByVector2(to) === true) return;
        if (this.canMoveTo(to) == false) {
            return;
        }

        // * set previous cell empty
        // let previousCell = createdMap.getCellByVector2(this.currentPosition);
        // let nextCell = createdMap.getCellByVector2(to);
        ServerGameManager.currentMapInfo.setCharacterStanding(this.currentPosition, undefined);
        ServerGameManager.currentMapInfo.getCellByVector2(this.currentPosition)!.setStandingCharacter(undefined);
        // ^ set next cell to this character and occupied

        ServerGameManager.currentMapInfo.getCellByVector2(to)!.setStandingCharacter(this);
        ServerGameManager.currentMapInfo.setCharacterStanding(to, this);


        // this.isMoving = true;
        this.currentPosition = to;

        ServerGameManager.serverSocketManager.serverio.emit('player-TryMoveAnimation', to, this.id);
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
        console.log('ATTACK TARGET CELL : ', targetCell);
        console.log('ATTACK TARGET CHARCATER : ', targetCell?.standingCharacter);
        if (targetCell != null) {
            if (targetCell.checkOccupied() == true) {
                if (targetCell.standingCharacter) {



                    if (targetCell.standingCharacter.died == false) {
                        console.log(`damge character : ${targetCell.standingCharacter}`);
                        targetCell.standingCharacter.damage();
                    }

                }
                else(targetCell.hasFirstLayerItem !=null)
                {
                    let item = targetCell.hasFirstLayerItem;
                    if(item)
                    {
                        let itemInfo = ServerGameManager.getItemInfoByItemTypeFromDB(item.itemType);
                        if(itemInfo)
                        {
                            itemInfo.itemType;
                        }
                    }
                }

            }
        }
        await new Promise(resolve => setTimeout(resolve, 500));
        // this.characterSpriteHtmlElement.setAttribute("attack", "false");
        if(targetCell?.hasFirstLayerItem)
        {
            let itemtype = targetCell.hasFirstLayerItem.itemType;
            switch(itemtype)
            {
                case ItemType.lightlamp:
                    targetCell.hasFirstLayerItem.toggleLight();
                    break;

                case ItemType.lightpinklamp:
                    targetCell.hasFirstLayerItem.toggleLight();

                    break;

                case ItemType.lightswitch:
                    ServerGameManager.serverSocketManager.toggleShadow();
                    break;

            }
        }
        this.isAttacking = false;
        // this.characterSpriteHtmlElement.style.setProperty('animation-iteration-count', 'infinite')

    }

    async tryEmotion(){
        if(this.canDoSomething() == false) return;
        this.isEmotioning = true;
        ServerGameManager.serverSocketManager.serverio.emit('player-tryEmotion',this.id);
        await new Promise(resolve => setTimeout(resolve, 3000));
        ServerGameManager.serverSocketManager.serverio.emit('player-offEmotion',this.id);
        this.isEmotioning = false;
    }

    
    async damage() {
        if (this.died == true) return;
        // * emit light on off

        if (this.tempLightSwitch == true) {
            ServerGameManager.serverSocketManager.toggleShadow();

        }
        // ^ damage effect
        this.isDamaging = true;
        // this.characterSpriteHtmlElement.setAttribute('damage', 'true');

        // this.characterSpriteHtmlElement.classList.
        this.hp -= 1;
        ServerGameManager.serverSocketManager.serverio.emit('DamageCharacter', this.id);

        await new Promise(resolve => setTimeout(resolve, 1000));
        // this.characterSpriteHtmlElement.setAttribute('damage', 'false');

        this.isDamaging = false;
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


    // * PICK
    async tryPickItemForward() {
        if (this.canDoSomething() == false) return;
        if (this.currentPickingItem != undefined) return;
        let output: ServerItem | undefined;
        let forwardCell = this.getForwardCell();
        if (forwardCell) {
            let i = forwardCell.hasPickableItem();
            // console.log(i);
            if (i != undefined) {
                this.currentPickingItem = i;
                forwardCell.hasFirstLayerItem = undefined;
                output = i;

            }
        }
        // console.log('output', output);
        if (output == null) {
            console.log('trying to pick fail...')
            return;
        }

        this.isPicking = true;

        ServerGameManager.serverSocketManager.serverio.emit('player-tryPickItemForward', output.position, this.id, output.id);

        await new Promise(resolve => setTimeout(resolve, 500));

        ServerGameManager.serverSocketManager.serverio.emit('remove-item', output.id, output.position);
        ServerGameManager.serverSocketManager.serverio.emit('player-setPickingItemState', this.id, output.itemType);

        this.isPicking = false;

    }
    // * DROP
    async dropItemForward() {
        if (this.canDoSomething() == false) return;
        if (this.currentPickingItem == undefined) return;
        this.isDropping = true;
        let forwardCell = this.getForwardCell();
        if (forwardCell) {
            if (forwardCell.canDropItemHere(this.currentPickingItem)) {
                forwardCell.tryPutItem(this.currentPickingItem);

                ServerGameManager.serverSocketManager.serverio.emit('player-dropItemForward', forwardCell.position, this.id, this.currentPickingItem.itemType);
                await new Promise(resolve => setTimeout(resolve, 400));
                console.log('fowardCell.position:', forwardCell.position);
                ServerGameManager.serverSocketManager.serverio.emit('player-offPickingItemState', this.id);

                ServerGameManager.serverSocketManager.serverio.emit('try-spawn-item', this.currentPickingItem.id, forwardCell.position, this.currentPickingItem.itemType,this.currentPickingItem.isLightStatus);

                this.currentPickingItem = undefined;
            }

        }
        this.isDropping = false;


    }


    async eatForward() {
        if (this.canDoSomething() == false) return;
        this.isEating = true;
        let forwardCell = this.getForwardCell();
        if (forwardCell) {
            if (forwardCell.canEatItem()) {
                let goingToEat = forwardCell.hasFirstLayerItem;
                if (goingToEat) {

                    ServerGameManager.currentItemList = ServerGameManager.currentItemList.filter(i => i.id != goingToEat?.id);
                    forwardCell.hasFirstLayerItem = undefined;
                    console.log('\x1b[33m%s\x1b[0m', 'eat...!!!');
                    ServerGameManager.serverSocketManager.serverio.emit('player-eatItemForward', forwardCell.position, this.id, goingToEat.id);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    ServerGameManager.serverSocketManager.serverio.emit('remove-item', goingToEat.id);
                    this.isEating = false;

                    return;
                }
            }
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.isEating = false;
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
        console.log('!!forwardceell', output)
        return output;
    }


    tryPickupItem() {
        if (this.canDoSomething() == false) return;
        console.log('\x1b[36m%s\x1b[0m', 'trying... picking up item');

        let forwardCell = this.getForwardCell();
        if (forwardCell) {
            let item = forwardCell.hasPickableItem();
            if (item) {

            }
            if (item) {
                this.currentPickingItem = item;
            }
        }
    }

    getRandomCell() : ServerCell | undefined
    {
        let randomNum = Math.floor (( Math.random() * 4 ));
        let output : ServerCell | undefined;
        switch(randomNum)
        {
            case 0:
                output = ServerGameManager.currentMapInfo.getCellByVector2(new Vector2(this.currentPosition.x + 1, this.currentPosition.y));
                break;
            case 1:
                output = ServerGameManager.currentMapInfo.getCellByVector2(new Vector2(this.currentPosition.x - 1, this.currentPosition.y));

                break;
            case 2:
                output = ServerGameManager.currentMapInfo.getCellByVector2(new Vector2(this.currentPosition.x, this.currentPosition.y+1));

                break;
            case 3:
                output = ServerGameManager.currentMapInfo.getCellByVector2(new Vector2(this.currentPosition.x, this.currentPosition.y-1));

                break;
                
        }
   
        return output;
    }

    disconnect() {

    }
}