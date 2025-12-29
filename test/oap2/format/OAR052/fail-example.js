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
                  "type": "integer"
                },
                "amount": {
                  "type": "number"
                },
                "prices": {
                  "type": "array",
                  "items": {
                    "type": "number"
                  }
                },
                "customer": {
                  "type": "object",
                  "properties": {
                    "age": {
                      "type": "integer"
                    }
                  }
                },
                "products": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "productId": {
                        "type": "integer"
                      },
                      "price": {
                        "type": "number"
                      }
                    }
                  }
                },
                "summary": {
                  "allOf": [
                    {
                      "type": "number"
                    }
                  ]
                },
                "discount": {
                  "oneOf": [
                    {
                      "type": "integer"
                    },
                    {
                      "type": "number"
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
      "type": "number"
    },
    "Quantity": {
      "type": "integer"
    }
  }
};