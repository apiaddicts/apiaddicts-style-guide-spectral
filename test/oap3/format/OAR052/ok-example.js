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
                      "type": "number",
                      "format": "double"
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
                    "values": {
                      "type": "array",
                      "items": {
                        "type": "integer",
                        "format": "int64"
                      }
                    },
                    "products": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "price": {
                            "type": "number",
                            "format": "float"
                          }
                        }
                      }
                    },
                    "discount": {
                      "oneOf": [
                        {
                          "type": "number",
                          "format": "double"
                        },
                        {
                          "type": "integer",
                          "format": "int32"
                        }
                      ]
                    },
                    "summary": {
                      "allOf": [
                        {
                          "type": "number",
                          "format": "double"
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
        "type": "number",
        "format": "double"
      },
      "Quantity": {
        "type": "integer",
        "format": "int32"
      }
    }
  }
};