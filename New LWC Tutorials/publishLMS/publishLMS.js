import { LightningElement,wire } from 'lwc';
import { publish, MessageContext } from 'lightning/messageService';
import recordSelected from '@salesforce/messageChannel/sendMessage__c';
export default class PublishLMS extends LightningElement {
     @wire(MessageContext)
     messageContext;

    clickHandler(){
        const payload = { lmsData: 'Welcome to LWC bootcamp'};
        publish(this.messageContext, recordSelected, payload);
    }
}