import { RedirectButton } from "./form.js";
import { loadCachedCustomization } from "./load-cached-customization.js";
import { IconLinkTableData, LinkTableHeader, StringTableData, Table, TableData, TableHeader, TableRow } from "./table.js";

await loadCachedCustomization();

type Supermarket = {
    id: number;
    name: string;
};

class CategoriesTable extends Table {
    public constructor() {
        super('/api/supermarkets', 'supermarkets', null, [
            new TableHeader('Name', 'name'),
            new LinkTableHeader('Edit')
        ]);
    }

    public parseElement(element: Supermarket): TableRow {
        return new CategoriesTableRow(element);
    }
}

class CategoriesTableRow extends TableRow {
    public parseData(element: Supermarket): TableData<any>[] {
        return [
            new StringTableData(element.name),
            new IconLinkTableData(element.id, '/supermarkets/{id}/edit', '/img/edit.svg')
        ];
    }
}

const supermarketsTable = new CategoriesTable();

const createButton = new RedirectButton('Create Supermarket', '/img/create.svg', '/supermarkets/create');
const backButton = new RedirectButton('Back', '/img/back.svg', '/');