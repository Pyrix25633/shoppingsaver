export const settings = {
    https: {
        cert: "certs/cert.pem",
        key: "certs/key.pem",
        passphrase: "",
        suppressRejectUnauthorized: true,
        hostname: "",
        port: 4443,
        upgradePort: 8080
    },
    jwt: {
        cookieName: "shoppingsaver-auth",
        password: "",
        algorithm: "HS512"
    },
    bcrypt: {
        rounds: 12
    },
    tfa: {
        algorithm: 'SHA512',
        window: 2
    },
    sequenzy: {
        apiKey: ""
    },
    database: {
        host: 'localhost',
        port: 3306,
        user: '',
        password: '',
        name: 'ShoppingSaver',
        pageSize: 10
    },
    production: false
};