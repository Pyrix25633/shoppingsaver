import { RedirectButton } from "./form.js";
import { IconLinkTableData, LinkTableHeader, StringTableData, Table, TableHeader, TableRow } from "./table.js";
import { Loader } from "./utils.js";
Loader.loadCachedCustomization();
class BrandsTable extends Table {
    constructor() {
        super('/api/brands', 'brands', null, [
            new TableHeader('Name', 'name'),
            new LinkTableHeader('Edit')
        ]);
    }
    parseElement(element) {
        return new BrandsTableRow(element);
    }
}
class BrandsTableRow extends TableRow {
    parseData(element) {
        return [
            new StringTableData(element.name),
            new IconLinkTableData(element.id, '/brands/{id}/edit', '/img/edit.svg')
        ];
    }
}
const brandsTable = new BrandsTable();
const createButton = new RedirectButton('Create Brand', '/img/create.svg', '/brands/create');
const backButton = new RedirectButton('Back', '/img/back.svg', '/');
