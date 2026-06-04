import { ApiFeedbackInput, Button, StructuredForm } from "./form.js";
import { defaultStatusCode, Loader } from "./utils.js";
Loader.loadCachedCustomization();
const nameInput = new ApiFeedbackInput('name', 'text', 'Name:', 'Input Item Name', '/api/feedbacks/item-name');
class AddItemForm extends StructuredForm {
    constructor() {
        super('item-add-form', '/api/list', 'POST', [
            nameInput
        ], new Button('Add', '/img/confirm.svg', true), (res) => {
            window.location.href = '/list';
        }, defaultStatusCode);
    }
}
const addItemForm = new AddItemForm();
Loader.showPage();
