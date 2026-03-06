import { LightningElement,api } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import { encodeDefaultFieldValues } from "lightning/pageReferenceUtils";
export default class NavigationDemo extends NavigationMixin{
    @api invoke(){
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: "Contact",
                actionName: 'home'
            }
        });
    }
}