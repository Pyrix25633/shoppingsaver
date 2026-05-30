import { RedirectButton } from "./form.js";
import { loadCustomization } from "./load-customization.js";
import { IconLinkTableData, LinkTableHeader, StringTableData, Table, TableData, TableHeader, TableRow } from "./table.js";
import { showPage } from "./utils.js";

await loadCustomization();

type Brand = {
    id: number;
    name: string;
};

class CategoriesTable extends Table {
    public constructor() {
        super('/api/brands', 'brands', null, [
            new TableHeader('Name', 'name'),
            new LinkTableHeader('Edit')
        ]);
    }

    public parseElement(element: Brand): TableRow {
        return new CategoriesTableRow(element);
    }
}

class CategoriesTableRow extends TableRow {
    public parseData(element: Brand): TableData<any>[] {
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