import { ApiFeedbackInput, Button, StructuredForm } from "./form.js";
import { loadCustomization } from "./load-customization.js";
import { defaultStatusCode, showPage } from "./utils.js";
await loadCustomization();
const nameInput = new ApiFeedbackInput('name', 'text', 'Name:', 'Input Category Name', '/api/feedbacks/category-name');
class CreateCategoryForm extends StructuredForm {
    constructor() {
        super('category-create-form', '/api/categories', 'POST', [
            nameInput
        ], new Button('Create', '/img/confirm.svg', true), (res) => {
            window.location.href = '/categories';
        }, defaultStatusCode);
    }
}
const createCategoryForm = new CreateCategoryForm();
showPage();
