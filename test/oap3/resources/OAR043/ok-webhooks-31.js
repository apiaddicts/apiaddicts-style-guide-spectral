module.exports = {
  "openapi": "3.1.0",
  "info": {
    "version": "1.0.0",
    "title": "OAR043 ok webhooks"
  },
  "paths": {},
  "webhooks": {
    "orderCreated": {
      "post": {
        "parameters": [
          {
            "name": "status",
            "in": "query",
            "schema": { "type": ["string", "null"] }
          }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  }
};
