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
                  "type": "object",
                  "properties": {
                    "quantity": {
                      "type": "integer"
                    },
                    "price": {
                      "type": "number",
                      "format": "double"
                    },
                    "nested": {
                      "type": "object",
                      "properties": {
                        "count": {
                          "type": "integer",
                          "format": "int64"
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