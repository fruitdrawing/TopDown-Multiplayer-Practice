import { Cell } from "./Cell";
import { Vector2 } from "../../server/Vector2";
import { Direction } from "../../server/shared/Enums";


export class ClientMapInfo {
    darkShadow: HTMLDivElement;
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    cellList: Cell[] = [];
    mapHTML: HTMLDivElement;
    constructor(minX: number, minY: number, maxX: number, maxY: number, mapData: object) {
        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
        this.setCellListByMinMax(mapData);
        this.darkShadow = document.getElementById('darkShadow') as HTMLDivElement;
        this.mapHTML = document.getElementById('map') as HTMLDivElement;
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

    // tryGetItemOnCellByVector2(position: Vector2): ClientItem | undefined {
    //     let foundCell = this.getCellByVector2(position);
    //     if (foundCell != null) {
    //         return foundCell.item;
    //     }
    //     return undefined;
    // }


    getCellByDirectionFrom(position: Vector2, direction: Direction) {

    }
}