import { LightningElement,wire,api } from 'lwc';
import {createRecord,getRecord,getFieldValue,updateRecord,deleteRecord} from "lightning/uiRecordApi";
import fetchParentAccout from "@salesforce/apex/FetchAccountForWireProperty.fetchParentAccout";
import ACCOUNT from "@salesforce/schema/Account";
import {getObjectInfo,getPicklistValues} from "lightning/uiObjectInfoApi";
import ACCOUNT_SLA_TYPE from "@salesforce/schema/Account.SLA__c";
import ACCPARENT from "@salesforce/schema/Account.ParentId";
import ACCNAME from "@salesforce/schema/Account.Name";
import ACCSLAEXPDATE from "@salesforce/schema/Account.SLAExpirationDate__c";
import ACCLOCATION from "@salesforce/schema/Account.NumberofLocations__c";
import ACCDESC from "@salesforce/schema/Account.Description";
import { NavigationMixin } from "lightning/navigation";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import ACCOUNTId from "@salesforce/schema/Account.Id";
const fieldtoload = [ACCPARENT,ACCNAME,ACCSLAEXPDATE,ACCOUNT_SLA_TYPE,ACCLOCATION,ACCDESC];
export default class WireDecoratorCrudOperation extends NavigationMixin(LightningElement) {
    
    
    parentoptions=[];
    selParentAcc = "";
    selAccname = "";
    selSLAExDate = null;
    selSLAtype = "";
    selnumofloc = 0;
    seldec = "";
    @api recordId;

    @wire(getRecord,{
        recordId: "$recordId",
        fields : fieldtoload
    }) wiredgetRecord_Function({data,error}){
        if(data){
        this.selParentAcc = getFieldValue(data,ACCPARENT);
        this.selAccname = getFieldValue(data,ACCNAME);
        this.selSLAExDate = getFieldValue(data,ACCSLAEXPDATE);
        this.selSLAtype = getFieldValue(data,ACCOUNT_SLA_TYPE);
        this.selnumofloc = getFieldValue(data,ACCLOCATION);
        this.seldec = getFieldValue(data,ACCDESC);
        console.log('Parent ACC', this.selParentAcc);
    }else if(error){
        console.log('Error while fetching the Account details ', error);
    }
}

    @wire(fetchParentAccout) wired_getAccount({data,error}){
        this.parentoptions = [];
        if(data){
            this.parentoptions = data.map((currItem) => ({
                label: currItem.Name,
                value: currItem.Id
            }));
        }
        else if(error){
            console.log("Error ",error);
        }
    }

    handleChange(event){
        let {name, value} = event.target;
        if(name === 'parentacc'){
            this.selParentAcc = value;
        }
        if(name === 'accname'){
            this.selAccname = value;
        }
        if(name === 'slaexdt'){
            this.selSLAExDate = value;
        }
        if(name === 'slatype'){
            this.selSLAtype = value;
        }
        if(name === 'noofloc'){
            this.selnumofloc = value;
        }
        if(name === 'desc'){
            this.seldec = value;
        }
    }

    @wire(getObjectInfo, {
        objectApiName: ACCOUNT
    })
    accountobjectInfo;

    @wire(getPicklistValues,{
        recordTypeId: "$accountobjectInfo.data.defaultRecordTypeId",
        fieldApiName: ACCOUNT_SLA_TYPE
    }) slapicklist;

    saveRecord(){
        if(this.validateInput()){
            let inputfields = {};
            inputfields[ACCNAME.fieldApiName] = this.selAccname;
            inputfields[ACCPARENT.fieldApiName] = this.selParentAcc;
            inputfields[ACCSLAEXPDATE.fieldApiName] = this.selSLAExDate;
            inputfields[ACCOUNT_SLA_TYPE.fieldApiName] = this.selSLAtype;
            inputfields[ACCLOCATION.fieldApiName] = this.selnumofloc;
            inputfields[ACCDESC.fieldApiName] = this.seldec;
            
            if(this.recordId){
                //update Record
                inputfields[ACCOUNTId.fieldApiName] = this.recordId;
                let recordInput = {
                    fields: inputfields
                };
                updateRecord(recordInput).then((result) =>{
                    console.log('Account Updated Successfully ',result);
                    this.showupdatetoast();
                }).catch((error) =>{
                    console.log("Error while updating the record ",error);
                }); 
            }
            else{
            let recordInput = {
                apiName: ACCOUNT.objectApiName,
                fields: inputfields
            };
            createRecord(recordInput).then((result) =>{
                console.log('Account Created Successfully ',result);

                let pageref = {
                type: 'standard__recordPage',
                attributes: {
                    recordId: result.id,
                    objectApiName: ACCOUNT.objectApiName,
                    actionName: "view",
            }
        };
            this[NavigationMixin.Navigate](pageref);

            const event = new ShowToastEvent({
                title: "Success",
                message: "Record Created Successfully",
                variant: "success"
            });
            this.dispatchEvent(event);


            }).catch((error) =>{
                console.log('Error while creating Account Record ',error);
            });
        }
        }else{
            console.log('Input is not valid');
        }
    }
        
    validateInput(){
        let fields = Array.from(this.template.querySelectorAll(".validateme"));
        let isValid = fields.every((currItem)=>currItem.checkValidity());
        return isValid;
        }

        get formTitle(){
            if(this.recordId){
                return "Edit Account with Wire Decorator";
            } else{
                return "Create Account with Wire Decorator";
            }
        }

        showupdatetoast(){
            const event = new ShowToastEvent({
      title: "Success",
      message: "Record Updated successfully",
      variant: "success"
    });
    this.dispatchEvent(event);
        }

        resetRecord(){
            this.selParentAcc = '';
        this.selAccname = "";
        this.selSLAExDate = "";
        this.selSLAtype = "";
        this.selnumofloc = 0;
        this.seldec = "";
        }

        get isDeleteAvailable(){
            if(this.recordId){
            return true;
            }else{
                return false;
            }
        }

        deleteAccRecord(){
            deleteRecord(this.recordId).then(() =>{
                this.ShowToastEvent1();    //not working
                this.Navigate();          //not working
                console.log('Record deleted Successfully');
                let pageRef = {
            type: 'standard__objectPage',
            attributes: {
                objectApiName: ACCOUNT.objectApiName,
                actionName: 'list'
            },
            state: {
                filterName: 'AllAccounts'
            }
        };
        this[NavigationMixin.Navigate](pageRef);    //not working

            }).catch((error) =>{
                console.log('Record deletion failed ',error);
            });
        }

        Navigate(){
        let pageRef = {
            type: 'standard__objectPage',
            attributes: {
                objectApiName: ACCOUNT.objectApiName,
                actionName: 'list'
            },
            state: {
                filterName: 'AllAccounts'
            }
        };
        this[NavigationMixin.Navigate](pageRef);
    }
        ShowToastEvent1(){
                const event = new ShowToastEvent({
                    title: '',
                    variant: 'Success',
                    message:
                        'Record deleted Successfully'
            });
            this.dispatchEvent(event);
        }
}