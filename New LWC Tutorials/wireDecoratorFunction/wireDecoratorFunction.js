import { LightningElement, wire } from 'lwc';
import fetchAccountData from "@salesforce/apex/FetchAccountForWireProperty.fetchAccountData";
import {updateRecord} from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import {refreshApex} from "@salesforce/apex";
const columns = [
    { label: 'Account Name', fieldName: "Name",editable: true},
    { label: 'Account Rating', fieldName: "Rating",editable: true},
    { label: 'Account Industry', fieldName: "Industry",editable: true}
];
export default class WireDecoratorFunction extends LightningElement {
    columns = columns;
    accounts;
    error;   
    draftValues =[];
    refreshProperty;
    @wire(fetchAccountData) accountfunction(result) {
        this.refreshProperty = result;
        if (result.data) {
            //console.log('data', data);
            let updatedAccounts = result.data.map((currItem) => {
                let updatedObject = {};  

                if (!currItem.hasOwnProperty("Rating")) {
                    updatedObject = { ...currItem, Rating: "Test" };
                }
                else {
                    updatedObject = { ...currItem };
                }
                return updatedObject;
            });
            this.accounts = [...updatedAccounts];
            this.error = null;
        } else if (result.error) {
            console.log('Error', error);
            this.error = error;
            this.accounts = null;
        }
    }

    async saveHandler(event){
        console.log('1');
        //updateRecord or Apex Class
        let records = event.detail.draftValues;
        console.log('records ',records);
        let updateRecordArray = records.map((currItem) => {
            let fieldInput = {...currItem};
            return {
                fields: fieldInput
            };
        });

        this.draftValues = [];
        let updateRecordArrayPromise = updateRecordArray.map((currItem)=> updateRecord(currItem)
    );

        await Promise.all(updateRecordArrayPromise)

        const toastevent = new ShowToastEvent({
            title: "Success",
            message: "Records Updated Successfully",
            variant: "success"
        });
        this.dispatchEvent(toastevent);

        await refreshApex(this.refreshProperty);
    }
}