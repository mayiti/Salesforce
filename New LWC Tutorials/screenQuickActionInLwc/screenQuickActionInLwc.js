import { LightningElement,api } from 'lwc';
import ACCOUNT_NAME from "@salesforce/schema/Account.Name"
import ACCOUNT_INDUSTRY from "@salesforce/schema/Account.Industry"
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import {CloseActionScreenEvent} from "lightning/actions";
export default class ScreenQuickActionInLwc extends LightningElement {
    @api recordId;
    @api objectApiName;
    fields = {
        accountName: ACCOUNT_NAME,
        accountIndustry: ACCOUNT_INDUSTRY
    };

    closeModal(){
        this.dispatchEvent(new CloseActionScreenEvent());
    }

    successHandler(){
    const event = new ShowToastEvent({
      title: "Success",
      message: "Record Saved Successfully",
      variant: "success"
    });
    this.dispatchEvent(event);
    this.dispatchEvent(new CloseActionScreenEvent());
  }
}