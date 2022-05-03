import {readFileSync} from "fs";
import {resolve} from 'path'
export class MapInfoReader {

    filepath: string = resolve(__dirname, "../src/collision.csv")
    csv: string;
    collision2darray;
    constructor() {
        console.log(this.filepath)
        this.csv = readFileSync(this.filepath, 'utf-8');
        this.collision2darray = this.csvToArray(this.csv)

    }

    csvToArray(csv: string) {
        let rows = csv.split("\n");

        return rows.map(function (row) {
            return row.split(",");
        });
    };

}
