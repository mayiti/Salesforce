import { LightningElement } from 'lwc';
export default class ChildToParentCommunicationParentLWC extends LightningElement {
    displayMessage = false;
    childmsg;
    chit;

    showMessage(event) {
        this.displayMessage = true;
    }

    showMessage1(event){
        this.childmsg = event.detail;
    }

    showMessage2(event){
        this.chit = event.detail;
    }
}