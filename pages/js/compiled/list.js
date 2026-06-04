import { RedirectButton } from "./form.js";
import { IconToggleTableData, LinkTableHeader, StringTableData, Table, TableHeader, TableRow } from "./table.js";
import { Loader } from "./utils.js";
Loader.loadCachedCustomization();
class ListTable extends Table {
    constructor() {
        super('/api/list', 'list', null, [
            new LinkTableHeader('Checked'),
            new TableHeader('Name', 'name')
        ]);
    }
    parseElement(element) {
        return new ListTableRow(element);
    }
}
class ListTableRow extends TableRow {
    parseData(element) {
        return [
            new IconToggleTableData(element.id, element.checked, 'api/list/{id}/toggle', listTable, '/img/unchecked.svg', '/img/checked.svg'),
            new StringTableData(element.name)
        ];
    }
}
const listTable = new ListTable();
const createButton = new RedirectButton('Add Item', '/img/create.svg', '/list/add');
const deleteChecked = new RedirectButton('Delete Checked', '/img/confirm.svg', '/list/delete');
const backButton = new RedirectButton('Back', '/img/back.svg', '/');
