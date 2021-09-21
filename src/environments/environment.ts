export const environment = {
    production: false,
    apiHost: 'http://localhost:8080',
    apiPrefix: '/api/v1.0',

    get apiHostUrl() {
        return this.apiHost + this.apiPrefix;
    }
};
