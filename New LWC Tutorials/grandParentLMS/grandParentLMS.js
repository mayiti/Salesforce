import { LightningElement } from 'lwc';

export default class GrandParentLMS extends LightningElement {

    fireChildhandler(){
        console.log('Event Handled in Grand Parent Component it cross the shadow boundary');
    }
}