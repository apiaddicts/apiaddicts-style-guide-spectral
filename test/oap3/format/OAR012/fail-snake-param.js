module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/items": {
      "get": {
        "parameters": [
          { "name": "itemId", "in": "path", "required": true, "schema": { "type": "string" } },
          { "name": "page-number", "in": "query", "schema": { "type": "string" } }
        ],
        "responses": { "200": { "description": "OK" } }
      }
    }
  },
  "components": {
    "schemas": {
      "ProductInfo": {
        "type": "object",
        "properties": {
          "productName": { "type": "string" }
        }
      }
    }
  }
};
