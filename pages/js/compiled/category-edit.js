import { ApiFeedbackInput, Button, StructuredForm } from "./form.js";
import { Loader, defaultStatusCode, getParameter } from "./utils.js";
Loader.loadCachedCustomization();
const categoryId = getParameter(/^.+\/categories\/(\d+)\/edit.*$/);
const nameInput = new ApiFeedbackInput('name', 'text', 'Name:', 'Input Category Name', '/api/feedbacks/category-name');
class EditCategoryForm extends StructuredForm {
    constructor() {
        super('category-edit-form', '/api/categories/{categoryId}', 'PATCH', [
            nameInput,
        ], new Button('Edit', '/img/confirm.svg', true), (res) => {
            window.location.href = '/categories';
        }, defaultStatusCode, undefined, true);
    }
    async getUrl() {
        return this.url.replace('{categoryId}', categoryId);
    }
    precompile(res) {
        nameInput.precompile(res.name);
    }
}
const editCategoryForm = new EditCategoryForm();
Loader.showPage();
