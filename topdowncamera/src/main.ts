import './style.css'

// if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i)) {
//   /* iOS hides Safari address bar */
//   window.addEventListener("load", function () {
//     setTimeout(function () {
//       window.scrollTo(0, 1);
//     }, 1000);
//   });
// }

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

const debugText: HTMLDivElement = document.getElementById("debugText") as HTMLDivElement;
console.log(debugText);
const pixelSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pixel-size'));
const girdCellSize = 120;
// parseInt(getComputedStyle(document.documentElement).getPropertyValue('--grid-cell'));
console.log('pixelSize', pixelSize);
console.log('girdCellSize', girdCellSize);
const character: HTMLDivElement = document.querySelector(".character") as HTMLDivElement;
const character_spritesheet: HTMLDivElement = document.querySelector(".character_spritesheet") as HTMLDivElement;



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
}



class Vector2 {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
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
}

class Cell {
  position: Vector2;
  htmlElement: HTMLDivElement;
  isOccupied: boolean = false;
  hasItem: GameObject | undefined = undefined;
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
}

let leftPressed: boolean = false;
let rightPressed: boolean = false;
let upPressed: boolean = false;
let downPressed: boolean = false;

// * staring point
let x = 50;
let y = 50;


const CellDistanceOffset = 80;



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
    this.Move(initialPosition);

  }
  async Move(to: Vector2) {
    // * Check if to position is occupied by something

    if (createdMap.checkOccupiedByVector2(to) === true) return;


    createdMap.setOccupiedCell(this.currentPosition, false);

    this.isMoving = true;
    this.currentPosition = to;

    //* 
    this.characterHtmlElement.style.transform =
      `translate3d(${to.x * CellDistanceOffset}px,${to.y * CellDistanceOffset}px,0px`;
    await new Promise(resolve => setTimeout(resolve, 400));
    this.isMoving = false;
    createdMap.setOccupiedCell(to, true);
    // console.log('reatedMap.getCellByVector2(to))', createdMap.getCellByVector2(to));

  }
}



//! TEMP CREATE

const createdMap = new MapInfo(0, 0, 10, 10, {});
console.log('createdMap', createdMap);
const cell = new Cell(new Vector2(1, 1));

const playerCharacter = new Character("player", new Vector2(2, 2), true);
const npcCharacter = new Character("npc", new Vector2(0, 1), false);



const chessGameObject = new GameObject(new Vector2(2, 3), ItemType.chess)
chessGameObject.setImage("./images/chess512.png");

const map = document.getElementById('map') as HTMLDivElement;

let cameraOffsetX = window.innerWidth / 2 - (CellDistanceOffset / 2);
let cameraOffsetY = window.innerHeight / 3;

setCameraPosition(-playerCharacter.currentPosition.x, -playerCharacter.currentPosition.y)


function setCameraPosition(x: number, y: number) {
  console.log('playerCharacter.currentPosition', playerCharacter.currentPosition);
  // map.style.transform = `translate3d(${x * CellDistanceOffset + cameraOffsetX}px,${y * CellDistanceOffset + cameraOffsetY}px,0)`;
  map.style.transform = `translate3d(${x * CellDistanceOffset + cameraOffsetX}px,${y * CellDistanceOffset + cameraOffsetY}px,0)`;
}

function checkKeyInput() {

  if (leftPressed) {
    if (playerCharacter.isMoving == false) {
      playerCharacter.characterSpriteHtmlElement.setAttribute("facing", "left");
      playerCharacter.Move(new Vector2(playerCharacter.currentPosition.x - 1, playerCharacter.currentPosition.y));
      // map.style.transform = `translate3d(${-x * CellDistance}px,${-y * CellDistance}px,0px)`;
      setCameraPosition(-playerCharacter.currentPosition.x, -playerCharacter.currentPosition.y);

      // map.style.transform = `translate3d(${-playerCharacter.currentPosition.x * CellDistance}px,${-playerCharacter.currentPosition.y * CellDistance}px,0)`;
    }

  }
  else if (upPressed) {
    if (playerCharacter.isMoving == false) {
      playerCharacter.characterSpriteHtmlElement.setAttribute("facing", "up");
      playerCharacter.Move(new Vector2(playerCharacter.currentPosition.x, playerCharacter.currentPosition.y - 1));
      setCameraPosition(-playerCharacter.currentPosition.x, -playerCharacter.currentPosition.y);

    }
  }
  else if (rightPressed) {
    if (playerCharacter.isMoving == false) {
      playerCharacter.characterSpriteHtmlElement.setAttribute("facing", "right");
      playerCharacter.Move(new Vector2(playerCharacter.currentPosition.x + 1, playerCharacter.currentPosition.y));
      setCameraPosition(-playerCharacter.currentPosition.x, -playerCharacter.currentPosition.y);

    }
  }
  else if (downPressed) {
    if (playerCharacter.isMoving == false) {
      playerCharacter.characterSpriteHtmlElement.setAttribute("facing", "down");
      playerCharacter.Move(new Vector2(playerCharacter.currentPosition.x, playerCharacter.currentPosition.y + 1));
      setCameraPosition(-playerCharacter.currentPosition.x, -playerCharacter.currentPosition.y);

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

    }
  }
});

bottomui.ontouchend = ((ev: TouchEvent) => {
  upPressed = false;
  leftPressed = false;
  rightPressed = false;
  downPressed = false;
});


document.addEventListener("click", (e) => {
})

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
});

document.addEventListener("keydown", (e) => {
  if (e.key === 'Enter') {
    console.log(createdMap);
  }
});





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


function resizeCameraOffset() {
  map.setAttribute("transition", "0.0s linear");

  console.log('resized width', window.innerWidth);
  cameraOffsetX = window.innerWidth / 2 - (girdCellSize / 2);
  console.log('resized height', window.innerHeight);
  cameraOffsetY = window.innerHeight / 3;
  setCameraPosition(-playerCharacter.currentPosition.x, -playerCharacter.currentPosition.y);
  map.setAttribute("transition", "0.4s linear");
}
window.onresize = resizeCameraOffset;