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
          { "name": "item-id", "in": "path", "required": true, "schema": { "type": "string" } },
          { "name": "Page_Number", "in": "query", "schema": { "type": "string" } }
        ],
        "responses": {
          "200": { "description": "OK" }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "Product_Info": {
        "type": "object",
        "properties": {
          "product_name": { "type": "string" },
          "TotalCount": { "type": "number" }
        }
      }
    }
  }
};
