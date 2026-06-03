import { ApiFeedbackInput, Button, StructuredForm } from "./form.js";
import { loadCachedCustomization } from "./load-cached-customization.js";
import { defaultStatusCode, Response, showPage } from "./utils.js";

await loadCachedCustomization();

const nameInput = new ApiFeedbackInput('name', 'text', 'Name:', 'Input Category Name', '/api/feedbacks/category-name');

class CreateCategoryForm extends StructuredForm {
    constructor() {
        super('category-create-form', '/api/categories', 'POST', [
            nameInput
        ], new Button('Create', '/img/confirm.svg', true), (res: Response): void => {
            window.location.href = '/categories';
        }, defaultStatusCode);
    }
}

const createCategoryForm = new CreateCategoryForm();

showPage();