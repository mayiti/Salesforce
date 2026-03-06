import { LightningElement } from 'lwc';
export default class GenerateFullName extends LightningElement {
    firstN = " ";
    lastN = " ";
    fullName = " ";
    displayOutput = false;
    changeHandler(event) {
        let { name, value } = event.target;
        if (name === 'fname') {
            this.firstN = value;
        }
        else if (name === 'lname') {
            this.lastN = value;
        }
    }
    clickHandler(event) {
        this.displayOutput = true;
        this.fullName = this.firstN + ' ' + this.lastN;
        //console.log('Full Name ', this.fullName);
    }
}