import { LightningElement,api } from 'lwc';
import ACCOUNT_NAME from "@salesforce/schema/Account.Name";
import ACCOUNT_RATINg from "@salesforce/schema/Account.Rating";
import ACCOUNT_INDUSTRY from "@salesforce/schema/Account.Industry";
import ACCOUNT_WEBSITE from "@salesforce/schema/Account.Website";
import {ShowToastEvent} from "lightning/platformShowToastEvent";
import { NavigationMixin } from "lightning/navigation";
export default class LightningRecordForm extends NavigationMixin(LightningElement) {
    @api recordId;
    @api objectApiName;
    fieldList =[ACCOUNT_NAME,ACCOUNT_RATINg,ACCOUNT_INDUSTRY,ACCOUNT_WEBSITE];

        ShowToast(){
            const event = new ShowToastEvent({
                title: "Success",
                message: "Record Updated Successfully",
                variant: "success"
            });
            this.dispatchEvent(event);
        }

        NavigateHandler(event){
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
}