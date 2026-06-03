import { RedirectButton } from "./form.js";
import { loadCachedCustomization } from "./load-cached-customization.js";
import { IconLinkTableData, LinkTableHeader, StringTableData, Table, TableHeader, TableRow } from "./table.js";
await loadCachedCustomization();
class CategoriesTable extends Table {
    constructor() {
        super('/api/brands', 'brands', null, [
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
            new IconLinkTableData(element.id, '/brands/{id}/edit', '/img/edit.svg')
        ];
    }
}
const brandsTable = new CategoriesTable();
const createButton = new RedirectButton('Create Brand', '/img/create.svg', '/brands/create');
const backButton = new RedirectButton('Back', '/img/back.svg', '/');
