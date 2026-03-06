import { LightningElement } from 'lwc';
import { NavigationMixin } from "lightning/navigation";
import { encodeDefaultFieldValues } from "lightning/pageReferenceUtils";
export default class NavigationDemo extends NavigationMixin(LightningElement) {

    clickHandler(event) {
        let pageRef = {
            type: 'standard__namedPage',
            attributes: {
                pageName: 'home'
            }
        };
        this[NavigationMixin.Navigate](pageRef);
    }

    navAccListView(event) {
        let pageRef = {
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Account',
                actionName: 'list'
            },
            state: {
                filterName: 'AllAccounts'
            }
        };
        this[NavigationMixin.Navigate](pageRef);
    }

    navAccCreate(event) {
        let pageRef = {
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Account',
                actionName: 'new'
            }
        };
        this[NavigationMixin.Navigate](pageRef);
    }

    navAccCreateWithDefault(event) {
        const defaultValues = encodeDefaultFieldValues({
            Industry: "Energy",
            Rating: "Hot"
        });
        let pageRef = {
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Account',
                actionName: 'new'
            },
            state: {
                defaultFieldValues: defaultValues
            }
        };
        this[NavigationMixin.Navigate](pageRef);
    }

    navEditAcc() {
        let pageRef = {
            type: 'standard__recordPage',
            attributes: {
                recordId: '001gK00000QhIuXQAV',
                objectApiName: 'Account',
                actionName: 'edit'
            }
        };
        this[NavigationMixin.Navigate](pageRef);
    }
}