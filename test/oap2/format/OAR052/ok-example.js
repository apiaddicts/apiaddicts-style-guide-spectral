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
                "id": {
                  "type": "integer",
                  "format": "int64"
                },
                "amount": {
                  "type": "number",
                  "format": "double"
                },
                "prices": {
                  "type": "array",
                  "items": {
                    "type": "number",
                    "format": "float"
                  }
                },
                "customer": {
                  "type": "object",
                  "properties": {
                    "age": {
                      "type": "integer",
                      "format": "int32"
                    }
                  }
                },
                "products": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "productId": {
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
                "summary": {
                  "allOf": [
                    {
                      "type": "number",
                      "format": "double"
                    }
                  ]
                },
                "discount": {
                  "oneOf": [
                    {
                      "type": "integer",
                      "format": "int32"
                    },
                    {
                      "type": "number",
                      "format": "float"
                    }
                  ]
                }
              }
            }
          }
        }
      }
    }
  },
  "definitions": {
    "Price": {
      "type": "number",
      "format": "double"
    },
    "Quantity": {
      "type": "integer",
      "format": "int32"
    }
  }
};