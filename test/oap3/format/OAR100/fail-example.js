module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "servers": [
    { "url": "https://api.example.com/v1.0" },
    { "url": "https://api.example.com/v1-0" },
    { "url": "https://api.example.com/v1,0" },
    { "url": "https://api.example.com/v1beta" },
    { "url": "https://api.example.com/v01.2" },
    { "url": "https://api.example.com/v1/extra" },
    { "url": "https://api.example.com/api/v1.2.3" },
    { "url": "https://api.example.com/api/v1-2" },
    { "url": "https://api.example.com/api/v1,2" },
    { "url": "https://api.example.com/api/v1beta" },
    { "url": "https://api.example.com/api/v" },
    { "url": "https://api.example.com/api/version1" },
    { "url": "https://api.example.com/api/v1alpha" },
    { "url": "https://api.example.com/api/v1.0/extra" },
    { "url": "https://api.example.com/a/b/v1.5" },
    { "url": "https://api.example.com/a/b/v1-5" },
    { "url": "https://api.example.com/a/b/v1,5" },
    { "url": "https://api.example.com/a/b/v1beta" },
    { "url": "https://api.example.com/v1..0" },
    { "url": "https://api.example.com/v1.000" }
  ],
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
                    "amount": {
                      "type": "number",
                      "format": "decimal"
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