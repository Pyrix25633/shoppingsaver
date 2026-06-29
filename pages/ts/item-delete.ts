import { Button, StructuredForm } from "./form.js";
import { Loader, Response, defaultStatusCode, getParameter } from "./utils.js";

Loader.loadCachedCustomization();

const productId = getParameter(/^.+\/list\/(\d+)\/delete.*$/);

class DeleteItemForm extends StructuredForm {
    constructor() {
        super('item-delete-form', '/api/list/{itemId}', 'DELETE', [], new Button('Delete', '/img/confirm.svg', true), (res: Response): void => {
            window.location.href = '/list';
        }, defaultStatusCode, undefined);
    }

    async getUrl(): Promise<string> {
        return this.url.replace('{itemId}', productId);
    }
}

const deleteItemForm = new DeleteItemForm();

Loader.showPage();