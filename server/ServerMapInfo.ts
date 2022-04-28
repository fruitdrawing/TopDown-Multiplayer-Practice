
import { ServerCell } from "./ServerCell";
import { ServerCharacter } from "./ServerCharacter";
import { ServerItem } from "./ServerItem";
import { Vector2 } from "./Vector2";
// import { Item } from "./Item";
// import { Vector2 } from "./TopDown/Vector2";

export class ServerMapInfo {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    cellList: ServerCell[] = [];
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

                let output: ServerCell = new ServerCell(new Vector2(x, y));
                this.cellList.push(output);
            }
        }
    }
    setOccupiedCell(to: Vector2, boolean: boolean) {
        let cell = this.getCellByVector2(to);
        if (cell) {
            cell.setOccupied(boolean);
        }
    }
    setCharacterStanding(to: Vector2, character: ServerCharacter | undefined) {
        let cell = this.getCellByVector2(to);
        if (cell) {
            cell.setStandingCharacter(character);
        }
    }

    checkOccupiedByVector2(position: Vector2): boolean {
        let found = this.cellList.find(c => c.position.x === position.x && c.position.y === position.y)
        // console.log('found', found);
        if (found != undefined) {
            return found.checkOccupied()
        }
        else {
            return true;
        }
    }
    getCellByVector2(position: Vector2): ServerCell | undefined {
        return this.cellList.find(c => c.position.x === position.x && c.position.y === position.y);
    }


    tryGetItemOnCellByVector2(position: Vector2): ServerItem | undefined {
        let foundCell = this.getCellByVector2(position);
        if (foundCell != null) {
            return foundCell.hasFirstLayerItem;
        }
        return undefined;
    }
}