export const environment = {
  production: true,
  apiHost: 'http://localhost:8080',
  apiPrefix: '/api/v1.0',

  get apiHostUrl() {
    return this.apiHost + this.apiPrefix;
  }
};
