import { LightningElement } from 'lwc';

export default class ChildLMS extends LightningElement {
    clickHandler(){
        let mycustomevent = new CustomEvent("fire",{
            bubbles : true,                //it indicate whether the event bubbles up through the DOM or not- if true it bubbles up
            composed: true                  //it indicate whether the event can pass through the shadow boundary or not- if true it cross throuht the shadow boundary
        });
        this.dispatchEvent(mycustomevent);
    }
}