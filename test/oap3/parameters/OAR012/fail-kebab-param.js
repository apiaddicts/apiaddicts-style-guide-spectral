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
          { "name": "item_id", "in": "path", "required": true, "schema": { "type": "string" } },
          { "name": "pageNumber", "in": "query", "schema": { "type": "string" } }
        ],
        "responses": { "200": { "description": "OK" } }
      }
    }
  },
  "components": {
    "schemas": {
      "productInfo": {
        "type": "object",
        "properties": {
          "product_name": { "type": "string" }
        }
      }
    }
  }
};
