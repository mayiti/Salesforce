import { LightningElement,wire } from 'lwc';
import fetchAccountData from '@salesforce/apex/FetchAccountForWireProperty.fetchAccountData';
const columns = [
{label: 'Account Name', fieldName: "Name"},
{label: 'Account Rating', fieldName: "Rating"},
{label: 'Account Industry', fieldName: "Industry" }
];
export default class WireDecoratorProperty extends LightningElement {
columns = columns;
@wire(fetchAccountData) accounts;
}