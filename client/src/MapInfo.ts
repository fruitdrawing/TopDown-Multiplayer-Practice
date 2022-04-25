import { Cell } from "./Cell";
import { Item } from "./Item";
import { Vector2 } from "../../server/Vector2";


export class MapInfo {

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
    tryGetItemOnCellByVector2(position: Vector2): Item | undefined {
        let foundCell = this.getCellByVector2(position);
        if (foundCell != null) {
            return foundCell.hasItem;
        }
        return undefined;
    }
}