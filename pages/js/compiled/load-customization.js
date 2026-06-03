import { Auth, CssManager, Customization } from "./utils.js";
export async function loadCustomization() {
    const cssManager = new CssManager();
    await Auth.validateToken();
    const customization = await Customization.get();
    await cssManager.applyStyle(customization);
    customization.cache();
    return customization;
}
