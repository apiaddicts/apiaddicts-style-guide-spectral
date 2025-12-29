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
                    "total": {
                      "type": "number"
                    },
                    "customer": {
                      "type": "object",
                      "properties": {
                        "age": {
                          "type": "integer"
                        }
                      }
                    },
                    "values": {
                      "type": "array",
                      "items": {
                        "type": "integer"
                      }
                    },
                    "products": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "price": {
                            "type": "number"
                          }
                        }
                      }
                    },
                    "discount": {
                      "oneOf": [
                        {
                          "type": "number"
                        },
                        {
                          "type": "integer"
                        }
                      ]
                    },
                    "summary": {
                      "allOf": [
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
      }
    }
  },
  "components": {
    "schemas": {
      "Price": {
        "type": "number"
      },
      "Quantity": {
        "type": "integer"
      }
    }
  }
};