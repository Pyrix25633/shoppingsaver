function navigateToErrorPage(req) {
    window.location.href = '/error?code=' + req.status + '&message=' + req.statusText;
}
export const pendingActionKey = 'pendingAction';
export const defaultStatusCode = {
    400: (req) => {
        navigateToErrorPage(req);
    },
    401: () => {
        localStorage.setItem(pendingActionKey, window.location.pathname);
        window.location.href = '/login';
    },
    403: (req) => {
        navigateToErrorPage(req);
    },
    404: (req) => {
        navigateToErrorPage(req);
    },
    405: (req) => {
        navigateToErrorPage(req);
    },
    422: (req) => {
        navigateToErrorPage(req);
    },
    500: (req) => {
        navigateToErrorPage(req);
    }
};
export const imageButtonAnimationKeyframes = [
    { transform: 'scale(0.6)' },
    { transform: 'scale(1.4)' },
    { transform: 'scale(1)' }
];
export const imageButtonAnimationOptions = {
    duration: 250
};
export class RequireNonNull {
    static getElementById(id) {
        const element = document.getElementById(id);
        if (element != null)
            return element;
        throw new Error('No element found with id: ' + id);
    }
    static parse(value) {
        if (value == null)
            throw new Error('Null not allowed');
        return value;
    }
}
export class Auth {
    static cookieName = 'shoppingsaver-auth';
    static getCookie() {
        const match = document.cookie.match(new RegExp(Auth.cookieName + "=(.+?)(?:;|$)"));
        if (match == null)
            throw new Error('Auth Cookie not found!');
        return match[1];
    }
    static async validateToken() {
        return new Promise((resolve) => {
            $.ajax({
                url: '/api/auth/validate-token',
                method: 'GET',
                success: (res) => {
                    if (res.valid)
                        resolve();
                    else {
                        localStorage.setItem(pendingActionKey, window.location.pathname);
                        window.location.href = '/login';
                    }
                },
                statusCode: defaultStatusCode
            });
        });
    }
}
const cachedCustomizationKey = 'cachedCustomization';
export class Customization {
    compactMode;
    condensedFont;
    aurebeshFont;
    sharpMode;
    constructor(json) {
        this.compactMode = json?.compactMode ?? false;
        this.condensedFont = json?.condensedFont ?? false;
        this.aurebeshFont = json?.aurebeshFont ?? false;
        this.sharpMode = json?.sharpMode ?? false;
    }
    static loadCached() {
        return new Customization(JSON.parse(localStorage.getItem(cachedCustomizationKey) ?? 'null'));
    }
    static async get() {
        return new Promise((resolve) => {
            $.ajax({
                url: '/api/settings/customization',
                method: 'GET',
                success: (res) => {
                    resolve(new Customization(res));
                },
                statusCode: defaultStatusCode
            });
        });
    }
    cache() {
        localStorage.setItem(cachedCustomizationKey, JSON.stringify(this));
    }
}
export class CssManager {
    compactModeCssLink;
    sharpModeCssLink;
    fontCssLink;
    constructor() {
        this.compactModeCssLink = RequireNonNull.getElementById('compact-mode-css');
        this.sharpModeCssLink = RequireNonNull.getElementById('sharp-mode-css');
        this.fontCssLink = RequireNonNull.getElementById('font-css');
    }
    async applyStyle(customization) {
        const compactMode = new Promise((resolve) => {
            this.compactModeCssLink.onload = () => { resolve(); };
            this.compactModeCssLink.href = CssManager.buildLink('compact-mode', customization.compactMode);
        });
        const sharpMode = new Promise((resolve) => {
            this.sharpModeCssLink.onload = () => { resolve(); };
            this.sharpModeCssLink.href = CssManager.buildLink('sharp-mode', customization.sharpMode);
        });
        const font = new Promise((resolve) => {
            this.fontCssLink.onload = () => { resolve(); };
            this.fontCssLink.href = CssManager.buildLink((customization.aurebeshFont ? 'aurebesh' : 'roboto') + '-condensed', customization.condensedFont);
        });
        await compactMode;
        await sharpMode;
        await font;
    }
    static buildLink(name, on) {
        return '/css/' + name + '-' + (on ? 'on' : 'off') + '.css';
    }
}
export function getParameter(regExp) {
    const match = window.location.href.match(regExp);
    if (match == null) {
        window.location.href = '/error?code=400&message=Bad%20Request';
        throw new Error('Invalid Parameter!');
    }
    return match[1];
}
export class Loader {
    static cssLoader;
    static loadCachedCustomization() {
        this.cssLoader = new Promise(async (resolve) => {
            const cssManager = new CssManager();
            const customization = Customization.loadCached();
            await cssManager.applyStyle(customization);
            customization.cache();
            resolve(customization);
        });
    }
    static loadCustomization() {
        this.cssLoader = new Promise(async (resolve) => {
            const cssManager = new CssManager();
            await Auth.validateToken();
            const customization = await Customization.get();
            await cssManager.applyStyle(customization);
            customization.cache();
            resolve(customization);
        });
    }
    static async showPage() {
        if (this.cssLoader != undefined)
            await this.cssLoader;
        jQuery(() => {
            document.body.hidden = false;
        });
    }
}
