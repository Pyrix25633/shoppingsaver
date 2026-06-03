import { Button, StructuredForm } from "./form.js";
import { Loader, Response, defaultStatusCode, getParameter } from "./utils.js";

Loader.loadCachedCustomization();

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

Loader.showPage();