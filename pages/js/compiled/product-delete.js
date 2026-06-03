import { Button, StructuredForm } from "./form.js";
import { loadCachedCustomization } from "./load-cached-customization.js";
import { defaultStatusCode, getParameter, showPage } from "./utils.js";
await loadCachedCustomization();
const productId = getParameter(/^.+\/products\/(\d+)\/delete.*$/);
class DeleteStockForm extends StructuredForm {
    constructor() {
        super('product-delete-form', '/api/products/{productId}', 'DELETE', [], new Button('Delete', '/img/confirm.svg', true), (res) => {
            window.location.href = '/products';
        }, defaultStatusCode, undefined);
    }
    async getUrl() {
        return this.url.replace('{productId}', productId);
    }
}
const deleteStockForm = new DeleteStockForm();
showPage();
