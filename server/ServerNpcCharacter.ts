import { characterType, ItemType } from "./shared/Enums";
import { ServerCharacter } from "./ServerCharacter";
import { ServerGameManager } from "./ServerGameManager";
import { ServerItem } from "./ServerItem";
import { Vector2 } from "./Vector2";

export interface INPCBehavior {
    Behave(): any;
}

export class RandomMoveNPC extends ServerCharacter implements INPCBehavior {

    constructor(id: string, display: string, to: Vector2, auth: boolean, characterType: characterType, isthisNpc: boolean) {
        super(id, display, to, auth, characterType, isthisNpc);
        console.log("NPC SPAWNED")
        console.log(to);
        this.Behave();
    }
    async Behave(): Promise<any> {
        // this.die;
        // console.log(this.die)

        setInterval(() => {
            if (this.died == false) {
                let randomCell = this.getRandomCell();
                if (randomCell) {

                    this.TryMove(randomCell.position);

                }
            }

        }, Math.floor(Math.random() * (2000 - 500 + 1) + 500));

    }

    override async die(): Promise<void> {
        if (this.died == true) return;
        this.died = true;
        // await new Promise(resolve => setTimeout(() => resolve, 3000))
        console.log("DEAD");
        ServerGameManager.serverSocketManager.removeCharacter(this.id);;
        let item = new ServerItem(this.currentPosition, ServerGameManager.getEatableRandomItemFromItemDb().itemType);
        ServerGameManager.currentMapInfo.getCellByVector2(this.currentPosition)?.tryPutItem(item);
        ServerGameManager.serverSocketManager.serverio.emit('try-spawn-item', item.id, this.currentPosition, item.itemType, item.isLightStatus);
    }

}