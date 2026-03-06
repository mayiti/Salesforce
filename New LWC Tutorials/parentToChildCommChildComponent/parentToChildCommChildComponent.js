import { LightningElement,api } from 'lwc';

export default class ParentToChildCommChildComponent extends LightningElement {

    @api data;
    displaymsg = false;
    @api getdata;
    @api chitcode;

    clickHandler(event){
        this.displaymsg = true;
    }
}