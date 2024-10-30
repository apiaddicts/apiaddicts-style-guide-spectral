module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  // Hostname must be a subdomain of the organization's domain name
  "servers": [
    {
      "url": "https://api-dev.apiquality.io/api-vehicular/v1"
    },
    {
      "url": "https://api-test.apiquality.io/api-vehicular/v1/"
    },
    {
      "url": "https://api.apiquality.io/api-vehicular/v1/"
    }
  ],
  "paths": { }
};
