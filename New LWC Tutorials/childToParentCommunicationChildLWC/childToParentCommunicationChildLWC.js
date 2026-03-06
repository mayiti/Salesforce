import { LightningElement } from 'lwc';
export default class ChildToParentCommunicationChildLWC extends LightningElement {
    clickHandler(event) {
        let mycustomevent = new CustomEvent("displaymsg");
        this.dispatchEvent(mycustomevent);
    }

    mouseHandler(event){
    let mycustomevent = new CustomEvent("meesageforparent",{
        detail: "This message comes from Child Component"
    });
    this.dispatchEvent(mycustomevent);
}

chitHandler(event){
    let mycustomevent = new CustomEvent("chitforctpcomm",{
        detail: "In Child HTML create handler and then in child Js ceate and dispatch the custom event either 1) send message in detail (msg in child) or 2) in property (msg in parent). Now in Parent HTML call the Child in kabab case follow by custom dispatch event prefix by 'on' which call event. Now in Parent JS the event which is called from HTML either 1) create a property and populate the value by event.detail and then use that property in para tag (msg store in Child). 2) Use boolean value to show the message which is created in para tag in Parent(msg store in Parent)."
    });
    this.dispatchEvent(mycustomevent);
}
}