module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "OAR043 invalid type variants"
  },
  "paths": {
    "/orders": {
      "get": {
        "parameters": [
          {
            "name": "count",
            "in": "query",
            "schema": { "type": "int" }
          },
          {
            "name": "amount",
            "in": "query",
            "schema": { "type": "float" }
          }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  }
};
