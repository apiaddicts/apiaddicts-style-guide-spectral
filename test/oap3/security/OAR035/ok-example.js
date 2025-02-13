module.exports = {
  "swagger": "2.0",
  "info": {
    "version": "1.0.0",
    "title": "Swagger Petstore"
  },
  "securityDefinitions": {
    "ApiKeyAuth": {
      "type": "apiKey",
      "in": "header",
      "name": "X-API-Key"
    },
    "OAuth2": {
      "type": "oauth2",
      "flow": "accessCode",
      "authorizationUrl": "https://example.com/oauth/authorize",
      "tokenUrl": "https://example.com/oauth/token",
      "scopes": {
        "read": "Grants read access",
        "write": "Grants write access"
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
            "type": "string"
          }
        ],
        "security": [
          { "ApiKeyAuth": [] },
          { "OAuth2": ["read", "write"] }
        ],
        "responses": {
          "200": {
            "description": "Ok"
          },
          "401": {
            "description": "Unauthorized"
          }
        }
      }
    }
  }
};
