import { RedirectButton } from "./form.js";
import { Loader, RequireNonNull } from "./utils.js";

Loader.loadCachedCustomization();

const indexDiv = RequireNonNull.getElementById('index');

const settingsButton = new RedirectButton('Settings', '/img/settings.svg', '/settings', false);
settingsButton.appendTo(indexDiv);
const categoriesButton = new RedirectButton('Categories', '/img/categories.svg', '/categories', false);
categoriesButton.appendTo(indexDiv);
const brandsButton = new RedirectButton('Brands', '/img/brands.svg', '/brands', false);
brandsButton.appendTo(indexDiv);
const supermarketsButton = new RedirectButton('Supermarkets', '/img/supermarkets.svg', '/supermarkets', false);
supermarketsButton.appendTo(indexDiv);
const productsButton = new RedirectButton('Products', '/img/products.svg', '/products', false);
productsButton.appendTo(indexDiv);
const listButton = new RedirectButton('List', '/img/list.svg', '/list', false);
listButton.appendTo(indexDiv);

Loader.showPage();