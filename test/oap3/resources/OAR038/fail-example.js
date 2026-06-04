module.exports = {
  "openapi": "3.0.0",
  "info": { "version": "1.0.0", "title": "Swagger Petstore" },
  "paths": {
    "/items": {
      "post": {
        "requestBody": {
          "content": {
            "application/json": { "schema": { "type": "object" } }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "result": { "type": "object" },
                    "database": { "type": "object" }
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
