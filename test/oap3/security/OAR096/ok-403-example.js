module.exports = {
    "openapi": "3.0.0",
    "info": {
      "version": "1.0.0",
      "title": "Swagger Petstore"
    },
    "components": {
      "securitySchemes": {
        "ApiKeyAuth": {
          "type": "apiKey",
          "in": "header",
          "name": "X-API-Key"
        },
        "OAuth2": {
          "type": "oauth2",
          "flows": {
            "authorizationCode": {
              "authorizationUrl": "https://example.com/oauth/authorize",
              "tokenUrl": "https://example.com/oauth/token",
              "scopes": {
                "read": "Grants read access",
                "write": "Grants write access",
                "admin": "Grants access to admin operations"
              }
            }
          }
        }
      }
    },
    "paths": {
      "/with-auth-and-header": {
        "get": {
          "parameters": [
            {
              "in": "header",
              "name": "x-api-key",
              "schema": {
                "type": "string"
              }
            }
          ],
          "security": [
            { "ApiKeyAuth": [] },
            { "OAuth2": [ "read", "write" ] }
          ],
          "responses": {
            "200": {
              "description": "Ok"
            },
            "403": {
              "description": "Forbidden"
            },
            "429": {
              "description": "Too Many Requests"
            }
          }
        }
      }
    }
  };
  