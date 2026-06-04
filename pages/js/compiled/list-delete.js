import { Button, StructuredForm } from "./form.js";
import { Loader, defaultStatusCode } from "./utils.js";
Loader.loadCachedCustomization();
class DeleteStockForm extends StructuredForm {
    constructor() {
        super('list-delete-form', '/api/list', 'DELETE', [], new Button('Delete', '/img/confirm.svg', true), (res) => {
            window.location.href = '/list';
        }, defaultStatusCode, undefined);
    }
}
const deleteStockForm = new DeleteStockForm();
Loader.showPage();
