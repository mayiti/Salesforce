import { LightningElement,wire } from 'lwc';
import {createRecord,deleteRecord,updateRecord} from "lightning/uiRecordApi";
import TASK_MANAGER_OBJECT from "@salesforce/schema/Task_Manager__c";
import TASK_MANAGER_ID from "@salesforce/schema/Task_Manager__c.Id";
import TASK_MANAGER_NAME from "@salesforce/schema/Task_Manager__c.Name";
import TASK_MANAGER_Date from "@salesforce/schema/Task_Manager__c.Task_Date__c";
import TASK_MANAGER_CompletedDate from "@salesforce/schema/Task_Manager__c.Completed_Date__c";
import TASK_MANAGER_IsCompleted from "@salesforce/schema/Task_Manager__c.Is_Compeleted__c";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import getAllInCompleteRecords from "@salesforce/apex/toDoAppControllertoFetchData.getAllInCompleteRecords";
import getAllCompleteRecords from "@salesforce/apex/toDoAppControllertoFetchData.getAllCompleteRecords";
import {refreshApex} from "@salesforce/apex";

export default class ToDoApplication extends LightningElement {
    taskname="";
    taskdate = null;
    taskId = "";
    incompletetask = [];
    completedtask = [];
    incompleteTaskResult;
    completeTaskResult;

    @wire(getAllInCompleteRecords) wire_incompleteRecords(result){
        this.incompleteTaskResult = result;
        let {data, error} = result;
        if(data){
            console.log('InComplete Task Record ', data);
            this.incompletetask = data.map((currItem)=>({
                taskId: currItem.Id,
                taskname: currItem.Name,
                taskdate: currItem.Task_Date__c 
            }));
            console.log('InComplete Task Array ', this.incompletetask);
        }else if(error){
            console.log('Error ',error);
        }
    }

    @wire(getAllCompleteRecords) wire_completeRecords(result){
        this.completeTaskResult = result;
        let{data,error} = result;
        if(data){
            console.log('Complete Task Record ', data);
            this.completedtask = data.map((currItem)=>({
                taskId: currItem.Id,
                taskname: currItem.Name,
                taskdate: currItem.Task_Date__c 
            }));
            console.log('Complete Task Array ', this.completedtask);
        }else if(error){
            console.log('Error ',error);
        }
    }

    changeHandler(event){
        let {name, value} =event.target;
        if(name === 'taskname'){
            this.taskname = value;
        }else if(name === 'taskdate'){
            this.taskdate = value;
        }
    }

    resetHandler(){
        this.taskdate = null;
        this.taskname = "";
    }

    addTaskHandler(){
        if(!this.taskdate){
            this.taskdate = new Date().toISOString().slice(0,10);
        }

        if(this.valdateTask()){
            // console.log('isValid ',isValid);
            // this.incompletetask = [...this.incompletetask,{
            //     taskname: this.taskname,
            //     taskdate: this.taskdate
            // }];
            // this.resetHandler();
            // let sortedArray = this.sortTask(this.incompletetask);
            // this.incompletetask = [...sortedArray];
            // console.log('this.incompletetask ',this.incompletetask);

            let inputFields = {};
            inputFields[TASK_MANAGER_NAME.fieldApiName] = this.taskname;
            inputFields[TASK_MANAGER_Date.fieldApiName] = this.taskdate;
            inputFields[TASK_MANAGER_IsCompleted.fieldApiName] = false;
            let recordInput = {
                apiName: TASK_MANAGER_OBJECT.objectApiName,
                fields: inputFields
            };
            createRecord(recordInput).then((result) => {
                console.log('Record Created Successfully', result);
                this.showToast('Success', 'Task Created Successfully', "success");
                this.resetHandler();
                refreshApex(this.incompleteTaskResult);
            });
        }
    }

    valdateTask(){
        let isValid = true;
        let element = this.template.querySelector(".taskname");
        if(!this.taskname){
            isValid = false;
         } 
         
        else{
            let taskItem = this.incompletetask.find((currItem) => currItem.taskname === this.taskname && currItem.taskdate === this.taskdate);
            if(taskItem){
                isValid = false;
                element.setCustomValidity("Task is already Available");
            }
        }
        if(isValid){
            element.setCustomValidity("");
        }
        element.reportValidity();
        return isValid;
    }

    sortTask(inputArr){
        let sortedArray = inputArr.sort((a,b)=>{
            const dateA = new Date(a.taskdate);
            const dateB = new Date(b.taskdate);
            return dateA - dateB;
        });
        return sortedArray;
    }

    removalHandler(event){
        let recordId = event.target.name;
        deleteRecord(recordId).then(()=>{
            this.showToast('Deleted',"Record Deleted Successfully","success");
            refreshApex(this.incompleteTaskResult);
            refreshApex(this.completeTaskResult);
        }).catch(()=>{
            this.showToast('Deleted',"Record Deletion Failed","error");
        });
    }

    completetaskHandler(event){
        let recordId = event.target.name;
        this.refreshData(recordId);
    }

    dragStartHandler(event){
        event.dataTransfer.setData("index",event.target.dataset.item);
    }

    allowDrop(event){
        event.preventDefault();
    }

    dropElementHandler(event){
        let recordId = event.dataTransfer.getData("index");
        this.refreshData(recordId);
    }

    async refreshData(recordId){
        let inputFields = {};
        inputFields[TASK_MANAGER_ID.fieldApiName] = recordId;
        inputFields[TASK_MANAGER_IsCompleted.fieldApiName] = true;
        inputFields[TASK_MANAGER_CompletedDate.fieldApiName] = new Date().toISOString().slice(0,10);
        let recordInput = {
            fields: inputFields
        };
        try{
            await updateRecord(recordInput);
            await refreshApex(this.incompleteTaskResult);
            await refreshApex(this.completeTaskResult);
            this.showToast('Updated', "Record Updated Successfully", 'success');
        }
        catch(error){
            console.log('Update Operation Failed ', error);
            this.showToast('Error',"Record Updation Failed", 'error');
        }
    }

    showToast(title,message,variant) {
    const event = new ShowToastEvent({
      title: title,
      message: message,
      variant: variant
    });
    this.dispatchEvent(event);
  }
}