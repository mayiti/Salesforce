import { LightningElement, api, wire } from 'lwc';
import ACCOUNT_NAME from "@salesforce/schema/Account.Name";
import ACCOUNT_REVENUE from "@salesforce/schema/Account.AnnualRevenue";
import ACCOUNT_INDUSTRY from "@salesforce/schema/Account.Industry";
import CONTACT_NAME from "@salesforce/schema/Contact.Name";
import USER_NAME from "@salesforce/schema/User.Name";
import { getRecord, getFieldValue, getFieldDisplayValue, getRecords } from "lightning/uiRecordApi";
export default class GetRecordFieldValue extends LightningElement {

    @api recordId;
    accname;
    accRevenue;
    accIndustry;
    output;
    error;

    @wire(getRecord, {
        recordId: "$recordId",
        fields: [ACCOUNT_NAME, ACCOUNT_REVENUE, ACCOUNT_INDUSTRY]
    }) outputFunction({ data, error }) {
        if (data) {
            //console.log('Data ', data);
            this.accname = data.fields.Name.value;
            this.accRevenue = getFieldDisplayValue(data, ACCOUNT_REVENUE);
            this.accIndustry = getFieldValue(data, ACCOUNT_INDUSTRY);
        }
        else if (error) {
            console.log('Error in getRecord ', error);
        }
    }

    @wire(getRecords, {
        records: [
            {
                recordIds: ["001gK00000QhIuOQAV"],
                fields: [ACCOUNT_NAME]
            },
            {
                recordIds: ["003gK00000FzhEKQAZ"],
                fields: [CONTACT_NAME]
            },
            {
                recordIds: ["005gK00000A7kErQAJ"],
                fields: [USER_NAME]
            }
        ]
    }) outputData({ data, error }) {
        if (data) {
            this.output = data;
            this.error = null;
            }
        else if (error) {
            this.error = error;
            this.output = null;
            console.log('Error in getRecords ', error);
        }
    }
}