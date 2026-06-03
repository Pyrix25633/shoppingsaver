import { RedirectButton } from "./form.js";
import { loadCachedCustomization } from "./load-cached-customization.js";
import { IconLinkTableData, LinkTableHeader, StringTableData, Table, TableHeader, TableRow } from "./table.js";
await loadCachedCustomization();
class CategoriesTable extends Table {
    constructor() {
        super('/api/categories', 'categories', null, [
            new TableHeader('Name', 'name'),
            new LinkTableHeader('Edit')
        ]);
    }
    parseElement(element) {
        return new CategoriesTableRow(element);
    }
}
class CategoriesTableRow extends TableRow {
    parseData(element) {
        return [
            new StringTableData(element.name),
            new IconLinkTableData(element.id, '/categories/{id}/edit', '/img/edit.svg')
        ];
    }
}
const categoriesTable = new CategoriesTable();
const createButton = new RedirectButton('Create Category', '/img/create.svg', '/categories/create');
const backButton = new RedirectButton('Back', '/img/back.svg', '/');
