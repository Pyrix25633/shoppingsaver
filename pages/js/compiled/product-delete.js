import { Button, StructuredForm } from "./form.js";
import { loadCustomization } from "./load-customization.js";
import { defaultStatusCode, getParameter, showPage } from "./utils.js";
await loadCustomization();
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
