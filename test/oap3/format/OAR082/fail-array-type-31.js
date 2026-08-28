module.exports = {
  "openapi": "3.1.1",
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
                      "type": ["string", "null"]
                    },
                    "line": {
                      "type": ["string", "null"],
                      "contentEncoding": "base64"
                    },
                    "price": {
                      "type": "string",
                      "format": "binary"
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
