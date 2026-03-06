import { LightningElement, track } from 'lwc';
export default class MyFirstLWC extends LightningElement {
    greeting = "Hello";
    @track welcome = "Welcome to Bootcamp";

    clickHandler(event) {
        this.greeting = "Nameste";
        this.welcome = "Today is first day";
    }
}