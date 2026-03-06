import { LightningElement,wire } from 'lwc';
import GetContactDetailsforLWC from '@salesforce/apex/GetContactDetailsforLWC.GetContactDetailsforLWC';
import { publish, MessageContext } from "lightning/messageService";
import recordSelected from "@salesforce/messageChannel/SendContactdetails__c";
export default class ContactList extends LightningElement {
@wire(GetContactDetailsforLWC) contacts;
selectedContact;

@wire(MessageContext)
  messageContext;

selectionHandler(event){
    let selectedContactId = event.detail;
    console.log('Hell 0 ',selectedContactId);

    this.selectedContact = this.contacts.data.find((curritem) => curritem.Id === selectedContactId);
    console.log('Hell 1 ',this.selectedContact);

    const payload = { contactData: this.selectedContact };

    publish(this.messageContext, recordSelected, payload);
    }

}