import { ApiFeedbackInput, Button, StructuredForm } from "./form.js";
import { loadCachedCustomization } from "./load-cached-customization.js";
import { Response, defaultStatusCode, getParameter, showPage } from "./utils.js";

await loadCachedCustomization();

const brandId = getParameter(/^.+\/brands\/(\d+)\/edit.*$/);

const nameInput = new ApiFeedbackInput('name', 'text', 'Name:', 'Input Supermarket Name', '/api/feedbacks/brand-name');

class EditSupermarketForm extends StructuredForm {
    constructor() {
        super('brand-edit-form', '/api/brands/{brandId}', 'PATCH', [
            nameInput,
        ], new Button('Edit', '/img/confirm.svg', true), (res: Response): void => {
            window.location.href = '/brands';
        }, defaultStatusCode, undefined, true);
    }

    async getUrl(): Promise<string> {
        return this.url.replace('{brandId}', brandId);
    }

    precompile(res: Response): void {
        nameInput.precompile(res.name);
    }
}

const editSupermarketForm = new EditSupermarketForm();

showPage();