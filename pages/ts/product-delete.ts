import { Button, StructuredForm } from "./form.js";
import { loadCustomization } from "./load-customization.js";
import { Response, defaultStatusCode, getParameter, showPage } from "./utils.js";

await loadCustomization();

const productId = getParameter(/^.+\/products\/(\d+)\/delete.*$/);

class DeleteStockForm extends StructuredForm {
    constructor() {
        super('product-delete-form', '/api/products/{productId}', 'DELETE', [], new Button('Delete', '/img/confirm.svg', true), (res: Response): void => {
            window.location.href = '/products';
        }, defaultStatusCode, undefined);
    }

    async getUrl(): Promise<string> {
        return this.url.replace('{productId}', productId);
    }
}

const deleteStockForm = new DeleteStockForm();

showPage();