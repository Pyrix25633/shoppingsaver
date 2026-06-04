import { Button, StructuredForm } from "./form.js";
import { Loader, defaultStatusCode, getParameter } from "./utils.js";
Loader.loadCachedCustomization();
const productId = getParameter(/^.+\/products\/(\d+)\/delete.*$/);
class DeleteProductForm extends StructuredForm {
    constructor() {
        super('product-delete-form', '/api/products/{productId}', 'DELETE', [], new Button('Delete', '/img/confirm.svg', true), (res) => {
            window.location.href = '/products';
        }, defaultStatusCode, undefined);
    }
    async getUrl() {
        return this.url.replace('{productId}', productId);
    }
}
const deleteProductForm = new DeleteProductForm();
Loader.showPage();
