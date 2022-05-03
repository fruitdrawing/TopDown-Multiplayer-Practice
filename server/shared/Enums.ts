import { Interact, ToggleSwitch, DoNothing } from '../interaction'

export enum characterType {
    male01 = "male01",
    male02 = "male02",
    female01 = "female01",
    female02 = "female02",
    skeleton = "skeleton"

}

export enum Direction {
    West,
    North,
    East,
    South
}

export enum ItemType {
    beer = "beer",
    brown = "brown",
    donut = "donut",
    gogigogi = "gogigogi",
    hamburger = "hamburger",
    hotdog = "hotdog",
    icecream = "icecream",
    mexican = "mexican",
    pizza = "pizza",
    potato = "potato",
    rice = "rice",
    sandwich = "sandwich",
    waffle = "waffle",
    bread = "bread",
    lightlamp = "lightlamp",
    lightswitch = "lightswitch",
    lightpinklamp = "lightpinklamp"
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
        itemType: ItemType.brown,
        pickable: true,
        itemOccupyType: ItemOccupyType.firstLayer,
        eatable: true,
        src: "WorldItem-Food-Brown",

    },
    {
        itemType: ItemType.bread,
        pickable: true,
        itemOccupyType: ItemOccupyType.wall,
        eatable: true,
        src: "WorldItem-Food-Bread",

    },
    {
        itemType: ItemType.donut,
        pickable: true,
        itemOccupyType: ItemOccupyType.firstLayer,
        eatable: true,
        src: "WorldItem-Food-Donut",

    },
    {
        itemType: ItemType.gogigogi,
        pickable: true,
        itemOccupyType: ItemOccupyType.firstLayer,
        eatable: true,
        src: "WorldItem-Food-Gogigogi",
    },
    {
        itemType: ItemType.hamburger,
        pickable: true,
        itemOccupyType: ItemOccupyType.firstLayer,
        eatable: true,
        src: "WorldItem-Food-Hamburger",
    },
    {
        itemType: ItemType.hotdog,
        pickable: true,
        itemOccupyType: ItemOccupyType.firstLayer,
        eatable: true,
        src: "WorldItem-Food-Hotdog",
    },
    {
        itemType: ItemType.icecream,
        pickable: true,
        itemOccupyType: ItemOccupyType.firstLayer,
        eatable: true,
        src: "WorldItem-Food-Icecream",
    },
    {
        itemType: ItemType.mexican,
        pickable: true,
        itemOccupyType: ItemOccupyType.firstLayer,
        eatable: true,
        src: "WorldItem-Food-Mexican",
    },
    {
        itemType: ItemType.pizza,
        pickable: true,
        itemOccupyType: ItemOccupyType.firstLayer,
        eatable: true,
        src: "WorldItem-Food-Pizza",
    },
    {
        itemType: ItemType.potato,
        pickable: true,
        itemOccupyType: ItemOccupyType.firstLayer,
        eatable: true,
        src: "WorldItem-Food-Potato",
    },
    {
        itemType: ItemType.rice,
        pickable: true,
        itemOccupyType: ItemOccupyType.firstLayer,
        eatable: true,
        src: "WorldItem-Food-Rice",
    },
    {
        itemType: ItemType.sandwich,
        pickable: true,
        itemOccupyType: ItemOccupyType.firstLayer,
        eatable: true,
        src: "WorldItem-Food-Sandwich",
    },
    {
        itemType: ItemType.waffle,
        pickable: true,
        itemOccupyType: ItemOccupyType.firstLayer,
        eatable: true,
        src: "WorldItem-Food-Waffle",
    },
    {
        itemType: ItemType.lightlamp,
        pickable: false,
        itemOccupyType: ItemOccupyType.firstLayer,
        eatable: false,
        src: "WorldItem-Food-Lightlamp",
    },
    {
        itemType: ItemType.lightswitch,
        pickable: false,
        itemOccupyType: ItemOccupyType.firstLayer,
        eatable: false,
        src: "WorldItem-Food-Lightswitch",
    },
     {
        itemType: ItemType.lightpinklamp,
        pickable: false,
        itemOccupyType: ItemOccupyType.firstLayer,
        eatable: false,
        src: "WorldItem-Food-Lightlamp",
    },

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
