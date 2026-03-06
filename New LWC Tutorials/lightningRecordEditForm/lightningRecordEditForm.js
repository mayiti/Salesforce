import { LightningElement,api } from 'lwc';
import ACCOUNT from "@salesforce/schema/Account";
import ACCOUNT_NAME from "@salesforce/schema/Account.Name";
import ACCOUNT_RATINg from "@salesforce/schema/Account.Rating";
import ACCOUNT_SLA from "@salesforce/schema/Account.SLAExpirationDate__c";
import ACCOUNT_WEBSITE from "@salesforce/schema/Account.Website";
import { NavigationMixin } from "lightning/navigation";
export default class LightningRecordEditForm extends NavigationMixin(LightningElement) {
    @api recordId;
    @api objectApiName;

    fields = {
        Name: ACCOUNT_NAME,
        Rating: ACCOUNT_RATINg,
        SLA: ACCOUNT_SLA,
        Website: ACCOUNT_WEBSITE
    };

    SuccessHandler(event){
        let pageRef = {
            type: 'standard__recordPage',
            attributes: {
                recordId: event.detail.id,
                objectApiName: this.objectApiName,
                actionName: 'view'
            }
        };
        this[NavigationMixin.Navigate](pageRef);
    }

    SubmitHandler(event){
        event.preventDefault();
        console.log(event.detail);
        console.log(JSON.stringify(event.detail));

        const fields = event.detail.fields;
        console.log('fields ', fields);
        if(!fields.Rating){
            fields.Rating = "Hot";
        }
        this.template.querySelector("lightning-record-edit-form").submit(fields);
    }

    SubmitHandler1(event){
        event.preventDefault();
        console.log(event.detail);
        console.log(JSON.stringify(event.detail));

        const fields = event.detail.fields;
        console.log('fields ', fields);
        if(!fields.Rating){
            fields.Rating = "Hot";
        }
        this.template.querySelector("lightning-record-edit-form").submit(fields);
    }

    ResetHandler(){
        let fieldinput = this.template.querySelectorAll("lightning-input-field");
        fieldinput.forEach((currItem) => currItem.reset());
    }
}