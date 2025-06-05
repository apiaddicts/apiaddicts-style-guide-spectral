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
            "description": "Invoices.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "date": {
                        "type": "string",
                        "format": "dd/mm/yyyy"
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
