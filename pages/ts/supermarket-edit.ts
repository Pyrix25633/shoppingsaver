import { ApiFeedbackInput, Button, StructuredForm } from "./form.js";
import { loadCustomization } from "./load-customization.js";
import { Response, defaultStatusCode, getParameter, showPage } from "./utils.js";

await loadCustomization();

const supermarketId = getParameter(/^.+\/supermarkets\/(\d+)\/edit.*$/);

const nameInput = new ApiFeedbackInput('name', 'text', 'Name:', 'Input Supermarket Name', '/api/feedbacks/supermarket-name');

class EditSupermarketForm extends StructuredForm {
    constructor() {
        super('supermarket-edit-form', '/api/supermarkets/{supermarketId}', 'PATCH', [
            nameInput,
        ], new Button('Edit', '/img/confirm.svg', true), (res: Response): void => {
            window.location.href = '/supermarkets';
        }, defaultStatusCode, undefined, true);
    }

    async getUrl(): Promise<string> {
        return this.url.replace('{supermarketId}', supermarketId);
    }

    precompile(res: Response): void {
        nameInput.precompile(res.name);
    }
}

const editSupermarketForm = new EditSupermarketForm();

showPage();