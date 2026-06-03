import { ApiFeedbackInput, Button, StructuredForm } from "./form.js";
import { Loader, defaultStatusCode, getParameter } from "./utils.js";
Loader.loadCachedCustomization();
const brandId = getParameter(/^.+\/brands\/(\d+)\/edit.*$/);
const nameInput = new ApiFeedbackInput('name', 'text', 'Name:', 'Input Supermarket Name', '/api/feedbacks/brand-name');
class EditSupermarketForm extends StructuredForm {
    constructor() {
        super('brand-edit-form', '/api/brands/{brandId}', 'PATCH', [
            nameInput,
        ], new Button('Edit', '/img/confirm.svg', true), (res) => {
            window.location.href = '/brands';
        }, defaultStatusCode, undefined, true);
    }
    async getUrl() {
        return this.url.replace('{brandId}', brandId);
    }
    precompile(res) {
        nameInput.precompile(res.name);
    }
}
const editSupermarketForm = new EditSupermarketForm();
Loader.showPage();
