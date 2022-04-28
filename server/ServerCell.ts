import e from "express";
import { ItemGeneralType, ItemOccupyType, ItemType } from "../client/src/Enums";
import { ServerCharacter } from "./ServerCharacter";
import { ServerGameManager } from "./ServerGameManager";
import { ServerItem } from "./ServerItem";
import { Vector2 } from "./Vector2";

export class ServerCell {
    position: Vector2;
    // htmlElement: HTMLDivElement;
    isOccupied: boolean = false;


    wall: boolean = false;
    hasFirstLayerItem: ServerItem | undefined = undefined;
    // hasSecondaryLayerItem: ServerItem | undefined = undefined;

    standingCharacter: ServerCharacter | undefined = undefined;
    constructor(vector2: Vector2) {
        this.position = vector2;
        // this.htmlElement = document.createElement("div") as HTMLDivElement;
        // this.htmlElement.classList.add('cell');

        // //* set parent
        // let parentDiv = document.getElementById('map');
        // if (parentDiv) {
        //     parentDiv.append(this.htmlElement);
        // }
        // //* Set visual position
        // this.htmlElement.style.transform = `translate3d(${vector2.x * GameManager.CellDistanceOffset}px,${vector2.y * GameManager.CellDistanceOffset}px,0)`;
        // console.log(this.htmlElement.style.transform)
        // this.htmlElement.style.transform = `translate3d(${vector2.x},${vector2.y},0)`;
        // this.htmlElement.classList.add('cell');
    }
    setStandingCharacter(character: ServerCharacter | undefined) {
        this.standingCharacter = character;
        if (character == undefined) {
            this.setOccupied(false);
        }
        else {
            this.setOccupied(true);
        }
    }

    setOccupied(bool: boolean) {
        this.isOccupied = bool;
    }


    hasPickableItem(): ServerItem | undefined {
        // todo
        // 1. Check second layer 
        // 2. if second layer is pickable, pick it.
        // 3. end
        // 4. if second is empty
        // 5. Check first layer
        // 6. if first layer is pickable, pick it

        if (this.hasFirstLayerItem != undefined) {
            let i = ServerGameManager.getItemInfoByItemTypeFromDB(this.hasFirstLayerItem.itemType);
            if (i != undefined) {
                if (i.pickable == true) {
                    return this.hasFirstLayerItem;
                }
            }

        }
        return undefined;

    }

    checkOccupied(): boolean {
        // todo
        if (this.isOccupied == true) return true;

        if (this.standingCharacter != null) {
            return true;
        }
        if (this.wall == true) return true;
        if (this.hasFirstLayerItem) {
            let i = ServerGameManager.getItemInfoByItemTypeFromDB(this.hasFirstLayerItem.itemType);
            if (i) {
                if (i.itemOccupyType == ItemOccupyType.firstLayer || i.itemOccupyType == ItemOccupyType.wall) {
                    return true;
                }
            }
        }


        return false;
    }

    canDropItemHere(item: ServerItem): boolean {
        if (this.checkOccupied()) return false;
        let occupyType = ServerGameManager.getItemInfoByItemTypeFromDB(item.itemType)?.itemOccupyType;
        if (occupyType == undefined) return false;
        switch (occupyType) {
            case ItemOccupyType.firstLayer:
                if (this.hasFirstLayerItem != null) {
                    return false;
                }
                else {
                    return true;
                }

                break;
            // case ItemOccupyType.none:
            //     // if (this.hasSecondaryLayerItem != null) {
            //     //     return false;
            //     // }
            //     else {
            //         //second is empty
            //         return true;
            //     }
            //     break;
            case ItemOccupyType.wall:
                if (this.wall != null) {
                    return false;
                }
                else {
                    //zero is empty
                    return true;
                }

                break;


        }
        return false;
    }


    tryPutItem(serverItem: ServerItem) {
        let i = ServerGameManager.getItemInfoByItemTypeFromDB(serverItem.itemType);
        if (i != null) {
            switch (i.itemOccupyType) {
                case ItemOccupyType.firstLayer:
                    //try first 
                    if (this.hasFirstLayerItem == undefined) {
                        this.hasFirstLayerItem = serverItem;

                        return;
                    }

                    break;

                case ItemOccupyType.wall:
                    if (this.wall == false) {
                        this.wall = true;
                        return;
                    }
                    break;

            }
        }
        return;


    }

}