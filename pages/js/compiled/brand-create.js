import { ApiFeedbackInput, Button, StructuredForm } from "./form.js";
import { defaultStatusCode, Loader } from "./utils.js";
Loader.loadCachedCustomization();
const nameInput = new ApiFeedbackInput('name', 'text', 'Name:', 'Input Brand Name', '/api/feedbacks/brand-name');
class CreateBrandForm extends StructuredForm {
    constructor() {
        super('brand-create-form', '/api/brands', 'POST', [
            nameInput
        ], new Button('Create', '/img/confirm.svg', true), (res) => {
            window.location.href = '/brands';
        }, defaultStatusCode);
    }
}
const createBrandForm = new CreateBrandForm();
Loader.showPage();
