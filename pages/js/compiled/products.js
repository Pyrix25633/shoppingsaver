import { ApiDropdownInput, PriceVisibilityInput, RedirectButton, StringFilterInput } from "./form.js";
import { loadCustomization } from "./load-customization.js";
import { FilteredTable, IconLinkTableData, LinkTableHeader, PriceTableData, QuantityTableData, StringTableData, TableHeader, TableRow } from "./table.js";
import { showPage } from "./utils.js";
await loadCustomization();
class CategoriesTable extends FilteredTable {
    constructor() {
        super('/api/products', 'products', null, [
            new TableHeader('Category', 'category][name'),
            new TableHeader('Name', 'name'),
            new TableHeader('Brand', 'brand][name'),
            new TableHeader('Quantity', 'quantity'),
            new TableHeader('Item Price', 'itemPrice'),
            new TableHeader('Price', 'price'),
            new TableHeader('Supermarket', 'supermarket][name'),
            new LinkTableHeader('Edit'),
            new LinkTableHeader('Delete'),
        ], [
            new ApiDropdownInput('categoryId', 'Category:', '/api/categories', () => { }, true),
            new StringFilterInput('name', 'Name:'),
            new ApiDropdownInput('supermarketId', 'Supermarket:', '/api/supermarkets', () => { }, true),
            new PriceVisibilityInput('priceVisibility', 'Price:')
        ]);
    }
    parseElement(element) {
        return new CategoriesTableRow(element);
    }
}
class CategoriesTableRow extends TableRow {
    parseData(element) {
        return [
            new StringTableData(element.category.name),
            new StringTableData(element.name),
            new StringTableData(element.brand.name),
            new QuantityTableData({ quantity: element.quantity, unitOfMeasurement: element.unitOfMeasurement }),
            new PriceTableData({ price: parseFloat(element.itemPrice) }),
            new PriceTableData({ price: parseFloat(element.price), unitOfMeasurement: element.unitOfMeasurement }),
            new StringTableData(element.supermarket.name),
            new IconLinkTableData(element.id, '/products/{id}/edit', '/img/edit.svg'),
            new IconLinkTableData(element.id, '/products/{id}/delete', '/img/delete.svg')
        ];
    }
}
const productsTable = new CategoriesTable();
const createButton = new RedirectButton('Create Product', '/img/create.svg', '/products/create');
const backButton = new RedirectButton('Back', '/img/back.svg', '/');
showPage();
