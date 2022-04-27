

export enum Direction {
    West,
    North,
    East,
    South

}



export enum ItemType {
    chess,
    beer,
    wine,
    soju,
    hamburger,
    pizza,
    banana,
    apple,
    table,
    invisibleWall

}

export enum ItemOccupyType {
    wall,
    firstLayer,
    none
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
const db: ItemGeneralType[] = [
    {
        itemType: ItemType.chess,
        pickable: false,
        itemOccupyType: ItemOccupyType.none,
        eatable: false,
        src: "./images/chess512.png"
    },
    {
        itemType: ItemType.table,
        pickable: false,
        itemOccupyType: ItemOccupyType.firstLayer,
        eatable: false,
        src: "asda"
    },
    {
        itemType: ItemType.invisibleWall,
        pickable: false,
        itemOccupyType: ItemOccupyType.wall,
        eatable: false,
        src: "./images/female01-128.png"
    }
];

console.log(db.find(i => i.itemType == ItemType.table)?.src);