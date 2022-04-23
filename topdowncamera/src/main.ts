import './style.css'
import { Util } from './util';
import { io, Socket } from "socket.io-client";
import sizeof from 'object-sizeof'
import { Vector2 } from './TopDown/Vector2';
// if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
//   /* iOS hides Safari address bar */
//   window.addEventListener("load", function () {
//     setTimeout(function () {
//       window.scrollTo(0, 1);
//     }, 1000);
//   });
// }
const CellDistanceOffset = 80;

const clientIO: Socket = io("http://localhost:3001");

clientIO.emit('test', 'hi');

const testarray: number[][] = [];
const testarraytwo: number[] = [];

const nn: number = 0;
const na: Uint16Array = new Uint16Array(2);
const booool: boolean = false;
console.log('number byte size :nn(number 1)', sizeof(nn))
console.log('number byte size :1', sizeof(1))
console.log('number byte size :"1"', sizeof("1"))
console.log('number byte size :undefined', sizeof(undefined))
console.log('number byte size :Uint16Array(2)', sizeof(na));
console.log('number byte size :testarray', sizeof(testarray));




// * prevent double tap zoom
var lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  var now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);

// ! prevent pin zoom
// document.addEventListener('touchmove', function (event: TouchEvent) {
//   if (event.scale !== 1) { event.preventDefault(); }
// }, false);
(function () {

  var browser = window,
    doc = browser.document;

  // If there's a hash, or addEventListener is undefined, stop here
  if (!location.hash || !browser.addEventListener) {

    //set to 1
    window.scrollTo(0, 1);
    var scrollTop = 1,

      //reset to 0 if needed
      checkWindowBody = setInterval(function () {
        if (doc.body) {
          clearInterval(checkWindowBody);
          scrollTop = "scrollTop" in doc.body ? doc.body.scrollTop : 1;
          browser.scrollTo(0, scrollTop === 1 ? 0 : 1);
        }
      }, 15);

    if (browser.addEventListener) {
      browser.addEventListener("load", function () {
        setTimeout(function () {
          //reset to hide address
          browser.scrollTo(0, scrollTop === 1 ? 0 : 1);
        }, 0);
      }, false);
    }
  }

})();




// * Camera Related

class Camera {
  offset: number = 80;
  cameraOffsetX = window.innerWidth / 2 - (this.offset / 2);
  cameraOffsetY = window.innerHeight / 3;
  map: HTMLDivElement = document.getElementById('map') as HTMLDivElement;
  setCameraPosition(x: number, y: number) {
    // map.style.transform = `translate3d(${x * CellDistanceOffset + cameraOffsetX}px,${y * CellDistanceOffset + cameraOffsetY}px,0)`;
    this.map.style.transform = `translate3d(${x * this.offset + this.cameraOffsetX}px,${y * this.offset + this.cameraOffsetY}px,0)`;
  }
  resizeCameraOffset() {
    this.map.setAttribute("transition", "0.0s linear");

    console.log('resized width', window.innerWidth);
    this.cameraOffsetX = window.innerWidth / 2 - (girdCellSize / 2);
    console.log('resized height', window.innerHeight);
    this.cameraOffsetY = window.innerHeight / 3;
    this.setCameraPosition(-playerCharacter.currentPosition.x, -playerCharacter.currentPosition.y);
    this.map.setAttribute("transition", "0.4s linear");
  }

}
const mainCamera = new Camera();


const debugText: HTMLDivElement = document.getElementById("debugText") as HTMLDivElement;
const pixelSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-size'));
const girdCellSize = 120;
// parseInt(getComputedStyle(document.documentElement).getPropertyValue('--grid-cell'));
console.log('pixelSize', pixelSize);
console.log('girdCellSize', girdCellSize);
// const character: HTMLDivElement = document.querySelector(".character") as HTMLDivElement;
// const character_spritesheet: HTMLDivElement = document.querySelector(".character_spritesheet") as HTMLDivElement;



type mapConfig = Cell[] | undefined


class MapInfo {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  cellList: Cell[] = [];
  constructor(minX: number, minY: number, maxX: number, maxY: number, mapData: object) {
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
    this.setCellListByMinMax(mapData);
  }
  setCellListByMinMax(object: object): void {
    for (let x = this.minX; x < this.maxX; x++) {
      for (let y = this.minY; y < this.maxY; y++) {
        // todo : Get IsOccupied info from mapdata and set

        let output: Cell = new Cell(new Vector2(x, y));
        this.cellList.push(output);
      }
    }
  }
  setOccupiedCell(to: Vector2, boolean: boolean) {
    let cell = this.getCellByVector2(to);
    if (cell) {
      cell.isOccupied = boolean;
    }
  }
  checkOccupiedByVector2(position: Vector2): boolean {
    let found = this.cellList.find(c => c.position.x === position.x && c.position.y === position.y)
    console.log('found', found);
    if (found != undefined) {
      return found.isOccupied
    }
    else {
      return true;
    }
  }
  getCellByVector2(position: Vector2): Cell | undefined {
    return this.cellList.find(c => c.position.x === position.x && c.position.y === position.y);
  }
  tryGetItemOnCellByVector2(position: Vector2): GameObject | undefined {
    let foundCell = this.getCellByVector2(position);
    if (foundCell != null) {
      return foundCell.hasItem;
    }
    return undefined;
  }
}




enum ItemType {
  chess,
  chair,
  coin,
}
class GameObject {
  position: Vector2;
  imgElement: HTMLDivElement;
  itemType: ItemType = ItemType.chess;

  constructor(position: Vector2, itemType: ItemType) {
    this.position = position;
    this.imgElement = document.createElement('div') as HTMLDivElement;
    this.imgElement.classList.add('GameObject');

    let parentDiv = document.getElementById('map');
    if (parentDiv) {
      parentDiv.append(this.imgElement);
    }

    let found = createdMap.getCellByVector2(position);
    if (found) {
      found.hasItem = this;
    }

    // //* Set visual position
    this.imgElement.style.transform = `translate3d(${position.x * CellDistanceOffset}px,${position.y * CellDistanceOffset}px,0)`;

  }
  setImage(src: string) {
    // this.imgElement.style.backgroundImage = `url("${src}")`;
  }

  tryRemoveItemFromWorld(): boolean {
    let foundCell = createdMap.getCellByVector2(this.position);
    if (foundCell != null) {
      foundCell.hasItem = undefined;
      this.removeImageElementFromWorld();
      return true;
    }
    return false;
  }

  private removeImageElementFromWorld() {
    this.imgElement.remove();
  }
}

class Cell {
  position: Vector2;
  htmlElement: HTMLDivElement;
  isOccupied: boolean = false;
  hasItem: GameObject | undefined = undefined;
  standingCharacter: Character | undefined = undefined;
  constructor(vector2: Vector2) {
    this.position = vector2;
    this.htmlElement = document.createElement("div") as HTMLDivElement;
    this.htmlElement.classList.add('cell');

    //* set parent
    let parentDiv = document.getElementById('map');
    if (parentDiv) {
      parentDiv.append(this.htmlElement);
    }
    // //* Set visual position
    this.htmlElement.style.transform = `translate3d(${vector2.x * CellDistanceOffset}px,${vector2.y * CellDistanceOffset}px,0)`;
    // console.log(this.htmlElement.style.transform)
    // this.htmlElement.style.transform = `translate3d(${vector2.x},${vector2.y},0)`;
    // this.htmlElement.classList.add('cell');
  }
  setStandingCharacter(character: Character | undefined) {
    this.standingCharacter = character;
  }
}

let leftPressed: boolean = false;
let rightPressed: boolean = false;
let upPressed: boolean = false;
let downPressed: boolean = false;
let attackPressed: boolean = false;

// * staring point
let x = 50;
let y = 50;





enum Direction {
  West,
  North,
  East,
  South
}

enum CharacterBehaviour {
  NPC
}


class Character {
  id: string;
  isClient: boolean;
  characterHtmlElement: HTMLDivElement;
  characterSpriteHtmlElement: HTMLDivElement;
  currentPosition: Vector2 = new Vector2(0, 0);
  currentDirection: Direction = Direction.South;
  isMoving: boolean = false;
  isAttacking: boolean = false;
  //status
  hp: number = 3;
  died: boolean = false;
  camera: Camera = mainCamera;
  bag: GameObject[] = [];
  constructor(id: string, initialPosition: Vector2, isClient: boolean) {
    // if(createdMap.checkOccupiedByVector2(initialPosition)) return;
    this.id = id;
    this.isClient = isClient;
    this.characterHtmlElement = document.createElement('div');
    this.characterHtmlElement.classList.add('character');

    this.characterSpriteHtmlElement = document.createElement('div');
    this.characterSpriteHtmlElement.classList.add('character_spritesheet');
    this.characterHtmlElement.append(this.characterSpriteHtmlElement);
    document.getElementById('map')?.append(this.characterHtmlElement);
    this.TryMove(initialPosition);

  }

  private canMoveTo(to: Vector2): boolean {
    if (this.isAttacking === true) return false;

    // set direction even movement fails.

    if (to.x > this.currentPosition.x) {

      this.characterSpriteHtmlElement.setAttribute("facing", "right");

      this.currentDirection = Direction.East;
    }
    else if (to.x < this.currentPosition.x) {
      this.characterSpriteHtmlElement.setAttribute("facing", "left");
      this.currentDirection = Direction.West;
    }
    else if (to.y < this.currentPosition.y) {
      this.characterSpriteHtmlElement.setAttribute("facing", "up");
      this.currentDirection = Direction.North;
    }
    else if (to.y > this.currentPosition.y) {
      this.characterSpriteHtmlElement.setAttribute("facing", "down");
      this.currentDirection = Direction.South;
    }
    if (this.isMoving === true) return false;
    if (createdMap.checkOccupiedByVector2(to) === true) return false;
    return true;
  }
  async TryMove(to: Vector2) {


    // ! Check if to position is occupied by something
    // if (createdMap.checkOccupiedByVector2(to) === true) return;
    if (this.canMoveTo(to) == false) return;

    // * set previous cell empty
    // let previousCell = createdMap.getCellByVector2(this.currentPosition);
    // let nextCell = createdMap.getCellByVector2(to);
    createdMap.setOccupiedCell(this.currentPosition, false);
    createdMap.getCellByVector2(this.currentPosition)!.setStandingCharacter(undefined);
    // ^ set next cell to this character and occupied

    createdMap.getCellByVector2(to)!.setStandingCharacter(this);
    createdMap.setOccupiedCell(to, true);

    this.isMoving = true;
    this.currentPosition = to;
    //^ Camera
    // setCameraPosition(-to.x, -to.y);
    if (this.camera != null)
      this.camera.setCameraPosition(-to.x, -to.y);

    //* animation
    this.characterHtmlElement.style.transform =
      `translate3d(${to.x * CellDistanceOffset}px,${to.y * CellDistanceOffset}px,0px`;
    await new Promise(resolve => setTimeout(resolve, 400));

    //* item check and pick up
    let item = createdMap.tryGetItemOnCellByVector2(to);

    if (item != null) {
      this.tryAddItemToInventory(item);
    }
    this.isMoving = false;
    // console.log('reatedMap.getCellByVector2(to))', createdMap.getCellByVector2(to));

  }

  async tryAttack() {
    if (this.isAttacking == true) return;
    this.isAttacking = true;


    let targetCell = this.getForwardCell();
    this.characterSpriteHtmlElement.classList.remove('character_spritesheet');
    void this.characterSpriteHtmlElement.offsetWidth;
    this.characterSpriteHtmlElement.classList.add('character_spritesheet');

    this.characterSpriteHtmlElement.setAttribute("attack", "true");

    await new Promise(resolve => setTimeout(resolve, 200));

    if (targetCell != null) {
      if (targetCell.isOccupied == true) {
        if (targetCell.standingCharacter?.died == false)
          targetCell.standingCharacter?.damage();
      }
    }
    await new Promise(resolve => setTimeout(resolve, 500));
    this.characterSpriteHtmlElement.setAttribute("attack", "false");
    this.isAttacking = false;
    this.characterSpriteHtmlElement.style.setProperty('animation-iteration-count', 'infinite')

  }

  async attackAnimation() {

  }

  async damage() {
    if (this.died == true) return;
    // ^ damage effect
    this.characterSpriteHtmlElement.setAttribute('damage', 'true');

    // this.characterSpriteHtmlElement.classList.
    this.hp -= 1;
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.characterSpriteHtmlElement.setAttribute('damage', 'false');

    console.log('damaged', this);
    if (this.hp == 0) {
      // stun for 3 seconds
      this.die();

    }
  }

  async die() {
    this.characterSpriteHtmlElement.setAttribute('died', 'true');

    // this.characterHtmlElement.remove();
    this.died = true;
    await new Promise(resolve => setTimeout(resolve, 5000));

    this.died = false;
    this.hp = 3;
    this.characterSpriteHtmlElement.setAttribute('died', 'false');

  }

  getForwardCell(): Cell | undefined {
    let output;
    switch (this.currentDirection) {
      case Direction.East:
        output = createdMap.getCellByVector2(new Vector2(this.currentPosition.x + 1, this.currentPosition.y));
        break;
      case Direction.North:
        output = createdMap.getCellByVector2(new Vector2(this.currentPosition.x, this.currentPosition.y - 1));

        break;
      case Direction.South:
        output = createdMap.getCellByVector2(new Vector2(this.currentPosition.x, this.currentPosition.y + 1));

        break;
      case Direction.West:
        output = createdMap.getCellByVector2(new Vector2(this.currentPosition.x - 1, this.currentPosition.y));
        break;
      default:
        output = undefined;
        break;

    }
    return output;
  }


  // TODO
  tryAddItemToInventory(item: GameObject) {
    if (item.tryRemoveItemFromWorld() == true) {
      this.bag.push(item);
    }

  }
  getItemInventory() {
    return this.bag;
  }
  useItem() {

  }

}


enum InventoryUIState {
  Idle,
  ShowingInventory
}
// TODO 
class InventoryManager {
  inventoryUIOpenButton: HTMLButtonElement;
  inventoryWindow: HTMLDivElement;
  inventoryCloseButton: HTMLButtonElement;

  inventoryParentOfItemList: HTMLDivElement;

  currentState: InventoryUIState = InventoryUIState.Idle;
  constructor() {
    this.inventoryUIOpenButton = document.getElementById('inventoryUIOpenButton') as HTMLButtonElement;
    this.inventoryWindow = document.getElementById('inventoryWindow') as HTMLDivElement;
    this.inventoryCloseButton = document.getElementById('inventoryCloseButton') as HTMLButtonElement;
    this.inventoryParentOfItemList = document.getElementById('inventoryParentOfItemList') as HTMLDivElement;

    this.inventoryUIOpenButton.onclick = ((ev: MouseEvent) => {

    });

  }
  doLogicByState() {
    switch (this.currentState) {
      case InventoryUIState.Idle:
        this.ShowInventory(playerCharacter.bag)
        break;
    }
  }

  ShowInventory(bag: GameObject[]) {
    this.inventoryWindow.style.display = "contents";
  }
  Hide() {
    this.inventoryWindow.style.display = "none";
  }

  private refreshInventoryItemList(bag: GameObject[]) {
    Util.deleteAllChildrenHTMLElement(this.inventoryWindow);
  }
}


//! TEMP CREATE

const createdMap = new MapInfo(0, 0, 10, 10, {});
console.log('createdMap', createdMap);

const playerCharacter = new Character("player", new Vector2(2, 2), true);
const npcCharacter = new Character("npc", new Vector2(0, 1), false);


const chessGameObject = new GameObject(new Vector2(2, 3), ItemType.chess)
chessGameObject.setImage("./images/chess512.png");




const map = document.getElementById('map') as HTMLDivElement;




// * Input Related

function checkKeyInput() {

  if (leftPressed) {
    if (playerCharacter.isMoving == false) {
      playerCharacter.TryMove(new Vector2(playerCharacter.currentPosition.x - 1, playerCharacter.currentPosition.y));
      // map.style.transform = `translate3d(${-x * CellDistance}px,${-y * CellDistance}px,0px)`;

      // map.style.transform = `translate3d(${-playerCharacter.currentPosition.x * CellDistance}px,${-playerCharacter.currentPosition.y * CellDistance}px,0)`;
    }

  }
  else if (upPressed) {
    if (playerCharacter.isMoving == false) {
      playerCharacter.TryMove(new Vector2(playerCharacter.currentPosition.x, playerCharacter.currentPosition.y - 1));
      // mainCamera.setCameraPosition(-playerCharacter.currentPosition.x, -playerCharacter.currentPosition.y);

    }
  }
  else if (rightPressed) {
    if (playerCharacter.isMoving == false) {
      playerCharacter.TryMove(new Vector2(playerCharacter.currentPosition.x + 1, playerCharacter.currentPosition.y));
      // mainCamera.setCameraPosition(-playerCharacter.currentPosition.x, -playerCharacter.currentPosition.y);

    }
  }
  else if (downPressed) {
    if (playerCharacter.isMoving == false) {
      playerCharacter.TryMove(new Vector2(playerCharacter.currentPosition.x, playerCharacter.currentPosition.y + 1));
      // mainCamera.setCameraPosition(-playerCharacter.currentPosition.x, -playerCharacter.currentPosition.y);

    }
  }

  else if (attackPressed) {
    if (playerCharacter.isMoving == false) {
      playerCharacter.tryAttack();

    }
  }
}




document.addEventListener("keydown", (e) => {
  if (e.keyCode == 37) {
    leftPressed = true;
  }
  if (e.keyCode == 39) {
    rightPressed = true;
  }
  if (e.keyCode == 38) {
    upPressed = true;
  }
  if (e.keyCode == 40) {
    downPressed = true;
  }
  if (e.key === 'a') {
    console.log("ATTTACCk");
    attackPressed = true;
  }
});


let bottomui: HTMLDivElement = document.getElementById("bottomUI") as HTMLDivElement;

bottomui.ontouchstart = ((ev: TouchEvent) => {
  let target: HTMLButtonElement = ev.target as HTMLButtonElement;
  if (target) {
    let clickedDpadId: string | null = target.getAttribute('id');
    switch (clickedDpadId) {
      case "dpadUp":
        upPressed = true;
        break;
      case "dpadLeft":
        leftPressed = true;

        break;
      case "dpadRight":
        rightPressed = true;
        break;
      case "dpadDown":
        downPressed = true;
        break;
      case "attackButton":
        attackPressed = true;
        break;

    }
  }
});

bottomui.ontouchend = ((ev: TouchEvent) => {
  upPressed = false;
  leftPressed = false;
  rightPressed = false;
  downPressed = false;
  attackPressed = false;
});



document.addEventListener("keyup", (e) => {
  if (e.keyCode == 37) {
    leftPressed = false;
  }
  if (e.keyCode == 39) {
    rightPressed = false;
  }
  if (e.keyCode == 38) {
    upPressed = false;
  }
  if (e.keyCode == 40) {
    downPressed = false;
  }
  if (e.key === 'a') {
    attackPressed = false;
  }
  if (e.key === 't') {
    clientIO.emit('player-spawn');
  }

});

document.addEventListener("keydown", (e) => {
  if (e.key === 'Enter') {
    console.log(createdMap);
  }
});




// * UPDATE GAME LOOP

const update = () => {
  checkKeyInput();

  if (playerCharacter != null) {
    if (debugText != null) {
      debugText.innerText = `${playerCharacter.currentPosition.x},${playerCharacter.currentPosition.y}`;
    }
  }
  window.requestAnimationFrame(() => {
    update();
  })
}
update(); //kick off the first step!


// let cameraOffsetX = window.innerWidth / 2 - (CellDistanceOffset / 2);
// let cameraOffsetY = window.innerHeight / 3;

// setCameraPosition(-playerCharacter.currentPosition.x, -playerCharacter.currentPosition.y)


// function setCameraPosition(x: number, y: number) {
//   console.log('playerCharacter.currentPosition', playerCharacter.currentPosition);
//   // map.style.transform = `translate3d(${x * CellDistanceOffset + cameraOffsetX}px,${y * CellDistanceOffset + cameraOffsetY}px,0)`;
//   map.style.transform = `translate3d(${x * CellDistanceOffset + cameraOffsetX}px,${y * CellDistanceOffset + cameraOffsetY}px,0)`;
// }


// function resizeCameraOffset() {
//   map.setAttribute("transition", "0.0s linear");

//   console.log('resized width', window.innerWidth);
//   cameraOffsetX = window.innerWidth / 2 - (girdCellSize / 2);
//   console.log('resized height', window.innerHeight);
//   cameraOffsetY = window.innerHeight / 3;
//   setCameraPosition(-playerCharacter.currentPosition.x, -playerCharacter.currentPosition.y);
//   map.setAttribute("transition", "0.4s linear");
// }

window.onresize = mainCamera.resizeCameraOffset;

// console.log('number byte size :Int16Array(2)', sizeof(ItemType.chair));
// console.log(ItemType.chair)
// console.log(typeof (ItemType.chess));

(setTimeout(() => {
  clientIO.emit('player-move', new Vector2(1, 2));
}, 1000));

clientIO.on('player-move', (data) => {
  playerCharacter.TryMove(data);
});

clientIO.on('player-spawn', (data: Vector2) => {
  new Character(clientIO.id, data, false);
});