module.exports = {
  "swagger": "2.0",
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
                      "format": "double"
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