module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  // Hostname must be a subdomain of the organization's domain name (fail)
  "servers": [
    {
      // invalid domain: openfinance.es
      "url": "https://api-dev.openfinance.es/api-vehicular/v1/"
    },
    {
      // Valid domain apiquality.io, but requires a subdomain
      "url": "https://apiquality.io/api-vehicular/v1/"
    }
  ],
  "paths": { }
};
