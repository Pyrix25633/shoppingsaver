import { RedirectButton } from "./form.js";
import { loadCustomization } from "./load-customization.js";
import { IconLinkTableData, LinkTableHeader, StringTableData, Table, TableHeader, TableRow } from "./table.js";
import { showPage } from "./utils.js";
await loadCustomization();
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
showPage();
