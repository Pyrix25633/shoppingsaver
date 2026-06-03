import { ApiFeedbackInput, Button, StructuredForm } from "./form.js";
import { loadCachedCustomization } from "./load-cached-customization.js";
import { defaultStatusCode, Response, showPage } from "./utils.js";

await loadCachedCustomization();

const nameInput = new ApiFeedbackInput('name', 'text', 'Name:', 'Input Brand Name', '/api/feedbacks/brand-name');

class CreateBrandForm extends StructuredForm {
    constructor() {
        super('brand-create-form', '/api/brands', 'POST', [
            nameInput
        ], new Button('Create', '/img/confirm.svg', true), (res: Response): void => {
            window.location.href = '/brands';
        }, defaultStatusCode);
    }
}

const createBrandForm = new CreateBrandForm();

showPage();