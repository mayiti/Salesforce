import { LightningElement,api } from 'lwc';
import ACCOUNT_NAME from "@salesforce/schema/Account.Name";
import ACCOUNT_RATINg from "@salesforce/schema/Account.Rating";
import ACCOUNT_INDUSTRY from "@salesforce/schema/Account.Industry";
import ACCOUNT_WEBSITE from "@salesforce/schema/Account.Website"
export default class LightningRecordViewForm extends LightningElement {

    @api recordId;
    @api objectApiName;

    fieldObject ={
     Name: ACCOUNT_NAME,
     Industry: ACCOUNT_INDUSTRY,
     Rating: ACCOUNT_RATINg,
     Website: ACCOUNT_WEBSITE   
    };
}