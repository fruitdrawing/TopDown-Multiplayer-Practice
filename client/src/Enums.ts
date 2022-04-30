import { readFileSync } from 'fs';
export enum characterType {
    male01 = "male01",
    male02 = "male02",
    female01 = "female01",
    female02 = "female02",

}

export enum Direction {
    West,
    North,
    East,
    South
}

export enum ItemType {
    chess = "chess",
    beer = "beer",
    wine = "wine",
    soju = "soju",
    hamburger = "hamburger",
    pizza = "pizza",
    banana = "banana",
    apple = "apple",
    table = "table",
    invisibleWall = "invisibleWall"
}

export enum ItemOccupyType {
    wall,
    firstLayer,
}

// export enum ItemLayer{
//     first,
//     second
// }
export type ItemGeneralType =
    {
        itemType: ItemType,
        pickable: boolean,
        itemOccupyType: ItemOccupyType,
        eatable: boolean,
        src: string
    };

// export class ItemInfo implements Iitem {
//     ss: boolean = false;
//     name : string = "";
// }

// const dddb : ItemInfo[] = [new ItemInfo(),{ss : false,name : ""}];


// interface Iitem{
//     name : string;
//     ss : boolean

// }
export const itemDB: ItemGeneralType[] = [
    {
        itemType: ItemType.chess,
        pickable: true,
        itemOccupyType: ItemOccupyType.firstLayer,
        eatable: false,
        src: "WorldItem-Chess"
    },
    {
        itemType: ItemType.table,
        pickable: true,
        itemOccupyType: ItemOccupyType.firstLayer,
        eatable: false,
        src: "./images/table.png"
    },
    {
        itemType: ItemType.invisibleWall,
        pickable: false,
        itemOccupyType: ItemOccupyType.wall,
        eatable: false,
        src: "./images/female01-128.png"
    },
    {
        itemType: ItemType.beer,
        pickable: true,
        itemOccupyType: ItemOccupyType.firstLayer,
        eatable: true,
        src: "WorldItem-Beer"
    }
];

// console.log(db.find(i => i.itemType == ItemType.table)?.src);

// export type mapData = {
//     name: string,
//     height : number,
//     width : number,
//     collision : boolean[][]
// }
// export const mapDB : mapData = {
//     name : "bar",
//     height : 32,
//     width : 32,
// }
