module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/invoices": {
      "get": {
        "responses": {
          "200": {
            "description": "An invoice.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "amount": {
                      "type": "number",
                      "format": "decimal"
                    },
                    "nested": {
                      "type": "object",
                      "properties": {
                        "productId": {
                          "type": "integer",
                          "format": "big"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};