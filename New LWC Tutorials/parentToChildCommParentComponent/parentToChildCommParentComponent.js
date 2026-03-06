import { LightningElement } from 'lwc';

export default class ParentToChildCommParentComponent extends LightningElement {
    Message = 'This message comes from Parent Component';
    MessageforButton = 'This Message comes from Parent Component via button click';
    GetChitCode;
    clickHandler(event){
        this.GetChitCode = 'In Child JS create @api property and call that property in Child HTML. Now in Parent HTML call the Child component in kabab case and assign the value of the @api Child property with the newly created Parent property and assign the newly created Parent property with value in Parent JS.';
    }
}