import './style.css'
import { Util } from './util';
import { io, Socket } from "socket.io-client";
import sizeof from 'object-sizeof'
import { Vector2 } from "../../server/Vector2";

import { Item } from './Item';
// import { GameManager } from './GameManager';
import { ClientGameManager } from './ClientGameManager';
// if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
//   /* iOS hides Safari address bar */
//   window.addEventListener("load", function () {
//     setTimeout(function () {
//       window.scrollTo(0, 1);
//     }, 1000);
//   });
// }
// const CellDistanceOffset = 80;

// const myCharacter: Character | undefined = undefined;



const gm = new ClientGameManager();






// const debugText: HTMLDivElement = document.getElementById("debugText") as HTMLDivElement;

// parseInt(getComputedStyle(document.documentElement).getPropertyValue('--grid-cell'));
// console.log('pixelSize', pixelSize);
// console.log('girdCellSize', girdCellSize);
// const character: HTMLDivElement = document.querySelector(".character") as HTMLDivElement;
// const character_spritesheet: HTMLDivElement = document.querySelector(".character_spritesheet") as HTMLDivElement;



// type mapConfig = Cell[] | undefined


// class MapInfo {
//   minX: number;
//   minY: number;
//   maxX: number;
//   maxY: number;
//   cellList: Cell[] = [];
//   constructor(minX: number, minY: number, maxX: number, maxY: number, mapData: object) {
//     this.minX = minX;
//     this.minY = minY;
//     this.maxX = maxX;
//     this.maxY = maxY;
//     this.setCellListByMinMax(mapData);
//   }
//   setCellListByMinMax(object: object): void {
//     for (let x = this.minX; x < this.maxX; x++) {
//       for (let y = this.minY; y < this.maxY; y++) {
//         // todo : Get IsOccupied info from mapdata and set

//         let output: Cell = new Cell(new Vector2(x, y));
//         this.cellList.push(output);
//       }
//     }
//   }
//   setOccupiedCell(to: Vector2, boolean: boolean) {
//     let cell = this.getCellByVector2(to);
//     if (cell) {
//       cell.isOccupied = boolean;
//     }
//   }
//   checkOccupiedByVector2(position: Vector2): boolean {
//     let found = this.cellList.find(c => c.position.x === position.x && c.position.y === position.y)
//     console.log('found', found);
//     if (found != undefined) {
//       return found.isOccupied
//     }
//     else {
//       return true;
//     }
//   }
//   getCellByVector2(position: Vector2): Cell | undefined {
//     return this.cellList.find(c => c.position.x === position.x && c.position.y === position.y);
//   }
//   tryGetItemOnCellByVector2(position: Vector2): GameObject | undefined {
//     let foundCell = this.getCellByVector2(position);
//     if (foundCell != null) {
//       return foundCell.hasItem;
//     }
//     return undefined;
//   }
// }




// enum ItemType {
//   chess,
//   chair,
//   coin,
// }
// class GameObject {
//   position: Vector2;
//   imgElement: HTMLDivElement;
//   itemType: ItemType = ItemType.chess;

//   constructor(position: Vector2, itemType: ItemType) {
//     this.position = position;
//     this.imgElement = document.createElement('div') as HTMLDivElement;
//     this.imgElement.classList.add('GameObject');

//     let parentDiv = document.getElementById('map');
//     if (parentDiv) {
//       parentDiv.append(this.imgElement);
//     }

//     let found = createdMap.getCellByVector2(position);
//     if (found) {
//       found.hasItem = this;
//     }

//     // //* Set visual position
//     this.imgElement.style.transform = `translate3d(${position.x * CellDistanceOffset}px,${position.y * CellDistanceOffset}px,0)`;

//   }
//   setImage(src: string) {
//     // this.imgElement.style.backgroundImage = `url("${src}")`;
//   }

//   tryRemoveItemFromWorld(): boolean {
//     let foundCell = createdMap.getCellByVector2(this.position);
//     if (foundCell != null) {
//       foundCell.hasItem = undefined;
//       this.removeImageElementFromWorld();
//       return true;
//     }
//     return false;
//   }

//   private removeImageElementFromWorld() {
//     this.imgElement.remove();
//   }
// }

// class Cell {
//   position: Vector2;
//   htmlElement: HTMLDivElement;
//   isOccupied: boolean = false;
//   hasItem: Item | undefined = undefined;
//   standingCharacter: Character | undefined = undefined;
//   constructor(vector2: Vector2) {
//     this.position = vector2;
//     this.htmlElement = document.createElement("div") as HTMLDivElement;
//     this.htmlElement.classList.add('cell');

//     //* set parent
//     let parentDiv = document.getElementById('map');
//     if (parentDiv) {
//       parentDiv.append(this.htmlElement);
//     }
//     // //* Set visual position
//     this.htmlElement.style.transform = `translate3d(${vector2.x * CellDistanceOffset}px,${vector2.y * CellDistanceOffset}px,0)`;
//     // console.log(this.htmlElement.style.transform)
//     // this.htmlElement.style.transform = `translate3d(${vector2.x},${vector2.y},0)`;
//     // this.htmlElement.classList.add('cell');
//   }
//   setStandingCharacter(character: Character | undefined) {
//     this.standingCharacter = character;
//   }
// }


// * staring point
// let x = 50;
// let y = 50;





// enum CharacterBehaviour {
//   NPC
// }


//   // TODO
//   tryAddItemToInventory(item: GameObject) {
//     if (item.tryRemoveItemFromWorld() == true) {
//       this.bag.push(item);
//     }

//   }
//   getItemInventory() {
//     return this.bag;
//   }
//   useItem() {

//   }

// }


// enum InventoryUIState {
//   Idle,
//   ShowingInventory
// }
// // TODO 
// class InventoryManager {
//   inventoryUIOpenButton: HTMLButtonElement;
//   inventoryWindow: HTMLDivElement;
//   inventoryCloseButton: HTMLButtonElement;

//   inventoryParentOfItemList: HTMLDivElement;

//   currentState: InventoryUIState = InventoryUIState.Idle;
//   constructor() {
//     this.inventoryUIOpenButton = document.getElementById('inventoryUIOpenButton') as HTMLButtonElement;
//     this.inventoryWindow = document.getElementById('inventoryWindow') as HTMLDivElement;
//     this.inventoryCloseButton = document.getElementById('inventoryCloseButton') as HTMLButtonElement;
//     this.inventoryParentOfItemList = document.getElementById('inventoryParentOfItemList') as HTMLDivElement;

//     this.inventoryUIOpenButton.onclick = ((ev: MouseEvent) => {

//     });

//   }
//   doLogicByState() {
//     switch (this.currentState) {
//       case InventoryUIState.Idle:
//         if (myCharacter != null) {
//           this.ShowInventory(myCharacter.bag)

//         }
//         break;
//     }
//   }

//   ShowInventory(bag: GameObject[]) {
//     this.inventoryWindow.style.display = "contents";
//   }
//   Hide() {
//     this.inventoryWindow.style.display = "none";
//   }

//   private refreshInventoryItemList(bag: GameObject[]) {
//     Util.deleteAllChildrenHTMLElement(this.inventoryWindow);
//   }
// }


//! TEMP CREATE

// const createdMap = new MapInfo(0, 0, 10, 10, {});
// console.log('createdMap', createdMap);

// new Character("player", new Vector2(2, 2), true);
// const npcCharacter = new Character("npc", new Vector2(0, 1), false);


// const chessGameObject = new GameObject(new Vector2(2, 3), ItemType.chess)
// chessGameObject.setImage("./images/chess512.png");

// const map = document.getElementById('map') as HTMLDivElement;



// * UPDATE GAME LOOP




// console.log('number byte size :Int16Array(2)', sizeof(ItemType.chair));
// console.log(ItemType.chair)
// console.log(typeof (ItemType.chess));
