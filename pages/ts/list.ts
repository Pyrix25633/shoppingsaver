import { RedirectButton } from "./form.js";
import { IconToggleTableData, LinkTableHeader, StringTableData, Table, TableData, TableHeader, TableRow } from "./table.js";
import { Loader } from "./utils.js";

Loader.loadCachedCustomization();

type Item = {
    id: number;
    name: string;
    checked: boolean;
};

class ListTable extends Table {
    public constructor() {
        super('/api/list', 'list', null, [
            new LinkTableHeader('Checked'),
            new TableHeader('Name', 'name')
        ]);
    }

    public parseElement(element: Item): TableRow {
        return new ListTableRow(element);
    }
}

class ListTableRow extends TableRow {
    public parseData(element: Item): TableData<any>[] {
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