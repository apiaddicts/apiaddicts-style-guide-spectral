module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "servers": [
    { "url": "https://api.example.com/v1" },
    { "url": "https://api.example.com/v2" },
    { "url": "https://api.example.com/v10" },
    { "url": "https://api.example.com/api/v1" },
    { "url": "https://api.example.com/api/v2" },
    { "url": "https://api.example.com/api/v10" },
    { "url": "https://api.example.com/a/v1" },
    { "url": "https://api.example.com/a/b/v2" },
    { "url": "https://api.example.com/a/b/c/v3" },
    { "url": "https://api.example.com/service/api/v1" },
    { "url": "https://api.example.com/service/api/v20" },
    { "url": "https://api.example.com/long/path/structure/v5" },
    { "url": "https://api.example.com/x/y/z/v9" },
    { "url": "https://api.example.com/one/two/three/four/v7" },
    { "url": "https://api.example.com/simple/v1" },
    { "url": "https://api.example.com/deep/nested/path/v12" }
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