import { loadCachedCustomization } from "./load-cached-customization.js";
import { showPage } from "./utils.js";
await loadCachedCustomization();
showPage();
