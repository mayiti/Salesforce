import { LightningElement,api,wire } from 'lwc';
import ACCOUNT_NAME from '@salesforce/schema/Account.Name';
import ACCOUNT_TICKET_SYMBOL from '@salesforce/schema/Account.TickerSymbol';
import {getFieldValue, getRecord,notifyRecordUpdateAvailable } from 'lightning/uiRecordApi'; 
import updateAccountDataforImperativeApex from "@salesforce/apex/FetchAccountForWireProperty.updateAccountDataforImperativeApex";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
export default class ImperativeApexUpdateForm extends LightningElement {
    
    @api recordId;
    accname = "";
    accticker = "";

    @wire(getRecord,{
        recordId : "$recordId",
        fields: [ACCOUNT_NAME,ACCOUNT_TICKET_SYMBOL]
    })
    wiredRecord({error,data}){
        if(data){
            console.log('Get Record Account', data);
            this.accname = getFieldValue(data, ACCOUNT_NAME);
            this.accticker = getFieldValue(data,ACCOUNT_TICKET_SYMBOL);
    }
    else if(error){
        console.log('Error',error);
        }
    }

    changeHandler(event){
        this.accticker = event.target.value;
        console.log('this.accticker ',this.accticker);
    }

    updateHandler(){
         updateAccountDataforImperativeApex({
            recordId: this.recordId,
            accticker: this.accticker
        }).then((result)=>{
            console.log('Record Updated Successfully ',result);
            notifyRecordUpdateAvailable([{recordId: this.recordId}]);
            this.refreshBrowser('Success',`Record ${this.accname} Updated Successfully`,'success');
        }).catch((error)=>{
            console.log("Error while updating the Account record from LWC ",error);
        });
    }

    refreshBrowser(title,message,variant){
    const event = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    this.dispatchEvent(event);
    }
}