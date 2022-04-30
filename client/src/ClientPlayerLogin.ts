import { ClientGameManager } from "./ClientGameManager";
import { characterType } from "./Enums";

export class ClientPlayerLogin {

    LoginWindowWrapper: HTMLDivElement;
    displayNameInput: HTMLInputElement;

    LetsGoButton: HTMLButtonElement;


    male01button: HTMLButtonElement = document.getElementById('male01') as HTMLButtonElement
    male02button: HTMLButtonElement = document.getElementById('male02') as HTMLButtonElement
    female01button: HTMLButtonElement = document.getElementById('female01') as HTMLButtonElement
    female02button: HTMLButtonElement = document.getElementById('female02') as HTMLButtonElement

    private characterSelected: boolean = false;
    private displayName : string= "";
    private currentSelectedCharacter: characterType = characterType.male01;

    constructor() {
        this.LoginWindowWrapper = document.getElementById('LoginWindowWrapper') as HTMLDivElement;

        this.displayNameInput = document.getElementById('LoginDisplayNameInput') as HTMLInputElement;

        this.LetsGoButton = document.getElementById('LetsGoButton') as HTMLButtonElement;

        this.male01button = document.getElementById('select-male01') as HTMLButtonElement;
        this.male02button = document.getElementById('select-male02') as HTMLButtonElement
        this.female01button = document.getElementById('select-female01') as HTMLButtonElement
        this.female02button = document.getElementById('select-female02') as HTMLButtonElement

        this.LetsGoButton.onclick = () => {
            this.LetsGo()
        }

        this.male01button.addEventListener('click', () => {
            this.characterSelected = true;

            this.DeseletEveryCharacter();
            this.male01button.setAttribute("selected", "true");
            this.SelectCharacter(this.male01button.id);
        });

        this.male02button.addEventListener('click', () => {
            this.characterSelected = true;

            this.DeseletEveryCharacter();
            this.male02button.setAttribute("selected", "true");
            this.SelectCharacter(this.male02button.id);
        });
        this.female01button.addEventListener('click', () => {
            this.characterSelected = true;

            this.DeseletEveryCharacter();
            this.female01button.setAttribute("selected", "true");
            this.SelectCharacter(this.female01button.id);
        });
        this.female02button.addEventListener('click', () => {
            this.characterSelected = true;
            this.DeseletEveryCharacter();
            this.female02button.setAttribute("selected", "true");
            this.SelectCharacter(this.female02button.id);
        });



    }

    // onCharacterButtonClicked(e: MouseEvent) {
    //     let button = e.target as HTMLButtonElement;
    //     this.DeseletEveryCharacter();
    //     button.setAttribute("selected", "true");
    //     this.SelectCharacter(button.id);
    // }

    DeseletEveryCharacter() {
        this.male01button.setAttribute("selected", "false");
        this.male02button.setAttribute("selected", "false");
        this.female01button.setAttribute("selected", "false");
        this.female02button.setAttribute("selected", "false");

    }
    SelectCharacter(id: string) {
        switch (id) {
            case "select-male01":
                this.currentSelectedCharacter = characterType.male01;
                break;
            case "select-male02":
                this.currentSelectedCharacter = characterType.male02;
                break;

            case "select-female01":
                this.currentSelectedCharacter = characterType.female01;

                break;
            case "select-female02":
                this.currentSelectedCharacter = characterType.female02;

                break;


        }
    }
    LetsGo() {
        console.log(this.displayNameInput.value)
        if (this.displayNameInput) {
            if (this.displayNameInput.value == "") {
                ClientGameManager.inputManager.showModal("Name is empty!", true);
                return;
            }
        }
        if (this.characterSelected == false) {
            ClientGameManager.inputManager.showModal("Select your character!", true);
            return;
        }
        this.displayName = this.displayNameInput.value;
        this.LoginWindowWrapper.setAttribute("turnon", "false");
        ClientGameManager.clientSocket.clientIO.emit('player-TrySpawn', ClientGameManager.clientSocket.clientIO.id,this.displayName,this.currentSelectedCharacter);

    }
    GetPreviousLoggedInDataFromLocalStorage() {
        let name = localStorage.getItem("displayName");
        let characterType = localStorage.getItem("characterType");
    }

    SaveNewLoginDataToLocalStorage(displayName: string, characterType: characterType) {
        localStorage.setItem("displayName", displayName);
        localStorage.setItem("characterType", characterType);
    }

    LetsSpawnCharacter() {
        // this.SaveNewLoginDataToLocalStorage();

    }
}