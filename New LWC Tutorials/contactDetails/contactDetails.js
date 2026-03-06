import { LightningElement,api } from 'lwc';

export default class ContactDetails extends LightningElement {
    @api contact;

    clickHandler(event){
        event.preventDefault();

        const selectedevent = new CustomEvent("selection",{
            detail: this.contact.Id
        });
        this.dispatchEvent(selectedevent);
    }
}