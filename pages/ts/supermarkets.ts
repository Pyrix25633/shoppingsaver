import { RedirectButton } from "./form.js";
import { IconLinkTableData, LinkTableHeader, StringTableData, Table, TableData, TableHeader, TableRow } from "./table.js";
import { Loader } from "./utils.js";

Loader.loadCachedCustomization();

type Supermarket = {
    id: number;
    name: string;
};

class SupermarketsTable extends Table {
    public constructor() {
        super('/api/supermarkets', 'supermarkets', null, [
            new TableHeader('Name', 'name'),
            new LinkTableHeader('Edit')
        ]);
    }

    public parseElement(element: Supermarket): TableRow {
        return new SupermarketsTableRow(element);
    }
}

class SupermarketsTableRow extends TableRow {
    public parseData(element: Supermarket): TableData<any>[] {
        return [
            new StringTableData(element.name),
            new IconLinkTableData(element.id, '/supermarkets/{id}/edit', '/img/edit.svg')
        ];
    }
}

const supermarketsTable = new SupermarketsTable();

const createButton = new RedirectButton('Create Supermarket', '/img/create.svg', '/supermarkets/create');
const backButton = new RedirectButton('Back', '/img/back.svg', '/');