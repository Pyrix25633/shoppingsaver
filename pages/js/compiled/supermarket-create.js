import { ApiFeedbackInput, Button, StructuredForm } from "./form.js";
import { defaultStatusCode, Loader } from "./utils.js";
Loader.loadCachedCustomization();
const nameInput = new ApiFeedbackInput('name', 'text', 'Name:', 'Input Supermarket Name', '/api/feedbacks/supermarket-name');
class CreateSupermarketForm extends StructuredForm {
    constructor() {
        super('supermarket-create-form', '/api/supermarkets', 'POST', [
            nameInput
        ], new Button('Create', '/img/confirm.svg', true), (res) => {
            window.location.href = '/supermarkets';
        }, defaultStatusCode);
    }
}
const createSupermarketForm = new CreateSupermarketForm();
Loader.showPage();
