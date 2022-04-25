import { ClientCharacter } from "./ClientCharacter";
import { ClientGameManager } from "./ClientGameManager";

export class Camera {
    characterToFocus: ClientCharacter | undefined = undefined;

    offset: number = 80;
    cameraOffsetX = window.innerWidth / 2 - (this.offset / 2);
    cameraOffsetY = window.innerHeight / 3;
    map: HTMLDivElement = document.getElementById('map') as HTMLDivElement;
    constructor(character: ClientCharacter) {
        window.onresize = this.resizeCameraOffset;
        this.characterToFocus = character;
    }
    // setPlayerCharacter(character: ClientCharacter) {
    //     this.characterToFocus = character;
    //     // this.setCameraPosition(this.characterToFocus.currentPosition.x, this.characterToFocus.currentPosition.y);
    // }
    setCameraPosition(x: number, y: number) {
        // console.log('Set Camer Position!!!');
        // if (this.characterToFocus == null) return;
        // console.log(this.map);
        this.map.style.transform = `translate3d(${x * this.offset + this.cameraOffsetX}px,${y * this.offset + this.cameraOffsetY}px,0)`;
        // this.map.style.transform = `translate3d(-${x * this.offset + this.cameraOffsetX}px,-${y * this.offset + this.cameraOffsetY}px,0)`;
    }


    resizeCameraOffset() {
        if (this.characterToFocus == null) return;
        this.map.setAttribute("transition", "0.0s linear");

        console.log('resized width', window.innerWidth);
        // * centering camera
        this.cameraOffsetX = window.innerWidth / 2 - (50);
        console.log('resized height', window.innerHeight);
        this.cameraOffsetY = window.innerHeight / 3;
        this.setCameraPosition(-this.characterToFocus.currentPosition.x, -this.characterToFocus.currentPosition.y);
        this.map.setAttribute("transition", "0.4s linear");
    }


}