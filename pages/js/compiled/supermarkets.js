import { RedirectButton } from "./form.js";
import { IconLinkTableData, LinkTableHeader, StringTableData, Table, TableHeader, TableRow } from "./table.js";
import { Loader } from "./utils.js";
Loader.loadCachedCustomization();
class CategoriesTable extends Table {
    constructor() {
        super('/api/supermarkets', 'supermarkets', null, [
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
            new IconLinkTableData(element.id, '/supermarkets/{id}/edit', '/img/edit.svg')
        ];
    }
}
const supermarketsTable = new CategoriesTable();
const createButton = new RedirectButton('Create Supermarket', '/img/create.svg', '/supermarkets/create');
const backButton = new RedirectButton('Back', '/img/back.svg', '/');
