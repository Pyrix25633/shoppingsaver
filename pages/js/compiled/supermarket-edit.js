import { ApiFeedbackInput, Button, StructuredForm } from "./form.js";
import { Loader, defaultStatusCode, getParameter } from "./utils.js";
Loader.loadCachedCustomization();
const supermarketId = getParameter(/^.+\/supermarkets\/(\d+)\/edit.*$/);
const nameInput = new ApiFeedbackInput('name', 'text', 'Name:', 'Input Supermarket Name', '/api/feedbacks/supermarket-name');
class EditSupermarketForm extends StructuredForm {
    constructor() {
        super('supermarket-edit-form', '/api/supermarkets/{supermarketId}', 'PATCH', [
            nameInput,
        ], new Button('Edit', '/img/confirm.svg', true), (res) => {
            window.location.href = '/supermarkets';
        }, defaultStatusCode, undefined, true);
    }
    async getUrl() {
        return this.url.replace('{supermarketId}', supermarketId);
    }
    precompile(res) {
        nameInput.precompile(res.name);
    }
}
const editSupermarketForm = new EditSupermarketForm();
Loader.showPage();
