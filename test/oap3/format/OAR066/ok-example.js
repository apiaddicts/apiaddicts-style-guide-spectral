module.exports = {
  "openapi": "3.0.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "paths": {
    "/users": {
      "post": {
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "first_name": { "type": "string" },
                  "last_name": { "type": "string" },
                  "home_address": {
                    "type": "object",
                    "properties": {
                      "street_name": { "type": "string" },
                      "zip_code": { "type": "string" }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "user_id": { "type": "string" },
                    "created_at": { "type": "string" },
                    "full_name": { "type": "string" },
                    "home_address": {
                      "type": "object",
                      "properties": {
                        "street_name": { "type": "string" },
                        "postal_code": { "type": "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "get": {
        "responses": {
          "200": {
            "description": "OK",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "user_id": { "type": "string" },
                      "full_name": { "type": "string" }
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