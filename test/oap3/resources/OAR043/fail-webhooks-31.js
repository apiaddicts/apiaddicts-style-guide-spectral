module.exports = {
  "openapi": "3.1.0",
  "info": {
    "version": "1.0.0",
    "title": "OAR043 fail webhooks"
  },
  "paths": {},
  "webhooks": {
    "orderCreated": {
      "post": {
        "parameters": [
          {
            "name": "status",
            "in": "headers",
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  }
};
