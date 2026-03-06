import { LightningElement, wire } from 'lwc';
import { getObjectInfo, getObjectInfos, getPicklistValues, getPicklistValuesByRecordType } from "lightning/uiObjectInfoApi";
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import OPPORTUNITY_OBJECT from "@salesforce/schema/Opportunity";
import ACCOUNT_INDUSTRY from "@salesforce/schema/Account.Industry";
export default class GetObjectInfoApi extends LightningElement {

    output;
    error;
    objectApiNames = [ACCOUNT_OBJECT, OPPORTUNITY_OBJECT];
    objectsInfos;
    value;
    value1;

    @wire(getObjectInfo, {
        objectApiName: ACCOUNT_OBJECT
    }) outputdata({ data, error }) {
        if (data) {
            //console.log('data ', data);
            this.output = data;
            this.error = null;
        }
        else if (error) {
            console.log('Error ', error);
            this.error = error;
            this.output = null;
        }

    }

    @wire(getObjectInfos, {
        objectApiNames: "$objectApiNames"
    }) objectInfos({ data, error }) {
        if (data) {
            this.objectsInfos = data;
            this.error = null;
        }
        else if (error) {
            console.log('Error ', error);
            this.error = error;
            this.objectsInfos = null;
        }
    }

    @wire(getObjectInfo, {
        objectApiName: ACCOUNT_OBJECT
    }) accountInfo;
    @wire(getPicklistValues, {
        recordTypeId: "$accountInfo.data.defaultRecordTypeId",
        fieldApiName: ACCOUNT_INDUSTRY
    }) industryPicklist;

    handleChange(event) {
        this.value = event.target.value;
    }

    @wire(getPicklistValuesByRecordType,{
        objectApiName: ACCOUNT_OBJECT,
        recordTypeId: "$accountInfo.data.defaultRecordTypeId"
    }) accountInfoPicklist;

    handleChange1(event) {
        this.value1 = event.target.value;
    }
}