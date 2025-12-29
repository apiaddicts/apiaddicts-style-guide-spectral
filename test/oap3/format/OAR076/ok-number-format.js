module.exports = {
  "openapi": "3.0.1",
  "info": {
    "title": "Swagger Petstore",
    "version": "1.0.0"
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
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "products": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "productId": {
                              "type": "integer",
                              "format": "int32"
                            },
                            "quantity": {
                              "type": "integer",
                              "format": "int32"
                            },
                            "price": {
                              "type": "number",
                              "format": "double"
                            }
                          }
                        }
                      },
                      "amount": {
                        "type": "number",
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
  }
};
