import { LightningElement,wire } from 'lwc';
import mylogo from "@salesforce/resourceUrl/MyPic";
import {getRecord, getFieldValue} from "lightning/uiRecordApi";
import USER_ID from "@salesforce/user/Id";
import NAME from "@salesforce/schema/user.Name";
import {loadStyle, loadScript} from "lightning/platformResourceLoader";
import ANIMATE from "@salesforce/resourceUrl/ThirdPartyCSS";
import MOMENT from "@salesforce/resourceUrl/ThirdPartyJS";
export default class StaticResourceImage extends LightningElement {
    mylogoimg = mylogo;
    name = "";
    isFirstLoad = true;
    DisplayDate = "";
    @wire(getRecord,{
        recordId: USER_ID,
        fields: [NAME]
    }) userDetails({data,error}){
        if(data){
            console.log('User Details ',data);
            this.name = getFieldValue(data,NAME);
        }
        else if(error){
            console.log('Error in User Details ',error);
        }
    }

    renderedCallback(){
        if(this.isFirstLoad){
            this.isFirstLoad = false;
            Promise.all([loadStyle(this,ANIMATE), loadScript(this,MOMENT)])
           .then(()=>{
            console.log("File Loaded Successfully");
            this.fetchDate();
            }).catch((error)=>{
            console.log("File Loaded Failed ",error);
           });
        }
    }
    fetchDate(){
        this.DisplayDate = moment().format('LLLL');
    }

}