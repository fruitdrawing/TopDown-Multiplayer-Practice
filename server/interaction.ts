import { Vector2 } from "./Vector2";

export class DoNothing implements Interact {
    Dosomething(to: Vector2): void {
    }

}

export class ToggleSwitch implements Interact {
    Dosomething(to: Vector2): void {
        
    }

}



export interface Interact {
    Dosomething(to: Vector2): void;
}