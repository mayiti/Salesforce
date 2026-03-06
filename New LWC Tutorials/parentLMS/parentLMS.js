import { LightningElement } from 'lwc';

export default class ParentLMS extends LightningElement {

    firechildhandler(){
        console.log('Event Handled in Parent Component at Child level also called as Shadow DOM');
    }

    firechildDivhandler(){
        console.log('Event Handled in Parent Component at Parent Div level also called as DOM on Parent Component');
    }
}