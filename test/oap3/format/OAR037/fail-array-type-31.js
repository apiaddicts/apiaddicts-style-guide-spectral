module.exports = {
  "openapi": "3.1.1",
  "info": {
    "title": "Swagger Petstore",
    "version": "1.0.0"
  },
  "paths": {
    "/invoices": {
      "get": {
        "responses": {
          "200": {
            "description": "Invoices.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": ["string", "null"]
                    },
                    "createdAt": {
                      "type": ["string", "null"],
                      "format": "date-time"
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
