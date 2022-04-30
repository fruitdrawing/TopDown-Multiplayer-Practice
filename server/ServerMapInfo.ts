
import { ServerCell } from "./ServerCell";
import { ServerCharacter } from "./ServerCharacter";
import { ServerItem } from "./ServerItem";
import { Vector2 } from "./Vector2";
import { readFileSync } from 'fs';
// import { Item } from "./Item";
// import { Vector2 } from "./TopDown/Vector2";



const csv = readFileSync("./client/src/collision.csv", 'utf-8');

function csvToArray(csv: string) {
    let rows = csv.split("\n");

    return rows.map(function (row) {
        return row.split(",");
    });
};

const resultMapDataCollisiton = csvToArray(csv);
console.log(resultMapDataCollisiton);

export class ServerMapInfo {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    cellList: ServerCell[] = [];


    csv: string
    collision2darray;


    constructor(minX: number, minY: number, maxX: number, maxY: number, mapData: object) {

        this.csv = readFileSync("./client/src/collision.csv", 'utf-8');
        this.collision2darray = this.csvToArray(csv)

        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
        this.setCellListByMinMax(mapData);
    }

    csvToArray(csv: string) {
        let rows = csv.split("\n");

        return rows.map(function (row) {
            return row.split(",");
        });
    };
    
    setCellListByMinMax(object: object): void {
        for (let x = this.minX; x < this.maxX; x++) {
            for (let y = this.minY; y < this.maxY; y++) {
                // todo : Get IsOccupied info from mapdata and set
                let b: boolean = false;
                if (this.collision2darray[y][x] == "0") {
                    b = true;
                }
                else {
                    b = false;
                }
                let output: ServerCell = new ServerCell(new Vector2(x, y), b);
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