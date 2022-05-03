import { Direction, itemDB, ItemOccupyType, ItemType } from "../../server/shared/Enums";
// import { GameManager } from "./GameManager";
import { Vector2 } from "../../server/Vector2";
import { ClientGameManager } from "./ClientGameManager";
import { ClientCharacter } from "./ClientCharacter";
import { Cell } from "./Cell";
import { Util } from "./util";

export class ClientItem {
    position: Vector2;
    // wrapperImgElement: HTMLDivElement;
    imgElement: HTMLDivElement | undefined = undefined;
    itemType: ItemType = ItemType.beer;
    id: string;

    // occupiedLayer: 0 | 1
    constructor(id: string, position: Vector2, itemType: ItemType,currentLightStatus:boolean) {
        this.position = position;
        this.id = id;
        this.itemType = itemType;
        // this.occupiedLayer = layer;
        this.createImgAt(position, itemType);
        // this.setItemToCell(position);
        console.log('item put...');

        this.toggleLight(currentLightStatus);
        
    }

    // setItemToCell(to: Vector2) {
    //     if (ClientGameManager.currentMap) {
    //         let cc = ClientGameManager.currentMap.getCellByVector2(to);
    //         if (cc) {
    //             // cc.hasFirstLayerItem = this;
    //         }
    //     }
    // }

    createImgAt(to: Vector2, itemType: ItemType) {
        console.log('created img at ', to);
        this.imgElement = document.createElement('div') as HTMLDivElement;
        this.imgElement.classList.add('GameObject');

        let parentDiv = document.getElementById('map');
        if (parentDiv) {
            parentDiv.append(this.imgElement);
        }



        // let found = ClientGameManager.currentMap?.getCellByVector2(position);
        // if (found) {
        //     // found.hasItem = this;
        // }

        // //* Set visual position
        // let i = itemDB.find(i => i.itemType == itemType);
        // if (i) {
        //     this.setImageSrc(i.src);
        // }
        this.imgElement.style.transform = `translate3d(${to.x * ClientGameManager.CellDistanceOffset}px,${to.y * ClientGameManager.CellDistanceOffset}px,0)`;
        this.setImageSrc();


        
    }

    createImgOnCharacter(character: ClientCharacter) {
        this.imgElement = document.createElement('div') as HTMLDivElement;
        this.imgElement.classList.add('GameObject');

        this.imgElement.classList.add('itemPickedStatus');
        character.wrapperHtmlElement.append(this.imgElement);
        this.imgElement.style.transform = 'translate3d(0,0,0)';
        this.setImageSrc()

    }


    setImageSrc() {
        let i = itemDB.find(i => i.itemType == this.itemType);
        if (i) {
            this.imgElement?.classList.add(i.src);
        }
    }

    tryRemoveItemFromWorld() {
        this.imgElement?.remove();
    }

    createChildLightHtml(onoff : boolean)
    {   

    }
    toggleLight(onoff : boolean)
    {
        if(onoff == true)
        {
            console.log('light ooooon');
            if(this.imgElement)
            {
                let lightElement = document.createElement('div');
                if(this.itemType == ItemType.lightlamp)
                {
                    lightElement.classList.add('light-yellow');
                }
                else if(this.itemType == ItemType.lightpinklamp)
                {
                    lightElement.classList.add('light-pink');
                }
                this.imgElement.append(lightElement);
                console.log('this.imgElement.hasChildNodes()',this.imgElement.hasChildNodes())
                console.log(lightElement)
                console.log(lightElement.parentElement)
                lightElement.style.transform = `translate3d(${this.position.x * ClientGameManager.CellDistanceOffset}px,${this.position.y * ClientGameManager.CellDistanceOffset}px,0)`;

            }
        }
        else
        {
            console.log('light off')
            if(this.imgElement)
            {
                Util.deleteAllChildrenHTMLElement(this.imgElement);
            }
        }
    }


}
