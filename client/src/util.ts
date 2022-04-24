export class Util {
    static deleteAllChildrenHTMLElement(parentElement: HTMLElement) {
        while (parentElement.firstChild) {
            parentElement.removeChild(parentElement.firstChild);
        }
    }
}