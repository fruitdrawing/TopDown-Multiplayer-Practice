import { Sprite } from "./Sprite";
import { Vector2 } from "./Vector2";

export class GameObject {
    id: string;
    position: Vector2;
    sprite: Sprite;

    constructor(position: Vector2, spriteSrc: string) {
        this.id = crypto.randomUUID();
        this.position = position;
        this.sprite = new Sprite(spriteSrc, this);
    }

}