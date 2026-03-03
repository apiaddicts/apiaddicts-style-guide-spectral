module.exports = {
  "swagger": "2.0",
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
            "schema": {
              "type": "object",
              "properties": {
                "quantity": {
                  "type": "integer",
                  "format": "int32"
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
};