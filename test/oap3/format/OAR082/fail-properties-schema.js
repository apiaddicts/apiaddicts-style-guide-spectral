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
            "description": "A invoice.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "product": {
                      "type": "string",
                      "format": "int128"
                    },
                    "line": {
                      "type": "string"
                    },
                    "price": {
                      "type": "string",
                      "format": "byte"
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
