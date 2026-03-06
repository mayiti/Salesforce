import { LightningElement,wire } from 'lwc';
import fetchAccountDataforImperativeApex from "@salesforce/apex/FetchAccountForWireProperty.fetchAccountDataforImperativeApex";
import {getPicklistValues,getObjectInfo} from "lightning/uiObjectInfoApi";
import ACCOUNT_INDUSTRY from "@salesforce/schema/Account.Industry";
import ACCOUNT from "@salesforce/schema/Account";
export default class ImperativeWire extends LightningElement {

data=[];
options=[];
columns = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Industry', fieldName: 'Industry'},
    { label: 'Rating', fieldName: 'Rating'},
];
selectedIndustry;

@wire(getObjectInfo,{
    objectApiName: ACCOUNT
}) accountInfo;

@wire(getPicklistValues,{
    recordTypeId: "$accountInfo.data.defaultRecordTypeId",
    fieldApiName: ACCOUNT_INDUSTRY
}) industryPicklist;

handleChange(event){
    this.selectedIndustry = event.target.value;
}
    clickHandler(){
        fetchAccountDataforImperativeApex({
            inputIndustry: this.selectedIndustry
        })
        .then((result)=>{
            console.log("Account Record ",result);
            this.data = result;
        })
        .catch((error)=>{
            console.log("Account error ",error);
        });
    }
}