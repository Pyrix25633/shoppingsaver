import { ApiDropdownInput, ApiMultiFieldFeedbackInput, Button, PriceInput, QuantityInput, StructuredForm, UnitOfMeasurementInput } from "./form.js";
import { defaultStatusCode, Loader, Response } from "./utils.js";

Loader.loadCachedCustomization();

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

class CreateProductForm extends StructuredForm {
    constructor() {
        super('product-create-form', '/api/products', 'POST', [
            nameInput,
            categoryInput,
            brandInput,
            quantityInput,
            itemPriceInput,
            unitOfMeasurementInput,
            supermarketInput
        ], new Button('Create', '/img/confirm.svg', true), (res: Response): void => {
            window.location.href = '/products';
        }, defaultStatusCode);
    }
}

const createProductForm = new CreateProductForm();

Loader.showPage();