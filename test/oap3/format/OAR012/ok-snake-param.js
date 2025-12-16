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
          { "name": "page_number", "in": "query", "schema": { "type": "string" } }
        ],
        "responses": { "200": { "description": "OK" } }
      }
    }
  },
  "components": {
    "schemas": {
      "product_info": {
        "type": "object",
        "properties": {
          "product_name": { "type": "string" }
        }
      }
    }
  }
};
