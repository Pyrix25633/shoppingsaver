import { ApiDropdownInput, ApiMultiFieldFeedbackInput, Button, PriceInput, QuantityInput, StructuredForm, UnitOfMeasurementInput } from "./form.js";
import { loadCachedCustomization } from "./load-cached-customization.js";
import { Response, defaultStatusCode, getParameter, showPage } from "./utils.js";

await loadCachedCustomization();

const productId = getParameter(/^.+\/products\/(\d+)\/edit.*$/);

function refresh() {
    if(nameInput.getInputValue() != '')
        nameInput.parse();
}

const categoryInput = new ApiDropdownInput('categoryId', 'Category:', '/api/categories');
const brandInput = new ApiDropdownInput('brandId', 'Brand:', '/api/brands', refresh);
const quantityInput = new QuantityInput('quantity', 'Quantity:', 'Input Quantity');
const itemPriceInput = new PriceInput('itemPrice', 'Item Price:', 'Input Item Price');
const unitOfMeasurementInput = new UnitOfMeasurementInput('unitOfMeasurement', 'Unit:');
const supermarketInput = new ApiDropdownInput('supermarketId', 'Supermarket:', '/api/supermarkets', refresh);
const nameInput = new ApiMultiFieldFeedbackInput('name', 'text', 'Name:', 'Input Product Name', '/api/feedbacks/product-name', [brandInput, supermarketInput], '/products/{productId}/edit', 'edit here');

class EditSupermarketForm extends StructuredForm {
    constructor() {
        super('product-edit-form', '/api/products/{productId}', 'PATCH', [
            nameInput,
            categoryInput,
            brandInput,
            quantityInput,
            itemPriceInput,
            unitOfMeasurementInput,
            supermarketInput
        ], new Button('Edit', '/img/confirm.svg', true), (res: Response): void => {
            window.location.href = '/products';
        }, defaultStatusCode, undefined, true);
    }

    async getUrl(): Promise<string> {
        return this.url.replace('{productId}', productId);
    }

    precompile(res: Response): void {
        nameInput.precompile(res.name);
        categoryInput.precompile(res.categoryId);
        brandInput.precompile(res.brandId);
        quantityInput.precompile(res.quantity);
        itemPriceInput.precompile(res.itemPrice);
        unitOfMeasurementInput.precompile(res.unitOfMeasurement);
        supermarketInput.precompile(res.supermarketId);
    }
}

const editSupermarketForm = new EditSupermarketForm();

showPage();