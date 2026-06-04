module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "OAR043 fail"
  },
  "paths": {
    "/orders": {
      "get": {
        "parameters": [
          {
            "name": "status",
            "in": "headers",
            "required": false,
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    },
    "/orders/{id}": {
      "get": {
        "parameters": [
          {
            "in": "path",
            "name": "id",
            "required": true,
            "schema": { "type": "integer64" }
          }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  }
};
