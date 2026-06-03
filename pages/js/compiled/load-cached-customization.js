import { CssManager, Customization } from "./utils.js";
export async function loadCachedCustomization() {
    const cssManager = new CssManager();
    const customization = Customization.loadCached();
    await cssManager.applyStyle(customization);
    customization.cache();
    return customization;
}
