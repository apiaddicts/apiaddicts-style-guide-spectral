module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "host": "petstore.swagger.io",
  "basePath": "/v2",
  "paths": {
    "/users": {
      "post": {
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "required": true,
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
        ],
        "responses": {
          "200": {
            "description": "OK",
            "schema": {
              "type": "object",
              "properties": {
                "user_id": { "type": "string" },
                "created_at": { "type": "string" },
                "full_name": { "type": "string" },
                "home_address": {
                  "type": "object",
                  "properties": {
                    "street_name": { "type": "string" }
                  }
                },
                "_links": { "type": "object" },
                "_embedded": { "type": "object" },
                "@context": { "type": "string" },
                "@type": { "type": "string" },
                "@id": { "type": "string" },
                "x-internal": { "type": "boolean" }
              }
            }
          }
        }
      },
      "get": {
        "parameters": [
          {
            "name": "limit",
            "in": "query",
            "type": "integer"
          }
        ],
        "responses": {
          "200": {
            "description": "OK",
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
};